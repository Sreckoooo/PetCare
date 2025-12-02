import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyPets.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const MyPets = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newPetData, setNewPetData] = useState({
        ime: "",
        vrsta: "",
        pasma: "",
        datum_rojstva: "",
        spol: "Samec",
        image: null,
    });
    const [isEditing, setIsEditing] = useState(null);
    const [editData, setEditData] = useState({});
    const token = localStorage.getItem("token");

    const arrayBufferToBase64 = (buffer) => {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const res = await axios.get(`${API_BASE}/pets`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const petsWithImages = res.data.map((p) => {
                    if (!p.image) return { ...p, image: null };

                    if (typeof p.image === "string" && p.image.startsWith("data:")) {
                        return { ...p, image: p.image };
                    }

                    if (typeof p.image === "string" && !p.image.startsWith("data:")) {
                        return { ...p, image: `${API_BASE.replace("/api", "")}${p.image}` };
                    }

                    if (p.image?.data) {
                        return {
                            ...p,
                            image: `data:${p.image.contentType};base64,${p.image.data}`,
                        };
                    }

                    return { ...p, image: null };
                });

                setPets(petsWithImages);
            } catch (error) {
                console.error("Napaka pri pridobivanju živali:", error.response || error);
            }
            setLoading(false);
        };
        fetchPets();
    }, [token]);

    const handleBack = () => navigate("/main");

    const submitNewPet = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(newPetData).forEach((key) => {
                if (newPetData[key]) formData.append(key, newPetData[key]);
            });

            const res = await axios.post(`${API_BASE}/pets`, formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            const petWithImage = {
                ...res.data,
                image: res.data.image
                    ? `data:${res.data.image.contentType};base64,${arrayBufferToBase64(
                        res.data.image.data.data
                    )}`
                    : null,
            };

            setPets([...pets, petWithImage]);
            setShowAddForm(false);
            setNewPetData({
                ime: "",
                vrsta: "",
                pasma: "",
                datum_rojstva: "",
                spol: "Samec",
                image: null,
            });
        } catch (error) {
            console.error("Napaka pri dodajanju živali:", error.response || error);
        }
    };

    const openEditForm = (petId) => {
        const pet = pets.find((p) => p._id === petId);
        setEditData(pet);
        setIsEditing(petId);
    };

    const submitEditPet = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            Object.keys(editData).forEach((key) => {
                if (editData[key] instanceof File || key !== "image") {
                    formData.append(key, editData[key]);
                }
            });

            const res = await axios.put(`${API_BASE}/pets/${isEditing}`, formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
            });

            const updatedPet = {
                ...res.data,
                image: res.data.image
                    ? `data:${res.data.image.contentType};base64,${arrayBufferToBase64(
                        res.data.image.data.data
                    )}`
                    : null,
            };

            setPets(pets.map((p) => (p._id === isEditing ? updatedPet : p)));
            setIsEditing(null);
            setEditData({});
        } catch (error) {
            console.error("Napaka pri urejanju:", error.response || error);
        }
    };

    const deletePet = async (petId) => {
        try {
            await axios.delete(`${API_BASE}/pets/${petId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPets(pets.filter((p) => p._id !== petId));
        } catch (error) {
            console.error("Napaka pri brisanju:", error.response || error);
        }
    };

    const handleInputChange = (field, value) => {
        setEditData((prev) => ({ ...prev, [field]: value }));
    };

    const getInitials = (name) => (name ? name.substring(0, 2).toUpperCase() : "??");

    if (loading) return <div className="mypets-page"><h2>Nalagam...</h2></div>;

    return (
        <div className="mypets-page">
            <button onClick={handleBack} className="back-arrow">←</button>

            <div className="mypets-header" style={{ display: "flex", justifyContent: "center", position: "relative" }}>
                <h1 style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>Moji ljubljenčki</h1>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                <button onClick={() => setShowAddForm(true)} className="add-pet-btn">
                    + Dodaj novega ljubljenčka
                </button>
            </div>

            {/* ADD PET FORM */}
            {showAddForm && (
                <div className="add-pet-form-overlay">
                    <form className="add-pet-form" onSubmit={submitNewPet}>
                        <h3>Dodaj novega ljubljenčka</h3>

                        <input
                            type="text"
                            placeholder="Ime"
                            required
                            value={newPetData.ime}
                            onChange={(e) => setNewPetData({ ...newPetData, ime: e.target.value })}
                        />

                        <input
                            type="text"
                            placeholder="Vrsta"
                            required
                            value={newPetData.vrsta}
                            onChange={(e) => setNewPetData({ ...newPetData, vrsta: e.target.value })}
                        />

                        <input
                            type="text"
                            placeholder="Pasma"
                            required
                            value={newPetData.pasma}
                            onChange={(e) => setNewPetData({ ...newPetData, pasma: e.target.value })}
                        />

                        <input
                            type="date"
                            required
                            value={newPetData.datum_rojstva}
                            onChange={(e) => setNewPetData({ ...newPetData, datum_rojstva: e.target.value })}
                        />

                        <select
                            value={newPetData.spol}
                            onChange={(e) => setNewPetData({ ...newPetData, spol: e.target.value })}
                            required
                        >
                            <option value="Samec">Samec</option>
                            <option value="Samica">Samica</option>
                        </select>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setNewPetData({ ...newPetData, image: e.target.files[0] })
                            }
                        />

                        <div className="form-buttons">
                            <button type="submit">Dodaj</button>
                            <button type="button" onClick={() => setShowAddForm(false)}>Prekliči</button>
                        </div>
                    </form>
                </div>
            )}

            {/* EDIT PET */}
            {isEditing && (
                <div className="add-pet-form-overlay">
                    <form className="add-pet-form" onSubmit={submitEditPet}>
                        <h3>Uredi ljubljenčka</h3>

                        <input
                            type="text"
                            required
                            placeholder="Ime"
                            value={editData.ime || ""}
                            onChange={(e) => handleInputChange("ime", e.target.value)}
                        />

                        <input
                            type="text"
                            required
                            placeholder="Vrsta"
                            value={editData.vrsta || ""}
                            onChange={(e) => handleInputChange("vrsta", e.target.value)}
                        />

                        <input
                            type="text"
                            required
                            placeholder="Pasma"
                            value={editData.pasma || ""}
                            onChange={(e) => handleInputChange("pasma", e.target.value)}
                        />

                        <input
                            type="date"
                            required
                            value={editData.datum_rojstva ? editData.datum_rojstva.substring(0, 10) : ""}
                            onChange={(e) => handleInputChange("datum_rojstva", e.target.value)}
                        />

                        <select
                            value={editData.spol || "Samec"}
                            onChange={(e) => handleInputChange("spol", e.target.value)}
                        >
                            <option value="Samec">Samec</option>
                            <option value="Samica">Samica</option>
                        </select>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setEditData({ ...editData, image: e.target.files[0] })
                            }
                        />

                        <div className="form-buttons">
                            <button type="submit">Shrani</button>
                            <button type="button" onClick={() => setIsEditing(null)}>Prekliči</button>
                        </div>
                    </form>
                </div>
            )}

            {/* PET LIST */}
            <div className="pets-container">
                {pets.map((pet) => (
                    <div key={pet._id} className="pet-card">
                        <div className="pet-image-container">
                            {pet.image ? (
                                <img src={pet.image} alt={pet.ime} className="pet-image" />
                            ) : (
                                <div className="pet-avatar-large">{getInitials(pet.ime)}</div>
                            )}
                        </div>

                        <div className="pet-info-section">
                            <div className="pet-card-header">
                                <h2>{pet.ime}</h2>

                                <div className="pet-actions">
                                    <button onClick={() => openEditForm(pet._id)} className="edit-pet-btn">
                                        ✍️
                                    </button>
                                    <button onClick={() => deletePet(pet._id)} className="delete-pet-btn">
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
                                    <span>{pet.datum_rojstva?.substring(0, 10)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
        </div>
    );
};

export default MyPets;