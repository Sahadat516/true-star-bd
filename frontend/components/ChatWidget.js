'use client'

import { useState, useRef, useEffect } from 'react'
import { useApp } from './AppContext'
import { MessageCircle, X, Send, Bot, User, Loader2, ChevronDown } from 'lucide-react'

export default function ChatWidget() {
  const { user, language } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: language === 'bn' ? 'স্বাগতম! TRUE STAR BD-তে আপনাকে সাহায্য করতে আমি এখানে আছি। কীভাবে সাহায্য করতে পারি?' : 'Welcome! I\'m here to help you with TRUE STAR BD. How can I assist you today?', isAi: true }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showOptions, setShowOptions] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  const quickReplies = language === 'bn' 
    ? ['পণ্য খুঁজুন', 'অর্ডার স্ট্যাটাস', 'পেমেন্ট হেল্প', 'সাপোর্ট']
    : ['Find Products', 'Order Status', 'Payment Help', 'Support']

  const sendMessage = async (text) => {
    if (!text?.trim()) return
    const userMsg = { id: Date.now(), text, isAi: false }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setShowOptions(false)
    setIsTyping(true)

    try {
      const token = localStorage.getItem('token')
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const res = await fetch('/api/chat/ai', {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: text, context: { language } }),
      })
      const data = await res.json()
      const aiMsg = { id: Date.now() + 1, text: data.response || getFallbackResponse(text, language), isAi: true }
      setMessages(prev => [...prev, aiMsg])
    } catch {
      const aiMsg = { id: Date.now() + 1, text: getFallbackResponse(text, language), isAi: true }
      setMessages(prev => [...prev, aiMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const getFallbackResponse = (msg, lang) => {
    const lower = msg.toLowerCase()
    if (lower.includes('price') || lower.includes('pricing') || lower.includes('দাম')) {
      return lang === 'bn' ? 'আমাদের সব পণ্যের দাম পণ্য পৃষ্ঠায় দেখানো আছে। আপনি কোন পণ্য সম্পর্কে জানতে চান?' : 'All product prices are listed on the product page. Which product are you interested in?'
    }
    if (lower.includes('order') || lower.includes('অর্ডার')) {
      return lang === 'bn' ? 'আপনার অর্ডার স্ট্যাটাস জানতে দয়া করে সাইন ইন করে "আমার অর্ডার" সেকশনে যান।' : 'To check your order status, please sign in and go to "My Orders" section.'
    }
    if (lower.includes('pay') || lower.includes('payment') || lower.includes('পেমেন্ট')) {
      return lang === 'bn' ? 'আমরা bKash, Nagad, Rocket, Stripe, PayPal, Bybit, Binance Pay, এবং আরও অনেক পেমেন্ট পদ্ধতি সাপোর্ট করি।' : 'We support bKash, Nagad, Rocket, Stripe, PayPal, Bybit, Binance Pay, USDT, and many other payment methods.'
    }
    if (lower.includes('contact') || lower.includes('যোগাযোগ')) {
      return lang === 'bn' ? 'আপনি আমাদের কল করতে পারেন +880-1812-054785 নম্বরে বা ইমেইল করতে পারেন truestarbdltd.2018@gmail.com-এ।' : 'You can call us at +880-1812-054785 or email us at truestarbdltd.2018@gmail.com.'
    }
    return lang === 'bn' 
      ? `"${msg}" - আপনার প্রশ্নের জন্য ধন্যবাদ! TRUE STAR BD-তে আপনাকে স্বাগতম। আমরা এআই টুলস, সাবস্ক্রিপশন ও ডিজিটাল সার্ভিস সরবরাহ করি। আরও জানতে আমাদের ওয়েবসাইট ব্রাউজ করুন বা সাপোর্ট টিমের সাথে যোগাযোগ করুন।`
      : `Thank you for your question about "${msg}"! Welcome to TRUE STAR BD. We provide AI tools, subscriptions, and digital services. Browse our website or contact our support team for more details.`
  }

  return (
    <>
      {/* Chat button */}
      <button onClick={() => setIsOpen(true)} className={`chat-widget w-14 h-14 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-105 transition-all duration-200 ${isOpen ? 'hidden' : 'flex'}`}>
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chat-widget w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">True Star AI</h3>
                  <p className="text-xs text-white/70">Online · 24/7 Support</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 rounded-lg p-1.5 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900/50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isAi ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] ${msg.isAi ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700' : 'bg-primary-600 text-white'} rounded-2xl px-4 py-2.5 shadow-sm`}>
                  <div className="flex items-center gap-2 mb-1">
                    {msg.isAi ? <Bot className="w-3.5 h-3.5 text-primary-600" /> : <User className="w-3.5 h-3.5 text-white" />}
                    <span className={`text-[10px] font-medium ${msg.isAi ? 'text-gray-400' : 'text-white/70'}`}>
                      {msg.isAi ? 'AI Assistant' : 'You'}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {showOptions && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickReplies.map((qr, i) => (
                <button key={i} onClick={() => sendMessage(qr)}
                  className="text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-gray-700 dark:text-gray-300 rounded-full transition-colors border border-gray-200 dark:border-gray-600">
                  {qr}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                placeholder={language === 'bn' ? 'বার্তা লিখুন...' : 'Type a message...'}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
              <button onClick={() => sendMessage(input)} disabled={!input.trim()}
                className="w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">AI Assistant · May produce inaccurate information</p>
          </div>
        </div>
      )}
    </>
  )
}
