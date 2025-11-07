// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-6d473.firebaseapp.com",
    projectId: "mern-blog-6d473",
    storageBucket: "mern-blog-6d473.firebasestorage.app",
    messagingSenderId: "467298424911",
    appId: "1:467298424911:web:d27f3f59e06adb681d723a",
    measurementId: "G-705R92LLNJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);