import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Requests from './pages/Requests';
import Users from './pages/Users';
import Servicemen from './pages/Servicemen';
import Payments from './pages/Payments';
import MainLayout from './layout/MainLayout';
import AddUserBooking from './pages/AddUserBooking';
import UserDetails from './pages/UserDetails';
import Notifications from './pages/Notifications';
import SuperAdmin from './pages/SuperAdmin';
import AddService from './pages/CreateService';
import CreateServiceman from './pages/CreateServiceman';  
import { setAuthToken } from './api/adminApi';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔐 CHECK TOKEN
  useEffect(() => {
    const token = localStorage.getItem('admin_token');

    if (token) {
      setAuthToken(token);
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  const handleLogin = (user, token) => {
    localStorage.setItem('admin_token', token); // ✅ IMPORTANT
    setAuthToken(token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token'); // ✅ FIXED
    setAuthToken(null);
    setIsLoggedIn(false);
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout onLogout={handleLogout} />}>

        {/* Default */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Pages */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="requests" element={<Requests />} />
        <Route path="users" element={<Users />} />
        <Route path="servicemen" element={<Servicemen />} />
        <Route path="payments" element={<Payments />} />
        <Route path="add-user" element={<AddUserBooking />} />

        {/* ✅ FIXED dynamic route */}
        <Route path="user/:id" element={<UserDetails />} />

        {/* ✅ FIXED (no slash) */}
        <Route path="notifications" element={<Notifications />} />
        <Route path="super-admin" element={<SuperAdmin />} />

        <Route path="/add-service" element={<AddService />} />
        <Route path="/create-serviceman" element={<CreateServiceman />} />

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}