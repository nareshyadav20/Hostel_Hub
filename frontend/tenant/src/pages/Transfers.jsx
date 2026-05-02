import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const Transfers = () => {
  const [tenantData, setTenantData] = useState(null);
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ newRoom: '', reason: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tenantRes, transferRes] = await Promise.all([
        API.get('/tenants/me'),
        API.get('/room-transfers/me')
      ]);
      setTenantData(tenantRes.data);
      setTransfers(transferRes.data);
    } catch (err) {
      console.error('Error fetching transfer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestTransfer = () => setShowForm(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await API.post('/room-transfers', formData);
      setTransfers([response.data, ...transfers]);
      setShowForm(false);
      setFormData({ newRoom: '', reason: '' });
      alert('Transfer Request Submitted Successfully!');
    } catch (err) {
      console.error('Error submitting transfer:', err);
      alert('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACCEPTED': return { background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' };
      case 'REJECTED': return { background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' };
      default: return { background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' };
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div className="transfers-page fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' }}>🔄 Room Transfer</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Request to move to a different room or building within the StayNest network.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.4rem', fontWeight: '800' }}>Current Residency</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>Resident Name</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>{tenantData?.name || 'N/A'}</p>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>Assigned Room</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>{tenantData?.room || 'Not Assigned'}</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', borderRadius: '24px', background: 'linear-gradient(145deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent-primary)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5" /><path d="M8 21H3v-5" /><path d="M12 21l9-9" /><path d="M3 3l9 9" /></svg>
          </div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.4rem', fontWeight: '800' }}>Request Transfer</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Want a different view or more space? Our concierge will help you find the perfect new spot.
          </p>
          <button
            onClick={handleRequestTransfer}
            className="btn btn-primary"
            style={{ padding: '1.2rem', fontWeight: '800', borderRadius: '14px', boxShadow: '0 10px 25px rgba(14, 165, 233, 0.2)' }}
          >
            ➕ Request New Transfer
          </button>
        </div>
      </div>

      {/* ── Request History ── */}
      <div className="card" style={{ padding: '2rem', borderRadius: '24px' }}>
        <h3 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: '800' }}>Transfer History</h3>
        {transfers.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No transfer requests found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transfers.map(t => (
              <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <div>
                  <p style={{ fontWeight: '800', fontSize: '1rem' }}>Shift to: {t.newRoom}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>From: {t.oldRoom} • {new Date(t.createdAt).toLocaleDateString()}</p>
                </div>
                <span style={{ padding: '0.4rem 1rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '900', ...getStatusStyle(t.status) }}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Transfer Request Modal ── */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1.5rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '3rem', borderRadius: '32px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', animation: 'authFadeIn 0.4s ease-out' }}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.5rem' }}>Transfer Form</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Please provide the details for your room shift.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>Target Room / Type</label>
                <input
                  type="text"
                  placeholder="e.g. 402-B or Premium Single"
                  value={formData.newRoom}
                  onChange={(e) => setFormData({ ...formData, newRoom: e.target.value })}
                  style={{ width: '100%', padding: '1rem 1.2rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: '600' }}
                  required
                />
              </div>

              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>Reason for Transfer</label>
                <textarea
                  placeholder="e.g. Need more space, moving with friend, etc."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  style={{ width: '100%', padding: '1rem 1.2rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: '600', minHeight: '100px', resize: 'none' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
                style={{ marginTop: '1rem', padding: '1.2rem', fontWeight: '800', borderRadius: '14px' }}
              >
                {submitting ? 'Submitting...' : 'Submit Transfer Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .input-group input:focus, .input-group textarea:focus { border-color: var(--accent-primary); outline: none; background: var(--bg-secondary); }
      `}</style>
    </div>
  );
};

export default Transfers;
