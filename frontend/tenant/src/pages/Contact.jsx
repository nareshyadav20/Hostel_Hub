import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Contact = () => {
  const navigate = useNavigate();

  return (
    <div className="hv2-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600;700;800&display=swap');
        
        .contact-page {
          font-family: 'Inter', sans-serif;
          color: #1f2937;
          background: #fcfcfd;
        }

        .contact-hero {
          background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
          padding: 10rem 2rem 4rem;
          text-align: center;
        }

        .contact-tag {
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
        }

        .contact-title {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          color: #111827;
        }

        .contact-subtitle {
          font-size: 1.1rem;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 4rem;
          max-width: 1200px;
          margin: 4rem auto 8rem;
          padding: 0 2rem;
        }

        .contact-info-panel {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .info-card {
          background: white;
          padding: 2rem;
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          border: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateX(10px);
          border-color: #4f46e5;
        }

        .info-icon {
          width: 60px;
          height: 60px;
          background: #eef2ff;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: #4f46e5;
        }

        .info-content h4 {
          font-size: 0.8rem;
          font-weight: 800;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.3rem;
        }

        .info-content p {
          font-size: 1.2rem;
          font-weight: 700;
          color: #111827;
        }

        .contact-form-wrap {
          background: white;
          padding: 4rem;
          border-radius: 40px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.06);
          border: 1px solid #f1f5f9;
        }

        .form-title {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 2.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .pro-input {
          padding: 1.2rem 1.5rem;
          border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .pro-input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .submit-btn {
          background: #4f46e5;
          color: white;
          padding: 1.2rem;
          border-radius: 16px;
          font-weight: 800;
          font-size: 1.1rem;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .submit-btn:hover {
          background: #4338ca;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
        }

        @media (max-width: 1024px) {
          .contact-grid { grid-template-columns: 1fr; }
          .contact-form-wrap { padding: 2.5rem; }
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

      <main className="contact-page">
        <section className="contact-hero">
          <span className="contact-tag">Get in Touch</span>
          <h1 className="contact-title">We're Here to Help</h1>
          <p className="contact-subtitle">Have questions about our properties or your stay? Our team is ready to assist you 24/7.</p>
        </section>

        <section className="contact-grid">
          <div className="contact-info-panel">
            <div className="info-card">
              <div className="info-icon">📞</div>
              <div className="info-content">
                <h4>Call or WhatsApp</h4>
                <p>+91 98765 43213</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📧</div>
              <div className="info-content">
                <h4>Email Support</h4>
                <p>hello@livora.com</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">📍</div>
              <div className="info-content">
                <h4>Headquarters</h4>
                <p>Bangalore, India</p>
              </div>
            </div>
            <div className="info-card" style={{marginTop: 'auto', background: '#4f46e5', color: 'white'}}>
              <div className="info-content">
                <h4 style={{color: 'rgba(255,255,255,0.7)'}}>Live Chat</h4>
                <p style={{color: 'white'}}>Average response: 2 mins</p>
              </div>
              <span style={{fontSize: '2rem', marginLeft: 'auto'}}>⚡</span>
            </div>
          </div>

          <div className="contact-form-wrap">
            <h3 className="form-title">Send us a Message</h3>
            <div className="input-group">
              <input className="pro-input" placeholder="Full Name" />
              <input className="pro-input" placeholder="Email Address" />
              <input className="pro-input" placeholder="Phone Number (Optional)" />
              <textarea className="pro-input" placeholder="How can we help you today?" rows="4" style={{resize: 'none'}}></textarea>
              <button className="submit-btn">Submit Inquiry</button>
            </div>
          </div>
        </section>
      </main>

      <footer className="hv2-footer">
        <div className="hv2-footer-bottom-line">
          <p>© 2026 Livora. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
