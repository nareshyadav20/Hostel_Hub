import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Terms = () => {
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
          <h1 className="legal-title">Terms of Service</h1>
          <p className="legal-subtitle">Last Updated: May 2026</p>
        </section>

        <div className="legal-content-wrap">
          <div className="legal-section">
            <h3><span>1</span> Acceptance of Terms</h3>
            <p>By accessing and using Livora's platform, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using our services.</p>
          </div>

          <div className="legal-section">
            <h3><span>2</span> Booking & Payments</h3>
            <p>All bookings are subject to availability and verification. Payments must be made through our authorized channels to be considered valid. Refund policies vary by property type and duration of stay.</p>
          </div>

          <div className="legal-section">
            <h3><span>3</span> Code of Conduct</h3>
            <p>Residents are expected to maintain harmony and respect the rules of their respective properties. Any violation of property-specific rules may lead to termination of stay without refund.</p>
          </div>

          <div className="legal-section">
            <h3><span>4</span> Limitation of Liability</h3>
            <p>Livora acts as a marketplace connecting residents with property owners. While we verify properties, we are not liable for direct disputes between residents and property management beyond our platform's scope.</p>
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

export default Terms;
