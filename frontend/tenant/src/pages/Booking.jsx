import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── icons (SVG constants) ─── */
const ICONS = {
  Preferences: (props) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Verification: (props) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Confirmation: (props) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  Check: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"/></svg>,
  Alert: (props) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Shield: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
};

const Booking = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    roomType: 'Single', bed: 'A', duration: '6', moveInDate: '',
    aadhar: null, agreementSigned: false
  });

  const isFull = formData.roomType === 'Single';

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser.email) navigate('/login');
    setUser(storedUser);
  }, [navigate]);

  const updateUserCompletion = (newCompletion) => {
    if (user.profileCompletion >= newCompletion) return;
    const updatedUser = { ...user, profileCompletion: newCompletion };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const steps = [
    { id: 1, label: 'Preferences', icon: <ICONS.Preferences /> },
    { id: 2, label: 'Verification', icon: <ICONS.Verification /> },
    { id: 3, label: 'Confirmation', icon: <ICONS.Confirmation /> }
  ];

  return (
    <div className="booking-page-premium fade-in">
      <div className="booking-overlay"></div>
      
      <header className="booking-header">
        <h1 className="booking-title">Secure Your Stay</h1>
        <p className="booking-subtitle">Experience premium co-living. Complete your booking in three secure steps.</p>
      </header>

      <div className="booking-grid">
        {/* Progress Tracker Sidebar */}
        <aside className="booking-sidebar">
          <div className="steps-container glass-card">
            <h3 className="sidebar-title">Booking Progress</h3>
            <div className="steps-list">
              {steps.map(s => (
                <div key={s.id} className={`step-item ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
                  <div className="step-icon-wrapper">
                    {step > s.id ? <ICONS.Check /> : s.icon}
                  </div>
                  <div className="step-content">
                    <p className="step-label">{s.label}</p>
                    <p className="step-status">{step === s.id ? 'In Progress' : step > s.id ? 'Completed' : 'Upcoming'}</p>
                  </div>
                  {s.id < 3 && <div className="step-line"></div>}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="booking-content-area">
          <div className="form-wrapper glass-card">
            
            {step === 1 && (
              <div className="form-step fade-in">
                <div className="step-header">
                  <span className="step-badge">Step 01</span>
                  <h2 className="step-title">Room & Stay Details</h2>
                </div>

                <div className="pro-input-grid">
                  <div className="pro-input-group">
                    <label>Room Category</label>
                    <select name="roomType" value={formData.roomType} onChange={handleChange}>
                      <option value="Single">Single Elite (Waitlist)</option>
                      <option value="Double">Luxury 2 Sharing</option>
                      <option value="Triple">Comfort 3 Sharing</option>
                    </select>
                  </div>

                  <div className="pro-input-group">
                    <label>Bed Preference</label>
                    <select name="bed" value={formData.bed} onChange={handleChange} disabled={isFull}>
                      <option value="A">Bed A (Premium Window)</option>
                      <option value="B">Bed B (Standard)</option>
                    </select>
                  </div>

                  <div className="pro-input-group">
                    <label>Duration (Months)</label>
                    <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" max="12" />
                  </div>

                  <div className="pro-input-group">
                    <label>Move-In Date</label>
                    <input type="date" name="moveInDate" value={formData.moveInDate} onChange={handleChange} />
                  </div>
                </div>
                
                {isFull && (
                  <div className="waitlist-alert">
                    <ICONS.Alert />
                    <div>
                      <p className="alert-title">High Demand Alert</p>
                      <p className="alert-desc">This category is currently full. You will be added to our high-priority waitlist.</p>
                    </div>
                  </div>
                )}

                <button className="pro-btn-next" onClick={() => setStep(2)}>
                  {isFull ? 'Join Waitlist & Proceed' : 'Continue to Verification'}
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="form-step fade-in">
                <div className="step-header">
                  <span className="step-badge">Step 02</span>
                  <h2 className="step-title">Verification & Agreements</h2>
                </div>

                <div className="pro-upload-grid">
                  <div className="upload-box">
                    <div className="upload-icon">📁</div>
                    <label>ID Proof (Aadhar/PAN)</label>
                    <p>Click to upload document</p>
                  </div>
                  <div className="upload-box">
                    <div className="upload-icon">📸</div>
                    <label>Passport Photo</label>
                    <p>Capture from webcam</p>
                  </div>
                </div>
                
                <div className="agreement-section">
                  <div className="agreement-header">
                    <ICONS.Verification />
                    <h3>Digital Rental Agreement</h3>
                  </div>
                  <div className="agreement-body">
                    <p>1. The tenant agrees to adhere to all house rules and scheduled timings.</p>
                    <p>2. Rent must be paid by the 5th of each month via the portal.</p>
                    <p>3. Security deposit is refundable subject to property inspection.</p>
                    <p>4. Noise levels must be kept minimum during quiet hours.</p>
                    <p>5. Guests are allowed in common areas until 9 PM.</p>
                  </div>
                  <label className="agreement-checkbox">
                    <input type="checkbox" name="agreementSigned" checked={formData.agreementSigned} onChange={handleChange} />
                    <span className="checkmark"></span>
                    <span className="checkbox-text">I accept the terms and conditions of the rental agreement.</span>
                  </label>
                </div>

                <div className="step-actions">
                  <button className="pro-btn-back" onClick={() => setStep(1)}>Back</button>
                  <button className="pro-btn-next" onClick={() => { updateUserCompletion(75); setStep(3); }} disabled={!formData.agreementSigned}>
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-step fade-in">
                <div className="step-header">
                  <span className="step-badge">Step 03</span>
                  <h2 className="step-title">Reservation Payment</h2>
                </div>

                <div className="payment-summary-card">
                  <div className="summary-row">
                    <span>Token Advance</span>
                    <span>₹2,000</span>
                  </div>
                  <div className="summary-row">
                    <span>Service Fee</span>
                    <span>₹50</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="total-row">
                    <span>Total Amount</span>
                    <span className="total-val">₹2,050</span>
                  </div>
                </div>
                
                <div className="security-guarantee">
                  <ICONS.Shield />
                  <p>Your payment is secured with 256-bit encryption. The token amount is fully adjustable against your first rent.</p>
                </div>

                <div className="step-actions">
                  <button className="pro-btn-back" onClick={() => setStep(2)}>Back</button>
                  <button className="pro-btn-confirm" onClick={() => {
                    updateUserCompletion(100);
                    alert('Booking Confirmed! Welcome to your new home.');
                    navigate('/dashboard');
                  }}>Pay & Confirm Booking</button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      <style>{`
        .booking-page-premium {
          position: relative;
          min-height: 100vh;
          padding: 2rem 0;
          color: var(--text-primary);
        }

        .booking-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 10% 20%, rgba(14, 165, 233, 0.03) 0%, transparent 40%),
                      radial-gradient(circle at 90% 80%, rgba(99, 102, 241, 0.03) 0%, transparent 40%);
          z-index: -1;
        }

        .booking-header {
          margin-bottom: 4rem;
        }

        .booking-title {
          font-size: 3.2rem;
          font-weight: 950;
          letter-spacing: -2px;
          margin-bottom: 0.5rem;
          background: linear-gradient(to right, var(--text-primary), var(--text-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .booking-subtitle {
          font-size: 1.2rem;
          color: var(--text-muted);
          max-width: 600px;
        }

        .booking-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 4rem;
          align-items: start;
        }

        .sidebar-title {
          font-size: 1.1rem;
          font-weight: 800;
          margin-bottom: 2.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
        }

        .steps-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .step-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          opacity: 0.4;
          transition: all 0.4s ease;
        }

        .step-item.active { opacity: 1; transform: translateX(5px); }
        .step-item.completed { opacity: 0.8; }

        .step-icon-wrapper {
          width: 48px;
          height: 48px;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          transition: all 0.3s ease;
          z-index: 2;
        }

        .step-item.active .step-icon-wrapper {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
          box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3);
        }

        .step-item.completed .step-icon-wrapper {
          background: #22c55e;
          color: white;
          border-color: #22c55e;
        }

        .step-label {
          font-weight: 800;
          font-size: 1rem;
          margin: 0;
        }

        .step-status {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin: 0;
          font-weight: 600;
        }

        .step-line {
          position: absolute;
          left: 24px;
          top: 48px;
          width: 2px;
          height: 32px;
          background: var(--border-color);
        }

        .step-item.completed .step-line {
          background: #22c55e;
        }

        .form-wrapper {
          padding: 4rem;
          border-radius: 40px;
          min-height: 500px;
        }

        .step-header {
          margin-bottom: 3rem;
        }

        .step-badge {
          display: inline-block;
          padding: 0.4rem 1rem;
          background: rgba(14, 165, 233, 0.1);
          color: var(--accent-primary);
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.75rem;
          margin-bottom: 1rem;
        }

        .step-title {
          font-size: 2.2rem;
          font-weight: 900;
          margin: 0;
          letter-spacing: -1px;
        }

        .pro-input-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2.5rem;
        }

        .pro-input-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
          margin-bottom: 0.8rem;
        }

        .pro-input-group select, .pro-input-group input {
          width: 100%;
          padding: 1.2rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 18px;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .pro-input-group select:focus, .pro-input-group input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
        }

        .waitlist-alert {
          margin-top: 3rem;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(251, 191, 36, 0.02) 100%);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 24px;
          display: flex;
          gap: 1.5rem;
          align-items: center;
          color: #f59e0b;
        }

        .alert-title { font-weight: 800; font-size: 1.1rem; margin: 0; }
        .alert-desc { font-size: 0.95rem; margin: 0.2rem 0 0; opacity: 0.8; font-weight: 500; }

        .pro-btn-next {
          width: 100%;
          margin-top: 4rem;
          padding: 1.4rem;
          background: var(--accent-primary);
          color: white;
          border: none;
          border-radius: 20px;
          font-size: 1.1rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 15px 35px rgba(14, 165, 233, 0.2);
        }

        .pro-btn-next:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 45px rgba(14, 165, 233, 0.3);
        }

        .pro-upload-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .upload-box {
          background: var(--bg-tertiary);
          border: 2px dashed var(--border-color);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .upload-box:hover {
          border-color: var(--accent-primary);
          background: rgba(14, 165, 233, 0.02);
        }

        .upload-icon { font-size: 2.5rem; margin-bottom: 1rem; }
        .upload-box label { display: block; font-weight: 800; margin-bottom: 0.3rem; }
        .upload-box p { font-size: 0.85rem; color: var(--text-muted); margin: 0; }

        .agreement-section {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 28px;
          padding: 2.5rem;
        }

        .agreement-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          color: var(--accent-primary);
        }

        .agreement-header h3 { font-size: 1.2rem; font-weight: 800; margin: 0; }

        .agreement-body {
          height: 150px;
          overflow-y: auto;
          padding-right: 1rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 2rem;
        }

        .agreement-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 1.2rem;
          cursor: pointer;
          padding: 1.5rem;
          background: rgba(255,255,255,0.03);
          border-radius: 18px;
          border: 1px solid var(--border-color);
        }

        .checkbox-text { font-size: 0.95rem; font-weight: 600; line-height: 1.4; }

        .step-actions {
          display: flex;
          gap: 1.5rem;
          margin-top: 4rem;
        }

        .pro-btn-back {
          flex: 1;
          padding: 1.4rem;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 20px;
          color: var(--text-secondary);
          font-weight: 700;
          cursor: pointer;
        }

        .payment-summary-card {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 32px;
          padding: 3rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .summary-divider {
          height: 1px;
          background: var(--border-color);
          margin: 2.5rem 0;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 1.5rem;
          font-weight: 800;
        }

        .total-val {
          font-size: 3rem;
          font-weight: 950;
          color: var(--accent-primary);
        }

        .security-guarantee {
          margin-top: 3rem;
          display: flex;
          gap: 1.5rem;
          align-items: center;
          padding: 2rem;
          background: rgba(34, 197, 94, 0.05);
          border-radius: 24px;
          color: #22c55e;
        }

        .security-guarantee p { font-size: 0.95rem; line-height: 1.6; margin: 0; font-weight: 500; }

        .pro-btn-confirm {
          flex: 2;
          padding: 1.4rem;
          background: #22c55e;
          color: white;
          border: none;
          border-radius: 20px;
          font-size: 1.1rem;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 15px 35px rgba(34, 197, 94, 0.2);
        }

        @media (max-width: 1024px) {
          .booking-grid { grid-template-columns: 1fr; }
          .booking-sidebar { order: 2; }
          .pro-input-grid { grid-template-columns: 1fr; }
          .form-wrapper { padding: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default Booking;
