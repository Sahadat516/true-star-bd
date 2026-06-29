import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
      <div className="text-center p-8 max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12">
          <span className="text-4xl text-white font-bold">404</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/" className="btn-primary px-6 py-2.5 inline-block">Go Home</Link>
      </div>
    </div>
  )
}
