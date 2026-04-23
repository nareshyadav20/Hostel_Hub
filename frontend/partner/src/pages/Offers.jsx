import React from 'react';
import { Plus } from 'lucide-react';

const Offers = () => {
  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Offers & Discounts</h1>
          <p>Create promotional offers for your services.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} /> Create Offer
        </button>
      </header>
      
      <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Offers list will appear here.</p>
      </div>
import React, { useState } from 'react';
import { Plus, X, Tag, Calendar, Copy, Trash2, Edit3, Clock, CheckCircle2 } from 'lucide-react';

const initialOffers = [
  { id: 1, discount: 20, code: 'WELCOME20', validity: '2026-05-15', terms: 'Valid on first order only. Min order ₹200.', active: true },
  { id: 2, discount: 10, code: 'FLAT10', validity: '2026-04-30', terms: 'Applicable on all services above ₹150.', active: true },
  { id: 3, discount: 15, code: 'HEALTH15', validity: '2026-04-25', terms: 'Only for Health & Medicine category.', active: true },
  { id: 4, discount: 30, code: 'MEGA30', validity: '2026-03-31', terms: 'Festival special offer.', active: false },
];

const Offers = () => {
  const [offers, setOffers] = useState(initialOffers);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [copied, setCopied] = useState(null);
  const [form, setForm] = useState({ discount: '', code: '', validity: '', terms: '' });

  const openAdd = () => { setEditingOffer(null); setForm({ discount: '', code: '', validity: '', terms: '' }); setShowModal(true); };
  const openEdit = (o) => { setEditingOffer(o); setForm({ discount: String(o.discount), code: o.code, validity: o.validity, terms: o.terms }); setShowModal(true); };

  const handleSave = (e) => {
    e.preventDefault();
    const data = { ...form, discount: Number(form.discount), active: true };
    if (editingOffer) setOffers(offers.map(o => o.id === editingOffer.id ? { ...o, ...data } : o));
    else setOffers([...offers, { ...data, id: Date.now() }]);
    setShowModal(false);
  };

  const handleDelete = (id) => { if (window.confirm('Delete this offer?')) setOffers(offers.filter(o => o.id !== id)); };
  const copyCode = (code) => { navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(null), 1500); };
  const isExpired = (d) => new Date(d) < new Date();

  return (
    <div className="page-container" id="offers-page">
      <div className="section-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Offers & Discounts</h1>
          <p>Create and manage promotional offers & coupon codes</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="create-offer-btn"><Plus size={18} /> Create Offer</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Active Offers', val: offers.filter(o => !isExpired(o.validity)).length, icon: <Tag size={20} />, color: '#8b5cf6' },
          { label: 'Expired', val: offers.filter(o => isExpired(o.validity)).length, icon: <Clock size={20} />, color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} style={{ background: `${s.color}12`, border: `1px solid ${s.color}25`, borderRadius: '14px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ color: s.color }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>{s.val}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {offers.length === 0 ? (
        <div className="empty-state"><Tag size={48} /><h3>No offers yet</h3><p>Create your first offer to attract tenants.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
          {offers.map(offer => {
            const expired = isExpired(offer.validity);
            return (
              <div className="card" key={offer.id} style={{ opacity: expired ? 0.6 : 1, position: 'relative' }}>
                {expired && <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(239,68,68,0.1)', color: 'var(--accent-error)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>EXPIRED</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: expired ? 'var(--bg-tertiary)' : 'linear-gradient(135deg, #8b5cf6, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: expired ? 'var(--text-muted)' : 'white', flexShrink: 0 }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{offer.discount}%</span>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, background: 'var(--bg-tertiary)', padding: '0.3rem 0.8rem', borderRadius: '8px', color: 'var(--text-primary)', letterSpacing: '1px' }}>{offer.code}</span>
                      <button onClick={() => copyCode(offer.code)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === offer.code ? 'var(--accent-success)' : 'var(--text-muted)', display: 'flex' }}>
                        {copied === offer.code ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                      </button>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={13} /> Valid till {offer.validity}</div>
                  </div>
                </div>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>{offer.terms}</p>
                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem' }}>
                  <button className="btn btn-sm btn-secondary" onClick={() => openEdit(offer)}><Edit3 size={14} /> Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(offer.id)}><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingOffer ? 'Edit Offer' : 'Create New Offer'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} id="offer-form">
              <div className="form-row">
                <div className="form-group"><label>Discount (%)</label><input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} placeholder="20" min="1" max="100" required /></div>
                <div className="form-group"><label>Coupon Code</label><input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME20" required style={{ textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'monospace' }} /></div>
              </div>
              <div className="form-group"><label>Valid Till</label><input type="date" value={form.validity} onChange={e => setForm({ ...form, validity: e.target.value })} required /></div>
              <div className="form-group"><label>Terms & Conditions</label><textarea value={form.terms} onChange={e => setForm({ ...form, terms: e.target.value })} placeholder="Describe the offer terms..." rows={3} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editingOffer ? 'Update Offer' : 'Create Offer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Offers;
