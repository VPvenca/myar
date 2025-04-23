// Service Worker soubor
console.log('Service Worker soubor načten.');
// Service Worker soubor

const CACHE_NAME = 'ar-app-cache-v22'; // Název cache (změňte 'v1' při aktualizaci cache)
const urlsToCache = [
  '/', // Často alias pro index.html
  '/index.html',
  '/css/style.css',
  '/script.js',
  '/sw.js',
  '/img/augview.png', // Přidejte vaše logo
  // Přidejte další klíčové soubory, které tvoří základní UI
  // Např. soubory podmenu, pokud jsou důležité pro offline start:
  '/assets/kyjov/kyjov.html',
  '/muzea_galerie.html',
  '/mista_stezky.html',
  '/knihy_publikace.html',
  '/info.html',
  // POZOR: Velké soubory (videa, .mind) zde raději NECACHUJTE automaticky!
  // Ty se načtou ze sítě, když budou potřeba.
];

// Událost 'install': Spustí se při první registraci nebo aktualizaci SW
self.addEventListener('install', event => {
  console.log('Service Worker: Instalace...');
  // Počkáme, dokud se všechny základní soubory nenacachují
  event.waitUntil(
    caches.open(CACHE_NAME) // Otevřeme (nebo vytvoříme) naši cache
      .then(cache => {
        console.log('Service Worker: Otevřena cache:', CACHE_NAME);
        return cache.addAll(urlsToCache); // Přidáme všechny definované URL do cache
      })
      .then(() => {
        console.log('Service Worker: Základní soubory úspěšně nacachovány.');
        // Aktivujeme SW hned po úspěšné instalaci (pokud není žádný starý SW aktivní)
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Chyba při cachování základních souborů:', error);
      })
  );
});

// Událost 'activate': Spustí se po 'install', když SW přebírá kontrolu
self.addEventListener('activate', event => {
  console.log('Service Worker: Aktivace...');
  // Zde bychom mohli mazat staré cache, pokud bychom měli více verzí
  // Např. smazat všechny cache, které nemají název CACHE_NAME
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Smažeme staré verze naší cache
          return cacheName.startsWith('ar-app-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log('Service Worker: Mazání staré cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
        console.log('Service Worker: Aktivován a připraven převzít kontrolu.');
        // Řekne stránkám, aby použily tento nový SW okamžitě
        return self.clients.claim();
      })
  );
});

// Událost 'fetch': Spustí se pro každý síťový požadavek ze stránky
self.addEventListener('fetch', event => {
  // Odpovíme buď odpovědí z cache, nebo síťovým požadavkem
  event.respondWith(
    caches.match(event.request) // Hledáme požadavek v cache
      .then(response => {
        // Pokud je odpověď v cache, vrátíme ji
        if (response) {
          // console.log('Service Worker: Odpověď nalezena v cache:', event.request.url);
          return response;
        }
        // Pokud není v cache, pošleme požadavek na síť
        // console.log('Service Worker: Odpověď nenalezena v cache, dotaz na síť:', event.request.url);
        return fetch(event.request);
      })
      .catch(error => {
          // Zde bychom mohli vrátit nějakou offline fallback stránku, pokud i síť selže
          console.error('Service Worker: Chyba při fetch:', error);
          // Např. return caches.match('/offline.html'); (pokud máte offline stránku)
      })
  );
});
