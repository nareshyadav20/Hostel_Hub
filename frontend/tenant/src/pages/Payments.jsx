import React, { useState } from 'react';

const Payments = () => {
  const [history] = useState([
    { id: 1, date: '01 Apr 2026', amount: 6500, status: 'Success' },
    { id: 2, date: '01 Mar 2026', amount: 6500, status: 'Success' },
    { id: 3, date: '01 Feb 2026', amount: 6500, status: 'Success' },
  ]);

  const pendingRent = 6500;
  const totalPaid = history.reduce((acc, curr) => acc + curr.amount, 0);

  const handlePayNow = () => alert('Redirecting to Payment Gateway...');

  const invoices = [
    { id: '#INV-2024-001', date: 'Apr 01, 2026', month: 'April 2026',     amount: '₹6,500', status: 'Paid' },
    { id: '#INV-2024-002', date: 'Mar 01, 2026', month: 'March 2026',     amount: '₹6,500', status: 'Paid' },
    { id: '#INV-2024-003', date: 'Feb 01, 2026', month: 'February 2026',  amount: '₹6,500', status: 'Paid' },
    { id: '#INV-2023-012', date: 'Jan 01, 2026', month: 'January 2026',   amount: '₹6,500', status: 'Late' },
  ];

  return (
    <div className="payments-page fade-in dashboard-container">
      {/* ── Header ── */}
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Financial Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your rent payments, security deposits, and transaction history.</p>
      </header>

      {/* ── Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        {/* Total Paid */}
        <div className="glass-card" style={{ padding: '2rem', borderLeft: '6px solid var(--accent-success)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', borderRadius: '16px', color: 'var(--accent-success)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Invested</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>₹{totalPaid.toLocaleString()}</h2>
          </div>
        </div>

        {/* Pending Rent */}
        <div className="glass-card" style={{ padding: '2rem', borderLeft: '6px solid var(--accent-error)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', borderRadius: '16px', color: 'var(--accent-error)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              </svg>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Pending Rent</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>₹{pendingRent.toLocaleString()}</h2>
            </div>
          </div>
          <button onClick={handlePayNow} className="btn btn-primary" style={{ padding: '1rem 2rem', fontWeight: '800', borderRadius: '12px' }}>Pay Now</button>
        </div>
      </div>

      {/* ── Payment History Table ── */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Payment History</h3>
          <button className="btn" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '700' }}>Download Statement</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                <th style={{ padding: '1.2rem 2rem', borderBottom: '2px solid var(--border-color)' }}>Invoice ID</th>
                <th style={{ padding: '1.2rem 2rem', borderBottom: '2px solid var(--border-color)' }}>Date</th>
                <th style={{ padding: '1.2rem 2rem', borderBottom: '2px solid var(--border-color)' }}>Month</th>
                <th style={{ padding: '1.2rem 2rem', borderBottom: '2px solid var(--border-color)' }}>Amount</th>
                <th style={{ padding: '1.2rem 2rem', borderBottom: '2px solid var(--border-color)' }}>Method</th>
                <th style={{ padding: '1.2rem 2rem', borderBottom: '2px solid var(--border-color)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '1.2rem 2rem', fontWeight: '700', color: '#6366f1' }}>{row.id}</td>
                  <td style={{ padding: '1.2rem 2rem', color: 'var(--text-muted)' }}>{row.date}</td>
                  <td style={{ padding: '1.2rem 2rem' }}>{row.month}</td>
                  <td style={{ padding: '1.2rem 2rem', fontWeight: '800', fontSize: '1rem' }}>{row.amount}</td>
                  <td style={{ padding: '1.2rem 2rem', color: 'var(--text-muted)' }}>UPI / Razorpay</td>
                  <td style={{ padding: '1.2rem 2rem' }}>
                    <span style={{
                      padding: '0.4rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800',
                      display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                      background: row.status === 'Paid' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      color: row.status === 'Paid' ? 'var(--accent-success)' : 'var(--accent-warning)',
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }}></span>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
