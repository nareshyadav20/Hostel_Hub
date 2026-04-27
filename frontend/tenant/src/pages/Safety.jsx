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
    <div className="safety-page fade-in" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '950', letterSpacing: '-2px', marginBottom: '0.8rem', background: 'linear-gradient(to right, #f43f5e, #fb7185)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🛡️ Safety & SOS Center</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '500' }}>Your security is the heart of Livora. Instant response, 24/7 protection.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
        {/* ── SOS Action Card ── */}
        <div className="glass-card" style={{ 
          textAlign: 'center', 
          padding: '4rem 3rem', 
          background: 'rgba(244, 63, 94, 0.03)', 
          border: '1px solid rgba(244, 63, 94, 0.15)',
          borderRadius: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '8px', background: 'rgba(244, 63, 94, 0.1)' }}>
            <div style={{ width: `${sosProgress}%`, height: '100%', background: '#f43f5e', transition: 'width 0.05s linear' }}></div>
          </div>

          <div 
            style={{ 
              width: '200px', 
              height: '200px', 
              background: isHolding ? '#e11d48' : '#f43f5e', 
              borderRadius: '50%', 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              boxShadow: isHolding ? '0 0 80px rgba(244, 63, 94, 0.6)' : '0 20px 45px rgba(244, 63, 94, 0.3)',
              marginBottom: '2.5rem',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              userSelect: 'none',
              transform: isHolding ? 'scale(0.92)' : 'scale(1)',
              border: '10px solid rgba(255,255,255,0.1)'
            }}
            onMouseDown={startHolding}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={startHolding}
            onTouchEnd={stopHolding}
          >
            <span style={{ fontSize: '4rem', fontWeight: '950', letterSpacing: '2px' }}>SOS</span>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', opacity: 0.8, marginTop: '0.5rem' }}>HOLD FOR 2S</span>
          </div>
          
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#f43f5e' }}>Emergency SOS</h2>
          <p style={{ marginTop: '1.2rem', color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '380px', lineHeight: '1.7' }}>
            Alerting Warden, Security, and Emergency services immediately. 
            <br />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Live GPS location will be shared automatically.</span>
          </p>
        </div>

        {/* ── Emergency Directory & Live Support ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2.5rem' }}>
              <div style={{ padding: '0.8rem', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-primary)', borderRadius: '14px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.11-2.11a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '900' }}>Emergency Directory</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
              {[
                { label: 'Hostel Warden', phone: '+91 98765 43210', status: 'Online' },
                { label: 'Security Desk', phone: '+91 98765 43211', status: '24/7' },
                { label: 'Police / PCR', phone: '112', status: 'Emergency' },
                { label: 'Ambulance', phone: '102', status: 'Medical' }
              ].map((contact, idx) => (
                <div key={idx} style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{contact.label}</span>
                    <div style={{ fontWeight: '900', fontSize: '1.2rem', marginTop: '0.2rem' }}>{contact.phone}</div>
                  </div>
                  <button style={{ background: 'rgba(14, 165, 233, 0.1)', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '12px', color: 'var(--accent-primary)', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.11-2.11a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    CALL
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2.5rem', borderRadius: '32px', background: 'linear-gradient(135deg, var(--accent-primary) 0%, #4f46e5 100%)', color: 'white', border: 'none', boxShadow: '0 20px 50px rgba(14, 165, 233, 0.3)' }}>
            <h3 style={{ color: 'white', fontSize: '1.6rem', fontWeight: '900', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Live Safety Support
            </h3>
            <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.05rem', lineHeight: '1.6' }}>Our safety response team is available 24/7 for any immediate concerns or safe walk requests.</p>
            <button className="btn" style={{ background: 'white', color: 'var(--accent-primary)', padding: '1.2rem', width: '100%', fontWeight: '950', borderRadius: '18px', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}>Start Live Chat Now</button>
          </div>
        </div>
      </div>

      {/* ── Incident Reporting Portal ── */}
      <div className="glass-card" style={{ padding: '4rem', borderRadius: '48px', border: '1px solid var(--border-color)' }}>
        <div style={{ marginBottom: '3.5rem' }}>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-1.5px', marginBottom: '0.8rem' }}>📝 Secure Incident Reporting</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '800px' }}>Your safety matters. All reports are confidential, encrypted, and reviewed by the Livora Ethics Committee.</p>
        </div>

        <form onSubmit={handleIncidentSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem' }}>Incident Classification</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                style={{ width: '100%', padding: '1.4rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '20px', color: 'var(--text-primary)', fontWeight: '700', outline: 'none', fontSize: '1rem' }}
              >
                <option>Theft / Missing Item</option>
                <option>Harassment</option>
                <option>Maintenance Emergency</option>
                <option>Unsafe Behavior</option>
                <option>Other Concern</option>
              </select>
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem' }}>Precise Location</label>
              <input 
                type="text" 
                placeholder="e.g. Block B, 4th Floor Study Room" 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                style={{ width: '100%', padding: '1.4rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '20px', color: 'var(--text-primary)', fontWeight: '700', outline: 'none', fontSize: '1rem' }}
                required
              />
            </div>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem' }}>Upload Evidence (Image/Video)</label>
              <div style={{ width: '100%', padding: '1.5rem', background: 'var(--bg-tertiary)', border: '2px dashed var(--border-color)', borderRadius: '20px', textAlign: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.5rem' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <div style={{ fontWeight: '700' }}>Drop files or click to upload</div>
                <input type="file" style={{ display: 'none' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem' }}>Detailed Report</label>
              <textarea 
                rows="8" 
                placeholder="Describe what happened with as much detail as possible. All information is confidential..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                style={{ width: '100%', padding: '1.4rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '20px', color: 'var(--text-primary)', fontWeight: '600', outline: 'none', resize: 'none', fontSize: '1rem', lineHeight: '1.6' }}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={incidentSubmitted}
              style={{ padding: '1.8rem', fontWeight: '950', borderRadius: '24px', fontSize: '1.2rem', boxShadow: '0 20px 40px rgba(14, 165, 233, 0.25)', marginTop: 'auto' }}
            >
              {incidentSubmitted ? '🔐 SECURING REPORT...' : 'SUBMIT CONFIDENTIAL REPORT'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Safety;
