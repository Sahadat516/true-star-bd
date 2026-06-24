'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppProvider, useApp } from '../../../components/AppContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { LayoutDashboard, Package, ShoppingBag, DollarSign, TrendingUp, Settings, LogOut, Plus, Menu, X, Bell, Star, Wallet } from 'lucide-react'

function VendorDashboardContent() {
  const router = useRouter()
  const { user, vendor, logout, loading: authLoading } = useApp()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'VENDOR') {
      router.push('/signin?role=vendor')
      return
    }
    if (!vendor?.isApproved) {
      setLoading(false)
      return
    }
    loadDashboard()
  }, [user, vendor])

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const res = await fetch('/api/vendors/dashboard', { headers })
      const d = await res.json()
      setStats(d.stats)
      setProducts(d.products || [])
    } catch (e) {}
    setLoading(false)
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  if (!vendor?.isApproved) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        <Header />
        <main className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Vendor Registration Pending</h1>
          <p className="text-gray-500 mb-6">Your application is under review. The admin team will verify your details and approve your vendor account shortly.</p>
          <p className="text-sm text-gray-400">Contact: truestarbdltd.2018@gmail.com</p>
          <Link href="/" className="btn-primary mt-6 inline-flex">Back to Home</Link>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="card p-4 sticky top-24">
            <div className="text-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <span className="text-white font-bold text-xl">{vendor?.businessName?.[0] || 'V'}</span>
              </div>
              <h3 className="font-semibold">{vendor?.businessName}</h3>
              <p className="text-xs text-gray-500">{vendor?.totalSales || 0} sales</p>
            </div>
            <nav className="space-y-1">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${activeTab === tab.id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </nav>
            <hr className="my-4 border-gray-200 dark:border-gray-700" />
            <Link href="/" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              Back to Store
            </Link>
          </div>
        </aside>

        {/* Mobile sidebar toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden btn-secondary text-sm py-1.5 px-3 mb-4">
          <Menu className="w-4 h-4" /> Menu
        </button>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 p-4 shadow-xl" onClick={e => e.stopPropagation()}>
              <button onClick={() => setSidebarOpen(false)} className="mb-4"><X className="w-5 h-5" /></button>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'dashboard' && <VendorDashboardMain stats={stats} vendor={vendor} />}
          {activeTab === 'products' && <VendorProducts vendor={vendor} />}
          {activeTab === 'orders' && <VendorOrders vendor={vendor} />}
          {activeTab === 'earnings' && <VendorEarnings vendor={vendor} />}
          {activeTab === 'settings' && <VendorSettings vendor={vendor} />}
        </div>
      </div>
      <Footer />
    </div>
  )
}

function VendorDashboardMain({ stats, vendor }) {
  const cards = [
    { label: 'Total Sales', value: stats?.totalSales || 0, icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'text-purple-500' },
    { label: 'Total Earnings', value: `৳${(stats?.totalEarnings || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-500' },
    { label: 'Pending Balance', value: `৳${(stats?.pendingBalance || 0).toLocaleString()}`, icon: Wallet, color: 'text-yellow-500' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Vendor Dashboard</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="card p-4">
            <card.icon className={`w-8 h-8 ${card.color} mb-2`} />
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h3 className="font-semibold mb-2">Welcome, {vendor?.businessName}!</h3>
        <p className="text-sm text-gray-500">Start selling your digital products. Add products, manage orders, and track your earnings.</p>
        <div className="mt-4 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
          <p className="text-sm font-medium text-primary-700 dark:text-primary-300">Important: Settlement occurs every 15 days. Make sure your products are delivered on time.</p>
        </div>
      </div>
    </div>
  )
}

function VendorProducts({ vendor }) {
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch(`/api/vendors/products`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json()).then(d => setProducts(d.products || []))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Products</h2>
        <button className="btn-primary text-sm py-2"><Plus className="w-4 h-4 inline mr-1" /> Add Product</button>
      </div>
      {products.length === 0 ? (
        <p className="text-gray-500">No products yet. Add your first product!</p>
      ) : (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xl">📦</div>
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">৳{p.price} · {p._count?.orderItems || 0} sold · {p._count?.reviews || 0} reviews</p>
                </div>
              </div>
              <span className={`badge ${p.isApproved ? 'badge-success' : 'badge-warning'}`}>{p.isApproved ? 'Active' : 'Pending'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function VendorOrders({ vendor }) {
  return <div className="card p-6"><p className="text-gray-500">Order management will appear here.</p></div>
}

function VendorEarnings({ vendor }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Earnings & Settlements</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <p className="text-2xl font-bold text-green-600">৳{(vendor?.totalEarnings || 0).toLocaleString()}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-500">Pending Balance (15-day hold)</p>
          <p className="text-2xl font-bold text-yellow-600">৳{(vendor?.pendingBalance || 0).toLocaleString()}</p>
        </div>
      </div>
      <div className="card p-4">
        <h3 className="font-semibold mb-2">How Settlement Works</h3>
        <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
          <li>Customer pays → Money held in escrow</li>
          <li>Product delivered → 15-day countdown starts</li>
          <li>After 15 days → Amount transferred to your account</li>
          <li>Service charge (10%) + VAT (5%) deducted</li>
        </ul>
      </div>
    </div>
  )
}

function VendorSettings({ vendor }) {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-4">Business Settings</h2>
      <div className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">Business Name</label><input defaultValue={vendor?.businessName} className="input-field" /></div>
        <div><label className="block text-sm font-medium mb-1">Business Email</label><input defaultValue={vendor?.businessEmail} className="input-field" /></div>
        <div><label className="block text-sm font-medium mb-1">Business Phone</label><input defaultValue={vendor?.businessPhone} className="input-field" /></div>
        <button className="btn-primary">Save Changes</button>
      </div>
    </div>
  )
}

export default function VendorDashboard() {
  return <AppProvider><VendorDashboardContent /></AppProvider>
}
