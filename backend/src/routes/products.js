const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, vendorAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const where = { isActive: true, isApproved: true };

    if (category) where.categoryId = category;
    if (search) where.name = { contains: search };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'popular') orderBy = { reviews: { _count: 'desc' } };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: parseInt(limit),
        include: {
          category: true,
          vendor: { select: { id: true, businessName: true, rating: true, rank: true, sellerStatus: true, logo: true, completionRate: true, responseTime: true, totalOrders: true, reviewCount: true, isFeatured: true } },
          variants: { where: { isActive: true } },
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true, orderItems: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    const productsWithRating = products.map(p => ({
      ...p,
      avgRating: p.reviews.length ? p.reviews.reduce((a, r) => a + r.rating, 0) / p.reviews.length : 0,
      salesCount: p._count.orderItems,
    }));

    res.json({ products: productsWithRating, total, pages: Math.ceil(total / limit), currentPage: parseInt(page) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        vendor: { select: { id: true, businessName: true, logo: true, rating: true, totalSales: true, totalOrders: true, isFeatured: true, rank: true, sellerStatus: true, completionRate: true, responseTime: true, reviewCount: true, insuranceEnabled: true, description: true } },
        variants: { where: { isActive: true } },
        reviews: {
          include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true, orderItems: true } },
      },
    });

    if (!product) return res.status(404).json({ error: 'Product not found' });

    const avgRating = product.reviews.length
      ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length
      : 0;

    // Related products
    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, isActive: true },
      take: 6,
      include: { variants: { where: { isActive: true } }, reviews: { select: { rating: true } } },
    });

    res.json({ product: { ...product, avgRating }, related });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product (vendor or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    // If vendor, check ownership
    if (req.user.role === 'VENDOR') {
      const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
      if (!vendor || product.vendorId !== vendor.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }
    if (req.user.role === 'CUSTOMER') return res.status(403).json({ error: 'Not authorized' });

    const updated = await prisma.product.update({
      where: { id: product.id },
      data: req.body,
    });
    res.json({ product: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product (vendor or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (req.user.role === 'VENDOR') {
      const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
      if (!vendor || product.vendorId !== vendor.id) {
        return res.status(403).json({ error: 'Not authorized' });
      }
    }
    if (req.user.role === 'CUSTOMER') return res.status(403).json({ error: 'Not authorized' });
    await prisma.product.delete({ where: { id: product.id } });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
