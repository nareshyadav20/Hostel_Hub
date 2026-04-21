import React from 'react';
<<<<<<< HEAD
import './App.css'; // Assuming common styles are here or will be added
=======
import { Link } from 'react-router-dom';
import './App.css';
>>>>>>> day1

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Tenant"}');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const activities = [
    { id: 1, type: 'payment', title: 'Rent Paid Successfully', desc: 'April 2026 rent payment confirmed', time: '2 hours ago', color: 'var(--accent-success)' },
    { id: 2, type: 'complaint', title: 'WiFi Maintenance', desc: 'Your ticket #442 has been resolved', time: 'Yesterday', color: 'var(--accent-primary)' },
    { id: 3, type: 'mess', title: 'Special Menu Update', desc: 'Biryani Special tonight at 8:00 PM', time: '12 Apr', color: 'var(--accent-warning)' },
  ];

  const stats = [
    {
      title: "Next Rent Due",
      value: "₹6,500",
      subtext: "Due in 5 days",
      color: "#ff4d4d",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M2 10H22" stroke="currentColor" strokeWidth="2"/>
          <path d="M7 15H8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M12 15H16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      title: "Loyalty Points",
      value: "450",
      subtext: "Level: Silver",
      color: "#f59e0b",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
      )
    },
    {
      title: "Mess Attendance",
      value: "92%",
      subtext: "This month",
      color: "#10b981",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
          <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
          <path d="M9 16L11 18L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <div className="dashboard-container">
<<<<<<< HEAD
      {/* Aesthetic Background Elements */}
      <div className="dashboard-bg-blob"></div>
      <div className="dashboard-bg-blob-2"></div>

      <div className="welcome-section">
        <div className="welcome-text">
          <div className="welcome-header">
            <div className="welcome-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15C8.13401 15 5 18.134 5 22H19C19 18.134 15.866 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1>Welcome back, {user.name}</h1>
          </div>
          <p>Your stay is our priority. Here's what's happening today.</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index} style={{"--delay": `${index * 0.1}s`}}>
            <div className="stat-card-inner">
              <div className="stat-header">
                <div className="stat-icon" style={{ color: stat.color, backgroundColor: `${stat.color}15` }}>
                  {stat.icon}
                </div>
                <div className="stat-title-group">
                  <span className="stat-title">{stat.title}</span>
                  <span className="stat-trend">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    2.5%
                  </span>
                </div>
              </div>
              <div className="stat-content">
                <h2 style={{ color: stat.color }}>{stat.value}</h2>
                <p>{stat.subtext}</p>
              </div>
              <div className="stat-footer">
                <div className="stat-progress-bg">
                  <div className="stat-progress-bar" style={{ backgroundColor: stat.color, width: '75%' }}></div>
                </div>
                <div className="stat-action">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
=======
      <section className="welcome-section">
        <h1>{greeting}, {user.name}! 👋</h1>
        <p>Welcome back to your digital hostel home. Everything looks good for today.</p>
      </section>

      <div className="dashboard-grid">
        <div className="main-stats">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Rent Card */}
            <div className="card stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Rent Cycle</h3>
                <span style={{ color: 'var(--accent-error)', fontSize: '0.8rem', fontWeight: '800' }}>5 DAYS LEFT</span>
              </div>
              <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>₹6,500</h2>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '85%', background: 'var(--accent-error)' }}></div>
              </div>
              <p style={{ fontSize: '0.8rem' }}>Next payment due on 26th April</p>
            </div>

            {/* Loyalty Card */}
            <div className="card stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3>Loyalty Rewards</h3>
                <span style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: '800' }}>SILVER</span>
              </div>
              <h2 style={{ fontSize: '2rem', margin: '0.5rem 0' }}>450 pts</h2>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '60%' }}></div>
              </div>
              <p style={{ fontSize: '0.8rem' }}>50 points to Gold status</p>
            </div>
          </div>

          <h3 style={{ marginTop: '2.5rem' }}>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/payments" className="action-btn">
              <span className="action-icon">💳</span>
              <span style={{ fontWeight: '700' }}>Pay Rent</span>
            </Link>
            <Link to="/mess" className="action-btn">
              <span className="action-icon">🍱</span>
              <span style={{ fontWeight: '700' }}>Book Meal</span>
            </Link>
            <Link to="/complaints" className="action-btn">
              <span className="action-icon">🎫</span>
              <span style={{ fontWeight: '700' }}>Help Desk</span>
            </Link>
            <Link to="/rewards" className="action-btn">
              <span className="action-icon">🎁</span>
              <span style={{ fontWeight: '700' }}>Redeem</span>
            </Link>
          </div>
        </div>

        <aside className="activity-panel">
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Recent Activity</h3>
            <div className="activity-feed">
              {activities.map(act => (
                <div key={act.id} className="activity-item">
                  <div className="activity-dot" style={{ backgroundColor: act.color }}></div>
                  <div className="activity-content">
                    <h4>{act.title}</h4>
                    <p>{act.desc}</p>
                    <div className="activity-time">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn" style={{ width: '100%', marginTop: '1.5rem', background: 'var(--bg-tertiary)', fontSize: '0.8rem' }}>View All Activity</button>
          </div>

          <div className="card" style={{ marginTop: '1.5rem', background: 'var(--accent-primary)', color: 'white' }}>
            <h3 style={{ color: 'white' }}>Did you know?</h3>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}>Referring a friend gives you 200 loyalty points and a 5% discount on next month's rent!</p>
            <button className="btn" style={{ background: 'white', color: 'var(--accent-primary)', marginTop: '1rem', width: '100%', border: 'none' }}>Invite Now</button>
          </div>
        </aside>
>>>>>>> day1
      </div>
    </div>
  );
}

export default Dashboard;

