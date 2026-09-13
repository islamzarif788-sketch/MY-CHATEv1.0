importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js");

// এটা public client config — সরাসরি এখানে বসানো নিরাপদ (ব্রাউজারে এমনিতেও এক্সপোজড থাকে)
firebase.initializeApp({
  apiKey: "AIzaSyCLjz4PeAzFP_us4wcmcf55YWNm3e2eqL0",
  authDomain: "my-messenger-208a3.firebaseapp.com",
  projectId: "my-messenger-208a3",
  storageBucket: "my-messenger-208a3.firebasestorage.app",
  messagingSenderId: "976216704242",
  appId: "1:976216704242:web:af1ca387d4fbdd856dfc6b",
});

const messaging = firebase.messaging();

// ট্যাব/অ্যাপ বন্ধ থাকা অবস্থায় পুশ এলে এই ফাংশনটা চলে এবং একটা সিস্টেম নোটিফিকেশন দেখায়
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || payload.data.title || "নতুন নোটিফিকেশন";
  const body = (payload.notification && payload.notification.body) || payload.data.body || "";
  self.registration.showNotification(title, {
    body,
    icon: "https://www.gstatic.com/firebasejs/live/1.0.0/auth.png",
    tag: (payload.data && payload.data.type) || "notification",
  });
});

// নোটিফিকেশনে ক্লিক করলে অ্যাপটা খুলে যাবে / আগে থেকে খোলা থাকলে সেই ট্যাবেই ফোকাস করবে
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("/");
    })
  );
});
