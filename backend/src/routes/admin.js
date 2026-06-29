const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { adminAuth, staffAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [totalUsers, totalVendors, totalOrders, totalProducts, totalRevenue, recentOrders] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'VENDOR' } }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { firstName: true, email: true } } } }),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalVendors,
        totalOrders,
        totalProducts,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingVendors: await prisma.vendor.count({ where: { isApproved: false } }),
        pendingProducts: await prisma.product.count({ where: { isApproved: false } }),
      },
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User management
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (role) where.role = role;
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where, skip: (page - 1) * limit, take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, firstName: true, lastName: true, role: true, status: true, createdAt: true, emailVerified: true },
      }),
      prisma.user.count({ where }),
    ]);
    res.json({ users, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user status (suspend/ban/activate)
router.patch('/users/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const user = await prisma.user.update({ where: { id: req.params.id }, data: { status } });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vendor approvals
router.get('/vendors/pending', adminAuth, async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { isApproved: false },
      include: { user: { select: { email: true, firstName: true, createdAt: true } } },
    });
    res.json({ vendors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/vendors/:id/approve', adminAuth, async (req, res) => {
  try {
    const vendor = await prisma.vendor.update({
      where: { id: req.params.id },
      data: { isApproved: true },
    });
    await prisma.user.update({ where: { id: vendor.userId }, data: { role: 'VENDOR' } });
    res.json({ vendor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Product approvals
router.get('/products/pending', adminAuth, async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isApproved: false },
      include: { vendor: { select: { businessName: true } } },
    });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/products/:id/approve', adminAuth, async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { isApproved: true },
    });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sales report
router.get('/reports/sales', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const where = {};
    if (startDate) where.createdAt = { gte: new Date(startDate) };
    if (endDate) where.createdAt = { ...where.createdAt, lte: new Date(endDate) };

    const orders = await prisma.order.findMany({
      where: { ...where, status: 'COMPLETED' },
      include: { items: true },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const totalVat = orders.reduce((sum, o) => sum + o.vat, 0);
    const totalServiceCharge = orders.reduce((sum, o) => sum + o.serviceCharge, 0);
    const totalOrders = orders.length;

    res.json({
      report: { totalRevenue, totalVat, totalServiceCharge, totalOrders, netRevenue: totalRevenue - totalVat - totalServiceCharge },
      orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// System settings
router.get('/settings', adminAuth, async (req, res) => {
  res.json({
    vatPercentage: process.env.VAT_PERCENTAGE || 5,
    serviceChargePercentage: process.env.SERVICE_CHARGE_PERCENTAGE || 10,
    settlementDays: process.env.SETTLEMENT_DAYS || 15,
  });
});

// All orders (admin)
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where, skip: (page - 1) * limit, take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { firstName: true, email: true } }, items: true, disputes: { select: { id: true, status: true, reason: true } } },
      }),
      prisma.order.count({ where }),
    ]);
    res.json({ orders, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// All disputes
router.get('/disputes', adminAuth, async (req, res) => {
  try {
    const disputes = await prisma.dispute.findMany({
      orderBy: { createdAt: 'desc' },
      include: { order: { select: { orderNumber: true, total: true, status: true } } },
    });
    res.json({ disputes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI monitor data
router.get('/monitor', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [todayOrders, weekOrders, todayUsers, fraudLogs, totalRevenue] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.fraudLog?.count ? prisma.fraudLog.count({ where: { createdAt: { gte: today } } }) : Promise.resolve(0),
      prisma.order.aggregate({ where: { status: 'COMPLETED' }, _sum: { total: true } }),
    ]);

    res.json({
      stats: { todayOrders, weekOrders, todayUsers, fraudLogs, totalRevenue: totalRevenue._sum.total || 0 },
      recentActivity: [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
