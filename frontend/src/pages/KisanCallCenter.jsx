// src/pages/KisanCallCenter.jsx
// ==============================================================================
// KRISHI SATHI (କୃଷି ସାଥୀ / कृषि साथी) - AI VOICE HELPLINE
// Designed for Indian Farmers • 100% Clean, Beginner-Friendly React Code
// ==============================================================================

import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  ArrowLeft,
  Globe,
  Sparkles,
  ChevronRight,
  Wifi,
  WifiOff,
  History,
  Plus,
  Trash2,
  Send,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { offlineVoiceAgent, speakOfflineText } from "../utils/offlineAgronomy";
import { callTranslations, getFarmerName, getGreeting } from "../data/callTranslations";
import "../styles/KisanCallCenter.css";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function KisanCallCenter() {
  const navigate = useNavigate();
  const { language: contextLang, setLanguage: setContextLang, languages } = useLanguage();

  // ============================================================================
  // STEP 1: SIMPLE STATE VARIABLES (Everything the screen needs to remember)
  // ============================================================================
  const [language, setLanguage] = useState(
    contextLang || localStorage.getItem("kisan_mitra_lang") || "hi"
  );
  const [callState, setCallState] = useState("idle"); // "idle" -> "ringing" -> "connected"
  const [isRecording, setIsRecording] = useState(false); // Farmer is speaking into mic
  const [isAiSpeaking, setIsAiSpeaking] = useState(false); // Krishi Sathi female voice is playing
  const [isAiThinking, setIsAiThinking] = useState(false); // Waiting for AI response
  const [isSpeakerOn, setIsSpeakerOn] = useState(true); // Voice sound on or muted
  const [currentSpeech, setCurrentSpeech] = useState(""); // Live words as farmer speaks
  const [textInput, setTextInput] = useState(""); // Optional typed text
  const [callDuration, setCallDuration] = useState(0); // Timer seconds
  const [errorMessage, setErrorMessage] = useState(""); // Error alert if any
  const [aiEngineMode, setAiEngineMode] = useState("gemini"); // "gemini" or "offline"
  const [conversation, setConversation] = useState([]); // List of messages in current call
  const [showHistory, setShowHistory] = useState(false); // Past calls drawer open/closed

  // Load saved past consultations from browser storage
  const [historyList, setHistoryList] = useState(() => {
    try {
      const saved = localStorage.getItem("kisan_call_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current session tracking ID
  const currentSessionIdRef = useRef("session_" + Date.now());

  // HTML5 Audio Player for pure natural female voice playback
  const audioPlayerRef = useRef(new Audio());

  // Browser Speech Recognition instance
  const recognitionRef = useRef(null);

  // Live speech buffer ref so words are never lost in React stale closures
  const speechBufferRef = useRef("");

  // Auto-silence timer: sends question automatically when farmer finishes speaking
  const silenceTimerRef = useRef(null);

  // Auto-scroll chat container to bottom when new messages arrive
  const chatScrollRef = useRef(null);

  // Active translations for current language
  const t = callTranslations[language] || callTranslations.hi || callTranslations.en;

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [conversation, currentSpeech, isAiThinking]);

  // Sync language with global app context
  useEffect(() => {
    if (contextLang && contextLang !== language) {
      setLanguage(contextLang);
    }
  }, [contextLang]);

  // Call duration timer (increments every second while connected)
  useEffect(() => {
    let timer = null;
    if (callState === "connected") {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [callState]);

  // Cleanup on page leave (hang up call & stop audio)
  useEffect(() => {
    return () => {
      handleEndCall();
    };
  }, []);

  // Format seconds into MM:SS (e.g. 65 -> "01:05")
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${rem.toString().padStart(2, "0")}`;
  };

  // Switch language
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (setContextLang) setContextLang(newLang);
    localStorage.setItem("kisan_mitra_lang", newLang);
    recognitionRef.current = null;
  };

  useEffect(() => {
    recognitionRef.current = null;
  }, [language]);

  // ============================================================================
  // STEP 2: AUDIO PLAYBACK (Natural Female Voice from Backend)
  // ============================================================================
  const playBase64Audio = (b64Audio) => {
    try {
      // Cancel any legacy browser voice to avoid overlapping
      if (window.speechSynthesis) window.speechSynthesis.cancel();

      const audio = audioPlayerRef.current;
      if (!audio) return;

      audio.pause();
      audio.src = `data:audio/mp4;base64,${b64Audio}`;
      setIsAiSpeaking(true);

      audio.play().catch((err) => {
        console.warn("Audio autoplay blocked by browser policy:", err);
      });

      audio.onended = () => {
        setIsAiSpeaking(false);
      };

      audio.onerror = () => {
        setIsAiSpeaking(false);
      };
    } catch (e) {
      console.warn("Audio playback issue:", e);
      setIsAiSpeaking(false);
    }
  };

  // ============================================================================
  // STEP 3: MICROPHONE & SPEECH-TO-TEXT (Farmer Voice Recognition)
  // ============================================================================
  const stopAndSendSpeech = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsRecording(false);

    const captured = speechBufferRef.current.trim();
    speechBufferRef.current = "";
    setCurrentSpeech("");

    if (captured) {
      sendVoiceTurn(captured);
    }
  };

  const createRecognizer = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;
    if (!SpeechRecognition) return null;

    const recog = new SpeechRecognition();
    const langCodeMap = {
      en: "en-IN",
      hi: "hi-IN",
      bn: "bn-IN",
      pa: "pa-IN",
      // Chrome lacks native Odia STT; hi-IN phonetically captures Indian regional speech
      or: "hi-IN",
    };
    recog.lang = langCodeMap[language] || "hi-IN";
    recog.continuous = true;
    recog.interimResults = true;

    recog.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      if (final) {
        speechBufferRef.current = (speechBufferRef.current + " " + final).trim();
      }

      const liveDisplay = (speechBufferRef.current + " " + interim).trim();
      setCurrentSpeech(liveDisplay);

      // Auto-send on natural pause: If farmer pauses for 1.4s, auto-send to AI!
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (liveDisplay.length > 1) {
        silenceTimerRef.current = setTimeout(() => {
          stopAndSendSpeech();
        }, 1400);
      }
    };

    recog.onerror = (event) => {
      console.warn("Speech recognition notice:", event.error);
      if (event.error === "not-allowed") {
        setErrorMessage("Microphone access denied. Please allow microphone in your browser URL bar.");
      }
      setIsRecording(false);
    };

    recog.onend = () => {
      setIsRecording(false);
      // If mic ended naturally and we have speech buffered, send it!
      if (speechBufferRef.current.trim()) {
        stopAndSendSpeech();
      }
    };

    return recog;
  };

  // Toggle Microphone (Start / Stop talking)
  const toggleRecording = () => {
    // If Krishi Sathi is talking, interrupt her gently when farmer wants to speak
    if (isAiSpeaking) {
      audioPlayerRef.current.pause();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }

    if (isRecording) {
      stopAndSendSpeech();
    } else {
      speechBufferRef.current = "";
      setCurrentSpeech("");
      setErrorMessage("");

      let recog = recognitionRef.current;
      if (!recog) {
        recog = createRecognizer();
        recognitionRef.current = recog;
      }

      if (recog) {
        try {
          recog.start();
          setIsRecording(true);
        } catch (err) {
          try {
            recog.stop();
            setTimeout(() => {
              recog.start();
              setIsRecording(true);
            }, 150);
          } catch (e2) {
            console.warn("Recog start error:", e2);
          }
        }
      } else {
        setErrorMessage("Microphone recognition not supported in this browser. Please type below.");
      }
    }
  };

  // ============================================================================
  // STEP 4: SEND QUESTION TO AI & RECEIVE NATURAL FEMALE ANSWER
  // ============================================================================
  const sendVoiceTurn = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    // 1. Immediately show farmer message on screen
    const updatedConvo = [...conversation, { role: "user", text: queryText }];
    setConversation(updatedConvo);
    saveSession(updatedConvo);
    setIsAiThinking(true);
    setErrorMessage("");

    // 2. If Offline: use local agronomy rules
    if (!navigator.onLine) {
      setAiEngineMode("offline");
      setIsAiThinking(false);
      const offlineResult = offlineVoiceAgent(queryText, language);
      const answerText = typeof offlineResult === "object" ? offlineResult.text : offlineResult;
      const actions = typeof offlineResult === "object" ? offlineResult.actions : [];

      const offlineConvo = [
        ...updatedConvo,
        { role: "ai", text: answerText, actions: actions || [] },
      ];
      setConversation(offlineConvo);
      saveSession(offlineConvo);

      if (isSpeakerOn) {
        speakOfflineText(answerText, language, () => setIsAiSpeaking(true), () => setIsAiSpeaking(false));
      }
      return;
    }

    // 3. Online: Send to Krishi Sathi Backend
    try {
      const res = await fetch(`${BACKEND_URL}/api/call/speak`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_speech_text: queryText,
          language: language,
          farmer_name: getFarmerName(language),
        }),
      });

      if (!res.ok) throw new Error("Backend server error");
      const data = await res.json();
      setIsAiThinking(false);

      const aiResponseConvo = [
        ...updatedConvo,
        {
          role: "ai",
          text: data.agent_text,
          actions: data.actions || [],
          image: data.image || null,
        },
      ];
      setConversation(aiResponseConvo);
      saveSession(aiResponseConvo);

      // Play natural female voice stream directly
      if (isSpeakerOn && data.audio_base64) {
        playBase64Audio(data.audio_base64);
      } else if (isSpeakerOn) {
        speakOfflineText(data.agent_text, language, () => setIsAiSpeaking(true), () => setIsAiSpeaking(false));
      }
    } catch (err) {
      console.warn("Backend error, falling back to local agronomist:", err);
      setIsAiThinking(false);
      setAiEngineMode("offline");

      const offlineResult = offlineVoiceAgent(queryText, language);
      const fallbackText = typeof offlineResult === "object" ? offlineResult.text : offlineResult;

      const fallbackConvo = [
        ...updatedConvo,
        { role: "ai", text: fallbackText, actions: [] },
      ];
      setConversation(fallbackConvo);
      saveSession(fallbackConvo);

      if (isSpeakerOn) {
        speakOfflineText(fallbackText, language, () => setIsAiSpeaking(true), () => setIsAiSpeaking(false));
      }
    }
  };

  // ============================================================================
  // STEP 5: START CALL / END CALL / NEW CHAT
  // ============================================================================
  const handleStartCall = async () => {
    currentSessionIdRef.current = "session_" + Date.now();
    setCallState("ringing");
    setCurrentSpeech("");
    setErrorMessage("");

    const farmerName = getFarmerName(language);
    const greetingText = getGreeting(language, farmerName);

    try {
      const res = await fetch(`${BACKEND_URL}/api/call/initiate?lang=${language}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_name: farmerName,
          language: language,
        }),
      });

      if (!res.ok) throw new Error("Call initiate failed");
      const data = await res.json();

      setTimeout(() => {
        setCallState("connected");
        setAiEngineMode("gemini");
        const greeting = data.agent_text || greetingText;
        const initialConvo = [{
          role: "ai",
          text: greeting,
          actions: data.actions || [
            { label: "🧪 Open Soil Lab", path: "/soil", icon: "🧪" },
            { label: "🌿 Open Crop Doctor", path: "/solution", icon: "🌿" },
            { label: "🌾 Cultivation Tracker", path: "/cultivation-tracker", icon: "🌾" },
          ],
          image: data.image || null,
        }];
        setConversation(initialConvo);
        saveSession(initialConvo);

        if (isSpeakerOn && data.audio_base64) {
          playBase64Audio(data.audio_base64);
        } else if (isSpeakerOn) {
          speakOfflineText(greeting, language, () => setIsAiSpeaking(true), () => setIsAiSpeaking(false));
        }
      }, 500);
    } catch (e) {
      // Offline fallback start
      setTimeout(() => {
        setCallState("connected");
        setAiEngineMode("offline");
        const initialConvo = [{
          role: "ai",
          text: greetingText,
          actions: [
            { label: "🧪 Open Soil Lab", path: "/soil", icon: "🧪" },
            { label: "🌿 Open Crop Doctor", path: "/solution", icon: "🌿" },
          ],
          image: null,
        }];
        setConversation(initialConvo);
        saveSession(initialConvo);
        if (isSpeakerOn) {
          speakOfflineText(greetingText, language, () => setIsAiSpeaking(true), () => setIsAiSpeaking(false));
        }
      }, 400);
    }
  };

  const handleStartCallWithTopic = (query) => {
    handleStartCall();
    setTimeout(() => {
      sendVoiceTurn(query);
    }, 1200);
  };

  const handleEndCall = () => {
    setCallState("idle");
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    audioPlayerRef.current.pause();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    speechBufferRef.current = "";
    setCurrentSpeech("");
    setIsAiSpeaking(false);
    setIsRecording(false);
    setIsAiThinking(false);
  };

  const handleStartNewChat = () => {
    handleEndCall();
    setTimeout(() => {
      handleStartCall();
    }, 200);
  };

  // Save consultation session to localStorage
  const saveSession = (convo) => {
    if (!convo || convo.length === 0) return;
    const sessionObj = {
      id: currentSessionIdRef.current,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      language: language,
      preview: convo[convo.length - 1]?.text?.slice(0, 70) || "Consultation",
      conversation: convo,
    };

    setHistoryList((prev) => {
      const filtered = prev.filter((s) => s.id !== sessionObj.id);
      const updated = [sessionObj, ...filtered].slice(0, 15);
      try {
        localStorage.setItem("kisan_call_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleRestoreSession = (session) => {
    currentSessionIdRef.current = session.id;
    setLanguage(session.language || "hi");
    setConversation(session.conversation || []);
    setCallState("connected");
    setShowHistory(false);
  };

  const handleDeleteSession = (sessionId) => {
    setHistoryList((prev) => {
      const updated = prev.filter((s) => s.id !== sessionId);
      try {
        localStorage.setItem("kisan_call_history", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const q = textInput.trim();
    setTextInput("");
    sendVoiceTurn(q);
  };

  // ============================================================================
  // STEP 6: EXACT USER INTERFACE (Zero Visual Changes - 100% Identical Styling)
  // ============================================================================
  return (
    <div className="call-page-wrapper">
      <div className="call-center-container">
        {/* Top Header Bar */}
        <header className="call-header">
          <button
            className="call-btn-back"
            onClick={() => navigate("/dashboard")}
            title="Return to Dashboard"
          >
            <ArrowLeft size={15} />
            <span>Dashboard</span>
          </button>

          <div className="call-header-center">
            <span className="call-header-title">{t.helplineTitle}</span>
            <span className="call-header-status-pill">
              <span className="status-dot-green"></span>
              <span>Online</span>
            </span>
          </div>

          <div className="call-header-actions">
            {/* Language Switcher Pill */}
            <div className="call-lang-select-pill">
              <Globe size={14} />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                aria-label="Language"
              >
                <option value="hi">हिन्दी</option>
                <option value="en">English</option>
                <option value="or">ଓଡ଼ିଆ</option>
                <option value="bn">বাংলা</option>
                <option value="pa">ਪੰਜਾਬੀ</option>
                {["hi", "en", "or", "bn", "pa"].indexOf(language) === -1 && (
                  <option value={language}>
                    {languages?.find((l) => l.code === language)?.native || language.toUpperCase()}
                  </option>
                )}
              </select>
            </div>
          </div>
        </header>

        {/* Sub-bar: Previous Consultations & New Consultation */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "9px 18px",
            background: "rgba(37, 99, 235, 0.08)",
            borderBottom: "1px solid #BFDBFE",
            fontSize: "12px",
            position: "relative",
            zIndex: 9,
          }}
        >
          <button
            onClick={() => setShowHistory(true)}
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid #BFDBFE",
              color: "#1D4ED8",
              padding: "5px 12px",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.2s",
            }}
          >
            <History size={13} />
            <span>
              {language === "hi"
                ? "पिछला परामर्श इतिहास"
                : language === "or"
                ? "ପୂର୍ବ ପରାମର୍ଶ"
                : language === "bn"
                ? "পূর্ববর্তী আলাপ"
                : "Previous Chats"}{" "}
              {historyList.length > 0 ? `(${historyList.length})` : ""}
            </span>
          </button>

          <button
            onClick={handleStartNewChat}
            style={{
              background: "linear-gradient(135deg, #1D4ED8, #2563EB)",
              border: "none",
              color: "#0F172A",
              padding: "5px 14px",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
              fontWeight: "700",
              boxShadow: "0 2px 8px #BFDBFE",
            }}
          >
            <Plus size={13} />
            <span>
              {language === "hi"
                ? "+ नया परामर्श"
                : language === "or"
                ? "+ ନୂଆ ପରାମର୍ଶ"
                : language === "bn"
                ? "+ নতুন আলাপ"
                : "+ New Chat"}
            </span>
          </button>
        </div>

        {/* Previous Consultation History Drawer */}
        {showHistory && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(7, 16, 11, 0.96)",
              backdropFilter: "blur(20px)",
              zIndex: 60,
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              boxSizing: "border-box",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                borderBottom: "1px solid rgba(255,255,255,0.1)",
                paddingBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#60A5FA",
                  fontWeight: "700",
                  fontSize: "16px",
                }}
              >
                <History size={18} />
                <span>
                  {language === "hi"
                    ? "पिछला परामर्श इतिहास"
                    : language === "or"
                    ? "ପୂର୍ବ ପରାମର୍ଶ ଇତିହାସ"
                    : language === "bn"
                    ? "পূর্ববর্তী আলোচনার ইতিহাস"
                    : "Consultation History"}
                </span>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "none",
                  color: "#0F172A",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                ✕ Close
              </button>
            </div>

            {historyList.length === 0 ? (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px 20px" }}>
                <p>No previous consultations recorded yet.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {historyList.map((session) => (
                  <div
                    key={session.id}
                    style={{
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid #BFDBFE",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      onClick={() => handleRestoreSession(session)}
                      style={{ cursor: "pointer", flex: 1, minWidth: 0 }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#60A5FA",
                          fontWeight: "700",
                          marginBottom: "4px",
                        }}
                      >
                        📅 {session.date} • {session.language?.toUpperCase() || "HI"}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#ffffff",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {session.preview}...
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "6px", marginLeft: "10px" }}>
                      <button
                        onClick={() => handleRestoreSession(session)}
                        style={{
                          background: "#1D4ED8",
                          color: "#0F172A",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.id)}
                        style={{
                          background: "rgba(239, 68, 68, 0.2)",
                          color: "#f87171",
                          border: "1px solid rgba(239, 68, 68, 0.4)",
                          padding: "5px 8px",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Call Center Body */}
        <div className="call-body">
          {/* ================================================================== */}
          {/* STATE A: IDLE (Start Call Screen with Glowing Wheat Orb)          */}
          {/* ================================================================== */}
          {callState === "idle" && (
            <div className="call-idle-card">
              <div className="call-avatar-stage">
                <div className="call-orb-glow-ring ring-3"></div>
                <div className="call-orb-glow-ring ring-2"></div>
                <div className="call-orb-glow-ring ring-1"></div>
                <div className="call-avatar-pulse">
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 30%, #60A5FA 0%, #1D4ED8 65%, #1E3A8A 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 25px rgba(37, 99, 235, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4)",
                      border: "2px solid rgba(255, 255, 255, 0.4)",
                      fontSize: "40px",
                      userSelect: "none",
                    }}
                  >
                    🌾
                  </div>
                  <span className="call-avatar-status-dot" title="Online & Ready"></span>
                </div>
              </div>

              {/* Persona Information */}
              <div className="call-persona-info">
                <h2>{t.personaName}</h2>
                <div className="call-persona-badge">
                  <Sparkles size={13} />
                  <span>{t.personaRole}</span>
                </div>
                <p className="call-persona-desc">{t.personaDesc}</p>
              </div>

              {/* Topics Grid */}
              <div className="call-topics-container">
                <div className="call-topics-header">
                  <span className="call-topics-label">{t.topicCardsTitle}</span>
                  <span className="call-topics-sub">Tap any query to start consultation</span>
                </div>
                <div className="call-topics-grid">
                  {t.topics.map((item, idx) => (
                    <div
                      key={idx}
                      className="call-topic-card"
                      onClick={() => handleStartCallWithTopic(item.query)}
                      title={`Ask: "${item.query}"`}
                    >
                      <div className="topic-card-icon">{item.icon}</div>
                      <div className="topic-card-body">
                        <div className="topic-card-title">{item.title}</div>
                        <div className="topic-card-query">"{item.query}"</div>
                      </div>
                      <ChevronRight size={15} className="topic-card-arrow" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Call Button */}
              <div className="call-action-zone">
                <button className="call-btn-dial" onClick={handleStartCall}>
                  <Mic size={22} className="call-btn-dial-icon" />
                  <span className="call-btn-dial-label">{t.callButton}</span>
                </button>
                <div className="call-hint-text">
                  <span>✨ {t.callHint}</span>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================== */}
          {/* STATE B: RINGING (Connecting Animation)                           */}
          {/* ================================================================== */}
          {callState === "ringing" && (
            <div className="call-active-card ringing">
              <div className="call-avatar-stage">
                <div className="call-orb-glow-ring ring-3 connecting"></div>
                <div className="call-orb-glow-ring ring-2 connecting"></div>
                <div className="call-orb-glow-ring ring-1 connecting"></div>
                <div className="call-avatar-pulse">
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 30%, #60A5FA 0%, #1D4ED8 65%, #1E3A8A 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 25px rgba(37, 99, 235, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4)",
                      border: "2px solid rgba(255, 255, 255, 0.4)",
                      fontSize: "40px",
                      userSelect: "none",
                    }}
                  >
                    🌾
                  </div>
                </div>
              </div>
              <h2 style={{ fontSize: "22px", margin: "16px 0 6px", color: "#0F172A", fontWeight: "800" }}>
                {t.personaName}
              </h2>
              <p style={{ color: "#60A5FA", fontSize: "14px", fontWeight: "600", margin: "0" }}>
                {t.callingText}
              </p>
              <div className="ring-pulse-dots">
                <span /><span /><span />
              </div>

              <button
                className="call-btn-cancel-ring"
                onClick={handleEndCall}
                style={{ marginTop: 28 }}
              >
                <span>Cancel</span>
              </button>
            </div>
          )}

          {/* ================================================================== */}
          {/* STATE C: CONNECTED (Live Consultation with Live Voice & Bubbles)   */}
          {/* ================================================================== */}
          {callState === "connected" && (
            <div className="call-active-card connected">
              {/* Status Header */}
              <div className="call-live-header">
                <div className="call-timer-badge">
                  <span className="status-dot-green" />
                  <span>{formatTime(callDuration)}</span>
                </div>

                <div className={`call-mode-pill ${aiEngineMode === "gemini" ? "online" : "offline"}`}>
                  {aiEngineMode === "gemini" ? <Wifi size={13} /> : <WifiOff size={13} />}
                  <span>{aiEngineMode === "gemini" ? "Voice AI Active" : "Local / Offline"}</span>
                </div>

                <div
                  className="call-speaker-toggle"
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  title={isSpeakerOn ? "Mute Speaker" : "Unmute Speaker"}
                >
                  {isSpeakerOn ? <Volume2 size={17} /> : <VolumeX size={17} color="#ef4444" />}
                </div>
              </div>

              {/* Glowing Avatar Circle */}
              <div className="call-avatar-section">
                <div className={`call-avatar-circle ${isAiSpeaking ? "speaking-glow" : isRecording ? "listening-glow" : ""}`}>
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      background: "radial-gradient(circle at 35% 30%, #60A5FA 0%, #1D4ED8 65%, #1E3A8A 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 20px rgba(37, 99, 235, 0.4)",
                      fontSize: "36px",
                      userSelect: "none",
                    }}
                  >
                    🌾
                  </div>
                </div>

                {/* Animated Waveform when Krishi Sathi is speaking */}
                {isAiSpeaking && (
                  <div className="speaking-wave-bars">
                    <span /><span /><span /><span /><span />
                  </div>
                )}

                {/* Live Status Pill */}
                <div className={`call-live-status-pill ${isAiSpeaking ? "speaking" : isRecording ? "listening" : "idle"}`}>
                  {isAiSpeaking ? (
                    <span>🔊 {t.aiSpeaking}</span>
                  ) : isRecording ? (
                    <span>🔴 {t.listening}</span>
                  ) : isAiThinking ? (
                    <span>⏳ {t.analyzing}</span>
                  ) : (
                    <span>🎙️ {t.speakingHint}</span>
                  )}
                </div>
              </div>

              {/* Multi-turn Conversation Feed */}
              <div className="call-transcript-panel" ref={chatScrollRef}>
                {conversation.map((msg, index) => (
                  <div key={index} className={`msg-bubble ${msg.role}`}>
                    <span className="msg-sender-tag">
                      {msg.role === "user"
                        ? language === "hi"
                          ? "🧑 आप"
                          : language === "or"
                          ? "🧑 ଆପଣ"
                          : language === "bn"
                          ? "🧑 আপনি"
                          : "🧑 You"
                        : `🌱 ${t.personaName}`}
                    </span>
                    <div className="msg-content">
                      <p className="msg-text-body">{msg.text}</p>

                      {/* Multimodal Image Card */}
                      {msg.image && (
                        <div className="call-msg-media-card">
                          <img
                            src={typeof msg.image === "string" ? msg.image : msg.image.url}
                            alt={msg.image.caption || "Agricultural Intelligence Visual"}
                            className="call-msg-img"
                            onError={(e) => { e.target.style.display = "none"; }}
                          />
                          {msg.image.caption && (
                            <span className="call-msg-caption">📷 {msg.image.caption}</span>
                          )}
                        </div>
                      )}

                      {/* Recommended Action Pills */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="call-msg-actions-container">
                          <div className="call-msg-actions-label">
                            <Sparkles size={12} style={{ color: "#38bdf8" }} />
                            <span>Recommended Actions:</span>
                          </div>
                          <div className="call-msg-actions-grid">
                            {msg.actions.map((act, aIdx) => (
                              <button
                                key={aIdx}
                                className="call-action-pill-btn"
                                onClick={() => navigate(act.path)}
                                title={`Open ${act.label}`}
                              >
                                <span className="action-pill-icon">{act.icon || "➔"}</span>
                                <span className="action-pill-text">
                                  {act.label.replace(/^[\p{Emoji}\p{Extended_Pictographic}\s]+/u, "")}
                                </span>
                                <ChevronRight size={13} className="action-pill-arrow" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Live Speech Interim Bubble as Farmer speaks */}
                {currentSpeech && (
                  <div className="msg-bubble user">
                    <span className="msg-sender-tag">🧑 You (Speaking...)</span>
                    <p className="msg-content" style={{ opacity: 0.85, fontStyle: "italic" }}>
                      {currentSpeech}...
                    </p>
                  </div>
                )}

                {/* Thinking Pulse */}
                {isAiThinking && (
                  <div className="ai-thinking-pulse">
                    <RefreshCw size={14} className="animate-spin" />
                    <span>{t.analyzing}</span>
                  </div>
                )}

                {errorMessage && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#f87171",
                      fontSize: "12px",
                      padding: "6px",
                    }}
                  >
                    <AlertCircle size={14} />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              {/* Quick Questions Chips */}
              <div className="quick-chips-wrapper">
                <span className="quick-chips-title">{t.quickChipsTitle}</span>
                <div className="quick-chips-scroll">
                  {t.quickChips.map((chip, idx) => (
                    <button
                      key={idx}
                      className="quick-chip-btn"
                      onClick={() => sendVoiceTurn(chip)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Call Action Buttons */}
              <div className="call-controls-bar">
                {/* Green Push-to-Talk Mic */}
                <div className="ctrl-btn-wrapper">
                  <button
                    className={`control-btn mic-btn ${isRecording ? "recording" : ""}`}
                    onClick={toggleRecording}
                    title={isRecording ? t.tapToSend : t.tapToTalk}
                  >
                    {isRecording ? <MicOff size={28} /> : <Mic size={28} />}
                  </button>
                  <span className="btn-sublabel">{isRecording ? t.tapToSend : t.tapToTalk}</span>
                </div>

                {/* Red End Call Button */}
                <div className="ctrl-btn-wrapper">
                  <button
                    className="control-btn end-btn"
                    onClick={handleEndCall}
                    title={t.endCall}
                  >
                    <PhoneOff size={26} />
                  </button>
                  <span className="btn-sublabel">{t.endCall}</span>
                </div>
              </div>

              {/* Optional Text Input for Farmers who Prefer Typing */}
              <form className="call-quick-type-bar" onSubmit={handleManualSubmit}>
                <input
                  type="text"
                  className="call-quick-type-input"
                  placeholder={t.placeholder}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
                <button
                  type="submit"
                  className="call-quick-type-btn"
                  disabled={!textInput.trim() || isAiThinking}
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
