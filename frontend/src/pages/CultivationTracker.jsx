// src/pages/CultivationTracker.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Bell,
  Sparkles,
  PhoneCall,
  Sprout,
  TrendingUp,
  Layers,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  getActiveCultivation,
  startCultivationProject,
  lodgePhaseProgress,
  CULTIVATION_BLUEPRINTS,
} from "../utils/cultivationTracker";
import "../styles/CultivationTracker.css";

export default function CultivationTracker() {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeModalPhase, setActiveModalPhase] = useState(null);
  const [farmerNotes, setFarmerNotes] = useState("");
  const [selectedNewCrop, setSelectedNewCrop] = useState("Wheat");

  useEffect(() => {
    let curr = getActiveCultivation();
    if (!curr) {
      // Default auto-start Wheat
      curr = startCultivationProject("Wheat", "Plot 1 (Main Field)", "2.5 Acres");
    }
    setProject(curr);
  }, []);

  const handleLodgeComplete = (phaseId) => {
    const updated = lodgePhaseProgress(phaseId, farmerNotes || "Work completed successfully in field.");
    setProject({ ...updated });
    setActiveModalPhase(null);
    setFarmerNotes("");
  };

  const handleStartNewProject = (cropKey) => {
    const fresh = startCultivationProject(cropKey, "Field 1 (Main Plot)", "2.5 Acres");
    setProject(fresh);
  };

  if (!project) return null;

  const currentPhase = project.phases.find((p) => p.status === "in_progress") || project.phases[0];

  return (
    <div className="km-tracker-page">
      <div className="km-tracker-container">
        {/* Navigation Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
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

          <div style={{ display: "flex", gap: 10 }}>
            <select
              style={{
                background: "rgba(0,0,0,0.4)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                padding: "8px 12px",
                fontSize: 13,
                outline: "none",
              }}
              value={selectedNewCrop}
              onChange={(e) => {
                setSelectedNewCrop(e.target.value);
                handleStartNewProject(e.target.value);
              }}
            >
              <option value="Wheat">Switch: Wheat</option>
              <option value="Mustard">Switch: Mustard</option>
              <option value="Paddy">Switch: Paddy</option>
              <option value="Potato">Switch: Potato</option>
            </select>
          </div>
        </div>

        {/* Hero Project Status Box */}
        <div className="km-tracker-hero">
          <div className="km-tracker-hero-top">
            <div>
              <div className="km-brand-badge" style={{ marginBottom: 8 }}>
                ● Active Cultivation Project
              </div>
              <h1 className="km-tracker-crop-name">
                <span>🌾</span> {project.cropName} — {project.variety}
              </h1>
              <div className="km-tracker-meta-chips">
                <span><Layers style={{ width: 14, height: 14, verticalAlign: "middle" }} /> {project.plotName} ({project.area})</span>
                <span>• Started: {project.startDate}</span>
                <span>• Expected Yield: {project.expectedYield}</span>
                <span>• Est. Profit: {project.estimatedProfit}</span>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 700 }}>Overall Lifecycle Progress</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "#60A5FA", marginTop: 2 }}>
                {project.progressPercent}%
              </div>
            </div>
          </div>

          <div className="km-tracker-progress-shell">
            <div className="km-tracker-progress-header">
              <span style={{ color: "#0F172A", fontWeight: 700 }}>
                Active Stage: <strong>{currentPhase.title}</strong>
              </span>
              <span style={{ color: "#D97706", fontWeight: 700 }}>
                Target Window: {currentPhase.dayRange}
              </span>
            </div>
            <div className="km-tracker-bar-bg">
              <div className="km-tracker-bar-fill" style={{ width: `${project.progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* Scheduled Reminder & Next Step Countdown Banner */}
        <div className="km-active-reminder-box">
          <div className="km-reminder-icon">🔔</div>
          <div className="km-reminder-content" style={{ flex: 1 }}>
            <h4>Immediate Scheduled Action & Field Alert:</h4>
            <p>
              <strong>{currentPhase.title}:</strong> {currentPhase.reminderText}
            </p>
            <div style={{ marginTop: 8, fontSize: 12, color: "#fcd34d", fontWeight: 600 }}>
              💡 Expert PAU/ICAR Tip: {currentPhase.tips}
            </div>
          </div>

          <button
            className="km-btn-doc primary"
            style={{ padding: "10px 18px", alignSelf: "center", whiteSpace: "nowrap" }}
            onClick={() => setActiveModalPhase(currentPhase)}
          >
            <CheckCircle2 style={{ width: 16, height: 16 }} />
            <span>Lodge Completed Progress</span>
          </button>
        </div>

        {/* Step-by-Step Interactive Timeline */}
        <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 16px 0" }}>
          Step-by-Step Lifecycle Roadmap & Milestones
        </h3>

        <div className="km-phases-list">
          {project.phases.map((phase) => {
            const isCompleted = phase.status === "completed";
            const isInProgress = phase.status === "in_progress";

            return (
              <div
                key={phase.id}
                className={`km-phase-card ${isInProgress ? "active" : ""} ${isCompleted ? "completed" : ""}`}
              >
                <div className="km-phase-card-top">
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <h4 className="km-phase-title">{phase.title}</h4>
                    <span className={`km-phase-badge ${phase.status}`}>
                      {isCompleted ? "✓ Completed" : isInProgress ? "⚡ Active In-Field" : "⏳ Upcoming"}
                    </span>
                  </div>

                  <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600 }}>
                    Scheduled: {phase.dayRange} ({phase.targetDate})
                  </span>
                </div>

                <p className="km-phase-desc">{phase.description}</p>

                <div className="km-inputs-box">
                  <strong>Inputs Required for this Phase:</strong> {phase.inputsRequired}
                </div>

                {isCompleted && phase.completedDate && (
                  <div style={{ fontSize: 12, color: "#60A5FA", marginBottom: 12 }}>
                    ✓ Logged on {phase.completedDate} • Farmer Note: "{phase.farmerNotes || "Done"}"
                  </div>
                )}

                <div className="km-phase-footer">
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>
                    Reminder Scheduled: {phase.reminderText.slice(0, 75)}...
                  </span>

                  {isInProgress && (
                    <button
                      className="km-btn-lodge-progress"
                      onClick={() => setActiveModalPhase(phase)}
                    >
                      <CheckCircle2 style={{ width: 15, height: 15 }} />
                      <span>Lodge Progress (Mark Step Done)</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for lodging progress */}
        {activeModalPhase && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 3000,
              padding: 20,
            }}
            onClick={() => setActiveModalPhase(null)}
          >
            <div
              className="km-doc-card"
              style={{ width: "100%", maxWidth: 480 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ margin: "0 0 8px 0", color: "#0F172A", fontSize: 20, fontWeight: 800 }}>
                Lodge Progress for {activeModalPhase.title}
              </h3>
              <p style={{ color: "#94a3b8", fontSize: 13, margin: "0 0 16px 0" }}>
                Confirm that this phase was executed in your field. This advances your timeline and sets your next action reminders.
              </p>

              <div className="km-form-group">
                <label className="km-form-label">Farmer Field Notes / Observations:</label>
                <textarea
                  rows="3"
                  className="km-form-input"
                  style={{ resize: "none" }}
                  placeholder="e.g. Sowing finished with 40kg HD-2967 seed drill, soil moisture good..."
                  value={farmerNotes}
                  onChange={(e) => setFarmerNotes(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button
                  type="button"
                  className="km-btn-doc primary"
                  style={{ flex: 1 }}
                  onClick={() => handleLodgeComplete(activeModalPhase.id)}
                >
                  Confirm & Mark Done ✓
                </button>
                <button
                  type="button"
                  className="km-btn-doc secondary"
                  onClick={() => setActiveModalPhase(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
