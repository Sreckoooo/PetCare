import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import {
  getZdravila,
  createZdravilo,
  updateZdravilo,
  deleteZdravilo,
} from "../../api/api";
import "./Medications.css";

/* ================= KOMPONENTA ================= */

const Medications = () => {
  // Seznam zdravil
  const [medications, setMedications] = useState([]);

  // Stanje nalaganja
  const [loading, setLoading] = useState(true);

  // Prikaz obrazca
  const [showForm, setShowForm] = useState(false);

  // Zdravilo v urejanju
  const [editingMedication, setEditingMedication] = useState(null);

  // Podatki obrazca
  const [formData, setFormData] = useState({
    ime: "",
    vrsta_odmerka: "",
  });

  // JWT žeton
  const token = localStorage.getItem("token");

  /* ================= NALAGANJE ZDRAVIL ================= */

  useEffect(() => {
    fetchMedications();
    // eslint-disable-next-line
  }, []);

  const fetchMedications = async () => {
    try {
      const data = await getZdravila(token);
      setMedications(data || []);
    } catch (error) {
      console.error("Napaka pri pridobivanju zdravil:", error);
    }
    setLoading(false);
  };

  /* ================= SHRANJEVANJE (DODAJ / UREDI) ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingMedication) {
        // Urejanje obstoječega zdravila
        const updated = await updateZdravilo(
          editingMedication._id,
          formData,
          token
        );

        setMedications((prev) =>
          prev.map((z) =>
            z._id === editingMedication._id ? updated : z
          )
        );
      } else {
        // Dodajanje novega zdravila
        const created = await createZdravilo(formData, token);
        setMedications((prev) => [...prev, created]);
      }

      closeForm();
    } catch (error) {
      console.error("Napaka pri shranjevanju zdravila:", error);
    }
  };

  /* ================= BRISANJE ================= */

  const handleDelete = async (id) => {
    try {
      await deleteZdravilo(id, token);
      setMedications((prev) => prev.filter((z) => z._id !== id));
    } catch (error) {
      console.error("Napaka pri brisanju zdravila:", error);
    }
  };

  /* ================= UREJANJE OBRAZCA ================= */

  const openEditForm = (zdravilo) => {
    setEditingMedication(zdravilo);
    setFormData({
      ime: zdravilo.ime,
      vrsta_odmerka: zdravilo.vrsta_odmerka,
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingMedication(null);
    setFormData({ ime: "", vrsta_odmerka: "" });
  };

  /* ================= NALAGANJE ================= */

  if (loading) {
    return (
      <div className="page-content">
        <p>Nalagam zdravila...</p>
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="main-app">
      <Sidebar />

      <div className="page-content medications-page">
        {/* Glava strani */}
        <div className="medications-header">
          <h1>Zdravila</h1>

          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Dodaj zdravilo
          </button>
        </div>

        {/* Obrazec */}
        {showForm && (
          <div className="medication-form-overlay">
            <form className="medication-form" onSubmit={handleSubmit}>
              <h3>
                {editingMedication ? "Uredi zdravilo" : "Dodaj zdravilo"}
              </h3>

              <input
                type="text"
                placeholder="Ime zdravila"
                value={formData.ime}
                onChange={(e) =>
                  setFormData({ ...formData, ime: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Vrsta odmerka (npr. tableta, ml)"
                value={formData.vrsta_odmerka}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vrsta_odmerka: e.target.value,
                  })
                }
                required
              />

              <div className="form-buttons">
                <button type="submit">
                  {editingMedication ? "Shrani spremembe" : "Shrani"}
                </button>
                <button type="button" onClick={closeForm}>
                  Prekliči
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Prazno stanje */}
        {medications.length === 0 ? (
          <p className="empty-text">Ni dodanih zdravil.</p>
        ) : (
          <div className="medications-list">
            {medications.map((zdravilo) => (
              <div key={zdravilo._id} className="medication-card">
                <div className="medication-info">
                  <h3>{zdravilo.ime}</h3>
                  <span>{zdravilo.vrsta_odmerka}</span>
                </div>

                <div className="medication-actions">
                  <button
                    className="edit-btn"
                    onClick={() => openEditForm(zdravilo)}
                  >
                    ✏️
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(zdravilo._id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Medications;