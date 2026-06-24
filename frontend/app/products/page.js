'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AppProvider, useApp } from '../../components/AppContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Filter, SlidersHorizontal, Grid3X3, List, ChevronDown, Star, X, Search } from 'lucide-react'

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

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(d => setCategories(d.categories || [])).catch(() => {})
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
    const d = { en: { allCategories: 'All Categories', filter: 'Filters', sort: 'Sort By', price: 'Price Range', products: 'Products', reset: 'Reset', apply: 'Apply', noResults: 'No products found' }, bn: { allCategories: 'সব ক্যাটাগরি', filter: 'ফিল্টার', sort: 'সাজান', price: 'মূল্যের পরিসর', products: 'পণ্য', reset: 'রিসেট', apply: 'প্রয়োগ', noResults: 'কোনো পণ্য পাওয়া যায়নি' } }
    return d[language]?.[key] || d.en[key] || key
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium">{t('products')}</span>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="card p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2"><Filter className="w-4 h-4" /> {t('filter')}</h3>
                <button onClick={() => setFilters({ category: '', search: '', minPrice: '', maxPrice: '', sort: 'popular' })} className="text-xs text-primary-600 hover:underline">{t('reset')}</button>
              </div>

              {/* Category filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Category</h4>
                <div className="space-y-1">
                  <button onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                    className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg ${!filters.category ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                    {t('allCategories')}
                  </button>
                  {categories.map(cat => (
                    <button key={cat.id} onClick={() => setFilters(prev => ({ ...prev, category: cat.id }))}
                      className={`block w-full text-left text-sm px-3 py-1.5 rounded-lg ${filters.category === cat.id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div>
                <h4 className="text-sm font-medium mb-2">{t('price')}</h4>
                <div className="flex items-center gap-2">
                  <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => setFilters(prev => ({ ...prev, minPrice: e.target.value }))} className="input-field text-sm py-1.5 w-full" />
                  <span className="text-gray-400">-</span>
                  <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))} className="input-field text-sm py-1.5 w-full" />
                </div>
              </div>
            </div>
          </aside>

          {/* Products area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-500">{total} {t('products')}</p>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}><Grid3X3 className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 ${viewMode === 'list' ? 'bg-gray-100 dark:bg-gray-700' : ''}`}><List className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-secondary text-sm py-1.5 px-3">
                  <Filter className="w-4 h-4" />
                </button>
                <select value={filters.sort} onChange={e => setFilters(prev => ({ ...prev, sort: e.target.value }))} className="input-field text-sm py-1.5 w-auto">
                  <option value="popular">{t('sort')}: Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Products grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card p-0 overflow-hidden">
                    <div className="shimmer h-48" />
                    <div className="p-4 space-y-2"><div className="shimmer h-4 w-3/4 rounded" /><div className="shimmer h-4 w-1/2 rounded" /><div className="shimmer h-8 w-full rounded" /></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold">{t('noResults')}</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map(product => (
                  <div key={product.id} className={`card-hover p-0 overflow-hidden ${viewMode === 'list' ? 'flex' : ''}`}>
                    <Link href={`/product/${product.slug}`} className={`${viewMode === 'list' ? 'w-48 shrink-0' : ''} block h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center relative`}>
                      <div className="text-5xl">📦</div>
                      {product.salePrice && <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{Math.round((1 - product.salePrice / product.price) * 100)}%</span>}
                    </Link>
                    <div className="p-4 flex-1">
                      <p className="text-xs text-primary-600 font-medium">{product.category?.name || 'Digital'}</p>
                      <Link href={`/product/${product.slug}`}><h3 className="font-semibold text-sm hover:text-primary-600 line-clamp-1">{product.name}</h3></Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-primary-600">৳{(product.salePrice || product.price)?.toLocaleString()}</span>
                        {product.salePrice && <span className="text-sm text-gray-400 line-through">৳{product.price?.toLocaleString()}</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {product.avgRating?.toFixed(1) || '0.0'} ({product._count?.reviews || 0}) · {product._count?.orderItems || 0} sold
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Link href={`/product/${product.slug}`} className="btn-secondary text-xs py-2 flex-1 text-center">Details</Link>
                        <button onClick={() => addToCart(product, null, 1)} className="btn-primary text-xs py-2 flex-1">Add to Cart</button>
                      </div>
                    </div>
                  </div>
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

export default function Products() {
  return <AppProvider><ProductsContent /></AppProvider>
}
