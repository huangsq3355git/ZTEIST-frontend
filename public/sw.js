/**
 * Service Worker — ZTEIST
 * 极简：只提供「可安装 PWA」能力，绝不缓存。
 * fetch：直通网络 + 强制回源校验（cache:'no-cache'），对齐 AIF，
 *        避免浏览器 HTTP 缓存导致旧 HTML 引用已删除的旧 CSS hash → 白屏。
 */
const VERSION = 'v1.0.2'

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
  // 非 GET（登录/注册 POST 等）完全不碰，交给浏览器。
  if (event.request.method !== 'GET') return
  // 直通网络，强制回源校验（对齐 AIF：缓存会导致旧 JS/HTML 加载失败）
  event.respondWith(
    fetch(event.request, { cache: 'no-cache' }).catch(() => fetch(event.request))
  )
})
