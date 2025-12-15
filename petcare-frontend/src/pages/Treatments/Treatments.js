import React, { useEffect, useState } from "react";
import {
  getPets,
  getPetZdravilaByPet,
  getZdravila,
  createPetZdravilo,
  updatePetZdravilo,
  deletePetZdravilo,
} from "../../api/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Treatments.css";
import "../../styles/layout.css";

const formatDateSI = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("sl-SI", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const Treatments = () => {
  const token = localStorage.getItem("token");

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [zdravljenja, setZdravljenja] = useState([]);
  const [zdravila, setZdravila] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);

  const [formData, setFormData] = useState({
    zdravilo: "",
    odmerek: "",
    pogostost: "",
    datum_zacetka: "",
    datum_konca: "",
  });

  /* ================= LOAD PETS + ZDRAVILA ================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        setPets(await getPets(token));
        setZdravila(await getZdravila(token));
      } catch (e) {
        console.error("Napaka pri nalaganju osnovnih podatkov", e);
      }
    };
    loadData();
  }, [token]);

  /* ================= LOAD TREATMENTS ================= */

  useEffect(() => {
    if (!selectedPet) return;

    const loadZdravljenja = async () => {
      try {
        const data = await getPetZdravilaByPet(selectedPet, token);
        setZdravljenja(data);
      } catch (e) {
        console.error("Napaka pri nalaganju zdravljenj", e);
      }
    };

    loadZdravljenja();
  }, [selectedPet, token]);

  /* ================= ADD / EDIT ================= */

  const submitTreatment = async (e) => {
    e.preventDefault();

    try {
      if (editingTreatment) {
        // ✏️ EDIT
        const updated = await updatePetZdravilo(
          editingTreatment._id,
          {
            odmerek: formData.odmerek,
            pogostost: formData.pogostost,
            datum_zacetka: formData.datum_zacetka,
            datum_konca: formData.datum_konca || null,
          },
          token
        );

        setZdravljenja((prev) =>
          prev.map((z) => (z._id === updated._id ? updated : z))
        );
      } else {
        // ➕ ADD
        const created = await createPetZdravilo(
          {
            pet: selectedPet,
            ...formData,
            datum_konca: formData.datum_konca || null,
          },
          token
        );

        setZdravljenja((prev) => [...prev, created]);
      }

      closeForm();
    } catch (e) {
      console.error("Napaka pri shranjevanju zdravljenja", e);
    }
  };

  /* ================= DELETE ================= */

  const removeTreatment = async (id) => {
    try {
      await deletePetZdravilo(id, token);
      setZdravljenja((prev) => prev.filter((z) => z._id !== id));
    } catch (e) {
      console.error("Napaka pri brisanju", e);
    }
  };

  /* ================= HELPERS ================= */

  const closeForm = () => {
    setShowForm(false);
    setEditingTreatment(null);
    setFormData({
      zdravilo: "",
      odmerek: "",
      pogostost: "",
      datum_zacetka: "",
      datum_konca: "",
    });
  };

  /* ================= RENDER ================= */

  return (
  <div className="main-app">
    <Sidebar active="health" />

    <div className="page-content treatments-page">
      {/* HEADER – SAMO NASLOV */}
      <div className="page-header">
        <h1>Zdravljenja</h1>
      </div>

      {/* FILTER – ISTO KOT EXAMS */}
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
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Dodaj zdravljenje
          </button>
        )}
      </div>

      {/* EMPTY */}
      {zdravljenja.length === 0 && selectedPet && (
        <p className="empty-text">Ni dodanih zdravljenj.</p>
      )}

      {/* LIST */}
      <div className="treatments-list">
        {zdravljenja.map((z) => (
          <div key={z._id} className="treatment-card">
            {/* LEVA STRAN */}
            <div className="treatment-left">
              <h3>{z.zdravilo?.ime}</h3>

              <span className="treatment-date">
                {formatDateSI(z.datum_zacetka)}
                {z.datum_konca && ` – ${formatDateSI(z.datum_konca)}`}
              </span>

              <div className="treatment-meta">
                <span>
                  <strong>Odmerek:</strong> {z.odmerek}
                </span>
                <span>
                  <strong>Pogostost:</strong> {z.pogostost}
                </span>
              </div>
            </div>

            {/* DESNA STRAN – GUMBI */}
            <div className="treatment-actions">
              <button
                className="icon-btn edit"
                onClick={() => {
                  setEditingTreatment(z);
                  setFormData({
                    zdravilo: z.zdravilo?._id || "",
                    odmerek: z.odmerek,
                    pogostost: z.pogostost,
                    datum_zacetka: z.datum_zacetka?.slice(0, 10),
                    datum_konca: z.datum_konca?.slice(0, 10) || "",
                  });
                  setShowForm(true);
                }}
              >
                ✏️
              </button>

              <button
                className="icon-btn delete"
                onClick={() => removeTreatment(z._id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
  <div className="add-pet-form-overlay">
    <form className="add-pet-form" onSubmit={submitTreatment}>

      <h3>
        {editingTreatment ? "Uredi zdravljenje" : "Dodaj zdravljenje"}
      </h3>

      <select
        required
        disabled={!!editingTreatment}
        value={formData.zdravilo}
        onChange={(e) =>
          setFormData({ ...formData, zdravilo: e.target.value })
        }
      >
        <option value="">Izberi zdravilo</option>
        {zdravila.map((z) => (
          <option key={z._id} value={z._id}>
            {z.ime}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Odmerek"
        required
        value={formData.odmerek}
        onChange={(e) =>
          setFormData({ ...formData, odmerek: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Pogostost"
        required
        value={formData.pogostost}
        onChange={(e) =>
          setFormData({ ...formData, pogostost: e.target.value })
        }
      />

      <input
        type="date"
        required
        value={formData.datum_zacetka}
        onChange={(e) =>
          setFormData({ ...formData, datum_zacetka: e.target.value })
        }
      />

      <input
        type="date"
        value={formData.datum_konca}
        onChange={(e) =>
          setFormData({ ...formData, datum_konca: e.target.value })
        }
      />

      <div className="form-buttons">
        <button type="submit">
          Shrani
        </button>

        <button type="button" onClick={closeForm}>
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

export default Treatments;