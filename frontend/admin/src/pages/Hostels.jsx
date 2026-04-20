import React, { useState } from 'react';

const Hostels = () => {
  const [hostels, setHostels] = useState([
    { id: 1, name: 'Sunshine Residency', city: 'Mumbai', owner: 'Rahul Sharma', beds: 150, occupancy: 95, status: 'Active' },
    { id: 2, name: 'Elite Living', city: 'Bangalore', owner: 'Priya Verma', beds: 80, occupancy: 88, status: 'Active' },
    { id: 3, name: 'Green View', city: 'Pune', owner: 'Amit Singh', beds: 200, occupancy: 45, status: 'Inactive' },
  ]);

  const handleDisable = (id) => {
    setHostels(hostels.map(h => h.id === id ? { ...h, status: h.status === 'Active' ? 'Inactive' : 'Active' } : h));
  };

  return (
    <div className="hostels-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🏨 Global Hostel Directory</h1>
        <p>Manage all registered hostels across the platform.</p>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>Hostel Name</th>
              <th style={{ padding: '1rem' }}>City</th>
              <th style={{ padding: '1rem' }}>Owner</th>
              <th style={{ padding: '1rem' }}>Capacity</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {hostels.map(h => (
              <tr key={h.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: '700' }}>{h.name}</td>
                <td style={{ padding: '1rem' }}>{h.city}</td>
                <td style={{ padding: '1rem' }}>{h.owner}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.occupancy}% Occupied</div>
                  <div style={{ width: '100%', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', marginTop: '0.3rem' }}>
                    <div style={{ width: `${h.occupancy}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '2px' }}></div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                    background: h.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: h.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)'
                  }}>
                    {h.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn" style={{ fontSize: '0.75rem' }}>Details</button>
                    <button 
                      onClick={() => handleDisable(h.id)}
                      className="btn" 
                      style={{ fontSize: '0.75rem', border: `1px solid ${h.status === 'Active' ? 'var(--accent-error)' : 'var(--accent-success)'}`, color: h.status === 'Active' ? 'var(--accent-error)' : 'var(--accent-success)' }}
                    >
                      {h.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Hostels;
