/**
 * Service Worker — ZTEIST
 * install: skipWaiting 立即接管。
 * activate: 清空缓存 + claim clients。
 * fetch: 直通网络、不缓存（参考 AIF 教训：缓存会导致 JS 加载失败）。
 */
const VERSION = 'v1.0.0'

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
  event.respondWith(
    fetch(event.request.clone(), { cache: 'no-cache' }).catch(() => fetch(event.request.clone())),
  )
})
