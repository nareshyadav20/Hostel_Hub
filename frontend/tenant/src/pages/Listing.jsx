import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Star, MapPin, ShieldCheck, 
  Wifi, Wind, Clock, Utensils, 
  Info, AlertCircle, Camera, Video, 
  RotateCcw, CreditCard, CheckCircle2
} from 'lucide-react';

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
    amenities: [
      { name: 'High-Speed WiFi', icon: <Wifi size={18} /> },
      { name: 'AC / Non AC', icon: <Wind size={18} /> },
      { name: 'Laundry', icon: <RotateCcw size={18} /> },
      { name: 'Food Included', icon: <Utensils size={18} /> },
      { name: '24/7 Security', icon: <ShieldCheck size={18} /> }
    ],
    landmarks: [
      { name: 'City College', distance: '500m' },
      { name: 'Tech Park', distance: '2.5km' },
      { name: 'Metro Station', distance: '1.2km' }
    ],
    rules: ['No smoking inside', 'Quiet hours 10 PM - 6 AM', 'Visitors allowed till 8 PM'],
    menu: { breakfast: 'Poha / Idli', lunch: 'Rice, Dal, 2 Curries', dinner: 'Roti, Sabzi, Dessert' }
  };

  return (
    <div className="listing-page fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <Link to="/search" className="btn btn-secondary" style={{ marginBottom: '2rem', padding: '0.6rem 1rem' }}>
        <ArrowLeft size={18} /> Back to Search
      </Link>

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 style={{ margin: 0, fontSize: '2.8rem' }}>{hostel.name}</h1>
            {hostel.verified && (
              <span style={{ background: 'var(--accent-success)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CheckCircle2 size={16} /> Verified
              </span>
            )}
          </div>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="var(--accent-primary)" /> {hostel.location}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-primary)' }}>₹{hostel.price}<span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/mo</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <span style={{ color: 'var(--accent-warning)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Star size={18} fill="var(--accent-warning)" /> {hostel.rating}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>({hostel.reviews} Reviews)</span>
            <span style={{ width: '1px', height: '15px', background: 'var(--border-color)' }}></span>
            <span style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>Safety: {hostel.safetyScore}/10</span>
          </div>
        </div>
      </header>

      {/* Media Section */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <button className={`btn ${activeTab === 'photos' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('photos')}>
            <Camera size={18} /> Photos
          </button>
          <button className={`btn ${activeTab === 'video' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('video')}>
            <Video size={18} /> Video Tour
          </button>
          <button className={`btn ${activeTab === '360' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('360')}>
            <RotateCcw size={18} /> 360° View
          </button>
        </div>
        <div style={{ 
          height: '500px', 
          background: 'var(--bg-tertiary)', 
          borderRadius: '16px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          border: '2px dashed var(--border-color)',
          color: 'var(--text-muted)'
        }}>
          {activeTab === 'photos' && <><Camera size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} /><p>High Resolution Photos Gallery</p></>}
          {activeTab === 'video' && <><Video size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} /><p>Interactive Video Tour Experience</p></>}
          {activeTab === '360' && <><RotateCcw size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} /><p>Immersive 360° VR View</p></>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2.5rem' }}>
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Info size={22} color="var(--accent-primary)" /> About & Amenities
            </h3>
            <p style={{ marginTop: '1.2rem', fontSize: '1rem' }}>
              A premium stay for students and professionals. Current Occupancy: <strong style={{ color: 'var(--accent-success)' }}>{hostel.occupancy}</strong>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1.5rem' }}>
              {hostel.amenities.map((item, i) => (
                 <span key={i} style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', padding: '0.6rem 1rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                   {item.icon} {item.name}
                 </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <MapPin size={22} color="var(--accent-primary)" /> Landmarks & Distance
            </h3>
            <ul style={{ marginTop: '1.2rem', listStyle: 'none', padding: 0 }}>
              {hostel.landmarks.map((l, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: '500' }}>{l.name}</span>
                  <strong style={{ color: 'var(--accent-secondary)' }}>{l.distance}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Utensils size={22} color="var(--accent-primary)" /> Weekly Food Menu
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem', marginTop: '1.5rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Breakfast</p>
                <p style={{ fontWeight: '600' }}>{hostel.menu.breakfast}</p>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-success)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Lunch</p>
                <p style={{ fontWeight: '600' }}>{hostel.menu.lunch}</p>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-warning)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Dinner</p>
                <p style={{ fontWeight: '600' }}>{hostel.menu.dinner}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Pricing & Booking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="card" style={{ background: 'var(--bg-secondary)', border: '2px solid var(--accent-primary)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CreditCard size={22} color="var(--accent-primary)" /> Pricing Summary
            </h3>
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Monthly Rent</span>
                <strong style={{ fontSize: '1.1rem' }}>₹{hostel.price}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Security Deposit</span>
                <strong style={{ fontSize: '1.1rem' }}>₹{hostel.deposit}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Maintenance Fee</span>
                <strong style={{ color: 'var(--text-muted)' }}>₹500</strong>
              </div>
              <div style={{ background: 'var(--border-color)', height: '1px', margin: '1.5rem 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: '800' }}>
                <span>Move-in Total</span>
                <span style={{ color: 'var(--accent-primary)' }}>₹{hostel.price + hostel.deposit + 500}</span>
              </div>
            </div>
            <Link to="/booking" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem', padding: '1.2rem' }}>
              Book Securely Now
            </Link>
            <p style={{ textAlign: 'center', fontSize: '0.75rem', marginTop: '1rem', color: 'var(--text-muted)' }}>
              Fully refundable security deposit as per policy.
            </p>
          </div>

          <div className="card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertCircle size={22} color="var(--accent-warning)" /> House Rules
            </h3>
            <ul style={{ marginTop: '1.2rem', paddingLeft: '1.5rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {hostel.rules.map((rule, i) => (
                <li key={i} style={{ fontSize: '0.95rem' }}>{rule}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Listing;
