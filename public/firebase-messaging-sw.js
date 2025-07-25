// public/firebase-messaging-sw.js
importScripts(
  'https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js'
)
importScripts(
  'https://www.gstatic.com/firebasejs/9.6.11/firebase-messaging-compat.js'
)

firebase.initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

  appId: import.meta.env.VITE_FIREBASE_APP_ID,
})

const messaging = firebase.messaging()

// ✅ onBackgroundMessage: 알림 표시
messaging.onBackgroundMessage(payload => {
  console.log('[SW] background message:', payload)

  self.registration.showNotification(
    payload.notification?.title || '제목 없음',
    {
      body: payload.notification?.body || '본문 없음',
      icon: '/firebase-logo.png',
    }
  )
})

// ✅ 알림 클릭 이벤트 처리 (전역 등록)
// self.addEventListener('notificationclick', event => {
//   console.log('[SW] 알림 클릭됨:', event)
//   event.notification.close()

//   event.waitUntil(
//     clients
//       .matchAll({ type: 'window', includeUncontrolled: true })
//       .then(clientsArr => {
//         for (const client of clientsArr) {
//           if (client.url === '/' && 'focus' in client) return client.focus()
//         }
//         return clients.openWindow('/')
//       })
//   )
// })
