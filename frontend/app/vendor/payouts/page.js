'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../../components/AppContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { DollarSign, Wallet, TrendingUp, CheckCircle, XCircle, Clock, Plus, ArrowUpRight, Banknote, Loader2 } from 'lucide-react'

export default function VendorPayoutsPage() {
  const router = useRouter()
  const { user, vendor, loading: authLoading } = useApp()
  const [stats, setStats] = useState(null)
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('bKash')
  const [accountNumber, setAccountNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return;
    const token = localStorage.getItem('token')
    if (!token) { router.replace('/signin?role=vendor'); return }
    if (authLoading) return;
    if (!user || user.role !== 'VENDOR') { router.replace('/signin?role=vendor'); return }
    if (!vendor?.isApproved) { setLoading(false); return }
    loadData()
  }, [mounted, user, vendor])

  const loadData = async () => {
    try {
      const [statsRes, payoutsRes] = await Promise.all([
        fetch('/api/payouts/vendor/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/payouts/vendor', { headers: { Authorization: `Bearer ${token}` } })
      ])
      if (statsRes.ok) setStats(await statsRes.json())
      if (payoutsRes.ok) { const d = await payoutsRes.json(); setPayouts(d.payouts) }
    } catch (e) {}
    setLoading(false)
  }

  const handleRequest = async (e) => {
    e.preventDefault()
    if (!amount || amount <= 0 || !accountNumber) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/payouts/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: parseFloat(amount), paymentMethod, accountDetails: { accountNumber } })
      })
      if (res.ok) {
        setShowForm(false); setAmount(''); setAccountNumber('')
        loadData()
      } else {
        const d = await res.json()
        alert(d.error || 'Failed to request payout')
      }
    } catch (e) { alert('Network error') }
    setSubmitting(false)
  }

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  if (!vendor?.isApproved) return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header /><div className="flex-1 flex items-center justify-center"><div className="text-center max-w-md mx-auto p-8">
        <Banknote className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Vendor Account Pending</h2>
        <p className="text-gray-400 text-sm">Your vendor account is not yet approved.</p>
      </div></div><Footer />
    </div>
  )

  const statCards = [
    { label: 'Total Earnings', value: stats?.totalEarnings || 0, icon: TrendingUp, color: 'from-green-500 to-emerald-600' },
    { label: 'Pending Balance', value: stats?.pendingBalance || 0, icon: Wallet, color: 'from-yellow-500 to-orange-600' },
    { label: 'Withdrawn', value: stats?.totalWithdrawn || 0, icon: DollarSign, color: 'from-blue-500 to-cyan-600' },
    { label: 'Available', value: Math.max(0, (stats?.availableBalance || 0)), icon: Banknote, color: 'from-primary-500 to-accent-500' },
  ]

  const statusBadge = (status) => {
    const map = {
      PENDING: ['bg-yellow-500/20 text-yellow-400', Clock],
      APPROVED: ['bg-blue-500/20 text-blue-400', CheckCircle],
      COMPLETED: ['bg-green-500/20 text-green-400', CheckCircle],
      REJECTED: ['bg-red-500/20 text-red-400', XCircle],
      CANCELLED: ['bg-gray-500/20 text-gray-400', XCircle],
    }
    const [cls, Icon] = map[status] || ['bg-gray-500/20 text-gray-400', Clock]
    return <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${cls}`}><Icon className="w-3 h-3" />{status}</span>
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Payouts</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your earnings and withdrawals</p>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Request Payout
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <div key={i} className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-gray-400">{s.label}</p>
              <p className="text-xl font-bold mt-1">৳{s.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-800/50 rounded-2xl border border-gray-700">
          <div className="p-5 border-b border-gray-700">
            <h2 className="font-semibold flex items-center gap-2"><Clock className="w-4 h-4 text-primary-400" /> Withdrawal History</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {payouts.length === 0 ? (
              <div className="p-12 text-center"><Banknote className="w-12 h-12 text-gray-600 mx-auto mb-3" /><p className="text-sm text-gray-400">No withdrawal requests yet</p></div>
            ) : payouts.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-700/20 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold">৳{p.amount.toLocaleString()}</span>
                    {statusBadge(p.status)}
                  </div>
                  <p className="text-xs text-gray-400">{p.paymentMethod} {p.accountDetails ? `(${JSON.parse(p.accountDetails).accountNumber?.slice(-4)})` : ''}</p>
                  <p className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString()}</p>
                  {p.rejectionReason && <p className="text-xs text-red-400 mt-1">Reason: {p.rejectionReason}</p>}
                </div>
                <div className="text-right text-xs text-gray-400">
                  <p>Fee: ৳{p.fee.toLocaleString()}</p>
                  <p>Net: ৳{p.netAmount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md border border-gray-700" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Banknote className="w-5 h-5 text-primary-400" /> Request Withdrawal</h2>
            <p className="text-xs text-gray-400 mb-4">Available balance: <span className="text-white font-bold">৳{Math.max(0, (stats?.availableBalance || 0)).toLocaleString()}</span></p>
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Amount (BDT)</label>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" max={stats?.availableBalance || 0} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white focus:border-primary-500 outline-none" required />
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white focus:border-primary-500 outline-none">
                  <option value="bKash">bKash</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 block mb-1">Account Number</label>
                <input type="text" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} placeholder="Enter account number / wallet ID" className="w-full px-4 py-2.5 bg-gray-900 border border-gray-600 rounded-xl text-white focus:border-primary-500 outline-none" required />
              </div>
              <div className="text-xs text-gray-500">Fee: ~{Math.min(2, Math.max(0.5, amount ? (amount <= 1000 ? 2 : amount <= 5000 ? 1.5 : amount <= 20000 ? 1 : 0.5) : 0))}% of amount</div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-2.5 bg-gray-700 rounded-xl font-semibold hover:bg-gray-600 transition-colors">Cancel</button>
                <button type="submit" disabled={submitting || !amount || amount <= 0 || !accountNumber} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                  {submitting ? 'Processing...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}
