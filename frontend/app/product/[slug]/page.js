'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppProvider, useApp } from '../../../components/AppContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Star, ShoppingCart, Check, Share2, Heart, ChevronRight, Minus, Plus, Shield, Zap, Clock, Award } from 'lucide-react'

function ProductDetailContent({ params }) {
  const { addToCart, language, cart } = useApp()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then(r => r.json())
      .then(d => {
        setProduct(d.product)
        setRelated(d.related || [])
        if (d.product?.variants?.length > 0) setSelectedVariant(d.product.variants[0])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.slug])

  const currentPrice = selectedVariant ? (selectedVariant.salePrice || selectedVariant.price) : (product?.salePrice || product?.price)
  const oldPrice = selectedVariant ? (selectedVariant.salePrice ? selectedVariant.price : null) : (product?.salePrice ? product.price : null)
  const avgRating = product?.avgRating || 0

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="shimmer h-8 w-64 mb-8 rounded" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="shimmer h-96 rounded-2xl" />
          <div className="space-y-4"><div className="shimmer h-8 w-3/4 rounded" /><div className="shimmer h-4 w-1/2 rounded" /><div className="shimmer h-24 w-full rounded" /></div>
        </div>
      </main>
      <Footer />
    </div>
  )

  if (!product) return <div className="min-h-screen flex items-center justify-center"><p className="text-lg">Product not found</p></div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/category/${product.category?.slug}`} className="hover:text-primary-600">{product.category?.name}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product image */}
          <div className="card p-0 overflow-hidden">
            <div className="h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center relative">
              <div className="text-8xl">📦</div>
              {product.salePrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-full text-sm">
                  -{Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow">
                  <Heart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <button className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow">
                  <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Product details */}
          <div>
            <div className="mb-1">
              <Link href={`/vendor/${product.vendor?.id}`} className="text-sm text-primary-600 font-medium hover:underline">
                {product.vendor?.businessName || 'TRUE STAR BD'}
              </Link>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-500">{avgRating.toFixed(1)} ({product._count?.reviews || 0} reviews)</span>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-green-600 font-medium">{product._count?.orderItems || 0} sold</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary-600">৳{currentPrice?.toLocaleString()}</span>
              {oldPrice && <span className="text-xl text-gray-400 line-through">৳{oldPrice.toLocaleString()}</span>}
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Select Plan:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.variants.map(v => (
                    <button key={v.id} onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${selectedVariant?.id === v.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                      <p className="text-xs font-medium">{v.name}</p>
                      <p className="text-sm font-bold mt-1">৳{(v.salePrice || v.price)?.toLocaleString()}</p>
                      {v.salePrice && <p className="text-[10px] text-gray-400 line-through">৳{v.price.toLocaleString()}</p>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"><Minus className="w-4 h-4" /></button>
                <span className="px-4 py-2 font-medium min-w-[40px] text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} className={`flex-1 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${addedToCart ? 'bg-green-600 text-white' : 'btn-primary'}`}>
                {addedToCart ? <><Check className="w-5 h-5" /> Added!</> : <><ShoppingCart className="w-5 h-5" /> Add to Cart</>}
              </button>
              <Link href="/checkout" className="flex-1 py-3.5 rounded-xl font-semibold text-center bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
                Buy Now
              </Link>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              {[
                { icon: Zap, text: 'Instant Delivery' },
                { icon: Shield, text: 'Secure Payment' },
                { icon: Award, text: 'Genuine Product' },
              ].map((b, i) => (
                <div key={i} className="text-center">
                  <b.icon className="w-5 h-5 text-primary-600 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Description</h2>
          <div className="card p-6">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{product.description || 'Premium digital product from TRUE STAR BD Limited. Instant delivery after payment confirmation. 24/7 customer support available.'}</p>
            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              {[
                { label: 'Delivery', value: 'Instant (Auto)' },
                { label: 'Support', value: '24/7 AI Chat' },
                { label: 'Warranty', value: 'Full Replacement' },
                { label: 'Payment', value: 'bKash, Nagad, Rocket, Cards, Crypto' },
              ].map((f, i) => (
                <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-gray-500">{f.label}</span>
                  <span className="font-medium">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Reviews ({product.reviews?.length || 0})</h2>
          <div className="space-y-4">
            {product.reviews?.slice(0, 5).map(review => (
              <div key={review.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {review.user?.firstName?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{review.user?.firstName} {review.user?.lastName}</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    {review.title && <p className="text-sm font-medium mt-1">{review.title}</p>}
                    {review.comment && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.comment}</p>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {related.map(p => (
                <Link key={p.id} href={`/product/${p.slug}`} className="card-hover p-0 overflow-hidden">
                  <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-3xl">📦</div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold line-clamp-1">{p.name}</h3>
                    <p className="text-sm font-bold text-primary-600 mt-1">৳{(p.salePrice || p.price)?.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function ProductDetail({ params }) {
  return <AppProvider><ProductDetailContent params={params} /></AppProvider>
}
