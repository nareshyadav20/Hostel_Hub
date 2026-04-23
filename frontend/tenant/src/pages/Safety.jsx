import React from 'react';

const Safety = () => {
  const handleSOS = () => {
    alert('🚨 SOS ALERT SENT! Emergency contacts and hostel management have been notified with your live location.');
  };

  return (
    <div className="safety-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🛡️ Safety & Security</h1>
        <p>Your safety is our top priority. Use these tools in case of any emergency or concern.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* SOS Section */}
        <div className="card" style={{ 
          textAlign: 'center', 
          padding: '3rem 2rem', 
          background: 'rgba(239, 68, 68, 0.05)', 
          border: '2px solid rgba(239, 68, 68, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            background: 'var(--accent-error)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)',
            marginBottom: '1.5rem',
            transition: 'transform 0.2s'
          }}
          onClick={handleSOS}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            SOS
          </div>
          <h2 style={{ color: 'var(--accent-error)' }}>Emergency SOS</h2>
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Press and hold for 2 seconds to alert emergency services and hostel staff.</p>
        </div>

        {/* Support & Contacts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h3>📞 Emergency Contacts</h3>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>Hostel Warden</span>
                <strong>+91 98765 43210</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>Security Desk</span>
                <strong>+91 98765 43211</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span>Police / PCR</span>
                <strong>100 / 112</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span>Ambulance</span>
                <strong>102</strong>
              </div>
            </div>
          </div>

          <div className="card" style={{ background: 'var(--accent-primary)', color: 'white' }}>
            <h3 style={{ color: 'white' }}>💬 Live Support</h3>
            <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>Chat with our 24/7 safety response team for any immediate concerns.</p>
            <button className="btn" style={{ background: 'white', color: 'var(--accent-primary)', marginTop: '1rem', width: '100%', border: 'none' }}>Start Live Chat</button>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>📝 Report an Incident</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Reporting helps us maintain a safe environment for everyone.</p>
        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label>Incident Type</label>
            <select className="btn" style={{ border: '1px solid var(--border-color)', width: '100%', textAlign: 'left' }}>
              <option>Theft / Missing Item</option>
              <option>Harassment</option>
              <option>Maintenance Emergency</option>
              <option>Unsafe Behavior</option>
              <option>Other</option>
            </select>
          </div>
          <div className="input-group">
            <label>Location of Incident</label>
            <input type="text" placeholder="e.g. Floor 2, Common Room" />
          </div>
          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Description</label>
            <textarea rows="4" placeholder="Provide details about what happened..."></textarea>
          </div>
          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label>Upload Evidence (Optional)</label>
            <input type="file" />
          </div>
          <button type="button" className="btn btn-primary" style={{ gridColumn: 'span 2', padding: '1rem' }}>Submit Confidential Report</button>
        </form>
      </div>
    </div>
  );
};

export default Safety;
