import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Contact = () => {
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
        <div className="hv2-section-head">
          <span className="hv2-tag">Support</span>
          <h2 className="hv2-section-title">We're Here to Help</h2>
          <p className="hv2-section-sub">Have questions or need assistance? Reach out to us anytime.</p>
        </div>

        <div className="hv2-stats-wrap" style={{marginTop: '4rem', marginBottom: '4rem'}}>
          <div className="hv2-stats-bar">
            <div className="hv2-stat">
              <div className="hv2-stat-icon-wrap">📞</div>
              <div>
                <div className="hv2-stat-val">+91 98765 43213</div>
                <div className="hv2-stat-lbl">Call or WhatsApp</div>
              </div>
            </div>
            <div className="hv2-stat-sep" />
            <div className="hv2-stat">
              <div className="hv2-stat-icon-wrap">📧</div>
              <div>
                <div className="hv2-stat-val">hello@livora.com</div>
                <div className="hv2-stat-lbl">Email Support</div>
              </div>
            </div>
            <div className="hv2-stat-sep" />
            <div className="hv2-stat">
              <div className="hv2-stat-icon-wrap">📍</div>
              <div>
                <div className="hv2-stat-val">Bangalore, India</div>
                <div className="hv2-stat-lbl">Headquarters</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{maxWidth: '600px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '30px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)'}}>
          <h3 style={{fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center', fontFamily: 'Playfair Display'}}>Send us a Message</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            <input placeholder="Your Name" style={{padding: '1rem', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none'}} />
            <input placeholder="Your Email" style={{padding: '1rem', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none'}} />
            <textarea placeholder="How can we help?" rows="4" style={{padding: '1rem', borderRadius: '12px', border: '1px solid #e5e7eb', outline: 'none', resize: 'none'}}></textarea>
            <button className="hv2-btn-primary" style={{width: '100%'}}>Submit Inquiry</button>
          </div>
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

export default Contact;
