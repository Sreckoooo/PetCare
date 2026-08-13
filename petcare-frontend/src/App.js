import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

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

import MobileHeader from './components/MobileHeader';

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


function AppContent() {

  const location = useLocation();

  const appPages = [
    '/main',
    '/profile',
    '/mypets',
    '/meals',
    '/activities',
    '/reminders',
    '/medications',
    '/treatments',
    '/exams'
  ];

  const showMobileHeader = appPages.includes(location.pathname);

  return (
    <>
      {showMobileHeader && <MobileHeader />}

      <div className="App">

        <Routes>

          <Route
            path="/"
            element={<Login />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<SignUp />}
          />

          <Route
            path="/main"
            element={<MainApp />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/mypets"
            element={<MyPets />}
          />

          <Route
            path="/meals"
            element={<Meals />}
          />

          <Route
            path="/activities"
            element={<Activities />}
          />

          <Route
            path="/reminders"
            element={<Reminders />}
          />

          <Route
            path="/medications"
            element={<Medications />}
          />

          <Route
            path="/treatments"
            element={<Treatments />}
          />

          <Route
            path="/exams"
            element={<Exams />}
          />

          <Route
            path="*"
            element={<Login />}
          />

        </Routes>

      </div>
    </>
  );
}


function App() {

  return (
    <AuthProvider>

      <Router>

        <AppContent />

      </Router>

    </AuthProvider>
  );
}


export default App;