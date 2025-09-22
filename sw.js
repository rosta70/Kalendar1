const CACHE_NAME = 'calendar-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/components/Calendar.tsx',
  '/components/CalendarHeader.tsx',
  '/components/Icons.tsx',
  'https://cdn.tailwindcss.com',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/client',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Použijeme addAll pro atomické přidání všech URL.
        // Důležité: Pokud některé z URL selže, celé addAll selže.
        return fetch(new Request(urlsToCache[urlsToCache.length - 2]), { mode: 'no-cors' })
            .then(() => cache.addAll(urlsToCache))
            .catch(err => console.error('Cache addAll failed:', err));
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Pokud je odpověď v mezipaměti, vrátíme ji
        if (response) {
          return response;
        }

        // Jinak se pokusíme získat odpověď ze sítě
        return fetch(event.request).then(
          (response) => {
            // Zkontrolujeme, zda je odpověď platná
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // DŮLEŽITÉ: Naklonujeme odpověď. Odpověď je Stream a může být spotřebována pouze jednou.
            // Musíme jednu kopii poslat do prohlížeče a druhou do mezipaměti.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
