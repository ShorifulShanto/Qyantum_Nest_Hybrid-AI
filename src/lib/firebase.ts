import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { initializeAppCheck, CustomProvider, type AppCheck } from 'firebase/app-check';

// Enable App Check debug token for development, preview, and Vercel environments
if (typeof window !== 'undefined') {
  (window as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN: string }).FIREBASE_APPCHECK_DEBUG_TOKEN =
    'E7E155FE-85F9-4A6E-9EBD-9EC85958BBA0';
}
if (typeof self !== 'undefined') {
  (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN: string }).FIREBASE_APPCHECK_DEBUG_TOKEN =
    'E7E155FE-85F9-4A6E-9EBD-9EC85958BBA0';
}

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBv3IaSeEgf3LeG9E7h1xPaOvoX3h7Vz1A',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'studio-8871179881-dacb5.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'studio-8871179881-dacb5',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'studio-8871179881-dacb5.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '506567133554',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:506567133554:web:b715b59226e81950a0b5eb',
};

// Initialize Firebase App
export const app: FirebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize Firebase App Check with CustomProvider using our registered debug token
let appCheckInstance: AppCheck | null = null;
try {
  if (typeof window !== 'undefined' && app) {
    appCheckInstance = initializeAppCheck(app, {
      provider: new CustomProvider({
        getToken: async () => ({
          token: 'E7E155FE-85F9-4A6E-9EBD-9EC85958BBA0',
          expireTimeMillis: Date.now() + 60 * 60 * 1000,
        }),
      }),
      isTokenAutoRefreshEnabled: true,
    });
  }
} catch (err) {
  console.warn('[Firebase App Check] Initialization notice:', err);
}

export { appCheckInstance };
