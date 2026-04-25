import React from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Tenant", "occupation": "Student"}');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  /* ── Live Status items ── */
  const statusItems = [
    {
      label: 'Water', status: 'Available', type: 'success',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>,
      bg: 'rgba(59,130,246,0.1)', color: 'var(--accent-primary)'
    },
    {
      label: 'Power', status: 'Backup', type: 'warning',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
      bg: 'rgba(245,158,11,0.1)', color: 'var(--accent-warning)'
    },
    {
      label: 'WiFi', status: '50Mbps', type: 'success',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
      bg: 'rgba(34,197,94,0.1)', color: 'var(--accent-success)'
    },
    {
      label: 'Washroom', status: 'Needs Clean', type: 'error',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
      bg: 'rgba(244,63,94,0.1)', color: 'var(--accent-error)'
    },
    {
      label: 'Food Rating', status: '4.2/5 (Live)', type: 'primary',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      bg: 'rgba(168,85,247,0.1)', color: 'var(--accent-secondary)'
    },
    {
      label: 'Noise Level', status: 'Low', type: 'success',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>,
      bg: 'rgba(34,197,94,0.1)', color: 'var(--accent-success)'
    },
  ];

  /* ── Student Perks ── */
  const studentPerks = [
    {
      label: 'Exam Mode', desc: 'Activate quiet hours for your floor.', action: 'Activate',
      color: 'var(--accent-secondary)', bg: 'rgba(168,85,247,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>,
    },
    {
      label: 'Parent Pay', desc: 'Send payment link to parents.', action: 'Send Link',
      color: 'var(--accent-primary)', bg: 'rgba(56,189,248,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M7 15h0M2 9.5h20"/></svg>,
    },
    {
      label: 'Attendance', desc: 'Mark your daily presence.', action: 'Check-in',
      color: 'var(--accent-success)', bg: 'rgba(34,197,94,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    },
    {
      label: 'Curfew', desc: 'Request late entry permission.', action: 'Request',
      color: 'var(--accent-warning)', bg: 'rgba(245,158,11,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    },
  ];

  /* ── Professional Perks ── */
  const professionalPerks = [
    {
      label: 'Night Shift', desc: 'Manage auto-entry for late shifts.', action: 'Setup',
      color: 'var(--accent-secondary)', bg: 'rgba(168,85,247,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    },
    {
      label: 'GST Invoices', desc: 'Download tax invoices for office claims.', action: 'View',
      color: 'var(--accent-primary)', bg: 'rgba(56,189,248,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    },
    {
      label: 'Corporate', desc: 'Manage bulk bookings for teams.', action: 'Manage',
      color: 'var(--accent-success)', bg: 'rgba(34,197,94,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
    },
    {
      label: 'Flex Entry', desc: 'Request 24/7 access during projects.', action: 'Activate',
      color: 'var(--accent-warning)', bg: 'rgba(245,158,11,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    },
  ];

  /* ── Quick Actions ── */
  const quickActions = [
    {
      to: '/payments', label: 'Pay Rent', color: 'var(--accent-primary)', bg: 'rgba(56,189,248,0.1)',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    },
    {
      to: '/mess', label: 'Book Meal', color: 'var(--accent-secondary)', bg: 'rgba(168,85,247,0.1)',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
    },
    {
      to: '/complaints', label: 'Help Desk', color: 'var(--accent-error)', bg: 'rgba(244,63,94,0.1)',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    },
    {
      to: '/rewards', label: 'Redeem', color: 'var(--accent-warning)', bg: 'rgba(245,158,11,0.1)',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 5 22 5 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    },
  ];

  const perks = user.occupation === 'Student' ? studentPerks : professionalPerks;
  const perksTitle = user.occupation === 'Student' ? 'Student Perks' : 'Employee Perks';

  /* ── Section heading helper ── */
  const SectionHeading = ({ icon, label }) => (
    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
      {icon} {label}
    </h3>
  );

  return (
    <div className="dashboard-container">

      {/* ── Welcome Banner ── */}
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

      {/* ── Stat Cards Row ── */}
      <div className="stats-cards-grid">
        <div className="card stat-card">
          <div className="card-header">
            <h3>Rent Cycle</h3>
            <span className="badge badge-error">5 DAYS LEFT</span>
          </div>
          <div className="stat-value">₹6,500</div>
          <div className="progress-bar"><div className="progress-fill error" style={{ width: '85%' }}></div></div>
          <p className="stat-desc">Next payment due on 30th April</p>
        </div>
        <div className="card stat-card">
          <div className="card-header">
            <h3>Loyalty Rewards</h3>
            <span className="badge badge-primary">SILVER</span>
          </div>
          <div className="stat-value">450 pts</div>
          <div className="progress-bar"><div className="progress-fill primary" style={{ width: '60%' }}></div></div>
          <p className="stat-desc">50 points to Gold status</p>
        </div>
      </div>

      {/* ── Live Hostel Status ── */}
      <SectionHeading
        label="Live Hostel Status"
        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
        {statusItems.map((item, i) => (
          <div key={i} className="card glass-card fade-in"
            style={{ padding: '1.2rem', textAlign: 'center', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', transition: 'all 0.3s' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color }}>
              {item.icon}
            </div>
            <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{item.label}</h4>
            <span style={{
              fontSize: '0.8rem', fontWeight: '800', padding: '0.3rem 0.8rem', borderRadius: '12px',
              background: item.bg, color: item.color,
            }}>{item.status}</span>
          </div>
        ))}
      </div>

      {/* ── Role Perks ── */}
      <SectionHeading
        label={perksTitle}
        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginBottom: '2.5rem' }}>
        {perks.map((perk, i) => (
          <div key={i} className="card glass-card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: perk.bg, color: perk.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {perk.icon}
              </div>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700' }}>{perk.label}</h4>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, flex: 1 }}>{perk.desc}</p>
            <button className="btn btn-secondary btn-sm" style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', fontWeight: '700', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              {perk.action}
            </button>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <SectionHeading
        label="Quick Actions"
        icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {quickActions.map((action, i) => (
          <Link key={i} to={action.to} className="action-btn glass-card fade-in"
            style={{ textDecoration: 'none', padding: '1.2rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem', transition: 'transform 0.3s, box-shadow 0.3s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: action.bg, color: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {action.icon}
            </div>
            <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{action.label}</span>
          </Link>
        ))}
      </div>

      {/* ── Notice Board ── */}
      <div className="card glass-card" style={{ padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-warning)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Notice Board
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.03)', padding: '0.6rem 0.9rem', borderRadius: '10px', borderLeft: '3px solid var(--accent-warning)' }}>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>📢 Elevator B under repair tomorrow 10AM–12PM.</p>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.03)', padding: '0.6rem 0.9rem', borderRadius: '10px', borderLeft: '3px solid var(--accent-primary)' }}>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>🎉 Movie night this Saturday at the common lounge!</p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
