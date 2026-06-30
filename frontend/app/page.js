'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useApp } from '../components/AppContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ChatWidget from '../components/ChatWidget'
import BackToTop from '../components/BackToTop'
import G2GProductCard, { G2GProductSkeleton } from '../components/G2GProductCard'
import { Search, Star, TrendingUp, Clock, Shield, Zap, ChevronRight, ArrowRight, Sparkles, ShoppingBag, Users, Award, HeadphonesIcon, Wallet, ChevronLeft, CheckCircle, Truck, BadgeCheck, BarChart3, Gem, Gamepad2, Gift, Monitor, Smartphone, Globe2, Lock, MessageCircle, Tag, Flame, Eye, Heart } from 'lucide-react'

function HomeContent() {
  const { language, addToCart } = useApp()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/products?limit=12&sort=popular').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/products?limit=6&sort=popular').then(r => r.json()),
      fetch('/api/products?limit=20').then(r => r.json()),
    ]).then(([popularData, catData, trendingData, allData]) => {
      setFeaturedProducts(popularData.products || [])
      setCategories(catData.categories || [])
      setTrendingProducts(trendingData.products || [])
      setAllProducts(allData.products || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const t = (key) => {
    const dict = {
      en: {
        heroTitle: 'Premium Digital Marketplace',
        heroSub: 'AI Tools, Gift Cards, Gaming & Software',
        heroDesc: 'Buy premium digital products from verified sellers. Fast delivery, best prices, secure payments.',
        searchPlaceholder: 'Search for AI tools, gift cards, game items...',
        featured: 'Featured Products',
        trending: 'Trending Now',
        categories: 'Browse by Category',
        whyChoose: 'Why Choose TRUE STAR BD',
        trusted: 'Trusted by 1000+ Customers',
        becomeVendor: 'Start Selling on TRUE STAR BD',
        becomeVendorDesc: 'List your digital products and reach thousands of buyers. Join our growing community of verified sellers.',
        viewAll: 'View All',
        addToCart: 'Add to Cart',
        topVendors: 'Top Vendors',
        customerSupport: '24/7 Support',
        customerSupportDesc: 'AI-powered support available 24 hours a day',
        instantDelivery: 'Instant Delivery',
        instantDeliveryDesc: 'Get your products immediately after payment',
        securePayment: 'Secure Payment',
        securePaymentDesc: '12+ payment methods, fully secure',
        bestPrice: 'Best Price',
        bestPriceDesc: 'Competitive prices with regular deals',
        topCategories: 'Top Categories',
        popularProducts: 'Popular Products',
        newArrivals: 'New Arrivals',
        bestSellers: 'Best Sellers',
        whyTitle1: '100% Genuine Products',
        whyDesc1: 'All products are verified and authentic with warranty',
        whyTitle2: 'Instant Auto Delivery',
        whyDesc2: 'Get product details instantly via email & WhatsApp',
        whyTitle3: '5000+ Happy Customers',
        whyDesc3: 'Trusted by thousands across Bangladesh & worldwide',
        whyTitle4: 'Verified Sellers Only',
        whyDesc4: 'All vendors verified with trade licenses & NID',
        whyTitle5: '24/7 AI Support',
        whyDesc5: 'Smart AI chat support in Bengali & English',
        whyTitle6: 'Best Price Guarantee',
        whyDesc6: 'Competitive pricing with regular discounts',
        hotDeal: 'HOT',
        freeDelivery: 'Free Delivery',
        cashback: 'Cashback',
        specialOffer: 'Special Offer',
      },
      bn: {
        heroTitle: 'প্রিমিয়াম ডিজিটাল মার্কেটপ্লেস',
        heroSub: 'এআই টুলস, গিফট কার্ড, গেমিং ও সফটওয়্যার',
        heroDesc: 'ভেরিফাইড বিক্রেতাদের কাছ থেকে প্রিমিয়াম ডিজিটাল পণ্য কিনুন। দ্রুত ডেলিভারি, সেরা দাম, নিরাপদ পেমেন্ট।',
        searchPlaceholder: 'এআই টুলস, গিফট কার্ড, গেম আইটেম অনুসন্ধান...',
        featured: 'বৈশিষ্ট্যযুক্ত পণ্য',
        trending: 'ট্রেন্ডিং',
        categories: 'ক্যাটাগরি অনুযায়ী ব্রাউজ করুন',
        whyChoose: 'কেন TRUE STAR BD বেছে নেবেন',
        trusted: '১০০০+ গ্রাহকের আস্থা',
        becomeVendor: 'TRUE STAR BD-তে বিক্রি শুরু করুন',
        becomeVendorDesc: 'আপনার ডিজিটাল পণ্য তালিকাভুক্ত করুন এবং হাজার হাজার ক্রেতার কাছে পৌঁছান।',
        viewAll: 'সব দেখুন',
        addToCart: 'কার্টে যোগ করুন',
        topCategories: 'শীর্ষ ক্যাটাগরি',
        popularProducts: 'জনপ্রিয় পণ্য',
        newArrivals: 'নতুন পণ্য',
        bestSellers: 'বেস্ট সেলার',
        hotDeal: 'হট',
        freeDelivery: 'ফ্রি ডেলিভারি',
        cashback: 'ক্যাশব্যাক',
        specialOffer: 'স্পেশাল অফার',
      },
    }
    return dict[language]?.[key] || dict.en[key] || key
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0b]">
      <Header />

      <main>
        {/* ===== HERO SECTION - G2G Style ===== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-accent-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}></div>

          <div className="max-w-7xl mx-auto px-4 pt-12 pb-20 lg:pt-20 lg:pb-28 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-white/90 text-sm border border-white/10">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span>{t('trusted')}</span>
                  <span className="w-1 h-1 bg-white/30 rounded-full"></span>
                  <span className="text-primary-300">50+ Verified Sellers</span>
                </div>

                <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
                  {t('heroTitle')}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-primary-300 to-emerald-300 mt-1">{t('heroSub')}</span>
                </h1>

                <p className="text-lg text-white/60 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">{t('heroDesc')}</p>

                {/* Search */}
                <div className="max-w-2xl mx-auto lg:mx-0 mb-8">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition-all"></div>
                    <div className="relative flex">
                      <div className="relative flex-1">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder={t('searchPlaceholder')}
                          className="w-full pl-14 pr-4 py-4 rounded-l-2xl text-gray-900 bg-white shadow-2xl focus:ring-2 focus:ring-primary-500 outline-none text-base" />
                      </div>
                      <button className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 rounded-r-2xl transition-all flex items-center gap-2 shadow-lg">
                        <Search className="w-5 h-5" />
                        <span className="hidden sm:inline">Search</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick category pills */}
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {[
                    { name: 'ChatGPT', icon: '🤖' },
                    { name: 'Netflix', icon: '📺' },
                    { name: 'Canva Pro', icon: '🎨' },
                    { name: 'Steam Wallet', icon: '🎮' },
                    { name: 'Spotify', icon: '🎵' },
                    { name: 'YouTube', icon: '▶️' },
                    { name: 'Gaming', icon: '🕹️' },
                    { name: 'Gift Cards', icon: '🎁' },
                  ].map(cat => (
                    <Link key={cat.name} href={`/products?search=${encodeURIComponent(cat.name)}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white/80 hover:text-white text-xs transition-all border border-white/10">
                      <span>{cat.icon}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right - Category Cards Grid */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Link href="/category/gift-cards" className="block group">
                      <div className="g2g-category-card min-h-[160px]" style={{ background: 'linear-gradient(135deg, #2EBDB5, #1a8a82)' }}>
                        <div className="text-4xl mb-2">🎁</div>
                        <h3 className="font-bold text-lg">Gift Cards</h3>
                        <p className="text-sm text-white/70">Steam, Google Play, Netflix & more</p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-white/60 group-hover:text-white transition-colors">
                          Shop now <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                    <Link href="/category/game-coins" className="block group">
                      <div className="g2g-category-card min-h-[140px]" style={{ background: 'linear-gradient(135deg, #C8A800, #967800)' }}>
                        <div className="text-4xl mb-2">🪙</div>
                        <h3 className="font-bold text-lg">Game Coins</h3>
                        <p className="text-sm text-white/70">FC 25, PUBG, Free Fire</p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-white/60 group-hover:text-white transition-colors">
                          Shop now <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="space-y-4 mt-8">
                    <Link href="/category/ai-tools" className="block group">
                      <div className="g2g-category-card min-h-[150px]" style={{ background: 'linear-gradient(135deg, #7774FF, #5a57cc)' }}>
                        <div className="text-4xl mb-2">🤖</div>
                        <h3 className="font-bold text-lg">AI Tools</h3>
                        <p className="text-sm text-white/70">ChatGPT, Gemini, Claude Pro</p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-white/60 group-hover:text-white transition-colors">
                          Shop now <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                    <Link href="/category/software-apps" className="block group">
                      <div className="g2g-category-card min-h-[140px]" style={{ background: 'linear-gradient(135deg, #F68500, #c46a00)' }}>
                        <div className="text-4xl mb-2">💻</div>
                        <h3 className="font-bold text-lg">Software</h3>
                        <p className="text-sm text-white/70">Windows, Office, Antivirus</p>
                        <div className="mt-2 flex items-center gap-1 text-xs text-white/60 group-hover:text-white transition-colors">
                          Shop now <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 48V24C240 8 480 0 720 8C960 16 1200 24 1440 16V48H0Z" fill="currentColor" className="text-white dark:text-[#0a0a0b]" />
            </svg>
          </div>
        </section>

        {/* ===== TRUST BADGES ===== */}
        <section className="relative -mt-6 z-10 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Zap, label: t('instantDelivery'), desc: t('instantDeliveryDesc'), color: 'from-yellow-400 to-orange-500', bg: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' },
              { icon: Shield, label: t('securePayment'), desc: t('securePaymentDesc'), color: 'from-green-400 to-emerald-500', bg: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' },
              { icon: HeadphonesIcon, label: t('customerSupport'), desc: t('customerSupportDesc'), color: 'from-blue-400 to-indigo-500', bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' },
              { icon: Wallet, label: t('bestPrice'), desc: t('bestPriceDesc'), color: 'from-purple-400 to-pink-500', bg: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20' },
            ].map((item, i) => (
              <div key={i} className="card-hover flex items-center gap-4 p-4 lg:p-5">
                <div className={`w-12 h-12 ${item.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                  <div className={`w-6 h-6 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                    <item.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm">{item.label}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== TOP CATEGORIES ===== */}
        <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">{t('categories')}</h2>
              <p className="section-subtitle">Explore our wide range of digital products</p>
            </div>
            <Link href="/categories" className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
              {t('viewAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: 'Gift Cards', icon: '🎁', color: '#2EBDB5', slug: 'gift-cards', count: '1K+', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
              { name: 'Games', icon: '🎮', color: '#39BBD8', slug: 'video-games', count: '3K+', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
              { name: 'Game Coins', icon: '🪙', color: '#C8A800', slug: 'game-coins', count: '472', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
              { name: 'Items', icon: '💎', color: '#7774FF', slug: 'items', count: '589', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
              { name: 'Accounts', icon: '👤', color: '#3092EB', slug: 'accounts', count: '4K+', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { name: 'Skins', icon: '🎨', color: '#C76EFE', slug: 'skins', count: '3', bg: 'bg-purple-50 dark:bg-purple-900/20' },
              { name: 'Boosting', icon: '⚡', color: '#FFC600', slug: 'boosting', count: '781', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { name: 'Software', icon: '💻', color: '#F68500', slug: 'software', count: '1.2K+', bg: 'bg-orange-50 dark:bg-orange-900/20' },
              { name: 'Coaching', icon: '🎯', color: '#3FE7A0', slug: 'game-coaching', count: '42', bg: 'bg-green-50 dark:bg-green-900/20' },
              { name: 'Telco', icon: '📱', color: '#F05F81', slug: 'mobile-recharge', count: '534', bg: 'bg-rose-50 dark:bg-rose-900/20' },
            ].map(cat => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="group">
                <div className="card-hover p-5 text-center">
                  <div className="category-icon-wrapper mb-3 transition-transform group-hover:scale-110" style={{ backgroundColor: cat.color + '20' }}>
                    <span className="text-3xl">{cat.icon}</span>
                  </div>
                  <h3 className="font-bold text-sm group-hover:text-primary-600 transition-colors">{cat.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">{cat.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== FEATURED / POPULAR PRODUCTS ===== */}
        <section className="bg-gray-50 dark:bg-[#0d0d10] py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="section-title">{t('popularProducts')}</h2>
                <div className="hidden sm:flex items-center gap-1 text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full font-medium">
                  <Flame className="w-3 h-3" /> Top Rated
                </div>
              </div>
              <Link href="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                {t('viewAll')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {loading ? [...Array(8)].map((_, i) => (
                <G2GProductSkeleton key={i} />
              )) : featuredProducts.map(product => (
                <G2GProductCard key={product.id} product={product} language={language} addToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>

        {/* ===== TRENDING NOW ===== */}
        {trendingProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-primary-600" />
                <h2 className="section-title">{t('trending')}</h2>
              </div>
              <Link href="/products?sort=popular" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                {t('viewAll')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {trendingProducts.slice(0, 6).map(product => (
                <div key={product.id} className="group">
                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="card-hover p-4 text-center">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                        {product.image ? <img src={product.image} className="w-full h-full object-contain p-1 rounded-2xl" /> : '📦'}
                      </div>
                      <h3 className="font-semibold text-xs line-clamp-2 mb-1">{product.name}</h3>
                      <div className="text-primary-600 font-bold text-sm">৳{product.salePrice || product.price}</div>
                      <p className="text-[10px] text-gray-400 mt-1">{product._count?.orderItems || 0} sold</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===== WHY CHOOSE US ===== */}
        <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0d0d10] dark:to-[#0a0a0b] py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 rounded-full px-5 py-1.5 text-primary-700 dark:text-primary-400 text-sm font-medium mb-4">
                <BadgeCheck className="w-4 h-4" /> Why Choose Us
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight">{t('whyChoose')}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-2xl mx-auto">We provide the best digital marketplace experience with verified sellers and instant delivery</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: BadgeCheck, title: '100% Genuine Products', desc: 'All products are 100% authentic with warranty. Every item is verified before listing.' },
                { icon: Zap, title: 'Instant Auto Delivery', desc: 'Get your product details instantly after payment via email, WhatsApp & SMS.' },
                { icon: Users, title: '5000+ Happy Customers', desc: 'Trusted by thousands of customers across Bangladesh and worldwide.' },
                { icon: Award, title: 'Verified Sellers Only', desc: 'All vendors are verified with trade licenses, NID & business documents.' },
                { icon: HeadphonesIcon, title: '24/7 AI-Powered Support', desc: 'Smart AI chat support available 24 hours in Bengali & English languages.' },
                { icon: TrendingUp, title: 'Best Price Guarantee', desc: 'Competitive pricing with regular discounts, cashback offers and deals.' },
              ].map((item, i) => (
                <div key={i} className="card-hover p-6 flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== BECOME A VENDOR CTA ===== */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-700 via-primary-600 to-accent-600"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M0 0h40v40H0V0zm20 20h20v20H20V20z\'/%3E%3C/g%3E%3C/svg%3E")',
          }}></div>
          <div className="max-w-7xl mx-auto px-4 py-16 lg:py-20 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 text-white/80 text-sm border border-white/10">
                  <ShoppingBag className="w-4 h-4" /> Vendor Program
                </div>
                <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">{t('becomeVendor')}</h2>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">{t('becomeVendorDesc')}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/signup?role=vendor" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-gray-100 font-bold py-3.5 px-8 rounded-2xl transition-all shadow-2xl">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link href="/contact" className="inline-flex items-center gap-2 bg-white/10 text-white hover:bg-white/20 font-semibold py-3.5 px-8 rounded-2xl transition-all border border-white/20 backdrop-blur-sm">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-white border border-white/10">
                  <div className="text-3xl mb-2">💰</div>
                  <div className="text-2xl font-bold">15-Day</div>
                  <div className="text-sm text-white/60">Settlement Cycle</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-white border border-white/10 mt-6">
                  <div className="text-3xl mb-2">📈</div>
                  <div className="text-2xl font-bold">10%</div>
                  <div className="text-sm text-white/60">Commission Only</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-white border border-white/10 -mt-6">
                  <div className="text-3xl mb-2">🌍</div>
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-sm text-white/60">Active Buyers</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-white border border-white/10">
                  <div className="text-3xl mb-2">🛡️</div>
                  <div className="text-2xl font-bold">Free</div>
                  <div className="text-sm text-white/60">Listing & Registration</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget />
      <BackToTop />
    </div>
  )
}

/* ===== G2G-STYLE PRODUCT CARD ===== */
export default function HomePage() {
  return <HomeContent />
}
