import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  getPets,
  getObrokiByPet,
  createObrok,
  updateObrok,
  deleteObrok,
} from "../../api/api";
import "./Meals.css";

/* ================= POMOŽNE FUNKCIJE ================= */

/**
 * Pretvori uro iz 24-urnega zapisa v AM/PM format
 */
const formatTimeAMPM = (time24) => {
  if (!time24) return "";
  const [h, m] = time24.split(":");
  let hour = Number(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
};

/**
 * Oblikuje datum v slovenski zapis
 */
const formatDateSI = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("sl-SI");
};

/* ================= KOMPONENTA ================= */

const Meals = () => {
  // JWT žeton
  const token = localStorage.getItem("token");

  // Seznam ljubljenčkov
  const [pets, setPets] = useState([]);

  // Izbran ljubljenček
  const [selectedPet, setSelectedPet] = useState("");

  // Obroki izbranega ljubljenčka
  const [obroki, setObroki] = useState([]);

  // Prikaz modalnega obrazca
  const [showForm, setShowForm] = useState(false);

  // Obrok v urejanju
  const [editingMeal, setEditingMeal] = useState(null);

  // Podatki obrazca
  const [formData, setFormData] = useState({
    ime: "",
    datum: "",
    ura: "",
  });

  /* ================= NALAGANJE LJUBLJENČKOV ================= */

  useEffect(() => {
    const loadPets = async () => {
      try {
        const data = await getPets(token);
        setPets(data);
      } catch (err) {
        console.error("Napaka pri nalaganju ljubljenčkov", err);
      }
    };
    loadPets();
  }, [token]);

  /* ================= NALAGANJE OBROKOV ================= */

  useEffect(() => {
    if (!selectedPet) {
      setObroki([]);
      return;
    }

    const loadMeals = async () => {
      try {
        const data = await getObrokiByPet(selectedPet, token);
        setObroki(data);
      } catch (err) {
        console.error("Napaka pri nalaganju obrokov", err);
      }
    };

    loadMeals();
  }, [selectedPet, token]);

  /* ================= SHRANJEVANJE (DODAJ / UREDI) ================= */

  const submitMeal = async (e) => {
    e.preventDefault();

    try {
      if (editingMeal) {
        // Urejanje obstoječega obroka
        await updateObrok(
          editingMeal._id,
          {
            pet: selectedPet,
            ime: formData.ime,
            datum: formData.datum,
            ura: formData.ura,
          },
          token
        );
      } else {
        // Dodajanje novega obroka
        await createObrok(
          {
            pet: selectedPet,
            ime: formData.ime,
            datum: formData.datum,
            ura: formData.ura,
          },
          token
        );
      }

      // Ponastavitev obrazca
      setFormData({ ime: "", datum: "", ura: "" });
      setEditingMeal(null);
      setShowForm(false);

      // Ponovno naloži obroke
      const data = await getObrokiByPet(selectedPet, token);
      setObroki(data);
    } catch (err) {
      console.error("Napaka pri shranjevanju obroka", err);
    }
  };

  /* ================= BRISANJE ================= */

  const removeMeal = async (id) => {
    try {
      await deleteObrok(id, token);
      setObroki(obroki.filter((o) => o._id !== id));
    } catch (err) {
      console.error("Napaka pri brisanju obroka", err);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="main-app">
      <Sidebar active="meals" />

      <div className="page-content meals-page">
        {/* Naslov strani */}
        <div className="page-header">
          <h1>Obroki</h1>
        </div>

        {/* Izbira ljubljenčka in dodajanje */}
        <div className="page-filter">
          <select
            className="pet-select"
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
          >
            <option value="">Izberi ljubljenčka</option>
            {pets.map((pet) => (
              <option key={pet._id} value={pet._id}>
                {pet.ime}
              </option>
            ))}
          </select>

          {selectedPet && (
            <button
              className="add-btn"
              onClick={() => {
                setEditingMeal(null);
                setFormData({ ime: "", datum: "", ura: "" });
                setShowForm(true);
              }}
            >
              + Dodaj obrok
            </button>
          )}
        </div>

        {/* Prazno stanje */}
        {selectedPet && obroki.length === 0 && (
          <p className="empty-text">Za tega ljubljenčka še ni obrokov.</p>
        )}

        {/* Seznam obrokov */}
        <div className="meals-list">
          {obroki.map((o) => (
            <div key={o._id} className="meal-card">
              <div className="meal-left">
                <h3>{o.ime}</h3>

                <div className="meal-meta">
                  <span>
                    <strong>Datum:</strong> {formatDateSI(o.datum)}
                  </span>
                  <span>
                    <strong>Ura:</strong> {formatTimeAMPM(o.ura)}
                  </span>
                </div>
              </div>

              <div className="meal-actions">
                <button
                  className="icon-btn edit"
                  onClick={() => {
                    setEditingMeal(o);
                    setFormData({
                      ime: o.ime,
                      datum: o.datum?.slice(0, 10),
                      ura: o.ura,
                    });
                    setShowForm(true);
                  }}
                >
                  ✏️
                </button>

                <button
                  className="icon-btn delete"
                  onClick={() => removeMeal(o._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modalni obrazec */}
        {showForm && (
          <div className="add-pet-form-overlay">
            <form className="add-pet-form" onSubmit={submitMeal}>
              <h3>{editingMeal ? "Uredi obrok" : "Dodaj obrok"}</h3>

              <input
                type="text"
                placeholder="Ime obroka"
                required
                value={formData.ime}
                onChange={(e) =>
                  setFormData({ ...formData, ime: e.target.value })
                }
              />

              <input
                type="date"
                required
                value={formData.datum}
                onChange={(e) =>
                  setFormData({ ...formData, datum: e.target.value })
                }
              />

              <input
                type="time"
                required
                value={formData.ura}
                onChange={(e) =>
                  setFormData({ ...formData, ura: e.target.value })
                }
              />

              <div className="form-buttons">
                <button type="submit">Shrani</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMeal(null);
                  }}
                >
                  Prekliči
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Meals;