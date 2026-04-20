import React, { useState } from 'react';

const Tenants = () => {
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', room: '201-A', phone: '+91 98765 43210', status: 'ACTIVE', rentStatus: 'PAID' },
    { id: 2, name: 'Priya Verma', email: 'priya@example.com', room: '202-B', phone: '+91 87654 32109', status: 'ACTIVE', rentStatus: 'PENDING' },
    { id: 3, name: 'Amit Singh', email: 'amit@example.com', room: '101-A', phone: '+91 76543 21098', status: 'ACTIVE', rentStatus: 'PAID' },
  ]);

  return (
    <div className="tenants-page">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>👥 Tenant Management</h1>
          <p>Track all residents and their stay details.</p>
        </div>
        <button className="btn btn-primary">+ Register Tenant</button>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem' }}>Tenant Name</th>
              <th style={{ padding: '1.2rem' }}>Room / Bed</th>
              <th style={{ padding: '1.2rem' }}>Contact</th>
              <th style={{ padding: '1.2rem' }}>Rent Status</th>
              <th style={{ padding: '1.2rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition-fast)' }} className="table-row-hover">
                <td style={{ padding: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>
                      {tenant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: '600' }}>{tenant.name}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tenant.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                    {tenant.room}
                  </span>
                </td>
                <td style={{ padding: '1.2rem', fontSize: '0.9rem' }}>{tenant.phone}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    background: tenant.rentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: tenant.rentStatus === 'PAID' ? 'var(--accent-success)' : 'var(--accent-error)'
                  }}>
                    {tenant.rentStatus}
                  </span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <button className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <style>{`
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
};

export default Tenants;
