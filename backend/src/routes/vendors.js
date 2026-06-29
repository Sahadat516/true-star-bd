const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, vendorAuth } = require('../middleware/auth');
const { getStorePage, updateSellerRank, updateVendorStats, updateSellerStatus, getCommission, RANK_ORDER } = require('../services/sellerRank');

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

// Get vendor store page (public)
router.get('/:id/store', async (req, res) => {
  try {
    const store = await getStorePage(req.params.id);
    if (!store) return res.status(404).json({ error: 'Vendor not found' });
    res.json({ store });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update seller online status
router.patch('/status', vendorAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['ONLINE', 'OFFLINE', 'AWAY', 'BUSY'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const vendor = await updateSellerStatus(req.vendor.id, status);
    res.json({ status: vendor.sellerStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get vendor rank & commission info
router.get('/rank', vendorAuth, async (req, res) => {
  try {
    const result = await updateSellerRank(req.vendor.id);
    const vendor = await prisma.vendor.findUnique({
      where: { id: req.vendor.id },
      include: { products: { include: { category: true } } },
    });
    const rankIndex = RANK_ORDER.indexOf(result.rank);
    const nextRank = rankIndex < RANK_ORDER.length - 1 ? RANK_ORDER[rankIndex + 1] : null;
    res.json({ ...result, nextRank, totalOrders: vendor.totalOrders, rating: vendor.rating, completionRate: vendor.completionRate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get seller leaderboard (top ranked vendors)
router.get('/leaderboard', async (req, res) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { isApproved: true, isFeatured: true },
      orderBy: [{ rank: 'desc' }, { rating: 'desc' }, { totalOrders: 'desc' }],
      take: 20,
      select: {
        id: true, businessName: true, logo: true, rating: true, rank: true,
        totalOrders: true, completionRate: true, responseTime: true, reviewCount: true,
      },
    });
    res.json({ vendors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recalculate vendor stats (triggered after order completes)
router.post('/recalc-stats', vendorAuth, async (req, res) => {
  try {
    const stats = await updateVendorStats(req.vendor.id);
    const rank = await updateSellerRank(req.vendor.id);
    res.json({ stats, rank });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
