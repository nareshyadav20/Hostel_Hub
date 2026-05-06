import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from './api/axios';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{"name": "Resident"}'));
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes] = await Promise.all([
          API.get('/tenants/me')
        ]);
        setTenantData(profileRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="staynest-dashboard loading-state">
        <div className="premium-spinner"></div>
        <p>Loading your portal...</p>
      </div>
    );
  }

  return (
    <div className="staynest-dashboard">
      
      {/* ── 1. Welcome Hero Banner ── */}
      <section className="staynest-hero">
        <div className="hero-content">
          <h1 className="hero-title">Good Afternoon, {user.name?.split(' ')[0] || 'Resident'}! 👋</h1>
          <p className="hero-subtitle">Welcome back to your premium home experience.</p>
          
          <div className="hero-stats">
            <div className="h-stat">
              <span className="h-icon">🏠</span> 
              <div><strong>Block A</strong><span>Building</span></div>
            </div>
            <div className="h-stat">
              <span className="h-icon">🚪</span> 
              <div><strong>203</strong><span>Room No.</span></div>
            </div>
            <div className="h-stat">
              <span className="h-icon">👥</span> 
              <div><strong>2 Sharing</strong><span>Room Type</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Top Action Cards ── */}
      <div className="top-action-row">
         <Link to="/payments" className="action-card">
           <div className="a-icon green">💰</div>
           <div className="a-text"><strong>Pay Rent</strong><span>Make a payment</span></div>
         </Link>
         <Link to="/complaints" className="action-card">
           <div className="a-icon orange">🔔</div>
           <div className="a-text"><strong>Raise Complaint</strong><span>Report an issue</span></div>
         </Link>
         <Link to="/mess" className="action-card">
           <div className="a-icon purple">🍽️</div>
           <div className="a-text"><strong>Book Meal</strong><span>Pre-book your meal</span></div>
         </Link>
         <Link to="/services" className="action-card">
           <div className="a-icon blue">🧹</div>
           <div className="a-text"><strong>Request Cleaning</strong><span>Room cleaning</span></div>
         </Link>
      </div>

      {/* ── 3. Today's Summary ── */}
      <section className="today-summary">
         <h3 className="section-label">Today's Summary</h3>
         <div className="summary-cards">
            <div className="s-card">
              <div className="s-header">Rent Due</div>
              <div className="s-value">₹5,000</div>
              <div className="s-sub">Due in 3 days</div>
              <div className="s-icon-box">📗</div>
            </div>
            <div className="s-card">
              <div className="s-header">Notices</div>
              <div className="s-value">2</div>
              <div className="s-sub">New updates</div>
              <div className="s-icon-box">📙</div>
            </div>
            <div className="s-card">
              <div className="s-header">Complaints</div>
              <div className="s-value">1</div>
              <div className="s-sub">In Progress</div>
              <div className="s-icon-box">📘</div>
            </div>
            <div className="s-card">
              <div className="s-header">Mess</div>
              <div className="s-value">Lunch</div>
              <div className="s-sub">12:30 PM - 2:00 PM</div>
              <div className="s-icon-box">🍽️</div>
            </div>
         </div>
      </section>

      {/* ── 4. Main Grid ── */}
      <div className="staynest-main-grid">
         
         {/* Left Column */}
         <div className="sn-col">
            <div className="sn-card">
               <h4 className="sn-card-title">Payments Overview</h4>
               <div className="sn-price-row">
                  <div><span className="sn-label">Total Due</span><br/><strong>₹5,000</strong></div>
                  <span className="sn-badge-red">Due in 3 days</span>
               </div>
               <div className="sn-price-row">
                  <div><span className="sn-label">Paid This Month</span><br/><strong>₹3,000</strong></div>
               </div>
               <div className="sn-progress-box">
                  <div className="sn-progress-bg"><div className="sn-progress-fill" style={{ width: '60%' }}></div></div>
                  <p className="sn-label">60% Paid</p>
               </div>
               <button className="sn-btn-outline">View Payment History</button>
            </div>
         </div>

         {/* Middle Column */}
         <div className="sn-col">
            <div className="sn-card">
               <div className="sn-header-row">
                  <h4 className="sn-card-title">My Complaints</h4>
                  <span className="sn-link">View All</span>
               </div>
               <div className="sn-notice-item">
                  <div className="sn-n-icon">🔧</div>
                  <div className="sn-n-info">
                    <strong>Plumbing issue</strong>
                    <span>In Progress • Updated 2h ago</span>
                  </div>
               </div>
               <button className="sn-btn-outline">Raise New Complaint</button>
            </div>
         </div>

         {/* Right Column */}
         <div className="sn-col">
            <div className="sn-card">
               <h4 className="sn-card-title">Facilities Status</h4>
               <div className="sn-facility-list">
                  <div className="sn-f-row"><span>📶 WiFi</span> <span className="sn-badge-green">Good</span></div>
                  <div className="sn-f-row"><span>⚡ Power</span> <span className="sn-badge-green">Stable</span></div>
                  <div className="sn-f-row"><span>💧 Water</span> <span className="sn-badge-green">Available</span></div>
               </div>
               <button className="sn-btn-outline">Check Full Status</button>
            </div>
         </div>
      </div>
    </div>
  );
}

export default Dashboard;
