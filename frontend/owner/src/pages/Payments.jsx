import React, { useState } from 'react';

const Payments = () => {
  const [payments, setPayments] = useState([
    { id: 1, tenant: 'Rahul Sharma', room: '201-A', amount: 6500, status: 'Success' },
    { id: 2, tenant: 'Priya Verma', room: '202-B', amount: 8500, status: 'Success' },
    { id: 3, tenant: 'Amit Singh', room: '101-A', amount: 5000, status: 'Pending' },
    { id: 4, tenant: 'Sneha Kapur', room: '305-C', amount: 7200, status: 'Pending' },
  ]);

  const totalCollected = payments.filter(p => p.status === 'Success').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0);

  const handleSendReminder = (tenant) => {
    alert(`Reminder sent to ${tenant}!`);
  };

  return (
    <div className="payments-page">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>💳 Payment Management</h1>
          <p>Track revenue and manage tenant dues.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-success)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Collected</p>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--accent-success)' }}>₹{totalCollected.toLocaleString()}</h2>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-warning)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Amount</p>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--accent-warning)' }}>₹{pendingAmount.toLocaleString()}</h2>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem' }}>Tenant</th>
              <th style={{ padding: '1.2rem' }}>Room</th>
              <th style={{ padding: '1.2rem' }}>Amount</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.2rem', fontWeight: '700' }}>{p.tenant}</td>
                <td style={{ padding: '1.2rem' }}>{p.room}</td>
                <td style={{ padding: '1.2rem', fontWeight: '800' }}>₹{p.amount}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                    background: p.status === 'Success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: p.status === 'Success' ? 'var(--accent-success)' : 'var(--accent-warning)'
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  {p.status === 'Pending' && (
                    <button 
                      onClick={() => handleSendReminder(p.tenant)}
                      className="btn" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'var(--accent-primary)', color: '#fff' }}
                    >
                      ➕ Send Reminder
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

export default Payments;
