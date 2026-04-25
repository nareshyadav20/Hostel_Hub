import React, { useState } from 'react';
import { 
  UserPlus, Search, Edit2, Trash2, ShieldCheck, 
  Mail, Phone, X, ExternalLink, Filter, MoreHorizontal,
  CheckCircle2, AlertTriangle, XCircle, Briefcase
} from 'lucide-react';
import Modal from '../components/Modal';

const initialOwners = [
  { id: 1, name: 'Vikram Malhotra', email: 'vikram@example.com', phone: '+91 98765 00123', properties: 4, kycStatus: 'Verified', since: '2023-05-12', revenue: '₹12.4L' },
  { id: 2, name: 'Anjali Sharma', email: 'anjali@example.com', phone: '+91 87654 00456', properties: 2, kycStatus: 'Pending', since: '2024-01-10', revenue: '₹6.8L' },
  { id: 3, name: 'Suresh Iyer', email: 'suresh@example.com', phone: '+91 76543 00789', properties: 1, kycStatus: 'Rejected', since: '2023-11-25', revenue: '₹1.1L' },
];

const Owners = () => {
  const [owners, setOwners] = useState(initialOwners);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', properties: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    const newOwner = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      properties: parseInt(form.properties) || 0,
      kycStatus: 'Pending',
      since: new Date().toISOString().split('T')[0],
      revenue: '₹0'
    };
    setOwners([newOwner, ...owners]);
    setActiveModal(null);
    setForm({ name: '', email: '', phone: '', properties: '' });
  };

  const handleDelete = (id) => {
    setOwners(owners.filter(o => o.id !== id));
  };

  const filtered = owners.filter(o =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container animate-fade">
      {/* Premium Header */}
      <div className="page-header" style={{ marginBottom: '3.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 900, letterSpacing: '-0.04em' }}>
            Partnership <span style={{ color: 'var(--accent-primary)' }}>Matrix</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '0.5rem' }}>
            Manage property owner relationships and KYC compliance status.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-secondary">
            <Filter size={18} /> Filter Partners
          </button>
          <button className="btn btn-primary" onClick={() => setActiveModal('add')}>
            <UserPlus size={18} /> Register Partner
          </button>
        </div>
      </div>

      {/* Advanced Matrix Controls */}
      <div className="global-filter-bar" style={{ marginBottom: '2.5rem' }}>
        <div className="filter-group">
          <Briefcase size={18} color="var(--accent-primary)" />
          <span className="filter-label">Partner Tier:</span>
          <select className="filter-select">
            <option>All Tiers</option>
            <option>Platinum (4+ Props)</option>
            <option>Gold (2+ Props)</option>
            <option>Standard</option>
          </select>
        </div>
        <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
        <div className="filter-group">
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ background: 'none', border: 'none', color: '#fff', outline: 'none', fontSize: '0.85rem', width: '300px' }} 
          />
        </div>
      </div>

      {/* Partnership Matrix Table */}
      <div className="table-wrapper" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '24px', overflow: 'hidden' }}>
        <table className="pro-table">
          <thead>
            <tr>
              <th>Owner Details</th>
              <th>Contact Node</th>
              <th>Infrastructure</th>
              <th>Platform Yield</th>
              <th>KYC Integrity</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(owner => (
              <tr key={owner.id} style={{ transition: 'all 0.2s' }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyIn: 'center', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      {owner.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>{owner.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700 }}>SINCE {owner.since.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={12} /> {owner.email}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Phone size={12} /> {owner.phone}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{owner.properties}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>PROPERTIES</span>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 800, color: '#fff' }}>{owner.revenue}</div>
                  <div style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800 }}>+8.2% YIELD</div>
                </td>
                <td>
                  <span className={`badge ${owner.kycStatus === 'Verified' ? 'badge-success' : owner.kycStatus === 'Pending' ? 'badge-warning' : 'badge-danger'}`} style={{ padding: '0.4rem 0.8rem' }}>
                    {owner.kycStatus === 'Verified' ? <CheckCircle2 size={12} /> : owner.kycStatus === 'Pending' ? <AlertTriangle size={12} /> : <XCircle size={12} />}
                    {owner.kycStatus}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="icon-action-btn" title="Edit Profile"><Edit2 size={16} /></button>
                    <button className="icon-action-btn" title="Audit KYC"><ShieldCheck size={16} /></button>
                    <button className="icon-action-btn" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(owner.id)} title="Terminate Relationship">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register Partner Modal */}
      <Modal 
        isOpen={activeModal === 'add'} 
        onClose={() => setActiveModal(null)}
        title="Onboard New Partner"
        footer={<button className="btn btn-primary" onClick={handleAdd}>Initialize Relationship</button>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Legal Name</label>
            <input className="form-input" placeholder="Vikram Malhotra" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Email</label>
            <input className="form-input" type="email" placeholder="vikram@nexus.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label">Direct Phone</label>
            <input className="form-input" placeholder="+91 00000 00000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Initial Property Count</label>
            <input className="form-input" type="number" placeholder="1" value={form.properties} onChange={e => setForm({...form, properties: e.target.value})} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Owners;
