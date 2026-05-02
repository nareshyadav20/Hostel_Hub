import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const Booking = () => {
  const navigate = useNavigate();
  const { buildingId } = useParams();
  const idUploadRef = useRef(null);
  const photoUploadRef = useRef(null);
  
  const [user, setUser] = useState({});
  const [step, setStep] = useState(1);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(null);
  const [formData, setFormData] = useState({
    roomType: 'Double',
    bed: 'A',
    duration: '6',
    moveInDate: '',
    agreementSigned: false,
    idProof: null,
    profilePhoto: null
  });

  const roomOptions = [
    { id: 'Single', name: 'Single Elite', price: '18000', desc: 'Maximum Privacy & Luxury', icon: '💎', color: '#8b5cf6' },
    { id: 'Double', name: 'Luxury 2 Sharing', price: '12000', desc: 'Balanced Comfort & Community', icon: '✨', color: '#0ea5e9' },
    { id: 'Triple', name: 'Comfort 3 Sharing', price: '9000', desc: 'Social & Budget-Friendly', icon: '🤝', color: '#10b981' }
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);

    const fetchHostel = async () => {
      try {
        const res = await API.get(`/buildings/${buildingId}`);
        setHostel(res.data);
        // Set default room type if available
        if (res.data.floors?.[0]?.rooms?.[0]) {
          setFormData(prev => ({ ...prev, roomType: res.data.floors[0].rooms[0].roomNumber }));
        }
      } catch (err) {
        console.error('Error fetching hostel for booking:', err);
      } finally {
        setLoading(false);
      }
    };
    if (buildingId) fetchHostel();
    else setLoading(false);
  }, [navigate, buildingId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleFileUpload = (type, e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(type);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, [type]: file.name }));
      setIsUploading(null);
    }, 1500);
  };

  const currentRoom = roomOptions.find(r => r.id === formData.roomType) || roomOptions[1];

  if (!buildingId) {
    return (
      <div className="booking-page-premium fade-in dashboard-container">
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1.5px' }}>My Bookings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage your active stays and upcoming reservations.</p>
        </header>

        <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
          {user.room ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1.5rem' }}>Active Stay</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div className="summary-row">
                    <span>Hostel</span>
                    <strong style={{ color: 'var(--accent-primary)' }}>Elite Living</strong>
                  </div>
                  <div className="summary-row">
                    <span>Room Number</span>
                    <strong>{user.room}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Status</span>
                    <span className="badge badge-success" style={{ padding: '0.4rem 1rem' }}>ACTIVE</span>
                  </div>
                  <div className="summary-row">
                    <span>Move-in Date</span>
                    <strong>{user.moveInDate || '01-Jan-2026'}</strong>
                  </div>
                </div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem' }}>Financial Overview</h3>
                <div className="summary-row">
                  <span>Monthly Rent</span>
                  <strong>₹{user.rent || '6,500'}</strong>
                </div>
                <div className="summary-row">
                  <span>Due Date</span>
                  <strong>05-May-2026</strong>
                </div>
                <div className="summary-divider"></div>
                <Link to="/payments" className="btn btn-primary" style={{ textAlign: 'center', textDecoration: 'none', display: 'block', marginTop: '1rem' }}>View Full History</Link>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏠</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900' }}>No Active Booking</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>You haven't booked any hostel yet or your booking is pending approval.</p>
              <Link to="/search" className="btn btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '1rem 3rem', textDecoration: 'none' }}>Find a Hostel</Link>
            </div>
          )}
        </div>

        <style>{`
          .summary-row { display: flex; justify-content: space-between; font-size: 1.1rem; margin-bottom: 1rem; color: var(--text-secondary); }
          .summary-divider { height: 1px; background: var(--border-color); margin: 1.5rem 0; }
          .badge-success { background: rgba(34, 197, 94, 0.1); color: #22c55e; border-radius: 8px; font-weight: 800; font-size: 0.8rem; }
        `}</style>
      </div>
    );
  }

  if (loading) return <div className="dashboard-container"><div className="loading-spinner">Initializing booking...</div></div>;

  return (
    <div className="booking-page fade-in dashboard-container" style={{ position: 'relative', paddingBottom: '8rem' }}>
      <header style={{ marginBottom: '4.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '950', letterSpacing: '-3px', marginBottom: '1rem', background: 'linear-gradient(to right, #1e293b, #64748b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Finalize Your Stay
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: '500' }}>Your premium co-living experience is just a few steps away.</p>
      </header>

      {/* ── Progress Tracker ── */}
      <div className="progress-track">
        <div className="progress-bar-active" style={{ width: `${(step - 1) * 50}%` }}></div>
        {[
          { id: 1, label: 'Preferences' },
          { id: 2, label: 'Verification' },
          { id: 3, label: 'Payment' }
        ].map(s => (
          <div key={s.id} className={`step-node ${step === s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}>
            <div className="node-circle">
              {step > s.id ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> : s.id}
            </div>
            <span className="node-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="glass-card-premium" style={{ padding: '4rem', maxWidth: '1000px', margin: '0 auto' }}>
        {step === 1 && (
          <div className="fade-in">
            <div style={{ marginBottom: '3.5rem' }}>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '1.5rem' }}>Choose Your Sanctuary</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {roomOptions.map(room => (
                  <div key={room.id} className={`room-option ${formData.roomType === room.id ? 'active' : ''}`} onClick={() => setFormData({...formData, roomType: room.id})}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{room.icon}</div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1e293b' }}>{room.name}</h4>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>{room.desc}</p>
                    <div className="room-price">₹{parseInt(room.price).toLocaleString()}<span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}> / month</span></div>
                    {formData.roomType === room.id && (
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--accent-primary)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem' }}>Move-In Date</label>
                <input type="date" className="input-elite" name="moveInDate" value={formData.moveInDate} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '1rem' }}>Stay Duration</label>
                <select className="input-elite" name="duration" value={formData.duration} onChange={handleChange}>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months (Popular)</option>
                  <option value="12">1 Year</option>
                </select>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%', marginTop: '4rem', padding: '1.5rem', fontWeight: '950', borderRadius: '22px', fontSize: '1.2rem', boxShadow: '0 15px 30px rgba(14, 165, 233, 0.2)' }}>
              Continue to Verification
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '2.5rem' }}>Identity Verification</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
              <input type="file" ref={idUploadRef} style={{ display: 'none' }} onChange={(e) => handleFileUpload('idProof', e)} />
              <div className={`upload-card ${formData.idProof ? 'uploaded' : ''}`} onClick={() => !isUploading && idUploadRef.current.click()} style={{ position: 'relative' }}>
                {isUploading === 'idProof' && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '32px' }}>
                    <div className="spinner-mini" style={{ width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  </div>
                )}
                <div style={{ width: '64px', height: '64px', background: formData.idProof ? 'rgba(16, 185, 129, 0.1)' : 'rgba(14, 165, 233, 0.1)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: formData.idProof ? '#10b981' : 'var(--accent-primary)' }}>
                   {formData.idProof ? <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line></svg>}
                </div>
                <h4 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>{formData.idProof ? 'ID Proof Secured' : 'Upload ID Proof'}</h4>
                <p style={{ fontSize: '0.85rem', color: formData.idProof ? '#10b981' : '#94a3b8', fontWeight: formData.idProof ? '700' : '500' }}>
                  {formData.idProof ? `File: ${formData.idProof}` : 'Aadhar, PAN or Passport'}
                </p>
              </div>

              <input type="file" ref={photoUploadRef} style={{ display: 'none' }} onChange={(e) => handleFileUpload('profilePhoto', e)} />
              <div className={`upload-card ${formData.profilePhoto ? 'uploaded' : ''}`} onClick={() => !isUploading && photoUploadRef.current.click()} style={{ position: 'relative' }}>
                {isUploading === 'profilePhoto' && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '32px' }}>
                    <div className="spinner-mini" style={{ width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid var(--accent-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  </div>
                )}
                <div style={{ width: '64px', height: '64px', background: formData.profilePhoto ? 'rgba(16, 185, 129, 0.1)' : 'rgba(14, 165, 233, 0.1)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: formData.profilePhoto ? '#10b981' : 'var(--accent-primary)' }}>
                   {formData.profilePhoto ? <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> : <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>}
                </div>
                <h4 style={{ fontWeight: '800', marginBottom: '0.5rem' }}>{formData.profilePhoto ? 'Photo Verified' : 'Profile Photo'}</h4>
                <p style={{ fontSize: '0.85rem', color: formData.profilePhoto ? '#10b981' : '#94a3b8', fontWeight: formData.profilePhoto ? '700' : '500' }}>
                  {formData.profilePhoto ? `File: ${formData.profilePhoto}` : 'Clear portrait for gate pass'}
                </p>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '2.5rem', borderRadius: '32px', border: '1px solid #e2e8f0', marginBottom: '3rem' }}>
              <h4 style={{ fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Rental Agreement Summary
              </h4>
              <div style={{ maxHeight: '120px', overflowY: 'auto', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6', paddingRight: '1rem' }}>
                <p>• Standard move-out notice period is 30 days.</p>
                <p>• Security deposit is equivalent to 1 month's rent.</p>
                <p>• Electricity charges are calculated based on sub-meter usage.</p>
                <p>• House rules regarding visitors and quiet hours apply.</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.agreementSigned} onChange={e => setFormData({...formData, agreementSigned: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                <span style={{ fontWeight: '700', color: '#1e293b' }}>I have read and agree to the Digital Rental Agreement</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1, padding: '1.2rem', borderRadius: '18px', fontWeight: '800' }}>Back</button>
              <button onClick={() => setStep(3)} disabled={!formData.agreementSigned || !formData.idProof || !formData.profilePhoto} className="btn btn-primary" style={{ flex: 2, padding: '1.2rem', borderRadius: '18px', fontWeight: '900' }}>Proceed to Payment</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in">
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '2.5rem' }}>Booking Summary</h2>
            
            <div style={{ background: 'white', border: '1px solid #e2e8f0', color: '#1e293b', borderRadius: '32px', padding: '3.5rem', position: 'relative', overflow: 'hidden', marginBottom: '3rem', boxShadow: '0 15px 40px rgba(0,0,0,0.03)' }}>
              <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '200px', height: '200px', background: 'var(--accent-primary)', opacity: 0.05, borderRadius: '50%', filter: 'blur(60px)' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', borderBottom: '1px dashed #e2e8f0', paddingBottom: '2.5rem' }}>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Selected Category</p>
                  <h3 style={{ fontSize: '2rem', fontWeight: '950', color: '#1e293b' }}>{currentRoom.name}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <p style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Move-in Date</p>
                   <h3 style={{ fontSize: '2rem', fontWeight: '950', color: 'var(--accent-primary)' }}>{formData.moveInDate || 'TBD'}</h3>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#64748b' }}>
                  <span>Security Deposit (Refundable)</span>
                  <span style={{ color: '#1e293b' }}>₹{parseInt(currentRoom.price).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#64748b' }}>
                  <span>Onboarding & Service Fee</span>
                  <span style={{ color: '#1e293b' }}>₹2,000</span>
                </div>
                <div style={{ height: '2px', background: '#f1f5f9', margin: '1rem 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1e293b' }}>Total Payable</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '3rem', fontWeight: '950', color: 'var(--accent-primary)' }}>₹{(parseInt(currentRoom.price) + 2000).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1.5rem', background: '#f0fdf4', borderRadius: '24px', border: '1px solid #bbf7d0', marginBottom: '3rem', color: '#166534' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <p style={{ fontWeight: '700', margin: 0, fontSize: '0.95rem' }}>Secured Booking: Your payment is protected by 256-bit encryption.</p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <button onClick={() => setStep(2)} className="btn btn-secondary" style={{ flex: 1, padding: '1.2rem', borderRadius: '18px', fontWeight: '800' }}>Back</button>
              <button onClick={async () => {
                try {
                  let tId = user.id || user._id;
                  try {
                    const profileRes = await API.get('/tenants/me');
                    if (profileRes.data && profileRes.data._id) tId = profileRes.data._id;
                  } catch (e) { console.warn("Fallback to user ID"); }

                  await API.post('/payments', {
                    tenantId: tId,
                    amount: parseInt(currentRoom.price) + 2000,
                    type: 'Booking',
                    buildingId: buildingId,
                    category: formData.roomType,
                    method: 'UPI'
                  });

                  alert('Congratulations! Your stay at Livora is confirmed.');
                  navigate('/dashboard');
                } catch (err) {
                  console.error('Booking Error:', err);
                  alert('Booking failed. Please try again.');
                }
              }} className="btn btn-primary" style={{ flex: 2, padding: '1.2rem', borderRadius: '18px', fontWeight: '950', background: '#10b981', border: 'none', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.2)' }}>Pay & Confirm Booking</button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .glass-card-premium {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 40px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
        }
        .progress-track {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin-bottom: 5rem;
          padding: 0 5rem;
        }
        .progress-track::before {
          content: '';
          position: absolute;
          top: 24px;
          left: 5rem;
          right: 5rem;
          height: 4px;
          background: #f1f5f9;
          z-index: 0;
        }
        .progress-bar-active {
          position: absolute;
          top: 24px;
          left: 5rem;
          height: 4px;
          background: var(--accent-primary);
          z-index: 0;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .step-node {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        .node-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: white;
          border: 4px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          transition: all 0.4s ease;
          color: #94a3b8;
        }
        .step-node.active .node-circle {
          border-color: var(--accent-primary);
          color: var(--accent-primary);
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
        }
        .step-node.done .node-circle {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }
        .node-label { font-size: 0.9rem; font-weight: 800; color: #64748b; }
        .room-option {
          padding: 2rem;
          border-radius: 24px;
          border: 2px solid #f1f5f9;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          background: white;
        }
        .room-option.active {
          border-color: var(--accent-primary);
          background: rgba(14, 165, 233, 0.02);
          box-shadow: 0 10px 25px rgba(14, 165, 233, 0.1);
        }
        .room-price { font-size: 1.5rem; font-weight: 950; color: var(--accent-primary); }
        .input-elite {
          width: 100%;
          padding: 1.2rem;
          background: #f8fafc;
          border: 2px solid transparent;
          border-radius: 20px;
          font-weight: 600;
          transition: all 0.3s;
          outline: none;
        }
        .input-elite:focus { background: white; border-color: var(--accent-primary); box-shadow: 0 0 0 5px rgba(14, 165, 233, 0.08); }
        .upload-card {
          border: 2px dashed #e2e8f0;
          border-radius: 32px;
          padding: 3.5rem 2rem;
          text-align: center;
          background: #fbfcfd;
          transition: all 0.3s;
          cursor: pointer;
          position: relative;
        }
        .upload-card.uploaded { border-color: #10b981; background: #f0fdf4; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Booking;
