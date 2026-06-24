'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppProvider, useApp } from '../../../components/AppContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Star, ShoppingCart, ChevronRight, Loader2 } from 'lucide-react'

function CategoryContent({ params }) {
  const { addToCart, language } = useApp()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/categories/${params.slug}`)
      .then(r => r.json())
      .then(d => {
        setCategory(d.category)
        setProducts(d.category?.products || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.slug])

  const t = (key) => {
    const d = { en: { products: 'Products', noProducts: 'No products in this category yet', browseAll: 'Browse All Products' }, bn: { products: 'পণ্য', noProducts: 'এই ক্যাটাগরিতে এখনো কোনো পণ্য নেই', browseAll: 'সব পণ্য ব্রাউজ করুন' } }
    return d[language]?.[key] || d.en[key] || key
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium">{category?.name || 'Category'}</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
        ) : category ? (
          <>
            <div className="flex items-center gap-4 mb-8">
              <div className="text-5xl">{category.icon || '📦'}</div>
              <div>
                <h1 className="text-3xl font-bold">{category.name}</h1>
                <p className="text-gray-500 mt-1">{category.description}</p>
              </div>
            </div>

            {category.children?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {category.children.map(child => (
                  <Link key={child.id} href={`/category/${child.slug}`}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors">
                    {child.name}
                  </Link>
                ))}
              </div>
            )}

            {products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">{t('noProducts')}</p>
                <Link href="/products" className="btn-primary">{t('browseAll')}</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <div key={product.id} className="card-hover p-0 overflow-hidden group">
                    <Link href={`/product/${product.slug}`}>
                      <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-4xl relative">
                        📦
                        {product.salePrice && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{Math.round((1 - product.salePrice / product.price) * 100)}%
                          </div>
                        )}
                      </div>
                    </Link>
                    <div className="p-4">
                      <Link href={`/product/${product.slug}`}>
                        <h3 className="font-semibold text-sm line-clamp-1 hover:text-primary-600">{product.name}</h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-primary-600">৳{(product.salePrice || product.price)?.toLocaleString()}</span>
                        {product.salePrice && <span className="text-sm text-gray-400 line-through">৳{product.price?.toLocaleString()}</span>}
                      </div>
                      {product.reviews?.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.round(product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      )}
                      <div className="mt-3 flex gap-2">
                        <Link href={`/product/${product.slug}`} className="flex-1 btn-secondary text-xs py-2 text-center">Details</Link>
                        <button onClick={() => addToCart(product, null, 1)} className="flex-1 btn-primary text-xs py-2">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function CategoryPage({ params }) {
  return <AppProvider><CategoryContent params={params} /></AppProvider>
}
