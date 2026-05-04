import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="hv2-root">
      <header className="hv2-header">
        <div className="hv2-logo" onClick={() => navigate('/')}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 9V20C3 20.55 3.21 21.04 3.59 21.41 3.96 21.79 4.47 22 5 22H19C19.53 22 20.04 21.79 20.41 21.41 20.79 21.04 21 20.55 21 20V9L12 2Z" fill="#4F46E5"/>
            <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="hv2-logo-text">Livora</span>
        </div>
        <button className="hv2-login-btn" onClick={() => navigate('/')}>Back to Home</button>
      </header>

      <section className="hv2-section" style={{paddingTop: '8rem'}}>
        <div className="hv2-section-head" style={{textAlign: 'left'}}>
          <h2 className="hv2-section-title">Privacy Policy</h2>
          <p className="hv2-section-sub">Your privacy matters to us. Here's how we handle your data.</p>
        </div>

        <div style={{maxWidth: '900px', background: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', marginTop: '3rem', color: '#4b5563', lineHeight: '1.8'}}>
          <h3 style={{color: '#1a1a2e', marginBottom: '1rem'}}>Data Collection</h3>
          <p style={{marginBottom: '2rem'}}>We collect information you provide directly to us (name, contact details, ID proofs) when you book a room or contact support. This is necessary to provide and verify our services.</p>

          <h3 style={{color: '#1a1a2e', marginBottom: '1rem'}}>Data Usage</h3>
          <p style={{marginBottom: '2rem'}}>Your data is used to process bookings, communicate updates, and ensure safety within our property network. We do not sell your personal data to third-party advertisers.</p>

          <h3 style={{color: '#1a1a2e', marginBottom: '1rem'}}>Security</h3>
          <p style={{marginBottom: '2rem'}}>We implement industry-standard encryption and security measures to protect your information from unauthorized access. However, no method of transmission over the internet is 100% secure.</p>

          <h3 style={{color: '#1a1a2e', marginBottom: '1rem'}}>Your Rights</h3>
          <p style={{marginBottom: '2rem'}}>You have the right to access, update, or delete your personal information stored with us. Contact our support team to exercise these rights.</p>
        </div>
      </section>

      <footer className="hv2-footer">
        <div className="hv2-footer-bottom-line">
          <p>© 2026 Livora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;
