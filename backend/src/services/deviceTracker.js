const geoip = require('geoip-lite')

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.connection?.remoteAddress || req.ip || '127.0.0.1'
}

function getDeviceInfo(userAgent = '') {
  const ua = userAgent.toLowerCase()
  let device = 'desktop'
  let os = 'Unknown'
  let browser = 'Unknown'

  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) device = 'mobile'
  else if (/tablet|ipad/i.test(ua)) device = 'tablet'

  if (/windows/i.test(ua)) os = 'Windows'
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'
  else if (/linux/i.test(ua)) os = 'Linux'
  else if (/chrome os/i.test(ua)) os = 'ChromeOS'

  if (/edg/i.test(ua) && !/chromi/i.test(ua)) browser = 'Edge'
  else if (/firefox/i.test(ua)) browser = 'Firefox'
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari'
  else if (/chrome/i.test(ua)) browser = 'Chrome'
  else if (/opera|opr/i.test(ua)) browser = 'Opera'

  return { device, os, browser }
}

function getLocation(ip) {
  if (!ip || ip === '127.0.0.1' || ip === '::1') return 'Local Development'
  const geo = geoip.lookup(ip)
  if (geo) return `${geo.city || ''}, ${geo.country || ''}`.trim() || 'Unknown'
  return 'Unknown'
}

module.exports = { getClientIp, getDeviceInfo, getLocation }
