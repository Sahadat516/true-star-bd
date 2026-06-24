const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Initialize payment
router.post('/initiate', auth, async (req, res) => {
  try {
    const { orderId, gateway } = req.body;
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        gateway,
        amount: order.total,
        status: 'PENDING',
      },
    });

    // Mock payment URL for demo
    res.json({
      payment,
      paymentUrl: `http://localhost:3000/payment/${payment.id}`,
      sandboxMode: true,
      availableGateways: ['stripe', 'sslcommerz', 'bkash', 'nagad', 'rocket', 'paypal', 'bybit', 'binance', 'bank_transfer', 'aamarpay', 'portwallet', 'usdt'],
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

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: 'COMPLETED', status: 'PROCESSING' },
    });

    res.json({ payment, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get payment gateways
router.get('/gateways', (req, res) => {
  res.json({
    gateways: [
      { id: 'stripe', name: 'Stripe', type: 'card', countries: ['global'], active: true },
      { id: 'sslcommerz', name: 'SSLCommerz', type: 'card+mobile', countries: ['BD'], active: true },
      { id: 'bkash', name: 'bKash', type: 'mobile', countries: ['BD'], active: true },
      { id: 'nagad', name: 'Nagad', type: 'mobile', countries: ['BD'], active: true },
      { id: 'rocket', name: 'Rocket', type: 'mobile', countries: ['BD'], active: true },
      { id: 'paypal', name: 'PayPal', type: 'wallet', countries: ['global'], active: true },
      { id: 'bybit', name: 'Bybit', type: 'crypto', countries: ['global'], active: true },
      { id: 'binance', name: 'Binance Pay', type: 'crypto', countries: ['global'], active: true },
      { id: 'aamarpay', name: 'Aamarpay', type: 'card+mobile', countries: ['BD'], active: true },
      { id: 'portwallet', name: 'PortWallet', type: 'card+mobile', countries: ['BD'], active: true },
      { id: 'bank_transfer', name: 'Bank Transfer', type: 'bank', countries: ['global'], active: true },
      { id: 'usdt', name: 'USDT (TRC20/BEP20)', type: 'crypto', countries: ['global'], active: true },
    ],
  });
});

module.exports = router;
