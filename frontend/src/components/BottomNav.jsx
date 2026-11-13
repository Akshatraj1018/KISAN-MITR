// src/components/BottomNav.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Sprout, BarChart3, User, PhoneCall } from "lucide-react";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { label: "Home", path: "/dashboard", icon: Home, match: ["/dashboard", "/home"] },
    { label: "All Farms", path: "/farm-details", icon: Sprout, match: ["/farm-details", "/details"] },
    { label: "Krishi Sathi", path: "/call", icon: PhoneCall, match: ["/call"], isSpecial: true },
    { label: "Statistic", path: "/cultivation-tracker", icon: BarChart3, match: ["/cultivation-tracker", "/stats"] },
    { label: "My Profile", path: "/farmer-profile", icon: User, match: ["/farmer-profile", "/profile"] },
  ];

  return (
    <nav className="km-bottom-dock" aria-label="Bottom Navigation">
      <div className="km-dock-container">
        {navItems.map((item) => {
          const isActive =
            (item.path === "/dashboard" && (path === "/" || path === "/dashboard" || path === "/home")) ||
            item.match.some((m) => path.startsWith(m));
          const Icon = item.icon;

          if (item.isSpecial) {
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`km-dock-special-btn ${isActive ? "active" : ""}`}
                title="Call Krishi Sathi Helpline"
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
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
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
