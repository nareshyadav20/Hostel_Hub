import React from 'react';

const Safety = () => {
  return (
    <div className="dashboard-container">
      <div className="welcome-section" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' }}>
        <div className="welcome-text">
          <h1 style={{ color: 'white' }}>Safety & SOS</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Quick access to emergency services and incident reporting.</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '3rem 0' }}>
        <button style={{ 
          width: '200px', height: '200px', borderRadius: '50%', background: '#ef4444', color: 'white', 
          border: '10px solid rgba(239, 68, 68, 0.2)', fontSize: '2.5rem', fontWeight: '900',
          cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)'
        }} 
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          SOS
        </button>
        <p style={{ marginTop: '1.5rem', fontWeight: '600', color: '#ef4444' }}>Press and hold for 3 seconds to alert management</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <h3>Emergency Contacts</h3>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
              <span>Warden Office</span>
              <strong>+91 12345 67890</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
              <span>Local Police</span>
              <strong>100</strong>
            </li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
              <span>Ambulance</span>
              <strong>102</strong>
            </li>
          </ul>
        </div>

        <div className="card">
          <h3>Report an Incident</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select style={{ padding: '0.8rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
              <option>Select Issue Type</option>
              <option>Theft</option>
              <option>Harassment</option>
              <option>Medical Emergency</option>
              <option>Facility Failure</option>
            </select>
            <textarea placeholder="Describe the incident..." style={{ padding: '0.8rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', minHeight: '100px' }}></textarea>
            <button className="btn" style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)' }}>Submit Report</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Safety;
