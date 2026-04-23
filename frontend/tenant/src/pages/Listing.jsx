import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const Listing = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('photos');

  // Mock Data
  const hostel = {
    name: 'Sunshine Residency',
    location: 'Near City College, Bangalore',
    rating: 4.5,
    reviews: 128,
    safetyScore: 9.2,
    occupancy: '85%',
    verified: true,
    price: 6500,
    deposit: 13000,
    amenities: ['High-Speed WiFi', 'AC', 'Attached Washroom', 'Laundry', 'Gym Nearby'],
    landmarks: [
      { name: 'City College', distance: '500m' },
      { name: 'Tech Park', distance: '2.5km' },
      { name: 'Metro Station', distance: '1.2km' }
    ],
    rules: ['No smoking inside', 'Quiet hours 10 PM - 6 AM', 'Visitors allowed till 8 PM'],
    menu: { breakfast: 'Poha / Idli', lunch: 'Rice, Dal, 2 Curries', dinner: 'Roti, Sabzi, Dessert' }
  };

  return (
    <div className="listing-page">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ margin: 0 }}>{hostel.name}</h1>
            {hostel.verified && <span style={{ background: 'var(--accent-success)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>✓ Owner Verified</span>}
          </div>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>📍 {hostel.location}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--accent-primary)' }}>₹{hostel.price}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span></div>
          <p style={{ color: 'var(--accent-warning)', fontWeight: 'bold' }}>★ {hostel.rating} ({hostel.reviews} Reviews) | Safety: {hostel.safetyScore}/10</p>
        </div>
      </header>

      {/* Media Section */}
      <div className="media-section card" style={{ padding: '1rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button className={`btn ${activeTab === 'photos' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('photos')}>Photos</button>
          <button className={`btn ${activeTab === 'video' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('video')}>Video Tour</button>
          <button className={`btn ${activeTab === '360' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('360')}>360° View</button>
        </div>
        <div style={{ height: '400px', background: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-color)' }}>
          {activeTab === 'photos' && <p>Photos Gallery Placeholder</p>}
          {activeTab === 'video' && <p>▶️ Video Player Placeholder</p>}
          {activeTab === '360' && <p>🔄 Interactive 360° Viewer Placeholder</p>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
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
            <Link to="/booking" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', textAlign: 'center', padding: '1rem' }}>Proceed to Book</Link>
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
