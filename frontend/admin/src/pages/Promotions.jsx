import React, { useState } from 'react';

const Promotions = () => {
  const [offers, setOffers] = useState([
    { id: 1, code: 'WELCOME50', discount: '50% OFF', validity: '31 Dec 2026', status: 'Active' },
    { id: 2, code: 'EARLYBIRD', discount: '20% OFF', validity: '30 Jun 2026', status: 'Active' },
    { id: 3, code: 'EXPIRED10', discount: '10% OFF', validity: '01 Jan 2026', status: 'Disabled' },
  ]);

  const handleToggle = (id) => {
    setOffers(offers.map(o => o.id === id ? { ...o, status: o.status === 'Active' ? 'Disabled' : 'Active' } : o));
  };

  return (
    <div className="promotions-page">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>🎁 Marketing Promotions</h1>
          <p>Create and manage discount coupons for new owners.</p>
        </div>
        <button className="btn btn-primary">+ Create Offer</button>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem' }}>Coupon Code</th>
              <th style={{ padding: '1.2rem' }}>Discount</th>
              <th style={{ padding: '1.2rem' }}>Validity</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {offers.map(o => (
              <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.2rem' }}>
                  <code style={{ fontSize: '1.1rem', fontWeight: '800', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
                    {o.code}
                  </code>
                </td>
                <td style={{ padding: '1.2rem', fontWeight: '800', color: 'var(--accent-success)' }}>{o.discount}</td>
                <td style={{ padding: '1.2rem', color: 'var(--text-muted)' }}>{o.validity}</td>
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
                    {o.status === 'Active' ? 'Disable' : 'Enable'}
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

export default Promotions;
