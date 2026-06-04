import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import './index.css';

// Pages
import Dashboard from './Dashboard';
import Hostels from './pages/Hostels';
import Owners from './pages/Owners';
import Tenants from './pages/Tenants';
import Staff from './pages/Staff';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Offers from './pages/Offers';
import Surveys from './pages/Surveys';
import Cities from './pages/Cities';
import Settings from './pages/Settings';
import Finance from './pages/Finance';
import Issues from './pages/Issues';
import Rooms from './pages/Rooms';
import Automation from './pages/Automation';
import Tasks from './pages/Tasks';
import Insights from './pages/Insights';
import Placeholder from './pages/Placeholder';
import Bookings from './pages/Bookings.jsx';
import Maintenance from './pages/Maintenance';
import Support from './pages/Support';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Complaints from './pages/Complaints';
import HostelApprovalCenter from './pages/HostelApprovalCenter';

function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login"         element={<Login />} />
          <Route path="/signup"        element={<Signup />} />
          <Route path="/"              element={<Navigate to="/login" replace />} />
          <Route path="/dashboard"     element={<Layout><Dashboard /></Layout>} />
          <Route path="/approvals"     element={<Layout><HostelApprovalCenter /></Layout>} />
          <Route path="/hostels"       element={<Layout><Hostels /></Layout>} />
          <Route path="/owners"        element={<Layout><Owners /></Layout>} />
          <Route path="/tenants"       element={<Layout><Tenants /></Layout>} />
          <Route path="/staff"         element={<Layout><Staff /></Layout>} />
          <Route path="/users"         element={<Layout><Users /></Layout>} />
          <Route path="/analytics"     element={<Layout><Analytics /></Layout>} />
          <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
          <Route path="/offers"        element={<Layout><Offers /></Layout>} />
          <Route path="/surveys"       element={<Layout><Surveys /></Layout>} />
          <Route path="/cities"        element={<Layout><Cities /></Layout>} />
          <Route path="/settings"      element={<Layout><Settings /></Layout>} />
          <Route path="/bookings"      element={<Layout><Bookings /></Layout>} />
          <Route path="/issues"        element={<Layout><Issues /></Layout>} />
          <Route path="/payments"      element={<Layout><Finance /></Layout>} />
          <Route path="/plans"         element={<Placeholder title="SaaS Plans" />} />
          <Route path="/integrations"  element={<Placeholder title="Partner Integrations" />} />
          <Route path="/security"      element={<Layout><Settings /></Layout>} />
          <Route path="/rooms"         element={<Layout><Rooms /></Layout>} />
          <Route path="/beds"          element={<Placeholder title="Beds" />} />
          <Route path="/mess"          element={<Placeholder title="Mess" />} />
          <Route path="/inventory"     element={<Placeholder title="Inventory" />} />
          <Route path="/finance"       element={<Layout><Finance /></Layout>} />
          <Route path="/wallet"        element={<Placeholder title="Wallet" />} />
          <Route path="/automation"    element={<Layout><Automation /></Layout>} />
          <Route path="/tasks"         element={<Layout><Tasks /></Layout>} />
          <Route path="/insights"      element={<Layout><Insights /></Layout>} />
          <Route path="/support"       element={<Layout><Support /></Layout>} />
          <Route path="/complaints"    element={<Layout><Complaints /></Layout>} />
          <Route path="/maintenance"   element={<Layout><Maintenance /></Layout>} />
          <Route path="/profile"       element={<Layout><Profile /></Layout>} />
          <Route path="*"              element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
   </ToastProvider>
  );
}

export default App;
