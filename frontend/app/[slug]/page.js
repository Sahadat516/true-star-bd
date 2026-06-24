'use client'

import { useState, useEffect } from 'react'
import { AppProvider } from '../../components/AppContext'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Loader2 } from 'lucide-react'

function CMSPageContent({ slug, fallbackTitle }) {
  const [page, setPage] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/cms/pages/${slug}`)
      .then(r => r.json())
      .then(d => { setPage(d.page) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : page ? (
          <>
            <h1 className="text-3xl font-bold mb-8">{page.title}</h1>
            <div className="card p-6 lg:p-8 prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: page.content }} />
          </>
        ) : (
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">{fallbackTitle || 'Page Not Found'}</h1>
            <p className="text-gray-500">This page could not be loaded.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default function CMSPage({ params }) {
  return (
    <AppProvider>
      <CMSPageContent slug={params.slug} />
    </AppProvider>
  )
}
