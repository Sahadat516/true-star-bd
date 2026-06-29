const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const FRAUD_RULES = {
  MAX_LOGIN_ATTEMPTS: 10,
  MAX_ORDERS_PER_HOUR: 5,
  MAX_ORDERS_SAME_IP: 3,
  SUSPICIOUS_COUNTRY_CODES: [],
  MIN_ORDER_AMOUNT_SUSPICIOUS: 10000,
  MAX_FAILED_PAYMENTS: 3,
};

async function checkLoginFraud(userId, ip) {
  const recentAttempts = await prisma.loginAttempt.count({
    where: { userId, createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) }, success: false },
  });
  if (recentAttempts >= FRAUD_RULES.MAX_LOGIN_ATTEMPTS) {
    await flagUser(userId, 'BRUTE_FORCE_LOGIN', `Failed login attempts: ${recentAttempts} from IP: ${ip}`);
    return { risk: 'high', action: 'temporary_block', reason: 'Too many failed login attempts' };
  }
  return { risk: 'low' };
}

async function checkOrderFraud(userId, orderData) {
  const flags = [];
  let risk = 'low';

  const recentOrders = await prisma.order.count({
    where: { userId, createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) } },
  });
  if (recentOrders >= FRAUD_RULES.MAX_ORDERS_PER_HOUR) {
    flags.push(`High order rate: ${recentOrders}/hr`);
    risk = 'medium';
  }

  if (orderData.total >= FRAUD_RULES.MIN_ORDER_AMOUNT_SUSPICIOUS) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user.phoneVerified) {
      flags.push(`Large order (${orderData.total}) from unverified user`);
      risk = 'high';
    }
  }

  const failedPayments = await prisma.payment.count({
    where: { userId, status: 'FAILED', createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
  });
  if (failedPayments >= FRAUD_RULES.MAX_FAILED_PAYMENTS) {
    flags.push(`Failed payments: ${failedPayments} in 24hrs`);
    risk = 'high';
  }

  if (flags.length > 0) {
    await prisma.fraudAlert.create({
      data: { userId, type: 'ORDER_FRAUD', details: flags.join('; '), risk, status: risk === 'high' ? 'FLAGGED' : 'WARNING' },
    });
  }

  return { risk, flags, action: risk === 'high' ? 'review_required' : 'approved' };
}

async function flagUser(userId, type, details) {
  await prisma.fraudAlert.create({
    data: { userId, type, details, risk: 'high', status: 'FLAGGED' },
  });
  await prisma.user.update({
    where: { id: userId },
    data: { status: 'SUSPENDED' },
  });
  await prisma.fraudLog.create({
    data: { userId, action: type, reason: `Auto-suspended: ${type} - ${details}`, severity: 'high' },
  });
}

async function getFraudAlerts(limit = 50) {
  return prisma.fraudAlert.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { user: { select: { email: true, firstName: true, lastName: true, role: true } } },
  });
}

async function resolveAlert(alertId, resolution) {
  return prisma.fraudAlert.update({
    where: { id: alertId },
    data: { status: resolution, resolvedAt: new Date() },
  });
}

module.exports = { checkLoginFraud, checkOrderFraud, flagUser, getFraudAlerts, resolveAlert };
