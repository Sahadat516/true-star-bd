'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../components/AppContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import GatewayIcon from '../../components/GatewayLogos'
import { CreditCard, Check, Lock, ArrowLeft, Shield, Zap, Building2, Wallet, BanknoteIcon, Bitcoin, ChevronRight, Package, Truck, Star, Clock, BadgeCheck } from 'lucide-react'

function CheckoutContent() {
  const router = useRouter()
  const { user, cart, cartTotal, clearCart } = useApp()
  const [gateways, setGateways] = useState([])
  const [selectedGateway, setSelectedGateway] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('payment')
  const [orderResult, setOrderResult] = useState(null)
  const [error, setError] = useState('')
  const [siteSettings, setSiteSettings] = useState({})

  useEffect(() => {
    fetch('/api/payments/gateways').then(r => r.json()).then(d => setGateways(d.gateways || [])).catch(() => {})
    fetch('/api/cms/settings').then(r => r.json()).then(d => setSiteSettings(d.settings || {})).catch(() => {})
  }, [])

  const groupedGateways = gateways.reduce((acc, g) => {
    const typeMap = { card: 'Card Payments', mobile: 'Mobile Banking (BD)', wallet: 'International Wallets', crypto: 'Cryptocurrency', bank: 'Bank Transfer', 'card+mobile': 'Card & Mobile' }
    const group = typeMap[g.type] || 'Other'
    if (!acc[group]) acc[group] = []
    acc[group].push(g)
    return acc
  }, {})

  const handlePlaceOrder = async () => {
    if (!selectedGateway) { setError('Please select a payment method'); return }
    if (!user) { router.push('/signin'); return }
    if (cart.length === 0) { router.push('/cart'); return }

    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cart.map(item => ({ productId: item.product.id, variantId: item.variant?.id || null, quantity: item.quantity })),
          paymentGateway: selectedGateway,
          deliveryEmail: user.email,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error)

      const paymentRes = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderId: orderData.order.id, gateway: selectedGateway }),
      })
      const paymentData = await paymentRes.json()

      await fetch(`/api/payments/confirm/${paymentData.payment.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'completed', transactionId: `DEMO-${Date.now()}` }),
      })

      clearCart()
      setOrderResult(orderData.order)
      setStep('success')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success' && orderResult) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b] flex items-center justify-center px-4 py-12">
        <div className="bg-white dark:bg-[#131316] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-8 max-w-lg w-full text-center animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Check className="w-7 h-7 text-white" />
            </div>
          </div>
          <div className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">Payment Successful</div>
          <h1 className="text-2xl font-extrabold mb-1">Order Placed!</h1>
          <p className="text-gray-500 mb-6">Your order has been confirmed. You will receive product details shortly.</p>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 mb-6 text-left space-y-3 text-sm border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">Order Number</span>
              <span className="font-bold text-primary-600">#{orderResult.orderNumber}</span>
            </div>
            <hr className="border-gray-200 dark:border-gray-700" />
            <div className="flex justify-between"><span className="text-gray-500">Total Paid</span><span className="font-extrabold text-lg">৳{orderResult.total?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">VAT (5%)</span><span>৳{orderResult.vat?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Service Charge</span><span>৳{orderResult.serviceCharge?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="capitalize font-semibold">{orderResult.paymentGateway}</span></div>
          </div>
          <div className="flex items-center gap-2 justify-center text-xs text-gray-400 mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
            <Zap className="w-3.5 h-3.5 text-green-500" /> Product will be delivered via email & WhatsApp
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/orders" className="btn-secondary py-3 text-sm text-center">View Orders</Link>
            <Link href="/" className="btn-primary py-3 text-sm text-center shadow-lg shadow-primary-500/20">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link><ChevronRight className="w-3 h-3" />
          <Link href="/cart" className="hover:text-primary-600">Cart</Link><ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium">Checkout</span>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-extrabold">Checkout</h1>
            <p className="text-sm text-gray-500">{cart.length} item{cart.length > 1 ? 's' : ''} · Secure payment</p>
          </div>
        </div>

        {!user && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <Lock className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-sm text-amber-800 dark:text-amber-200">Please <Link href="/signin" className="font-bold underline">sign in</Link> to complete your order.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-2xl p-4 text-sm text-red-600 flex items-center gap-3 mb-6">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Payment Methods */}
          <div className="lg:col-span-3 space-y-6">
            {/* Order Items Summary */}
            <div className="bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <h2 className="font-bold text-sm mb-4 flex items-center gap-2"><Package className="w-4 h-4 text-primary-600" /> Items ({cart.length})</h2>
              <div className="space-y-3">
                {cart.map((item, i) => {
                  const price = item.variant ? (item.variant.salePrice || item.variant.price) : (item.product.salePrice || item.product.price)
                  return (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl flex items-center justify-center text-lg overflow-hidden shrink-0">
                        {item.product.image ? <img src={item.product.image} className="w-full h-full object-contain p-1" /> : '📦'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold line-clamp-1">{item.product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ৳{price.toLocaleString()}</p>
                      </div>
                      <p className="text-sm font-bold">৳{(price * item.quantity).toLocaleString()}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Payment Methods - G2G Style Grouped */}
            <div className="bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
              <h2 className="font-bold text-sm mb-5 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary-600" /> Choose Payment Method
              </h2>
              {Object.entries(groupedGateways).map(([group, gws]) => (
                <div key={group} className="mb-5 last:mb-0">
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3">{group}</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {gws.map(gw => {
                      const isSelected = selectedGateway === gw.id
                      return (
                        <button key={gw.id} onClick={() => setSelectedGateway(gw.id)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${isSelected ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 shadow-md' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'}`}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-primary-600' : 'border-gray-300'}`}>
                              {isSelected && <div className="w-2 h-2 bg-primary-600 rounded-full" />}
                            </div>
                            <GatewayIcon id={gw.id} name={gw.name} type={gw.type} />
                          </div>
                          <p className="text-[10px] text-gray-500 ml-6 truncate">{gw.name}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#131316] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sticky top-28">
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
                {siteSettings?.company_logo ? (
                  <img src={siteSettings.company_logo} alt="" className="h-10 w-auto" />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-white font-bold">TS</span>
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-sm">{siteSettings?.company_name || 'TRUE STAR BD'}</h3>
                  <p className="text-[10px] text-gray-400">Premium Digital Marketplace</p>
                </div>
              </div>

              <h2 className="font-bold text-sm mb-4">Payment Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({cart.length} items)</span>
                  <span className="font-semibold">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">VAT (5%)</span>
                  <span className="font-semibold">৳{Math.round(cartTotal * 0.05).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service Charge (10%)</span>
                  <span className="font-semibold">৳{Math.round(cartTotal * 0.1).toLocaleString()}</span>
                </div>
                <hr className="border-gray-100 dark:border-gray-800" />
                <div className="flex justify-between items-baseline">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-extrabold text-primary-600">৳{Math.round(cartTotal * 1.15).toLocaleString()}</span>
                </div>
              </div>

              <button onClick={handlePlaceOrder} disabled={loading || !user}
                className="btn-primary w-full mt-6 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-50">
                {loading ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</>
                ) : (
                  <><Lock className="w-4 h-4" /> Pay ৳{Math.round(cartTotal * 1.15).toLocaleString()}</>
                )}
              </button>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <Shield className="w-3 h-3" /> 256-bit SSL encrypted payment
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <Zap className="w-3 h-3" /> Instant digital delivery
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <BadgeCheck className="w-3 h-3" /> Money back guarantee
                </div>
              </div>

              <Link href="/cart" className="flex items-center justify-center gap-1 mt-5 text-xs text-gray-500 hover:text-primary-600 transition-colors pt-4 border-t border-gray-100 dark:border-gray-800">
                <ArrowLeft className="w-3 h-3" /> Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function Checkout() {
  return <CheckoutContent />
}
