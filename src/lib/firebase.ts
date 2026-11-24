import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBv3IaSeEgf3LeG9E7h1xPaOvoX3h7Vz1A",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "studio-8871179881-dacb5.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "studio-8871179881-dacb5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "studio-8871179881-dacb5.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "506567133554",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:506567133554:web:b715b59226e81950a0b5eb",
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

if (typeof window !== 'undefined') {
  (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = 'E7E155FE-85F9-4A6E-9EBD-9EC85958BBA0';
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider('6LddHC0uAAAAADU33ihCKdtetmiycOTxdQV7JVyK'),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (e) {
    console.warn('App Check init notice:', e);
  }
}
