import React, { useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{"name": "Tenant"}'));
  const [tenantData, setTenantData] = useState(null);
  const [hostelStats, setHostelStats] = useState(null);
  const [examMode, setExamMode] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [curfewRequested, setCurfewRequested] = useState(false);
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          API.get('/tenants/me'),
          API.get('/dashboard/alerts')
        ]);
        setTenantData(profileRes.data);
        setHostelStats(statsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  /* ── Live Status items ── */
  const statusItems = [
    {
      label: 'Water', status: 'Available', type: 'success',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>,
      bg: 'rgba(59,130,246,0.1)', color: 'var(--accent-primary)'
    },
    {
      label: 'Power', status: 'Backup', type: 'warning',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
      bg: 'rgba(245,158,11,0.1)', color: 'var(--accent-warning)'
    },
    {
      label: 'WiFi', status: '50Mbps', type: 'success',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>,
      bg: 'rgba(34,197,94,0.1)', color: 'var(--accent-success)'
    },
    {
      label: 'Washroom', status: 'Needs Clean', type: 'error',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>,
      bg: 'rgba(244,63,94,0.1)', color: 'var(--accent-error)'
    },
    {
      label: 'Food Rating', status: '4.2/5 (Live)', type: 'primary',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
      bg: 'rgba(168,85,247,0.1)', color: 'var(--accent-secondary)'
    },
    {
      label: 'Noise Level', status: 'Low', type: 'success',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>,
      bg: 'rgba(34,197,94,0.1)', color: 'var(--accent-success)'
    },
  ];

  /* ── Student Perks ── */
  const studentPerks = [
    {
      label: 'Exam Mode', desc: 'Activate quiet hours for your floor.', action: 'Activate',
      color: 'var(--accent-secondary)', bg: 'rgba(168,85,247,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5" /></svg>,
    },
    {
      label: 'Parent Pay', desc: 'Send payment link to parents.', action: 'Send Link',
      color: 'var(--accent-primary)', bg: 'rgba(56,189,248,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M7 15h0M2 9.5h20" /></svg>,
    },
    {
      label: 'Attendance', desc: 'Mark your daily presence.', action: 'Check-in',
      color: 'var(--accent-success)', bg: 'rgba(34,197,94,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
    },
    {
      label: 'Curfew', desc: 'Request late entry permission.', action: 'Request',
      color: 'var(--accent-warning)', bg: 'rgba(245,158,11,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    },
  ];

  /* ── Professional Perks ── */
  const professionalPerks = [
    {
      label: 'Night Shift', desc: 'Manage auto-entry for late shifts.', action: 'Setup',
      color: 'var(--accent-secondary)', bg: 'rgba(168,85,247,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>,
    },
    {
      label: 'GST Invoices', desc: 'Download tax invoices for office claims.', action: 'View',
      color: 'var(--accent-primary)', bg: 'rgba(56,189,248,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    },
    {
      label: 'Corporate', desc: 'Manage bulk bookings for teams.', action: 'Manage',
      color: 'var(--accent-success)', bg: 'rgba(34,197,94,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" /><line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" /><line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" /><line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" /></svg>,
    },
    {
      label: 'Flex Entry', desc: 'Request 24/7 access during projects.', action: 'Activate',
      color: 'var(--accent-warning)', bg: 'rgba(245,158,11,0.1)',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    },
  ];

  /* ── Quick Actions ── */
  const quickActions = [
    {
      to: '/payments', label: 'Pay Rent', color: 'var(--accent-primary)', bg: 'rgba(56,189,248,0.1)',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>,
    },
    {
      to: '/mess', label: 'Book Meal', color: 'var(--accent-secondary)', bg: 'rgba(168,85,247,0.1)',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    },
    {
      to: '/complaints', label: 'Help Desk', color: 'var(--accent-error)', bg: 'rgba(244,63,94,0.1)',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    },
    {
      to: '/rewards', label: 'Redeem', color: 'var(--accent-warning)', bg: 'rgba(245,158,11,0.1)',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 5 22 5 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>,
    },
  ];

  const notices = [
    { id: 1, icon: '📢', title: 'Elevator B Repair', desc: 'Under repair tomorrow 10AM–12PM.', time: 'Tomorrow' },
    { id: 2, icon: '🎉', title: 'Movie Night', desc: 'This Saturday at the common lounge!', time: 'Saturday' },
  ];

  const activities = [
    { id: 1, title: 'Rent Paid', desc: 'Successfully paid rent for March.', time: '2 days ago', color: 'var(--accent-success)' },
    { id: 2, title: 'New Menu', desc: 'Summer special menu added to Mess.', time: '4 days ago', color: 'var(--accent-primary)' },
    { id: 3, title: 'Support Ticket', desc: 'WiFi issue resolved in Room B-402.', time: '1 week ago', color: 'var(--accent-warning)' },
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
    const message = encodeURIComponent("Hey! Join me at Hostel Hub. It's the best digital hostel experience. Use my link to get 100 points: https://hostelhub.com/refer/uma2026");
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  if (loading) return <div className="dashboard-container"><div className="loading-spinner">Loading Portal...</div></div>;

  return (
    <div className="staynest-dashboard">
      
      {/* ── 1. Welcome Hero Banner ── */}
      <section className="staynest-hero">
        <div className="hero-content">
          <h1 className="hero-title">Good Afternoon, Uma! 👋</h1>
          <p className="hero-subtitle">Welcome back to your home away from home.</p>
          
          <div className="hero-stats">
            <div className="h-stat"><span className="h-icon">🏠</span> <div><strong>Block A</strong><br/><span>Building</span></div></div>
            <div className="h-stat"><span className="h-icon">🚪</span> <div><strong>203</strong><br/><span>Room No.</span></div></div>
            <div className="h-stat"><span className="h-icon">👥</span> <div><strong>2 Sharing</strong><br/><span>Room Type</span></div></div>
            <div className="h-stat"><span className="h-icon">📅</span> <div><strong>12 Mar 2024</strong><br/><span>Joined On</span></div></div>
          </div>
        </div>
        <div className="hero-decoration">
           {/* Placeholder for the green sofa image if asset is missing */}
           <div className="sofa-placeholder"></div>
        </div>
      </section>

      {/* ── 2. Top Action Cards ── */}
      <div className="top-action-row">
         <div className="action-card"><div className="a-icon green">💰</div><div className="a-text"><strong>Pay Rent</strong><span>Make a payment</span></div></div>
         <div className="action-card"><div className="a-icon orange">🔔</div><div className="a-text"><strong>Raise Complaint</strong><span>Report an issue</span></div></div>
         <div className="action-card"><div className="a-icon purple">🍽️</div><div className="a-text"><strong>Book Meal</strong><span>Pre-book your meal</span></div></div>
         <div className="action-card"><div className="a-icon blue">🧹</div><div className="a-text"><strong>Request Cleaning</strong><span>Room cleaning</span></div></div>
      </div>

      {/* ── 3. Today's Summary ── */}
      <section className="today-summary">
         <h3 className="section-label">Today's Summary</h3>
         <div className="summary-cards">
            <div className="s-card rent"><div className="s-header">Rent Due</div><div className="s-value">₹5,000</div><div className="s-sub">Due in 3 days</div><div className="s-icon-box">📗</div></div>
            <div className="s-card notices"><div className="s-header">Notices</div><div className="s-value">2</div><div className="s-sub">New updates</div><div className="s-icon-box">📙</div></div>
            <div className="s-card complaints"><div className="s-header">Complaints</div><div className="s-value">1</div><div className="s-sub">In Progress</div><div className="s-icon-box">📘</div></div>
            <div className="s-card mess"><div className="s-header">Mess</div><div className="s-value">Lunch</div><div className="s-sub">12:30 PM - 2:00 PM</div><div className="s-icon-box">🍽️</div></div>
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
                  <span className="sn-label">60% Paid</span>
               </div>
               <button className="sn-btn-outline">View Payment History</button>
            </div>

            <div className="sn-card">
               <div className="sn-header-row">
                  <h4 className="sn-card-title">My Complaints</h4>
                  <span className="sn-link">View All</span>
               </div>
               <div className="sn-complaint-box">
                  <div className="sn-header-row"><strong>Plumbing issue in bathroom</strong> <span className="sn-badge-blue">In Progress</span></div>
                  <p>Raised on 18 May, 10:30 AM</p>
                  <p>Last updated 2 hours ago</p>
               </div>
               <button className="sn-btn-outline">Raise New Complaint</button>
            </div>
         </div>

         {/* Middle Column */}
         <div className="sn-col">
            <div className="sn-card">
               <h4 className="sn-card-title">Room & Facilities</h4>
               <div className="sn-facility-list">
                  <div className="sn-f-row"><span className="sn-f-left">📶 WiFi</span> <span className="sn-f-mid">50 Mbps</span> <span className="sn-badge-green">Good</span></div>
                  <div className="sn-f-row"><span className="sn-f-left">⚡ Power Backup</span> <span className="sn-f-mid">Available</span> <span className="sn-badge-green">Good</span></div>
                  <div className="sn-f-row"><span className="sn-f-left">💧 Water Supply</span> <span className="sn-f-mid">Available</span> <span className="sn-badge-green">Good</span></div>
                  <div className="sn-f-row"><span className="sn-f-left">🧹 Room Cleaning</span> <span className="sn-f-mid">Pending</span> <span className="sn-link-orange">Request</span></div>
                  <div className="sn-f-row"><span className="sn-f-left">🧼 Washroom</span> <span className="sn-f-mid">Needs Clean</span> <span className="sn-link-red">Report</span></div>
               </div>
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
                <div className="card perk-card" style={{ background: 'transparent', border: '1px solid var(--border-color)' }}>
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

            <div className="sn-card">
               <div className="sn-header-row">
                  <h4 className="sn-card-title">Recent Activity</h4>
                  <span className="sn-link">View All</span>
               </div>
               <div className="sn-activity-list">
                  <div className="sn-act-row"><span className="sn-act-dot green"></span> <div><strong>Rent Paid</strong><br/><span>May rent paid successfully</span><br/><small>2 days ago</small></div></div>
                  <div className="sn-act-row"><span className="sn-act-dot blue"></span> <div><strong>Complaint Updated</strong><br/><span>Your complaint has been updated</span><br/><small>2 hours ago</small></div></div>
                  <div className="sn-act-row"><span className="sn-act-dot purple"></span> <div><strong>New Notice</strong><br/><span>New notice posted</span><br/><small>Yesterday</small></div></div>
               </div>
               <button className="sn-btn-outline">View All Activity</button>
            </div>

            <div className="sn-card loyalty-card-sn">
               <div className="sn-header-row">
                  <h4 className="sn-card-title">Loyalty Rewards</h4>
                  <span className="trophy">🏆</span>
               </div>
               <div className="loyalty-val"><strong>450</strong> pts</div>
               <div className="sn-progress-bg-p"><div className="sn-progress-fill-p" style={{ width: '70%' }}></div></div>
               <p className="loyalty-sub">50 points to Gold Status</p>
               <button className="sn-btn-p-outline">View Rewards</button>
            </div>

            <div className="sn-card help-card-sn">
               <div className="help-flex">
                  <div>
                     <h4 className="sn-card-title">Need Help?</h4>
                     <p>Our support team is here to help you anytime.</p>
                     <button className="sn-btn-green-solid">Contact Support</button>
                  </div>
                  <div className="help-img">👩‍💻</div>
               </div>
            </div>
         </div>

      </div>

    </div>
  );
}

export default Dashboard;
