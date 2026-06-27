const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
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

    // Create vendor profile if role is VENDOR/SELLER/RESELLER/WHOLESALER
    if (['VENDOR', 'SELLER', 'RESELLER', 'WHOLESALER'].includes(role)) {
      await prisma.vendor.create({
        data: {
          userId: user.id,
          businessName: req.body.businessName || `${firstName}'s Business`,
          businessEmail: email,
          businessPhone: phone,
          tradeLicense: req.body.tradeLicense || null,
          nidNumber: req.body.nidNumber || null,
          address: req.body.address || null,
          website: req.body.website || null,
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'truestarbd-super-secret-key-2026',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, nidNumber: user.nidNumber, passportNumber: user.passportNumber },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sign In
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (user.status === 'SUSPENDED') return res.status(403).json({ error: 'Account suspended. Contact support.' });
    if (user.status === 'BANNED') return res.status(403).json({ error: 'Account banned.' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'truestarbd-super-secret-key-2026',
      { expiresIn: '7d' }
    );

    let vendor = null;
    if (user.role === 'VENDOR') {
      vendor = await prisma.vendor.findUnique({ where: { userId: user.id } });
    }

    res.json({
      user: {
        id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
        role: user.role, avatar: user.avatar, country: user.country,
        nidNumber: user.nidNumber, passportNumber: user.passportNumber,
        businessType: user.businessType, status: user.status,
      },
      vendor,
      token,
    });
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

module.exports = router;
