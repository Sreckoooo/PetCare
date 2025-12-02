import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API_BASE}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserData(res.data);
            } catch (err) {
                console.error("Napaka pri pridobivanju uporabnika:", err.response || err);
            }
        };
        fetchUser();
    }, [token]);

    const handleEdit = () => {
        setIsEditing(!isEditing);
        setErrorMessage('');
    };

    const handleSave = async () => {
        try {
            // Preveri, če je novo geslo enako trenutnemu
            if (newPassword && newPassword === userData.geslo) {
                setErrorMessage("Novo geslo ne sme biti enako trenutnemu!");
                return;
            }

            const editableData = {
                ime: userData.ime,
                priimek: userData.priimek,
            };
            if (newPassword) editableData.geslo = newPassword;

            const res = await axios.put(`${API_BASE}/users/me`, editableData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUserData(res.data);
            setIsEditing(false);

            if (editableData.geslo) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                setNewPassword('');
            }

        } catch (err) {
            console.error("Napaka pri shranjevanju:", err.response || err);
            setErrorMessage("Prišlo je do napake pri shranjevanju podatkov.");
        }
    };

    const handleInputChange = (field, value) => {
        setUserData(prev => ({ ...prev, [field]: value }));
        setErrorMessage('');
    };

    if (!userData) return <div className="profile-page">Nalagam...</div>;

    return (
        <div className="profile-page">
            <button onClick={() => navigate('/main')} className="back-arrow">←</button>

            <div className="profile-card">
                <div className="card-header">
                    <h2>Osebni podatki</h2>
                    <button onClick={isEditing ? handleSave : handleEdit} className="edit-btn">
                        {isEditing ? 'Shrani' : 'Uredi'}
                    </button>
                </div>

                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <div className="data-row">
                    <label>Ime</label>
                    {isEditing ? (
                        <input type="text" value={userData.ime || ''} onChange={(e) => handleInputChange('ime', e.target.value)} className="edit-input"/>
                    ) : <span>{userData.ime}</span>}
                </div>

                <div className="data-row">
                    <label>Priimek</label>
                    {isEditing ? (
                        <input type="text" value={userData.priimek || ''} onChange={(e) => handleInputChange('priimek', e.target.value)} className="edit-input"/>
                    ) : <span>{userData.priimek}</span>}
                </div>

                <div className="data-row">
                    <label>Email</label>
                    <span>{userData.email}</span>
                </div>

                <div className="data-row">
                    <label>Geslo</label>
                    {isEditing ? (
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="edit-input" placeholder="Novo geslo (pusti prazno, če se ne spreminja)" />
                    ) : <span>••••••••</span>}
                </div>
            </div>
        </div>
    );
};

export default Profile;