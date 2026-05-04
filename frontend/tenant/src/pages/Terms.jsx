import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Terms = () => {
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
          <h2 className="hv2-section-title">Terms of Service</h2>
          <p className="hv2-section-sub">Last Updated: May 2026</p>
        </div>

        <div style={{maxWidth: '900px', background: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', marginTop: '3rem', color: '#4b5563', lineHeight: '1.8'}}>
          <h3 style={{color: '#1a1a2e', marginBottom: '1rem'}}>1. Acceptance of Terms</h3>
          <p style={{marginBottom: '2rem'}}>By accessing and using Livora's platform, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using our services.</p>

          <h3 style={{color: '#1a1a2e', marginBottom: '1rem'}}>2. Booking & Payments</h3>
          <p style={{marginBottom: '2rem'}}>All bookings are subject to availability and verification. Payments must be made through our authorized channels to be considered valid. Refund policies vary by property type and duration of stay.</p>

          <h3 style={{color: '#1a1a2e', marginBottom: '1rem'}}>3. Code of Conduct</h3>
          <p style={{marginBottom: '2rem'}}>Residents are expected to maintain harmony and respect the rules of their respective properties. Any violation of property-specific rules may lead to termination of stay without refund.</p>

          <h3 style={{color: '#1a1a2e', marginBottom: '1rem'}}>4. Limitation of Liability</h3>
          <p style={{marginBottom: '2rem'}}>Livora acts as a marketplace connecting residents with property owners. While we verify properties, we are not liable for direct disputes between residents and property management beyond our platform's scope.</p>
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

export default Terms;
