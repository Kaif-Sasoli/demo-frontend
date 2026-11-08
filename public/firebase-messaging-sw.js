importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
    apiKey: "AIzaSyCbcUG-FsoPZtj5j7xroZbfeD1W3yEJT1A",
    authDomain: "kisanai-2c351.firebaseapp.com",
    projectId: "kisanai-2c351",
    storageBucket: "kisanai-2c351.firebasestorage.app",
    messagingSenderId: "162109483689",
    appId: "1:162109483689:web:60c5f5d9454b5449dcd7b8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
        "[firebase-messaging-sw.js] Background message:",
        payload
    );

    const notificationTitle =
        payload.notification?.title || "Kisan AI";

    const notificationOptions = {
        body:
            payload.notification?.body ||
            "You have a new notification.",
        icon: "/notification.webp",
        data: payload.data,
    };

    self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );
});