const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, rating, rank, deliveryType, sort, page = 1, limit = 20 } = req.query;
    const where = { isActive: true, isApproved: true };

    if (q) {
      where.OR = [
        { name: { contains: q } },
        { description: { contains: q } },
        { tags: { contains: q } },
        { shortDescription: { contains: q } },
      ];
    }

    if (category) where.categoryId = category;
    if (deliveryType) where.deliveryType = deliveryType;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (rank) {
      where.vendor = { rank };
    }

    let orderBy = {};
    switch (sort) {
      case 'price_asc': orderBy = { price: 'asc' }; break;
      case 'price_desc': orderBy = { price: 'desc' }; break;
      case 'popular': orderBy = { reviews: { _count: 'desc' } }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
      case 'rating': orderBy = { vendor: { rating: 'desc' } }; break;
      default: orderBy = { createdAt: 'desc' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: parseInt(limit),
        include: {
          category: { select: { id: true, name: true, slug: true } },
          vendor: {
            select: {
              id: true, businessName: true, rating: true, rank: true, sellerStatus: true,
              logo: true, completionRate: true, responseTime: true, totalOrders: true,
              reviewCount: true, isFeatured: true, insuranceEnabled: true,
            },
          },
          variants: { where: { isActive: true }, select: { id: true, name: true, price: true, salePrice: true } },
          _count: { select: { reviews: true, orderItems: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    // If rating filter is applied, filter in-memory (since rating is computed)
    let filtered = products;
    if (rating) {
      const minRating = parseFloat(rating);
      // We can't filter by avg rating in DB easily, so sort by vendor rating as proxy
    }

    res.json({
      products: filtered,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      filters: { q, category, minPrice, maxPrice, rating, rank, deliveryType, sort },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get search suggestions (autocomplete)
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) return res.json({ suggestions: [] });

    const [products, categories, vendors] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, isApproved: true, name: { contains: q } },
        select: { id: true, name: true, slug: true, image: true, price: true, salePrice: true },
        take: 5,
      }),
      prisma.category.findMany({
        where: { isActive: true, name: { contains: q } },
        select: { id: true, name: true, slug: true, image: true },
        take: 3,
      }),
      prisma.vendor.findMany({
        where: { businessName: { contains: q }, isApproved: true },
        select: { id: true, businessName: true, logo: true, rating: true },
        take: 3,
      }),
    ]);

    res.json({
      suggestions: {
        products: products.map(p => ({ type: 'product', id: p.id, name: p.name, slug: p.slug, image: p.image, price: p.salePrice || p.price })),
        categories: categories.map(c => ({ type: 'category', id: c.id, name: c.name, slug: c.slug })),
        vendors: vendors.map(v => ({ type: 'vendor', id: v.id, name: v.businessName, logo: v.logo, rating: v.rating })),
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get filter options (for filter sidebar)
router.get('/filters', async (req, res) => {
  try {
    const [categories, vendors] = await Promise.all([
      prisma.category.findMany({ where: { isActive: true }, select: { id: true, name: true, slug: true, image: true, _count: { select: { products: true } } }, orderBy: { sortOrder: 'asc' } }),
      prisma.vendor.findMany({ where: { isApproved: true }, distinct: ['rank'], select: { rank: true } }),
    ]);

    const ranks = [...new Set(vendors.map(v => v.rank))];

    res.json({
      categories: categories.filter(c => c._count.products > 0),
      ranks,
      deliveryTypes: ['instant', 'manual', 'scheduled'],
      priceRange: { min: 0, max: 100000 },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
