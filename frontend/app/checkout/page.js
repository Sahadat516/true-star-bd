'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppProvider, useApp } from '../../components/AppContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { CreditCard, Check, Lock, ArrowLeft, Building2, Wallet, BanknoteIcon, Bitcoin } from 'lucide-react'

function CheckoutContent() {
  const router = useRouter()
  const { user, cart, cartTotal, clearCart } = useApp()
  const [gateways, setGateways] = useState([])
  const [selectedGateway, setSelectedGateway] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState('payment')
  const [orderResult, setOrderResult] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/payments/gateways').then(r => r.json()).then(d => setGateways(d.gateways || [])).catch(() => {})
  }, [])

  const groupedGateways = gateways.reduce((acc, g) => {
    const typeMap = { card: 'Card Payments', mobile: 'Mobile Banking (BD)', wallet: 'International Wallets', crypto: 'Cryptocurrency', bank: 'Bank Transfer' }
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

      // Simulate payment confirmation for demo
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
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex items-center justify-center px-4">
        <div className="card p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-4">Order #{orderResult.orderNumber}</p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6 text-left space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Total Paid</span><span className="font-bold">৳{orderResult.total?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">VAT</span><span>৳{orderResult.vat?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Service Charge</span><span>৳{orderResult.serviceCharge?.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="capitalize">{orderResult.paymentGateway}</span></div>
          </div>
          <p className="text-sm text-gray-500 mb-6">A confirmation email will be sent to your email address shortly. You will receive product details within 15 days.</p>
          <div className="flex gap-3">
            <Link href="/orders" className="btn-secondary flex-1 py-3 text-center">View Orders</Link>
            <Link href="/" className="btn-primary flex-1 py-3 text-center">Continue Shopping</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/cart" className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
          <ArrowLeft className="w-3 h-3" /> Back to Cart
        </Link>

        <h1 className="text-2xl font-bold mb-8">Checkout</h1>

        {!user && (
          <div className="card p-4 mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">Please <Link href="/signin" className="font-semibold underline">sign in</Link> to complete your order.</p>
          </div>
        )}

        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-3 rounded-lg text-sm mb-4">{error}</div>}

        {/* Order summary */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-4">Order Summary ({cart.length} items)</h2>
          {cart.map((item, i) => {
            const price = item.variant ? (item.variant.salePrice || item.variant.price) : (item.product.salePrice || item.product.price)
            return (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-sm">📦</div>
                  <div>
                    <p className="font-medium line-clamp-1">{item.product.name}</p>
                    {item.variant && <p className="text-xs text-gray-500">{item.variant.name}</p>}
                  </div>
                </div>
                <span>x{item.quantity}</span>
                <span className="font-medium">৳{(price * item.quantity).toLocaleString()}</span>
              </div>
            )
          })}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>৳{cartTotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>VAT (5%)</span><span>৳{Math.round(cartTotal * 0.05).toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Service Charge (10%)</span><span>৳{Math.round(cartTotal * 0.1).toLocaleString()}</span></div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
              <span>Total</span><span className="text-primary-600">৳{Math.round(cartTotal * 1.15).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5" /> Payment Method</h2>
          {Object.entries(groupedGateways).map(([group, gws]) => (
            <div key={group} className="mb-4">
              <h3 className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-2">{group}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {gws.map(gw => (
                  <button key={gw.id} onClick={() => setSelectedGateway(gw.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${selectedGateway === gw.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedGateway === gw.id ? 'border-primary-600' : 'border-gray-300'}`}>
                        {selectedGateway === gw.id && <div className="w-2 h-2 bg-primary-600 rounded-full" />}
                      </div>
                      <span className="text-sm font-medium">{gw.name}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 capitalize">{gw.type}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button onClick={handlePlaceOrder} disabled={loading || !user}
          className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
          {loading ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Processing...</> : <><Lock className="w-5 h-5" /> Pay ৳{Math.round(cartTotal * 1.15).toLocaleString()}</>}
        </button>

        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
          <Lock className="w-3 h-3" /> Secure payment · Your information is protected
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function Checkout() {
  return <AppProvider><CheckoutContent /></AppProvider>
}
