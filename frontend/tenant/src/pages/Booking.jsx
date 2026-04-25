import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Booking = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    roomType: 'Single', bed: 'A', duration: '6', moveInDate: '',
    aadhar: null, agreementSigned: false
  });

  const isFull = formData.roomType === 'Single'; // mock logic for waitlist

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
    
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex > -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('mock_users', JSON.stringify(users));
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="booking-page fade-in">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.5rem' }}>Secure Your Stay</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Complete your booking in three simple, secure steps.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 300px) 1fr', gap: '2.5rem' }}>
        {/* Progress Tracker */}
        <aside className="glass-card" style={{ padding: '2rem', height: 'fit-content', position: 'sticky', top: '100px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '2rem' }}>Steps</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { id: 1, label: 'Preferences', icon: '🏠' },
              { id: 2, label: 'Verification', icon: '📝' },
              { id: 3, label: 'Confirmation', icon: '💳' }
            ].map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', opacity: step >= s.id ? 1 : 0.4 }}>
                <div style={{ 
                  width: '40px', height: '40px', borderRadius: '12px', 
                  background: step === s.id ? 'var(--accent-primary)' : step > s.id ? 'var(--accent-success)' : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800',
                  color: step >= s.id ? 'white' : 'var(--text-muted)',
                  boxShadow: step === s.id ? '0 10px 20px rgba(14, 165, 233, 0.2)' : 'none'
                }}>
                  {step > s.id ? '✓' : s.id}
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', fontWeight: '700', color: step === s.id ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{s.label}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{step === s.id ? 'In Progress' : step > s.id ? 'Completed' : 'Upcoming'}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Form Area */}
        <div className="glass-card" style={{ padding: '3rem' }}>
          
          {step === 1 && (
            <div className="fade-in">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2.5rem' }}>Select Room & Stay Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div className="input-group">
                  <label style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Room Type</label>
                  <select name="roomType" value={formData.roomType} onChange={handleChange} style={{ width: '100%', marginTop: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                    <option value="Single">Single Elite (Waitlist)</option>
                    <option value="Double">Luxury 2 Sharing</option>
                    <option value="Triple">Comfort 3 Sharing</option>
                  </select>
                </div>
                <div className="input-group">
                  <label style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Bed Preference</label>
                  <select name="bed" value={formData.bed} onChange={handleChange} style={{ width: '100%', marginTop: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem', color: 'var(--text-primary)', fontWeight: '600' }} disabled={isFull}>
                    <option value="A">Bed A (Premium Window)</option>
                    <option value="B">Bed B (Standard)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Stay Duration (Months)</label>
                  <input type="number" name="duration" value={formData.duration} onChange={handleChange} min="1" max="12" style={{ width: '100%', marginTop: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }} />
                </div>
                <div className="input-group">
                  <label style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Move-In Date</label>
                  <input type="date" name="moveInDate" value={formData.moveInDate} onChange={handleChange} style={{ width: '100%', marginTop: '0.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }} />
                </div>
              </div>
              
              {isFull && (
                <div style={{ background: 'rgba(251, 191, 36, 0.05)', padding: '1.5rem', borderRadius: '16px', color: 'var(--accent-warning)', marginTop: '2.5rem', border: '1px solid rgba(251, 191, 36, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <p style={{ fontWeight: '600' }}>This room category is currently full. You will be added to the high-priority waitlist.</p>
                </div>
              )}

              <button className="btn btn-primary" style={{ marginTop: '3rem', width: '100%', padding: '1.2rem', fontWeight: '800' }} onClick={() => setStep(2)}>
                {isFull ? 'Join Waitlist & Proceed' : 'Next: Verification'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2.5rem' }}>Verification & Digital Agreement</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                <div className="input-group">
                  <label style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>ID Proof (Aadhar/PAN)</label>
                  <div style={{ marginTop: '0.5rem', border: '2px dashed var(--border-color)', borderRadius: '16px', padding: '2rem', textAlign: 'center', background: 'var(--bg-secondary)', cursor: 'pointer' }}>
                    <span style={{ fontSize: '2rem' }}>📁</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Click or drag to upload</p>
                  </div>
                </div>
                <div className="input-group">
                  <label style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Passport Photo</label>
                  <div style={{ marginTop: '0.5rem', border: '2px dashed var(--border-color)', borderRadius: '16px', padding: '2rem', textAlign: 'center', background: 'var(--bg-secondary)', cursor: 'pointer' }}>
                    <span style={{ fontSize: '2rem' }}>📸</span>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Capture or upload photo</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-card" style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '20px', marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Digital Rental Agreement
                </h4>
                <div style={{ height: '180px', overflowY: 'scroll', paddingRight: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  <p>1. The tenant agrees to adhere to all house rules and scheduled timings.</p>
                  <p>2. Rent must be paid by the 5th of each month via the portal.</p>
                  <p>3. Security deposit is refundable subject to property inspection.</p>
                  <p>4. Noise levels must be kept minimum during quiet hours (11 PM - 6 AM).</p>
                  <p>5. Guests are allowed in common areas until 9 PM.</p>
                  <p>6. Any damage to property will be deducted from the security deposit.</p>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '1rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '12px', border: '1px solid rgba(14, 165, 233, 0.1)' }}>
                <input type="checkbox" name="agreementSigned" checked={formData.agreementSigned} onChange={handleChange} style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>I confirm that I have read and accepted the Digital Rental Agreement.</span>
              </label>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1, padding: '1.2rem' }} onClick={() => setStep(1)}>Go Back</button>
                <button className="btn btn-primary" style={{ flex: 2, padding: '1.2rem', fontWeight: '800' }} onClick={() => {
                  updateUserCompletion(75);
                  setStep(3);
                }} disabled={!formData.agreementSigned}>Continue to Payment</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in">
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2.5rem' }}>Reservation Payment</h3>
              <div className="glass-card" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', fontSize: '1.1rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Token Advance</span>
                  <span style={{ fontWeight: '800' }}>₹2,000.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Processing Fee</span>
                  <span style={{ fontWeight: '800' }}>₹50.00</span>
                </div>
                <div style={{ height: '1px', background: 'var(--border-color)', margin: '2rem 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: '800' }}>Total Payable</span>
                  <span style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--accent-primary)' }}>₹2,050.00</span>
                </div>
              </div>
              
              <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ fontSize: '1.8rem' }}>🛡️</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Your token amount is 100% secure. It will be adjusted against your first month's total move-in cost.</p>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3.5rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1, padding: '1.2rem' }} onClick={() => setStep(2)}>Back</button>
                <button className="btn btn-primary" style={{ flex: 2, padding: '1.2rem', fontWeight: '800', boxShadow: '0 15px 30px rgba(14, 165, 233, 0.2)' }} onClick={() => {
                  updateUserCompletion(100);
                  alert('Booking Confirmed! Receipt Generated. Profile 100% Complete.');
                  navigate('/dashboard');
                }}>Pay & Confirm Booking</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Booking;
