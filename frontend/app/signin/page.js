'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../components/AppContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Mail, Lock, Eye, EyeOff, User, Store, Shield, ChevronRight, Crown } from 'lucide-react'

function SignInContent() {
  const router = useRouter()
  const { login } = useApp()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState('')
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
      if (form.email.includes('vendor')) router.push('/vendor/dashboard')
      else if (form.email.includes('admin')) router.push('/admin')
      else router.push('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider)
    setError('')
    try {
      // In production, this would redirect to OAuth provider
      // For now, simulate with a mock social login endpoint
      const mockProfile = {
        google: { provider: 'google', providerId: 'google-' + Date.now(), email: 'user' + Date.now() + '@gmail.com', firstName: 'Google', lastName: 'User' },
        facebook: { provider: 'facebook', providerId: 'fb-' + Date.now(), email: 'user' + Date.now() + '@facebook.com', firstName: 'Facebook', lastName: 'User' },
        twitter: { provider: 'twitter', providerId: 'tw-' + Date.now(), email: 'user' + Date.now() + '@twitter.com', firstName: 'Twitter', lastName: 'User' },
      }
      const profile = mockProfile[provider]
      const res = await fetch('/api/auth/social-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      localStorage.setItem('token', data.token)
      window.location.href = data.isNew ? '/signup?social=true' : '/dashboard'
    } catch (err) {
      setError(err.message)
    } finally {
      setSocialLoading('')
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
          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button onClick={() => handleSocialLogin('google')} disabled={!!socialLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all disabled:opacity-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              {socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
            </button>
            <button onClick={() => handleSocialLogin('facebook')} disabled={!!socialLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all disabled:opacity-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              {socialLoading === 'facebook' ? 'Connecting...' : 'Continue with Facebook'}
            </button>
            <button onClick={() => handleSocialLogin('twitter')} disabled={!!socialLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all disabled:opacity-50">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#000" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              {socialLoading === 'twitter' ? 'Connecting...' : 'Continue with Twitter (X)'}
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300 dark:border-gray-600" /></div>
            <div className="relative flex justify-center"><span className="bg-white dark:bg-gray-800 px-3 text-sm text-gray-500">or sign in with email</span></div>
          </div>

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
  return <SignInContent />
}
