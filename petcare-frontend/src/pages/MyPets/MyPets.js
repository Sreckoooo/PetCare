import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPets.css';

const MyPets = () => {
    const navigate = useNavigate();
    const [pets, setPets] = useState([
        {
            id: 1,
            name: 'Rex',
            age: '2 leti',
            breed: 'Zlati prinašalec',
            gender: 'Samec',
            weight: '25 kg',
            color: 'Zlata',
            image: null
        },
        {
            id: 2,
            name: 'Muca',
            age: '1 leto',
            breed: 'Perzijska mačka',
            gender: 'Samica',
            weight: '3.5 kg',
            color: 'Bela',
            image: null
        }
    ]);

    const [isEditing, setIsEditing] = useState(null);
    const [editData, setEditData] = useState({});

    const handleBack = () => {
        navigate('/main');
    };

    const handleEdit = (petId) => {
        if (isEditing === petId) {
            // Save changes
            setPets(pets.map(pet => 
                pet.id === petId ? { ...pet, ...editData } : pet
            ));
            setIsEditing(null);
            setEditData({});
        } else {
            // Start editing
            const pet = pets.find(p => p.id === petId);
            setEditData(pet);
            setIsEditing(petId);
        }
    };

    const handleInputChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = (petId, event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (isEditing === petId) {
                    setEditData(prev => ({
                        ...prev,
                        image: e.target.result
                    }));
                } else {
                    setPets(pets.map(pet => 
                        pet.id === petId ? { ...pet, image: e.target.result } : pet
                    ));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const addNewPet = () => {
        const newPet = {
            id: pets.length + 1,
            name: 'Nov ljubljenček',
            age: '1 leto',
            breed: 'Neznana',
            gender: 'Samec',
            weight: '5 kg',
            color: 'Rjava',
            image: null
        };
        setPets([...pets, newPet]);
    };

    const deletePet = (petId) => {
        setPets(pets.filter(pet => pet.id !== petId));
    };

    const getInitials = (name) => {
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="mypets-page">
            {/* Back Arrow */}
            <button onClick={handleBack} className="back-arrow">
                ←
            </button>

            {/* Header */}
            <div className="mypets-header">
                <h1>Moji ljubljenčki</h1>
                <button onClick={addNewPet} className="add-pet-btn">
                    + Dodaj novega ljubljenčka
                </button>
            </div>

            {/* Pets Grid */}
            <div className="pets-container">
                {pets.map(pet => (
                    <div key={pet.id} className="pet-card">
                        {/* Pet Image */}
                        <div className="pet-image-container">
                            {(isEditing === pet.id ? editData.image : pet.image) ? (
                                <img 
                                    src={isEditing === pet.id ? editData.image : pet.image} 
                                    alt={pet.name} 
                                    className="pet-image" 
                                />
                            ) : (
                                <div className="pet-avatar-large">
                                    {getInitials(isEditing === pet.id ? editData.name : pet.name)}
                                </div>
                            )}
                            <label className="change-pet-photo-btn">
                                📷
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => handleImageUpload(pet.id, e)}
                                    style={{ display: 'none' }}
                                />
                            </label>
                        </div>

                        {/* Pet Info */}
                        <div className="pet-info-section">
                            <div className="pet-card-header">
                                <h2>
                                    {isEditing === pet.id ? (
                                        <input 
                                            type="text" 
                                            value={editData.name || ''} 
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            className="edit-input-name"
                                        />
                                    ) : pet.name}
                                </h2>
                                <div className="pet-actions">
                                    <button 
                                        onClick={() => handleEdit(pet.id)} 
                                        className="edit-pet-btn"
                                    >
                                        {isEditing === pet.id ? 'Shrani' : 'Uredi'}
                                    </button>
                                    <button 
                                        onClick={() => deletePet(pet.id)} 
                                        className="delete-pet-btn"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>

                            <div className="pet-details">
                                <div className="detail-row">
                                    <label>Starost</label>
                                    {isEditing === pet.id ? (
                                        <input 
                                            type="text" 
                                            value={editData.age || ''} 
                                            onChange={(e) => handleInputChange('age', e.target.value)}
                                            className="edit-input"
                                        />
                                    ) : (
                                        <span>{pet.age}</span>
                                    )}
                                </div>

                                <div className="detail-row">
                                    <label>Pasma</label>
                                    {isEditing === pet.id ? (
                                        <input 
                                            type="text" 
                                            value={editData.breed || ''} 
                                            onChange={(e) => handleInputChange('breed', e.target.value)}
                                            className="edit-input"
                                        />
                                    ) : (
                                        <span>{pet.breed}</span>
                                    )}
                                </div>

                                <div className="detail-row">
                                    <label>Spol</label>
                                    {isEditing === pet.id ? (
                                        <select 
                                            value={editData.gender || ''} 
                                            onChange={(e) => handleInputChange('gender', e.target.value)}
                                            className="edit-select"
                                        >
                                            <option value="Samec">Samec</option>
                                            <option value="Samica">Samica</option>
                                        </select>
                                    ) : (
                                        <span>{pet.gender}</span>
                                    )}
                                </div>

                                <div className="detail-row">
                                    <label>Teža</label>
                                    {isEditing === pet.id ? (
                                        <input 
                                            type="text" 
                                            value={editData.weight || ''} 
                                            onChange={(e) => handleInputChange('weight', e.target.value)}
                                            className="edit-input"
                                        />
                                    ) : (
                                        <span>{pet.weight}</span>
                                    )}
                                </div>

                                <div className="detail-row">
                                    <label>Barva</label>
                                    {isEditing === pet.id ? (
                                        <input 
                                            type="text" 
                                            value={editData.color || ''} 
                                            onChange={(e) => handleInputChange('color', e.target.value)}
                                            className="edit-input"
                                        />
                                    ) : (
                                        <span>{pet.color}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Decoration circles */}
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
        </div>
    );
};

export default MyPets;