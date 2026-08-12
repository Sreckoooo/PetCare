import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Weather from "../Weather";
import "./Sidebar.css";

/**
 * Stranska navigacija aplikacije
 * Vsebuje glavno navigacijo, podmeni za zdravje,
 * preklop temnega načina in prikaz vremena
 */
const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Stanje za odpiranje / zapiranje podmenija Zdravje
   */
  const [healthOpen, setHealthOpen] = useState(
    location.pathname.startsWith("/medications") ||
      location.pathname.startsWith("/treatments") ||
      location.pathname.startsWith("/exams")
  );

  /**
   * Stanje za temni / svetli način
   */
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  /**
   * Stanje za mobilni sidebar
   */
  const [mobileOpen, setMobileOpen] = useState(false);

  /**
   * Preveri, ali je pot trenutno aktivna
   */
  const isActive = (path) => location.pathname.startsWith(path);

  /**
   * Uporabi temo na body element in shrani izbiro v localStorage
   */
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <>
      {/* ================= HAMBURGER NA TELEFONU ================= */}

      <button
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Odpri meni"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* ================= OZADJE ZA ZAPRTJE MENIJA ================= */}

      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <div className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Glava stranske navigacije */}
        <div className="sidebar-header">
          <h2>🐾 PetCare</h2>
        </div>

        {/* Glavna navigacija */}
        <nav className="sidebar-nav">
          <div
            className={`nav-item ${isActive("/main") ? "active" : ""}`}
            onClick={() => {
              navigate("/main");
              setMobileOpen(false);
            }}
          >
            <span className="nav-icon">🏠</span>
            <span>Domov</span>
          </div>

          <div
            className={`nav-item ${isActive("/profile") ? "active" : ""}`}
            onClick={() => {
              navigate("/profile");
              setMobileOpen(false);
            }}
          >
            <span className="nav-icon">👤</span>
            <span>Profil</span>
          </div>

          <div
            className={`nav-item ${isActive("/mypets") ? "active" : ""}`}
            onClick={() => {
              navigate("/mypets");
              setMobileOpen(false);
            }}
          >
            <span className="nav-icon">🐾</span>
            <span>Moji ljubljenčki</span>
          </div>

          {/* Zdravje – podmeni */}
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
            <span className="submenu-arrow">
              {healthOpen ? "▾" : "▸"}
            </span>
          </div>

          {healthOpen && (
            <div className="submenu">
              <div
                className={`submenu-item ${
                  isActive("/medications") ? "active" : ""
                }`}
                onClick={() => {
                  navigate("/medications");
                  setMobileOpen(false);
                }}
              >
                💊 Zdravila
              </div>

              <div
                className={`submenu-item ${
                  isActive("/treatments") ? "active" : ""
                }`}
                onClick={() => {
                  navigate("/treatments");
                  setMobileOpen(false);
                }}
              >
                🩺 Zdravljenja
              </div>

              <div
                className={`submenu-item ${
                  isActive("/exams") ? "active" : ""
                }`}
                onClick={() => {
                  navigate("/exams");
                  setMobileOpen(false);
                }}
              >
                🧾 Pregledi
              </div>
            </div>
          )}

          <div
            className={`nav-item ${isActive("/meals") ? "active" : ""}`}
            onClick={() => {
              navigate("/meals");
              setMobileOpen(false);
            }}
          >
            <span className="nav-icon">🍽️</span>
            <span>Obroki</span>
          </div>

          <div
            className={`nav-item ${isActive("/activities") ? "active" : ""}`}
            onClick={() => {
              navigate("/activities");
              setMobileOpen(false);
            }}
          >
            <span className="nav-icon">🏃‍♂️</span>
            <span>Aktivnosti</span>
          </div>

          <div
            className={`nav-item ${isActive("/reminders") ? "active" : ""}`}
            onClick={() => {
              navigate("/reminders");
              setMobileOpen(false);
            }}
          >
            <span className="nav-icon">🔔</span>
            <span>Opomniki</span>
          </div>
        </nav>

        {/* Preklop teme */}
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

        {/* Vreme */}
        <Weather />

        {/* Odjava */}
        <div className="sidebar-footer">
          <div
            className="nav-item"
            onClick={() => {
              localStorage.removeItem("token");
              setMobileOpen(false);
              navigate("/");
            }}
          >
            <span className="nav-icon">🚪</span>
            <span>Odjava</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;