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
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Bengaluru');

  const hostels = [
    { id: 1, city: 'Bengaluru', name: 'Livora Elite - Koramangala', locality: 'Koramangala 4th Block, Bengaluru', rating: 4.8, price: 12500, img: heroBg, amenities: ['Free WiFi', 'A/C', 'Mess', 'Gym'] },
    { id: 2, city: 'Bengaluru', name: 'Modern Stay for Students', locality: 'Indiranagar, Bengaluru', rating: 4.5, price: 8500, img: studentImg, amenities: ['Laundry', 'Study Room', '24/7 Security'] },
    { id: 3, city: 'Bengaluru', name: 'Professional Co-Living', locality: 'HSR Layout Sector 2, Bengaluru', rating: 4.6, price: 14000, img: professionalImg, amenities: ['Workstations', 'High-speed WiFi', 'Cafe'] },
    { id: 4, city: 'Bengaluru', name: 'The Hive - Whitefield', locality: 'Whitefield Main Road, Bengaluru', rating: 4.7, price: 11000, img: heroBg, amenities: ['Gaming Zone', 'Power Backup', 'Housekeeping'] },
    { id: 5, city: 'Hyderabad', name: 'Zenith Living Hyderabad', locality: 'Gachibowli, Hyderabad', rating: 4.9, price: 15500, img: studentImg, amenities: ['Premium Mess', 'Swimming Pool', 'Yoga Deck'] },
    { id: 6, city: 'Mumbai', name: 'Urban Den Mumbai', locality: 'Andheri West, Mumbai', rating: 4.4, price: 18000, img: professionalImg, amenities: ['Co-working Space', 'Gym', 'Terrace Garden'] },
    { id: 7, city: 'Hyderabad', name: 'Stellar Suites', locality: 'Banjara Hills, Hyderabad', rating: 4.7, price: 16000, img: heroBg, amenities: ['Jacuzzi', 'Mini Theater', 'Valet'] },
    { id: 8, city: 'Pune', name: 'The Nest - Pune', locality: 'Viman Nagar, Pune', rating: 4.3, price: 9000, img: studentImg, amenities: ['Library', 'Music Room', 'Mess'] },
    { id: 9, city: 'Bengaluru', name: 'Vibe Residency', locality: 'Koramangala, Bengaluru', rating: 4.6, price: 13000, img: professionalImg, amenities: ['EV Charging', 'Smart Locks', 'Cafe'] },
    { id: 10, city: 'Delhi', name: 'Aura Living', locality: 'Gurugram Sector 44', rating: 4.8, price: 19500, img: heroBg, amenities: ['Private Balcony', 'Chef', 'Gym'] },
    { id: 11, city: 'Bengaluru', name: 'Campus Core', locality: 'Manipal, Karnataka', rating: 4.5, price: 7500, img: studentImg, amenities: ['Shuttle', 'Study Hall', 'Mess'] },
    { id: 12, city: 'Mumbai', name: 'Metro Hub Mumbai', locality: 'Powai, Mumbai', rating: 4.5, price: 17000, img: professionalImg, amenities: ['Business Center', 'Rooftop Pool'] },
    { id: 13, city: 'Bengaluru', name: 'Serene Stays', locality: 'Whitefield, Bengaluru', rating: 4.7, price: 14500, img: heroBg, amenities: ['Garden', 'Yoga', 'High-speed WiFi'] },
    { id: 14, city: 'Delhi', name: 'Zest Living', locality: 'Chennai OMR', rating: 4.4, price: 10500, img: studentImg, amenities: ['Game Room', 'Mess', 'A/C'] },
    { id: 15, city: 'Delhi', name: 'Nexus Co-Living', locality: 'Noida Sector 62', rating: 4.6, price: 12000, img: professionalImg, amenities: ['Work Pods', 'Gym', 'Laundry'] },
    { id: 16, city: 'Bengaluru', name: 'Elite Abodes', locality: 'Salt Lake, Kolkata', rating: 4.8, price: 15000, img: heroBg, amenities: ['Theater', 'Mess', 'Gym'] }
  ];

  const filteredHostels = hostels.filter(h => h.city === selectedCity);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 9V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V9L12 2Z" fill="url(#logo_gradient)" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="logo_gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--accent-primary)"/>
                <stop offset="1" stopColor="var(--accent-secondary)"/>
              </linearGradient>
            </defs>
          </svg>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '950', letterSpacing: '-1px', background: 'linear-gradient(to right, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Livora</h1>
        </div>
        <nav className="nav-links">
          <ThemeToggle />
          <Link to="/login" className="btn-signin">Sign In</Link>
          <Link to="/signup" className="btn-signup" style={{ padding: '0.8rem 1.8rem', borderRadius: '12px' }}>Sign Up</Link>
        </nav>
      </header>

      <section className="search-hero">
        <div className="fade-in">
          <h2 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Find Your Perfect Home</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem' }}>Discover premium hostels and co-living spaces designed for the modern lifestyle.</p>
        </div>
        
        <div className="goibibo-search-container fade-in" style={{ animationDelay: '0.2s', maxWidth: '800px' }}>
          <div className="search-field">
            <label>Where to?</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '800', outline: 'none', width: '100%', cursor: 'pointer' }}
              >
                <option value="Bengaluru">Bengaluru</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Pune">Pune</option>
              </select>
            </div>
          </div>
          <div className="search-field" style={{ position: 'relative', borderRight: 'none' }}>
            <label>Occupancy</label>
            <div 
              style={{ padding: '0.2rem 0', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              onClick={() => setShowGuestDropdown(!showGuestDropdown)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                {guests} Resident{guests > 1 ? 's' : ''}
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showGuestDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
            {showGuestDropdown && (
              <div className="glass-card guest-dropdown-content" style={{ position: 'absolute', top: 'calc(100% + 20px)', right: 0, width: '320px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '2rem', zIndex: 50, boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-primary)' }}>Residents</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total members</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setGuests(Math.max(1, guests - 1))}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <span style={{ fontWeight: '900', width: '24px', textAlign: 'center', fontSize: '1.3rem', color: 'var(--text-primary)' }}>{guests}</span>
                    <button style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#22c55e', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(34, 197, 94, 0.3)' }} onClick={() => setGuests(guests + 1)}>
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button className="search-btn-large" onClick={() => navigate('/search')} style={{ padding: '0 2rem' }}>FIND NOW</button>
        </div>
      </section>

      <div className="landing-content" style={{ display: 'block' }}>
        <main className="hostels-grid">
          {filteredHostels.map((hostel, index) => (
            <div key={hostel.id} className="hostel-card-vertical fade-in-up" style={{ animationDelay: `${0.1 * index}s` }}>
              <Link to={`/listing/${hostel.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="card-img-container-v">
                  <img src={hostel.img} alt={hostel.name} />
                  <div className="rating-badge-v">{hostel.rating} ★</div>
                </div>
                <div className="card-details-v">
                  <p className="locality-v">{hostel.locality}</p>
                  <h3>{hostel.name}</h3>
                  <div className="amenities-row-v">
                    {hostel.amenities.slice(0, 2).map((a, i) => (
                      <span key={i}>{a}</span>
                    ))}
                  </div>
                  <div className="price-booking-row-v">
                    <div className="price-info-v">
                      <span className="price-val-v">₹{hostel.price}</span>
                      <span className="price-unit-v">/mo</span>
                    </div>
                    <button className="btn-view-v">Details</button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </main>
      </div>

      <footer className="landing-footer-minimal">
        <p>© 2026 Livora Private Limited. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
