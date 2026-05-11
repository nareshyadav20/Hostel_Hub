import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { MOCK_HOSTELS } from '../utils/mockData';
import './Listing.css';

const Listing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedSharing, setSelectedSharing] = useState(2);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlistId, setWishlistId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchHostelDetails = async () => {
      if (!id || id === 'undefined' || id === 'null') { setLoading(false); return; }
      try {
        const response = await API.get(`/buildings/${id}`);
        const b = response.data;
        setHostel(mapBuilding(b));
        const wishRes = await API.get('/tenant-portal/wishlist').catch(() => ({ data: [] }));
        const existing = (wishRes.data || []).find(w => (w.hostelId === b._id || w.hostelId === id));
        if (existing) setWishlistId(existing._id);
      } catch (err) {
        console.error('Error fetching details:', err);
        const mock = MOCK_HOSTELS.find(h => h.id === id) || MOCK_HOSTELS[0];
        setHostel(mapBuilding({ ...mock, _id: id, name: mock?.name || 'Alpha Tower', address: mock?.locality || 'Alpha Tower Street, Bengaluru', startingPrice: mock?.price || 16700 }));
      } finally {
        setLoading(false);
      }
    };
    fetchHostelDetails();
  }, [id]);

  const mapBuilding = (b) => ({
    id: b._id || b.id,
    name: b.name || 'Alpha Tower',
    location: b.address || b.locality || 'Street Address, City',
    distance: '300m from college',
    category: b.category || 'Student',
    gender: b.genderType || b.gender || 'Boys',
    rating: b.rating || 4.1,
    reviews: 128,
    hygieneScore: b.hygieneScore || 98,
    energyEfficiency: b.energyEfficiency || 82,
    smartConfig: b.smartConfig || {},
    price: b.startingPrice || b.price || 16700,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80'
    ]
  });

  const handleWishlistToggle = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (wishlistId) {
        await API.delete(`/tenant-portal/wishlist/${wishlistId}`);
        setWishlistId(null);
      } else {
        const res = await API.post('/tenant-portal/wishlist', {
          hostelId: hostel.id || id, hostelName: hostel.name, hostelLocation: hostel.location, hostelPrice: hostel.price, hostelImage: hostel.images[0], hostelRating: hostel.rating, gender: hostel.gender, type: 'Premium'
        });
        setWishlistId(res.data._id);
      }
    } catch (err) { console.error('Wishlist error:', err); } finally { setIsSaving(false); }
  };

  if (loading) return <div className="staynest-dashboard loading-state"><div className="premium-spinner"></div><p>Loading property details...</p></div>;
  if (!hostel) return <div className="staynest-dashboard"><p>Property not found.</p></div>;

  // Dynamic data based on sharing
  const pricing = {
    1: { rent: 18000, deposit: 36000, food: 3500, maintenance: 999 },
    2: { rent: 12000, deposit: 24000, food: 3000, maintenance: 799 },
    3: { rent: 9000, deposit: 18000, food: 2500, maintenance: 599 }
  };
  const currentPrice = pricing[selectedSharing];

  const beds = Array.from({ length: selectedSharing }, (_, i) => ({
    id: i + 1,
    status: i === 0 ? 'Filled' : 'Available',
    position: i === 0 ? 'Near Door' : i === 1 ? 'Window Side' : 'Center',
    direction: i === 0 ? 'Head → North' : 'Head → South',
    type: selectedSharing === 1 ? 'Single Bed' : 'Single Cot'
  }));

  const roomSize = selectedSharing === 1 ? { l: 10, w: 12 } : selectedSharing === 2 ? { l: 12, w: 14 } : { l: 14, w: 16 };

  const facilities = [
    { icon: '🪭', label: 'Fans', value: selectedSharing === 3 ? '2' : '1' },
    { icon: '💡', label: 'Lights', value: `${selectedSharing}` },
    { icon: '🪟', label: 'Windows', value: selectedSharing === 3 ? '3' : '2' },
    { icon: '🔌', label: 'Sockets', value: `${selectedSharing * 2}` },
    { icon: '🗄️', label: 'Cupboards', value: `${selectedSharing}` },
    { icon: '📚', label: 'Study Table', value: 'Yes' },
    { icon: '🪑', label: 'Chair', value: `${selectedSharing}` },
    { icon: '📶', label: 'WiFi', value: 'High-Speed' },
    { icon: '❄️', label: 'AC', value: selectedSharing === 1 ? 'Yes' : 'Non-AC' }
  ];

  const buildingFeatures = [
    { icon: '🏢', label: 'Floor', value: '3rd Floor' },
    { icon: '🛗', label: 'Lift', value: 'Available' },
    { icon: '🔋', label: 'Power Backup', value: '24/7 Generator' },
    { icon: '📷', label: 'CCTV', value: 'All Common Areas' },
    { icon: '👮', label: 'Security', value: '24/7 Guard' },
    { icon: '🅿️', label: 'Parking', value: '2-Wheeler' }
  ];

  const houseRules = [
    'No smoking inside rooms or common areas',
    'Visitors allowed between 9 AM – 8 PM only',
    'Quiet hours from 10 PM – 7 AM',
    'Keep rooms clean; weekly inspection applies',
    'No pets allowed on premises',
    'ID verification mandatory for all residents'
  ];

  return (
    <div className="lst-page">
      {/* ── Top Bar ── */}
      <div className="lst-topbar">
        <button className="lst-back-btn" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back
        </button>
        <div className="lst-topbar-actions">
          <button className={`lst-save-btn ${wishlistId ? 'saved' : ''}`} onClick={handleWishlistToggle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlistId ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            {wishlistId ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>

      {/* ── Header ── */}
      <header className="lst-header">
        <div className="lst-header-info">
          <div className="lst-badges">
            <span className="lst-badge blue">{hostel.gender}</span>
            <span className="lst-badge green">{hostel.category}</span>
            <span className="lst-badge orange">⚡ Filling Fast</span>
          </div>
          <h1 className="lst-title">{hostel.name}</h1>
          <p className="lst-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
            {hostel.location} • <span>{hostel.distance}</span>
          </p>
          <div className="lst-rating-row">
            <div className="lst-rating-badge">⭐ {hostel.rating}</div>
            <span className="lst-review-count">{hostel.reviews} reviews</span>
          </div>
        </div>
      </header>

      {/* ── Gallery ── */}
      <section className="lst-gallery">
        <div className="lst-gallery-main">
          <img src={hostel.images[0]} alt="Main view" />
        </div>
        <div className="lst-gallery-side">
          <img src={hostel.images[1]} alt="Room view" />
          <img src={hostel.images[2]} alt="Facility view" />
        </div>
      </section>

      {/* ── Tab Navigation ── */}
      <nav className="lst-tabs">
        {['overview', 'rooms', 'dining', 'pricing', 'rules'].map(tab => (
          <button key={tab} className={`lst-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* ── Content ── */}
      <div className="lst-content">

        {/* Left Column */}
        <div className="lst-main-col">

          {/* Sharing Selector */}
          <div className="lst-sharing-selector">
            <span className="lst-selector-label">Select Room Type</span>
            <div className="lst-sharing-pills">
              {[1, 2, 3].map(n => (
                <button key={n} className={`lst-sharing-pill ${selectedSharing === n ? 'active' : ''}`} onClick={() => setSelectedSharing(n)}>
                  {n === 1 ? 'Single Room' : `${n} Sharing`}
                </button>
              ))}
            </div>
          </div>

          {/* Room Overview */}
          {(activeTab === 'overview' || activeTab === 'rooms') && (
            <>
              {/* Room Dimensions */}
              <section className="lst-section">
                <h3 className="lst-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>
                  Room Dimensions
                </h3>
                <div className="lst-dim-grid">
                  <div className="lst-dim-card">
                    <span className="lst-dim-label">Length</span>
                    <span className="lst-dim-value">{roomSize.l} ft</span>
                  </div>
                  <div className="lst-dim-card">
                    <span className="lst-dim-label">Width</span>
                    <span className="lst-dim-value">{roomSize.w} ft</span>
                  </div>
                  <div className="lst-dim-card highlight">
                    <span className="lst-dim-label">Total Area</span>
                    <span className="lst-dim-value">{roomSize.l * roomSize.w} sq ft</span>
                  </div>
                </div>
              </section>

              {/* Occupancy & Intelligence Info */}
              <section className="lst-section">
                <h3 className="lst-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  Occupancy & Property Intelligence
                </h3>
                <div className="lst-info-chips">
                  <div className="lst-chip"><span className="lst-chip-label">Sharing</span><span className="lst-chip-value">{selectedSharing} Sharing</span></div>
                  <div className="lst-chip"><span className="lst-chip-label">Hygiene</span><span className="lst-chip-value" style={{ color: '#10B981' }}>{hostel.hygieneScore}% Score</span></div>
                  <div className="lst-chip"><span className="lst-chip-label">Efficiency</span><span className="lst-chip-value" style={{ color: '#6366F1' }}>{hostel.energyEfficiency}% Rating</span></div>
                  <div className="lst-chip"><span className="lst-chip-label">Smart Access</span><span className="lst-chip-value">{hostel.smartConfig?.hasSmartAccess ? 'Active' : 'Basic'}</span></div>
                </div>
                
                {/* AI Insight Box */}
                <div style={{ marginTop: '1.2rem', padding: '1.2rem', borderRadius: '20px', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', border: '1px solid #e2e8f0' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
                      <div style={{ padding: '0.4rem', borderRadius: '10px', background: '#e0e7ff', color: '#6366F1' }}>
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '1000', color: '#1e293b', letterSpacing: '0.05em' }}>LIVORA AI INSIGHT</span>
                   </div>
                   <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: '#475569', lineHeight: '1.5' }}>
                      Based on recent sanitization audits and occupancy patterns, this property maintains a top-tier hygiene index. Ideal for residents prioritizing cleanliness and modern smart amenities.
                   </p>
                </div>
              </section>

              {/* Bed Availability */}
              <section className="lst-section">
                <h3 className="lst-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9"/></svg>
                  Bed Availability
                </h3>
                <div className="lst-bed-summary">
                  <div className="lst-bed-stat"><span className="lst-bed-num">{selectedSharing}</span><span>Total Beds</span></div>
                  <div className="lst-bed-stat available"><span className="lst-bed-num">{beds.filter(b => b.status === 'Available').length}</span><span>Available</span></div>
                  <div className="lst-bed-stat filled"><span className="lst-bed-num">{beds.filter(b => b.status === 'Filled').length}</span><span>Occupied</span></div>
                </div>
                <div className="lst-bed-cards">
                  {beds.map(bed => (
                    <div key={bed.id} className={`lst-bed-card ${bed.status.toLowerCase()}`}>
                      <div className="lst-bed-card-header">
                        <span className="lst-bed-label">Bed {bed.id}</span>
                        <span className={`lst-bed-status ${bed.status.toLowerCase()}`}>{bed.status}</span>
                      </div>
                      <div className="lst-bed-details">
                        <div><span className="lst-bd-key">Type</span><span className="lst-bd-val">{bed.type}</span></div>
                        <div><span className="lst-bd-key">Position</span><span className="lst-bd-val">{bed.position}</span></div>
                        <div><span className="lst-bd-key">Direction</span><span className="lst-bd-val">{bed.direction}</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Facilities */}
              <section className="lst-section">
                <h3 className="lst-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  Room Facilities
                </h3>
                <div className="lst-fac-grid">
                  {facilities.map((f, i) => (
                    <div key={i} className="lst-fac-card">
                      <span className="lst-fac-icon">{f.icon}</span>
                      <div className="lst-fac-info">
                        <span className="lst-fac-label">{f.label}</span>
                        <span className="lst-fac-value">{f.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Bathroom */}
              <section className="lst-section">
                <h3 className="lst-section-title">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 6c0-1.1.9-2 2-2h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6z"/><path d="M10 10h4"/></svg>
                  Bathroom Details
                </h3>
                <div className="lst-info-chips">
                  <div className="lst-chip"><span className="lst-chip-label">Type</span><span className="lst-chip-value">Attached</span></div>
                  <div className="lst-chip"><span className="lst-chip-label">Count</span><span className="lst-chip-value">1 per room</span></div>
                  <div className="lst-chip"><span className="lst-chip-label">Hot Water</span><span className="lst-chip-value">24/7 Geyser</span></div>
                  <div className="lst-chip"><span className="lst-chip-label">Western Toilet</span><span className="lst-chip-value">Yes</span></div>
                </div>
              </section>
            </>
          )}

          {/* Dining */}
          {(activeTab === 'overview' || activeTab === 'dining') && (
            <section className="lst-section">
              <h3 className="lst-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>
                Dining & Food
              </h3>
              <div className="lst-info-chips" style={{ marginBottom: '1.5rem' }}>
                <div className="lst-chip"><span className="lst-chip-label">Meal Type</span><span className="lst-chip-value">Veg + Non-Veg</span></div>
                <div className="lst-chip"><span className="lst-chip-label">Weekly Menu</span><span className="lst-chip-value">7-day rotation</span></div>
                <div className="lst-chip"><span className="lst-chip-label">Custom</span><span className="lst-chip-value">Available on request</span></div>
              </div>
              <div className="lst-meal-grid">
                {[
                  { name: 'Breakfast', time: '08:00 - 09:30', items: 'Poha / Omelette / Tea', color: '#3b82f6' },
                  { name: 'Lunch', time: '12:30 - 14:00', items: 'Veg Thali / Curd / Salad', color: '#ef4444' },
                  { name: 'Dinner', time: '20:00 - 21:30', items: 'Phulka / Mix Veg / Paneer', color: '#10b981' }
                ].map(m => (
                  <div key={m.name} className="lst-meal-card" style={{ borderLeftColor: m.color }}>
                    <div className="lst-meal-icon" style={{ color: m.color, background: `${m.color}12` }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/></svg>
                    </div>
                    <div>
                      <div className="lst-meal-header"><strong>{m.name}</strong><span>{m.time}</span></div>
                      <p className="lst-meal-items">{m.items}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Building Features */}
          {(activeTab === 'overview' || activeTab === 'rooms') && (
            <section className="lst-section">
              <h3 className="lst-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Building & Security
              </h3>
              <div className="lst-fac-grid">
                {buildingFeatures.map((f, i) => (
                  <div key={i} className="lst-fac-card">
                    <span className="lst-fac-icon">{f.icon}</span>
                    <div className="lst-fac-info">
                      <span className="lst-fac-label">{f.label}</span>
                      <span className="lst-fac-value">{f.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* House Rules */}
          {(activeTab === 'overview' || activeTab === 'rules') && (
            <section className="lst-section">
              <h3 className="lst-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                House Rules
              </h3>
              <div className="lst-rules-list">
                {houseRules.map((rule, i) => (
                  <div key={i} className="lst-rule-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── Right Sidebar: Pricing ── */}
        <aside className="lst-sidebar">
          <div className="lst-price-card">
            <div className="lst-price-header">
              <span className="lst-price-label">Monthly Rent</span>
              <div className="lst-price-main">₹{currentPrice.rent.toLocaleString()}<span>/mo</span></div>
            </div>

            {(activeTab === 'overview' || activeTab === 'pricing') && (
              <div className="lst-price-breakdown">
                <div className="lst-price-row"><span>Room Rent</span><span>₹{currentPrice.rent.toLocaleString()}</span></div>
                <div className="lst-price-row"><span>Security Deposit</span><span>₹{currentPrice.deposit.toLocaleString()}</span></div>
                <div className="lst-price-row"><span>Food (Monthly)</span><span>₹{currentPrice.food.toLocaleString()}</span></div>
                <div className="lst-price-row"><span>Maintenance</span><span>₹{currentPrice.maintenance}</span></div>
                <div className="lst-price-divider"></div>
                <div className="lst-price-row total">
                  <span>Total Due (Move-in)</span>
                  <span>₹{(currentPrice.rent + currentPrice.deposit + currentPrice.food + currentPrice.maintenance).toLocaleString()}</span>
                </div>
              </div>
            )}

            <button className="lst-book-btn" onClick={() => navigate(`/booking/${hostel.id}`)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Reserve Your Room Now
            </button>
            <p className="lst-price-footer">Secure payment powered by Livora Finance</p>
          </div>

          {/* Sharing Comparison */}
          <div className="lst-compare-card">
            <h4 className="lst-compare-title">Pricing Comparison</h4>
            <div className="lst-compare-list">
              {[1, 2, 3].map(n => (
                <div key={n} className={`lst-compare-row ${selectedSharing === n ? 'active' : ''}`} onClick={() => setSelectedSharing(n)}>
                  <div>
                    <strong>{n === 1 ? 'Single Room' : `${n} Sharing`}</strong>
                    <span>{n === 1 ? 'Private room' : `${n} beds per room`}</span>
                  </div>
                  <div className="lst-compare-price">₹{pricing[n].rent.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Listing;
