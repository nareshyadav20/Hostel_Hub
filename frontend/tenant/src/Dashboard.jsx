import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from './api/axios';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{"name": "Resident"}'));
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, complaintsRes] = await Promise.all([
          API.get('/tenants/me').catch(() => ({ data: { name: user.name, room: '203', messPlan: 'Standard' } })),
          API.get('/complaints/me').catch(() => ({ data: [] }))
        ]);
        setTenantData(profileRes.data);
        setComplaints((complaintsRes.data || []).slice(0, 3));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentMeal = () => {
    const h = new Date().getHours();
    if (h >= 7 && h < 10) return { name: 'Breakfast', time: '8:00 AM - 10:00 AM', color: '#3b82f6' };
    if (h >= 12 && h < 15) return { name: 'Lunch', time: '12:30 PM - 2:30 PM', color: '#ef4444' };
    return { name: 'Dinner', time: '8:00 PM - 9:30 PM', color: '#16a34a' };
  };

  const meal = getCurrentMeal();

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
      <section className="dash-hero">
        <div className="dash-hero-content">
          <h1 className="dash-hero-title">{getGreeting()}, {user.name?.split(' ')[0] || 'Resident'}! 👋</h1>
          <p className="dash-hero-subtitle">Welcome back to your premium home experience.</p>
        </div>
        <div className="dash-hero-stats">
          <div className="dash-stat-chip">
            <div className="dash-stat-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div><strong>Block A</strong><span>Building</span></div>
          </div>
          <div className="dash-stat-chip">
            <div className="dash-stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <div><strong>{tenantData?.room || '203'}</strong><span>Room No.</span></div>
          </div>
          <div className="dash-stat-chip">
            <div className="dash-stat-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div><strong>2 Sharing</strong><span>Room Type</span></div>
          </div>
        </div>
      </section>

      {/* ── 2. Quick Actions ── */}
      <div className="dash-actions-grid">
        <Link to="/payments" className="dash-action-card">
          <div className="dash-act-icon" style={{ background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)', color: '#16a34a' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="20"></line><line x1="12" y1="4" x2="12" y2="6"></line></svg>
          </div>
          <div className="dash-act-text"><strong>Pay Rent</strong><span>Make a payment</span></div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="dash-act-arrow"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </Link>

        <Link to="/complaints" className="dash-action-card">
          <div className="dash-act-icon" style={{ background: 'linear-gradient(135deg, #ffedd5, #fed7aa)', color: '#ea580c' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div className="dash-act-text"><strong>Raise Complaint</strong><span>Report an issue</span></div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="dash-act-arrow"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </Link>

        <Link to="/mess" className="dash-action-card">
          <div className="dash-act-icon" style={{ background: 'linear-gradient(135deg, #ede9fe, #ddd6fe)', color: '#7c3aed' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" /></svg>
          </div>
          <div className="dash-act-text"><strong>Dining & Mess</strong><span>Today's menu & ratings</span></div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="dash-act-arrow"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </Link>

        <Link to="/services" className="dash-action-card">
          <div className="dash-act-icon" style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', color: '#2563eb' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
          </div>
          <div className="dash-act-text"><strong>Services</strong><span>Laundry, cleaning & more</span></div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="dash-act-arrow"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </Link>
      </div>

      {/* ── 3. Today's Summary ── */}
      <section className="dash-summary-section">
        <h3 className="dash-section-title">Today's Summary</h3>
        <div className="dash-summary-grid">
          <div className="dash-summary-card rent-card" onClick={() => navigate('/payments')}>
            <div className="dash-sum-top">
              <span className="dash-sum-label">Rent Due</span>
              <div className="dash-sum-icon-box" style={{ background: '#fef2f2', color: '#ef4444' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
              </div>
            </div>
            <div className="dash-sum-value">₹{(tenantData?.rent || 5000).toLocaleString()}</div>
            <div className="dash-sum-sub">Due in 3 days</div>
          </div>

          <div className="dash-summary-card" onClick={() => navigate('/complaints')}>
            <div className="dash-sum-top">
              <span className="dash-sum-label">Complaints</span>
              <div className="dash-sum-icon-box" style={{ background: '#fff7ed', color: '#ea580c' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
            </div>
            <div className="dash-sum-value">{complaints.length}</div>
            <div className="dash-sum-sub">{complaints.filter(c => c.status !== 'Resolved').length} In Progress</div>
          </div>

          <div className="dash-summary-card" onClick={() => navigate('/mess')}>
            <div className="dash-sum-top">
              <span className="dash-sum-label">Next Meal</span>
              <div className="dash-sum-icon-box" style={{ background: '#f0fdf4', color: meal.color }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /></svg>
              </div>
            </div>
            <div className="dash-sum-value">{meal.name}</div>
            <div className="dash-sum-sub">{meal.time}</div>
          </div>

          <div className="dash-summary-card" onClick={() => navigate('/safety')}>
            <div className="dash-sum-top">
              <span className="dash-sum-label">Facilities</span>
              <div className="dash-sum-icon-box" style={{ background: '#eff6ff', color: '#2563eb' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
            </div>
            <div className="dash-sum-value" style={{ fontSize: '1.4rem' }}>All Good</div>
            <div className="dash-sum-sub">WiFi · Power · Water</div>
          </div>
        </div>
      </section>

      {/* ── 4. Main Content Grid ── */}
      <div className="dash-content-grid">

        {/* Payments Overview */}
        <div className="sn-card dash-payments-card">
          <div className="dash-card-header">
            <div className="dash-card-icon" style={{ background: '#f0fdf4', color: '#16a34a' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="20"></line><line x1="12" y1="4" x2="12" y2="6"></line></svg>
            </div>
            <h4 className="sn-card-title">Payments Overview</h4>
          </div>
          <div className="dash-payment-row">
            <div>
              <span className="dash-pay-label">Total Due</span>
              <strong className="dash-pay-value">₹{(tenantData?.rent || 5000).toLocaleString()}</strong>
            </div>
            <span className="sn-badge-red">Due in 3 days</span>
          </div>
          <div className="dash-payment-row">
            <div>
              <span className="dash-pay-label">Paid This Month</span>
              <strong className="dash-pay-value">₹3,000</strong>
            </div>
          </div>
          <div className="dash-progress-wrap">
            <div className="dash-progress-bg"><div className="dash-progress-fill" style={{ width: '60%' }}></div></div>
            <span className="dash-progress-label">60% Paid</span>
          </div>
          <button className="dash-btn-outline" onClick={() => navigate('/payments')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            View Payment History
          </button>
        </div>

        {/* Complaints */}
        <div className="sn-card dash-complaints-card">
          <div className="dash-card-header">
            <div className="dash-card-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <h4 className="sn-card-title">My Complaints</h4>
            <Link to="/complaints" className="dash-card-link">View All</Link>
          </div>

          {complaints.length === 0 ? (
            <div className="dash-empty-state">
              <p>No active complaints. Everything is running smoothly! ✨</p>
            </div>
          ) : (
            <div className="dash-complaint-list">
              {complaints.map(c => (
                <div key={c._id} className="dash-complaint-item">
                  <div className="dash-complaint-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                  </div>
                  <div className="dash-complaint-info">
                    <strong>{c.title}</strong>
                    <span className={`dash-complaint-status ${(c.status || '').toLowerCase().replace(/\s/g, '-')}`}>{c.status} • {c.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button className="dash-btn-outline" onClick={() => navigate('/complaints')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Raise New Complaint
          </button>
        </div>

        {/* Facilities Status */}
        <div className="sn-card dash-facilities-card">
          <div className="dash-card-header">
            <div className="dash-card-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h4 className="sn-card-title">Facilities Status</h4>
          </div>
          <div className="dash-facility-list">
            {[
              { label: 'WiFi', status: 'Good', icon: '📶', color: '#16a34a' },
              { label: 'Power', status: 'Stable', icon: '⚡', color: '#16a34a' },
              { label: 'Water', status: 'Available', icon: '💧', color: '#16a34a' },
              { label: 'Laundry', status: 'Open', icon: '🧺', color: '#2563eb' }
            ].map((f, i) => (
              <div key={i} className="dash-facility-row">
                <div className="dash-fac-left">
                  <span className="dash-fac-emoji">{f.icon}</span>
                  <span className="dash-fac-label">{f.label}</span>
                </div>
                <span className="dash-fac-badge" style={{ color: f.color, background: f.color + '10', borderColor: f.color + '30' }}>{f.status}</span>
              </div>
            ))}
          </div>
          <button className="dash-btn-outline" onClick={() => navigate('/services')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
            Request a Service
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
