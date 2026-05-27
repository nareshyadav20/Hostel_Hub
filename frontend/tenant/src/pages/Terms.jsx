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

        .agree-btn-container {
          margin-top: 4rem;
          text-align: center;
        }

        .agree-btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 1rem 3rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Inter', sans-serif;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }

        .agree-btn:hover {
          background: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
        }

        @media (max-width: 768px) {
          .legal-title { font-size: 2.5rem; }
          .legal-content-wrap { padding: 2rem; margin: -2rem 1rem 4rem; }
          .about-footer-main { grid-template-columns: 1fr; gap: 2rem; }
          .about-footer-links { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
      `}</style>



      <main className="legal-page">
        <section className="legal-hero">
          <h1 className="legal-title">Livora Hostel Residency Agreement</h1>
          <p className="legal-subtitle">Last Updated: May 2026</p>
        </section>

        <div className="legal-content-wrap">
          <div className="legal-section">
            <h3><span>1</span> CONDITIONS FOR USER REGISTRATION</h3>
            <p>Registration on the platform is free. By using this website/app, you imply that you agree with the usage terms completely. You must be at least eighteen (18) years of age or above to use Livora Hostel services.</p>
          </div>

          <div className="legal-section">
            <h3><span>2</span> TERMS & CONDITIONS OF USE</h3>
            <p>The platform enables guests to connect with properties listed. By making a reservation at the listed properties, the guest enters into commercial/contractual terms as agreed upon at the time of booking.</p>
          </div>

          <div className="agree-btn-container">
            <button className="agree-btn" onClick={() => navigate(-1)}>
              I Understand & Agree
            </button>
          </div>
        </div>
      </main>


    </div>
  );
};

export default Terms;
