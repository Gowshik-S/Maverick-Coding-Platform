/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileBuilder from './pages/ProfileBuilder';
import ProfileManual from './pages/ProfileManual';
import ProfileSuccess from './pages/ProfileSuccess';
import Dashboard from './pages/Dashboard';
import { loadSession } from './lib/session';

function ProtectedDashboard() {
  return loadSession()?.user_id ? <Dashboard /> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding/resume" element={<ProfileBuilder />} />
        <Route path="/onboarding/manual" element={<ProfileManual />} />
        <Route path="/onboarding/success" element={<ProfileSuccess />} />
        <Route path="/dashboard" element={<ProtectedDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
