// Import Firebase scripts for service worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in service worker
// Use the correct Firebase configuration from your .env
firebase.initializeApp({
 apiKey: "AIzaSyC71hBg73rpkySVVZ86B3B7pPXYiT7O8TE",
  authDomain: "tanzaniaservices-739c2.firebaseapp.com",
  projectId: "tanzaniaservices-739c2",
  storageBucket: "tanzaniaservices-739c2.firebasestorage.app",
  messagingSenderId: "1007107385150",
  appId: "1:1007107385150:web:2ead6cd5f212abd105ee6f"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  // Customize notification here
  const notificationTitle = payload.notification?.title || 'New Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new message',
    icon: '/logo.png', // Your app icon
    badge: '/logo.png',
    tag: payload.data?.orderId || 'default',
    requireInteraction: false,
    data: payload.data || {}
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click received.', event);
  
  event.notification.close();
  
  // Get the data from the notification
  const data = event.notification.data;
  
  // Define the URL to open based on notification data
  let urlToOpen = '/';
  
  if (data.orderId) {
    // Navigate to order detail page
    urlToOpen = `/worker/booking/${data.orderId}`;
  } else if (data.jobId) {
    // Navigate to job detail page
    urlToOpen = `/job/${data.jobId}`;
  } else if (data.url) {
    // Use custom URL from notification data
    urlToOpen = data.url;
  }
  
  // Open the URL in a new window or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there is already a window open with the target URL
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
