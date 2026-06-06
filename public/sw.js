/**
 * Kill-switch service worker.
 *
 * A previous deployment may have registered a service worker that is now
 * gone from the codebase. Browsers on networks that visited the site while
 * that SW was live will keep requesting this file and running the old cached
 * worker, which can intercept and break requests.
 *
 * This file instructs every browser that fetches it to:
 *   1. Clear all Cache Storage entries created by the old worker.
 *   2. Unregister every service worker registration for this origin.
 *
 * Once all clients have fetched this version the problem resolves itself and
 * this file can be removed (or left in place — it is harmless).
 */

self.addEventListener("install", () => {
  /** Skip waiting so this worker activates immediately without needing a page reload. */
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      /** Delete every cache this origin owns. */
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));

      /** Unregister all service worker registrations including this one. */
      const registrations = await self.registration.unregister();
      return registrations;
    })(),
  );

  /** Take control of all open tabs immediately. */
  self.clients.claim();
});
