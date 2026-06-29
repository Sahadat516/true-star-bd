'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../components/AppContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { User, Store, Shield, Eye, EyeOff, Mail, Lock, Phone, MapPin, Calendar, FileText, Briefcase, Building2, Upload } from 'lucide-react'

function SignUpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'customer'
  const { login: contextLogin } = useApp()

  const [role, setRole] = useState(defaultRole)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [form, setForm] = useState({
    email: '', password: '', firstName: '', lastName: '', phone: '',
    nidNumber: '', passportNumber: '', dateOfBirth: '', gender: '', address: '',
    businessName: '', businessType: '', tradeLicense: '', taxId: '', website: '',
  })

  const roleOptions = [
    { id: 'customer', label: 'Customer', icon: User, desc: 'Buy digital products & services', color: 'from-blue-500 to-cyan-500' },
    { id: 'vendor', label: 'Reseller / Wholesaler / Vendor', icon: Store, desc: 'Sell products & grow your business', color: 'from-purple-500 to-pink-500' },
    { id: 'staff', label: 'Staff Member', icon: Shield, desc: 'Company employee access', color: 'from-emerald-500 to-teal-500' },
  ]

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))

  const updateRole = (newRole) => {
    setRole(newRole)
    setStep(1)
    setError('')
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password || !form.firstName) {
      setError('Email, password, and name are required')
      return
    }
    if (role !== 'customer' && !form.nidNumber && !form.passportNumber) {
      setError('NID or Passport number is required')
      return
    }
    if (role === 'vendor' && !form.businessName) {
      setError('Business name is required')
      return
    }
    setLoading(true)
    try {
      let roleMap = { customer: 'CUSTOMER', vendor: 'VENDOR', staff: 'STAFF' }
      const payload = {
        ...form,
        role: roleMap[role] || 'CUSTOMER',
        nidNumber: form.nidNumber || undefined,
        passportNumber: form.passportNumber || undefined,
      }
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      localStorage.setItem('token', data.token)
      router.push(role === 'vendor' ? '/vendor/dashboard' : '/dashboard')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">TS</span>
            </div>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold">Create Account</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Choose your account type to get started</p>
        </div>

        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4">{error}</div>}

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {roleOptions.map(opt => (
            <button key={opt.id} onClick={() => updateRole(opt.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${role === opt.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 shadow-lg shadow-primary-500/10' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
              <div className={`w-10 h-10 bg-gradient-to-br ${opt.color} rounded-xl flex items-center justify-center mb-2`}>
                <opt.icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-sm">{opt.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>

        {/* Registration Form */}
        <div className="card p-6 lg:p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Step 1: Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2"><User className="w-5 h-5 text-primary-500" /> Basic Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <input value={form.firstName} onChange={set('firstName')} required className="input-field" placeholder="Your first name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input value={form.lastName} onChange={set('lastName')} className="input-field" placeholder="Your last name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={form.email} onChange={set('email')} required className="input-field pl-10" placeholder="you@example.com" /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={form.phone} onChange={set('phone')} className="input-field pl-10" placeholder="+8801XXXXXXXXX" /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Password *</label>
                  <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')} required className="input-field pl-10 pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select value={form.gender} onChange={set('gender')} className="input-field">
                    <option value="">Select...</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date of Birth</label>
                  <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <textarea value={form.address} onChange={set('address')} className="input-field" rows={2} placeholder="Your full address" />
                </div>
              </div>
            </div>

            {/* Step 2: Verification (for non-customer roles) */}
            {role !== 'customer' && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2"><FileText className="w-5 h-5 text-primary-500" /> Identity Verification</h3>
                <p className="text-xs text-gray-500">NID or Passport number is required for {role === 'staff' ? 'staff' : 'business'} accounts</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">NID Number</label>
                    <input value={form.nidNumber} onChange={set('nidNumber')} className="input-field" placeholder="National ID number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Passport Number</label>
                    <input value={form.passportNumber} onChange={set('passportNumber')} className="input-field" placeholder="Passport number" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Business Info (for vendor/reseller/wholesaler) */}
            {role === 'vendor' && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary-500" /> Business Information</h3>
                <p className="text-xs text-gray-500">Provide your business details for verification. Documents must be submitted for approval.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Business Name *</label>
                    <input value={form.businessName} onChange={set('businessName')} required={role === 'vendor'} className="input-field" placeholder="Your registered business name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Business Type</label>
                    <select value={form.businessType} onChange={set('businessType')} className="input-field">
                      <option value="">Select type...</option>
                      <option value="reseller">Reseller</option>
                      <option value="wholesaler">Wholesaler</option>
                      <option value="vendor">Vendor / Seller</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Website (optional)</label>
                    <input value={form.website} onChange={set('website')} className="input-field" placeholder="https://" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Trade License (optional)</label>
                    <input value={form.tradeLicense} onChange={set('tradeLicense')} className="input-field" placeholder="Trade license number" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tax ID / BIN (optional)</label>
                    <input value={form.taxId} onChange={set('taxId')} className="input-field" placeholder="Tax ID or BIN number" />
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <div className="flex items-center gap-3">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Business Documents</p>
                      <p className="text-xs text-gray-500">Upload trade license, TIN certificate, or other business evidence (coming soon)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base">
                {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                {loading ? 'Creating Account...' : `Create ${roleOptions.find(r => r.id === role)?.label || 'Account'} Account`}
              </button>
            </div>
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
  return <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading...</div>}><SignUpContent /></Suspense>
}
