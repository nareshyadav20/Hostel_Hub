import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Listing.css';

const Listing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSharing, setSelectedSharing] = useState(2);
  const [selectedBed, setSelectedBed] = useState(2);

  const sectionRefs = {
    overview: useRef(null),
    rooms: useRef(null),
    dining: useRef(null),
    pricing: useRef(null),
    rules: useRef(null)
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

  const pricingMap = {
    1: { rent: 18000, deposit: 36000, food: 3000, maintenance: 799, name: 'Single Room', desc: 'Private room' },
    2: { rent: 12000, deposit: 24000, food: 3000, maintenance: 799, name: '2 Sharing', desc: '2 beds per room' },
    3: { rent: 9000, deposit: 18000, food: 3000, maintenance: 799, name: '3 Sharing', desc: '3 beds per room' }
  };

  const currentPrice = pricingMap[selectedSharing];
  const totalDue = currentPrice.rent + currentPrice.deposit + currentPrice.food + currentPrice.maintenance;

  return (
    <div className="lst-page">
      {/* 1. Header & Gallery */}
      <header className="lst-header">
        <h1 className="lst-title">Livora Premium Boys Hostel</h1>
        <div className="lst-meta">
          <span className="lst-badge rating">⭐ 4.8</span>
          <span className="lst-badge category">🎓 Students</span>
          <span className="lst-badge gender">👨 Boys</span>
          <span>📍 Koramangala, Bangalore</span>
        </div>
      </header>

      <div className="lst-gallery">
        <div className="lst-img-main"><img src={images[0]} alt="Main" className="lst-img" /></div>
        <div className="lst-img-side"><img src={images[1]} alt="Side 1" className="lst-img" /></div>
        <div className="lst-img-side"><img src={images[2]} alt="Side 2" className="lst-img" /></div>
      </div>

      {/* 2. Nav Tabs */}
      <div className="lst-nav-wrap">
        <div className="lst-nav-tabs">
          {['overview', 'rooms', 'dining', 'pricing', 'rules'].map(tab => (
            <button key={tab} className={`lst-nav-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => handleScrollTo(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
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
            
            <h3 style={{fontSize:'16px', marginBottom:'12px'}}>Occupancy & Category</h3>
            <div className="lst-grid-4">
              <div className="lst-info-card" style={{background:'var(--lst-bg-blue)'}}>
                <span className="lst-ic-label">Sharing</span>
                <span className="lst-ic-val">{selectedSharing} Sharing</span>
              </div>
              <div className="lst-info-card" style={{background:'var(--lst-bg-purple)'}}>
                <span className="lst-ic-label">Category</span>
                <span className="lst-ic-val">Students</span>
              </div>
              <div className="lst-info-card" style={{background:'var(--lst-bg-orange)'}}>
                <span className="lst-ic-label">Gender</span>
                <span className="lst-ic-val">Boys</span>
              </div>
              <div className="lst-info-card" style={{background:'var(--lst-bg-green)'}}>
                <span className="lst-ic-label">Occupancy</span>
                <span className="lst-ic-val">70% Full</span>
              </div>
            </div>

            <h3 style={{fontSize:'16px', marginBottom:'12px'}}>Building & Security</h3>
            <div className="lst-grid-3">
              <div className="lst-svg-card"><span className="lst-svg-icon">🏢</span><div className="lst-svg-text"><h4>Floor</h4><p>3rd Floor</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">🛗</span><div className="lst-svg-text"><h4>Lift</h4><p>Available</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">🔋</span><div className="lst-svg-text"><h4>Power Backup</h4><p>24/7 Generator</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">📷</span><div className="lst-svg-text"><h4>CCTV</h4><p>All Common Areas</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">👮</span><div className="lst-svg-text"><h4>Security</h4><p>24/7 Guard</p></div></div>
              <div className="lst-svg-card"><span className="lst-svg-icon">🅿️</span><div className="lst-svg-text"><h4>Parking</h4><p>2-Wheeler</p></div></div>
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

            <h3 style={{fontSize:'16px', marginBottom:'12px'}}>Room Dimensions</h3>
            <div className="lst-grid-3">
              <div className="lst-info-card" style={{border:'1px solid var(--lst-border)'}}>
                <span className="lst-ic-label">Length</span><span className="lst-ic-val">12 ft</span>
              </div>
              <div className="lst-info-card" style={{border:'1px solid var(--lst-border)'}}>
                <span className="lst-ic-label">Width</span><span className="lst-ic-val">14 ft</span>
              </div>
              <div className="lst-info-card" style={{border:'1px solid var(--lst-primary)', background:'var(--lst-bg-blue)'}}>
                <span className="lst-ic-label" style={{color:'var(--lst-primary)'}}>Total Area</span><span className="lst-ic-val">168 sq ft</span>
              </div>
            </div>

            <h3 style={{fontSize:'16px', marginBottom:'12px'}}>Bed Availability</h3>
            <div className="lst-bed-wrapper">
              <div style={{display:'flex', gap:'20px', marginBottom:'16px', fontSize:'14px', fontWeight:700}}>
                <span>Total Beds: {selectedSharing}</span>
                <span style={{color:'var(--lst-success)'}}>Available: {selectedSharing === 1 ? 1 : 1}</span>
                <span style={{color:'var(--lst-danger)'}}>Occupied: {selectedSharing === 1 ? 0 : selectedSharing - 1}</span>
              </div>
              
              <div className="lst-bed-list">
                {Array.from({length: selectedSharing}).map((_, i) => {
                  const bedNum = i + 1;
                  const isFilled = selectedSharing > 1 && bedNum === 1; // Bed 1 is filled if sharing > 1
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

            <h3 style={{fontSize:'16px', marginTop:'24px', marginBottom:'12px'}}>Room Facilities</h3>
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

            <h3 style={{fontSize:'16px', marginBottom:'12px'}}>Bathroom Details</h3>
            <div className="lst-grid-4">
              <div className="lst-info-card" style={{border:'1px solid var(--lst-border)'}}>
                <span className="lst-ic-label">Type</span><span className="lst-ic-val">Attached</span>
              </div>
              <div className="lst-info-card" style={{border:'1px solid var(--lst-border)'}}>
                <span className="lst-ic-label">Count</span><span className="lst-ic-val">1 per room</span>
              </div>
              <div className="lst-info-card" style={{border:'1px solid var(--lst-border)'}}>
                <span className="lst-ic-label">Hot Water</span><span className="lst-ic-val">24/7 Geyser</span>
              </div>
              <div className="lst-info-card" style={{border:'1px solid var(--lst-border)'}}>
                <span className="lst-ic-label">Toilet</span><span className="lst-ic-val">Western</span>
              </div>
            </div>
          </div>

          {/* DINING SECTION */}
          <div ref={sectionRefs.dining} className="lst-section">
            <h2 className="lst-section-title"><span className="lst-section-icon">🍽️</span> Dining & Food</h2>
            <div className="lst-grid-3">
              <div className="lst-info-card" style={{background:'var(--lst-bg-orange)'}}>
                <span className="lst-ic-label" style={{color:'#c2410c'}}>Meal Type</span><span className="lst-ic-val">Veg + Non-Veg</span>
              </div>
              <div className="lst-info-card" style={{background:'var(--lst-bg-green)'}}>
                <span className="lst-ic-label" style={{color:'#15803d'}}>Weekly Menu</span><span className="lst-ic-val">7-day rotation</span>
              </div>
              <div className="lst-info-card" style={{background:'var(--lst-bg-blue)'}}>
                <span className="lst-ic-label" style={{color:'#1d4ed8'}}>Custom Menu</span><span className="lst-ic-val">On request</span>
              </div>
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
                    <td style={{fontWeight: selectedSharing === num ? 800 : 600}}>{pricingMap[num].name}</td>
                    <td>{pricingMap[num].desc}</td>
                    <td style={{fontWeight: selectedSharing === num ? 800 : 600}}>₹{pricingMap[num].rent.toLocaleString()}</td>
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

        {/* 5. SIDEBAR BOOKING WIDGET */}
        <div className="lst-sidebar">
          <div className="lst-booking-card">
            <div className="lst-book-title">MONTHLY RENT</div>
            <div className="lst-book-price">₹{currentPrice.rent.toLocaleString()} <span>/mo</span></div>
            
            <div className="lst-bill-row"><span>Room Rent</span><span>₹{currentPrice.rent.toLocaleString()}</span></div>
            <div className="lst-bill-row"><span>Security Deposit</span><span>₹{currentPrice.deposit.toLocaleString()}</span></div>
            <div className="lst-bill-row"><span>Food (Monthly)</span><span>₹{currentPrice.food.toLocaleString()}</span></div>
            <div className="lst-bill-row"><span>Maintenance</span><span>₹{currentPrice.maintenance.toLocaleString()}</span></div>
            
            <div className="lst-bill-divider"></div>
            
            <div className="lst-bill-total"><span>Total Due (Move-in)</span><span>₹{totalDue.toLocaleString()}</span></div>
            
            <div style={{background:'var(--lst-bg-blue)', padding:'10px', borderRadius:'8px', marginBottom:'20px', fontSize:'14px', fontWeight:700, color:'var(--lst-primary)', textAlign:'center'}}>
              Selected Bed: {selectedBed ? `Bed ${selectedBed}` : 'None'}
            </div>

            <button className="lst-btn-reserve" disabled={!selectedBed}>Reserve Your Room Now</button>
            <div style={{textAlign:'center', marginTop:'12px', fontSize:'12px', color:'var(--lst-text-muted)'}}>🔒 Secure payment powered by Livora Finance</div>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM BAR */}
      <div className="lst-mobile-bar">
        <div>
          <div style={{fontSize:'18px', fontWeight:800, color:'var(--lst-primary)'}}>₹{currentPrice.rent.toLocaleString()}<span style={{fontSize:'12px', color:'var(--lst-text-muted)'}}>/mo</span></div>
          <div style={{fontSize:'13px', fontWeight:600}}>{currentPrice.name}</div>
        </div>
        <button className="lst-btn-reserve" style={{width:'auto', padding:'12px 24px', margin:0}} disabled={!selectedBed}>Reserve</button>
      </div>

    </div>
  );
};

export default Listing;
