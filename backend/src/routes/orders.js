const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, paymentGateway, deliveryEmail, notes } = req.body;

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });
      if (!product) return res.status(404).json({ error: `Product ${item.productId} not found` });

      let price = product.price;
      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (variant) price = variant.salePrice || variant.price;
      } else {
        price = product.salePrice || product.price;
      }

      subtotal += price * (item.quantity || 1);
      orderItems.push({
        productId: product.id,
        variantId: item.variantId || null,
        productName: product.name,
        quantity: item.quantity || 1,
        price,
        total: price * (item.quantity || 1),
        vendorEarnings: price * (item.quantity || 1) * (1 - (product.vendor?.commission || 10) / 100),
      });
    }

    const vatPercentage = parseFloat(process.env.VAT_PERCENTAGE || 5);
    const servicePercentage = parseFloat(process.env.SERVICE_CHARGE_PERCENTAGE || 10);
    const vat = (subtotal * vatPercentage) / 100;
    const serviceCharge = (subtotal * servicePercentage) / 100;
    const total = subtotal + vat + serviceCharge;

    // Get vendor IDs from products
    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true, vendorId: true } });

    // Generate order number
    const orderNumber = `TSB-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: req.user.id,
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

    res.status(201).json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user orders (alias for /my-orders)
router.get('/', auth, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: { select: { id: true, name: true, slug: true, image: true, price: true } } } } },
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
      include: { items: { include: { product: { select: { id: true, name: true, slug: true, image: true, price: true } } } } },
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
      include: { items: { include: { product: true } } },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.id && !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
