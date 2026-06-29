'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useApp } from '../../components/AppContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GatewayIcon from '../../components/GatewayLogos'
import { ShoppingCart, Trash2, ArrowLeft, Minus, Plus, ShoppingBag, CreditCard, Shield, Zap, Tag, Heart, Star, ChevronRight, Package, Truck } from 'lucide-react'

function CartContent() {
  const { cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount, language } = useApp()
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    fetch('/api/products?limit=4&sort=popular').then(r => r.json()).then(d => setRelatedProducts(d.products || [])).catch(() => {})
  }, [])

  const handleQuantity = (index, delta) => {
    const item = cart[index]
    const newQty = item.quantity + delta
    if (newQty < 1) return
    addToCart(item.product, item.variant, delta)
  }

  const t = (key) => {
    const d = {
      en: {
        title: 'Shopping Cart', empty: 'Your cart is empty', emptyDesc: 'Looks like you haven\'t added anything yet',
        browseProducts: 'Browse Products', clearAll: 'Clear All', subtotal: 'Subtotal',
        vat: 'VAT (5%)', service: 'Service Charge (10%)', total: 'Total',
        checkout: 'Proceed to Checkout', continue: 'Continue Shopping', summary: 'Order Summary',
        youMightLike: 'You Might Also Like', secure: 'Secure Checkout',
      },
      bn: {
        title: 'শপিং কার্ট', empty: 'আপনার কার্ট খালি', emptyDesc: 'মনে হচ্ছে আপনি এখনও কিছু যোগ করেননি',
        browseProducts: 'পণ্য ব্রাউজ করুন', clearAll: 'সব মুছে ফেলুন', subtotal: 'সাবটোটাল',
        vat: 'ভ্যাট (৫%)', service: 'সার্ভিস চার্জ (১০%)', total: 'মোট',
        checkout: 'চেকআউটে যান', continue: 'শপিং চালিয়ে যান', summary: 'অর্ডার সারাংশ',
        youMightLike: 'আপনার পছন্দ হতে পারে', secure: 'নিরাপদ চেকআউট',
      },
    }
    return d[language]?.[key] || d.en[key] || key
  }

  if (cart.length === 0) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-28 h-28 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-14 h-14 text-gray-300" />
        </div>
        <h1 className="text-2xl font-extrabold mb-2">{t('empty')}</h1>
        <p className="text-gray-500 mb-8">{t('emptyDesc')}</p>
        <Link href="/products" className="btn-primary inline-flex items-center gap-2 shadow-lg shadow-primary-500/20">
          <ShoppingBag className="w-4 h-4" /> {t('browseProducts')}
        </Link>
      </main>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link><span className="text-gray-300">/</span>
          <span className="text-gray-900 dark:text-white font-medium">{t('title')}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-extrabold">{t('title')}</h1>
              <p className="text-sm text-gray-500">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button onClick={clearCart} className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-full transition-colors">
            <Trash2 className="w-3 h-3" /> {t('clearAll')}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              const price = item.variant ? (item.variant.salePrice || item.variant.price) : (item.product.salePrice || item.product.price)
              const lineTotal = price * item.quantity
              const imgSrc = item.product.image || null

              return (
                <div key={index} className="bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex gap-4 group hover:shadow-md transition-all animate-fade-in">
                  <Link href={`/product/${item.product.slug}`} className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                    {imgSrc ? <img src={imgSrc} className="w-full h-full object-contain p-2" /> : '📦'}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/product/${item.product.slug}`} className="font-bold text-sm hover:text-primary-600 transition-colors line-clamp-1">{item.product.name}</Link>
                        {item.variant && <p className="text-xs text-gray-500 mt-0.5">Option: {item.variant.name}</p>}
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px] text-gray-400">by</span>
                          <span className="text-[10px] font-medium text-gray-600 dark:text-gray-300">{item.product.vendor?.businessName || 'TRUE STAR BD'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <button onClick={() => handleQuantity(index, -1)} className="p-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-4 py-1.5 text-sm font-bold min-w-[2.5rem] text-center">{item.quantity}</span>
                        <button onClick={() => handleQuantity(index, 1)} className="p-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-lg font-extrabold text-primary-600">৳{lineTotal.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-400">৳{price.toLocaleString()} each</p>
                        </div>
                        <button onClick={() => removeFromCart(index)} className="w-8 h-8 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Coupon */}
            <div className="bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Have a coupon code?" className="flex-1 bg-transparent border-0 outline-none text-sm placeholder:text-gray-400" />
                <button className="text-xs font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 dark:bg-primary-900/20 px-4 py-2 rounded-xl transition-colors">Apply</button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sticky top-28">
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary-600" /> {t('summary')}
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('subtotal')} ({cartCount} items)</span>
                  <span className="font-semibold">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('vat')}</span>
                  <span className="font-semibold">৳{Math.round(cartTotal * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('service')}</span>
                  <span className="font-semibold">৳{Math.round(cartTotal * 0.1).toLocaleString()}</span>
                </div>

                <hr className="border-gray-100 dark:border-gray-800" />

                <div className="flex justify-between items-baseline">
                  <span className="text-base font-bold">{t('total')}</span>
                  <span className="text-2xl font-extrabold text-primary-600">৳{Math.round(cartTotal * 1.15).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1 text-[10px] text-gray-400 justify-center">
                  <Shield className="w-3 h-3" /> {t('secure')}
                </div>
              </div>

              <Link href="/checkout" className="btn-primary w-full mt-6 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20">
                <CreditCard className="w-4 h-4" /> {t('checkout')}
              </Link>

              <Link href="/products" className="flex items-center justify-center gap-1 mt-4 text-xs text-gray-500 hover:text-primary-600 transition-colors">
                <ArrowLeft className="w-3 h-3" /> {t('continue')}
              </Link>
            </div>
          </div>
        </div>

        {/* You Might Also Like */}
        {relatedProducts.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2"><Heart className="w-5 h-5 text-primary-600" /> {t('youMightLike')}</h2>
              <Link href="/products" className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map(p => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group">
                  <div className="g2g-product-card">
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                      {p.image ? <img src={p.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform" /> : <span className="text-4xl">📦</span>}
                    </div>
                    <div className="p-3">
                      <p className="font-semibold text-xs line-clamp-2 group-hover:text-primary-600">{p.name}</p>
                      <p className="text-primary-600 font-extrabold text-sm mt-1">৳{(p.salePrice || p.price)?.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function Cart() {
  return <CartContent />
}
