import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Home, Bed, Utensils, IndianRupee, ClipboardList, Star, MapPin, ShieldCheck, 
  ChevronRight, Heart, Share2, Info, Wind, Wifi, Battery, Zap, Users, CheckCircle2,
  Tv, Dumbbell, Coffee, Calendar, Wallet, Banknote, ShieldAlert, GraduationCap,
  Sparkles, Coffee as CommonAreaIcon
} from 'lucide-react';
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
  const [selectedBed, setSelectedBed] = useState(null);

  const sectionRefs = {
    overview: useRef(null),
    rooms: useRef(null),
    dining: useRef(null),
    pricing: useRef(null),
    rules: useRef(null),
    reviews: useRef(null),
    nearby: useRef(null),
    safety: useRef(null)
  };

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
    location: b.address || b.locality || 'Alpha Tower Street, Bengaluru',
    distance: '300m from college',
    category: b.category || 'Student',
    gender: b.genderType || b.gender || 'Boys',
    rating: b.rating || 4.1,
    reviews: 128,
    price: b.startingPrice || b.price || 16700,
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'
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

  const beds = Array.from({ length: selectedSharing }, (_, i) => ({
    id: i + 1,
    status: i === 0 ? 'Filled' : 'Available',
    position: i === 0 ? 'Near Door' : i === 1 ? 'Window Side' : 'Center',
    direction: i === 0 ? 'Head → North' : 'Head → South',
    type: selectedSharing === 1 ? 'Single Bed' : 'Single Cot'
  }));

  useEffect(() => {
    const firstAvailable = beds.find(b => b.status === 'Available');
    setSelectedBed(firstAvailable ? firstAvailable.id : null);
  }, [selectedSharing]);

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    sectionRefs[sectionId].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return (
    <div className="lst-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
      <div className="lst-spinner"></div>
      <p style={{ fontWeight: '600', color: 'var(--lst-text-muted)' }}>Loading property details...</p>
    </div>
  );

  if (!hostel) return (
    <div className="lst-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <p style={{ fontWeight: '600', color: 'var(--lst-text-muted)', fontSize: '1.2rem' }}>Property not found.</p>
    </div>
  );

  const pricing = {
    1: { rent: 18000, deposit: 36000, food: 3500, maintenance: 999 },
    2: { rent: 12000, deposit: 24000, food: 3000, maintenance: 799 },
    3: { rent: 9000, deposit: 18000, food: 2500, maintenance: 599 }
  };
  const currentPrice = pricing[selectedSharing];

  const roomScores = [
    { name: 'Comfort Score', val: 92, icon: <Sparkles size={16} /> },
    { name: 'Privacy Score', val: 85, icon: <ShieldCheck size={16} /> },
    { name: 'Study Friendly', val: 88, icon: <GraduationCap size={16} /> },
    { name: 'Sleep Quality', val: 90, icon: <Bed size={16} /> },
    { name: 'Ventilation', val: 94, icon: <Wind size={16} /> },
    { name: 'Noise Level', val: 20, icon: <Zap size={16} /> }
  ];

  const nearbyPlaces = [
    { name: 'Reva University', dist: '300m', icon: '🎓' },
    { name: 'Kattigenahalli Bus Stop', dist: '150m', icon: '🚌' },
    { name: 'Sparsh Hospital', dist: '1.2km', icon: '🏥' },
    { name: 'More Supermarket', dist: '400m', icon: '🛒' },
    { name: 'Cult Fit Gym', dist: '600m', icon: '🏋️' }
  ];

  const roommatePrefs = [
    { label: 'Early Riser Friendly', icon: '☀️' },
    { label: 'Night Owl Friendly', icon: '🌙' },
    { label: 'Study Oriented', icon: '📚' },
    { label: 'Non-Smoker', icon: '🚭' },
    { label: 'Language: English/Hindi', icon: '🗣️' }
  ];

  const trustBadges = [
    { title: 'Verified Property', desc: 'Physically verified by Livora team', icon: '✅' },
    { title: 'Safe for Students', desc: '24/7 internal security audit', icon: '🛡️' },
    { title: 'CCTV Protected', desc: 'Full coverage of common areas', icon: '📷' },
    { title: 'Police Verified', desc: 'Owner documentation verified', icon: '👮' }
  ];

  const financialOptions = [
    { label: 'EMI Available', val: 'Starts ₹3,200/mo' },
    { label: 'Zero Deposit', val: 'On selected profiles' },
    { label: 'UPI/Card', val: 'Instant cashback' }
  ];

  const lifestyleFeatures = [
    { label: 'Reading Room', icon: <GraduationCap size={18} /> },
    { label: 'Common TV Area', icon: <Tv size={18} /> },
    { label: 'Indoor Games', icon: <Zap size={18} /> },
    { label: 'Gym Access', icon: <Dumbbell size={18} /> },
    { label: 'Community Events', icon: <Users size={18} /> }
  ];

  const cleanlinessStatus = [
    { label: 'Last Deep Cleaned', val: '2 days ago', icon: '✨' },
    { label: 'Last Sanitized', val: 'Today, 10 AM', icon: '🧴' },
    { label: 'Pest Control', val: 'Certified', icon: '🪳' },
    { label: 'Laundry Day', val: 'Tue, Fri, Sun', icon: '🧺' }
  ];

  const reviews = [
    { name: 'Rahul Sharma', rating: 5, comment: 'Best ventilation in this area. The window side bed is amazing for morning sunlight.', initial: 'R' },
    { name: 'Priya Singh', rating: 4, comment: 'The common areas are very clean. WiFi is fast enough for my online classes.', initial: 'P' }
  ];

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: <Home size={18} /> },
    { id: 'rooms', label: 'Rooms', icon: <Bed size={18} /> },
    { id: 'dining', label: 'Dining', icon: <Utensils size={18} /> },
    { id: 'pricing', label: 'Pricing', icon: <IndianRupee size={18} /> },
    { id: 'rules', label: 'Rules', icon: <ClipboardList size={18} /> },
    { id: 'reviews', label: 'Reviews', icon: <Star size={18} /> },
    { id: 'nearby', label: 'Nearby', icon: <MapPin size={18} /> },
    { id: 'safety', label: 'Safety', icon: <ShieldCheck size={18} /> }
  ];

  return (
    <div className="lst-page">
      {/* Top Navigation Bar */}
      <div className="lst-topbar">
        <button className="lst-back-btn" onClick={() => navigate(-1)}>
          <ChevronRight style={{ transform: 'rotate(180deg)' }} size={20} />
          Back
        </button>
        <div className="lst-topbar-actions">
          <button className={`lst-save-btn ${wishlistId ? 'saved' : ''}`} onClick={handleWishlistToggle}>
            <Heart size={18} fill={wishlistId ? 'currentColor' : 'none'} />
            {wishlistId ? 'Saved' : 'Save'}
          </button>
          <button className="lst-save-btn"><Share2 size={18} /> Share</button>
        </div>
      </div>

      {/* Header */}
      <header className="lst-header">
        <div className="lst-badges">
          <span className="lst-badge premium">PREMIUM CHOICE</span>
          <span className="lst-badge blue">{hostel.gender}</span>
          <span className="lst-badge green">{hostel.category}</span>
          <span className="lst-badge orange">BEST FOR EXAMS</span>
        </div>
        <h1 className="lst-title">{hostel.name}</h1>
        <p className="lst-location">
          <MapPin size={16} />
          {hostel.location} • <span className="lst-dist">{hostel.distance}</span>
        </p>
        <div className="lst-rating-row">
          <div className="lst-rating-badge">⭐ {hostel.rating}</div>
          <span className="lst-review-count">{hostel.reviews} Student Reviews</span>
        </div>
      </header>

      {/* Gallery */}
      <section className="lst-gallery">
        <div className="lst-gallery-main">
          <img src={hostel.images[0]} alt="Main view" />
        </div>
        <div className="lst-gallery-side">
          <img src={hostel.images[1]} alt="Room view" />
          <img src={hostel.images[2]} alt="Common area" />
        </div>
      </section>

      {/* Sticky Tab Navigation */}
      <nav className="lst-sticky-nav">
        {navTabs.map(tab => (
          <button 
            key={tab.id} 
            className={`lst-nav-item ${activeTab === tab.id ? 'active' : ''}`} 
            onClick={() => scrollToSection(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="lst-content">
        <div className="lst-main-col">
          
          {/* Live Availability */}
          <div className="lst-live-box">
            <div className="lst-live-left">
              <div className="lst-pulse"></div>
              <span className="lst-live-text">5 Students currently viewing this room</span>
            </div>
            <div className="lst-occupancy-bar">
              <div className="lst-occ-fill" style={{ width: '85%' }}></div>
            </div>
            <span className="lst-live-text" style={{ color: '#ef4444' }}>Only 2 Beds Left!</span>
          </div>

          {/* Section: Overview */}
          <div id="overview" ref={sectionRefs.overview} className="lst-section">
            <h3 className="lst-section-title">
              <span className="lst-icon-wrap"><Info size={18} /></span>
              Smart Room Scores
            </h3>
            <div className="lst-score-grid">
              {roomScores.map((s, i) => (
                <div key={i} className="lst-score-card">
                  <div className="lst-score-header">
                    <span className="lst-score-name">{s.name}</span>
                    {s.icon}
                  </div>
                  <span className="lst-score-val">{s.name === 'Noise Level' ? 'Low' : `${s.val}%`}</span>
                  <div className="lst-progress-bg">
                    <div className="lst-progress-fill" style={{ width: `${s.name === 'Noise Level' ? 20 : s.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sharing Selector */}
          <div className="lst-sharing-box">
            <span className="lst-selector-label">Choose Your Stay Configuration</span>
            <div className="lst-sharing-pills">
              {[1, 2, 3].map(n => (
                <button key={n} className={`lst-sharing-pill ${selectedSharing === n ? 'active' : ''}`} onClick={() => setSelectedSharing(n)}>
                  {n === 1 ? 'Single Private' : `${n} Sharing`}
                </button>
              ))}
            </div>
          </div>

          {/* Section: Rooms (Interactive Map) */}
          <div id="rooms" ref={sectionRefs.rooms} className="lst-section">
            <h3 className="lst-section-title">
              <span className="lst-icon-wrap"><Bed size={18} /></span>
              Interactive Bed Layout
            </h3>
            <div className="lst-room-map-wrapper">
              <div className="lst-floor-plan">
                <div className="lst-door v"></div>
                <div className="lst-window top"></div>
                
                {/* Visual Beds based on sharing */}
                {beds.map((bed, i) => (
                  <div 
                    key={bed.id} 
                    className={`lst-bed-visual ${bed.status.toLowerCase()} ${selectedBed === bed.id ? 'selected' : ''}`}
                    style={{ 
                      left: selectedSharing === 1 ? '50%' : (i % 2 === 0 ? '15%' : '65%'), 
                      top: '20%',
                      transform: selectedSharing === 1 ? 'translateX(-50%)' : 'none'
                    }}
                    onClick={() => bed.status === 'Available' && setSelectedBed(bed.id)}
                  >
                    <div className="lst-bed-pillow"></div>
                    <span className="lst-bed-label-vis">BED {bed.id}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h4 className="lst-section-title" style={{ fontSize: '1.1rem' }}>Roommate & Stay Preferences</h4>
              <div className="lst-pref-grid">
                {roommatePrefs.map((p, i) => (
                  <div key={i} className={`lst-pref-pill ${i < 3 ? 'active' : ''}`}>
                    <span>{p.icon}</span>
                    {p.label}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <h4 className="lst-section-title" style={{ fontSize: '1.1rem' }}>Bed Experience Details</h4>
              <div className="lst-score-grid">
                 <div className="lst-score-card">
                    <span className="lst-score-name">Sunlight Access</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Zap size={14} color="#f59e0b" /> <span style={{ fontWeight: 700 }}>Excellent</span>
                    </div>
                 </div>
                 <div className="lst-score-card">
                    <span className="lst-score-name">WiFi Signal</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Wifi size={14} color="#10b981" /> <span style={{ fontWeight: 700 }}>Strong</span>
                    </div>
                 </div>
                 <div className="lst-score-card">
                    <span className="lst-score-name">Charging Access</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Battery size={14} color="#3b82f6" /> <span style={{ fontWeight: 700 }}>Dual Port</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Section: Dining */}
          <div id="dining" ref={sectionRefs.dining} className="lst-section">
            <h3 className="lst-section-title">
              <span className="lst-icon-wrap"><Utensils size={18} /></span>
              Dining & Nutrition
            </h3>
            <div className="lst-table-grid">
              <div className="lst-table-cell">
                <span className="lst-tc-label">Meal Type</span>
                <span className="lst-tc-value">Home-style Veg/Non-Veg</span>
              </div>
              <div className="lst-table-cell">
                <span className="lst-tc-label">Cleanliness</span>
                <span className="lst-tc-value">FSSAI Certified</span>
              </div>
            </div>
            
            <div style={{ marginTop: '1.5rem' }}>
               <h4 className="lst-section-title" style={{ fontSize: '1.1rem' }}>Cleanliness & Maintenance</h4>
               <div className="lst-nearby-list">
                 {cleanlinessStatus.map((c, i) => (
                    <div key={i} className="lst-nearby-item">
                      <div className="lst-nb-left">
                        <span className="lst-nb-icon">{c.icon}</span>
                        <span className="lst-nb-name">{c.label}</span>
                      </div>
                      <span className="lst-nb-dist" style={{ color: 'var(--lst-text-main)' }}>{c.val}</span>
                    </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Section: Lifestyle */}
          <div className="lst-section">
            <h3 className="lst-section-title">
              <span className="lst-icon-wrap"><Sparkles size={18} /></span>
              Student Lifestyle Features
            </h3>
            <div className="lst-pref-grid">
               {lifestyleFeatures.map((f, i) => (
                 <div key={i} className="lst-pref-pill active">
                   {f.icon}
                   {f.label}
                 </div>
               ))}
            </div>
          </div>

          {/* Section: Safety */}
          <div id="safety" ref={sectionRefs.safety} className="lst-section">
            <h3 className="lst-section-title">
              <span className="lst-icon-wrap"><ShieldCheck size={18} /></span>
              Trust & Safety Badges
            </h3>
            <div className="lst-trust-grid">
               {trustBadges.map((b, i) => (
                 <div key={i} className="lst-trust-card">
                   <div className="lst-trust-icon">{b.icon}</div>
                   <div className="lst-trust-info">
                     <h5>{b.title}</h5>
                     <p>{b.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          {/* Section: Nearby */}
          <div id="nearby" ref={sectionRefs.nearby} className="lst-section">
            <h3 className="lst-section-title">
              <span className="lst-icon-wrap"><MapPin size={18} /></span>
              Location & Nearby Places
            </h3>
            <div className="lst-nearby-list">
              {nearbyPlaces.map((p, i) => (
                <div key={i} className="lst-nearby-item">
                  <div className="lst-nb-left">
                    <span className="lst-nb-icon">{p.icon}</span>
                    <span className="lst-nb-name">{p.name}</span>
                  </div>
                  <span className="lst-nb-dist">{p.dist}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Financial */}
          <div className="lst-section">
            <h3 className="lst-section-title">
              <span className="lst-icon-wrap"><Wallet size={18} /></span>
              Smart Financial Options
            </h3>
            <div className="lst-finance-grid">
               {financialOptions.map((o, i) => (
                 <div key={i} className="lst-fin-card">
                   <span className="lst-fin-label">{o.label}</span>
                   <span className="lst-fin-val">{o.val}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Section: Rules */}
          <div id="rules" ref={sectionRefs.rules} className="lst-section">
             <h3 className="lst-section-title">
               <span className="lst-icon-wrap"><ClipboardList size={18} /></span>
               House Rules & Policies
             </h3>
             <div className="lst-rules-list">
               {['No smoking inside rooms', 'Visitor hours: 9 AM - 8 PM', 'Quiet hours: 10 PM - 7 AM', 'Weekly deep cleaning included'].map((r, i) => (
                 <div key={i} className="lst-rule-item">
                   <CheckCircle2 size={16} color="#10b981" />
                   <span>{r}</span>
                 </div>
               ))}
             </div>
          </div>

          {/* Section: Reviews */}
          <div id="reviews" ref={sectionRefs.reviews} className="lst-section">
            <h3 className="lst-section-title">
              <span className="lst-icon-wrap"><Star size={18} /></span>
              Student Reviews
            </h3>
            <div className="lst-reviews-grid">
              {reviews.map((r, i) => (
                <div key={i} className="lst-review-card">
                  <div className="lst-review-user">
                    <div className="lst-user-img">{r.initial}</div>
                    <div>
                      <span className="lst-user-name">{r.name}</span>
                      <div style={{ display: 'flex', color: '#f59e0b', fontSize: '0.8rem' }}>
                        {Array.from({ length: r.rating }).map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
                      </div>
                    </div>
                  </div>
                  <p className="lst-review-comment">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <aside className="lst-sidebar">
           <div className="lst-price-card">
              <span className="lst-price-label">MONTHLY RENT</span>
              <div className="lst-price-main">₹{currentPrice.rent.toLocaleString()}<span>/mo</span></div>
              
              <div className="lst-price-breakdown">
                <div className="lst-price-row"><span>Monthly Rent</span><span>₹{currentPrice.rent.toLocaleString()}</span></div>
                <div className="lst-price-row"><span>Security Deposit</span><span>₹{currentPrice.deposit.toLocaleString()}</span></div>
                <div className="lst-price-row"><span>Food & Maintenance</span><span>₹{(currentPrice.food + currentPrice.maintenance).toLocaleString()}</span></div>
                <div className="lst-price-divider"></div>
                <div className="lst-price-row total">
                  <span>Move-in Total</span>
                  <span>₹{(currentPrice.rent + currentPrice.deposit + currentPrice.food + currentPrice.maintenance).toLocaleString()}</span>
                </div>
              </div>

              <button 
                className={`lst-book-btn ${!selectedBed ? 'disabled' : ''}`}
                onClick={() => selectedBed && navigate(`/booking/${hostel.id}?sharing=${selectedSharing}&bed=${selectedBed}`)}
              >
                {selectedBed ? 'Confirm & Reserve Bed' : 'No Beds Available'}
                <ChevronRight size={18} />
              </button>
              <p className="lst-price-footer">100% Secure Payment • Refundable Deposit</p>
           </div>

           <div className="lst-compare-card">
              <h4 className="lst-compare-title">Pricing Comparison</h4>
              <div className="lst-compare-list">
                {[1, 2, 3].map(n => (
                  <div key={n} className={`lst-compare-row ${selectedSharing === n ? 'active' : ''}`} onClick={() => setSelectedSharing(n)}>
                    <div>
                      <strong>{n === 1 ? 'Single Room' : `${n} Sharing`}</strong>
                      <span>{n === 1 ? 'Private' : `${n} beds`}</span>
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
