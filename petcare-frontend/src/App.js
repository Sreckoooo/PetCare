import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import MainApp from './pages/MainApp/MainApp';
import Profile from './pages/Profile/Profile';
import MyPets from './pages/MyPets/MyPets';
import Health from './pages/Health/Health';

import './App.css';
import './pages/Login/Login.css';
import './pages/SignUp/SignUp.css';
import './pages/MainApp/MainApp.css';
import './pages/Profile/Profile.css';
import './pages/MyPets/MyPets.css';
import './pages/Health/Health.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/main" element={<MainApp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mypets" element={<MyPets />} />
            <Route path="/health" element={<Health />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;