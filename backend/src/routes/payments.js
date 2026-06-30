const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();
const { createNotification } = require('../services/notification');
const { sendEmail, orderStatusEmail } = require('../services/email');

// Initialize payment
router.post('/initiate', auth, async (req, res) => {
  try {
    const { orderId, gateway } = req.body;
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        gateway: gateway ? gateway.toUpperCase() : undefined,
        amount: order.total,
        status: 'PENDING',
      },
    });

    res.json({
      payment,
      paymentUrl: `http://localhost:3000/payment/${payment.id}`,
      sandboxMode: true,
      availableGateways: ['stripe', 'sslcommerz', 'bkash', 'nagad', 'rocket', 'paypal', 'bybit', 'binance', 'bank_transfer', 'aamarpay', 'portwallet', 'usdt', 'upi', 'google_pay', 'apple_pay'],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm payment
router.post('/confirm/:paymentId', auth, async (req, res) => {
  try {
    const payment = await prisma.payment.update({
      where: { id: req.params.paymentId },
      data: {
        status: 'COMPLETED',
        gatewayTransactionId: `TXN-${Date.now()}`,
        gatewayResponse: req.body,
      },
    });

    const order = await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: 'COMPLETED', status: 'PREPARING' },
      include: { items: true },
    });

    // Update vendor totalSales (earnings credited on order completion)
    if (order.vendorId) {
      const vendor = await prisma.vendor.findUnique({ where: { id: order.vendorId }, include: { user: { select: { id: true, email: true, firstName: true } } } });
      if (vendor) {
        await prisma.vendor.update({
          where: { id: order.vendorId },
          data: { totalSales: (vendor.totalSales || 0) + 1 },
        });

        const io = req.app.get('io');
        createNotification({ userId: vendor.user.id, title: 'Payment Received', message: `Payment confirmed for order #${order.orderNumber} — ৳${order.total}`, type: 'payment', link: '/vendor/dashboard', io });
        createNotification({ userId: order.userId, title: 'Payment Confirmed', message: `Your payment of ৳${order.total} for order #${order.orderNumber} is confirmed`, type: 'payment', link: `/orders/${order.id}`, io });
        await sendEmail({ to: vendor.user.email, ...orderStatusEmail({ user: vendor.user, order, oldStatus: 'UNPAID', newStatus: 'PREPARING' }) });
      }
    }

    res.json({ payment, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment gateways
router.get('/gateways', (req, res) => {
  res.json({
    gateways: [
      { id: 'bkash', name: 'bKash', type: 'mobile', countries: ['BD'], active: true },
      { id: 'nagad', name: 'Nagad', type: 'mobile', countries: ['BD'], active: true },
      { id: 'rocket', name: 'Rocket (DBBL)', type: 'mobile', countries: ['BD'], active: true },
      { id: 'stripe', name: 'Stripe', type: 'card', countries: ['global'], active: true },
      { id: 'sslcommerz', name: 'SSLCommerz', type: 'card', countries: ['BD'], active: true },
      { id: 'aamarpay', name: 'Aamarpay', type: 'card', countries: ['BD'], active: true },
      { id: 'portwallet', name: 'PortWallet', type: 'card', countries: ['BD'], active: true },
      { id: 'paypal', name: 'PayPal', type: 'wallet', countries: ['global'], active: true },
      { id: 'google_pay', name: 'Google Pay', type: 'wallet', countries: ['global'], active: true },
      { id: 'apple_pay', name: 'Apple Pay', type: 'wallet', countries: ['global'], active: true },
      { id: 'upi', name: 'UPI (India)', type: 'wallet', countries: ['IN'], active: true },
      { id: 'binance', name: 'Binance Pay', type: 'crypto', countries: ['global'], active: true },
      { id: 'bybit', name: 'Bybit', type: 'crypto', countries: ['global'], active: true },
      { id: 'usdt', name: 'USDT (TRC20/BEP20)', type: 'crypto', countries: ['global'], active: true },
      { id: 'visa', name: 'Visa', type: 'card', countries: ['global'], active: true },
      { id: 'mastercard', name: 'Mastercard', type: 'card', countries: ['global'], active: true },
      { id: 'skrill', name: 'Skrill', type: 'wallet', countries: ['global'], active: true },
      { id: 'neteller', name: 'Neteller', type: 'wallet', countries: ['global'], active: true },
      { id: 'perfect_money', name: 'Perfect Money', type: 'wallet', countries: ['global'], active: true },
      { id: 'bank_transfer', name: 'Bank Transfer', type: 'bank', countries: ['global'], active: true },
    ],
  });
});

module.exports = router;
