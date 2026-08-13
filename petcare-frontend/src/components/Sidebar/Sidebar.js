import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Weather from "../Weather";
import "./Sidebar.css";

/**
 * Stranska navigacija aplikacije
 */
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

  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  /* ================= TEMA ================= */

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  /* ================= ZAKLENI STRAN ================= */

  useEffect(() => {
    if (mobileOpen) {
      document.body.classList.add("mobile-sidebar-open");
    } else {
      document.body.classList.remove("mobile-sidebar-open");
    }

    return () => {
      document.body.classList.remove("mobile-sidebar-open");
    };
  }, [mobileOpen]);

  /* ================= ZAPRI SIDEBAR OB NAVIGACIJI ================= */

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* ================= MOBILE HAMBURGER ================= */}

      <button
        type="button"
        className={`mobile-menu-btn ${
          mobileOpen ? "mobile-menu-btn-open" : ""
        }`}
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-label={mobileOpen ? "Zapri meni" : "Odpri meni"}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* ================= OVERLAY ================= */}

      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>

        {/* ================= GLAVA ================= */}

        <div className="sidebar-header">

          {/* MOBILE X */}
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setMobileOpen(false)}
            aria-label="Zapri meni"
          >
            ✕
          </button>

          <h2>🐾 PetCare</h2>
        </div>

        {/* ================= NAVIGACIJA ================= */}

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

          {/* ================= ZDRAVJE ================= */}

          <div
            className={`nav-item ${
              location.pathname.startsWith("/medications") ||
              location.pathname.startsWith("/treatments") ||
              location.pathname.startsWith("/exams")
                ? "active"
                : ""
            }`}
            onClick={() => setHealthOpen((prev) => !prev)}
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

        {/* ================= TEMA ================= */}

        <div
          className="nav-item theme-toggle"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          <span className="nav-icon">
            {darkMode ? "☀️" : "🌙"}
          </span>

          <span>
            {darkMode ? "Svetli način" : "Temni način"}
          </span>
        </div>

        {/* ================= VREME ================= */}

        <Weather />

        {/* ================= ODJAVA ================= */}

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

      </aside>
    </>
  );
};

export default Sidebar;