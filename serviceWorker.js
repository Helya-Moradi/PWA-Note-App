const staticCacheName="note-app+"
const cacheAssets= [
    "/",
    "/css/style.css",
    "/manifest.json",
    "/js/app.js",
    "/icons/Icon-108@2x.png",
    "/icons/Icon-40@2x.png"
]

self.addEventListener("install",async (evt) => {
    console.log('installing...')
    evt.waitUntil(self.skipWaiting());

    evt.waitUntil(
        caches
            .open(staticCacheName)
            .then((cache) => {
                    cache.addAll(cacheAssets)
                }
            ),
    );
})

self.addEventListener("activate",evt => {
    console.log('activate')
})

function cacheFirst(request) {
    console.log('cache first', request.url)

    return caches
        .match(request)
        .then(res=>{
            return res || fetch(request.url)
        })

    // return caches.open(staticCacheName)
    //     .then(cache=>{
    //         return cache.match(request.url)
    //             .then(cacheRes=>{
    //                 if(cacheRes){
    //                     return cacheRes
    //                 }
    //
    //                 return fetch(request)
    //                     .then(fetchRes=>{
    //                         cache.put(request,fetchRes.clone())
    //
    //                         return fetchRes
    //                     })
    //             })
    //     })
}

function cacheOnly(request) {
    console.log('cache only', request.url)

    return caches
        .match(request)
        .then(res=>{
            return res
        })
}

function networkFirst(request) {
    console.log('network first', request.url)

    return fetch(request.url).then(res => {
        return res || caches.match(request);
    })
}

function networkOnly(request) {
    console.log('network only', request.url)

    return fetch(request.url).then(res => {
        return res
    })
}

function staleWhileRevalidate(request){
    console.log('staleWhileRevalidate', request.url)

    // return caches.open(staticCacheName)
    // .then(cache=>{
    //     cache.match(request)
    //         .then(cacheRes=>{
    //             fetchRes=fetch(request)
    //                 .then(res=>{
    //                     cache.put(request,res.clone())
    //
    //                     return res
    //                 })
    //
    //             return cacheRes || fetchRes
    //         })
    // })

    return caches.open(staticCacheName)
        .then((cache)=> {
            cache.match(request)
                .then( (cacheResponse)=> {
                    fetch(request)
                        .then((networkResponse)=> {
                           cache.put(request, networkResponse)
                        })
                    return cacheResponse || networkResponse
                })
        })
}

self.addEventListener("fetch",evt => {
    console.log('fetch', evt.request.url)

    const url = new URL(evt.request.url);
    const isPrecachedRequest = cacheAssets.includes(url.pathname);

    if(isPrecachedRequest){
        evt.respondWith(
            cacheFirst(evt.request)
        )
    }else {
        evt.respondWith(
            networkFirst(evt.request)
        )
    }
})