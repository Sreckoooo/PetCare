import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from "react-hot-toast";

import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import MainApp from './pages/MainApp/MainApp';
import Profile from './pages/Profile/Profile';
import MyPets from './pages/MyPets/MyPets';
import Medications from './pages/Medications/Medications';
import Treatments from './pages/Treatments/Treatments';
import Meals from './pages/Meals/Meals';
import Activities from './pages/Activities/Activities';
import Reminders from './pages/Reminders/Reminders';
import Exams from './pages/Exams/Exams';

import './App.css';
import './pages/Login/Login.css';
import './pages/SignUp/SignUp.css';
import './pages/MainApp/MainApp.css';
import './pages/Profile/Profile.css';
import './pages/MyPets/MyPets.css';
import './pages/Medications/Medications.css';
import './pages/Treatments/Treatments.css';
import './pages/Meals/Meals.css';
import './pages/Activities/Activities.css';
import './pages/Reminders/Reminders.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
          }}
        />

        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/main" element={<MainApp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/mypets" element={<MyPets />} />
            <Route path="*" element={<Login />} />
            <Route path="/meals" element={<Meals />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="/medications" element={<Medications />} />
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/exams" element={<Exams />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;