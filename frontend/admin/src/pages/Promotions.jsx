import React, { useState } from 'react';
import { Tag, Calendar, ShieldCheck, Plus, Search, Filter, Trash2, Edit2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../NexusElite.css';

const Promotions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [offers, setOffers] = useState([
    { id: 1, code: 'WELCOME50', discount: '50% OFF', type: 'Percentage', validity: '31 Dec 2026', status: 'Active', usage: '1.2k' },
    { id: 2, code: 'EARLYBIRD', discount: '20% OFF', type: 'Flat', validity: '30 Jun 2026', status: 'Active', usage: '850' },
    { id: 3, code: 'EXPIRED10', discount: '10% OFF', type: 'Percentage', validity: '01 Jan 2026', status: 'Disabled', usage: '42' },
  ]);

  const stats = [
    { label: 'Active Campaigns', value: '12', icon: <Tag />, color: 'var(--accent-primary)' },
    { label: 'Total Redemptions', value: '14.2k', icon: <Plus />, color: 'var(--accent-success)' },
    { label: 'Platform ROI', value: '24%', icon: <ShieldCheck />, color: 'var(--accent-secondary)' },
  ];

  return (
    <div className="promotions-view">
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
          <h1 className="page-title">🎁 Marketing Engine</h1>
          <p className="page-subtitle">Configure strategic discount campaigns and owner acquisition incentives.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '16px' }}>
          <Tag size={18} />
          Create New Offer
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

      {/* Filter Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1.5rem' }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '1.5rem', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by code or campaign name..." 
            style={{ 
              width: '100%', padding: '1rem 1rem 1rem 3.5rem', 
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: '16px', color: 'var(--text-primary)', outline: 'none'
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="nexus-btn-icon" style={{ width: '56px', height: '56px' }}>
          <Filter size={20} />
        </button>
      </div>

      {/* Promotions Table */}
      <div className="nexus-table-container">
        <table className="nexus-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Benefit</th>
              <th>Type</th>
              <th>Total Usage</th>
              <th>Validity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id} className="nexus-row">
                <td>
                  <code style={{ 
                    fontSize: '1rem', fontWeight: '900', 
                    background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', 
                    padding: '0.5rem 1rem', borderRadius: '10px', border: '1px dashed var(--accent-primary)'
                  }}>
                    {offer.code}
                  </code>
                </td>
                <td>
                  <span style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--accent-success)' }}>{offer.discount}</span>
                </td>
                <td style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{offer.type}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800' }}>
                     {offer.usage} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Claims</span>
                  </div>
                </td>
                <td>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                      <Calendar size={14} />
                      {offer.validity}
                   </div>
                </td>
                <td>
                  <span className="nexus-badge" style={{ 
                    backgroundColor: offer.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: offer.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)'
                  }}>
                    <span className="status-dot" style={{ backgroundColor: offer.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)' }}></span>
                    {offer.status}
                  </span>
                </td>
                <td>
                  <div className="nexus-action-group">
                    <button className="nexus-btn-icon"><Edit2 size={16} /></button>
                    <button className="nexus-btn-icon delete"><Trash2 size={16} /></button>
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

export default Promotions;
