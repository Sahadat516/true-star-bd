'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AppProvider, useApp } from '../../components/AppContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Mail, Lock, Eye, EyeOff, User, Store, Shield, ChevronRight, Crown } from 'lucide-react'

function SignInContent() {
  const router = useRouter()
  const { login } = useApp()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedRole, setSelectedRole] = useState('customer')

  const roleOptions = [
    { id: 'customer', label: 'Customer', icon: User, desc: 'Buy products & manage orders', color: 'from-blue-500 to-cyan-500', demo: { email: 'customer@truestarbd.com', password: 'admin123' } },
    { id: 'vendor', label: 'Seller / Reseller', icon: Store, desc: 'Sell products & track earnings', color: 'from-purple-500 to-pink-500', demo: { email: 'vendor1@truestarbd.com', password: 'admin123' } },
    { id: 'staff', label: 'Staff', icon: Shield, desc: 'Company staff access', color: 'from-emerald-500 to-teal-500', demo: null },
    { id: 'admin', label: 'Admin', icon: Crown, desc: 'Full system control', color: 'from-amber-500 to-orange-500', demo: { email: 'admin@truestarbd.com', password: 'admin123' } },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      const role = form.email.includes('admin') ? 'admin' : form.email.includes('vendor') ? 'vendor' : 'customer'
      if (form.email.includes('vendor')) router.push('/vendor/dashboard')
      else if (form.email.includes('admin')) router.push('/admin')
      else router.push('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (opts) => {
    setSelectedRole(opts.id)
    if (opts.demo) setForm({ email: opts.demo.email, password: opts.demo.password })
    else setForm({ email: '', password: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8 lg:py-12">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">TS</span>
            </div>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to your TRUE STAR BD account</p>
        </div>

        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}

        {/* Role Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {roleOptions.map(opt => (
            <button key={opt.id} onClick={() => fillDemo(opt)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${selectedRole === opt.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 shadow-lg shadow-primary-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}>
              <div className={`w-8 h-8 bg-gradient-to-br ${opt.color} rounded-lg flex items-center justify-center mb-1.5`}>
                <opt.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-semibold">{opt.label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{opt.desc}</p>
            </button>
          ))}
        </div>

        <div className="card p-6 lg:p-8 max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required className="input-field pl-10" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Lock className="w-4 h-4" />}
              {loading ? 'Signing In...' : `Sign In as ${roleOptions.find(r => r.id === selectedRole)?.label || 'User'}`}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 text-center mb-3">Demo quick login — select a role above</p>
            <div className="grid grid-cols-2 gap-2">
              {roleOptions.filter(r => r.demo).map(opt => (
                <button key={opt.id} onClick={() => fillDemo(opt)}
                  className="text-xs py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-left flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 bg-gradient-to-br ${opt.color} rounded flex items-center justify-center`}>
                      <opt.icon className="w-3 h-3 text-white" />
                    </div>
                    {opt.label}
                  </span>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account? <Link href="/signup" className="text-primary-600 hover:underline font-medium">Create Account</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SignIn() {
  return <AppProvider><SignInContent /></AppProvider>
}
