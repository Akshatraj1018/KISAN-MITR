// src/context/LanguageContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const LanguageContext = createContext();

export const ALL_INDIAN_LANGUAGES = [
  { code: "hi", name: "Hindi", native: "हिन्दी", region: "उत्तर एवं मध्य भारत", greeting: "नमस्ते" },
  { code: "en", name: "English", native: "English", region: "Pan India", greeting: "Welcome" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", region: "ਪੰਜਾਬ, ਹਰਿਆਣਾ", greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ" },
  { code: "bn", name: "Bengali", native: "বাংলা", region: "পশ্চিমবঙ্গ, ত্রিপুরা", greeting: "নমস্কার" },
  { code: "mr", name: "Marathi", native: "मराठी", region: "महाराष्ट्र", greeting: "नमस्कार" },
  { code: "te", name: "Telugu", native: "తెలుగు", region: "ఆంధ్రప్రదేశ్, తెలంగాణ", greeting: "నమస్కారం" },
  { code: "ta", name: "Tamil", native: "தமிழ்", region: "தமிழ்நாடு", greeting: "வணக்கம்" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", region: "ગુજરાત", greeting: "નમસ્તે" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", region: "ಕರ್ನಾಟಕ", greeting: "ನಮಸ್ಕಾರ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", region: "കേരളം", greeting: "നമസ്കാരം" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", region: "ଓଡ଼ିଶା", greeting: "ନମସ୍କାର" },
  { code: "as", name: "Assamese", native: "অসমীয়া", region: "অসম", greeting: "নমস্কাৰ" },
];

const TRANSLATIONS = {
  en: {
    appName: "Kisan Mitra",
    stepText: "Language Preference",
    greeting: "Namaste, Farmer!",
    chooseLang: "Choose Your Native Language",
    chooseLangDesc: "Kisan Mitra supports all Indian regional languages with voice assistance",
    continueBtn: "Confirm & Enter Kisan Mitra ➔",
    helpText: "You can change this anytime from top navigation bar",
    footerText: "Kisan Mitra — Government of India SIH Finalist • Empowering Indian Agriculture",
  },
  hi: {
    appName: "किसान मित्र",
    stepText: "भाषा चयन",
    greeting: "नमस्ते, किसान भाई!",
    chooseLang: "अपनी मातृभाषा चुनें",
    chooseLangDesc: "किसान मित्र सभी भारतीय क्षेत्रीय भाषाओं में वॉइस व टेक्स्ट सहायता प्रदान करता है",
    continueBtn: "पुष्टि करें एवं आगे बढ़ें ➔",
    helpText: "आप इसे बाद में भी सेटिंग्स से कभी भी बदल सकते हैं",
    footerText: "किसान मित्र — भारत सरकार एसआईएच विजेता • भारतीय किसानों का सच्चा साथी",
  },
  pa: {
    appName: "ਕਿਸਾਨ ਮਿੱਤਰ",
    stepText: "ਭਾਸ਼ਾ ਚੋਣ",
    greeting: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਕਿਸਾਨ ਵੀਰ!",
    chooseLang: "ਆਪਣੀ ਮਾਤ-ਭਾਸ਼ਾ ਚੁਣੋ",
    chooseLangDesc: "ਕਿਸਾਨ ਮਿੱਤਰ ਸਾਰੀਆਂ ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਆਵਾਜ਼ ਸਹਾਇਤਾ ਪ੍ਰਦਾਨ ਕਰਦਾ ਹੈ",
    continueBtn: "ਪੁਸ਼ਟੀ ਕਰੋ ਅਤੇ ਅੱਗੇ ਵਧੋ ➔",
    helpText: "ਤੁਸੀਂ ਇਸਨੂੰ ਬਾਅਦ ਵਿੱਚ ਵੀ ਬਦਲ ਸਕਦੇ ਹੋ",
    footerText: "ਕਿਸਾਨ ਮਿੱਤਰ — ਕਿਸਾਨਾਂ ਦਾ ਭਰੋਸੇਮੰਦ ਸਾਥੀ",
  },
  bn: {
    appName: "কিষাণ মিত্র",
    stepText: "ভাষা নির্বাচন",
    greeting: "নমস্কার, কৃষক বন্ধু!",
    chooseLang: "আপনার মাতৃভাষা বেছে নিন",
    chooseLangDesc: "কিষাণ মিত্র সমস্ত ভারতীয় আঞ্চলিক ভাষায় ভয়েস এবং টেক্সট সহায়তা প্রদান করে",
    continueBtn: "নিশ্চিত করুন এবং এগিয়ে যান ➔",
    helpText: "আপনি যেকোনো সময় সেটিংস থেকে এটি পরিবর্তন করতে পারেন",
    footerText: "কিষাণ মিত্র — ভারতীয় কৃষকের ডিজিটাল সঙ্গী",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("kisan_mitra_lang") || "en";
  });

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem("kisan_mitra_lang", langCode);
  };

  const t = (key) => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return langDict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: ALL_INDIAN_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
