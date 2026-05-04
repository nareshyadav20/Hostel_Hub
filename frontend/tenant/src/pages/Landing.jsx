import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import SearchOverlay from '../components/SearchOverlay';
import './Landing.css';
import API from '../api/axios';
import { MOCK_HOSTELS } from '../utils/mockData';

// Import images
import studentImg from '../assets/student_cat.png';
import professionalImg from '../assets/professional_cat.png';
import heroBg from '../assets/hero_bg.png';

const Landing = () => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('coliving');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [searchLocality, setSearchLocality] = useState('');
  const [searchProperty, setSearchProperty] = useState('');
  const [isLocalityExpanded, setIsLocalityExpanded] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [sharingTypes, setSharingTypes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 60000]);



  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await API.get('/buildings');
        const data = response.data;
        const mapped = data.map(h => ({
          id: h._id,
          city: h.locationCity || 'Bengaluru',
          name: h.name,
          locality: h.address,
          rating: h.rating || 4.5,
          price: h.startingPrice || 8000,
          img: h.images?.[0] || heroBg,
          amenities: h.amenities || [],
          gender: h.genderType || 'Mixed',
          category: h.category || 'Professional'
        }));
        
        // Combine real data with mock data as fallback
        setHostels([...mapped, ...MOCK_HOSTELS.map(h => ({
          ...h,
          img: h.img || heroBg // Ensure heroBg fallback
        }))]);
      } catch (err) {
        console.error('Error fetching hostels:', err);
        setHostels(MOCK_HOSTELS);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  let filteredHostels = hostels.filter(h => {
    const matchesCity = h.city.toLowerCase() === selectedCity.toLowerCase();
    const matchesLocality = searchLocality ? h.locality.toLowerCase().includes(searchLocality.toLowerCase()) : true;
    const matchesProperty = searchProperty ? h.name.toLowerCase().includes(searchProperty.toLowerCase()) : true;
    const matchesGender = selectedGender ? (h.gender === selectedGender || h.gender === 'Unisex') : true;
    const matchesAmenities = selectedAmenities.length > 0 ? selectedAmenities.every(a => h.amenities.includes(a)) : true;
    const matchesTab = activeTab === 'student' ? h.category.toLowerCase() === 'student' : true;
    const matchesPrice = h.price >= priceRange[0] && h.price <= priceRange[1];
    return matchesCity && matchesLocality && matchesProperty && matchesGender && matchesAmenities && matchesTab && matchesPrice;
  });

  if (sortBy === 'price_low_high') {
    filteredHostels.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high_low') {
    filteredHostels.sort((a, b) => b.price - a.price);
  }

  const allLocalities = ['Gachibowli', 'Gopanpally Gachibowli', 'Gowlidoddy', 'HITEC City', 'Journalist colony', 'KOKAPET', 'Kondapur', 'KPHB', 'Kukatpally', 'Lanco Hills Manikonda', 'Madhapur', 'Manikonda', 'Miyapur', 'Serilingampally'];
  const visibleLocalities = isLocalityExpanded ? allLocalities : allLocalities.slice(0, 8);


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

      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
        initialCity={selectedCity}
        onSearch={({ selectedCity: city, activeTab: tab, selectedGender: gender, selectedAmenities: amenities, searchLocality: locality, searchProperty: property }) => {
          setSelectedCity(city);
          setActiveTab(tab);
          setSelectedGender(gender);
          setSelectedAmenities(amenities);
          setSearchLocality(locality);
          setSearchProperty(property || '');
        }}
      />

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
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: '#00b0f0', fontWeight: '800' }}>
              Finding the best stays for you...
            </div>
          ) : filteredHostels.length > 0 ? (
            filteredHostels.map((hostel, index) => (
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
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: '#64748B' }}>
              No properties found in this area.
            </div>
          )}
        </main>
      </div>

      <footer className="landing-footer-minimal">
        <p>© 2026 Livora Private Limited. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
