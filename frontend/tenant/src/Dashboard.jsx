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

          <h3 style={{ marginTop: '2.5rem' }}>Live Hostel Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
            <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>💧</span>
              <h4 style={{ margin: '0.5rem 0 0.2rem' }}>Water</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-success)', fontWeight: 'bold' }}>Available</span>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
              <h4 style={{ margin: '0.5rem 0 0.2rem' }}>Power</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-warning)', fontWeight: 'bold' }}>Backup</span>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>📶</span>
              <h4 style={{ margin: '0.5rem 0 0.2rem' }}>WiFi</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-success)', fontWeight: 'bold' }}>Working (50Mbps)</span>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>🧹</span>
              <h4 style={{ margin: '0.5rem 0 0.2rem' }}>Washroom</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-error)', fontWeight: 'bold' }}>Needs Cleaning</span>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>🍲</span>
              <h4 style={{ margin: '0.5rem 0 0.2rem' }}>Food Rating</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>4.2/5 (Live)</span>
            </div>
            <div className="card" style={{ padding: '1rem', textAlign: 'center' }}>
              <span style={{ fontSize: '1.5rem' }}>🔊</span>
              <h4 style={{ margin: '0.5rem 0 0.2rem' }}>Noise Level</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-success)', fontWeight: 'bold' }}>Low</span>
            </div>
          </div>

          {/* Role Specific Features */}
          <h3 style={{ marginTop: '2.5rem' }}>{user.occupation === 'Student' ? '🎓 Student Perks' : '💼 Employee Perks'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
            {user.occupation === 'Student' ? (
              <>
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '2rem' }}>🤫</div>
                  <div>
                    <h4 style={{ margin: 0 }}>Exam Mode</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Activate quiet hours for your floor.</p>
                  </div>
                  <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Activate</button>
                </div>
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '2rem' }}>👨‍👩‍👧</div>
                  <div>
                    <h4 style={{ margin: 0 }}>Parent Pay</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Send payment link to parents.</p>
                  </div>
                  <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Send</button>
                </div>
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '2rem' }}>📍</div>
                  <div>
                    <h4 style={{ margin: 0 }}>Hostel Attendance</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Mark your daily presence.</p>
                  </div>
                  <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Check-in</button>
                </div>
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '2rem' }}>🕒</div>
                  <div>
                    <h4 style={{ margin: 0 }}>Curfew Request</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Request late entry permission.</p>
                  </div>
                  <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Request</button>
                </div>
              </>
            ) : (
              <>
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '2rem' }}>🌙</div>
                  <div>
                    <h4 style={{ margin: 0 }}>Night Shift Access</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Manage auto-entry for late shifts.</p>
                  </div>
                  <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Setup</button>
                </div>
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '2rem' }}>📄</div>
                  <div>
                    <h4 style={{ margin: 0 }}>GST Invoices</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Download tax invoices for office claims.</p>
                  </div>
                  <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View</button>
                </div>
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '2rem' }}>🏢</div>
                  <div>
                    <h4 style={{ margin: 0 }}>Corporate Booking</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Manage bulk bookings for teams.</p>
                  </div>
                  <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Manage</button>
                </div>
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ fontSize: '2rem' }}>⏰</div>
                  <div>
                    <h4 style={{ margin: 0 }}>Flexible Entry</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Request 24/7 access during projects.</p>
                  </div>
                  <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Activate</button>
                </div>
              </>
            )}
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
      </div>
    </div>
  );
}

export default Dashboard;

