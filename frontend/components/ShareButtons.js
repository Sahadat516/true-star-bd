'use client'

import { Share2, Facebook, Twitter, MessageCircle, Send } from 'lucide-react'

export default function ShareButtons({ url, title, description }) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')
  const shareTitle = title || 'Check this out!'
  const shareDesc = description || ''

  const shareLinks = [
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'Twitter', icon: Twitter, color: 'bg-black hover:bg-gray-800', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}` },
    { name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-600 hover:bg-green-700', href: `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}` },
    { name: 'Telegram', icon: Send, color: 'bg-blue-500 hover:bg-blue-600', href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}` },
  ]

  const handleNativeShare = () => {
    if (navigator.share) navigator.share({ title: shareTitle, text: shareDesc, url: shareUrl })
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 mr-1"><Share2 className="w-4 h-4 inline mr-1" />Share:</span>
      {shareLinks.map(link => (
        <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"
          className={`w-8 h-8 ${link.color} rounded-full flex items-center justify-center transition-transform hover:scale-110`} title={link.name}>
          <link.icon className="w-4 h-4 text-white" />
        </a>
      ))}
    </div>
  )
}
