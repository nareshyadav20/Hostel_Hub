import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Complaints = () => {
  const [complaints, setComplaints] = useState([
    { id: 1, issue: 'WiFi not working', status: 'Pending', date: '20 Apr 2026' },
    { id: 2, issue: 'Bathroom cleaning', status: 'Resolved', date: '15 Apr 2026' },
  ]);

  const handleRaiseComplaint = () => alert('Opening Complaint Form...');

  return (
    <div className="complaints-page fade-in dashboard-container" style={{ position: 'relative' }}>
      <Link to="/dashboard" style={{
        position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-secondary)',
        width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-md)', transition: 'all 0.3s ease', zIndex: 10
      }} className="hover-scale">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </Link>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Service Requests
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your maintenance tickets and raise new service requests.</p>
        </div>
        <button onClick={handleRaiseComplaint} className="btn btn-primary" style={{ padding: '1rem 2rem', fontWeight: '800', borderRadius: '12px', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)' }}>
          Raise New Ticket
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {complaints.map(item => (
          <div key={item.id} className="glass-card complaint-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', transition: 'all 0.3s ease', borderLeft: item.status === 'Resolved' ? '4px solid var(--accent-success)' : '4px solid var(--accent-warning)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: item.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', borderRadius: '16px', color: item.status === 'Resolved' ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.3rem' }}>{item.issue}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ticket ID: #{item.id}0248</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    {item.date}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ 
                padding: '0.5rem 1.2rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800',
                background: item.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: item.status === 'Resolved' ? 'var(--accent-success)' : 'var(--accent-warning)',
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div>
                {item.status}
              </span>
              <button className="btn" style={{ padding: '0.5rem', color: 'var(--text-muted)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .complaint-item:hover { transform: translateX(8px); box-shadow: var(--shadow-lg); border-color: var(--accent-primary) !important; }
      `}</style>
    </div>
  );
};

export default Complaints;
