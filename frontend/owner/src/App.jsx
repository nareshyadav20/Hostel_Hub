import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './Dashboard';
import Portfolio from './pages/Portfolio';
import Drafts from './pages/Drafts';
import Profile from './pages/Profile';
import BuildingManagement from './pages/BuildingManagement';
import Rooms from './pages/Rooms';
import Tenants from './pages/Tenants';
import Payments from './pages/Payments';
import Staff from './pages/Staff';
import Mess from './pages/Mess';
import Complaints from './pages/Complaints';
import Assets from './pages/Assets';
import Inventory from './pages/Inventory';
import InventoryMaster from './pages/InventoryMaster';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Community from './pages/Community';
import Layout from './components/Layout';
import './index.css';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route path="/owner/portfolio" element={<Portfolio />} />
<Route path="/owner/drafts" element={<Drafts />} />
        <Route path="/owner/profile" element={<Layout><Profile /></Layout>} />

        {/* Building specific routes */}
        <Route path="/owner/building/:buildingId/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/owner/building/:buildingId/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/owner/building/:buildingId/manage" element={<Layout><BuildingManagement /></Layout>} />
        <Route path="/owner/building/:buildingId/rooms" element={<Layout><Rooms /></Layout>} />
        <Route path="/owner/building/:buildingId/tenants" element={<Layout><Tenants /></Layout>} />
        <Route path="/owner/building/:buildingId/payments" element={<Layout><Payments /></Layout>} />
        <Route path="/owner/building/:buildingId/staff" element={<Layout><Staff /></Layout>} />
        <Route path="/owner/building/:buildingId/mess" element={<Layout><Mess /></Layout>} />
        <Route path="/owner/building/:buildingId/complaints" element={<Layout><Complaints /></Layout>} />
        <Route path="/owner/building/:buildingId/assets" element={<Layout><Assets /></Layout>} />
        <Route path="/owner/building/:buildingId/inventory" element={<Layout><Inventory /></Layout>} />
        <Route path="/owner/building/:buildingId/inventory/master" element={<Layout><InventoryMaster /></Layout>} />
        <Route path="/owner/building/:buildingId/inventory/damage" element={<Layout><Inventory initialTab="damage" /></Layout>} />
        <Route path="/owner/building/:buildingId/notifications" element={<Layout><Notifications /></Layout>} />
        <Route path="/owner/building/:buildingId/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/owner/building/:buildingId/settings" element={<Layout><Settings /></Layout>} />
        <Route path="/owner/building/:buildingId/community" element={<Layout><Community /></Layout>} />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<Navigate to="/owner/portfolio" />} />
      </Routes>
    </Router>
  );
}

export default App;
