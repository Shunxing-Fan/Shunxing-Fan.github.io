const CACHE_NAME = "thai-characters-v1";
const CORE_ASSETS = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "sw.js",
  "assets/characters.json",
  "assets/audio/manifest.json",
  "assets/alphabet/Week 1.jpg",
  "assets/alphabet/Week 2.jpg",
  "assets/alphabet/Week 3.jpg",
  "assets/alphabet/Week 4.jpg",
  "assets/alphabet/Week 5.jpg",
  "assets/alphabet/Week 6.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("thai-characters-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (!url.href.startsWith(self.registration.scope)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match(event.request)
        .then((cached) => cached || caches.match("./") || caches.match("index.html"))
        .then((cached) => cached || fetch(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
