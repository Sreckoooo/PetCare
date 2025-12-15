import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Profile.css";
import "../../styles/layout.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const Profile = () => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    ime: "",
    priimek: "",
    email: "",
    trenutnoGeslo: "",
    novoGeslo: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setFormData({
          ime: res.data.ime,
          priimek: res.data.priimek,
          email: res.data.email,
          trenutnoGeslo: "",
          novoGeslo: "",
        });
      } catch (err) {
        console.error("Napaka pri pridobivanju uporabnika:", err);
      }
    };

    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // frontend validacija za geslo
    if (formData.novoGeslo && !formData.trenutnoGeslo) {
      alert("Za spremembo gesla morate vnesti trenutno geslo.");
      return;
    }

    try {
      // payload brez emaila
      const payload = {
        ime: formData.ime,
        priimek: formData.priimek,
      };

      // geslo pošljemo samo, če ga želi spremeniti
      if (formData.novoGeslo) {
        payload.trenutnoGeslo = formData.trenutnoGeslo;
        payload.novoGeslo = formData.novoGeslo;
      }

      await axios.put(`${API_BASE}/users/me`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Profil uspešno posodobljen");

      setFormData({
        ...formData,
        trenutnoGeslo: "",
        novoGeslo: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Napaka pri shranjevanju");
    }
  };

  if (!user) {
    return (
      <div className="main-app">
        <Sidebar active="profile" />
        <div className="page-content">Nalagam...</div>
      </div>
    );
  }

  return (
  <div className="main-app">
    <Sidebar active="profile" />

    <div className="page-content">
      <div className="profile-page">
        {/* dekorativni elementi */}
        <div className="profile-decor profile-decor-1"></div>
        <div className="profile-decor profile-decor-2"></div>
        <div className="profile-decor profile-decor-3"></div>

        <div className="profile-card">
          <div className="profile-header">
            <h1>Moj profil</h1>
          </div>

          <form onSubmit={handleSave} className="profile-form">
            <input
              type="text"
              name="ime"
              placeholder="Ime"
              value={formData.ime}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="priimek"
              placeholder="Priimek"
              value={formData.priimek}
              onChange={handleChange}
              required
            />

            {/* EMAIL – zaklenjen */}
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
            />

            <input
              type="password"
              name="trenutnoGeslo"
              placeholder="Trenutno geslo"
              value={formData.trenutnoGeslo}
              onChange={handleChange}
            />

            <input
              type="password"
              name="novoGeslo"
              placeholder="Novo geslo"
              value={formData.novoGeslo}
              onChange={handleChange}
            />

            <button type="submit">Shrani spremembe</button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
};

export default Profile;