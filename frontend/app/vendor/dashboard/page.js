'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../../components/AppContext'
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    if (authLoading) return;
    if (!user || user.role !== 'VENDOR') { router.replace('/signin?role=vendor'); return }
    if (!vendor?.isApproved) {
      setLoading(false)
      return
    }
    loadDashboard()
  }, [mounted, user, vendor])

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
    { id: 'payouts', label: 'Payouts', icon: Wallet, href: '/vendor/payouts' },
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
              {tabs.map(tab => tab.href ? (
                <Link key={tab.id} href={tab.href} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </Link>
              ) : (
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
              {tabs.map(tab => tab.href ? (
                <Link key={tab.id} href={tab.href} onClick={() => setSidebarOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </Link>
              ) : (
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
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({
    name: '', categoryId: '', price: '', salePrice: '', description: '', image: '',
    features: '', requirements: '',
  })

  useEffect(() => {
    loadProducts()
    fetch('/api/categories').then(r => r.json()).then(d => setCategories((d.categories || []).sort((a,b) => a.name.localeCompare(b.name)))).catch(() => {})
  }, [])

  const loadProducts = async () => {
    const res = await fetch('/api/vendors/products', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
    const d = await res.json()
    setProducts(d.products || [])
  }

  const handleImageUpload = async (e) => {
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
      if (data.url) setForm(p => ({ ...p, image: data.url }))
    } catch (e) { console.error(e) }
    setUploading(false)
  }

  const saveProduct = async () => {
    if (!form.name || !form.price || !form.categoryId) {
      setMsg('Name, price, and category are required')
      return
    }
    setSaving(true); setMsg('')
    try {
      const payload = {
        name: form.name,
        categoryId: form.categoryId,
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        description: form.description,
        image: form.image,
        features: form.features,
        requirements: form.requirements,
      }
      const url = editId ? `/api/products/${editId}` : '/api/vendors/products'
      const method = editId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setMsg(data.error || 'Failed to save'); setSaving(false); return }
      setMsg(editId ? 'Product updated!' : 'Product created! Awaiting admin approval.')
      resetForm()
      loadProducts()
    } catch (e) { setMsg('Error: ' + e.message) }
    setSaving(false)
  }

  const resetForm = () => {
    setForm({ name: '', categoryId: '', price: '', salePrice: '', description: '', image: '', features: '', requirements: '' })
    setShowForm(false)
    setEditId(null)
  }

  const editProduct = (p) => {
    setForm({
      name: p.name, categoryId: p.categoryId?.toString() || '',
      price: p.price?.toString() || '', salePrice: p.salePrice?.toString() || '',
      description: p.description || '', image: p.image || '', features: p.features || '', requirements: p.requirements || '',
    })
    setEditId(p.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      loadProducts()
    } catch (e) { console.error(e) }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Products</h2>
        <button onClick={() => { resetForm(); setShowForm(!showForm) }}
          className="btn-primary text-sm py-2"><Plus className="w-4 h-4 inline mr-1" /> {showForm ? 'Cancel' : 'Add Product'}</button>
      </div>

      {msg && <div className={`p-3 rounded-lg text-sm mb-4 ${msg.includes('Error') ? 'bg-red-900/30 text-red-400' : 'bg-green-900/30 text-green-400'}`}>{msg}</div>}

      {/* Product Form */}
      {showForm && (
        <div className="card p-6 mb-6 page-enter">
          <h3 className="text-lg font-semibold mb-4">{editId ? 'Edit Product' : 'Add New Product'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="e.g. ChatGPT Premium - 1 Year" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category *</label>
              <select value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))} className="input-field">
                <option value="">Select category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price (৳) *</label>
              <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="input-field" placeholder="1000" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sale Price (৳)</label>
              <input type="number" value={form.salePrice} onChange={e => setForm(p => ({ ...p, salePrice: e.target.value }))} className="input-field" placeholder="800 (optional)" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              className="input-field" rows={4} placeholder="Describe your product..." />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Features (one per line)</label>
              <textarea value={form.features} onChange={e => setForm(p => ({ ...p, features: e.target.value }))}
                className="input-field" rows={3} placeholder="24/7 Support&#10;Instant Delivery&#10;Lifetime Access" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Requirements</label>
              <textarea value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))}
                className="input-field" rows={3} placeholder="Active email account" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Product Image</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden border">
                {form.image ? (
                  <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <label className="btn-secondary text-xs py-2 px-4 cursor-pointer inline-block">
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {form.image && <button onClick={() => setForm(p => ({ ...p, image: '' }))} className="text-xs text-red-400 ml-2">Remove</button>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={saveProduct} disabled={saving} className="btn-primary"><Package className="w-4 h-4 inline mr-1" /> {saving ? 'Saving...' : (editId ? 'Update Product' : 'Create Product')}</button>
            <button onClick={resetForm} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Products List */}
      {products.length === 0 ? (
        <div className="card p-8 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No products yet. Click "Add Product" to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="product-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-gray-400" />}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{p.name}</p>
                  <p className="text-sm text-gray-500">
                    ৳{p.salePrice || p.price}
                    {p.salePrice && <span className="line-through text-xs text-gray-400 ml-1">৳{p.price}</span>}
                    {' · '}{p._count?.orderItems || 0} sold
                    {p.category && <span> · {p.category.icon} {p.category.name}</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <span className={`badge ${p.isApproved ? 'badge-success' : 'badge-warning'}`}>{p.isApproved ? 'Active' : 'Pending'}</span>
                <button onClick={() => editProduct(p)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" title="Edit">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button onClick={() => deleteProduct(p.id)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500" title="Delete">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
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
  return <VendorDashboardContent />
}
