import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="hv2-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700;800&display=swap');
        
        .legal-page {
          font-family: 'Inter', sans-serif;
          color: #1f2937;
          background: #f8fafc;
          min-height: 100vh;
        }

        .legal-hero {
          background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
          padding: 10rem 2rem 6rem;
          text-align: center;
          position: relative;
          color: white;
        }

        .legal-title {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .legal-subtitle {
          color: #d1d5db;
          font-size: 1.1rem;
        }

        .legal-content-wrap {
          max-width: 900px;
          margin: -3rem auto 4rem;
          background: white;
          padding: 4rem;
          border-radius: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          position: relative;
          z-index: 10;
        }

        .legal-section {
          margin-bottom: 3rem;
        }

        .legal-section:last-child {
          margin-bottom: 0;
        }

        .legal-section h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 800;
          color: #111827;
          margin-bottom: 1.2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .legal-section h3 span {
          background: #EEF2FF;
          color: #4f46e5;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          font-size: 1.2rem;
        }

        .legal-section p {
          font-size: 1.05rem;
          line-height: 1.8;
          color: #4b5563;
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
          .legal-title { font-size: 2.5rem; }
          .legal-content-wrap { padding: 2rem; margin: -2rem 1rem 4rem; }
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

      <main className="legal-page">
        <section className="legal-hero">
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-subtitle">Your privacy matters to us. Here's how we handle your data.</p>
        </section>

        <div className="legal-content-wrap">
          <div className="legal-section">
            <h3><span>1</span> Data Collection</h3>
            <p>We collect information you provide directly to us (name, contact details, ID proofs) when you book a room or contact support. This is necessary to provide and verify our services.</p>
          </div>

          <div className="legal-section">
            <h3><span>2</span> Data Usage</h3>
            <p>Your data is used to process bookings, communicate updates, and ensure safety within our property network. We do not sell your personal data to third-party advertisers.</p>
          </div>

          <div className="legal-section">
            <h3><span>3</span> Security</h3>
            <p>We implement industry-standard encryption and security measures to protect your information from unauthorized access. However, no method of transmission over the internet is 100% secure.</p>
          </div>

          <div className="legal-section">
            <h3><span>4</span> Your Rights</h3>
            <p>You have the right to access, update, or delete your personal information stored with us. Contact our support team to exercise these rights.</p>
          </div>
        </div>
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

export default Privacy;
