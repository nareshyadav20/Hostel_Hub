import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
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
import Complaints from './pages/Complaints';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Finance from './pages/Finance';
import Rooms from './pages/Rooms';
import Insights from './pages/Insights';
import Placeholder from './pages/Placeholder';
import Maintenance from './pages/Maintenance';
import Support from './pages/Support';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard"     element={<Layout><Dashboard /></Layout>} />
          
          {/* Overview */}
          <Route path="/analytics/live" element={<Layout><Analytics /></Layout>} />
          <Route path="/analytics/ai" element={<Layout><Insights /></Layout>} />
          
          {/* Hostel Management */}
          <Route path="/hostels"       element={<Layout><Hostels /></Layout>} />
          <Route path="/floors"        element={<Layout><Placeholder title="Floors Management" /></Layout>} />
          <Route path="/rooms"         element={<Layout><Rooms /></Layout>} />
          <Route path="/beds"          element={<Layout><Placeholder title="Beds Management" /></Layout>} />
          <Route path="/infra"         element={<Layout><Placeholder title="Smart Infrastructure" /></Layout>} />

          {/* Tenant Management */}
          <Route path="/tenants"       element={<Layout><Tenants /></Layout>} />
          <Route path="/admissions"    element={<Layout><Placeholder title="Admissions Center" /></Layout>} />
          <Route path="/transfers"     element={<Layout><Placeholder title="Room Transfers" /></Layout>} />
          <Route path="/complaints"    element={<Layout><Complaints /></Layout>} />
          <Route path="/checkins"      element={<Layout><Placeholder title="Check-In/Out Desk" /></Layout>} />
          <Route path="/visitors"      element={<Layout><Placeholder title="Visitor Management" /></Layout>} />

          {/* Owners Management */}
          <Route path="/owners"        element={<Layout><Owners /></Layout>} />
          <Route path="/verifications" element={<Layout><Placeholder title="Owner Verification" /></Layout>} />
          <Route path="/subscriptions" element={<Layout><Placeholder title="Subscription Plans" /></Layout>} />
          <Route path="/performance"   element={<Layout><Placeholder title="Owner Performance" /></Layout>} />

          {/* Payments & Finance */}
          <Route path="/payments"      element={<Layout><Payments /></Layout>} />
          <Route path="/revenue"       element={<Layout><Finance /></Layout>} />
          <Route path="/dues"          element={<Layout><Placeholder title="Pending Dues" /></Layout>} />
          <Route path="/transactions"  element={<Layout><Placeholder title="Transaction History" /></Layout>} />
          <Route path="/finance-reports" element={<Layout><Placeholder title="Financial Reports" /></Layout>} />

          {/* Inventory & Procure */}
          <Route path="/inventory"     element={<Layout><Placeholder title="Smart Inventory" /></Layout>} />
          <Route path="/procurement"   element={<Layout><Placeholder title="Procurement" /></Layout>} />
          <Route path="/vendors"       element={<Layout><Placeholder title="Vendor Directory" /></Layout>} />
          <Route path="/inventory-alerts" element={<Layout><Placeholder title="Inventory Alerts" /></Layout>} />

          {/* Staff & Operations */}
          <Route path="/staff"         element={<Layout><Staff /></Layout>} />
          <Route path="/attendance"    element={<Layout><Placeholder title="Staff Attendance" /></Layout>} />
          <Route path="/shifts"        element={<Layout><Placeholder title="Shift Management" /></Layout>} />
          <Route path="/maintenance"   element={<Layout><Maintenance /></Layout>} />
          <Route path="/hygiene"       element={<Layout><Placeholder title="Hygiene Tracking" /></Layout>} />

          {/* Notify & Support */}
          <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
          <Route path="/announcements" element={<Layout><Placeholder title="Announcements" /></Layout>} />
          <Route path="/support"       element={<Layout><Support /></Layout>} />
          <Route path="/tickets"       element={<Layout><Placeholder title="Support Tickets" /></Layout>} />

          {/* Reports & AI */}
          <Route path="/reports"       element={<Layout><Placeholder title="Master Reports" /></Layout>} />
          <Route path="/reports/occupancy" element={<Layout><Placeholder title="Occupancy Analytics" /></Layout>} />
          <Route path="/reports/revenue" element={<Layout><Placeholder title="Revenue Analytics" /></Layout>} />
          <Route path="/predictions"   element={<Layout><Placeholder title="AI Predictions" /></Layout>} />

          {/* Settings & Security */}
          <Route path="/settings"      element={<Layout><Settings /></Layout>} />
          <Route path="/roles"         element={<Layout><Placeholder title="Roles & Permissions" /></Layout>} />
          <Route path="/security"      element={<Layout><Placeholder title="Security Settings" /></Layout>} />
          <Route path="/audit"         element={<Layout><Placeholder title="Audit Logs" /></Layout>} />
          
          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
