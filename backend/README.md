# 🌾 Kisan Mitr (किसान मित्र) — Agri-Backend Engine

High-performance, lightweight, and resilient backend microservice for **Kisan Mitr** (Innovathon 2.0 • NIT Rourkela 2026, Team Loop).

The backend integrates **PyTorch Computer Vision**, **APMC Mandi Intelligence**, **Agro-Meteorological Spray Radars**, and a **Multi-Tier Multilingual Voice Agronomist** with zero-failure fallbacks.

---

## 🏗️ Architecture Overview

```
backend/
├── server.js              # Unified Express REST API (All microservice routes)
├── package.json           # Node dependencies (Express, CORS, Multer, Dotenv)
├── .env                   # Environment config (PORT, GEMINI_API_KEY)
└── ml-models/
    ├── classify_soil.py   # Hybrid PyTorch CNN + Munsell Chromatics Soil Engine
    ├── diagnose_crop.py   # Foliar Pathology & Botanical Guardrail Engine
    ├── soil_cnn.py        # PyTorch 4-Layer Deep Convolutional Network architecture
    └── soil_cnn_pytorch.pth # Pre-trained PyTorch weights (38.7 MB)
```

---

## ⚡ Quick Start

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev

# Or start in production mode
npm start
```
The server will start listening on `http://127.0.0.1:8000`.

---

## 📡 API Endpoints Reference

### 1. 🧪 Soil Analysis & Crop Recommendation
- **Endpoint:** `POST /analyze` or `POST /recommend`
- **Payload:** Multipart Form-data (`file` or `image`) OR JSON (`soil_image_base64`)
- **Process:** Spawns `ml-models/classify_soil.py` running PyTorch CNN inference + Munsell colorimetric distance matching.
- **Response:**
  ```json
  {
    "is_soil": true,
    "soil_key": "alluvial",
    "soil_type": "Alluvial Loam Soil (जलोढ़ मिट्टी)",
    "confidence": 96.5,
    "ph": 7.2,
    "nutrients": { "nitrogen": "185 kg/ha", "phosphorus": "22 kg/ha", "potassium": "280 kg/ha" },
    "recommended_crops": [ ... ]
  }
  ```

### 2. 🌿 AI Crop Doctor (Leaf Disease Diagnosis)
- **Endpoint:** `POST /predict/`
- **Payload:** Multipart Form-data (`image`) with optional fields (`symptoms`, `crop_type`)
- **Process:** Spawns `ml-models/diagnose_crop.py` checking botanical canopy ratios and fungal/bacterial necrosis.
- **Response:**
  ```json
  {
    "is_healthy": false,
    "crop_detected": "Tomato / Potato",
    "disease_name": "Early Blight (अगेती झुलसा)",
    "severity": "MODERATE",
    "remedies": {
      "chemical": "Spray Mancozeb 75% WP @ 2.5g/L water.",
      "organic": "Cold-pressed Neem Oil (10,000 ppm) @ 3ml/L water.",
      "preventive": "Avoid overhead sprinkler irrigation; stake plants."
    }
  }
  ```

### 3. 💰 APMC Mandi Rates & Net Freight Calculator
- **Endpoint:** `POST /price-lookup`
- **Payload:**
  ```json
  { "crop": "wheat", "quantity_quintal": 25, "district": "Sundargarh" }
  ```
- **Process:** Computes in-hand net realization after deducting transport freight per kilometer:
  $$\text{Net Payout} = (\text{Mandi Rate} \times \text{Quantity}) - (\text{Distance} \times \text{Freight Rate})$$
- **Additional Endpoints:**
  - `GET /api/mandi/rates`: Full APMC market prices across commodities.
  - `GET /api/mandi/crops`: Supported crop catalogs.

### 4. 🌦️ Agro-Meteorology & Spray Safety Radar
- **Endpoint:** `GET /api/weather?city=Rourkela&state=Odisha`
- **Process:** Evaluates wind speed (< 12 km/h), precipitation probability (< 25%), and humidity to activate the **Safe Spray Window Active** status.

### 5. 🎙️ Krishi Sathi Multilingual Voice Helpline
- **Endpoint:** `POST /api/call/initiate`
  - Returns localized greeting in 6 Indian languages (Hindi, Odia, Bengali, Punjabi, Gujarati, English).
- **Endpoint:** `POST /api/call/speak` or `POST /chat`
  - Dynamic conversational AI using Google Gemini Flash-Lite with automatic zero-failure fallback to embedded ICAR agronomy decision trees.
- **Endpoint:** `GET /api/tts?text=...&lang=hi`
  - Audio generation helper endpoint.

### 6. 🔐 Farmer Authentication
- **Endpoint:** `POST /api/auth/send-otp`
- **Endpoint:** `POST /api/auth/verify-otp`
  - Lightweight phone authentication for rural farmers.

---

## 🛡️ Zero-Crash Architecture
- **No Heavy Dependencies:** Does not require Redis or PostgreSQL services to boot; all caching and persistence defaults to resilient in-memory data structures.
- **Python ML Timeout Guard:** PyTorch sub-processes execute with strict 4-second timeout aborts, ensuring the Node.js event loop never blocks or hangs.
- **Bilingual & Multilingual:** All responses are formatted for immediate readability in native scripts.
