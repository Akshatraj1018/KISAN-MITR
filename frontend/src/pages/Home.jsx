// src/pages/Home.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sprout, PhoneCall, ScanLine, TrendingUp, Sparkles, 
  ArrowRight, ShieldCheck, Globe, Wifi, WifiOff 
} from "lucide-react";
import "./Home.css";
import { useLanguage } from "../context/LanguageContext";
import kisanMitrLogo from "../assets/kisanmitr_logo.jpg";

function Home() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();

  return (
    <div className="km-home-root">
      {/* Background Ambience */}
      <div className="km-home-overlay" />
      <div className="km-home-glow glow-top" />
      <div className="km-home-glow glow-bottom" />

      {/* Top Navigation */}
      <header className="km-home-navbar">
        <div className="km-home-brand">
          <div className="km-home-logo-icon" style={{ background: "transparent", padding: 0 }}>
            <img src={kisanMitrLogo} alt="Kisan Mitr" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid #34d399" }} />
          </div>
          <div>
            <span className="km-home-title-brand">KISAN MITRA</span>
            <span className="km-home-tagline">किसान मित्र • AI 2.0</span>
          </div>
        </div>

        <div className="km-home-nav-actions">
          {/* Language Selector */}
          <div className="km-home-lang-pill">
            <Globe size={14} />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
              <option value="bn">বাংলা</option>
            </select>
          </div>

          <Link to="/login" className="km-home-login-link">
            Farmer Sign In
          </Link>
        </div>
      </header>

      {/* Hero Content */}
      <main className="km-home-main">
        <div className="km-hero-card">
          {/* Badge */}
          <div className="km-national-badge">
            <Sparkles size={14} />
            <span>Innovathon 2.0 • Team Loop • NIT Rourkela</span>
          </div>

          {/* Main Title */}
          <h1 className="km-hero-heading">
            Next-Gen Agricultural Intelligence for <span className="km-text-gradient">Indian Farmers</span>
          </h1>

          <p className="km-hero-subtitle">
            Combines edge-first PyTorch Computer Vision, real-time APMC Mandi price discovery, 
            and Kisan Mitra’s 24x7 voice advisory helpline — fully functional even with zero internet.
          </p>

          {/* Quick Pillars */}
          <div className="km-hero-pillars">
            <div className="km-pillar-item">
              <ScanLine size={18} className="pillar-icon" />
              <span>Soil CNN Vision</span>
            </div>
            <div className="km-pillar-item">
              <PhoneCall size={18} className="pillar-icon" />
              <span>Kisan Mitra Voice AI</span>
            </div>
            <div className="km-pillar-item">
              <TrendingUp size={18} className="pillar-icon" />
              <span>APMC Live Mandi</span>
            </div>
            <div className="km-pillar-item">
              <WifiOff size={18} className="pillar-icon" />
              <span>100% Offline Edge</span>
            </div>
          </div>

          {/* Main CTAs */}
          <div className="km-hero-actions">
            <Link to="/dashboard" className="km-hero-primary-btn">
              <span>Enter Farm Console</span>
              <ArrowRight size={18} />
            </Link>

            <Link to="/call" className="km-hero-secondary-btn">
              <PhoneCall size={18} />
              <span>Talk to Kisan Mitra</span>
            </Link>
          </div>

          {/* Trust Footer */}
          <div className="km-hero-trust-tag">
            <ShieldCheck size={16} />
            <span>ICAR & PAU Certified Agronomic Guidelines • Hybrid Cloud & Local Ollama</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
