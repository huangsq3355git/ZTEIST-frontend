/**
 * Service Worker — ZTEIST
 * 极简：只提供「可安装 PWA」能力，绝不缓存、绝不拦截页面资源。
 * （AIF 血泪教训：SW 缓存/拦截会导致 JS 加载失败、页面白屏。）
 */
const VERSION = 'v1.0.1'

self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  // 纯网络直通：GET 直接交给浏览器默认网络，不缓存、不 revalidate、不 clone。
  // 非 GET（登录/注册 POST 等）完全不碰，交给浏览器。
  if (event.request.method !== 'GET') return
  event.respondWith(fetch(event.request))
})
