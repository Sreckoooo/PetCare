import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./MyPets.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

/* ================= KOMPONENTA ================= */

const MyPets = () => {
  // Seznam ljubljenčkov
  const [pets, setPets] = useState([]);

  // Stanje nalaganja
  const [loading, setLoading] = useState(true);

  // Prikaz obrazca za dodajanje / urejanje
  const [showAddForm, setShowAddForm] = useState(false);

  // Trenutno urejan ljubljenček
  const [editingPet, setEditingPet] = useState(null);

  // Podatki obrazca
  const [newPetData, setNewPetData] = useState({
    ime: "",
    vrsta: "",
    pasma: "",
    datum_rojstva: "",
    spol: "Samec",
    image: null,
  });

  // JWT žeton
  const token = localStorage.getItem("token");

  /* ================= NALAGANJE LJUBLJENČKOV ================= */

  useEffect(() => {
    fetchPets();
    // eslint-disable-next-line
  }, []);

  const formatPetImage = (pet) => {
    if (!pet.image) {
      return { ...pet, image: null };
    }

    if (typeof pet.image === "string") {
      return pet;
    }

    if (pet.image?.data) {
      return {
        ...pet,
        image: `data:${pet.image.contentType};base64,${pet.image.data}`,
      };
    }

    return {
      ...pet,
      image: null,
    };
  };

  const fetchPets = async () => {
    try {
      const res = await axios.get(`${API_BASE}/pets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPets(res.data.map(formatPetImage));
    } catch (err) {
      console.error("Napaka pri pridobivanju ljubljenčkov:", err);
    }

    setLoading(false);
  };

  /* ================= DODAJANJE ================= */

  const submitNewPet = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(newPetData).forEach((key) => {
      if (newPetData[key]) {
        formData.append(key, newPetData[key]);
      }
    });

    await axios.post(`${API_BASE}/pets`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    await fetchPets();

    closeForm();
  };

  /* ================= UREJANJE ================= */

  const submitEditPet = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(newPetData).forEach((key) => {
      if (newPetData[key]) formData.append(key, newPetData[key]);
    });

    await axios.put(`${API_BASE}/pets/${editingPet._id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    closeForm();
    fetchPets();
  };

  /* ================= BRISANJE ================= */

  const deletePet = async (id) => {
    await axios.delete(`${API_BASE}/pets/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setPets(pets.filter((p) => p._id !== id));
  };

  /* ================= POMOŽNE FUNKCIJE ================= */

  const openEditForm = (pet) => {
    setEditingPet(pet);
    setNewPetData({
      ime: pet.ime,
      vrsta: pet.vrsta,
      pasma: pet.pasma,
      datum_rojstva: pet.datum_rojstva?.slice(0, 10),
      spol: pet.spol,
      image: null,
    });
    setShowAddForm(true);
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingPet(null);
    setNewPetData({
      ime: "",
      vrsta: "",
      pasma: "",
      datum_rojstva: "",
      spol: "Samec",
      image: null,
    });
  };

  /* ================= STANJE NALAGANJA ================= */

  if (loading) {
    return (
      <div className="page-content">
        <h2>Nalagam...</h2>
      </div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="main-app">
      <Sidebar />

      <div className="page-content mypets-page">
        <div className="mypets-header">
          <h1>Moji ljubljenčki</h1>

          <button className="add-pet-btn" onClick={() => setShowAddForm(true)}>
            + Dodaj novega ljubljenčka
          </button>
        </div>

        {/* Obrazec za dodajanje / urejanje */}
        {showAddForm && (
          <div className="add-pet-form-overlay">
            <form
              className="add-pet-form"
              onSubmit={editingPet ? submitEditPet : submitNewPet}
            >
              <h3>
                {editingPet
                  ? "Uredi ljubljenčka"
                  : "Dodaj novega ljubljenčka"}
              </h3>

              <input
                placeholder="Ime"
                required
                value={newPetData.ime}
                onChange={(e) =>
                  setNewPetData({ ...newPetData, ime: e.target.value })
                }
              />

              <input
                placeholder="Vrsta"
                required
                value={newPetData.vrsta}
                onChange={(e) =>
                  setNewPetData({ ...newPetData, vrsta: e.target.value })
                }
              />

              <input
                placeholder="Pasma"
                required
                value={newPetData.pasma}
                onChange={(e) =>
                  setNewPetData({ ...newPetData, pasma: e.target.value })
                }
              />

              <input
                type="date"
                required
                value={newPetData.datum_rojstva}
                onChange={(e) =>
                  setNewPetData({
                    ...newPetData,
                    datum_rojstva: e.target.value,
                  })
                }
              />

              <select
                value={newPetData.spol}
                onChange={(e) =>
                  setNewPetData({ ...newPetData, spol: e.target.value })
                }
              >
                <option value="Samec">Samec</option>
                <option value="Samica">Samica</option>
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewPetData({
                    ...newPetData,
                    image: e.target.files[0],
                  })
                }
              />

              <div className="form-buttons">
                <button type="submit">
                  {editingPet ? "Shrani spremembe" : "Dodaj"}
                </button>
                <button type="button" onClick={closeForm}>
                  Prekliči
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Seznam ljubljenčkov */}
        <div className="pets-container">
          {pets.map((pet) => (
            <div key={pet._id} className="pet-card">
              <div className="pet-image-container">
                {pet.image ? (
                  <img src={pet.image} alt={pet.ime} className="pet-image" />
                ) : (
                  <div className="pet-avatar-large">
                    {pet.ime.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="pet-info-section">
                <div className="pet-card-header">
                  <h2>{pet.ime}</h2>

                  <div className="pet-actions">
                    <button
                      className="edit-btn"
                      onClick={() => openEditForm(pet)}
                    >
                      ✏️
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deletePet(pet._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="pet-details">
                  <div className="detail-row">
                    <label>Vrsta</label>
                    <span>{pet.vrsta}</span>
                  </div>

                  <div className="detail-row">
                    <label>Pasma</label>
                    <span>{pet.pasma}</span>
                  </div>

                  <div className="detail-row">
                    <label>Spol</label>
                    <span>{pet.spol}</span>
                  </div>

                  <div className="detail-row">
                    <label>Datum rojstva</label>
                    <span>
                      {pet.datum_rojstva
                        ? new Date(pet.datum_rojstva).toLocaleDateString(
                          "sl-SI"
                        )
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyPets;