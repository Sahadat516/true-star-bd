const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// ======== PUBLIC PAGES ========

// Get all published pages
router.get('/pages', async (req, res) => {
  try {
    const pages = await prisma.pageContent.findMany({
      where: { isPublished: true },
      select: { slug: true, title: true, metaTitle: true, metaDescription: true, updatedAt: true },
    });
    res.json({ pages });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Get single page by slug
router.get('/pages/:slug', async (req, res) => {
  try {
    const page = await prisma.pageContent.findUnique({ where: { slug: req.params.slug } });
    if (!page) return res.status(404).json({ error: 'Page not found' });
    res.json({ page });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Get all site settings (public-safe)
router.get('/settings', async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map = {};
    settings.forEach(s => { map[s.key] = s.value; });
    res.json({ settings: map });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// ======== ADMIN CMS ========

// Get all pages (including drafts)
router.get('/admin/pages', adminAuth, async (req, res) => {
  try {
    const pages = await prisma.pageContent.findMany({ orderBy: { updatedAt: 'desc' } });
    res.json({ pages });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Create/Update page
router.post('/admin/pages', adminAuth, async (req, res) => {
  try {
    const { slug, title, content, metaTitle, metaDescription, isPublished } = req.body;
    const page = await prisma.pageContent.upsert({
      where: { slug },
      update: { title, content, metaTitle, metaDescription, isPublished },
      create: { slug, title, content, metaTitle, metaDescription, isPublished },
    });
    res.json({ page });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Delete page
router.delete('/admin/pages/:slug', adminAuth, async (req, res) => {
  try {
    await prisma.pageContent.delete({ where: { slug: req.params.slug } });
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Get all settings for admin
router.get('/admin/settings', adminAuth, async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany({ orderBy: { group: 'asc' } });
    res.json({ settings });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Update setting
router.post('/admin/settings', adminAuth, async (req, res) => {
  try {
    const { key, value, type, group } = req.body;
    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value, type, group },
      create: { key, value, type, group },
    });
    res.json({ setting });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

// Batch update settings
router.post('/admin/settings/batch', adminAuth, async (req, res) => {
  try {
    const { settings } = req.body;
    for (const s of settings) {
      await prisma.siteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: { key: s.key, value: s.value, type: s.type || 'text', group: s.group || 'general' },
      });
    }
    res.json({ success: true });
  } catch (error) { res.status(500).json({ error: error.message }); }
});

module.exports = router;
