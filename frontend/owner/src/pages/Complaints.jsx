import React, { useState } from 'react';

const Complaints = () => {
  const [complaints, setComplaints] = useState([
    { id: 1, room: '201', issue: 'Water Leakage', status: 'Pending' },
    { id: 2, room: '202', issue: 'AC Not Cooling', status: 'Pending' },
    { id: 3, room: '101', issue: 'WiFi Connection', status: 'Resolved' },
    { id: 4, room: '305', issue: 'Cleaning Required', status: 'Pending' },
  ]);

  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;

  const handleResolve = (id) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: 'Resolved' } : c));
  };

  return (
    <div className="complaints-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🛠️ Complaint Management</h1>
        <p>Track and resolve issues reported by tenants.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Complaints</p>
          <h2 style={{ fontSize: '2rem' }}>{totalComplaints}</h2>
        </div>
        <div className="card">
          <p style={{ color: 'var(--accent-error)', fontSize: '0.9rem' }}>Pending Resolution</p>
          <h2 style={{ fontSize: '2rem', color: 'var(--accent-error)' }}>{pendingCount}</h2>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem' }}>Room</th>
              <th style={{ padding: '1.2rem' }}>Issue</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.2rem', fontWeight: '700' }}>Room {c.room}</td>
                <td style={{ padding: '1.2rem' }}>{c.issue}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                    background: c.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: c.status === 'Resolved' ? 'var(--accent-success)' : 'var(--accent-warning)'
                  }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  {c.status === 'Pending' && (
                    <button 
                      onClick={() => handleResolve(c.id)}
                      className="btn btn-primary" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                    >
                      ➕ Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Complaints;
