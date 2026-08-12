import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Login stran
 * Omogoča prijavo obstoječega uporabnika
 */
const Login = () => {

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, []);

  // Navigacija po aplikaciji
  const navigate = useNavigate();

  // Funkcija za prijavo iz AuthContext-a
  const { login } = useAuth();

  // Podatki obrazca
  const [form, setForm] = useState({ email: "", password: "" });

  // Sporočilo o napaki
  const [error, setError] = useState("");

  /**
   * Posodobi stanje obrazca
   */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /**
   * Pošlje prijavne podatke na backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_URL}/users/login`, {
        email: form.email,
        geslo: form.password,
      });

      // Shrani uporabnika in žeton
      login(res.data);

      // Preusmeritev na nadzorno ploščo
      navigate("/main");
    } catch (err) {
      console.error(err);
      setError("Napaka pri prijavi. Preveri email in geslo.");
    }
  };

  /**
   * Preusmeritev na registracijo
   */
  const goToSignup = () => navigate("/signup");

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Glava prijavne kartice */}
        <header className="login-header">
          <h1>Dobrodošli nazaj!</h1>
          <p className="subtitle">
            Prijavite se v svoj PetCare račun in nadaljujte s skrbjo za svoje
            ljubljenčke na enem mestu.
          </p>
        </header>

        {/* Prijavni obrazec */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@primer.si"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {/* Prikaz napake */}
          {error && <p className="error-text">{error}</p>}

          {/* Povezava do registracije */}
          <div className="bottom-row">
            <span className="small-text">
              Nimate računa?{" "}
              <button type="button" className="link" onClick={goToSignup}>
                Registrirajte se
              </button>
            </span>
          </div>

          <button type="submit" className="cta-btn">
            Prijava
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