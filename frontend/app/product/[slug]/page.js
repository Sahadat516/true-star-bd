'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../../components/AppContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import GatewayIcon from '../../../components/GatewayLogos'
import ShareButtons from '../../../components/ShareButtons'
import { Star, ShoppingCart, Check, Heart, ChevronRight, Minus, Plus, Shield, Zap, Clock, Award, Store, MessageCircle, ChevronDown, ChevronUp, Info, BadgeCheck, HeadphonesIcon, Truck, Package, ArrowLeft, Tag, Sparkles, TrendingUp } from 'lucide-react'

function ProductDetailContent({ params }) {
  const router = useRouter()
  const { addToCart, language, user } = useApp()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [gateways, setGateways] = useState([])
  const [siteSettings, setSiteSettings] = useState({})
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/products/${params.slug}`).then(r => r.json()),
      fetch('/api/payments/gateways').then(r => r.json()).catch(() => ({ gateways: [] })),
      fetch('/api/cms/settings').then(r => r.json()).catch(() => ({ settings: {} })),
    ]).then(([d, pg, ss]) => {
      setProduct(d.product)
      setRelated(d.related || [])
      setGateways(pg.gateways || [])
      setSiteSettings(ss.settings || ss || {})
      if (d.product?.variants?.length > 0) setSelectedVariant(d.product.variants[0])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [params.slug])

  useEffect(() => {
    if (product?.seoTitle) document.title = product.seoTitle
    else if (product?.name) document.title = `${product.name} | True Star BD`
  }, [product])

  const handleBuyNow = () => {
    if (!user) { router.push('/signin'); return }
    addToCart(product, selectedVariant, quantity)
    setTimeout(() => router.push('/checkout'), 100)
  }

  const t = (key) => {
    const d = {
      en: {
        addToCart: 'Add to Cart', added: 'Added!', buyNow: 'Buy Now', description: 'Description',
        reviews: 'Reviews (0)', seller: 'Seller Info', related: 'Related Products', share: 'Share',
        vendor: 'Sold by', tags: 'Tags', guaranteed: '100% Genuine Products',
        instantDelivery: 'Instant Auto Delivery', support: '24/7 Support', secure: 'Secure Payment',
        paymentMethods: 'Payment Methods', quantity: 'Quantity', totalSales: 'Total Sales',
        memberSince: 'Member Since', noReviews: 'No reviews yet', outOfStock: 'Out of Stock',
        inStock: 'In Stock', features: 'Why Shop With Us', offer: 'Best Offer',
        sellerLevel: 'Seller Level', completionRate: 'Completion Rate', responseTime: 'Response Time',
        orders: 'Orders', contactSeller: 'Contact Seller', viewStore: 'View Store',
        delivery: 'Delivery Information', deliveredVia: 'Delivered via',
      },
      bn: {
        addToCart: 'কার্টে যোগ করুন', added: 'যুক্ত হয়েছে!', buyNow: 'এখনই কিনুন',
        description: 'বিবরণ', reviews: 'রিভিউ (0)', seller: 'বিক্রেতা',
        related: 'সম্পর্কিত পণ্য', share: 'শেয়ার', vendor: 'বিক্রেতা',
        tags: 'ট্যাগ', guaranteed: '১০০% খাঁটি পণ্য', instantDelivery: 'তাৎক্ষণিক ডেলিভারি',
        support: '২৪/৭ সাপোর্ট', secure: 'নিরাপদ পেমেন্ট', paymentMethods: 'পেমেন্ট পদ্ধতি',
        quantity: 'পরিমাণ', totalSales: 'মোট বিক্রয়', memberSince: 'সদস্য since',
        noReviews: 'এখনো কোনো রিভিউ নেই', features: 'কেন আমাদের কাছ থেকে কিনবেন',
        delivery: 'ডেলিভারি তথ্য',
      },
    }
    return d[language]?.[key] || d.en[key] || key
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2"><div className="aspect-square skeleton rounded-2xl" /></div>
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4 rounded-xl" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-12 w-1/3 rounded-xl" />
            <div className="skeleton h-12 w-full rounded-xl" />
            <div className="skeleton h-24 w-full rounded-xl" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="text-center py-32">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-gray-500 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="btn-primary">Browse Products</Link>
      </main>
      <Footer />
    </div>
  )

  const currentPrice = selectedVariant ? (selectedVariant.salePrice || selectedVariant.price) : (product.salePrice || product.price)
  const originalPrice = selectedVariant ? selectedVariant.price : product.price
  const tags = (() => { try { const t = typeof product.tags === 'string' ? JSON.parse(product.tags) : product.tags; return Array.isArray(t) ? t : [] } catch { return [] } })()
  const avgRating = product.avgRating || (product.reviews?.length ? Math.round(product.reviews.reduce((a, r) => a + r.rating, 0) / product.reviews.length) : 0)
  const productImages = (() => { try { return JSON.parse(product.images || '[]') } catch { return [] } })()
  const allImages = productImages.length > 0 ? productImages : (product.image ? [product.image] : [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-primary-600">Home</Link><ChevronRight className="w-3 h-3" />
          {product.category && <><Link href={`/category/${product.category.slug}`} className="hover:text-primary-600">{product.category.name}</Link><ChevronRight className="w-3 h-3" /></>}
          <span className="text-gray-900 dark:text-white font-medium truncate max-w-[300px]">{product.name}</span>
        </div>

        {/* Main Content - G2G Style 3-column layout */}
        <div className="grid lg:grid-cols-12 gap-6 mb-10">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 space-y-3">
              <div className="relative bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden group">
                <div className="aspect-square flex items-center justify-center p-8 lg:p-12">
                  {allImages[selectedImage] ? (
                    <img src={allImages[selectedImage]} alt={product.name} className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="text-8xl">📦</div>
                  )}
                </div>
                {product.salePrice && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <Tag className="w-3 h-3" /> -{Math.round((1 - product.salePrice / product.price) * 100)}%
                  </div>
                )}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-all shadow-lg">
                  <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" />
                </button>
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {allImages.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden flex-shrink-0 transition-all ${selectedImage === i ? 'border-primary-500 shadow-md' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'}`}>
                      <img src={img} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Product Info */}
          <div className="lg:col-span-4 space-y-5">
            {/* Category + Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/category/${product.category?.slug || ''}`}
                className="text-[11px] font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1 rounded-full">
                {product.category?.name || 'Digital Product'}
              </Link>
              {tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">#{tag}</span>
              ))}
              {tags.includes('hot') && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-2.5 h-2.5" /> HOT
                </span>
              )}
            </div>

            <h1 className="text-xl lg:text-2xl font-extrabold leading-tight">{product.name}</h1>
            {product.shortDescription && (
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{product.shortDescription}</p>
            )}

            {/* Rating + Sales */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= avgRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} />
                ))}
                <span className="text-sm font-medium ml-1">{avgRating > 0 ? avgRating.toFixed(1) : '0.0'}</span>
              </div>
              <span className="text-sm text-gray-400">({product.reviews?.length || 0} reviews)</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" /> {product._count?.orderItems || 0} sold
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 p-4 bg-gray-50 dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs text-gray-500 mb-1 block">Current Price</span>
                <span className="text-3xl lg:text-4xl font-extrabold text-primary-600">৳{currentPrice?.toLocaleString()}</span>
              </div>
              {originalPrice > currentPrice && (
                <div className="pl-4 border-l border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 mb-1 block">Original Price</span>
                  <span className="text-lg text-gray-400 line-through">৳{originalPrice?.toLocaleString()}</span>
                </div>
              )}
              {product.salePrice && (
                <div className="ml-auto">
                  <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-2.5 py-1.5 rounded-full">
                    Save ৳{(product.price - product.salePrice).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Select Option</label>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map(v => {
                    const vPrice = v.salePrice || v.price
                    const isSelected = selectedVariant?.id === v.id
                    return (
                      <button key={v.id} onClick={() => { setSelectedVariant(v); setQuantity(1) }}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${isSelected ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}>
                        <p className="text-sm font-semibold">{v.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">৳{vPrice?.toLocaleString()}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity + Action Buttons */}
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium">{t('quantity')}:</label>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(p => Math.max(1, p - 1))} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors px-4"><Minus className="w-4 h-4" /></button>
                  <span className="px-5 font-bold min-w-[3.5rem] text-center text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(p => p + 1)} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors px-4"><Plus className="w-4 h-4" /></button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={handleBuyNow} className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 px-6 rounded-2xl transition-all hover:shadow-lg hover:shadow-primary-500/25 active:scale-[0.98] text-sm shadow-lg shadow-primary-500/10 flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4" /> {t('buyNow')}
                </button>
                <button onClick={() => { addToCart(product, selectedVariant, quantity); setAddedToCart(true); setTimeout(() => setAddedToCart(false), 2000) }}
                  className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-bold py-3.5 px-6 rounded-2xl transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2">
                  {addedToCart ? <><Check className="w-5 h-5" />{t('added')}</> : <><ShoppingCart className="w-5 h-5" />{t('addToCart')}</>}
                </button>
              </div>
            </div>

            {/* Delivery Info Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-green-50 dark:bg-green-900/10 rounded-xl p-3 text-center">
                <Zap className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-[10px] font-semibold text-green-700 dark:text-green-400">Instant<br/>Delivery</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-3 text-center">
                <Shield className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-[10px] font-semibold text-blue-700 dark:text-blue-400">Secure<br/>Payment</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-3 text-center">
                <HeadphonesIcon className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-[10px] font-semibold text-purple-700 dark:text-purple-400">24/7<br/>Support</p>
              </div>
            </div>
          </div>

          {/* Right: Seller Card + Payment */}
          <div className="lg:col-span-3 space-y-4">
            {/* Seller Card - G2G Style */}
            {product.vendor && (
              <div className="bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">Sold by</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
                      {product.vendor.logo ? <img src={product.vendor.logo} className="w-full h-full object-contain rounded-2xl" /> : product.vendor.businessName?.[0] || 'V'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/vendor/${product.vendor.id}`} className="font-bold text-sm hover:text-primary-600 transition-colors truncate block">{product.vendor.businessName || 'TRUE STAR BD'}</Link>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /> {product.vendor.rating || '5.0'}</span>
                        <span>·</span>
                        <span>{product.vendor.totalSales || 0} orders</span>
                      </div>
                    </div>
                  </div>
                  {/* Seller Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="text-center">
                      <div className="text-xs font-bold text-green-600">98%</div>
                      <div className="text-[9px] text-gray-400">Completion</div>
                    </div>
                    <div className="text-center border-x border-gray-200 dark:border-gray-700">
                      <div className="text-xs font-bold">Level 2</div>
                      <div className="text-[9px] text-gray-400">Seller Rank</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-primary-600">&lt;5min</div>
                      <div className="text-[9px] text-gray-400">Response</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <Link href={`/vendor/${product.vendor.id}`}
                      className="flex items-center justify-center gap-2 w-full text-xs font-semibold text-primary-600 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 py-2.5 rounded-xl transition-colors">
                      <Store className="w-3.5 h-3.5" /> {t('viewStore')}
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {gateways.length > 0 && (
              <div className="bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> {t('paymentMethods')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {gateways.slice(0, 8).map((g, i) => (
                    <div key={g.id || g.code || i} className="w-10 h-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center p-2 overflow-hidden hover:border-primary-300 transition-colors" title={g.name}>
                      <GatewayIcon id={g.name} name={g.name} iconOnly />
                    </div>
                  ))}
                  {gateways.length > 8 && (
                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-500">
                      +{gateways.length - 8}
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1"><Info className="w-2.5 h-2.5" /> Secure 256-bit SSL encrypted payment</p>
              </div>
            )}

            {/* Share */}
            <div className="bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">Share this product</p>
              <ShareButtons title={product.name} url={typeof window !== 'undefined' ? window.location.href : ''} />
            </div>
          </div>
        </div>

        {/* ===== TABS SECTION ===== */}
        <div className="bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 mb-8 overflow-hidden">
          <div className="flex border-b border-gray-100 dark:border-gray-800 overflow-x-auto scrollbar-hide">
            {[
              { key: 'description', label: t('description'), icon: '📄' },
              { key: 'reviews', label: `${t('reviews').replace('(0)', `(${product.reviews?.length || 0})`)}`, icon: '⭐' },
              { key: 'seller', label: t('seller'), icon: '🏪' },
              { key: 'delivery', label: t('delivery'), icon: '🚚' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === tab.key ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50 dark:bg-primary-900/10' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/30'}`}>
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
          <div className="p-6 lg:p-8">
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: product.description || '<p class="text-gray-400">No description available.</p>' }} />
            )}
            {activeTab === 'reviews' && (
              <div>
                {product.reviews?.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map(review => (
                      <div key={review.id} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {review.user?.firstName?.[0] || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{review.user?.firstName || 'User'} {review.user?.lastName || ''}</p>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {Array(5).fill(0).map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400 ml-auto">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        {review.title && <p className="text-sm font-semibold mt-2">{review.title}</p>}
                        {review.comment && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.comment}</p>}
                        {review.images && (() => { try { return JSON.parse(review.images) } catch { return [] } })().map((img, i) => (
                          <img key={i} src={img} alt="" className="w-20 h-20 object-cover rounded-xl mt-2 inline-block mr-1" />
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">💬</div>
                    <p className="text-gray-500">{t('noReviews')}</p>
                    {user && (
                      <button className="btn-primary text-sm mt-4 px-6">Write a Review</button>
                    )}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'seller' && product.vendor && (
              <div className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
                  {product.vendor.logo ? <img src={product.vendor.logo} className="w-full h-full object-contain rounded-2xl" /> : <Store className="w-10 h-10" />}
                </div>
                <div className="flex-1">
                  <Link href={`/vendor/${product.vendor.id}`} className="font-bold text-xl hover:text-primary-600 transition-colors">{product.vendor.businessName || 'TRUE STAR BD'}</Link>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {product.vendor.rating || '5.0'} Rating</span>
                    <span>·</span>
                    <span>{product.vendor.totalSales || 0} orders completed</span>
                    {product.vendor.isFeatured && (
                      <span className="flex items-center gap-1 text-primary-600 font-semibold"><BadgeCheck className="w-4 h-4" /> Featured Vendor</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-3">{product.vendor.description || 'Professional digital seller on TRUE STAR BD marketplace.'}</p>
                  <div className="flex gap-3 mt-4">
                    <Link href={`/vendor/${product.vendor.id}`} className="btn-primary text-xs py-2.5 px-5">
                      <Store className="w-3.5 h-3.5" /> View All Products
                    </Link>
                    <button className="btn-secondary text-xs py-2.5 px-5">
                      <MessageCircle className="w-3.5 h-3.5" /> Contact Seller
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'delivery' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Instant Digital Delivery</h4>
                      <p className="text-xs text-gray-500">Delivered within minutes</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">After successful payment, you will receive the product details instantly via email and WhatsApp. No waiting required.</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Money Back Guarantee</h4>
                      <p className="text-xs text-gray-500">100% secure transaction</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">If the product is not delivered or is defective, you are eligible for a full refund within 24 hours of purchase.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== RELATED PRODUCTS ===== */}
        {related.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold">{t('related')}</h2>
              </div>
              <Link href={`/category/${product.category?.slug || ''}`} className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {related.slice(0, 6).map(p => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group">
                  <div className="g2g-product-card">
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" />
                      ) : <span className="text-4xl">📦</span>}
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-xs line-clamp-2 group-hover:text-primary-600 transition-colors">{p.name}</p>
                      <p className="text-primary-600 font-extrabold text-sm mt-1">৳{(p.salePrice || p.price)?.toLocaleString()}</p>
                    </div>
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

export default function ProductPage({ params }) {
  return <ProductDetailContent params={params} />
}
