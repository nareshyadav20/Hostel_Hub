import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './Dashboard';
import Search from './pages/Search';
import Listing from './pages/Listing';
import Wishlist from './pages/Wishlist';
import Booking from './pages/Booking';
import Payments from './pages/Payments';
import Mess from './pages/Mess';
import Rewards from './pages/Rewards';
import Complaints from './pages/Complaints';
import Transfers from './pages/Transfers';
import Discounts from './pages/Discounts';
import Services from './pages/Services';
import Community from './pages/Community';
import Safety from './pages/Safety';
import Profile from './pages/Profile';
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
        <Route path="/search" element={<Layout><Search /></Layout>} />
        <Route path="/listing/:id" element={<Layout><Listing /></Layout>} />
        <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
        <Route path="/booking" element={<Layout><Booking /></Layout>} />
        <Route path="/payments" element={<Layout><Payments /></Layout>} />
        <Route path="/mess" element={<Layout><Mess /></Layout>} />
        <Route path="/rewards" element={<Layout><Rewards /></Layout>} />
        <Route path="/complaints" element={<Layout><Complaints /></Layout>} />
        <Route path="/transfers" element={<Layout><Transfers /></Layout>} />
        <Route path="/discounts" element={<Layout><Discounts /></Layout>} />
        <Route path="/services" element={<Layout><Services /></Layout>} />
        <Route path="/community" element={<Layout><Community /></Layout>} />
        <Route path="/safety" element={<Layout><Safety /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
