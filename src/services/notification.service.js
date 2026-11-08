import { getToken } from "firebase/messaging";
import axios from "axios";
import { messaging } from "../config/firebase";

const API_URL = import.meta.env.VITE_API_URL;

export const registerForPushNotifications = async () => {
    try {
        if (!("Notification" in window)) {
            console.log("Browser does not support notifications.");
            return null;
        }

        if (!("serviceWorker" in navigator)) {
            console.log("Service workers are not supported.");
            return null;
        }

        // Request notification permission
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            console.log("Notification permission denied.");
            return null;
        }

        // Register Firebase service worker
        const registration =
            await navigator.serviceWorker.register(
                "/firebase-messaging-sw.js"
            );

        console.log(
            "Firebase service worker registered:",
            registration
        );

        // Get FCM token
        const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration,
        });

        if (!token) {
            console.log("No FCM token received.");
            return null;
        }

        console.log("FCM Token:", token);

        // Get JWT
        const accessToken =
            localStorage.getItem("accessToken");

        if (!accessToken) {
            console.log(
                "No access token. Cannot register FCM token."
            );

            return null;
        }

        // Send token to backend
        const response = await axios.post(
            `${API_URL}/notifications/token`,
            {
                token,
                platform: "WEB",
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                withCredentials: true,
            }
        );

        console.log(
            "Push token registered:",
            response.data
        );

        return token;

    } catch (error) {
        console.error(
            "FCM registration failed:",
            error
        );

        return null;
    }
};