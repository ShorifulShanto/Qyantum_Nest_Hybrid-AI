# Quantum Nest | Cosmic Observatory & Hybrid AI Gateway

**Quantum Nest** is a professional, production-grade astronomical observatory and planetary archive platform built for **#BuildHybridAI 2026**. It unites NASA/JPL archival imagery, Near-Earth object tracking, exoplanet habitability simulation, authentic space sonification, and a hybrid on-device + cloud AI guide.

---

## 🚀 #BuildHybridAI 2026 Submission Highlights

Quantum Nest leverages cutting-edge AI and cloud architecture to meet all submission criteria:
1. **Firebase AI Logic & App Check**: Integrated with Firebase App Check (`ReCaptchaV3Provider` / Debug Token support) and Firestore telemetry.
2. **Hybrid AI Inference**: Combines Chrome's built-in **Gemini Nano** (via Firebase AI Logic) with high-speed server-sent event (SSE) streaming fallback powered by `gemini-3.1-flash-lite`.
3. **Unrestricted Access for Judges**: Fully accessible **free of charge and without any login or signup walls**, ensuring seamless evaluation and testing by hackathon judges.
4. **Immersive 2D Space Graphics**: Custom HTML5 Canvas renderers featuring a **pulsing 2D Milky Way galaxy**, orbital mechanics for planets and asteroids, and dynamic particle starfields.
5. **NASA Open APIs & JPL Archives**: Live ingestion of NASA APOD, NeoWs asteroids, DONKI space weather, DSCOVR EPIC Earth imagery, and JPL Small-Body databases.

---

## 🌟 Core Features & Modules

- **AI Space Guide**: Full-page interactive AI workspace supporting Auto-Hybrid mode (Gemini Nano + Cloud stream), On-Device only, and Cloud Stream modes with instant response caching and source attribution.
- **Solar System Portal**: 3D ephemeris views, planetary telemetry, dwarf planets, and verified small-body archives (asteroids and comets).
- **Star Atlas**: Celestial coordinate mapping, constellation lore across ancient civilizations, and observational protocols.
- **Space Sounds (Sonic Observatory)**: Authentic NASA mission sonifications and real-time Web Audio synthesizer presets.
- **Goldilocks Habitable Zone Simulator**: Interactive stellar flux and circumstellar zone calculation with Earth Similarity Index (ESI).
- **Cosmic Search**: Real-time NASA Image & Video Library and Near-Earth asteroid database querying.
- **Daily Capture (APOD) & Earth Insights**: High-resolution astronomy imagery and DSCOVR EPIC full-disk Earth observations.
- **Cosmic Journal**: Personal research notes with Markdown export and localStorage persistence.
- **Explorer Dashboard & Badges**: Rank progression and achievement insignia tracking.

---

## ⚙️ Local Development & Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/quantum-nest.git
   cd quantum-nest
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your keys:
   ```env
   VITE_FIREBASE_API_KEY="your-firebase-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
   VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   VITE_FIREBASE_APP_ID="your-app-id"
   VITE_RECAPTCHA_SITE_KEY="your-recaptcha-site-key"
   NASA_API_KEY="your-nasa-api-key"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📄 License & Attribution
Data sourced from NASA Open APIs, JPL-Caltech Archives, and ESA. Built for #BuildHybridAI 2026.
