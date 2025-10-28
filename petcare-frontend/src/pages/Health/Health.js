import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Health.css';

const Health = () => {
    const navigate = useNavigate();
    const [healthRecords] = useState([
        { id: 1, date: '2025-10-15', pet: 'Rex', type: 'Checkup', vet: 'Dr. Smith', notes: 'Routine checkup - all good' },
        { id: 2, date: '2025-09-20', pet: 'Rex', type: 'Vaccination', vet: 'Dr. Johnson', notes: 'Rabies vaccination' },
        { id: 3, date: '2025-08-10', pet: 'Muca', type: 'Treatment', vet: 'Dr. Smith', notes: 'Ear infection treated' }
    ]);

    const handleBack = () => {
        navigate('/main');
    };

    return (
        <div className="health-page">
            <button className="back-arrow" onClick={handleBack}>←</button>

            <div className="health-container">
                <div className="health-header">
                    <div className="health-avatar">❤️</div>
                    <h1>Health Records</h1>
                </div>

                <div className="health-card">
                    <div className="card-header">
                        <h2>Medical History</h2>
                        <button className="edit-btn">Add Record</button>
                    </div>

                    <div className="health-records">
                        {healthRecords.map(record => (
                            <div key={record.id} className="health-record-item">
                                <div className="record-date">
                                    <span className="date-day">{new Date(record.date).getDate()}</span>
                                    <span className="date-month">{new Date(record.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                </div>
                                <div className="record-details">
                                    <h3>{record.type} - {record.pet}</h3>
                                    <p className="record-vet">👨‍⚕️ {record.vet}</p>
                                    <p className="record-notes">{record.notes}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
        </div>
    );
};

export default Health;