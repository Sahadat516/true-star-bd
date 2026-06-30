'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useApp } from '../../../components/AppContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import GatewayIcon from '../../../components/GatewayLogos'
import { Star, ShoppingCart, ChevronRight, Loader2, Grid3X3, List, ArrowUpDown, LayoutGrid, LayoutList, Filter, SlidersHorizontal, X, Search } from 'lucide-react'

function CategoryContent({ params }) {
  const { addToCart, language } = useApp()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    setLoading(true); setError('')
    fetch(`/api/categories/${params.slug}?sort=${sortBy}`)
      .then(r => { if (!r.ok) throw new Error(r.status === 404 ? 'Category not found' : 'Failed to load category'); return r.json() })
      .then(d => {
        setCategory(d.category)
        let prods = d.category?.products || []
        if (sortBy === 'price_asc') prods = [...prods].sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price))
        if (sortBy === 'price_desc') prods = [...prods].sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price))
        if (sortBy === 'newest') prods = [...prods].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setProducts(prods)
        if (d.category) document.title = `${d.category.name} | True Star BD`
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [params.slug, sortBy])

  const t = (key) => {
    const d = {
      en: { products: 'Products', noProducts: 'No products in this category yet', browseAll: 'Browse All Products', subcategories: 'Subcategories' },
      bn: { products: 'পণ্য', noProducts: 'এই ক্যাটাগরিতে এখনো কোনো পণ্য নেই', browseAll: 'সব পণ্য ব্রাউজ করুন', subcategories: 'উপক্যাটাগরি' },
    }
    return d[language]?.[key] || d.en[key] || key
  }

  const catColors = {
    'Gift Cards': '#2EBDB5', 'Games': '#39BBD8', 'Game coins': '#C8A800', 'Items': '#7774FF',
    'Accounts': '#3092EB', 'Skins': '#C76EFE', 'Boosting': '#FFC600', 'Game Coaching': '#3FE7A0',
    'GamePal': '#F070D4', 'Telco': '#F05F81', 'Top Up': '#6FB935', 'Software & Apps': '#F68500',
    'Payment Cards': '#7B03DA',
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link><ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-primary-600">Products</Link><ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium">{category?.name || 'Category'}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
          </div>
        ) : category ? (
          <>
            {/* Category Hero */}
            <div className="bg-white dark:bg-[#131316] rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
              <div className="relative p-6 lg:p-8" style={{ background: `linear-gradient(135deg, ${catColors[category.name] || '#25D366'}20, transparent)` }}>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-4xl lg:text-5xl shadow-lg" style={{ backgroundColor: (catColors[category.name] || '#25D366') + '30' }}>
                    {category.icon || '📦'}
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-extrabold">{category.name}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{category.description || `${products.length} products available`}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      <span>{products.length} products</span>
                      {category.children?.length > 0 && <><span className="text-gray-300">·</span><span>{category.children.length} subcategories</span></>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subcategories */}
            {category.children?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">{t('subcategories')}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.children.map(child => (
                    <Link key={child.id} href={`/category/${child.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-700 rounded-full text-xs font-medium hover:border-primary-500 hover:text-primary-600 transition-all shadow-sm">
                      {child.icon && <span>{child.icon}</span>}
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden btn-secondary text-sm py-2 px-3">
                  <Filter className="w-4 h-4" />
                </button>
                <div className="flex items-center bg-white dark:bg-[#131316] rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}>
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">{products.length} {t('products')}</span>
              </div>
              <div className="relative">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-[#131316] border border-gray-200 dark:border-gray-700 rounded-xl py-2.5 pl-4 pr-10 text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500/30 cursor-pointer">
                  <option value="popular">Most Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-gray-500 mb-4">{t('noProducts')}</p>
                <Link href="/products" className="btn-primary text-sm">{t('browseAll')}</Link>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.map(product => (
                  <CategoryProductCard key={product.id} product={product} addToCart={addToCart} language={language} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => (
                  <CategoryProductListCard key={product.id} product={product} addToCart={addToCart} language={language} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

function CategoryProductCard({ product, addToCart, language }) {
  const price = product.salePrice || product.price
  const avgRating = product.avgRating || 0
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
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-sm line-clamp-2 hover:text-primary-600 transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-1.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">({product._count?.reviews || 0})</span>
          <span className="text-[10px] text-gray-300">·</span>
          <span className="text-[10px] font-medium text-green-600">{product._count?.orderItems || 0} sold</span>
        </div>
        <div className="mt-2">
          <span className="text-lg font-extrabold text-primary-600">৳{price?.toLocaleString()}</span>
          {product.salePrice && <span className="text-sm text-gray-400 line-through ml-2">৳{product.price?.toLocaleString()}</span>}
        </div>
        <button onClick={() => addToCart(product, null, 1)}
          className="mt-3 w-full bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-primary-500/10">
          <ShoppingCart className="w-3 h-3 inline mr-1" /> {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

function CategoryProductListCard({ product, addToCart, language }) {
  const price = product.salePrice || product.price
  const avgRating = product.avgRating || 0
  return (
    <div className="bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col sm:flex-row group hover:shadow-md transition-all">
      <Link href={`/product/${product.slug}`} className="sm:w-48 sm:h-48 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center shrink-0">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
        ) : <div className="text-5xl">📦</div>}
        {product.salePrice && <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">-{Math.round((1 - product.salePrice / product.price) * 100)}%</span>}
      </Link>
      <div className="p-5 flex-1">
        <h3 className="font-bold hover:text-primary-600 transition-colors"><Link href={`/product/${product.slug}`}>{product.name}</Link></h3>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span>{avgRating.toFixed(1)} ({product._count?.reviews || 0})</span>
          </div>
          <span>·</span>
          <span>{product._count?.orderItems || 0} sold</span>
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div>
            <span className="text-2xl font-extrabold text-primary-600">৳{price?.toLocaleString()}</span>
            {product.salePrice && <span className="text-sm text-gray-400 line-through ml-2">৳{product.price?.toLocaleString()}</span>}
          </div>
          <div className="flex gap-2">
            <Link href={`/product/${product.slug}`} className="btn-secondary text-xs py-2 px-4">Details</Link>
            <button onClick={() => addToCart(product, null, 1)} className="btn-primary text-xs py-2 px-4">
              <ShoppingCart className="w-3.5 h-3.5" /> Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CategoryPage({ params }) {
  return <CategoryContent params={params} />
}
