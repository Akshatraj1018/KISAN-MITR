// src/context/LanguageContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { GLOBAL_TRANSLATIONS } from "../utils/translations";

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

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem("kisan_mitra_lang") || "hi";
  });

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem("kisan_mitra_lang", langCode);
    localStorage.setItem("km_lang", langCode);

    try {
      document.cookie = `googtrans=/en/${langCode}; path=/;`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;
      const combo = document.querySelector("select.goog-te-combo");
      if (combo && combo.value !== langCode) {
        combo.value = langCode;
        combo.dispatchEvent(new Event("change"));
      }
    } catch (e) {}
  };

  const t = (keyOrText) => {
    if (!keyOrText) return "";
    const langDict = GLOBAL_TRANSLATIONS[language] || {};
    return langDict[keyOrText] || keyOrText;
  };

  // Global DOM localization observer
  useEffect(() => {
    if (typeof document === "undefined") return;

    let isTranslating = false;
    const dict = GLOBAL_TRANSLATIONS[language] || {};
    const isEnglish = language === "en";
    const keys = Object.keys(dict).sort((a, b) => b.length - a.length);

    function translateStr(str) {
      if (!str || typeof str !== "string" || !str.trim()) return str;
      let res = str;
      const lower = res.toLowerCase();
      for (const k of keys) {
        if (lower.includes(k.toLowerCase())) {
          const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`(?<![a-zA-Z0-9])${escaped}(?![a-zA-Z0-9])`, 'gi');
          res = res.replace(regex, dict[k]);
        }
      }
      return res;
    }

    function translateTree(root) {
      if (!root) return;
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toLowerCase();
            if (tag === "script" || tag === "style" || tag === "code" || tag === "pre") {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let textNode = walker.nextNode();
      while (textNode) {
        if (textNode.__km_orig === undefined) {
          textNode.__km_orig = textNode.nodeValue;
        }

        if (isEnglish) {
          if (textNode.nodeValue !== textNode.__km_orig) {
            textNode.nodeValue = textNode.__km_orig;
          }
        } else {
          const target = translateStr(textNode.__km_orig);
          if (target !== textNode.nodeValue) {
            textNode.nodeValue = target;
          }
        }
        textNode = walker.nextNode();
      }

      // Also translate input/textarea placeholders
      const inputs = root.querySelectorAll ? root.querySelectorAll("input, textarea") : [];
      inputs.forEach((el) => {
        if (el.placeholder) {
          if (el.__km_orig_ph === undefined) {
            el.__km_orig_ph = el.placeholder;
          }
          if (isEnglish) {
            el.placeholder = el.__km_orig_ph;
          } else {
            el.placeholder = translateStr(el.__km_orig_ph);
          }
        }
      });
    }

    const runTranslation = () => {
      if (isTranslating) return;
      isTranslating = true;
      try {
        translateTree(document.body);
      } finally {
        isTranslating = false;
      }
    };

    // Run immediately on mount / language switch
    runTranslation();

    // Listen for DOM changes as user switches tabs or loads data
    const observer = new MutationObserver(() => {
      runTranslation();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }, [language]);

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
