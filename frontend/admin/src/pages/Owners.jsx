import React, { useState } from 'react';

const Owners = () => {
  const [owners, setOwners] = useState([
    { id: 1, name: 'Rahul Sharma', contact: 'rahul@example.com', hostels: 4, plan: 'Enterprise', status: 'Active' },
    { id: 2, name: 'Priya Verma', contact: '+91 98765 43210', hostels: 2, plan: 'Standard', status: 'Active' },
    { id: 3, name: 'Amit Singh', contact: 'amit@example.com', hostels: 1, plan: 'Basic', status: 'Deactivated' },
  ]);

  const handleToggle = (id) => {
    setOwners(owners.map(o => o.id === id ? { ...o, status: o.status === 'Active' ? 'Deactivated' : 'Active' } : o));
  };

  return (
    <div className="owners-page">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>👤 Hostel Owners</h1>
          <p>Manage owner accounts and platform access.</p>
        </div>
        <button className="btn btn-primary">+ Add New Owner</button>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem' }}>Owner Name</th>
              <th style={{ padding: '1.2rem' }}>Contact</th>
              <th style={{ padding: '1.2rem' }}>Hostels</th>
              <th style={{ padding: '1.2rem' }}>Plan</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {owners.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.2rem', fontWeight: '700' }}>{o.name}</td>
                <td style={{ padding: '1.2rem' }}>{o.contact}</td>
                <td style={{ padding: '1.2rem' }}>{o.hostels} Hostels</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>{o.plan}</span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                    background: o.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: o.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)'
                  }}>
                    {o.status}
                  </span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <button 
                    onClick={() => handleToggle(o.id)}
                    className="btn" 
                    style={{ fontSize: '0.75rem', border: `1px solid ${o.status === 'Active' ? 'var(--accent-error)' : 'var(--accent-success)'}`, color: o.status === 'Active' ? 'var(--accent-error)' : 'var(--accent-success)' }}
                  >
                    {o.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Owners;
