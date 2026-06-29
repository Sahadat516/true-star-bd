'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useApp } from './AppContext'
import { Mail, Phone, MapPin, Facebook, MessageCircle, Send, ChevronRight, Shield, Zap, Globe, Heart, Sparkles } from 'lucide-react'

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
      en: {
        company: 'Company', products: 'Products', support: 'Support', legal: 'Legal', followUs: 'Follow Us',
        about: 'About Us', contact: 'Contact', blog: 'Blog', reviews: 'Reviews', faq: 'FAQ',
        allProducts: 'All Products', aiTools: 'AI Tools', subscriptions: 'Subscriptions', giftCards: 'Gift Cards',
        myAccount: 'My Account', orders: 'Orders', becomeVendor: 'Sell on TSBD',
        terms: 'Terms & Conditions', privacy: 'Privacy Policy', refund: 'Refund Policy', shipping: 'Delivery Policy',
        rights: 'All rights reserved.', helpCenter: 'Help Center', liveSupport: 'Live Support',
        marketplace: 'Marketplace', sellers: 'Sellers', popular: 'Popular',
        paymentMethods: 'Payment Methods', trust: 'Trust & Safety',
      },
      bn: {
        company: 'কোম্পানি', products: 'পণ্য', support: 'সহায়তা', legal: 'আইনি', followUs: 'অনুসরণ করুন',
        about: 'আমাদের সম্পর্কে', contact: 'যোগাযোগ', blog: 'ব্লগ', reviews: 'রিভিউ', faq: 'জিজ্ঞাসা',
        allProducts: 'সব পণ্য', aiTools: 'এআই টুলস', subscriptions: 'সাবস্ক্রিপশন', giftCards: 'গিফট কার্ড',
        myAccount: 'আমার অ্যাকাউন্ট', orders: 'অর্ডার', becomeVendor: 'TSBD-তে বিক্রি করুন',
        terms: 'শর্তাবলী', privacy: 'গোপনীয়তা নীতি', refund: 'ফেরত নীতি', shipping: 'ডেলিভারি নীতি',
        rights: 'সমস্ত অধিকার সংরক্ষিত।', helpCenter: 'সাহায্য কেন্দ্র',
      },
    }
    return dict[language]?.[key] || dict.en[key] || key
  }

  return (
    <footer className="bg-gray-950 dark:bg-black text-gray-400 border-t border-gray-800">
      {/* Top CTA */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary-500" />
            <p className="text-sm text-gray-300">Want to sell digital products? <span className="text-white font-semibold">Join 50+ verified sellers</span> on TRUE STAR BD</p>
          </div>
          <Link href="/signup?role=vendor" className="btn-primary text-xs py-2.5 px-6 whitespace-nowrap shadow-lg shadow-primary-500/20">
            {t('becomeVendor')} <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Company info - 2 cols */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              {settings.company_logo ? (
                <img src={settings.company_logo} alt="Logo" className="h-9 w-auto" />
              ) : (
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <span className="text-white font-extrabold text-sm">TS</span>
                  </div>
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-gray-950"></div>
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{settings.company_name || 'TRUE STAR BD'}</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{settings.company_tagline || 'PREMIUM DIGITAL MARKETPLACE'}</p>
              </div>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-md">
              {settings.company_description || 'Premium digital marketplace for AI tools, gift cards, gaming items, software subscriptions and more. Trusted by 1000+ customers in Bangladesh and worldwide.'}
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-500 shrink-0" />
                <span className="text-gray-500">{settings.company_address || '73, Lion Shopping Complex (1st Floor), Monipuripara, Airport Road, Tejgaon, Dhaka-1215, Bangladesh'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                <div className="text-gray-500">
                  <span>{settings.company_phone || '+880-1812-054785'}</span>
                  <span className="mx-2 text-gray-700">|</span>
                  <span>{settings.company_phone2 || '+880-1919-467164'}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                <div className="text-gray-500">
                  <span>{settings.company_email || 'truestarbdltd.2018@gmail.com'}</span>
                  <span className="mx-2 text-gray-700">|</span>
                  <span>{settings.company_email2 || 'sahadat516@gmail.com'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <a href={settings.company_facebook || 'https://www.facebook.com/TrueStarBD'} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all hover:shadow-lg hover:shadow-primary-500/20">
                <Facebook className="w-4 h-4 text-gray-300" />
              </a>
              <a href={`https://wa.me/${(settings.company_whatsapp || '+8801812054785').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-xl flex items-center justify-center transition-all hover:shadow-lg hover:shadow-green-500/20">
                <MessageCircle className="w-4 h-4 text-gray-300" />
              </a>
              <a href={`https://t.me/${(settings.company_telegram || '@Sahadat516').replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 hover:bg-sky-600 rounded-xl flex items-center justify-center transition-all hover:shadow-lg hover:shadow-sky-500/20">
                <Send className="w-4 h-4 text-gray-300" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{t('company')}</h4>
            <ul className="space-y-2.5">
              {[
                { label: t('about'), href: '/about' }, { label: t('contact'), href: '/contact' },
                { label: t('blog'), href: '/blog' }, { label: t('faq'), href: '/faq' },
                { label: t('reviews'), href: '/reviews' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{t('support')}</h4>
            <ul className="space-y-2.5">
              {[
                { label: t('helpCenter'), href: '/support' }, { label: t('myAccount'), href: '/profile' },
                { label: t('orders'), href: '/orders' }, { label: 'AI Chat', href: '#' },
                { label: t('liveSupport'), href: '/contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">{t('legal')}</h4>
            <ul className="space-y-2.5">
              {[
                { label: t('terms'), href: '/terms' }, { label: t('privacy'), href: '/privacy' },
                { label: t('refund'), href: '/refund' }, { label: t('shipping'), href: '/shipping' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="text-white font-bold text-sm mt-6 mb-4 uppercase tracking-wider">{t('products')}</h4>
            <ul className="space-y-2.5">
              {[
                { label: t('allProducts'), href: '/products' }, { label: 'Gift Cards', href: '/category/gift-cards' },
                { label: 'Games', href: '/category/video-games' }, { label: 'Accounts', href: '/category/accounts' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar - G2G Style */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} TRUE STAR BD LIMITED. {t('rights')}</p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1 text-green-500 font-medium">
              <Shield className="w-3 h-3" /> Government Registered
            </span>
            <span className="text-gray-700">|</span>
            <span>Trade License: <strong className="text-gray-400">TRAD/DNCC/090575/2022</strong></span>
            <span className="text-gray-700">|</span>
            <span>Company: <strong className="text-gray-400">C-145542/2018</strong></span>
            <span className="text-gray-700">|</span>
            <span>VAT: <strong className="text-gray-400">001402868-0402</strong></span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Globe className="w-3 h-3" />
            <span>Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
