import React, { useState } from 'react';

const Payments = () => {
  const [payments, setPayments] = useState([
    { id: 1, owner: 'Rahul Sharma', amount: '₹4,999', plan: 'Enterprise', date: '20 Apr 2026', status: 'Success' },
    { id: 2, owner: 'Priya Verma', amount: '₹2,499', plan: 'Standard', date: '18 Apr 2026', status: 'Success' },
    { id: 3, owner: 'Amit Singh', amount: '₹999', plan: 'Basic', date: '15 Apr 2026', status: 'Success' },
  ]);

  return (
    <div className="payments-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>💰 Platform Revenue</h1>
        <p>Track subscription payments and owner transactions.</p>
      </header>

      <div className="card" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid var(--accent-success)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Total Platform Revenue (LifeTime)</p>
        <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-success)' }}>₹1,24,50,000</h2>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem' }}>Owner Name</th>
              <th style={{ padding: '1.2rem' }}>Amount</th>
              <th style={{ padding: '1.2rem' }}>Plan</th>
              <th style={{ padding: '1.2rem' }}>Date</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.2rem', fontWeight: '700' }}>{p.owner}</td>
                <td style={{ padding: '1.2rem', fontWeight: '800' }}>{p.amount}</td>
                <td style={{ padding: '1.2rem' }}>{p.plan}</td>
                <td style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>{p.date}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700',
                    background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)'
                  }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <button className="btn" style={{ fontSize: '0.75rem' }}>View Transaction</button>
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
