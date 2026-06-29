const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { adminAuth, staffAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all active sessions with user info
router.get('/devices', staffAuth, async (req, res) => {
  try {
    const { email } = req.query;
    const where = { isActive: true };
    if (email) {
      const user = await prisma.user.findFirst({ where: { email: { contains: email } } });
      if (user) where.userId = user.id;
      else return res.json({ sessions: [] });
    }
    const sessions = await prisma.userSession.findMany({
      where,
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      orderBy: { lastSeen: 'desc' },
      take: 100,
    });
    res.json({ sessions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Force logout a session
router.patch('/devices/:id/logout', staffAuth, async (req, res) => {
  try {
    await prisma.userSession.update({
      where: { id: req.params.id },
      data: { isActive: false },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
