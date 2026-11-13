// src/pages/Forecast.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, ArrowRight, Plus, ShieldCheck, Sparkles, PhoneCall } from "lucide-react";
import "../styles/Forecast.css";
import BottomNav from "../components/BottomNav";

export default function Forecast() {
  const navigate = useNavigate();

  const [weatherData, setWeatherData] = useState({
    city: "Rourkela, Sundargarh",
    date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    temp: 27,
    humidity: "58%",
    condition: "Sunny / Clear Sky",
    sprayAdvisory: "Today is an optimal day to apply foliar nutrients and bio-pesticides. Calm wind prevents drift.",
  });

  const [notes, setNotes] = useState([
    {
      id: 1,
      img: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22513?w=300&auto=format&fit=crop&q=80",
      time: "Today · 3:00 PM",
      desc: "Foliar spray completed on Plot 1. Applied micronutrient Zinc Sulphate solution during low-wind window.",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&auto=format&fit=crop&q=80",
      time: "Yesterday · 5:15 PM",
      desc: "Inspected wheat field edges for yellow rust pustules. Leaves appear clean, green, and disease-free.",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=300&auto=format&fit=crop&q=80",
      time: "May 24 · 5:43 PM",
      desc: "Excellent crop vigor observed in vegetative phase. Crown roots established with uniform tillering.",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/weather?city=Rourkela&state=Odisha")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setWeatherData({
            city: data.location || "Rourkela, Sundargarh",
            date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
            temp: Math.round(data.temperature_celsius) || 27,
            humidity: `${data.humidity_percent || 58}%`,
            condition: "Sunny / Clear",
            sprayAdvisory: data.agro_advisories?.spray_window_advisory || "Today is an optimal day to apply bio-pesticides.",
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const newEntry = {
      id: Date.now(),
      img: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22513?w=300&auto=format&fit=crop&q=80",
      time: "Just now",
      desc: newNoteText.trim(),
    };
    setNotes([newEntry, ...notes]);
    setNewNoteText("");
    setShowAddModal(false);
  };

  return (
    <div className="km-forecast-page">
      <main className="km-fc-main-container">
        {/* Top App Bar (Matches Screen 3) */}
        <div className="km-fc-nav-bar">
          <button className="km-fc-nav-btn" onClick={() => navigate("/dashboard")} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <h1 className="km-fc-nav-title">Todays Weather</h1>
          <button className="km-fc-nav-btn" onClick={() => navigate("/call")} aria-label="Notifications">
            <Bell size={18} />
          </button>
        </div>

        {/* Screen 3 Hero Green Card */}
        <section className="km-screen3-weather-card">
          <div className="km-screen3-top-row">
            <div className="km-screen3-location-date">
              {weatherData.city}, {weatherData.date}
            </div>
          </div>

          <div className="km-screen3-temp-row">
            <div>
              <div className="km-screen3-temp-num">{weatherData.temp}°C</div>
              <div className="km-screen3-humidity-text">Humidity {weatherData.humidity}</div>
            </div>

            <div className="km-screen3-condition-wrap">
              <span className="km-screen3-weather-icon">☀️</span>
              <span className="km-screen3-condition-name">Sunny</span>
            </div>
          </div>

          {/* Translucent Spray Advisory Pill */}
          <div className="km-screen3-spray-pill">
            <Sparkles size={16} />
            <span>{weatherData.sprayAdvisory}</span>
          </div>
        </section>

        {/* Screen 3 Notes List */}
        <section className="km-screen3-notes-section">
          <div className="km-screen3-notes-header">
            <h2 className="km-screen3-notes-title">Notes</h2>
            <button
              className="km-screen3-notes-arrow-btn"
              onClick={() => navigate("/cultivation-tracker")}
              aria-label="View All Notes"
            >
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="km-screen3-notes-items">
            {notes.map((note) => (
              <div key={note.id} className="km-screen3-note-row">
                <img
                  src={note.img}
                  alt="Note thumbnail"
                  className="km-screen3-note-img"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=300&auto=format&fit=crop&q=80";
                  }}
                />
                <div>
                  <div className="km-screen3-note-timestamp">{note.time}</div>
                  <p className="km-screen3-note-desc">{note.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Screen 3 Sticky "+ Add New Note" Button */}
          <button className="km-screen3-sticky-cta" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            <span>Add New Note</span>
          </button>
        </section>
      </main>

      {/* Add Note Modal */}
      {showAddModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(6px)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: "24px",
              padding: "24px",
              maxWidth: "420px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: 800, color: "#111827" }}>
              Add Field Observation Note
            </h3>
            <textarea
              rows={4}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "14px",
                border: "1px solid #E5EBE7",
                background: "#F5F7F6",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
                marginBottom: "16px",
              }}
              placeholder="e.g. Completed weeding on Plot 2; foliage color is dark healthy green."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
            />
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="km-btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="km-btn-primary"
                style={{ flex: 1 }}
                onClick={handleAddNote}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Docked Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
