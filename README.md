# 🌾 Kisan Mitr (किसान मित्र)
### Next-Gen Edge-First AI Agricultural Operating System for Indian Farmers

[![Innovathon 2.0](https://img.shields.io/badge/Innovathon%202.0-NIT%20Rourkela%202026-059669.svg?style=for-the-badge)](https://nitrkl.ac.in)
[![Team Loop](https://img.shields.io/badge/Team-Team%20Loop-10b981.svg?style=for-the-badge)](#team-loop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)

---

## 📌 Executive Summary
**Kisan Mitr** is an edge-native, multilingual conversational agricultural intelligence platform engineered specifically for India's 140+ million smallholder farmers. By eliminating traditional text/app barriers, Kisan Mitr provides a **Voice-First, Vision-Powered agricultural ecosystem** that delivers actionable ICAR-certified advisories, computer vision disease diagnostics, and live APMC mandi price telemetry—**functioning reliably even under zero internet connectivity**.

Built and presented by **Team Loop** for **Innovathon 2.0 • NIT Rourkela 2026**.

---

## 🚀 Key Innovations & Architecture

```
                               ┌─────────────────────────────────────────┐
                               │   🌾 KISAN MITR CLIENT (REACT + PWA)   │
                               │  - Krishi Sathi Voice Assistant         │
                               │  - Soil Health & Leaf Disease Vision    │
                               │  - Live APMC Mandi Rates & Weather HUD  │
                               └────────────────────┬────────────────────┘
                                                    │
                             ┌──────────────────────┴──────────────────────┐
                             ▼                                             ▼
                 [ ONLINE / 4G CONNECTION ]                   [ ZERO CONNECTIVITY / 2G ]
                             │                                             │
                             ▼                                             ▼
             ┌───────────────────────────────┐             ┌───────────────────────────────┐
             │       EXPRESS BACKEND         │             │      CLIENT-SIDE EDGE PWA     │
             │ - Multi-tier AI Agronomy      │             │ - IndexedDB Local Persistence │
             │ - Live APMC & Weather Sync    │             │ - Web Speech API On-Device    │
             │ - Redis Sub-ms Cache Fallback │             │ - Cached Offline ML Pipelines │
             │ - Firebase Identity Token API │             │ - Service Worker Background   │
             └───────────────────────────────┘             └───────────────────────────────┘
```

### 1. 🎙️ "Krishi Sathi" Multilingual Voice Helpline
- **Zero Latency Voice Conversation**: Natural female speech synthesis (`Lekha` / `Tara` neural voices) in Hindi, Odia, and Indian English.
- **Universal Secular Persona**: Respectful, empathetic, professional agronomy agent addressing farmers personally by name (*"Namaste [Name] ji"*).
- **Dynamic Action Chips**: One-tap interactive audio pills for instant pesticide dosage, fertilizer schedules, and mandi price checks.

### 2. 🔍 Edge Computer Vision Diagnostics
- **Leaf Disease Detection**: Instant visual classification of crop infections (Late Blight, Rust, Blast, Powdery Mildew) with organic vs chemical treatment plans.
- **Soil Texture Analysis**: Physical texture analysis (Alluvial, Black, Red, Clay) with tailored N-P-K nutrient enrichment guidelines.

### 3. 📈 Live APMC Mandi Telemetry & Profit Arbitrage
- Real-time commodity spot rates from regional agricultural markets across Odisha and neighboring states.
- Geodesic distance profit calculator factoring in diesel transport costs to ensure smallholders never get underpaid by middlemen.

### 4. ⚡ 100% Offline-First Resilience
- Full Progressive Web Application (PWA) manifest and Service Worker caching (`workbox`).
- When cell towers drop, farmers can still access disease remedies, past soil scans, and speech interaction without crashing.

---

## 📁 Repository Structure

```
kisan-mitr/
├── frontend/                     # React 19 + Vite 7 PWA Application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Google Mail OAuth, Phone OTP & Farm Register
│   │   │   ├── MainDashboard.jsx # Real-time Agronomy Cockpit
│   │   │   ├── KisanMitra.jsx    # Krishi Sathi Fullscreen Voice Studio
│   │   │   ├── SoilAnalysis.jsx  # Computer Vision Soil Health Scanner
│   │   │   └── CropDisease.jsx   # Deep Learning Leaf Pathology Scanner
│   │   ├── context/              # Auth, Language & Farm State Providers
│   │   └── assets/               # Official Kisan Mitr circular emblem assets
│   ├── firebase/                 # Firebase v11 Authentication & Firestore Config
│   └── vite.config.js            # PWA service worker & cache configuration
│
├── backend/                      # High-Resilience Express Backend
│   ├── server.js                 # Unified REST & Voice API with built-in fallbacks
│   ├── ml-models/                # PyTorch & ONNX crop pathology models
│   └── package.json              # Lightweight production dependencies
│
└── presentation/                 # Innovathon 2.0 Pitch Deck & Research Assets
```

---

## 🛠️ Quick Start Guide

### Prerequisites
- **Node.js** v18+ (v22+ recommended)
- **npm** v9+

### 1. Run the Backend API
```bash
cd backend
npm install
npm run dev
# Server boots on http://127.0.0.1:8000
```

### 2. Run the Frontend PWA
```bash
cd frontend
npm install
npm run dev
# Client boots on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 👥 Team Loop • Innovathon 2.0
- **Event:** Innovathon 2.0 — National Institute of Technology (NIT) Rourkela 2026
- **Track:** Agritech & AI for Social Impact
- **Team Name:** Team Loop
- **Lead Developer & Presenter:** Akshat Raj & Team

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
