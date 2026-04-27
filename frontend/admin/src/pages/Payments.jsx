import React, { useState } from 'react';
import { IndianRupee, TrendingUp, CreditCard, Download, ExternalLink, Calendar, Search, Filter } from 'lucide-react';
import '../NexusElite.css';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState([
    { id: 'TXN-9921', owner: 'Rahul Sharma', amount: '4,999', plan: 'Enterprise', date: '20 Apr 2026', status: 'Success', method: 'UPI' },
    { id: 'TXN-9922', owner: 'Priya Verma', amount: '2,499', plan: 'Standard', date: '18 Apr 2026', status: 'Success', method: 'Card' },
    { id: 'TXN-9923', owner: 'Amit Singh', amount: '999', plan: 'Basic', date: '15 Apr 2026', status: 'Failed', method: 'UPI' },
    { id: 'TXN-9924', owner: 'Vikram Mehta', amount: '4,999', plan: 'Enterprise', date: '12 Apr 2026', status: 'Success', method: 'Net Banking' },
  ]);

  const stats = [
    { label: 'Total Revenue', value: '₹1.24 Cr', icon: <IndianRupee />, color: 'var(--accent-success)' },
    { label: 'Avg Ticket Size', value: '₹3,450', icon: <TrendingUp />, color: 'var(--accent-primary)' },
    { label: 'Pending Payouts', value: '₹5.2L', icon: <CreditCard />, color: 'var(--accent-warning)' },
  ];

  return (
    <div className="payments-view">
      <header className="page-header">
        <div>
          <h1 className="page-title">💰 Financial Ledger</h1>
          <p className="page-subtitle">Track every subscription, payout, and platform transaction in real-time.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '16px' }}>
          <Download size={18} />
          Export Financial Report
        </button>
      </header>

      {/* Stats Grid */}
      <div className="nexus-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card-elite">
            <div className="stat-icon-elite" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-data">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1.5rem' }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '1.5rem', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by Transaction ID or Owner Name..." 
            style={{ 
              width: '100%', padding: '1rem 1rem 1rem 3.5rem', 
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: '16px', color: 'var(--text-primary)', outline: 'none'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="nexus-btn-icon" style={{ width: 'auto', padding: '0 1.5rem', borderRadius: '16px' }}>
             <Calendar size={18} style={{ marginRight: '0.75rem' }} />
             Last 30 Days
          </button>
          <button className="nexus-btn-icon" style={{ width: '56px', height: '56px' }}>
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="nexus-table-container">
        <table className="nexus-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Owner / Entity</th>
              <th>Amount</th>
              <th>Plan</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="nexus-row">
                <td>
                  <span style={{ fontFamily: 'monospace', fontWeight: '800', color: 'var(--accent-primary)' }}>{p.id}</span>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.date}</p>
                </td>
                <td>
                  <p style={{ fontWeight: '700', margin: 0 }}>{p.owner}</p>
                </td>
                <td>
                  <span style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text-primary)' }}>₹{p.amount}</span>
                </td>
                <td>
                   <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{p.plan}</span>
                </td>
                <td>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600' }}>
                      <CreditCard size={14} color="var(--text-muted)" />
                      {p.method}
                   </div>
                </td>
                <td>
                  <span className="nexus-badge" style={{ 
                    backgroundColor: p.status === 'Success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: p.status === 'Success' ? 'var(--accent-success)' : 'var(--accent-error)'
                  }}>
                    <span className="status-dot" style={{ backgroundColor: p.status === 'Success' ? 'var(--accent-success)' : 'var(--accent-error)' }}></span>
                    {p.status}
                  </span>
                </td>
                <td>
                  <div className="nexus-action-group">
                    <button className="nexus-btn-icon"><Download size={16} /></button>
                    <button className="nexus-btn-icon"><ExternalLink size={16} /></button>
                  </div>
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
