'use client'

export const gatewayLogos = {
  stripe: <svg viewBox="0 0 40 28" className="w-8 h-6"><rect width="40" height="28" rx="4" fill="#635BFF"/><path d="M20 8.5h-3.5v11H20c3.5 0 5.8-2.2 5.8-5.5S23.5 8.5 20 8.5zm0 9.2h-1.8v-7.4H20c2.2 0 3.8 1.4 3.8 3.7s-1.6 3.7-3.8 3.7zm-8.5-3.5c-.4 0-.7-.3-.7-.7s.3-.7.7-.7h.2l.7.1.4-.2.2-.4V7l-.2-.4-.4-.2-.7-.1c-1.8 0-3.2 1.2-3.2 3s1.4 3 3.2 3c.4 0 .7.3.7.7s-.3.7-.7.7h-.2l-.7-.1-.4.2-.2.4v5l.2.4.4.2.7.1c1.8 0 3.2-1.2 3.2-3 0-1.7-1.4-3-3.2-3z" fill="#fff"/></svg>,

  paypal: <svg viewBox="0 0 40 28" className="w-8 h-6"><rect width="40" height="28" rx="4" fill="#003087"/><path d="M15.5 7h-4c-.3 0-.6.3-.7.6l-2 12.5c0 .3.2.6.5.6h2.2c.3 0 .6-.3.7-.6l.5-3.5c0-.3.3-.6.7-.6h1.5c3.2 0 5-2 5.5-5 .2-1.5-.4-4-3.5-4zm.7 5.5c-.3 1.5-1.8 2.5-3.5 2.5h-1l.7-4.5c0-.2.2-.3.4-.3h.5c1.2 0 2 .5 2.2 1.5.1.3 0 .6.1.8z" fill="#fff"/><path d="M22.5 7h-4c-.3 0-.6.3-.7.6l-2 12.5c0 .3.2.6.5.6h2.2c.3 0 .6-.3.7-.6l.5-3.5c0-.3.3-.6.7-.6h1.5c3.2 0 5-2 5.5-5 .2-1.5-.4-4-3.5-4zm.7 5.5c-.3 1.5-1.8 2.5-3.5 2.5h-1l.7-4.5c0-.2.2-.3.4-.3h.5c1.2 0 2 .5 2.2 1.5.1.3 0 .6.1.8z" fill="#009CDE"/></svg>,

  bkash: <svg viewBox="0 0 40 28" className="w-8 h-6"><rect width="40" height="28" rx="4" fill="#E2136E"/><path d="M20 4c-5.5 0-10 4-10 10s4.5 10 10 10 10-4 10-10-4.5-10-10-10zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm-3-11v6c0 .6.4 1 1 1s1-.4 1-1v-6c0-.6-.4-1-1-1s-1 .4-1 1zm4 0v6c0 .6.4 1 1 1s1-.4 1-1v-6c0-.6-.4-1-1-1s-1 .4-1 1z" fill="#fff"/></svg>,

  nagad: <svg viewBox="0 0 40 28" className="w-8 h-6"><rect width="40" height="28" rx="4" fill="#F5842D"/><text x="20" y="19" textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="bold" fontSize="12">Nagad</text></svg>,

  rocket: <svg viewBox="0 0 40 28" className="w-8 h-6"><rect width="40" height="28" rx="4" fill="#1A5276"/><text x="20" y="19" textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="bold" fontSize="12">Rocket</text></svg>,

  sslcommerz: <svg viewBox="0 0 40 28" className="w-8 h-6"><rect width="40" height="28" rx="4" fill="#28A745"/><text x="20" y="19" textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="bold" fontSize="8">SSLCommerz</text></svg>,

  bybit: <svg viewBox="0 0 40 28" className="w-8 h-6"><rect width="40" height="28" rx="4" fill="#1E3A5F"/><text x="20" y="19" textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="bold" fontSize="12">Bybit</text></svg>,

  binance: <svg viewBox="0 0 40 28" className="w-8 h-6"><rect width="40" height="28" rx="4" fill="#F0B90B"/><text x="20" y="19" textAnchor="middle" fill="#1E1E1E" fontFamily="Arial" fontWeight="bold" fontSize="9">Binance</text></svg>,

  aamarpay: <svg viewBox="0 0 40 28" className="w-8 h-6"><rect width="40" height="28" rx="4" fill="#E74C3C"/><text x="20" y="19" textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="bold" fontSize="8">Aamarpay</text></svg>,

  portwallet: <svg viewBox="0 0 40 28" className="w-8 h-6"><rect width="40" height="28" rx="4" fill="#2E86C1"/><text x="20" y="19" textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="bold" fontSize="8">PortWallet</text></svg>,

  bank_transfer: <svg viewBox="0 0 40 28" className="w-8 h-6"><rect width="40" height="28" rx="4" fill="#555"/><path d="M20 6l-8 6h4v6h8v-6h4l-8-6zm-2 8h4v2h-4v-2z" fill="#fff"/></svg>,

  usdt: <svg viewBox="0 0 40 28" className="w-8 h-6"><rect width="40" height="28" rx="4" fill="#26A17B"/><text x="20" y="19" textAnchor="middle" fill="#fff" fontFamily="Arial" fontWeight="bold" fontSize="8">USDT</text></svg>,
}

export default function GatewayIcon({ id, name, type }) {
  return (
    <div className="flex items-center gap-2">
      {gatewayLogos[id] || <div className="w-8 h-6 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">?</div>}
      <span className="text-sm font-medium">{name}</span>
    </div>
  )
}
