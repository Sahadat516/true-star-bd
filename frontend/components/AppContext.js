'use client'

import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import useSocket from '../hooks/useSocket'

const AppContext = createContext()

export function useApp() {
  return useContext(AppContext)
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [vendor, setVendor] = useState(null)
  const [cart, setCart] = useState([])
  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('en')
  const [siteColors, setSiteColors] = useState({ primary: '#25D366', accent: '#075E54' })
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const { socket } = useSocket(user?.id)

  const applySiteColors = (colors) => {
    const root = document.documentElement
    if (colors.primary) {
      root.style.setProperty('--primary', colors.primary)
      root.style.setProperty('--primary-dark', colors.primaryDark || '#1fa855')
      root.style.setProperty('--primary-light', colors.primaryLight || '#dcfce7')
    }
    if (colors.accent) {
      root.style.setProperty('--accent', colors.accent)
      root.style.setProperty('--accent-light', colors.accentLight || '#ccfbf1')
    }
    setSiteColors(colors)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    const savedLang = localStorage.getItem('language') || 'en'
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const token = localStorage.getItem('token')
    
    setTheme(savedTheme)
    setLanguage(savedLang)
    setCart(savedCart)

    if (savedTheme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')

    // Detect language from browser
    detectUserLanguage()

    // Load site colors
    fetch('/api/cms/settings')
      .then(r => r.json())
      .then(d => {
        const s = d.settings || d || {}
        const colors = {
          primary: s.primary_color || '#25D366',
          accent: s.accent_color || '#075E54',
        }
        applySiteColors(colors)
      })
      .catch(() => {})

    // Load user if token exists
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user)
            setVendor(data.vendor)
            // Load notifications
            fetch('/api/notifications', {
              headers: { Authorization: `Bearer ${token}` }
            })
              .then(r => r.json())
              .then(d => {
                setNotifications(d.notifications || [])
                setUnreadCount(d.unreadCount || 0)
              })
              .catch(() => {})
          } else {
            localStorage.removeItem('token')
          }
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const detectUserLanguage = () => {
    const userLang = navigator.language || navigator.languages?.[0] || 'en'
    const langMap = { bn: 'bn', en: 'en', ar: 'ar', hi: 'hi', es: 'es', fr: 'fr' }
    const detected = langMap[userLang.split('-')[0]] || 'en'
    setLanguage(detected)
    localStorage.setItem('language', detected)
    if (detected === 'bn') document.body.classList.add('bengali')
    else document.body.classList.remove('bengali')
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  const changeLanguage = (lang) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
    if (lang === 'bn') document.body.classList.add('bengali')
    else document.body.classList.remove('bengali')
  }

  const addToCart = (product, variant = null, quantity = 1) => {
    setCart(prev => {
      const existing = prev.findIndex(item => 
        item.product.id === product.id && item.variant?.id === variant?.id
      )
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing].quantity += quantity
        localStorage.setItem('cart', JSON.stringify(updated))
        return updated
      }
      const newCart = [...prev, { product, variant, quantity }]
      localStorage.setItem('cart', JSON.stringify(newCart))
      return newCart
    })
  }

  const removeFromCart = (index) => {
    setCart(prev => {
      const updated = prev.filter((_, i) => i !== index)
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
  }

  const clearCart = () => {
    setCart([])
    localStorage.setItem('cart', '[]')
  }

  const login = async (email, password) => {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    setVendor(data.vendor)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setVendor(null)
    router.push('/')
  }

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return
    const handler = (data) => {
      if (data.notification) {
        setNotifications(prev => [data.notification, ...prev])
      }
      if (typeof data.unreadCount === 'number') {
        setUnreadCount(data.unreadCount)
      }
    }
    socket.on('new-notification', handler)
    return () => socket.off('new-notification', handler)
  }, [socket])

  const loadNotifications = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
      const d = await res.json()
      setNotifications(d.notifications || [])
      setUnreadCount(d.unreadCount || 0)
    } catch (e) {}
  }, [])

  const markNotificationRead = async (id) => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (e) {}
  }

  const markAllRead = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      await fetch('/api/notifications/read-all', { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (e) {}
  }

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.variant ? (item.variant.salePrice || item.variant.price) : (item.product.salePrice || item.product.price)
    return sum + price * item.quantity
  }, 0)

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <AppContext.Provider value={{
      user, vendor, cart, theme, language, loading, siteColors,
      setUser, addToCart, removeFromCart, clearCart,
      cartTotal, cartCount, toggleTheme, changeLanguage, login, logout, applySiteColors,
      notifications, unreadCount, loadNotifications, markNotificationRead, markAllRead,
    }}>
      {children}
    </AppContext.Provider>
  )
}
