import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppShell from './components/layout/AppShell'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import IDCard from './pages/IDCard'
import Profile from './pages/Profile'
import Timetable from './pages/Timetable'
import AcademicCalendar from './pages/AcademicCalendar'
import Academics from './pages/Academics'
import Fees from './pages/Fees'
import Hostel from './pages/Hostel'
import Transport from './pages/Transport'
import Exams from './pages/Exams'
import Placements from './pages/Placements'
import ResumeBuilder from './pages/ResumeBuilder';
import Helpdesk from './pages/Helpdesk';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './context/AuthContext';

function HomeRoute() {
  const { user } = useAuth();
  if (user && (user.role === 'admin' || user.role === 'staff')) {
    return <AdminDashboard />;
  }
  return <Dashboard />;
}

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes inside AppShell */}
        <Route element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/id-card" element={<IDCard />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/calendar" element={<AcademicCalendar />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/hostel" element={<Hostel />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/resume-builder" element={<ResumeBuilder />} />
          <Route path="/helpdesk" element={<Helpdesk />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App;
