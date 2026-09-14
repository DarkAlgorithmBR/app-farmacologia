/**
 * Farmacologia Conectada - Service Worker
 * Network-First Strategy para atualizações em tempo real + Cache Offline
 */

const CACHE_NAME = 'farmacologia-conectada-v2.3.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/styles.css',
  './assets/js/storage.js',
  './assets/js/maps-data.js',
  './assets/js/dictionary-data.js',
  './assets/js/bonus-data.js',
  './assets/js/quiz-data.js',
  './assets/js/calculator.js',
  './assets/js/viewer.js',
  './assets/js/app.js',
  './assets/images/icons/icon-192.svg',
  './assets/images/icons/icon-512.svg'
];

// Instalação do Service Worker e pré-cache
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker v2] Pré-carregando cache de arquivos essenciais...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Removendo cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia Network-First: Sempre busca a versão mais recente do servidor
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback offline quando não houver internet
        return caches.match(event.request);
      })
  );
});
