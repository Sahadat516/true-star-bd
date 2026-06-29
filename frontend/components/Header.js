'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useApp } from './AppContext'
import { ShoppingCart, User, Menu, X, ChevronDown, Search, Sun, Moon, Globe, LogOut, LayoutDashboard, Package, Bell, TrendingUp, Grid3X3, Sparkles, MessageCircle } from 'lucide-react'

export default function Header() {
  const { user, vendor, cart, cartCount, theme, language, toggleTheme, changeLanguage, logout } = useApp()
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [showSearch, setShowSearch] = useState(false)
  const [siteSettings, setSiteSettings] = useState({})
  const [activeMega, setActiveMega] = useState(null)
  const searchRef = useRef(null)
  const userMenuRef = useRef(null)
  const megaTimeout = useRef(null)

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || [])).catch(() => {})
    fetch('/api/cms/settings').then(r => r.json()).then(d => {
      const s = {}; (d.settings || []).forEach(item => { s[item.key] = item.value })
      setSiteSettings(s)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (searchQuery.length > 1) {
      fetch(`/api/products?search=${searchQuery}&limit=5`).then(r => r.json()).then(d => setSearchResults(d.products || [])).catch(() => {})
    } else setSearchResults([])
  }, [searchQuery])

  const langs = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'ar', name: 'Arabic', native: 'العربية' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'es', name: 'Spanish', native: 'Español' },
  ]

  const t = (key) => {
    const translations = {
      en: { search: 'Search products...', cart: 'Cart', signIn: 'Sign In', signUp: 'Sign Up', myAccount: 'My Account', dashboard: 'Dashboard', myOrders: 'My Orders', chat: 'Chat', becomeVendor: 'Sell on TSBD', support: 'Support', allCat: 'All Categories', trending: 'Trending', topUp: 'Top Up', bestSellers: 'Best Sellers', newArrivals: 'New Arrivals' },
      bn: { search: 'পণ্য অনুসন্ধান...', cart: 'কার্ট', signIn: 'সাইন ইন', signUp: 'নিবন্ধন', myAccount: 'আমার অ্যাকাউন্ট', dashboard: 'ড্যাশবোর্ড', myOrders: 'আমার অর্ডার', chat: 'চ্যাট', becomeVendor: 'TSBD-তে বিক্রি করুন', support: 'সাহায্য', allCat: 'সব ক্যাটাগরি', trending: 'ট্রেন্ডিং', topUp: 'টপ আপ', bestSellers: 'বেস্ট সেলার', newArrivals: 'নতুন' },
    }
    return translations[language]?.[key] || translations.en[key] || key
  }

  const topCats = categories.filter(c => !c.parentId)

  const catIcons = {
    'Gift Cards': '🎁', 'Games': '🎮', 'Game coins': '🪙', 'Items': '💎', 'Accounts': '👤',
    'Skins': '🎨', 'Boosting': '⚡', 'Game Coaching': '🎯', 'GamePal': '🤝',
    'Telco': '📱', 'Top Up': '🔋', 'Software & Apps': '💻', 'Payment Cards': '💳',
    'Digital Products': '📦',
  }

  const catColors = {
    'Gift Cards': '#2EBDB5', 'Games': '#39BBD8', 'Game coins': '#C8A800', 'Items': '#7774FF',
    'Accounts': '#3092EB', 'Skins': '#C76EFE', 'Boosting': '#FFC600', 'Game Coaching': '#3FE7A0',
    'GamePal': '#F070D4', 'Telco': '#F05F81', 'Top Up': '#6FB935', 'Software & Apps': '#F68500',
    'Payment Cards': '#7B03DA', 'Digital Products': '#F03827',
  }

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#0a0a0b] border-b border-gray-100 dark:border-gray-800 shadow-sm">
      {/* Top bar */}
      <div className="hidden lg:flex bg-gray-50 dark:bg-[#111113] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <Sparkles className="w-3 h-3 text-primary-500" />
            <span>Premium Digital Marketplace — AI Tools, Gift Cards, Gaming & more</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/support" className="hover:text-gray-700 dark:hover:text-gray-200">Help Center</Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span>Support: {siteSettings.company_phone || '+880-1812-054785'}</span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200">
                <Globe className="w-3 h-3" />
                <span>{langs.find(l => l.code === language)?.native || 'English'}</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[140px] z-50 animate-fade-in">
                  {langs.map(l => (
                    <button key={l.code} onClick={() => { changeLanguage(l.code); setLangMenuOpen(false) }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-800 ${language === l.code ? 'text-primary-600 font-semibold bg-primary-50 dark:bg-primary-900/20' : ''}`}>
                      {l.native} <span className="text-gray-400">({l.name})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={toggleTheme} className="hover:text-gray-700 dark:hover:text-gray-200 p-1">
              {theme === 'dark' ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            {siteSettings.company_logo ? (
              <img src={siteSettings.company_logo} alt="Logo" className="h-8 lg:h-10 w-auto" />
            ) : (
              <div className="relative">
                <div className="w-9 h-9 lg:w-11 lg:h-11 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-all">
                  <span className="text-white font-extrabold text-sm lg:text-base tracking-tight">TS</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white dark:border-[#0a0a0b]"></div>
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">{siteSettings.company_name || 'TRUE STAR BD'}</h1>
              <p className="text-[10px] lg:text-[11px] text-gray-400 -mt-0.5 tracking-wide uppercase font-medium">{siteSettings.company_tagline || 'PREMIUM DIGITAL MARKETPLACE'}</p>
            </div>
          </Link>

          {/* Search bar - desktop */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-6 relative" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('search')}
                className="w-full pl-11 pr-12 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#131316] focus:bg-white dark:focus:bg-[#1a1a1e] focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all text-sm" />
              {searchQuery.length > 0 && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-[#131316] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 animate-fade-in">
                <div className="p-2">
                  {searchResults.map(p => (
                    <Link key={p.id} href={`/product/${p.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center text-lg shrink-0">
                        {p.image ? <img src={p.image} className="w-full h-full object-contain rounded-xl" /> : '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{p.name}</p>
                        <p className="text-xs text-gray-500">from <span className="font-medium text-primary-600">৳{p.salePrice || p.price}</span> · {p.vendor?.businessName || 'TSBD'}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-300 -rotate-90 shrink-0" />
                    </Link>
                  ))}
                </div>
                <Link href={`/products?search=${searchQuery}`}
                  className="block text-center py-3 text-sm font-medium text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800">
                  View all {searchResults.length}+ results for &quot;{searchQuery}&quot;
                </Link>
              </div>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Search mobile */}
            <button onClick={() => setShowSearch(!showSearch)} className="lg:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Trending */}
            <Link href="/products?sort=popular" className="hidden lg:flex items-center gap-1.5 p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden xl:inline">{t('trending')}</span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors group">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-primary-500/30">{cartCount > 9 ? '9+' : cartCount}</span>
              )}
            </Link>

            {/* Notifications */}
            {user && (
              <button className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            )}

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {user.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-[#131316] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 z-50 animate-fade-in">
                    <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-bold">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 dark:bg-primary-900/20 rounded-full text-[10px] font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wider">
                        {user.role}
                      </div>
                    </div>
                    <div className="p-2">
                      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <User className="w-4 h-4 text-gray-400" /> {t('myAccount')}
                      </Link>
                      <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <Package className="w-4 h-4 text-gray-400" /> {t('myOrders')}
                      </Link>
                      <Link href="/chat" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <MessageCircle className="w-4 h-4 text-gray-400" /> {t('chat')}
                      </Link>
                      {user.role === 'VENDOR' && vendor && (
                        <Link href="/vendor/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-gray-400" /> Vendor Dashboard
                        </Link>
                      )}
                      {['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(user.role) && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-gray-400" /> Admin Panel
                        </Link>
                      )}
                    </div>
                    <hr className="mx-2 border-gray-100 dark:border-gray-800" />
                    <div className="p-2">
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 w-full transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signin" className="hidden sm:inline-flex btn-secondary text-sm py-2 px-4">Sign In</Link>
                <Link href="/signup" className="btn-primary text-sm py-2 px-4 shadow-lg shadow-primary-500/20">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Navigation - G2G Mega Menu Style */}
      <div className="hidden lg:block bg-white dark:bg-[#0a0a0b] border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-0">
            {/* All Categories button */}
            <div className="relative group">
              <button
                onMouseEnter={() => { clearTimeout(megaTimeout.current); setActiveMega('all') }}
                onMouseLeave={() => { megaTimeout.current = setTimeout(() => setActiveMega(null), 150) }}
                className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-t-lg transition-colors uppercase tracking-wider">
                <Grid3X3 className="w-3.5 h-3.5" />
                {t('allCat')}
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Category items */}
            {topCats.slice(0, 7).map(cat => (
              <div key={cat.id} className="relative group"
                onMouseEnter={() => { clearTimeout(megaTimeout.current); setActiveMega(cat.id) }}
                onMouseLeave={() => { megaTimeout.current = setTimeout(() => setActiveMega(null), 150) }}>
                <Link href={`/category/${cat.slug}`}
                  className="flex items-center gap-1.5 px-3 py-3 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all whitespace-nowrap border-b-2 border-transparent hover:border-primary-500">
                  <span>{catIcons[cat.name] || cat.icon || '📦'}</span>
                  <span>{cat.name}</span>
                </Link>
              </div>
            ))}

            <Link href="/products" className="ml-auto flex items-center gap-1 px-3 py-3 text-xs font-medium text-primary-600 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all whitespace-nowrap">
              View All <ChevronDown className="w-3 h-3 -rotate-90" />
            </Link>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        {(activeMega === 'all' || topCats.some(c => c.id === activeMega)) && (
          <div className="absolute left-0 right-0 bg-white dark:bg-[#131316] shadow-2xl border-b border-gray-100 dark:border-gray-800 z-50 animate-fade-in"
            onMouseEnter={() => clearTimeout(megaTimeout.current)}
            onMouseLeave={() => { megaTimeout.current = setTimeout(() => setActiveMega(null), 200) }}>
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-4 gap-6">
                {(activeMega === 'all' ? topCats : [categories.find(c => c.id === activeMega)]).filter(Boolean).map(cat => {
                  const subs = categories.filter(sub => sub.parentId === cat.id)
                  const color = catColors[cat.name] || '#25D366'
                  return (
                    <div key={cat.id} className="group/cat">
                      <Link href={`/category/${cat.slug}`} className="flex items-center gap-3 mb-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: color + '20' }}>
                          <span>{catIcons[cat.name] || cat.icon || '📦'}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-sm group-hover/cat:text-primary-600 transition-colors">{cat.name}</h3>
                          <p className="text-[11px] text-gray-500">{cat._count?.products || cat.total_products || subs.length || 0} products</p>
                        </div>
                      </Link>
                      {subs.length > 0 && (
                        <div className="ml-2 pl-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-1">
                          {subs.slice(0, 6).map(sub => (
                            <Link key={sub.id} href={`/category/${sub.slug}`}
                              className="block text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 py-1.5 transition-colors">
                              {sub.name}
                            </Link>
                          ))}
                          {subs.length > 6 && (
                            <Link href={`/category/${cat.slug}`} className="block text-xs font-medium text-primary-600 hover:text-primary-700 py-1.5">
                              View all {subs.length} subcategories →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>🔥 <strong className="text-gray-700 dark:text-gray-300">1,247</strong> products available</span>
                  <span>🏪 <strong className="text-gray-700 dark:text-gray-300">50+</strong> verified sellers</span>
                  <span>⚡ <strong className="text-gray-700 dark:text-gray-300">Instant</strong> delivery</span>
                </div>
                <Link href="/products" className="btn-primary text-xs py-2 px-5">Browse All Products</Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile search */}
      {showSearch && (
        <div className="lg:hidden px-4 pb-3 animate-fade-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('search')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#131316] focus:ring-2 focus:ring-primary-500/30 outline-none text-sm" />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0a0a0b] animate-fade-in max-h-[calc(100vh-64px)] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <select value={language} onChange={e => changeLanguage(e.target.value)} className="text-sm bg-transparent outline-none flex-1">
                {langs.map(l => <option key={l.code} value={l.code}>{l.native} ({l.name})</option>)}
              </select>
              <button onClick={toggleTheme} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            <Link href="/products" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 text-sm font-medium">
              <Grid3X3 className="w-4 h-4 text-primary-500" /> All Products
            </Link>

            {topCats.slice(0, 8).map(cat => (
              <div key={cat.id}>
                <Link href={`/category/${cat.slug}`} onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 text-sm">
                  <span>{catIcons[cat.name] || cat.icon || '📦'}</span>
                  {cat.name}
                  <span className="ml-auto text-[10px] text-gray-400">{cat._count?.products || 0}</span>
                </Link>
              </div>
            ))}

            <hr className="my-2 border-gray-100 dark:border-gray-800" />

            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 text-sm">
                  <User className="w-4 h-4 text-gray-400" /> {t('myAccount')}
                </Link>
                <Link href="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 text-sm">
                  <Package className="w-4 h-4 text-gray-400" /> {t('myOrders')}
                </Link>
                <Link href="/chat" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 text-sm">
                  <MessageCircle className="w-4 h-4 text-gray-400" /> {t('chat')}
                </Link>
                {['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(user.role) && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 text-sm">
                    <LayoutDashboard className="w-4 h-4 text-gray-400" /> Admin Panel
                  </Link>
                )}
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10 text-red-600 text-sm w-full">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-primary-600">Sign In</Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm btn-primary">Sign Up</Link>
              </>
            )}

            <hr className="my-2 border-gray-100 dark:border-gray-800" />
            <Link href="/support" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-gray-500">Help Center</Link>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-gray-500">About Us</Link>
          </div>
        </div>
      )}
    </header>
  )
}
