import React, { useState } from 'react';
import { UserPlus, Mail, Phone, Home, ShieldCheck, MoreVertical, Search, Filter } from 'lucide-react';
import '../NexusElite.css';

const Owners = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [owners, setOwners] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul@sharma.com', phone: '+91 98765 12345', hostels: 4, plan: 'Enterprise', status: 'Active', joined: 'Jan 2024' },
    { id: 2, name: 'Priya Verma', email: 'priya.v@outlook.com', phone: '+91 98765 23456', hostels: 2, plan: 'Standard', status: 'Active', joined: 'Mar 2024' },
    { id: 3, name: 'Amit Singh', email: 'amit.singh@gmail.com', phone: '+91 98765 34567', hostels: 1, plan: 'Basic', status: 'Deactivated', joined: 'Feb 2024' },
    { id: 4, name: 'Vikram Mehta', email: 'v.mehta@elite.in', phone: '+91 98765 45678', hostels: 8, plan: 'Enterprise', status: 'Active', joined: 'May 2024' },
  ]);

  const stats = [
    { label: 'Total Owners', value: '142', icon: <UserPlus />, color: 'var(--accent-primary)' },
    { label: 'Enterprise', value: '38', icon: <ShieldCheck />, color: 'var(--accent-success)' },
    { label: 'Total Hostels', value: '456', icon: <Home />, color: 'var(--accent-secondary)' },
  ];

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'Enterprise': return '#8b5cf6';
      case 'Standard': return '#0ea5e9';
      default: return '#64748b';
    }
  };

  return (
    <div className="owners-view">
      <header className="page-header">
        <div>
          <h1 className="page-title">👤 Hostel Owners</h1>
          <p className="page-subtitle">Manage platform-wide owner accounts and strategic partnerships.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '16px' }}>
          <UserPlus size={20} />
          Add New Owner
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

      {/* Filters & Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', gap: '1.5rem' }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '1.5rem', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search owners by name, email or phone..." 
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

      {/* Owners Table */}
      <div className="nexus-table-container">
        <table className="nexus-table">
          <thead>
            <tr>
              <th>Owner Profile</th>
              <th>Properties</th>
              <th>Membership</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {owners.map((owner) => (
              <tr key={owner.id} className="nexus-row">
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ 
                      width: '48px', height: '48px', borderRadius: '14px', 
                      background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: '800', fontSize: '1rem'
                    }}>
                      {owner.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', margin: 0 }}>{owner.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{owner.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                    <Home size={14} color="var(--accent-primary)" />
                    {owner.hostels} Hostels
                  </div>
                </td>
                <td>
                  <span style={{ 
                    padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800',
                    background: `${getPlanColor(owner.plan)}15`, color: getPlanColor(owner.plan),
                    border: `1px solid ${getPlanColor(owner.plan)}30`
                  }}>
                    {owner.plan.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className="nexus-badge" style={{ 
                    backgroundColor: owner.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: owner.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)'
                  }}>
                    <span className="status-dot" style={{ backgroundColor: owner.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)' }}></span>
                    {owner.status}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>{owner.joined}</td>
                <td>
                  <div className="nexus-action-group">
                    <button className="nexus-btn-icon"><Mail size={16} /></button>
                    <button className="nexus-btn-icon"><Phone size={16} /></button>
                    <button className="nexus-btn-icon"><MoreVertical size={16} /></button>
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

export default Owners;
