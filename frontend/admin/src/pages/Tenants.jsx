import React, { useState } from 'react';
import { Search, Download, UserMinus, UserCheck, FileText, X, Plus } from 'lucide-react';

const initialTenants = [
  { id: 1, name: 'Arjun Reddy', hostel: 'Sunshine Residency', room: '302-B', status: 'Active', rentStatus: 'Paid', joined: '2024-02-15' },
  { id: 2, name: 'Sana Khan', hostel: 'Elite Living', room: '104-A', status: 'Pending', rentStatus: 'Overdue', joined: '2024-04-01' },
  { id: 3, name: 'Rohan Gupta', hostel: 'Green View', room: '501', status: 'Active', rentStatus: 'Paid', joined: '2023-12-10' },
  { id: 4, name: 'Deepika M', hostel: 'Sunshine Residency', room: '205-C', status: 'Expiring Soon', rentStatus: 'Paid', joined: '2023-06-20' },
];

const Tenants = () => {
  const [tenants, setTenants] = useState(initialTenants);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', hostel: '', room: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    setTenants([{ id: Date.now(), name: form.name, hostel: form.hostel, room: form.room, status: 'Pending', rentStatus: 'Pending', joined: new Date().toISOString().split('T')[0] }, ...tenants]);
    setShowModal(false);
    setForm({ name: '', hostel: '', room: '' });
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '1300px' }}>
      <div className="page-header">
        <div>
          <h1>Resident Management</h1>
          <p>Monitor tenant welfare, payment health, and lease compliance across all units.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button className="btn btn-secondary"><Download size={16} /> Export</button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Tenant</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="search-bar">
          <Search size={16} color="#475569" />
          <input type="text" placeholder="Search by name, hostel or room..." />
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Tenant</th>
              <th>Hostel & Room</th>
              <th>Joined</th>
              <th>Rent Status</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(t => (
              <tr key={t.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569' }}>UID #{t.id}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 500 }}>{t.hostel}</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Room {t.room}</div>
                </td>
                <td style={{ color: '#94a3b8' }}>{t.joined}</td>
                <td><span className={`badge ${t.rentStatus === 'Paid' ? 'badge-success' : 'badge-danger'}`}>{t.rentStatus}</span></td>
                <td><span className={`badge ${t.status === 'Active' ? 'badge-info' : t.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>{t.status}</span></td>
                <td>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="icon-action-btn" title="Documents"><FileText size={15} /></button>
                    <button className="icon-action-btn" style={{ color: '#10b981' }} title="Verify"><UserCheck size={15} /></button>
                    <button className="icon-action-btn" style={{ color: '#ef4444' }} onClick={() => setTenants(tenants.filter(x => x.id !== t.id))} title="Move Out"><UserMinus size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} style={{ position:'absolute', top:'1.5rem', right:'1.5rem', background:'none', border:'none', color:'#475569', cursor:'pointer' }}><X size={20} /></button>
            <div className="modal-header"><h2>Add New Tenant</h2><p>Register a new resident manually.</p></div>
            <form onSubmit={handleAdd}>
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Tenant full name" /></div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Hostel Name</label><input className="form-input" required value={form.hostel} onChange={e => setForm({...form, hostel: e.target.value})} placeholder="e.g. Green View" /></div>
                <div className="form-group"><label className="form-label">Room Number</label><input className="form-input" value={form.room} onChange={e => setForm({...form, room: e.target.value})} placeholder="e.g. 204-A" /></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Add Resident</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenants;
