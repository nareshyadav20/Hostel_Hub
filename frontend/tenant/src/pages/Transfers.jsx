import React from 'react';

const Transfers = () => {
  const currentRoom = {
    hostel: 'Green View Hostel',
    room: '201',
    type: '2 Sharing'
  };

  const requestStatus = 'No Active Requests';

  const [showForm, setShowForm] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: 'uma',
    oldRoom: currentRoom.room,
    newRoom: ''
  });

  const handleRequestTransfer = () => setShowForm(true);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      alert('Transfer Request Submitted Successfully!');
    }, 2000);
  };

  return (
    <div className="transfers-page fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' }}>🔄 Room Transfer</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Request to move to a different room or building within the StayNest network.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.4rem', fontWeight: '800' }}>Current Residency</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>Hostel Unit</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>{currentRoom.hostel}</p>
            </div>
            <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>Assigned Room / Type</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>{currentRoom.room} <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({currentRoom.type})</span></p>
            </div>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem', borderRadius: '24px', background: 'linear-gradient(145deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent-primary)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5"/><path d="M8 21H3v-5"/><path d="M12 21l9-9"/><path d="M3 3l9 9"/></svg>
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

      {/* ── Transfer Request Modal ── */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1.5rem' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '3rem', borderRadius: '32px', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', animation: 'authFadeIn 0.4s ease-out' }}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.5rem' }}>Transfer Form</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Please provide the details for your room shift.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '1rem 1.2rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: '600' }}
                  required 
                />
              </div>

              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>Current Room Name</label>
                <input 
                  type="text" 
                  value={formData.oldRoom} 
                  readOnly
                  style={{ width: '100%', padding: '1rem 1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-muted)', fontWeight: '600', cursor: 'not-allowed' }}
                />
              </div>

              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>Shift to New Room (Target)</label>
                <input 
                  type="text" 
                  placeholder="e.g. 402-B or Premium Single"
                  value={formData.newRoom} 
                  onChange={(e) => setFormData({...formData, newRoom: e.target.value})}
                  style={{ width: '100%', padding: '1rem 1.2rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: '600' }}
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={submitted}
                style={{ marginTop: '1rem', padding: '1.2rem', fontWeight: '800', borderRadius: '14px', position: 'relative', overflow: 'hidden' }}
              >
                {submitted ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '18px', height: '18px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                    Submitting...
                  </div>
                ) : 'Submit Transfer Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .input-group input:focus { border-color: var(--accent-primary); outline: none; background: var(--bg-secondary); }
      `}</style>
    </div>
  );
};

export default Transfers;
