const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get user/vendor disputes
router.get('/', auth, async (req, res) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
    const disputes = await prisma.dispute.findMany({
      where: {
        OR: [
          { userId: req.user.id },
          ...(vendor ? [{ vendorId: vendor.id }] : []),
        ],
      },
      include: {
        order: { select: { orderNumber: true, status: true, total: true } },
        user: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ disputes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: get all disputes
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const disputes = await prisma.dispute.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        order: {
          select: { orderNumber: true, total: true, status: true, createdAt: true },
        },
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      },
    });
    res.json({ disputes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: update dispute status (OPEN -> INVESTIGATING)
router.patch('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['INVESTIGATING', 'RESOLVED', 'DISMISSED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const dispute = await prisma.dispute.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json({ dispute });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: resolve dispute — refund buyer or release funds to seller
router.post('/:id/resolve', adminAuth, async (req, res) => {
  try {
    const { decision, resolution } = req.body; // decision: 'REFUND' or 'RELEASE'
    if (!['REFUND', 'RELEASE'].includes(decision)) {
      return res.status(400).json({ error: 'Decision must be REFUND or RELEASE' });
    }

    const dispute = await prisma.dispute.findUnique({
      where: { id: req.params.id },
      include: { order: { include: { items: true } } },
    });
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
    if (dispute.status === 'RESOLVED' || dispute.status === 'DISMISSED') {
      return res.status(400).json({ error: 'Dispute already resolved' });
    }

    if (decision === 'REFUND') {
      await prisma.order.update({
        where: { id: dispute.orderId },
        data: { status: 'REFUNDED', resolvedAt: new Date() },
      });
    } else {
      await prisma.order.update({
        where: { id: dispute.orderId },
        data: { status: 'COMPLETED', resolvedAt: new Date() },
      });
    }

    const updated = await prisma.dispute.update({
      where: { id: req.params.id },
      data: {
        status: 'RESOLVED',
        resolution: resolution || (decision === 'REFUND' ? 'Refunded to buyer' : 'Released to seller'),
        resolvedBy: req.user.id,
        resolvedAt: new Date(),
      },
    });

    res.json({ dispute: updated, decision });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: get chat logs for the disputed order
router.get('/:id/chat-logs', adminAuth, async (req, res) => {
  try {
    const dispute = await prisma.dispute.findUnique({ where: { id: req.params.id } });
    if (!dispute) return res.status(404).json({ error: 'Dispute not found' });

    const order = await prisma.order.findUnique({
      where: { id: dispute.orderId },
      include: { user: { select: { id: true, firstName: true, lastName: true } } },
    });

    const vendor = await prisma.vendor.findUnique({ where: { id: dispute.vendorId } });

    // Fetch chat messages between buyer and seller for this order
    const messages = await prisma.chatMessage.findMany({
      where: {
        OR: [
          { senderId: order.userId, receiverId: vendor?.userId },
          { senderId: vendor?.userId, receiverId: order.userId },
        ],
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
      orderBy: { createdAt: 'asc' },
      take: 200,
    });

    res.json({
      order: { orderNumber: order.orderNumber, total: order.total, status: order.status },
      buyer: order.user,
      vendor: vendor ? { id: vendor.id, businessName: vendor.businessName } : null,
      messages,
      dispute: { reason: dispute.reason, message: dispute.message, createdAt: dispute.createdAt },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
