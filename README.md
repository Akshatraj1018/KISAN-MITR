# 🌾 Kisan Mitr (किसान मित्र)
> **Voice-First AI Agricultural Assistant for Indian Farmers**  
> *Built by **Team Loop** for **Innovathon 2.0 • NIT Rourkela 2026***

---

## 💡 About The Project

Most agritech apps in India fail on ground reality because of two major hurdles:
1. **Linguistic & Text Barrier**: Many smallholder farmers struggle with complicated English text interfaces and multi-step menus.
2. **Rural Connectivity**: Cellular network in the fields is often spotty 2G or completely drops offline.

We built **Kisan Mitr** to bridge this gap. It is an edge-native, voice-first web application where a farmer can simply tap a microphone button, speak in **Hindi, Odia, or Indian English**, and receive instant ICAR-certified agronomy advisory.

---

## ✨ What Kisan Mitr Does

- 🎙️ **Krishi Sathi (Voice Assistant)**: Farmers can talk naturally to get answers on crop diseases, weather tips, and fertilizer schedules. The assistant responds with natural speech and dynamic action chips.
- 📸 **Crop & Soil Health Scanner**: Farmers can snap a photo of a diseased crop leaf or their soil to get an immediate visual diagnosis and treatment plan (organic and chemical).
- 📈 **Live Mandi Rates**: Real-time market prices from regional APMC mandis so farmers know the exact market value before selling to middlemen.
- 📴 **Offline-First Resilience**: Built as an installable Progressive Web App (PWA) with client-side caching. Core advisories and scans remain accessible even when internet connectivity drops in the field.
- 🔐 **Farmer-Friendly Login**: Simple 1-click Mobile OTP sign-in, Google account login, or farm profile registration.

---

## 📁 Repository Overview

```
kisan-mitr/
├── frontend/          # React 19 + Vite Progressive Web App
│   ├── src/           # Components, Voice Studio, Dashboard & Scanners
│   └── public/        # Icons, PWA manifest, and static assets
│
└── backend/           # Node.js & Express API Server
    ├── server.js      # Unified REST API for voice, weather & mandi rates
    └── ml-models/     # Crop pathology & soil analysis models
```

---

## 🚀 Running Locally

### 1. Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
Backend runs on `http://127.0.0.1:8000`.

### 2. Start the Frontend App
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Lucide Icons, Glassmorphic CSS
- **Voice Engine**: Web Speech Synthesis & Recognition API (Multilingual)
- **Backend**: Node.js, Express.js
- **Auth**: Firebase v11 (Google OAuth & Smart Mobile OTP)
- **Computer Vision**: PyTorch on-device models for soil & leaf classification
- **Offline Storage**: Workbox Service Workers & IndexedDB

---

## 👥 Team Loop
- **Event**: Innovathon 2.0 — NIT Rourkela (2026)
- **Track**: Agritech & Social Innovation
- **Team**: Team Loop
