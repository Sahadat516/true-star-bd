const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

async function sendEmail({ to, subject, html }) {
  try {
    const t = getTransporter();
    if (!t) return { error: 'SMTP not configured' };
    const info = await t.sendMail({
      from: `"TRUE STAR BD" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send failed:', error.message);
    return { error: error.message };
  }
}

function orderPlacedEmail({ user, vendor, order }) {
  const itemsList = order.items.map(i => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.productName}</td><td style="padding:8px;border-bottom:1px solid #eee">x${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee">৳${i.total}</td></tr>`).join('');
  return {
    subject: `New Order #${order.orderNumber} — TRUE STAR BD`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:auto">
      <div style="background:linear-gradient(135deg,#25D366,#075E54);padding:24px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">New Order Received</h1>
      </div>
      <div style="padding:24px;border:1px solid #eee;border-top:0;border-radius:0 0 12px 12px">
        <p style="margin:0 0 16px">Hi <strong>${user.firstName || 'Vendor'}</strong>,</p>
        <p style="margin:0 0 16px">A new order has been placed on <strong>TRUE STAR BD</strong>.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:8px;color:#666">Order</td><td style="padding:8px;font-weight:bold">#${order.orderNumber}</td></tr>
          <tr><td style="padding:8px;color:#666">Buyer</td><td style="padding:8px">${user.firstName} ${user.lastName} (${user.email})</td></tr>
          <tr><td style="padding:8px;color:#666">Total</td><td style="padding:8px;font-weight:bold;font-size:18px">৳${order.total}</td></tr>
        </table>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">${itemsList}</table>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/vendor/dashboard" style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">View Order</a>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="color:#999;font-size:12px;margin:0">TRUE STAR BD — Premium Digital Marketplace</p>
      </div>
    </div>`,
  };
}

function orderStatusEmail({ user, order, oldStatus, newStatus }) {
  const statusLabels = { PENDING: 'Pending', PREPARING: 'Preparing', DELIVERING: 'Delivering', COMPLETED: 'Completed', CANCELLED: 'Cancelled', DISPUTED: 'Disputed' };
  return {
    subject: `Order #${order.orderNumber} is now ${statusLabels[newStatus] || newStatus} — TRUE STAR BD`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:auto">
      <div style="background:linear-gradient(135deg,#25D366,#075E54);padding:24px;text-align:center;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:20px">Order Status Update</h1>
      </div>
      <div style="padding:24px;border:1px solid #eee;border-top:0;border-radius:0 0 12px 12px">
        <p style="margin:0 0 16px">Hi <strong>${user.firstName || 'User'}</strong>,</p>
        <p style="margin:0 0 16px">Your order <strong>#${order.orderNumber}</strong> status has been updated.</p>
        <div style="text-align:center;padding:16px;background:#f9f9f9;border-radius:8px;margin:16px 0">
          <span style="color:#999">${statusLabels[oldStatus] || oldStatus}</span>
          <span style="margin:0 12px;font-size:20px">→</span>
          <span style="font-weight:bold;color:#25D366;font-size:18px">${statusLabels[newStatus] || newStatus}</span>
        </div>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.id}" style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">View Order</a>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
        <p style="color:#999;font-size:12px;margin:0">TRUE STAR BD — Premium Digital Marketplace</p>
      </div>
    </div>`,
  };
}

module.exports = { sendEmail, orderPlacedEmail, orderStatusEmail };