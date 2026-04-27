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

  // Theme is handled by ThemeToggle component

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
          <Link to="/login" className="btn-signin">Sign In</Link>
          <Link to="/signup" className="btn-signup" style={{ padding: '0.8rem 1.8rem', borderRadius: '12px' }}>Sign Up</Link>
        </nav>
      </header>

      <section className="search-hero">
        <div className="fade-in">
          <h2 style={{ fontSize: '4.5rem', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Find Your Perfect Home</h2>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem' }}>Discover premium hostels and co-living spaces designed for the modern lifestyle.</p>
        </div>
        
        <div className="goibibo-search-container fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="search-field">
            <label>Where to?</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <select style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '800', outline: 'none', width: '100%', cursor: 'pointer' }}>
                <option value="bengaluru" style={{ background: 'var(--bg-secondary)' }}>Bengaluru</option>
                <option value="hyderabad" style={{ background: 'var(--bg-secondary)' }}>Hyderabad</option>
                <option value="mumbai" style={{ background: 'var(--bg-secondary)' }}>Mumbai</option>
                <option value="delhi" style={{ background: 'var(--bg-secondary)' }}>Delhi</option>
              </select>
            </div>
          </div>
          <div className="search-field">
            <label>Move-in Date</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              <input type="date" style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer' }} />
            </div>
          </div>
          <div className="search-field">
            <label>Category</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2.5"><path d="M4 21v-7a4 4 0 1 1 8 0v7"/><path d="M9 15v2"/><path d="M12 21v-7a4 4 0 1 1 8 0v7"/><path d="M17 15v2"/><path d="M3 8h18"/><path d="m3 8 2.1-5.1a2 2 0 0 1 1.8-1.1h10.2a2 2 0 0 1 1.8 1.1L21 8"/></svg>
              <select style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer' }}>
                <option value="student" style={{ background: 'var(--bg-secondary)' }}>Student Friendly</option>
                <option value="professional" style={{ background: 'var(--bg-secondary)' }}>Professional Hubs</option>
                <option value="luxury" style={{ background: 'var(--bg-secondary)' }}>Luxury Suites</option>
              </select>
            </div>
          </div>
          <div className="search-field">
            <label>Budget</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
              <select style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer' }}>
                <option value="0-5000" style={{ background: 'var(--bg-secondary)' }}>₹0 - ₹5k</option>
                <option value="5000-10000" style={{ background: 'var(--bg-secondary)' }}>₹5k - ₹10k</option>
                <option value="10000-15000" style={{ background: 'var(--bg-secondary)' }}>₹10k - ₹15k</option>
                <option value="15000+" style={{ background: 'var(--bg-secondary)' }}>₹15k+</option>
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
          <button className="search-btn-large" onClick={() => navigate('/search')}>FIND NOW</button>
        </div>
      </section>

      <div className="landing-content">
        <aside className="filters-sidebar fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="filter-group">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#22c55e', marginBottom: '2rem', fontWeight: '900', fontSize: '1.2rem' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 1v22"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              Budget
            </h4>
            <div className="filter-option"><input type="checkbox" /> ₹0 - ₹5000</div>
            <div className="filter-option"><input type="checkbox" /> ₹5000 - ₹10000</div>
            <div className="filter-option"><input type="checkbox" defaultChecked /> ₹10000 - ₹15000</div>
            <div className="filter-option"><input type="checkbox" /> ₹15000+</div>
          </div>

          <div className="filter-group">
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#0ea5e9', marginBottom: '2rem', fontWeight: '900', fontSize: '1.2rem' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              Categories
            </h4>
            <div className="filter-option"><input type="checkbox" defaultChecked /> Student Friendly</div>
            <div className="filter-option"><input type="checkbox" /> Professional Hubs</div>
            <div className="filter-option"><input type="checkbox" /> Luxury Suites</div>
          </div>
        </aside>

        <main className="hostels-list">
          {hostels.map((hostel, index) => (
            <div key={hostel.id} className="hostel-card-horizontal fade-in-up" style={{ animationDelay: `${0.2 * index}s` }}>
              <Link to={`/listing/${hostel.id}`} style={{ display: 'flex', width: '100%', textDecoration: 'none', color: 'inherit' }}>
                <div className="card-img-container">
                  <img src={hostel.img} alt={hostel.name} />
                  <div className="rating-badge">{hostel.rating} ★</div>
                </div>
                <div className="card-details">
                  <div className="card-title-row" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{hostel.name}</h3>
                    <div style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '600' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      {hostel.locality}
                    </div>
                  </div>
                  
                  <div className="amenities-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                    {hostel.amenities.map((a, i) => (
                      <div key={i} className="amenity-item" style={{ fontSize: '0.9rem', fontWeight: '700', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        {a}
                      </div>
                    ))}
                  </div>

                  <div className="price-booking-row">
                    <div className="price-info">
                      <div style={{ color: 'var(--text-muted)', textDecoration: 'line-through', fontSize: '1.1rem' }}>₹{hostel.oldPrice}</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: '950', color: 'var(--text-primary)', letterSpacing: '-1px' }}>₹{hostel.price}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>All-inclusive monthly rent</div>
                    </div>
                    <button className="btn-view-room">Reserve Now</button>
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
