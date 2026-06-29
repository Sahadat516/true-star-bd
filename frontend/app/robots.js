const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://truestarbd.com'

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/dashboard/', '/vendor/', '/api/'] },
      { userAgent: 'GPTBot', disallow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
