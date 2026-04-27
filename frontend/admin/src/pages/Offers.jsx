import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, RefreshCw, Calendar, X } from 'lucide-react';

const initialPromos = [
  { id: 1, code: 'WELCOME500', type: 'Flat',       value: '₹500',  used: 1240, limit: 2000, expiry: '2025-12-31', status: 'Active' },
  { id: 2, code: 'FESTIVE20',  type: 'Percentage', value: '20%',   used: 850,  limit: 1500, expiry: '2024-11-15', status: 'Active' },
  { id: 3, code: 'EARLYBIRD',  type: 'Flat',       value: '₹1,000',used: 500,  limit: 500,  expiry: '2024-01-01', status: 'Expired' },
];

const Offers = () => {
  const [promos, setPromos] = useState(initialPromos);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'Flat', value: '', limit: '', expiry: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    setPromos([{ id: Date.now(), code: form.code.toUpperCase(), type: form.type, value: form.type === 'Flat' ? `₹${form.value}` : `${form.value}%`, used: 0, limit: parseInt(form.limit) || 100, expiry: form.expiry, status: 'Active' }, ...promos]);
    setShowModal(false);
    setForm({ code: '', type: 'Flat', value: '', limit: '', expiry: '' });
  };

  const handleDelete = (id) => setPromos(promos.filter(p => p.id !== id));

  return (
    <div className="animate-fade" style={{ maxWidth: '1300px' }}>
      <div className="page-header">
        <div>
          <h1>Promotion Engine</h1>
          <p>Create and manage discount vouchers and referral programs.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Create Promo Code
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, transparent 100%)' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Discounts Redeemed</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>₹8.4L</div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.3rem' }}>Total value this month</div>
        </div>
        <div className="card">
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Conversion Rate</div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800 }}>14.2%</div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.3rem' }}>Bookings via promo codes</div>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type & Value</th>
              <th>Usage</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promos.map(p => {
              const pct = Math.round((p.used / p.limit) * 100);
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                        <Tag size={16} color="#7c3aed" />
                      </div>
                      <span style={{ fontWeight: 800, fontFamily: 'monospace', fontSize: '0.95rem' }}>{p.code}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.value}</div>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem', marginTop: '0.3rem' }}>{p.type}</span>
                  </td>
                  <td style={{ width: '140px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#94a3b8' }}>{p.used.toLocaleString()} / {p.limit.toLocaleString()}</span>
                      <span style={{ fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ height: '4px', background: '#1e293b', borderRadius: '10px' }}>
                      <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: pct >= 100 ? '#ef4444' : '#7c3aed', borderRadius: '10px' }} />
                    </div>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    <Calendar size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />{p.expiry}
                  </td>
                  <td><span className={`badge ${p.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{p.status}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button className="icon-action-btn"><Edit2 size={14} /></button>
                      <button className="icon-action-btn"><RefreshCw size={14} /></button>
                      <button className="icon-action-btn" style={{ color: '#ef4444' }} onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}><X size={20} /></button>
            <div className="modal-header"><h2>Create Promo Code</h2><p>Set up a new discount voucher for users.</p></div>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="form-label">Promo Code</label>
                <input className="form-input" required placeholder="e.g. SUMMER30" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} style={{ fontFamily: 'monospace', textTransform: 'uppercase', fontWeight: 700 }} />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Discount Type</label>
                  <select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                    <option>Flat</option>
                    <option>Percentage</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Value {form.type === 'Flat' ? '(₹)' : '(%)'}</label>
                  <input className="form-input" type="number" required placeholder={form.type === 'Flat' ? '500' : '20'} value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Usage Limit</label>
                  <input className="form-input" type="number" placeholder="e.g. 500" value={form.limit} onChange={e => setForm({ ...form, limit: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input className="form-input" type="date" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Launch Promo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;
