import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { Calendar, Building, Layers, DoorOpen, BedDouble, ChevronRight, ArrowLeft } from 'lucide-react';
import API from '../api/axios';
import './Booking.css';

const formatMoveInDate = (dateStr) => {
  if (!dateStr || dateStr === 'TBD') return 'TBD';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
};

const Booking = () => {
  const navigate = useNavigate();
  const { buildingId } = useParams();
  const location = useLocation();
  const idUploadRef = useRef(null);
  const photoUploadRef = useRef(null);

  // Data passed from Listing.jsx
  const {
    floorId, roomId, bedId, rentAmount, securityDeposit,
    foodCharges, maintenanceCharges, roomNumber, bedNumber, floorNumber, agreementType, sharingType
  } = location.state || {};

  const [user, setUser] = useState({});
  const [step, setStep] = useState(1);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ moveInDate: '', agreementSigned: false, idProof: null, profilePhoto: null });
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [uploadingProofs, setUploadingProofs] = useState(false);
  const [proofUploadStatus, setProofUploadStatus] = useState(null);
  const [proofId, setProofId] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const totalAmount = (rentAmount || 0) + (securityDeposit || 0) + (foodCharges || 0) + (maintenanceCharges || 0);

  useEffect(() => {
    const fetchInitialData = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(storedUser);
      const tenantId = localStorage.getItem('tenantId') || storedUser.id || storedUser._id;

      try {
        if (tenantId && buildingId) {
          const profileRes = await API.get('/tenants/me').catch(() => null);
          if (profileRes?.data?.buildingId && profileRes?.data?.status === 'ACTIVE') {
            const bName = profileRes.data.buildingId?.name || "a hostel";
            const rNum = profileRes.data.room || "Room TBD";
            setApiError(`Active Residency Found: You are already registered at ${bName} (Room: ${rNum}).`);
            return;
          }
        }

        if (buildingId) {
          const res = await API.get(`/buildings/public/${buildingId}`);
          setHostel(res.data);
          // If no state was passed, redirect back to listing
          if (!bedId) {
            navigate(`/listing/${buildingId}`);
          }
        } else {
          const res = await API.get('/bookings/me');
          setBookings(res.data || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [buildingId, navigate, bedId]);

  const handleBooking = async () => {
    setApiError(null);
    const tenantId = localStorage.getItem('tenantId') || user?._id || user?.id;

    if (!tenantId) {
      setApiError("Authentication Error: Your session is invalid. Please log in again.");
      return;
    }

    if (!formData.moveInDate) {
      setApiError("Missing Information: Please select a Move-in Date in Step 1.");
      setStep(1);
      return;
    }

    if (!formData.agreementSigned) {
      setApiError("Validation Failed: You must accept the rental agreement to proceed.");
      setStep(2);
      return;
    }

    const payload = {
      tenantId,
      buildingId,
      category: `Room ${roomNumber} (Bed ${bedNumber})`,
      moveInDate: formData.moveInDate,
      rentAmount,
      securityDeposit,
      foodCharges,
      maintenanceCharges,
      agreementType,
      totalAmount: totalAmount,
      proofId,
      bedNumber: String(bedNumber),
      sharingType: Number(sharingType) || 1,
      roomId: roomId,
      bedId: bedId
    };

    setBookingLoading(true);

    try {
      const response = await API.post('/bookings', payload);
      navigate('/dashboard', { state: { bookingSuccess: true } });
    } catch (err) {
      let errorMessage = "Booking failed due to an unexpected error.";
      if (!err.response) {
        errorMessage = "Network Error: Server is unreachable. Please check your connection or try again later.";
      } else {
        errorMessage = err.response.data?.message || err.response.data?.error || `Server Error (${err.response.status}): Failed to process booking.`;
      }
      setApiError(errorMessage);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return (
    <div className="staynest-dashboard loading-state">
      <div className="premium-spinner"></div>
      <p>Synchronizing your booking records...</p>
    </div>
  );

  // My Bookings view if buildingId is missing
  if (!buildingId) {
    return (
      <div className="booking-page">
        <header className="booking-header">
          <div className="header-icon-main">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div>
            <h1>My Bookings</h1>
            <p className="header-subtitle">Manage your active stays and reservations within the network.</p>
          </div>
        </header>

        <div className="bookings-container">
          {bookings.length === 0 ? (
            <div className="sn-card empty-booking-card">
              <h3>No Active Bookings</h3>
              <p>You haven't booked any hostel yet.</p>
              <Link to="/search" className="btn-primary btn-large">Find a Hostel</Link>
            </div>
          ) : (
            <div className="bookings-grid-pro">
              {bookings.map(b => (
                <div key={b._id} className="sn-card booking-item-card">
                  <div className="booking-item-header">
                    <div>
                      <h3 className="hostel-name-pro">{b.buildingId?.name || 'Livora Residence'}</h3>
                      <span className="category-tag-pro">{b.category}</span>
                    </div>
                    <span className={`status-pill-pro ${b.status.toLowerCase()}`}>{b.status}</span>
                  </div>

                  <div className="booking-details-grid">
                    <div className="detail-box">
                      <span className="detail-label">Move-in Date</span>
                      <span className="detail-value">{formatMoveInDate(b.moveInDate)}</span>
                    </div>
                    <div className="detail-box">
                      <span className="detail-label">Total Amount</span>
                      <span className="detail-value price">₹{b.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <header className="booking-header">
        <div className="header-icon-main">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div>
          <h1>Finalize Your Stay</h1>
          <p className="header-subtitle">Your premium home experience is just a few steps away.</p>
        </div>
      </header>

      <div className="booking-stepper">
        <div className="stepper-line"></div>
        <div className="stepper-line-active" style={{ width: `${(step - 1) * 50}%` }}></div>
        {[
          { id: 1, label: 'Move-in Details' },
          { id: 2, label: 'Identity Check' },
          { id: 3, label: 'Payment' }
        ].map(s => (
          <div key={s.id} className={`step-node ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
            <div className="node-circle">
              {step > s.id ? '✓' : s.id}
            </div>
            <span className="node-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="sn-card booking-flow-container">
        {step === 1 && (
          <div className="fade-in flow-section">
            <h2 className="section-title">Confirm Selection & Move-in</h2>

            <div className="selection-summary-grid">
              <div className="selection-card-item">
                <div className="sc-icon"><Building size={20} /></div>
                <div className="sc-info">
                  <span className="sc-label">Property</span>
                  <span className="sc-value">{hostel?.name || 'Loading...'}</span>
                </div>
              </div>
              <div className="selection-card-item">
                <div className="sc-icon"><Layers size={20} /></div>
                <div className="sc-info">
                  <span className="sc-label">Floor</span>
                  <span className="sc-value">Floor {floorNumber || '--'}</span>
                </div>
              </div>
              <div className="selection-card-item">
                <div className="sc-icon"><DoorOpen size={20} /></div>
                <div className="sc-info">
                  <span className="sc-label">Room</span>
                  <span className="sc-value">Room {roomNumber || '--'}</span>
                </div>
              </div>
              <div className="selection-card-item">
                <div className="sc-icon"><BedDouble size={20} /></div>
                <div className="sc-info">
                  <span className="sc-label">Bed</span>
                  <span className="sc-value">#{bedNumber || '--'}</span>
                </div>
              </div>
            </div>

            <div className="date-selection-premium">
              <div className="date-header-pro">
                <Calendar size={24} color="var(--primary)" />
                <div>
                  <h3>Target Move-in Date</h3>
                  <p>When would you like to start your stay?</p>
                </div>
              </div>
              <div className="date-input-wrapper">
                <Calendar className="date-icon-overlay" size={18} />
                <input
                  type="date"
                  value={formData.moveInDate}
                  onChange={e => setFormData({ ...formData, moveInDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="flow-footer dual">
              <button className="btn-secondary-pro" onClick={() => navigate(-1)}><ArrowLeft size={16} /> Go Back</button>
              <button className="btn-primary btn-large" onClick={() => setStep(2)}>Next: Identity Check <ChevronRight size={18} /></button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in flow-section">
            <h2 className="section-title">Identity Verification</h2>
            <p className="section-subtitle">Please upload clear documents for faster processing.</p>

            <div className="upload-grid-pro">
              <div className={`upload-card-premium ${formData.idProof ? 'uploaded' : ''}`} onClick={() => idUploadRef.current.click()}>
                <div className="upload-info">
                  <h4>ID Proof (Aadhaar/PAN)</h4>
                  <p>{formData.idProof ? formData.idProof.name : 'Click to upload document'}</p>
                </div>
                <input type="file" ref={idUploadRef} accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => setFormData({ ...formData, idProof: e.target.files[0] || null })} />
              </div>

              <div className={`upload-card-premium ${formData.profilePhoto ? 'uploaded' : ''}`} onClick={() => photoUploadRef.current.click()}>
                <div className="upload-info">
                  <h4>Profile Photograph</h4>
                  <p>{formData.profilePhoto ? formData.profilePhoto.name : 'Click to upload photo'}</p>
                </div>
                <input type="file" ref={photoUploadRef} accept="image/*" style={{ display: 'none' }} onChange={e => setFormData({ ...formData, profilePhoto: e.target.files[0] || null })} />
              </div>
            </div>

            <div className="agreement-check-pro">
              <label className="checkbox-container">
                <input type="checkbox" checked={formData.agreementSigned} onChange={e => setFormData({ ...formData, agreementSigned: e.target.checked })} />
                <span className="checkmark-pro"></span>
                <span className="agreement-text">I have read and agree to the <strong>Digital Rental Agreement</strong> and the hostel policies.</span>
              </label>
            </div>

            {proofUploadStatus === 'error' && (
              <div style={{ margin: '1rem 0 0', padding: '0.9rem 1.25rem', borderRadius: '12px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: '0.88rem', fontWeight: '600' }}>
                ⚠️ Document upload failed. You can still proceed — proofs can be re-submitted later.
              </div>
            )}

            <div className="flow-footer dual">
              <button className="btn-secondary-pro" onClick={() => setStep(1)}>Go Back</button>
              <button
                className="btn-primary btn-large"
                disabled={!formData.agreementSigned || !formData.idProof || uploadingProofs}
                onClick={async () => {
                  setUploadingProofs(true);
                  try {
                    const fd = new FormData();
                    fd.append('idProof', formData.idProof);
                    if (formData.profilePhoto) fd.append('profilePhoto', formData.profilePhoto);
                    if (buildingId) fd.append('buildingId', buildingId);
                    const token = localStorage.getItem('token');
                    await fetch('https://livora-hostel-hub-1.onrender.com/api/tenant-proofs/upload', {
                      method: 'POST',
                      headers: { Authorization: `Bearer ${token}` },
                      body: fd
                    }).then(async r => {
                      if (!r.ok) throw new Error(await r.text());
                      const data = await r.json();
                      if (data.proofId) setProofId(data.proofId);
                    });
                    setProofUploadStatus('success');
                  } catch (err) {
                    setProofUploadStatus('error');
                  } finally {
                    setUploadingProofs(false);
                    setStep(3);
                  }
                }}
              >
                {uploadingProofs ? 'Uploading...' : 'Next: Payment Summary'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in flow-section">
            <h2 className="section-title">Booking Summary</h2>

            <div className="summary-card-pro">
              <div className="summary-item-row"><span className="item-label">Room Rent ({agreementType})</span><span className="item-value">₹{rentAmount?.toLocaleString()}</span></div>
              <div className="summary-item-row"><span className="item-label">Security Deposit (One-time)</span><span className="item-value">₹{securityDeposit?.toLocaleString()}</span></div>
              <div className="summary-item-row"><span className="item-label">Food Charges ({agreementType})</span><span className="item-value">₹{foodCharges?.toLocaleString()}</span></div>
              <div className="summary-item-row"><span className="item-label">Maintenance ({agreementType})</span><span className="item-value">₹{maintenanceCharges?.toLocaleString()}</span></div>
              <div className="summary-divider"></div>
              <div className="summary-total-row">
                <div className="total-label-group">
                  <span className="total-label">Total Due (Move-in)</span>
                </div>
                <span className="total-amount-val">₹{totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            <div className="payment-options-section fade-in">
              <h3 className="section-title" style={{ fontSize: '1.5rem', marginTop: '2rem' }}>Payment Method</h3>
              <div className="payment-methods-grid">
                {['UPI', 'Debit Card', 'Credit Card'].map(method => (
                  <div key={method} className="payment-method-wrapper">
                    <label className={`payment-method-card ${paymentMethod === method ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ display: 'none' }}
                      />
                      <span className="pm-name">{method}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {apiError && (
              <div className="error-alert-pro fade-in" style={{ marginTop: '2rem', marginBottom: 0 }}>
                <span>{apiError}</span>
              </div>
            )}

            <div className="flow-footer dual">
              <button className="btn-secondary-pro" onClick={() => setStep(2)}>Go Back</button>
              <button className="btn-primary btn-large checkout-color" disabled={bookingLoading} onClick={handleBooking}>
                {bookingLoading ? 'Processing...' : 'Pay & Confirm Stay'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
