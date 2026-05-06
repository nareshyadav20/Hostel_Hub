import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { MOCK_HOSTELS } from '../utils/mockData';
import './Listing.css';

const ICONS = {
  Location: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  Security: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
  ArrowLeft: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
  Heart: (props) => <svg width="18" height="18" viewBox="0 0 24 24" fill={props.filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>,
  Dining: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
};

const ROOM_SPECS_ICONS = { 
  size: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>,
  sharing: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  beds: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>,
  direction: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  windows: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 12h18M12 3v18"/></svg>,
  fans: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v9M12 12l6 6M12 12l-6 6"/></svg>,
  lights: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/></svg>,
  sockets: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="10" r="2"/><circle cx="12" cy="16" r="2"/></svg>,
  cupboards: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M12 2v20M9 11h2M13 11h2"/></svg>,
  studyTable: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16M10 21h4"/></svg>,
  balcony: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 7v14M21 7v14M3 11h18"/></svg>,
  bathroom: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 6c0-1.1.9-2 2-2h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6z"/><path d="M10 10h4"/></svg>
};

const Listing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedSharing, setSelectedSharing] = useState(2); 
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(1);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistId, setWishlistId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchHostelDetails = async () => {
      if (!id || id === 'undefined' || id === 'null') { setLoading(false); return; }
      try {
        const response = await API.get(`/buildings/${id}`);
        const b = response.data;
        const mapped = {
          id: b._id,
          name: b.name || "Alpha Tower",
          location: b.address || "Alpha Tower Street, Bengaluru",
          distance: "300m from college",
          category: b.category || "Student",
          gender: b.genderType || "Boys",
          rating: b.rating || 4.1,
          price: b.startingPrice || 16700,
          deposit: (b.startingPrice || 16700) * 2,
          maintenance: 999,
          menu: { 
            Breakfast: { item: 'Poha / Omelette / Tea', time: '08:00 - 09:30', color: '#3b82f6' }, 
            Lunch: { item: 'Veg Thali / Curd / Salad', time: '12:30 - 14:00', color: '#ef4444' }, 
            Dinner: { item: 'Phulka / Mix Veg / Paneer', time: '20:00 - 21:30', color: '#10b981' } 
          },
          plans: [{ name: 'Basic', price: 500, desc: 'Breakfast only' }, { name: 'Standard', price: 1000, desc: 'Breakfast & Dinner' }, { name: 'Premium', price: 1500, desc: 'All 3 Meals + Weekend Special' }],
          images: b.images?.length > 0 ? b.images : [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1c24240938?auto=format&fit=crop&w=1200&q=80'
          ]
        };
        setHostel(mapped);
        const wishRes = await API.get('/tenant-portal/wishlist').catch(() => ({ data: [] }));
        const existing = wishRes.data.find(w => (w.hostelId === b._id || w.hostelId === id));
        if (existing) setWishlistId(existing._id);
      } catch (err) {
        console.error('Error fetching details:', err);
        setHostel({ ...MOCK_HOSTELS[0], name: "Alpha Tower", location: "Alpha Tower Street, Bengaluru", price: 16700, deposit: 33400, maintenance: 999, menu: { Breakfast: { item: 'Poha / Omelette / Tea', time: '08:00 - 09:30', color: '#3b82f6' }, Lunch: { item: 'Veg Thali / Curd / Salad', time: '12:30 - 14:00', color: '#ef4444' }, Dinner: { item: 'Phulka / Mix Veg / Paneer', time: '20:00 - 21:30', color: '#10b981' } }, plans: [{ name: 'Basic', price: 500, desc: 'Breakfast only' }, { name: 'Standard', price: 1000, desc: 'Breakfast & Dinner' }, { name: 'Premium', price: 1500, desc: 'All 3 Meals + Weekend Special' }], images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1c24240938?auto=format&fit=crop&w=1200&q=80'] });
      } finally {
        setLoading(false);
      }
    };
    fetchHostelDetails();
  }, [id]);

  const handleWishlistToggle = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (wishlistId) {
        await API.delete(`/tenant-portal/wishlist/${wishlistId}`);
        setWishlistId(null);
      } else {
        const res = await API.post('/tenant-portal/wishlist', {
          hostelId: hostel.id || id, hostelName: hostel.name, hostelLocation: hostel.location, hostelPrice: hostel.price, hostelImage: hostel.images[0], hostelRating: hostel.rating || 4.1, gender: hostel.gender, type: 'Premium'
        });
        setWishlistId(res.data._id);
      }
    } catch (err) { console.error('Wishlist error:', err); } finally { setIsSaving(false); }
  };

  if (loading) return <div className="staynest-dashboard loading-state"><div className="premium-spinner"></div><p>Crafting your premium stay...</p></div>;
  if (!hostel) return <div className="staynest-dashboard"><p>Property not found.</p></div>;

  const activePlan = hostel.plans[selectedPlanIdx];
  const dynamicSpecs = [
    { label: 'Size', value: selectedSharing === 1 ? '10×12 ft' : selectedSharing === 2 ? '12×14 ft' : '14×16 ft', icon: <ROOM_SPECS_ICONS.size /> },
    { label: 'Sharing', value: `${selectedSharing} Sharing`, icon: <ROOM_SPECS_ICONS.sharing /> },
    { label: 'Beds', value: `${selectedSharing} Single`, icon: <ROOM_SPECS_ICONS.beds /> },
    { label: 'Direction', value: 'East Facing', icon: <ROOM_SPECS_ICONS.direction /> },
    { label: 'Windows', value: selectedSharing === 3 ? '3' : '2', icon: <ROOM_SPECS_ICONS.windows /> },
    { label: 'Fans', value: selectedSharing === 3 ? '2' : '1', icon: <ROOM_SPECS_ICONS.fans /> },
    { label: 'Lights', value: selectedSharing * 1, icon: <ROOM_SPECS_ICONS.lights /> },
    { label: 'Sockets', value: selectedSharing * 2, icon: <ROOM_SPECS_ICONS.sockets /> },
    { label: 'Cupboards', value: selectedSharing, icon: <ROOM_SPECS_ICONS.cupboards /> },
    { label: 'Study Table', value: 'Yes', icon: <ROOM_SPECS_ICONS.studyTable /> },
    { label: 'Balcony', value: selectedSharing === 1 ? 'No' : 'Yes', icon: <ROOM_SPECS_ICONS.balcony /> },
    { label: 'Bathroom', value: 'Attached', icon: <ROOM_SPECS_ICONS.bathroom /> }
  ];

  return (
    <div className="listing-page-pro">
      <div className="listing-container-pro">
        
        {/* ── Header ── */}
        <section className="listing-header-premium">
          <div className="header-info-side">
            <div className="header-badges">
              <span className="badge-pro blue">{hostel.gender}</span>
              <span className="badge-pro green">{hostel.category}</span>
              <span className="badge-pro orange">⚡ Filling Fast</span>
            </div>
            <h1 className="hostel-title-pro">{hostel.name}</h1>
            <p className="hostel-loc-pro">
              <ICONS.Location /> {hostel.location} • <span className="dist-text">{hostel.distance}</span>
            </p>
          </div>

          <div className="header-actions-side">
             <div className="nav-actions">
               <button className="btn-action-pro" onClick={() => navigate(-1)}>
                 <ICONS.ArrowLeft /> Back
               </button>
               <button className={`btn-action-pro ${wishlistId ? 'active' : ''}`} onClick={handleWishlistToggle}>
                 <ICONS.Heart filled={wishlistId} /> {wishlistId ? 'Saved' : 'Save'}
               </button>
             </div>
             <div className="pricing-mini-card">
               <span className="mini-label">Starting from</span>
               <div className="mini-price">₹{hostel.price.toLocaleString()}<span>/mo</span></div>
               <button className="btn-primary-pro full-width" onClick={() => navigate(`/booking/${hostel.id}`)}>Book Now</button>
             </div>
          </div>
        </section>

        {/* ── Gallery ── */}
        <section className="listing-gallery-refined">
           <div className="gallery-main-frame">
              <img src={hostel.images[0]} className="gallery-img-full" alt="Main" />
           </div>
           <div className="gallery-side-frames">
              <img src={hostel.images[1]} className="gallery-img-side" alt="T1" />
              <img src={hostel.images[2]} className="gallery-img-side" alt="T2" />
           </div>
        </section>

        {/* ── Main Grid ── */}
        <div className="listing-grid-main">
           <div className="col-content">
              <section className="listing-section">
                 <h2 className="section-title-pro">Room Specifications</h2>
                 <div className="specs-grid-pro">
                    {dynamicSpecs.map(spec => (
                      <div key={spec.label} className="spec-card-pro">
                         <div className="spec-icon-box">{spec.icon}</div>
                         <div className="spec-info-box">
                            <span className="spec-label-pro">{spec.label}</span>
                            <span className="spec-value-pro">{spec.value}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>

              <section className="listing-section">
                 <h2 className="section-title-pro">Dining & Nutrition</h2>
                 <div className="nutrition-grid-pro">
                    {Object.entries(hostel.menu).map(([m, data]) => (
                      <div key={m} className="meal-card-pro" style={{ borderLeftColor: data.color }}>
                         <div className="meal-icon-pro" style={{ color: data.color, background: `${data.color}15` }}>
                            <ICONS.Dining />
                         </div>
                         <div className="meal-details-pro">
                            <div className="meal-header-pro">
                               <span className="meal-name-pro">{m}</span>
                               <span className="meal-time-pro">{data.time}</span>
                            </div>
                            <p className="meal-items-pro">{data.item}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>
           </div>

           <aside className="col-payment-sticky">
              <div className="payment-receipt-card">
                 <h3 className="receipt-title">Payment Summary</h3>
                 <div className="receipt-body">
                    <div className="receipt-row"><span>Monthly Rent</span><span>₹{hostel.price.toLocaleString()}</span></div>
                    <div className="receipt-row"><span>Security Deposit</span><span>₹{hostel.deposit.toLocaleString()}</span></div>
                    <div className="receipt-row"><span>Dining Plan ({activePlan.name})</span><span>₹{activePlan.price}</span></div>
                    <div className="receipt-divider"></div>
                    <div className="receipt-total">
                       <div className="total-label-group">
                          <span className="label-total">Total Due</span>
                          <span className="label-sub">Inclusive of taxes</span>
                       </div>
                       <span className="value-total">₹{(hostel.price + hostel.deposit + activePlan.price).toLocaleString()}</span>
                    </div>
                 </div>
                 <button className="btn-primary-pro btn-large" onClick={() => navigate(`/booking/${hostel.id}`)}>
                    Reserve Your Room Now
                 </button>
                 <p className="receipt-footer">Secure payment powered by Livora Finance</p>
              </div>
           </aside>
        </div>

      </div>
    </div>
  );
};

export default Listing;
