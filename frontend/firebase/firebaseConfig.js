// src/firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// -----------------------------
// Firebase Config (loaded via Vite env)
// -----------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyABpe227Mn3bPGoC8jcymeamyKEQKZ5t94",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kisan-mitr-882a5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kisan-mitr-882a5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kisan-mitr-882a5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "16427007116",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:16427007116:web:ac6971cb3b41f210d90fa9",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-HWPCEKM6SG",
};

// -----------------------------
// Initialize Firebase
// -----------------------------
const app = initializeApp(firebaseConfig);

// -----------------------------
// Exports
// -----------------------------
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics is optional (won’t break server-side / local dev)
let analytics = null;
try {
  analytics = getAnalytics(app);
} catch (error) {
  analytics = null; // analytics fails in non-browser envs → ignore safely
}

export { analytics };

// -----------------------------
// Auth Persistence Helper
// remember = true  → keeps user logged in (localStorage)
// remember = false → logs out when tab closes (sessionStorage)
// -----------------------------
export async function setAuthPersistence(remember) {
  const persistence = remember
    ? browserLocalPersistence
    : browserSessionPersistence;

  return setPersistence(auth, persistence);
}

export default app;
