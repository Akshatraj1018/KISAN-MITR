// src/pages/CropManager.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sprout,
  Plus,
  Calendar,
  Layers,
  Droplets,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import "../styles/CropManager.css";

const INITIAL_CROPS = [
  {
    id: 1,
    name: "Wheat (गेहूं - HD-2967)",
    field: "Plot A (North Canal Field)",
    area: "2.5 Acres",
    plantedDate: "05 Oct 2026",
    expectedHarvest: "15 Mar 2027",
    stage: "Vegetative Stage (Day 24)",
    progressPercent: 35,
    health: "Optimal (Green)",
    nextAction: "Top-dressing Urea (50kg) + 1st Irrigation in 3 days",
  },
  {
    id: 2,
    name: "Mustard (सरसों - Pusa Bold)",
    field: "Plot B (South Plateau)",
    area: "1.2 Acres",
    plantedDate: "17 Oct 2026",
    expectedHarvest: "20 Feb 2027",
    stage: "Germination & Emergence (Day 12)",
    progressPercent: 18,
    health: "Excellent",
    nextAction: "Inter-row thinning & weeding in 6 days",
  },
  {
    id: 3,
    name: "Paddy Swarna (Late Kharif)",
    field: "Plot C (Lowland Wetland)",
    area: "3.0 Acres",
    plantedDate: "15 Jul 2026",
    expectedHarvest: "10 Nov 2026",
    stage: "Grain Hardening (Day 106)",
    progressPercent: 92,
    health: "Ready for Harvest",
    nextAction: "Drain field water 7 days prior to combine harvesting",
  },
];

export default function CropManager() {
  const navigate = useNavigate();
  const [crops, setCrops] = useState(INITIAL_CROPS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCropName, setNewCropName] = useState("");
  const [newField, setNewField] = useState("");
  const [newArea, setNewArea] = useState("");

  const handleAddCrop = (e) => {
    e.preventDefault();
    if (!newCropName || !newField) return;

    const newEntry = {
      id: Date.now(),
      name: newCropName,
      field: newField,
      area: newArea || "1.0 Acre",
      plantedDate: "Today",
      expectedHarvest: "120 Days",
      stage: "Sowing / Land Preparation",
      progressPercent: 5,
      health: "New Crop",
      nextAction: "Basal fertilizer application (DAP + MOP)",
    };

    setCrops([newEntry, ...crops]);
    setShowAddModal(false);
    setNewCropName("");
    setNewField("");
    setNewArea("");
  };

  return (
    <div className="km-crop-mgr-page">
      <div className="km-mgr-container">
        {/* Header Bar */}
        <div className="km-mgr-header">
          <div className="km-mgr-title-box">
            <h1>
              <span>🌾</span> Farm Crop Manager & Field Lifecycle Calendar
            </h1>
            <p>Track sowing dates, monitor vegetative stages, and plan fertilizer/irrigation schedules.</p>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              className="km-btn-doc primary"
              style={{ padding: "10px 18px", borderRadius: 9999 }}
              onClick={() => setShowAddModal(true)}
            >
              <Plus style={{ width: 16, height: 16 }} />
              <span>Add New Field Crop</span>
            </button>

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
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* 4 Statistics KPI Tiles */}
        <div className="km-mgr-stats-row">
          <div className="km-stat-tile">
            <div className="km-stat-label">Total Land Cultivated</div>
            <div className="km-stat-value">6.7 Acres</div>
            <div className="km-stat-sub">3 Active Plots</div>
          </div>
          <div className="km-stat-tile">
            <div className="km-stat-label">Dominant Crop Cycle</div>
            <div className="km-stat-value">Rabi 2026</div>
            <div className="km-stat-sub">Wheat & Mustard Priority</div>
          </div>
          <div className="km-stat-tile">
            <div className="km-stat-label">Upcoming Harvest</div>
            <div className="km-stat-value">Paddy Swarna</div>
            <div className="km-stat-sub">In 12 Days (Plot C)</div>
          </div>
          <div className="km-stat-tile">
            <div className="km-stat-label">Projected Net Revenue</div>
            <div className="km-stat-value">₹2,48,000</div>
            <div className="km-stat-sub">Based on live Mandi rates</div>
          </div>
        </div>

        {/* Crop Field Cards Grid */}
        <div className="km-crop-cards-grid">
          {crops.map((crop) => (
            <div key={crop.id} className="km-field-card">
              <div className="km-field-card-top">
                <div>
                  <h3 className="km-crop-title">{crop.name}</h3>
                  <div className="km-field-loc">{crop.field} • {crop.area}</div>
                </div>
                <span className="km-crop-tag">{crop.health}</span>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8" }}>
                  <span>Stage: <strong>{crop.stage}</strong></span>
                  <span>{crop.progressPercent}% to Harvest</span>
                </div>
                <div className="km-progress-bar-bg">
                  <div className="km-progress-fill" style={{ width: `${crop.progressPercent}%` }}></div>
                </div>
              </div>

              <div style={{ margin: "14px 0", padding: "10px 14px", background: "rgba(245, 158, 11, 0.1)", borderRadius: 10, border: "1px solid rgba(245, 158, 11, 0.25)" }}>
                <div style={{ fontSize: 11, color: "#fcd34d", fontWeight: 700, textTransform: "uppercase" }}>Next Scheduled Action:</div>
                <div style={{ fontSize: 13, color: "white", marginTop: 2 }}>{crop.nextAction}</div>
              </div>

              <div className="km-field-meta-row">
                <span>Planted: {crop.plantedDate}</span>
                <span>Expected Harvest: {crop.expectedHarvest}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for adding crop */}
        {showAddModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3000,
              padding: 20,
            }}
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="km-doc-card"
              style={{ width: "100%", maxWidth: 480 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ margin: "0 0 16px 0", color: "white", fontSize: 20, fontWeight: 800 }}>Add New Field Crop</h3>

              <form onSubmit={handleAddCrop}>
                <div className="km-form-group">
                  <label className="km-form-label">Crop & Variety:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wheat (HD-2967), Potato (Kufri Pukhraj)..."
                    className="km-form-input"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                  />
                </div>

                <div className="km-form-group">
                  <label className="km-form-label">Field / Plot Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. North Canal Plot, South Well Field..."
                    className="km-form-input"
                    value={newField}
                    onChange={(e) => setNewField(e.target.value)}
                  />
                </div>

                <div className="km-form-group">
                  <label className="km-form-label">Acreage / Area:</label>
                  <input
                    type="text"
                    placeholder="e.g. 2.5 Acres"
                    className="km-form-input"
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                  <button type="submit" className="km-btn-doc primary" style={{ flex: 1 }}>
                    Save to Field Log
                  </button>
                  <button
                    type="button"
                    className="km-btn-doc secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
