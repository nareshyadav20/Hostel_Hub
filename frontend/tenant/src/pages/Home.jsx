import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, IndianRupee, Home as HomeIcon, CalendarCheck, Sparkles, Users, Building, Star, Sofa, Utensils, Wifi, PartyPopper, LifeBuoy, Wallet, User, Crown, GraduationCap, ChevronDown, X, ChevronRight, Bed, BookOpen, Shirt, Droplet, Car, Video, Wrench, ShieldCheck, MessageSquare, HeartPulse } from 'lucide-react';
import './Home.css';
import API from '../api/axios';
import SearchOverlay from '../components/SearchOverlay';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';
import heroCouple from '../assets/landing/hero_couple.png';
import extReal from '../assets/landing/ext_real.png';
import chairsReal from '../assets/landing/chairs_real.png';
import roomStanza from '../assets/landing/room_stanza.png';
import bondEasy from '../assets/landing/bond_easy.png';
import stayEasy from '../assets/landing/stay_easy.png';
import studentCat from '../assets/landing/student_cat.png';
import professionalCat from '../assets/landing/professional_cat.png';
import womensHostelImg from '../assets/landing/womens_hostel.png';
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

const RoomCard = ({ room, wishlist, toggleWishlist, setModalInfo, navigate }) => {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    if (!room.images || room.images.length <= 1) return;
    const timer = setInterval(() => {
      setImgIdx(prev => (prev + 1) % room.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [room.images]);

  const currentImage = room.images && room.images.length > 0 ? room.images[imgIdx] : extReal;

  return (
    <div className="hv2-room-card">
      <div className="hv2-room-img-box" onClick={() => setModalInfo({ isOpen: true, image: currentImage })} style={{ cursor: 'zoom-in' }}>
        <img src={currentImage} alt={room.name} className="hv2-room-img" style={{ transition: 'opacity 0.5s ease-in-out' }} />
        <span className="hv2-room-badge" style={{ background: room.badgeColor }}>{room.badge}</span>
        <span className="hv2-trending-badge">🔥 Trending</span>
        <button className={`hv2-heart ${wishlist.includes(room.id) ? 'liked' : ''}`} onClick={(e) => { e.stopPropagation(); toggleWishlist(room.id); }}>
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
          <button className="hv2-details-btn-wide" onClick={(e) => { e.stopPropagation(); navigate(`/listing/${room.id}`); }}>View Details</button>
        </div>
      </div>
    </div>
  );
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
        images: b.images && b.images.length > 0 ? b.images.map(img => (img.startsWith('http') || img.startsWith('data:')) ? img : `http://localhost:5000${img}`) : [extReal],
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
    <>

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
            <button className="hv2-btn-secondary" onClick={() => navigate('/search')}>Search Hostels</button>
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
            <RoomCard
              key={room.id}
              room={room}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              setModalInfo={setModalInfo}
              navigate={navigate}
            />
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



    </>
  );
};

export default Home;
