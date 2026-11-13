// src/pages/AboutUs.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles, Award, ShieldCheck, HeartHandshake, PhoneCall, Globe } from "lucide-react";
import "../styles/AboutUs.css";

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="km-about-page">
      <div className="km-about-container">
        {/* Navigation Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <button
            className="km-doc-nav-back"
            onClick={() => navigate("/dashboard")}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "9999px",
              padding: "10px 18px",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 8,
              cursor: "pointer",
            }}
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            <span>Dashboard</span>
          </button>

          <span style={{ fontSize: 13, color: "#94a3b8" }}>Smart India Hackathon (SIH) Finalist Edition</span>
        </div>

        {/* Hero Showcase */}
        <div className="km-about-hero-box">
          <div className="km-about-badge">
            <Award style={{ width: 14, height: 14 }} />
            <span>Smart India Hackathon Finale</span>
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 800, color: "white", margin: "0 0 12px 0", letterSpacing: "-0.02em" }}>
            KISAN MITRA (किसान मित्र)
          </h1>
          <p style={{ maxWidth: 720, margin: "0 auto 24px auto", color: "#cbd5e1", fontSize: 15, lineHeight: 1.6 }}>
            Next-Gen Edge-First AI Agricultural Operating System for Indian Farmers. Combining PyTorch Computer Vision, ICAR-PAU agronomic intelligence, and 24x7 multilingual voice helplines for 100% offline remote rural operations.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <span className="km-brand-badge">PyTorch CNN Vision</span>
            <span className="km-brand-badge">Kisan Mitra Bilingual Voice AI</span>
            <span className="km-brand-badge">e-NAM Live Mandi Rates</span>
            <span className="km-brand-badge">100% Offline Edge Inference</span>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="km-about-pillars-grid">
          <div className="km-pillar-card">
            <div className="km-pillar-icon">🌿</div>
            <h3 className="km-pillar-title">Plant Pathology Doctor</h3>
            <p className="km-pillar-desc">
              Multi-modal AI vision identifies 48+ crop diseases from smartphone camera photos and prescribes exact chemical and bio-pesticide spray dosages.
            </p>
          </div>

          <div className="km-pillar-card">
            <div className="km-pillar-icon">🧪</div>
            <h3 className="km-pillar-title">Soil Fertility CNN Lab</h3>
            <p className="km-pillar-desc">
              Instant on-device soil classification (Alluvial, Black, Red Loam, Sandy) with N-P-K nutrient radars and certified seed variety recommendations.
            </p>
          </div>

          <div className="km-pillar-card">
            <div className="km-pillar-icon">🎙️</div>
            <h3 className="km-pillar-title">24x7 Kisan Mitra Voice Helpline</h3>
            <p className="km-pillar-desc">
              Conversational voice agronomist supporting Hindi, Punjabi, Bengali, Marathi, and English with dynamic mid-sentence language switching.
            </p>
          </div>
        </div>

        {/* Contact & Hackathon Team Footer */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E2E8F0",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
            borderRadius: 18,
            padding: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontWeight: 800, color: "white", fontSize: 15 }}>Created & Engineered by Team BLACK SYNTEX</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>Toll-Free Helpline: 1800-KISAN-MITRA • contact@kisanmitra.gov.in</div>
          </div>

          <button
            className="km-btn-doc primary"
            style={{ borderRadius: 9999, padding: "10px 20px" }}
            onClick={() => navigate("/call")}
          >
            <PhoneCall style={{ width: 15, height: 15 }} />
            <span>Speak with AI Helpline</span>
          </button>
        </div>
      </div>
    </div>
  );
}
