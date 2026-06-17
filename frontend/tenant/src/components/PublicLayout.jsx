import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ChevronRight, Bed, BookOpen, Shirt, Droplet, Car, Video, Wrench, ShieldCheck, MessageSquare, HeartPulse, Wifi, Utensils, Sparkles, Settings } from 'lucide-react';
import '../pages/Home.css';

const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeNav, setActiveNav] = useState('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);
  const [showAllCities, setShowAllCities] = useState(false);

  const [searchParams] = useSearchParams();
  const selectedLoc = searchParams.get('location');
  const displayLoc = selectedLoc && selectedLoc !== 'all' ? selectedLoc.charAt(0).toUpperCase() + selectedLoc.slice(1) : 'Locations';

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Explore', id: 'explore' },
    { label: 'Services', id: 'services' },
    { label: 'About Us', id: 'about' },
    { label: 'Contact', id: 'contact' }
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleNavClick = (item) => {
    setActiveNav(item.label);
    setIsMenuOpen(false);
    if (item.id === 'services') {
      navigate('/our-services');
    } else if (item.id === 'explore') {
      navigate('/explore');
    } else if (['about', 'contact'].includes(item.id)) {
      navigate(`/${item.id}`);
    } else {
      if (location.pathname === '/') {
        scrollToSection(item.id);
      } else {
        navigate(`/#${item.id}`);
      }
    }
  };

  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        scrollToSection(id);
      }, 300);
    }
  }, [location]);

  useEffect(() => {
    if (location.pathname === '/explore') {
      setActiveNav('Explore');
    } else if (location.pathname === '/about') {
      setActiveNav('About Us');
    } else if (location.pathname === '/contact') {
      setActiveNav('Contact');
    } else if (location.pathname === '/our-services') {
      setActiveNav('Services');
    } else if (location.pathname === '/') {
      setActiveNav('Home');
    }

    if (location.pathname !== '/') {
      window.scrollTo(0, 0);
      return;
    }
    const observerOptions = { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 };
    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const matchedItem = navItems.find(item => item.id === entry.target.id);
          if (matchedItem) setActiveNav(matchedItem.label);
        }
      });
    };
    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    ['hero', 'how', 'reviews', 'cities'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname]);

  const cities = [
    { name: 'Bengaluru', img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=800' },
    { name: 'Hyderabad', img: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Downtown_hyderabad_drone.png' },
    { name: 'Mumbai', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=800' },
    { name: 'Chennai', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=800' },
    { name: 'Delhi', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=800' },
    { name: 'Pune', img: 'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&q=80&w=800' },
    { name: 'Noida', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7_3JvufedjEFqBXXm7mUfumsQTlz-dhPh2Q&s' },
    { name: 'Gurgaon', img: 'https://riseinfraventures.com/assets/gurgaon-new.webp' },
  ];

  const iconColor = "#4F46E5";
  const amenitiesData = [
    { category: 'In-Room Features', items: [{ icon: <Bed color={iconColor} size={20} />, name: 'Beds' }, { icon: <BookOpen color={iconColor} size={20} />, name: 'Study tables' }] },
    { category: 'Shared Facilities', items: [{ icon: <Wifi color={iconColor} size={20} />, name: 'Wi-Fi' }, { icon: <Shirt color={iconColor} size={20} />, name: 'Laundry room' }, { icon: <Droplet color={iconColor} size={20} />, name: 'Water cooler' }, { icon: <Car color={iconColor} size={20} />, name: 'Parking' }] },
    { category: 'Security & Safety', items: [{ icon: <Video color={iconColor} size={20} />, name: 'CCTV' }] }
  ];
  const servicesData = [
    {
      category: 'Daily Care & Conveniences', items: [
        {
          icon: (
            // Broom / sweeping icon
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="20" y1="4" x2="9" y2="15" />
              <path d="M7 17 L3 21 L7 23 L13 17 L11 15 Z" />
            </svg>
          ), name: 'Room cleaning'
        },
        {
          icon: (
            // Food bowl with steam icon
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h18" />
              <path d="M3 12Q3 20 12 20Q21 20 21 12" />
              <path d="M8 8Q7.5 6 8 4" />
              <path d="M12 8Q11.5 6 12 4" />
              <path d="M16 8Q15.5 6 16 4" />
            </svg>
          ), name: 'Food/mess service'
        },
        {
          icon: (
            // Washing machine icon
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2" />
              <line x1="2" y1="7" x2="22" y2="7" />
              <circle cx="12" cy="14" r="4" />
              <circle cx="5.5" cy="4.5" r="0.6" fill={iconColor} stroke="none" />
              <circle cx="8.5" cy="4.5" r="0.6" fill={iconColor} stroke="none" />
              <path d="M10 13Q12 11 14 13" />
            </svg>
          ), name: 'Laundry pickup service'
        }
      ]
    },
    {
      category: 'Support Operations', items: [
        { icon: <Settings color={iconColor} size={20} />, name: 'Maintenance support' },
        {
          icon: (
            // Security guard shield with person
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L4 5V11C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 11V5L12 2Z" />
              <circle cx="12" cy="9" r="2" />
              <path d="M8 16C8 13.8 9.8 13 12 13S16 13.8 16 16" />
            </svg>
          ), name: 'Security assistance'
        },
        { icon: <MessageSquare color={iconColor} size={20} />, name: 'Complaint resolution' },
        { icon: <HeartPulse color={iconColor} size={20} />, name: 'Medical assistance' }
      ]
    }
  ];

  return (
    <div className="hv2-root">
      <header className="hv2-header">
        <div className="hv2-logo" onClick={() => navigate('/')}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 9V20C3 20.55 3.21 21.04 3.59 21.41 3.96 21.79 4.47 22 5 22H19C19.53 22 20.04 21.79 20.41 21.41 20.79 21.04 21 20.55 21 20V9L12 2Z" fill="#4F46E5" />
            <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="hv2-logo-text">Livora</span>
        </div>

        <nav className={`hv2-nav ${isMenuOpen ? 'mobile-open' : ''}`}>
          {isMenuOpen && (
            <div className="hv2-mobile-header">
              <span className="hv2-logo-text">Livora</span>
              <button className="hv2-menu-close" onClick={() => setIsMenuOpen(false)}>✕</button>
            </div>
          )}
          {navItems.map(item => (
            <span key={item.label} className={`hv2-nav-item ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => handleNavClick(item)}>
              {item.label}
            </span>
          ))}
          {isMenuOpen && (
            <div className="hv2-mobile-actions">
              <button className="hv2-login-btn" onClick={() => navigate('/login')}>Log In</button>
              <button className="hv2-signup-btn" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
          )}
        </nav>

        <div className="hv2-header-actions">
          <button className="hv2-locations-btn" onClick={() => setIsLocationsOpen(true)}>📍 {displayLoc}</button>
          <div className="hv2-desktop-actions">
            <button className="hv2-classic-link" onClick={() => navigate('/login')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 12c-4.418 0-8 3.582-8 8h16c0-4.418-3.582-8-8-8z" /></svg>
              Login
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            <button className="hv2-classic-link" onClick={() => navigate('/signup')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C9.243 2 7 4.243 7 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm0 12c-4.418 0-8 3.582-8 8h16c0-4.418-3.582-8-8-8z" /></svg>
              Register
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          </div>
          <div className="hv2-hamburger-wrapper">
            <button className="hv2-menu-toggle classic-hamburger" onClick={() => setIsSidebarOpen(true)} aria-label="Menu">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><line x1="5" y1="8" x2="19" y2="8"></line><line x1="5" y1="13" x2="22" y2="13"></line><line x1="5" y1="18" x2="14" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </header>

      <main style={{ minHeight: "calc(100vh - 88px)", marginTop: "0" }}>
        {children}
      </main>

      <footer className="hv2-footer">
        <div className="hv2-footer-main">
          <div className="hv2-footer-brand-side">
            <div className="hv2-footer-logo">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 9V20C3 20.55 3.21 21.04 3.59 21.41 3.96 21.79 4.47 22 5 22H19C19.53 22 20.04 21.79 20.41 21.41 20.79 21.04 21 20.55 21 20V9L12 2Z" fill="#5B5BD6" />
                <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Livora</span>
            </div>
            <p className="hv2-footer-tagline">Premium co-living spaces designed for comfort, community, and absolute convenience. Your home, elevated.</p>
          </div>
          <div className="hv2-footer-links-side">
            <div className="hv2-footer-column">
              <h4>Explore</h4>
              <span onClick={() => navigate('/explore')}>Our Properties</span>
              <span onClick={() => navigate('/contact')}>Contact Us</span>
              <span onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveModal('amenities'); }}>Amenities</span>
            </div>
            <div className="hv2-footer-column">
              <h4>Legal</h4>
              <span onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); navigate('/terms'); }}>Terms &amp; Conditions</span>
              <span onClick={() => navigate('/privacy')}>Privacy Policy</span>
            </div>
            <div className="hv2-footer-column">
              <h4>Contact</h4>
              <span>Cyber Towers, Hyderabad</span>
              <span>+91 7569383323</span>
              <span>support@livora.com</span>
            </div>
          </div>
        </div>
        <div className="hv2-footer-bottom-line">
          <p>© 2026 Livora Private Limited. All rights reserved.</p>
        </div>
      </footer>

      <a href="https://wa.me/919876543213" target="_blank" rel="noreferrer" className="hv2-whatsapp-fab" title="Chat with us on WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>



      {activeModal && (
        <div className="hv2-classic-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="hv2-classic-modal-content" onClick={e => e.stopPropagation()}>
            <div className="hv2-cm-header">
              <h2 className="hv2-cm-title">
                {activeModal === 'services' && <><span className="hv2-cm-title-icon">🛎️</span>Services</>}
                {activeModal === 'amenities' && <><span className="hv2-cm-title-icon">🏠</span>Amenities</>}

                {activeModal === 'faq' && <><span className="hv2-cm-title-icon">❓</span>FAQ & Support</>}
              </h2>
              <button className="hv2-cm-close" onClick={() => setActiveModal(null)}>✕</button>
            </div>
            <div className="hv2-cm-body">
              {activeModal === 'services' && (
                <div className="hv2-cm-flat-grid">
                  {servicesData.flatMap(s => s.items).map((srv, j) => (
                    <div key={j} className="hv2-cm-grid-card">
                      <div className="hv2-cm-grid-icon">{srv.icon}</div>
                      <span className="hv2-cm-grid-name">{srv.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {activeModal === 'amenities' && (
                <div className="hv2-cm-flat-grid">
                  {amenitiesData.flatMap(s => s.items).map((amn, j) => (
                    <div key={j} className="hv2-cm-grid-card">
                      <div className="hv2-cm-grid-icon">{amn.icon}</div>
                      <span className="hv2-cm-grid-name">{amn.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeModal === 'faq' && (
                <div className="hv2-cm-document">
                  <h3>Frequently Asked Questions</h3>
                  <p>Find quick answers to common queries about staying at Livora.</p>
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1rem' }}>What is the booking process?</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>You can book a room directly through our app or website. Select your property, choose your room type, and pay the security deposit to confirm.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {activeModal === 'faq' && (
              <div className="hv2-cm-footer">
                <button className="hv2-cm-btn" onClick={() => navigate('/contact')}>Contact Support</button>
              </div>
            )}
          </div>
        </div>
      )}

      {isLocationsOpen && (
        <div className="loc-basic-overlay" onClick={() => setIsLocationsOpen(false)}>
          <div className="loc-basic-modal" onClick={e => e.stopPropagation()}>
            <div className="loc-basic-header">
              <h2 className="loc-basic-title">Top Cities</h2>
              <button className="loc-basic-close" onClick={() => setIsLocationsOpen(false)}>✕</button>
            </div>
            <div className="loc-basic-cities">
              {cities.slice(0, showAllCities ? cities.length : 6).map((city, i) => (
                <div
                  key={i}
                  className="loc-basic-city"
                  onClick={() => { setIsLocationsOpen(false); navigate(`/explore?location=${city.name}`); }}
                >
                  <div className="loc-basic-img-wrap">
                    <img src={city.img} alt={city.name} className="loc-basic-img" />
                  </div>
                  <span className="loc-basic-name">{city.name}</span>
                </div>
              ))}
            </div>
            <div className="loc-basic-footer">
              {!showAllCities ? (
                <button className="loc-basic-view-all" onClick={() => setShowAllCities(true)}>View all Cities ▾</button>
              ) : (
                <button className="loc-basic-view-all" onClick={() => setShowAllCities(false)}>Show Less ▴</button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`hv2-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      <div className={`hv2-sidebar-drawer ${isSidebarOpen ? 'open' : ''}`}>
        <div className="hv2-sidebar-header">
          <div className="hv2-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L3 9V20C3 20.55 3.21 21.04 3.59 21.41 3.96 21.79 4.47 22 5 22H19C19.53 22 20.04 21.79 20.41 21.41 20.79 21.04 21 20.55 21 20V9L12 2Z" fill="#4F46E5" /></svg>
            <span className="hv2-logo-text" style={{ fontSize: '1.2rem' }}>Livora</span>
          </div>
          <button className="hv2-sidebar-close" onClick={() => setIsSidebarOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="hv2-sidebar-content">
          <div className="hv2-sb-section">
            <h4 className="hv2-sb-title">Account</h4>
            <div className="hv2-sb-group-card">
              <div className="hv2-sb-item" onClick={() => { setIsSidebarOpen(false); navigate('/login'); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>Login / Register</span>
                <ChevronRight size={14} className="hv2-sb-chevron" />
              </div>
            </div>
          </div>
          <div className="hv2-sb-section">
            <h4 className="hv2-sb-title">Hostel Info</h4>
            <div className="hv2-sb-group-card">
              <div className="hv2-sb-item" onClick={() => { setIsSidebarOpen(false); setActiveModal('amenities'); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                <span>Amenities</span>
                <ChevronRight size={14} className="hv2-sb-chevron" />
              </div>
              <div className="hv2-sb-item" onClick={() => { setIsSidebarOpen(false); navigate('/our-services'); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>Services</span>
                <ChevronRight size={14} className="hv2-sb-chevron" />
              </div>
            </div>
          </div>
          <div className="hv2-sb-section">
            <h4 className="hv2-sb-title">Support & Policies</h4>
            <div className="hv2-sb-group-card">
              <div className="hv2-sb-item" onClick={() => { setIsSidebarOpen(false); navigate('/terms'); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                <span>Terms & Conditions</span>
                <ChevronRight size={14} className="hv2-sb-chevron" />
              </div>
              <div className="hv2-sb-item" onClick={() => { setIsSidebarOpen(false); setActiveModal('faq'); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span>FAQ & Support</span>
                <ChevronRight size={14} className="hv2-sb-chevron" />
              </div>
            </div>
          </div>
          <div className="hv2-sb-section last">
            <div className="hv2-sb-partner-card">
              <h5>Host Partner?</h5>
              <p>List your hostel or PG and start getting verified inquiries today.</p>
              <button className="hv2-sb-partner-btn" onClick={() => { setIsSidebarOpen(false); navigate('/login?type=owner'); }}>
                List Your Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicLayout;
