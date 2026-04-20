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
      color: 'var(--accent-primary)', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
      color: 'var(--accent-success)', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
      color: 'var(--accent-error)', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
      color: 'var(--accent-warning)', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
          <polyline points="3.29 7 12 12 20.71 7"></polyline>
        </svg>
      )
    },
  ];

  return (
    <div className="dashboard-view">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>👋 Hello, {staff.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{today}</p>
        </div>
        <button 
          onClick={handleGenerateReport}
          className="btn btn-primary" 
          disabled={isGenerating}
          style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', fontWeight: '700' }}
        >
          {isGenerating ? 'Generating...' : reportSuccess ? '✅ Reported' : 'Generate Daily Report'}
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ padding: '0.6rem', width: 'fit-content', borderRadius: '10px', background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>{stat.label}</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stat.value}</h2>
              <p style={{ fontSize: '0.75rem', color: stat.color, fontWeight: '600' }}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div className="card" style={{ 
          background: 'var(--bg-secondary)', 
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{ 
            width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-primary)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Daily Progress Summary</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Operational data for today is ready. Generate your final report for review.
          </p>
          <button 
            onClick={handleDownloadPDF}
            className="btn" 
            style={{ padding: '0.6rem 1.5rem', background: 'var(--accent-primary)', color: '#fff', fontSize: '0.9rem', fontWeight: '700' }}
          >
            Download Report PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
