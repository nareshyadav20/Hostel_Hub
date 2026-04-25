import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import './Landing.css';

// Import images
import studentImg from '../assets/student_cat.png';
import professionalImg from '../assets/professional_cat.png';
import heroBg from '../assets/hero_bg.png';

const Landing = () => {
  const navigate = useNavigate();
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  // We remove the hardcoded dark theme set so user can toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const hostels = [
    {
      id: 1,
      name: 'StayNest Elite - Koramangala',
      locality: 'Koramangala 4th Block, Bengaluru',
      rating: 4.8,
      price: 12500,
      oldPrice: 15000,
      img: heroBg,
      amenities: ['Free WiFi', 'A/C', 'Mess', 'Gym']
    },
    {
      id: 2,
      name: 'Modern Stay for Students',
      locality: 'Indiranagar, Bengaluru',
      rating: 4.5,
      price: 8500,
      oldPrice: 10000,
      img: studentImg,
      amenities: ['Laundry', 'Study Room', '24/7 Security']
    },
    {
      id: 3,
      name: 'Professional Co-Living',
      locality: 'HSR Layout Sector 2, Bengaluru',
      rating: 4.6,
      price: 14000,
      oldPrice: 16500,
      img: professionalImg,
      amenities: ['Workstations', 'High-speed WiFi', 'Cafe']
    },
    {
      id: 4,
      name: 'The Hive - Whitefield',
      locality: 'Whitefield Main Road, Bengaluru',
      rating: 4.7,
      price: 11000,
      oldPrice: 13500,
      img: heroBg,
      amenities: ['Gaming Zone', 'Power Backup', 'Housekeeping']
    },
    {
      id: 5,
      name: 'Zenith Living Hyderabad',
      locality: 'Gachibowli, Hyderabad',
      rating: 4.9,
      price: 15500,
      oldPrice: 18000,
      img: studentImg,
      amenities: ['Premium Mess', 'Swimming Pool', 'Yoga Deck']
    },
    {
      id: 6,
      name: 'Urban Den Mumbai',
      locality: 'Andheri West, Mumbai',
      rating: 4.4,
      price: 18000,
      oldPrice: 22000,
      img: professionalImg,
      amenities: ['Co-working Space', 'Gym', 'Terrace Garden']
    }
  ];

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-0.5px' }}>StayNest</h1>
        </div>
        <nav className="nav-links">
          <ThemeToggle />
          <Link to="/login" style={{ fontWeight: '700' }}>Sign In</Link>
          <Link to="/signup" className="btn-signup" style={{ padding: '0.8rem 1.8rem', borderRadius: '12px' }}>Sign Up</Link>
        </nav>
      </header>

      <section className="search-hero">
        <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '2rem' }}>Book the best hostels in India</h2>
        <div className="goibibo-search-container glass-card" style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="search-field">
            <label>Location</label>
            <select style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '700', outline: 'none', width: '100%' }}>
              <option value="bengaluru">Bengaluru</option>
              <option value="hyderabad">Hyderabad</option>
              <option value="mumbai">Mumbai</option>
              <option value="delhi">Delhi</option>
              <option value="pune">Pune</option>
            </select>
          </div>
          <div className="search-field">
            <label>Check-in</label>
            <input type="date" style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '1rem', fontWeight: 'bold' }} />
          </div>
          <div className="search-field">
            <label>Check-out</label>
            <input type="date" style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '1rem', fontWeight: 'bold' }} />
          </div>
          <div className="search-field" style={{ position: 'relative' }}>
            <label>Guests</label>
            <div 
              style={{ padding: '0.2rem 0', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
            >
              {guests} Guest{guests > 1 ? 's' : ''}, {rooms} Room{rooms > 1 ? 's' : ''}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showGuestDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {showGuestDropdown && (
              <div className="glass-card" style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '280px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', zIndex: 50, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: '800', fontSize: '1.1rem' }}>Guests</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ages 16 or above</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--accent-primary)', background: 'transparent', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onClick={() => setGuests(Math.max(1, guests - 1))}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <span style={{ fontWeight: '900', width: '24px', textAlign: 'center', fontSize: '1.2rem' }}>{guests}</span>
                    <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'var(--accent-primary)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(56, 189, 248, 0.4)' }} onClick={() => setGuests(guests + 1)}>
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                  </div>
                </div>
                <div style={{ height: '1px', background: 'var(--border-color)', margin: '1rem 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: '800', fontSize: '1.1rem' }}>Rooms</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Required rooms</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--accent-warning)', background: 'transparent', color: 'var(--accent-warning)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onClick={() => setRooms(Math.max(1, rooms - 1))}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <span style={{ fontWeight: '900', width: '24px', textAlign: 'center', fontSize: '1.2rem' }}>{rooms}</span>
                    <button style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'var(--accent-warning)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(245, 158, 11, 0.4)' }} onClick={() => setRooms(rooms + 1)}>
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="search-btn-large" style={{ borderRadius: '12px' }} onClick={() => navigate('/search')}>SEARCH</button>
        </div>
      </section>

      <div className="landing-content">
        <aside className="filters-sidebar">
          <div className="filter-group">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '1.2rem', fontWeight: '800' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Price Range
            </h4>
            <div className="filter-option"><input type="checkbox" /> ₹0 - ₹5000</div>
            <div className="filter-option"><input type="checkbox" /> ₹5000 - ₹10000</div>
            <div className="filter-option"><input type="checkbox" defaultChecked /> ₹10000 - ₹15000</div>
            <div className="filter-option"><input type="checkbox" /> ₹15000+</div>
          </div>

          <div className="filter-group">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '1.2rem', fontWeight: '800' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Hostel Type
            </h4>
            <div className="filter-option"><input type="checkbox" defaultChecked /> For Students</div>
            <div className="filter-option"><input type="checkbox" /> For Professionals</div>
            <div className="filter-option"><input type="checkbox" /> Boys Only</div>
            <div className="filter-option"><input type="checkbox" /> Girls Only</div>
          </div>

          <div className="filter-group" style={{ marginBottom: 0 }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '1.2rem', fontWeight: '800' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Customer Rating
            </h4>
            <div className="filter-option"><input type="checkbox" /> 4.5+ (Excellent)</div>
            <div className="filter-option"><input type="checkbox" /> 4.0+ (Very Good)</div>
            <div className="filter-option"><input type="checkbox" /> 3.5+ (Good)</div>
          </div>
        </aside>

        <main className="hostels-list">
          {hostels.map(hostel => (
            <div key={hostel.id} className="hostel-card-horizontal glass-card fade-in" style={{ transition: 'transform 0.3s ease' }}>
              <Link to={`/listing/${hostel.id}`} style={{ display: 'flex', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                <div className="card-img-container">
                  <img src={hostel.img} alt={hostel.name} />
                  <div className="rating-badge">{hostel.rating} ★</div>
                </div>
                <div className="card-details">
                  <div className="card-title-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginBottom: '1.2rem' }}>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>{hostel.name}</h3>
                    <div className="locality-text" style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '500' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-warning)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {hostel.locality}
                    </div>
                  </div>
                  
                  <div className="amenities-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.5rem' }}>
                    {hostel.amenities.map((a, i) => (
                      <div key={i} className="amenity-item" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--accent-primary)', background: 'rgba(56, 189, 248, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        {a}
                      </div>
                    ))}
                  </div>

                  <div className="price-booking-row" style={{ marginTop: '2rem' }}>
                    <div className="price-info">
                      <span className="old-price">₹{hostel.oldPrice}</span>
                      <span className="current-price" style={{ fontSize: '1.8rem', fontWeight: '900' }}>₹{hostel.price}</span>
                      <span className="price-subtext" style={{ color: 'var(--text-muted)' }}>+ ₹350 taxes & fees / month</span>
                    </div>
                    <button className="btn-view-room" style={{ padding: '1rem 2rem', borderRadius: '12px', fontWeight: '800' }}>View Rooms</button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </main>
      </div>

      <footer className="landing-footer-minimal">
        <p>© 2026 StayNest Private Limited. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
