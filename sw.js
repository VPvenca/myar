// Optimalizovaný Service Worker pro iOS PWA
console.log('Service Worker soubor načten.');

const CACHE_NAME = 'ar-app-cache-v68'; // Zvyšte verzi po změnách
const urlsToCache = [
  '/index.html',
  '/info.html', // Přidáno pro iOS
  '/css/base.css',
  '/css/buttons.css',
  '/css/layout.css',
  '/css/links.css',
  '/css/modal.css',
  '/css/pages.css',
  '/css/text-block.css',
  '/script.js',
  '/img/augview.png',
  '/assets/kyjov/kyjov.html',
  '/muzea_galerie.html',
  '/mista_stezky.html',
  '/knihy_publikace.html',
  '/info.html',
  '/manifest.json' // Přidáno
];

// Install event
self.addEventListener('install', event => {
  console.log('Service Worker: Instalace...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Otevřena cache:', CACHE_NAME);
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => {
        console.log('Service Worker: Základní soubory úspěšně nacachovány.');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Chyba při cachování:', error);
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  console.log('Service Worker: Aktivace...');
  event.waitUntil(
    Promise.all([
      // Vyčistit staré cache
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => {
            return cacheName.startsWith('ar-app-cache-') && cacheName !== CACHE_NAME;
          }).map(cacheName => {
            console.log('Service Worker: Mazání staré cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      }),
      // Převzít kontrolu okamžitě
      self.clients.claim()
    ]).then(() => {
      console.log('Service Worker: Aktivován a připraven.');
    })
  );
});

// Fetch event s vylepšenou strategií pro iOS
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // Ignorovat non-GET požadavky
  if (request.method !== 'GET') {
    return;
  }

  // Speciální zacházení s navigačními požadavky (iOS fix)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request).catch(() => {
            // Fallback na index.html při offline
            return caches.match('/index.html');
          });
        })
    );
    return;
  }

  // Standardní cache-first strategie pro ostatní zdroje
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(request.clone()).then(response => {
          // Cachovat pouze úspěšné odpovědi
          if (response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
      .catch(error => {
        console.error('Service Worker: Fetch error:', error);
        // Fallback pro obrázky
        if (request.destination === 'image') {
          return new Response('', { status: 404 });
        }
      })
  );
});
