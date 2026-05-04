import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const About = () => {
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
          <span className="hv2-tag">Our Story</span>
          <h2 className="hv2-section-title">Redefining Modern Living</h2>
          <p className="hv2-section-sub" style={{maxWidth: '800px', margin: '0 auto'}}>
            At Livora, we believe your stay should be more than just a roof over your head. It should be a place where you thrive, connect, and feel at home from day one.
          </p>
        </div>

        <div className="hv2-why-inner" style={{marginTop: '4rem'}}>
          <div className="hv2-why-left">
            <h3 style={{fontSize: '2rem', marginBottom: '1.5rem', fontFamily: 'Playfair Display'}}>Our Mission</h3>
            <p style={{fontSize: '1.1rem', color: '#4b5563', lineHeight: '1.8', marginBottom: '2rem'}}>
              Launched in 2024, Livora was born out of a simple observation: finding quality, safe, and community-driven accommodation for students and professionals was unnecessarily hard. We set out to change that by building a network of premium hostels and PGs that prioritize your comfort and peace of mind.
            </p>
            <div className="hv2-features-grid">
              <div className="hv2-feat-item">
                <div className="hv2-feat-icon">🏠</div>
                <div>
                  <div className="hv2-feat-title">Quality First</div>
                  <div className="hv2-feat-desc">Every property is hand-picked and verified.</div>
                </div>
              </div>
              <div className="hv2-feat-item">
                <div className="hv2-feat-icon">🤝</div>
                <div>
                  <div className="hv2-feat-title">Community Driven</div>
                  <div className="hv2-feat-desc">Connect with people who share your journey.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="hv2-why-right">
             <div style={{background: '#EEF2FF', width: '100%', height: '400px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem'}}>🏢</div>
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

export default About;
