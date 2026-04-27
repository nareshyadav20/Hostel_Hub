import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{"name": "Tenant", "occupation": "Student"}'));
  const [examMode, setExamMode] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [curfewRequested, setCurfewRequested] = useState(false);
  const [notification, setNotification] = useState(null);

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

  const notices = [
    { id: 1, icon: '📢', title: 'Elevator B Repair', desc: 'Under repair tomorrow 10AM–12PM.', time: 'Tomorrow' },
    { id: 2, icon: '🎉', title: 'Movie Night', desc: 'This Saturday at the common lounge!', time: 'Saturday' },
  ];

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleExamMode = () => {
    setExamMode(!examMode);
    showToast(examMode ? 'Exam Mode Deactivated' : 'Exam Mode Activated! Quiet hours enabled.');
  };

  const handleAttendance = () => {
    if (!attendanceMarked) {
      setAttendanceMarked(true);
      showToast('Attendance marked successfully for today!');
    }
  };

  const handleParentPay = () => {
    showToast('Payment link sent to registered parent email/phone.');
  };

  const handleCurfew = () => {
    if (!curfewRequested) {
      setCurfewRequested(true);
      showToast('Late entry request submitted to Warden.');
    }
  };

  const handleInvite = () => {
    showToast('Referral link copied to clipboard! Share it with your friends.');
    navigator.clipboard.writeText('https://livora.com/refer/uma2026');
  };

  return (
    <div className="dashboard-container">
      {notification && (
        <div className="toast-notification" style={{
          position: 'fixed', top: '20px', right: '20px', background: 'var(--accent-primary)', color: 'white',
          padding: '1rem 2rem', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', zIndex: 1000,
          animation: 'fadeInUp 0.3s ease'
        }}>
          {notification}
        </div>
      )}

      <section className="welcome-section fade-in-up">
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
            <div className="card stat-card rent-card fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="card-header">
                <h3>Rent Cycle</h3>
                <span className="badge badge-error">3 DAYS LEFT</span>
              </div>
              <div className="stat-value">₹6,500</div>
              <div className="progress-bar">
                <div className="progress-fill error" style={{ width: '90%' }}></div>
              </div>
              <p className="stat-desc">Next payment due on 30th April</p>
            </div>

            {/* Loyalty Card */}
            <div className="card stat-card loyalty-card fade-in-up" style={{ animationDelay: '0.2s' }}>
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

          <h3 className="section-title fade-in-up" style={{ animationDelay: '0.3s', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            Live Hostel Status
          </h3>
          <div className="status-grid fade-in-up" style={{ animationDelay: '0.4s' }}>
            {[
              { label: 'Water', value: 'Available', color: 'success', icon: <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path> },
              { label: 'Power', value: 'Backup', color: 'warning', icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon> },
              { label: 'WiFi', value: '50Mbps', color: 'success', icon: <><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></> },
              { label: 'Washroom', value: 'Needs Clean', color: 'error', icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path> },
              { label: 'Food Rating', value: '4.2/5 (Live)', color: 'secondary', icon: <path d="M12 2v20"></path>, altIcon: <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path> },
              { label: 'Noise Level', value: 'Low', color: 'success', icon: <><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></> },
            ].map((status, idx) => (
              <div key={idx} className="card status-card glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `var(--accent-${status.color === 'secondary' ? 'primary' : status.color}05)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: `var(--accent-${status.color === 'secondary' ? 'primary' : status.color})` }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{status.icon}{status.altIcon}</svg>
                </div>
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{status.label}</h4>
                <span className={`status-tag ${status.color}`} style={{ fontSize: '0.8rem', fontWeight: '800', padding: '0.3rem 0.8rem', borderRadius: '12px' }}>{status.value}</span>
              </div>
            ))}
          </div>

          {/* Role Specific Features */}
          <h3 className="section-title fade-in-up" style={{ animationDelay: '0.5s', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-secondary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            {user.occupation === 'Student' ? 'Student Perks' : 'Employee Perks'}
          </h3>
          <div className="perks-grid fade-in-up" style={{ animationDelay: '0.6s' }}>
            {user.occupation === 'Student' ? (
              <>
                <div className={`card perk-card glass-card ${examMode ? 'perk-active' : ''}`}>
                  <div className="perk-icon-wrapper" style={{ background: 'rgba(168, 85, 247, 0.1)', color: 'var(--accent-secondary)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"></path></svg>
                  </div>
                  <h4 style={{ margin: '0.5rem 0', fontWeight: '800' }}>Exam Mode</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Activate quiet hours for your floor.</p>
                  <button onClick={handleExamMode} className={`btn ${examMode ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }}>
                    {examMode ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
                <div className="card perk-card glass-card">
                  <div className="perk-icon-wrapper" style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M7 15h0M2 9.5h20"></path></svg>
                  </div>
                  <h4 style={{ margin: '0.5rem 0', fontWeight: '800' }}>Parent Pay</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Send payment link to parents.</p>
                  <button onClick={handleParentPay} className="btn btn-secondary" style={{ width: '100%' }}>Send Link</button>
                </div>
                <div className={`card perk-card glass-card ${attendanceMarked ? 'perk-active' : ''}`}>
                  <div className="perk-icon-wrapper" style={{ background: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-success)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <h4 style={{ margin: '0.5rem 0', fontWeight: '800' }}>Attendance</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Mark your daily presence.</p>
                  <button onClick={handleAttendance} className={`btn ${attendanceMarked ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }}>
                    {attendanceMarked ? 'Checked-in' : 'Check-in'}
                  </button>
                </div>
                <div className={`card perk-card glass-card ${curfewRequested ? 'perk-active' : ''}`}>
                  <div className="perk-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </div>
                  <h4 style={{ margin: '0.5rem 0', fontWeight: '800' }}>Curfew</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Request late entry permission.</p>
                  <button onClick={handleCurfew} className={`btn ${curfewRequested ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }}>
                    {curfewRequested ? 'Requested' : 'Request'}
                  </button>
                </div>
              </>
            ) : (
              <div className="card perk-card glass-card">
                {/* Similar structure for Employee Perks */}
                <p>Employee features coming soon...</p>
              </div>
            )}
          </div>

          <h3 className="section-title fade-in-up" style={{ animationDelay: '0.7s', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            Quick Actions
          </h3>
          <div className="quick-actions fade-in-up" style={{ animationDelay: '0.8s' }}>
            {[
              { to: '/payments', label: 'Pay Rent', color: 'primary', icon: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></> },
              { to: '/mess', label: 'Book Meal', color: 'secondary', icon: <><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></> },
              { to: '/complaints', label: 'Help Desk', color: 'error', icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path> },
              { to: '/rewards', label: 'Redeem', color: 'warning', icon: <><polyline points="20 12 20 22 5 22 5 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path></> },
            ].map((action, idx) => (
              <Link key={idx} to={action.to} className="action-btn glass-card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div className="action-icon" style={{ background: `var(--accent-${action.color === 'secondary' ? 'primary' : action.color}15)`, color: `var(--accent-${action.color === 'secondary' ? 'primary' : action.color})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{action.icon}</svg>
                </div>
                <span className="action-label" style={{ fontWeight: '800', fontSize: '0.9rem' }}>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="activity-panel">
          <div className="card glass-card info-merged-card fade-in-up" style={{ animationDelay: '0.4s', padding: '0' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', margin: 0 }}>
                <span style={{ fontSize: '1.5rem' }}>📢</span> Notice & Activity
              </h3>
            </div>

            <div className="merged-content-scroll" style={{ maxHeight: '600px', overflowY: 'auto', padding: '1.5rem' }}>
              <div className="notice-list" style={{ marginBottom: '2.5rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Latest Notices</p>
                {notices.map(notice => (
                  <div key={notice.id} className="notice-item" style={{ background: 'var(--bg-tertiary)', border: 'none', marginBottom: '0.8rem' }}>
                    <div className="notice-icon">{notice.icon}</div>
                    <div className="notice-content">
                      <h4>{notice.title}</h4>
                      <p>{notice.desc}</p>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700', marginTop: '0.4rem' }}>{notice.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="activity-feed">
                <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>Recent Activity</p>
                {activities.map(act => (
                  <div key={act.id} className="activity-item" style={{ paddingBottom: '1.5rem' }}>
                    <div className="activity-dot" style={{ backgroundColor: act.color }}></div>
                    <div className="activity-content">
                      <h4>{act.title}</h4>
                      <p>{act.desc}</p>
                      <div className="activity-time">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '1.2rem', borderTop: '1px solid var(--border-color)' }}>
              <button className="btn btn-secondary btn-full">View All Logs</button>
            </div>
          </div>

          <div className="card promo-card fade-in-up" style={{
            animationDelay: '0.8s',
            background: 'linear-gradient(135deg, var(--accent-primary) 0%, #4f46e5 100%)',
            border: 'none',
            boxShadow: '0 15px 35px rgba(14, 165, 233, 0.25)',
            color: 'white'
          }}>
            <h3 style={{ color: 'white', fontWeight: '950', letterSpacing: '-0.5px' }}>Did you know? 💡</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: '600', lineHeight: '1.5' }}>
              Referring a friend gives you <strong style={{ color: 'white' }}>200 loyalty points</strong> and a 5% discount on next month's rent!
            </p>
            <button onClick={handleInvite} className="btn" style={{
              background: 'white',
              color: 'var(--accent-primary)',
              border: 'none',
              fontWeight: '900',
              width: '100%',
              padding: '1rem',
              borderRadius: '14px',
              marginTop: '0.5rem',
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
            }}>Invite Now</button>
          </div>
        </aside>
      </div>

    </div>
  );
}

export default Dashboard;
