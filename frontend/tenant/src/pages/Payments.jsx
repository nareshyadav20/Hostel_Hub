import React, { useState } from 'react';

const Payments = () => {
  const [history, setHistory] = useState([
    { id: 1, date: '01 Apr 2026', amount: 6500, status: 'Success' },
    { id: 2, date: '01 Mar 2026', amount: 6500, status: 'Success' },
    { id: 3, date: '01 Feb 2026', amount: 6500, status: 'Success' },
  ]);

  const pendingRent = 6500;
  const totalPaid = history.reduce((acc, curr) => acc + curr.amount, 0);

  const handlePayNow = () => alert('Redirecting to Payment Gateway...');

  return (
    <div className="payments-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>💳 My Payments</h1>
        <p>Manage your rent and track payment history.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-success)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Paid</p>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--accent-success)' }}>₹{totalPaid.toLocaleString()}</h2>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--accent-error)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Rent</p>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--accent-error)' }}>₹{pendingRent.toLocaleString()}</h2>
          </div>
          <button onClick={handlePayNow} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontWeight: '800' }}>Pay Now</button>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.2rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1rem' }}>Payment History</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem' }}>Date</th>
              <th style={{ padding: '1.2rem' }}>Amount</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>{p.date}</td>
                <td style={{ padding: '1.2rem', fontWeight: '800' }}>₹{p.amount}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                    background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)'
                  }}>
                    {p.status}
                  </span>
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
