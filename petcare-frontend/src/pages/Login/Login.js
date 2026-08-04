import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Login stran
 * Omogoča prijavo obstoječega uporabnika.
 */
const Login = () => {
  // Navigacija
  const navigate = useNavigate();

  // Prijava uporabnika
  const { login } = useAuth();

  // Podatki obrazca
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Napaka
  const [error, setError] = useState("");

  // Loading stanje
  const [loading, setLoading] = useState(false);

  /**
   * Posodobi vrednosti obrazca.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Ob pisanju izbriši staro napako
    if (error) {
      setError("");
    }
  };

  /**
   * Pošlje prijavne podatke na backend.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const email = form.email.trim();

    if (!email || !form.password) {
      setError("Izpolnite vsa polja.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/users/login`, {
        email,
        geslo: form.password,
      });

      // Shrani uporabnika in JWT
      login(res.data);

      // Preusmeri na glavno stran
      navigate("/main");
    } catch (err) {
      console.error("Napaka pri prijavi:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Napaka pri prijavi. Preverite email in geslo.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Preusmeri na registracijo.
   */
  const goToSignup = () => {
    navigate("/signup");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Glava */}
        <header className="login-header">
          <h1>Dobrodošli nazaj!</h1>

          <p className="subtitle">
            Prijavite se v svoj PetCare račun in nadaljujte s skrbjo za svoje
            ljubljenčke na enem mestu.
          </p>
        </header>

        {/* Obrazec */}
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="email@primer.si"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>

          {/* Napaka */}
          {error && <p className="error-text">{error}</p>}

          {/* Registracija */}
          <div className="bottom-row">
            <span className="small-text">
              Nimate računa?{" "}
              <button
                type="button"
                className="link"
                onClick={goToSignup}
                disabled={loading}
              >
                Registrirajte se
              </button>
            </span>
          </div>

          <button
            type="submit"
            className="cta-btn"
            disabled={loading}
          >
            {loading ? "Prijavljanje..." : "Prijava"}
          </button>
        </form>
      </div>

      {/* Dekorativni elementi */}
      <div className="decor decor-1"></div>
      <div className="decor decor-2"></div>
    </div>
  );
};

export default Login;