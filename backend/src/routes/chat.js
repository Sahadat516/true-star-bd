const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

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

// AI chat endpoint
router.post('/ai', auth, async (req, res) => {
  try {
    const { message, context } = req.body;
    // Forward to AI service
    const aiResponse = await fetch('http://localhost:4000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context, userId: req.user.id }),
    });
    const data = await aiResponse.json();

    // Save AI response to chat history
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
        message: data.response,
        messageType: 'text',
        isAiGenerated: true,
      },
    });

    res.json({ response: data.response, chatId: `chat-${req.user.id}-ai` });
  } catch (error) {
    // Fallback AI response
    res.json({ response: `I understand you said: "${req.body.message}". As an AI assistant for True Star BD, I can help you with products, orders, and support. Please contact our team for detailed assistance.`, chatId: `chat-${req.user.id}-ai` });
  }
});

module.exports = router;
