import React, { useEffect, useState } from "react";
import {
  getPets,
  getAktivnostiByPet,
  createAktivnost,
  updateAktivnost,
  deleteAktivnost,
} from "../../api/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Activities.css";

// 🔹 helper za prikaz ure v AM/PM
const formatTimeAMPM = (time24) => {
  if (!time24) return "";
  const [h, m] = time24.split(":");
  let hour = Number(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
};

// 🔹 helper za slovenski format datuma
const formatDateSI = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("sl-SI");
};

const Activities = () => {
  const token = localStorage.getItem("token");

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [aktivnosti, setAktivnosti] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const [formData, setFormData] = useState({
    naziv: "",
    trajanje: "",
    datum: "",
    ura: "",
  });

  /* ================= LOAD PETS ================= */

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

  /* ================= LOAD ACTIVITIES ================= */

  useEffect(() => {
    if (!selectedPet) {
      setAktivnosti([]);
      return;
    }

    const loadAktivnosti = async () => {
      try {
        const data = await getAktivnostiByPet(selectedPet, token);
        setAktivnosti(data);
      } catch (err) {
        console.error("Napaka pri nalaganju aktivnosti", err);
      }
    };

    loadAktivnosti();
  }, [selectedPet, token]);

  /* ================= SUBMIT (ADD / EDIT) ================= */

  const submitActivity = async (e) => {
    e.preventDefault();

    try {
      if (editingActivity) {
        // ✏️ EDIT
        await updateAktivnost(
          editingActivity._id,
          {
            pet: selectedPet,
            naziv: formData.naziv,
            trajanje: Number(formData.trajanje),
            datum: formData.datum,
            ura: formData.ura,
          },
          token
        );
      } else {
        // ➕ ADD
        await createAktivnost(
          {
            pet: selectedPet,
            naziv: formData.naziv,
            trajanje: Number(formData.trajanje),
            datum: formData.datum,
            ura: formData.ura,
          },
          token
        );
      }

      // reset
      setFormData({ naziv: "", trajanje: "", datum: "", ura: "" });
      setEditingActivity(null);
      setShowForm(false);

      // refetch
      const data = await getAktivnostiByPet(selectedPet, token);
      setAktivnosti(data);
    } catch (err) {
      console.error("Napaka pri shranjevanju aktivnosti", err);
    }
  };

  /* ================= DELETE ================= */

  const removeActivity = async (id) => {
    try {
      await deleteAktivnost(id, token);
      setAktivnosti(aktivnosti.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Napaka pri brisanju aktivnosti", err);
    }
  };

  return (
    <div className="main-app">
      <Sidebar active="activities" />

      <div className="page-content activities-page">
        {/* HEADER */}
        <div className="page-header">
          <h1>Aktivnosti</h1>
        </div>

        {/* FILTER + ADD */}
        <div className="page-filter">
          <select
            className="pet-select"
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
          >
            <option value="">Izberi ljubljenčka</option>
            {pets.map((p) => (
              <option key={p._id} value={p._id}>
                {p.ime}
              </option>
            ))}
          </select>

          {selectedPet && (
            <button
              className="add-btn"
              onClick={() => {
                setEditingActivity(null);
                setFormData({
                  naziv: "",
                  trajanje: "",
                  datum: "",
                  ura: "",
                });
                setShowForm(true);
              }}
            >
              + Dodaj aktivnost
            </button>
          )}
        </div>

        {/* EMPTY */}
        {selectedPet && aktivnosti.length === 0 && (
          <p className="empty-text">
            Za tega ljubljenčka še ni aktivnosti.
          </p>
        )}

        {/* LIST */}
        <div className="activities-list">
          {aktivnosti.map((a) => (
            <div key={a._id} className="activity-card">
              <div className="activity-left">
                <h3>{a.naziv}</h3>

                <div className="activity-meta">
                  <span>
                    <strong>Trajanje:</strong> {a.trajanje} min
                  </span>
                  <span>
                    <strong>Datum:</strong> {formatDateSI(a.datum)}
                  </span>
                  <span>
                    <strong>Ura:</strong> {formatTimeAMPM(a.ura)}
                  </span>
                </div>
              </div>

              <div className="activity-actions">
                <button
                  className="icon-btn edit"
                  onClick={() => {
                    setEditingActivity(a);
                    setFormData({
                      naziv: a.naziv,
                      trajanje: a.trajanje,
                      datum: a.datum?.slice(0, 10),
                      ura: a.ura,
                    });
                    setShowForm(true);
                  }}
                >
                  ✏️
                </button>

                <button
                  className="icon-btn delete"
                  onClick={() => removeActivity(a._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL FORM – ISTO KOT MYPETS */}
        {showForm && (
          <div className="add-pet-form-overlay">
            <form className="add-pet-form" onSubmit={submitActivity}>
              <h3>
                {editingActivity ? "Uredi aktivnost" : "Dodaj aktivnost"}
              </h3>

              <input
                type="text"
                placeholder="Naziv aktivnosti"
                required
                value={formData.naziv}
                onChange={(e) =>
                  setFormData({ ...formData, naziv: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Trajanje (v minutah)"
                required
                value={formData.trajanje}
                onChange={(e) =>
                  setFormData({ ...formData, trajanje: e.target.value })
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
                    setEditingActivity(null);
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

export default Activities;