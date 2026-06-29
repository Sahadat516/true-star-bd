const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://truestarbd.com'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/refund`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/shipping`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${baseUrl}/business-info`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/signin`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
    { url: `${baseUrl}/signup`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.1 },
  ]

  try {
    const [catsRes, productsRes, pagesRes] = await Promise.all([
      fetch(`${API_URL}/api/categories`).then(r => r.json()).catch(() => ({ categories: [] })),
      fetch(`${API_URL}/api/products`).then(r => r.json()).catch(() => ({ products: [] })),
      fetch(`${API_URL}/api/cms/pages?published=true`).then(r => r.json()).catch(() => ({ pages: [] })),
    ])

    const categoryPages = (catsRes.categories || []).map(cat => ({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(cat.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    const productPages = (productsRes.products || []).map(prod => ({
      url: `${baseUrl}/product/${prod.slug}`,
      lastModified: new Date(prod.updatedAt || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    const cmsPages = (pagesRes.pages || []).map(page => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(page.updatedAt || Date.now()),
      changeFrequency: page.slug === 'blog' ? 'weekly' : 'monthly',
      priority: page.slug === 'about' ? 0.5 : 0.3,
    }))

    return [...staticPages, ...categoryPages, ...productPages, ...cmsPages]
  } catch {
    return staticPages
  }
}
