'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppProvider, useApp } from '../../../components/AppContext'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Star, Shield, Award, Clock, ChevronRight, Loader2, Store, Package, ShoppingBag } from 'lucide-react'

function VendorContent({ params }) {
  const { addToCart } = useApp()
  const [vendor, setVendor] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get all products and find vendor info
    fetch('/api/products?limit=50')
      .then(r => r.json())
      .then(d => {
        const allProducts = d.products || []
        const vendorProducts = allProducts.filter(p => p.vendor?.id === params.id)
        setProducts(vendorProducts)
        if (vendorProducts.length > 0) {
          setVendor(vendorProducts[0].vendor)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [params.id])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 dark:text-white font-medium">Vendor</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-600" /></div>
        ) : vendor ? (
          <>
            <div className="card p-6 lg:p-8 mb-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                  {vendor.businessName?.[0] || 'V'}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">{vendor.businessName}</h1>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {vendor.rating?.toFixed(1) || '0.0'}</span>
                    <span className="flex items-center gap-1"><ShoppingBag className="w-4 h-4" /> {vendor.totalSales || 0} sales</span>
                    {vendor.isFeatured && <span className="badge-primary">Featured Vendor</span>}
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-6">Products ({products.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="card-hover p-0 overflow-hidden">
                  <Link href={`/product/${product.slug}`}>
                    <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-4xl">📦</div>
                  </Link>
                  <div className="p-4">
                    <p className="text-xs text-primary-600 font-medium">{product.category?.name}</p>
                    <Link href={`/product/${product.slug}`}><h3 className="font-semibold text-sm line-clamp-1 hover:text-primary-600">{product.name}</h3></Link>
                    <p className="text-lg font-bold text-primary-600 mt-1">৳{(product.salePrice || product.price)?.toLocaleString()}</p>
                    <button onClick={() => addToCart(product, null, 1)} className="btn-primary w-full mt-3 text-sm py-2">Add to Cart</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Vendor Not Found</h1>
            <p className="text-gray-500 mb-6">This vendor doesn't exist or has no products listed.</p>
            <Link href="/products" className="btn-primary">Browse Products</Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function VendorPage({ params }) {
  return <AppProvider><VendorContent params={params} /></AppProvider>
}
