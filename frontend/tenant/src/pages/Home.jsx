import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import heroCouple from '../assets/hero_couple.png';
import stayEasy from '../assets/stay_easy.png';
import bondEasy from '../assets/bond_easy.png';
import studentCat from '../assets/student_cat.png';
import professionalCat from '../assets/professional_cat.png';

const Home = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

  const badgeOptions = [
    { text: "Choose a shared space or pick a private room", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 10V21M21 10V21M3 14H21M7 10V7A2 2 0 0 1 9 5H15A2 2 0 0 1 17 7V10M3 10L21 10"></path></svg> },
    { text: "Stay for a few nights or move in for a few months", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
    { text: "Make your own food or take a subscription", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg> }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBadgeIndex(prev => (prev + 1) % badgeOptions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const cities = [
    { name: 'Bangalore', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=300&q=80', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v2H6v4h12V7h-3V5a3 3 0 0 0-3-3z"/><path d="M4 11v10h16V11"/><path d="M8 11v10"/><path d="M16 11v10"/><path d="M12 11v10"/><path d="M2 21h20"/></svg> },
    { name: 'Chennai', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=300&q=80', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l-6 19h12L12 2z"/><path d="M8 8h8"/><path d="M7 13h10"/><path d="M6 18h12"/><path d="M2 21h20"/><path d="M11 21v-4h2v4"/></svg> },
    { name: 'Coimbatore', img: 'https://images.unsplash.com/photo-1621539203666-41ea87d3a824?auto=format&fit=crop&w=300&q=80', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21h20"/><path d="M3 21l6-10 4 6 5-8 4 12"/><circle cx="16" cy="7" r="3"/></svg> },
    { name: 'Pune', img: 'https://images.unsplash.com/photo-1605368940860-249ee416c117?auto=format&fit=crop&w=300&q=80', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 21V9l2-2h12l2 2v12"/><path d="M4 12h16"/><path d="M4 17h16"/><path d="M9 21v-6a3 3 0 0 1 6 0v6"/><path d="M2 21h20"/><path d="M4 7V4h2v3"/><path d="M18 7V4h2v3"/></svg> },
    { name: 'Hyderabad', active: true, img: 'https://images.unsplash.com/photo-1566509426917-8e682d334dd1?auto=format&fit=crop&w=300&q=80', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21h20"/><path d="M6 21V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v16"/><path d="M14 21V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v16"/><path d="M10 21v-6a2 2 0 0 1 4 0v6"/><path d="M6 10h12"/><path d="M6 14h12"/></svg> },
    { name: 'Noida', img: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=300&q=80', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21h20"/><path d="M4 21V7h4v14"/><path d="M8 21V3h8v18"/><path d="M16 21v-9h4v9"/><path d="M10 7h4"/><path d="M10 11h4"/><path d="M10 15h4"/><path d="M5 11h2"/><path d="M5 15h2"/></svg> },
    { name: 'Delhi', img: 'https://images.unsplash.com/photo-1587474260580-5a3d078bd431?auto=format&fit=crop&w=300&q=80', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21h20"/><path d="M6 21V7h12v14"/><path d="M8 21v-8a4 4 0 0 1 8 0v8"/><path d="M6 7L12 3l6 4"/></svg> },
    { name: 'Mumbai', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=300&q=80', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21h20"/><path d="M5 21V9h14v12"/><path d="M9 21v-6a3 3 0 0 1 6 0v6"/><path d="M5 9V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M8 5a2 2 0 0 1-4 0"/><path d="M20 5a2 2 0 0 1-4 0"/><path d="M15 5a3 3 0 0 0-6 0"/></svg> },
    { name: 'Gurugram', img: 'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=300&q=80', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21h20"/><path d="M4 21V5h5v16"/><path d="M15 21V3h5v18"/><path d="M9 21v-8h6v8"/><path d="M9 13l6-4"/><path d="M6 9h1"/><path d="M6 13h1"/><path d="M6 17h1"/><path d="M17 7h1"/><path d="M17 11h1"/><path d="M17 15h1"/></svg> }
  ];

  const localities = [
    { name: 'Koramangala', img: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=500&q=80' },
    { name: 'HSR Layout', img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&q=80' },
    { name: 'Indiranagar', img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=500&q=80' },
    { name: 'Whitefield', img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&q=80' },
    { name: 'Gachibowli', img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=500&q=80' },
    { name: 'HITEC City', img: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&q=80' }
  ];

  const handleCityClick = (cityName) => {
    navigate(`/explore?city=${cityName}`);
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/search?q=${searchValue}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="home-container">
      {/* Header aligned exactly to Image 1 */}
      <header className={`home-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="home-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg width="35" height="35" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 9V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V9L12 2Z" fill="url(#home_logo_gradient)" stroke="#00b0f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="home_logo_gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00b0f0" />
                <stop offset="1" stopColor="#0080c0" />
              </linearGradient>
            </defs>
          </svg>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '950', letterSpacing: '-1.5px', color: '#00b0f0', margin: 0 }}>livora</h1>
        </div>
        <nav className="header-nav">
          <span onClick={() => navigate('/explore')} className="nav-item" style={{cursor: 'pointer'}}>LIVORA SCHOLAR</span>
          <span onClick={() => navigate('/explore')} className="nav-item" style={{cursor: 'pointer'}}>LIST YOUR PROPERTY</span>
          <div className="contact-info">
            <span onClick={() => navigate('/explore')} className="contact-item" style={{cursor: 'pointer'}}>📞 +91 7569383323</span>
            <span onClick={() => navigate('/explore')} className="contact-item" style={{cursor: 'pointer'}}>✉️ info@livora.com</span>
          </div>
          <button className="btn-signin-home" onClick={() => navigate('/login')}>SIGN IN</button>
        </nav>
      </header>

      <main className="home-main">
        {/* Hero Section exactly like Image 1 */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Your Stay. <span className="highlight">Your Way.</span>
            </h1>

            <div className="hero-badge" style={{ transition: 'all 0.5s ease-in-out' }}>
              <span className="badge-icon" style={{marginRight: '8px'}}>
                {badgeOptions[currentBadgeIndex].icon}
              </span>
              {badgeOptions[currentBadgeIndex].text}
            </div>

            <div className="home-search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Find a Livora near your place of Work/Study"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <div className="search-icon-btn" onClick={handleSearch}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00b0f0" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </div>
              <button className="btn-near-me" onClick={() => navigate('/search?near=true')}>
                <span className="near-me-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg></span> Near Me
              </button>
            </div>
          </div>

          <div className="hero-image-container">
            <img src={heroCouple} alt="" className="hero-main-img" />
          </div>
        </section>

        {/* City Selection exactly like Image 1 */}
        <section className="city-section">
          <div className="city-list-container">
            {cities.map((city) => (
              <div
                key={city.name}
                className={`city-item ${city.active ? 'active' : ''}`}
                onClick={() => handleCityClick(city.name)}
              >
                <div className="city-svg-view">
                  <div className="city-icon-box">
                    {city.icon}
                  </div>
                  <span className="city-name">{city.name}</span>
                </div>
                <div className="city-img-view" style={{ backgroundImage: `url(${city.img})` }}>
                  <div className="city-img-overlay"></div>
                  <span className="city-name-hover">{city.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Grid exactly like Image 3 */}
        <section className="features-section">
          <div className="section-header-centered">
            <h2>Perfect for working, <span className="highlight">More so for unwinding after.</span></h2>
          </div>
          <div className="features-grid-classic">
            <div className="feat-col">
              <div className="feat-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
              <span>24x7<br />Assistance</span>
            </div>
            <div className="feat-col">
              <div className="feat-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/></svg></div>
              <span>App Based Issue<br />Resolution</span>
            </div>
            <div className="feat-col">
              <div className="feat-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="6.5"/></svg></div>
              <span>Thoughtful<br />Facilities</span>
            </div>
            <div className="feat-col">
              <div className="feat-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg></div>
              <span>WhatsApp<br />Video Tour</span>
            </div>
            <div className="feat-col">
              <div className="feat-icon-wrapper"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
              <span>Zero Brokerage<br />One Month Deposit</span>
            </div>
          </div>
        </section>

        {/* Stay Easy Section exactly like Image 3 */}
        <section className="stay-easy-section">
          <div className="stay-easy-grid">
            <div className="stay-easy-card">
              <img src={professionalCat} alt="Professional Co-Living" />
              <div className="stay-overlay"><h3>Professionals</h3></div>
            </div>
            <div className="stay-easy-card">
              <img src={stayEasy} alt="Peaceful Living" />
              <div className="stay-overlay"><h3>Community</h3></div>
            </div>
            <div className="stay-easy-card">
              <img src={studentCat} alt="Student Accommodation" />
              <div className="stay-overlay"><h3>Students</h3></div>
            </div>
          </div>
        </section>

        {/* Bond Easy Section */}
        <section className="bond-easy-section">
          <div className="bond-easy-content">
            <h3 className="bond-title">Join & vibe <span className="highlight">with a vibrant colourful community.</span></h3>
            <div className="bond-features-grid">
              <div className="bond-feat-item">Choose Your<br />Coliving Mates</div>
              <div className="bond-feat-item">Social<br />Calendar</div>
              <div className="bond-feat-item">Events, Celebrations<br />& Pop Ups</div>
              <div className="bond-feat-item">Network &<br />Collaborate</div>
              <div className="bond-feat-item">Get Mentored</div>
            </div>
          </div>
          <div className="bond-easy-images-wrapper">
            <img src={bondEasy} alt="Community" className="bond-easy-img-1" />
            <img src={heroCouple} alt="Lifestyle" className="bond-easy-img-2" />
          </div>
        </section>

        {/* Stats Section exactly like Image 4 */}
        <section className="stats-section">
          <h2 className="stats-heading">We are India's Most Celebrated <span className="highlight">Coliving</span> Spaces</h2>
          <div className="stats-container">
            <div className="stat-card">
              <span className="stat-val">50k+</span>
              <span className="stat-desc">Delighted Customers</span>
            </div>
            <div className="stat-card">
              <span className="stat-val">450+</span>
              <span className="stat-desc">Livora Habitats</span>
            </div>
            <div className="stat-card">
              <span className="stat-val">10+</span>
              <span className="stat-desc">Cities & Counting</span>
            </div>
          </div>
        </section>

        {/* Localities exactly like Image 4 */}
        <section className="localities-section">
          <h2 className="localities-heading">Find your Livora, <span className="highlight">your way</span></h2>
          <div className="localities-scroll">
            {localities.map((loc, idx) => (
              <div key={idx} className="loc-card-classic" onClick={() => navigate('/explore')}>
                <img src={loc.img} alt="" />
                <div className="loc-overlay-gradient">
                  <span className="loc-name">{loc.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer exactly like Image 5 */}
      <footer className="classic-footer">
        <div className="footer-grid">
          <div className="footer-col-brand">
            <div className="footer-logo">livora</div>
            <p className="footer-address">
              <strong>Corporate Office</strong><br />
              Cyber Towers, HITEC City,<br />
              Hyderabad, Telangana<br />
              India - 500081
            </p>
          </div>
          <div className="footer-col-links">
            <h4>Product</h4>
            <ul>
              <li>FAQs</li>
              <li>Scholar FAQs</li>
              <li>How It Works</li>
              <li>List Your Property</li>
              <li>Livora Club</li>
              <li>Amenities</li>
              <li>Testimonials</li>
            </ul>
          </div>
          <div className="footer-col-links">
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact Us</li>
              <li>Blog</li>
              <li>Privacy Policy</li>
              <li>T&C</li>
              <li>Disclaimer</li>
              <li>Sitemap</li>
            </ul>
          </div>
          <div className="footer-col-contact">
            <h4>Contact Us</h4>
            <p>📞 +91 7569383323</p>
            <p>✉️ info@livorastays.com</p>
            <h4 className="stay-touch">Stay In Touch</h4>
            <div className="social-tray">
              <span className="social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></span>
              <span className="social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></span>
              <span className="social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></span>
              <span className="social-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></span>
            </div>
          </div>
          <div className="footer-col-qr">
            <h4>Scan the QR<br />to install the app!</h4>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://livora.com" alt="" className="qr-img" />
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Livora Stays. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
