import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Stethoscope, TrendingUp, FlaskConical, User, PhoneCall } from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { label: "Home", path: "/dashboard", icon: Home, match: ["/dashboard", "/home"] },
    { label: "Crop Doctor", path: "/solution", icon: Stethoscope, match: ["/solution", "/scan"] },
    { label: "Krishi Sathi", path: "/call", icon: PhoneCall, match: ["/call"], isSpecial: true },
    { label: "Mandi Rates", path: "/mandi", icon: TrendingUp, match: ["/mandi"] },
    { label: "My Profile", path: "/farmer-profile", icon: User, match: ["/farmer-profile"] },
  ];

  return (
    <nav className="km-bottom-dock" aria-label="Bottom Navigation">
      <div className="km-dock-container">
        {navItems.map((item) => {
          const isActive = item.match.some((m) => path.startsWith(m));
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`km-dock-special-btn ${isActive ? "active" : ""}`}
                title="Call Krishi Sathi"
              >
                <div className="km-special-pulse"></div>
                <Icon size={22} className="km-special-icon" />
              </button>
            );
          }

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`km-dock-item ${isActive ? "active" : ""}`}
            >
              <div className="km-dock-icon-wrap">
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              </div>
              <span className="km-dock-label">{item.label}</span>
              {isActive && <div className="km-dock-pill-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
