import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <style>{`
        .privacy-page {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #334155;
          background: #ffffff;
          min-height: calc(100vh - 88px);
          padding: 3rem 2.5rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .privacy-header {
          text-align: center;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .privacy-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-top: 0;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .privacy-subtitle {
          color: #64748b;
          font-size: 1.05rem;
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .privacy-section {
          margin-bottom: 2rem;
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .privacy-section:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          border-color: #e2e8f0;
        }

        .privacy-section h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .privacy-section h3 span {
          background: #eff6ff;
          color: #3b82f6;
          min-width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 700;
        }

        .privacy-section p {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #475569;
          margin: 0;
          padding-left: 2.5rem;
        }

        .privacy-footer {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 0.9rem;
          color: #94a3b8;
        }

        .privacy-footer a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
        }

        .privacy-footer a:hover {
          text-decoration: underline;
        }

        .back-btn-container {
          margin-bottom: 2rem;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          color: #64748b;
          border: 1px solid #e2e8f0;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.9rem;
        }

        .back-btn:hover {
          background: #f8fafc;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        @media (max-width: 768px) {
          .privacy-page { padding: 1.5rem; }
          .privacy-title { font-size: 1.8rem; }
          .privacy-section { padding: 1.25rem; }
          .privacy-section p { padding-left: 0; margin-top: 0.75rem; }
        }
      `}</style>

      <main className="privacy-page">
        <div className="back-btn-container">
          <button onClick={() => navigate(-1)} className="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </button>
        </div>

        <div className="privacy-header">
          <h1 className="privacy-title">Privacy Policy</h1>
          <p className="privacy-subtitle">We value your privacy. Here is how we collect, use, and protect your information.</p>
        </div>

        <div className="privacy-section">
          <h3><span>1</span> Information We Collect</h3>
          <p>We collect information you provide directly to us, such as your name, contact details, and ID proofs, when you book a room or contact our support team. This information is necessary for tenant verification and service provision.</p>
        </div>

        <div className="privacy-section">
          <h3><span>2</span> How We Use Your Data</h3>
          <p>Your data is strictly used to process bookings, manage your stay, communicate important updates, and ensure the safety of our community. We do not sell or share your personal information with third-party advertisers.</p>
        </div>

        <div className="privacy-section">
          <h3><span>3</span> Security Measures</h3>
          <p>We implement industry-standard encryption protocols and robust security measures to protect your information from unauthorized access. Regular audits are conducted to maintain a secure digital environment for all users.</p>
        </div>

        <div className="privacy-section">
          <h3><span>4</span> Your Digital Rights</h3>
          <p>You retain full rights to access, update, or permanently delete your personal information stored with us. If you wish to exercise these rights, please reach out to our dedicated privacy support team.</p>
        </div>

        <div className="privacy-footer">
          <p>Last updated: June 2026. For privacy concerns, contact us at <a href="mailto:privacy@hostelhub.com">privacy@hostelhub.com</a></p>
        </div>
      </main>
    </>
  );
};

export default Privacy;
