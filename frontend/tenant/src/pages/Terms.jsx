import React from 'react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        .legal-page {
          font-family: 'Inter', sans-serif;
          color: #374151;
          background: white;
          min-height: calc(100vh - 88px);
          padding: 2rem 2.5rem 3rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .legal-header {
          text-align: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1.2rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .legal-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #1e1b4b;
          margin-top: 0;
          margin-bottom: 0.25rem;
        }

        .legal-subtitle {
          color: #64748b;
          font-size: 0.95rem;
        }

        .legal-section {
          margin-bottom: 1.2rem;
        }

        .legal-section:last-child {
          margin-bottom: 0;
        }

        .legal-section h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.4rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legal-section h3 span {
          background: #EEF2FF;
          color: #4f46e5;
          min-width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 800;
        }

        .legal-section p {
          font-size: 0.95rem;
          line-height: 1.5;
          color: #4b5563;
          margin-left: 2rem;
        }

        .agree-btn-container {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
          text-align: center;
        }

        .agree-btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 0.7rem 2rem;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);
        }

        .agree-btn:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 6px 10px -2px rgba(79, 70, 229, 0.3);
        }

        @media (max-width: 768px) {
          .legal-page { padding: 1.5rem; }
          .legal-title { font-size: 1.5rem; }
          .legal-section p { margin-left: 0; margin-top: 0.4rem; }
        }
      `}</style>

      <main className="legal-page">
        <div className="legal-header">
          <h1 className="legal-title">Residency Agreement</h1>
          <p className="legal-subtitle">Terms &amp; Conditions of Livora Hostel</p>
        </div>

        <div className="legal-section">
          <h3><span>1</span> USER REGISTRATION &amp; ELIGIBILITY</h3>
          <p>Registration is free. By using this platform, you agree to these terms. You must be 18 years or older to register. Minors may only use the platform under parental supervision.</p>
        </div>

        <div className="legal-section">
          <h3><span>2</span> BOOKING &amp; PAYMENTS</h3>
          <p>Livora connects guests with independent hosts. Ensure your payment information is secure during booking. Rent is typically due by the 5th of every month. Late payments may incur a penalty.</p>
        </div>

        <div className="legal-section">
          <h3><span>3</span> PROPERTY RULES &amp; QUIET HOURS</h3>
          <p>Tenants are expected to maintain peace and respect the community. Quiet hours are generally from 10:00 PM to 6:00 AM. Loud music and disruptive behavior are strictly prohibited.</p>
        </div>

        <div className="legal-section">
          <h3><span>4</span> VISITORS &amp; SECURITY</h3>
          <p>For the safety of all residents, outside visitors are not allowed in residential areas or private rooms without prior approval from the hostel management. All guests must sign in at the reception.</p>
        </div>

        <div className="legal-section">
          <h3><span>5</span> MAINTENANCE &amp; DAMAGES</h3>
          <p>Tenants must take care of the provided furniture and appliances. Any intentional or negligent damages to the property will be deducted from the security deposit.</p>
        </div>

        <div className="legal-section">
          <h3><span>6</span> CODE OF CONDUCT</h3>
          <p>Strict prohibition of smoking, alcohol, and illegal substances on the premises. Violation of these rules may lead to immediate eviction without refund.</p>
        </div>

        <div className="agree-btn-container">
          <button className="agree-btn" onClick={() => navigate(-1)}>
            I Understand &amp; Agree
          </button>
        </div>
      </main>
    </>
  );
};

export default Terms;
