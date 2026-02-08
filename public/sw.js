// BrewVault Service Worker for Push Notifications

const CACHE_NAME = 'brewvault-v1'

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker')
  self.skipWaiting()
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker')
  event.waitUntil(clients.claim())
})

// Push event - show notification
self.addEventListener('push', (event) => {
  console.log('[SW] Push received')

  let data = {
    title: 'BrewVault',
    message: 'Tienes una nueva notificación',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    url: '/'
  }

  try {
    if (event.data) {
      data = { ...data, ...event.data.json() }
    }
  } catch (e) {
    console.error('[SW] Error parsing push data:', e)
  }

  const options = {
    body: data.message,
    icon: data.icon || '/icons/icon-192.png',
    badge: data.badge || '/icons/badge-72.png',
    tag: data.alertId || 'default',
    renotify: true,
    requireInteraction: data.priority === 'high',
    data: {
      url: data.url || data.actionUrl || '/',
      alertId: data.alertId
    },
    actions: [
      {
        action: 'open',
        title: 'Ver'
      },
      {
        action: 'dismiss',
        title: 'Descartar'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action)

  event.notification.close()

  if (event.action === 'dismiss') {
    // Just close the notification
    return
  }

  // Open the app or focus existing window
  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (const client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus()
            client.navigate(urlToOpen)
            return
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen)
        }
      })
  )
})

// Notification close event
self.addEventListener('notificationclose', (event) => {
  console.log('[SW] Notification closed')
})
