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
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('coliving');
  const [selectedGender, setSelectedGender] = useState('');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showAmenitiesDropdown, setShowAmenitiesDropdown] = useState(false);
  const [joiningDate, setJoiningDate] = useState('');
  const [isLocalityExpanded, setIsLocalityExpanded] = useState(false);
  const [searchLocality, setSearchLocality] = useState('');
  const [searchCollege, setSearchCollege] = useState('');
  const [searchProperty, setSearchProperty] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', contact: '' });

  const [sortBy, setSortBy] = useState('');
  const [sharingTypes, setSharingTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 60000]);

  const hostels = [
    { id: 1, city: 'Bengaluru', name: 'Livora Elite - Koramangala', locality: 'Koramangala', rating: 4.8, price: 12500, img: heroBg, amenities: ['Free WiFi', 'A/C', 'Mess', 'Gym'], gender: 'Unisex', category: 'Professional' },
    { id: 2, city: 'Bengaluru', name: 'Modern Stay for Students', locality: 'Indiranagar', rating: 4.5, price: 8500, img: studentImg, amenities: ['Laundry', 'Study Room', '24/7 Security'], gender: 'Women', category: 'Student' },
    { id: 3, city: 'Bengaluru', name: 'Professional Co-Living', locality: 'HSR Layout', rating: 4.6, price: 14000, img: professionalImg, amenities: ['Workstations', 'High-speed WiFi', 'Cafe'], gender: 'Men', category: 'Professional' },
    { id: 4, city: 'Bengaluru', name: 'The Hive - Whitefield', locality: 'Whitefield', rating: 4.7, price: 11000, img: heroBg, amenities: ['Gaming Zone', 'Power Backup', 'Housekeeping'], gender: 'Unisex', category: 'Professional' },
    { id: 5, city: 'Hyderabad', name: 'Zenith Living Hyderabad', locality: 'Gachibowli', rating: 4.9, price: 15500, img: studentImg, amenities: ['Premium Mess', 'Swimming Pool', 'Yoga Deck', 'Gym', 'Food', 'AC'], gender: 'Unisex', category: 'Professional' },
    { id: 6, city: 'Mumbai', name: 'Urban Den Mumbai', locality: 'Andheri West', rating: 4.4, price: 18000, img: professionalImg, amenities: ['Co-working Space', 'Gym', 'Terrace Garden'], gender: 'Men', category: 'Professional' },
    { id: 7, city: 'Hyderabad', name: 'Stellar Suites', locality: 'Banjara Hills', rating: 4.7, price: 16000, img: heroBg, amenities: ['Jacuzzi', 'Mini Theater', 'Valet', 'Gym', 'AC'], gender: 'Unisex', category: 'Professional' },
    { id: 8, city: 'Pune', name: 'The Nest - Pune', locality: 'Viman Nagar', rating: 4.3, price: 9000, img: studentImg, amenities: ['Library', 'Music Room', 'Mess'], gender: 'Women', category: 'Student' },
    { id: 9, city: 'Bengaluru', name: 'Vibe Residency', locality: 'Koramangala', rating: 4.6, price: 13000, img: professionalImg, amenities: ['EV Charging', 'Smart Locks', 'Cafe'], gender: 'Unisex', category: 'Professional' },
    { id: 10, city: 'Delhi', name: 'Aura Living', locality: 'Gurugram', rating: 4.8, price: 19500, img: heroBg, amenities: ['Private Balcony', 'Chef', 'Gym'], gender: 'Unisex', category: 'Professional' },
    { id: 11, city: 'Bengaluru', name: 'Campus Core', locality: 'Manipal', rating: 4.5, price: 7500, img: studentImg, amenities: ['Shuttle', 'Study Hall', 'Mess'], gender: 'Men', category: 'Student' },
    { id: 12, city: 'Mumbai', name: 'Metro Hub Mumbai', locality: 'Powai', rating: 4.5, price: 17000, img: professionalImg, amenities: ['Business Center', 'Rooftop Pool'], gender: 'Unisex', category: 'Professional' },
    { id: 13, city: 'Bengaluru', name: 'Serene Stays', locality: 'Whitefield', rating: 4.7, price: 14500, img: heroBg, amenities: ['Garden', 'Yoga', 'High-speed WiFi'], gender: 'Unisex', category: 'Professional' },
    { id: 14, city: 'Chennai', name: 'Zest Living', locality: 'OMR', rating: 4.4, price: 10500, img: studentImg, amenities: ['Game Room', 'Mess', 'A/C'], gender: 'Men', category: 'Student' },
    { id: 15, city: 'Delhi', name: 'Nexus Co-Living', locality: 'Noida', rating: 4.6, price: 12000, img: professionalImg, amenities: ['Work Pods', 'Gym', 'Laundry'], gender: 'Unisex', category: 'Professional' },
    { id: 16, city: 'Kolkata', name: 'Elite Abodes', locality: 'Salt Lake', rating: 4.8, price: 15000, img: heroBg, amenities: ['Theater', 'Mess', 'Gym'], gender: 'Unisex', category: 'Professional' },
    { id: 17, city: 'Hyderabad', name: 'Cyber Hub Stay', locality: 'HITEC City', rating: 4.6, price: 11500, img: professionalImg, amenities: ['High-speed WiFi', 'Cafe', 'Gym', 'AC'], gender: 'Men', category: 'Professional' },
    { id: 18, city: 'Hyderabad', name: 'Kondapur Komfort', locality: 'Kondapur', rating: 4.4, price: 9500, img: studentImg, amenities: ['Mess', 'Laundry', 'Security', 'Food'], gender: 'Women', category: 'Student' },
    { id: 19, city: 'Hyderabad', name: 'Gowlidoddy Grand', locality: 'Gowlidoddy', rating: 4.5, price: 10000, img: heroBg, amenities: ['AC', 'Power Backup', 'Wifi'], gender: 'Unisex', category: 'Professional' },
    { id: 20, city: 'Hyderabad', name: 'KPHB Residency', locality: 'KPHB', rating: 4.3, price: 8000, img: studentImg, amenities: ['Budget Stay', 'Clean Rooms', 'Mess', 'Food'], gender: 'Men', category: 'Student' },
    { id: 21, city: 'Hyderabad', name: 'Journalist Colony Suites', locality: 'Journalist colony', rating: 4.7, price: 14500, img: professionalImg, amenities: ['Premium Decor', 'Parking', 'Gym', 'AC'], gender: 'Unisex', category: 'Professional' },
    { id: 22, city: 'Hyderabad', name: 'KOKAPET Heights', locality: 'KOKAPET', rating: 4.8, price: 16500, img: heroBg, amenities: ['Swimming Pool', 'Luxury', 'Chef', 'Gym', 'Food', 'AC'], gender: 'Unisex', category: 'Professional' },
    { id: 23, city: 'Hyderabad', name: 'Lanco Hills Living', locality: 'Lanco Hills Manikonda', rating: 4.6, price: 13500, img: studentImg, amenities: ['Scenic View', 'Gym', 'Wifi', 'Food'], gender: 'Women', category: 'Student' },
    { id: 24, city: 'Hyderabad', name: 'Madhapur Metro View', locality: 'Madhapur', rating: 4.7, price: 12500, img: professionalImg, amenities: ['Metro Access', 'Gym', 'AC', 'Fridge'], gender: 'Unisex', category: 'Professional' },
    { id: 25, city: 'Hyderabad', name: 'Manikonda Manor', locality: 'Manikonda', rating: 4.5, price: 11000, img: heroBg, amenities: ['Parking', 'Power Backup', 'AC'], gender: 'Unisex', category: 'Professional' },
    { id: 26, city: 'Hyderabad', name: 'Miyapur Modern', locality: 'Miyapur', rating: 4.4, price: 9000, img: studentImg, amenities: ['Food', 'Laundry', 'Wifi'], gender: 'Men', category: 'Student' },
    { id: 27, city: 'Hyderabad', name: 'Serilingampally Suites', locality: 'Serilingampally', rating: 4.6, price: 10500, img: professionalImg, amenities: ['Peaceful', 'AC', 'Parking'], gender: 'Unisex', category: 'Professional' }
  ];

  let filteredHostels = hostels.filter(h => {
    const matchesCity = h.city === selectedCity;
    const matchesLocality = searchLocality ? h.locality.toLowerCase().includes(searchLocality.toLowerCase()) : true;
    const matchesProperty = searchProperty ? h.name.toLowerCase().includes(searchProperty.toLowerCase()) : true;
    const matchesGender = selectedGender ? (h.gender === selectedGender || h.gender === 'Unisex') : true;
    const matchesAmenities = selectedAmenities.length > 0 ? selectedAmenities.every(a => h.amenities.includes(a)) : true;
    const matchesTab = activeTab === 'student' ? h.category === 'Student' : true;
    const matchesPrice = h.price >= priceRange[0] && h.price <= priceRange[1];
    return matchesCity && matchesLocality && matchesProperty && matchesGender && matchesAmenities && matchesTab && matchesPrice;
  });

  if (sortBy === 'price_low_high') {
    filteredHostels.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high_low') {
    filteredHostels.sort((a, b) => b.price - a.price);
  }

  const allLocalities = ['Gachibowli', 'Gopanpally Gachibowli', 'Gowlidoddy', 'HITEC City', 'Journalist colony', 'KOKAPET', 'Kondapur', 'KPHB', 'Kukatpally', 'Lanco Hills Manikonda', 'Madhapur', 'Manikonda', 'Miyapur', 'Serilingampally'];
  const visibleLocalities = isLocalityExpanded ? allLocalities : allLocalities.slice(0, 10);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 9V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V9L12 2Z" fill="url(#logo_gradient)" stroke="var(--accent-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="logo_gradient" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--accent-primary)" />
                <stop offset="1" stopColor="var(--accent-secondary)" />
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
          <h2>Find Your Perfect Home, Your Way In <span style={{ color: '#00b0f0', cursor: 'pointer' }}>{selectedCity}</span></h2>
          <p>Discover premium hostels and co-living spaces designed for the modern lifestyle.</p>
        </div>

        <div className="zolo-search-trigger fade-in" onClick={() => setIsSearchOverlayOpen(true)}>
          <div className="search-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <span>Where do you want to stay? Search for State, City, Offices, Localities...</span>
        </div>
      </section>

      {isSearchOverlayOpen && (
        <div className="search-overlay-backdrop" onClick={() => setIsSearchOverlayOpen(false)}>
          <div className="search-overlay-content" onClick={e => e.stopPropagation()}>
            <div className="overlay-header">
              <h2 style={{ position: 'relative' }}>
                Find Your Perfect Home, Your Way In{' '}
                <span onClick={() => setShowCityDropdown(!showCityDropdown)} style={{ color: '#00b0f0', cursor: 'pointer' }}>
                  {selectedCity} ⌵
                </span>
                {showCityDropdown && (
                  <div className="city-dropdown" style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '200px' }}>
                    {['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi', 'Pune', 'Chennai', 'Kolkata'].map(city => (
                      <div
                        key={city}
                        className="city-option"
                        style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                        onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }}
                      >
                        {city}
                      </div>
                    ))}
                  </div>
                )}
              </h2>
              <button className="close-btn" onClick={() => setIsSearchOverlayOpen(false)}>✕</button>
            </div>

            <div className="filter-row">
              <div
                className={`filter-chip coliving ${activeTab === 'coliving' ? 'active' : ''}`}
                onClick={() => setActiveTab('coliving')}
                style={{ border: activeTab === 'coliving' ? '2px solid #00b0f0' : 'none' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={activeTab === 'coliving' ? "#00b0f0" : "#757575"}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path></svg>
                Coliving
              </div>
              <div
                className={`filter-chip student ${activeTab === 'student' ? 'active' : ''}`}
                onClick={() => setActiveTab('student')}
                style={{ border: activeTab === 'student' ? '2px solid #00b0f0' : 'none' }}
              >
                <span className="new-badge">NEW</span>
                <div style={{ width: 18, height: 18, borderRadius: '50%', border: activeTab === 'student' ? '2px solid #00b0f0' : '2px solid #cbd5e1', marginRight: 8, background: activeTab === 'student' ? '#00b0f0' : 'transparent' }}></div>
                Student Only
              </div>

              {/* Gender Dropdown */}
              <div className="filter-chip gender" onClick={() => setShowGenderDropdown(!showGenderDropdown)} style={{ position: 'relative' }}>
                {selectedGender || 'Gender'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                {showGenderDropdown && (
                  <div className="glass-card dropdown-menu" style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', zIndex: 20, marginTop: '5px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {['Men', 'Women', 'Unisex'].map(g => (
                      <div key={g} style={{ padding: '0.8rem', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setSelectedGender(g); setShowGenderDropdown(false); }}>{g}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Joining Date */}
              <div className="filter-chip date">
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'inherit', font: 'inherit', outline: 'none', cursor: 'pointer', width: '100%' }}
                />
              </div>

              {/* Amenities Dropdown */}
              <div className="filter-chip amenities" onClick={() => setShowAmenitiesDropdown(!showAmenitiesDropdown)} style={{ position: 'relative' }}>
                {selectedAmenities.length > 0 ? `${selectedAmenities.length} Selected` : 'Amenities'}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                {showAmenitiesDropdown && (
                  <div className="glass-card dropdown-menu" style={{ position: 'absolute', top: '100%', left: 0, width: '200px', background: 'white', zIndex: 20, marginTop: '5px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '0.5rem' }}>
                    {['AC', 'Food', 'Fridge', 'Gym', 'Parking', 'Power Backup'].map(a => (
                      <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(a)}
                          onChange={() => {
                            if (selectedAmenities.includes(a)) setSelectedAmenities(selectedAmenities.filter(item => item !== a));
                            else setSelectedAmenities([...selectedAmenities, a]);
                          }}
                        />
                        {a}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="input-section">
              <label>Where would you like to stay?</label>
              <input
                type="text"
                className="zolo-input"
                placeholder="Search for the Place, Locality or Landmark"
                value={searchLocality}
                onChange={(e) => setSearchLocality(e.target.value)}
              />
              <div className="locality-chips">
                {visibleLocalities.map(loc => (
                  <div key={loc} className="locality-chip" onClick={() => setSearchLocality(loc)}>{loc}</div>
                ))}
                <div className="locality-chip view-more" style={{ color: '#00b0f0' }} onClick={() => setIsLocalityExpanded(!isLocalityExpanded)}>
                  {isLocalityExpanded ? 'View Less' : 'View More'}
                </div>
              </div>
            </div>

            {activeTab === 'student' && (
              <div className="input-section">
                <label>Looking for an accommodation near your college/university?</label>
                <input
                  type="text"
                  className="zolo-input"
                  placeholder="Search for College/University"
                  value={searchCollege}
                  onChange={(e) => setSearchCollege(e.target.value)}
                />
              </div>
            )}

            <div className="input-section">
              <label>Looking for a specific property?</label>
              <input
                type="text"
                className="zolo-input"
                placeholder="Search for Properties"
                value={searchProperty}
                onChange={(e) => setSearchProperty(e.target.value)}
              />
            </div>

            <div className="input-section">
              <label>Please share details below for us to help you better.</label>
              <div className="details-row">
                <input
                  type="text"
                  className="zolo-input"
                  placeholder="Name"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                />
                <input
                  type="text"
                  className="zolo-input"
                  placeholder="Contact Number"
                  value={userDetails.contact}
                  onChange={(e) => setUserDetails({ ...userDetails, contact: e.target.value })}
                />
              </div>
            </div>

            <div className="search-action">
              <button className="zolo-search-btn" onClick={() => { setIsSearchOverlayOpen(false); navigate('/search'); }}>Search</button>
            </div>
          </div>
        </div>
      )}

      <div className="landing-content">
        <aside className="filters-sidebar">
          <div className="sidebar-header">
            <h3>Filters</h3>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#757575" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          </div>

          <div className="filter-section">
            <h4>Stay Type</h4>
            <label className="radio-label">
              <input type="radio" name="stayType" checked={activeTab === 'coliving'} onChange={() => setActiveTab('coliving')} />
              <span className="radio-custom"></span> Coliving
            </label>
            <label className="radio-label">
              <input type="radio" name="stayType" checked={activeTab === 'student'} onChange={() => setActiveTab('student')} />
              <span className="radio-custom"></span> Student Living
            </label>
          </div>

          <div className="filter-section">
            <h4>Sort By</h4>
            <label className="radio-label">
              <input type="radio" name="sortBy" checked={sortBy === 'price_low_high'} onChange={() => setSortBy('price_low_high')} />
              <span className="radio-custom"></span> Price: Low to High
            </label>
            <label className="radio-label">
              <input type="radio" name="sortBy" checked={sortBy === 'price_high_low'} onChange={() => setSortBy('price_high_low')} />
              <span className="radio-custom"></span> Price: High to Low
            </label>
          </div>

          <div className="filter-section">
            <h4>Sharing Types</h4>
            {['Private', '2 Sharing', '3 Sharing', 'More than 3 Sharing'].map(type => (
              <label className="checkbox-label" key={type}>
                <input
                  type="checkbox"
                  checked={sharingTypes.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) setSharingTypes([...sharingTypes, type]);
                    else setSharingTypes(sharingTypes.filter(t => t !== type));
                  }}
                />
                <span className="checkbox-custom"></span> {type}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Gender</h4>
            {['Men', 'Women', 'Unisex'].map(g => (
              <label className="radio-label" key={g}>
                <input type="radio" name="genderFilter" checked={selectedGender === g} onChange={() => setSelectedGender(g)} />
                <span className="radio-custom"></span> {g}
              </label>
            ))}
          </div>

          <div className="filter-section">
            <h4>Price Range</h4>
            <input
              type="range"
              min="0" max="60000"
              step="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="price-slider"
            />
            <div className="price-inputs">
              <select className="price-select" value={priceRange[0]} onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}>
                <option value={0}>Rs. 0</option>
                <option value={5000}>Rs. 5000</option>
                <option value={10000}>Rs. 10000</option>
                <option value={15000}>Rs. 15000</option>
                <option value={20000}>Rs. 20000</option>
              </select>
              <span>-</span>
              <select className="price-select" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}>
                <option value={10000}>Rs. 10000</option>
                <option value={20000}>Rs. 20000</option>
                <option value={30000}>Rs. 30000</option>
                <option value={40000}>Rs. 40000</option>
                <option value={50000}>Rs. 50000</option>
                <option value={60000}>Rs. 60000</option>
              </select>
            </div>
          </div>

          <div className="filter-section">
            <h4>Amenities</h4>
            {['AC', 'Gym', 'Food', 'Fridge', 'Parking', 'Power Backup'].map(a => (
              <label className="checkbox-label" key={a}>
                <input
                  type="checkbox"
                  checked={selectedAmenities.includes(a)}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedAmenities([...selectedAmenities, a]);
                    else setSelectedAmenities(selectedAmenities.filter(item => item !== a));
                  }}
                />
                <span className="checkbox-custom"></span> {a}
              </label>
            ))}
          </div>

          <div className="filter-section border-0" style={{ paddingBottom: '2rem' }}>
            <h4>Locality</h4>
            <div className="locality-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" placeholder="Search Localities" value={searchLocality} onChange={e => setSearchLocality(e.target.value)} />
            </div>
            <div className="locality-list">
              {visibleLocalities.map(loc => (
                <label className="radio-label" key={loc}>
                  <input type="radio" name="localityFilterList" checked={searchLocality === loc} onChange={() => setSearchLocality(searchLocality === loc ? '' : loc)} onClick={(e) => {
                    // allows unchecking
                    if (searchLocality === loc) {
                      e.preventDefault();
                      setSearchLocality('');
                    }
                  }} />
                  <span className="radio-custom"></span> {loc}
                </label>
              ))}
              <div className="show-more" onClick={() => setIsLocalityExpanded(!isLocalityExpanded)}>
                {isLocalityExpanded ? 'Show less' : 'Show more'}
              </div>
            </div>
          </div>
        </aside>

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
