const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, vendorAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get vendor dashboard
router.get('/dashboard', vendorAuth, async (req, res) => {
  try {
    const vendor = req.vendor;
    const [totalProducts, totalOrders, recentOrders, earnings] = await Promise.all([
      prisma.product.count({ where: { vendorId: vendor.id } }),
      prisma.order.count({ where: { vendorId: vendor.id } }),
      prisma.order.findMany({
        where: { vendorId: vendor.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      prisma.settlement.findMany({
        where: { vendorId: vendor.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    res.json({
      vendor,
      stats: { totalProducts, totalOrders, totalEarnings: vendor.totalEarnings, pendingBalance: vendor.pendingBalance },
      recentOrders,
      earnings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vendor products CRUD
router.get('/products', vendorAuth, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { vendorId: req.vendor.id },
      include: { variants: true, category: true, _count: { select: { reviews: true, orderItems: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/products', vendorAuth, async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: {
        ...req.body,
        slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now(),
        vendorId: req.vendor.id,
      },
    });
    res.status(201).json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor settlements
router.get('/settlements', vendorAuth, async (req, res) => {
  try {
    const settlements = await prisma.settlement.findMany({
      where: { vendorId: req.vendor.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ settlements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
