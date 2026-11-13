// src/pages/Forecast.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Cloud,
  Compass,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Sparkles,
} from "lucide-react";
import "../styles/Forecast.css";

const SEVEN_DAY_FORECAST = [
  { day: "Today", date: "29 Oct", icon: "🌧️", tempMax: 26, tempMin: 19, pop: "85% Rain", condition: "Moderate Rain", safeSpray: false },
  { day: "Fri", date: "30 Oct", icon: "⛅", tempMax: 28, tempMin: 18, pop: "20% Rain", condition: "Partly Cloudy", safeSpray: true },
  { day: "Sat", date: "31 Oct", icon: "☀️", tempMax: 29, tempMin: 17, pop: "5% Rain", condition: "Clear Sunny", safeSpray: true },
  { day: "Sun", date: "01 Nov", icon: "☀️", tempMax: 30, tempMin: 17, pop: "0% Rain", condition: "Sunny & Dry", safeSpray: true },
  { day: "Mon", date: "02 Nov", icon: "🌤️", tempMax: 29, tempMin: 18, pop: "10% Rain", condition: "Passing Clouds", safeSpray: true },
  { day: "Tue", date: "03 Nov", icon: "⛅", tempMax: 28, tempMin: 19, pop: "25% Rain", condition: "Scattered Clouds", safeSpray: true },
  { day: "Wed", date: "04 Nov", icon: "🌧️", tempMax: 27, tempMin: 18, pop: "60% Rain", condition: "Light Showers", safeSpray: false },
];

export default function Forecast() {
  const navigate = useNavigate();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const activeDay = SEVEN_DAY_FORECAST[selectedDayIndex];

  return (
    <div className="km-forecast-page">
      <div className="km-forecast-container">
        {/* Header Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", margin: "0 0 4px 0" }}>
              🌦️ 7-Day Agricultural Weather & Spray Station
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
              Actionable micro-climate forecasts, evapotranspiration rates, and pesticide spray safety windows.
            </p>
          </div>

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
        </div>

        {/* Current Active Day Hero Card */}
        <div className="km-forecast-top-hero">
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ fontSize: 64 }}>{activeDay.icon}</div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="km-brand-badge">{activeDay.day} ({activeDay.date})</span>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>Rourkela, Sundargarh, Odisha</span>
              </div>
              <div className="km-fc-big-temp">{activeDay.tempMax}°C</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0" }}>
                {activeDay.condition} • Low: {activeDay.tempMin}°C
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 280 }}>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                background: activeDay.safeSpray ? "#EFF6FF" : "rgba(245,158,11,0.15)",
                border: `1px solid ${activeDay.safeSpray ? "#BFDBFE" : "rgba(245,158,11,0.3)"}`,
              }}
            >
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: activeDay.safeSpray ? "#60A5FA" : "#fcd34d" }}>
                {activeDay.safeSpray ? "Safe Spray Window Active" : "Chemical Spray Not Recommended"}
              </div>
              <div style={{ fontSize: 13, color: "white", marginTop: 2 }}>
                {activeDay.safeSpray
                  ? "Wind speed < 12 km/h and dry conditions. Excellent time for foliar sprays."
                  : "High rain probability & wind will wash away chemicals and cause drift."}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Rain Probability</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#38bdf8", marginTop: 2 }}>{activeDay.pop}</div>
              </div>
              <div style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Humidity</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "white", marginTop: 2 }}>92%</div>
              </div>
              <div style={{ flex: 1, padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: 10, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#94a3b8" }}>Wind</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "white", marginTop: 2 }}>14 km/h</div>
              </div>
            </div>
          </div>
        </div>

        {/* 7-Day Forecast Grid */}
        <h3 style={{ fontSize: 18, fontWeight: 800, color: "white", margin: "0 0 14px 0" }}>
          Weekly Agronomic Calendar
        </h3>

        <div className="km-fc-grid-7day">
          {SEVEN_DAY_FORECAST.map((item, idx) => {
            const isSelected = selectedDayIndex === idx;

            return (
              <div
                key={idx}
                className={`km-day-tile ${isSelected ? "today" : ""}`}
                onClick={() => setSelectedDayIndex(idx)}
                style={{ cursor: "pointer" }}
              >
                <div className="km-day-name">{item.day}</div>
                <div className="km-day-icon">{item.icon}</div>
                <div className="km-day-temp">{item.tempMax}° / {item.tempMin}°</div>
                <div className="km-day-pop">{item.pop}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
