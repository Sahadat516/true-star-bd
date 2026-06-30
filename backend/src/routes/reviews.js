const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Recalculate vendor's average rating and review count
async function updateVendorRating(vendorId) {
  const result = await prisma.review.aggregate({
    where: { vendorId, isApproved: true },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.vendor.update({
    where: { id: vendorId },
    data: {
      rating: result._avg.rating || 0,
      reviewCount: result._count,
    },
  });
}

// Create review
router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Check if user already reviewed this product
    const existing = await prisma.review.findFirst({
      where: { productId, userId: req.user.id },
    });
    if (existing) return res.status(400).json({ error: 'You already reviewed this product' });

    // Get product with vendor info
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { vendorId: true },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Check if user purchased this product
    const orderItem = await prisma.orderItem.findFirst({
      where: { productId, order: { userId: req.user.id, status: 'COMPLETED' } },
    });

    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user.id,
        vendorId: product.vendorId,
        rating: Math.max(1, Math.min(5, parseInt(rating) || 5)),
        title,
        comment,
        isVerifiedPurchase: !!orderItem,
      },
      include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
    });

    // Update vendor's average rating
    await updateVendorRating(product.vendorId);

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

// Get seller reviews
router.get('/seller/:vendorId', async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { vendorId: req.params.vendorId, isApproved: true },
      include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const avg = await prisma.review.aggregate({
      where: { vendorId: req.params.vendorId, isApproved: true },
      _avg: { rating: true },
      _count: true,
    });

    res.json({ reviews, avgRating: avg._avg.rating || 0, totalReviews: avg._count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leave review for an order item (after order completed)
router.post('/order/:orderId', auth, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    if (!productId || !rating) return res.status(400).json({ error: 'productId and rating required' });

    const order = await prisma.order.findUnique({ where: { id: req.params.orderId } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId !== req.user.id) return res.status(403).json({ error: 'Access denied' });
    if (order.status !== 'COMPLETED') return res.status(400).json({ error: 'Order not completed yet' });

    // Check the product is in this order
    const orderItem = await prisma.orderItem.findFirst({
      where: { orderId: req.params.orderId, productId },
    });
    if (!orderItem) return res.status(400).json({ error: 'Product not in this order' });

    // Check existing review
    const existing = await prisma.review.findFirst({
      where: { productId, userId: req.user.id },
    });
    if (existing) return res.status(400).json({ error: 'You already reviewed this product' });

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { vendorId: true },
    });

    const review = await prisma.review.create({
      data: {
        productId,
        userId: req.user.id,
        vendorId: product.vendorId,
        rating: Math.max(1, Math.min(5, parseInt(rating) || 5)),
        title,
        comment,
        isVerifiedPurchase: true,
      },
      include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
    });

    await updateVendorRating(product.vendorId);

    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
