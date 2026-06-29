'use client'

import { useState, useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { ShoppingBag, Package, Clock, CheckCircle, XCircle, RefreshCw, ChevronRight, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const STATUS_STYLES = {
  PENDING: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', icon: Clock },
  PROCESSING: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: RefreshCw },
  COMPLETED: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: CheckCircle },
  CANCELLED: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: XCircle },
  REFUNDED: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', icon: AlertCircle },
}

function OrdersContent() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem('token')
        if (!token) { setError('Please sign in to view orders'); setLoading(false); return }
        const res = await fetch('/api/orders/my-orders', {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error(res.status === 401 ? 'Please sign in again' : 'Failed to load orders')
        const data = await res.json()
        setOrders(Array.isArray(data) ? data : data?.orders || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">My Orders</h1>
          {[1,2,3].map(i => (
            <div key={i} className="card p-6 mb-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-20 h-20 shimmer rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 shimmer rounded w-3/4" />
                  <div className="h-3 shimmer rounded w-1/2" />
                  <div className="h-3 shimmer rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-8">My Orders</h1>
          <div className="card p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{error}</h2>
            {error.includes('sign in') ? (
              <Link href="/signin" className="btn-primary inline-flex mt-4">Sign In</Link>
            ) : (
              <button onClick={() => window.location.reload()} className="btn-primary inline-flex mt-4">
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">My Orders</h1>
          {orders.length > 0 && (
            <span className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="card p-12 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              When you place an order, it will appear here. Start browsing our products to find something you love!
            </p>
            <Link href="/products" className="btn-primary inline-flex gap-2">
              <ShoppingBag className="w-4 h-4" /> Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const st = STATUS_STYLES[order.status] || STATUS_STYLES.PENDING
              const StatusIcon = st.icon
              const itemCount = order.items?.reduce((s, i) => s + i.quantity, 0) || 0
              return (
                <Link key={order.id} href={`/orders/${order.id}`} className="block card-hover p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${st.bg} ${st.text}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {order.status}
                        </span>
                        <span className="text-xs text-gray-400">#{order.orderNumber?.slice(-8) || order.id?.slice(0,8)}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          ৳{order.total?.toLocaleString()}
                        </span>
                      </div>
                      {order.items?.[0] && (
                        <p className="text-sm text-gray-500 mt-1 truncate">{order.items[0].productName}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-right shrink-0">
                      <div className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function Orders() {
  return <OrdersContent />
}
