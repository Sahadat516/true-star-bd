const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'truestarbd-super-secret-key-2026');
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user || user.status !== 'ACTIVE') throw new Error();

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

const adminAuth = async (req, res, next) => {
  await auth(req, res, () => {
    if (!['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
};

const staffAuth = async (req, res, next) => {
  await auth(req, res, () => {
    if (!['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Staff access required' });
    }
    next();
  });
};

const vendorAuth = async (req, res, next) => {
  await auth(req, res, async () => {
    if (req.user.role !== 'VENDOR') {
      return res.status(403).json({ error: 'Vendor access required' });
    }
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
    if (!vendor || !vendor.isApproved) {
      return res.status(403).json({ error: 'Vendor not approved' });
    }
    req.vendor = vendor;
    next();
  });
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'truestarbd-super-secret-key-2026');
      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (user && user.status === 'ACTIVE') {
        req.user = user;
        req.token = token;
      }
    }
  } catch (e) { /* silent - optional auth */ }
  next();
};

module.exports = { auth, adminAuth, staffAuth, vendorAuth, optionalAuth };
