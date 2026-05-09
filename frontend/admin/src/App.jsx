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
import Cms from './pages/Cms';
import Offers from './pages/Offers';
import Surveys from './pages/Surveys';
import Cities from './pages/Cities';
import Settings from './pages/Settings';
import Finance from './pages/Finance';
import Complaints from './pages/Complaints';
import Rooms from './pages/Rooms';
import Automation from './pages/Automation';
import Insights from './pages/Insights';
import Placeholder from './pages/Placeholder';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/dashboard"     element={<Layout><Dashboard /></Layout>} />
          <Route path="/hostels"       element={<Layout><Hostels /></Layout>} />
          <Route path="/owners"        element={<Layout><Owners /></Layout>} />
          <Route path="/tenants"       element={<Layout><Tenants /></Layout>} />
          <Route path="/staff"         element={<Layout><Staff /></Layout>} />
          <Route path="/users"         element={<Layout><Users /></Layout>} />
          <Route path="/analytics"     element={<Layout><Analytics /></Layout>} />
          <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
          <Route path="/cms"           element={<Layout><Cms /></Layout>} />
          <Route path="/offers"        element={<Layout><Offers /></Layout>} />
          <Route path="/surveys"       element={<Layout><Surveys /></Layout>} />
          <Route path="/cities"        element={<Layout><Cities /></Layout>} />
          <Route path="/settings"      element={<Layout><Settings /></Layout>} />
          
          {/* Missing Sidebar Modules */}
          <Route path="/rooms" element={<Layout><Rooms /></Layout>} />
          <Route path="/beds" element={<Layout><Placeholder title="Beds" /></Layout>} />
          <Route path="/mess" element={<Layout><Placeholder title="Mess" /></Layout>} />
          <Route path="/inventory" element={<Layout><Placeholder title="Inventory" /></Layout>} />
          <Route path="/complaints" element={<Layout><Complaints /></Layout>} />
          <Route path="/finance" element={<Layout><Finance /></Layout>} />
          <Route path="/wallet" element={<Layout><Placeholder title="Wallet" /></Layout>} />
          <Route path="/automation" element={<Layout><Automation /></Layout>} />
          <Route path="/insights" element={<Layout><Insights /></Layout>} />

          <Route path="*"              element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
