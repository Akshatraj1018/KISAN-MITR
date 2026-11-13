// src/pages/SoilResult.jsx
import React, { useRef, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import {
  ChevronDown,
  ChevronUp,
  Phone,
  Calendar,
  DollarSign,
  Sprout,
  Droplets,
  Info,
  Volume2,
  X,
  CheckCircle,
  ArrowLeft,
  Globe
} from "lucide-react";
import {
  CROP_DOSSIERS,
  getCropDossier,
  speakOfflineText,
  getDetailedSoilReport
} from "../utils/offlineAgronomy";
import { startCultivationProject } from "../utils/cultivationTracker";
import BottomNav from "../components/BottomNav";

const soilResultTexts = {
  en: {
    noResult: "No result found. Please scan again.",
    backToScan: "Go back to Scan",
    dashboard: "Dashboard",
    analysisComplete: "Soil Diagnostic Complete",
    summary: "Agronomic Summary",
    irrigationAdvice: "Irrigation & Moisture Advice",
    soilQuality: "Soil Quality & Classification",
    suitabilityFor: "Suitability for",
    recommendedCrops: "Recommended Crops & Market Value",
    fertilizerPlan: "Phase-wise Fertilizer Roadmap & Timeline",
    howToUse: "Nutrient Application Technique",
    tips: "Scientific Tips to Maximize Harvest",
    tapForSteps: "Tap for step-by-step roadmap ▼",
    hideSteps: "▲ Hide Steps",
    hideCrops: "▲ Hide Crops",
    askAiBtn: "📞 Ask Kisan Mitra Voice Assistant",
    landPrepTitle: "Land Preparation & Field Work",
    economicsTitle: "Crop Economics & Profit Forecast",
    stageTitle: "Phase & Timing",
    dosageTitle: "Dosage per Acre",
    actionTitle: "Action Required",
    offlineActive: "🟢 100% Offline Diagnostic Active (Zero Internet Required)",
    listenTitle: "Listen to Complete Audio Report",
    listenSub: "Soothing female specialist voice • 100% offline ready",
    listenBtn: "Listen",
    speaking: "Speaking...",
    seedRateLabel: "Seed Rate",
    sowingLabel: "Sowing Window",
    yieldLabel: "Estimated Yield",
    profitLabel: "Estimated Net Profit",
    viewDetails: "View Variety & Seed Codes ➔",
    certifiedBadge: "ICAR-PAU Certified Cultivar Roadmap",
    seedCodesTitle: "⭐ Certified High-Yield Varieties & Seed Codes:",
    seedTreatmentTitle: "⚖️ Seed Rate & Fungicide Treatment:",
    sowingTitle: "🗓️ Optimal Sowing Window & Method:",
    waterTitle: "💧 Critical Irrigation Phases:",
    profitTitle: "💰 Yield Forecast & Net Profit:",
    modalCallBtn: "📞 Call AI Helpline about this crop"
  },
  hi: {
    noResult: "कोई परिणाम नहीं मिला। कृपया दोबारा स्कैन करें।",
    backToScan: "स्कैन पर वापस जाएँ",
    dashboard: "डैशबोर्ड",
    analysisComplete: "मिट्टी विश्लेषण पूर्ण हुआ",
    summary: "वैज्ञानिक सारांश",
    irrigationAdvice: "सिंचाई संबंधी सलाह",
    soilQuality: "मिट्टी की गुणवत्ता",
    suitabilityFor: "के लिए उपयुक्तता",
    recommendedCrops: "अनुशंसित फसलें (उन्नत बीज व मुनाफा देखें)",
    fertilizerPlan: "उर्वरक समय-सारणी एवं संपूर्ण योजना",
    howToUse: "उर्वरक प्रयोग का सही तरीका",
    tips: "उपज बढ़ाने के वैज्ञानिक सुझाव",
    tapForSteps: "विस्तृत चरणबद्ध योजना देखें ▼",
    hideSteps: "▲ विवरण छिपाएं",
    hideCrops: "▲ फसल विवरण छिपाएं",
    askAiBtn: "📞 AI कृषि विशेषज्ञ से इस रिपोर्ट पर सीधे बात करें (हेल्पलाइन)",
    landPrepTitle: "खेत की तैयारी एवं जुताई विधि",
    economicsTitle: "फसल मुनाफा एवं उपज अनुमान",
    stageTitle: "समय व अवस्था",
    dosageTitle: "मात्रा प्रति एकड़",
    actionTitle: "ज़रूरी काम",
    offlineActive: "🟢 100% ऑफ़लाइन मोड सक्रिय (बिना इंटरनेट विश्लेषित)",
    listenTitle: "आवाज में पूरी रिपोर्ट सुनें",
    listenSub: "महिला विशेषज्ञ की आवाज • बिना इंटरनेट कभी भी",
    listenBtn: "सुनें",
    speaking: "बोल रहे हैं...",
    seedRateLabel: "बीज दर",
    sowingLabel: "बुवाई का समय",
    yieldLabel: "अनुमानित उपज",
    profitLabel: "शुद्ध मुनाफा",
    viewDetails: "किस्म व विस्तार देखें ➔",
    certifiedBadge: "ICAR प्रमाणित कृषि वैज्ञानिक कार्ययोजना",
    seedCodesTitle: "⭐ प्रमाणित उन्नत किस्म कोड (Seed Codes):",
    seedTreatmentTitle: "⚖️ बीज दर एवं फफूंदनाशक शोधन:",
    sowingTitle: "🗓️ बुवाई का सही समय व विधि:",
    waterTitle: "💧 सिंचाई के प्रमुख चरण:",
    profitTitle: "💰 अनुमानित पैदावार व शुद्ध मुनाफा:",
    modalCallBtn: "📞 AI कृषि विशेषज्ञ से इस फसल पर बात करें"
  },
  bn: {
    noResult: "কোন ফলাফল পাওয়া যায়নি। দয়া করে আবার স্ক্যান করুন।",
    backToScan: "স্ক্যানে ফিরে যান",
    dashboard: "ড্যাশবোর্ড",
    analysisComplete: "মাটি বিশ্লেষণ সম্পন্ন",
    summary: "সারাংশ",
    irrigationAdvice: "সেচের পরামর্শ",
    soilQuality: "মাটির গুণমান",
    suitabilityFor: "জন্য উপযোগিতা",
    recommendedCrops: "প্রস্তাবিত ফসল",
    fertilizerPlan: "সারের সময়সূচী ও বিস্তারিত পরিকল্পনা",
    howToUse: "প্রয়োগ পদ্ধতি",
    tips: "উৎপাদন বাড়ানোর টিপস",
    tapForSteps: "বিস্তারিত ধাপ দেখতে ক্লিক করুন ▼",
    hideSteps: "▲ ধাপ লুকান",
    hideCrops: "▲ ফসল লুকান",
    askAiBtn: "📞 AI কিষাণ মিত্রের সাথে কথা বলুন",
    landPrepTitle: "জমি প্রস্তুত প্রণালী",
    economicsTitle: "মুনাফা ও উৎপাদন হিসাব",
    stageTitle: "সময়",
    dosageTitle: "প্রয়োজনীয় মাত্রা",
    actionTitle: "করণীয়",
    offlineActive: "🟢 ১০০% অফলাইন মোড সক্রিয়",
    listenTitle: "সম্পূর্ণ রিপোর্ট শুনুন",
    listenSub: "মহিলা বিশেষজ্ঞ কণ্ঠ • ১০০% অফলাইন",
    listenBtn: "শুনুন",
    speaking: "বলছি...",
    seedRateLabel: "বীজের হার",
    sowingLabel: "বপন সময়",
    yieldLabel: "সম্ভাব্য উৎপাদন",
    profitLabel: "সম্ভাব্য মুনাফা",
    viewDetails: "জাত ও বীজ কোড দেখুন ➔",
    certifiedBadge: "ICAR প্রত্যয়িত পরিকল্পনা",
    seedCodesTitle: "⭐ উন্নত জাত ও বীজ কোড:",
    seedTreatmentTitle: "⚖️ বীজ হার ও শোধন:",
    sowingTitle: "🗓️ বপনের সঠিক সময় ও দূরত্ব:",
    waterTitle: "💧 প্রধান সেচ পর্যায়:",
    profitTitle: "💰 লাভ ও ফলন অনুমান:",
    modalCallBtn: "📞 ফসল নিয়ে কথা বলুন"
  },
  pa: {
    noResult: "ਕੋਈ ਨਤੀਜਾ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਮੁੜ ਸਕੈਨ ਕਰੋ।",
    backToScan: "ਸਕੈਨ ‘ਤੇ ਵਾਪਸ ਜਾਓ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    analysisComplete: "ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ ਹੋਇਆ",
    summary: "ਸਾਰ",
    irrigationAdvice: "ਸਿੰਚਾਈ ਸੰਬੰਧੀ ਸਲਾਹ",
    soilQuality: "ਮਿੱਟੀ ਦੀ ਗੁਣਵੱਤਾ",
    suitabilityFor: "ਲਈ ਉਚਿਤਤਾ",
    recommendedCrops: "ਸੁਝਾਈਆਂ ਗਈਆਂ ਫਸਲਾਂ",
    fertilizerPlan: "ਖਾਦ ਯੋਜਨਾ ਅਤੇ ਸਮਾਂ-ਸਾਰਣੀ",
    howToUse: "ਵਰਤੋਂ ਵਿਧੀ",
    tips: "ਉਪਜ ਵਧਾਉਣ ਲਈ ਟਿੱਪਸ",
    tapForSteps: "ਵਿਸਤ੍ਰਿਤ ਕਦਮ ਵੇਖੋ ▼",
    hideSteps: "▲ ਵੇਰਵਾ ਲੁਕਾਓ",
    hideCrops: "▲ ਫ਼ਸਲ ਵੇਰਵਾ ਲੁਕਾਓ",
    askAiBtn: "📞 AI ਕਿਸਾਨ ਮਿੱਤਰ ਨਾਲ ਗੱਲ ਕਰੋ (ਡਾ. ਨੀਰਜਾ)",
    landPrepTitle: "ਜ਼ਮੀਨ ਦੀ ਤਿਆਰੀ",
    economicsTitle: "ਮੁਨਾਫਾ ਅਤੇ ਝਾੜ",
    stageTitle: "ਸਮਾਂ",
    dosageTitle: "ਲੋੜੀਂਦੀ ਖੁਰਾਕ",
    actionTitle: "ਲੋੜੀਂਦਾ ਕੰਮ",
    offlineActive: "🟢 100% ਆਫ਼ਲਾਈਨ ਮੋਡ ਸਰਗਰਮ",
    listenTitle: "ਆਵਾਜ਼ ਵਿੱਚ ਰਿਪੋਰਟ ਸੁਣੋ",
    listenSub: "ਮਹਿਲਾ ਵਿਸ਼ੇਸ਼ਗਿਆਰ ਆਵਾਜ਼ • 100% ਆਫ਼ਲਾਈਨ",
    listenBtn: "ਸੁਣੋ",
    speaking: "ਬੋਲ ਰਹੇ ਹਾਂ...",
    seedRateLabel: "ਬੀਜ ਦਰ",
    sowingLabel: "ਬਿਜਾਈ ਦਾ ਸਮਾਂ",
    yieldLabel: "ਅੰਦਾਜ਼ਨ ਝਾੜ",
    profitLabel: "ਸ਼ੁੱਧ ਮੁਨਾਫਾ",
    viewDetails: "ਕਿਸਮ ਅਤੇ ਵੇਰਵਾ ਵੇਖੋ ➔",
    certifiedBadge: "ICAR ਪ੍ਰਮਾਣਿਤ ਫ਼ਸਲ ਯੋਜਨਾ",
    seedCodesTitle: "⭐ ਪ੍ਰਮਾਣਿਤ ਬੀਜ ਕੋਡ:",
    seedTreatmentTitle: "⚖️ ਬੀਜ ਦਰ ਅਤੇ ਸੋਧ:",
    sowingTitle: "🗓️ ਬਿਜਾਈ ਦਾ ਸਮਾਂ ਅਤੇ ਵਿਧੀ:",
    waterTitle: "💧 ਸਿੰਚਾਈ ਦੇ ਮੁੱਖ ਪੜਾਅ:",
    profitTitle: "💰 ਅੰਦਾਜ਼ਨ ਝਾੜ ਅਤੇ ਮੁਨਾਫਾ:",
    modalCallBtn: "📞 AI ਨਾਲ ਗੱਲ ਕਰੋ"
  }
};

function SoilResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const text = soilResultTexts[language] || soilResultTexts.en;

  const [expandedSection, setExpandedSection] = useState("fertilizer");
  const [activeCropModal, setActiveCropModal] = useState(null);
  const [isSpeakingOffline, setIsSpeakingOffline] = useState(false);

  // Fallback to localStorage if state is missing
  let rawResult = state?.result;
  if (!rawResult) {
    try {
      const cached = localStorage.getItem("kisan_mitra_last_soil_scan");
      if (cached) {
        rawResult = JSON.parse(cached);
      }
    } catch (e) {}
  }

  if (!rawResult) {
    return (
      <div className="scanner-page">
        <div className="scanner-content">
          <p>{text.noResult}</p>
          <button className="scanner-btn" onClick={() => navigate("/soil-analysis")}>
            {text.backToScan}
          </button>
        </div>
      </div>
    );
  }

  if (rawResult.is_soil === false) {
    return (
      <div className="scanner-page" style={{ padding: "40px 16px", textAlign: "center", color: "white" }}>
        <div style={{
          maxWidth: 500,
          margin: "0 auto",
          background: "rgba(239, 68, 68, 0.12)",
          border: "1.5px solid rgba(239, 68, 68, 0.35)",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
        }}>
          <div style={{ fontSize: 46, marginBottom: 12 }}>🪵 ⚠️</div>
          <h2 style={{ color: "#f87171", fontSize: 22, fontWeight: 800, margin: "0 0 10px 0" }}>
            {rawResult.soil_type || "No Agricultural Soil Detected"}
          </h2>
          <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px 0" }}>
            {rawResult.recommendation}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/soil")}
              style={{
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: 12,
                padding: "12px 22px",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer"
              }}
            >
              📸 Scan Actual Farm Soil
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                padding: "12px 18px",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer"
              }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Localize report dynamically if language changes
  const soilTypeKey = rawResult.soil_type || rawResult.predicted_class || "Alluvial Soil";
  const localizedData = getDetailedSoilReport(soilTypeKey, rawResult.crop_name || "", language);

  const soil_type = localizedData.soil_type;
  const soil_moisture = localizedData.soil_moisture;
  const summary = localizedData.summary;
  const moisture_advice = localizedData.moisture_advice;
  const soil_quality = localizedData.soil_quality;
  const recommended_crops = localizedData.recommended_crops;
  const fertilizer_line = localizedData.fertilizer_line;
  const how_to_use = localizedData.how_to_use;
  const extra_tips = localizedData.extra_tips;
  const step_by_step = localizedData.step_by_step || {};
  const isOfflineClassified = rawResult.isOfflineClassified;

  const toggleSection = (sectionKey) => {
    setExpandedSection(expandedSection === sectionKey ? null : sectionKey);
  };

  const schedule = step_by_step?.fertilizer_schedule || [];
  const cropEconomics = step_by_step?.crop_economics || [];
  const landPrep = step_by_step?.land_prep || "";

  const openCropDetail = (cropStr) => {
    setActiveCropModal(getCropDossier(cropStr, language));
  };

  const handleListenReport = () => {
    const isEn = language === "en";
    const textToSpeak = isEn
      ? `Analysis for ${soil_type}. ${summary} Moisture advice: ${moisture_advice}. Recommended crops: ${recommended_crops.join(", ")}.`
      : `${soil_type} का विश्लेषण। ${summary} सिंचाई सलाह: ${moisture_advice}। मुख्य फसलें: ${recommended_crops.join(", ")}।`;
    speakOfflineText(textToSpeak, language, () => setIsSpeakingOffline(true), () => setIsSpeakingOffline(false));
  };

  return (
    <div className="scanner-page" style={{ paddingBottom: "100px" }}>
      {/* Top Bar with Language Selector and Dashboard Link */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          background: "#166534",
          color: "white",
          borderRadius: "0 0 16px 16px",
          marginBottom: "16px"
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "rgba(255,255,255,0.2)",
            color: "white",
            border: "1px solid rgba(255,255,255,0.4)",
            borderRadius: "8px",
            padding: "6px 12px",
            fontSize: "13px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer"
          }}
        >
          <ArrowLeft size={16} />
          <span>{text.dashboard}</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <Globe size={16} />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              background: "white",
              color: "#166534",
              border: "none",
              borderRadius: "8px",
              padding: "4px 8px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
              outline: "none"
            }}
          >
            <option value="en">English 👩</option>
            <option value="hi">हिन्दी 👩</option>
            <option value="pa">ਪੰਜਾਬੀ 👩</option>
            <option value="bn">বাংলা 👩</option>
          </select>
        </div>
      </div>

      <div className="result-stack">
        {/* Offline Diagnostic Indicator Badge */}
        {isOfflineClassified && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 14px",
              borderRadius: "20px",
              background: "#ecfdf5",
              color: "#065f46",
              fontSize: "13px",
              fontWeight: "700",
              border: "1px solid #a7f3d0"
            }}
          >
            <CheckCircle size={16} />
            <span>{text.offlineActive}</span>
          </div>
        )}

        {/* Top soil analysis bar */}
        <section className="card card-main" style={{ background: "linear-gradient(135deg, #15803d 0%, #16a34a 100%)", color: "white" }}>
          <div className="card-main-header">
            <div className="card-main-left">
              <div className="card-main-icon" style={{ fontSize: "32px", background: "rgba(255,255,255,0.2)" }}>🌱</div>
              <div>
                <p className="card-main-label" style={{ color: "#dcfce7", fontSize: "13px" }}>{text.analysisComplete}</p>
                <h2 className="card-main-title" style={{ color: "white", fontSize: "22px", margin: "4px 0 0" }}>
                  {soil_type} · {soil_moisture}
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Listen Report Voice Button */}
        <section className="card" style={{ borderLeft: "4px solid #8b5cf6" }}>
          <div className="card-row-head" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span className="card-icon purple">🔊</span>
              <div>
                <p className="card-title">{text.listenTitle}</p>
                <p className="card-sub">{text.listenSub}</p>
              </div>
            </div>
            <button
              onClick={handleListenReport}
              style={{
                background: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "8px 14px",
                fontWeight: "600",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer"
              }}
            >
              <Volume2 size={16} />
              <span>{isSpeakingOffline ? text.speaking : text.listenBtn}</span>
            </button>
          </div>
        </section>

        {/* 📞 Prominent Direct Call Banner */}
        <button
          onClick={() => navigate("/call")}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
            color: "white",
            border: "none",
            borderRadius: "16px",
            padding: "16px",
            fontSize: "15px",
            fontWeight: "700",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(34, 197, 94, 0.35)",
            margin: "4px 0 12px"
          }}
        >
          <Phone size={20} />
          <span>{text.askAiBtn}</span>
        </button>

        {/* 1. Summary Card */}
        <section className="card">
          <div className="card-row-head">
            <span className="card-icon blue">📋</span>
            <div>
              <p className="card-title">{text.summary}</p>
              <p className="card-sub">{summary}</p>
            </div>
          </div>
        </section>

        {/* 2. Fertilizer Plan - INTERACTIVE STEP-BY-STEP ROADMAP */}
        <section
          className="card"
          onClick={() => toggleSection("fertilizer")}
          style={{ cursor: "pointer", border: expandedSection === "fertilizer" ? "2px solid #22c55e" : "1px solid #e2e8f0" }}
        >
          <div className="card-row-head" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span className="card-icon green">🧴</span>
              <div>
                <p className="card-title">{text.fertilizerPlan}</p>
                <p className="card-sub">{fertilizer_line}</p>
              </div>
            </div>
            {expandedSection === "fertilizer" ? <ChevronUp size={20} color="#15803d" /> : <ChevronDown size={20} color="#64748b" />}
          </div>

          <div style={{ marginTop: "8px", fontSize: "12px", color: "#16a34a", fontWeight: "600" }}>
            {expandedSection === "fertilizer" ? text.hideSteps : "👉 " + text.tapForSteps}
          </div>

          {expandedSection === "fertilizer" && schedule.length > 0 && (
            <div style={{ marginTop: "16px", borderTop: "1px dashed #cbd5e1", paddingTop: "14px" }}>
              <h4 style={{ margin: "0 0 12px", fontSize: "14px", color: "#0f172a", fontWeight: "700" }}>
                📅 {text.fertilizerPlan}:
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {schedule.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#f0fdf4",
                      padding: "12px",
                      borderRadius: "10px",
                      borderLeft: "4px solid #22c55e",
                      textAlign: "left"
                    }}
                  >
                    <div style={{ fontWeight: "700", color: "#166534", fontSize: "13px" }}>
                      {language === "en" ? `Phase ${idx + 1}: ${item.stage}` : `चरण ${idx + 1}: ${item.stage}`}
                    </div>
                    <div style={{ fontSize: "12px", color: "#15803d", margin: "4px 0", fontWeight: "600" }}>
                      ⚖️ {text.dosageTitle}: <strong>{item.dose}</strong>
                    </div>
                    <div style={{ fontSize: "12px", color: "#475569" }}>
                      📝 {text.actionTitle}: {item.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 3. Recommended Crops & Profit Economics (CLICKABLE) */}
        <section
          className="card"
          onClick={() => toggleSection("crops")}
          style={{ cursor: "pointer", border: expandedSection === "crops" ? "2px solid #3b82f6" : "1px solid #e2e8f0" }}
        >
          <div className="card-row-head" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span className="card-icon orange">🌾</span>
              <div>
                <p className="card-title">{text.recommendedCrops}</p>
                <p className="card-sub">{recommended_crops ? recommended_crops.join(", ") : "—"}</p>
              </div>
            </div>
            {expandedSection === "crops" ? <ChevronUp size={20} color="#2563eb" /> : <ChevronDown size={20} color="#64748b" />}
          </div>

          <div style={{ marginTop: "8px", fontSize: "12px", color: "#2563eb", fontWeight: "600" }}>
            {expandedSection === "crops" ? text.hideCrops : "👉 " + text.tapForSteps}
          </div>

          {expandedSection === "crops" && cropEconomics.length > 0 && (
            <div style={{ marginTop: "16px", borderTop: "1px dashed #cbd5e1", paddingTop: "14px" }}>
              <h4 style={{ margin: "0 0 12px", fontSize: "14px", color: "#0f172a", fontWeight: "700" }}>
                💰 {text.economicsTitle}
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {cropEconomics.map((c, idx) => (
                  <div
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      openCropDetail(c.crop);
                    }}
                    style={{
                      background: "#eff6ff",
                      padding: "12px",
                      borderRadius: "10px",
                      borderLeft: "4px solid #3b82f6",
                      textAlign: "left",
                      cursor: "pointer",
                      transition: "transform 0.15s ease"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontWeight: "700", color: "#1e40af", fontSize: "14px" }}>{c.crop}</div>
                      <span style={{ fontSize: "11px", color: "#2563eb", fontWeight: "700", background: "#dbeafe", padding: "2px 8px", borderRadius: "10px" }}>
                        {text.viewDetails}
                      </span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#334155", margin: "4px 0" }}>
                      🌱 {text.seedRateLabel}: <strong>{c.seed_rate}</strong> | 🗓️ {text.sowingLabel}: <strong>{c.sowing}</strong>
                    </div>
                    <div style={{ fontSize: "12px", color: "#15803d", fontWeight: "600" }}>
                      📈 {text.yieldLabel}: {c.yield}
                    </div>
                    <div style={{ fontSize: "13px", color: "#047857", fontWeight: "700", marginTop: "4px" }}>
                      💵 {text.profitLabel}: {c.profit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 4. Irrigation Advice & Land Prep */}
        <section
          className="card"
          onClick={() => toggleSection("irrigation")}
          style={{ cursor: "pointer", border: expandedSection === "irrigation" ? "2px solid #06b6d4" : "1px solid #e2e8f0" }}
        >
          <div className="card-row-head" style={{ justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span className="card-icon green">💧</span>
              <div>
                <p className="card-title">{text.irrigationAdvice}</p>
                <p className="card-sub">{moisture_advice}</p>
              </div>
            </div>
            {expandedSection === "irrigation" ? <ChevronUp size={20} color="#0891b2" /> : <ChevronDown size={20} color="#64748b" />}
          </div>

          <div style={{ marginTop: "8px", fontSize: "12px", color: "#0891b2", fontWeight: "600" }}>
            {expandedSection === "irrigation" ? text.hideSteps : "👉 " + text.tapForSteps}
          </div>

          {expandedSection === "irrigation" && landPrep && (
            <div style={{ marginTop: "14px", borderTop: "1px dashed #cbd5e1", paddingTop: "12px", textAlign: "left" }}>
              <div style={{ fontWeight: "700", color: "#0e7490", fontSize: "13px", marginBottom: "6px" }}>
                🚜 {text.landPrepTitle}:
              </div>
              <p style={{ fontSize: "12px", color: "#334155", lineHeight: "1.5", margin: 0 }}>
                {landPrep}
              </p>
            </div>
          )}
        </section>

        {/* 5. How to use & Soil Quality */}
        <section className="card">
          <div className="card-row-head">
            <span className="card-icon yellow">🌱</span>
            <div>
              <p className="card-title">{text.soilQuality}</p>
              <p className="card-sub">{soil_quality}</p>
            </div>
          </div>
        </section>

        {how_to_use && (
          <section className="card">
            <div className="card-row-head">
              <span className="card-icon orange">🧯</span>
              <div>
                <p className="card-title">{text.howToUse}</p>
                <p className="card-sub">{how_to_use}</p>
              </div>
            </div>
          </section>
        )}

        {extra_tips && (
          <section className="card">
            <div className="card-row-head">
              <span className="card-icon blue">💡</span>
              <div>
                <p className="card-title">{text.tips}</p>
                <p className="card-sub">{extra_tips}</p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* CLICKED CROP DOSSIER MODAL */}
      {activeCropModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "16px"
          }}
          onClick={() => setActiveCropModal(null)}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              maxWidth: "480px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              position: "relative"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveCropModal(null)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "#f1f5f9",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span style={{ fontSize: "28px" }}>🌾</span>
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", color: "#0f172a" }}>{activeCropModal.name}</h3>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#16a34a", fontWeight: "600" }}>
                  {text.certifiedBadge}
                </p>
              </div>
            </div>

            {/* Varieties & Codes */}
            <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px", borderRadius: "12px", marginBottom: "12px" }}>
              <div style={{ fontWeight: "700", color: "#166534", fontSize: "13px" }}>
                {text.seedCodesTitle}
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#15803d", margin: "4px 0" }}>
                {activeCropModal.varieties}
              </div>
              <div style={{ fontSize: "12px", color: "#334155" }}>
                {activeCropModal.varietyReason}
              </div>
            </div>

            {/* Seed Rate & Treatment */}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontWeight: "700", color: "#334155", fontSize: "13px" }}>
                {text.seedTreatmentTitle}
              </div>
              <div style={{ fontSize: "13px", color: "#475569", marginTop: "2px" }}>
                • {text.seedRateLabel}: <strong>{activeCropModal.seedRate}</strong>
              </div>
              <div style={{ fontSize: "12px", color: "#475569" }}>
                • {language === "en" ? "Fungicide Treatment: " : "शोधन: "}{activeCropModal.seedTreatment}
              </div>
            </div>

            {/* Sowing window & spacing */}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontWeight: "700", color: "#334155", fontSize: "13px" }}>
                {text.sowingTitle}
              </div>
              <div style={{ fontSize: "13px", color: "#475569", marginTop: "2px" }}>
                • {text.sowingLabel}: <strong>{activeCropModal.sowingWindow}</strong>
              </div>
              <div style={{ fontSize: "12px", color: "#475569" }}>
                • {language === "en" ? "Spacing: " : "कतार दूरी: "}{activeCropModal.spacing}
              </div>
            </div>

            {/* Water & Irrigation */}
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontWeight: "700", color: "#334155", fontSize: "13px" }}>
                {text.waterTitle}
              </div>
              <div style={{ fontSize: "12px", color: "#475569", marginTop: "2px" }}>
                {activeCropModal.waterStages}
              </div>
            </div>

            {/* Economics */}
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "12px", borderRadius: "12px", marginBottom: "16px" }}>
              <div style={{ fontWeight: "700", color: "#92400e", fontSize: "13px" }}>
                {text.profitTitle}
              </div>
              <div style={{ fontSize: "13px", color: "#78350f", margin: "4px 0" }}>
                • {text.yieldLabel}: <strong>{activeCropModal.expectedYield}</strong>
              </div>
              <div style={{ fontSize: "13px", color: "#78350f" }}>
                • {text.profitLabel}: <strong style={{ color: "#15803d" }}>{activeCropModal.netProfit}</strong>
              </div>
            </div>

            <button
              onClick={() => {
                const cropName = activeCropModal.cropName || activeCropModal.crop || "Wheat";
                const projKey = cropName.includes("Mustard") || cropName.includes("सरसों") ? "Mustard"
                  : cropName.includes("Paddy") || cropName.includes("धान") ? "Paddy"
                  : cropName.includes("Potato") || cropName.includes("आलू") ? "Potato"
                  : "Wheat";
                startCultivationProject(projKey, "Plot 1 (Soil Tested)", "2.5 Acres");
                setActiveCropModal(null);
                navigate("/cultivation-tracker");
              }}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "14px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "10px",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
              }}
            >
              <Sprout size={18} />
              <span>🌱 Start Cultivation & Track In-Field Progress ➔</span>
            </button>

            <button
              onClick={() => {
                setActiveCropModal(null);
                navigate("/call");
              }}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "14px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              <Phone size={18} />
              <span>{text.modalCallBtn}</span>
            </button>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}

export default SoilResult;
