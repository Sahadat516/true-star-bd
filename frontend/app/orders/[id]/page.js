'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import {
  ArrowLeft, Clock, CheckCircle, XCircle, RefreshCw, Zap, Shield, AlertCircle,
  ChevronRight, Package, Loader2, Ban, MessageCircle, Download, FileText,
  ChevronDown, ChevronUp, Send
} from 'lucide-react'

const STATUS_FLOW = ['UNPAID', 'PREPARING', 'DELIVERING', 'COMPLETED']

const STATUS_INFO = {
  UNPAID: { label: 'Unpaid', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30', icon: Clock },
  PREPARING: { label: 'Preparing', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30', icon: RefreshCw },
  DELIVERING: { label: 'Delivering', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30', icon: Zap },
  COMPLETED: { label: 'Completed', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', icon: CheckCircle },
  CANCELLED: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', icon: XCircle },
  REFUNDED: { label: 'Refunded', color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30', icon: RefreshCw },
  RESOLUTION: { label: 'Resolution', color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30', icon: Shield },
}

function OrderDetailContent({ params }) {
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(null)
  const [cancelReason, setCancelReason] = useState('')
  const [showCancel, setShowCancel] = useState(false)
  const [disputeReason, setDisputeReason] = useState('')
  const [disputeMessage, setDisputeMessage] = useState('')
  const [showDispute, setShowDispute] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setError('Please sign in'); setLoading(false); return }
    fetch(`/api/orders/${params.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : Promise.reject('Failed to load'))
      .then(d => setOrder(d.order))
      .catch(e => setError(e.message || e))
      .finally(() => setLoading(false))
  }, [params.id])

  const doAction = async (action, body = {}) => {
    setActionLoading(action)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/orders/${action === 'cancel' ? `${params.id}/cancel` : action === 'confirm' ? `${params.id}/confirm-receipt` : action === 'dispute' ? `${params.id}/dispute` : ''}`, {
        method: action === 'vendor-status' ? 'PATCH' : action === 'cancel' || action === 'confirm' || action === 'dispute' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Action failed')
      if (data.order) setOrder(data.order)
      if (data.dispute) setOrder(prev => ({ ...prev, disputes: [...(prev.disputes || []), data.dispute], status: 'DISPUTED' }))
      setShowCancel(false)
      setShowDispute(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 shimmer rounded w-32" />
          <div className="h-48 shimmer rounded-2xl" />
          <div className="h-32 shimmer rounded-2xl" />
        </div>
      </main>
      <Footer />
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 text-center">
        <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link href="/orders" className="btn-primary inline-flex gap-2"><ArrowLeft className="w-4 h-4" /> Back to Orders</Link>
      </main>
      <Footer />
    </div>
  )

  if (!order) return null

  const info = STATUS_INFO[order.status] || STATUS_INFO.UNPAID
  const StatusIcon = info.icon
  const currentStep = STATUS_FLOW.indexOf(order.status)
  const activeDispute = order.disputes?.find(d => d.status === 'OPEN' || d.status === 'INVESTIGATING')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0b]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Back */}
        <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>

        {/* Header */}
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-bold">Order #{order.orderNumber?.slice(-8)}</h1>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${info.bg} ${info.color}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {info.label}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Placed {new Date(order.createdAt).toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                {order.deliveredAt && <span>Delivered {new Date(order.deliveredAt).toLocaleDateString()}</span>}
                {order.resolvedAt && <span>Completed {new Date(order.resolvedAt).toLocaleDateString()}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-extrabold text-primary-600">৳{order.total?.toLocaleString()}</div>
              <div className="text-xs text-gray-400 mt-1">
                Subtotal ৳{order.subtotal?.toLocaleString()} + VAT ৳{order.vat?.toLocaleString()} + Fee ৳{order.serviceCharge?.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Active dispute alert */}
          {activeDispute && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3">
              <Shield className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-400">Dispute Active</p>
                <p className="text-xs text-red-600 dark:text-red-500">{activeDispute.reason}</p>
              </div>
            </div>
          )}

          {order.cancellationReason && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center gap-3">
              <Ban className="w-5 h-5 text-gray-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Cancellation Reason</p>
                <p className="text-xs text-gray-500">{order.cancellationReason}</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Flow */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-4">Order Progress</h2>
          <div className="flex items-center gap-1">
            {STATUS_FLOW.map((s, i) => {
              const active = i <= currentStep
              return (
                <div key={s} className="flex-1 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                    active ? 'bg-primary-600 text-white shadow-md shadow-primary-200' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}>
                    {i + 1}
                  </div>
                  <span className={`text-[10px] mt-1.5 font-medium ${active ? 'text-primary-600' : 'text-gray-400'}`}>
                    {STATUS_INFO[s]?.label}
                  </span>
                  {i < STATUS_FLOW.length - 1 && (
                    <div className={`h-0.5 w-full mt-[-18px] ml-4 transition-all duration-500 ${i < currentStep ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Items */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-4">Items ({order.items?.length || 0})</h2>
          <div className="space-y-3">
            {order.items?.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center shrink-0">
                  {item.product?.image ? <img src={item.product.image} className="w-full h-full object-contain p-1.5" /> : <Package className="w-5 h-5 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.product?.slug || '#'}`} className="font-medium text-sm hover:text-primary-600 transition-colors line-clamp-1">
                    {item.productName}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span>Qty: {item.quantity}</span>
                    {item.variantName && <span>Variant: {item.variantName}</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">৳{item.total?.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-400">৳{item.price} each</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Info */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-4">Delivery Information</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Delivery Email</span>
              <p className="font-medium">{order.deliveryEmail || 'N/A'}</p>
            </div>
            {order.deliveryCode && (
              <div>
                <span className="text-gray-500">Delivery Code</span>
                <p className="font-medium font-mono text-primary-600">{order.deliveryCode}</p>
              </div>
            )}
            {order.paymentGateway && (
              <div>
                <span className="text-gray-500">Payment Method</span>
                <p className="font-medium">{order.paymentGateway}</p>
              </div>
            )}
            {order.transactionId && (
              <div>
                <span className="text-gray-500">Transaction ID</span>
                <p className="font-medium font-mono text-xs">{order.transactionId}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-4">Actions</h2>
          <div className="flex flex-wrap gap-3">
            {/* Cancel - only for UNPAID or PREPARING */}
            {['UNPAID', 'PREPARING'].includes(order.status) && (
              <div>
                {showCancel ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Reason for cancellation"
                      value={cancelReason}
                      onChange={e => setCancelReason(e.target.value)}
                      className="input-field text-sm"
                    />
                    <button onClick={() => doAction('cancel', { reason: cancelReason || 'Cancelled by buyer' })} disabled={actionLoading === 'cancel'} className="btn-danger text-xs py-2">
                      {actionLoading === 'cancel' ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Confirm'}
                    </button>
                    <button onClick={() => setShowCancel(false)} className="btn-secondary text-xs py-2">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setShowCancel(true)} className="btn-danger text-xs py-2 gap-1.5">
                    <Ban className="w-3.5 h-3.5" /> Cancel Order
                  </button>
                )}
              </div>
            )}

            {/* Confirm Receipt - for DELIVERING */}
            {order.status === 'DELIVERING' && (
              <button onClick={() => doAction('confirm')} disabled={actionLoading === 'confirm'} className="btn-primary text-xs py-2 gap-1.5">
                {actionLoading === 'confirm' ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                Confirm Receipt
              </button>
            )}

            {/* Dispute - for DELIVERING or COMPLETED */}
            {['DELIVERING', 'COMPLETED'].includes(order.status) && !activeDispute && (
              <div>
                {showDispute ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      placeholder="Reason (e.g. Item not received)"
                      value={disputeReason}
                      onChange={e => setDisputeReason(e.target.value)}
                      className="input-field text-sm"
                    />
                    <textarea
                      placeholder="Describe your issue in detail"
                      value={disputeMessage}
                      onChange={e => setDisputeMessage(e.target.value)}
                      className="input-field text-sm min-h-[60px]"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => doAction('dispute', { reason: disputeReason || 'Item issue', message: disputeMessage })} disabled={actionLoading === 'dispute'} className="btn-danger text-xs py-2">
                        {actionLoading === 'dispute' ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Submit Dispute'}
                      </button>
                      <button onClick={() => setShowDispute(false)} className="btn-secondary text-xs py-2">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setShowDispute(true)} className="btn-secondary text-xs py-2 gap-1.5 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Shield className="w-3.5 h-3.5" /> Open Dispute
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function OrderDetailPage({ params }) {
  return <OrderDetailContent params={params} />
}
