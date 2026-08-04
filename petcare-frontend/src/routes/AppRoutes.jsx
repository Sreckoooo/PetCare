import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";

import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

import Dashboard from "@/pages/dashboard/Dashboard";

import Activities from "@/pages/pets/Activities";
import Exams from "@/pages/pets/Exams";
import Meals from "@/pages/pets/Meals";
import Medications from "@/pages/pets/Medications";
import MyPets from "@/pages/pets/MyPets";
import Reminders from "@/pages/pets/Reminders";
import Treatments from "@/pages/pets/Treatments";

import Profile from "@/pages/profile/Profile";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pets" element={<MyPets />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/treatments" element={<Treatments />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
