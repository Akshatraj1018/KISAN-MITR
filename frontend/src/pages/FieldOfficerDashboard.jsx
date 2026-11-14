// src/pages/FieldOfficerDashboard.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Bell,
  Settings,
  MapPin,
  Sun,
  Wind,
  Droplets,
  CloudRain,
  Stethoscope,
  IndianRupee,
  FlaskConical,
  Bot,
  ChevronRight,
  Sprout,
  User,
  Globe,
  Shield,
  HelpCircle,
  Info,
  Cloud,
  Bug,
  DollarSign,
  Lightbulb,
  LogOut,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Weather.css";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const ENV_KEY = import.meta.env.VITE_WEATHERAPI_KEY || "e1b1bc1a2e664d0cbf223204252611";

function HomeIcon() {
  return <Sun />;
}

const officerDashboardTexts = {
  en: {
    brandTitle: "Kisan Mitr",
    brandSubtitle: "Field Officer Dashboard",
    navHome: "Home",
    navCrops: "Crops",
    navWeather: "Weather",
    navSettings: "Settings",
    navLanguage: "Language",
    navAbout: "About Us",
    greeting: "Good Morning, Officer! 🌾",
    detectingLocation: "Detecting location...",
    geoNotSupported: "Geolocation not supported in this browser.",
    permDenied: "Permission denied for location.",
    posUnavailable: "Position unavailable.",
    timeout: "Location request timed out.",
    locFailed: "Failed to get location.",
    noApiKey: "No WeatherAPI key found. Add it to your .env file.",
    fetchError: "Failed to fetch weather.",
    netError: "Network error while fetching weather.",
    locDetected: "Location detected",
    lastUpdated: "Last updated",
    noRainMsg: "No rain expected. Please advise farmers to irrigate today.",
    soilOk:
      "Soil moisture looks sufficient. Irrigation is not required today.",
    highTempLowHum:
      "High temperature and low humidity. Recommend adequate irrigation.",
    lightIrr: "Light irrigation is suggested to maintain crop health.",
    monitorIrr:
      "Monitor soil moisture and advise irrigation if soil starts drying.",
    irrChecking: "Checking irrigation status...",
    irrNone: "No Irrigation Needed",
    irrRecommended: "Irrigation Recommended",
    irrLight: "Light Irrigation Suggested",
    irrMonitor: "Monitor Irrigation",
    pestTitle: "Pest Detection & Solution",
    pestSub: "Identify diseases on farmer fields and get treatments.",
    pestCta: "Open Pest Detection",
    mandiTitle: "Mandi Prices",
    mandiSub: "Check live market prices for major crops.",
    mandiCta: "View Market Prices",
    advisorTitle: "Farmer Advisor",
    advisorSub: "Generate detailed crop advisory for your assigned farmers.",
    advisorCta: "Open Advisor",
    mitraTitle: "Kisan Mitra Chatbot",
    mitraSub: "Get instant answers to field-level questions.",
    mitraCta: "Chat with Kisan Mitra",
    scanBtn: "Scan Crop",
    settingsTitle: "Settings",
    settingsSub: "Manage your preferences",
    profile: "Profile",
    profileSub: "Update your information",
    langMenu: "Language",
    langMenuSub: "Change app language",
    privacy: "Privacy",
    privacySub: "Manage your data",
    help: "Help",
    helpSub: "Get support",
    about: "About Us",
    aboutSub: "App information",
    logout: "Logout",
    logoutSub: "Sign out of your account",
    weatherAlerts: "Weather Alerts",
    weatherAlertsSub: "Get weather information",
    diseaseAlerts: "Crop Disease Alerts",
    diseaseAlertsSub: "Disease identification info",
    priceUpdates: "Market Price Updates",
    priceUpdatesSub: "Get new prices",
    adviceTips: "Advice Tips",
    adviceTipsSub: "Get farming advice",
    appInfoTitle: "Kisan Mitra",
    appInfoSub: "AI-Powered Agricultural Advisory",
    footer: "Kisan Mitra — AI-Powered Agricultural Advisory",
  },
  hi: {
    brandTitle: "किसान मित्र",
    brandSubtitle: "फील्ड ऑफिसर डैशबोर्ड",
    navHome: "होम",
    navCrops: "फसलें",
    navWeather: "मौसम",
    navSettings: "सेटिंग्स",
    navLanguage: "भाषा",
    navAbout: "हमारे बारे में",
    greeting: "सुप्रभात, अधिकारी! 🌾",
    detectingLocation: "स्थान की पहचान की जा रही है...",
    geoNotSupported: "इस ब्राउज़र में लोकेशन सपोर्ट नहीं है।",
    permDenied: "लोकेशन की अनुमति अस्वीकार कर दी गई।",
    posUnavailable: "स्थान उपलब्ध नहीं है।",
    timeout: "लोकेशन अनुरोध का समय समाप्त हो गया।",
    locFailed: "लोकेशन प्राप्त करने में विफल।",
    noApiKey: "WeatherAPI कुंजी नहीं मिली। कृपया .env में जोड़ें।",
    fetchError: "मौसम डेटा प्राप्त करने में समस्या।",
    netError: "मौसम डेटा लाते समय नेटवर्क त्रुटि।",
    locDetected: "स्थान पहचाना गया",
    lastUpdated: "अंतिम अपडेट",
    noRainMsg:
      "आज वर्षा की संभावना कम है। किसानों को सिंचाई करने की सलाह दें।",
    soilOk:
      "मिट्टी की नमी पर्याप्त लग रही है। आज सिंचाई की आवश्यकता नहीं है।",
    highTempLowHum:
      "उच्च तापमान और कम नमी। पर्याप्त सिंचाई की सलाह दें।",
    lightIrr: "फसल की सेहत के लिए हल्की सिंचाई सुझाई जाती है।",
    monitorIrr:
      "मिट्टी की नमी पर नज़र रखें और सूखने पर सिंचाई की सलाह दें।",
    irrChecking: "सिंचाई की स्थिति जाँची जा रही है...",
    irrNone: "सिंचाई की आवश्यकता नहीं",
    irrRecommended: "सिंचाई की सलाह दी जाती है",
    irrLight: "हल्की सिंचाई सुझाई जाती है",
    irrMonitor: "सिंचाई पर नज़र रखें",
    pestTitle: "कीट पहचान और समाधान",
    pestSub: "किसानों की फसलों पर रोग पहचानें और उपचार सुझाएँ।",
    pestCta: "कीट पहचान खोलें",
    mandiTitle: "मंडी भाव",
    mandiSub: "मुख्य फसलों के लाइव मंडी भाव देखें।",
    mandiCta: "मंडी भाव देखें",
    advisorTitle: "किसान सलाहकार",
    advisorSub: "आपके किसानों के लिए विस्तृत फसल सलाह तैयार करें।",
    advisorCta: "सलाहकार खोलें",
    mitraTitle: "किसान मित्र चैटबॉट",
    mitraSub: "फील्ड से जुड़े सवालों के तुरंत जवाब पाएं।",
    mitraCta: "किसान मित्र से बात करें",
    scanBtn: "फसल स्कैन करें",
    settingsTitle: "सेटिंग्स",
    settingsSub: "अपनी पसंद प्रबंधित करें",
    profile: "प्रोफ़ाइल",
    profileSub: "अपनी जानकारी अपडेट करें",
    langMenu: "भाषा",
    langMenuSub: "ऐप की भाषा बदलें",
    privacy: "गोपनीयता",
    privacySub: "अपने डाटा को प्रबंधित करें",
    help: "सहायता",
    helpSub: "मदद प्राप्त करें",
    about: "हमारे बारे में",
    aboutSub: "ऐप जानकारी",
    logout: "लॉगआउट",
    logoutSub: "अपने खाते से साइन आउट करें",
    weatherAlerts: "मौसम अलर्ट",
    weatherAlertsSub: "मौसम की जानकारी प्राप्त करें",
    diseaseAlerts: "फसल रोग अलर्ट",
    diseaseAlertsSub: "रोग पहचान जानकारी",
    priceUpdates: "मंडी भाव अपडेट",
    priceUpdatesSub: "नए भाव प्राप्त करें",
    adviceTips: "सलाह टिप्स",
    adviceTipsSub: "खेती से जुड़ी सलाह",
    appInfoTitle: "किसान मित्र",
    appInfoSub: "एआई आधारित कृषि सलाह",
    footer: "किसान मित्र — एआई आधारित कृषि सलाह",
  },
  bn: {
    brandTitle: "কিষাণ মিত্র",
    brandSubtitle: "ফিল্ড অফিসার ড্যাশবোর্ড",
    navHome: "হোম",
    navCrops: "ফসল",
    navWeather: "আবহাওয়া",
    navSettings: "সেটিংস",
    navLanguage: "ভাষা",
    navAbout: "আমাদের সম্পর্কে",
    greeting: "শুভ সকাল, অফিসার! 🌾",
    detectingLocation: "লোকেশন শনাক্ত করা হচ্ছে...",
    geoNotSupported: "এই ব্রাউজারে জিওলোকেশন সমর্থিত নয়।",
    permDenied: "লোকেশন অনুমতি বাতিল করা হয়েছে।",
    posUnavailable: "লোকেশন পাওয়া যাচ্ছে না।",
    timeout: "লোকেশন অনুরোধের সময় শেষ।",
    locFailed: "লোকেশন নেওয়া সম্ভব হলো না।",
    noApiKey: "WeatherAPI কী পাওয়া যায়নি। .env ফাইলে যোগ করুন।",
    fetchError: "আবহাওয়ার তথ্য আনতে সমস্যা হচ্ছে।",
    netError: "আবহাওয়ার তথ্য নেওয়ার সময় নেটওয়ার্ক ত্রুটি।",
    locDetected: "লোকেশন শনাক্ত করা হয়েছে",
    lastUpdated: "সর্বশেষ আপডেট",
    noRainMsg:
      "আজ বৃষ্টির সম্ভাবনা কম। কৃষকদের সেচ দেওয়ার পরামর্শ দিন।",
    soilOk:
      "মাটির আর্দ্রতা ভালো দেখাচ্ছে। আজ সেচের প্রয়োজন নেই।",
    highTempLowHum:
      "উচ্চ তাপমাত্রা এবং কম আর্দ্রতা। পর্যাপ্ত সেচের পরামর্শ দিন।",
    lightIrr: "ফসলের সুস্থতার জন্য হালকা সেচ প্রস্তাবিত।",
    monitorIrr:
      "মাটির আর্দ্রতা লক্ষ্য করুন এবং শুকালে সেচের পরামর্শ দিন।",
    irrChecking: "সেচ অবস্থা যাচাই করা হচ্ছে...",
    irrNone: "সেচের প্রয়োজন নেই",
    irrRecommended: "সেচ করার পরামর্শ দেওয়া হচ্ছে",
    irrLight: "হালকা সেচ করার পরামর্শ",
    irrMonitor: "সেচের অবস্থা লক্ষ্য রাখুন",
    pestTitle: "পোকার শনাক্তকরণ ও সমাধান",
    pestSub: "কৃষকদের জমিতে রোগ শনাক্ত করুন এবং চিকিৎসা দিন।",
    pestCta: "পোকার শনাক্তকরণ খুলুন",
    mandiTitle: "মন্ডি দামের তথ্য",
    mandiSub: "প্রধান ফসলের লাইভ বাজারদর দেখুন।",
    mandiCta: "বাজারদর দেখুন",
    advisorTitle: "কৃষক উপদেষ্টা",
    advisorSub: "দায়িত্বপ্রাপ্ত কৃষকদের জন্য বিস্তারিত পরামর্শ দিন।",
    advisorCta: "উপদেষ্টা খুলুন",
    mitraTitle: "কিষাণ মিত্র চ্যাটবট",
    mitraSub: "ফিল্ড সম্পর্কিত প্রশ্নের দ্রুত উত্তর পান।",
    mitraCta: "কিষাণ মিত্রের সাথে চ্যাট করুন",
    scanBtn: "ফসল স্ক্যান করুন",
    settingsTitle: "সেটিংস",
    settingsSub: "আপনার পছন্দ পরিচালনা করুন",
    profile: "প্রোফাইল",
    profileSub: "আপনার তথ্য আপডেট করুন",
    langMenu: "ভাষা",
    langMenuSub: "অ্যাপের ভাষা পরিবর্তন করুন",
    privacy: "গোপনীয়তা",
    privacySub: "আপনার ডাটা পরিচালনা করুন",
    help: "সহায়তা",
    helpSub: "সহায়তা নিন",
    about: "আমাদের সম্পর্কে",
    aboutSub: "অ্যাপ তথ্য",
    logout: "লগআউট",
    logoutSub: "আপনার একাউন্ট থেকে সাইন আউট করুন",
    weatherAlerts: "আবহাওয়া সতর্কতা",
    weatherAlertsSub: "আবহাওয়ার তথ্য পান",
    diseaseAlerts: "ফসল রোগ সতর্কতা",
    diseaseAlertsSub: "রোগ শনাক্তকরণ তথ্য",
    priceUpdates: "বাজারদর আপডেট",
    priceUpdatesSub: "নতুন দাম পান",
    adviceTips: "পরামর্শ টিপস",
    adviceTipsSub: "চাষাবাদ পরামর্শ",
    appInfoTitle: "কিষাণ মিত্র",
    appInfoSub: "এআই-চালিত কৃষি পরামর্শ",
    footer: "কিষাণ মিত্র — এআই-চালিত কৃষি পরামর্শ",
  },
  pa: {
    brandTitle: "ਕਿਸਾਨ ਮਿੱਤਰ",
    brandSubtitle: "ਫੀਲਡ ਅਫਸਰ ਡੈਸ਼ਬੋਰਡ",
    navHome: "ਘਰ",
    navCrops: "ਫਸਲਾਂ",
    navWeather: "ਮੌਸਮ",
    navSettings: "ਸੈਟਿੰਗਜ਼",
    navLanguage: "ਭਾਸ਼ਾ",
    navAbout: "ਸਾਡੇ ਬਾਰੇ",
    greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ, ਅਫਸਰ ਜੀ! 🌾",
    detectingLocation: "ਥਾਂ ਲੱਭੀ ਜਾ ਰਹੀ ਹੈ...",
    geoNotSupported: "ਇਸ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਲੋਕੇਸ਼ਨ ਸਹਾਇਤਾ ਨਹੀਂ ਹੈ।",
    permDenied: "ਲੋਕੇਸ਼ਨ ਦੀ ਇਜਾਜ਼ਤ ਰੱਦ ਕਰ ਦਿੱਤੀ ਗਈ।",
    posUnavailable: "ਥਾਂ ਉਪਲਬਧ ਨਹੀਂ ਹੈ।",
    timeout: "ਲੋਕੇਸ਼ਨ ਬੇਨਤੀ ਦਾ ਸਮਾਂ ਪੂਰਾ ਹੋ ਗਿਆ।",
    locFailed: "ਥਾਂ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਅਸਫਲ।",
    noApiKey: "WeatherAPI ਕੁੰਜੀ ਨਹੀਂ ਮਿਲੀ। ਕਿਰਪਾ ਕਰਕੇ .env ਵਿੱਚ ਜੋੜੋ।",
    fetchError: "ਮੌਸਮ ਡਾਟਾ ਲਿਆ ਨਹੀਂ ਜਾ ਸਕਿਆ।",
    netError: "ਮੌਸਮ ਡਾਟਾ ਲੈਂਦੇ ਸਮੇਂ ਨੈੱਟਵਰਕ ਗਲਤੀ।",
    locDetected: "ਥਾਂ ਪਛਾਣੀ ਗਈ",
    lastUpdated: "ਆਖਰੀ ਅੱਪਡੇਟ",
    noRainMsg:
      "ਅੱਜ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਘੱਟ ਹੈ। ਕਿਸਾਨਾਂ ਨੂੰ ਸਿੰਚਾਈ ਕਰਨ ਦੀ ਸਲਾਹ ਦਿਉ।",
    soilOk:
      "ਮਿੱਟੀ ਵਿੱਚ ਨਮੀ ਵਧੀਆ ਲੱਗ ਰਹੀ ਹੈ। ਅੱਜ ਸਿੰਚਾਈ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।",
    highTempLowHum:
      "ਤਾਪਮਾਨ ਜ਼ਿਆਦਾ ਅਤੇ ਨਮੀ ਘੱਟ ਹੈ। ਢੁਕਵੀਂ ਸਿੰਚਾਈ ਦੀ ਸਲਾਹ ਦਿਓ।",
    lightIrr: "ਫਸਲ ਦੀ ਸਿਹਤ ਲਈ ਹਲਕੀ ਸਿੰਚਾਈ ਦੀ ਸਿਫ਼ਾਰਿਸ਼ ਹੈ।",
    monitorIrr:
      "ਮਿੱਟੀ ਦੀ ਨਮੀ ‘ਤੇ ਨਜ਼ਰ ਰੱਖੋ ਅਤੇ ਸੁੱਕਣ ‘ਤੇ ਸਿੰਚਾਈ ਦੀ ਸਲਾਹ ਦਿਓ।",
    irrChecking: "ਸਿੰਚਾਈ ਦੀ ਸਥਿਤੀ ਜਾਂਚੀ ਜਾ ਰਹੀ ਹੈ...",
    irrNone: "ਸਿੰਚਾਈ ਦੀ ਲੋੜ ਨਹੀਂ",
    irrRecommended: "ਸਿੰਚਾਈ ਦੀ ਸਿਫ਼ਾਰਿਸ਼ ਕੀਤੀ ਗਈ",
    irrLight: "ਹਲਕੀ ਸਿੰਚਾਈ ਸੁਝਾਈ ਗਈ",
    irrMonitor: "ਸਿੰਚਾਈ ‘ਤੇ ਨਜ਼ਰ ਰੱਖੋ",
    pestTitle: "ਕੀਟ ਪਹਿਚਾਣ ਅਤੇ ਹੱਲ",
    pestSub: "ਕਿਸਾਨਾਂ ਦੇ ਖੇਤਾਂ ‘ਚ ਬਿਮਾਰੀਆਂ ਪਛਾਣੋ ਅਤੇ ਇਲਾਜ ਦਿਓ।",
    pestCta: "ਕੀਟ ਪਹਿਚਾਣ ਖੋਲ੍ਹੋ",
    mandiTitle: "ਮੰਡੀ ਭਾਅ",
    mandiSub: "ਮੁੱਖ ਫਸਲਾਂ ਦੇ ਲਾਈਵ ਮੰਡੀ ਭਾਅ ਵੇਖੋ।",
    mandiCta: "ਮੰਡੀ ਭਾਅ ਵੇਖੋ",
    advisorTitle: "ਕਿਸਾਨ ਸਲਾਹਕਾਰ",
    advisorSub: "ਆਪਣੇ ਕਿਸਾਨਾਂ ਲਈ ਵਿਸਥਾਰ ਵਿੱਚ ਫਸਲ ਸਲਾਹ ਬਣਾਓ।",
    advisorCta: "ਸਲਾਹਕਾਰ ਖੋਲ੍ਹੋ",
    mitraTitle: "ਕਿਸਾਨ ਮਿੱਤਰ ਚੈਟਬੋਟ",
    mitraSub: "ਖੇਤ ਪੱਧਰ ਦੇ ਸਵਾਲਾਂ ਦੇ ਤੁਰੰਤ ਜਵਾਬ ਲਵੋ।",
    mitraCta: "ਕਿਸਾਨ ਮਿੱਤਰ ਨਾਲ ਗੱਲਬਾਤ ਕਰੋ",
    scanBtn: "ਫਸਲ ਸਕੈਨ ਕਰੋ",
    settingsTitle: "ਸੈਟਿੰਗਜ਼",
    settingsSub: "ਆਪਣੀਆਂ ਪਸੰਦਾਂ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ",
    profile: "ਪ੍ਰੋਫ਼ਾਈਲ",
    profileSub: "ਆਪਣੀ ਜਾਣਕਾਰੀ ਅੱਪਡੇਟ ਕਰੋ",
    langMenu: "ਭਾਸ਼ਾ",
    langMenuSub: "ਐਪ ਦੀ ਭਾਸ਼ਾ ਬਦਲੋ",
    privacy: "ਪਰਾਈਵੇਸੀ",
    privacySub: "ਆਪਣੇ ਡਾਟਾ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ",
    help: "ਮਦਦ",
    helpSub: "ਸਹਾਇਤਾ ਪ੍ਰਾਪਤ ਕਰੋ",
    about: "ਸਾਡੇ ਬਾਰੇ",
    aboutSub: "ਐਪ ਜਾਣਕਾਰੀ",
    logout: "ਲਾਗਆਊਟ",
    logoutSub: "ਆਪਣੇ ਖਾਤੇ ਤੋਂ ਸਾਇਨ ਆਉਟ ਕਰੋ",
    weatherAlerts: "ਮੌਸਮ ਅਲਰਟ",
    weatherAlertsSub: "ਮੌਸਮ ਬਾਰੇ ਜਾਣਕਾਰੀ ਲਵੋ",
    diseaseAlerts: "ਫਸਲ ਬਿਮਾਰੀ ਅਲਰਟ",
    diseaseAlertsSub: "ਬਿਮਾਰੀ ਪਹਿਚਾਣ ਜਾਣਕਾਰੀ",
    priceUpdates: "ਮੰਡੀ ਭਾਅ ਅਪਡੇਟ",
    priceUpdatesSub: "ਨਵੇਂ ਭਾਅ ਪ੍ਰਾਪਤ ਕਰੋ",
    adviceTips: "ਸਲਾਹ ਟਿੱਪਸ",
    adviceTipsSub: "ਖੇਤੀਬਾੜੀ ਸਲਾਹ",
    appInfoTitle: "ਕਿਸਾਨ ਮਿੱਤਰ",
    appInfoSub: "ਏਆਈ ਆਧਾਰਿਤ ਖੇਤੀਬਾੜੀ ਸਲਾਹ",
    footer: "ਕਿਸਾਨ ਮਿੱਤਰ — ਏਆਈ ਆਧਾਰਿਤ ਖੇਤੀਬਾੜੀ ਸਲਾਹ",
  },
};

export default function Home() {
  const { language } = useLanguage();
  const text = officerDashboardTexts[language] || officerDashboardTexts.en;

  const [weather, setWeather] = useState(null);
  const [coords, setCoords] = useState(null);
  const [locationMsg, setLocationMsg] = useState(text.detectingLocation);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const effectiveKey = ENV_KEY;
  const [officerProfile, setOfficerProfile] = useState(() => {
    try {
      const keys = ["farmerProfile", "userProfile", "agroUser"];
      for (const k of keys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (parsed && (parsed.fullName || parsed.email)) return parsed;
          } catch {}
        }
      }
      const name = localStorage.getItem("displayName") || localStorage.getItem("userName") || "Officer";
      const email = localStorage.getItem("userEmail") || "";
      return { fullName: name, email };
    } catch {
      return { fullName: "Officer", email: "" };
    }
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationMsg(text.geoNotSupported);
      return;
    }

    setLoadingLocation(true);
    setLocationMsg(text.detectingLocation);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
        setLoadingLocation(false);
      },
      (err) => {
        setLoadingLocation(false);
        if (err.code === 1) setLocationMsg(text.permDenied);
        else if (err.code === 2) setLocationMsg(text.posUnavailable);
        else if (err.code === 3) setLocationMsg(text.timeout);
        else setLocationMsg(text.locFailed);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [text]);

  const fetchWeather = useCallback(async () => {
    if (!effectiveKey) {
      setErrorMsg(text.noApiKey);
      return;
    }
    if (!coords) return;

    try {
      setLoadingWeather(true);
      setErrorMsg(null);

      const q = `${coords.lat},${coords.lon}`;
      const url = `https://api.weatherapi.com/v1/current.json?key=${encodeURIComponent(
        effectiveKey
      )}&q=${encodeURIComponent(q)}&aqi=yes`;

      const res = await fetch(url);
      const json = await res.json();

      if (json?.error) {
        setErrorMsg(json.error.message || text.fetchError);
        setWeather(null);
      } else {
        setWeather(json);
        const locText = json.location
          ? `${text.locDetected}: ${json.location.name}${
              json.location.region ? ", " + json.location.region : ""
            }`
          : `${text.locDetected}.`;
        setLocationMsg(locText);
      }
    } catch {
      setErrorMsg(text.netError);
    } finally {
      setLoadingWeather(false);
    }
  }, [coords, effectiveKey, text]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    const handle = (e) => {
      const p = e?.detail || officerProfile;
      setOfficerProfile(p);
    };
    window.addEventListener("agroProfileUpdated", handle);
    return () => window.removeEventListener("agroProfileUpdated", handle);
  }, []);

  const { currentUser, logout } = useAuth();

  const navigateToProfile = async () => {
    try {
      let role = officerProfile?.role || (() => {
        const raw = localStorage.getItem("userProfile") || localStorage.getItem("farmerProfile");
        if (!raw) return null;
        try {
          const parsed = JSON.parse(raw);
          return parsed?.role || null;
        } catch {
          return null;
        }
      })();

      if (!role && currentUser && currentUser.uid) {
        try {
          const snap = await getDoc(doc(db, "users", currentUser.uid));
          if (snap && snap.exists()) {
            const data = snap.data();
            if (data?.role) role = data.role;

            const stored = {
              fullName: data?.displayName || localStorage.getItem("displayName") || currentUser.displayName || "Officer",
              email: data?.email || currentUser.email || "",
              role: role || null,
            };
            try {
              localStorage.setItem("userProfile", JSON.stringify(stored));
              localStorage.setItem("farmerProfile", JSON.stringify(stored));
              localStorage.setItem("agroUser", JSON.stringify(stored));
              localStorage.setItem("displayName", stored.fullName);
              localStorage.setItem("userName", stored.fullName);
              localStorage.setItem("userEmail", stored.email || "");
              window.dispatchEvent(new CustomEvent("agroProfileUpdated", { detail: stored }));
            } catch (e) {}
          }
        } catch (e) {
          console.warn("Could not fetch user role:", e);
        }
      }

      if (role === "field_officer" || role === "officer") {
        navigate("/field-officer-profile");
      } else {
        navigate("/farmer-profile");
      }
    } catch (e) {
      navigate("/field-officer-profile");
    }
  };

  useEffect(() => {
    if (coords) fetchWeather();
  }, [coords, fetchWeather]);

  useEffect(() => {
    if (!coords || !effectiveKey) return;
    const id = setInterval(fetchWeather, 1800000);
    return () => clearInterval(id);
  }, [coords, effectiveKey, fetchWeather]);

  useEffect(() => {
    document.body.classList.toggle("sidebar-open", sheetOpen);
  }, [sheetOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const isLoading = loadingLocation || loadingWeather;

  const tempC = weather?.current?.temp_c ?? null;
  const conditionText = weather?.current?.condition?.text || "--";
  const windKph = weather?.current?.wind_kph ?? null;
  const windDir = weather?.current?.wind_dir ?? "--";
  const windDegree = weather?.current?.wind_degree ?? null;
  const humidity = weather?.current?.humidity ?? null;
  const clouds = weather?.current?.cloud ?? null;
  const lastUpdated = weather?.current?.last_updated ?? "--";

  const aqi = weather?.current?.air_quality?.["pm2_5"] ?? null;

  const aqiCategory = () => {
    if (aqi === null) return "--";
    if (aqi <= 30) return "Excellent";
    if (aqi <= 60) return "Good";
    if (aqi <= 90) return "Moderate";
    if (aqi <= 120) return "Poor";
    if (aqi <= 250) return "Very Poor";
    return "Hazardous";
  };

  const irrigationRecommendation = () => {
    if (!weather?.current) return text.noRainMsg;
    const hum = Number(humidity ?? 0);
    const temp = Number(tempC ?? 0);
    const cloud = Number(clouds ?? 0);

    if (hum > 70 || cloud > 60) return text.soilOk;
    if (temp > 32 && hum < 50) return text.highTempLowHum;
    if (cloud < 30 && temp > 28) return text.lightIrr;
    return text.monitorIrr;
  };

  const irrigationTitle = () => {
    if (!weather?.current) return text.irrChecking;
    const hum = Number(humidity ?? 0);
    const temp = Number(tempC ?? 0);
    const cloud = Number(clouds ?? 0);

    if (hum > 70 || cloud > 60) return text.irrNone;
    if (temp > 32 && hum < 50) return text.irrRecommended;
    if (cloud < 30 && temp > 28) return text.irrLight;
    return text.irrMonitor;
  };

  const weatherBgClass = () => {
    const t = (conditionText || "").toLowerCase();
    if (t.includes("rain") || t.includes("shower")) return "weather-rainy";
    if (t.includes("cloud") || t.includes("overcast")) return "weather-cloudy";
    if (t.includes("storm") || t.includes("thunder")) return "weather-storm";
    if (t.includes("snow")) return "weather-snow";
    return "weather-sunny";
  };

  const WeatherIcon = () => {
    const t = conditionText.toLowerCase();
    if (t.includes("rain")) return <CloudRain />;
    if (t.includes("cloud")) return <Cloud />;
    if (t.includes("storm")) return <CloudRain />;
    if (t.includes("snow")) return <Cloud />;
    return <Sun />;
  };

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleLogout = () => {
    (async () => {
      try {
        await logout();
      } catch (e) {
        console.warn("Logout failed:", e);
      }
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {}
      navigate("/");
    })();
  };

  const isActive = (path) =>
    location.pathname === path ? "active-nav-btn" : "";

  return (
    <>
      <div
        id="overlay"
        className={sheetOpen ? "active" : ""}
        onClick={() => setSheetOpen(false)}
      ></div>

      <div className="dashboard">
        {/* TOP BAR WITH BRAND + PILL NAV */}
        <div className="topbar">
          <div className="brand">
            <div className="brand-icon">🌱</div>
            <div className="brand-text">
              <div className="brand-title">{text.brandTitle}</div>
              <div className="brand-subtitle">{text.brandSubtitle}</div>
            </div>
          </div>

          <div className="nav-pill">
            <button
              className={isActive("/field-officer/dashboard")}
              onClick={() => navigate("/field-officer/dashboard")}
            >
              <HomeIcon />
              <span className="nav-label">{text.navHome}</span>
            </button>
            <button
              className={isActive("/manager")}
              onClick={() => navigate("/manager")}
            >
              <Sprout />
              <span className="nav-label">{text.navCrops}</span>
            </button>
            <button
              className={isActive("/weather")}
              onClick={() => navigate("/weather")}
            >
              <Sun />
              <span className="nav-label">{text.navWeather}</span>
            </button>
            <button
              className={isActive("/settings")}
              onClick={() => setSheetOpen(true)}
            >
              <Settings />
              <span className="nav-label">{text.navSettings}</span>
            </button>
            <button
              className={isActive("/language")}
              onClick={() => navigate("/language")}
            >
              <Globe />
              <span className="nav-label">{text.navLanguage}</span>
            </button>
            <button
              className={isActive("/about")}
              onClick={() => navigate("/about")}
            >
              <Globe />
              <span className="nav-label">{text.navAbout}</span>
            </button>
          </div>
        </div>

        {/* EVERYTHING BELOW IS INSIDE page-inner */}
        <div className="page-inner">
          {/* GREETING BAR */}
          <section className="greeting-card">
            <div className="section-inner">
              <h1>{text.greeting}</h1>
              <p className="greeting-date">{today}</p>
            </div>
          </section>

          {/* WEATHER CARD */}
          <section className="weather-shell">
            <div className="section-inner">
              <div className="location-row">
                <MapPin />
                <span>
                  {locationMsg}
                  {isLoading ? " (Loading...)" : ""}
                </span>
              </div>

              {errorMsg && <div className="error-box">{errorMsg}</div>}

              <div className={`weather-card-new ${weatherBgClass()}`}>
                <div className="weather-left">
                  <div className="weather-icon-big">
                    <WeatherIcon />
                  </div>
                  <div className="weather-main-info">
                    <div className="temp-row">
                      <span className="temperature-big">
                        {tempC !== null ? `${Math.round(tempC)}°C` : "--°C"}
                      </span>
                      <span className="badge">{conditionText}</span>
                    </div>
                    <p className="weather-desc-main">
                      {weather?.current?.condition?.text || "Fetching weather..."}
                    </p>
                  </div>
                </div>

                <div className="weather-right">
                  <div>
                    <Wind /> {windKph !== null ? `${windKph} km/h` : "--"}
                  </div>
                  <div>
                    <Wind /> Direction: {windDir}{" "}
                    {windDegree !== null ? `(${windDegree}°)` : ""}
                  </div>
                  <div>
                    <Droplets />{" "}
                    {humidity !== null ? `${humidity}% humidity` : "--"}
                  </div>
                  <div>
                    <CloudRain />{" "}
                    {clouds !== null ? `${clouds}% cloudiness` : "--"}
                  </div>
                  <div>
                    <Sun /> AQI:{" "}
                    {aqi !== null
                      ? `${Math.round(aqi)} (${aqiCategory()})`
                      : "--"}
                  </div>
                </div>
              </div>

              <div className="last-updated-row">
                {text.lastUpdated}: {lastUpdated}
              </div>
            </div>
          </section>

          {/* IRRIGATION BANNER */}
          <section className="irrigation-banner">
            <div className="section-inner irrigation-inner">
              <div className="drop-icon">💧</div>
              <div>
                <h4>{irrigationTitle()}</h4>
                <p>{irrigationRecommendation()}</p>
              </div>
            </div>
          </section>

          <main className="features-grid">
            <div className="section-inner features-grid-inner">
              {/* Pest Detection */}
              <div
                className="feature-card"
                onClick={() => navigate("/Solution")}
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1728297753604-d2e129bdb226?...')",
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("/Solution")}
              >
                <div className="feature-content">
                  <h2>{text.pestTitle}</h2>
                  <p>{text.pestSub}</p>
                  <span className="feature-link">
                    {text.pestCta} <ChevronRight />
                  </span>
                </div>
              </div>

              {/* Mandi Prices */}
              <div
                className="feature-card"
                onClick={() => navigate("/mandi")}
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1637426992376-b8af65fb90d7?...')",
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("/mandi")}
              >
                <div className="feature-content">
                  <h2>{text.mandiTitle}</h2>
                  <p>{text.mandiSub}</p>
                  <span className="feature-link">
                    {text.mandiCta} <ChevronRight />
                  </span>
                </div>
              </div>

              {/* Farmer Advisor */}
              <div
                className="feature-card"
                onClick={() => navigate("/field-officer/advisor")}
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1599320092708-8a9dde49fc2c?...')",
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && navigate("/field-officer/advisor")
                }
              >
                <div className="feature-content">
                  <h2>{text.advisorTitle}</h2>
                  <p>{text.advisorSub}</p>
                  <span className="feature-link">
                    {text.advisorCta} <ChevronRight />
                  </span>
                </div>
              </div>

              {/* Kisan Mitra */}
              <div
                className="feature-card"
                onClick={() => navigate("/assistant")}
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1595956481935-a9e254951d49?...')",
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate("/assistant")}
              >
                <div className="feature-content">
                  <h2>{text.mitraTitle}</h2>
                  <p>{text.mitraSub}</p>
                  <span className="feature-link">
                    {text.mitraCta} <ChevronRight />
                  </span>
                </div>
              </div>
            </div>
          </main>

          {/* FLOATING SCAN BUTTON */}
          <button
            className="scan-btn"
            onClick={() => navigate("/Solution")}
            aria-label="Scan crop"
          >
            <div className="scan-icon">📷</div>
            <span>{text.scanBtn}</span>
          </button>

          {/* SIDEBAR SHEET */}
          <div className={`sheet ${sheetOpen ? "open" : ""}`}>
            <div className="sheet-header">
              <h2>{text.settingsTitle}</h2>
              <p>{text.settingsSub}</p>
            </div>

            <div className="profile-card">
              <div className="profile-avatar">{(officerProfile?.fullName || "O").charAt(0).toUpperCase()}</div>
              <div className="profile-info">
                <h3>{officerProfile?.fullName || "Officer"}</h3>
                <p>
                  <MapPin style={{ width: 12, height: 12 }} /> {locationMsg || (officerProfile?.location || "Unknown")}
                </p>
                <p>{text.profile}</p>
              </div>
              <ChevronRight className="chevron" />
            </div>

            <div className="menu">
              <button onClick={navigateToProfile}>
                <div className="menu-icon">
                  <User />
                </div>
                <div className="menu-text">
                  <h4>{text.profile}</h4>
                  <p>{text.profileSub}</p>
                </div>
                <ChevronRight className="chevron" />
              </button>

              <button>
                <div className="menu-icon">
                  <Globe />
                </div>
                <div className="menu-text">
                  <h4>{text.langMenu}</h4>
                  <p>{text.langMenuSub}</p>
                </div>
                <ChevronRight className="chevron" />
              </button>

              <button>
                <div className="menu-icon">
                  <Shield />
                </div>
                <div className="menu-text">
                  <h4>{text.privacy}</h4>
                  <p>{text.privacySub}</p>
                </div>
                <ChevronRight className="chevron" />
              </button>

              <button>
                <div className="menu-icon">
                  <HelpCircle />
                </div>
                <div className="menu-text">
                  <h4>{text.help}</h4>
                  <p>{text.helpSub}</p>
                </div>
                <ChevronRight className="chevron" />
              </button>

              <button onClick={() => navigate("/about")}>
                <div className="menu-icon">
                  <Info />
                </div>
                <div className="menu-text">
                  <h4>{text.about}</h4>
                  <p>{text.aboutSub}</p>
                </div>
                <ChevronRight className="chevron" />
              </button>

              <button onClick={handleLogout}>
                <div className="menu-icon">
                  <LogOut />
                </div>
                <div className="menu-text">
                  <h4>{text.logout}</h4>
                  <p>{text.logoutSub}</p>
                </div>
                <ChevronRight className="chevron" />
              </button>
            </div>

            <div className="separator"></div>

            <div className="notification-section">
              <div className="notification-item">
                <div
                  className="notification-icon"
                  style={{ background: "#dbeafe" }}
                >
                  <Cloud style={{ color: "#2563eb" }} />
                </div>
                <div className="notification-text">
                  <p>{text.weatherAlerts}</p>
                  <span>{text.weatherAlertsSub}</span>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div
                  className="notification-icon"
                  style={{ background: "#fee2e2" }}
                >
                  <Bug style={{ color: "#dc2626" }} />
                </div>
                <div className="notification-text">
                  <p>{text.diseaseAlerts}</p>
                  <span>{text.diseaseAlertsSub}</span>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div
                  className="notification-icon"
                  style={{ background: "#EFF6FF" }}
                >
                  <DollarSign style={{ color: "#2563EB" }} />
                </div>
                <div className="notification-text">
                  <p>{text.priceUpdates}</p>
                  <span>{text.priceUpdatesSub}</span>
                </div>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div
                  className="notification-icon"
                  style={{ background: "#fef9c3" }}
                >
                  <Lightbulb style={{ color: "#ca8a04" }} />
                </div>
                <div className="notification-text">
                  <p>{text.adviceTips}</p>
                  <span>{text.adviceTipsSub}</span>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="app-info">
              <div style={{ fontSize: 22 }}>🌾</div>
              <h4>{text.appInfoTitle}</h4>
              <p>Version 1.0.0</p>
              <p>{text.appInfoSub}</p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="footer">{text.footer}</footer>
      </div>
    </>
  );
}
