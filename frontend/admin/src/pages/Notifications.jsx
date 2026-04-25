import React, { useState } from 'react';
import { Send, History, Target, AlertCircle, X } from 'lucide-react';

const Notifications = () => {
  const [history, setHistory] = useState([
    { id: 1, title: 'Network Maintenance', target: 'Pune Hub', status: 'Delivered', time: '2h ago' },
    { id: 2, title: 'Festive Offer: 20% Off', target: 'All Users', status: 'Delivered', time: '1 day ago' },
    { id: 3, title: 'KYC Policy Update', target: 'Owners Only', status: 'Failed', time: '2 days ago' },
  ]);

  const [form, setForm] = useState({ title: '', segment: 'All Users', priority: 'Normal', message: '' });
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!form.title || !form.message) return;
    setHistory([{ id: Date.now(), title: form.title, target: form.segment, status: 'Delivered', time: 'Just now' }, ...history]);
    setForm({ title: '', segment: 'All Users', priority: 'Normal', message: '' });
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '1300px' }}>
      <div className="page-header">
        <div>
          <h1>Broadcast Center</h1>
          <p>Send push notifications and in-app alerts to any user segment.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ border: '1px solid rgba(251,191,36,0.2)' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Send size={18} color="#fbbf24" /> Compose Broadcast
          </h3>
          <form onSubmit={handleSend}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" placeholder="e.g. Important Security Update" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Target Segment</label>
                <select className="form-input" value={form.segment} onChange={e => setForm({ ...form, segment: e.target.value })}>
                  <option>All Users</option>
                  <option>Tenants Only</option>
                  <option>Owners Only</option>
                  <option>City: Bangalore</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="form-input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                  <option>Normal</option>
                  <option>High (Instant Push)</option>
                  <option>Critical (SMS + Push)</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea className="form-input" rows={5} placeholder="Write your message..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: 'none' }} required />
            </div>
            <div style={{ padding: '0.8rem 1rem', background: 'rgba(251,191,36,0.05)', border: '1px dashed rgba(251,191,36,0.3)', borderRadius: '10px', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={14} /> Estimated Reach: 14,250 Users
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', fontWeight: 800, fontSize: '0.95rem' }}>
              {sent ? '✓ Notification Sent!' : <><Send size={16} /> Send Broadcast</>}
            </button>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <History size={18} color="#38bdf8" /> Recent Broadcasts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {history.map(item => (
              <div key={item.id} style={{ padding: '0.9rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.title}</span>
                  <span style={{ fontSize: '0.75rem', color: '#475569' }}>{item.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Target size={12} /> {item.target}</span>
                  <span className={`badge ${item.status === 'Delivered' ? 'badge-success' : 'badge-danger'}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
