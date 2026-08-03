const DATEIEN = ["index.html", "style.css", "app.js"]
const CACHE_NAME = "auftragstracker-v1"

self.addEventListener("install", function(event){
    event.waitUntil(
        caches.open("CACHE_NAME").then(function(cache){
            return cache.addAll(DATEIEN)


        })
    )
})

self.addEventListener("fetch", function(event){
    event.respondWith(
        caches.match(event.request).then(function(antwort){
            return antwort || fetch(event.request)

        })
    )
})