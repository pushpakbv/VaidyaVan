import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import useAuthStore from './store/authStore';
import VirtualGarden from './components/VirtualGarden/VirtualGarden';
import DailyChallenges from './components/DailyChallenges/DailyChallenges';
import Stories from './components/Stories/Stories';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/daily-challenges" element={isAuthenticated ? <DailyChallenges /> : <Navigate to="/login" />} />
          <Route path="/virtual-tour" element={isAuthenticated ? <VirtualGarden /> : <Navigate to="/login" />} />
          <Route path="/stories" element={isAuthenticated ? <Stories /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
