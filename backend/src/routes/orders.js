const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, vendorAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();
const { createNotification, notifyOrderPlaced, notifyOrderStatus } = require('../services/notification');
const { sendEmail, orderPlacedEmail, orderStatusEmail } = require('../services/email');

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, paymentGateway, deliveryEmail, notes } = req.body;

    let subtotal = 0;
    const orderItems = [];
    let firstVendorId = null;

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true, vendor: { select: { id: true, commission: true } } },
      });
      if (!product) return res.status(404).json({ error: `Product ${item.productId} not found` });

      let price = product.price;
      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (variant) price = variant.salePrice || variant.price;
      } else {
        price = product.salePrice || product.price;
      }

      if (!firstVendorId) firstVendorId = product.vendor?.id;

      subtotal += price * (item.quantity || 1);
      orderItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        productName: product.name,
        quantity: item.quantity || 1,
        price,
        total: price * (item.quantity || 1),
        vendorEarnings: price * (item.quantity || 1) * (1 - (product.vendor?.commission || 10) / 100),
        vendorId: product.vendor?.id || null,
      });
    }

    const vatPercentage = parseFloat(process.env.VAT_PERCENTAGE || 5);
    const servicePercentage = parseFloat(process.env.SERVICE_CHARGE_PERCENTAGE || 10);
    const vat = (subtotal * vatPercentage) / 100;
    const serviceCharge = (subtotal * servicePercentage) / 100;
    const total = subtotal + vat + serviceCharge;

    const orderNumber = `TSB-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user.id,
        vendorId: firstVendorId,
        subtotal,
        vat,
        serviceCharge,
        total,
        deliveryEmail: deliveryEmail || req.user.email,
        notes,
        paymentGateway: paymentGateway ? paymentGateway.toUpperCase() : undefined,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    const io = req.app.get('io');
    notifyOrderPlaced({ io, order, vendorId: firstVendorId, buyer: req.user });

    // Send email to vendor
    if (order.vendorId) {
      const vendor = await prisma.vendor.findUnique({
        where: { id: order.vendorId },
        include: { user: { select: { email: true, firstName: true } } },
      });
      if (vendor) {
        const emailData = orderPlacedEmail({ user: vendor.user, vendor, order });
        sendEmail({ to: vendor.user.email, ...emailData });
      }
    }

    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: { select: { id: true, name: true, slug: true, image: true, price: true } } } },
        disputes: { select: { id: true, status: true, reason: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user orders (legacy)
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: { select: { id: true, name: true, slug: true, image: true, price: true } } } },
        disputes: { select: { id: true, status: true, reason: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor orders
router.get('/vendor', vendorAuth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { vendorId: req.vendor.id },
      include: {
        items: { where: { vendorId: req.vendor.id } },
        user: { select: { firstName: true, lastName: true, email: true } },
        disputes: { select: { id: true, status: true, reason: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: { include: { product: true } },
        disputes: true,
      },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.id && !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(req.user.role)) {
      const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
      if (!vendor || order.vendorId !== vendor.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel order
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });
    if (!['UNPAID', 'PREPARING'].includes(order.status)) return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED', cancellationReason: reason || 'Cancelled by buyer' },
    });

    const io = req.app.get('io');
    notifyOrderStatus({ io, order: updated, buyerId: order.userId, vendorId: order.vendorId, oldStatus: order.status, newStatus: 'CANCELLED' });
    const buyer = await prisma.user.findUnique({ where: { id: order.userId }, select: { email: true, firstName: true } });
    if (buyer) {
      const emailData = orderStatusEmail({ user: buyer, order: updated, oldStatus: order.status, newStatus: 'CANCELLED' });
      sendEmail({ to: buyer.email, ...emailData });
    }

    res.json({ order: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vendor updates order status (PREPARING -> DELIVERING)
router.patch('/vendor/:id/status', vendorAuth, async (req, res) => {
  try {
    const { status, deliveryCode } = req.body;
    const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.vendorId !== req.vendor.id) return res.status(403).json({ error: 'Not your order' });

    const validTransitions = { PREPARING: 'DELIVERING', DELIVERING: 'COMPLETED' };
    if (!validTransitions[order.status] || validTransitions[order.status] !== status) {
      return res.status(400).json({ error: `Cannot transition from ${order.status} to ${status}` });
    }

    const updateData = { status };
    if (status === 'DELIVERING' && deliveryCode) updateData.deliveryCode = deliveryCode;

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: {
        ...updateData,
        ...(status === 'DELIVERING' ? { deliveredAt: new Date() } : {}),
        ...(status === 'COMPLETED' ? { resolvedAt: new Date() } : {}),
      },
      include: { items: true },
    });

    // Update vendor stats + credit wallet on completion
    if (status === 'COMPLETED') {
      const { updateVendorStats, updateSellerRank } = require('../services/sellerRank');
      await updateVendorStats(req.vendor.id);
      await updateSellerRank(req.vendor.id);
      const earnings = updated.items.reduce((s, i) => s + (i.vendorEarnings || 0), 0);
      await prisma.vendor.update({
        where: { id: req.vendor.id },
        data: { pendingBalance: { increment: earnings }, totalEarnings: { increment: earnings } },
      });
    }

    const io = req.app.get('io');
    notifyOrderStatus({ io, order: updated, buyerId: order.userId, vendorId: order.vendorId, oldStatus: order.status, newStatus: status });
    const buyer = await prisma.user.findUnique({ where: { id: order.userId }, select: { email: true, firstName: true } });
    if (buyer) {
      const emailData = orderStatusEmail({ user: buyer, order: updated, oldStatus: order.status, newStatus: status });
      sendEmail({ to: buyer.email, ...emailData });
    }

    res.json({ order: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buyer confirms receipt (DELIVERING -> COMPLETED)
router.patch('/:id/confirm-receipt', auth, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });
    if (order.status !== 'DELIVERING') return res.status(400).json({ error: 'Order is not in delivering status' });

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status: 'COMPLETED', resolvedAt: new Date() },
    });

    // Update vendor stats + credit wallet
    if (order.vendorId) {
      const { updateVendorStats, updateSellerRank } = require('../services/sellerRank');
      await updateVendorStats(order.vendorId);
      await updateSellerRank(order.vendorId);
      const earnings = updated.items.reduce((s, i) => s + (i.vendorEarnings || 0), 0);
      await prisma.vendor.update({
        where: { id: order.vendorId },
        data: { pendingBalance: { increment: earnings }, totalEarnings: { increment: earnings } },
      });
    }

    const io = req.app.get('io');
    notifyOrderStatus({ io, order: updated, buyerId: order.userId, vendorId: order.vendorId, oldStatus: order.status, newStatus: 'COMPLETED' });

    res.json({ order: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create dispute
router.post('/:id/dispute', auth, async (req, res) => {
  try {
    const { reason, message } = req.body;
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });
    if (!['DELIVERING', 'COMPLETED'].includes(order.status)) return res.status(400).json({ error: 'Cannot dispute this order at its current status' });

    const existingDispute = await prisma.dispute.findFirst({ where: { orderId: req.params.id, status: { in: ['OPEN', 'INVESTIGATING'] } } });
    if (existingDispute) return res.status(400).json({ error: 'An active dispute already exists for this order' });

    // Freeze escrow by setting order to DISPUTED
    await prisma.order.update({ where: { id: req.params.id }, data: { status: 'DISPUTED' } });

    const dispute = await prisma.dispute.create({
      data: { orderId: req.params.id, userId: req.user.id, vendorId: order.vendorId, reason, message },
    });

    const io = req.app.get('io');
    createNotification({ userId: order.vendorId, title: 'Dispute Filed', message: `A dispute has been filed on order #${order.orderNumber}: ${reason}`, type: 'dispute', link: '/admin', io });

    res.status(201).json({ dispute });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
