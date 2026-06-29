'use client'


import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { ShoppingBag, Search, CreditCard, Shield, Zap, Users, Award, HeadphonesIcon, Globe, MessageCircle, Send, Mail, Phone, MapPin, CheckCircle } from 'lucide-react'
import Link from 'next/link'

function OrdersContent() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">My Orders</h1>
        <div className="card p-8 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link href="/products" className="btn-primary inline-flex">Browse Products</Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function Orders() {
  return <OrdersContent />
}
