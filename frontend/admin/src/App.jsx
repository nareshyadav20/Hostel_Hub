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
          <Route path="*"              element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
