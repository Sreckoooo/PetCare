import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainApp.css';

const MainApp = () => {
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState([
        { id: 1, date: '2025-10-28', time: '10:00', title: 'Veterinar - Rex', type: 'vet' },
        { id: 2, date: '2025-10-30', time: '14:00', title: 'Striženje - Muca', type: 'grooming' },
        { id: 3, date: '2025-11-02', time: '16:30', title: 'Cepljenje - Rex', type: 'vaccination' }
    ]);

    // Real-time clock update
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        navigate('/');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleMyPets = () => {
        navigate('/mypets'); 
    };
    const handleViewMyPets = () => {
        navigate('/mypets'); 
    };
     const handleHealth = () => {
        navigate('/health'); 
    };

    // Calendar functions
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const hasAppointment = (day) => {
        const dateStr = formatDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day));
        return appointments.some(apt => apt.date === dateStr);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(selectedDate);
        const firstDay = getFirstDayOfMonth(selectedDate);
        const days = [];
        const today = new Date();
        
        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate() && 
                           selectedDate.getMonth() === today.getMonth() && 
                           selectedDate.getFullYear() === today.getFullYear();
            const hasApt = hasAppointment(day);

            days.push(
                <div 
                    key={day} 
                    className={`calendar-day ${isToday ? 'today' : ''} ${hasApt ? 'has-appointment' : ''}`}
                >
                    {day}
                    {hasApt && <div className="appointment-dot"></div>}
                </div>
            );
        }

        return days;
    };

    const monthNames = [
        'Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij',
        'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December'
    ];

    const dayNames = ['Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob', 'Ned'];

    const nextMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
    };

    const upcomingAppointments = appointments
        .filter(apt => new Date(apt.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);

    return (
        <div className="main-app">
            {/* Levi sidebar */}
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>🐾 PetCare</h2>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-item active">
                        <span className="nav-icon">🏠</span>
                        <span>Home</span>
                    </div>
                    <div className="nav-item" onClick={handleProfile}>
                        <span className="nav-icon">👤</span>
                        <span>Profile</span>
                    </div>
                    <div className="nav-item" onClick={handleMyPets}>
                        <span className="nav-icon">🐾</span>
                        <span>My Pets</span>
                    </div>
                    <div className="nav-item" onClick={handleHealth}>
                        <span className="nav-icon">❤️</span>
                        <span>Health</span>
                    </div>
                    <div className="nav-item">
                        <span className="nav-icon">⚙️</span>
                        <span>Settings</span>
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="nav-item" onClick={handleLogout}>
                        <span className="nav-icon">🚪</span>
                        <span>Logout</span>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="main-content">
                {/* 2x2 Grid */}
                <div className="grid-container">
                    {/* Moji ljubljenčki Card */}
                    <div className="grid-card pets-card">
                        <div className="card-header">
                            <div className="card-icon">🐾</div>
                            <h3>My Pets</h3>
                        </div>
                        
                        <div className="pet-item">
                            <div className="pet-avatar"></div>
                            <div className="pet-info">
                                <p className="pet-name">Rex</p>
                                <p className="pet-detail">Dog, 2 years</p>
                            </div>
                        </div>

                        <div className="pet-schedule">
                            <div className="schedule-item">
                                <span className="schedule-icon">🍖</span>
                                <div>
                                    <p className="schedule-label">Next Feeding</p>
                                    <p className="schedule-time">18:00</p>
                                </div>
                            </div>

                            <div className="schedule-item">
                                <span className="schedule-icon">💉</span>
                                <div>
                                    <p className="schedule-label">Vaccination</p>
                                    <p className="schedule-time">in 5 days</p>
                                </div>
                            </div>
                        </div>

                        <button className="card-button" onClick={handleViewMyPets}>View All Pets</button>
                    </div>

                    {/* Opomniki Card */}
                    <div className="grid-card">
                        <div className="card-header">
                            <div className="card-icon">🔔</div>
                            <h3>Reminders</h3>
                        </div>
                        <div className="card-content">
                            <p>Set reminders for important dates and appointments</p>
                        </div>
                        <button className="card-button">Set Reminder</button>
                    </div>

                    {/* Zdravstveni zapisi Card */}
                    <div className="grid-card">
                        <div className="card-header">
                            <div className="card-icon">📋</div>
                            <h3>Health Records</h3>
                        </div>
                        <div className="card-content">
                            <p>History of health checkups and vaccinations</p>
                        </div>
                        <button className="card-button">View History</button>
                    </div>

                    {/* Calendar Card */}
                    <div className="grid-card calendar-card">
                        <div className="calendar-header">
                            <div className="card-icon">📅</div>
                            <h3>Prihajajoči termini</h3>
                        </div>

                        <div className="calendar-container">
                            <div className="calendar-nav">
                                <button onClick={prevMonth} className="nav-btn">‹</button>
                                <h4>{monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}</h4>
                                <button onClick={nextMonth} className="nav-btn">›</button>
                            </div>

                            <div className="calendar-grid">
                                <div className="calendar-header-days">
                                    {dayNames.map(day => (
                                        <div key={day} className="day-header">{day}</div>
                                    ))}
                                </div>
                                <div className="calendar-days">
                                    {renderCalendar()}
                                </div>
                            </div>
                        </div>

                        <div className="upcoming-appointments">
                            <h5>Naslednji termini:</h5>
                            {upcomingAppointments.length > 0 ? (
                                upcomingAppointments.map(apt => (
                                    <div key={apt.id} className="appointment-item">
                                        <div className={`appointment-type ${apt.type}`}></div>
                                        <div className="appointment-details">
                                            <p className="appointment-title">{apt.title}</p>
                                            <p className="appointment-datetime">
                                                {new Date(apt.date).toLocaleDateString('sl-SI')} ob {apt.time}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-appointments">Ni prihajajočih terminov</p>
                            )}
                        </div>

                        <button className="card-button">Nov termin</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainApp;