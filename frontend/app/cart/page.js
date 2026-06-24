'use client'

import Link from 'next/link'
import { AppProvider, useApp } from '../../components/AppContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { ShoppingCart, Trash2, ArrowLeft, Minus, Plus, ShoppingBag, CreditCard } from 'lucide-react'

function CartContent() {
  const { cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount, language } = useApp()

  const handleQuantity = (index, delta) => {
    const item = cart[index]
    const newQty = item.quantity + delta
    if (newQty < 1) return
    addToCart(item.product, item.variant, delta)
  }

  if (cart.length === 0) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet</p>
        <Link href="/products" className="btn-primary inline-flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" /> Browse Products
        </Link>
      </main>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <p className="text-gray-500 text-sm">{cartCount} items</p>
          </div>
          <button onClick={clearCart} className="text-sm text-red-600 hover:underline">Clear All</button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => {
              const price = item.variant ? (item.variant.salePrice || item.variant.price) : (item.product.salePrice || item.product.price)
              return (
                <div key={index} className="card p-4 flex gap-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-2xl shrink-0">📦</div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${item.product.slug}`} className="font-semibold text-sm hover:text-primary-600 line-clamp-1">{item.product.name}</Link>
                    {item.variant && <p className="text-xs text-gray-500 mt-0.5">{item.variant.name}</p>}
                    <p className="text-lg font-bold text-primary-600 mt-1">৳{price?.toLocaleString()}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                        <button onClick={() => handleQuantity(index, -1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="px-3 py-1.5 text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => handleQuantity(index, 1)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="text-red-500 hover:text-red-700 p-1.5">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">৳{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">VAT (5%)</span>
                <span className="font-medium">৳{Math.round(cartTotal * 0.05).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service Charge (10%)</span>
                <span className="font-medium">৳{Math.round(cartTotal * 0.1).toLocaleString()}</span>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">৳{Math.round(cartTotal * 1.15).toLocaleString()}</span>
              </div>
            </div>
            <Link href="/checkout" className="btn-primary w-full mt-6 py-3 flex items-center justify-center gap-2">
              <CreditCard className="w-4 h-4" /> Proceed to Checkout
            </Link>
            <Link href="/products" className="flex items-center justify-center gap-1 mt-3 text-sm text-gray-500 hover:text-primary-600">
              <ArrowLeft className="w-3 h-3" /> Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function Cart() {
  return <AppProvider><CartContent /></AppProvider>
}
