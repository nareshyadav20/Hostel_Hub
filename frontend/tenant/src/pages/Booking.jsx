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
  const [bookings, setBookings] = useState([]);

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
    else {
      // Fetch bookings for "My Bookings" view
      const fetchBookings = async () => {
        try {
          let tId = storedUser.id || storedUser._id;
          try {
            const profileRes = await API.get('/tenants/me');
            if (profileRes.data) {
              if (profileRes.data._id) tId = profileRes.data._id;
              setUser(prev => ({ ...prev, ...profileRes.data }));
            }
          } catch (e) { console.warn("Fallback to stored user ID"); }

          if (tId) {
            console.log("Fetching bookings for tenant:", tId);
            const res = await API.get(`/bookings/me?tenantId=${tId}`);
            console.log("Bookings found:", res.data.length);
            setBookings(res.data);
          }
        } catch (err) {
          console.error('Error fetching bookings:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
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

  if (loading) return <div className="dashboard-container"><div className="loading-spinner">Initializing booking...</div></div>;

  if (!buildingId) {
    return (
      <div className="booking-page-premium fade-in dashboard-container">
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1.5px' }}>My Bookings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Manage your active stays and upcoming reservations.</p>
        </header>

        <div className="glass-card" style={{ padding: '3rem', borderRadius: '32px' }}>
          {user.room && user.room !== '' ? (
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
              <div style={{ background: 'var(--bg-tertiary)', padding: '2.5rem', borderRadius: '28px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '2rem', color: 'var(--text-primary)' }}>Booking Summary</h3>
                <div className="summary-row">
                  <span>Room Type</span>
                  <strong>{currentRoom.name}</strong>
                </div>
                <div className="summary-row">
                  <span>Monthly Rent</span>
                  <strong style={{ color: 'var(--accent-primary)' }}>₹{parseInt(currentRoom.price).toLocaleString()}</strong>
                </div>
                <div className="summary-row">
                  <span>Security Deposit</span>
                  <strong>₹{parseInt(currentRoom.price).toLocaleString()}</strong>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total Payable Now</span>
                  <strong style={{ fontSize: '1.5rem' }}>₹{(parseInt(currentRoom.price) * 2).toLocaleString()}</strong>
                </div>
              </div>
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="fade-in">
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Upcoming Reservations</h2>
                <p style={{ color: 'var(--text-muted)' }}>Your booked slots are listed below. Our team is preparing your room!</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {bookings.map(b => (
                  <div key={b._id} className="glass-card" style={{ padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', background: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                    <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                      <span className="badge" style={{ background: b.status === 'Confirmed' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: b.status === 'Confirmed' ? '#22c55e' : '#f59e0b', padding: '0.5rem 1.2rem', borderRadius: '12px', fontWeight: '800', fontSize: '0.75rem' }}>
                        {b.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ width: '60px', height: '60px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '1.5rem' }}>🏨</div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1e293b', marginBottom: '0.5rem' }}>{b.buildingId?.name || 'HostelHub Residence'}</h3>
                    <p style={{ color: 'var(--accent-primary)', fontWeight: '700', fontSize: '0.95rem', marginBottom: '2rem' }}>{b.category}</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div className="summary-row" style={{ margin: 0 }}>
                        <span>Move-in Date</span>
                        <strong style={{ color: '#1e293b' }}>{b.moveInDate}</strong>
                      </div>
                      <div className="summary-row" style={{ margin: 0 }}>
                        <span>Booking ID</span>
                        <strong style={{ color: '#64748b', fontSize: '0.85rem' }}>#{b._id.slice(-8).toUpperCase()}</strong>
                      </div>
                      <div className="summary-divider" style={{ margin: '1rem 0' }}></div>
                      <div className="summary-row" style={{ margin: 0, alignItems: 'baseline' }}>
                        <span>Total Paid</span>
                        <strong style={{ color: 'var(--accent-primary)', fontSize: '1.8rem', fontWeight: '950' }}>₹{b.totalAmount.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>
                ))}
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

  return (
    <div className="booking-page fade-in dashboard-container" style={{ position: 'relative', paddingBottom: '8rem' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          position: 'absolute', 
          top: '2rem', 
          right: '2rem', 
          background: 'var(--bg-secondary)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-color)', 
          width: '52px', 
          height: '52px', 
          borderRadius: '50%', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'var(--text-secondary)',
          zIndex: 100,
          boxShadow: 'var(--shadow-md)',
          transition: 'all 0.3s ease'
        }}
        title="Cancel Booking / Go Back"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <header style={{ marginBottom: '4.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '950', letterSpacing: '-3px', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Finalize Your Stay
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Your premium co-living experience is just a few steps away.</p>
      </header>

      <div className="progress-track" style={{ marginBottom: '3rem' }}>
        <div className="progress-bar-active" style={{ width: `${(step - 1) * 50}%` }}></div>
        {[
          { id: 1, label: 'Preferences', icon: '🛌' },
          { id: 2, label: 'Verification', icon: '🪪' },
          { id: 3, label: 'Payment', icon: '💳' }
        ].map(s => (
          <div key={s.id} className={`step-node ${step === s.id ? 'active' : ''} ${step > s.id ? 'done' : ''}`}>
            <div className="node-circle">
              {step > s.id ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> : s.icon}
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {roomOptions.map(room => (
                  <div key={room.id} className={`room-option ${formData.roomType === room.id ? 'active' : ''}`} onClick={() => setFormData({...formData, roomType: room.id})} style={{ borderRadius: '12px', padding: '20px', border: '1.5px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '2rem' }}>{room.icon}</span>
                      {formData.roomType === room.id && <div style={{ color: '#3B82F6' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg></div>}
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '900', margin: '0 0 4px' }}>{room.name}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1rem' }}>{room.desc}</p>
                    <div style={{ fontWeight: '900', fontSize: '1.2rem', color: '#0F172A' }}>₹{parseInt(room.price).toLocaleString()}<span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>/mo</span></div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Move-In Date</label>
                <input type="date" className="input-elite" name="moveInDate" value={formData.moveInDate} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Stay Duration</label>
                <select className="input-elite" name="duration" value={formData.duration} onChange={handleChange}>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months (Popular)</option>
                  <option value="12">1 Year</option>
                </select>
              </div>
            </div>

            <button onClick={() => setStep(2)} className="btn btn-primary" style={{ width: '100%', marginTop: '3rem', padding: '1.2rem', fontWeight: '900', borderRadius: '12px', fontSize: '1.1rem', background: '#3B82F6', border: 'none', color: 'white', cursor: 'pointer' }}>
              Confirm & Continue
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in">
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', letterSpacing: '-1px', marginBottom: '2.5rem' }}>Identity Verification</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>ID Proof Number</label>
                <input type="text" className="input-elite" placeholder="Aadhar / PAN / Passport" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
              <div onClick={() => idUploadRef.current.click()} style={{ flex: 1, border: '2px dashed var(--border-color)', borderRadius: '20px', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: formData.idProof ? 'var(--accent-success)' : 'transparent', color: formData.idProof ? 'white' : 'inherit' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🪪</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{formData.idProof || 'Upload ID Proof'}</div>
                <input type="file" ref={idUploadRef} style={{ display: 'none' }} onChange={(e) => handleFileUpload('idProof', e)} />
              </div>
              <div onClick={() => photoUploadRef.current.click()} style={{ flex: 1, border: '2px dashed var(--border-color)', borderRadius: '20px', padding: '2rem', textAlign: 'center', cursor: 'pointer', background: formData.profilePhoto ? 'var(--accent-success)' : 'transparent', color: formData.profilePhoto ? 'white' : 'inherit' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📸</div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{formData.profilePhoto || 'Upload Profile Photo'}</div>
                <input type="file" ref={photoUploadRef} style={{ display: 'none' }} onChange={(e) => handleFileUpload('profilePhoto', e)} />
              </div>
            </div>

            <div style={{ background: 'var(--bg-tertiary)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--border-color)', marginBottom: '3rem' }}>
              <h4 style={{ fontWeight: '900', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--text-primary)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Rental Agreement Summary
              </h4>
              <div style={{ maxHeight: '120px', overflowY: 'auto', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', paddingRight: '1rem' }}>
                <p>• Standard move-out notice period is 30 days.</p>
                <p>• Security deposit is equivalent to 1 month's rent.</p>
                <p>• Electricity charges are calculated based on sub-meter usage.</p>
                <p>• House rules regarding visitors and quiet hours apply.</p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.agreementSigned} onChange={e => setFormData({...formData, agreementSigned: e.target.checked})} style={{ width: '20px', height: '20px' }} />
                <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>I have read and agree to the Digital Rental Agreement</span>
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
            
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '2.5rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subscription Plan</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0F172A' }}>{currentRoom.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Move-in Date</div>
                   <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#3B82F6' }}>{formData.moveInDate || 'Not Set'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#475569', fontSize: '0.95rem' }}>
                  <span>Security Deposit (Fully Refundable)</span>
                  <span style={{ color: '#0F172A' }}>₹{parseInt(currentRoom.price).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', color: '#475569', fontSize: '0.95rem' }}>
                  <span>Onboarding & Documentation Fee</span>
                  <span style={{ color: '#0F172A' }}>₹2,000</span>
                </div>
                <div style={{ height: '1px', background: '#E2E8F0', margin: '0.5rem 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0F172A' }}>Initial Payment</span>
                  <span style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', letterSpacing: '-1px' }}>₹{(parseInt(currentRoom.price) + 2000).toLocaleString()}</span>
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

                  await API.post('/bookings', {
                    tenantId: tId,
                    buildingId: buildingId,
                    category: currentRoom.name,
                    moveInDate: formData.moveInDate || 'TBD',
                    securityDeposit: parseInt(currentRoom.price),
                    onboardingFee: 2000,
                    totalAmount: parseInt(currentRoom.price) + 2000,
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
          background: white;
          border: 1px solid #E2E8F0;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
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
          background: var(--bg-tertiary);
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
