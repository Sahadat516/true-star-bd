'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../components/AppContext'
import { LayoutDashboard, Users, ShoppingBag, Package, Settings, LogOut, TrendingUp, DollarSign, AlertTriangle, CheckCircle, XCircle, Menu, X, Bell, Store, FileText, Shield, Edit3, Globe, Save, Plus, Trash2, Eye, BookOpen, CreditCard, Smartphone } from 'lucide-react'

function AdminContent() {
  const router = useRouter()
  const { user, logout, loading: authLoading } = useApp()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [data, setData] = useState({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return;
    const token = localStorage.getItem('token')
    if (!token) { router.replace('/signin'); return }
    if (authLoading) return;
    if (!user || !['SUPER_ADMIN', 'ADMIN', 'STAFF'].includes(user.role)) {
      router.replace('/signin')
      return
    }
    loadDashboard()
  }, [mounted, user, authLoading])

  if (!mounted) return <div className="min-h-screen bg-gray-900" />
  if (authLoading || loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>

  async function loadDashboard() {
    try {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const res = await fetch('/api/admin/dashboard', { headers })
      const d = await res.json()
      setStats(d.stats)
      setData(d)
    } catch (e) {}
    setLoading(false)
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'vendors', label: 'Vendors', icon: Store },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'pages', label: 'Page Editor', icon: Edit3 },
    { id: 'site-settings', label: 'Site Settings', icon: Globe },
    { id: 'device-access', label: 'Device Access', icon: Smartphone },
    { id: 'fraud', label: 'Fraud Detection', icon: AlertTriangle },
    { id: 'ai-monitor', label: 'AI Monitor', icon: TrendingUp },
    { id: 'payouts', label: 'Payouts', icon: DollarSign },
    { id: 'disputes', label: 'Disputes', icon: Shield },
    { id: 'reports', label: 'Reports', icon: BookOpen },
    { id: 'settings', label: 'System', icon: Settings },
  ]

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-800 z-50 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">TS</span>
              </div>
              <span className="font-bold">Admin Panel</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><X className="w-5 h-5" /></button>
          </div>
          <p className="text-xs text-gray-400 mt-1 capitalize">{user?.role?.replace('_', ' ')}</p>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
          <hr className="my-4 border-gray-700" />
          <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-700 hover:text-white">
            <Shield className="w-4 h-4" /> Back to Site
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/30">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </nav>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="lg:ml-64">
        <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu className="w-5 h-5" /></button>
          <h2 className="font-semibold">{tabs.find(t => t.id === activeTab)?.label}</h2>
          <div className="flex items-center gap-3">
            <button className="relative"><Bell className="w-5 h-5 text-gray-400" /></button>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-sm font-medium">{user?.firstName?.[0]}</div>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          {activeTab === 'dashboard' && <DashboardPanel stats={stats} data={data} />}
          {activeTab === 'users' && <UsersPanel />}
          {activeTab === 'vendors' && <VendorsPanel />}
          {activeTab === 'products' && <ProductsPanel />}
          {activeTab === 'orders' && <OrdersPanel />}
          {activeTab === 'pages' && <PagesEditor />}
          {activeTab === 'site-settings' && <SiteSettingsEditor />}
          {activeTab === 'device-access' && <DeviceAccessPanel />}
          {activeTab === 'payouts' && <PayoutsPanel />}
          {activeTab === 'disputes' && <DisputesPanel />}
          {activeTab === 'fraud' && <FraudPanel />}
          {activeTab === 'ai-monitor' && <AIMonitorPanel />}
          {activeTab === 'reports' && <ReportsPanel />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  )
}

function DashboardPanel({ stats, data }) {
  if (!stats) return <p className="text-gray-400">Loading...</p>
  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Vendors', value: stats.totalVendors, icon: Store, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { label: 'Revenue', value: `৳${(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Pending Vendors', value: stats.pendingVendors, icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ]
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className={`w-10 h-10 ${card.bg} rounded-lg flex items-center justify-center mb-3`}><card.icon className={`w-5 h-5 ${card.color}`} /></div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm text-gray-400">{card.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-3 px-2">Order</th><th className="text-left py-3 px-2">Customer</th><th className="text-left py-3 px-2">Total</th><th className="text-left py-3 px-2">Status</th><th className="text-left py-3 px-2">Date</th>
            </tr></thead>
            <tbody>
              {data?.recentOrders?.map(order => (
                <tr key={order.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3 px-2 font-mono text-xs">{order.orderNumber}</td>
                  <td className="py-3 px-2">{order.user?.firstName || 'N/A'}</td>
                  <td className="py-3 px-2">৳{order.total?.toLocaleString()}</td>
                  <td className="py-3 px-2"><span className={`badge ${order.status === 'COMPLETED' ? 'badge-success' : order.status === 'PENDING' ? 'badge-warning' : 'badge-primary'}`}>{order.status}</span></td>
                  <td className="py-3 px-2 text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function UsersPanel() {
  const [users, setUsers] = useState([]); const [filter, setFilter] = useState('')
  const load = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/admin/users${filter ? `?role=${filter}` : ''}`, { headers: { Authorization: `Bearer ${token}` } })
    const d = await res.json(); setUsers(d.users || [])
  }
  useEffect(() => { load() }, [filter])
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token')
    await fetch(`/api/admin/users/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) })
    load()
  }
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        {['', 'CUSTOMER', 'VENDOR', 'STAFF'].map(r => (
          <button key={r} onClick={() => setFilter(r)} className={`px-3 py-1.5 rounded-lg text-sm ${filter === r ? 'bg-primary-600' : 'bg-gray-800 hover:bg-gray-700'}`}>{r || 'All'}</button>
        ))}
      </div>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-gray-400 border-b border-gray-700">
            <th className="text-left py-3 px-4">Name</th><th className="text-left py-3 px-4">Email</th><th className="text-left py-3 px-4">Role</th><th className="text-left py-3 px-4">Status</th><th className="text-left py-3 px-4">Actions</th>
          </tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                <td className="py-3 px-4">{u.firstName} {u.lastName}</td>
                <td className="py-3 px-4 text-gray-400">{u.email}</td>
                <td className="py-3 px-4"><span className="badge-primary">{u.role}</span></td>
                <td className="py-3 px-4"><span className={`badge ${u.status === 'ACTIVE' ? 'badge-success' : u.status === 'SUSPENDED' ? 'badge-warning' : 'badge-danger'}`}>{u.status}</span></td>
                <td className="py-3 px-4">
                  <div className="flex gap-1 flex-wrap">
                    {u.status !== 'ACTIVE' && <button onClick={() => updateStatus(u.id, 'ACTIVE')} className="px-2 py-1 bg-green-600 text-xs rounded hover:bg-green-700"><CheckCircle className="w-3 h-3 inline" /> Activate</button>}
                    {u.status !== 'SUSPENDED' && <button onClick={() => updateStatus(u.id, 'SUSPENDED')} className="px-2 py-1 bg-yellow-600 text-xs rounded hover:bg-yellow-700"><AlertTriangle className="w-3 h-3 inline" /> Suspend</button>}
                    {u.status !== 'BANNED' && <button onClick={() => updateStatus(u.id, 'BANNED')} className="px-2 py-1 bg-red-600 text-xs rounded hover:bg-red-700"><XCircle className="w-3 h-3 inline" /> Ban</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function VendorsPanel() {
  const [vendors, setVendors] = useState([])
  const [allVendors, setAllVendors] = useState([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token'); const headers = { Authorization: `Bearer ${token}` }
    fetch('/api/admin/vendors/pending', { headers }).then(r => r.json()).then(d => setVendors(d.vendors || []))
    fetch('/api/admin/users?role=VENDOR', { headers }).then(r => r.json()).then(d => setAllVendors(d.users || []))
  }, [])

  const approve = async (id) => {
    await fetch(`/api/admin/vendors/${id}/approve`, { method: 'PATCH', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    setVendors(prev => prev.filter(v => v.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="font-semibold mb-4">Pending Approvals ({vendors.length})</h3>
        {vendors.length === 0 ? <p className="text-gray-400">No pending vendors</p> : (
          <div className="space-y-3">
            {vendors.map(v => (
              <div key={v.id} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                <div><p className="font-medium">{v.businessName}</p><p className="text-sm text-gray-400">{v.user?.email} · {v.businessPhone}</p></div>
                <button onClick={() => approve(v.id)} className="btn-primary text-sm py-1.5 px-4">Approve</button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="font-semibold mb-4">All Vendors ({allVendors.length})</h3>
        <div className="space-y-2">
          {allVendors.slice(0, showAll ? undefined : 10).map(v => (
            <div key={v.id} className="flex items-center justify-between bg-gray-700/30 rounded-lg p-2 text-sm">
              <span>{v.firstName} {v.lastName}</span><span className="text-gray-400">{v.email}</span><span className={`badge ${v.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>{v.status}</span>
            </div>
          ))}
          {allVendors.length > 10 && <button onClick={() => setShowAll(!showAll)} className="text-primary-400 text-sm hover:underline">{showAll ? 'Show Less' : `Show All (${allVendors.length})`}</button>}
        </div>
      </div>
    </div>
  )
}

function ProductsPanel() {
  const [products, setProducts] = useState([])
  const [pending, setPending] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token'); const headers = { Authorization: `Bearer ${token}` }
    fetch('/api/admin/products/pending', { headers }).then(r => r.json()).then(d => setPending(d.products || []))
    fetch('/api/admin/users?role=VENDOR', { headers }).catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/products?limit=50').then(r => r.json()).then(d => setProducts(d.products || [])).catch(() => {})
  }, [])

  const approve = async (id) => {
    await fetch(`/api/admin/products/${id}/approve`, { method: 'PATCH', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    setPending(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div className="bg-gray-800 rounded-xl border border-yellow-700 p-4">
          <h3 className="font-semibold mb-4 text-yellow-400">Pending Approval ({pending.length})</h3>
          <div className="space-y-3">
            {pending.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                <div><p className="font-medium">{p.name}</p><p className="text-sm text-gray-400">{p.vendor?.businessName} · ৳{p.price}</p></div>
                <button onClick={() => approve(p.id)} className="btn-primary text-sm py-1.5 px-4">Approve</button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="font-semibold mb-4">All Products ({products.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-3 px-2">Name</th><th className="text-left py-3 px-2">Price</th><th className="text-left py-3 px-2">Category</th><th className="text-left py-3 px-2">Sales</th><th className="text-left py-3 px-2">Status</th>
            </tr></thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3 px-2">{p.name}</td>
                  <td className="py-3 px-2">৳{p.salePrice || p.price}</td>
                  <td className="py-3 px-2 text-gray-400">{p.category?.name}</td>
                  <td className="py-3 px-2">{p._count?.orderItems || 0}</td>
                  <td className="py-3 px-2"><span className={`badge ${p.isApproved ? 'badge-success' : 'badge-warning'}`}>{p.isApproved ? 'Active' : 'Pending'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function OrdersPanel() {
  const [orders, setOrders] = useState([])
  useEffect(() => {
    fetch('/api/admin/reports/sales', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json()).then(d => setOrders(d.orders || []))
  }, [])

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
      <h3 className="font-semibold mb-4">Order Management</h3>
      {orders.length === 0 ? <p className="text-gray-400">No orders yet</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-gray-400 border-b border-gray-700">
              <th className="text-left py-3 px-2">Order #</th><th className="text-left py-3 px-2">Total</th><th className="text-left py-3 px-2">VAT</th><th className="text-left py-3 px-2">Service</th><th className="text-left py-3 px-2">Status</th><th className="text-left py-3 px-2">Date</th>
            </tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3 px-2 font-mono text-xs">{o.orderNumber}</td>
                  <td className="py-3 px-2">৳{o.total?.toLocaleString()}</td>
                  <td className="py-3 px-2 text-gray-400">৳{o.vat?.toLocaleString()}</td>
                  <td className="py-3 px-2 text-gray-400">৳{o.serviceCharge?.toLocaleString()}</td>
                  <td className="py-3 px-2"><span className={`badge ${o.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'}`}>{o.status}</span></td>
                  <td className="py-3 px-2 text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function PagesEditor() {
  const [pages, setPages] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ slug: '', title: '', content: '', isPublished: true })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    fetch('/api/cms/admin/pages', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setPages(d.pages || []))
  }, [])

  const startEdit = (page) => {
    setEditing(page?.id || 'new')
    setForm(page || { slug: '', title: '', content: '', isPublished: true })
    setMsg('')
  }

  const save = async () => {
    setSaving(true); setMsg('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/cms/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const d = await res.json()
      setMsg('Saved successfully!')
      setEditing(null)
      const r2 = await fetch('/api/cms/admin/pages', { headers: { Authorization: `Bearer ${token}` } })
      const d2 = await r2.json()
      setPages(d2.pages || [])
    } catch (e) { setMsg('Error: ' + e.message) }
    setSaving(false)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-gray-800 rounded-xl border border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Pages</h3>
          <button onClick={() => startEdit(null)} className="btn-primary text-xs py-1.5 px-3"><Plus className="w-3 h-3 inline" /> New</button>
        </div>
        <div className="space-y-2">
          {pages.map(p => (
            <button key={p.id} onClick={() => startEdit(p)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${editing === p.id ? 'bg-primary-600' : 'hover:bg-gray-700'}`}>
              <div><span className="font-medium">{p.title}</span><br /><span className="text-xs text-gray-400">/{p.slug}</span></div>
              {!p.isPublished && <span className="badge-warning text-[10px]">Draft</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="font-semibold mb-4">{editing ? (editing === 'new' ? 'Create Page' : 'Edit Page') : 'Select a page to edit'}</h3>
        {editing ? (
          <div className="space-y-4">
            {msg && <div className="bg-green-900/30 text-green-400 p-2 rounded text-sm">{msg}</div>}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Page URL (/slug)</label>
                <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="about" />
              </div>
              <div>
                <label className="block text-sm mb-1">Page Title</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="About Us" />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Content (HTML)</label>
              <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none text-sm font-mono"
                rows={15} placeholder="<h2>Page Content</h2><p>HTML content here...</p>" />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm(p => ({ ...p, isPublished: e.target.checked }))} />
                Published
              </label>
              <button onClick={save} disabled={saving} className="btn-primary text-sm py-2 px-6"><Save className="w-4 h-4 inline mr-1" /> {saving ? 'Saving...' : 'Save Page'}</button>
              <button onClick={() => setEditing(null)} className="btn-secondary text-sm py-2 px-4">Cancel</button>
              <Link href={`/${form.slug}`} target="_blank" className="text-primary-400 text-sm hover:underline flex items-center gap-1"><Eye className="w-3 h-3" /> Preview</Link>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Select a page from the left panel to edit its content. Changes are saved instantly. No coding required!</p>
        )}
      </div>
    </div>
  )
}

function SiteSettingsEditor() {
  const [settings, setSettings] = useState([])
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetch('/api/cms/admin/settings', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json()).then(d => {
        setSettings(d.settings || [])
        const f = {}; (d.settings || []).forEach(s => { f[s.key] = s.value })
        setForm(f)
      })
  }, [])

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('logo', file)
      const res = await fetch('/api/upload/logo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: fd,
      })
      const data = await res.json()
      if (data.url) {
        setForm(p => ({ ...p, company_logo: data.url }))
        await fetch('/api/cms/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({ key: 'company_logo', value: data.url, type: 'text', group: 'appearance' }),
        })
        setMsg('Logo uploaded successfully!')
      }
    } catch (e) { setMsg('Upload error: ' + e.message) }
    setUploading(false)
  }

  const handleFaviconUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch('/api/upload/image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: fd,
      })
      const data = await res.json()
      if (data.url) {
        setForm(p => ({ ...p, company_favicon: data.url }))
        await fetch('/api/cms/admin/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify({ key: 'company_favicon', value: data.url, type: 'text', group: 'appearance' }),
        })
        setMsg('Favicon uploaded successfully!')
      }
    } catch (e) { setMsg('Upload error: ' + e.message) }
    setUploading(false)
  }

  const groups = {}
  settings.forEach(s => {
    if (!groups[s.group]) groups[s.group] = []
    groups[s.group].push(s)
  })

  // Ensure logo settings appear even if not in DB yet
  if (!groups['appearance']) groups['appearance'] = []
  const appearanceKeys = groups['appearance'].map(s => s.key)
  if (!appearanceKeys.includes('company_logo')) {
    groups['appearance'].unshift({ key: 'company_logo', value: form.company_logo || '', type: 'file', group: 'appearance' })
  }
  if (!appearanceKeys.includes('company_favicon')) {
    groups['appearance'].push({ key: 'company_favicon', value: form.company_favicon || '', type: 'file', group: 'appearance' })
  }

  const saveAll = async () => {
    setSaving(true); setMsg('')
    try {
      const token = localStorage.getItem('token')
      const payload = settings.map(s => ({
        key: s.key, value: form[s.key] || '', type: s.type, group: s.group
      }))
      // Also save logo/favicon if they're not in original settings
      if (form.company_logo && !settings.find(s => s.key === 'company_logo')) {
        payload.push({ key: 'company_logo', value: form.company_logo, type: 'text', group: 'appearance' })
      }
      if (form.company_favicon && !settings.find(s => s.key === 'company_favicon')) {
        payload.push({ key: 'company_favicon', value: form.company_favicon, type: 'text', group: 'appearance' })
      }
      await fetch('/api/cms/admin/settings/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ settings: payload }),
      })
      setMsg('All settings saved successfully!')
    } catch (e) { setMsg('Error: ' + e.message) }
    setSaving(false)
  }

  const groupLabels = { company: 'Company Info', billing: 'Billing & VAT', payment: 'Payment Info', appearance: 'Branding & Appearance', general: 'General', colors: 'Theme Colors', seo: 'SEO & Analytics' }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Site Settings</h3>
        <button onClick={saveAll} disabled={saving} className="btn-primary text-sm py-2 px-6"><Save className="w-4 h-4 inline mr-1" /> {saving ? 'Saving...' : 'Save All Changes'}</button>
      </div>
      {msg && <div className={`p-3 rounded-lg text-sm mb-4 ${msg.includes('Error') ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>{msg}</div>}

      {/* Logo Upload Section */}
      <div className="mb-8 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
        <h4 className="text-md font-semibold mb-3 text-primary-400">Branding</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Company Logo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden border border-gray-600">
                {form.company_logo ? (
                  <img src={form.company_logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-2xl text-gray-500">Logo</span>
                )}
              </div>
              <div>
                <label className="btn-primary text-xs py-2 px-4 cursor-pointer inline-block">
                  {uploading ? 'Uploading...' : 'Upload Logo'}
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                <p className="text-xs text-gray-500 mt-1">Recommended: 200x60px PNG/SVG</p>
                {form.company_logo && (
                  <button onClick={() => setForm(p => ({ ...p, company_logo: '' }))} className="text-xs text-red-400 hover:underline mt-1 block">Remove</button>
                )}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Favicon (Browser Tab Icon)</label>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden border border-gray-600">
                {form.company_favicon ? (
                  <img src={form.company_favicon} alt="Favicon" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-lg text-gray-500">TS</span>
                )}
              </div>
              <div>
                <label className="btn-primary text-xs py-2 px-4 cursor-pointer inline-block">
                  {uploading ? 'Uploading...' : 'Upload Favicon'}
                  <input type="file" accept="image/*" onChange={handleFaviconUpload} className="hidden" />
                </label>
                <p className="text-xs text-gray-500 mt-1">Recommended: 32x32px ICO/PNG</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Colors */}
      <div className="mb-8 p-4 bg-gray-700/30 rounded-xl border border-gray-600">
        <h4 className="text-md font-semibold mb-3 text-primary-400">Theme Colors</h4>
        <p className="text-xs text-gray-500 mb-4">Customize your brand colors. Changes apply immediately after saving.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Primary Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.primary_color || '#25D366'} onChange={e => setForm(p => ({ ...p, primary_color: e.target.value }))} className="w-12 h-12 rounded-lg cursor-pointer border border-gray-600 bg-transparent" />
              <span className="text-xs font-mono text-gray-400">{form.primary_color || '#25D366'}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Accent Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={form.accent_color || '#075E54'} onChange={e => setForm(p => ({ ...p, accent_color: e.target.value }))} className="w-12 h-12 rounded-lg cursor-pointer border border-gray-600 bg-transparent" />
              <span className="text-xs font-mono text-gray-400">{form.accent_color || '#075E54'}</span>
            </div>
          </div>
          <div className="flex items-end">
            <div className="w-full p-3 rounded-lg" style={{ background: `linear-gradient(135deg, ${form.primary_color || '#25D366'}, ${form.accent_color || '#075E54'})` }}>
              <p className="text-xs text-white font-semibold text-center">Preview</p>
            </div>
          </div>
        </div>
      </div>

      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="mb-8">
          <h4 className="text-md font-semibold mb-3 text-primary-400 border-b border-gray-700 pb-2">{groupLabels[group] || group}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.filter(s => s.key !== 'company_logo' && s.key !== 'company_favicon').map(s => (
              <div key={s.key}>
                <label className="block text-sm text-gray-400 mb-1">{s.key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                {s.type === 'number' ? (
                  <input type="number" value={form[s.key] || ''} onChange={e => setForm(p => ({ ...p, [s.key]: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                ) : (
                  <input value={form[s.key] || ''} onChange={e => setForm(p => ({ ...p, [s.key]: e.target.value }))} className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ReportsPanel() {
  const [report, setReport] = useState(null)
  useEffect(() => {
    fetch('/api/admin/reports/sales', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json()).then(d => setReport(d.report))
  }, [])

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
      <h3 className="font-semibold mb-4">Sales Report</h3>
      {report ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3 text-center"><p className="text-2xl font-bold">৳{report.totalRevenue?.toLocaleString()}</p><p className="text-xs text-gray-400">Total Revenue</p></div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center"><p className="text-2xl font-bold">৳{report.totalVat?.toLocaleString()}</p><p className="text-xs text-gray-400">Total VAT</p></div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center"><p className="text-2xl font-bold">৳{report.totalServiceCharge?.toLocaleString()}</p><p className="text-xs text-gray-400">Service Charge</p></div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center"><p className="text-2xl font-bold">{report.totalOrders}</p><p className="text-xs text-gray-400">Total Orders</p></div>
          <div className="bg-gray-700/50 rounded-lg p-3 text-center"><p className="text-2xl font-bold">৳{report.netRevenue?.toLocaleString()}</p><p className="text-xs text-gray-400">Net Revenue</p></div>
        </div>
      ) : <p className="text-gray-400">Loading...</p>}
    </div>
  )
}

function PayoutsPanel() {
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    const url = filter ? `/api/payouts/admin?status=${filter}` : '/api/payouts/admin'
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setPayouts(d.payouts || [])).catch(() => {}).finally(() => setLoading(false))
  }, [filter])

  const handleAction = async (id, action) => {
    const reason = action === 'reject' ? prompt('Rejection reason:') : null
    if (action === 'reject' && !reason) return
    const txId = action === 'complete' ? prompt('Transaction ID (optional):') : null
    try {
      const res = await fetch(`/api/payouts/admin/${id}/${action}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(action === 'reject' ? { rejectionReason: reason } : action === 'complete' ? { transactionId: txId || undefined } : {}),
      })
      if (res.ok) {
        setPayouts(prev => prev.map(p => p.id === id ? { ...p, status: action === 'approve' ? 'APPROVED' : action === 'reject' ? 'REJECTED' : 'COMPLETED', rejectionReason: reason } : p))
      }
    } catch (e) {}
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3"><DollarSign className="w-6 h-6 text-primary-400" /> Payout Requests</h2>
        <select value={filter} onChange={e => { setFilter(e.target.value); setLoading(true) }} className="bg-gray-800 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white outline-none">
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>
      <div className="space-y-3">
        {payouts.length === 0 ? (
          <div className="bg-gray-800/50 rounded-2xl p-12 text-center">
            <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Payouts</h3>
            <p className="text-sm text-gray-400">No payout requests found.</p>
          </div>
        ) : payouts.map(p => (
          <div key={p.id} className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg">৳{p.amount.toLocaleString()}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    p.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                    p.status === 'APPROVED' ? 'bg-blue-500/20 text-blue-400' :
                    p.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{p.status}</span>
                </div>
                <p className="text-sm text-gray-300">{p.vendor?.user?.firstName} {p.vendor?.user?.lastName} <span className="text-gray-500">({p.vendor?.businessName})</span></p>
                <p className="text-xs text-gray-400 mt-1">{p.paymentMethod} | Fee: ৳{p.fee.toLocaleString()} | Net: ৳{p.netAmount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()} {new Date(p.createdAt).toLocaleTimeString()}</p>
                {p.rejectionReason && <p className="text-xs text-red-400 mt-1">Rejected: {p.rejectionReason}</p>}
              </div>
              {p.status === 'PENDING' && (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleAction(p.id, 'approve')} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-semibold rounded-lg transition-colors">Approve</button>
                  <button onClick={() => handleAction(p.id, 'reject')} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-xs font-semibold rounded-lg transition-colors">Reject</button>
                </div>
              )}
              {p.status === 'APPROVED' && (
                <button onClick={() => handleAction(p.id, 'complete')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-xs font-semibold rounded-lg transition-colors shrink-0">Mark Paid</button>
              )}
              {p.status === 'COMPLETED' && <span className="text-xs text-green-400 italic shrink-0">Paid</span>}
              {p.status === 'REJECTED' && <span className="text-xs text-red-400 italic shrink-0">Rejected</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DisputesPanel() {
  const [disputes, setDisputes] = useState([])
  const [loading, setLoading] = useState(true)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    fetch('/api/admin/disputes', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => setDisputes(d.disputes || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const resolveDispute = async (id, status, resolution) => {
    try {
      await fetch(`/api/orders/disputes/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, resolution }),
      })
      setDisputes(prev => prev.map(d => d.id === id ? { ...d, status } : d))
    } catch (e) {}
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Shield className="w-6 h-6 text-primary-400" /> Dispute Management</h2>
      <div className="space-y-4">
        {disputes.length === 0 ? (
          <div className="bg-gray-800/50 rounded-2xl p-12 text-center">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Disputes</h3>
            <p className="text-sm text-gray-400">All disputes have been resolved.</p>
          </div>
        ) : disputes.map(dispute => (
          <div key={dispute.id} className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    dispute.status === 'OPEN' ? 'bg-yellow-500/20 text-yellow-400' :
                    dispute.status === 'INVESTIGATING' ? 'bg-blue-500/20 text-blue-400' :
                    dispute.status === 'RESOLVED' ? 'bg-green-500/20 text-green-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>{dispute.status}</span>
                  <span className="text-xs text-gray-400">Order #{dispute.order?.orderNumber?.slice(-8)}</span>
                  <span className="text-xs text-gray-400">৳{dispute.order?.total?.toLocaleString()}</span>
                </div>
                <p className="font-semibold">{dispute.reason}</p>
                {dispute.message && <p className="text-sm text-gray-400 mt-1">{dispute.message}</p>}
                <p className="text-xs text-gray-500 mt-2">Created: {new Date(dispute.createdAt).toLocaleDateString()}</p>
              </div>
              {dispute.status === 'OPEN' || dispute.status === 'INVESTIGATING' ? (
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => resolveDispute(dispute.id, 'RESOLVED', 'Resolved by admin')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-xs font-semibold rounded-lg transition-colors">
                    <CheckCircle className="w-3 h-3" /> Resolve
                  </button>
                  <button onClick={() => resolveDispute(dispute.id, 'DISMISSED', 'Dismissed by admin')} className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-xs font-semibold rounded-lg transition-colors">
                    <XCircle className="w-3 h-3" /> Dismiss
                  </button>
                </div>
              ) : (
                <span className="text-xs text-gray-500 italic">Resolved</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FraudPanel() {
  const [alerts, setAlerts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  useEffect(() => {
    Promise.all([
      fetch('/api/fraud/alerts', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/fraud/stats', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([a, s]) => { setAlerts(a.alerts || []); setStats(s.stats); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const resolveAlert = async (id, status) => {
    await fetch(`/api/fraud/alerts/${id}/resolve`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status }) })
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  if (loading) return <div className="text-center py-8 text-gray-400">Loading fraud data...</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
          <AlertTriangle className="w-6 h-6 text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-400">{stats?.highRisk || 0}</p>
          <p className="text-xs text-gray-400">High Risk</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
          <AlertTriangle className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-yellow-400">{stats?.lowRisk || 0}</p>
          <p className="text-xs text-gray-400">Warnings</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-400">{stats?.totalAlerts || 0}</p>
          <p className="text-xs text-gray-400">Total Alerts</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
          <Bell className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-400">{stats?.recentAlerts || 0}</p>
          <p className="text-xs text-gray-400">Last 24 Hours</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2"><Shield className="w-4 h-4 text-primary-400" /> AI Fraud Detection Alerts</h3>
          <span className="text-xs text-gray-400">AI-powered · Real-time monitoring</span>
        </div>
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-3 text-green-500" />
            <p>No fraud alerts detected. Your platform is secure.</p>
            <p className="text-xs mt-2">The AI fraud detection system is monitoring all transactions 24/7.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-700/50">
                <tr><th className="text-left p-3 text-gray-400 font-medium">Type</th><th className="text-left p-3 text-gray-400 font-medium">User</th><th className="text-left p-3 text-gray-400 font-medium">Details</th><th className="text-left p-3 text-gray-400 font-medium">Risk</th><th className="text-left p-3 text-gray-400 font-medium">Status</th><th className="text-left p-3 text-gray-400 font-medium">Action</th></tr>
              </thead>
              <tbody>
                {alerts.map(alert => (
                  <tr key={alert.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                    <td className="p-3"><span className="badge bg-gray-700 text-xs px-2 py-1 rounded">{alert.type}</span></td>
                    <td className="p-3">{alert.user?.email || 'Unknown'}</td>
                    <td className="p-3 text-gray-400 max-w-xs truncate">{alert.details}</td>
                    <td className="p-3"><span className={`text-xs px-2 py-1 rounded ${alert.risk === 'high' ? 'bg-red-900/50 text-red-400' : 'bg-yellow-900/50 text-yellow-400'}`}>{alert.risk}</span></td>
                    <td className="p-3"><span className={`text-xs px-2 py-1 rounded ${alert.status === 'FLAGGED' ? 'bg-red-900/50 text-red-400' : alert.status === 'WARNING' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-green-900/50 text-green-400'}`}>{alert.status}</span></td>
                    <td className="p-3">
                      {alert.status !== 'RESOLVED' && (
                        <div className="flex gap-1">
                          <button onClick={() => resolveAlert(alert.id, 'RESOLVED')} className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded hover:bg-green-600/40">Resolve</button>
                          <button onClick={() => resolveAlert(alert.id, 'DISMISSED')} className="text-xs px-2 py-1 bg-gray-700 text-gray-400 rounded hover:bg-gray-600">Dismiss</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-primary-900/50 to-accent-900/50 rounded-xl border border-primary-700/30 p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary-400" />
          <div>
            <h4 className="font-semibold text-sm">AI Fraud Detection System</h4>
            <p className="text-xs text-gray-400 mt-1">The system automatically monitors: suspicious logins, unusual order patterns, failed payment attempts, and rapid API calls. High-risk activities trigger automatic account suspension and admin notification. All data is processed locally — no third-party sharing.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeviceAccessPanel() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterEmail, setFilterEmail] = useState('')
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  useEffect(() => {
    const url = filterEmail ? `/api/admin/devices?email=${filterEmail}` : '/api/admin/devices'
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setSessions(d.sessions || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [filterEmail])

  const forceLogout = async (sessionId) => {
    await fetch(`/api/admin/devices/${sessionId}/logout`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}` },
    })
    setSessions(prev => prev.filter(s => s.id !== sessionId))
  }

  if (loading) return <div className="text-center py-8 text-gray-400">Loading device data...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <input value={filterEmail} onChange={e => setFilterEmail(e.target.value)} placeholder="Filter by email..." className="w-full max-w-xs px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
        {filterEmail && <button onClick={() => setFilterEmail('')} className="text-xs text-gray-400 hover:text-white">Clear</button>}
      </div>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2"><Smartphone className="w-4 h-4 text-primary-400" /> Active User Sessions</h3>
          <span className="text-xs text-gray-400">{sessions.length} active sessions</span>
        </div>
        {sessions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Smartphone className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p>No active sessions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-700/50">
                <tr><th className="text-left p-3 text-gray-400 font-medium">User</th><th className="text-left p-3 text-gray-400 font-medium">Device</th><th className="text-left p-3 text-gray-400 font-medium">Browser</th><th className="text-left p-3 text-gray-400 font-medium">OS</th><th className="text-left p-3 text-gray-400 font-medium">Location</th><th className="text-left p-3 text-gray-400 font-medium">IP</th><th className="text-left p-3 text-gray-400 font-medium">Last Seen</th><th className="text-left p-3 text-gray-400 font-medium">Action</th></tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.id} className="border-t border-gray-700 hover:bg-gray-700/30">
                    <td className="p-3">{s.user?.email || 'Unknown'}</td>
                    <td className="p-3"><span className="badge bg-gray-700 text-xs px-2 py-1 rounded">{s.device || 'Unknown'}</span></td>
                    <td className="p-3 text-gray-300">{s.browser || '-'}</td>
                    <td className="p-3 text-gray-300">{s.os || '-'}</td>
                    <td className="p-3 text-gray-300">{s.location || '-'}</td>
                    <td className="p-3 text-gray-400 text-xs font-mono">{s.ip || '-'}</td>
                    <td className="p-3 text-xs text-gray-400">{s.lastSeen ? new Date(s.lastSeen).toLocaleString() : '-'}</td>
                    <td className="p-3">
                      <button onClick={() => forceLogout(s.id)} className="text-xs px-2 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40">Force Logout</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="bg-gray-700/30 rounded-xl border border-gray-700 p-4">
        <h4 className="font-semibold text-sm mb-2">Device Tracking System</h4>
        <p className="text-xs text-gray-400">Every login attempt is logged with device fingerprint (device type, browser, OS, IP address, and geographic location). Active sessions can be monitored and terminated from this panel. Location data is approximate, based on IP address geolocation.</p>
      </div>
    </div>
  )
}

function AIMonitorPanel() {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

  useEffect(() => {
    fetch('/api/admin/monitor', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setMetrics(d); setLoading(false) })
      .catch(() => setLoading(false))
    const interval = setInterval(() => {
      fetch('/api/admin/monitor', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json()).then(d => setMetrics(d)).catch(() => {})
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="text-center py-8 text-gray-400">Loading AI monitor data...</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
          <p className="text-3xl font-bold text-primary-400">{metrics?.activeUsers || 0}</p>
          <p className="text-xs text-gray-400 mt-1">Active Users (24h)</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
          <p className="text-3xl font-bold text-green-400">{metrics?.requestsPerMin || 0}</p>
          <p className="text-xs text-gray-400 mt-1">Requests/Minute</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
          <p className="text-3xl font-bold text-yellow-400">{metrics?.errorRate || 0}%</p>
          <p className="text-xs text-gray-400 mt-1">Error Rate</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
          <p className="text-3xl font-bold text-purple-400">{metrics?.avgResponseTime || 0}ms</p>
          <p className="text-xs text-gray-400 mt-1">Avg Response Time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <h4 className="font-semibold text-sm mb-3">System Health</h4>
          <div className="space-y-3">
            <div><div className="flex justify-between text-xs mb-1"><span>CPU Usage</span><span>{metrics?.cpuUsage || 0}%</span></div><div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-primary-500 h-2 rounded-full" style={{ width: `${Math.min(100, metrics?.cpuUsage || 0)}%` }} /></div></div>
            <div><div className="flex justify-between text-xs mb-1"><span>Memory Usage</span><span>{metrics?.memoryUsage || 0}%</span></div><div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-accent-500 h-2 rounded-full" style={{ width: `${Math.min(100, metrics?.memoryUsage || 0)}%` }} /></div></div>
            <div><div className="flex justify-between text-xs mb-1"><span>Database Connections</span><span>{metrics?.dbConnections || 0}</span></div><div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(100, ((metrics?.dbConnections || 0) / 10) * 100)}%` }} /></div></div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
          <h4 className="font-semibold text-sm mb-3">Auto-Management Actions</h4>
          <div className="space-y-2">
            {metrics?.recentActions?.length > 0 ? metrics.recentActions.map((action, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-gray-700/30 rounded-lg">
                {action.type === 'auto_suspend' ? <Shield className="w-4 h-4 text-red-400 mt-0.5" /> : <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />}
                <div><p className="text-xs">{action.description}</p><p className="text-[10px] text-gray-500">{new Date(action.timestamp).toLocaleString()}</p></div>
              </div>
            )) : <p className="text-xs text-gray-500 text-center py-4">No auto-management actions yet. The AI system is monitoring for anomalies.</p>}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-primary-900/50 to-accent-900/50 rounded-xl border border-primary-700/30 p-4">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary-400" />
          <div>
            <h4 className="font-semibold text-sm">AI Monitoring System</h4>
            <p className="text-xs text-gray-400 mt-1">Real-time monitoring covers: server health (CPU, memory, response time), user behavior analytics (active users, request patterns), anomaly detection (unusual traffic, error rate spikes), and automated content moderation. Dashboard auto-refreshes every 15 seconds. All data is processed locally on your server.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsPanel() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="font-semibold mb-4">System Configuration</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">VAT Percentage</span><span className="font-medium">5%</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Service Charge</span><span className="font-medium">10%</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Settlement Days</span><span className="font-medium">15 Days</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Environment</span><span className="badge-success">Development</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Database</span><span className="text-gray-300">SQLite</span></div>
        </div>
      </div>
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
        <h3 className="font-semibold mb-4">TRUE STAR BD LIMITED</h3>
        <div className="space-y-2 text-sm">
          <p><span className="text-gray-400">Address:</span><br />73, Lion Shopping Complex (1st Floor), Monipuripara, Airport Road, Tejgaon, Dhaka-1215</p>
          <p><span className="text-gray-400">Phone:</span> +880-1812-054785</p>
          <p><span className="text-gray-400">Email:</span> truestarbdltd.2018@gmail.com</p>
          <p><span className="text-gray-400">WhatsApp:</span> +880-1812-054785</p>
          <p><span className="text-gray-400">Telegram:</span> @Sahadat516</p>
          <p><span className="text-gray-400">Facebook:</span> https://www.facebook.com/TrueStarBD</p>
        </div>
      </div>
    </div>
  )
}

export default function Admin() {
  return <AdminContent />
}
