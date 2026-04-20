import React, { useState } from 'react';

const Tenants = () => {
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Suresh Kumar', hostel: 'Sunshine Residency', room: '201-A', contact: '+91 98765 00010', status: 'Active' },
    { id: 2, name: 'Anjali Sharma', hostel: 'Elite Living', room: '305-B', contact: 'anjali@example.com', status: 'Active' },
    { id: 3, name: 'Vikram Singh', hostel: 'Sunshine Residency', room: '102-C', contact: '+91 98765 00012', status: 'Inactive' },
  ]);

  return (
    <div className="tenants-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>👥 Global Tenant Directory</h1>
        <p>Monitor all residents across the HostelHub platform.</p>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Hostel</th>
              <th style={{ padding: '1rem' }}>Room</th>
              <th style={{ padding: '1rem' }}>Contact</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: '700' }}>{t.name}</td>
                <td style={{ padding: '1rem' }}>{t.hostel}</td>
                <td style={{ padding: '1rem' }}>{t.room}</td>
                <td style={{ padding: '1rem' }}>{t.contact}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                    background: t.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: t.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)'
                  }}>
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button className="btn" style={{ fontSize: '0.75rem' }}>View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tenants;
