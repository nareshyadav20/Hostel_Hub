import React, { useState, useRef, useEffect } from 'react';

const Safety = () => {
  const [sosProgress, setSosProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [incidentSubmitted, setIncidentSubmitted] = useState(false);
  const timerRef = useRef(null);

  const startHolding = () => {
    setIsHolding(true);
    let start = Date.now();
    timerRef.current = setInterval(() => {
      let elapsed = Date.now() - start;
      let progress = Math.min((elapsed / 2000) * 100, 100);
      setSosProgress(progress);
      if (progress >= 100) {
        clearInterval(timerRef.current);
        alert('🚨 SOS ALERT SENT! Emergency services and Livora management have been notified with your live location.');
        setSosProgress(0);
        setIsHolding(false);
      }
    }, 20);
  };

  const stopHolding = () => {
    clearInterval(timerRef.current);
    setIsHolding(false);
    setSosProgress(0);
  };

  const [formData, setFormData] = useState({
    type: 'Theft / Missing Item',
    location: '',
    description: '',
  });

  const handleIncidentSubmit = (e) => {
    e.preventDefault();
    setIncidentSubmitted(true);
    setTimeout(() => {
      setIncidentSubmitted(false);
      alert('Your confidential report has been submitted to the Livora Safety Team.');
      setFormData({ type: 'Theft / Missing Item', location: '', description: '' });
    }, 2000);
  };

  return (
    <div className="safety-page fade-in" style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '950', letterSpacing: '-1.5px', marginBottom: '0.5rem', background: 'linear-gradient(to right, #f43f5e, #fb7185)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🛡️ Safety & SOS Center</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '500' }}>Your security is the heart of Livora. Instant response, 24/7 protection.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* ── SOS Action Card ── */}
        <div className="glass-card" style={{ 
          textAlign: 'center', 
          padding: '2.5rem 2rem', 
          background: 'rgba(244, 63, 94, 0.02)', 
          border: '1px solid rgba(244, 63, 94, 0.12)',
          borderRadius: '32px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'rgba(244, 63, 94, 0.08)' }}>
            <div style={{ width: `${sosProgress}%`, height: '100%', background: '#f43f5e', transition: 'width 0.05s linear' }}></div>
          </div>

          <div 
            style={{ 
              width: '140px', 
              height: '140px', 
              background: isHolding ? '#e11d48' : '#f43f5e', 
              borderRadius: '50%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              boxShadow: isHolding ? '0 0 50px rgba(244, 63, 94, 0.5)' : '0 12px 28px rgba(244, 63, 94, 0.25)',
              marginBottom: '1.5rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              userSelect: 'none',
              transform: isHolding ? 'scale(0.94)' : 'scale(1)',
              border: '6px solid rgba(255,255,255,0.1)'
            }}
            onMouseDown={startHolding}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={startHolding}
            onTouchEnd={stopHolding}
          >
            <span style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '1px' }}>SOS</span>
            <span style={{ fontSize: '0.65rem', fontWeight: '800', opacity: 0.8, marginTop: '0.2rem' }}>HOLD 2S</span>
          </div>
          
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#f43f5e' }}>Emergency SOS</h2>
          <p style={{ marginTop: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '300px', lineHeight: '1.5' }}>
            Alerting Warden, Security, and Emergency services immediately.
          </p>
        </div>

        {/* ── Emergency Directory & Live Support ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.6rem', background: 'rgba(14, 165, 233, 0.08)', color: 'var(--accent-primary)', borderRadius: '10px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.11-2.11a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '900' }}>Emergency Directory</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {[
                { label: 'Warden', phone: '+91 98765 43210' },
                { label: 'Security', phone: '+91 98765 43211' },
                { label: 'Police', phone: '112' },
                { label: 'Ambulance', phone: '102' }
              ].map((contact, idx) => (
                <div key={idx} style={{ padding: '0.8rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '14px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{contact.label}</span>
                    <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>{contact.phone}</span>
                  </div>
                  <button style={{ background: 'rgba(14, 165, 233, 0.08)', border: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', color: 'var(--accent-primary)', fontWeight: '800', cursor: 'pointer', fontSize: '0.75rem' }}>CALL</button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '24px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, #4f46e5 100%)', color: 'white', border: 'none' }}>
            <h3 style={{ color: 'white', fontSize: '1.1rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Live Support
            </h3>
            <p style={{ opacity: 0.9, marginBottom: '1rem', fontSize: '0.85rem' }}>Our team is available 24/7 for concerns.</p>
            <button className="btn" style={{ background: 'white', color: 'var(--accent-primary)', padding: '0.7rem', width: '100%', fontWeight: '900', borderRadius: '12px', border: 'none', fontSize: '0.85rem' }}>Start Live Chat</button>
          </div>
        </div>
      </div>

      {/* ── Incident Reporting Portal ── */}
      <div className="glass-card" style={{ padding: '2rem 2.5rem', borderRadius: '32px', border: '1px solid var(--border-color)' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '950', letterSpacing: '-1px', marginBottom: '0.4rem' }}>📝 Confidential Reporting</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>All reports are encrypted and handled with strict confidentiality.</p>
        </div>

        <form onSubmit={handleIncidentSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Classification</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                style={{ width: '100%', padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '14px', color: 'var(--text-primary)', fontWeight: '700', outline: 'none' }}
              >
                <option>Theft / Missing Item</option>
                <option>Harassment</option>
                <option>Maintenance Emergency</option>
                <option>Unsafe Behavior</option>
                <option>Other Concern</option>
              </select>
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Location</label>
              <input 
                type="text" 
                placeholder="e.g. Block B, 4th Floor" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                style={{ width: '100%', padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '14px', color: 'var(--text-primary)', fontWeight: '700', outline: 'none' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Detailed Report</label>
              <textarea 
                rows="4" 
                placeholder="Describe what happened..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ width: '100%', padding: '1rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '14px', color: 'var(--text-primary)', fontWeight: '600', outline: 'none', resize: 'none' }}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={incidentSubmitted}
              style={{ padding: '1.2rem', fontWeight: '950', borderRadius: '16px', fontSize: '1rem', marginTop: 'auto' }}
            >
              {incidentSubmitted ? '🔐 SECURING...' : 'SUBMIT REPORT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Safety;
