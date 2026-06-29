'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../components/AppContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { LayoutDashboard, ShoppingBag, Download, User, HeadphonesIcon, Package, Clock, CheckCircle, XCircle, ChevronRight, Menu, X, Star, Wallet, Shield, Mail, Phone, MapPin, Save, Camera, MessageSquare } from 'lucide-react'

function DashboardContent() {
  const router = useRouter()
  const { user, loading: authLoading } = useApp()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({ totalOrders: 0, completed: 0, pending: 0, downloads: 0 })
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', phone: '', country: '' })
  const [saving, setSaving] = useState(false)
  const [supportTickets, setSupportTickets] = useState([])

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/signin'); return }
    setProfileForm({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.phone || '', country: user.country || '' })
    loadOrders()
    loadSupport()
  }, [user, authLoading])

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      const d = await res.json()
      setOrders(d.orders || [])
      setStats({
        totalOrders: d.orders?.length || 0,
        completed: d.orders?.filter(o => o.status === 'COMPLETED' || o.status === 'DELIVERED').length || 0,
        pending: d.orders?.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length || 0,
        downloads: d.orders?.filter(o => o.status === 'COMPLETED').length || 0,
      })
    } catch (e) {}
    setLoading(false)
  }

  const loadSupport = async () => {
    try {
      const res = await fetch('/api/support', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      const d = await res.json()
      setSupportTickets(d.tickets || [])
    } catch (e) {}
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(profileForm),
      })
    } catch (e) {}
    setSaving(false)
  }

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'support', label: 'Support', icon: HeadphonesIcon },
  ]

  const orderStatusBadge = (status) => {
    const map = {
      PENDING: 'badge-warning', PROCESSING: 'badge-warning',
      COMPLETED: 'badge-success', DELIVERED: 'badge-success',
      CANCELLED: 'badge-danger', REFUNDED: 'badge-danger',
    }
    return map[status] || 'badge-warning'
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
                <span className="text-white font-bold text-xl">{user?.firstName?.[0]?.toUpperCase() || 'U'}</span>
              </div>
              <h3 className="font-semibold">{user?.firstName} {user?.lastName}</h3>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.replace(/_/g, ' ').toLowerCase()}</p>
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
          {activeTab === 'dashboard' && <OverviewTab stats={stats} user={user} orders={orders} />}
          {activeTab === 'orders' && <OrdersTab orders={orders} loadOrders={loadOrders} orderStatusBadge={orderStatusBadge} />}
          {activeTab === 'downloads' && <DownloadsTab orders={orders} />}
          {activeTab === 'profile' && <ProfileTab form={profileForm} setForm={setProfileForm} saving={saving} onSave={handleSaveProfile} user={user} />}
          {activeTab === 'support' && <SupportTab tickets={supportTickets} />}
        </div>
      </div>
      <Footer />
    </div>
  )
}

function OverviewTab({ stats, user, orders }) {
  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-500' },
    { label: 'Downloads', value: stats.downloads, icon: Download, color: 'text-purple-500' },
  ]
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Welcome, {user?.firstName}!</h2>
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
        <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-4 h-4" /> Recent Orders</h3>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No orders yet</p>
            <Link href="/products" className="btn-primary text-sm mt-4 inline-flex">Browse Products</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm">
                <div>
                  <p className="font-medium">#{o.orderNumber}</p>
                  <p className="text-xs text-gray-500">{o.items?.length || 0} item(s) · {new Date(o.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`badge ${o.status === 'COMPLETED' || o.status === 'DELIVERED' ? 'badge-success' : o.status === 'CANCELLED' ? 'badge-danger' : 'badge-warning'}`}>{o.status}</span>
              </div>
            ))}
          </div>
        )}
        {orders.length > 0 && <Link href="#" onClick={e => { e.preventDefault(); window.dispatchEvent(new CustomEvent('tabChange', { detail: 'orders' })) }} className="text-sm text-primary-600 hover:underline mt-3 inline-block">View All Orders →</Link>}
      </div>
    </div>
  )
}

function OrdersTab({ orders, loadOrders, orderStatusBadge }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {orders.length === 0 ? (
        <div className="card p-8 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link href="/products" className="btn-primary inline-flex">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="product-card p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-lg">Order #{o.orderNumber}</p>
                  <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className={`badge ${orderStatusBadge(o.status)} text-xs`}>{o.status}</span>
              </div>
              <div className="space-y-2 mb-3">
                {(o.items || []).map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span>{item.product?.name || item.name || `Product #${item.productId}`}</span>
                    </div>
                    <span className="font-medium">৳{item.price?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm border-t border-gray-100 dark:border-gray-700 pt-3">
                <div>
                  <span className="text-gray-500">Payment: </span>
                  <span className="capitalize">{o.paymentGateway}</span>
                  <span className="mx-2">·</span>
                  <span className={`${o.paymentStatus === 'COMPLETED' ? 'text-green-600' : 'text-yellow-600'}`}>{o.paymentStatus}</span>
                </div>
                <span className="text-lg font-bold text-primary-600">৳{o.total?.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DownloadsTab({ orders }) {
  const completedOrders = orders.filter(o => o.status === 'COMPLETED' || o.status === 'DELIVERED')
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Downloads</h2>
      {completedOrders.length === 0 ? (
        <div className="card p-8 text-center">
          <Download className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No downloads available</h2>
          <p className="text-gray-500 mb-6">Completed orders with digital products will appear here</p>
          <Link href="/products" className="btn-primary inline-flex">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {completedOrders.map(o => (
            <div key={o.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">Order #{o.orderNumber}</p>
                <p className="text-sm text-gray-500">{o.items?.length || 0} item(s) ready for download</p>
              </div>
              <button className="btn-primary text-sm py-2"><Download className="w-4 h-4 inline mr-1" /> Download All</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProfileTab({ form, setForm, saving, onSave, user }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>
      <div className="card p-6 lg:p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-3 relative">
            <span className="text-white font-bold text-2xl">{user?.firstName?.[0]?.toUpperCase() || 'U'}</span>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center"><Camera className="w-3.5 h-3.5 text-white" /></button>
          </div>
          <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
          <p className="text-sm text-gray-500 capitalize">{user?.role?.replace(/_/g, ' ').toLowerCase()}</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div><label className="block text-sm font-medium mb-1">First Name</label><input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} className="input-field" /></div>
          <div><label className="block text-sm font-medium mb-1">Last Name</label><input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} className="input-field" /></div>
          <div><label className="block text-sm font-medium mb-1">Email</label><input value={user?.email || ''} disabled className="input-field opacity-60" /></div>
          <div><label className="block text-sm font-medium mb-1">Phone</label><input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field" /></div>
          <div><label className="block text-sm font-medium mb-1">Country</label><input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} className="input-field" /></div>
        </div>
        <button onClick={onSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <hr className="my-6 border-gray-200 dark:border-gray-700" />
        <div className="space-y-3 text-sm">
          <h3 className="font-semibold">Account Info</h3>
          <div className="flex justify-between"><span className="text-gray-500">Member Since</span><span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Email Verified</span><span className={`font-medium ${user?.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>{user?.emailVerified ? 'Yes' : 'No'}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">2FA</span><span className="text-gray-400">Not enabled</span></div>
        </div>
      </div>
    </div>
  )
}

function SupportTab({ tickets }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Support Tickets</h2>
        <Link href="/support" className="btn-primary text-sm py-2"><MessageSquare className="w-4 h-4 inline mr-1" /> New Ticket</Link>
      </div>
      {tickets.length === 0 ? (
        <div className="card p-8 text-center">
          <HeadphonesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No support tickets</h2>
          <p className="text-gray-500 mb-6">Need help? Create a support ticket and we'll get back to you within 24 hours.</p>
          <Link href="/support" className="btn-primary inline-flex">Create Ticket</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map(t => (
            <div key={t.id} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{t.subject}</p>
                <p className="text-sm text-gray-500">{t.status} · {new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  return <DashboardContent />
}
