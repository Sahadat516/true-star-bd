const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const auth = (roles) => async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    if (!user) return res.status(401).json({ error: 'User not found' })
    if (roles && !roles.includes(user.role)) return res.status(403).json({ error: 'Forbidden' })
    req.user = user
    next()
  } catch (e) { res.status(401).json({ error: 'Unauthorized' }) }
}

const getPayoutFee = (amount) => {
  if (amount <= 0) return 0
  if (amount <= 1000) return amount * 0.02
  if (amount <= 5000) return amount * 0.015
  if (amount <= 20000) return amount * 0.01
  return amount * 0.005
}

router.get('/vendor/stats', auth(['VENDOR', 'ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
      include: { payoutRequests: { orderBy: { createdAt: 'desc' } } }
    })
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' })
    const totalEarnings = vendor.totalEarnings
    const pendingBalance = vendor.pendingBalance
    const totalWithdrawn = vendor.payoutRequests
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.netAmount, 0)
    const pendingWithdrawals = vendor.payoutRequests
      .filter(p => p.status === 'PENDING' || p.status === 'APPROVED')
      .reduce((sum, p) => sum + p.netAmount, 0)
    res.json({ totalEarnings, pendingBalance, totalWithdrawn, pendingWithdrawals, availableBalance: pendingBalance - pendingWithdrawals })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.get('/vendor', auth(['VENDOR', 'ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } })
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' })
    const payouts = await prisma.payoutRequest.findMany({
      where: { vendorId: vendor.id },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ payouts })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.post('/request', auth(['VENDOR', 'ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { amount, paymentMethod, accountDetails } = req.body
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' })
    if (!paymentMethod) return res.status(400).json({ error: 'Payment method required' })
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } })
    if (!vendor) return res.status(404).json({ error: 'Vendor not found' })
    if (vendor.pendingBalance < amount) return res.status(400).json({ error: 'Insufficient balance' })
    const fee = getPayoutFee(amount)
    const netAmount = amount - fee
    const payout = await prisma.payoutRequest.create({
      data: { vendorId: vendor.id, amount, fee, netAmount, paymentMethod, accountDetails: accountDetails ? JSON.stringify(accountDetails) : null }
    })
    res.json({ payout })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.get('/admin', auth(['ADMIN', 'SUPER_ADMIN', 'STAFF']), async (req, res) => {
  try {
    const { status } = req.query
    const where = status ? { status } : {}
    const payouts = await prisma.payoutRequest.findMany({
      where, orderBy: { createdAt: 'desc' },
      include: { vendor: { include: { user: { select: { firstName: true, lastName: true, email: true } } } } }
    })
    res.json({ payouts })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.patch('/admin/:id/approve', auth(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { id } = req.params
    const { notes } = req.body
    const payout = await prisma.payoutRequest.update({
      where: { id }, data: { status: 'APPROVED', notes, processedBy: req.user.id, processedAt: new Date() }
    })
    res.json({ payout })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.patch('/admin/:id/reject', auth(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { id } = req.params
    const { rejectionReason } = req.body
    if (!rejectionReason) return res.status(400).json({ error: 'Rejection reason required' })
    const payout = await prisma.payoutRequest.findUnique({ where: { id } })
    if (!payout) return res.status(404).json({ error: 'Payout not found' })
    await prisma.payoutRequest.update({
      where: { id }, data: { status: 'REJECTED', rejectionReason, processedBy: req.user.id, processedAt: new Date() }
    })
    // Reduce pending balance back? Actually, pending balance was reduced on request, restore it
    await prisma.vendor.update({
      where: { id: payout.vendorId },
      data: { pendingBalance: { increment: payout.amount } }
    })
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.patch('/admin/:id/complete', auth(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const { id } = req.params
    const { transactionId } = req.body
    const payout = await prisma.payoutRequest.findUnique({ where: { id } })
    if (!payout) return res.status(404).json({ error: 'Payout not found' })
    await prisma.payoutRequest.update({
      where: { id }, data: { status: 'COMPLETED', processedBy: req.user.id, processedAt: new Date(), notes: transactionId ? `TX: ${transactionId}` : undefined }
    })
    // Deduct from pendingBalance
    await prisma.vendor.update({
      where: { id: payout.vendorId },
      data: { pendingBalance: { decrement: payout.amount }, totalEarnings: { decrement: 0 } }
    })
    // Update vendor totalEarnings to reflect actual net payout reduction
    // Actually totalEarnings should stay the same as history. Only pendingBalance changes.
    res.json({ success: true })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

// Auto-settlement creation (admin only)
router.post('/admin/settle', auth(['ADMIN', 'SUPER_ADMIN']), async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({ where: { pendingBalance: { gt: 0 } } })
    const settlements = []
    for (const vendor of vendors) {
      const commission = vendor.pendingBalance * (vendor.commission / 100)
      const netAmount = vendor.pendingBalance - commission
      const settlement = await prisma.settlement.create({
        data: {
          vendorId: vendor.id,
          amount: vendor.pendingBalance,
          commission,
          netAmount,
          periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          periodEnd: new Date()
        }
      })
      // Create a payout request automatically
      await prisma.payoutRequest.create({
        data: {
          vendorId: vendor.id,
          amount: vendor.pendingBalance,
          fee: commission,
          netAmount,
          paymentMethod: 'Auto Settlement',
          status: 'COMPLETED'
        }
      })
      await prisma.vendor.update({
        where: { id: vendor.id },
        data: { pendingBalance: 0 }
      })
      settlements.push(settlement)
    }
    res.json({ message: `${settlements.length} vendors settled`, settlements })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

router.get('/admin/settlements', auth(['ADMIN', 'SUPER_ADMIN', 'STAFF']), async (req, res) => {
  try {
    const settlements = await prisma.settlement.findMany({
      orderBy: { createdAt: 'desc' },
      include: { vendor: { include: { user: { select: { firstName: true, lastName: true, email: true } } } } }
    })
    res.json({ settlements })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

module.exports = router
