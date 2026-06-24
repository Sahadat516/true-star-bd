const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { adminAuth, vendorAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Admin sales report
router.get('/sales', adminAuth, async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case 'daily': startDate = new Date(now.setDate(now.getDate() - 30)); break;
      case 'monthly': startDate = new Date(now.setMonth(now.getMonth() - 12)); break;
      case 'yearly': startDate = new Date(now.setFullYear(now.getFullYear() - 5)); break;
      default: startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    const orders = await prisma.order.findMany({
      where: { createdAt: { gte: startDate }, status: 'COMPLETED' },
    });

    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const totalVat = orders.reduce((s, o) => s + o.vat, 0);
    const totalServiceCharge = orders.reduce((s, o) => s + o.serviceCharge, 0);

    res.json({
      report: {
        period,
        totalOrders: orders.length,
        totalRevenue,
        totalVat,
        totalServiceCharge,
        netRevenue: totalRevenue - totalVat - totalServiceCharge,
        averageOrderValue: orders.length ? totalRevenue / orders.length : 0,
      },
      orders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vendor earnings report
router.get('/earnings', vendorAuth, async (req, res) => {
  try {
    const settlements = await prisma.settlement.findMany({
      where: { vendorId: req.vendor.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({
      totalPaid: settlements.filter(s => s.status === 'COMPLETED').reduce((a, s) => a + s.netAmount, 0),
      pending: settlements.filter(s => s.status === 'PENDING').reduce((a, s) => a + s.netAmount, 0),
      settlements,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
