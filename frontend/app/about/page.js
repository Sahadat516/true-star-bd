'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { Shield, Zap, BadgeCheck, HeadphonesIcon, ChevronRight, Award, Users, Globe2, Sparkles } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link><ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium">About Us</span>
        </div>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/20">
            <span className="text-white font-extrabold text-3xl">TS</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold mb-3">About TRUE STAR BD</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">Bangladesh&apos;s premier digital marketplace — trusted by thousands for AI tools, software subscriptions, gift cards, and digital services. Government registered, 24/7 support, instant delivery.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {[
            { icon: Shield, title: '100% Trusted', desc: 'Government registered company (License: 2024/C-07818). All vendors verified with trade licenses. SSL encrypted payments.', color: '#25D366' },
            { icon: Zap, title: 'Instant Delivery', desc: 'Most products delivered within 5 minutes via email & WhatsApp. 24/7 automated delivery system.', color: '#F97316' },
            { icon: BadgeCheck, title: 'Premium Quality', desc: 'Only genuine products from authorized sources. No resells, no fake items. 100% authentic digital goods.', color: '#3B82F6' },
            { icon: HeadphonesIcon, title: '24/7 Support', desc: 'AI chatbot + human support team. WhatsApp, email, phone, and support ticket system. Average response: under 1 hour.', color: '#8B5CF6' },
            { icon: Award, title: 'Best Prices', desc: 'Competitive pricing with regular discounts. Bulk purchase discounts for vendors. Price match guarantee.', color: '#EC4899' },
            { icon: Globe2, title: 'Worldwide Service', desc: 'Serving customers in Bangladesh and globally. Multi-currency support (BDT, USD). Multiple payment gateways.', color: '#06B6D4' },
          ].map(f => (
            <div key={f.title} className="card p-6 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: f.color + '15' }}>
                <f.icon className="w-6 h-6" style={{ color: f.color }} />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="card p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto">Browse thousands of digital products, join as a vendor, or contact our support team.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/products" className="btn-primary"><Sparkles className="w-4 h-4" /> Browse Products</Link>
            <Link href="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
