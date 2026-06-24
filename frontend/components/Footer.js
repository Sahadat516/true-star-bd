'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useApp } from './AppContext'
import { Mail, Phone, MapPin, Facebook, MessageCircle, Send, ChevronRight } from 'lucide-react'

export default function Footer() {
  const { language } = useApp()
  const [settings, setSettings] = useState({})

  useEffect(() => {
    fetch('/api/cms/settings').then(r => r.json()).then(d => {
      const s = {}; (d.settings || []).forEach(item => { s[item.key] = item.value })
      setSettings(s)
    }).catch(() => {})
  }, [])

  const t = (key) => {
    const dict = {
      en: { company: 'Company', products: 'Products', support: 'Support', legal: 'Legal', followUs: 'Follow Us', about: 'About Us', contact: 'Contact', blog: 'Blog', reviews: 'Reviews', faq: 'FAQ', allProducts: 'All Products', aiTools: 'AI Tools', subscriptions: 'Subscriptions', giftCards: 'Gift Cards', myAccount: 'My Account', orders: 'Orders', becomeVendor: 'Become a Vendor', terms: 'Terms & Conditions', privacy: 'Privacy Policy', refund: 'Refund Policy', shipping: 'Shipping Policy', rights: 'All rights reserved.' },
      bn: { company: 'কোম্পানি', products: 'পণ্য', support: 'সহায়তা', legal: 'আইনি', followUs: 'আমাদের অনুসরণ করুন', about: 'আমাদের সম্পর্কে', contact: 'যোগাযোগ', blog: 'ব্লগ', reviews: 'রিভিউ', faq: 'জিজ্ঞাসা', allProducts: 'সব পণ্য', aiTools: 'এআই টুলস', subscriptions: 'সাবস্ক্রিপশন', giftCards: 'গিফট কার্ড', myAccount: 'আমার অ্যাকাউন্ট', orders: 'অর্ডার', becomeVendor: 'ব্যবসায়ী হোন', terms: 'শর্তাবলী', privacy: 'গোপনীয়তা নীতি', refund: 'ফেরত নীতি', shipping: 'ডেলিভারি নীতি', rights: 'সমস্ত অধিকার সংরক্ষিত।' },
    }
    return dict[language]?.[key] || dict.en[key] || key
  }

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              {settings.company_logo ? (
                <img src={settings.company_logo} alt="Logo" className="h-10 w-auto" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">TS</span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{settings.company_name || 'TRUE STAR BD'}</h3>
                <p className="text-xs text-gray-400">{settings.company_tagline || 'LIMITED'}</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {settings.company_description || 'Premium digital marketplace for AI tools, software subscriptions, gift cards, and digital services. Trusted by 1000+ customers in Bangladesh and worldwide.'}
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                <span>{settings.company_address || '73, Lion Shopping Complex (1st Floor), Monipuripara, Airport Road, Tejgaon, Dhaka-1215, Bangladesh'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <span>{settings.company_phone || '+880-1812-054785'} | {settings.company_phone2 || '+880-1919-467164'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <span>{settings.company_email || 'truestarbdltd.2018@gmail.com'}</span>
              </div>
            </div>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-5">
              <a href={settings.company_facebook || 'https://www.facebook.com/TrueStarBD'} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={`https://wa.me/${(settings.company_whatsapp || '+8801812054785').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href={`https://t.me/${(settings.company_telegram || '@Sahadat516').replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('company')}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: t('about'), href: '/about' },
                { label: t('contact'), href: '/contact' },
                { label: t('blog'), href: '/blog' },
                { label: t('reviews'), href: '/reviews' },
                { label: t('faq'), href: '/faq' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-primary-400" /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('products')}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: t('allProducts'), href: '/products' },
                { label: t('aiTools'), href: '/category/ai-tools' },
                { label: t('subscriptions'), href: '/category/chatgpt' },
                { label: t('giftCards'), href: '/category/gift-cards' },
                { label: t('becomeVendor'), href: '/signup?role=vendor' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-primary-400" /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">{t('support')}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Help Center', href: '/support' },
                { label: t('myAccount'), href: '/profile' },
                { label: t('orders'), href: '/orders' },
                { label: 'AI Chat Support', href: '#' },
                { label: 'Live Support', href: '/contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-primary-400" /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-white font-semibold mt-6 mb-4">{t('legal')}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: t('terms'), href: '/terms' },
                { label: t('privacy'), href: '/privacy' },
                { label: t('refund'), href: '/refund' },
                { label: t('shipping'), href: '/shipping' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-primary-400" /> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TRUE STAR BD LIMITED. {t('rights')}</p>
          <div className="flex items-center gap-4">
            <span>Trade License: Pending</span>
            <span>|</span>
            <span>DBID: Pending</span>
            <span>|</span>
            <span>Govt. Registered</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
