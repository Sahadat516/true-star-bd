'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppProvider, useApp } from '../components/AppContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ChatWidget from '../components/ChatWidget'
import { Search, Star, TrendingUp, Clock, Shield, Zap, ChevronRight, ArrowRight, Sparkles, ShoppingBag, Users, Award, HeadphonesIcon, Wallet } from 'lucide-react'

function HomeContent() {
  const { language, addToCart } = useApp()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [topVendors, setTopVendors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/products?limit=8&sort=popular').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/products?limit=4').then(r => r.json()),
    ]).then(([productsData, catData, trendingData]) => {
      setFeaturedProducts(productsData.products || [])
      setCategories(catData.categories || [])
      setTrendingProducts(trendingData.products || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const t = (key) => {
    const dict = {
      en: { heroTitle: 'Premium Digital Marketplace', heroSub: 'AI Tools, Subscriptions & Digital Services', heroDesc: 'Buy premium AI tools, software subscriptions, gift cards and digital services. Trusted by 1000+ customers.', searchPlaceholder: 'Search for AI tools, subscriptions...', featured: 'Featured Products', trending: 'Trending Now', categories: 'Shop by Category', whyChoose: 'Why Choose True Star BD', trusted: 'Trusted by Thousands', becomeVendor: 'Sell on True Star BD', becomeVendorDesc: 'Start selling your digital products and subscriptions. Reach thousands of customers.', viewAll: 'View All', addToCart: 'Add to Cart', topVendors: 'Top Vendors', customerSupport: '24/7 Support', customerSupportDesc: 'AI-powered support available 24 hours a day', instantDelivery: 'Instant Delivery', instantDeliveryDesc: 'Get your products immediately after payment', securePayment: 'Secure Payment', securePaymentDesc: 'Multiple payment methods, fully secure', bestPrice: 'Best Price', bestPriceDesc: 'Competitive prices with regular deals' },
      bn: { heroTitle: 'প্রিমিয়াম ডিজিটাল মার্কেটপ্লেস', heroSub: 'এআই টুলস, সাবস্ক্রিপশন ও ডিজিটাল সার্ভিস', heroDesc: 'প্রিমিয়াম এআই টুলস, সফটওয়্যার সাবস্ক্রিপশন, গিফট কার্ড ও ডিজিটাল সার্ভিস কিনুন। ১০০০+ গ্রাহকের আস্থা।', searchPlaceholder: 'এআই টুলস, সাবস্ক্রিপশন অনুসন্ধান...', featured: 'বৈশিষ্ট্যযুক্ত পণ্য', trending: 'ট্রেন্ডিং', categories: 'ক্যাটাগরি অনুযায়ী শপিং', whyChoose: 'কেন TRUE STAR BD বেছে নেবেন', trusted: 'হাজার হাজার গ্রাহকের আস্থা', becomeVendor: 'TRUE STAR BD-তে বিক্রি করুন', becomeVendorDesc: 'আপনার ডিজিটাল পণ্য ও সাবস্ক্রিপশন বিক্রি শুরু করুন। হাজার হাজার গ্রাহকের কাছে পৌঁছান।', viewAll: 'সব দেখুন', addToCart: 'কার্টে যোগ করুন', topVendors: 'শীর্ষ বিক্রেতা', customerSupport: '২৪/৭ সাপোর্ট', customerSupportDesc: 'এআই-চালিত সাপোর্ট ২৪ ঘন্টা', instantDelivery: 'তাত্ক্ষণিক ডেলিভারি', instantDeliveryDesc: 'পেমেন্টের পর সাথে সাথে পণ্য পান', securePayment: 'নিরাপদ পেমেন্ট', securePaymentDesc: 'একাধিক পেমেন্ট পদ্ধতি, সম্পূর্ণ নিরাপদ', bestPrice: 'সেরা মূল্য', bestPriceDesc: 'প্রতিযোগিতামূলক মূল্য ও নিয়মিত অফার' },
    }
    return dict[language]?.[key] || dict.en[key] || key
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />

      <main>
        {/* Hero Section - g2g.com inspired */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
          <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-white/90 text-sm">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>{t('trusted')}</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
                  {t('heroTitle')}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">{t('heroSub')}</span>
                </h1>
                <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto lg:mx-0">{t('heroDesc')}</p>
                {/* Search */}
                <div className="max-w-2xl mx-auto lg:mx-0 mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder={t('searchPlaceholder')}
                      className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 bg-white shadow-xl focus:ring-2 focus:ring-primary-400 outline-none text-lg" />
                  </div>
                </div>
                {/* Quick categories */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            {['ChatGPT', 'Gemini', 'Claude', 'Netflix', 'YouTube Premium', 'Canva', 'Spotify', 'Office 365'].map(cat => (
              <Link key={cat} href={`/products?search=${cat}`}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/80 hover:text-white text-sm transition-all">
                {cat}
              </Link>
            ))}
          </div>
              </div>
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-white/20 transition-all cursor-pointer">
                      <div className="text-3xl mb-2">🤖</div>
                      <h3 className="font-semibold">AI Tools</h3>
                      <p className="text-sm text-white/60">ChatGPT, Gemini, Claude</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-white/20 transition-all cursor-pointer">
                      <div className="text-3xl mb-2">🎮</div>
                      <h3 className="font-semibold">Gaming</h3>
                      <p className="text-sm text-white/60">Coins, Items, Accounts</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-white/20 transition-all cursor-pointer">
                      <div className="text-3xl mb-2">🎁</div>
                      <h3 className="font-semibold">Gift Cards</h3>
                      <p className="text-sm text-white/60">Global gift cards</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-white/20 transition-all cursor-pointer">
                      <div className="text-3xl mb-2">📺</div>
                      <h3 className="font-semibold">Streaming</h3>
                      <p className="text-sm text-white/60">Netflix, YouTube, Spotify</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-white/20 transition-all cursor-pointer">
                      <div className="text-3xl mb-2">💻</div>
                      <h3 className="font-semibold">Software</h3>
                      <p className="text-sm text-white/60">Windows, Office, Antivirus</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-white/20 transition-all cursor-pointer">
                      <div className="text-3xl mb-2">📞</div>
                      <h3 className="font-semibold">Telco</h3>
                      <p className="text-sm text-white/60">Mobile Top-up, eSIM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" fill="currentColor" className="text-gray-50 dark:text-[#0f172a]" />
            </svg>
          </div>
        </section>

        {/* Trust badges */}
        <section className="relative -mt-6 z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Zap, label: t('instantDelivery'), desc: t('instantDeliveryDesc'), color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
              { icon: Shield, label: t('securePayment'), desc: t('securePaymentDesc'), color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
              { icon: HeadphonesIcon, label: t('customerSupport'), desc: t('customerSupportDesc'), color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { icon: Wallet, label: t('bestPrice'), desc: t('bestPriceDesc'), color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            ].map((item, i) => (
              <div key={i} className="card flex items-center gap-3 p-4">
                <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{item.label}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">{t('categories')}</h2>
              <p className="section-subtitle">{categories.length}+ categories to explore</p>
            </div>
            <Link href="/products" className="btn-outline text-sm hidden sm:flex items-center gap-1">
              {t('viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.filter(c => !c.parentId).map(cat => {
              const subs = categories.filter(sub => sub.parentId === cat.id)
              return (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="category-card card-hover p-5 text-center group">
                  <div className="category-icon-wrapper text-4xl mb-3">{cat.icon || '📦'}</div>
                  <h3 className="font-semibold text-sm">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{cat._count?.products || subs.length || 0} items</p>
                  {subs.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700 hidden group-hover:block">
                      <p className="text-[10px] text-primary-500">{subs.slice(0, 3).map(s => s.name).join(', ')}{subs.length > 3 ? '...' : ''}</p>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-gray-100 dark:bg-gray-900/50 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">{t('featured')}</h2>
                <p className="section-subtitle">Most popular digital products</p>
              </div>
              <Link href="/products" className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-1">
                {t('viewAll')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading ? [...Array(4)].map((_, i) => (
                <div key={i} className="card p-0 overflow-hidden">
                  <div className="shimmer h-48 w-full" />
                  <div className="p-4 space-y-3">
                    <div className="shimmer h-4 w-3/4 rounded" />
                    <div className="shimmer h-4 w-1/2 rounded" />
                    <div className="shimmer h-8 w-full rounded" />
                  </div>
                </div>
              )) : featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} language={language} addToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="text-center mb-12">
            <h2 className="section-title">{t('whyChoose')}</h2>
            <p className="section-subtitle max-w-2xl mx-auto">We provide the best digital marketplace experience</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: '100% Genuine Products', desc: 'All products are 100% authentic with warranty' },
              { icon: Zap, title: 'Instant Auto Delivery', desc: 'Get your product details instantly after payment via email and WhatsApp' },
              { icon: Users, title: '5000+ Happy Customers', desc: 'Trusted by thousands of customers across Bangladesh' },
              { icon: Award, title: 'Verified Sellers', desc: 'All vendors are verified with trade licenses' },
              { icon: HeadphonesIcon, title: '24/7 AI Support', desc: 'AI-powered chat support available 24 hours a day' },
              { icon: TrendingUp, title: 'Best Price Guarantee', desc: 'Competitive pricing with regular discounts and offers' },
            ].map((item, i) => (
              <div key={i} className="card-hover p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Become a Vendor CTA */}
        <section className="bg-gradient-to-r from-primary-600 to-accent-600 py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">{t('becomeVendor')}</h2>
              <p className="text-white/80 mb-8">{t('becomeVendorDesc')}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/signup?role=vendor" className="bg-white text-primary-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-xl transition-all shadow-lg">
                  Get Started <ArrowRight className="inline w-4 h-4 ml-1" />
                </Link>
                <Link href="/contact" className="bg-white/10 text-white hover:bg-white/20 font-medium py-3 px-8 rounded-xl transition-all border border-white/30">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget />
    </div>
  )
}

function ProductCard({ product, language, addToCart }) {
  const btnText = language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'
  const price = product.salePrice || product.price
  const oldPrice = product.salePrice ? product.price : null
  const avgRating = product.avgRating || (product.reviews?.length ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length : 0)

  return (
    <div className="card-hover p-0 overflow-hidden group">
      <Link href={`/product/${product.slug}`}>
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center overflow-hidden">
          <div className="text-6xl group-hover:scale-110 transition-transform duration-500">📦</div>
          {product.salePrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{Math.round((1 - product.salePrice / product.price) * 100)}%
            </div>
          )}
          {product.isFeatured && (
            <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> HOT
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/category/${product.category?.slug || ''}`}>
          <p className="text-xs text-primary-600 font-medium mb-1">{product.category?.name || 'Digital Product'}</p>
        </Link>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary-600 transition-colors">{product.name}</h3>
        </Link>
        {avgRating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
            ))}
            <span className="text-xs text-gray-500 ml-1">({product._count?.reviews || 0})</span>
          </div>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-primary-600">৳{price?.toLocaleString()}</span>
          {oldPrice && <span className="text-sm text-gray-400 line-through">৳{oldPrice.toLocaleString()}</span>}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {product.vendor?.businessName || 'TRUE STAR BD'} · <span className="text-green-600">{product._count?.orderItems || 0} sold</span>
        </p>
        <div className="mt-3 flex gap-2">
          <Link href={`/product/${product.slug}`} className="flex-1 text-center btn-secondary text-xs py-2">Details</Link>
          <button onClick={(e) => { e.preventDefault(); addToCart(product, null, 1); }} className="flex-1 btn-primary text-xs py-2">
            {btnText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <AppProvider>
      <HomeContent />
    </AppProvider>
  )
}
