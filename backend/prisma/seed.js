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

  // Create Categories
  const categories = [
    { name: 'AI Tools', slug: 'ai-tools', description: 'Premium AI tool subscriptions', icon: '🤖', sortOrder: 1 },
    { name: 'ChatGPT', slug: 'chatgpt', description: 'ChatGPT subscriptions', icon: '💬', parentSlug: 'ai-tools', sortOrder: 1 },
    { name: 'Google AI', slug: 'google-ai', description: 'Google AI & Gemini', icon: '🔍', parentSlug: 'ai-tools', sortOrder: 2 },
    { name: 'Design & Creative', slug: 'design-creative', description: 'Design tools', icon: '🎨', sortOrder: 3 },
    { name: 'Streaming & OTT', slug: 'streaming-ott', description: 'Netflix, YouTube Premium', icon: '📺', sortOrder: 4 },
    { name: 'Windows & Software', slug: 'windows-software', description: 'Windows licenses & software', icon: '💻', sortOrder: 5 },
    { name: 'Gift Cards', slug: 'gift-cards', description: 'Digital gift cards', icon: '🎁', sortOrder: 6 },
    { name: 'Education', slug: 'education', description: 'Educational tools & courses', icon: '📚', sortOrder: 7 },
    { name: 'WordPress', slug: 'wordpress', description: 'WordPress themes & plugins', icon: '🌐', sortOrder: 8 },
    { name: 'VPN & Security', slug: 'vpn-security', description: 'VPN & security tools', icon: '🔒', sortOrder: 9 },
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

  const products = [
    {
      name: 'ChatGPT Plus Subscription',
      slug: 'chatgpt-plus-subscription',
      description: 'Premium ChatGPT Plus subscription with GPT-5 access. Includes advanced features, faster response times, and priority access to new features.',
      price: 2850, salePrice: 2599,
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
      categoryId: aiToolsCat.id, vendorId: vendor2.id,
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
      categoryId: aiToolsCat.id, vendorId: vendor1.id,
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
      categoryId: aiToolsCat.id, vendorId: vendor2.id,
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
      categoryId: aiToolsCat.id, vendorId: vendor1.id,
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
      categoryId: aiToolsCat.id, vendorId: vendor2.id,
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
    { key: 'vat_percentage', value: '5', type: 'number', group: 'billing' },
    { key: 'service_charge_percentage', value: '10', type: 'number', group: 'billing' },
    { key: 'settlement_days', value: '15', type: 'number', group: 'billing' },
    { key: 'bybit_account', value: '566089560 (TRUESTARBDLIMITED)', type: 'text', group: 'payment' },
    { key: 'bkash_number', value: '01919-467164', type: 'text', group: 'payment' },
    { key: 'nagad_number', value: '01919-467164', type: 'text', group: 'payment' },
    { key: 'rocket_number', value: '01919-467164', type: 'text', group: 'payment' },
    { key: 'primary_color', value: '#2563eb', type: 'text', group: 'appearance' },
    { key: 'accent_color', value: '#d946ef', type: 'text', group: 'appearance' },
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
    { slug: 'terms', title: 'Terms & Conditions', content: '<h2>Terms and Conditions</h2><p>Welcome to TRUE STAR BD LIMITED. By using our website and services, you agree to these terms and conditions.</p><h3>Account Registration</h3><p>You must provide accurate information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.</p><h3>Product Delivery</h3><p>Digital products are delivered instantly. Subscription access details are provided within the specified timeframe after payment confirmation.</p><h3>Payments</h3><p>All payments are processed securely. Prices are listed in BDT (Bangladeshi Taka) unless otherwise specified.</p><h3>Vendor Terms</h3><p>Vendors agree to pay a service charge and applicable VAT on sales. Settlement is processed within 15 days of order completion.</p><h3>Prohibited Activities</h3><p>Fraudulent activities, fake reviews, abusive behavior, and violation of any laws are strictly prohibited. Violators will have their accounts suspended.</p>', isPublished: true },
    { slug: 'privacy', title: 'Privacy Policy', content: '<h2>Privacy Policy</h2><p>At TRUE STAR BD LIMITED, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.</p><h3>Information We Collect</h3><p>We collect information you provide during registration including name, email, phone number, and payment details necessary for processing orders.</p><h3>How We Use Your Information</h3><p>We use your information to process orders, provide customer support, send order confirmations and invoices, and improve our services.</p><h3>Data Protection</h3><p>We implement security measures to protect your personal information. We do not share your data with third parties except as necessary for payment processing.</p><h3>Cookies</h3><p>We use cookies to enhance your browsing experience and analyze site traffic.</p>', isPublished: true },
    { slug: 'refund', title: 'Refund & Return Policy', content: '<h2>Refund and Return Policy</h2><h3>Digital Products</h3><p>Due to the nature of digital products, we do not offer refunds once the product has been delivered. Please ensure you have selected the correct product before purchasing.</p><h3>Defective Products</h3><p>If a product does not work as described, contact us within 24 hours of delivery. We will investigate and provide a replacement or refund if necessary.</p><h3>Subscription Issues</h3><p>For subscription-related issues, our support team will assist in resolving problems with the service provider. Refunds for subscriptions are handled on a case-by-case basis.</p><h3>Contact for Refunds</h3><p>Email: truestarbdltd.2018@gmail.com<br>WhatsApp: +880-1812-054785</p>', isPublished: true },
    { slug: 'shipping', title: 'Delivery & Shipping Policy', content: '<h2>Delivery and Shipping Policy</h2><h3>Digital Product Delivery</h3><p>All digital products are delivered instantly after payment confirmation. You will receive:</p><ul><li>Account login credentials via email</li><li>Setup instructions</li><li>WhatsApp confirmation message</li></ul><h3>Delivery Confirmation</h3><p>Both the customer and vendor receive confirmation messages once delivery is successfully completed.</p><h3>Invoice</h3><p>An invoice is sent to your registered email address after fund transfer is completed.</p><h3>Delivery Timeframes</h3><p>Digital products: Instant (within 5 minutes)<br>Subscription access: Within 30 minutes<br>Physical products (if applicable): 3-7 business days</p>', isPublished: true },
    { slug: 'blog', title: 'Blog', content: '<h2>TRUE STAR BD Blog</h2><p>Welcome to our blog! Stay updated with the latest news about AI tools, digital products, and technology trends.</p><article><h3>Getting Started with AI Tools in 2026</h3><p>Artificial intelligence is transforming how we work and create. From ChatGPT to Gemini, discover the best AI tools for your needs...</p></article><article><h3>Why Choose Digital Subscriptions?</h3><p>Digital subscriptions offer flexibility, affordability, and instant access to premium tools. Learn why more people are switching to subscriptions...</p></article>', isPublished: true },
    { slug: 'reviews', title: 'Customer Reviews', content: '<h2>What Our Customers Say</h2><p>Read genuine reviews from our satisfied customers. We take pride in delivering quality products and excellent service.</p><p>Browse our products page and leave a review after your purchase!</p>', isPublished: true },
    { slug: 'support', title: 'Help Center & Support', content: '<h2>How Can We Help You?</h2><p>Welcome to TRUE STAR BD Support Center. We\'re here to assist you 24/7.</p><h3>Quick Support Options</h3><ul><li><strong>AI Chat:</strong> Use our 24/7 AI chat assistant for instant answers</li><li><strong>WhatsApp:</strong> +880-1812-054785</li><li><strong>Email:</strong> truestarbdltd.2018@gmail.com</li><li><strong>Phone:</strong> +880-1812-054785 (11 AM - 11 PM)</li></ul><h3>Common Topics</h3><ul><li>Order Status & Tracking</li><li>Payment Issues</li><li>Product Delivery</li><li>Account Setup</li><li>Subscription Renewal</li></ul>', isPublished: true },
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
