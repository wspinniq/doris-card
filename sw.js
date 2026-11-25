/* V5.16.14: network-only service worker for install capability.
 * Deliberately NO Cache Storage or offline snapshots: mail_content.json,
 * card assets, and sound files always follow normal network/browser caching.
 */
'use strict';
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
  }
});
