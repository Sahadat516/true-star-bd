'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { Mail, Phone, MapPin, MessageCircle, Send, ChevronRight, Clock, Shield } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link><ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium">Contact Us</span>
        </div>

        <h1 className="text-3xl font-extrabold mb-2">Contact Us</h1>
        <p className="text-gray-500 mb-8">We&apos;re here to help — reach out anytime.</p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-5">Send us a message</h2>
              {sent ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Message Sent!</h3>
                  <p className="text-sm text-gray-500">We&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => setSent(false)} className="btn-primary mt-6 text-sm">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">Your Name</label>
                      <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1.5 block">Your Email</label>
                      <input type="email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="input-field" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Subject</label>
                    <input type="text" required value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))} className="input-field" placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1.5 block">Message</label>
                    <textarea required rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} className="input-field" placeholder="Describe your issue in detail..." />
                  </div>
                  <button type="submit" className="btn-primary"><Send className="w-4 h-4" /> Send Message</button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {[
              { icon: MessageCircle, label: 'WhatsApp', value: '+880-1812-054785', color: '#25D366', bg: 'bg-green-50 dark:bg-green-900/20' },
              { icon: Phone, label: 'Phone', value: '+880-1812-054785', color: '#3B82F6', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { icon: Mail, label: 'Email', value: 'truestarbdltd.2018@gmail.com', color: '#F97316', bg: 'bg-orange-50 dark:bg-orange-900/20' },
              { icon: MapPin, label: 'Address', value: '73, Lion Shopping Complex, Monipuripara, Airport Road, Tejgaon, Dhaka-1215', color: '#8B5CF6', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              { icon: Clock, label: 'Business Hours', value: '24/7 — Online support always available', color: '#EC4899', bg: 'bg-pink-50 dark:bg-pink-900/20' },
            ].map(item => (
              <div key={item.label} className="card p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-sm font-semibold">{item.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
