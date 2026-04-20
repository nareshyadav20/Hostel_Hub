import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './Dashboard';
import Profile from './pages/Profile';
import Buildings from './pages/Buildings';
import Rooms from './pages/Rooms';
import Tenants from './pages/Tenants';
import Payments from './pages/Payments';
import Staff from './pages/Staff';
import Mess from './pages/Mess';
import Complaints from './pages/Complaints';
import Inventory from './pages/Inventory';
import Notifications from './pages/Notifications';
import Layout from './components/Layout';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/buildings" element={<Layout><Buildings /></Layout>} />
        <Route path="/rooms" element={<Layout><Rooms /></Layout>} />
        <Route path="/tenants" element={<Layout><Tenants /></Layout>} />
        <Route path="/payments" element={<Layout><Payments /></Layout>} />
        <Route path="/staff" element={<Layout><Staff /></Layout>} />
        <Route path="/mess" element={<Layout><Mess /></Layout>} />
        <Route path="/complaints" element={<Layout><Complaints /></Layout>} />
        <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
        <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
