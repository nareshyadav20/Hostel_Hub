import React, { useState } from 'react';

const Booking = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    roomType: 'Single', bed: 'A', duration: '6', moveInDate: '',
    aadhar: null, agreementSigned: false
  });

  const isFull = formData.roomType === 'Single'; // mock logic for waitlist

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="booking-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🛏️ Booking & Move-In</h1>
        <p>Complete your booking securely in a few simple steps.</p>
      </header>

      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Progress Tracker */}
        <div className="card" style={{ width: '250px', height: 'fit-content' }}>
          <h3>Progress</h3>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
            <li style={{ color: step >= 1 ? 'var(--accent-primary)' : 'var(--text-muted)', marginBottom: '1rem', fontWeight: step >= 1 ? 'bold' : 'normal' }}>1. Room & Duration</li>
            <li style={{ color: step >= 2 ? 'var(--accent-primary)' : 'var(--text-muted)', marginBottom: '1rem', fontWeight: step >= 2 ? 'bold' : 'normal' }}>2. Documents & Agreement</li>
            <li style={{ color: step >= 3 ? 'var(--accent-primary)' : 'var(--text-muted)', marginBottom: '1rem', fontWeight: step >= 3 ? 'bold' : 'normal' }}>3. Token Payment</li>
          </ul>
        </div>

        {/* Form Area */}
        <div className="card" style={{ flex: 1, padding: '2rem' }}>
          
          {step === 1 && (
            <div>
              <h3>Select Room & Stay Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                <div className="input-group">
                  <label>Room Type</label>
                  <select name="roomType" value={formData.roomType} onChange={handleChange} className="btn" style={{ border: '1px solid var(--border-color)', width: '100%', textAlign: 'left' }}>
                    <option value="Single">Single Room (Waitlist)</option>
                    <option value="Double">2 Sharing</option>
                    <option value="Triple">3 Sharing</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Bed Preference</label>
                  <select name="bed" value={formData.bed} onChange={handleChange} className="btn" style={{ border: '1px solid var(--border-color)', width: '100%', textAlign: 'left' }} disabled={isFull}>
                    <option value="A">Bed A (Window)</option>
                    <option value="B">Bed B</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Stay Duration (Months)</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" max="12" />
                </div>
                <div className="input-group">
                  <label>Scheduled Move-In Date</label>
                  <input type="date" name="moveInDate" value={formData.moveInDate} onChange={handleChange} />
                </div>
              </div>
              
              {isFull ? (
                <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '1rem', borderRadius: '8px', color: 'var(--accent-warning)', marginTop: '1.5rem' }}>
                  <strong>Note:</strong> This room type is currently full. You can join the waitlist.
                </div>
              ) : null}

              <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => setStep(2)}>
                {isFull ? 'Join Waitlist & Continue' : 'Next: Documents'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3>Documents & Digital Agreement</h3>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="input-group">
                  <label>Upload ID Proof (Aadhar/PAN)</label>
                  <input type="file" style={{ padding: '0.6rem' }} />
                </div>
                <div className="input-group">
                  <label>Upload Passport Photo</label>
                  <input type="file" style={{ padding: '0.6rem' }} />
                </div>
                
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', height: '150px', overflowY: 'scroll', border: '1px solid var(--border-color)' }}>
                  <h4>Rental Agreement Terms</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    1. The tenant agrees to pay rent by the 5th of every month.<br/>
                    2. Security deposit is refundable subject to 30 days notice.<br/>
                    3. No smoking or consumption of alcohol on premises.<br/>
                    4. Hostel property damage will be deducted from the deposit.<br/>
                    ... (Standard legal terms)
                  </p>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input type="checkbox" name="agreementSigned" checked={formData.agreementSigned} onChange={handleChange} />
                  <span>I agree to the Digital Rental Agreement and house rules.</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!formData.agreementSigned}>Next: Payment</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3>Token Advance Payment</h3>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Token Amount</span>
                  <strong>₹2,000</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  <span>Platform Fee</span>
                  <strong>₹50</strong>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <span>Total Payable</span>
                  <span style={{ color: 'var(--accent-primary)' }}>₹2,050</span>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem' }}>This amount will be adjusted against your first month's rent or security deposit.</p>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-primary" onClick={() => alert('Payment Gateway Integration Pending')}>Pay & Book Instantly</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Booking;
