'use client'

import { useState } from 'react'

const LOGO_SOURCES = {
  stripe: [
    'https://logo.clearbit.com/stripe.com',
    'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
  ],
  paypal: [
    'https://logo.clearbit.com/paypal.com',
    'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
  ],
  bkash: [
    'https://logo.clearbit.com/bkash.com',
    'https://upload.wikimedia.org/wikipedia/commons/4/41/bKash_logo.svg',
  ],
  nagad: [
    'https://logo.clearbit.com/nagad.com.bd',
    'https://upload.wikimedia.org/wikipedia/commons/f/f8/Nagad_Logo.svg',
  ],
  rocket: [
    'https://logo.clearbit.com/dutchbanglabank.com',
  ],
  sslcommerz: [
    'https://logo.clearbit.com/sslcommerz.com',
  ],
  bybit: [
    'https://logo.clearbit.com/bybit.com',
    'https://upload.wikimedia.org/wikipedia/commons/1/1b/Bybit_Logo.svg',
  ],
  binance: [
    'https://logo.clearbit.com/binance.com',
    'https://upload.wikimedia.org/wikipedia/commons/1/15/Binance_logo.svg',
  ],
  aamarpay: [
    'https://logo.clearbit.com/aamarpay.com',
  ],
  portwallet: [
    'https://logo.clearbit.com/portwallet.com',
  ],
  usdt: [
    'https://logo.clearbit.com/tether.to',
    'https://upload.wikimedia.org/wikipedia/commons/4/4a/Tether_Logo.svg',
  ],
}

function FallbackLogo({ id }) {
  const s = {
    stripe: { bg: '#635BFF', text: 'stripe' },
    paypal: { bg: '#003087', text: 'PayPal' },
    bkash: { bg: '#E2136E', text: 'bKash' },
    nagad: { bg: '#F5842D', text: 'Nagad' },
    rocket: { bg: '#1A5276', text: 'Rocket' },
    sslcommerz: { bg: '#28A745', text: 'SSL' },
    bybit: { bg: '#1E3A5F', text: 'Bybit' },
    binance: { bg: '#F0B90B', text: 'Binance', dark: true },
    aamarpay: { bg: '#E74C3C', text: 'Aamarpay' },
    portwallet: { bg: '#2E86C1', text: 'Port' },
    bank_transfer: { bg: '#555', text: 'Bank' },
    usdt: { bg: '#26A17B', text: 'USDT' },
  }[id] || { bg: '#999', text: '?' }
  return (
    <svg viewBox="0 0 40 28" className="w-8 h-6 shrink-0">
      <rect width="40" height="28" rx="4" fill={s.bg} />
      <text x="20" y="18" textAnchor="middle" fill={s.dark ? '#1E1E1E' : '#fff'} fontFamily="Arial" fontWeight="bold" fontSize={10}>{s.text}</text>
    </svg>
  )
}

export function GatewayImage({ id, name, className = '' }) {
  const [failedCount, setFailedCount] = useState(0)
  const sources = LOGO_SOURCES[id?.toLowerCase()] || []

  if (failedCount >= sources.length) {
    return <div className={`w-8 h-6 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center text-[8px] text-gray-400 font-medium ${className}`}>{name?.[0] || '?'}</div>
  }

  if (sources.length === 0) {
    return <div className={`w-8 h-6 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center text-[8px] text-gray-400 font-medium ${className}`}>{name?.[0] || '?'}</div>
  }

  return (
    <img
      src={sources[failedCount]}
      alt={name}
      className={`w-full h-full object-contain ${className}`}
      onError={() => setFailedCount(c => c + 1)}
    />
  )
}

export default function GatewayIcon({ id, name, iconOnly = false }) {
  return (
    <div className={`flex items-center ${iconOnly ? '' : 'gap-2'}`}>
      <GatewayImage id={id} name={name} />
      {!iconOnly && <span className="text-sm font-medium">{name}</span>}
    </div>
  )
}
