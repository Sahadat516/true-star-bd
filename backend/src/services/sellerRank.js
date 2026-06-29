const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const RANK_ORDER = ['NORMAL', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];

const RANK_REQUIREMENTS = {
  NORMAL:     { minOrders: 0,   minRating: 0,    minCompletion: 0 },
  COMMON:     { minOrders: 10,  minRating: 85,   minCompletion: 90 },
  UNCOMMON:   { minOrders: 50,  minRating: 88,   minCompletion: 93 },
  RARE:       { minOrders: 200, minRating: 90,   minCompletion: 95 },
  EPIC:       { minOrders: 500, minRating: 93,   minCompletion: 97 },
  LEGENDARY:  { minOrders: 1000, minRating: 95,  minCompletion: 99 },
};

const COMMISSION_BY_RANK = {
  NORMAL:     { otherService: 9.99, accountService: 12.99 },
  COMMON:     { otherService: 8.99, accountService: 11.99 },
  UNCOMMON:   { otherService: 7.99, accountService: 10.99 },
  RARE:       { otherService: 6.99, accountService: 9.99 },
  EPIC:       { otherService: 5.99, accountService: 8.99 },
  LEGENDARY:  { otherService: 4.99, accountService: 7.99 },
};

const PROMOTIONAL_RATE = 4.99;
const PROMOTIONAL_CATEGORIES = ['Top Up', 'Gift Cards', 'Software & Apps', 'Games'];

function calculateRank(vendor) {
  const orders = vendor.totalOrders || 0;
  const rating = vendor.rating || 0;
  const completion = vendor.completionRate || 0;

  let newRank = 'NORMAL';
  for (let i = RANK_ORDER.length - 1; i >= 0; i--) {
    const rank = RANK_ORDER[i];
    const req = RANK_REQUIREMENTS[rank];
    if (orders >= req.minOrders && rating >= req.minRating && completion >= req.minCompletion) {
      newRank = rank;
      break;
    }
  }
  return newRank;
}

function getCommission(rank, categoryName) {
  const isPromotional = PROMOTIONAL_CATEGORIES.some(c => categoryName?.toLowerCase().includes(c.toLowerCase()));
  if (isPromotional) return PROMOTIONAL_RATE;
  const isAccount = categoryName?.toLowerCase().includes('account');
  const tier = COMMISSION_BY_RANK[rank] || COMMISSION_BY_RANK.NORMAL;
  return isAccount ? tier.accountService : tier.otherService;
}

async function updateSellerRank(vendorId) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: { products: { include: { category: true } } },
  });
  if (!vendor) return null;

  const newRank = calculateRank(vendor);
  const needsUpdate = newRank !== vendor.rank;

  if (needsUpdate) {
    await prisma.vendor.update({
      where: { id: vendorId },
      data: { rank: newRank.toUpperCase(), rankUpdatedAt: new Date() },
    });
  }

  const productCategories = [...new Set(vendor.products.map(p => p.category?.name))];
  const commissions = {};
  productCategories.forEach(cat => {
    commissions[cat] = getCommission(newRank, cat);
  });

  return { rank: newRank, commissions, updated: needsUpdate };
}

async function updateVendorStats(vendorId) {
  const [totalOrders, avgRating, completedOrders, reviews] = await Promise.all([
    prisma.order.count({ where: { vendorId, status: { not: 'UNPAID' } } }),
    prisma.review.aggregate({ where: { vendorId }, _avg: { rating: true } }),
    prisma.order.count({ where: { vendorId, status: 'COMPLETED' } }),
    prisma.review.count({ where: { vendorId } }),
  ]);

  const totalOrdersAll = totalOrders;
  const completionRate = totalOrdersAll > 0 ? (completedOrders / totalOrdersAll) * 100 : 100;
  const rating = avgRating._avg?.rating || 0;

  await prisma.vendor.update({
    where: { id: vendorId },
    data: {
      totalOrders: totalOrdersAll,
      completionRate: Math.round(completionRate * 10) / 10,
      rating: Math.round(rating * 10) / 10,
      reviewCount: reviews,
    },
  });

  return { totalOrders: totalOrdersAll, completionRate, rating, reviewCount: reviews };
}

async function updateSellerStatus(vendorId, status) {
  return prisma.vendor.update({
    where: { id: vendorId },
    data: { sellerStatus: status, lastSeen: new Date() },
  });
}

async function getStorePage(vendorId) {
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    include: {
      user: { select: { firstName: true, lastName: true, avatar: true, createdAt: true, email: true } },
      products: {
        where: { isActive: true, isApproved: true },
        include: { category: { select: { name: true, slug: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
      reviews: { orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { firstName: true, lastName: true, avatar: true } } } },
    },
  });
  if (!vendor) return null;

  const rankInfo = RANK_ORDER.indexOf(vendor.rank) + 1;
  const rankProgress = vendor.totalOrders > 0
    ? Math.min(100, (vendor.totalOrders / (RANK_REQUIREMENTS[RANK_ORDER[Math.min(rankInfo, RANK_ORDER.length - 1)]]?.minOrders || 1)) * 100)
    : 0;

  const daysActive = Math.ceil((Date.now() - new Date(vendor.createdAt).getTime()) / (1000 * 60 * 60 * 24));

  return {
    id: vendor.id,
    businessName: vendor.businessName,
    businessEmail: vendor.businessEmail,
    businessPhone: vendor.businessPhone,
    description: vendor.description,
    logo: vendor.logo,
    coverImage: vendor.coverImage,
    rating: vendor.rating,
    reviewCount: vendor.reviewCount,
    totalOrders: vendor.totalOrders,
    totalSales: vendor.totalSales,
    completionRate: vendor.completionRate,
    responseTime: vendor.responseTime,
    rank: vendor.rank,
    rankLevel: rankInfo,
    rankProgress,
    sellerStatus: vendor.sellerStatus,
    lastSeen: vendor.lastSeen,
    insuranceEnabled: vendor.insuranceEnabled,
    paymentMethods: vendor.paymentMethods ? JSON.parse(vendor.paymentMethods) : null,
    isApproved: vendor.isApproved,
    isFeatured: vendor.isFeatured,
    daysActive,
    ownerName: `${vendor.user.firstName || ''} ${vendor.user.lastName || ''}`.trim() || vendor.user.email,
    ownerSince: vendor.user.createdAt,
    products: vendor.products.map(p => ({
      id: p.id, name: p.name, slug: p.slug, price: p.price, salePrice: p.salePrice,
      image: p.image, category: p.category, deliveryType: p.deliveryType, stock: p.stock,
    })),
    reviews: vendor.reviews.map(r => ({
      id: r.id, rating: r.rating, title: r.title, comment: r.comment,
      user: r.user, createdAt: r.createdAt,
    })),
  };
}

module.exports = {
  calculateRank, getCommission, updateSellerRank, updateVendorStats,
  updateSellerStatus, getStorePage, RANK_ORDER, RANK_REQUIREMENTS,
  COMMISSION_BY_RANK, PROMOTIONAL_RATE, PROMOTIONAL_CATEGORIES,
};