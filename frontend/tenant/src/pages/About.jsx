import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="hv2-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700;800&display=swap');
        
        .about-page {
          font-family: 'Inter', sans-serif;
          color: #1f2937;
        }

        .about-hero {
          background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
          padding: 10rem 2rem 6rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .about-hero::before {
          content: '';
          position: absolute;
          top: -10%;
          right: -10%;
          width: 40%;
          height: 60%;
          background: radial-gradient(circle, rgba(79, 70, 229, 0.05) 0%, transparent 70%);
          z-index: 0;
        }

        .about-tag {
          display: inline-block;
          padding: 0.5rem 1.2rem;
          background: rgba(79, 70, 229, 0.1);
          color: #4f46e5;
          border-radius: 30px;
          font-weight: 800;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }

        .about-title {
          font-family: 'Playfair Display', serif;
          font-size: 4rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: #111827;
          position: relative;
          z-index: 1;
        }

        .about-subtitle {
          font-size: 1.25rem;
          color: #4b5563;
          max-width: 800px;
          margin: 0 auto;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          max-width: 1200px;
          margin: 6rem auto;
          padding: 0 2rem;
          align-items: center;
        }

        .about-img-wrap {
          position: relative;
        }

        .about-img {
          width: 100%;
          height: 500px;
          object-fit: cover;
          border-radius: 40px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
        }

        .about-floating-card {
          position: absolute;
          bottom: -30px;
          right: -30px;
          background: white;
          padding: 2rem;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          max-width: 200px;
          text-align: center;
        }

        .about-floating-val {
          display: block;
          font-size: 2.5rem;
          font-weight: 900;
          color: #4f46e5;
        }

        .about-floating-lbl {
          font-size: 0.9rem;
          font-weight: 600;
          color: #6b7280;
        }

        .about-content h3 {
          font-family: 'Playfair Display', serif;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
        }

        .about-content p {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #4b5563;
          margin-bottom: 2rem;
        }

        .about-features {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .about-feat-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .about-feat-icon {
          font-size: 1.8rem;
          background: #EEF2FF;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          flex-shrink: 0;
        }

        .about-feat-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.25rem;
        }

        .about-feat-desc {
          font-size: 1rem;
          color: #4B5563;
          line-height: 1.5;
        }

        .values-section {
          background: #111827;
          color: white;
          padding: 6rem 2rem;
          border-radius: 60px;
          margin: 4rem 2rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
          max-width: 1200px;
          margin: 4rem auto 0;
        }

        .value-card {
          text-align: center;
        }

        .value-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          display: block;
        }

        .value-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .value-desc {
          color: #9ca3af;
          line-height: 1.6;
          font-size: 1.05rem;
        }

        .about-footer {
          background: #f8fafc;
          padding: 4rem 2rem 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .about-footer-main {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
        }

        .about-footer-brand h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          color: #4f46e5;
          margin-bottom: 1rem;
        }

        .about-footer-tagline {
          color: #6b7280;
          line-height: 1.6;
          font-size: 1rem;
          max-width: 300px;
        }

        .about-footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .about-footer-col h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1.5rem;
        }

        .about-footer-col p, .about-footer-col a {
          color: #4b5563;
          font-size: 0.95rem;
          line-height: 1.8;
          display: block;
          text-decoration: none;
          margin-bottom: 0.5rem;
        }

        .about-footer-bottom {
          max-width: 1200px;
          margin: 3rem auto 0;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
          text-align: center;
          color: #9ca3af;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .about-title { font-size: 2.5rem; }
          .about-grid { grid-template-columns: 1fr; gap: 3rem; }
          .values-grid { grid-template-columns: 1fr; }
          .about-footer-main { grid-template-columns: 1fr; gap: 2rem; }
          .about-footer-links { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
      `}</style>

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

      <main className="about-page">
        <section className="about-hero">
          <span className="about-tag">Since 2024</span>
          <h1 className="about-title">Redefining Modern Living<br />One Stay at a Time.</h1>
          <p className="about-subtitle">
            At Livora, we believe your stay should be more than just a roof over your head. 
            It should be a place where you thrive, connect, and feel at home from day one.
          </p>
        </section>

        <section className="about-grid">
          <div className="about-img-wrap">
            <img 
              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000" 
              alt="Modern Living" 
              className="about-img" 
            />
            <div className="about-floating-card">
              <span className="about-floating-val">10k+</span>
              <span className="about-floating-lbl">Happy Residents</span>
            </div>
          </div>
          <div className="about-content">
            <h3>Our Mission</h3>
            <p>
              Launched in 2024, Livora was born out of a simple observation: finding quality, safe, and community-driven accommodation for students and professionals was unnecessarily hard.
            </p>
            <p>
              We set out to change that by building a network of premium hostels and PGs that prioritize your comfort and peace of mind. We combine technology with high-touch hospitality to create seamless living experiences.
            </p>
            <div className="about-features">
              <div className="about-feat-item">
                <div className="about-feat-icon">🏠</div>
                <div>
                  <div className="about-feat-title">Quality First</div>
                  <div className="about-feat-desc">Every property is hand-picked and verified for safety and comfort.</div>
                </div>
              </div>
              <div className="about-feat-item">
                <div className="about-feat-icon">🤝</div>
                <div>
                  <div className="about-feat-title">Community Driven</div>
                  <div className="about-feat-desc">Connect with people who share your journey and aspirations.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="values-section">
          <div className="hv2-section-head" style={{textAlign: 'center'}}>
            <span className="about-tag" style={{background: 'rgba(255,255,255,0.1)', color: 'white'}}>Core Values</span>
            <h2 className="hv2-section-title" style={{color: 'white', fontSize: '2.5rem', marginBottom: '1rem'}}>What We Stand For</h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <span className="value-icon">💎</span>
              <h4 className="value-title">Excellence</h4>
              <p className="value-desc">We never settle for "good enough". We strive for excellence in every detail of your stay.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🛡️</span>
              <h4 className="value-title">Trust</h4>
              <p className="value-desc">Transparency and reliability are the cornerstones of our relationship with residents.</p>
            </div>
            <div className="value-card">
              <span className="value-icon">🌱</span>
              <h4 className="value-title">Growth</h4>
              <p className="value-desc">We create environments that foster personal and professional growth for our community.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="about-footer">
        <div className="about-footer-main">
          <div className="about-footer-brand">
            <h2>Livora</h2>
            <p className="about-footer-tagline">Making living simple, safe, and hassle-free.</p>
          </div>
          <div className="about-footer-links">
            <div className="about-footer-col">
              <h4>Explore</h4>
              <a href="/about">About Us</a>
              <a href="/contact">Contact Us</a>
            </div>
            <div className="about-footer-col">
              <h4>Legal</h4>
              <a href="/terms">Terms of Service</a>
              <a href="/privacy">Privacy Policy</a>
            </div>
            <div className="about-footer-col">
              <h4>Contact Info</h4>
              <p>📍 Cyber Towers, Hitech City, Hyderabad</p>
              <p>📞 +91 7569383323</p>
              <p>✉️ support@livora.com</p>
            </div>
          </div>
        </div>
        <div className="about-footer-bottom">
          <p>© 2026 Livora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
