import React, { useState } from 'react';
import './Staff.css';

const MOCK_STAFF = [
  { id: 1, name: 'Suresh Kumar', role: 'Chief Warden', email: 'suresh.k@hostelhub.com', phone: '+91 98765 43210', status: 'Active', rating: 4.8, hostel: 'Blueberry Heights', joined: 'Jan 2024' },
  { id: 2, name: 'Priya Sharma', role: 'Assistant Warden', email: 'priya.s@hostelhub.com', phone: '+91 98765 43211', status: 'On Leave', rating: 4.5, hostel: 'City View', joined: 'Mar 2024' },
  { id: 3, name: 'Rahul Varma', role: 'Security Head', email: 'rahul.v@hostelhub.com', phone: '+91 98765 43212', status: 'Active', rating: 4.9, hostel: 'Green Valley', joined: 'Feb 2024' },
  { id: 4, name: 'Anita Devi', role: 'Maintenance Lead', email: 'anita.d@hostelhub.com', phone: '+91 98765 43213', status: 'Emergency', rating: 4.2, hostel: 'Elite Living', joined: 'Nov 2023' },
  { id: 5, name: 'Vikram Singh', role: 'Warden', email: 'vikram.s@hostelhub.com', phone: '+91 98765 43214', status: 'Active', rating: 4.7, hostel: 'Spring Garden', joined: 'Apr 2024' },
  { id: 6, name: 'Meena Kumari', role: 'Housekeeping', email: 'meena.k@hostelhub.com', phone: '+91 98765 43215', status: 'Active', rating: 4.6, hostel: 'Sunset Residency', joined: 'May 2024' },
];

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const filteredStaff = MOCK_STAFF.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || staff.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'var(--accent-success)';
      case 'On Leave': return 'var(--accent-warning)';
      case 'Emergency': return 'var(--accent-error)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div className="staff-view">
      <header className="page-header">
        <div>
          <h1 className="page-title">👥 Staff Management</h1>
          <p className="page-subtitle">Manage platform-wide staff members and their performance.</p>
        </div>
        <button className="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Staff
        </button>
      </header>

      {/* Stats Section */}
      <div className="staff-stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-primary)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div className="stat-info">
            <h3>124</h3>
            <p>Total Staff</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div className="stat-info">
            <h3>98</h3>
            <p>On Duty</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div className="stat-info">
            <h3>5</h3>
            <p>Leaves</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-secondary)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          </div>
          <div className="stat-info">
            <h3>4.7</h3>
            <p>Avg Rating</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="table-controls">
        <div className="search-wrapper">
          <span>🔍</span>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-wrapper">
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="All">All Roles</option>
            <option value="Chief Warden">Chief Warden</option>
            <option value="Assistant Warden">Assistant Warden</option>
            <option value="Security Head">Security Head</option>
            <option value="Maintenance Lead">Maintenance Lead</option>
            <option value="Housekeeping">Housekeeping</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="table-container card">
        <table className="staff-table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Role</th>
              <th>Hostel</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <tr key={staff.id} className="table-row">
                <td>
                  <div className="user-info">
                    <div className="avatar">
                      {staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="user-name">{staff.name}</p>
                      <p className="user-email">{staff.email}</p>
                    </div>
                  </div>
                </td>
                <td><span className="role-chip">{staff.role}</span></td>
                <td>{staff.hostel}</td>
                <td>
                  <span className="status-badge" style={{ backgroundColor: `${getStatusColor(staff.status)}15`, color: getStatusColor(staff.status) }}>
                    <span className="status-dot" style={{ backgroundColor: getStatusColor(staff.status) }}></span>
                    {staff.status}
                  </span>
                </td>
                <td>
                  <div className="rating-indicator">
                    <span className="rating-value">{staff.rating}</span>
                    <div className="rating-bar-bg">
                      <div className="rating-bar-fill" style={{ width: `${(staff.rating / 5) * 100}%` }}></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn" title="Edit">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4L18.5 2.5z"></path></svg>
                    </button>
                    <button className="icon-btn" title="Call">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    </button>
                    <button className="icon-btn delete" title="Delete">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
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

export default Staff;
