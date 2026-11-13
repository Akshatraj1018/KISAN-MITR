// src/pages/MainDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Bell,
  Settings,
  MapPin,
  Sun,
  Wind,
  Droplets,
  CloudRain,
  IndianRupee,
  FlaskConical,
  Sprout,
  User,
  Globe,
  Info,
  Camera,
  Mic,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  PhoneCall,
  Sparkles,
  Layers,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  UploadCloud,
  ArrowUpRight,
  Building2,
  ChevronRight,
  Clock,
  Play,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/MainDashboard.css";
import { useLanguage } from "../context/LanguageContext";
import {
  getActiveCultivation,
  startCultivationProject,
  CULTIVATION_BLUEPRINTS,
} from "../utils/cultivationTracker";
import kisanMitrLogo from "../assets/kisanmitr_logo.jpg";

// Regional Soil Intelligence Profiles by District
const DISTRICT_SOIL_DATA = {
  "Rourkela, Sundargarh": {
    name: "Red & Laterite Loam (लाल और लैटेराइट दोमट)",
    ph: "6.2 (Optimal for Cereals)",
    moisture: "68% (Adequate)",
    organicCarbon: "0.58% (Medium)",
    nitrogen: "Medium (265 kg/ha)",
    phosphorus: "Low (14 kg/ha - Add DAP)",
    potassium: "Adequate (310 kg/ha)",
    description: "Well-drained porous loam with high iron and aluminum content. Highly responsive to phosphorus application and organic matter incorporation.",
    recommendedCrops: ["Wheat", "Mustard", "Paddy", "Potato"],
  },
};

// 3-Day Mandi Price Dataset
const initialMandiData = [
  {
    crop: "Wheat (गेहूं)",
    icon: "🌾",
    category: "Cereals",
    mandi: "Khanna / Rourkela",
    todayPrice: 2425,
    yesterdayPrice: 2380,
    twoDaysAgoPrice: 2350,
    unit: "₹/q",
    change: "+₹45 (+1.9%)",
    trend: "up",
    arrivals: "1,240 Quintals",
  },
  {
    crop: "Paddy Swarna (धान)",
    icon: "🍚",
    category: "Cereals",
    mandi: "Bargarh / Rourkela",
    todayPrice: 2183,
    yesterdayPrice: 2170,
    twoDaysAgoPrice: 2190,
    unit: "₹/q",
    change: "+₹13 (+0.6%)",
    trend: "up",
    arrivals: "3,150 Quintals",
  },
  {
    crop: "Mustard (सरसों)",
    icon: "🟡",
    category: "Oilseeds",
    mandi: "Bharatpur / Alwar",
    todayPrice: 5120,
    yesterdayPrice: 5160,
    twoDaysAgoPrice: 5200,
    unit: "₹/q",
    change: "-₹40 (-0.8%)",
    trend: "down",
    arrivals: "820 Quintals",
  },
  {
    crop: "Potato (आलू)",
    icon: "🥔",
    category: "Vegetables",
    mandi: "Agra / Azadpur",
    todayPrice: 1450,
    yesterdayPrice: 1400,
    twoDaysAgoPrice: 1360,
    unit: "₹/q",
    change: "+₹50 (+3.6%)",
    trend: "up",
    arrivals: "4,600 Quintals",
  },
  {
    crop: "Tomato (टमाटर)",
    icon: "🍅",
    category: "Vegetables",
    mandi: "Kolar / Azadpur",
    todayPrice: 1850,
    yesterdayPrice: 1890,
    twoDaysAgoPrice: 1950,
    unit: "₹/q",
    change: "-₹40 (-2.1%)",
    trend: "down",
    arrivals: "2,100 Quintals",
  },
];

export default function MainDashboard() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [mandiFilter, setMandiFilter] = useState("All");

  // Selected crop for cultivation blueprint on Home
  const [selectedCropKey, setSelectedCropKey] = useState("Wheat");
  const [activeProject, setActiveProject] = useState(null);

  // Farmer Information
  const farmerName = localStorage.getItem("farmerName") || "Rameshwar Singh";
  const farmerVillage = localStorage.getItem("farmerLocation") || "Rourkela, Sundargarh";

  const currentSoil = DISTRICT_SOIL_DATA["Rourkela, Sundargarh"];
  const cropBlueprint = CULTIVATION_BLUEPRINTS[selectedCropKey] || CULTIVATION_BLUEPRINTS.Wheat;

  useEffect(() => {
    const proj = getActiveCultivation();
    setActiveProject(proj);
  }, []);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const filteredMandi = initialMandiData.filter((item) =>
    mandiFilter === "All" ? true : item.category === mandiFilter
  );

  const handleStartCultivation = () => {
    const proj = startCultivationProject(selectedCropKey, "Plot 1 (Main Field)", "2.5 Acres");
    setActiveProject(proj);
    navigate("/cultivation-tracker");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <div className="km-dashboard">
      {/* ================= TOPBAR ================= */}
      <header className="km-topbar">
        <div className="km-brand" onClick={() => navigate("/dashboard")}>
          <div className="km-brand-logo" style={{ background: "transparent", padding: 0 }}>
            <img src={kisanMitrLogo} alt="Kisan Mitr" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover", border: "2px solid #60A5FA" }} />
          </div>
          <div className="km-brand-text">
            <div className="km-brand-title">
              Kisan Mitr
              <span className="km-brand-badge" style={{ background: "#EFF6FF", color: "#1D4ED8", borderColor: "#BFDBFE", fontWeight: 700 }}>Innovathon 2.0</span>
            </div>
            <span className="km-brand-subtitle">AI Agricultural Operating System</span>
          </div>
        </div>

        {/* Navigation Pills */}
        <nav className="km-nav-pill-group">
          <button className={`km-nav-btn ${isActive("/dashboard")}`} onClick={() => navigate("/dashboard")}>
            <Sun />
            <span>Home</span>
          </button>
          <button className={`km-nav-btn ${isActive("/soil")}`} onClick={() => navigate("/soil")}>
            <FlaskConical />
            <span>Soil Lab</span>
          </button>
          <button className={`km-nav-btn ${isActive("/cultivation-tracker")}`} onClick={() => navigate("/cultivation-tracker")}>
            <Sprout />
            <span>Cultivation Tracker</span>
          </button>
          <button className={`km-nav-btn ${isActive("/mandi")}`} onClick={() => navigate("/mandi")}>
            <IndianRupee />
            <span>Mandi Rates</span>
          </button>
          <button className={`km-nav-btn ${isActive("/solution")}`} onClick={() => navigate("/solution")}>
            <span style={{ fontSize: 14 }}>🌿</span>
            <span>Crop Doctor</span>
          </button>
          <button className={`km-nav-btn ${isActive("/language")}`} onClick={() => navigate("/language")}>
            <Globe />
            <span>Language</span>
          </button>
        </nav>

        {/* Topbar Right Tools: Farmer Profile Badge */}
        <div className="km-topbar-tools">
          <div className="km-farmer-badge" onClick={() => setSheetOpen(true)}>
            <div className="km-farmer-avatar">{farmerName.charAt(0)}</div>
            <div className="km-farmer-meta">
              <span className="km-farmer-name">{farmerName}</span>
              <span className="km-farmer-loc">{farmerVillage}</span>
            </div>
            <ChevronRight style={{ width: 14, height: 14, color: "#94a3b8" }} />
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="km-container">
        {/* 1. HERO COCKPIT: Merged Greeting with Compact Voice Block beside Namaste & Live Pulse Badges */}
        <section className="km-hero-cockpit">
          <div>
            <div className="km-greeting-row">
              <h1 className="km-greeting-title">
                🌾 <span>Namaste,</span> <span className="name">{farmerName}!</span>
              </h1>

              {/* Compact Krishi Sathi AI Voice Block right beside Namaste */}
              <div
                className="km-voice-hero-inline"
                onClick={() => navigate("/call")}
                title="Speak to Krishi Sathi AI Voice Agronomist"
              >
                <div className="km-voice-avatar-mini" style={{ background: "radial-gradient(circle at 35% 30%, #60A5FA 0%, #1D4ED8 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                  🌾
                  <span className="km-online-dot"></span>
                </div>
                <div className="km-voice-inline-text">
                  <div className="km-voice-inline-title">
                    <span>Krishi Sathi AI</span>
                    <span className="km-voice-tag">Voice AI</span>
                  </div>
                  <span className="km-voice-inline-sub">Tap to Speak</span>
                </div>
                {/* Prominently Visible Animated Wavy Soundwave Bars */}
                <div className="km-soundwave-bars-mini">
                  <span className="km-wave-bar"></span>
                  <span className="km-wave-bar"></span>
                  <span className="km-wave-bar"></span>
                  <span className="km-wave-bar"></span>
                  <span className="km-wave-bar"></span>
                  <span className="km-wave-bar"></span>
                </div>
                <Mic style={{ width: 16, height: 16, color: "#38bdf8", marginLeft: 4 }} />
              </div>
            </div>

            <div className="km-greeting-meta">
              <span className="km-meta-chip">
                <Calendar /> {today}
              </span>
              <span className="km-meta-chip">
                <MapPin /> {farmerVillage}
              </span>
              <span className="km-meta-chip">
                <Layers /> Season: <strong>Kharif / Rabi 2026</strong>
              </span>
            </div>
          </div>

          <div className="km-cockpit-pulses">
            {activeProject ? (
              <div
                className="km-pulse-pill optimal"
                style={{ cursor: "pointer", border: "1px solid #2563EB" }}
                onClick={() => navigate("/cultivation-tracker")}
              >
                <span className="km-pulse-icon">🌱</span>
                <div>
                  <div className="km-pulse-label">Active Cultivation</div>
                  <div className="km-pulse-val" style={{ color: "#60A5FA" }}>
                    {activeProject.cropName} ({activeProject.progressPercent}% Done)
                  </div>
                </div>
              </div>
            ) : (
              <div className="km-pulse-pill optimal">
                <span className="km-pulse-icon">💧</span>
                <div>
                  <div className="km-pulse-label">Soil Moisture</div>
                  <div className="km-pulse-val">68% (Adequate)</div>
                </div>
              </div>
            )}

            <div className="km-pulse-pill optimal">
              <span className="km-pulse-icon">🌾</span>
              <div>
                <div className="km-pulse-label">Active Plots</div>
                <div className="km-pulse-val">2 Fields (3.7 Acres)</div>
              </div>
            </div>

            <div className="km-pulse-pill optimal">
              <span className="km-pulse-icon">📈</span>
              <div>
                <div className="km-pulse-label">Top Commodity</div>
                <div className="km-pulse-val">Wheat ₹2,425/q (+1.9%)</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. DUAL ACTION COCKPIT: 🌦️ Weather Station & 🧪 Soil Analysis Rectangle Tab */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            marginBottom: 28,
          }}
        >
          {/* Card A: 🌦️ Agro-Weather & Spray Safety Station */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span className="km-brand-badge" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", borderColor: "rgba(56, 189, 248, 0.3)" }}>
                  🌦️ Micro-Climate Radar
                </span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  📍 {farmerVillage}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                <div style={{ fontSize: 44 }}>⛅</div>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
                    26°C
                  </div>
                  <div style={{ fontSize: 13, color: "#38bdf8", fontWeight: 700, marginTop: 4 }}>
                    Partly Cloudy • Low Rain Risk
                  </div>
                </div>
              </div>

              {/* Weather Stats Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)",
                  borderRadius: 14,
                  padding: "12px 14px",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>HUMIDITY</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>64%</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>RAIN CHANCE</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#60A5FA", marginTop: 2 }}>15%</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>WIND SPEED</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>9 km/h</div>
                </div>
              </div>

              {/* Spray Advisory Banner */}
              <div
                style={{
                  background: "#EFF6FF",
                  border: "1px solid #BFDBFE",
                  borderRadius: 12,
                  padding: "10px 14px",
                  fontSize: 12,
                  color: "#1D4ED8",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 18,
                }}
              >
                <span>✅</span>
                <span><strong>Safe Spray Window Active:</strong> Next 48 hours optimal for foliar nutrient & bio-pesticide sprays.</span>
              </div>
            </div>

            <button
              className="km-btn-doc secondary"
              style={{
                width: "100%",
                background: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.35)",
                color: "#e0f2fe",
                padding: "12px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
              onClick={() => navigate("/weather")}
            >
              <span>View 7-Day Forecast & Spray Radar</span>
              <ChevronRight style={{ width: 15, height: 15 }} />
            </button>
          </div>

          {/* Card B: 🧪 Soil Analysis Rectangle Tab */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: 20,
              padding: 24,
              boxShadow: "0 4px 20px -2px rgba(15, 23, 42, 0.06)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
            onClick={() => navigate("/soil")}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <span className="km-brand-badge" style={{ background: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE", fontWeight: 700 }}>
                  🧪 Soil Health Card Radar
                </span>
                <span style={{ fontSize: 12, color: "#60A5FA", fontWeight: 700 }}>
                  ● GPS Verified
                </span>
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>CURRENT DETECTED CLASSIFICATION:</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>
                  {currentSoil.name}
                </div>
              </div>

              {/* Quick Soil KPI Strip */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 10,
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.02)",
                  borderRadius: 14,
                  padding: "12px 14px",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>SOIL pH</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#60A5FA", marginTop: 2 }}>{currentSoil.ph}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>MOISTURE</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#f59e0b", marginTop: 2 }}>{currentSoil.moisture}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>ORG. CARBON</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#38bdf8", marginTop: 2 }}>{currentSoil.organicCarbon}</div>
                </div>
              </div>

              {/* Recommended Crops Preview Chips */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700, marginBottom: 8 }}>
                  HIGH-ROI RECOMMENDED CROPS FOR THIS SOIL:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <span style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "#0F172A", fontWeight: 700 }}>
                    🌾 Wheat (96%)
                  </span>
                  <span style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "#0F172A", fontWeight: 700 }}>
                    🟡 Mustard (92%)
                  </span>
                  <span style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "#0F172A", fontWeight: 700 }}>
                    🍚 Paddy (88%)
                  </span>
                  <span style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: 8, padding: "4px 10px", fontSize: 12, color: "#0F172A", fontWeight: 700 }}>
                    🥔 Potato (85%)
                  </span>
                </div>
              </div>
            </div>

            <button
              className="km-btn-doc primary"
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)",
                border: "none",
                color: "#0F172A",
                padding: "12px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 4px 16px #BFDBFE",
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate("/soil");
              }}
            >
              <FlaskConical style={{ width: 16, height: 16 }} />
              <span>Open Soil Lab & View Recommended Crops</span>
              <ChevronRight style={{ width: 15, height: 15 }} />
            </button>
          </div>
        </section>

        {/* 3. RESTRUCTURED APMC LIVE MANDI SECTION */}
        <section className="km-mandi-section">
          <div className="km-section-header">
            <div className="km-section-title-wrap">
              <h3>
                <IndianRupee style={{ color: "#f59e0b" }} /> APMC Live Mandi Intelligence & 3-Day Price Trend
              </h3>
              <p>Real-time verified e-NAM daily rates with past 2-day historical price movement across top hubs.</p>
            </div>

            <div className="km-mandi-filter-chips">
              {["All", "Cereals", "Oilseeds", "Vegetables"].map((filter) => (
                <button
                  key={filter}
                  className={`km-chip ${mandiFilter === filter ? "active" : ""}`}
                  onClick={() => setMandiFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="km-table-wrapper">
            <table className="km-mandi-table">
              <thead>
                <tr>
                  <th>Crop / Commodity</th>
                  <th>Primary Mandi Hub</th>
                  <th>Today's Live Rate</th>
                  <th>Yesterday</th>
                  <th>2 Days Ago</th>
                  <th>3-Day Price Trend</th>
                  <th>Daily Arrivals</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMandi.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="km-crop-cell">
                        <div className="km-crop-icon-chip">{item.icon}</div>
                        <div>
                          <div style={{ fontWeight: 800 }}>{item.crop}</div>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>{item.category}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#cbd5e1" }}>
                        <Building2 style={{ width: 13, height: 13, color: "#f59e0b" }} />
                        {item.mandi}
                      </div>
                    </td>
                    <td>
                      <div className="km-price-today">
                        ₹{item.todayPrice} <span style={{ fontSize: 12, color: "#94a3b8" }}>{item.unit}</span>
                      </div>
                    </td>
                    <td>
                      <span className="km-price-history">₹{item.yesterdayPrice}</span>
                    </td>
                    <td>
                      <span className="km-price-history">₹{item.twoDaysAgoPrice}</span>
                    </td>
                    <td>
                      <span className={`km-trend-badge ${item.trend}`}>
                        {item.trend === "up" && <TrendingUp style={{ width: 13, height: 13 }} />}
                        {item.trend === "down" && <TrendingDown style={{ width: 13, height: 13 }} />}
                        {item.change}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{item.arrivals}</span>
                    </td>
                    <td>
                      <button
                        className="km-btn-hero-secondary"
                        style={{ padding: "6px 12px", fontSize: 12 }}
                        onClick={() => navigate("/mandi")}
                      >
                        Trade Calc <ArrowUpRight style={{ width: 13, height: 13 }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              ⚡ Rates verified directly from Agricultural Produce Market Committees (e-NAM Gov).
            </span>
            <button className="km-btn-hero-primary green" style={{ minWidth: 260 }} onClick={() => navigate("/mandi")}>
              <span>Explore All 150+ Mandis & Freight Calculator ➔</span>
            </button>
          </div>
        </section>

        {/* 4. KISAN MITRA AI VOICE HELPLINE & CROP DOCTOR QUICK LAUNCH (Compact & Aligned) */}
        <section className="km-hero-actions-grid" style={{ marginBottom: 28 }}>
          {/* Card A: 🎙️ Kisan Mitra Voice AI (Compact with Wavy Soundwave) */}
          <div className="km-action-hero-card voice-card">
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span className="km-hero-card-badge voice-badge">
                  <Sparkles style={{ width: 12, height: 12 }} /> 24x7 Multilingual Voice AI
                </span>
                <span style={{ fontSize: 11, color: "#38bdf8", fontWeight: 700 }}>● Instant Audio Reply</span>
              </div>
              <h2>Krishi Sathi Voice AI</h2>
              <p>Speak naturally in your native language for immediate crop diagnostics, spray dosages, and weather guidance.</p>

              <div className="km-voice-soundwave-box">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="km-voice-avatar-ring" style={{ background: "radial-gradient(circle at 35% 30%, #60A5FA 0%, #1D4ED8 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", borderRadius: "50%", width: 44, height: 44 }}>
                    🌾
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "white" }}>Krishi Sathi AI (Online)</div>
                    <div style={{ fontSize: 11, color: "#38bdf8" }}>Hindi • Odia • Bengali • English</div>
                  </div>
                </div>

                {/* Animated Wavy Soundwave */}
                <div className="km-soundwave-bars">
                  <div className="km-wave-bar"></div>
                  <div className="km-wave-bar"></div>
                  <div className="km-wave-bar"></div>
                  <div className="km-wave-bar"></div>
                  <div className="km-wave-bar"></div>
                  <div className="km-wave-bar"></div>
                </div>
              </div>
            </div>

            <button
              className="km-btn-hero-primary blue"
              style={{ width: "100%", padding: "12px 18px", borderRadius: 12 }}
              onClick={() => navigate("/call")}
            >
              <Mic style={{ width: 17, height: 17 }} />
              <span>Tap to Speak with Krishi Sathi AI (Voice Call) ➔</span>
            </button>
          </div>

          {/* Card B: 🌿 AI Crop Doctor Quick Launch (Compact & Aligned) */}
          <div className="km-action-hero-card vision-card">
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span className="km-hero-card-badge vision-badge">
                  <Sparkles style={{ width: 12, height: 12 }} /> 48+ Plant Pathogens • ICAR
                </span>
                <span style={{ fontSize: 11, color: "#60A5FA", fontWeight: 700 }}>● Vision Diagnostic Core</span>
              </div>
              <h2>AI Crop Doctor & Disease Clinic</h2>
              <p>Got yellowing leaves or pest damage? Photograph diseased foliage to get certified chemical & organic prescriptions.</p>

              <div className="km-viewfinder-preview">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="km-viewfinder-icon">🌿</div>
                  <div className="km-viewfinder-specs">
                    <span className="title">Foliar Vision Diagnostic Core</span>
                    <span className="sub">Blight • Rust • Blast • Aphids</span>
                  </div>
                </div>
                <span className="km-brand-badge" style={{ background: "#EFF6FF" }}>
                  Instant Remedy
                </span>
              </div>
            </div>

            <button
              className="km-btn-hero-primary green"
              style={{ width: "100%", padding: "12px 18px", borderRadius: 12 }}
              onClick={() => navigate("/solution")}
            >
              <Camera style={{ width: 17, height: 17 }} />
              <span>Open AI Crop Doctor & Diagnose Foliage ➔</span>
            </button>
          </div>
        </section>
      </main>

      {/* ================= SETTINGS & PROFILE DRAWER ================= */}
      {sheetOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(6px)",
            zIndex: 2000,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setSheetOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 380,
              height: "100%",
              background: "#FFFFFF", border: "1px solid #E2E8F0", color: "#0F172A",
              borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
              padding: 24,
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "-10px 0 35px rgba(0,0,0,0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ margin: 0, color: "#0F172A", fontSize: 18, fontWeight: 800 }}>Account & Settings</h3>
                <button
                  style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 18 }}
                  onClick={() => setSheetOpen(false)}
                >
                  ✕
                </button>
              </div>

              {/* Profile Card */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 16,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.08)",
                  marginBottom: 20,
                  cursor: "pointer",
                }}
                onClick={() => navigate("/profile")}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    color: "#0F172A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 18,
                  }}
                >
                  {farmerName.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: "white", fontSize: 15 }}>{farmerName}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{farmerVillage}</div>
                  <div style={{ fontSize: 11, color: "#60A5FA", fontWeight: 700, marginTop: 2 }}>● Verified Farmer</div>
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  className="km-btn-hero-secondary"
                  style={{ justifyContent: "flex-start", width: "100%", padding: "12px 16px" }}
                  onClick={() => navigate("/farmer-profile")}
                >
                  <User style={{ width: 16, height: 16, color: "#2563EB" }} />
                  <span>Farmer Profile</span>
                </button>
                <button
                  className="km-btn-hero-secondary"
                  style={{ justifyContent: "flex-start", width: "100%", padding: "12px 16px" }}
                  onClick={() => navigate("/cultivation-tracker")}
                >
                  <Sprout style={{ width: 16, height: 16, color: "#60A5FA" }} />
                  <span>Cultivation Lifecycle Tracker</span>
                </button>
                <button
                  className="km-btn-hero-secondary"
                  style={{ justifyContent: "flex-start", width: "100%", padding: "12px 16px" }}
                  onClick={() => navigate("/language")}
                >
                  <Globe style={{ width: 16, height: 16, color: "#38bdf8" }} />
                  <span>Language Selection (12 Native)</span>
                </button>
                <button
                  className="km-btn-hero-secondary"
                  style={{ justifyContent: "flex-start", width: "100%", padding: "12px 16px" }}
                  onClick={() => navigate("/about")}
                >
                  <Info style={{ width: 16, height: 16, color: "#94a3b8" }} />
                  <span>About Kisan Mitra</span>
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <button
              className="km-btn-hero-secondary"
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                borderColor: "rgba(239, 68, 68, 0.3)",
                color: "#f87171",
                width: "100%",
                padding: "12px 16px",
              }}
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                navigate("/login");
              }}
            >
              <span>Sign Out of Account</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= NATIVE MOBILE BOTTOM NAVIGATION BAR ================= */}
      <nav className="km-mobile-bottom-bar" aria-label="Mobile Navigation">
        <button
          className={`km-mob-nav-btn ${isActive("/dashboard")}`}
          onClick={() => navigate("/dashboard")}
          aria-label="Home Dashboard"
        >
          <Sun size={20} />
          <span>Home</span>
        </button>
        <button
          className={`km-mob-nav-btn ${isActive("/soil")}`}
          onClick={() => navigate("/soil")}
          aria-label="Soil Lab"
        >
          <FlaskConical size={20} />
          <span>Soil Lab</span>
        </button>
        <button
          className={`km-mob-nav-btn ${isActive("/cultivation-tracker")}`}
          onClick={() => navigate("/cultivation-tracker")}
          aria-label="Cultivation Tracker"
        >
          <Sprout size={20} />
          <span>Tracker</span>
        </button>
        <button
          className={`km-mob-nav-btn ${isActive("/mandi")}`}
          onClick={() => navigate("/mandi")}
          aria-label="Mandi Rates"
        >
          <IndianRupee size={20} />
          <span>Mandi</span>
        </button>
        <button
          className={`km-mob-nav-btn ${isActive("/solution")}`}
          onClick={() => navigate("/solution")}
          aria-label="Crop Doctor"
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>🌿</span>
          <span>Doctor</span>
        </button>
      </nav>
    </div>
  );
}
