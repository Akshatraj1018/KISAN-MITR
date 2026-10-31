// src/pages/LanguageSelect.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Globe, Sparkles } from "lucide-react";
import { useLanguage, ALL_INDIAN_LANGUAGES } from "../context/LanguageContext";
import "../styles/LanguageSelect.css";

export default function LanguageSelect() {
  const { language, setLanguage, t } = useLanguage();
  const [selectedLang, setSelectedLang] = useState(language || "hi");
  const navigate = useNavigate();

  const handleSelect = (code) => {
    setSelectedLang(code);
    setLanguage(code);
  };

  const handleConfirm = () => {
    setLanguage(selectedLang);
    navigate("/dashboard");
  };

  return (
    <div className="km-lang-page">
      <div className="km-lang-shell">
        {/* Navigation Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
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
            <span>Back to Dashboard</span>
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#34d399", fontWeight: 700 }}>
            <Sparkles style={{ width: 14, height: 14 }} />
            <span>12 Official Native Languages</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="km-lang-hero">
          <h1>{t("chooseLang")}</h1>
          <p>{t("chooseLangDesc")}</p>
        </div>

        {/* 12-Language Grid */}
        <div className="km-lang-grid">
          {ALL_INDIAN_LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;

            return (
              <div
                key={lang.code}
                className={`km-lang-tile ${isSelected ? "active" : ""}`}
                onClick={() => handleSelect(lang.code)}
              >
                <div>
                  <div className="km-lang-native-name">{lang.native}</div>
                  <div className="km-lang-english-name">{lang.name}</div>
                  <div className="km-lang-region-tag">{lang.region}</div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                  <span className="km-lang-greeting-badge">{lang.greeting}</span>
                  {isSelected && (
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "#10b981",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check style={{ width: 14, height: 14, strokeWidth: 3 }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="km-lang-actions">
          <button
            className="km-btn-hero-primary green"
            style={{ minWidth: 280, padding: "16px 28px", fontSize: 16 }}
            onClick={handleConfirm}
          >
            <span>{t("continueBtn")}</span>
          </button>
        </div>

        <div style={{ textAlign: "center", color: "#64748b", fontSize: 13, marginTop: 24 }}>
          {t("footerText")}
        </div>
      </div>
    </div>
  );
}
