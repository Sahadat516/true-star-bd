const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Create review
router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Check if user purchased this product
    const orderItem = await prisma.orderItem.findFirst({
      where: { productId, order: { userId: req.user.id, status: 'COMPLETED' } },
    });

    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user.id,
        rating,
        title,
        comment,
        isVerifiedPurchase: !!orderItem,
      },
      include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
    });
    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get product reviews
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: req.params.productId, isApproved: true },
      include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
