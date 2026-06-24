'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useApp } from './AppContext'
import { ShoppingCart, User, Menu, X, ChevronDown, Search, Sun, Moon, Globe, LogOut, LayoutDashboard, Package, Bell } from 'lucide-react'

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
  const searchRef = useRef(null)
  const userMenuRef = useRef(null)

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
      en: { search: 'Search products...', cart: 'Cart', signIn: 'Sign In', signUp: 'Sign Up', myAccount: 'My Account', dashboard: 'Dashboard', myOrders: 'My Orders', becomeVendor: 'Become a Vendor', support: 'Support' },
      bn: { search: 'পণ্য অনুসন্ধান...', cart: 'কার্ট', signIn: 'সাইন ইন', signUp: 'নিবন্ধন', myAccount: 'আমার অ্যাকাউন্ট', dashboard: 'ড্যাশবোর্ড', myOrders: 'আমার অর্ডার', becomeVendor: 'ব্যবসায়ী হোন', support: 'সাহায্য' },
    }
    return translations[language]?.[key] || translations.en[key] || key
  }

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Top bar */}
      <div className="hidden lg:flex bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><Package className="w-3 h-3" /> Premium Digital Marketplace</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">Support: +880-1812-054785</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative" ref={userMenuRef}>
              <button onClick={() => setLangMenuOpen(!langMenuOpen)} className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200">
                <Globe className="w-3.5 h-3.5" />
                <span>{langs.find(l => l.code === language)?.native || 'English'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[130px] z-50">
                  {langs.map(l => (
                    <button key={l.code} onClick={() => { changeLanguage(l.code); setLangMenuOpen(false) }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 ${language === l.code ? 'text-primary-600 font-medium' : ''}`}>
                      {l.native} <span className="text-gray-400">({l.name})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={toggleTheme} className="hover:text-gray-700 dark:hover:text-gray-200">
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            {siteSettings.company_logo ? (
              <img src={siteSettings.company_logo} alt="Logo" className="h-8 lg:h-10 w-auto" />
            ) : (
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm lg:text-base">TS</span>
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">{siteSettings.company_name || 'TRUE STAR BD'}</h1>
              <p className="text-[10px] lg:text-xs text-gray-400 -mt-1">{siteSettings.company_tagline || 'Premium Digital Marketplace'}</p>
            </div>
          </Link>

          {/* Search bar - desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative" ref={searchRef}>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('search')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
            </div>
            {searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {searchResults.map(p => (
                  <Link key={p.id} href={`/product/${p.slug}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-lg">📦</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">৳{p.salePrice || p.price}</p>
                    </div>
                  </Link>
                ))}
                <Link href={`/products?search=${searchQuery}`}
                  className="block px-4 py-2.5 text-center text-sm text-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium">
                  See all results
                </Link>
              </div>
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search mobile */}
            <button onClick={() => setShowSearch(!showSearch)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg group">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount > 9 ? '9+' : cartCount}</span>
              )}
            </Link>

            {/* Notifications */}
            {user && (
              <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <Bell className="w-5 h-5" />
              </button>
            )}

            {/* User menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden lg:block text-sm font-medium max-w-[100px] truncate">{user.firstName}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <User className="w-4 h-4" /> {t('myAccount')}
                    </Link>
                    <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <Package className="w-4 h-4" /> {t('myOrders')}
                    </Link>
                    {user.role === 'VENDOR' && vendor && (
                      <Link href="/vendor/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <LayoutDashboard className="w-4 h-4" /> {t('dashboard')}
                      </Link>
                    )}
                    {['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(user.role) && (
                      <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <LayoutDashboard className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100 dark:border-gray-700" />
                    <button onClick={() => { logout(); setUserMenuOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/signin" className="btn-secondary text-sm py-2 px-4 hidden sm:block">{t('signIn')}</Link>
                <Link href="/signup" className="btn-primary text-sm py-2 px-4">{t('signUp')}</Link>
              </div>
            )}

            {/* Mobile menu */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      {showSearch && (
        <div className="lg:hidden px-4 pb-3 animate-slide-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('search')}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">All Products</Link>
            {categories.slice(0, 6).map(cat => (
              <Link key={cat.id} href={`/category/${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">
                {cat.icon} {cat.name}
              </Link>
            ))}
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            {user ? (
              <>
                <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">My Account</Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-red-600">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/signin" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">Sign In</Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">Sign Up</Link>
              </>
            )}
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <div className="flex items-center gap-2 px-3 py-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <select value={language} onChange={e => changeLanguage(e.target.value)} className="text-sm bg-transparent outline-none">
                {langs.map(l => <option key={l.code} value={l.code}>{l.native}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
