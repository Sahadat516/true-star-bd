const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);

  // Create Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@truestarbd.com' },
    update: {},
    create: {
      email: 'admin@truestarbd.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      country: 'Bangladesh',
      gender: 'male',
    },
  });

  // Create Staff
  const staff = await prisma.user.upsert({
    where: { email: 'staff@truestarbd.com' },
    update: {},
    create: {
      email: 'staff@truestarbd.com',
      password: hashedPassword,
      firstName: 'Staff',
      lastName: 'User',
      role: 'STAFF',
      status: 'ACTIVE',
      emailVerified: true,
      country: 'Bangladesh',
      nidNumber: '1234567890',
      gender: 'female',
      address: '73 Lion Shopping Complex, Dhaka',
    },
  });

  // Create Sample Customer
  const customer = await prisma.user.upsert({
    where: { email: 'customer@truestarbd.com' },
    update: {},
    create: {
      email: 'customer@truestarbd.com',
      password: hashedPassword,
      firstName: 'Sample',
      lastName: 'Customer',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      emailVerified: true,
      country: 'Bangladesh',
      phone: '+880-1812-054785',
      address: 'Monipuripara, Airport Road, Tejgaon, Dhaka',
    },
  });

  // Create Sample Vendors
  const vendor1User = await prisma.user.upsert({
    where: { email: 'vendor1@truestarbd.com' },
    update: {},
    create: {
      email: 'vendor1@truestarbd.com',
      password: hashedPassword,
      firstName: 'Digital',
      lastName: 'World BD',
      role: 'VENDOR',
      status: 'ACTIVE',
      emailVerified: true,
      country: 'Bangladesh',
      nidNumber: '1990123456789',
      businessType: 'reseller',
      tradeLicense: 'TL-2024-001',
      address: 'Dhaka, Bangladesh',
    },
  });

  const vendor1 = await prisma.vendor.upsert({
    where: { userId: vendor1User.id },
    update: {},
    create: {
      userId: vendor1User.id,
      businessName: 'Digital World BD',
      businessEmail: 'vendor1@truestarbd.com',
      businessPhone: '01919-467164',
      tradeLicense: 'TL-2024-001',
      address: 'Dhaka, Bangladesh',
      isApproved: true,
      isFeatured: true,
    },
  });

  const vendor2User = await prisma.user.upsert({
    where: { email: 'vendor2@truestarbd.com' },
    update: {},
    create: {
      email: 'vendor2@truestarbd.com',
      password: hashedPassword,
      firstName: 'AI',
      lastName: 'Solutions',
      role: 'VENDOR',
      status: 'ACTIVE',
      emailVerified: true,
      country: 'Bangladesh',
      nidNumber: '1991123456789',
      businessType: 'vendor',
      tradeLicense: 'TL-2024-002',
    },
  });

  const vendor2 = await prisma.vendor.upsert({
    where: { userId: vendor2User.id },
    update: {},
    create: {
      userId: vendor2User.id,
      businessName: 'AI Solutions BD',
      businessEmail: 'vendor2@truestarbd.com',
      businessPhone: '01812-054785',
      tradeLicense: 'TL-2024-002',
      address: 'Tejgaon, Dhaka',
      isApproved: true,
      isFeatured: true,
    },
  });

  // Create Categories - G2G.com inspired
  const categories = [
    // Main categories
    { name: 'Gift Cards', slug: 'gift-cards', description: 'Digital gift cards for gaming, shopping & more', icon: '🎁', sortOrder: 1 },
    { name: 'Games', slug: 'games', description: 'Game activation keys, credit top-ups & subscriptions', icon: '🎮', sortOrder: 2 },
    { name: 'Software & Apps', slug: 'software-apps', description: 'Software licenses, subscriptions & apps', icon: '💻', sortOrder: 3 },
    { name: 'AI Tools', slug: 'ai-tools', description: 'Premium AI tool subscriptions & credits', icon: '🤖', sortOrder: 4 },
    { name: 'Gaming', slug: 'gaming', description: 'Game coins, items, accounts & boosting', icon: '🕹️', sortOrder: 5 },
    { name: 'Top Up', slug: 'top-up', description: 'Mobile & game top-up services', icon: '📱', sortOrder: 6 },
    { name: 'Telco', slug: 'telco', description: 'Mobile top-up, eSIM & bill payments', icon: '📞', sortOrder: 7 },
    { name: 'Streaming', slug: 'streaming', description: 'Netflix, YouTube, Spotify & more', icon: '📺', sortOrder: 8 },
    { name: 'Education', slug: 'education', description: 'Online courses & educational tools', icon: '📚', sortOrder: 9 },
    { name: 'VPN & Security', slug: 'vpn-security', description: 'VPN & cybersecurity tools', icon: '🔒', sortOrder: 10 },

    // Sub-categories
    { name: 'ChatGPT', slug: 'chatgpt', description: 'ChatGPT Plus & Pro subscriptions', icon: '💬', parentSlug: 'ai-tools', sortOrder: 1 },
    { name: 'Google AI', slug: 'google-ai', description: 'Google Gemini & AI tools', icon: '🔍', parentSlug: 'ai-tools', sortOrder: 2 },
    { name: 'Design & Creative', slug: 'design-creative', description: 'Canva, Adobe & creative tools', icon: '🎨', parentSlug: 'software-apps', sortOrder: 3 },
    { name: 'Antivirus', slug: 'antivirus', description: 'Antivirus & internet security', icon: '🛡️', parentSlug: 'vpn-security', sortOrder: 1 },
    { name: 'Game Coins', slug: 'game-coins', description: 'Virtual currencies & in-game gold', icon: '💰', parentSlug: 'gaming', sortOrder: 1 },
    { name: 'Game Items', slug: 'game-items', description: 'Weapons, skins & vanity items', icon: '⚔️', parentSlug: 'gaming', sortOrder: 2 },
    { name: 'Game Accounts', slug: 'game-accounts', description: 'Game & leveled accounts', icon: '👤', parentSlug: 'gaming', sortOrder: 3 },
    { name: 'Boosting', slug: 'boosting', description: 'Rank boosting & power leveling', icon: '🚀', parentSlug: 'gaming', sortOrder: 4 },
  ];

  for (const cat of categories) {
    const parent = cat.parentSlug
      ? await prisma.category.findUnique({ where: { slug: cat.parentSlug } })
      : null;
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        parentId: parent?.id || null,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
  }

  // Create Sample Products
  const aiToolsCat = await prisma.category.findUnique({ where: { slug: 'ai-tools' } });
  const chatgptCat = await prisma.category.findUnique({ where: { slug: 'chatgpt' } });
  const streamingCat = await prisma.category.findUnique({ where: { slug: 'streaming' } });
  const softwareCat = await prisma.category.findUnique({ where: { slug: 'software-apps' } });
  const designCat = await prisma.category.findUnique({ where: { slug: 'design-creative' } });

  const products = [
    {
      name: 'ChatGPT Plus Subscription',
      slug: 'chatgpt-plus-subscription',
      description: 'Premium ChatGPT Plus subscription with GPT-5 access. Includes advanced features, faster response times, and priority access to new features.',
      price: 2850, salePrice: 2599,
      image: 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="20" fill="#10a37f"/><circle cx="60" cy="60" r="35" fill="#fff" opacity="0.9"/><path d="M45 75c0-8.3 6.7-15 15-15s15 6.7 15 15-6.7 15-15 15-15-6.7-15-15z" fill="#10a37f"/><path d="M40 45c0-8.3 6.7-15 15-15s15 6.7 15 15" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>').toString('base64'),
      categoryId: chatgptCat.id, vendorId: vendor1.id,
      tags: JSON.stringify(['chatgpt', 'ai', 'gpt5', 'premium']),
      variants: [
        { name: 'Shared 1 Month', price: 599 },
        { name: 'Personal 1 Month', price: 2850 },
        { name: 'Personal 1 Year', price: 28500 },
      ],
    },
    {
      name: 'Claude AI Pro Subscription',
      slug: 'claude-ai-pro-subscription',
      description: 'Anthropic Claude AI Pro subscription. 100% private personal account with highest quality AI assistance.',
      price: 2790,
      image: 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="20" fill="#d97706"/><circle cx="60" cy="50" r="28" fill="#fff" opacity="0.9"/><text x="60" y="85" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="24">CL</text></svg>').toString('base64'),
      categoryId: aiToolsCat.id, vendorId: vendor1.id,
      tags: JSON.stringify(['claude', 'ai', 'anthropic']),
      variants: [
        { name: '1 Month', price: 2790 },
        { name: '12 Months', price: 27900 },
      ],
    },
    {
      name: 'Google Gemini Advanced',
      slug: 'google-gemini-advanced',
      description: 'Google Gemini Advanced subscription with 5TB storage. Access to Google\'s most capable AI model.',
      price: 2990, salePrice: 2750,
      image: 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="20" fill="#1a73e8"/><text x="60" y="72" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="22">G</text><text x="60" y="92" text-anchor="middle" fill="#8ab4f8" font-family="Arial" font-weight="bold" font-size="12">Gemini</text></svg>').toString('base64'),
      categoryId: chatgptCat.id, vendorId: vendor2.id,
      tags: JSON.stringify(['google', 'gemini', 'ai', 'storage']),
      variants: [
        { name: 'Gemini Pro 1 Month', price: 750 },
        { name: 'Gemini Ultra 1 Month', price: 2990 },
        { name: 'Gemini Pro 12 Months +5TB', price: 7490 },
      ],
    },
    {
      name: 'Grok AI SuperGrok Subscription',
      slug: 'grok-ai-supergrok',
      description: 'xAI Grok SuperGrok subscription. Real-time AI assistant with X (Twitter) integration.',
      price: 1990,
      image: 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="20" fill="#1d1d1d"/><text x="60" y="72" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="28">G</text><text x="60" y="92" text-anchor="middle" fill="#888" font-family="Arial" font-weight="bold" font-size="12">Grok</text></svg>').toString('base64'),
      categoryId: aiToolsCat.id, vendorId: vendor2.id,
      tags: JSON.stringify(['grok', 'xai', 'elon', 'ai']),
      variants: [
        { name: 'Personal 1 Month', price: 1990 },
        { name: 'Shared 1 Month', price: 990 },
      ],
    },
    {
      name: 'Perplexity AI Pro',
      slug: 'perplexity-ai-pro',
      description: 'Perplexity AI Pro subscription. AI research assistant providing answers with cited sources.',
      price: 2250, salePrice: 1999,
      image: 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="20" fill="#2563eb"/><text x="60" y="72" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="20">P</text><text x="60" y="92" text-anchor="middle" fill="#93c5fd" font-family="Arial" font-weight="bold" font-size="10">Perplexity</text></svg>').toString('base64'),
      categoryId: aiToolsCat.id, vendorId: vendor1.id,
      tags: JSON.stringify(['perplexity', 'research', 'ai']),
      variants: [
        { name: 'Shared 1 Month', price: 299 },
        { name: 'Personal 12 Months', price: 2250 },
      ],
    },
    {
      name: 'Netflix Premium 4K',
      slug: 'netflix-premium-4k',
      description: 'Netflix Premium subscription in 4K Ultra HD. Watch on 4 devices simultaneously.',
      price: 1200,
      image: 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="20" fill="#e50914"/><text x="60" y="74" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="22">N</text></svg>').toString('base64'),
      categoryId: streamingCat.id, vendorId: vendor2.id,
      tags: JSON.stringify(['netflix', 'streaming', '4k']),
      variants: [
        { name: '1 Month', price: 1200 },
        { name: '3 Months', price: 3300 },
        { name: '6 Months', price: 6000 },
      ],
    },
    {
      name: 'YouTube Premium',
      slug: 'youtube-premium',
      description: 'YouTube Premium subscription. Ad-free videos, background play, YouTube Music included.',
      price: 899,
      image: 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="20" fill="#ff0000"/><polygon points="48,38 48,82 82,60" fill="#fff"/></svg>').toString('base64'),
      categoryId: streamingCat.id, vendorId: vendor1.id,
      tags: JSON.stringify(['youtube', 'premium', 'music', 'video']),
      variants: [
        { name: '1 Month', price: 899 },
        { name: '12 Months', price: 8990 },
      ],
    },
    {
      name: 'Microsoft 365 Family',
      slug: 'microsoft-365-family',
      description: 'Microsoft 365 Family subscription for 6 users. Includes Word, Excel, PowerPoint, 1TB OneDrive each.',
      price: 4500,
      image: 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="20" fill="#0078d4"/><text x="60" y="72" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="20">365</text></svg>').toString('base64'),
      categoryId: softwareCat.id, vendorId: vendor2.id,
      tags: JSON.stringify(['microsoft', 'office', '365', 'productivity']),
      variants: [
        { name: '1 Month', price: 4500 },
        { name: '12 Months', price: 45000 },
      ],
    },
    {
      name: 'Canva Pro Subscription',
      slug: 'canva-pro-subscription',
      description: 'Canva Pro subscription. Premium templates, stock photos, brand kits, and AI-powered design tools.',
      price: 1500,
      image: 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="20" fill="#8fd3f4"/><text x="60" y="72" text-anchor="middle" fill="#1a1a1a" font-family="Arial" font-weight="bold" font-size="24">C</text></svg>').toString('base64'),
      categoryId: designCat.id, vendorId: vendor1.id,
      tags: JSON.stringify(['canva', 'design', 'graphics', 'pro']),
      variants: [
        { name: '1 Month', price: 1500 },
        { name: '12 Months', price: 15000 },
      ],
    },
    {
      name: 'Ideogram AI Pro',
      slug: 'ideogram-ai-pro',
      description: 'Ideogram AI Pro subscription. AI-powered image generation with text integration.',
      price: 1490,
      image: 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="20" fill="#6366f1"/><text x="60" y="72" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="20">I</text></svg>').toString('base64'),
      categoryId: designCat.id, vendorId: vendor2.id,
      tags: JSON.stringify(['ideogram', 'ai', 'image', 'design']),
      variants: [
        { name: 'Basic 1 Month', price: 650 },
        { name: 'Plus 1 Month', price: 1490 },
      ],
    },
  ];

  for (const product of products) {
    const { variants, ...productData } = product;
    const existing = await prisma.product.findUnique({ where: { slug: productData.slug } });
    if (!existing) {
      const created = await prisma.product.create({
        data: {
          ...productData,
          isActive: true,
          isApproved: true,
          isFeatured: true,
          images: '[]',
          variants: { create: variants },
        },
      });
      console.log(`Created product: ${created.name}`);
    }
  }

  // Seed Site Settings
  const defaultSettings = [
    { key: 'company_name', value: 'TRUE STAR BD LIMITED', type: 'text', group: 'company' },
    { key: 'company_slogan', value: 'Premium Digital Marketplace', type: 'text', group: 'company' },
    { key: 'company_address', value: '73, Lion Shopping Complex (1st Floor), Monipuripara, Airport Road, Tejgaon, Dhaka-1215, Bangladesh', type: 'text', group: 'company' },
    { key: 'company_phone', value: '+880-1812-054785', type: 'text', group: 'company' },
    { key: 'company_phone2', value: '+880-1919-467164', type: 'text', group: 'company' },
    { key: 'company_email', value: 'truestarbdltd.2018@gmail.com', type: 'text', group: 'company' },
    { key: 'company_email2', value: 'sahadat516@gmail.com', type: 'text', group: 'company' },
    { key: 'company_whatsapp', value: '+880-1812-054785', type: 'text', group: 'company' },
    { key: 'company_telegram', value: '@Sahadat516', type: 'text', group: 'company' },
    { key: 'company_facebook', value: 'https://www.facebook.com/TrueStarBD', type: 'text', group: 'company' },
    { key: 'company_registration_name', value: 'TRUE STAR BD LIMITED', type: 'text', group: 'company' },
    { key: 'trade_license_no', value: 'TRAD/DNCC/090575/2022', type: 'text', group: 'company' },
    { key: 'tin_number', value: '851667441827', type: 'text', group: 'company' },
    { key: 'company_registration_no', value: 'C-145542/2018', type: 'text', group: 'company' },
    { key: 'vat_registration_no', value: '001402868-0402', type: 'text', group: 'company' },
    { key: 'vat_percentage', value: '5', type: 'number', group: 'billing' },
    { key: 'service_charge_percentage', value: '10', type: 'number', group: 'billing' },
    { key: 'settlement_days', value: '15', type: 'number', group: 'billing' },
    { key: 'bybit_account', value: '566089560 (TRUESTARBDLIMITED)', type: 'text', group: 'payment' },
    { key: 'bkash_number', value: '01919-467164', type: 'text', group: 'payment' },
    { key: 'nagad_number', value: '01919-467164', type: 'text', group: 'payment' },
    { key: 'rocket_number', value: '01919-467164', type: 'text', group: 'payment' },
    { key: 'primary_color', value: '#25D366', type: 'text', group: 'colors' },
    { key: 'accent_color', value: '#075E54', type: 'text', group: 'colors' },
    { key: 'google_site_verification', value: '', type: 'text', group: 'seo' },
    { key: 'facebook_pixel_id', value: '', type: 'text', group: 'seo' },
    { key: 'company_logo', value: 'data:image/svg+xml;base64,' + Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#25D366"/><stop offset="100%" stop-color="#075E54"/></linearGradient></defs><rect x="8" y="8" width="44" height="44" rx="12" fill="url(#g)"/><text x="30" y="39" text-anchor="middle" fill="#fff" font-family="Arial" font-weight="bold" font-size="20">TS</text><text x="62" y="30" fill="#1e293b" font-family="Arial" font-weight="900" font-size="16">TRUE STAR BD</text><text x="62" y="44" fill="#64748b" font-family="Arial" font-size="10">LIMITED</text></svg>').toString('base64'), type: 'text', group: 'appearance' },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  // Seed Page Content
  const defaultPages = [
    { slug: 'about', title: 'About Us', content: '<h2>Welcome to TRUE STAR BD LIMITED</h2><p>TRUE STAR BD LIMITED is a premier digital marketplace based in Dhaka, Bangladesh. We specialize in providing premium AI tools, software subscriptions, digital services, and gift cards to customers in Bangladesh and worldwide.</p><p>Founded with a vision to make premium digital products accessible to everyone, we have served thousands of satisfied customers since our inception.</p><h3>Our Mission</h3><p>To provide the best digital products at competitive prices with instant delivery and 24/7 customer support.</p><h3>Why Choose Us</h3><ul><li>100% Genuine Products</li><li>Instant Auto Delivery</li><li>24/7 AI-Powered Support</li><li>Secure Payment Methods</li><li>Best Price Guarantee</li></ul>', isPublished: true },
    { slug: 'contact', title: 'Contact Us', content: '<h2>Get In Touch</h2><p>We\'re here to help! Reach out to us through any of the following channels.</p><h3>Our Office</h3><p><strong>Address:</strong> 73, Lion Shopping Complex (1st Floor), Monipuripara, Airport Road, Tejgaon, Dhaka-1215, Bangladesh</p><h3>Phone & WhatsApp</h3><p>+880-1812-054785<br>+880-1919-467164</p><h3>Email</h3><p>truestarbdltd.2018@gmail.com<br>sahadat516@gmail.com</p><h3>Social Media</h3><p>Facebook: https://www.facebook.com/TrueStarBD<br>Telegram: @Sahadat516</p><h3>Business Hours</h3><p>Saturday - Thursday: 11:00 AM - 11:00 PM (GMT+6)<br>Friday: Closed</p>', isPublished: true },
    { slug: 'faq', title: 'Frequently Asked Questions', content: '<h2>General Questions</h2><div class="faq-item"><h3>What is TRUE STAR BD?</h3><p>TRUE STAR BD is a premium digital marketplace offering AI tools, software subscriptions, gift cards, and digital services.</p></div><div class="faq-item"><h3>How do I place an order?</h3><p>Browse our products, add to cart, choose your payment method, and complete checkout. You\'ll receive your product details instantly after payment confirmation.</p></div><div class="faq-item"><h3>What payment methods do you accept?</h3><p>We accept bKash, Nagad, Rocket, Stripe, PayPal, Bybit, Binance Pay, Aamarpay, PortWallet, Bank Transfer, and USDT (TRC20/BEP20).</p></div><div class="faq-item"><h3>How long does delivery take?</h3><p>Digital products are delivered instantly after payment confirmation. Subscription access details are sent via email and WhatsApp within minutes.</p></div><div class="faq-item"><h3>Can I become a vendor?</h3><p>Yes! Sign up and select vendor role. You need a valid trade license and NID for verification.</p></div>', isPublished: true },
    { slug: 'terms', title: 'Terms & Conditions', content: '<h2>Terms and Conditions</h2><p class="text-sm text-gray-500 mb-4">Last updated: June 2026 | Compliant with Bangladesh ICT Act 2006, Digital Security Act 2018, and Consumer Rights Protection Act 2009</p><p>Welcome to TRUE STAR BD LIMITED (Registration No: C-145542/2018, Trade License: TRAD/DNCC/090575/2022, VAT BIN: 001402868-0402, Dhaka, Bangladesh). By accessing our website and using our services, you agree to be bound by these terms and conditions.</p><h3>1. Definitions</h3><p>"TRUE STAR BD" refers to TRUE STAR BD LIMITED, a company registered in Bangladesh. "Platform" refers to the website truestarbd.com and all associated services. "User" refers to any person accessing or using the platform.</p><h3>2. Account Registration & Eligibility</h3><p>To use our services, you must be at least 18 years of age. You agree to provide accurate, current, and complete information. You are responsible for safeguarding your account credentials. Under Bangladesh ICT Act 2006 (Section 54), providing false information is a punishable offense.</p><h3>3. Products & Services</h3><p>All digital products are 100% genuine. Product descriptions and prices are accurate at the time of listing but may change without notice. Subscription-based products are subject to the terms of the respective service providers.</p><h3>4. Payments & Billing</h3><p>All payments are processed through PCI-compliant gateways. Prices are listed in BDT (Bangladeshi Taka) and USD for international customers. VAT (5%) and Service Charge (10%) apply as per Bangladesh tax regulations. All transactions are recorded for compliance with Bangladesh Bank regulations.</p><h3>5. Vendor Terms</h3><p>Vendors must have a valid trade license and TIN certificate. Commission: 10% service charge + 5% VAT. Settlement processed within 15 working days via bank transfer or mobile financial services. Vendors are responsible for their products and must comply with all applicable laws.</p><h3>6. Prohibited Activities</h3><p>The following are strictly prohibited: (a) Fraudulent transactions (b) Money laundering (c) Intellectual property infringement (d) Uploading malicious code (e) Harassment or abusive behavior (f) Violation of Bangladesh Digital Security Act 2018. Violators will have accounts immediately suspended and may face legal action.</p><h3>7. Limitation of Liability</h3><p>TRUE STAR BD LIMITED shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform. Our total liability is limited to the amount paid for the specific product in question.</p><h3>8. Governing Law</h3><p>These terms are governed by the laws of the People\'s Republic of Bangladesh. Any disputes shall be resolved through arbitration in Dhaka, Bangladesh.</p>', isPublished: true },
    { slug: 'privacy', title: 'Privacy Policy', content: '<h2>Privacy Policy</h2><p class="text-sm text-gray-500 mb-4">Last updated: June 2026 | Compliant with Bangladesh Data Protection Guidelines and GDPR principles</p><p>At TRUE STAR BD LIMITED, we are committed to protecting your privacy and personal data in accordance with the Bangladesh Constitution (Article 43), ICT Act 2006, and international best practices.</p><h3>1. Information We Collect</h3><p>We collect: • Name, email, phone number • NID/Passport number (for verification) • Business documents (for vendors) • Payment information (processed securely through third-party gateways) • IP address and browser information • Device information and usage data</p><h3>2. How We Use Your Information</h3><p>Your data is used for: • Order processing and delivery • Account verification (as required by Bangladesh Bank guidelines) • Customer support • Fraud prevention (powered by AI) • Legal compliance • Service improvement</p><h3>3. Data Protection & Security</h3><p>We implement: • SSL/TLS encryption for all data transmission • Encrypted password storage (bcrypt, 12 rounds) • AI-powered fraud detection • Regular security audits • Access controls and authentication protocols</p><h3>4. Data Sharing</h3><p>We do not sell your personal data. We only share information with: • Payment gateways (for transaction processing) • Legal authorities (when required by Bangladesh law) • Service providers (email delivery, SMS)</p><h3>5. Your Rights</h3><p>Under Bangladesh law and GDPR principles: • Right to access your data • Right to rectification • Right to deletion ("Right to be Forgotten") • Right to data portability • Right to withdraw consent Contact us at privacy@truestarbd.com to exercise your rights.</p><h3>6. Cookies</h3><p>We use essential cookies for platform functionality and analytics cookies to improve our services. You can manage cookie preferences in your browser settings.</p><h3>7. Data Retention</h3><p>We retain your data for as long as your account is active or as needed to provide services. After account deletion, data is retained for 90 days per Bangladesh regulatory requirements, then permanently deleted.</p>', isPublished: true },
    { slug: 'refund', title: 'Refund & Return Policy', content: '<h2>Refund and Return Policy</h2><p class="text-sm text-gray-500 mb-4">Compliant with Bangladesh Consumer Rights Protection Act 2009 and Digital Commerce Guidelines</p><h3>1. Digital Products (General Rule)</h3><p>Due to the nature of digital products (software keys, account access, digital downloads), refunds are generally not available once the product has been delivered. Please verify your selection before purchasing.</p><h3>2. Non-Delivery Refund</h3><p>If a product is not delivered within 24 hours of payment confirmation, you are entitled to a FULL refund. Contact our support team immediately.</p><h3>3. Defective/Non-Working Products</h3><p>If a product does not function as described: • Report within 24 hours of delivery • We will investigate (within 48 hours) • If confirmed defective: full refund or replacement • Resolution time: 3-7 working days</p><h3>4. Subscription Issues</h3><p>Subscription-related problems are handled on a case-by-case basis. We will assist in resolving issues with the service provider. If the issue cannot be resolved within 7 days, a partial/full refund may be issued.</p><h3>5. Refund Process</h3><p>Refunds are processed through the original payment method: • bKash/Nagad/Rocket: 24-48 hours • Bank Transfer: 3-5 working days • Stripe/PayPal: 5-10 working days • Crypto (USDT): 24-48 hours</p><h3>6. Contact for Refunds</h3><p>Email: truestarbdltd.2018@gmail.com<br>WhatsApp: +880-1812-054785<br>Please include your order number and reason for refund request.</p>', isPublished: true },
    { slug: 'shipping', title: 'Delivery & Shipping Policy', content: '<h2>Delivery and Shipping Policy</h2><p class="text-sm text-gray-500 mb-4">Compliant with Bangladesh Digital Commerce Guidelines 2024</p><h3>1. Digital Product Delivery</h3><p>All digital products are delivered instantly after payment confirmation via: • Email delivery to registered email • WhatsApp confirmation message • Download link (where applicable) • Account credentials with setup guide</p><h3>2. Delivery Timeframes</h3><p>• Digital product keys/accounts: Instant (within 5 minutes) • Subscription activations: Within 30 minutes • Custom digital services: 24-48 hours • Support response: Within 1 hour</p><h3>3. Delivery Confirmation</h3><p>You will receive: • Email confirmation with order details • WhatsApp notification with access instructions • Invoice/receipt for your records • 24/7 support access for any issues</p><h3>4. Failed Delivery</h3><p>If you don\'t receive your product within the specified timeframe: • Check spam folder • Contact WhatsApp support: +880-1812-054785 • Email: truestarbdltd.2018@gmail.com • We will resolve within 30 minutes</p><h3>5. International Orders</h3><p>For international customers: • Prices in USD (converted at prevailing rate) • Delivery globally via email/WhatsApp • 24/7 support in English & Arabic</p>', isPublished: true },
    { slug: 'blog', title: 'Blog', content: '<h2>TRUE STAR BD Blog</h2><p>Welcome to our blog! Stay updated with the latest news about AI tools, digital products, and technology trends.</p><article><h3>Getting Started with AI Tools in 2026</h3><p>Artificial intelligence is transforming how we work and create. From ChatGPT to Gemini, discover the best AI tools for your needs...</p></article><article><h3>Why Choose Digital Subscriptions?</h3><p>Digital subscriptions offer flexibility, affordability, and instant access to premium tools. Learn why more people are switching to subscriptions...</p></article>', isPublished: true },
    { slug: 'reviews', title: 'Customer Reviews', content: '<h2>What Our Customers Say</h2><p>Read genuine reviews from our satisfied customers. We take pride in delivering quality products and excellent service.</p><p>Browse our products page and leave a review after your purchase!</p>', isPublished: true },
    { slug: 'support', title: 'Help Center & Support', content: '<h2>How Can We Help You?</h2><p>Welcome to TRUE STAR BD Support Center. We\'re here to assist you 24/7.</p><h3>Quick Support Options</h3><ul><li><strong>AI Chat:</strong> Use our 24/7 AI chat assistant for instant answers</li><li><strong>WhatsApp:</strong> +880-1812-054785</li><li><strong>Email:</strong> truestarbdltd.2018@gmail.com</li><li><strong>Phone:</strong> +880-1812-054785 (11 AM - 11 PM)</li></ul><h3>Common Topics</h3><ul><li>Order Status & Tracking</li><li>Payment Issues</li><li>Product Delivery</li><li>Account Setup</li><li>Subscription Renewal</li></ul>', isPublished: true },
    { slug: 'business-info', title: 'Business Information', content: '<h2>Business Registration & Legal Information</h2><p class="text-sm text-gray-500 mb-4">TRUE STAR BD LIMITED — A government-registered company in the People\'s Republic of Bangladesh</p><div class="grid md:grid-cols-2 gap-6 mb-8"><div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800"><h3 class="font-bold text-lg mb-3 flex items-center gap-2"><span>🏛️</span> Company Information</h3><table class="w-full text-sm"><tr><td class="py-2 text-gray-500 font-medium">Registered Name</td><td class="py-2 font-semibold">TRUE STAR BD LIMITED</td></tr><tr><td class="py-2 text-gray-500 font-medium">Business Type</td><td class="py-2">Limited Company</td></tr><tr><td class="py-2 text-gray-500 font-medium">Registration No.</td><td class="py-2 font-mono font-bold">C-145542/2018</td></tr><tr><td class="py-2 text-gray-500 font-medium">Trade License</td><td class="py-2 font-mono font-bold">TRAD/DNCC/090575/2022</td></tr><tr><td class="py-2 text-gray-500 font-medium">TIN Number</td><td class="py-2 font-mono font-bold">851667441827</td></tr><tr><td class="py-2 text-gray-500 font-medium">VAT/BIN Registration</td><td class="py-2 font-mono font-bold">001402868-0402</td></tr></table></div><div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800"><h3 class="font-bold text-lg mb-3 flex items-center gap-2"><span>📍</span> Registered Office</h3><table class="w-full text-sm"><tr><td class="py-2 text-gray-500 font-medium">Address</td><td class="py-2">73, Lion Shopping Complex (1st Floor)<br/>Monipuripara, Airport Road<br/>Tejgaon, Dhaka-1215<br/>Bangladesh</td></tr><tr><td class="py-2 text-gray-500 font-medium">Phone</td><td class="py-2">+880-1812-054785<br/>+880-1919-467164</td></tr><tr><td class="py-2 text-gray-500 font-medium">Email</td><td class="py-2">truestarbdltd.2018@gmail.com</td></tr></table></div></div><div class="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800"><h3 class="font-bold text-lg mb-3 flex items-center gap-2"><span>✅</span> Verification & Compliance</h3><div class="grid md:grid-cols-3 gap-4"><div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"><p class="text-sm font-semibold">✓ Government Registered</p><p class="text-xs text-gray-500">RJSC Bangladesh</p></div><div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"><p class="text-sm font-semibold">✓ Trade License Verified</p><p class="text-xs text-gray-500">DNCC, Dhaka</p></div><div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"><p class="text-sm font-semibold">✓ Tax Compliant</p><p class="text-xs text-gray-500">NBR, Bangladesh</p></div></div></div><p class="text-sm text-gray-400 mt-6">This information can be independently verified through the Registrar of Joint Stock Companies and Firms (RJSC), Dhaka North City Corporation (DNCC), and National Board of Revenue (NBR), Bangladesh. For verification requests, contact: truestarbdltd.2018@gmail.com</p>', isPublished: true },
  ];

  for (const p of defaultPages) {
    await prisma.pageContent.upsert({
      where: { slug: p.slug },
      update: { content: p.content, isPublished: p.isPublished },
      create: p,
    });
  }

  console.log('Seed completed successfully!');
  console.log('Admin: admin@truestarbd.com / admin123');
  console.log('Staff: staff@truestarbd.com / admin123');
  console.log('Customer: customer@truestarbd.com / admin123');
  console.log('Vendor1: vendor1@truestarbd.com / admin123');
  console.log('Vendor2: vendor2@truestarbd.com / admin123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
