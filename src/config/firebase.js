// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbcUG-FsoPZtj5j7xroZbfeD1W3yEJT1A",
    authDomain: "kisanai-2c351.firebaseapp.com",
    projectId: "kisanai-2c351",
    storageBucket: "kisanai-2c351.firebasestorage.app",
    messagingSenderId: "162109483689",
    appId: "1:162109483689:web:60c5f5d9454b5449dcd7b8",
    measurementId: "G-4JTFVXVD51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);