'use client'

import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center animate-fade-in"
      aria-label="Back to top"
    >
      <ChevronUp className="w-5 h-5" />
    </button>
  )
}
