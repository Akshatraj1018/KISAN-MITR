import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/kisanmitr_logo.jpg";
import "../styles/LanguageSelect.css";

export default function GetStarted() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="lang-page">
      <div className="lang-header">
        <img src={logo} alt="App Logo" className="app-logo" style={{ width: 110, height: 110, borderRadius: "50%", objectFit: "cover", border: "3px solid #60A5FA", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }} />
        <h1 className="app-title">{t ? t("appName") : "Kisan Mitra"}</h1>
      </div>

      <div className="lang-content">
        <div className="lang-card-container">
          <div className="lang-title">
            <h2>{t ? t("welcomeTitle") : "Welcome to Kisan Mitra"}</h2>
            <p>{t ? t("welcomeDesc") : "A farmer's digital companion."}</p>
          </div>

          <button
            className="lang-btn active"
            onClick={() => navigate("/language")}
          >
            {t ? t("getStartedBtn") : "Get Started"}
          </button>

          <p className="lang-help-text">{t ? t("helpText") : ""}</p>
        </div>
      </div>

      <div className="lang-footer">{t ? t("footerText") : "Kisan Mitra"}</div>
    </div>
  );
}
