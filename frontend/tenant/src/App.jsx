import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
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

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Public browsing routes */}
        <Route path="/search"          element={<Layout><Search /></Layout>} />
        <Route path="/listing/:id"     element={<Layout><Listing /></Layout>} />

        {/* Protected portal routes */}
        <Route path="/dashboard"  element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/wishlist"   element={<ProtectedRoute><Layout><Wishlist /></Layout></ProtectedRoute>} />
        <Route path="/booking"    element={<ProtectedRoute><Layout><Booking /></Layout></ProtectedRoute>} />
        <Route path="/payments"   element={<ProtectedRoute><Layout><Payments /></Layout></ProtectedRoute>} />
        <Route path="/mess"       element={<ProtectedRoute><Layout><Mess /></Layout></ProtectedRoute>} />
        <Route path="/rewards"    element={<ProtectedRoute><Layout><Rewards /></Layout></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute><Layout><Complaints /></Layout></ProtectedRoute>} />
        <Route path="/transfers"  element={<ProtectedRoute><Layout><Transfers /></Layout></ProtectedRoute>} />
        <Route path="/discounts"  element={<ProtectedRoute><Layout><Discounts /></Layout></ProtectedRoute>} />
        <Route path="/services"   element={<ProtectedRoute><Layout><Services /></Layout></ProtectedRoute>} />
        <Route path="/community"  element={<ProtectedRoute><Layout><Community /></Layout></ProtectedRoute>} />
        <Route path="/safety"     element={<ProtectedRoute><Layout><Safety /></Layout></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
