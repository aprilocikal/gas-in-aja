// Firebase configuration for Kinetix Code
// Project: projek-4-818d8 (cikalmunazat@gmail.com)
// 
// SETUP: Copy .env.local.example ke .env.local dan isi dengan nilai dari:
// https://console.firebase.google.com/project/projek-4-818d8/settings/general
//
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDB4Y9npn6HUVdzGEhttXP_s-Inj6zauQg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'projek-4-818d8.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'projek-4-818d8',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'projek-4-818d8.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '509432232001',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:509432232001:web:b7b18a3c9c319fcfadeec0',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-DF3H01HWZM',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
export default app
