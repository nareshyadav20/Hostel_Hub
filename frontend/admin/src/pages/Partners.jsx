import React, { useState } from 'react';
import { Handshake, Globe, ExternalLink, Mail, Phone, Search, Filter, Plus, ShieldCheck } from 'lucide-react';
import '../NexusElite.css';

const Partners = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [partners, setPartners] = useState([
    { id: 1, name: 'Zomato Daily', type: 'Food Delivery', contact: 'partners@zomato.com', status: 'Active', houses: 'All', joined: 'Jan 2024' },
    { id: 2, name: 'Urban Company', type: 'Maintenance', contact: 'service@urban.in', status: 'Active', houses: '42', joined: 'Mar 2024' },
    { id: 3, name: 'Rapido', type: 'Transport', contact: 'ride@rapido.bike', status: 'Pending', houses: '-', joined: 'Feb 2024' },
  ]);

  const stats = [
    { label: 'Strategic Partners', value: '24', icon: <Handshake />, color: 'var(--accent-primary)' },
    { label: 'Active Integrations', value: '18', icon: <Globe />, color: 'var(--accent-success)' },
    { label: 'Compliance Score', value: '98%', icon: <ShieldCheck />, color: 'var(--accent-secondary)' },
  ];

  return (
    <div className="partners-view">
      <header className="page-header">
        <div>
          <h1 className="page-title">🤝 Partner Ecosystem</h1>
          <p className="page-subtitle">Manage high-level corporate partnerships and service integrations.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '16px' }}>
          <Plus size={18} />
          Onboard Partner
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
            placeholder="Search by partner name or category..." 
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

      {/* Partners Table */}
      <div className="nexus-table-container">
        <table className="nexus-table">
          <thead>
            <tr>
              <th>Partner Identity</th>
              <th>Category</th>
              <th>Service Scope</th>
              <th>Contact Node</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id} className="nexus-row">
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ 
                      width: '44px', height: '44px', borderRadius: '12px', 
                      background: 'var(--bg-tertiary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent-primary)', fontWeight: '800'
                    }}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', margin: 0 }}>{p.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Joined {p.joined}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span style={{ fontWeight: '700', color: 'var(--text-secondary)' }}>{p.type}</span>
                </td>
                <td>
                   <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {p.houses} Properties
                   </div>
                </td>
                <td>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>{p.contact}</span>
                   </div>
                </td>
                <td>
                  <span className="nexus-badge" style={{ 
                    backgroundColor: p.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: p.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)'
                  }}>
                    <span className="status-dot" style={{ backgroundColor: p.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)' }}></span>
                    {p.status}
                  </span>
                </td>
                <td>
                  <div className="nexus-action-group">
                    <button className="nexus-btn-icon"><Mail size={16} /></button>
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

export default Partners;
