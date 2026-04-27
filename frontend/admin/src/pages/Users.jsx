import React, { useState } from 'react';
import { Search, Filter, Download, UserCheck, UserMinus, FileText, MoreHorizontal } from 'lucide-react';

const initialUsers = [
  { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', kycStatus: 'Pending', type: 'Owner', document: 'Aadhar Card' },
  { id: 2, name: 'Anita Patel', phone: '+91 87654 32109', kycStatus: 'Approved', type: 'Tenant', document: 'Passport' },
  { id: 3, name: 'Vikram Singh', phone: '+91 76543 21098', kycStatus: 'Rejected', type: 'Tenant', document: 'Voter ID' },
  { id: 4, name: 'Siddharth M', phone: '+91 99887 76655', kycStatus: 'Pending', type: 'Owner', document: 'Pan Card' },
];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');

  const handleAction = (id, action) => {
    setUsers(users.map(u => u.id === id ? { ...u, kycStatus: action } : u));
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  return (
    <div className="animate-fade" style={{ maxWidth: '1300px' }}>
      <div className="page-header">
        <div>
          <h1>Security & Trust Center</h1>
          <p>Review, verify, or revoke user identity documentation to maintain platform integrity.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <span className="badge badge-warning" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            {users.filter(u => u.kycStatus === 'Pending').length} Pending
          </span>
          <button className="btn btn-secondary"><Download size={16} /> Export</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="search-bar">
          <Search size={16} color="#475569" />
          <input type="text" placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Document</th>
              <th>KYC Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>UID #{u.id + 7000}</div>
                </td>
                <td style={{ color: '#94a3b8', fontSize: '0.875rem' }}>{u.phone}</td>
                <td><span className="badge badge-info">{u.type}</span></td>
                <td style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileText size={14} /> {u.document}
                </td>
                <td>
                  <span className={`badge ${u.kycStatus === 'Approved' ? 'badge-success' : u.kycStatus === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                    {u.kycStatus}
                  </span>
                </td>
                <td>
                  {u.kycStatus === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleAction(u.id, 'Approved')} className="btn" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', padding: '0.35rem 0.8rem', fontSize: '0.75rem', fontWeight: 700 }}>
                        <UserCheck size={14} /> Approve
                      </button>
                      <button onClick={() => handleAction(u.id, 'Rejected')} className="btn" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', padding: '0.35rem 0.8rem', fontSize: '0.75rem', fontWeight: 700 }}>
                        <UserMinus size={14} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.8rem', color: '#475569', fontStyle: 'italic' }}>Audit complete</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
