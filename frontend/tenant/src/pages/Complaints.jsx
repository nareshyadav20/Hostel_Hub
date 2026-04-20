import React, { useState } from 'react';

const Complaints = () => {
  const [complaints, setComplaints] = useState([
    { id: 1, issue: 'WiFi not working', status: 'Pending', date: '20 Apr 2026' },
    { id: 2, issue: 'Bathroom cleaning', status: 'Resolved', date: '15 Apr 2026' },
  ]);

  const handleRaiseComplaint = () => alert('Opening Complaint Form...');

  return (
    <div className="complaints-page">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>🛠️ My Complaints</h1>
          <p>Track your issues and raise new requests.</p>
        </div>
        <button onClick={handleRaiseComplaint} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontWeight: '800' }}>
          ➕ Raise Complaint
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {complaints.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.3rem' }}>{item.issue}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reported on {item.date}</p>
            </div>
            <span style={{ 
              padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800',
              background: item.status === 'Resolved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
              color: item.status === 'Resolved' ? 'var(--accent-success)' : 'var(--accent-warning)'
            }}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Complaints;
