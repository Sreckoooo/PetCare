import React, { useEffect, useState } from "react";
import {
  getPets,
  getPreglediByPet,
  createPregled,
  deletePregled,
  updatePregled,
} from "../../api/api";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Exams.css";

const Exams = () => {
  const token = localStorage.getItem("token");

  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [pregledi, setPregledi] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const [formData, setFormData] = useState({
    datum: "",
    veterinar: "",
    naziv: "",
    datoteka: null,
  });

  /* ================= LJUBLJENČKI ================= */

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

  /* ================= PREGLEDI ================= */

  useEffect(() => {
    if (!selectedPet) {
      setPregledi([]);
      return;
    }

    const loadPregledi = async () => {
      try {
        const data = await getPreglediByPet(selectedPet, token);
        setPregledi(data);
      } catch (err) {
        console.error("Napaka pri nalaganju pregledov", err);
      }
    };

    loadPregledi();
  }, [selectedPet, token]);

  /* ================= SUBMIT (ADD / EDIT) ================= */

  const submitExam = async (e) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("pet", selectedPet);
      fd.append("datum", formData.datum);
      fd.append("veterinar", formData.veterinar);
      fd.append("naziv", formData.naziv);

      if (formData.datoteka) {
        fd.append("datoteka", formData.datoteka);
      }

      if (editingExam) {
        await updatePregled(editingExam._id, fd, token);
      } else {
        await createPregled(fd, token);
      }

      setShowForm(false);
      setEditingExam(null);
      setFormData({
        datum: "",
        veterinar: "",
        naziv: "",
        datoteka: null,
      });

      const data = await getPreglediByPet(selectedPet, token);
      setPregledi(data);
    } catch (err) {
      console.error("Napaka pri shranjevanju pregleda", err);
    }
  };

  /* ================= DELETE ================= */

  const removeExam = async (id) => {
    try {
      await deletePregled(id, token);
      setPregledi(pregledi.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Napaka pri brisanju pregleda", err);
    }
  };

  /* ================= FILE DOWNLOAD ================= */

  const downloadFile = async (examId) => {
    try {
      const res = await fetch(
        `http://localhost:5001/api/pregledi/${examId}/datoteka`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "pregled-datoteka";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Napaka pri prenosu datoteke", err);
    }
  };

  /* ================= RENDER ================= */

  return (
    <div className="main-app">
      <Sidebar active="health" />

      <div className="page-content exams-page">
        <h1>Pregledi</h1>

        {/* IZBIRA + GUMB */}
        <div className="exams-header">
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
                setEditingExam(null);
                setFormData({
                  datum: "",
                  veterinar: "",
                  naziv: "",
                  datoteka: null,
                });
                setShowForm(true);
              }}
            >
              + Dodaj pregled
            </button>
          )}
        </div>

        {/* FORMA */}
        {showForm && (
  <div className="add-pet-form-overlay">
    <form className="add-pet-form" onSubmit={submitExam}>

      <h3>
        {editingExam ? "Uredi pregled" : "Dodaj pregled"}
      </h3>

      <input
        type="date"
        required
        value={formData.datum}
        onChange={(e) =>
          setFormData({ ...formData, datum: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Veterinar"
        required
        value={formData.veterinar}
        onChange={(e) =>
          setFormData({ ...formData, veterinar: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Naziv pregleda"
        required
        value={formData.naziv}
        onChange={(e) =>
          setFormData({ ...formData, naziv: e.target.value })
        }
      />

      <input
        type="file"
        accept=".pdf,image/*"
        onChange={(e) =>
          setFormData({ ...formData, datoteka: e.target.files[0] })
        }
      />

      <div className="form-buttons">
        <button type="submit">
          {editingExam ? "Shrani spremembe" : "Shrani"}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowForm(false);
            setEditingExam(null);
          }}
        >
          Prekliči
        </button>
      </div>

    </form>
  </div>
)}

        {/* PRAZNO */}
        {selectedPet && pregledi.length === 0 && (
          <p className="empty-text">Za izbranega ljubljenčka ni pregledov.</p>
        )}

        {/* SEZNAM */}
        <div className="exams-list">
          {pregledi.map((p) => (
            <div key={p._id} className="exam-card">
              <div className="exam-main">
                <h3>{p.naziv}</h3>

                <div className="exam-meta">
                  <span>
                    {p.datum
                      ? new Date(p.datum).toLocaleDateString("sl-SI")
                      : "-"}
                  </span>

                  <span>
                    <strong>Veterinar:</strong> {p.veterinar}
                  </span>

                  {p.datoteka && (
                    <button
                      type="button"
                      className="file-preview-btn"
                      onClick={() => downloadFile(p._id)}
                    >
                      📎 Ogled priložene datoteke
                    </button>
                  )}
                </div>
              </div>

              <div className="exam-actions">
                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingExam(p);
                    setFormData({
                      datum: p.datum?.slice(0, 10),
                      veterinar: p.veterinar,
                      naziv: p.naziv,
                      datoteka: null,
                    });
                    setShowForm(true);
                  }}
                >
                  ✏️
                </button>

                <button
                  className="delete-btn"
                  onClick={() => removeExam(p._id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Exams;