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
  Users,
  ExternalLink,
} from "lucide-react";
import {
  getActiveCultivation,
  startCultivationProject,
  lodgePhaseProgress,
  CULTIVATION_BLUEPRINTS,
} from "../utils/cultivationTracker";
import BottomNav from "../components/BottomNav";
import "../styles/CultivationTracker.css";

export default function CultivationTracker() {
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [activeModalPhase, setActiveModalPhase] = useState(null);
  const [farmerNotes, setFarmerNotes] = useState("");
  const [selectedNewCrop, setSelectedNewCrop] = useState("Wheat");

  // Community list matching Image 1 Screen 1
  const communityList = [
    {
      id: 1,
      name: "Farming Community",
      region: "Gun Howions • Rourkela, Odisha",
      img: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22513?w=200&auto=format&fit=crop&q=80",
      members: "1.4k members",
    },
    {
      id: 2,
      name: "Agriculture Community",
      region: "Sundargarh Farmers Cooperative",
      img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200&auto=format&fit=crop&q=80",
      members: "3.2k members",
    },
    {
      id: 3,
      name: "Farming Community",
      region: "Krishi Vigyan Kendra (KVK)",
      img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&auto=format&fit=crop&q=80",
      members: "890 members",
    },
    {
      id: 4,
      name: "Agriculture Community",
      region: "Odisha Organic Growers Club",
      img: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=200&auto=format&fit=crop&q=80",
      members: "2.1k members",
    },
  ];

  useEffect(() => {
    let curr = getActiveCultivation();
    if (!curr) {
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
      {/* Top Banner */}
      <header className="km-tracker-header-banner">
        <div className="km-tracker-header-inner">
          <div className="km-tracker-nav-row">
            <button
              className="km-doc-nav-back"
              onClick={() => navigate("/dashboard")}
              aria-label="Back to Dashboard"
            >
              <ArrowLeft size={16} />
              <span>Dashboard</span>
            </button>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <select
                className="km-tracker-crop-select"
                value={selectedNewCrop}
                onChange={(e) => {
                  setSelectedNewCrop(e.target.value);
                  handleStartNewProject(e.target.value);
                }}
              >
                <option value="Wheat">🌾 Wheat (गेहूं)</option>
                <option value="Mustard">🌼 Mustard (सरसों)</option>
                <option value="Paddy">🍚 Paddy / Rice (धान)</option>
                <option value="Potato">🥔 Potato (आलू)</option>
              </select>
            </div>
          </div>

          <h1 className="km-tracker-header-title">Cultivation Progression</h1>
          <p className="km-tracker-header-subtitle">
            Lifecycle tracking, field stage verification, and community farmer insights.
          </p>
        </div>
      </header>

      {/* Main Container */}
      <main className="km-tracker-main-content">
        {/* Growth Curve Chart Card (Matches Image 1 Screen 1) */}
        <section className="km-growth-chart-card">
          <div className="km-chart-header">
            <div>
              <span className="km-chart-badge">● Crop Progression Line</span>
              <h2 className="km-chart-title">{project.cropName} Growth Curve</h2>
            </div>
            <div className="km-chart-stat-right">
              <span className="km-chart-stat-label">Projected Yield</span>
              <span className="km-chart-stat-val">{project.expectedYield}</span>
            </div>
          </div>

          {/* SVG Progression Curve with checkpoints */}
          <div className="km-svg-curve-wrapper">
            <svg viewBox="0 0 400 120" className="km-growth-svg" preserveAspectRatio="none">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0D5C3A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0D5C3A" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Shaded Area */}
              <path
                d="M 20 95 Q 120 70 200 45 T 380 15 L 380 115 L 20 115 Z"
                fill="url(#curveGradient)"
              />
              {/* Curve Line */}
              <path
                d="M 20 95 Q 120 70 200 45 T 380 15"
                fill="none"
                stroke="#0D5C3A"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Milestone Checkpoints */}
              <circle cx="20" cy="95" r="5" fill="#FFFFFF" stroke="#0D5C3A" strokeWidth="2.5" />
              <circle cx="140" cy="65" r="5" fill="#FFFFFF" stroke="#0D5C3A" strokeWidth="2.5" />
              <circle cx="260" cy="35" r="5" fill="#FFFFFF" stroke="#0D5C3A" strokeWidth="2.5" />
              <circle cx="380" cy="15" r="6" fill="#0D5C3A" stroke="#FFFFFF" strokeWidth="2.5" />
            </svg>

            {/* Timeline Markers */}
            <div className="km-chart-timeline-labels">
              <span>Week 1 (Sowing)</span>
              <span>Week 2 (Tillering)</span>
              <span>Week 3 (Flowering)</span>
              <span>Week 4 (Harvest)</span>
            </div>
          </div>
        </section>

        {/* Active Cultivation Lifecycle Status */}
        <section className="km-tracker-hero">
          <div className="km-tracker-hero-top">
            <div>
              <div className="km-brand-badge">● Field Lifecycle Status</div>
              <h2 className="km-tracker-crop-name">
                {project.cropName} — {project.variety}
              </h2>
              <div className="km-tracker-meta-chips">
                <span>
                  <Layers size={14} style={{ verticalAlign: "middle" }} /> {project.plotName} ({project.area})
                </span>
                <span>• Started: {project.startDate}</span>
                <span>• Est. Profit: {project.estimatedProfit}</span>
              </div>
            </div>

            <div className="km-tracker-progress-num-box">
              <div className="km-tracker-progress-lbl">Lifecycle Progress</div>
              <div className="km-tracker-progress-val">{project.progressPercent}%</div>
            </div>
          </div>

          <div className="km-tracker-progress-shell">
            <div className="km-tracker-progress-header">
              <span>Active Stage: <strong>{currentPhase.title}</strong></span>
              <span>Day {currentPhase.daysFromStart}–{currentPhase.daysFromStart + currentPhase.durationDays}</span>
            </div>
            <div className="km-tracker-bar-track">
              <div
                className="km-tracker-bar-fill"
                style={{ width: `${project.progressPercent}%` }}
              />
            </div>
          </div>
        </section>

        {/* Community Section (Matches Image 1 Screen 1) */}
        <section className="km-community-section">
          <div className="km-community-header">
            <h3 className="km-community-title">Community</h3>
            <button className="km-community-viewall" onClick={() => navigate("/call")}>
              View all
            </button>
          </div>

          <div className="km-community-list">
            {communityList.map((comm) => (
              <div key={comm.id} className="km-community-card">
                <div className="km-comm-thumb">
                  <img src={comm.img} alt={comm.name} loading="lazy" />
                </div>
                <div className="km-comm-info">
                  <div className="km-comm-name">{comm.name}</div>
                  <div className="km-comm-region">{comm.region}</div>
                  <div className="km-comm-members">{comm.members}</div>
                </div>
                <button
                  className="km-comm-join-btn"
                  onClick={() => alert(`Joined ${comm.name}! Connect with fellow local farmers in Sundargarh.`)}
                >
                  Join
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Stage Timeline Checklist */}
        <section className="km-stages-section">
          <h3 className="km-community-title" style={{ marginBottom: 16 }}>Cultivation Stages</h3>
          <div className="km-stages-list">
            {project.phases.map((phase, idx) => {
              const isCompleted = phase.status === "completed";
              const isInProgress = phase.status === "in_progress";

              return (
                <div
                  key={phase.id}
                  className={`km-stage-card ${isCompleted ? "completed" : ""} ${isInProgress ? "active" : ""}`}
                >
                  <div className="km-stage-left">
                    <div className="km-stage-idx">
                      {isCompleted ? <CheckCircle2 size={16} color="#0D5C3A" /> : idx + 1}
                    </div>
                    <div>
                      <div className="km-stage-name">{phase.title}</div>
                      <div className="km-stage-desc">{phase.description}</div>
                    </div>
                  </div>

                  <div className="km-stage-right">
                    {isCompleted ? (
                      <span className="km-badge-done">Completed</span>
                    ) : isInProgress ? (
                      <button
                        className="km-mark-complete-btn"
                        onClick={() => setActiveModalPhase(phase)}
                      >
                        Log Stage Done
                      </button>
                    ) : (
                      <span className="km-badge-pending">Upcoming</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Stage Completion Modal */}
      {activeModalPhase && (
        <div className="km-modal-overlay">
          <div className="km-modal-sheet">
            <h3 className="km-modal-title">Verify {activeModalPhase.title}</h3>
            <p className="km-modal-sub">
              Log your field notes, fertilizer dosage, or date completed for Krishi records.
            </p>
            <textarea
              className="km-modal-textarea"
              placeholder="e.g. Applied Urea and Zinc Sulphate as recommended. Field condition healthy."
              value={farmerNotes}
              onChange={(e) => setFarmerNotes(e.target.value)}
              rows={3}
            />
            <div className="km-modal-actions">
              <button
                className="km-modal-cancel"
                onClick={() => setActiveModalPhase(null)}
              >
                Cancel
              </button>
              <button
                className="km-modal-confirm"
                onClick={() => handleLodgeComplete(activeModalPhase.id)}
              >
                Confirm Stage Complete
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
