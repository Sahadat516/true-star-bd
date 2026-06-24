const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

// AI Chat endpoint
app.post('/chat', async (req, res) => {
  const { message, context, userId } = req.body;

  // Default AI response system (works without OpenAI API key)
  const response = generateResponse(message, context);

  res.json({
    response,
    userId,
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ai-chat', version: '1.0.0' });
});

function generateResponse(message, context = {}) {
  const lower = (message || '').toLowerCase();
  const lang = context?.language || 'en';

  // Product inquiries
  if (lower.includes('product') || lower.includes('price') || lower.includes('subscription') || lower.includes('পণ্য') || lower.includes('দাম') || lower.includes('সাবস্ক্রিপশন')) {
    return lang === 'bn'
      ? 'TRUE STAR BD-তে আমরা বিভিন্ন AI টুলস, সফটওয়্যার সাবস্ক্রিপশন, গিফট কার্ড ও ডিজিটাল সার্ভিস সরবরাহ করি। আমাদের ক্যাটাগরি ব্রাউজ করুন বা নির্দিষ্ট পণ্য সার্চ করুন।'
      : 'At TRUE STAR BD, we offer various AI tools, software subscriptions, gift cards, and digital services. Browse our categories or search for a specific product.';
  }

  // Order inquiries
  if (lower.includes('order') || lower.includes('অর্ডার')) {
    return lang === 'bn'
      ? 'আপনার অর্ডার স্ট্যাটাস চেক করতে সাইন ইন করে "আমার অর্ডার" পৃষ্ঠায় যান। কোনো সমস্যায় আমাদের সাপোর্ট টিমের সাথে যোগাযোগ করুন।'
      : 'To check your order status, sign in and go to "My Orders" page. For any issues, please contact our support team.';
  }

  // Payment inquiries
  if (lower.includes('pay') || lower.includes('payment') || lower.includes('bkash') || lower.includes('nagad') || lower.includes('পেমেন্ট')) {
    return lang === 'bn'
      ? 'TRUE STAR BD একাধিক পেমেন্ট পদ্ধতি সাপোর্ট করে: bKash, Nagad, Rocket (BDT), Stripe, PayPal (USD), Bybit, Binance Pay, USDT (Crypto)। সব পেমেন্ট ১০০% নিরাপদ।'
      : 'TRUE STAR BD supports multiple payment methods: bKash, Nagad, Rocket (BDT), Stripe, PayPal (USD), Bybit, Binance Pay, USDT (Crypto). All payments are 100% secure.';
  }

  // Contact
  if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('যোগাযোগ') || lower.includes('ফোন')) {
    return lang === 'bn'
      ? 'আমাদের যোগাযোগের তথ্য: ফোন: +880-1812-054785, +880-1919-467164 | ইমেইল: truestarbdltd.2018@gmail.com | WhatsApp: +880-1812-054785 | Telegram: @Sahadat516 | ঠিকানা: 73, Lion Shopping Complex, Monipuripara, Airport Road, Tejgaon, Dhaka-1215'
      : 'Our contact info: Phone: +880-1812-054785, +880-1919-467164 | Email: truestarbdltd.2018@gmail.com | WhatsApp: +880-1812-054785 | Telegram: @Sahadat516 | Address: 73, Lion Shopping Complex, Monipuripara, Airport Road, Tejgaon, Dhaka-1215';
  }

  // Vendor/business
  if (lower.includes('vendor') || lower.includes('sell') || lower.includes('business') || lower.includes('বিক্রি') || lower.includes('ব্যবসা')) {
    return lang === 'bn'
      ? 'TRUE STAR BD-তে বিক্রেতা হতে সাইন আপ করে ভেন্ডর রোল সিলেক্ট করুন। আপনার ট্রেড লাইসেন্স ও এনআইডি ভেরিফিকেশন প্রয়োজন হবে। কমিশন রেট: ১০% সার্ভিস চার্জ + ৫% ভ্যাট। পেমেন্ট সেটেলমেন্ট: ১৫ দিনের মধ্যে।'
      : 'To become a vendor on TRUE STAR BD, sign up and select vendor role. Trade license & NID verification required. Commission: 10% service charge + 5% VAT. Payment settlement within 15 days.';
  }

  // Support
  if (lower.includes('support') || lower.includes('help') || lower.includes('সাহায্য')) {
    return lang === 'bn'
      ? 'TRUE STAR BD সাপোর্ট ২৪/৭ উপলব্ধ! আপনি আমাদের AI চ্যাট, WhatsApp (+880-1812-054785), অথবা ইমেইলের মাধ্যমে সাহায্য নিতে পারেন। এছাড়াও সাপোর্ট টিকেট ওপেন করতে পারেন।'
      : 'TRUE STAR BD support is available 24/7! You can reach us via AI chat, WhatsApp (+880-1812-054785), or email. You can also open a support ticket.';
  }

  // Scam / fraud
  if (lower.includes('scam') || lower.includes('fraud') || lower.includes('প্রতারণা') || lower.includes('cheat')) {
    return lang === 'bn'
      ? 'TRUE STAR BD একটি বিশ্বস্ত প্ল্যাটফর্ম। আমাদের সমস্ত ভেন্ডর ভেরিফাইড। যদি কোনো সন্দেহজনক কার্যকলাপ দেখতে পান, দয়া করে আমাদের এডমিন টিমকে জানান। ফ্রড ডিটেকশন সিস্টেম স্বয়ংক্রিয়ভাবে অস্বাভাবিক লেনদেন চিহ্নিত করে।'
      : 'TRUE STAR BD is a trusted platform. All vendors are verified. If you notice any suspicious activity, please report to our admin team. Our fraud detection system automatically flags unusual transactions.';
  }

  // Default responses
  const defaultResponses = {
    en: [
      `Thank you for your message! I'm the TRUE STAR BD AI assistant. We are a premium digital marketplace offering AI tools, subscriptions, and digital services. How can I help you today?`,
      `Welcome to TRUE STAR BD! I can help you find products, check orders, process payments, and more. What would you like to know?`,
      `I'm here to help! TRUE STAR BD offers AI tools (ChatGPT, Gemini, Claude), software subscriptions, Netflix, YouTube Premium, gift cards, and more. What interests you?`,
    ],
    bn: [
      `আপনার বার্তার জন্য ধন্যবাদ! আমি TRUE STAR BD AI সহায়ক। আমরা একটি প্রিমিয়াম ডিজিটাল মার্কেটপ্লেস যা AI টুলস, সাবস্ক্রিপশন ও ডিজিটাল সার্ভিস সরবরাহ করে। আমি কীভাবে সাহায্য করতে পারি?`,
      `TRUE STAR BD-তে স্বাগতম! আমি পণ্য খুঁজতে, অর্ডার চেক করতে, পেমেন্ট প্রসেস করতে এবং আরও অনেক কিছুতে সাহায্য করতে পারি। কী জানতে চান?`,
      `আমি সাহায্য করতে এখানে আছি! TRUE STAR BD AI টুলস (ChatGPT, Gemini, Claude), সফটওয়্যার সাবস্ক্রিপশন, Netflix, YouTube Premium, গিফট কার্ড এবং আরও অনেক কিছু অফার করে। আপনার কী আগ্রহ?`,
    ],
  };

  const responses = defaultResponses[lang] || defaultResponses.en;
  return responses[Math.floor(Math.random() * responses.length)];
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`AI Chat Service running on port ${PORT}`);
});
