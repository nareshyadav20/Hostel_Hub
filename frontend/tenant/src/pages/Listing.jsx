import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const Listing = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('photos');

  // Mock Database based on Landing.jsx
  const allHostels = [
    {
      id: '1',
      name: 'StayNest Elite - Koramangala',
      location: 'Koramangala 4th Block, Bengaluru',
      rating: 4.8, reviews: 156, safetyScore: 9.5, occupancy: '92%', verified: true,
      price: 12500, deposit: 25000,
      amenities: ['High-Speed WiFi', 'A/C', 'Mess', 'Gym', 'Laundry', 'Study Room'],
      roomTypes: [
        { type: 'Single Elite', price: 18000, status: 'Waitlist', color: 'var(--accent-warning)' },
        { type: 'Luxury 2 Sharing', price: 12500, status: 'Available', color: 'var(--accent-success)' },
        { type: 'Comfort 3 Sharing', price: 9500, status: 'Limited', color: 'var(--accent-error)' }
      ],
      landmarks: [{ name: 'Christ University', distance: '800m' }, { name: 'Nexus Mall', distance: '1.2km' }, { name: 'Sony World Signal', distance: '500m' }],
      rules: ['No smoking inside', 'Quiet hours 11 PM - 6 AM', 'Visitors allowed till 9 PM'],
      menu: { breakfast: 'Poha / Idli / Vada', lunch: 'Rice, Dal, 2 Veg Curries', dinner: 'Roti, Paneer Sabzi, Salad' }
    },
    {
      id: '2',
      name: 'Modern Stay for Students',
      location: 'Indiranagar, Bengaluru',
      rating: 4.5, reviews: 112, safetyScore: 9.0, occupancy: '85%', verified: true,
      price: 8500, deposit: 17000,
      amenities: ['Laundry', 'Study Room', '24/7 Security', 'High-Speed WiFi'],
      roomTypes: [
        { type: 'Private Room', price: 14000, status: 'Available', color: 'var(--accent-success)' },
        { type: 'Standard 2 Sharing', price: 8500, status: 'Limited', color: 'var(--accent-warning)' }
      ],
      landmarks: [{ name: 'Indiranagar Metro', distance: '400m' }, { name: '100ft Road', distance: '600m' }],
      rules: ['Student ID required', 'Quiet hours 10 PM - 7 AM', 'No outside food delivery after 11 PM'],
      menu: { breakfast: 'Aloo Paratha / Upma', lunch: 'Rice, Rajma, Sabzi', dinner: 'Roti, Dal Tadka, Veggies' }
    },
    {
      id: '3',
      name: 'Professional Co-Living',
      location: 'HSR Layout Sector 2, Bengaluru',
      rating: 4.6, reviews: 204, safetyScore: 9.6, occupancy: '95%', verified: true,
      price: 14000, deposit: 28000,
      amenities: ['Workstations', 'High-Speed WiFi', 'Cafe', 'Gym', 'Housekeeping'],
      roomTypes: [
        { type: 'Studio', price: 22000, status: 'Waitlist', color: 'var(--accent-error)' },
        { type: 'Premium 2 Sharing', price: 14000, status: 'Available', color: 'var(--accent-success)' }
      ],
      landmarks: [{ name: 'Silk Board Signal', distance: '1.5km' }, { name: 'HSR BDA Complex', distance: '900m' }],
      rules: ['Professionals only', 'Pets allowed (subject to approval)'],
      menu: { breakfast: 'Continental Spread', lunch: 'Buffet (North & South Indian)', dinner: 'Multi-cuisine Buffet' }
    },
    {
      id: '4',
      name: 'The Hive - Whitefield',
      location: 'Whitefield Main Road, Bengaluru',
      rating: 4.7, reviews: 89, safetyScore: 9.2, occupancy: '78%', verified: false,
      price: 11000, deposit: 22000,
      amenities: ['Gaming Zone', 'Power Backup', 'Housekeeping', 'Mess'],
      roomTypes: [
        { type: 'Standard Single', price: 16000, status: 'Available', color: 'var(--accent-success)' },
        { type: 'Classic 2 Sharing', price: 11000, status: 'Available', color: 'var(--accent-success)' }
      ],
      landmarks: [{ name: 'ITPL', distance: '2.1km' }, { name: 'Phoenix Marketcity', distance: '3.5km' }],
      rules: ['No loud music after 10 PM', 'Visitors allowed till 10 PM'],
      menu: { breakfast: 'Dosa / Uttapam', lunch: 'Rice, Sambar, Poriyal', dinner: 'Roti, Chana Masala' }
    },
    {
      id: '5',
      name: 'Zenith Living Hyderabad',
      location: 'Gachibowli, Hyderabad',
      rating: 4.9, reviews: 320, safetyScore: 9.8, occupancy: '98%', verified: true,
      price: 15500, deposit: 31000,
      amenities: ['Premium Mess', 'Swimming Pool', 'Yoga Deck', 'High-Speed WiFi', 'A/C'],
      roomTypes: [
        { type: 'Luxury Single', price: 25000, status: 'Waitlist', color: 'var(--accent-error)' },
        { type: 'Elite 2 Sharing', price: 15500, status: 'Limited', color: 'var(--accent-warning)' }
      ],
      landmarks: [{ name: 'DLF Cyber City', distance: '1.2km' }, { name: 'Biodiversity Park', distance: '800m' }],
      rules: ['No smoking', 'Biometric entry only'],
      menu: { breakfast: 'Idli / Dosa / Vada', lunch: 'Hyderabadi Biryani (Weekends), Rice, Dal', dinner: 'Roti, Mixed Veg, Chicken Curry (Optional)' }
    },
    {
      id: '6',
      name: 'Urban Den Mumbai',
      location: 'Andheri West, Mumbai',
      rating: 4.4, reviews: 67, safetyScore: 8.9, occupancy: '88%', verified: true,
      price: 18000, deposit: 36000,
      amenities: ['Co-working Space', 'Gym', 'Terrace Garden', 'A/C', 'Housekeeping'],
      roomTypes: [
        { type: 'Compact Single', price: 28000, status: 'Available', color: 'var(--accent-success)' },
        { type: 'Standard 2 Sharing', price: 18000, status: 'Available', color: 'var(--accent-success)' },
        { type: 'Budget 3 Sharing', price: 14000, status: 'Limited', color: 'var(--accent-warning)' }
      ],
      landmarks: [{ name: 'Andheri Station', distance: '1.5km' }, { name: 'Lokhandwala', distance: '2km' }],
      rules: ['Curfew 12 AM', 'No visitors in rooms'],
      menu: { breakfast: 'Misal Pav / Poha', lunch: 'Rice, Dal, Bhaji', dinner: 'Roti, Veg Curry, Dessert' }
    }
  ];

  const hostel = allHostels.find(h => h.id === id) || allHostels[0];

  const handleBookingClick = (e) => {
    const token = localStorage.getItem('token');
    if (!token) {
      e.preventDefault();
      alert('Please Sign In to proceed with booking and payments.');
      window.location.href = '/login';
    }
  };

  return (
    <div className="listing-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 3rem 1rem', animation: 'authFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      {/* Top Nav Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '700', padding: '0.6rem 1.2rem', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-color)', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--border-color)'} onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Listings
        </Link>

        <Link to="/" style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '50%', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-error)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'rotate(90deg)'; }} onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.transform = 'rotate(0deg)'; }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </Link>
      </div>

      <header className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '2.5rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(30,30,40,0.8) 0%, rgba(20,20,30,0.95) 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', backdropFilter: 'blur(16px)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', background: 'linear-gradient(to right, #fff, #a0a0b0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{hostel.name}</h1>
            {hostel.verified && <span style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'var(--accent-success)', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '800', border: '1px solid rgba(34, 197, 94, 0.3)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Owner Verified
            </span>}
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {hostel.location}
          </p>
        </div>
        <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-primary)', textShadow: '0 0 20px rgba(56, 189, 248, 0.3)', lineHeight: '1' }}>₹{hostel.price}<span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '600' }}>/mo</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.8rem', justifyContent: 'flex-end' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-warning)', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '800' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              {hostel.rating} ({hostel.reviews})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '800' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Safety: {hostel.safetyScore}/10
            </span>
          </div>
        </div>
      </header>

      {/* Media Section */}
      <div className="media-section card" style={{ padding: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button className={`btn ${activeTab === 'photos' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('photos')}>Photos</button>
          <button className={`btn ${activeTab === 'video' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('video')}>Video Tour</button>
          <button className={`btn ${activeTab === '360' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('360')}>360° View</button>
        </div>
        <div style={{ background: 'var(--bg-tertiary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', minHeight: '400px' }}>
          {activeTab === 'photos' && (
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem', height: '400px' }}>
              <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" alt="Main Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <img src="https://images.unsplash.com/photo-1502672260266-1c1c24240938?auto=format&fit=crop&w=400&q=80" alt="Living Area" style={{ width: '100%', height: 'calc(50% - 0.25rem)', objectFit: 'cover' }} />
                <div style={{ position: 'relative', height: 'calc(50% - 0.25rem)' }}>
                  <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80" alt="Bathroom" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer', transition: 'background 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}>
                    +12 Photos
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'video' && (
            <div style={{ height: '400px', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/y9j-BL5ocW8?autoplay=1&mute=1&loop=1&playlist=y9j-BL5ocW8"
                title="Hostel Room Tour"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ border: 'none' }}
              ></iframe>
            </div>
          )}
          {activeTab === '360' && (
            <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', position: 'relative', overflow: 'hidden' }}>
              <img src="https://images.unsplash.com/photo-1600607687983-a043924f3c71?auto=format&fit=crop&w=1200&q=80" alt="360 Panorama" style={{ width: '120%', height: '100%', objectFit: 'cover', filter: 'blur(3px)' }} />
              <div className="glass-card" style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.85)', padding: '2.5rem', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: '800' }}>Interactive 360° View</h3>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Drag around to explore the property</p>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: '12px', fontWeight: '700', marginTop: '0.5rem' }}>Start Exploring</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <div className="card">
            <h3>🛏️ Available Room Types</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginTop: '1.5rem' }}>
              {hostel.roomTypes.map((room, i) => (
                <div key={i} className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', width: '8px', height: '8px', borderRadius: '50%', background: room.color }}></div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{room.status.toUpperCase()}</p>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{room.type}</h4>
                  <p style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--accent-primary)', marginTop: '0.8rem' }}>₹{room.price}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / mo</span></p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>About & Amenities</h3>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>A premium stay for students and professionals. Current Occupancy: <strong style={{ color: 'var(--accent-success)' }}>{hostel.occupancy}</strong></p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '1rem' }}>
              {hostel.amenities.map((item, i) => (
                <span key={i} style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem' }}>{item}</span>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>📍 Landmarks & Distance</h3>
            <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
              {hostel.landmarks.map((l, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span>{l.name}</span>
                  <strong>{l.distance}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>🍽️ Food Menu Preview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>BREAKFAST</p>
                <p>{hostel.menu.breakfast}</p>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-success)' }}>LUNCH</p>
                <p>{hostel.menu.lunch}</p>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-warning)' }}>DINNER</p>
                <p>{hostel.menu.dinner}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Pricing & Booking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <div className="card">
            <h3>Price Breakdown</h3>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Monthly Rent</span>
                <strong>₹{hostel.price}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Security Deposit (Refundable)</span>
                <strong>₹{hostel.deposit}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                <span>Maintenance Fee</span>
                <strong>₹500</strong>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '1rem 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span>Total Move-in Cost</span>
                <span style={{ color: 'var(--accent-primary)' }}>₹{hostel.price + hostel.deposit + 500}</span>
              </div>
            </div>
            <Link
              to="/booking"
              onClick={handleBookingClick}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', textAlign: 'center', padding: '1.2rem', fontWeight: '800', borderRadius: '12px' }}
            >
              Proceed to Book
            </Link>
          </div>

          <div className="card">
            <h3>📋 House Rules</h3>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.2rem', color: 'var(--text-secondary)' }}>
              {hostel.rules.map((rule, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>{rule}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Listing;
