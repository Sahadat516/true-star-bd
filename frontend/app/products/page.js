'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useApp } from '../../components/AppContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Filter, SlidersHorizontal, Grid3X3, List, ChevronDown, Star, X, Search, ShoppingCart, Eye, Heart, ArrowUpDown, LayoutGrid, LayoutList } from 'lucide-react'

function ProductsContent() {
  const searchParams = useSearchParams()
  const { addToCart, language } = useApp()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    sort: 'popular',
  })
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [total, setTotal] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories((d.categories || []).sort((a,b) => a.name.localeCompare(b.name)))).catch(() => setError('Failed to load categories'))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.search) params.set('search', filters.search)
    if (filters.minPrice) params.set('minPrice', filters.minPrice)
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
    if (filters.sort) params.set('sort', filters.sort)
    params.set('limit', '24')

    fetch(`/api/products?${params}`)
      .then(r => r.json())
      .then(d => { setProducts(d.products || []); setTotal(d.total || 0) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filters])

  const t = (key) => {
    const d = {
      en: {
        allCategories: 'All Categories', filter: 'Filters', sort: 'Sort By', price: 'Price Range',
        products: 'Products', reset: 'Reset', apply: 'Apply', noResults: 'No products found',
        popular: 'Most Popular', lowHigh: 'Price: Low to High', highLow: 'Price: High to Low',
        newest: 'Newest First', addToCart: 'Add to Cart', details: 'Details',
        results: 'results found',
      },
      bn: {
        allCategories: 'সব ক্যাটাগরি', filter: 'ফিল্টার', sort: 'সাজান', price: 'মূল্যের পরিসর',
        products: 'পণ্য', reset: 'রিসেট', apply: 'প্রয়োগ', noResults: 'কোনো পণ্য পাওয়া যায়নি',
        popular: 'সর্বাধিক জনপ্রিয়', lowHigh: 'মূল্য: কম থেকে বেশি', highLow: 'মূল্য: বেশি থেকে কম',
        newest: 'নতুন প্রথম', addToCart: 'কার্টে যোগ করুন', results: 'টি ফলাফল পাওয়া গেছে',
      },
    }
    return d[language]?.[key] || d.en[key] || key
  }

  const sortOptions = [
    { value: 'popular', label: t('popular') },
    { value: 'price_asc', label: t('lowHigh') },
    { value: 'price_desc', label: t('highLow') },
    { value: 'newest', label: t('newest') },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link><span className="text-gray-300">/</span>
          <span className="text-gray-900 dark:text-white font-medium">All Products</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">All Products</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{total} {t('results')}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-secondary text-sm py-2 px-4">
              <Filter className="w-4 h-4" /> {t('filter')}
            </button>
            <div className="flex items-center bg-white dark:bg-[#131316] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <select value={filters.sort} onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))}
                className="appearance-none bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-4 pr-10 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`w-64 shrink-0 ${showFilters ? 'fixed inset-0 z-50 lg:relative lg:inset-auto bg-white dark:bg-[#0a0a0b] p-4 lg:p-0 overflow-y-auto' : 'hidden lg:block'}`}>
            {showFilters && (
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-bold text-lg">{t('filter')}</h3>
                <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
            )}
            <div className="bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 sticky top-28">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-sm flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> {t('filter')}</h3>
                <button onClick={() => setFilters({ category: '', search: '', minPrice: '', maxPrice: '', sort: 'popular' })}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium">{t('reset')}</button>
              </div>

              {/* Category filter */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Category</h4>
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {[
                    { id: '', name: t('allCategories'), icon: '📋' },
                    ...categories.map(c => ({ id: c.id, name: c.name, icon: c.icon || '📦' })),
                  ].map(cat => (
                    <button key={cat.id} onClick={() => setFilters(prev => ({ ...prev, category: cat.id }))}
                      className={`flex items-center gap-2 w-full text-left text-sm px-3 py-2 rounded-xl transition-all ${filters.category === cat.id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-semibold shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400'}`}>
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">{t('price')}</h4>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice}
                    onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30" />
                  <span className="text-gray-400 font-medium">—</span>
                  <input type="number" placeholder="Max" value={filters.maxPrice}
                    onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30" />
                </div>
              </div>
            </div>
            {showFilters && (
              <div className="mt-4 lg:hidden">
                <button onClick={() => setShowFilters(false)} className="btn-primary w-full">{t('apply')} Filters</button>
              </div>
            )}
          </aside>

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Search indicator */}
            {filters.search && (
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                <Search className="w-4 h-4" />
                <span>Results for: <strong className="text-gray-800 dark:text-gray-200">&ldquo;{filters.search}&rdquo;</strong></span>
                <button onClick={() => setFilters(prev => ({ ...prev, search: '' }))} className="text-primary-600 hover:underline ml-2">Clear</button>
              </div>
            )}

            {loading ? (
              <div className={`grid gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="g2g-product-card">
                    <div className="aspect-[4/3] skeleton" />
                    <div className="p-4 space-y-3">
                      <div className="skeleton h-3 w-1/3 rounded" />
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-6 w-1/2 rounded" />
                      <div className="skeleton h-8 w-full rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2">{t('noResults')}</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                <button onClick={() => setFilters({ category: '', search: '', minPrice: '', maxPrice: '', sort: 'popular' })}
                  className="btn-primary text-sm">
                  {t('reset')} Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(product => (
                  <ProductGridCard key={product.id} product={product} addToCart={addToCart} language={language} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => (
                  <ProductListCard key={product.id} product={product} addToCart={addToCart} language={language} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function ProductGridCard({ product, addToCart, language }) {
  const price = product.salePrice || product.price
  const avgRating = product.avgRating || (product.reviews?.length ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length : 0)
  return (
    <div className="g2g-product-card group">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
          ) : <div className="text-5xl">📦</div>}
          {product.salePrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">-{Math.round((1 - product.salePrice / product.price) * 100)}%</div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button onClick={(e) => { e.preventDefault(); addToCart(product, null, 1) }}
              className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all mx-1">
              <ShoppingCart className="w-4 h-4" />
            </button>
            <Link href={`/product/${product.slug}`}
              className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all mx-1">
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/category/${product.category?.slug || ''}`} className="text-[10px] font-semibold uppercase tracking-wider text-primary-600">{product.category?.name || 'Digital'}</Link>
        <Link href={`/product/${product.slug}`}><h3 className="font-bold text-sm line-clamp-2 mt-0.5 hover:text-primary-600">{product.name}</h3></Link>
        <div className="flex items-center gap-1 mt-1.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">({product._count?.reviews || 0})</span>
          <span className="text-[10px] text-gray-300">·</span>
          <span className="text-[10px] font-medium text-green-600">{product._count?.orderItems || 0} sold</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-primary-600">৳{price?.toLocaleString()}</span>
          {product.salePrice && <span className="text-sm text-gray-400 line-through">৳{product.price?.toLocaleString()}</span>}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-[7px] text-white font-bold">{product.vendor?.businessName?.[0] || 'T'}</div>
          <span className="text-[10px] text-gray-500 truncate">{product.vendor?.businessName || 'TRUE STAR BD'}</span>
        </div>
        <button onClick={() => addToCart(product, null, 1)}
          className="mt-3 w-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary-500/10">
          {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

function ProductListCard({ product, addToCart, language }) {
  const price = product.salePrice || product.price
  const avgRating = product.avgRating || (product.reviews?.length ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length : 0)
  return (
    <div className="bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col sm:flex-row group hover:shadow-md transition-all">
      <Link href={`/product/${product.slug}`} className="sm:w-48 sm:h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden shrink-0">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
        ) : <div className="text-5xl">📦</div>}
        {product.salePrice && <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{Math.round((1 - product.salePrice / product.price) * 100)}%</span>}
      </Link>
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/category/${product.category?.slug || ''}`} className="text-[10px] font-semibold uppercase tracking-wider text-primary-600">{product.category?.name || 'Digital'}</Link>
          <Link href={`/product/${product.slug}`}><h3 className="font-bold hover:text-primary-600 transition-colors">{product.name}</h3></Link>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              <span>{avgRating.toFixed(1)} ({product._count?.reviews || 0})</span>
            </div>
            <span>·</span>
            <span>{product._count?.orderItems || 0} sold</span>
            <span>·</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-[5px] text-white font-bold">{product.vendor?.businessName?.[0] || 'T'}</div> {product.vendor?.businessName || 'TRUE STAR BD'}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div>
            <span className="text-2xl font-extrabold text-primary-600">৳{price?.toLocaleString()}</span>
            {product.salePrice && <span className="text-sm text-gray-400 line-through ml-2">৳{product.price?.toLocaleString()}</span>}
          </div>
          <div className="flex gap-2">
            <Link href={`/product/${product.slug}`} className="btn-secondary text-xs py-2 px-4">{language === 'bn' ? 'বিস্তারিত' : 'Details'}</Link>
            <button onClick={() => addToCart(product, null, 1)} className="btn-primary text-xs py-2 px-4">
              <ShoppingCart className="w-3.5 h-3.5" /> {language === 'bn' ? 'কার্টে যোগ করুন' : 'Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Products() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>}><ProductsContent /></Suspense>
}
