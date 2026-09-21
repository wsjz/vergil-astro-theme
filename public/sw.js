/**
 * Vergil service worker.
 *
 * Pages are served network-first so a deploy is picked up on the next visit;
 * the cache is only a fallback for slow or offline navigations. Build assets
 * under /_astro/ carry a content hash in their name, so they are immutable and
 * safe to serve cache-first. Everything else uses stale-while-revalidate.
 *
 * Bump CACHE_VERSION whenever the caching strategy itself changes; old caches
 * are dropped on activate.
 */
const CACHE_VERSION = 'v2';
const PAGE_CACHE = `vergil-pages-${CACHE_VERSION}`;
const ASSET_CACHE = `vergil-assets-${CACHE_VERSION}`;
const CURRENT_CACHES = [PAGE_CACHE, ASSET_CACHE];

// Only the shell is precached; precaching real pages just ships stale HTML.
const OFFLINE_FALLBACK = '/';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(PAGE_CACHE)
            .then((cache) => cache.add(new Request(OFFLINE_FALLBACK, { cache: 'reload' })))
            .catch(() => {})
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const names = await caches.keys();
            await Promise.all(names.filter((name) => !CURRENT_CACHES.includes(name)).map((name) => caches.delete(name)));
            if (self.registration.navigationPreload) {
                await self.registration.navigationPreload.enable().catch(() => {});
            }
            await self.clients.claim();
        })()
    );
});

/** Only store complete, same-origin, successful responses. */
function isCacheable(response) {
    return !!response && response.status === 200 && response.type === 'basic';
}

async function putInCache(cacheName, request, response) {
    if (!isCacheable(response)) return;
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone()).catch(() => {});
}

/** Pages and data: always try the network first, fall back to what we have. */
async function networkFirst(event, cacheName) {
    const { request } = event;
    try {
        const preload = event.preloadResponse ? await event.preloadResponse : null;
        const response = preload || (await fetch(request));
        await putInCache(cacheName, request, response);
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
            const fallback = await caches.match(OFFLINE_FALLBACK);
            if (fallback) return fallback;
        }
        throw error;
    }
}

/** Hashed build output: immutable, so the cache is authoritative. */
async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    await putInCache(cacheName, request, response);
    return response;
}

/** Everything else: serve what we have, refresh it in the background. */
async function staleWhileRevalidate(request, cacheName) {
    const cached = await caches.match(request);
    const network = fetch(request)
        .then((response) => {
            putInCache(cacheName, request, response);
            return response;
        })
        .catch(() => null);
    if (cached) return cached;
    const response = await network;
    if (response) return response;
    throw new Error('Request failed and nothing was cached');
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    const isNavigation = request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
    const isData = url.pathname.endsWith('.json') || url.pathname.includes('search-data');

    if (isNavigation || isData) {
        event.respondWith(networkFirst(event, isNavigation ? PAGE_CACHE : ASSET_CACHE));
        return;
    }

    // Astro emits content-hashed filenames into /_astro/, so a hit can never be stale.
    if (url.pathname.startsWith('/_astro/')) {
        event.respondWith(cacheFirst(request, ASSET_CACHE));
        return;
    }

    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
});
