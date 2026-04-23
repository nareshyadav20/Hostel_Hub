import React from 'react';
import './App.css';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Guest"}');

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
      {/* Aesthetic Background Elements */}
      <div className="dashboard-bg-blob"></div>
      <div className="dashboard-bg-blob-2"></div>

      <div className="welcome-section">
        <div className="welcome-text" style={{ background: 'var(--glass-bg)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
          <div className="welcome-header">
            <div className="welcome-icon" style={{ background: 'rgba(0,0,0,0.05)', color: 'var(--text-primary)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15C8.13401 15 5 18.134 5 22H19C19 18.134 15.866 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1>Welcome back, {user.name}</h1>
          </div>
          <p>Your stay is our priority. Here's what's happening today.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ gap: '0.8rem' }}>
        {/* Tiny Stats Cards */}
        {stats.map((stat, index) => (
          <div className="stat-card" key={index} style={{
            "--delay": `${index * 0.1}s`,
            padding: '1rem',
            borderRadius: '12px'
          }}>
            <div className="stat-card-inner">
              <div className="stat-header" style={{ marginBottom: '0.5rem' }}>
                <div className="stat-icon" style={{ 
                  width: '32px', height: '32px',
                  color: stat.color, 
                  background: `${stat.color}11`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{ transform: 'scale(0.7)' }}>{stat.icon}</div>
                </div>
                <div className="stat-title-group">
                  <span className="stat-title" style={{ fontSize: '0.75rem', fontWeight: '700' }}>{stat.title}</span>
                </div>
              </div>
              <div className="stat-content">
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: stat.color, margin: '0.2rem 0' }}>{stat.value}</h2>
                <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>{stat.subtext}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compact Live Status */}
      <div style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.8rem' }}>Live Status</h2>
        <div className="live-status-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.8rem' }}>
          {[
            { label: 'Water', status: 'OK', color: '#3b82f6', icon: '💧' },
            { label: 'Power', status: 'OK', color: '#10b981', icon: '⚡' },
            { label: 'WiFi', status: 'OK', color: '#8b5cf6', icon: '📶' },
            { label: 'Clean', status: 'OK', color: '#10b981', icon: '🧹' },
            { label: 'Noise', status: 'OK', color: '#10b981', icon: '🔇' },
          ].map((item, i) => (
            <div key={i} className="card" style={{ 
              padding: '0.8rem', 
              borderRadius: '12px',
              textAlign: 'center',
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)'
            }}>
              <span style={{ fontSize: '1.5rem', marginBottom: '0.3rem', display: 'block' }}>{item.icon}</span>
              <h3 style={{ fontSize: '0.8rem', fontWeight: '800', margin: 0 }}>{item.label}</h3>
              <span style={{ color: item.color, fontSize: '0.7rem', fontWeight: '900' }}>{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Compact Notice & Feedback */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
        <div className="card" style={{ padding: '1.2rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Feedback</h3>
          <div className="rating-group" style={{ marginBottom: '1rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className={`star-icon ${star <= 4 ? 'active' : ''}`} viewBox="0 0 24 24" style={{ width: '16px', height: '16px' }}>
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <button className="btn btn-primary" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '800' }}>
            Submit
          </button>
        </div>

        <div className="card" style={{ 
          background: 'var(--glass-bg)', 
          color: 'var(--text-primary)',
          padding: '1.2rem',
          borderRadius: '16px',
          border: '1px solid var(--glass-border)'
        }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.8rem' }}>Notice</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '0.5rem 0.8rem', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-primary)' }}>📢 Elevator B repair tomorrow 10am.</p>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '0.5rem 0.8rem', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-primary)' }}>🎉 Movie night this Saturday!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
