import React, { useState } from 'react';

function Dashboard() {
  const staff = JSON.parse(localStorage.getItem('user') || '{"name": "Staff Member", "email": "staff@staynest.com"}');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const [isGenerating, setIsGenerating] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportSuccess(true);
      setTimeout(() => setReportSuccess(false), 3000);
    }, 1500);
  };

  const handleDownloadPDF = () => {
    alert('PDF Generation started... Your report will be ready in a moment.');
  };

  const stats = [
    { 
      label: 'Mess Attendance', 
      value: '142 / 150', 
      sub: 'Breakfast Marked', 
      color: '#6366f1', 
      bg: 'rgba(99, 102, 241, 0.1)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
          <line x1="6" y1="1" x2="6" y2="4"></line>
          <line x1="14" y1="1" x2="14" y2="4"></line>
        </svg>
      )
    },
    { 
      label: 'Cleaning Tasks', 
      value: '12 / 20', 
      sub: '8 Remaining', 
      color: '#10b981', 
      bg: 'rgba(16, 185, 129, 0.1)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      )
    },
    { 
      label: 'Open Complaints', 
      value: '3', 
      sub: '2 High Priority', 
      color: '#ef4444', 
      bg: 'rgba(239, 68, 68, 0.1)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      )
    },
    { 
      label: 'Inventory Status', 
      value: '2', 
      sub: 'Low Stock', 
      color: '#f59e0b', 
      bg: 'rgba(245, 158, 11, 0.1)',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
          <polyline points="3.29 7 12 12 20.71 7"></polyline>
        </svg>
      )
    },
  ];

  return (
    <div className="dashboard-view animate-fade-in">
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>👋 Welcome Back, {staff.name.split(' ')[0]}</h1>
          <p style={{ fontWeight: '600', fontSize: '1rem', color: 'var(--text-secondary)' }}>{today}</p>
        </div>
        <button 
          onClick={handleGenerateReport}
          className="btn btn-primary" 
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ marginRight: '8px' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
              </svg>
              Generating...
            </>
          ) : reportSuccess ? '✅ Reported Successfully' : 'Generate Daily Report'}
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '2rem' }}>
            <div className="icon-box" style={{ background: stat.bg, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.2rem', color: 'var(--text-primary)' }}>{stat.value}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: stat.color }}></span>
                <p style={{ fontSize: '0.9rem', color: stat.color, fontWeight: '700' }}>{stat.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem' }}>
        <div className="glass-card" style={{ 
          textAlign: 'center',
          padding: '4rem 2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', 
            background: 'var(--grad-primary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(50px)' 
          }}></div>
          
          <div className="icon-box" style={{ 
             margin: '0 auto 1.5rem', background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1',
             width: '64px', height: '64px', borderRadius: '20px'
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.8rem' }}>Daily Progress Summary</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Operational data for today is fully synchronized. Your final report is ready for generation and review.
          </p>
          <button 
            onClick={handleDownloadPDF}
            className="btn btn-primary" 
            style={{ padding: '1rem 3rem', fontSize: '1rem' }}
          >
            Download Report PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

