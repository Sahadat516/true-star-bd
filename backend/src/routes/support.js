const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Create support ticket
router.post('/', auth, async (req, res) => {
  try {
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: req.user.id,
        subject: req.body.subject,
        description: req.body.description,
        priority: req.body.priority || 'normal',
      },
    });
    res.status(201).json({ ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user tickets
router.get('/', auth, async (req, res) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tickets (admin/staff)
router.get('/all', auth, async (req, res) => {
  try {
    if (!['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    const tickets = await prisma.supportTicket.findMany({
      include: { user: { select: { firstName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
