'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useApp } from '../../../components/AppContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Star, Shield, Award, Clock, ChevronRight, Loader2, Store, Package, ShoppingBag, BadgeCheck, MessageCircle, MapPin, Calendar, Zap, HeadphonesIcon, TrendingUp, Users, CheckCircle } from 'lucide-react'

const RANK_COLORS = {
  NORMAL: '#9CA3AF', COMMON: '#22C55E', UNCOMMON: '#3B82F6',
  RARE: '#A855F7', EPIC: '#F97316', LEGENDARY: '#EAB308',
}
const RANK_BG = {
  NORMAL: 'from-gray-400 to-gray-500', COMMON: 'from-green-500 to-green-600',
  UNCOMMON: 'from-blue-500 to-blue-600', RARE: 'from-purple-500 to-purple-600',
  EPIC: 'from-orange-500 to-orange-600', LEGENDARY: 'from-yellow-400 to-yellow-500',
}

function VendorContent({ params }) {
  const { addToCart, user } = useApp()
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`/api/vendors/${params.id}/store`)
      .then(r => r.json())
      .then(d => {
        if (!d.store) throw new Error('Vendor not found')
        setStore(d.store)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 shimmer rounded w-48" />
          <div className="h-48 shimmer rounded-2xl" />
          <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-24 shimmer rounded-xl" />)}</div>
          <div className="grid grid-cols-4 gap-6">{[1,2,3,4].map(i => <div key={i} className="h-64 shimmer rounded-2xl" />)}</div>
        </div>
      </main>
      <Footer />
    </div>
  )

  if (error || !store) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Vendor Not Found</h1>
          <p className="text-gray-500 mb-6">{error || 'This vendor does not exist.'}</p>
          <Link href="/products" className="btn-primary">Browse Products</Link>
        </div>
      </main>
      <Footer />
    </div>
  )

  const daysSince = store.daysActive || Math.ceil((Date.now() - new Date(store.ownerSince).getTime()) / (1000*60*60*24))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-primary-600">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium">{store.businessName}</span>
        </div>

        {/* Hero Section - G2G Style */}
        <div className="relative overflow-hidden rounded-3xl mb-8">
          <div className={`bg-gradient-to-br ${store.coverImage ? '' : `from-primary-700 via-accent-600 to-primary-800`} p-8 lg:p-12`} style={store.coverImage ? { backgroundImage: `url(${store.coverImage})`, backgroundSize: 'cover' } : {}}>
            <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
              <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-3xl shadow-lg relative">
                {store.logo ? <img src={store.logo} className="w-full h-full object-contain rounded-3xl" /> : store.businessName?.[0] || 'V'}
                {store.sellerStatus === 'ONLINE' && (
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 text-white">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-3xl lg:text-4xl font-extrabold">{store.businessName}</h1>
                  {store.isFeatured && <BadgeCheck className="w-6 h-6 text-primary-300" />}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${RANK_COLORS[store.rank] ? 'bg-white/20' : 'bg-white/10'} backdrop-blur border border-white/20`}
                    style={RANK_COLORS[store.rank] ? { color: RANK_COLORS[store.rank], borderColor: RANK_COLORS[store.rank] + '40' } : {}}>
                    ★ {store.rank || 'NORMAL'} SELLER
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/80">
                  <span className="flex items-center gap-1.5"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {store.rating?.toFixed(1) || '0.0'} ({store.reviewCount || 0})</span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4" /> {store.totalOrders || 0} orders</span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {daysSince} days active</span>
                  <span>·</span>
                  <span className={`flex items-center gap-1.5 ${store.sellerStatus === 'ONLINE' ? 'text-green-300' : 'text-white/60'}`}>
                    <span className={`w-2 h-2 rounded-full ${store.sellerStatus === 'ONLINE' ? 'bg-green-400' : 'bg-white/40'}`} />
                    {store.sellerStatus === 'ONLINE' ? 'Online Now' : 'Offline'}
                  </span>
                </div>
                {store.description && <p className="mt-4 text-sm text-white/80 max-w-2xl">{store.description}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid - G2G Style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Seller Rank', value: store.rank || 'NORMAL', color: RANK_COLORS[store.rank] || '#6B7280', icon: Award },
            { label: 'Orders Completed', value: store.totalOrders || 0, color: '#22C55E', icon: CheckCircle },
            { label: 'Completion Rate', value: `${store.completionRate || 100}%`, color: store.completionRate >= 95 ? '#22C55E' : '#F97316', icon: TrendingUp },
            { label: 'Response Time', value: store.responseTime || '<5min', color: '#25D366', icon: Zap },
          ].map((stat, i) => (
            <div key={i} className="card p-5 text-center hover:shadow-md transition-shadow">
              <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: stat.color }} />
              <div className="text-xl font-extrabold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Rank Progress Bar */}
        {store.rankLevel && (
          <div className="card p-5 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Seller Rank Progress</span>
              <span className="text-xs text-gray-400">Level {store.rankLevel}/6</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${RANK_BG[store.rank] || 'from-gray-400 to-gray-500'}`}
                style={{ width: `${Math.min(100, store.rankProgress || 0)}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-gray-400">
              {['NORMAL','COMMON','UNCOMMON','RARE','EPIC','LEGENDARY'].map((r, i) => (
                <span key={r} className={i + 1 <= store.rankLevel ? 'font-bold' : ''}
                  style={i + 1 <= store.rankLevel && RANK_COLORS[r] ? { color: RANK_COLORS[r] } : {}}>
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Products ({store.products?.length || 0})</h2>
        </div>
        {store.products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {store.products.map(product => (
              <div key={product.id} className="card-hover p-0 overflow-hidden group">
                <Link href={`/product/${product.slug}`}>
                  <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center relative">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <Package className="w-12 h-12 text-gray-300" />
                    )}
                    {product.deliveryType === 'instant' && (
                      <span className="absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <Zap className="w-2.5 h-2.5" /> INSTANT
                      </span>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <p className="text-[10px] text-primary-600 font-semibold uppercase tracking-wider">{product.category?.name}</p>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="font-semibold text-sm line-clamp-1 hover:text-primary-600 mt-0.5">{product.name}</h3>
                  </Link>
                  <p className="text-lg font-bold mt-1">
                    ৳{(product.salePrice || product.price)?.toLocaleString()}
                    {product.salePrice && <span className="text-xs text-gray-400 line-through ml-2">৳{product.price?.toLocaleString()}</span>}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => addToCart(product, null, 1)} className="btn-primary flex-1 text-xs py-2.5">
                      <ShoppingBag className="w-3 h-3" /> Add to Cart
                    </button>
                    <Link href={`/product/${product.slug}`} className="btn-secondary text-xs py-2.5 px-3">
                      <Package className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Products Yet</h3>
            <p className="text-sm text-gray-500">This seller hasn't listed any products.</p>
          </div>
        )}

        {/* Reviews Section */}
        {store.reviews?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Customer Reviews ({store.reviews.length})</h2>
            <div className="space-y-4">
              {store.reviews.map(review => (
                <div key={review.id} className="card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {review.user?.firstName?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.user?.firstName || 'Anonymous'} {review.user?.lastName || ''}</p>
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= (review.rating || 5) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />)}
                      </div>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  {review.title && <p className="font-medium text-sm">{review.title}</p>}
                  {review.comment && <p className="text-sm text-gray-500 mt-1">{review.comment}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function VendorPage({ params }) {
  return <VendorContent params={params} />
}
