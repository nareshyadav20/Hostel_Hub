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

  return (
    <div className="complaints-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>⚠️ Resident Complaints</h1>
        <p>Manage and resolve issues reported by tenants.</p>
      </header>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {complaints.map(item => (
          <div key={item.id} className="card" style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderLeft: `4px solid ${item.status === 'Solved' ? 'var(--accent-success)' : (item.priority === 'High' ? 'var(--accent-error)' : 'var(--accent-warning)')}`
          }}>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'var(--bg-tertiary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.2rem'
              }}>
                {item.priority === 'High' ? '🔴' : (item.priority === 'Medium' ? '🟡' : '🟢')}
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Reported by <strong>{item.tenant}</strong> (Room {item.room}) • {item.date}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ 
                fontSize: '0.8rem', 
                fontWeight: '700', 
                padding: '0.3rem 0.8rem', 
                borderRadius: '20px',
                background: item.status === 'Solved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: item.status === 'Solved' ? 'var(--accent-success)' : 'var(--accent-warning)'
              }}>
                {item.status}
              </span>
              
              {item.status !== 'Solved' && (
                <button 
                  onClick={() => handleSolve(item.id)}
                  title="Mark as Solved"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'var(--accent-success)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition-fast)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Complaints;
