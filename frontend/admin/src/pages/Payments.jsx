import React, { useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, CreditCard, Download, ExternalLink, Calendar, Search, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import '../NexusElite.css';

const Payments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await API.get('/payments');
        const mapped = (res.data || []).map(p => ({
          id: p.invoice || p.transactionId || p._id.toString().slice(-8).toUpperCase(),
          owner: p.tenantId?.name || p.buildingId?.name || 'System Guest',
          amount: p.amount ? p.amount.toLocaleString('en-IN') : '0',
          plan: p.type || p.category || 'Rent',
          date: p.date ? new Date(p.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: (p.status === 'Paid' || p.status === 'Success') ? 'Success' : p.status,
          method: p.method || 'UPI',
          rawAmount: p.amount || 0
        }));
        setPayments(mapped);
      } catch (err) {
        console.error('Failed to fetch payments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const successfulPayments = payments.filter(p => p.status === 'Success');
  const totalRevenueVal = successfulPayments.reduce((acc, p) => acc + p.rawAmount, 0);
  const avgTicketVal = successfulPayments.length > 0 ? Math.round(totalRevenueVal / successfulPayments.length) : 0;
  const pendingPayoutsVal = payments.filter(p => p.status === 'Pending' || p.status === 'Due' || p.status === 'Overdue').reduce((acc, p) => acc + p.rawAmount, 0);

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenueVal.toLocaleString('en-IN')}`, icon: <IndianRupee />, color: 'var(--accent-success)' },
    { label: 'Avg Ticket Size', value: `₹${avgTicketVal.toLocaleString('en-IN')}`, icon: <TrendingUp />, color: 'var(--accent-primary)' },
    { label: 'Pending / Due Payouts', value: `₹${pendingPayoutsVal.toLocaleString('en-IN')}`, icon: <CreditCard />, color: 'var(--accent-warning)' },
  ];

  return (
    <div className="payments-view">
      
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group mb-6"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>
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
