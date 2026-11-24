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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'projek-4-818d8.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'projek-4-818d8',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'projek-4-818d8.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:demo',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
export default app
