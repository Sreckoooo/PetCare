import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        ime: 'John',
        priimek: 'Doe',
        email: 'john.doe@gmail.com',
        password: '••••••••',
        profileImage: null
    });

    const [pets, setPets] = useState([
        { id: 1, name: 'Rex', type: 'Pes', age: '2 leti' },
        { id: 2, name: 'Muca', type: 'Mačka', age: '1 leto' }
    ]);

    const handleBack = () => {
        navigate('/main');
    };

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        setIsEditing(false);
        console.log('Saving user data:', userData);
    };

    const handleInputChange = (field, value) => {
        setUserData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUserData(prev => ({
                    ...prev,
                    profileImage: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addPet = () => {
        const newPet = {
            id: pets.length + 1,
            name: 'Novi ljubljenček',
            type: 'Pes',
            age: '1 leto'
        };
        setPets([...pets, newPet]);
    };

    const removePet = (id) => {
        setPets(pets.filter(pet => pet.id !== id));
    };

    return (
        <div className="profile-page">
            {/* Back Arrow */}
            <button onClick={handleBack} className="back-arrow">
                ←
            </button>

            {/* Profile Content */}
            <div className="profile-container">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar-container">
                        {userData.profileImage ? (
                            <img src={userData.profileImage} alt="Profile" className="profile-avatar-img" />
                        ) : (
                            <div className="profile-avatar">
                                {userData.ime.charAt(0)}{userData.priimek.charAt(0)}
                            </div>
                        )}
                        <label className="change-photo-btn">
                            📷
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    <h1>Moj Profil</h1>
                </div>

                {/* Profile Card */}
                <div className="profile-card">
                    <div className="card-header">
                        <h2>Osebni podatki</h2>
                        <button 
                            onClick={isEditing ? handleSave : handleEdit} 
                            className="edit-btn"
                        >
                            {isEditing ? 'Shrani' : 'Uredi'}
                        </button>
                    </div>

                    <div className="profile-data">
                        <div className="data-row">
                            <label>Ime</label>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={userData.ime}
                                    onChange={(e) => handleInputChange('ime', e.target.value)}
                                    className="edit-input"
                                />
                            ) : (
                                <span>{userData.ime}</span>
                            )}
                        </div>

                        <div className="data-row">
                            <label>Priimek</label>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={userData.priimek}
                                    onChange={(e) => handleInputChange('priimek', e.target.value)}
                                    className="edit-input"
                                />
                            ) : (
                                <span>{userData.priimek}</span>
                            )}
                        </div>

                        <div className="data-row">
                            <label>Gmail</label>
                            {isEditing ? (
                                <input 
                                    type="email" 
                                    value={userData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="edit-input"
                                />
                            ) : (
                                <span>{userData.email}</span>
                            )}
                        </div>

                        <div className="data-row">
                            <label>Geslo</label>
                            {isEditing ? (
                                <input 
                                    type="password" 
                                    value={userData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="edit-input"
                                />
                            ) : (
                                <span>••••••••</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Pets Card */}
                <div className="profile-card pets-section">
                    <div className="card-header">
                        <h2>Moji ljubljenčki</h2>
                        <button onClick={addPet} className="add-pet-btn">
                            + Dodaj ljubljenčka
                        </button>
                    </div>

                    <div className="pets-grid">
                        {pets.map(pet => (
                            <div key={pet.id} className="pet-card">
                                <div className="pet-info">
                                    <div className="pet-avatar-small"></div>
                                    <div>
                                        <h3>{pet.name}</h3>
                                        <p>{pet.type}, {pet.age}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removePet(pet.id)}
                                    className="remove-pet-btn"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Decoration circles */}
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
        </div>
    );
};

export default Profile;