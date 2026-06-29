const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');
const { getClientIp, getDeviceInfo, getLocation } = require('../services/deviceTracker');

const router = express.Router();
const prisma = new PrismaClient();

async function trackLogin(req, userId, email, success) {
  const ip = getClientIp(req);
  const ua = req.headers['user-agent'] || '';
  const device = getDeviceInfo(ua);
  const location = getLocation(ip);
  await prisma.loginAttempt.create({
    data: { userId, email, success, ip, userAgent: ua, device: device.device, browser: device.browser, os: device.os, location },
  });
}

async function createSession(req, userId) {
  const ip = getClientIp(req);
  const ua = req.headers['user-agent'] || '';
  const device = getDeviceInfo(ua);
  const location = getLocation(ip);
  await prisma.userSession.create({
    data: { userId, ip, userAgent: ua, device: device.device, browser: device.browser, os: device.os, location },
  });
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || 'truestarbd-super-secret-key-2026',
    { expiresIn: '7d' }
  );
}

function sanitizeUser(user) {
  return {
    id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
    role: user.role, avatar: user.avatar, country: user.country, language: user.language,
    nidNumber: user.nidNumber, passportNumber: user.passportNumber,
    businessType: user.businessType, status: user.status, phone: user.phone,
  };
}

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData = {
      email, password: hashedPassword, firstName, lastName, phone,
      role: role || 'CUSTOMER',
      nidNumber: req.body.nidNumber || null,
      passportNumber: req.body.passportNumber || null,
      dateOfBirth: req.body.dateOfBirth || null,
      gender: req.body.gender || null,
      address: req.body.address || null,
      businessType: req.body.businessType || null,
      tradeLicense: req.body.tradeLicense || null,
      taxId: req.body.taxId || null,
      businessDocuments: req.body.businessDocuments || null,
    };

    const user = await prisma.user.create({ data: userData });

    if (['VENDOR', 'SELLER', 'RESELLER', 'WHOLESALER'].includes(role)) {
      await prisma.vendor.create({
        data: {
          userId: user.id,
          businessName: req.body.businessName || `${firstName}'s Business`,
          businessEmail: email, businessPhone: phone,
          tradeLicense: req.body.tradeLicense || null,
          nidNumber: req.body.nidNumber || null,
          address: req.body.address || null,
          website: req.body.website || null,
        },
      });
    }

    await trackLogin(req, user.id, email, true);
    await createSession(req, user.id);

    const token = generateToken(user);
    res.status(201).json({ user: sanitizeUser(user), token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await trackLogin(req, null, email, false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status === 'SUSPENDED') return res.status(403).json({ error: 'Account suspended. Contact support.' });
    if (user.status === 'BANNED') return res.status(403).json({ error: 'Account banned.' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      await trackLogin(req, user.id, email, false);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
    await trackLogin(req, user.id, email, true);
    await createSession(req, user.id);

    const token = generateToken(user);

    let vendor = null;
    if (['VENDOR', 'SELLER', 'RESELLER', 'WHOLESALER'].includes(user.role)) {
      vendor = await prisma.vendor.findUnique({ where: { userId: user.id } });
    }

    res.json({ user: sanitizeUser(user), vendor, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Social Login (Google, Facebook, Twitter)
router.post('/social-login', async (req, res) => {
  try {
    const { provider, providerId, email, firstName, lastName, avatar } = req.body;
    if (!provider || !providerId) return res.status(400).json({ error: 'Provider and providerId required' });

    // Check if social account already linked
    let socialAccount = await prisma.socialAccount.findUnique({
      where: { provider_providerId: { provider, providerId } },
      include: { user: true },
    });

    if (socialAccount) {
      const user = socialAccount.user;
      if (user.status === 'SUSPENDED') return res.status(403).json({ error: 'Account suspended.' });
      if (user.status === 'BANNED') return res.status(403).json({ error: 'Account banned.' });

      await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });
      await trackLogin(req, user.id, user.email, true);
      await createSession(req, user.id);

      const token = generateToken(user);
      let vendor = null;
      if (['VENDOR', 'SELLER', 'RESELLER', 'WHOLESALER'].includes(user.role)) {
        vendor = await prisma.vendor.findUnique({ where: { userId: user.id } });
      }
      return res.json({ user: sanitizeUser(user), vendor, token, isNew: false });
    }

    // Check if user exists with this email
    let user = null;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        // Link social account to existing user
        await prisma.socialAccount.create({
          data: { userId: user.id, provider, providerId, email, name: `${firstName || ''} ${lastName || ''}`.trim(), avatar },
        });
        await trackLogin(req, user.id, user.email, true);
        await createSession(req, user.id);
        const token = generateToken(user);
        return res.json({ user: sanitizeUser(user), token, isNew: false, linked: true });
      }
    }

    // Create new user
    const generatedEmail = email || `${providerId}@${provider}.social`;
    const hashedPassword = await bcrypt.hash(Math.random().toString(36), 12);

    user = await prisma.user.create({
      data: {
        email: generatedEmail, password: hashedPassword, firstName: firstName || provider, lastName,
        role: 'CUSTOMER', status: 'ACTIVE', emailVerified: true, avatar,
      },
    });

    await prisma.socialAccount.create({
      data: { userId: user.id, provider, providerId, email: generatedEmail, name: `${firstName || ''} ${lastName || ''}`.trim(), avatar },
    });

    await trackLogin(req, user.id, generatedEmail, true);
    await createSession(req, user.id);

    const token = generateToken(user);
    res.status(201).json({ user: sanitizeUser(user), token, isNew: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  let vendor = null;
  if (req.user.role === 'VENDOR') {
    vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
  }
  res.json({ user: req.user, vendor });
});

// Get user sessions (device tracking)
router.get('/sessions', auth, async (req, res) => {
  const sessions = await prisma.userSession.findMany({
    where: { userId: req.user.id, isActive: true },
    orderBy: { lastSeen: 'desc' },
    take: 20,
  });
  res.json({ sessions });
});

// Get login history
router.get('/login-history', auth, async (req, res) => {
  const attempts = await prisma.loginAttempt.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  res.json({ attempts });
});

module.exports = router;
