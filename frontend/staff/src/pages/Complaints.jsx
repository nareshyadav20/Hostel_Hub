import React, { useState } from 'react';

const Complaints = () => {
  const [complaints, setComplaints] = useState([
    { id: 1, title: 'Water Leakage', tenant: 'Rahul Sharma', room: '201-A', priority: 'High', status: 'Pending', date: '2h ago' },
    { id: 2, title: 'Fan Not Working', tenant: 'Priya Verma', room: '202-B', priority: 'Medium', status: 'Pending', date: '5h ago' },
    { id: 3, title: 'WiFi Connectivity', tenant: 'Amit Singh', room: '101-A', priority: 'Low', status: 'Solved', date: '1d ago' },
    { id: 4, title: 'Cleaning Required', tenant: 'Sneha Kapur', room: '305-C', priority: 'Medium', status: 'Pending', date: '30m ago' },
  ]);

  const handleSolve = (id) => {
    setComplaints(complaints.map(c => 
      c.id === id ? { ...c, status: 'Solved' } : c
    ));
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      default: return '#10b981';
    }
  };

  return (
    <div className="complaints-page animate-fade-in">
      <header style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <div className="icon-box" style={{ background: 'var(--grad-error)', color: '#fff', marginBottom: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div>
          <h1>Resident Complaints</h1>
          <p style={{ fontWeight: '600' }}>Manage and resolve issues reported by tenants.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gap: '1.2rem' }}>
        {complaints.map((item, index) => (
          <div key={item.id} className="card" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '1.5rem 2rem',
            borderLeft: `6px solid ${item.status === 'Solved' ? '#10b981' : getPriorityColor(item.priority)}`,
            animationDelay: `${index * 0.1}s`
          }}>
            <div style={{ display: 'flex', gap: '1.8rem', alignItems: 'center' }}>
              <div className="icon-box" style={{ 
                marginBottom: 0,
                background: `${getPriorityColor(item.priority)}15`, 
                color: getPriorityColor(item.priority),
                width: '56px',
                height: '56px',
                borderRadius: '16px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.3rem', color: 'var(--text-primary)' }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                  Reported by <strong style={{ color: 'var(--text-primary)' }}>{item.tenant}</strong> (Room {item.room}) • <span style={{ color: 'var(--accent-primary)' }}>{item.date}</span>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <span className={`table-badge ${item.status === 'Solved' ? 'success' : 'warning'}`} style={{ padding: '0.6rem 1.4rem' }}>
                {item.status}
              </span>
              
              {item.status !== 'Solved' ? (
                <button 
                  onClick={() => handleSolve(item.id)}
                  title="Mark as Solved"
                  className="btn-primary"
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
              ) : (
                <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '800' }}>
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Complaints;

