import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, IndianRupee, Home as HomeIcon, CalendarCheck, Sparkles, Users, Building, Star, Sofa, Utensils, Wifi, PartyPopper, LifeBuoy, Wallet, User, Crown, GraduationCap, ChevronDown, X, ChevronRight, Bed, BookOpen, Shirt, Droplet, Car, Video, Wrench, ShieldCheck, MessageSquare, HeartPulse } from 'lucide-react';
import './Home.css';
import API from '../api/axios';
import SearchOverlay from '../components/SearchOverlay';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';
import heroCouple from '../assets/hero_couple.png';
import extReal from '../assets/ext_real.png';
import chairsReal from '../assets/chairs_real.png';
import roomStanza from '../assets/room_stanza.png';
import bondEasy from '../assets/bond_easy.png';
import stayEasy from '../assets/stay_easy.png';
import studentCat from '../assets/student_cat.png';
import professionalCat from '../assets/professional_cat.png';
import womensHostelImg from '../assets/womens_hostel.png';
import ImageModal from '../components/ImageModal';

const CountUpAnimation = ({ endValue, suffix = '', isFloat = false }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);

  useEffect(() => {
    const end = parseFloat(endValue);
    if (isNaN(end)) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let startTimestamp = null;
        const duration = 2000;
        const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          setCount(progress * end);
          if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [endValue]);

  const displayCount = isFloat ? count.toFixed(1) : Math.floor(count);
  return <span ref={nodeRef}>{displayCount}{suffix}</span>;
};

const Home = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');
  const [searchLocation, setSearchLocation] = useState('');
  const [budget, setBudget] = useState('');
  const [stayType, setStayType] = useState('');
  const [hostelType, setHostelType] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isStayTypeOpen, setIsStayTypeOpen] = useState(false);
  const [isHostelTypeOpen, setIsHostelTypeOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, image: '' });
  const searchBarRef = useRef(null);

  const [platformStats, setPlatformStats] = useState({ tenants: 0, properties: 0, cities: 0, rating: '0' });

  const fetchStats = async () => {
    try {
      const res = await API.get('/buildings/public/stats');
      setPlatformStats({
        tenants: res.data.tenants || 0,
        properties: res.data.properties || 0,
        cities: res.data.cities || 0,
        rating: res.data.rating || '0/5'
      });
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const heroImages = [heroCouple, roomStanza, chairsReal, stayEasy];
  const [currentHeroImg, setCurrentHeroImg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImg((prev) => (prev + 1) % heroImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await API.get('/buildings/public');
      const formatted = res.data.map((b, i) => ({
        id: b._id,
        badge: b.popularityLabel || (i === 0 ? 'Premium' : i === 1 ? 'Popular' : 'New'),
        badgeColor: i === 0 ? '#4F46E5' : i === 1 ? '#10B981' : '#F59E0B',
        img: b.images && b.images[0] ? (b.images[0].startsWith('http') ? b.images[0] : `http://localhost:5000${b.images[0]}`) : extReal,
        name: b.name,
        loc: b.address + ', ' + b.locationCity,
        price: `₹${b.startingPrice?.toLocaleString() || '9,000'}`,
        amenities: b.amenities && b.amenities.length > 0 ? b.amenities.slice(0, 4) : ['WiFi', 'Meals', 'AC', 'Laundry']
      }));
      setRooms(formatted.slice(0, 3)); // Show top 3
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchStats();

    // Real-time synchronization
    connectSocket(); // Global room
    socket.on('hostelUpdated', () => {
      console.log('🔄 Hostel Details Updated in Real-time');
      fetchRooms();
      fetchStats();
    });

    return () => {
      socket.off('hostelUpdated');
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setIsBudgetOpen(false);
        setIsStayTypeOpen(false);
        setIsHostelTypeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'Explore', id: 'explore' },
    { label: 'Services', id: 'services' },
    { label: 'Reviews', id: 'reviews' },
    { label: 'About Us', id: 'about' },
    { label: 'Contact', id: 'contact' }
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const matchedItem = navItems.find(item => item.id === entry.target.id);
          if (matchedItem) setActiveNav(matchedItem.label);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Target sections
    ['hero', 'how', 'reviews', 'cities'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [navItems]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const stats = [
    { icon: <Users size={32} color="currentColor" />, value: <CountUpAnimation endValue={platformStats.tenants} suffix="+" />, label: 'Happy Tenants' },
    { icon: <Building size={32} color="currentColor" />, value: <CountUpAnimation endValue={platformStats.properties} suffix="+" />, label: 'Verified Properties' },
    { icon: <MapPin size={32} color="currentColor" />, value: <CountUpAnimation endValue={platformStats.cities} suffix="+" />, label: 'Cities' },
    { icon: <Star size={32} color="currentColor" />, value: <CountUpAnimation endValue={platformStats.rating.split('/')[0]} suffix="/5" isFloat={true} />, label: 'Average Rating' },
  ];

  const steps = [
    { num: 1, icon: <Search size={44} color="#4F46E5" />, title: 'Search Location', desc: 'Choose your city and preferred location' },
    { num: 2, icon: <HomeIcon size={44} color="#4F46E5" />, title: 'Compare Rooms', desc: 'Explore verified rooms and compare amenities & prices' },
    { num: 3, icon: <CalendarCheck size={44} color="#4F46E5" />, title: 'Book Instantly', desc: 'Select your room and move in hassle-free' },
    { num: 4, icon: <Sparkles size={44} color="#4F46E5" />, title: 'Experience Livora', desc: 'Enjoy premium amenities and a vibrant community' },
  ];

  // rooms state populated via API

  const features = [
    { icon: <Sofa size={36} color="#0f172a" />, title: 'Fully Furnished', desc: 'Move-in with just your suitcase' },
    { icon: <Utensils size={36} color="#0f172a" />, title: 'Daily Meals', desc: 'Nutritious & hygienic meals everyday' },
    { icon: <Wifi size={36} color="#0f172a" />, title: 'High-Speed WiFi', desc: 'Work, study & stream without limits' },
    { icon: <PartyPopper size={36} color="#0f172a" />, title: 'Community Events', desc: 'Make friends & create memories' },
    { icon: <LifeBuoy size={36} color="#0f172a" />, title: '24/7 Support', desc: "We're always here for you" },
    { icon: <Wallet size={36} color="#0f172a" />, title: 'No Hidden Charges', desc: 'Transparent pricing, no surprises' },
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
    if (hostelType) params.append('hostelType', hostelType);
    if (stayType) params.append('stayType', stayType);
    navigate(`/search?${params.toString()}`);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'services', 'amenities', 'terms'
  const [isLocationsOpen, setIsLocationsOpen] = useState(false);

  // categorized Mock Data for Modals based on Strict Definitions
  const iconColor = "#4F46E5"; // Unified color for all icons
  const mockAmenities = [
    {
      category: 'In-Room Features', items: [
        { icon: <Bed color={iconColor} size={20} />, name: 'Beds' },
        { icon: <BookOpen color={iconColor} size={20} />, name: 'Study tables' }
      ]
    },
    {
      category: 'Shared Facilities', items: [
        { icon: <Wifi color={iconColor} size={20} />, name: 'Wi-Fi' },
        { icon: <Shirt color={iconColor} size={20} />, name: 'Laundry room' },
        { icon: <Droplet color={iconColor} size={20} />, name: 'Water cooler' },
        { icon: <Car color={iconColor} size={20} />, name: 'Parking' }
      ]
    },
    {
      category: 'Security & Safety', items: [
        { icon: <Video color={iconColor} size={20} />, name: 'CCTV' }
      ]
    }
  ];

  const mockServices = [
    {
      category: 'Daily Care & Conveniences', items: [
        { icon: <Sparkles color={iconColor} size={20} />, name: 'Room cleaning' },
        { icon: <Utensils color={iconColor} size={20} />, name: 'Food/mess service' },
        { icon: <Shirt color={iconColor} size={20} />, name: 'Laundry pickup service' }
      ]
    },
    {
      category: 'Support Operations', items: [
        { icon: <Wrench color={iconColor} size={20} />, name: 'Maintenance support' },
        { icon: <ShieldCheck color={iconColor} size={20} />, name: 'Security assistance' },
        { icon: <MessageSquare color={iconColor} size={20} />, name: 'Complaint resolution' },
        { icon: <HeartPulse color={iconColor} size={20} />, name: 'Medical assistance' }
      ]
    }
  ];

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

        <nav className={`hv2-nav ${isMenuOpen ? 'mobile-open' : ''}`}>
          {isMenuOpen && (
            <div className="hv2-mobile-header">
              <span className="hv2-logo-text">Livora</span>
              <button className="hv2-menu-close" onClick={() => setIsMenuOpen(false)}>✕</button>
            </div>
          )}
          {navItems.map(item => (
            <span key={item.label} className={`hv2-nav-item ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => {
                setActiveNav(item.label);
                setIsMenuOpen(false);
                if (item.id === 'services') {
                  setActiveModal('services');
                } else if (item.id === 'explore') {
                  navigate('/explore');
                } else if (['about', 'contact'].includes(item.id)) {
                  navigate(`/${item.id}`);
                } else {
                  scrollToSection(item.id);
                }
              }}>
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

        {/* Right Side Actions */}
        <div className="hv2-header-actions">
          {/* Locations pill — opens drawer */}
          <button
            className="hv2-locations-btn"
            onClick={() => setIsLocationsOpen(true)}
          >
            📍 Locations
          </button>

          {/* Classic Auth Links */}
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

          {/* Staggered 3-line menu */}
          <div className="hv2-hamburger-wrapper">
            <button
              className="hv2-menu-toggle classic-hamburger"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Menu"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="5" y1="8" x2="19" y2="8"></line>
                <line x1="5" y1="13" x2="22" y2="13"></line>
                <line x1="5" y1="18" x2="14" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="hv2-hero" id="hero">
        <div className="hv2-hero-left">
          <div className="hv2-hero-tag">🏆 India’s #1 Hostel & PG Network</div>
          <h1 className="hv2-hero-h1">
            Find Your Perfect Stay<br />
            <span className="hv2-hero-accent">That Fits Your Lifestyle<span className="hv2-dot">.</span></span>
          </h1>
          <p className="hv2-hero-desc">Premium spaces for students & professionals. Quality living, zero hassle.</p>

          {/* Search Bar */}
          <div className="hv2-search-bar" ref={searchBarRef}>
            <div className="hv2-search-field">
              <span className="hv2-field-label">Location</span>
              <div className="hv2-field-input-wrap">
                <span className="hv2-field-icon" style={{ color: '#64748b' }}><MapPin size={18} /></span>
                <input className="hv2-field-text-input" placeholder="" value={searchLocation} onChange={e => setSearchLocation(e.target.value)} />
              </div>
            </div>
            <div className="hv2-search-sep" />

            <div className="hv2-search-field" onClick={() => { setIsBudgetOpen(!isBudgetOpen); setIsHostelTypeOpen(false); setIsStayTypeOpen(false); }}>
              <span className="hv2-field-label">Budget</span>
              <div className="hv2-field-input-wrap">
                <span className="hv2-field-icon" style={{ color: '#64748b' }}><IndianRupee size={18} /></span>
                <div className="hv2-custom-select">
                  <span className="hv2-select-value">{budget || ''}</span>
                  <ChevronDown size={14} className={`hv2-dropdown-arrow ${isBudgetOpen ? 'open' : ''}`} />
                </div>
              </div>
              {isBudgetOpen && (
                <div className="hv2-dropdown-list">
                  {['Any Budget', 'Under ₹8k', '₹8k–₹12k', '₹12k–₹18k', 'Above ₹18k'].map(opt => (
                    <div key={opt} className={`hv2-dropdown-item ${budget === opt || (!budget && opt === 'Any Budget') ? 'selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setBudget(opt === 'Any Budget' ? '' : opt); setIsBudgetOpen(false); }}>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="hv2-search-sep" />

            <div className="hv2-search-field" onClick={() => { setIsHostelTypeOpen(!isHostelTypeOpen); setIsBudgetOpen(false); setIsStayTypeOpen(false); }}>
              <span className="hv2-field-label">Hostel Type</span>
              <div className="hv2-field-input-wrap">
                <span className="hv2-field-icon" style={{ color: '#64748b' }}><HomeIcon size={18} /></span>
                <div className="hv2-custom-select">
                  <span className="hv2-select-value">{hostelType || ''}</span>
                  <ChevronDown size={14} className={`hv2-dropdown-arrow ${isHostelTypeOpen ? 'open' : ''}`} />
                </div>
              </div>
              {isHostelTypeOpen && (
                <div className="hv2-dropdown-list">
                  {['Any Hostel', "Men's", "Women's", 'Co-living'].map(opt => (
                    <div key={opt} className={`hv2-dropdown-item ${hostelType === opt || (!hostelType && opt === 'Any Hostel') ? 'selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setHostelType(opt === 'Any Hostel' ? '' : opt); setIsHostelTypeOpen(false); }}>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="hv2-search-sep" />

            <div className="hv2-search-field" onClick={() => { setIsStayTypeOpen(!isStayTypeOpen); setIsBudgetOpen(false); setIsHostelTypeOpen(false); }}>
              <span className="hv2-field-label">Stay Type</span>
              <div className="hv2-field-input-wrap">
                <span className="hv2-field-icon" style={{ color: '#64748b' }}><CalendarCheck size={18} /></span>
                <div className="hv2-custom-select">
                  <span className="hv2-select-value">{stayType || 'Any Stay'}</span>
                  <ChevronDown size={14} className={`hv2-dropdown-arrow ${isStayTypeOpen ? 'open' : ''}`} />
                </div>
              </div>
              {isStayTypeOpen && (
                <div className="hv2-dropdown-list">
                  {['Any Stay', 'Single', '2 Sharing', '3 Sharing', '4 Sharing'].map(opt => (
                    <div key={opt} className={`hv2-dropdown-item ${stayType === opt || (!stayType && opt === 'Any Stay') ? 'selected' : ''}`}
                      onClick={(e) => { e.stopPropagation(); setStayType(opt === 'Any Stay' ? '' : opt); setIsStayTypeOpen(false); }}>
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="hv2-search-btn" onClick={handleSearch}>
              <Search size={18} />
              <span>Search</span>
            </button>
          </div>

          {/* Hero CTAs */}
          <div className="hv2-hero-btns">
            <button className="hv2-btn-primary" onClick={() => navigate('/explore')}>Explore Rooms</button>
            <button className="hv2-btn-secondary" onClick={() => navigate('/login')}>Book a Visit</button>
          </div>

          {/* Trust badges */}
          <div className="hv2-trust-row">
            {['Verified', 'Zero Brokerage', 'Flexible Rent', '24/7 Support'].map(b => (
              <span key={b} className="hv2-trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="hv2-hero-right">
          <div className="hv2-hero-img-wrap">
            <img src={heroImages[currentHeroImg]} alt="Livora residents" className="hv2-hero-img hv2-slider-anim" style={{ transition: 'opacity 0.5s ease-in-out' }} />
            <div className="hv2-float-badge">
              <div className="hv2-float-info">
                <div className="hv2-float-num">⭐ 4.9/5</div>
                <div className="hv2-float-label">Top Rated in India</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="hv2-stats-wrap">
        <div className="hv2-stats-bar">
          {stats.map((s, i) => (
            <div key={i} className={`hv2-stat hv2-stat-anim-${i + 1}`}>
              <div className="hv2-stat-icon-wrap">
                <div className="hv2-stat-icon-pulse" />
                {s.icon}
              </div>
              <div className="hv2-stat-text">
                <div className="hv2-stat-val">{s.value}</div>
                <div className="hv2-stat-lbl">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORY SELECTION ── */}
      <section className="hv2-categories">
        <div className="hv2-section-head">
          <span className="hv2-tag">Explore by Type</span>
          <h2 className="hv2-section-title">Choose Your Category</h2>
          <p className="hv2-section-sub">Tailored living experiences for every need</p>
        </div>
        <div className="hv2-cat-grid">
          {[
            { name: "Men's Hostel", count: '200+ Properties', icon: <User size={24} color="currentColor" />, img: extReal },
            { name: "Women's Hostel", count: '150+ Properties', icon: <User size={24} color="currentColor" />, img: womensHostelImg },
            { name: "Co-living Spaces", count: '100+ Properties', icon: <Users size={24} color="currentColor" />, img: heroCouple },
            { name: "Premium Stays", count: '80+ Properties', icon: <Crown size={24} color="currentColor" />, img: chairsReal },
            { name: "Student PGs", count: '300+ Properties', icon: <GraduationCap size={24} color="currentColor" />, img: stayEasy }
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

      {/* ── HOW IT WORKS ── */}
      <section className="hv2-how" id="how">
        <div className="hv2-section-head">
          <span className="hv2-tag">Simple Process</span>
          <h2 className="hv2-section-title">How It Works</h2>
          <p className="hv2-section-sub">Find your perfect home in 4 simple steps</p>
        </div>
        <div className="hv2-steps">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className={`hv2-step-card hv2-step-anim-${i + 1}`}>
                <div className="hv2-step-num">{s.num}</div>
                <div className="hv2-step-icon">{s.icon}</div>
                <h4 className="hv2-step-title">{s.title}</h4>
                <p className="hv2-step-desc">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hv2-step-connector">
                  <div className={`hv2-connector-line hv2-connector-anim-${i + 1}`} />
                </div>
              )}
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
              <div className="hv2-room-img-box" onClick={() => setModalInfo({ isOpen: true, image: room.img })} style={{ cursor: 'zoom-in' }}>
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
      <section className="hv2-section hv2-testi-section" id="reviews">
        <div className="hv2-section-head">
          <span className="hv2-tag">Resident Stories</span>
          <h2 className="hv2-section-title">What Our Residents Say</h2>
          <p className="hv2-section-sub">Loved by thousands who call it home</p>
        </div>
        <div className="hv2-testi-container">
          <div className="hv2-testi-track">
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div key={i} className={`hv2-testi-card ${i % testimonials.length === 1 ? 'hv2-testi-featured' : ''}`}>
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
        </div>
      </section>

      {/* ── TOP LOCATIONS ── */}
      <section className="hv2-section hv2-cities-section" id="cities">
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
              <span onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveModal('amenities'); }}>Amenities</span>
              <span onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveModal('services'); }}>Services</span>
              <span onClick={() => navigate('/about')}>About Us</span>
              <span onClick={() => navigate('/contact')}>Contact Us</span>
            </div>
            <div className="hv2-footer-column">
              <h4>Legal</h4>
              <span onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveModal('terms'); }}>Terms &amp; Conditions</span>
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

      <ImageModal
        isOpen={modalInfo.isOpen}
        image={modalInfo.image}
        onClose={() => setModalInfo({ isOpen: false, image: '' })}
      />

      {/* ── WHATSAPP FLOATING BUTTON ── */}
      <a href="https://wa.me/919876543213" target="_blank" rel="noreferrer" className="hv2-whatsapp-fab" title="Chat with us on WhatsApp">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>

      {/* ── CLASSIC INFO MODALS (Services, Amenities, Terms) ── */}
      {activeModal && (
        <div className="hv2-classic-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="hv2-classic-modal-content" onClick={e => e.stopPropagation()}>
            <div className="hv2-cm-header">
              <h2 className="hv2-cm-title">
                {activeModal === 'services' && (
                  <><span className="hv2-cm-title-icon">🛎️</span>Services</>
                )}
                {activeModal === 'amenities' && (
                  <><span className="hv2-cm-title-icon">🏠</span>Amenities</>
                )}
                {activeModal === 'terms' && 'Terms & Conditions'}
                {activeModal === 'faq' && (
                  <><span className="hv2-cm-title-icon">❓</span>FAQ & Support</>
                )}
              </h2>
              <button className="hv2-cm-close" onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div className="hv2-cm-body">
              {activeModal === 'services' && (
                <div className="hv2-cm-flat-grid">
                  {mockServices.flatMap(s => s.items).map((srv, j) => (
                    <div key={j} className="hv2-cm-grid-card">
                      <div className="hv2-cm-grid-icon">{srv.icon}</div>
                      <span className="hv2-cm-grid-name">{srv.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeModal === 'amenities' && (
                <div className="hv2-cm-flat-grid">
                  {mockAmenities.flatMap(s => s.items).map((amn, j) => (
                    <div key={j} className="hv2-cm-grid-card">
                      <div className="hv2-cm-grid-icon">{amn.icon}</div>
                      <span className="hv2-cm-grid-name">{amn.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeModal === 'terms' && (
                <div className="hv2-cm-document">
                  <h3>Livora Hostel Residency Agreement</h3>
                  <p>Welcome to Livora! Please review our standard operating terms designed to ensure a premium, safe, and hassle-free living experience for all residents.</p>

                  <ol>
                    <li>
                      <strong>Rent & Security Deposit</strong>
                      Monthly rent is strictly due by the 5th of every month. A 2-month security deposit is required at onboarding, fully refundable subject to a 30-day exit notice.
                    </li>
                    <li>
                      <strong>Visitor Policy</strong>
                      Guests are welcome in common lounges between 9:00 AM and 8:00 PM. For security reasons, no outside guests are permitted to stay overnight or enter private rooms.
                    </li>
                    <li>
                      <strong>Timings & Curfew</strong>
                      The main gates close at 11:30 PM. Late entries are permitted only for verified work/study reasons with prior intimation to the property manager via the Livora App.
                    </li>
                    <li>
                      <strong>Maintenance & Damages</strong>
                      Residents are responsible for the fixtures in their rooms. Any intentional damage or loss of property will be deducted from the security deposit. Normal wear and tear is covered by our Pro Maintenance.
                    </li>
                    <li>
                      <strong>Zero Tolerance Policy</strong>
                      We maintain a strict zero-tolerance policy towards substance abuse, smoking indoors, and loud disturbances after 10:00 PM to respect the community.
                    </li>
                  </ol>
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
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1rem' }}>Are there any hidden charges?</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>No, Livora believes in 100% transparency. Your monthly rent covers accommodation, meals (if opted), high-speed internet, and daily housekeeping.</p>
                    </div>
                    <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e293b', fontSize: '1rem' }}>What happens if I need to leave early?</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569' }}>We require a 30-day notice period before you move out. If you leave without notice, a portion of your deposit may be withheld.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {activeModal === 'terms' && (
              <div className="hv2-cm-footer">
                <button className="hv2-cm-btn" onClick={() => setActiveModal(null)}>I Understand & Agree</button>
              </div>
            )}

            {activeModal === 'faq' && (
              <div className="hv2-cm-footer">
                <button className="hv2-cm-btn" onClick={() => navigate('/contact')}>Contact Support</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── LOCATIONS BASIC MODAL ── */}
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
                  onClick={() => { setIsLocationsOpen(false); navigate(`/search?location=${city.name}`); }}
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
                <button className="loc-basic-view-all" onClick={() => setShowAllCities(true)}>
                  View all Cities ▾
                </button>
              ) : (
                <button className="loc-basic-view-all" onClick={() => setShowAllCities(false)}>
                  Show Less ▴
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PREMIUM SIDEBAR DRAWER ── */}
      <div className={`hv2-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      <div className={`hv2-sidebar-drawer ${isSidebarOpen ? 'open' : ''}`}>
        <div className="hv2-sidebar-header">
          <div className="hv2-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 9V20C3 20.55 3.21 21.04 3.59 21.41 3.96 21.79 4.47 22 5 22H19C19.53 22 20.04 21.79 20.41 21.41 20.79 21.04 21 20.55 21 20V9L12 2Z" fill="#4F46E5" />
            </svg>
            <span className="hv2-logo-text" style={{ fontSize: '1.2rem' }}>Livora</span>
          </div>
          <button className="hv2-sidebar-close" onClick={() => setIsSidebarOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
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
              <div className="hv2-sb-item" onClick={() => { setIsSidebarOpen(false); setActiveModal('services'); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                <span>Services</span>
                <ChevronRight size={14} className="hv2-sb-chevron" />
              </div>
              <div className="hv2-sb-item" onClick={() => { setIsSidebarOpen(false); navigate('/offers'); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
                <span>Offers & Discounts</span>
                <ChevronRight size={14} className="hv2-sb-chevron" />
              </div>
            </div>
          </div>

          <div className="hv2-sb-section">
            <h4 className="hv2-sb-title">Support & Policies</h4>
            <div className="hv2-sb-group-card">
              <div className="hv2-sb-item" onClick={() => { setIsSidebarOpen(false); setActiveModal('terms'); }}>
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

export default Home;
