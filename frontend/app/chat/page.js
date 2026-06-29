'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { useApp } from '../../components/AppContext'
import { Send, Bot, User, MessageCircle, ChevronRight, Loader2, Clock, CheckCheck } from 'lucide-react'

const QUICK_ACTIONS = [
  { label: 'Products & Pricing', icon: '🛍️' },
  { label: 'Order Status', icon: '📦' },
  { label: 'Payment Methods', icon: '💳' },
  { label: 'Contact Info', icon: '📞' },
  { label: 'Become a Vendor', icon: '🏪' },
  { label: 'Support', icon: '🎧' },
]

function ChatContent() {
  const { user, language } = useApp()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [chatId, setChatId] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'bot',
        text: language === 'bn'
          ? 'আমি TRUE STAR BD AI সহায়ক। আপনাকে কিভাবে সাহায্য করতে পারি?\n\nআমি জানতে পারি:\n• পণ্য খুঁজতে (AI টুলস, সাবস্ক্রিপশন, গিফট কার্ড)\n• অর্ডার স্ট্যাটাস চেক করতে\n• পেমেন্ট সম্পর্কে (bKash, Nagad, Stripe, USDT)\n• ভেন্ডর রেজিস্ট্রেশন\n• সাপোর্ট ও যোগাযোগ'
          : 'I\'m the TRUE STAR BD AI assistant. How can I help you?\n\nI can help with:\n• Finding products (AI tools, subscriptions, gift cards)\n• Checking order status\n• Payment info (bKash, Nagad, Stripe, USDT)\n• Vendor registration\n• Support & contact',
        time: new Date(),
      }])
    }
  }, [language])

  const sendMessage = async (text) => {
    if (!text?.trim() || loading) return
    const userMsg = { id: Date.now(), role: 'user', text, time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/chat/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ message: text, context: { language } }),
      })
      const data = await res.json()
      if (data.chatId) setChatId(data.chatId)
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: data.response, time: new Date() }])
    } catch {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: 'Sorry, I encountered an error. Please try again.', time: new Date() }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b] flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 flex gap-6">
        {/* Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="card p-4 sticky top-28">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary-600" /> Quick Help
            </h3>
            <div className="space-y-1.5">
              {QUICK_ACTIONS.map(action => (
                <button key={action.label} onClick={() => sendMessage(action.label)}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <span>{action.icon}</span> {action.label}
                </button>
              ))}
            </div>
            {!user && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-[10px] text-gray-400 mb-2">Sign in for chat history</p>
                <Link href="/signin" className="btn-primary text-xs py-2 w-full text-center">Sign In</Link>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col card overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3 bg-white dark:bg-[#131316]">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center shadow-sm">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm">TRUE STAR BD AI Assistant</h2>
              <p className="text-[10px] text-green-600 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" /> Online — Replies instantly</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-[#0a0a0b]/50" style={{ maxHeight: 'calc(100vh - 300px)' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                  msg.role === 'user' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'bg-gradient-to-br from-primary-500 to-accent-600 text-white'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[75%] ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-2xl rounded-tr-md' : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-md'} px-4 py-3 shadow-sm`}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <p className={`text-[10px] mt-1.5 flex items-center gap-1 ${msg.role === 'user' ? 'text-primary-200' : 'text-gray-400'}`}>
                    <Clock className="w-2.5 h-2.5" />
                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {msg.role === 'user' && <CheckCheck className="w-3 h-3 ml-auto" />}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-md px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#131316]">
            <form onSubmit={e => { e.preventDefault(); sendMessage(input) }} className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={language === 'bn' ? 'একটি বার্তা লিখুন...' : 'Type a message...'}
                className="flex-1 input-field text-sm"
                disabled={loading}
              />
              <button type="submit" disabled={loading || !input.trim()}
                className="btn-primary px-5 rounded-2xl disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              AI responses are automated. For urgent issues, contact WhatsApp: +880-1812-054785
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function ChatPage() {
  return <ChatContent />
}
