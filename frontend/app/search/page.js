'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import G2GProductCard from '../../components/G2GProductCard'
import { Search, SlidersHorizontal, X, ChevronDown, Star, Clock, Zap, Truck, Filter } from 'lucide-react'

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState(null)

  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const rating = searchParams.get('rating') || ''
  const rank = searchParams.get('rank') || ''
  const deliveryType = searchParams.get('deliveryType') || ''
  const sort = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') || '1')

  const [localQ, setLocalQ] = useState(q)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (rating) params.set('rating', rating)
    if (rank) params.set('rank', rank)
    if (deliveryType) params.set('deliveryType', deliveryType)
    if (sort) params.set('sort', sort)
    params.set('page', page)

    fetch(`/api/search?${params}`)
      .then(r => r.json())
      .then(d => {
        setProducts(d.products || [])
        setTotal(d.total || 0)
        setTotalPages(d.totalPages || 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    if (!filters) {
      fetch('/api/search/filters').then(r => r.json()).then(d => setFilters(d)).catch(() => {})
    }
  }, [q, category, minPrice, maxPrice, rating, rank, deliveryType, sort, page])

  const updateFilter = (key, value) => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category && key !== 'category') params.set('category', category)
    if (minPrice && key !== 'minPrice') params.set('minPrice', minPrice)
    if (maxPrice && key !== 'maxPrice') params.set('maxPrice', maxPrice)
    if (rating && key !== 'rating') params.set('rating', rating)
    if (rank && key !== 'rank') params.set('rank', rank)
    if (deliveryType && key !== 'deliveryType') params.set('deliveryType', deliveryType)
    if (sort && key !== 'sort') params.set('sort', sort)
    if (value) params.set(key, value)
    if (page > 1) params.set('page', '1')
    router.push(`/search?${params}`)
  }

  const clearFilters = () => {
    if (q) router.push(`/search?q=${q}`)
    else router.push('/search')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (localQ.trim()) {
      const params = new URLSearchParams()
      params.set('q', localQ.trim())
      router.push(`/search?${params}`)
    }
  }

  const hasFilters = category || minPrice || maxPrice || rating || rank || deliveryType

  const activeFilterCount = [category, minPrice, maxPrice, rating, rank, deliveryType].filter(Boolean).length

  const rankColors = {
    NORMAL: 'bg-gray-500', COMMON: 'bg-green-500', UNCOMMON: 'bg-blue-500',
    RARE: 'bg-purple-500', EPIC: 'bg-orange-500', LEGENDARY: 'bg-yellow-500',
  }

  const deliveryIcons = { instant: Zap, manual: Clock, scheduled: Truck }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text" value={localQ} onChange={e => setLocalQ(e.target.value)}
            placeholder="Search products, categories, vendors..."
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 outline-none text-lg"
          />
          {localQ && (
            <button type="button" onClick={() => { setLocalQ(''); router.push('/search') }} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </form>

        <div className="flex gap-6">
          {/* Filter sidebar - desktop */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2"><Filter className="w-4 h-4 text-primary-400" /> Filters</h3>
                {hasFilters && <button onClick={clearFilters} className="text-xs text-primary-400 hover:underline">Clear all</button>}
              </div>

              {/* Category filter */}
              {filters?.categories?.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Category</h4>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {filters.categories.map(c => (
                      <button key={c.id} onClick={() => updateFilter('category', category === c.id ? '' : c.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${category === c.id ? 'bg-primary-500/20 text-primary-400' : 'hover:bg-gray-700/50 text-gray-300'}`}>
                        {c.name} <span className="text-gray-500 text-xs">({c._count?.products || 0})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price range */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Price Range</h4>
                <div className="flex gap-2">
                  <input type="number" placeholder="Min" value={minPrice} onChange={e => updateFilter('minPrice', e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white outline-none focus:border-primary-500" />
                  <span className="text-gray-500 self-center">-</span>
                  <input type="number" placeholder="Max" value={maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white outline-none focus:border-primary-500" />
                </div>
              </div>

              {/* Seller rank filter */}
              {filters?.ranks?.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Seller Rank</h4>
                  <div className="space-y-1">
                    {filters.ranks.map(r => (
                      <button key={r} onClick={() => updateFilter('rank', rank === r ? '' : r)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${rank === r ? 'bg-primary-500/20 text-primary-400' : 'hover:bg-gray-700/50 text-gray-300'}`}>
                        <span className={`inline-block w-2 h-2 rounded-full ${rankColors[r] || 'bg-gray-500'} mr-2`} />
                        {r.charAt(0) + r.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery type */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Delivery Type</h4>
                <div className="space-y-1">
                  {filters?.deliveryTypes?.map(dt => {
                    const Icon = deliveryIcons[dt] || Clock
                    return (
                      <button key={dt} onClick={() => updateFilter('deliveryType', deliveryType === dt ? '' : dt)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors capitalize ${deliveryType === dt ? 'bg-primary-500/20 text-primary-400' : 'hover:bg-gray-700/50 text-gray-300'}`}>
                        <Icon className="w-3.5 h-3.5 inline mr-2" />{dt}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Rating filter */}
              <div className="mb-5">
                <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Minimum Rating</h4>
                <div className="space-y-1">
                  {[4, 3, 2, 1].map(r => (
                    <button key={r} onClick={() => updateFilter('rating', rating === String(r) ? '' : String(r))}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${rating === String(r) ? 'bg-primary-500/20 text-primary-400' : 'hover:bg-gray-700/50 text-gray-300'}`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 inline ${i < r ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                      ))}
                      <span className="ml-1">& up</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-400">
                {loading ? 'Searching...' : (
                  <>{total} {total === 1 ? 'result' : 'results'} {q && <>for "<span className="text-white">{q}</span>"</>}</>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg text-sm">
                  <SlidersHorizontal className="w-4 h-4" /> Filter{activeFilterCount > 0 && ` (${activeFilterCount})`}
                </button>
                <select value={sort} onChange={e => updateFilter('sort', e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white outline-none">
                  <option value="newest">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {hasFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {category && filters?.categories?.find(c => c.id === category) && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs">
                    {filters.categories.find(c => c.id === category).name}
                    <button onClick={() => updateFilter('category', '')}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {minPrice && <span className="flex items-center gap-1 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs">Min: ৳{minPrice}<button onClick={() => updateFilter('minPrice', '')}><X className="w-3 h-3" /></button></span>}
                {maxPrice && <span className="flex items-center gap-1 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs">Max: ৳{maxPrice}<button onClick={() => updateFilter('maxPrice', '')}><X className="w-3 h-3" /></button></span>}
                {rank && <span className="flex items-center gap-1 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs capitalize">{rank}<button onClick={() => updateFilter('rank', '')}><X className="w-3 h-3" /></button></span>}
                {deliveryType && <span className="flex items-center gap-1 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs capitalize">{deliveryType}<button onClick={() => updateFilter('deliveryType', '')}><X className="w-3 h-3" /></button></span>}
                {rating && <span className="flex items-center gap-1 px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs">{rating}+ stars<button onClick={() => updateFilter('rating', '')}><X className="w-3 h-3" /></button></span>}
              </div>
            )}

            {/* Mobile filter drawer */}
            {showFilters && (
              <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setShowFilters(false)}>
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute left-0 top-0 h-full w-80 bg-gray-800 p-5 overflow-y-auto" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Filters</h3>
                    <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>
                  </div>
                  {hasFilters && <button onClick={clearFilters} className="text-sm text-primary-400 mb-4 block">Clear all</button>}
                  {/* Same filter content as desktop — simplified */}
                  {filters?.categories?.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Category</h4>
                      <div className="space-y-1">
                        {filters.categories.map(c => (
                          <button key={c.id} onClick={() => { updateFilter('category', category === c.id ? '' : c.id); setShowFilters(false) }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm ${category === c.id ? 'bg-primary-500/20 text-primary-400' : 'hover:bg-gray-700/50 text-gray-300'}`}>
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {filters?.ranks?.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">Seller Rank</h4>
                      {filters.ranks.map(r => (
                        <button key={r} onClick={() => { updateFilter('rank', rank === r ? '' : r); setShowFilters(false) }}
                          className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm ${rank === r ? 'bg-primary-500/20 text-primary-400' : 'hover:bg-gray-700/50 text-gray-300'}`}>{r}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Product grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-2xl p-4 animate-pulse">
                    <div className="aspect-video bg-gray-700 rounded-xl mb-3" />
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-700 rounded w-1/2 mb-3" />
                    <div className="h-6 bg-gray-700 rounded w-1/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-gray-800/50 rounded-2xl p-16 text-center">
                <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">No results found</h2>
                <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
                {hasFilters && <button onClick={clearFilters} className="text-primary-400 hover:underline text-sm">Clear all filters</button>}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map(product => (
                  <G2GProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {page > 1 && (
                  <button onClick={() => updateFilter('page', String(page - 1))} className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">Previous</button>
                )}
                {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                  let p
                  if (totalPages <= 7) p = i + 1
                  else if (page <= 4) p = i + 1
                  else if (page >= totalPages - 3) p = totalPages - 6 + i
                  else p = page - 3 + i
                  if (p < 1 || p > totalPages) return null
                  return (
                    <button key={i} onClick={() => updateFilter('page', String(p))}
                      className={`w-10 h-10 rounded-lg text-sm font-bold transition-colors ${page === p ? 'bg-primary-500 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}>
                      {p}
                    </button>
                  )
                })}
                {page < totalPages && (
                  <button onClick={() => updateFilter('page', String(page + 1))} className="px-4 py-2 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">Next</button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
