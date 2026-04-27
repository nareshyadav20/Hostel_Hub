import React, { useState } from 'react';
import { Users, UserCheck, Bed, Search, Filter, MapPin, Mail, MoreVertical } from 'lucide-react';
import '../NexusElite.css';

const Tenants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Suresh Kumar', hostel: 'Sunshine Residency', room: '201-A', email: 'suresh@gmail.com', phone: '+91 98765 00010', status: 'Active', rentStatus: 'Paid' },
    { id: 2, name: 'Anjali Sharma', hostel: 'Elite Living', room: '305-B', email: 'anjali@example.com', phone: '+91 98765 00011', status: 'Active', rentStatus: 'Pending' },
    { id: 3, name: 'Vikram Singh', hostel: 'Sunshine Residency', room: '102-C', email: 'vikram@work.com', phone: '+91 98765 00012', status: 'Inactive', rentStatus: 'Cleared' },
    { id: 4, name: 'Riya Patel', hostel: 'Emerald Suites', room: '501-D', email: 'riya.p@live.in', phone: '+91 98765 00013', status: 'Active', rentStatus: 'Paid' },
  ]);

  const stats = [
    { label: 'Active Residents', value: '4,289', icon: <UserCheck />, color: 'var(--accent-success)' },
    { label: 'Total Capacity', value: '5,000', icon: <Bed />, color: 'var(--accent-primary)' },
    { label: 'New This Month', value: '+156', icon: <Users />, color: 'var(--accent-secondary)' },
  ];

  return (
    <div className="tenants-view">
      <header className="page-header">
        <div>
          <h1 className="page-title">👥 Global Tenant Directory</h1>
          <p className="page-subtitle">Unified view of all residents across the platform ecosystem.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <button className="nexus-btn-icon" style={{ width: 'auto', padding: '0 1.5rem', borderRadius: '12px' }}>
              Export CSV
           </button>
           <button className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '16px' }}>
              Bulk Messaging
           </button>
        </div>
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
            placeholder="Search residents by name, hostel or room..." 
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

      {/* Tenants Table */}
      <div className="nexus-table-container">
        <table className="nexus-table">
          <thead>
            <tr>
              <th>Resident</th>
              <th>Assigned Hostel</th>
              <th>Room No.</th>
              <th>Status</th>
              <th>Rent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="nexus-row">
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ 
                      width: '44px', height: '44px', borderRadius: '12px', 
                      background: 'var(--bg-tertiary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--accent-primary)', fontWeight: '800'
                    }}>
                      {tenant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', margin: 0 }}>{tenant.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{tenant.phone}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    <MapPin size={14} />
                    {tenant.hostel}
                  </div>
                </td>
                <td>
                   <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{tenant.room}</span>
                </td>
                <td>
                  <span className="nexus-badge" style={{ 
                    backgroundColor: tenant.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: tenant.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)'
                  }}>
                    <span className="status-dot" style={{ backgroundColor: tenant.status === 'Active' ? 'var(--accent-success)' : 'var(--accent-error)' }}></span>
                    {tenant.status}
                  </span>
                </td>
                <td>
                   <span style={{ 
                     padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900',
                     backgroundColor: tenant.rentStatus === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : tenant.rentStatus === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-tertiary)',
                     color: tenant.rentStatus === 'Paid' ? 'var(--accent-success)' : tenant.rentStatus === 'Pending' ? 'var(--accent-warning)' : 'var(--text-muted)',
                     border: '1px solid currentColor'
                   }}>
                     {tenant.rentStatus.toUpperCase()}
                   </span>
                </td>
                <td>
                  <div className="nexus-action-group">
                    <button className="nexus-btn-icon"><Mail size={16} /></button>
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

export default Tenants;
