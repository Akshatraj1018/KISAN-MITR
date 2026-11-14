// src/pages/FarmerProfile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { MapPin, Mail, User, Edit2, Check, X, ArrowLeft, ShieldCheck, Phone, Sprout, Layers, LogOut } from "lucide-react";
import "../styles/FarmerProfile.css";

export default function FarmerProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const storedProfile = (() => {
    try {
      const raw = localStorage.getItem("farmerProfile") || localStorage.getItem("userProfile");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const [farmerData, setFarmerData] = useState({
    name: localStorage.getItem("farmerName") || storedProfile?.fullName || "Rameshwar Singh",
    age: localStorage.getItem("farmerAge") || storedProfile?.age || "38 Years",
    phone: localStorage.getItem("farmerPhone") || storedProfile?.phone || "+91 98765 43210",
    email: localStorage.getItem("farmerEmail") || storedProfile?.email || "farmer@kisanmitr.in",
    location: localStorage.getItem("farmerLocation") || storedProfile?.location || "Rourkela, Sundargarh, Odisha",
    landSize: localStorage.getItem("farmerLandSize") || storedProfile?.landSize || "4 Acres",
    soilType: storedProfile?.soilType || "Red & Laterite Loam",
    primaryCrops: localStorage.getItem("farmerCrop") || storedProfile?.crop || "Wheat (HD-2967), Mustard",
    kccStatus: "Active (Approved ₹2,50,000)",
    pmKisanStatus: "17th Installment Credited",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(farmerData.name);
  const [tempLocation, setTempLocation] = useState(farmerData.location);
  const [tempLand, setTempLand] = useState(farmerData.landSize);

  const handleSave = () => {
    setFarmerData((prev) => ({
      ...prev,
      name: tempName,
      location: tempLocation,
      landSize: tempLand,
    }));
    localStorage.setItem("farmerName", tempName);
    localStorage.setItem("farmerLocation", tempLocation);
    setIsEditing(false);
  };

  return (
    <div className="km-profile-page">
      <div className="km-profile-container">
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
            {isEditing ? (
              <button
                className="km-btn-doc primary"
                style={{ padding: "8px 16px", borderRadius: 9999 }}
                onClick={handleSave}
              >
                <Check style={{ width: 15, height: 15 }} />
                <span>Save Changes</span>
              </button>
            ) : (
              <button
                className="km-btn-doc secondary"
                style={{ padding: "8px 16px", borderRadius: 9999 }}
                onClick={() => setIsEditing(true)}
              >
                <Edit2 style={{ width: 15, height: 15 }} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Card Shell */}
        <div className="km-profile-card-shell">
          {/* Top Bar with Avatar & Badges */}
          <div className="km-profile-top-bar">
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div className="km-avatar-large">
                {farmerData.name.charAt(0)}
              </div>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 800, color: "white", margin: "0 0 4px 0" }}>
                  {farmerData.name}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#94a3b8", fontSize: 13 }}>
                  <MapPin style={{ width: 14, height: 14, color: "#10b981" }} />
                  <span>{farmerData.location}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <span className="km-brand-badge" style={{ background: "rgba(16,185,129,0.2)" }}>
                Verified Farmer (Kisan Mitra ID: KM-7842)
              </span>
              <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 700 }}>
                ● Aadhaar & Land Record Linked
              </span>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="km-profile-grid-fields">
            <div className="km-field-box">
              <label>Full Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                />
              ) : (
                <span className="val">{farmerData.name}</span>
              )}
            </div>

            <div className="km-field-box">
              <label>Mobile Number:</label>
              <span className="val">{farmerData.phone}</span>
            </div>

            <div className="km-field-box">
              <label>Farmer Age:</label>
              <span className="val">{farmerData.age}</span>
            </div>

            <div className="km-field-box">
              <label>Farm Location / Village:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                />
              ) : (
                <span className="val">{farmerData.location}</span>
              )}
            </div>

            <div className="km-field-box">
              <label>Total Land Holdings:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempLand}
                  onChange={(e) => setTempLand(e.target.value)}
                />
              ) : (
                <span className="val">{farmerData.landSize}</span>
              )}
            </div>

            <div className="km-field-box">
              <label>Dominant Soil Type:</label>
              <span className="val">{farmerData.soilType}</span>
            </div>

            <div className="km-field-box">
              <label>Primary Cultivated Crops:</label>
              <span className="val">{farmerData.primaryCrops}</span>
            </div>

            <div className="km-field-box" style={{ borderColor: "rgba(16,185,129,0.3)" }}>
              <label>Kisan Credit Card (KCC) Status:</label>
              <span className="val" style={{ color: "#34d399" }}>{farmerData.kccStatus}</span>
            </div>

            <div className="km-field-box" style={{ borderColor: "rgba(245,158,11,0.3)" }}>
              <label>PM-Kisan Samman Nidhi:</label>
              <span className="val" style={{ color: "#f59e0b" }}>{farmerData.pmKisanStatus}</span>
            </div>
          </div>

          {/* Logout Action */}
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              className="km-btn-doc secondary"
              style={{ background: "rgba(239, 68, 68, 0.15)", color: "#f87171", borderColor: "rgba(239, 68, 68, 0.3)" }}
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                navigate("/login");
              }}
            >
              <LogOut style={{ width: 16, height: 16 }} />
              <span>Sign Out of Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
