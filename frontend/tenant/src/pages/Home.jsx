import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import SearchOverlay from '../components/SearchOverlay';
import heroCouple from '../assets/hero_couple.png';
import extReal from '../assets/ext_real.png';
import chairsReal from '../assets/chairs_real.png';
import roomStanza from '../assets/room_stanza.png';
import bondEasy from '../assets/bond_easy.png';
import stayEasy from '../assets/stay_easy.png';
import studentCat from '../assets/student_cat.png';
import professionalCat from '../assets/professional_cat.png';

const Home = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');
  const [searchLocation, setSearchLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [roomType, setRoomType] = useState('');
  const [wishlist, setWishlist] = useState([]);

  const navItems = ['Home', 'Explore', 'About Us', 'Contact'];

  const stats = [
    { icon: '👥', value: '10,000+', label: 'Happy Tenants' },
    { icon: '🏢', value: '500+', label: 'Verified Properties' },
    { icon: '📍', value: '8+', label: 'Cities' },
    { icon: '⭐', value: '4.8/5', label: 'Average Rating' },
  ];

  const steps = [
    { num: 1, icon: '🔍', title: 'Search Location', desc: 'Choose your city and preferred location' },
    { num: 2, icon: '🏠', title: 'Compare Rooms', desc: 'Explore verified rooms and compare amenities & prices' },
    { num: 3, icon: '📅', title: 'Book Instantly', desc: 'Select your room and move in hassle-free' },
  ];

  const rooms = [
    { id: 1, badge: 'Premium', badgeColor: '#4F46E5', img: extReal, name: 'Livora Premium Stay', loc: 'Koramangala, Bangalore', price: '₹12,999', amenities: ['WiFi', 'Meals', 'AC', 'Laundry'] },
    { id: 2, badge: 'Popular', badgeColor: '#10B981', img: chairsReal, name: 'Livora Comfort Home', loc: 'Whitefield, Bangalore', price: '₹10,999', amenities: ['WiFi', 'Meals', 'AC', 'Housekeeping'] },
    { id: 3, badge: 'New', badgeColor: '#F59E0B', img: roomStanza, name: 'Livora Elite Stay', loc: 'HSR Layout, Bangalore', price: '₹13,999', amenities: ['WiFi', 'Meals', 'AC', 'Spa'] },
  ];

  const features = [
    { icon: '🛋️', title: 'Fully Furnished', desc: 'Move-in with just your suitcase' },
    { icon: '🍽️', title: 'Daily Meals', desc: 'Nutritious & hygienic meals everyday' },
    { icon: '📶', title: 'High-Speed WiFi', desc: 'Work, study & stream without limits' },
    { icon: '🎉', title: 'Community Events', desc: 'Make friends & create memories' },
    { icon: '🛟', title: '24/7 Support', desc: "We're always here for you" },
    { icon: '💰', title: 'No Hidden Charges', desc: 'Transparent pricing, no surprises' },
  ];

  const testimonials = [
    { name: 'Ananya R.', role: 'Resident, Koramangala', text: '"Livora is not just a place to stay — it\'s a place to belong. The community, amenities and support are truly amazing!"', rating: 5 },
    { name: 'Aarav M.', role: 'Software Engineer, Bengaluru', text: '"I\'ve lived across 3 Livora properties. The quality and community vibe is absolutely unmatched across cities."', rating: 5 },
    { name: 'Priya S.', role: 'Product Manager, Hyderabad', text: '"Raised a maintenance request at 11pm — fixed by morning. Never had this experience in any PG before Livora!"', rating: 5 },
  ];

  const [showAllCities, setShowAllCities] = useState(false);

  const cities = [
    { name: 'Bangalore', props: 120, img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=800' },
    { name: 'Hyderabad', props: 85, img: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Downtown_hyderabad_drone.png' },
    { name: 'Mumbai', props: 64, img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=800' },
    { name: 'Chennai', props: 42, img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800' },
    { name: 'Delhi', props: 95, img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800' },
    { name: 'Pune', props: 58, img: 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=800' },
    { name: 'Noida', props: 37, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7_3JvufedjEFqBXXm7mUfumsQTlz-dhPh2Q&s' },
    { name: 'Gurgaon', props: 72, img: 'https://riseinfraventures.com/assets/gurgaon-new.webp' },
  ];

  const displayedCities = showAllCities ? cities : cities.slice(0, 4);

  const toggleWishlist = (id) => setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation) params.append('location', searchLocation);
    if (budget) params.append('budget', budget);
    if (roomType) params.append('type', roomType);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="hv2-root">

      {/* ── HEADER ── */}
      <header className="hv2-header">
        <div className="hv2-logo" onClick={() => navigate('/')}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 9V20C3 20.55 3.21 21.04 3.59 21.41 3.96 21.79 4.47 22 5 22H19C19.53 22 20.04 21.79 20.41 21.41 20.79 21.04 21 20.55 21 20V9L12 2Z" fill="#4F46E5" />
            <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="hv2-logo-text">Livora</span>
        </div>
        <nav className="hv2-nav">
          {navItems.map(item => (
            <span key={item} className={`hv2-nav-item ${activeNav === item ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item);
                if (item === 'Explore') navigate('/explore');
                if (item === 'About Us') navigate('/about');
                if (item === 'Contact') navigate('/contact');
                if (item === 'Home') navigate('/');
              }}>
              {item}
            </span>
          ))}
        </nav>
        <div className="hv2-header-actions">
          <button className="hv2-login-btn" onClick={() => navigate('/login')}>Log In</button>
          <button className="hv2-signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="hv2-hero">
        <div className="hv2-hero-left">
          <div className="hv2-hero-tag">🏆 India’s #1 Hostel & PG Network</div>
          <h1 className="hv2-hero-h1">
            Find Your Perfect Stay<br />
            <span className="hv2-hero-accent">That Fits Your Lifestyle<span className="hv2-dot">.</span></span>
          </h1>
          <p className="hv2-hero-desc">Premium spaces for students & professionals. Quality living, zero hassle.</p>

          {/* Search Bar */}
          <div className="hv2-search-bar">
            <div className="hv2-search-field">
              <span className="hv2-field-icon">📍</span>
              <input placeholder="Location" value={searchLocation} onChange={e => setSearchLocation(e.target.value)} />
            </div>
            <div className="hv2-search-sep" />
            <div className="hv2-search-field">
              <span className="hv2-field-icon">💰</span>
              <select value={budget} onChange={e => setBudget(e.target.value)}>
                <option value="">Budget</option>
                <option>Under ₹8k</option><option>₹8k–₹12k</option>
                <option>₹12k–₹18k</option><option>Above ₹18k</option>
              </select>
            </div>
            <div className="hv2-search-sep" />
            <div className="hv2-search-field">
              <span className="hv2-field-icon">🏠</span>
              <select value={roomType} onChange={e => setRoomType(e.target.value)}>
                <option value="">Stay Type</option>
                <option>Private</option><option>2 Sharing</option>
                <option>3 Sharing</option><option>Studio</option>
              </select>
            </div>
            <button className="hv2-search-btn" onClick={handleSearch}>
              🔍 Search
            </button>
          </div>

          {/* Hero CTAs */}
          <div className="hv2-hero-btns">
            <button className="hv2-btn-primary" onClick={() => navigate('/explore')}>Explore Rooms</button>
            <button className="hv2-btn-secondary" onClick={() => navigate('/login')}>Book a Visit</button>
          </div>

          {/* Trust badges */}
          <div className="hv2-trust-row">
            {['✔ Verified', '✔ Zero Brokerage', '✔ Flexible Rent', '✔ 24/7 Support'].map(b => (
              <span key={b} className="hv2-trust-badge">{b}</span>
            ))}
          </div>
        </div>

        <div className="hv2-hero-right">
          <div className="hv2-hero-img-wrap">
            <img src={heroCouple} alt="Livora residents" className="hv2-hero-img" />
            <div className="hv2-float-badge">
              <div className="hv2-float-info">
                <div className="hv2-float-num">⭐ 4.9/5</div>
                <div className="hv2-float-label">Top Rated in India</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY SELECTION ── */}
      <section className="hv2-categories">
        <div className="hv2-section-head">
          <span className="hv2-tag">Explore by Type</span>
          <h2 className="hv2-section-title">Choose Your Category</h2>
          <p className="hv2-section-sub">Tailored living experiences for every need</p>
        </div>
        <div className="hv2-cat-grid">
          {[
            { name: "Men's Hostel", count: '200+ Properties', icon: '♂️', img: extReal },
            { name: "Women's Hostel", count: '150+ Properties', icon: '♀️', img: stayEasy },
            { name: "Student Living", count: '100+ Properties', icon: '🎓', img: studentCat },
            { name: "Professional Stay", count: '120+ Properties', icon: '💼', img: professionalCat },
            { name: "Co-Living", count: '80+ Properties', icon: '🏡', img: chairsReal },
          ].map((cat, i) => (
            <div key={i} className="hv2-cat-card" onClick={() => navigate('/explore')}>
              <div className="hv2-cat-img-box">
                <img src={cat.img} alt={cat.name} className="hv2-cat-img" />
                <div className="hv2-cat-overlay">
                  <div className="hv2-cat-icon">{cat.icon}</div>
                  <h3 className="hv2-cat-name">{cat.name}</h3>
                  <p className="hv2-cat-count">{cat.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="hv2-stats-wrap">
        <div className="hv2-stats-bar">
          {stats.map((s, i) => (
            <React.Fragment key={i}>
              <div className="hv2-stat">
                <div className="hv2-stat-icon-wrap">{s.icon}</div>
                <div>
                  <div className="hv2-stat-val">{s.value}</div>
                  <div className="hv2-stat-lbl">{s.label}</div>
                </div>
              </div>
              {i < stats.length - 1 && <div className="hv2-stat-sep" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="hv2-how">
        <div className="hv2-section-head">
          <span className="hv2-tag">Simple Process</span>
          <h2 className="hv2-section-title">How It Works</h2>
          <p className="hv2-section-sub">Find your perfect home in 3 simple steps</p>
        </div>
        <div className="hv2-steps">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className="hv2-step-card">
                <div className="hv2-step-num">{s.num}</div>
                <div className="hv2-step-icon">{s.icon}</div>
                <h4 className="hv2-step-title">{s.title}</h4>
                <p className="hv2-step-desc">{s.desc}</p>
              </div>
              {i < steps.length - 1 && <div className="hv2-step-connector"><div className="hv2-connector-line" /></div>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── FEATURED ROOMS ── */}
      <section className="hv2-section hv2-rooms-section">
        <div className="hv2-section-topbar">
          <div>
            <h2 className="hv2-section-title" style={{ textAlign: 'left', marginBottom: '6px' }}>Featured Rooms</h2>
            <div className="hv2-accent-line" />
            <p className="hv2-section-sub" style={{ textAlign: 'left', margin: 0 }}>Handpicked spaces you'll love</p>
          </div>
          <button className="hv2-outline-btn" onClick={() => navigate('/explore')}>View all rooms →</button>
        </div>
        <div className="hv2-rooms-grid">
          {rooms.map(room => (
            <div key={room.id} className="hv2-room-card">
              <div className="hv2-room-img-box">
                <img src={room.img} alt={room.name} className="hv2-room-img" />
                <span className="hv2-room-badge" style={{ background: room.badgeColor }}>{room.badge}</span>
                <span className="hv2-trending-badge">🔥 Trending</span>
                <button className={`hv2-heart ${wishlist.includes(room.id) ? 'liked' : ''}`} onClick={() => toggleWishlist(room.id)}>
                  {wishlist.includes(room.id) ? '❤️' : '🤍'}
                </button>
              </div>
              <div className="hv2-room-body">
                <h4 className="hv2-room-name">{room.name}</h4>
                <p className="hv2-room-loc">📍 {room.loc}</p>
                <div className="hv2-amenity-row">
                  {room.amenities.map(a => <span key={a} className="hv2-amenity">{a}</span>)}
                </div>
                <div className="hv2-room-footer">
                  <div className="hv2-price-wrap"><span className="hv2-price">{room.price}</span><span className="hv2-per">/mo</span></div>
                  <button className="hv2-details-btn-wide" onClick={() => navigate(`/listing/${room.id}`)}>View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY CHOOSE LIVORA ── */}
      <section className="hv2-why">
        <div className="hv2-why-inner">
          <div className="hv2-why-left">
            <span className="hv2-tag hv2-tag-light">Our Benefits</span>
            <h2 className="hv2-why-title">Why Choose Livora?</h2>
            <p className="hv2-why-sub">More than just a room — it's a complete lifestyle experience.</p>
            <div className="hv2-features-grid">
              {features.map((f, i) => (
                <div key={i} className="hv2-feat-item">
                  <div className="hv2-feat-icon">{f.icon}</div>
                  <div>
                    <div className="hv2-feat-title">{f.title}</div>
                    <div className="hv2-feat-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hv2-why-right">
            <img src={bondEasy} alt="Community" className="hv2-why-img" />
          </div>
        </div>
      </section>

      {/* ── LIFESTYLE SECTION ── */}
      <section className="hv2-lifestyle">
        <div className="hv2-section-head">
          <span className="hv2-tag">Our Philosophy</span>
          <h2 className="hv2-section-title">Not Just a Room.<br /><span style={{ color: '#4F46E5' }}>A Lifestyle.</span></h2>
          <p className="hv2-section-sub">Work. Relax. Connect.</p>
        </div>
        <div className="hv2-lifestyle-grid">
          <img src={stayEasy} alt="" className="hv2-ls-img hv2-ls-tall" />
          <img src={extReal} alt="" className="hv2-ls-img" />
          <img src={studentCat} alt="" className="hv2-ls-img" />
          <img src={professionalCat} alt="" className="hv2-ls-img hv2-ls-wide" />
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="hv2-section hv2-testi-section">
        <div className="hv2-section-head">
          <span className="hv2-tag">Resident Stories</span>
          <h2 className="hv2-section-title">What Our Residents Say</h2>
          <p className="hv2-section-sub">Loved by thousands who call it home</p>
        </div>
        <div className="hv2-testi-grid">
          {testimonials.map((t, i) => (
            <div key={i} className={`hv2-testi-card ${i === 1 ? 'hv2-testi-featured' : ''}`}>
              <div className="hv2-testi-stars">{'★'.repeat(t.rating)}</div>
              <p className="hv2-testi-text">{t.text}</p>
              <div className="hv2-testi-author">
                <div className="hv2-testi-avatar">{t.name[0]}</div>
                <div>
                  <div className="hv2-testi-name">{t.name}</div>
                  <div className="hv2-testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOP LOCATIONS ── */}
      <section className="hv2-section hv2-cities-section">
        <div className="hv2-section-topbar">
          <div>
            <h2 className="hv2-section-title" style={{ textAlign: 'left', marginBottom: '6px' }}>Our Top Locations</h2>
            <div className="hv2-accent-line" />
            <p className="hv2-section-sub" style={{ textAlign: 'left', margin: 0 }}>Explore spaces in the most happening cities</p>
          </div>
          <button className="hv2-outline-btn" onClick={() => setShowAllCities(!showAllCities)}>
            {showAllCities ? 'Show less cities ↑' : 'View all cities →'}
          </button>
        </div>
        <div className="hv2-cities-grid">
          {displayedCities.map((c, i) => (
            <div key={i} className="hv2-city-card" onClick={() => navigate(`/search?location=${c.name}`)}>
              <img src={c.img} alt={c.name} className="hv2-city-img" />
              <div className="hv2-city-overlay">
                <div className="hv2-city-name">{c.name}</div>
                <div className="hv2-city-props">{c.props} Properties</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="hv2-footer">
        <div className="hv2-footer-main">
          <div className="hv2-footer-brand-side">
            <div className="hv2-footer-logo" onClick={() => navigate('/')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 9V20C3 20.55 3.21 21.04 3.59 21.41 3.96 21.79 4.47 22 5 22H19C19.53 22 20.04 21.79 20.41 21.41 20.79 21.04 21 20.55 21 20V9L12 2Z" fill="#818CF8" /><path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
              <span>Livora</span>
            </div>
            <p className="hv2-footer-tagline">
              Making living simple, safe, and hassle-free. We provide premium co-living spaces designed for comfort, community, and convenience. Experience a new standard of living with top-notch amenities, 24/7 security, and a vibrant community of professionals and students.
            </p>
          </div>

          <div className="hv2-footer-links-side">
            <div className="hv2-footer-column">
              <h4>Explore</h4>
              <span onClick={() => navigate('/about')}>About Us</span>
              <span onClick={() => navigate('/contact')}>Contact Us</span>
            </div>
            <div className="hv2-footer-column">
              <h4>Legal</h4>
              <span onClick={() => navigate('/terms')}>Terms of Service</span>
              <span onClick={() => navigate('/privacy')}>Privacy Policy</span>
            </div>
            <div className="hv2-footer-column">
              <h4>Contact Info</h4>
              <div className="hv2-contact-item" style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem', marginBottom: '0.8rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: '#818CF8' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <p style={{ margin: 0, lineHeight: 1.5 }}>Cyber Towers, Hitech City, Hyderabad</p>
              </div>
              <div className="hv2-contact-item" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem', marginBottom: '0.8rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: '#818CF8' }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <p style={{ margin: 0 }}>+91 7569383323</p>
              </div>
              <div className="hv2-contact-item" style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem', marginBottom: '0.8rem' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: '#818CF8' }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <p style={{ margin: 0 }}>support@livora.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hv2-footer-bottom-line">
          <p>© 2026 Livora. All rights reserved.</p>
        </div>
      </footer>

      {/* ── WHATSAPP FLOATING BUTTON ── */}
      <a href="https://wa.me/919876543213" target="_blank" rel="noreferrer" className="hv2-whatsapp-fab" title="Chat with us on WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>

    </div>
  );
};

export default Home;
