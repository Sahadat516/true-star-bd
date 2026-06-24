'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AppProvider, useApp } from '../../components/AppContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Eye, EyeOff, Mail, Lock, User, Store, Github } from 'lucide-react'

function SignUpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'customer'
  const { login } = useApp()

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', role: defaultRole, businessName: '', agree: false })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    if (!form.agree) { setError('You must agree to the terms'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role === 'vendor' ? 'VENDOR' : 'CUSTOMER',
          businessName: form.businessName,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setSuccess(true)
      // Auto login
      await login(form.email, form.password)
      setTimeout(() => router.push('/'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-md mx-auto px-4 py-12 lg:py-16">
        <div className="card p-6 lg:p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Join TRUE STAR BD today</p>
          </div>

          {/* Role toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
            <button onClick={() => setForm(prev => ({ ...prev, role: 'customer' }))}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${form.role === 'customer' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}>
              <User className="w-4 h-4 inline mr-1" /> Customer
            </button>
            <button onClick={() => setForm(prev => ({ ...prev, role: 'vendor' }))}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${form.role === 'vendor' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}>
              <Store className="w-4 h-4 inline mr-1" /> Vendor
            </button>
          </div>

          {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}
          {success && <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm mb-4">Account created! Redirecting...</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name *</label>
                <input name="firstName" value={form.firstName} onChange={handleChange} required className="input-field" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange} className="input-field" placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-field pl-10" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+880-1XXX-XXXXXX" />
            </div>

            {form.role === 'vendor' && (
              <div>
                <label className="block text-sm font-medium mb-1">Business Name *</label>
                <input name="businessName" value={form.businessName} onChange={handleChange} required className="input-field" placeholder="Your Business Name" />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} required minLength={6} className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input name="confirmPassword" type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} required minLength={6} className="input-field pl-10" />
              </div>
            </div>

            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} className="mt-1" />
              <span className="text-gray-500 dark:text-gray-400">
                I agree to the <Link href="/terms" className="text-primary-600 hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account? <Link href="/signin" className="text-primary-600 hover:underline font-medium">Sign In</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SignUp() {
  return <AppProvider><SignUpContent /></AppProvider>
}
