import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import API from '../api/axios';
import './Booking.css';

const Booking = () => {
  const navigate = useNavigate();
  const { buildingId } = useParams();
  const location = useLocation();
  const idUploadRef = useRef(null);
  const photoUploadRef = useRef(null);
  
  // Map passed state to room type
  const passedSharing = location.state?.selectedSharing || 2;
  const passedBed = location.state?.selectedBed || 1;
  const initialRoomType = passedSharing === 1 ? 'Single' : (passedSharing === 3 ? 'Triple' : 'Double');
  
  const [user, setUser] = useState({});
  const [step, setStep] = useState(1);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ roomType: initialRoomType, moveInDate: '', agreementSigned: false, idProof: null, profilePhoto: null });
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  const basePrice = hostel?.startingPrice || 9000;

  const roomOptions = [
    { 
      id: 'Single', 
      name: 'Single Elite', 
      price: (basePrice * 2).toString(), 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      )
    },
    { 
      id: 'Double', 
      name: 'Luxury 2 Sharing', 
      price: Math.round(basePrice * 1.3333).toString(), 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      )
    },
    { 
      id: 'Triple', 
      name: 'Comfort 3 Sharing', 
      price: basePrice.toString(), 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <path d="M2 14h20"></path>
        </svg>
      )
    }
  ];

  useEffect(() => {
    const fetchInitialData = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(storedUser);
      const tenantId = localStorage.getItem('tenantId') || storedUser.id || storedUser._id;
      
      try {
        // If we have a tenant ID, check if they already have a confirmed booking/residency
        if (tenantId && buildingId) {
          const profileRes = await API.get('/tenants/me').catch(() => null);
          if (profileRes?.data?.buildingId) {
             setApiError("Active Residency Found: You are already registered at a hostel. A resident can only have one active stay at a time.");
             return;
          }
        }

        if (buildingId) {
          const res = await API.get(`/buildings/public/${buildingId}`);
          setHostel(res.data);
        } else {
          // Now using JWT token for identification - no query param needed
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
  }, [buildingId]);

  const currentRoom = roomOptions.find(r => r.id === formData.roomType) || roomOptions[1];

  const handleBooking = async () => {
    setApiError(null);
    const tenantId = user?._id || user?.id;
    const amount = parseInt(currentRoom.price) + parseInt(currentRoom.deposit || currentRoom.price) + 3000 + 799;

    console.log("[Booking] Debug Info:", { 
      tenantId, 
      buildingId, 
      user, 
      formData,
      currentRoomName: currentRoom.name,
      amount
    });

    if (!tenantId) {
      setApiError("Authentication Error: Your session is invalid. Please log in again.");
      console.error("[Booking] Critical Failure: No tenantId found in local storage.");
      return;
    }

    if (!buildingId) {
      setApiError("Data Error: Property identifier is missing. Please return to the listing page.");
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
      category: currentRoom.name,
      moveInDate: formData.moveInDate,
      totalAmount: amount,
      bedNumber: passedBed,
      sharingType: passedSharing
    };

    console.log("[Booking] Outgoing Payload:", payload);
    setBookingLoading(true);

    try {
      const response = await API.post('/bookings', payload);
      console.log("[Booking] API Success:", response.data);
      
      // Navigate to dashboard on success
      navigate('/dashboard', { state: { bookingSuccess: true } });
    } catch (err) {
      console.error("[Booking] API Error Object:", err);
      
      let errorMessage = "Booking failed due to an unexpected error.";
      
      if (!err.response) {
        errorMessage = "Network Error: Server is unreachable. Please check your connection or try again later.";
      } else {
        errorMessage = err.response.data?.message || err.response.data?.error || `Server Error (${err.response.status}): Failed to process booking.`;
        console.error("[Booking] Backend Error Detail:", err.response.data);
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
              <div className="empty-visual">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <h3>No Active Bookings</h3>
              <p>You haven't booked any hostel yet. Start exploring premium stays now.</p>
              <Link to="/search" className="btn-primary btn-large">Find a Hostel</Link>
            </div>
          ) : (
            <div className="bookings-grid-pro">
              {bookings.map(b => (
                <div key={b._id} className="sn-card booking-item-card">
                  <div className="booking-item-header">
                    <div className="hostel-info-group">
                      <div className="hostel-icon-badge">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 21h18"></path>
                          <path d="M3 7v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"></path>
                          <path d="M21 7H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2z"></path>
                          <path d="M9 12h6"></path>
                        </svg>
                      </div>
                      <div>
                        <h3 className="hostel-name-pro">{b.buildingId?.name || 'Livora Residence'}</h3>
                        <span className="category-tag-pro">{b.category}</span>
                      </div>
                    </div>
                    <span className={`status-pill-pro ${b.status.toLowerCase()}`}>{b.status}</span>
                  </div>

                  <div className="booking-details-grid">
                    <div className="detail-box">
                      <span className="detail-label">Move-in Date</span>
                      <span className="detail-value">{new Date(b.moveInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="detail-box">
                      <span className="detail-label">Total Amount</span>
                      <span className="detail-value price">₹{b.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="booking-footer-pro">
                    <div className="booking-id-tag">ID: {b._id.slice(-8).toUpperCase()}</div>
                    <button className="btn-download-full" onClick={() => {
                        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice_${b._id.slice(-8)}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; background: #fff; }
        .invoice-container { max-width: 800px; margin: auto; border: 1px solid #e2e8f0; padding: 50px; border-radius: 24px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 60px; }
        .logo { font-size: 28px; font-weight: 800; color: #4f46e5; letter-spacing: -1px; }
        .invoice-label { font-size: 36px; font-weight: 800; color: #0f172a; margin: 0; }
        .status-badge { display: inline-block; padding: 6px 16px; background: #dcfce7; color: #15803d; border-radius: 100px; font-size: 14px; font-weight: 700; margin-top: 10px; text-transform: uppercase; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 50px; }
        .info-block h4 { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px; margin-top: 0; }
        .info-block p { margin: 0; font-weight: 600; font-size: 16px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
        .table th { text-align: left; padding: 16px; border-bottom: 2px solid #f1f5f9; color: #64748b; font-size: 13px; font-weight: 700; text-transform: uppercase; }
        .table td { padding: 20px 16px; border-bottom: 1px solid #f1f5f9; font-weight: 600; }
        .total-section { margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 10px 0; }
        .grand-total { font-size: 24px; font-weight: 800; color: #4f46e5; border-top: 2px solid #e2e8f0; margin-top: 10px; padding-top: 15px; }
        .footer { text-align: center; margin-top: 80px; color: #94a3b8; font-size: 14px; border-top: 1px solid #f1f5f9; padding-top: 30px; }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div>
                <div class="logo">Livora Residency</div>
                <p style="color: #64748b; margin-top: 5px; font-weight: 500;">Premium Managed Accommodations</p>
            </div>
            <div style="text-align: right;">
                <h1 class="invoice-label">INVOICE</h1>
                <div class="status-badge">${b.status}</div>
            </div>
        </div>

        <div class="grid">
            <div class="info-block">
                <h4>Resident Details</h4>
                <p>${user?.name || 'Valued Resident'}</p>
                <p style="font-weight: 400; color: #64748b; font-size: 14px;">${user?.email || ''}</p>
            </div>
            <div class="info-block" style="text-align: right;">
                <h4>Invoice Details</h4>
                <p>#INV-${b._id.slice(-8).toUpperCase()}</p>
                <p style="font-weight: 400; color: #64748b; font-size: 14px;">Date: ${new Date().toLocaleDateString('en-IN')}</p>
            </div>
        </div>

        <div class="info-block" style="margin-bottom: 40px;">
            <h4>Property</h4>
            <p>${b.buildingId?.name || 'HostelHub Network Property'}</p>
            <p style="font-weight: 400; color: #64748b; font-size: 14px;">${b.buildingId?.location || 'Premium Managed Residence'}</p>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Plan</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Hostel Accommodation Booking Fee<br/><small style="color: #64748b; font-weight: 400;">Move-in: ${new Date(b.moveInDate).toLocaleDateString()}</small></td>
                    <td>${b.category}</td>
                    <td style="text-align: right;">₹${(b.totalAmount/2).toLocaleString()}</td>
                </tr>
                <tr>
                    <td>Refundable Security Deposit<br/><small style="color: #64748b; font-weight: 400;">Interest-free refundable amount</small></td>
                    <td>—</td>
                    <td style="text-align: right;">₹${(b.totalAmount/2).toLocaleString()}</td>
                </tr>
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-row">
                <span style="color: #64748b;">Subtotal</span>
                <span>₹${b.totalAmount?.toLocaleString()}</span>
            </div>
            <div class="total-row">
                <span style="color: #64748b;">GST (0%)</span>
                <span>₹0</span>
            </div>
            <div class="total-row grand-total">
                <span>Total Paid</span>
                <span>₹${b.totalAmount?.toLocaleString()}</span>
            </div>
        </div>

        <div class="footer">
            <p>This is a computer-generated document. No signature required.</p>
            <p style="margin-top: 10px;">Thank you for choosing <strong>Livora Residency</strong> for your premium stay.</p>
        </div>
    </div>
</body>
</html>`;
                        const element = document.createElement('div');
                        element.innerHTML = html;
                        
                        // Dynamically load html2pdf if not present
                        if (!window.html2pdf) {
                          const script = document.createElement('script');
                          script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
                          script.onload = () => {
                            generatePDF(element, b._id.slice(-8));
                          };
                          document.head.appendChild(script);
                        } else {
                          generatePDF(element, b._id.slice(-8));
                        }
                        
                        function generatePDF(el, id) {
                           const opt = {
                             margin:       0,
                             filename:     `Invoice_${id.toUpperCase()}.pdf`,
                             image:        { type: 'jpeg', quality: 0.98 },
                             html2canvas:  { scale: 2, useCORS: true },
                             jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
                           };
                           // Use html2pdf to automatically save the file
                           window.html2pdf().set(opt).from(el).save();
                        }
                      }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Download Invoice (PDF)
                      </button>
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
          { id: 1, label: 'Room Selection', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"></circle></svg> },
          { id: 2, label: 'Identity Check', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
          { id: 3, label: 'Payment', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg> }
        ].map(s => (
          <div key={s.id} className={`step-node ${step === s.id ? 'active' : ''} ${step > s.id ? 'completed' : ''}`}>
            <div className="node-circle">
              {step > s.id ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : s.id}
            </div>
            <span className="node-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="sn-card booking-flow-container">
        {step === 1 && (
          <div className="fade-in flow-section">
            <h2 className="section-title">Choose Room Category</h2>
            <div className="category-selection-grid">
              {roomOptions.map(room => (
                <div 
                  key={room.id} 
                  className={`category-card ${formData.roomType === room.id ? 'selected' : ''}`} 
                  onClick={() => setFormData({...formData, roomType: room.id})}
                >
                  <div className="category-icon-bg">{room.icon}</div>
                  <div className="category-info">
                    <h4>{room.name}</h4>
                    <p className="price-tag">₹{parseInt(room.price).toLocaleString()} / month</p>
                  </div>
                  <div className="selection-indicator">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="date-selection-row">
              <div className="input-group-pro">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Target Move-in Date
                </label>
                <input 
                  type="date" 
                  value={formData.moveInDate} 
                  onChange={e => setFormData({...formData, moveInDate: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div className="flow-footer dual">
              <button className="btn-secondary-pro" onClick={() => navigate(-1)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Go Back
              </button>
              <button className="btn-primary btn-large" onClick={() => setStep(2)}>
                Next: Identity Check
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-in flow-section">
            <h2 className="section-title">Identity Verification</h2>
            <p className="section-subtitle">Please upload clear documents for faster processing.</p>
            
            <div className="upload-grid-pro">
               <div className={`upload-card-premium ${formData.idProof ? 'uploaded' : ''}`} onClick={() => idUploadRef.current.click()}>
                  <div className="upload-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M7 8h10M7 12h10M7 16h6"></path></svg>
                  </div>
                  <div className="upload-info">
                    <h4>ID Proof (Aadhaar/PAN)</h4>
                    <p>{formData.idProof || 'Click to upload document'}</p>
                  </div>
                  <input type="file" ref={idUploadRef} style={{ display: 'none' }} onChange={e => setFormData({...formData, idProof: e.target.files[0]?.name})} />
               </div>

               <div className={`upload-card-premium ${formData.profilePhoto ? 'uploaded' : ''}`} onClick={() => photoUploadRef.current.click()}>
                  <div className="upload-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                  </div>
                  <div className="upload-info">
                    <h4>Profile Photograph</h4>
                    <p>{formData.profilePhoto || 'Click to upload photo'}</p>
                  </div>
                  <input type="file" ref={photoUploadRef} style={{ display: 'none' }} onChange={e => setFormData({...formData, profilePhoto: e.target.files[0]?.name})} />
               </div>
            </div>

            <div className="agreement-check-pro">
              <label className="checkbox-container">
                <input type="checkbox" checked={formData.agreementSigned} onChange={e => setFormData({...formData, agreementSigned: e.target.checked})} />
                <span className="checkmark-pro"></span>
                <span className="agreement-text">I have read and agree to the <strong>Digital Rental Agreement</strong> and the hostel policies.</span>
              </label>
            </div>

            <div className="flow-footer dual">
              <button className="btn-secondary-pro" onClick={() => setStep(1)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Go Back
              </button>
              <button className="btn-primary btn-large" disabled={!formData.agreementSigned || !formData.idProof} onClick={() => setStep(3)}>
                Next: Payment Summary
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-in flow-section">
            <h2 className="section-title">Booking Summary</h2>
            
            <div className="summary-card-pro">
               <div className="summary-item-row">
                 <span className="item-label">Selected Room</span>
                 <span className="item-value">{currentRoom.name}</span>
               </div>
               <div className="summary-item-row">
                 <span className="item-label">Room Rent</span>
                 <span className="item-value">₹{parseInt(currentRoom.price).toLocaleString()}</span>
               </div>
               <div className="summary-item-row">
                 <span className="item-label">Security Deposit</span>
                 <span className="item-value">₹{parseInt(currentRoom.deposit || currentRoom.price).toLocaleString()}</span>
               </div>
               <div className="summary-item-row">
                 <span className="item-label">Food (Monthly)</span>
                 <span className="item-value">₹3,000</span>
               </div>
               <div className="summary-item-row">
                 <span className="item-label">Maintenance</span>
                 <span className="item-value">₹799</span>
               </div>
               <div className="summary-divider"></div>
               <div className="summary-total-row">
                 <div className="total-label-group">
                   <span className="total-label">Total Due (Move-in)</span>
                   <span className="total-subtitle">Rent + Deposit + Food + Maintenance</span>
                 </div>
                 <span className="total-amount-val">₹{(parseInt(currentRoom.price) + parseInt(currentRoom.deposit || currentRoom.price) + 3000 + 799).toLocaleString()}</span>
               </div>
            </div>

            <div className="payment-options-section fade-in">
              <h3 className="section-title" style={{ fontSize: '1.5rem', marginTop: '2rem' }}>Payment Method</h3>
              <div className="payment-methods-grid">
                {[
                  { id: 'PhonePe', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg> },
                  { id: 'UPI', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg> },
                  { id: 'Debit Card', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg> },
                  { id: 'Credit Card', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg> },
                  { id: 'Net Banking', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg> },
                  { id: 'Cash', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg> }
                ].map(method => (
                  <div key={method.id} className="payment-method-wrapper">
                    <label className={`payment-method-card ${paymentMethod === method.id ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method.id} 
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ display: 'none' }}
                      />
                      <div className="pm-icon">{method.icon}</div>
                      <span className="pm-name">{method.id}</span>
                      <div className="pm-check">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                    </label>
                    
                    {paymentMethod === method.id && (method.id === 'Debit Card' || method.id === 'Credit Card') && (
                      <div className="payment-method-details fade-in-down">
                         <div className="card-input-container">
                            <input type="text" placeholder="Card Number (0000 0000 0000 0000)" className="card-input" maxLength="19" />
                            <div className="card-row">
                               <input type="text" placeholder="MM/YY" className="card-input half" maxLength="5" />
                               <input type="password" placeholder="CVV" className="card-input half" maxLength="3" />
                            </div>
                            <input type="text" placeholder="Name on Card" className="card-input" />
                         </div>
                      </div>
                    )}

                    {paymentMethod === method.id && (method.id === 'UPI' || method.id === 'PhonePe') && (
                      <div className="payment-method-details fade-in-down">
                         <div className="card-input-container">
                            <input type="text" placeholder={`Enter ${method.id} ID (e.g., username@upi)`} className="card-input" />
                         </div>
                      </div>
                    )}
                    
                    {paymentMethod === method.id && method.id === 'Net Banking' && (
                      <div className="payment-method-details fade-in-down">
                         <div className="card-input-container">
                            <select className="card-input">
                               <option value="">Select your Bank</option>
                               <option value="sbi">State Bank of India</option>
                               <option value="hdfc">HDFC Bank</option>
                               <option value="icici">ICICI Bank</option>
                               <option value="axis">Axis Bank</option>
                            </select>
                         </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {apiError && (
              <div className="error-alert-pro fade-in" style={{ marginTop: '2rem', marginBottom: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span>{apiError}</span>
              </div>
            )}

            <div className="flow-footer dual">
              <button className="btn-secondary-pro" onClick={() => setStep(2)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Go Back
              </button>

              <button className="btn-primary btn-large checkout-color" disabled={bookingLoading} onClick={handleBooking}>
                {bookingLoading ? (
                  <>
                    <span className="mini-spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay & Confirm Stay
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
