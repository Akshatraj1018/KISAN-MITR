// src/pages/MainDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Search,
  Mic,
  Bell,
  FlaskConical,
  Stethoscope,
  TrendingUp,
  Calendar,
  Sparkles,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Droplets,
  Wind,
  Sun,
  Layers,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import "../styles/MainDashboard.css";
import BottomNav from "../components/BottomNav";
import kisanMitrLogo from "../assets/kisanmitr_logo.jpg";
import { useLanguage } from "../context/LanguageContext";

export default function MainDashboard() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [farmerName, setFarmerName] = useState("Vivek Singh");
  const [district, setDistrict] = useState("Rourkela, Sundargarh");
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  // Live weather & spray metrics
  const [weatherData, setWeatherData] = useState({
    temp: 27,
    high: 28,
    low: 14,
    condition: "Clear Sky / Sunny",
    conditionLabel: "साफ मौसम",
    humidity: "58%",
    precipitation: "0 mm",
    sprayStatus: "Optimal",
    windSpeed: "7.5 km/h",
    sunrise: "5:45 AM",
    sunset: "6:15 PM",
  });

  useEffect(() => {
    // Fetch live weather from backend endpoint if online
    fetch("http://127.0.0.1:8000/api/weather?city=Rourkela&state=Odisha")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.temperature_celsius) {
          setWeatherData({
            temp: Math.round(data.temperature_celsius),
            high: Math.round(data.max_temp),
            low: Math.round(data.min_temp),
            condition: "Clear Sky",
            conditionLabel: "साफ मौसम",
            humidity: `${data.humidity_percent}%`,
            precipitation: `${data.precipitation_probability_percent}%`,
            sprayStatus: data.agro_advisories?.is_spray_safe ? "Optimal" : "Delay",
            windSpeed: `${data.wind_speed_kmh} km/h`,
            sunrise: "5:45 AM",
            sunset: "6:15 PM",
          });
        }
      })
      .catch(() => {
        // Safe offline default
      });
  }, []);

  // Today's formatted date
  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Handle voice speech search
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      navigate("/call");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language === "or" ? "or-IN" : language === "bn" ? "bn-IN" : "hi-IN";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
      navigate("/call", { state: { initialQuery: transcript } });
    };

    recognition.onerror = () => {
      setIsListening(false);
      navigate("/call");
    };
  };

  // Top Mandi highlights
  const mandiHighlights = [
    {
      mandi: "Rourkela APMC Yard",
      place: "Panposh, Sundargarh (8 km)",
      crop: "Paddy Swarna (धान)",
      icon: "🍚",
      price: "₹2,380",
      unit: "/quintal",
      mspDelta: "+₹80 above MSP",
      trend: "up",
    },
    {
      mandi: "Sambalpur Mandi",
      place: "Sambalpur (125 km)",
      crop: "Wheat HD-2967 (गेहूं)",
      icon: "🌾",
      price: "₹2,420",
      unit: "/quintal",
      mspDelta: "+₹145 above MSP",
      trend: "up",
    },
    {
      mandi: "Bargarh APMC",
      place: "Rice Bowl Market (170 km)",
      crop: "Mustard Giriraj (सरसों)",
      icon: "🟡",
      price: "₹5,820",
      unit: "/quintal",
      mspDelta: "+₹170 above MSP",
      trend: "up",
    },
  ];

  // Farm advisories & activity feed (matching Screen 3 of reference screenshot)
  const activityNotes = [
    {
      id: 1,
      thumb: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22513?w=300&auto=format&fit=crop&q=80",
      timestamp: "Today · 3:00 PM – 5:30 PM",
      title: "Optimal Foliar Spray Window (अनुकूल छिड़काव समय)",
      desc: "Wind velocity is calm (7.5 km/h) with zero rain risk. Safe to apply bio-stimulant or Mancozeb fungicide spray without chemical drift.",
    },
    {
      id: 2,
      thumb: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&auto=format&fit=crop&q=80",
      timestamp: "Upcoming · Sowing Day 21",
      title: "Wheat Crown Root Irrigation (CRI सिंचाई)",
      desc: "Primary root branching initiated. Schedule light 2-inch irrigation to spur 8-12 tillers per plant and broadcast 30 kg Urea 24 hrs after watering.",
    },
    {
      id: 3,
      thumb: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=300&auto=format&fit=crop&q=80",
      timestamp: "Soil Lab · ICAR Benchmarked",
      title: "Soil Test Verified: Sandy Loam (बलुई दोमट)",
      desc: "Measured pH 6.6 with healthy microbial activity. Recommended basal dosage: 40 kg SSP + 20 kg MOP for optimal nitrogen efficiency.",
    },
  ];

  return (
    <div className="km-dashboard-page">
      {/* 1. DEEP FOREST GREEN HEADER BANNER (SCREEN 1 HERO) */}
      <header className="km-hero-banner">
        <div className="km-banner-inner">
          <div className="km-header-top-row">
            <div className="km-greeting-wrap">
              <h1 className="km-greeting-title">
                {language === "or"
                  ? `ନମସ୍କାର, ${farmerName}!`
                  : language === "bn"
                  ? `নমস্কার, ${farmerName}!`
                  : `नमस्ते, ${farmerName}!`}
              </h1>
              <div className="km-greeting-subtitle">
                <span>{todayFormatted}</span>
                <span>•</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "3px" }}>
                  <MapPin size={13} /> {district}
                </span>
              </div>
            </div>

            <div className="km-header-actions">
              <button
                className="km-header-icon-btn"
                onClick={() => navigate("/call")}
                title="Call Krishi Sathi"
                aria-label="Call Krishi Sathi"
              >
                <Bell size={18} />
              </button>
              <button
                className="km-avatar-btn"
                onClick={() => navigate("/farmer-profile")}
                title="View Profile"
              >
                <img src={kisanMitrLogo} alt="Kisan Mitra" className="km-avatar-img" />
              </button>
            </div>
          </div>

          {/* Translucent Voice Search Bar */}
          <div className="km-search-bar">
            <Search size={18} color="rgba(255, 255, 255, 0.75)" />
            <input
              type="text"
              className="km-search-input"
              placeholder={
                language === "hi"
                  ? "फसल रोग, खाद, या मंडी भाव पूछें..."
                  : language === "or"
                  ? "ଫସଲ ରୋଗ, ଖତ କିମ୍ବା ମଣ୍ଡି ଦର ପଚାରନ୍ତୁ..."
                  : "Search crops, soil health, mandi prices..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  navigate("/call", { state: { initialQuery: searchQuery } });
                }
              }}
            />
            <button
              className="km-search-mic-btn"
              onClick={handleVoiceSearch}
              title="Voice Search with Krishi Sathi"
            >
              <Mic size={18} color={isListening ? "#EF4444" : "#FFFFFF"} />
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="km-dashboard-content">
        {/* 3. FLOATING WEATHER & AGRO STATUS HERO CARD */}
        <section className="km-weather-hero-card" aria-label="Farm Weather & Status">
          <div className="km-weather-card-top">
            <div className="km-location-chip">
              <MapPin size={15} color="#0D5C3A" />
              <span>{district}</span>
            </div>
            <div className="km-badge km-badge-emerald">
              <ShieldCheck size={13} /> ICAR Live Telemetry
            </div>
          </div>

          <div className="km-temp-main-row">
            <div>
              <div className="km-temp-number">+{weatherData.temp}°C</div>
              <div className="km-temp-range">
                H: {weatherData.high}°C • L: {weatherData.low}°C
              </div>
            </div>

            <div className="km-weather-illustration">
              <span className="km-weather-badge-icon">☀️</span>
              <span className="km-weather-condition-label">{weatherData.conditionLabel}</span>
            </div>
          </div>

          {/* 4-Metric Grid */}
          <div className="km-weather-metrics-grid">
            <div className="km-metric-col">
              <span className="km-metric-col-title">Humidity</span>
              <span className="km-metric-col-value">{weatherData.humidity}</span>
            </div>
            <div className="km-metric-col">
              <span className="km-metric-col-title">Rain Risk</span>
              <span className="km-metric-col-value">{weatherData.precipitation}</span>
            </div>
            <div className="km-metric-col">
              <span className="km-metric-col-title">Spray Window</span>
              <span className="km-metric-col-value" style={{ color: "#0D5C3A" }}>
                {weatherData.sprayStatus}
              </span>
            </div>
            <div className="km-metric-col">
              <span className="km-metric-col-title">Wind Speed</span>
              <span className="km-metric-col-value">{weatherData.windSpeed}</span>
            </div>
          </div>

          {/* Sunrise / Sunset Arc */}
          <div className="km-sun-arc-container">
            <span>{weatherData.sunrise} Sunrise</span>
            <div className="km-sun-arc-line">
              <span className="km-sun-arc-sun">☀️</span>
            </div>
            <span>{weatherData.sunset} Sunset</span>
          </div>
        </section>

        {/* 4. CATEGORIES QUICK ACTION GRID (SCREEN 1 "INVEST BY CATEGORY") */}
        <section aria-label="Quick Krishi Tools">
          <div className="km-section-title-row">
            <h2 className="km-section-title">
              {language === "hi" ? "त्वरित कृषि सेवाएं" : language === "or" ? "ମୁଖ୍ୟ କୃଷି ସେବା" : "Quick Krishi Tools"}
            </h2>
            <span className="km-section-link" onClick={() => navigate("/cultivation-tracker")}>
              View Tracker <ChevronRight size={14} />
            </span>
          </div>

          <div className="km-category-grid">
            {/* Tool 1: Soil Lab */}
            <div className="km-category-card" onClick={() => navigate("/soil")}>
              <div className="km-category-icon-box">
                <FlaskConical size={24} />
              </div>
              <div className="km-category-label">
                {language === "hi" ? "मृदा जांच" : "Soil Lab"}
              </div>
              <div className="km-category-sublabel">PyTorch NPK & pH</div>
            </div>

            {/* Tool 2: Crop Doctor */}
            <div className="km-category-card" onClick={() => navigate("/solution")}>
              <div className="km-category-icon-box">
                <Stethoscope size={24} />
              </div>
              <div className="km-category-label">
                {language === "hi" ? "फसल डॉक्टर" : "Crop Doctor"}
              </div>
              <div className="km-category-sublabel">Leaf Pest & Blight</div>
            </div>

            {/* Tool 3: Live Mandi */}
            <div className="km-category-card" onClick={() => navigate("/mandi")}>
              <div className="km-category-icon-box">
                <TrendingUp size={24} />
              </div>
              <div className="km-category-label">
                {language === "hi" ? "मंडी भाव" : "Mandi Rates"}
              </div>
              <div className="km-category-sublabel">Live MSP & Profit</div>
            </div>

            {/* Tool 4: Cultivation Tracker */}
            <div className="km-category-card" onClick={() => navigate("/cultivation-tracker")}>
              <div className="km-category-icon-box">
                <Calendar size={24} />
              </div>
              <div className="km-category-label">
                {language === "hi" ? "फसल कैलेंडर" : "Crop Tracker"}
              </div>
              <div className="km-category-sublabel">Stage Milestones</div>
            </div>
          </div>
        </section>

        {/* 5. TODAY'S LIVE APMC MANDI BENCHMARKS */}
        <section aria-label="Mandi Rates">
          <div className="km-section-title-row">
            <h2 className="km-section-title">
              {language === "hi" ? "आज के प्रमुख थोक मंडी भाव" : "Today's Live Mandi Highlights"}
            </h2>
            <span className="km-section-link" onClick={() => navigate("/mandi")}>
              All Mandis <ArrowUpRight size={14} />
            </span>
          </div>

          <div className="km-mandi-scroll-strip">
            {mandiHighlights.map((item, idx) => (
              <div key={idx} className="km-mandi-tile" onClick={() => navigate("/mandi")}>
                <div className="km-mandi-tile-header">
                  <div>
                    <h3 className="km-mandi-crop-name">
                      {item.icon} {item.crop}
                    </h3>
                    <div className="km-mandi-place">{item.mandi}</div>
                  </div>
                  <span className="km-badge km-badge-emerald">{item.mspDelta}</span>
                </div>

                <div className="km-mandi-price-row">
                  <span className="km-mandi-price-val">{item.price}</span>
                  <span className="km-mandi-unit">{item.unit}</span>
                </div>

                <div className="km-mandi-tile-footer">
                  <span style={{ color: "#6B7280" }}>{item.place}</span>
                  <span style={{ color: "#0D5C3A", fontWeight: 600 }}>Compare →</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. FIELD NOTES & AGRO-ADVISORIES (SCREEN 3 MATCH) */}
        <section aria-label="Field Notes">
          <div className="km-section-title-row">
            <h2 className="km-section-title">
              {language === "hi" ? "खेत सलाह एवं दैनिक डायरी" : "Field Notes & Agro-Advisories"}
            </h2>
            <span className="km-section-link" onClick={() => navigate("/call")}>
              Krishi Sathi <ChevronRight size={14} />
            </span>
          </div>

          <div className="km-notes-card">
            <div className="km-notes-list">
              {activityNotes.map((note) => (
                <div key={note.id} className="km-note-item">
                  <img src={note.thumb} alt={note.title} className="km-note-thumb" />
                  <div className="km-note-content">
                    <div className="km-note-timestamp">{note.timestamp}</div>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, margin: "0 0 4px 0", color: "#111827" }}>
                      {note.title}
                    </h4>
                    <p className="km-note-desc">{note.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Wide Pill Action Button (Matches Screen 2 & 3 CTA) */}
            <div className="km-bottom-action-bar">
              <button className="km-pill-btn-wide" onClick={() => navigate("/call")}>
                <PhoneCall size={18} />
                <span>
                  {language === "hi"
                    ? "कृषि साथी से मुफ्त सलाह लें"
                    : language === "or"
                    ? "କୃଷି ସାଥୀଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ"
                    : "Speak with Krishi Sathi AI"}
                </span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* 7. DOCKED BOTTOM NAVIGATION BAR (MATCHES SCREEN 1) */}
      <BottomNav />
    </div>
  );
}
