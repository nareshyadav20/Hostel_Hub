import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Search, SlidersHorizontal, Star, ShieldCheck, ChevronDown, RefreshCw } from 'lucide-react';
import SearchOverlay from '../components/SearchOverlay';
import './Landing.css';
import API from '../api/axios';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';

const EXPLORE_CACHE_KEY = 'hh_explore_buildings';
const EXPLORE_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

const getCachedBuildings = () => {
  try {
    const raw = localStorage.getItem(EXPLORE_CACHE_KEY);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts > EXPLORE_CACHE_TTL) { localStorage.removeItem(EXPLORE_CACHE_KEY); return null; }
    return data;
  } catch { return null; }
};

const setCachedBuildings = (data) => {
  try { localStorage.setItem(EXPLORE_CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch {}
};

const CITY_LOCALITIES = {
  hyderabad: ['Gachibowli', 'Gowlidoddy', 'HITEC City', 'Kondapur', 'KPHB', 'Madhapur', 'Manikonda', 'Miyapur'],
  bengaluru: ['Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield', 'Marathahalli', 'BTM Layout', 'Jayanagar', 'Hebbal'],
  mumbai: ['Andheri', 'Bandra', 'Powai', 'Worli', 'Thane', 'Dadar', 'Juhu', 'Borivali'],
  delhi: ['Connaught Place', 'Saket', 'Karol Bagh', 'Dwarka', 'Rajouri Garden', 'Vasant Kunj', 'Hauz Khas', 'Greater Kailash'],
  pune: ['Koregaon Park', 'Kothrud', 'Hinjewadi', 'Viman Nagar', 'Baner', 'Kalyani Nagar', 'Hadapsar', 'Wakad'],
  chennai: ['Adyar', 'Velachery', 'Anna Nagar', 'OMR', 'T-Nagar', 'Guindy', 'Mylapore', 'Nungambakkam']
};

const CITIES_LIST = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi', 'Pune', 'Chennai', 'Kolkata'];

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cityDropdownRef = useRef(null);

  const [selectedCity, setSelectedCity] = useState('Hyderabad');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('coliving');

  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [searchLocality, setSearchLocality] = useState('');
  const [searchProperty, setSearchProperty] = useState('');

  const [sortBy, setSortBy] = useState('');
  const [priceRange, setPriceRange] = useState([0, 60000]);
  // Pre-populate from cache so the UI never shows a blank spinner on revisit
  const [hostels, setHostels] = useState(() => getCachedBuildings() || []);
  const [loading, setLoading] = useState(() => !getCachedBuildings()); // only show spinner if no cache
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Parse URL parameters dynamically whenever navigation occurs (resolves HMR & updates not going to change)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    
    // Check both 'city' and 'location' params to support homepage search redirects
    const rawLocationInput = queryParams.get('city') || queryParams.get('location');
    if (rawLocationInput) {
      const lowerLoc = rawLocationInput.toLowerCase();
      // Verify if it matches a known city name or a typo variation
      const isKnownCity = CITIES_LIST.some(c => c.toLowerCase() === lowerLoc || (c.toLowerCase() === 'hyderabad' && lowerLoc === 'hydrabad'));
      
      if (isKnownCity) {
        const formattedCity = lowerLoc === 'hydrabad' || lowerLoc === 'hyderabad' ? 'Hyderabad' : rawLocationInput.charAt(0).toUpperCase() + rawLocationInput.slice(1).toLowerCase();
        setSelectedCity(formattedCity);
      } else {
        // If it's a neighborhood search, preserve the city as Hyderabad and filter the locality
        setSelectedCity('Hyderabad');
        setSearchLocality(rawLocationInput);
      }
    }
    
    const typeParam = queryParams.get('type') || queryParams.get('stayType') || queryParams.get('hostelType');
    if (typeParam) {
      const lowerType = typeParam.toLowerCase();
      if (lowerType.includes('student')) {
        setActiveTab('student');
      } else {
        setActiveTab('coliving');
      }
      
      if (lowerType.includes('men') || lowerType.includes('boy')) {
        setSelectedGender('Boys');
      } else if (lowerType.includes('women') || lowerType.includes('girl')) {
        setSelectedGender('Girls');
      }
    }
    
    const genderParam = queryParams.get('gender');
    if (genderParam) {
      const g = genderParam.charAt(0).toUpperCase() + genderParam.slice(1).toLowerCase();
      setSelectedGender(g === 'Men' || g === 'Boys' ? 'Boys' : g === 'Women' || g === 'Girls' ? 'Girls' : g);
    }

    const localityParam = queryParams.get('locality');
    if (localityParam) {
      setSearchLocality(localityParam);
    }

    const propertyParam = queryParams.get('property');
    if (propertyParam) {
      setSearchProperty(propertyParam);
    }
  }, [location.search]);

  const formatBuildings = (rawData) => {
    return rawData.map(b => {
      let city = b.locationCity || 'Hyderabad';
      if (city.toLowerCase() === 'hydrabad' || city.toLowerCase() === 'hyderabad') {
        city = 'Hyderabad';
      } else {
        city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
      }
      const address = b.address || b.location || 'Hyderabad';
      let locality = 'Hyderabad';
      const parenMatch = address.match(/\(([^)]+)\)/);
      if (parenMatch && parenMatch[1]) {
        locality = parenMatch[1].trim();
      } else {
        const firstPart = address.split(',')[0].trim();
        locality = firstPart.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
      return {
        id: b._id,
        city,
        name: b.name,
        locality,
        fullAddress: address,
        rating: b.rating || 4.5,
        price: b.startingPrice || 8000,
        img: b.images && b.images[0] ? ((b.images[0].startsWith('http') || b.images[0].startsWith('data:')) ? b.images[0] : `http://localhost:5000${b.images[0]}`) : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
        amenities: b.amenities && b.amenities.length > 0 ? b.amenities : ['Free WiFi', 'A/C', 'Mess'],
        gender: b.genderType || 'Unisex',
        category: b.category || 'Student'
      };
    });
  };

  const fetchHostels = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await API.get('/buildings/public');
      const formatted = formatBuildings(res.data);
      setCachedBuildings(formatted);
      setHostels(formatted);
    } catch (error) {
      console.error('Error fetching hostels:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    // If we have cached data, fetch silently in background (no spinner)
    const hasCached = getCachedBuildings() !== null;
    fetchHostels(hasCached); // silent=true if cache exists, false if first load

    // Real-time synchronization — silent refresh, no spinner flicker
    connectSocket();
    socket.on('hostelUpdated', () => {
      console.log('🔄 Explore page updating in real-time (silent)');
      fetchHostels(true); // always silent on socket events
    });

    return () => {
      socket.off('hostelUpdated');
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity, activeTab, selectedGender, selectedAmenities, searchLocality, searchProperty, sortBy, priceRange]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target)) {
        setIsCityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const resetAllFilters = () => {
    setSelectedGender('');
    setSelectedAmenities([]);
    setSearchLocality('');
    setSearchProperty('');
    setSortBy('');
    setPriceRange([0, 60000]);
    navigate('/explore');
  };

  // Compile available cities list
  const availableCities = CITIES_LIST;

  // Extract localities: Use actual db active localities for Hyderabad, fall back to default localities for other cities
  const uniqueLocalitiesOfSelectedCity = selectedCity.toLowerCase() === 'hyderabad'
    ? Array.from(new Set(hostels.filter(h => h.city.toLowerCase() === 'hyderabad').map(h => h.locality)))
    : CITY_LOCALITIES[selectedCity.toLowerCase()] || [];

  const filteredHostels = hostels.filter(h => {
    const matchesCity = h.city.toLowerCase() === selectedCity.toLowerCase();
    
    // Locality and Property searches
    const matchesLocality = searchLocality ? h.locality.toLowerCase().includes(searchLocality.toLowerCase()) : true;
    const matchesProperty = searchProperty ? h.name.toLowerCase().includes(searchProperty.toLowerCase()) : true;
    
    // Robust Gender match mapping (Men -> Boys, Women -> Girls, Unisex/Mixed)
    const matchesGender = selectedGender
      ? (
          h.gender.toLowerCase() === selectedGender.toLowerCase() ||
          h.gender.toLowerCase() === 'mixed' ||
          h.gender.toLowerCase() === 'unisex' ||
          (selectedGender.toLowerCase() === 'boys' && h.gender.toLowerCase() === 'men') ||
          (selectedGender.toLowerCase() === 'girls' && h.gender.toLowerCase() === 'women') ||
          (selectedGender.toLowerCase() === 'men' && h.gender.toLowerCase() === 'boys') ||
          (selectedGender.toLowerCase() === 'women' && h.gender.toLowerCase() === 'girls')
        )
      : true;

    // Advanced, partial-match, case-insensitive amenities mapping (AC/Gym/WiFi, etc.)
    const matchesAmenities = selectedAmenities.length > 0
      ? selectedAmenities.every(filterAmenity => {
          return h.amenities.some(item => {
            const it = item.toLowerCase();
            const fa = filterAmenity.toLowerCase();
            if (fa === 'ac' && (it.includes('ac') || it.includes('a/c') || it.includes('conditioning'))) return true;
            if (fa === 'wifi' && (it.includes('wifi') || it.includes('wi-fi') || it.includes('internet'))) return true;
            return it.includes(fa) || fa.includes(it);
          });
        })
      : true;

    // Tab category partition
    const matchesTab = activeTab === 'student'
      ? h.category.toLowerCase().includes('student')
      : !h.category.toLowerCase().includes('student');

    const matchesPrice = h.price >= priceRange[0] && h.price <= priceRange[1];

    return matchesCity && matchesLocality && matchesProperty && matchesGender && matchesAmenities && matchesTab && matchesPrice;
  });

  if (sortBy === 'price_low_high') {
    filteredHostels.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price_high_low') {
    filteredHostels.sort((a, b) => b.price - a.price);
  }

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHostels = filteredHostels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHostels.length / itemsPerPage);

  return (
    <div className={`landing-page ${isMobileFilterOpen ? 'filter-open' : ''}`}>
      

      {/* Hero Banner */}
      <section className="search-hero" style={{ position: 'relative' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 100, color: '#64748b', fontWeight: 'bold' }}
        >
          ✕
        </button>
        <span className="search-hero-eyebrow">Explore Stays</span>
        <h2 className="search-hero-title">
          Perfect Stays In{' '}
          <span 
            className="city-highlight-dropdown" 
            ref={cityDropdownRef}
            onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
          >
            {selectedCity} <ChevronDown size={28} className="city-chevron" />
            
            {isCityDropdownOpen && (
              <div className="hero-city-dropdown">
                {availableCities.map(city => (
                  <div 
                    key={city} 
                    className="hero-city-option"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCity(city);
                      setSearchLocality(''); // Clear locality filter on city switch
                      setIsCityDropdownOpen(false);
                      navigate(`/explore?city=${city.toLowerCase()}`);
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </span>
        </h2>
        <p className="search-hero-subtitle">Discover premium verified hostels and co-living spaces designed for absolute comfort.</p>

        <div className="search-trigger-pill" onClick={() => setIsSearchOverlayOpen(true)}>
          <div className="search-pill-icon"><Search size={18} /></div>
          <span className="search-pill-text">Search for localities, offices, or properties...</span>
        </div>
      </section>

      {/* Mobile Filter Sticky Bar */}
      <div className="mobile-filter-bar">
        <button className="btn-mobile-filter" onClick={() => setIsMobileFilterOpen(true)}>
          <SlidersHorizontal size={16} /> Filters
        </button>
        <div className="filter-summary">
          {selectedGender && <span className="summary-chip">{selectedGender}</span>}
          {activeTab === 'student' && <span className="summary-chip">Student</span>}
          {selectedAmenities.length > 0 && <span className="summary-chip">{selectedAmenities.length} Amenities</span>}
        </div>
      </div>

      <div className="landing-container split-layout">
        
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="sidebar-header">
            <h3>Filters</h3>
            <button className="reset-all-btn" onClick={resetAllFilters}>
              <RefreshCw size={12} /> Reset All
            </button>
          </div>

          <div className="filter-section">
            <h4>Stay Type</h4>
            <label className="radio-label">
              <input type="radio" name="stayType" checked={activeTab === 'coliving'} onChange={() => setActiveTab('coliving')} />
              <span className="radio-custom"></span> Co-living
            </label>
            <label className="radio-label">
              <input type="radio" name="stayType" checked={activeTab === 'student'} onChange={() => setActiveTab('student')} />
              <span className="radio-custom"></span> Student Stays
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
            <h4>Gender Preferred</h4>
            {['Boys', 'Girls', 'Mixed'].map(g => (
              <label className="radio-label" key={g}>
                <input type="radio" name="genderFilter" checked={selectedGender === g} onChange={() => setSelectedGender(g)} />
                <span className="radio-custom"></span> {g}
              </label>
            ))}
            {selectedGender && (
              <div style={{ marginTop: '8px' }}>
                <span 
                  onClick={() => setSelectedGender('')} 
                  style={{ fontSize: '11px', color: '#5B5BD6', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
                >
                  Clear gender filter
                </span>
              </div>
            )}
          </div>

          <div className="filter-section">
            <h4>Price Limit</h4>
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
                <option value={0}>₹0</option>
                <option value={5000}>₹5,000</option>
                <option value={10000}>₹10,000</option>
                <option value={15000}>₹15,000</option>
              </select>
              <span>–</span>
              <select className="price-select" value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}>
                <option value={10000}>₹10,000</option>
                <option value={20000}>₹20,000</option>
                <option value={30000}>₹30,000</option>
                <option value={40000}>₹40,000</option>
                <option value={50000}>₹50,000</option>
                <option value={60000}>₹60,000</option>
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

          <div className="filter-section border-0">
            <h4>Popular Localities in {selectedCity}</h4>
            <div className="locality-list">
              {uniqueLocalitiesOfSelectedCity.map(loc => (
                <label className="radio-label" key={loc}>
                  <input type="radio" name="localityFilter" checked={searchLocality === loc} onChange={() => setSearchLocality(searchLocality === loc ? '' : loc)} onClick={(e) => {
                    if (searchLocality === loc) {
                      e.preventDefault();
                      setSearchLocality('');
                    }
                  }} />
                  <span className="radio-custom"></span> {loc}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Properties Grid */}
        <main className="hostels-main-view">
        {loading ? (
            <div className="explore-loading-wrap">
              <span className="explore-spinner"></span>
              <p>Curating best properties for you...</p>
            </div>
          ) : filteredHostels.length > 0 ? (
            <>
              <div className="hostels-grid">
                {currentHostels.map((hostel, index) => (
                  <div key={hostel.id} className="hostel-card-v flex-in-up" style={{ animationDelay: `${0.05 * index}s` }}>
                    <div className="card-img-box-v" onClick={() => navigate(`/listing/${hostel.id}`)}>
                      <img src={hostel.img} alt={hostel.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'; }} />
                      <div className="rating-pill">
                        <Star size={12} fill="#F59E0B" color="#F59E0B" />
                        <span>{hostel.rating.toFixed(1)}</span>
                      </div>
                      <span className="gender-tag">{hostel.gender}</span>
                    </div>
                    
                    <div className="card-details-v">
                      <span className="card-locality-v">📍 {hostel.locality}</span>
                      <h3 className="card-title-v" onClick={() => navigate(`/listing/${hostel.id}`)}>{hostel.name}</h3>
                      
                      <div className="card-amenities-row">
                        {hostel.amenities.slice(0, 3).map((a, i) => (
                          <span key={i} className="amenity-chip-v">{a}</span>
                        ))}
                      </div>

                      <div className="card-footer-v">
                        <div className="price-display-v">
                          <strong>₹{hostel.price.toLocaleString()}</strong>
                          <span>/mo</span>
                        </div>
                        <button className="details-action-btn" onClick={() => navigate(`/listing/${hostel.id}`)}>
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination UI */}
              {totalPages > 1 && (
                <div className="pagination-wrapper">
                  <button 
                    className="pagi-btn" 
                    disabled={currentPage === 1} 
                    onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    Previous
                  </button>
                  <div className="pagi-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                      <button 
                        key={num} 
                        className={`pagi-num ${currentPage === num ? 'active' : ''}`}
                        onClick={() => { setCurrentPage(num); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <button 
                    className="pagi-btn" 
                    disabled={currentPage === totalPages} 
                    onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="explore-empty-wrap">
              <ShieldCheck size={48} color="#94a3b8" />
              <h3>No Properties Found</h3>
              <p>Try adjusting your search filters or price limits for {selectedCity}.</p>
              <button className="clear-filters-btn" onClick={resetAllFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </main>

      </div>

      <SearchOverlay
        isOpen={isSearchOverlayOpen}
        onClose={() => setIsSearchOverlayOpen(false)}
        initialCity={selectedCity}
        availableCities={availableCities}
        availableLocalities={uniqueLocalitiesOfSelectedCity}
        onSearch={({ selectedCity: city, activeTab: tab, selectedGender: gender, selectedAmenities: amenities, searchLocality: locality, searchProperty: property }) => {
          setSelectedCity(city);
          setActiveTab(tab);
          setSelectedGender(gender);
          setSelectedAmenities(amenities);
          setSearchLocality(locality);
          setSearchProperty(property || '');
          navigate(`/explore?city=${city.toLowerCase()}&locality=${locality}&gender=${gender}`);
        }}
      />


    </div>
  );
};

export default Landing;
