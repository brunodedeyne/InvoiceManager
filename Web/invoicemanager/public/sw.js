importScripts('serviceworker-cache-polyfill.js');

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('invoicemanager').then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/Inloggen',
                '/Nieuw_Plan',
                '/Nieuwe_Factuur',
                '/Facturatie',
                '/Cliënten',
                '/Mijn_Account',
                '/Overzicht',
                '/manifest.json',
                '/src/assets/img/backgroundHQ.webp',
                '/src/assets/img/logo_white.webp',
            ]);
        })
    );
});

// example usage:
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('invoicemanager').then(function (cache) {
            return cache.put([
                '/',
                '/index.html',
                '/Inloggen',
                '/Nieuw_Plan',
                '/Nieuwe_Factuur',
                '/Facturatie',
                '/Cliënten',
                '/Mijn_Account',
                '/Overzicht',
                '/manifest.json',
                '/src/assets/img/backgroundHQ.webp',
                '/src/assets/img/logo_white.webp',
            ], new Response("From the cache!"));
        })
    );
});

self.addEventListener('fetch', function(event) {
    console.log(event.request.url);    
    event.respondWith(    
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);    
        })    
    );    
});