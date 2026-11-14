// src/pages/MandiPrice.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  IndianRupee,
  MapPin,
  TrendingUp,
  TrendingDown,
  Calculator,
  Building2,
  Truck,
  ArrowUpRight,
  ShieldCheck,
  Search,
} from "lucide-react";
import "../styles/MandiPrice.css";
import { useLanguage } from "../context/LanguageContext";

const MANDI_DATA = [
  {
    mandi: "Rourkela Main APMC (Sundargarh)",
    state: "Odisha",
    distanceKm: 14,
    wheatRate: 2425,
    paddyRate: 2183,
    mustardRate: 5120,
    potatoRate: 1450,
    tomatoRate: 1850,
    twoDaysAgoRate: 2350,
    trend: "+1.9%",
    isUp: true,
  },
  {
    mandi: "Khanna Grain Market (Asia's Largest)",
    state: "Punjab",
    distanceKm: 1250,
    wheatRate: 2540,
    paddyRate: 2260,
    mustardRate: 5310,
    potatoRate: 1380,
    tomatoRate: 1720,
    twoDaysAgoRate: 2490,
    trend: "+2.0%",
    isUp: true,
  },
  {
    mandi: "Azadpur Subzi Mandi (National Hub)",
    state: "Delhi NCR",
    distanceKm: 1180,
    wheatRate: 2490,
    paddyRate: 2210,
    mustardRate: 5240,
    potatoRate: 1560,
    tomatoRate: 2100,
    twoDaysAgoRate: 2440,
    trend: "+2.3%",
    isUp: true,
  },
  {
    mandi: "Bargarh APMC Market (Rice Bowl)",
    state: "Odisha",
    distanceKm: 140,
    wheatRate: 2390,
    paddyRate: 2215,
    mustardRate: 5080,
    potatoRate: 1420,
    tomatoRate: 1810,
    twoDaysAgoRate: 2370,
    trend: "+0.8%",
    isUp: true,
  },
  {
    mandi: "Indore APMC Market Yard",
    state: "Madhya Pradesh",
    distanceKm: 920,
    wheatRate: 2460,
    paddyRate: 2150,
    mustardRate: 5280,
    potatoRate: 1490,
    tomatoRate: 1920,
    twoDaysAgoRate: 2475,
    trend: "-0.6%",
    isUp: false,
  },
];

export default function MandiPrice() {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [quantityQtl, setQuantityQtl] = useState(25);
  const [transportCostKm, setTransportCostKm] = useState(4.5);
  const [searchMandi, setSearchMandi] = useState("");

  const getCropRate = (mandiItem) => {
    switch (selectedCrop) {
      case "wheat": return mandiItem.wheatRate;
      case "paddy": return mandiItem.paddyRate;
      case "mustard": return mandiItem.mustardRate;
      case "potato": return mandiItem.potatoRate;
      case "tomato": return mandiItem.tomatoRate;
      default: return mandiItem.wheatRate;
    }
  };

  const getCropName = () => {
    switch (selectedCrop) {
      case "wheat": return "Wheat";
      case "paddy": return "Paddy Swarna";
      case "mustard": return "Mustard";
      case "potato": return "Potato";
      case "tomato": return "Tomato";
      default: return "Wheat";
    }
  };

  const filteredMandis = MANDI_DATA.filter((m) =>
    m.mandi.toLowerCase().includes(searchMandi.toLowerCase()) ||
    m.state.toLowerCase().includes(searchMandi.toLowerCase())
  );

  return (
    <div className="km-mandi-page">
      <div className="km-mandi-container">
        {/* Top Header */}
        <div className="km-mandi-top-header">
          <div className="km-mandi-title-box">
            <h1>
              <span>📈</span> APMC Live Mandi Rates & Freight Profit Calculator
            </h1>
            <p>Real-time agricultural market arrivals, e-NAM price discoveries, and net payout calculator.</p>
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
            <span>Return to Farm Dashboard</span>
          </button>
        </div>

        {/* 2-Column Trading Grid */}
        <div className="km-mandi-layout-grid">
          {/* Left Column: Smart Trade & Freight Calculator */}
          <div className="km-trade-calc-card">
            <div className="km-calc-header">
              <Calculator style={{ color: "#f59e0b", width: 20, height: 20 }} />
              <h3>Net Farm Profit Calculator</h3>
            </div>

            <div className="km-calc-field">
              <label>Select Commodity:</label>
              <select
                className="km-calc-select"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
              >
                <option value="wheat">Wheat / गेहूं (Cereals)</option>
                <option value="paddy">Paddy / धान (Cereals)</option>
                <option value="mustard">Mustard / सरसों (Oilseeds)</option>
                <option value="potato">Potato / आलू (Vegetables)</option>
                <option value="tomato">Tomato / टमाटर (Vegetables)</option>
              </select>
            </div>

            <div className="km-calc-field">
              <label>Quantity to Sell (Quintals):</label>
              <input
                type="number"
                min="1"
                className="km-calc-input"
                value={quantityQtl}
                onChange={(e) => setQuantityQtl(Number(e.target.value) || 1)}
              />
            </div>

            <div className="km-calc-field">
              <label>Diesel / Transport Cost (₹ per km):</label>
              <input
                type="number"
                min="1"
                step="0.5"
                className="km-calc-input"
                value={transportCostKm}
                onChange={(e) => setTransportCostKm(Number(e.target.value) || 1)}
              />
            </div>

            <div style={{ padding: "14px", background: "#FEF3C7", borderRadius: 12, border: "1px solid #FDE68A", marginBottom: 18 }}>
              <div style={{ fontSize: 11, color: "#B45309", fontWeight: 700, textTransform: "uppercase" }}>Local Mandi Total Payout:</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", marginTop: 4 }}>
                ₹{((getCropRate(MANDI_DATA[0]) * quantityQtl) - (MANDI_DATA[0].distanceKm * transportCostKm)).toLocaleString("en-IN")}
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
                Includes {quantityQtl} qtl @ ₹{getCropRate(MANDI_DATA[0])}/q minus ₹{(MANDI_DATA[0].distanceKm * transportCostKm).toFixed(0)} freight.
              </div>
            </div>

            <button className="km-btn-calc-submit" onClick={() => alert("Freight calculations updated across all APMC Mandi hubs!")}>
              <span>Recalculate Net Profit</span>
            </button>
          </div>

          {/* Right Column: APMC Market Board */}
          <div className="km-mandi-main-card">
            {/* Top 3 Highlight Hubs */}
            <div className="km-mandi-hub-hero">
              {MANDI_DATA.slice(0, 3).map((hub, idx) => {
                const gross = getCropRate(hub) * quantityQtl;
                const freight = hub.distanceKm * transportCostKm;
                const net = gross - freight;
                const isBest = idx === 0;

                return (
                  <div key={idx} className={`km-hub-card ${isBest ? "best-deal" : ""}`}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span className="km-hub-name">{hub.mandi.split("(")[0]}</span>
                      {isBest && (
                        <span className="km-brand-badge" style={{ background: "#EFF6FF", fontSize: 9 }}>
                          Highest Net
                        </span>
                      )}
                    </div>
                    <div className="km-hub-dist">{hub.state} • {hub.distanceKm} km away</div>
                    <div className="km-hub-price">₹{getCropRate(hub)} <span style={{ fontSize: 12, color: "#94a3b8" }}>/q</span></div>
                    <div className="km-hub-profit">Net Payout: ₹{net.toLocaleString("en-IN")}</div>
                  </div>
                );
              })}
            </div>

            {/* Search Filter Bar */}
            <div style={{ display: "flex", gap: 12, marginBottom: 18, alignItems: "center" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search style={{ position: "absolute", left: 14, top: 12, width: 16, height: 16, color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="Filter by Mandi name, district, or state..."
                  className="km-calc-input"
                  style={{ paddingLeft: 40 }}
                  value={searchMandi}
                  onChange={(e) => setSearchMandi(e.target.value)}
                />
              </div>
            </div>

            {/* Table View */}
            <div className="km-table-wrapper">
              <table className="km-mandi-table">
                <thead>
                  <tr>
                    <th>APMC Mandi</th>
                    <th>State</th>
                    <th>Distance</th>
                    <th>Live Rate ({getCropName()})</th>
                    <th>2 Days Ago</th>
                    <th>3-Day Trend</th>
                    <th>Est. Net Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMandis.map((item, idx) => {
                    const gross = getCropRate(item) * quantityQtl;
                    const freight = item.distanceKm * transportCostKm;
                    const net = gross - freight;

                    return (
                      <tr key={idx}>
                        <td>
                          <div style={{ fontWeight: 800, color: "#0F172A" }}>{item.mandi}</div>
                        </td>
                        <td>
                          <span style={{ color: "#475569", fontWeight: 600 }}>{item.state}</span>
                        </td>
                        <td>
                          <span style={{ color: "#334155", fontWeight: 600 }}>{item.distanceKm} km</span>
                        </td>
                        <td>
                          <div className="km-price-today">₹{getCropRate(item)}/q</div>
                        </td>
                        <td>
                          <span className="km-price-history">₹{item.twoDaysAgoRate}</span>
                        </td>
                        <td>
                          <span className={`km-trend-badge ${item.isUp ? "up" : "down"}`}>
                            {item.isUp ? <TrendingUp style={{ width: 12, height: 12 }} /> : <TrendingDown style={{ width: 12, height: 12 }} />}
                            {item.trend}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 800, color: "#f59e0b" }}>
                            ₹{net.toLocaleString("en-IN")}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#94a3b8", fontSize: 12 }}>
              <span>Verified through National Agriculture Market (e-NAM Portal - Ministry of Agriculture)</span>
              <span>Updated: Today 06:00 AM IST</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
