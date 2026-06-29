'use client'

import { useState, useEffect } from 'react'
import { useApp } from '../../components/AppContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { User, Mail, Phone, MapPin, Calendar, Shield, Save, Camera } from 'lucide-react'

function ProfileContent() {
  const { user, logout } = useApp()
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', country: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) setForm({ firstName: user.firstName || '', lastName: user.lastName || '', phone: user.phone || '', country: user.country || '' })
  }, [user])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(form),
      })
      if (res.ok) alert('Profile updated!')
    } catch (e) {}
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Account</h1>
        <div className="card p-6 lg:p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-3 relative">
              <span className="text-white font-bold text-2xl">{user?.firstName?.[0]?.toUpperCase() || 'U'}</span>
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-gray-800 rounded-full flex items-center justify-center"><Camera className="w-3.5 h-3.5 text-white" /></button>
            </div>
            <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div><label className="block text-sm font-medium mb-1">First Name</label><input value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Last Name</label><input value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Email</label><input value={user?.email || ''} disabled className="input-field opacity-60" /></div>
            <div><label className="block text-sm font-medium mb-1">Phone</label><input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Country</label><input value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} className="input-field" /></div>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
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
      </main>
      <Footer />
    </div>
  )
}

export default function Profile() {
  return <ProfileContent />
}
