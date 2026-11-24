import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider, type AppCheck } from 'firebase/app-check';

// Enable App Check debug token for development and preview
if (typeof window !== 'undefined') {
  (window as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN: string }).FIREBASE_APPCHECK_DEBUG_TOKEN =
    'E7E155FE-85F9-4A6E-9EBD-9EC85958BBA0';
}
if (typeof self !== 'undefined') {
  (self as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN: string }).FIREBASE_APPCHECK_DEBUG_TOKEN =
    'E7E155FE-85F9-4A6E-9EBD-9EC85958BBA0';
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

// Initialize Firebase App only when environment variables are provided
export const app: FirebaseApp | null = hasFirebaseConfig
  ? !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp()
  : null;

// Initialize Firebase App Check with ReCaptchaV3Provider when configured
let appCheckInstance: AppCheck | null = null;
try {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
  if (app && typeof window !== 'undefined' && siteKey) {
    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true,
    });
  }
} catch {
  // Non-fatal in preview environments without App Check allowlist
}

export { appCheckInstance };
