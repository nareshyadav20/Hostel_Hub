import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './Dashboard';
import Hostels from './pages/Hostels';
import Owners from './pages/Owners';
import Tenants from './pages/Tenants';
import Subscriptions from './pages/Subscriptions';
import Payments from './pages/Payments';
import Promotions from './pages/Promotions';
import Partners from './pages/Partners';
import Layout from './components/Layout';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Navigate to="/login" />} /> {/* Admin usually doesn't self-signup */}
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/hostels" element={<Layout><Hostels /></Layout>} />
        <Route path="/owners" element={<Layout><Owners /></Layout>} />
        <Route path="/tenants" element={<Layout><Tenants /></Layout>} />
        <Route path="/subscriptions" element={<Layout><Subscriptions /></Layout>} />
        <Route path="/payments" element={<Layout><Payments /></Layout>} />
        <Route path="/promotions" element={<Layout><Promotions /></Layout>} />
        <Route path="/partners" element={<Layout><Partners /></Layout>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
