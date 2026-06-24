import './globals.css'

export const metadata = {
  title: 'True Star BD Limited - Premium Digital Marketplace',
  description: 'True Star BD Limited - Your trusted marketplace for AI tools, subscriptions, digital products & services in Bangladesh and worldwide.',
  keywords: 'AI tools, subscriptions, digital marketplace, Bangladesh, True Star BD',
  openGraph: {
    title: 'True Star BD Limited - Premium Digital Marketplace',
    description: 'Premium digital marketplace for AI tools & subscriptions',
    siteName: 'True Star BD',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-[#0f172a]">
        {children}
      </body>
    </html>
  )
}
