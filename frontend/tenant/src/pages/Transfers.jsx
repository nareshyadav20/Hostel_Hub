import React from 'react';
import API from '../api/axios';

const Transfers = () => {
  const currentRoom = {
    hostel: 'Green View Hostel',
    room: '201',
    type: '2 Sharing'
  };

  const requestStatus = 'No Active Requests';

  const [showForm, setShowForm] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [transfers, setTransfers] = React.useState([]);
  const [tenantData, setTenantData] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: '',
    oldRoom: '',
    newRoom: '',
    reason: ''
  });

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, transfersRes] = await Promise.all([
        API.get('/tenants/me'),
        API.get('/transfers/me')
      ]);
      setTenantData(profileRes.data);
      setTransfers(transfersRes.data);
      setFormData(prev => ({
        ...prev,
        name: profileRes.data.name,
        oldRoom: profileRes.data.room || 'Not Assigned'
      }));
    } catch (err) {
      console.error('Error fetching transfer data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestTransfer = () => setShowForm(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      const response = await API.post('/transfers', formData);
      setTransfers([response.data, ...transfers]);
      setShowForm(false);
      setFormData({ newRoom: '', reason: '' });
      alert('Transfer Request Submitted Successfully!');
    } catch (err) {
      console.error('Error submitting transfer:', err);
      alert('Failed to submit transfer request.');
      setSubmitted(false);
    }
  };

  return (
    <div className="transfers-page fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' }}>🔄 Room Transfer</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Request to move to a different room or building within the Livora network.</p>
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

      {/* ── Recent History ── */}
      <div style={{ marginTop: '4rem' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem' }}>Recent History</h3>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading history...</p>
        ) : transfers.length === 0 ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', borderRadius: '20px' }}>
            No previous transfer requests found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transfers.map(t => (
              <div key={t._id} className="card" style={{ padding: '1.5rem 2rem', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{new Date(t.createdAt).toLocaleDateString()}</p>
                  <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                    {t.oldRoom} <span style={{ color: 'var(--text-muted)', margin: '0 0.5rem' }}>→</span> {t.newRoom}
                  </p>
                </div>
                <div style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '100px', 
                  fontSize: '0.8rem', 
                  fontWeight: '800',
                  background: t.status === 'Approved' ? 'rgba(16, 185, 129, 0.1)' : t.status === 'Rejected' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: t.status === 'Approved' ? 'var(--accent-success)' : t.status === 'Rejected' ? 'var(--accent-error)' : 'var(--accent-warning)'
                }}>
                  {t.status.toUpperCase()}
                </div>
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
                  placeholder="e.g. Need more space, current room has issues..."
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
