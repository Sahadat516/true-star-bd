const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, adminAuth } = require('../middleware/auth');
const { getFraudAlerts, resolveAlert } = require('../services/fraudDetection');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/alerts', adminAuth, async (req, res) => {
  try {
    const alerts = await getFraudAlerts(parseInt(req.query.limit) || 50);
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/alerts/:id/resolve', adminAuth, async (req, res) => {
  try {
    const alert = await resolveAlert(req.params.id, req.body.status || 'RESOLVED');
    res.json({ alert });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalAlerts, highRisk, lowRisk, recentAlerts] = await Promise.all([
      prisma.fraudAlert.count(),
      prisma.fraudAlert.count({ where: { risk: 'high', status: 'FLAGGED' } }),
      prisma.fraudAlert.count({ where: { risk: 'low', status: 'WARNING' } }),
      prisma.fraudAlert.count({ where: { createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }),
    ]);
    res.json({ stats: { totalAlerts, highRisk, lowRisk, recentAlerts } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
