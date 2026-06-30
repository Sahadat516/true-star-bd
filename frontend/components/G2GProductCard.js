'use client'

import Link from 'next/link'
import { Star, ShoppingBag, Eye, Heart, Tag, Flame, Clock, Shield } from 'lucide-react'

export default function G2GProductCard({ product, language, addToCart }) {
  const price = product.salePrice || product.price
  const oldPrice = product.salePrice ? product.price : null
  const avgRating = product.avgRating || (product.reviews?.length ? product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length : 0)
  const tags = (() => { try { return JSON.parse(product.tags || '[]') } catch { return [] } })()

  return (
    <div className="g2g-product-card group">
      <Link href={`/product/${product.slug}`}>
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="text-6xl group-hover:scale-110 transition-transform duration-500">📦</div>
          )}
          {product.salePrice && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" /> -{Math.round((1 - product.salePrice / product.price) * 100)}%
            </div>
          )}
          {tags.includes('hot') && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 fill-current" /> HOT
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2 -translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <button onClick={(e) => { e.preventDefault(); addToCart?.(product, null, 1) }}
                className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center hover:bg-primary-600 hover:text-white transition-all">
                <ShoppingBag className="w-4 h-4" />
              </button>
              <button onClick={(e) => { e.preventDefault() }}
                className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                <Heart className="w-4 h-4" />
              </button>
              <Link href={`/product/${product.slug}`} onClick={(e) => { e.preventDefault(); window.location.href = `/product/${product.slug}` }}
                className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/category/${product.category?.slug || ''}`}>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">{product.category?.name || 'Digital Product'}</span>
        </Link>
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-sm line-clamp-2 mt-0.5 hover:text-primary-600 transition-colors">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} />
            ))}
          </div>
          <span className="text-[10px] text-gray-400">({product._count?.reviews || 0})</span>
          <span className="text-[10px] text-gray-300 dark:text-gray-600">·</span>
          <span className="text-[10px] font-medium text-green-600">{product._count?.orderItems || 0} sold</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-extrabold text-primary-600 dark:text-primary-400">৳{price?.toLocaleString()}</span>
          {oldPrice && <span className="text-sm text-gray-400 line-through">৳{oldPrice.toLocaleString()}</span>}
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-[8px] text-white font-bold">
            {product.vendor?.businessName?.[0] || 'T'}
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{product.vendor?.businessName || 'TRUE STAR BD'}</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400">
          <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> Instant</span>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <span className="flex items-center gap-0.5"><Shield className="w-2.5 h-2.5" /> Secure</span>
        </div>
        {addToCart && (
          <button onClick={() => addToCart(product, null, 1)}
            className="mt-3 w-full btn-primary text-xs py-2.5 rounded-xl shadow-lg shadow-primary-500/10">
            <ShoppingBag className="w-3.5 h-3.5" /> {language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  )
}

export function G2GProductSkeleton() {
  return (
    <div className="g2g-product-card">
      <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/3 animate-pulse" />
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full animate-pulse" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => <div key={i} className="h-3 w-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />)}
        </div>
        <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-1/2 animate-pulse" />
        <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-xl w-full animate-pulse" />
      </div>
    </div>
  )
}
