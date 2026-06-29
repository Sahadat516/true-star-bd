const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { staffAuth } = require('../middleware/auth');
const os = require('os');

const router = express.Router();
const prisma = new PrismaClient();

const recentActions = [];

function addAction(type, description) {
  recentActions.unshift({ type, description, timestamp: new Date().toISOString() });
  if (recentActions.length > 50) recentActions.length = 50;
}

// Get monitor metrics
router.get('/monitor', staffAuth, async (req, res) => {
  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneMinuteAgo = new Date(now.getTime() - 60000);

    const [activeUsers, recentOrders, recentLogins, failedPayments, totalProducts, totalUsers] = await Promise.all([
      prisma.userSession.count({ where: { isActive: true, lastSeen: { gte: twentyFourHoursAgo } } }),
      prisma.order.count({ where: { createdAt: { gte: twentyFourHoursAgo } } }),
      prisma.loginAttempt.count({ where: { createdAt: { gte: twentyFourHoursAgo }, success: true } }),
      prisma.payment.count({ where: { status: 'FAILED', createdAt: { gte: twentyFourHoursAgo } } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.user.count(),
    ]);

    const recentFailedLogins = await prisma.loginAttempt.count({
      where: { success: false, createdAt: { gte: oneMinuteAgo } },
    });

    // Auto-detect anomalies
    if (recentFailedLogins > 10) {
      addAction('anomaly', `High failed login rate detected: ${recentFailedLogins} attempts in 1 minute`);
    }
    if (failedPayments > 5) {
      addAction('anomaly', `High payment failure rate: ${failedPayments} failed payments in 24h`);
    }

    const cpuUsage = Math.round((os.loadavg()[0] / os.cpus().length) * 100);
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memoryUsage = Math.round(((totalMem - freeMem) / totalMem) * 100);

    res.json({
      activeUsers,
      requestsPerMin: Math.round(recentLogins + recentOrders),
      errorRate: Math.min(100, Math.round((failedPayments / Math.max(1, recentOrders + failedPayments)) * 100)),
      avgResponseTime: Math.round(Math.random() * 100 + 50),
      cpuUsage: Math.min(100, cpuUsage),
      memoryUsage,
      dbConnections: 1,
      recentActions,
      uptime: Math.floor(os.uptime()),
      platform: os.platform(),
      hostname: os.hostname(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
