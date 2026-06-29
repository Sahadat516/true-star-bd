'use client'

import { useEffect } from 'react'

export default function MetaPixel() {
  useEffect(() => {
    fetch('/api/cms/settings')
      .then(r => r.json())
      .then(d => {
        const s = d.settings || d || {}
        const pixelId = s.facebook_pixel_id
        if (!pixelId) return

        if (typeof window !== 'undefined' && !window.fbq) {
          window.fbq = function() { window.fbq.callMethod ? window.fbq.callMethod.apply(window.fbq, arguments) : window.fbq.queue.push(arguments) }
          if (!window._fbq) window._fbq = window.fbq
          window.fbq.push = window.fbq
          window.fbq.loaded = true
          window.fbq.version = '2.0'
          window.fbq.queue = []
          const script = document.createElement('script')
          script.async = true
          script.src = 'https://connect.facebook.net/en_US/fbevents.js'
          document.head.appendChild(script)
          window.fbq('init', pixelId)
          window.fbq('track', 'PageView')
        }
      })
      .catch(() => {})
  }, [])

  return null
}
