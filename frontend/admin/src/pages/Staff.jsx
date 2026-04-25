import React, { useState } from 'react';
import { UserPlus, Shield, UserX, Key, X } from 'lucide-react';

const initialStaff = [
  { id: 1, name: 'Admin Root', role: 'Super Admin', email: 'root@hostelhub.com', status: 'Active', lastLogin: '10m ago' },
  { id: 2, name: 'Sameer Sheikh', role: 'City Manager', email: 'sameer@hostelhub.com', status: 'Active', lastLogin: '2h ago' },
  { id: 3, name: 'Karishma Rao', role: 'KYC Moderator', email: 'karishma@hostelhub.com', status: 'Suspended', lastLogin: '3 days ago' },
];

const Staff = () => {
  const [staff, setStaff] = useState(initialStaff);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'KYC Moderator' });

  const toggleStatus = (id) => {
    setStaff(staff.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Suspended' : 'Active' } : s));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setStaff([{ id: Date.now(), name: form.name, email: form.email, role: form.role, status: 'Active', lastLogin: 'Just now' }, ...staff]);
    setShowModal(false);
    setForm({ name: '', email: '', role: 'KYC Moderator' });
  };

  const roleColors = { 'Super Admin': '#fbbf24', 'City Manager': '#38bdf8', 'KYC Moderator': '#a78bfa' };

  return (
    <div className="animate-fade" style={{ maxWidth: '1300px' }}>
      <div className="page-header">
        <div>
          <h1>Staff Management</h1>
          <p>Control administrative roles and internal access permissions.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <UserPlus size={16} /> Add Staff
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {staff.map(s => (
          <div key={s.id} className="card animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                  {s.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>{s.name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{s.email}</div>
                </div>
              </div>
              <span className={`badge ${s.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{s.status}</span>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '10px', padding: '0.8rem 1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Role</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: roleColors[s.role] || '#94a3b8' }}>
                  <Shield size={12} style={{ marginRight: 4 }} />{s.role}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Last Active</span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{s.lastLogin}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
              <button className="btn btn-secondary" style={{ fontSize: '0.8rem' }}><Key size={14} /> Permissions</button>
              <button
                onClick={() => toggleStatus(s.id)}
                className="btn btn-secondary"
                style={{ fontSize: '0.8rem', color: s.status === 'Active' ? '#ef4444' : '#10b981', borderColor: s.status === 'Active' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)' }}
              >
                {s.status === 'Active' ? <><UserX size={14} /> Suspend</> : <><UserPlus size={14} /> Activate</>}
              </button>
            </div>
          </div>
        ))}

        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed rgba(255,255,255,0.07)', background: 'transparent', cursor: 'pointer', minHeight: '220px' }} onClick={() => setShowModal(true)}>
          <div style={{ textAlign: 'center', color: '#475569' }}>
            <UserPlus size={28} style={{ marginBottom: '0.8rem' }} />
            <p style={{ fontWeight: 600 }}>Add Staff Member</p>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} style={{ position:'absolute', top:'1.5rem', right:'1.5rem', background:'none', border:'none', color:'#475569', cursor:'pointer' }}><X size={20} /></button>
            <div className="modal-header"><h2>Add Staff Member</h2><p>Create a new administrative account.</p></div>
            <form onSubmit={handleAdd}>
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Staff member name" /></div>
              <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="staff@hostelhub.com" /></div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-input" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option>KYC Moderator</option>
                  <option>City Manager</option>
                  <option>Support Agent</option>
                  <option>Super Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Create Staff ID</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
