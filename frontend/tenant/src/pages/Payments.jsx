import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
    <div className="payments-page fade-in dashboard-container" style={{ position: 'relative' }}>
      <Link to="/dashboard" style={{
        position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-secondary)',
        width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-md)', transition: 'all 0.3s ease', zIndex: 10
      }} className="hover-scale">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </Link>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
          Financial Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your rent payments, security deposits, and transaction history.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '2rem', borderLeft: '6px solid var(--accent-success)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '16px', color: 'var(--accent-success)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Invested</p>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>₹{totalPaid.toLocaleString()}</h2>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2rem', borderLeft: '6px solid var(--accent-error)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '16px', color: 'var(--accent-error)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg>
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Pending Rent</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>₹{pendingRent.toLocaleString()}</h2>
            </div>
          </div>
          <button onClick={handlePayNow} className="btn btn-primary" style={{ padding: '1rem 2rem', fontWeight: '800', borderRadius: '12px', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)' }}>Pay Now</button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '800' }}>Recent Transactions</h3>
          <button className="btn" style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '700' }}>Download Statement</button>
        </div>
        <div className="table-responsive" style={{ paddingBottom: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                <th style={{ padding: '1.5rem 2rem', borderBottom: '2px solid var(--border-color)' }}>Transaction Date</th>
                <th style={{ padding: '1.5rem 2rem', borderBottom: '2px solid var(--border-color)' }}>Amount</th>
                <th style={{ padding: '1.5rem 2rem', borderBottom: '2px solid var(--border-color)' }}>Payment Method</th>
                <th style={{ padding: '1.5rem 2rem', borderBottom: '2px solid var(--border-color)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map(p => (
                <tr key={p.id} className="payment-row" style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s ease' }}>
                  <td style={{ padding: '1.5rem 2rem', color: 'var(--text-primary)', fontWeight: '600' }}>{p.date}</td>
                  <td style={{ padding: '1.5rem 2rem', fontWeight: '900', fontSize: '1.1rem', color: 'var(--text-primary)' }}>₹{p.amount.toLocaleString()}</td>
                  <td style={{ padding: '1.5rem 2rem', color: 'var(--text-muted)' }}>UPI / Razorpay</td>
                  <td style={{ padding: '1.5rem 2rem' }}>
                    <span style={{ 
                      padding: '0.5rem 1.2rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800',
                      background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)',
                      display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        .payment-row:hover { background: rgba(255, 255, 255, 0.02); }
      `}</style>
    </div>
  );
};

export default Payments;
