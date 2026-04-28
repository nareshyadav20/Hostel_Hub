import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const Listing = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('photos');
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostelDetails = async () => {
      try {
        const response = await API.get(`/buildings/${id}`);
        const b = response.data;
        
        // Map backend building to the structure expected by Listing.jsx
        // We'll use a mix of real data and mock data for fields not in DB yet
        const mapped = {
          id: b._id,
          name: b.name,
          location: b.address,
          rating: 4.5,
          reviews: 156,
          safetyScore: 9.5,
          occupancy: '92%',
          verified: true,
          price: b.startingPrice || 6500,
          deposit: (b.startingPrice || 6500) * 2,
          amenities: b.amenities.length > 0 ? b.amenities : ['WiFi', 'Mess', 'Laundry'],
          roomTypes: b.floors?.[0]?.rooms?.slice(0, 4).map(r => ({
            type: r.roomNumber,
            price: b.startingPrice || 6500,
            deposit: (b.startingPrice || 6500) * 2,
            status: 'Available',
            color: 'var(--accent-success)'
          })) || [
            { type: 'Standard 2 Sharing', price: 6500, deposit: 13000, status: 'Available', color: 'var(--accent-success)' }
          ],
          landmarks: [{ name: 'City College', distance: '200m' }],
          rules: ['No smoking', 'Quiet hours 11 PM'],
          menu: { breakfast: 'Poha', lunch: 'Rice/Dal', dinner: 'Roti/Sabzi' }
        };
        setHostel(mapped);
      } catch (err) {
        console.error('Error fetching building details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostelDetails();
  }, [id]);

  if (loading) return <div className="dashboard-container" style={{ textAlign: 'center', padding: '5rem' }}>Loading property details...</div>;
  if (!hostel) return <div className="dashboard-container" style={{ textAlign: 'center', padding: '5rem' }}>Property not found.</div>;

  const selectedRoom = hostel.roomTypes[selectedRoomIdx] || hostel.roomTypes[0];

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
        <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '700', padding: '0.6rem 1.2rem', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-color)', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Search
        </Link>

        <Link to="/" style={{ width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '50%', color: 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.3s', textDecoration: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </Link>
      </div>

      <header className="glass-card" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '2.5rem',
        borderRadius: '24px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-premium)',
        backdropFilter: 'blur(16px)',
        color: 'var(--text-primary)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>{hostel.name}</h1>
            {hostel.verified && <span style={{ background: 'var(--bg-tertiary)', color: 'var(--accent-primary)', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '800', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              Owner Verified
            </span>}
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.8rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {hostel.location}
          </p>
        </div>
        <div style={{ textAlign: 'right', background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)', textShadow: 'none', lineHeight: '1' }}>₹{selectedRoom.price.toLocaleString()}<span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: '600' }}>/mo</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.8rem', justifyContent: 'flex-end' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '800', border: '1px solid var(--border-color)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              {hostel.rating} ({hostel.reviews})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '800', border: '1px solid var(--border-color)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
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
                <div
                  key={i}
                  onClick={() => setSelectedRoomIdx(i)}
                  className="glass-card"
                  style={{
                    padding: '1.5rem',
                    background: selectedRoomIdx === i ? 'rgba(14, 165, 233, 0.08)' : 'var(--bg-secondary)',
                    border: selectedRoomIdx === i ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    borderRadius: '16px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform: selectedRoomIdx === i ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ position: 'absolute', top: '0.8rem', right: '0.8rem', width: '8px', height: '8px', borderRadius: '50%', background: room.color }}></div>
                  <p style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>{room.status.toUpperCase()}</p>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{room.type}</h4>
                  <p style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--accent-primary)', marginTop: '0.8rem' }}>₹{room.price.toLocaleString()}<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / mo</span></p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>About & Amenities</h3>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>A premium stay for students and professionals. Current Occupancy: <strong style={{ color: 'var(--accent-success)' }}>{hostel.occupancy}</strong></p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '1rem' }}>
              {hostel.amenities.map((item, i) => (
                <span key={i} style={{ background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '700' }}>{item}</span>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>📍 Landmarks & Distance</h3>
            <ul style={{ marginTop: '1rem', listStyle: 'none', padding: 0 }}>
              {hostel.landmarks.map((l, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: i === hostel.landmarks.length - 1 ? 'none' : '1px solid var(--border-color)' }}>
                  <span style={{ fontWeight: '600' }}>{l.name}</span>
                  <strong style={{ color: 'var(--accent-primary)' }}>{l.distance}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>🍽️ Daily & Weekly Nutrition</h3>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', marginBottom: '3rem' }}>
              <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
                <p style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>Breakfast</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '800' }}>{hostel.menu.breakfast}</p>
              </div>
              <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
                <p style={{ color: 'var(--accent-success)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>Lunch</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '800' }}>{hostel.menu.lunch}</p>
              </div>
              <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
                <p style={{ color: 'var(--accent-warning)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>Dinner</p>
                <p style={{ fontSize: '1.1rem', fontWeight: '800' }}>{hostel.menu.dinner}</p>
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <div style={{ padding: '1.2rem 1.5rem', background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span style={{ fontWeight: '800', fontSize: '1rem' }}>Weekly Dining Schedule</span>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '1rem' }}>
                  <thead>
                    <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                      <th style={{ padding: '1.5rem 2rem' }}>DAY</th>
                      <th style={{ padding: '1.5rem 2rem' }}>TIFFIN</th>
                      <th style={{ padding: '1.5rem 2rem' }}>LUNCH</th>
                      <th style={{ padding: '1.5rem 2rem' }}>DINNER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { d: 'Mon', t: 'Dosa/Podi', l: 'South Thali', dn: 'Veg Pulao' },
                      { d: 'Tue', t: 'Poha/Jalebi', l: 'Rice/Dal/Sabzi', dn: 'Phulka/Alu' },
                      { d: 'Wed', t: 'Vada Sambar', l: 'Curd Rice', dn: 'Dal Tadka' },
                      { d: 'Thu', t: 'Upma/Chutney', l: 'Roti/Mix Veg', dn: 'Egg Curry' },
                      { d: 'Fri', t: 'Paratha/Curd', l: 'Veg Biryani', dn: 'Chapati/Sabzi' },
                      { d: 'Sat', t: 'Omelette', l: 'Fried Rice', dn: 'Chinese' },
                      { d: 'Sun', t: 'Puri Bhaji', l: 'Sunday Feast', dn: 'Chef Special' }
                    ].map((m, i) => (
                      <tr key={i} style={{ borderBottom: i === 6 ? 'none' : '1px solid var(--border-color)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                        <td style={{ padding: '1.2rem 2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{m.d}</td>
                        <td style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{m.t}</td>
                        <td style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{m.l}</td>
                        <td style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontWeight: '600' }}>{m.dn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Pricing & Booking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '1.5rem' }}>Price Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Monthly Rent ({selectedRoom.type})</span>
                <strong style={{ fontSize: '1.1rem' }}>₹{selectedRoom.price.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Security Deposit</span>
                <strong style={{ fontSize: '1.1rem' }}>₹{selectedRoom.deposit.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Maintenance Fee</span>
                <strong style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>₹500</strong>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '900' }}>Total Move-in</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: '950', color: 'var(--accent-primary)' }}>₹{(selectedRoom.price + selectedRoom.deposit + 500).toLocaleString()}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>*Refundable deposit included</p>
              </div>
            </div>

            <Link
              to="/booking"
              onClick={handleBookingClick}
              className="btn btn-primary"
              style={{
                width: '100%', marginTop: '2rem', textAlign: 'center', padding: '1.4rem',
                fontWeight: '900', borderRadius: '16px', fontSize: '1.1rem',
                boxShadow: '0 15px 30px rgba(14, 165, 233, 0.3)',
                display: 'block', textDecoration: 'none'
              }}
            >
              Proceed to Book
            </Link>
          </div>

          <div className="card">
            <h3>📋 House Rules</h3>
            <ul style={{ marginTop: '1.5rem', paddingLeft: '0', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {hostel.rules.map((rule, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.8rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="3" style={{ flexShrink: 0 }}><polyline points="20 6 9 17 4 12"></polyline></svg>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Listing;
