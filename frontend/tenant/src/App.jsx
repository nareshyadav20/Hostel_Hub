// src/App.jsx

import React, { useEffect } from 'react';
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
import Offers from './pages/Offers';
import Services from './pages/Services';
import Community from './pages/Community';
import Safety from './pages/Safety';
import Profile from './pages/Profile';
import ProfileStep3 from './pages/ProfileStep3';
import ProfileStep4 from './pages/ProfileStep4';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';

import { connectSocket, disconnectSocket } from './utils/socket';

import './index.css';

const APP_VERSION = '1.0.5';

const ProtectedRoute = ({ children }) => {

  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const ListingWrapper = () => {

  try {

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const isLoggedIn = !!token && !!user?.name;

    return isLoggedIn ? (
      <Layout>
        <Listing />
      </Layout>
    ) : (
      <PublicLayout>
        <Listing />
      </PublicLayout>
    );

  } catch (error) {

    console.error("ListingWrapper Error:", error);

    return (
      <PublicLayout>
        <Listing />
      </PublicLayout>
    );
  }
};

function App() {

  useEffect(() => {

    try {

      const storedVersion = localStorage.getItem('app_version');

      if (storedVersion !== APP_VERSION) {

        console.log("🔄 Clearing old cache/version data");

        const token = localStorage.getItem('token');

        localStorage.clear();
        sessionStorage.clear();

        if (token) {
          localStorage.setItem('token', token);
        }

        localStorage.setItem('app_version', APP_VERSION);

        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });

        window.location.reload();
      }

    } catch (error) {

      console.error("App Init Error:", error);
    }

  }, []);

  // Socket initialization
  useEffect(() => {

    try {

      const token = localStorage.getItem('token');

      if (token) {
        connectSocket();
      }

    } catch (error) {

      console.error("Socket Init Error:", error);
    }

    return () => {
      disconnectSocket();
    };

  }, []);

  return (
    <Router>
      <Routes>

        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/explore"
          element={
            <PublicLayout>
              <Landing />
            </PublicLayout>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />

        <Route
          path="/terms"
          element={
            <PublicLayout>
              <Terms />
            </PublicLayout>
          }
        />

        <Route
          path="/privacy"
          element={
            <PublicLayout>
              <Privacy />
            </PublicLayout>
          }
        />

        {/* Public Browsing */}
        <Route
          path="/search"
          element={
            <Layout>
              <Search />
            </Layout>
          }
        />

        <Route path="/offers" element={<Offers />} />

        <Route
          path="/listing/:id"
          element={<ListingWrapper />}
        />

        {/* Protected Routes */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Layout>
                <Wishlist />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Layout>
                <Booking />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/:buildingId"
          element={
            <ProtectedRoute>
              <Layout>
                <Booking />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <Layout>
                <Payments />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/mess"
          element={
            <ProtectedRoute>
              <Layout>
                <Mess />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/rewards"
          element={
            <ProtectedRoute>
              <Layout>
                <Rewards />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <Layout>
                <Complaints />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/transfers"
          element={
            <ProtectedRoute>
              <Layout>
                <Transfers />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/discounts"
          element={
            <ProtectedRoute>
              <Layout>
                <Discounts />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <Layout>
                <Services />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <Layout>
                <Community />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/safety"
          element={
            <ProtectedRoute>
              <Layout>
                <Safety />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile-setup/step3"
          element={
            <ProtectedRoute>
              <ProfileStep3 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile-setup/step4"
          element={
            <ProtectedRoute>
              <ProfileStep4 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;