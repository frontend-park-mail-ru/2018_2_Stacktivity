importScripts("/static_files_list.js")

this.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open("blep-cache").
            then(function (cache) {
                return cache.addAll([
                    '/',
                    '/single',
                    '/about',
                    ...staticList
                ]);
            }).
            catch((err) => {
                console.log(err.stack || err);
            })
    );
});

this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).
            then((cacheResponse) => {
                if (navigator.onLine) {
                    return fetch(event.request);
                }

                if (cacheResponse) {
                    return cacheResponse;
                }

                return fetch(event.request);
            }).
            catch((err) => {
                console.log(err.stack || err);
            })
    );
});