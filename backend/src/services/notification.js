const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createNotification({ userId, title, message, type = 'info', link = null, io = null }) {
  try {
    const notification = await prisma.notification.create({
      data: { userId, title, message, type, link },
    });

    if (io) {
      const count = await prisma.notification.count({ where: { userId, isRead: false } });
      io.to(`user-${userId}`).emit('new-notification', { notification, unreadCount: count });
    }

    return notification;
  } catch (error) {
    console.error('Notification create failed:', error.message);
    return null;
  }
}

async function notifyOrderPlaced({ io, order, vendorId, buyer }) {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: { user: { select: { id: true } } },
    });
    if (!vendor) return;

    await createNotification({
      userId: vendor.user.id,
      title: 'New Order',
      message: `New order #${order.orderNumber} from ${buyer.firstName} ${buyer.lastName} — ৳${order.total}`,
      type: 'order',
      link: `/vendor/dashboard`,
      io,
    });

    await createNotification({
      userId: buyer.id,
      title: 'Order Placed',
      message: `Your order #${order.orderNumber} has been placed successfully — ৳${order.total}`,
      type: 'order',
      link: `/orders/${order.id}`,
      io,
    });
  } catch (error) {
    console.error('notifyOrderPlaced failed:', error.message);
  }
}

async function notifyOrderStatus({ io, order, buyerId, vendorId, oldStatus, newStatus }) {
  const statusLabels = { PENDING: 'Pending', PREPARING: 'Preparing', DELIVERING: 'Delivering', COMPLETED: 'Completed', CANCELLED: 'Cancelled', DISPUTED: 'Disputed' };
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: { user: { select: { id: true } } },
    });

    if (vendor) {
      await createNotification({
        userId: vendor.user.id,
        title: 'Order Updated',
        message: `Order #${order.orderNumber} status changed: ${statusLabels[oldStatus] || oldStatus} → ${statusLabels[newStatus] || newStatus}`,
        type: 'order',
        link: `/vendor/dashboard`,
        io,
      });
    }

    await createNotification({
      userId: buyerId,
      title: 'Order Updated',
      message: `Order #${order.orderNumber} status changed: ${statusLabels[oldStatus] || oldStatus} → ${statusLabels[newStatus] || newStatus}`,
      type: 'order',
      link: `/orders/${order.id}`,
      io,
    });
  } catch (error) {
    console.error('notifyOrderStatus failed:', error.message);
  }
}

async function notifyChatMessage({ io, senderId, receiverId, message, chatId }) {
  try {
    await createNotification({
      userId: receiverId,
      title: 'New Message',
      message: message.length > 100 ? message.slice(0, 100) + '...' : message,
      type: 'chat',
      link: `/chat?chat=${chatId}`,
      io,
    });
    if (io) {
      io.to(`chat-${chatId}`).emit('new-message', { senderId, message, chatId, createdAt: new Date() });
    }
  } catch (error) {
    console.error('notifyChatMessage failed:', error.message);
  }
}

module.exports = { createNotification, notifyOrderPlaced, notifyOrderStatus, notifyChatMessage };