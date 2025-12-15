import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Weather from "../Weather";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [healthOpen, setHealthOpen] = useState(
    location.pathname.startsWith("/medications") ||
    location.pathname.startsWith("/treatments") ||
    location.pathname.startsWith("/exams")
  );

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

const isActive = (path) => location.pathname.startsWith(path);

  React.useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🐾 PetCare</h2>
      </div>

      <nav className="sidebar-nav">
        <div
          className={`nav-item ${isActive("/main") ? "active" : ""}`}
          onClick={() => navigate("/main")}
        >
          <span className="nav-icon">🏠</span>
          <span>Domov</span>
        </div>

        <div
          className={`nav-item ${isActive("/profile") ? "active" : ""}`}
          onClick={() => navigate("/profile")}
        >
          <span className="nav-icon">👤</span>
          <span>Profil</span>
        </div>

        <div
          className={`nav-item ${isActive("/mypets") ? "active" : ""}`}
          onClick={() => navigate("/mypets")}
        >
          <span className="nav-icon">🐾</span>
          <span>Moji ljubljenčki</span>
        </div>

        <div
          className={`nav-item ${
            location.pathname.startsWith("/medications") ||
            location.pathname.startsWith("/treatments") ||
            location.pathname.startsWith("/exams")
              ? "active"
              : ""
          }`}
          onClick={() => setHealthOpen(!healthOpen)}
        >
          <span className="nav-icon">❤️</span>
          <span>Zdravje</span>
          <span className="submenu-arrow">{healthOpen ? "▾" : "▸"}</span>
        </div>

        {healthOpen && (
          <div className="submenu">
            <div
              className={`submenu-item ${isActive("/medications") ? "active" : ""}`}
              onClick={() => navigate("/medications")}
            >
              💊 Zdravila
            </div>

            <div
              className={`submenu-item ${isActive("/treatments") ? "active" : ""}`}
              onClick={() => navigate("/treatments")}
            >
              🩺 Zdravljenja
            </div>

            <div
              className={`submenu-item ${isActive("/exams") ? "active" : ""}`}
              onClick={() => navigate("/exams")}
            >
              🧾 Pregledi
            </div>
          </div>
        )}

        <div
          className={`nav-item ${isActive("/meals") ? "active" : ""}`}
          onClick={() => navigate("/meals")}
        >
          <span className="nav-icon">🍽️</span>
          <span>Obroki</span>
        </div>

        <div
          className={`nav-item ${isActive("/activities") ? "active" : ""}`}
          onClick={() => navigate("/activities")}
        >
          <span className="nav-icon">🏃‍♂️</span>
          <span>Aktivnosti</span>
        </div>

        <div
          className={`nav-item ${isActive("/reminders") ? "active" : ""}`}
          onClick={() => navigate("/reminders")}
        >
          <span className="nav-icon">🔔</span>
          <span>Opomniki</span>
        </div>
      </nav>

      <div
        className="nav-item theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        <span className="nav-icon">
          {darkMode ? "☀️" : "🌙"}
        </span>
        <span>
          {darkMode ? "Svetli način" : "Temni način"}
        </span>
      </div>

      <Weather />

      <div className="sidebar-footer">
        <div
          className="nav-item"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
        >
          <span className="nav-icon">🚪</span>
          <span>Odjava</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;