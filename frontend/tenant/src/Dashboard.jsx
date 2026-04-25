import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Tenant"}');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const activities = [
    { id: 1, type: 'payment', title: 'Rent Paid Successfully', desc: 'April 2026 rent payment confirmed', time: '2 hours ago', color: 'var(--accent-success)' },
    { id: 2, type: 'complaint', title: 'WiFi Maintenance', desc: 'Your ticket #442 has been resolved', time: 'Yesterday', color: 'var(--accent-primary)' },
    { id: 3, type: 'mess', title: 'Special Menu Update', desc: 'Biryani Special tonight at 8:00 PM', time: '12 Apr', color: 'var(--accent-warning)' },
  ];

  return (
    <div className="dashboard-container">
      <section className="welcome-section">
        <div className="welcome-text">
          <h1>{greeting}, {user.name}! 👋</h1>
          <p>Welcome back to your digital hostel home. Everything looks good for today.</p>
        </div>
        <div className="welcome-stats">
          <div className="mini-stat">
            <span className="mini-stat-label">Room</span>
            <span className="mini-stat-value">B-402</span>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-label">Floor</span>
            <span className="mini-stat-value">4th</span>
          </div>
        </div>
      </section>

      <div className="dashboard-grid">
        <div className="main-stats-section">
          <div className="stats-cards-grid">
            {/* Rent Card */}
            <div className="card stat-card rent-card">
              <div className="card-header">
                <h3>Rent Cycle</h3>
                <span className="badge badge-error">5 DAYS LEFT</span>
              </div>
              <div className="stat-value">₹6,500</div>
              <div className="progress-bar">
                <div className="progress-fill error" style={{ width: '85%' }}></div>
              </div>
              <p className="stat-desc">Next payment due on 26th April</p>
            </div>

            {/* Loyalty Card */}
            <div className="card stat-card loyalty-card">
              <div className="card-header">
                <h3>Loyalty Rewards</h3>
                <span className="badge badge-primary">SILVER</span>
              </div>
              <div className="stat-value">450 pts</div>
              <div className="progress-bar">
                <div className="progress-fill primary" style={{ width: '60%' }}></div>
              </div>
              <p className="stat-desc">50 points to Gold status</p>
            </div>
          </div>

          <h3 className="section-title" style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            Live Hostel Status
          </h3>
          <div className="status-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
            <div className="card status-card glass-card fade-in" style={{ padding: '1.2rem', textAlign: 'center', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', transition: 'all 0.3s' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>
              </div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Water</h4>
              <span className="status-tag success" style={{ fontSize: '0.8rem', fontWeight: '800', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-success)', padding: '0.3rem 0.8rem', borderRadius: '12px' }}>Available</span>
            </div>
            
            <div className="card status-card glass-card fade-in" style={{ padding: '1.2rem', textAlign: 'center', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', transition: 'all 0.3s' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-warning)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
              </div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Power</h4>
              <span className="status-tag warning" style={{ fontSize: '0.8rem', fontWeight: '800', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)', padding: '0.3rem 0.8rem', borderRadius: '12px' }}>Backup</span>
            </div>

            <div className="card status-card glass-card fade-in" style={{ padding: '1.2rem', textAlign: 'center', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', transition: 'all 0.3s' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-success)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
              </div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>WiFi</h4>
              <span className="status-tag success" style={{ fontSize: '0.8rem', fontWeight: '800', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-success)', padding: '0.3rem 0.8rem', borderRadius: '12px' }}>50Mbps</span>
            </div>

            <div className="card status-card glass-card fade-in" style={{ padding: '1.2rem', textAlign: 'center', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', transition: 'all 0.3s' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-error)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
              </div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Washroom</h4>
              <span className="status-tag error" style={{ fontSize: '0.8rem', fontWeight: '800', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-error)', padding: '0.3rem 0.8rem', borderRadius: '12px' }}>Needs Clean</span>
            </div>

            <div className="card status-card glass-card fade-in" style={{ padding: '1.2rem', textAlign: 'center', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', transition: 'all 0.3s' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Food Rating</h4>
              <span className="status-tag primary" style={{ fontSize: '0.8rem', fontWeight: '800', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-secondary)', padding: '0.3rem 0.8rem', borderRadius: '12px' }}>4.2/5 (Live)</span>
            </div>

            <div className="card status-card glass-card fade-in" style={{ padding: '1.2rem', textAlign: 'center', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', transition: 'all 0.3s' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-success)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
              </div>
              <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Noise Level</h4>
              <span className="status-tag success" style={{ fontSize: '0.8rem', fontWeight: '800', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-success)', padding: '0.3rem 0.8rem', borderRadius: '12px' }}>Low</span>
            </div>
          </div>

          {/* Role Specific Features */}
          <h3 className="section-title" style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            {user.occupation === 'Student' ? 'Student Perks' : 'Employee Perks'}
          </h3>
          <div className="perks-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
            {user.occupation === 'Student' ? (
              <>
                <div className="card perk-card glass-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"></path></svg>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Exam Mode</h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>Activate quiet hours for your floor.</p>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', fontWeight: '700' }}>Activate</button>
                </div>
                <div className="card perk-card glass-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M7 15h0M2 9.5h20"></path></svg>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Parent Pay</h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>Send payment link to parents.</p>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', fontWeight: '700' }}>Send Link</button>
                </div>
                <div className="card perk-card glass-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Attendance</h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>Mark your daily presence.</p>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', fontWeight: '700' }}>Check-in</button>
                </div>
                <div className="card perk-card glass-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Curfew</h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>Request late entry permission.</p>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', fontWeight: '700' }}>Request</button>
                </div>
              </>
            ) : (
              <>
                <div className="card perk-card glass-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Night Shift</h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>Manage auto-entry for late shifts.</p>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', fontWeight: '700' }}>Setup</button>
                </div>
                <div className="card perk-card glass-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>GST Invoices</h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>Download tax invoices for office claims.</p>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', fontWeight: '700' }}>View</button>
                </div>
                <div className="card perk-card glass-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Corporate</h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>Manage bulk bookings for teams.</p>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', fontWeight: '700' }}>Manage</button>
                </div>
                <div className="card perk-card glass-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Flexible Entry</h4>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>Request 24/7 access during projects.</p>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', fontWeight: '700' }}>Activate</button>
                </div>
              </>
            )}
          </div>

          <h3 className="section-title" style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            Quick Actions
          </h3>
          <div className="quick-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
            <Link to="/payments" className="action-btn glass-card fade-in" style={{ textDecoration: 'none', padding: '1.2rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', transition: 'transform 0.3s' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
              </div>
              <span className="action-label" style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Pay Rent</span>
            </Link>
            <Link to="/mess" className="action-btn glass-card fade-in" style={{ textDecoration: 'none', padding: '1.2rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', transition: 'transform 0.3s' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <span className="action-label" style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Book Meal</span>
            </Link>
            <Link to="/complaints" className="action-btn glass-card fade-in" style={{ textDecoration: 'none', padding: '1.2rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', transition: 'transform 0.3s' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-error)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <span className="action-label" style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Help Desk</span>
            </Link>
            <Link to="/rewards" className="action-btn glass-card fade-in" style={{ textDecoration: 'none', padding: '1.2rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', transition: 'transform 0.3s' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 5 22 5 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></svg>
              </div>
              <span className="action-label" style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>Redeem</span>
            </Link>
          </div>
        </div>

        <aside className="activity-panel">
          <div className="card glass-card activity-card">
            <h3 className="card-title">Recent Activity</h3>
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
            <button className="btn btn-secondary btn-full">View All Activity</button>
          </div>

          <div className="card promo-card">
            <h3>Did you know?</h3>
            <p>Referring a friend gives you 200 loyalty points and a 5% discount on next month's rent!</p>
            <button className="btn btn-primary btn-full">Invite Now</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;

