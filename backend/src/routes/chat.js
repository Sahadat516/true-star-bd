const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

function generateResponse(message, context = {}) {
  const lower = (message || '').toLowerCase();
  const lang = context?.language || 'en';

  if (lower.includes('product') || lower.includes('price') || lower.includes('subscription') || lower.includes('পণ্য') || lower.includes('দাম') || lower.includes('সাবস্ক্রিপশন')) {
    return lang === 'bn'
      ? 'TRUE STAR BD-তে আমরা বিভিন্ন AI টুলস, সফটওয়্যার সাবস্ক্রিপশন, গিফট কার্ড ও ডিজিটাল সার্ভিস সরবরাহ করি। আমাদের ক্যাটাগরি ব্রাউজ করুন বা নির্দিষ্ট পণ্য সার্চ করুন। যেমন: ChatGPT, Gemini, Claude, Netflix, YouTube Premium, Microsoft 365, Canva Pro ইত্যাদি।'
      : 'At TRUE STAR BD, we offer AI tools (ChatGPT, Gemini, Claude), software subscriptions (Microsoft 365, Canva Pro), streaming (Netflix, YouTube Premium), gift cards & digital services. Browse categories or search for products.';
  }

  if (lower.includes('order') || lower.includes('অর্ডার')) {
    return lang === 'bn'
      ? 'আপনার অর্ডার স্ট্যাটাস চেক করতে সাইন ইন করে "আমার অর্ডার" পৃষ্ঠায় যান। কোনো সমস্যা হলে আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন: +880-1812-054785 অথবা truestarbdltd.2018@gmail.com'
      : 'To check your order status, sign in and go to "My Orders" page. For issues, contact support: +880-1812-054785 or truestarbdltd.2018@gmail.com';
  }

  if (lower.includes('pay') || lower.includes('payment') || lower.includes('bkash') || lower.includes('nagad') || lower.includes('পেমেন্ট')) {
    return lang === 'bn'
      ? 'TRUE STAR BD একাধিক পেমেন্ট পদ্ধতি সাপোর্ট করে:\n• bKash / Nagad / Rocket (BDT)\n• Stripe / PayPal (USD)\n• Bybit / Binance Pay / USDT (Crypto)\n• SSLCommerz / Aamarpay / PortWallet\n• Bank Transfer\nসব পেমেন্ট ১০০% নিরাপদ ও এনক্রিপ্টেড।'
      : 'TRUE STAR BD supports multiple payment methods:\n• bKash / Nagad / Rocket (BDT)\n• Stripe / PayPal (USD)\n• Bybit / Binance Pay / USDT (Crypto)\n• SSLCommerz / Aamarpay / PortWallet\n• Bank Transfer\nAll payments 100% secure & encrypted.';
  }

  if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('যোগাযোগ') || lower.includes('ফোন')) {
    return lang === 'bn'
      ? 'আমাদের যোগাযোগের তথ্য:\n📞 ফোন: +880-1812-054785, +880-1919-467164\n📧 ইমেইল: truestarbdltd.2018@gmail.com\n💬 WhatsApp: +880-1812-054785\n📱 Telegram: @Sahadat516\n📍 ঠিকানা: 73, Lion Shopping Complex, Monipuripara, Airport Road, Tejgaon, Dhaka-1215'
      : 'Our contact info:\n📞 Phone: +880-1812-054785, +880-1919-467164\n📧 Email: truestarbdltd.2018@gmail.com\n💬 WhatsApp: +880-1812-054785\n📱 Telegram: @Sahadat516\n📍 Address: 73, Lion Shopping Complex, Monipuripara, Airport Road, Tejgaon, Dhaka-1215';
  }

  if (lower.includes('vendor') || lower.includes('sell') || lower.includes('business') || lower.includes('বিক্রি') || lower.includes('ব্যবসা')) {
    return lang === 'bn'
      ? 'TRUE STAR BD-তে বিক্রেতা হতে সাইন আপ করে ভেন্ডর রোল সিলেক্ট করুন। প্রয়োজন: ট্রেড লাইসেন্স, এনআইডি/পাসপোর্ট, ব্যবসার তথ্য। কমিশন: ১০% সার্ভিস চার্জ + ৫% ভ্যাট। পেমেন্ট সেটেলমেন্ট: ১৫ দিনের মধ্যে।'
      : 'To become a vendor on TRUE STAR BD: sign up, select vendor role. Requirements: Trade License, NID/Passport, business details. Commission: 10% service + 5% VAT. Settlement: within 15 days.';
  }

  if (lower.includes('support') || lower.includes('help') || lower.includes('সাহায্য')) {
    return lang === 'bn'
      ? 'TRUE STAR BD সাপোর্ট ২৪/৭ উপলব্ধ! আপনি আমাদের AI চ্যাট, WhatsApp (+880-1812-054785), ইমেইল বা সাপোর্ট টিকেটের মাধ্যমে সাহায্য নিতে পারেন। আমাদের টিম ১ ঘন্টার মধ্যে রিপ্লাই দেয়।'
      : 'TRUE STAR BD support is 24/7! Reach us via AI chat, WhatsApp (+880-1812-054785), email, or support tickets. Our team replies within 1 hour.';
  }

  if (lower.includes('scam') || lower.includes('fraud') || lower.includes('প্রতারণা') || lower.includes('cheat') || lower.includes('hack') || lower.includes('secure')) {
    return lang === 'bn'
      ? 'TRUE STAR BD একটি ১০০% বিশ্বস্ত প্ল্যাটফর্ম। আমাদের AI ফ্রড ডিটেকশন সিস্টেম ২৪/৭ সক্রিয় থাকে। সমস্ত ভেন্ডর ভেরিফাইড। আমরা SSL এনক্রিপশন, 2FA, এবং অটোমেটেড ফ্রড মনিটরিং ব্যবহার করি। কোনো সন্দেহজনক কার্যকলাপ রিপোর্ট করুন: support@truestarbd.com'
      : 'TRUE STAR BD is 100% trusted. Our AI fraud detection system runs 24/7. All vendors are verified with trade licenses. We use SSL encryption, 2FA, and automated fraud monitoring. Report suspicious activity: support@truestarbd.com';
  }

  if (lower.includes('refund') || lower.includes('return') || lower.includes('ফেরত') || lower.includes('cancel')) {
    return lang === 'bn'
      ? 'TRUE STAR BD-তে রিফান্ড পলিসি:\n• ডিজিটাল পণ্যে সাধারণত রিফান্ড দেওয়া হয় না\n• যদি পণ্য ডেলিভারি না হয়, ২৪ ঘন্টার মধ্যে ফুল রিফান্ড\n• টেকনিক্যাল সমস্যায় ৭ দিনের মধ্যে রিফান্ড/রিপ্লেসমেন্ট\n• বিস্তারিত জানতে আমাদের রিফান্ড পলিসি পৃষ্ঠা দেখুন।'
      : 'TRUE STAR BD Refund Policy:\n• Digital products are generally non-refundable\n• If product is not delivered: full refund within 24hrs\n• Technical issues: refund/replacement within 7 days\n• See our Refund Policy page for details.';
  }

  if (lower.includes('discount') || lower.includes('coupon') || lower.includes('offer') || lower.includes('ছাড়') || lower.includes('কুপন')) {
    return lang === 'bn'
      ? 'TRUE STAR BD-তে নিয়মিত অফার ও ডিসকাউন্ট থাকে! আমাদের প্রোডাক্ট পৃষ্ঠায় সেল প্রাইস চেক করুন। নিউজলেটার সাবস্ক্রাইব করে বিশেষ অফার পেতে পারেন। ভেন্ডরদের জন্য বিশেষ বাল্ক ডিসকাউন্ট উপলব্ধ।'
      : 'TRUE STAR BD has regular offers & discounts! Check sale prices on product pages. Subscribe to our newsletter for special offers. Bulk discounts available for vendors.';
  }

  const defaultResponses = {
    en: [
      `Thank you for your message! I'm the TRUE STAR BD AI assistant. We are a premium digital marketplace offering AI tools, subscriptions, and digital services in Bangladesh & worldwide. How can I help you today? Try asking about products, orders, payments, or support.`,
      `Welcome to TRUE STAR BD! 🎉 I can help you:\n• Find products (AI tools, subscriptions, gift cards)\n• Check order status\n• Process payments (bKash, Nagad, Stripe, USDT)\n• Vendor registration\n• Technical support\nWhat would you like to know?`,
      `I'm here 24/7! TRUE STAR BD offers premium digital products: ChatGPT, Gemini, Claude AI tools, Netflix, YouTube Premium, Microsoft 365, Canva Pro, gift cards & more. All products are 100% genuine with instant delivery. What interests you?`,
    ],
    bn: [
      `আপনার বার্তার জন্য ধন্যবাদ! আমি TRUE STAR BD AI সহায়ক। আমরা একটি প্রিমিয়াম ডিজিটাল মার্কেটপ্লেস যা বাংলাদেশ ও বিশ্বব্যাপী AI টুলস, সাবস্ক্রিপশন ও ডিজিটাল সার্ভিস সরবরাহ করে। পণ্য, অর্ডার, পেমেন্ট বা সাপোর্ট সম্পর্কে জানতে চান?`,
      `TRUE STAR BD-তে স্বাগতম! 🎉 আমি সাহায্য করতে পারি:\n• পণ্য খুঁজতে (AI টুলস, সাবস্ক্রিপশন, গিফট কার্ড)\n• অর্ডার স্ট্যাটাস চেক করতে\n• পেমেন্ট প্রসেস করতে (bKash, Nagad, Stripe, USDT)\n• ভেন্ডর রেজিস্ট্রেশন\n• টেকনিক্যাল সাপোর্ট\nকী জানতে চান?`,
      `আমি ২৪/৭ এখানে আছি! TRUE STAR BD প্রিমিয়াম ডিজিটাল পণ্য অফার করে: ChatGPT, Gemini, Claude AI টুলস, Netflix, YouTube Premium, Microsoft 365, Canva Pro, গিফট কার্ড ও আরও অনেক কিছু। সব পণ্য ১০০% জেনুইন এবং তাৎক্ষণিক ডেলিভারি। কীভাবে সাহায্য করতে পারি?`,
    ],
  };

  const responses = defaultResponses[lang] || defaultResponses.en;
  return responses[Math.floor(Math.random() * responses.length)];
}

// AI chat endpoint (no auth required for basic queries)
router.post('/ai', optionalAuth, async (req, res) => {
  try {
    const { message, context } = req.body;
    const response = generateResponse(message, context);

    if (req.user) {
      try {
        await prisma.chatMessage.create({
          data: {
            chatId: `chat-${req.user.id}-ai`,
            senderId: req.user.id,
            message,
            messageType: 'text',
          },
        });
        await prisma.chatMessage.create({
          data: {
            chatId: `chat-${req.user.id}-ai`,
            senderId: req.user.id,
            receiverId: req.user.id,
            message: response,
            messageType: 'text',
            isAiGenerated: true,
          },
        });
      } catch (e) { /* silent */ }
    }

    res.json({ response, chatId: req.user ? `chat-${req.user.id}-ai` : null });
  } catch (error) {
    res.status(200).json({ response: generateResponse(req.body?.message, req.body?.context) });
  }
});

// Get chat history
router.get('/history/:chatId', auth, async (req, res) => {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { chatId: req.params.chatId },
      include: { sender: { select: { firstName: true, lastName: true, avatar: true, role: true } } },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post('/send', auth, async (req, res) => {
  try {
    const message = await prisma.chatMessage.create({
      data: {
        chatId: req.body.chatId || `chat-${req.user.id}-${req.body.receiverId || 'ai'}`,
        senderId: req.user.id,
        receiverId: req.body.receiverId || null,
        message: req.body.message,
        messageType: req.body.messageType || 'text',
      },
    });
    res.status(201).json({ message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
