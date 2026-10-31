// src/pages/ImageScanner.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { offlineAnalyzeSoilImage } from "../utils/offlineAgronomy";

const scannerTexts = {
  en: {
    title: "Scan Leaf or Soil",
    subtitle: "Use your camera to capture a clear photo of the leaf or soil (Works Offline).",
    openCamera: "Open Camera",
    analyzingTitle: "Analyzing Your Image",
    step1: "Processing image...",
    step2: "Detecting features...",
    step3: "Generating recommendations...",
    waitText: "Please wait while we analyze your sample",
  },
  hi: {
    title: "पत्ता या मिट्टी स्कैन करें",
    subtitle: "पत्ते या मिट्टी की साफ़ तस्वीर लेने के लिए कैमरा उपयोग करें (ऑफ़लाइन सक्षम)।",
    openCamera: "कैमरा खोलें",
    analyzingTitle: "आपकी छवि का विश्लेषण हो रहा है",
    step1: "छवि संसाधित की जा रही है...",
    step2: "विशेषताएँ पहचानी जा रही हैं...",
    step3: "सिफारिशें तैयार की जा रही हैं...",
    waitText: "कृपया प्रतीक्षा करें, आपका नमूना विश्लेषित हो रहा है",
  },
  bn: {
    title: "পাতা বা মাটি স্ক্যান করুন",
    subtitle: "পাতা বা মাটির পরিষ্কার ছবি তুলতে ক্যামেরা ব্যবহার করুন (অফলাইন মোড)।",
    openCamera: "ক্যামেরা খুলুন",
    analyzingTitle: "আপনার ছবিটি বিশ্লেষণ করা হচ্ছে",
    step1: "ছবি প্রক্রিয়াকরণ হচ্ছে...",
    step2: "বৈশিষ্ট্য শনাক্ত করা হচ্ছে...",
    step3: "পরামর্শ তৈরি করা হচ্ছে...",
    waitText: "দয়া করে অপেক্ষা করুন, আমরা আপনার নমুনা বিশ্লেষণ করছি",
  },
  pa: {
    title: "ਪੱਤਾ ਜਾਂ ਮਿੱਟੀ ਸਕੈਨ ਕਰੋ",
    subtitle: "ਪੱਤੇ ਜਾਂ ਮਿੱਟੀ ਦੀ ਸਾਫ਼ ਤਸਵੀਰ ਲਈ ਕੈਮਰਾ ਵਰਤੋ (ਆਫ਼ਲਾਈਨ ਸਮਰੱਥ)।",
    openCamera: "ਕੈਮਰਾ ਖੋਲ੍ਹੋ",
    analyzingTitle: "ਤੁਹਾਡੀ ਤਸਵੀਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਹੋ ਰਿਹਾ ਹੈ",
    step1: "ਤਸਵੀਰ ਪ੍ਰੋਸੈਸ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...",
    step2: "ਖਾਸ ਲੱਛਣ ਪਛਾਣੇ ਜਾ ਰਹੇ ਹਨ...",
    step3: "ਸਿਫਾਰਸ਼ਾਂ ਤਿਆਰ ਕੀਤੀਆਂ ਜਾ ਰਹੀਆਂ ਹਨ...",
    waitText: "ਕਿਰਪਾ ਕਰਕੇ ਉਡੀਕ ਕਰੋ, ਅਸੀਂ ਤੁਹਾਡਾ ਨਮੂਨਾ ਜਾਂਚ ਰਹੇ ਹਾਂ",
  },
};

function ImageScanner() {
  const fileInputRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const text = scannerTexts[language] || scannerTexts.en;

  useEffect(() => {
    if (!isAnalyzing) return;
    setStep(1);

    const id = setInterval(() => {
      setStep((prev) => (prev < 3 ? prev + 1 : 3));
    }, 1800);

    return () => clearInterval(id);
  }, [isAnalyzing]);

  const handleOpenCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(
          `http://127.0.0.1:8000/analyze?lang=${encodeURIComponent(language)}`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error("Analysis failed");
        }

        const data = await res.json();
        localStorage.setItem("kisan_mitra_last_soil_scan", JSON.stringify(data));
        if (data.routed_to === "soil" || data.soil_type) {
          navigate("/soil-result", { state: { result: data } });
        } else {
          navigate("/scan-result", { state: { result: data } });
        }
      } catch (backendErr) {
        console.warn("Backend unavailable, executing In-Browser Offline Soil Classifier...", backendErr);
        
        // 100% In-Browser Offline Fallback
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = objectUrl;
        await new Promise((res) => { img.onload = res; });

        const offlineData = await offlineAnalyzeSoilImage(img, language);
        const packagedResult = {
          ...offlineData,
          routed_to: "soil",
          isOfflineClassified: true
        };

        localStorage.setItem("kisan_mitra_last_soil_scan", JSON.stringify(packagedResult));
        URL.revokeObjectURL(objectUrl);
        navigate("/soil-result", { state: { result: packagedResult } });
      }
    } catch (err) {
      console.error(err);
      alert("Could not analyze the image. Please try again.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="scanner-page">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {isAnalyzing ? (
        <div className="analyzing-container">
          <div className="pulsing-circle">
            <div className="inner-circle" />
          </div>

          <h2 className="analyzing-title">{text.analyzingTitle}</h2>

          <div className="steps-indicator">
            <div className={`step-dot ${step >= 1 ? "active" : ""}`} />
            <div className={`step-line ${step >= 2 ? "active" : ""}`} />
            <div className={`step-dot ${step >= 2 ? "active" : ""}`} />
            <div className={`step-line ${step >= 3 ? "active" : ""}`} />
            <div className={`step-dot ${step >= 3 ? "active" : ""}`} />
          </div>

          <p className="analyzing-step-text">
            {step === 1 && text.step1}
            {step === 2 && text.step2}
            {step === 3 && text.step3}
          </p>

          <p className="analyzing-subtext">{text.waitText}</p>
        </div>
      ) : (
        <div className="scanner-content">
          <h1 className="scanner-title">{text.title}</h1>
          <p className="scanner-subtitle">{text.subtitle}</p>

          <button className="scanner-btn" onClick={handleOpenCamera}>
            {text.openCamera}
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageScanner;
