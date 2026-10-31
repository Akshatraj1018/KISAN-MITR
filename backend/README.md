# 🌾 Kisan Mitra: Beginner-Friendly Node.js + Express Backend

Welcome to the refactored, clean, and beginner-friendly backend for **Kisan Mitra (Kisan Mitra)**!

This backend is built entirely with tools you already know:
- **Node.js (ES6 Modules)**
- **Express.js** (Simple REST API routing)
- **Redis Support** (Sub-millisecond caching for market rates and weather)
- **PostgreSQL Support** (Relational persistence for farmer profiles & logs)
- **Local Ollama & Google Gemini** (Multi-tier Conversational AI)
- **Neural Voice Synthesis** (`msedge-tts` for natural Indian voices)

---

## 📁 Project Structure (Simple & Modular)

```
node-backend/
├── server.js              # Main Express server entry point (Routes & Middlewares)
├── .env                   # Environment variables (PORT, GEMINI_API_KEY, REDIS_URL, DATABASE_URL)
├── package.json           # Dependencies and start scripts
│
├── config/
│   ├── redis.js           # Redis caching with automatic in-memory fallback
│   └── db.js              # PostgreSQL client with automatic in-memory fallback
│
└── services/
    ├── ai.js              # 3-Tier Conversational AI (Gemini -> Ollama -> ICAR Rules)
    ├── tts.js             # Indian Neural Speech Synthesizer (Edge TTS)
    ├── soil.js            # Soil texture classification & ICAR agronomy recommendations
    ├── disease.js         # Crop disease diagnosis & chemical/organic cures
    └── mandi.js           # Live APMC Mandi rates & geodesic distance profit calculator
```

---

## 🚀 How to Run the Server

From your terminal:
```bash
cd /Users/akshatraj/.gemini/antigravity/scratch/kisan-mitra-v4/node-backend
npm run dev
```

The server will automatically start on `http://127.0.0.1:8000`.

---

## 🛡️ Built-in Resilience (Zero Crash Guarantee)

- **If Redis is not running**: The server automatically falls back to an in-memory RAM cache. Your app will **never crash**!
- **If PostgreSQL is not running**: The server safely stores session data in memory.
- **If the internet goes offline**: The AI instantly routes to your local **Ollama (`llama3.2:1b`)** and embedded ICAR agronomy rules without hanging.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/` | Server health check and status report. |
| `POST` | `/recommend` | Soil image analysis & crop recommendations. |
| `POST` | `/api/call/initiate` | Voice helpline greeting & audio synthesis. |
| `POST` | `/api/call/speak` | Voice AI conversation with dynamic action chips. |
| `POST` | `/chat` | Standard text chat compatibility endpoint. |
| `POST` | `/predict/` | Leaf image upload for disease diagnosis. |
| `POST` | `/price-lookup` | Mandi market rates with Redis speed cache. |
