// Service worker for Training Tracker.
//
// Its main job is notifications: Android Chrome forbids `new Notification()`
// ("Illegal constructor") and only allows notifications shown through a
// service worker registration. Without this file, notifications silently
// fail on Android while appearing to work on desktop.
//
// It also lets a tapped notification focus the existing app window rather
// than opening a duplicate tab.

const APP_SCOPE = './index.html';

self.addEventListener('install', event => {
  // Take over immediately rather than waiting for existing tabs to close,
  // so notifications start working on first load.
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// The page asks the worker to show a notification, since only the worker can.
self.addEventListener('message', event => {
  const data = event.data || {};
  if (data.type !== 'show-notification') return;
  const { title, body, tag } = data;
  self.registration.showNotification(title || 'Reminder', {
    body: body || '',
    tag: tag || undefined,
    icon: './icon-192.png',
    badge: './icon-192.png',
    // Keep it on screen until dismissed — a training/health reminder that
    // auto-hides after a few seconds is easy to miss.
    requireInteraction: false,
    renotify: false,
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(APP_SCOPE);
      return undefined;
    })
  );
});
