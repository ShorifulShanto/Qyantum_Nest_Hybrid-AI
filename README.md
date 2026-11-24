# Quantum Nest | Cosmic Insights & Hybrid AI Gateway

Quantum Nest is a professional, production-grade astronomical observatory and planetary archive platform. It allows users to explore celestial bodies, star atlases, authentic NASA sonifications, habitable exoplanet zones, and Earth insights with refined human warmth and deep-space dark glassmorphism.

---

## 🚀 Hybrid AI Architecture (#BuildHybridAI 2026)

Quantum Nest implements **Firebase AI Logic (`firebase/ai`)** and **Firebase App Check (`firebase/app-check`)** to meet all technical requirements for the #BuildHybridAI 2026 hackathon:

1. **Firebase App Check (`src/lib/firebase.ts`)**:
   - Initializes Firebase (`initializeApp`) and protects telemetry routes using `initializeAppCheck` with `ReCaptchaV3Provider` and `isTokenAutoRefreshEnabled: true` when environment variables are present.
   - Enables `FIREBASE_APPCHECK_DEBUG_TOKEN = true` strictly in development (`import.meta.env.DEV`) and keeps all secrets out of source files.

2. **Firebase AI Logic Hybrid Inference (`src/lib/hybridAi.ts`)**:
   - Utilizes `getAI(app, { backend: new GoogleAIBackend() })` and `getGenerativeModel`.
   - Configured with `mode: InferenceMode.PREFER_ON_DEVICE` with `inCloudParams: { model: 'gemini-2.5-flash' }` and on-device system instructions.
   - Prompts execute locally via Chrome's built-in Gemini Nano when available, falling back to Cloud Gemini 2.5 Flash or the server-side Gemini proxy when unavailable.

---

## 🔑 Environment Variables (`.env.example`)

Configure the following variables in your environment or Secrets panel (never commit `.env` or hardcode keys in source code):

```env
# Firebase Configuration (Client-side public config via Vite env)
VITE_FIREBASE_API_KEY="MY_FIREBASE_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="MY_PROJECT.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="MY_FIREBASE_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="MY_PROJECT.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="MY_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="MY_FIREBASE_APP_ID"

# App Check reCAPTCHA v3
VITE_RECAPTCHA_SITE_KEY="MY_RECAPTCHA_V3_SITE_KEY"
RECAPTCHA_SECRET_KEY="MY_RECAPTCHA_SECRET_KEY"

# NASA Open APIs Key (Server-side proxy only)
NASA_API_KEY="MY_NASA_API_KEY"

# Gemini API Key (Server-side proxy only)
GEMINI_API_KEY="MY_GEMINI_API_KEY"
```

---

## 🌟 Key Features

- **NASA/JPL 3D Eyes on the Solar System**: Real-time interactive 3D planetary & spacecraft ephemeris integrated directly into the Solar System portal.
- **Celestial Star Atlas**: RA/Dec coordinates, major constellations, and multi-cultural stellar lore.
- **Sonic Observatory**: Authentic NASA mission audio streams and Web Audio synthesizer.
- **Habitable Zone (Goldilocks) Simulator**: Circumstellar zone analysis and Earth Similarity Index (ESI).
- **Cosmic Search**: Live NASA NeoWs asteroid tracking, DONKI space weather alerts, and NASA Image & Video Library search.
- **Daily Capture (APOD) & Earth Insights**: Live NASA Astronomy Picture of the Day and DSCOVR EPIC full-disk Earth captures.
- **Achievement Badge System**: Insignias unlocked as users launch missions and curate bookmarks.
- **Cosmic Journal**: Personal research notes and reflections with localStorage persistence and Markdown export.
