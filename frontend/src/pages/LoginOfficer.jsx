// src/pages/LoginOfficer.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/LoginOfficer.css";

import { useLanguage } from "../context/LanguageContext";

import logo from "../assets/kisanmitr_logo.jpg";
import heroImg from "../assets/login_crop.jpg";

const officerTexts = {
  en: {
    appName: "Kisan Mitra",
    welcome: "Namaste Officer!",
    subtitle: "Please login to continue",
    loginTitle: "Login",
    email: "Email Address",
    phone: "Phone",
    password: "Password",
    enterPassword: "Enter your password",
    rememberMe: "Remember Me",
    forgotPassword: "Forgot Password?",
    login: "Login",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    errors: {
      fillAll: "Please fill all fields",
    },
  },
  hi: {
    appName: "किसान मित्र",
    welcome: "नमस्ते अधिकारी!",
    subtitle: "जारी रखने के लिए लॉगिन करें",
    loginTitle: "लॉगिन",
    email: "ईमेल पता",
    phone: "फ़ोन",
    password: "पासवर्ड",
    enterPassword: "अपना पासवर्ड दर्ज करें",
    rememberMe: "मुझे याद रखें",
    forgotPassword: "पासवर्ड भूल गए?",
    login: "लॉगिन",
    noAccount: "कोई खाता नहीं है?",
    signUp: "साइन अप करें",
    errors: {
      fillAll: "कृपया सभी जानकारी भरें",
    },
  },
  bn: {
    appName: "কিষাণ মিত্র",
    welcome: "নমস্কার অফিসার!",
    subtitle: "চালিয়ে যেতে লগইন করুন",
    loginTitle: "লগইন",
    email: "ইমেল ঠিকানা",
    phone: "ফোন",
    password: "পাসওয়ার্ড",
    enterPassword: "আপনার পাসওয়ার্ড লিখুন",
    rememberMe: "আমাকে মনে রাখুন",
    forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
    login: "লগইন",
    noAccount: "অ্যাকাউন্ট নেই?",
    signUp: "সাইন আপ করুন",
    errors: {
      fillAll: "দয়া করে সব ঘর পূরণ করুন",
    },
  },
  pa: {
    appName: "ਕਿਸਾਨ ਮਿੱਤਰ",
    welcome: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਅਫਸਰ!",
    subtitle: "ਅੱਗੇ ਵੱਧਣ ਲਈ ਲਾਗਿਨ ਕਰੋ",
    loginTitle: "ਲਾਗਿਨ",
    email: "ਈਮੇਲ ਐਡਰੈੱਸ",
    phone: "ਫੋਨ",
    password: "ਪਾਸਵਰਡ",
    enterPassword: "ਆਪਣਾ ਪਾਸਵਰਡ ਦਾਖਲ ਕਰੋ",
    rememberMe: "ਮੈਨੂੰ ਯਾਦ ਰੱਖੋ",
    forgotPassword: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
    login: "ਲਾਗਿਨ",
    noAccount: "ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    signUp: "ਸਾਇਨ ਅੱਪ ਕਰੋ",
    errors: {
      fillAll: "ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖੇਤਰ ਭਰੋ",
    },
  },
};

function LoginOfficer() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { login, setPersistenceForRemember, getCurrentUserToken } = useAuth();
  const text = officerTexts[language] || officerTexts.en;

  const [isEmail, setIsEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    emailOrPhone: "",
    password: "",
  });

  const handleInput = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleLogin = async () => {
    setError("");
    if (!form.emailOrPhone || !form.password) {
      alert(text.errors.fillAll);
      return;
    }

    if (!isEmail) {
      // phone login not implemented
      alert(text.errors.fillAll);
      return;
    }

    setLoading(true);
    try {
      try {
        await setPersistenceForRemember(remember);
      } catch (persistErr) {
        console.warn("Could not set persistence:", persistErr);
      }

      // Sign in first
      const cred = await login(form.emailOrPhone, form.password);

      // Generate Firebase ID token and verify with backend
      const token = await getCurrentUserToken();
      const verifyResp = await fetch("https://auth-backend-285018970008.asia-south1.run.app/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // verification check optional
      alert("User verified!");

      // Push officer data to backend
      try {
        await fetch("https://auth-backend-285018970008.asia-south1.run.app/data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            data: {
              name:
                (cred?.user && (cred.user.displayName || localStorage.getItem("displayName"))) ||
                "Officer",
              email: cred?.user?.email || form.emailOrPhone,
              phone: "",
              address: "",
              preferences: {
                theme: "light",
                notifications: true,
              },
            },
            collection: "user_data",
          }),
        });
      } catch (pushErr) {
        console.warn("Could not push officer data to backend:", pushErr);
      }

      // persist a lightweight profile for routing/UX (used by dashboards)
      try {
        const user = cred && cred.user ? cred.user : null;
        const stored = {
          fullName: (user && (user.displayName || localStorage.getItem("displayName"))) || "Officer",
          email: (user && user.email) || form.emailOrPhone,
          role: "field_officer",
        };
        localStorage.setItem("userProfile", JSON.stringify(stored));
        localStorage.setItem("farmerProfile", JSON.stringify(stored));
        localStorage.setItem("kisanUser", JSON.stringify(stored));
        localStorage.setItem("displayName", stored.fullName);
        localStorage.setItem("userName", stored.fullName);
        localStorage.setItem("userEmail", stored.email || "");
        window.dispatchEvent(new CustomEvent("kisanProfileUpdated", { detail: stored }));
      } catch (e) {
        console.warn("Could not persist officer profile to localStorage:", e);
      }

      navigate("/field-officer/dashboard");
    } catch (err) {
      console.error("Officer login error:", err);
      setError(err?.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="officerlog-container">
      {/* HEADER SECTION */}
      <div className="officerlog-header">
        <div className="officerlog-logo">
          <img src={logo} alt="logo" />
          <h1>{text.appName}</h1>
        </div>
        {/* badge removed; not used */}
      </div>

      {/* HERO SECTION */}
      <div className="officerlog-hero">
        <img src={heroImg} alt="Smart Farming" />
        <div className="officerlog-hero-overlay">
          <div>
            <h1>{text.welcome}</h1>
            <p>{text.subtitle}</p>
          </div>
        </div>
      </div>

      {/* LOGIN CARD */}
      <div className="officerlog-card">
        <h3>{text.loginTitle}</h3>

        {/* TOGGLE EMAIL / PHONE */}
        <div className="officerlog-toggle-buttons">
          <button
            type="button"
            className={isEmail ? "active" : ""}
            onClick={() => setIsEmail(true)}
          >
            {text.email}
          </button>

          <button
            type="button"
            className={!isEmail ? "active" : ""}
            onClick={() => setIsEmail(false)}
          >
            {text.phone}
          </button>
        </div>

        {/* INPUT FIELD */}
        <div className="officerlog-form-group">
          <label>{isEmail ? text.email : text.phone}</label>
          <input
            type={isEmail ? "email" : "tel"}
            name="emailOrPhone"
            placeholder={isEmail ? "officer@example.com" : "+91 98765 43210"}
            onChange={handleInput}
          />
        </div>

        {/* PASSWORD */}
        <div className="officerlog-form-group officerlog-password-wrapper">
          <label>{text.password}</label>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder={text.enterPassword}
            onChange={handleInput}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "👁" : "👁‍🗨"}
          </button>
        </div>

        {/* OPTIONS */}
        <div className="officerlog-options">
          <label>
            <input type="checkbox" />
            <span>{text.rememberMe}</span>
          </label>

          <a href="#">{text.forgotPassword}</a>
        </div>

        {/* LOGIN BUTTON */}
        <button className="officerlog-btn-1" onClick={handleLogin}>
          {text.login}
        </button>

        {/* SIGNUP */}
        <div className="officerlog-signup">
          <span>{text.noAccount}</span>
          <Link to="/signupofficer" className="signup-link">
            {text.signUp}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginOfficer;
