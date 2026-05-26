import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Check, Info, Wind, Zap, BookOpen, ShieldCheck,
  Clock, CreditCard, ChevronDown, ChevronUp, Star,
  Volume2, Lock, MousePointer2, Smartphone,
  Coffee, Wifi, Snowflake, MapPin, IndianRupee, Home as HomeIcon, Search,
  Bed, Library, Monitor, Users, Video, Phone, Eye, Moon, Train, Bus, ShoppingCart, Activity, Dumbbell, Shirt, Sparkles
} from 'lucide-react';
import API from '../api/axios';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';
import './Listing.css';
import ImageModal from '../components/ImageModal';

const Listing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSharing, setSelectedSharing] = useState(2);
  const [selectedBed, setSelectedBed] = useState(2);
  const [selectedFilters, setSelectedFilters] = useState(['Available']);
  const [expandedBed, setExpandedBed] = useState(null);

  const toggleFilter = (filter) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const sectionRefs = {
    overview: useRef(null),
    rooms: useRef(null),
    dining: useRef(null),
    pricing: useRef(null),
    rules: useRef(null),
    rent: useRef(null)
  };

  const handleScrollTo = (sectionId) => {
    setActiveTab(sectionId);
    sectionRefs[sectionId].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const images = [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=400'
  ];

  const [hostel, setHostel] = useState(null);
  const [menuUpdateInfo, setMenuUpdateInfo] = useState('');
  const [modalInfo, setModalInfo] = useState({ isOpen: false, image: '' });
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Auto-play / Auto-navigation carousel for building photos
  const galleryImages = React.useMemo(() => {
    if (hostel?.images && hostel.images.length > 0) {
      return hostel.images.map(img => (img.startsWith('http') || img.startsWith('data:')) ? img : `https://livora-hostel-hub-1.onrender.com${img}`);
    }
    // Fallback images if building has no images
    return [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1596276865531-9556a7de74f9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80"
    ];
  }, [hostel?.images]);

  React.useEffect(() => {
    if (galleryImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveImageIndex(prev => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [galleryImages]);

  React.useEffect(() => {
    const fetchHostel = () => {
      API.get(`/buildings/public/${id}`).then(res => setHostel(res.data)).catch(console.error);
    };

    fetchHostel();

    // Connect to real-time sync server
    connectSocket(id);

    // Listen for live updates
    socket.on('hostelUpdated', (updatedHostel) => {
      if (updatedHostel._id === id || (updatedHostel.buildings && updatedHostel.buildings.includes(id))) {
        setHostel(updatedHostel);
        console.log('⚡ Real-time Update: Hostel data refreshed');
      }
    });

    socket.on('menuUpdated', (data) => {
      setMenuUpdateInfo(data.indicator || 'Updated Just Now');
      setTimeout(() => setMenuUpdateInfo(''), 8000);
    });

    socket.on('bedStatusUpdated', () => {
      fetchHostel();
    });

    return () => {
      socket.off('hostelUpdated');
      socket.off('menuUpdated');
      socket.off('bedStatusUpdated');
    };
  }, [id]);

  const basePrice = hostel?.startingPrice || 5000;
  const foodCost = (hostel?.foodCharges !== undefined && hostel?.foodCharges !== null && hostel?.foodCharges > 0) ? hostel.foodCharges : 3000;
  const maintenanceCost = (hostel?.maintenanceCharges !== undefined && hostel?.maintenanceCharges !== null && hostel?.maintenanceCharges > 0) ? hostel.maintenanceCharges : 799;

  const pricingMap = {
    1: {
      rent: (hostel?.rentSingle !== undefined && hostel?.rentSingle !== null && hostel?.rentSingle > 0) ? hostel.rentSingle : (basePrice * 2),
      deposit: (hostel?.securityDeposit !== undefined && hostel?.securityDeposit !== null && hostel?.securityDeposit > 0) ? hostel.securityDeposit : (basePrice * 2),
      food: foodCost,
      maintenance: maintenanceCost,
      name: 'Single Room',
      desc: 'Private room'
    },
    2: {
      rent: (hostel?.rentDouble !== undefined && hostel?.rentDouble !== null && hostel?.rentDouble > 0) ? hostel.rentDouble : Math.round(basePrice * 1.3333),
      deposit: (hostel?.securityDeposit !== undefined && hostel?.securityDeposit !== null && hostel?.securityDeposit > 0) ? hostel.securityDeposit : Math.round(basePrice * 1.3333),
      food: foodCost,
      maintenance: maintenanceCost,
      name: '2 Sharing',
      desc: '2 beds per room'
    },
    3: {
      rent: (hostel?.rentTriple !== undefined && hostel?.rentTriple !== null && hostel?.rentTriple > 0) ? hostel.rentTriple : basePrice,
      deposit: (hostel?.securityDeposit !== undefined && hostel?.securityDeposit !== null && hostel?.securityDeposit > 0) ? hostel.securityDeposit : basePrice,
      food: foodCost,
      maintenance: maintenanceCost,
      name: '3 Sharing',
      desc: '3 beds per room'
    }
  };

  const currentPrice = pricingMap[selectedSharing];
  const totalDue = currentPrice.rent + currentPrice.deposit + currentPrice.food + currentPrice.maintenance;

  return (
    <div className="lst-page">
      {/* 1. Header & Gallery */}
      <header className="lst-header" style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100, color: '#64748b', fontWeight: 'bold' }}
        >
          ✕
        </button>
        <h1 className="lst-title">{hostel?.name || 'Livora Premium Hostel'}</h1>
        <div className="lst-meta">
          <span className="lst-badge rating">⭐ {hostel?.rating || '4.8'}</span>
          <span className="lst-badge category">🎓 {hostel?.category || 'Students'}</span>
          <span className="lst-badge gender">👨 {hostel?.genderType || 'Boys'}</span>
          <span>📍 {hostel?.address || 'Koramangala, Bangalore'}</span>
          {hostel?.popularityLabel && <span className="lst-badge premium-tag"><Star size={12} fill="currentColor" /> {hostel.popularityLabel}</span>}
          <span className="lst-badge premium-tag"><ShieldCheck size={12} /> Verified Property</span>
        </div>

        <div className="lst-quick-highlights">
          <div className="lst-qh-item"><Check size={14} color="var(--lst-success)" /> <span>12 Beds Left</span></div>
          <div className="lst-qh-item"><IndianRupee size={14} color="var(--lst-primary)" /> <span>Starts ₹9,000</span></div>
          <div className="lst-qh-item"><MapPin size={14} color="var(--lst-info)" /> <span>2km from College</span></div>
          <div className="lst-qh-item"><Coffee size={14} color="var(--lst-warning)" /> <span>Food Included</span></div>
          <div className="lst-qh-item"><Wifi size={14} color="var(--lst-primary)" /> <span>100 Mbps WiFi</span></div>
          <div className="lst-qh-item"><Zap size={14} color="var(--lst-warning)" /> <span>24/7 Power</span></div>
          <div className="lst-qh-item"><Clock size={14} color="var(--lst-success)" /> <span>Move-In Ready</span></div>
        </div>
      </header>

      <div className="lst-gallery" style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
        <div
          className="lst-img-main"
          onClick={() => setModalInfo({ isOpen: true, image: galleryImages[activeImageIndex] })}
          style={{ cursor: 'zoom-in', width: '100%', height: '100%', position: 'relative' }}
        >
          <img
            src={galleryImages[activeImageIndex]}
            alt={`Building Photo ${activeImageIndex + 1}`}
            className="lst-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.5s ease-in-out' }}
          />

          {/* Left Arrow */}
          {galleryImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
              }}
              style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.8)', border: 'none', borderRadius: '50%',
                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: '#1E293B', transition: 'all 0.2s',
                zIndex: 5
              }}
            >
              ❮
            </button>
          )}

          {/* Right Arrow */}
          {galleryImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex(prev => (prev + 1) % galleryImages.length);
              }}
              style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.8)', border: 'none', borderRadius: '50%',
                width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: '#1E293B', transition: 'all 0.2s',
                zIndex: 5
              }}
            >
              ❯
            </button>
          )}

          {/* Navigation Dots */}
          {galleryImages.length > 1 && (
            <div style={{
              position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.4)', padding: '6px 12px', borderRadius: '20px',
              zIndex: 10
            }}>
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  style={{
                    width: '8px', height: '8px', borderRadius: '50%', border: 'none',
                    background: activeImageIndex === idx ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                    padding: 0, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* 2. Nav Tabs */}
      <div className="lst-nav-wrap">
        <div className="lst-nav-tabs">
          {['overview', 'rooms', 'dining', 'pricing', 'rules', 'rent'].map(tab => (
            <button key={tab} className={`lst-nav-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => handleScrollTo(tab)}>
              {tab === 'rent' ? 'MONTHLY RENT' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="lst-content">
        <div className="lst-main">

          {/* OVERVIEW SECTION */}
          <div ref={sectionRefs.overview} className="lst-section">
            <h2 className="lst-section-title">
              <span className="lst-section-icon">📊</span> Overview & Details
            </h2>

            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Occupancy & Category</h3>
            <div className="lst-grid-4">
              <div className="lst-info-card" style={{ background: 'var(--lst-bg-blue)' }}>
                <span className="lst-ic-label">Sharing</span>
                <span className="lst-ic-val">{selectedSharing} Sharing</span>
              </div>
              <div className="lst-info-card" style={{ background: 'var(--lst-bg-purple)' }}>
                <span className="lst-ic-label">Category</span>
                <span className="lst-ic-val">Students</span>
              </div>
              <div className="lst-info-card" style={{ background: 'var(--lst-bg-orange)' }}>
                <span className="lst-ic-label">Gender</span>
                <span className="lst-ic-val">Boys</span>
              </div>
              <div className="lst-info-card" style={{ background: 'var(--lst-bg-green)' }}>
                <span className="lst-ic-label">Occupancy</span>
                <span className="lst-ic-val">70% Full</span>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Building & Security</h3>
            <div className="lst-grid-3">
              <div className="lst-svg-card"><span className="lst-svg-icon">🏢</span><div className="lst-svg-text"><h4>Floor</h4><p>3rd Floor</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">🛗</span><div className="lst-svg-text"><h4>Lift</h4><p>Available</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">🔋</span><div className="lst-svg-text"><h4>Power Backup</h4><p>24/7 Generator</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">📷</span><div className="lst-svg-text"><h4>CCTV</h4><p>All Common Areas</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">👮</span><div className="lst-svg-text"><h4>Security</h4><p>24/7 Guard</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">🅿️</span><div className="lst-svg-text"><h4>Parking</h4><p>2-Wheeler</p></div></div>
            </div>

            <h3 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '12px' }}>Smart Safety & Security</h3>
            <div className="lst-safety-grid">
              <div className="lst-safety-card verified"><ShieldCheck size={18} /> <span>CCTV Active</span></div>
              <div className="lst-safety-card verified"><ShieldCheck size={18} /> <span>Live-in Warden</span></div>
              <div className="lst-safety-card verified"><ShieldCheck size={18} /> <span>Biometric Entry</span></div>
              <div className="lst-safety-card verified"><ShieldCheck size={18} /> <span>Fire Safety Equipped</span></div>
              <div className="lst-safety-card verified"><ShieldCheck size={18} /> <span>Female Safety Verified</span></div>
              <div className="lst-safety-card"><Phone size={18} /> <span>Emergency Contact</span></div>
              <div className="lst-safety-card"><Eye size={18} /> <span>Visitor Tracking</span></div>
              <div className="lst-safety-card"><Moon size={18} /> <span>Night Security Guard</span></div>
            </div>

            {/* NEW SECTION: NEARBY ACCESS */}
            <h3 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '12px' }}>Nearby Access & Transit</h3>
            <div className="lst-nearby-grid">
              <div className="lst-nearby-item"><Train size={16} /> <span>Metro Station</span> <strong>800m</strong></div>
              <div className="lst-nearby-item"><Bus size={16} /> <span>Bus Stop</span> <strong>200m</strong></div>
              <div className="lst-nearby-item"><ShoppingCart size={16} /> <span>Grocery Store</span> <strong>100m</strong></div>
              <div className="lst-nearby-item"><Activity size={16} /> <span>Hospital</span> <strong>1km</strong></div>
              <div className="lst-nearby-item"><Coffee size={16} /> <span>Restaurants</span> <strong>50m</strong></div>
              <div className="lst-nearby-item"><Dumbbell size={16} /> <span>Gym</span> <strong>300m</strong></div>
            </div>
          </div>

          {/* ROOMS SECTION */}
          <div ref={sectionRefs.rooms} className="lst-section">
            <h2 className="lst-section-title"><span className="lst-section-icon">🛏️</span> Select Room Type</h2>
            <div className="lst-room-types">
              {[1, 2, 3].map(num => (
                <button key={num} className={`lst-rt-btn ${selectedSharing === num ? 'active' : ''}`} onClick={() => { setSelectedSharing(num); setSelectedBed(num === 2 ? 2 : null); }}>
                  {num === 1 ? 'Single Room' : `${num} Sharing`}
                </button>
              ))}
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Room Dimensions</h3>
            <div className="lst-grid-3">
              <div className="lst-info-card" style={{ border: '1px solid var(--lst-border)' }}>
                <span className="lst-ic-label">Length</span><span className="lst-ic-val">12 ft</span>
              </div>
              <div className="lst-info-card" style={{ border: '1px solid var(--lst-border)' }}>
                <span className="lst-ic-label">Width</span><span className="lst-ic-val">14 ft</span>
              </div>
              <div className="lst-info-card" style={{ border: '1px solid var(--lst-primary)', background: 'var(--lst-bg-blue)' }}>
                <span className="lst-ic-label" style={{ color: 'var(--lst-primary)' }}>Total Area</span><span className="lst-ic-val">168 sq ft</span>
              </div>
            </div>

            {/* NEW SECTION: ROOM INSIGHTS */}
            <div className="lst-room-insights">
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Room Insights</h3>
              <div className="lst-insights-grid">
                <div className="lst-insight-card"><span>Sunlight</span> <div className="lst-progress"><div style={{ width: '80%' }}></div></div></div>
                <div className="lst-insight-card"><span>Ventilation</span> <div className="lst-progress"><div style={{ width: '90%' }}></div></div></div>
                <div className="lst-insight-card"><span>Quietness</span> <div className="lst-progress"><div style={{ width: '70%' }}></div></div></div>
                <div className="lst-insight-card"><span>Study Env</span> <div className="lst-progress"><div style={{ width: '85%' }}></div></div></div>
                <div className="lst-insight-card"><span>Privacy</span> <div className="lst-progress"><div style={{ width: '60%' }}></div></div></div>
                <div className="lst-insight-card"><span>Freshness</span> <div className="lst-progress"><div style={{ width: '95%' }}></div></div></div>
              </div>
              <div className="lst-best-for">
                <strong>Best For:</strong> <span className="lst-bf-chip">Students</span> <span className="lst-bf-chip">Exam Prep</span> <span className="lst-bf-chip">Remote Work</span>
              </div>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '12px', marginTop: '24px' }}>Bed Availability</h3>
            <div className="lst-bed-wrapper">

              {/* NEW SECTION: AI SMART RECOMMENDATION */}
              <div className="lst-ai-recommendation">
                <div className="lst-ai-header"><Sparkles size={16} color="#8b5cf6" /> <span>AI Smart Match</span></div>
                <p>Based on your profile, <strong>Bed 2 in {selectedSharing}-Sharing</strong> is a 95% match for your study-focused routine and quiet preferences.</p>
                <div className="lst-ai-tags">
                  <span>#BestValue</span> <span>#MostQuiet</span> <span>#ExamFriendly</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', fontSize: '14px', fontWeight: 700 }}>
                <span>Total Beds: {selectedSharing}</span>
                <span style={{ color: 'var(--lst-success)' }}>Available: {selectedSharing - (hostel?.filledBeds?.filter(b => b.sharingType === selectedSharing).length || 0)}</span>
                <span style={{ color: 'var(--lst-danger)' }}>Occupied: {hostel?.filledBeds?.filter(b => b.sharingType === selectedSharing).length || 0}</span>
              </div>

              <div className="lst-bed-list">
                {Array.from({ length: selectedSharing }).map((_, i) => {
                  const bedNum = i + 1;
                  const isFilled = hostel?.filledBeds?.some(b => b.sharingType === selectedSharing && b.bedNumber === bedNum);
                  return (
                    <div key={bedNum}
                      className={`lst-bed-row ${isFilled ? 'occupied' : (selectedBed === bedNum ? 'selected' : '')}`}
                      onClick={() => !isFilled && setSelectedBed(bedNum)}
                    >
                      <div className="lst-bed-left">
                        <h4>Bed {bedNum}</h4>
                        <p>{isFilled ? 'Single Cot • Near Door • Head → North' : 'Single Cot • Window Side • Head → South'}</p>
                      </div>
                      <div className={`lst-bed-status ${isFilled ? 'filled' : (selectedBed === bedNum ? 'sel' : 'avail')}`}>
                        {isFilled ? 'FILLED' : (selectedBed === bedNum ? 'SELECTED' : 'AVAILABLE')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* NEW SECTION: BED DETAILS & PREFERENCES */}
            <h3 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '12px' }}>Bed Details & Preferences</h3>

            {/* Horizontal Filters */}
            <div className="lst-bed-filters">
              {['Available', 'AC', 'Non-AC', 'Window Side', 'Quiet Zone', 'Study Friendly', 'With Locker', 'Lower Bunk', 'Upper Bunk', 'Near Window', 'Best WiFi', 'Most Preferred', 'Newly Added', 'Budget Friendly', 'Premium Beds', 'Attached Bathroom', 'Balcony Room', 'Fast Booking'].map(filter => (
                <button
                  key={filter}
                  className={`lst-filter-chip ${selectedFilters.includes(filter) ? 'active' : ''}`}
                  onClick={() => toggleFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="lst-bed-cards-v2">
              {Array.from({ length: selectedSharing }).map((_, i) => {
                const bedNum = i + 1;
                const isOccupied = hostel?.filledBeds?.some(b => b.sharingType === selectedSharing && b.bedNumber === bedNum);
                const isSelected = selectedBed === bedNum;
                const isExpanded = expandedBed === bedNum;

                return (
                  <div
                    key={bedNum}
                    className={`lst-bed-card-v2 ${isSelected ? 'selected' : ''} ${isOccupied ? 'occupied' : ''}`}
                    onClick={() => !isOccupied && setSelectedBed(bedNum)}
                  >
                    <div className="lst-bed-card-top">
                      <div className="lst-bc-header">
                        <div className="lst-bc-title">
                          <div className="lst-bc-num-wrap">
                            <span className="lst-bc-num">#{bedNum}</span>
                            <h4>Luxury Bed</h4>
                          </div>
                          <span className="lst-bc-type">
                            <HomeIcon size={14} /> {bedNum % 2 === 0 ? 'Lower Bunk' : 'Single Cot'} •
                            <MapPin size={14} /> {bedNum === 1 ? 'Near Door' : 'Window Side'}
                          </span>
                        </div>
                        <div className={`lst-bc-status-pill ${isOccupied ? 'occupied' : (isSelected ? 'selected' : 'available')}`}>
                          {isOccupied ? <Lock size={12} /> : (isSelected ? <Check size={12} /> : <MousePointer2 size={12} />)}
                          {isOccupied ? 'Occupied' : (isSelected ? 'Selected' : 'Available')}
                        </div>
                      </div>

                      <div className="lst-bc-features">
                        <span className="lst-feat-pill qz"><Volume2 size={12} /> Quiet Zone</span>
                        <span className="lst-feat-pill cs"><Zap size={12} /> Charging Socket</span>
                        <span className="lst-feat-pill sf"><BookOpen size={12} /> Study Friendly</span>
                        {bedNum % 2 === 0 && <span className="lst-feat-pill pl"><Lock size={12} /> Personal Locker</span>}
                        <span className="lst-feat-pill ac"><Snowflake size={12} /> AC</span>
                      </div>

                      <div className="lst-bc-footer">
                        <div className="lst-bc-stats">
                          <span className="lst-stat-item"><Star size={14} fill="currentColor" /> 4.5</span>
                          <span className="lst-stat-item"><Volume2 size={14} /> Quiet</span>
                        </div>
                        <button
                          className={`lst-bc-expand-btn ${isExpanded ? 'open' : ''}`}
                          onClick={(e) => { e.stopPropagation(); setExpandedBed(isExpanded ? null : bedNum); }}
                        >
                          {isExpanded ? 'Hide Details' : 'View Details'}
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="lst-bed-card-details" onClick={(e) => e.stopPropagation()}>
                        <div className="lst-details-grid">
                          <div className="lst-details-group">
                            <h5><Bed size={14} /> Bed Specifics</h5>
                            <ul>
                              <li><span>Direction</span><span>North Facing</span></li>
                              <li><span>Window Dist.</span><span>2 ft</span></li>
                              <li><span>Plug Point</span><span>Arm's Reach</span></li>
                              <li><span>Mattress</span><span>Orthopedic</span></li>
                              <li><span>Storage</span><span>Large Under-bed</span></li>
                              <li><span>Privacy</span><span>High</span></li>
                            </ul>
                          </div>
                          <div className="lst-details-group">
                            <h5><Info size={14} /> Bed Basic Info</h5>
                            <ul>
                              <li><span>Bed Direction</span><span>Head → South</span></li>
                              <li><span>Window Side</span><span>Yes</span></li>
                              <li><span>Quiet Zone</span><span>Yes</span></li>
                            </ul>
                          </div>
                          <div className="lst-details-group">
                            <h5><Zap size={14} /> Comfort Features</h5>
                            <ul>
                              <li><span>Personal Locker</span><span>Included</span></li>
                              <li><span>Reading Light</span><span>Adjustable</span></li>
                              <li><span>Charging</span><span>USB + 3-Pin</span></li>
                            </ul>
                          </div>
                          <div className="lst-details-group">
                            <h5><ShieldCheck size={14} /> Safety & Hygiene</h5>
                            <ul>
                              <li><span>Safe Locking</span><span>RFID Support</span></li>
                              <li><span>Last Cleaned</span><span>Today, 10 AM</span></li>
                              <li><span>Laundry</span><span>Weekly Change</span></li>
                            </ul>
                          </div>
                          <div className="lst-details-group">
                            <h5><CreditCard size={14} /> Pricing Details</h5>
                            <div className="lst-bc-price-box">
                              <div className="lst-bc-rent">₹{currentPrice.rent.toLocaleString()}<span>/mo</span></div>
                              <span className="lst-bc-discount">10% Early Bird</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* NEW SECTION: ROOMMATE COMPATIBILITY */}
            <h3 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '12px' }}>Roommate Compatibility</h3>
            <div className="lst-roommate-grid">
              <div className="lst-rm-card"><span>Sleep Schedule</span><strong>Early Birds (10 PM - 6 AM)</strong></div>
              <div className="lst-rm-card"><span>Study Friendly</span><strong>Very High</strong></div>
              <div className="lst-rm-card"><span>Cleanliness</span><strong>Strictly Clean</strong></div>
              <div className="lst-rm-card"><span>Noise Preference</span><strong>Pin-drop Quiet</strong></div>
              <div className="lst-rm-card"><span>Occupants</span><strong>2 Engineering Students</strong></div>
              <div className="lst-rm-card"><span>Compatible With</span><strong>Students, Interns</strong></div>
            </div>

            <h3 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '12px' }}>Room Facilities</h3>
            <div className="lst-grid-3">
              <div className="lst-svg-card"><span className="lst-svg-icon">🪭</span><div className="lst-svg-text"><h4>Fans</h4><p>1</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">💡</span><div className="lst-svg-text"><h4>Lights</h4><p>2</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">🪟</span><div className="lst-svg-text"><h4>Windows</h4><p>2</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">🔌</span><div className="lst-svg-text"><h4>Sockets</h4><p>4</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">🗄️</span><div className="lst-svg-text"><h4>Cupboards</h4><p>2</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">📚</span><div className="lst-svg-text"><h4>Study Table</h4><p>Yes</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">🪑</span><div className="lst-svg-text"><h4>Chair</h4><p>2</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">📶</span><div className="lst-svg-text"><h4>WiFi</h4><p>High-Speed</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">❄️</span><div className="lst-svg-text"><h4>AC</h4><p>Non-AC</p></div></div>
            </div>

            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Bathroom Details</h3>
            <div className="lst-grid-4">
              <div className="lst-info-card" style={{ border: '1px solid var(--lst-border)' }}>
                <span className="lst-ic-label">Type</span><span className="lst-ic-val">Attached</span>
              </div>
              <div className="lst-info-card" style={{ border: '1px solid var(--lst-border)' }}>
                <span className="lst-ic-label">Count</span><span className="lst-ic-val">1 per room</span>
              </div>
              <div className="lst-info-card" style={{ border: '1px solid var(--lst-border)' }}>
                <span className="lst-ic-label">Hot Water</span><span className="lst-ic-val">24/7 Geyser</span>
              </div>
              <div className="lst-info-card" style={{ border: '1px solid var(--lst-border)' }}>
                <span className="lst-ic-label">Toilet</span><span className="lst-ic-val">Western</span>
              </div>
            </div>

            {/* NEW SECTION: STUDENT-FRIENDLY FEATURES */}
            <h3 style={{ fontSize: '16px', marginTop: '24px', marginBottom: '12px' }}>Student-Friendly Features</h3>
            <div className="lst-student-features">
              <div className="lst-sf-item"><BookOpen size={18} /> <span>Study Table Available</span></div>
              <div className="lst-sf-item"><Library size={18} /> <span>Library 500m Away</span></div>
              <div className="lst-sf-item"><Clock size={18} /> <span>Exam Quiet Hours</span></div>
              <div className="lst-sf-item"><Wifi size={18} /> <span>High-Speed WiFi</span></div>
              <div className="lst-sf-item"><Zap size={18} /> <span>4+ Charging Points</span></div>
              <div className="lst-sf-item"><Monitor size={18} /> <span>Laptop Friendly</span></div>
              <div className="lst-sf-item"><Users size={18} /> <span>Group Study Area</span></div>
              <div className="lst-sf-item"><Video size={18} /> <span>Online Class Friendly</span></div>
            </div>
          </div>

          {/* DINING SECTION */}
          <div ref={sectionRefs.dining} className="lst-section">
            <h2 className="lst-section-title"><span className="lst-section-icon">🍽️</span> Dining & Food</h2>
            <div className="lst-grid-3">
              <div className="lst-info-card" style={{ background: 'var(--lst-bg-orange)' }}>
                <span className="lst-ic-label" style={{ color: '#c2410c' }}>Meal Type</span><span className="lst-ic-val">Veg + Non-Veg</span>
              </div>
              <div className="lst-info-card" style={{ background: 'var(--lst-bg-green)', position: 'relative' }}>
                <span className="lst-ic-label" style={{ color: '#15803d' }}>Weekly Menu</span><span className="lst-ic-val">7-day rotation</span>
                {menuUpdateInfo && <span className="lst-live-indicator">{menuUpdateInfo}</span>}
              </div>
              <div className="lst-info-card" style={{ background: 'var(--lst-bg-blue)' }}>
                <span className="lst-ic-label" style={{ color: '#1d4ed8' }}>Custom Menu</span><span className="lst-ic-val">On request</span>
              </div>
            </div>

            {/* NEW SECTION: HOSTEL COMMUNITY */}
            <h3 style={{ fontSize: '16px', marginTop: '32px', marginBottom: '12px' }}>Hostel Community & Lifestyle</h3>
            <div className="lst-community-grid">
              <div className="lst-comm-item">🎉 <span>Weekly Events</span></div>
              <div className="lst-comm-item">🍿 <span>Weekend Movie Nights</span></div>
              <div className="lst-comm-item">🎮 <span>Gaming Zone (PS5)</span></div>
              <div className="lst-comm-item">🛋️ <span>Common AC Lounge</span></div>
              <div className="lst-comm-item">💪 <span>Free Gym Access</span></div>
              <div className="lst-comm-item">🌅 <span>Rooftop Chill Area</span></div>
              <div className="lst-comm-item">🤝 <span>Startup Networking</span></div>
              <div className="lst-comm-item">🪔 <span>Festival Celebrations</span></div>
            </div>
          </div>

          {/* PRICING SECTION */}
          <div ref={sectionRefs.pricing} className="lst-section">
            <h2 className="lst-section-title"><span className="lst-section-icon">💰</span> Pricing Comparison</h2>
            <table className="lst-pricing-table">
              <thead>
                <tr>
                  <th>Room Type</th>
                  <th>Description</th>
                  <th>Monthly Rent</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map(num => (
                  <tr key={num} className={selectedSharing === num ? 'active' : ''}>
                    <td style={{ fontWeight: selectedSharing === num ? 800 : 600 }}>{pricingMap[num].name}</td>
                    <td>{pricingMap[num].desc}</td>
                    <td style={{ fontWeight: selectedSharing === num ? 800 : 600 }}>₹{pricingMap[num].rent.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RULES SECTION */}
          <div ref={sectionRefs.rules} className="lst-section">
            <h2 className="lst-section-title"><span className="lst-section-icon">📜</span> House Rules</h2>
            <div className="lst-rule-list">
              <div className="lst-rule-item">🚫 <span>No smoking inside rooms or common areas</span></div>
              <div className="lst-rule-item">⏰ <span>Visitors allowed between 9 AM – 8 PM only</span></div>
              <div className="lst-rule-item">🤫 <span>Quiet hours from 10 PM – 7 AM</span></div>
              <div className="lst-rule-item">🧹 <span>Keep rooms clean; weekly inspection applies</span></div>
              <div className="lst-rule-item">🐕 <span>No pets allowed on premises</span></div>
              <div className="lst-rule-item">🪪 <span>ID verification mandatory for all residents</span></div>
            </div>
          </div>

        </div>

        {/* SIDEBAR */}
        <div className="lst-sidebar">
          {/* MONTHLY RENT SECTION (Now in Sidebar) */}
          <div ref={sectionRefs.rent} className="lst-section lst-sidebar-card">
            <h2 className="lst-section-title"><span className="lst-section-icon">💰</span> Monthly Rent Breakdown</h2>
            <div className="lst-booking-card" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
              <div className="lst-bill-row"><span>Room Rent</span><span>₹{currentPrice.rent.toLocaleString()}</span></div>
              <div className="lst-bill-row"><span>Security Deposit</span><span>₹{currentPrice.deposit.toLocaleString()}</span></div>
              <div className="lst-bill-row"><span>Food (Monthly)</span><span>₹{currentPrice.food.toLocaleString()}</span></div>
              <div className="lst-bill-row"><span>Maintenance</span><span>₹{currentPrice.maintenance.toLocaleString()}</span></div>

              <div className="lst-bill-divider"></div>

              <div className="lst-bill-total"><span>Total Due (Move-in)</span><span>₹{totalDue.toLocaleString()}</span></div>

              {/* NEW SECTION: MOVE-IN ASSISTANCE */}
              <div className="lst-movein-assist">
                <h4 style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--lst-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={16} color="var(--lst-warning)" /> Move-In Assistance</h4>
                <div className="lst-ma-list">
                  <div className="lst-ma-item"><Check size={14} color="var(--lst-success)" /> <span>Instant Booking Available</span></div>
                  <div className="lst-ma-item"><Check size={14} color="var(--lst-success)" /> <span>Free Virtual/Physical Tour</span></div>
                  <div className="lst-ma-item"><Check size={14} color="var(--lst-success)" /> <span>Luggage Support on Arrival</span></div>
                  <div className="lst-ma-item"><Check size={14} color="var(--lst-success)" /> <span>Setup Assistance Included</span></div>
                  <div className="lst-ma-item"><Check size={14} color="var(--lst-success)" /> <span>Early Move-In Options</span></div>
                </div>
              </div>

              <div style={{ background: 'var(--lst-bg-blue)', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontSize: '15px', fontWeight: 800, color: 'var(--lst-primary)', textAlign: 'center', border: '1px solid rgba(99,102,241,0.1)' }}>
                Selected: {selectedBed ? `Bed ${selectedBed}` : 'Please select a bed above'}
              </div>

              <button
                className="lst-btn-reserve"
                disabled={!selectedBed}
                onClick={() => {
                  if (!localStorage.getItem('token')) {
                    navigate('/login');
                  } else {
                    navigate(`/booking/${id}`, { state: { selectedSharing, selectedBed, basePrice, securityDeposit: currentPrice.deposit } });
                  }
                }}
                style={{ width: '100%', padding: '20px', fontSize: '18px' }}
              >
                Reserve Your Bed Now
              </button>
              <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--lst-text-muted)', fontWeight: 600 }}>
                🔒 Secure payment powered by Livora Finance
              </div>
              <ImageModal
                isOpen={modalInfo.isOpen}
                image={modalInfo.image}
                onClose={() => setModalInfo({ isOpen: false, image: '' })}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Bottom Booking Bar */}
      <div className="lst-mobile-bar">
        <div className="lst-mobile-bar-price">
          <div className="lst-mbp-label">{selectedBed ? `Bed ${selectedBed} Selected` : 'Select a bed'}</div>
          <div className="lst-mbp-amount">₹{currentPrice.rent.toLocaleString()}<span>/mo</span></div>
        </div>
        <button
          className="lst-btn-reserve"
          disabled={!selectedBed}
          onClick={() => {
            if (!localStorage.getItem('token')) {
              navigate('/login');
            } else {
              navigate(`/booking/${id}`, { state: { selectedSharing, selectedBed, basePrice, securityDeposit: currentPrice.deposit } });
            }
          }}
          style={{ width: 'auto', padding: '12px 24px', fontSize: '15px', margin: 0 }}
        >
          Reserve
        </button>
      </div>

    </div>
  );
};

export default Listing;
