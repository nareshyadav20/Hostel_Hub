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

      <div className="table-container">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>Payment History</h3>
          <button className="table-icon-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </button>
        </div>
        <table className="premium-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Date</th>
              <th>Month</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: '#INV-2024-001', date: 'Oct 01, 2024', month: 'October 2024', amount: '₹6,500', status: 'Paid' },
              { id: '#INV-2024-002', date: 'Sep 01, 2024', month: 'September 2024', amount: '₹6,500', status: 'Paid' },
              { id: '#INV-2024-003', date: 'Aug 01, 2024', month: 'August 2024', amount: '₹6,500', status: 'Late' },
            ].map((row, i) => (
              <tr key={i}>
                <td style={{ fontWeight: '600', color: '#6366f1' }}>{row.id}</td>
                <td style={{ color: '#64748b' }}>{row.date}</td>
                <td>{row.month}</td>
                <td style={{ fontWeight: '700' }}>{row.amount}</td>
                <td>
                  <span className={`table-badge ${row.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
                    {row.status}
                  </span>
                </td>
                <td>
                  <button className="table-icon-btn" title="View Details">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
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

export default Payments;
