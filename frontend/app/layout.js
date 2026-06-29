import './globals.css'
import { AppProvider } from '../components/AppContext'
import MetaPixel from '../components/MetaPixel'

export const metadata = {
  title: { default: 'True Star BD Limited - Premium Digital Marketplace', template: '%s | True Star BD' },
  description: 'TRUE STAR BD LIMITED - Your trusted marketplace for AI tools, subscriptions, digital products & services in Bangladesh and worldwide. Government registered company with instant digital delivery.',
  keywords: ['AI tools', 'subscriptions', 'digital marketplace', 'Bangladesh', 'True Star BD', 'premium digital products', 'ChatGPT', 'Netflix', 'gift cards'],
  authors: [{ name: 'TRUE STAR BD LIMITED' }],
  creator: 'TRUE STAR BD LIMITED',
  publisher: 'TRUE STAR BD LIMITED',
  formatDetection: { telephone: true, email: true, address: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://truestarbd.com'),
  alternates: {
    languages: {
      'en': '/',
      'bn': '/',
      'ar': '/',
      'hi': '/',
      'es': '/',
    },
  },
  openGraph: {
    title: 'True Star BD Limited - Premium Digital Marketplace',
    description: 'Premium digital marketplace for AI tools & subscriptions. Instant delivery, 24/7 support, government registered in Bangladesh.',
    siteName: 'True Star BD',
    locale: 'en_US',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'True Star BD Limited - Premium Digital Marketplace',
    description: 'Premium digital marketplace for AI tools & subscriptions. Instant delivery, 24/7 support.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  other: { 'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '' },
}

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TRUE STAR BD LIMITED',
    legalName: 'TRUE STAR BD LIMITED',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://truestarbd.com',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://truestarbd.com'}/favicon.ico`,
    foundingDate: '2018',
    address: { '@type': 'PostalAddress', streetAddress: '73, Lion Shopping Complex (1st Floor), Monipuripara, Airport Road', addressLocality: 'Tejgaon', addressRegion: 'Dhaka', postalCode: '1215', addressCountry: 'BD' },
    contactPoint: [
      { '@type': 'ContactPoint', telephone: '+880-1812-054785', contactType: 'customer service', availableLanguage: ['English', 'Bengali', 'Arabic'] },
      { '@type': 'ContactPoint', telephone: '+880-1919-467164', contactType: 'sales', availableLanguage: ['English', 'Bengali'] },
    ],
    sameAs: ['https://www.facebook.com/TrueStarBD'],
    vatID: '001402868-0402',
    taxID: '851667441827',
    duns: 'C-145542/2018',
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'True Star BD',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://truestarbd.com',
    potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://truestarbd.com'}/products?search={search_term_string}` }, 'query-input': 'required name=search_term_string' },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={process.env.NEXT_PUBLIC_SITE_URL || 'https://truestarbd.com'} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        <MetaPixel />
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
