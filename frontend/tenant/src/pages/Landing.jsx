import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ShieldCheck, ChevronDown, RefreshCw } from 'lucide-react';

import './Landing.css';
import API from '../api/axios';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';

const EXPLORE_CACHE_KEY = 'hh_explore_buildings_v2';
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
  try { localStorage.setItem(EXPLORE_CACHE_KEY, JSON.stringify({ data, ts: Date.now() })); } catch { }
};

const CITY_LOCALITIES = {
  hyderabad: [
    'Gachibowli', 'Gopanpally Gachibowli', 'Gowlidoddy', 'HITEC City',
    'Journalist colony', 'KOKAPET', 'Kondapur', 'KPHB', 'Kukatpally',
    'Lanco Hills Manikonda', 'Madhapur', 'Manikonda', 'Miyapur', 'Serilingampally'
  ],
  bengaluru: ['Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield', 'Marathahalli', 'BTM Layout', 'Jayanagar', 'Hebbal'],
  mumbai: ['Andheri', 'Bandra', 'Powai', 'Worli', 'Thane', 'Dadar', 'Juhu', 'Borivali'],
  delhi: ['Connaught Place', 'Saket', 'Karol Bagh', 'Dwarka', 'Rajouri Garden', 'Vasant Kunj', 'Hauz Khas', 'Greater Kailash'],
  pune: ['Koregaon Park', 'Kothrud', 'Hinjewadi', 'Viman Nagar', 'Baner', 'Kalyani Nagar', 'Hadapsar', 'Wakad'],
  chennai: ['Adyar', 'Velachery', 'Anna Nagar', 'OMR', 'T-Nagar', 'Guindy', 'Mylapore', 'Nungambakkam']
};

const CITIES_LIST = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Chennai', 'Delhi', 'Pune', 'Noida', 'Gurgaon'];

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cityDropdownRef = useRef(null);

  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [searchLocality, setSearchLocality] = useState('');
  const [searchProperty, setSearchProperty] = useState('');
  const [hostelType, setHostelType] = useState('');
  const [sharing, setSharing] = useState('');

  const [sortBy, setSortBy] = useState('');
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(60000);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
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

    const typeParam = queryParams.get('type');
    if (typeParam) {
      setActiveTab(typeParam);
    }

    const hostelTypeParam = queryParams.get('hostelType');
    if (hostelTypeParam) {
      setHostelType(hostelTypeParam);
    }

    const stayTypeParam = queryParams.get('stayType');
    if (stayTypeParam) {
      setSharing(stayTypeParam);
    }

    const localityParam = queryParams.get('locality');
    if (localityParam) {
      setSearchLocality(localityParam);
    }

    const propertyParam = queryParams.get('property');
    if (propertyParam) {
      setSearchProperty(propertyParam);
    }

    const budgetParam = queryParams.get('budget');
    if (budgetParam) {
      if (budgetParam.includes('Under')) { setBudgetMin(0); setBudgetMax(8000); }
      else if (budgetParam.includes('8k') && budgetParam.includes('12k')) { setBudgetMin(8000); setBudgetMax(12000); }
      else if (budgetParam.includes('12k') && budgetParam.includes('18k')) { setBudgetMin(12000); setBudgetMax(18000); }
      else if (budgetParam.includes('Above')) { setBudgetMin(18000); setBudgetMax(60000); }
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
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = getCachedBuildings();
    if (cached) {
      setHostels(cached);
      setLoading(false);
      fetchHostels(true); // background refresh
    } else {
      fetchHostels(false); // foreground fetch
    }

    // Real-time synchronization — silent refresh, no spinner flicker
    connectSocket();
    socket.on('hostelUpdated', () => {
      console.log('🔄 Explore page updating in real-time (silent)');
      fetchHostels(true); // always silent on socket events
    });

    return () => {
      socket.off('hostelUpdated');
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity, activeTab, selectedAmenities, searchLocality, searchProperty, hostelType, sharing, sortBy, budgetMin, budgetMax]);

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
    setSelectedAmenities([]);
    setSearchLocality('');
    setSearchProperty('');
    setHostelType('');
    setSharing('');
    setSortBy('');
    setBudgetMin(0);
    setBudgetMax(60000);
    navigate('/explore');
  };

  // Compile available cities list dynamically from the fetched properties
  const dynamicCities = Array.from(new Set(hostels.map(h => {
    let c = h.city || 'Hyderabad';
    return (c.toLowerCase() === 'hydrabad' || c.toLowerCase() === 'hyderabad')
      ? 'Hyderabad'
      : c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();
  })));
  // ALWAYS show the default cities, plus any new ones found in the database
  const availableCities = Array.from(new Set(['All Cities', ...CITIES_LIST, ...dynamicCities]));

  // Extract localities: Use actual db active localities for the selected city
  const dynamicLocalities = Array.from(new Set(
    hostels.filter(h => selectedCity === 'All Cities' || h.city.toLowerCase() === selectedCity.toLowerCase() ||
      (selectedCity.toLowerCase() === 'hyderabad' && h.city.toLowerCase() === 'hydrabad'))
      .map(h => h.locality)
  ));

  // ONLY show localities for the selected city that actually have properties in the database
  const uniqueLocalitiesOfSelectedCity = dynamicLocalities;

  const filteredHostels = hostels.filter(h => {
    try {
      if (selectedCity !== 'All Cities' && h.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      if (searchLocality && h.locality && !h.locality.toLowerCase().includes(searchLocality.toLowerCase())) return false;
      if (searchProperty && h.name && !h.name.toLowerCase().includes(searchProperty.toLowerCase())) return false;
      
      // Temporary bypass of other strict filters to ensure properties load
      return true;
    } catch (e) {
      console.error('Filter error on hostel:', h, e);
      return true; // fail open
    }
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

        <div className="search-trigger-pill" style={{ cursor: 'text' }}>
          <div className="search-pill-icon"><Search size={18} /></div>
          <input
            type="text"
            className="search-pill-text"
            placeholder="Type a city, locality or property name..."
            value={searchLocality}
            onChange={(e) => setSearchLocality(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              font: 'inherit',
              color: 'inherit',
              width: '100%',
              cursor: 'text'
            }}
          />
          {searchLocality && (
            <button
              onClick={() => setSearchLocality('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94a3b8',
                fontSize: '1.1rem',
                padding: '0 0.5rem',
                lineHeight: 1
              }}
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* Mobile Filter Sticky Bar */}
      <div className="mobile-filter-bar">
        <button className="btn-mobile-filter" onClick={() => setIsMobileFilterOpen(true)}>
          <SlidersHorizontal size={16} /> Filters
        </button>
        <div className="filter-summary">
          {hostelType && <span className="summary-chip">{hostelType}</span>}
          {sharing && <span className="summary-chip">{sharing}</span>}
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

          {/* Budget */}
          <div className="filter-section">
            <h4>Monthly Budget</h4>
            <div className="budget-filter-list">
              {[
                { label: 'Any Budget', min: 0, max: 60000 },
                { label: 'Under ₹8k', min: 0, max: 8000 },
                { label: '₹8k – ₹12k', min: 8000, max: 12000 },
                { label: '₹12k – ₹18k', min: 12000, max: 18000 },
                { label: 'Above ₹18k', min: 18000, max: 60000 },
              ].map(opt => (
                <label className="radio-label" key={opt.label}>
                  <input
                    type="radio"
                    name="budget"
                    checked={budgetMin === opt.min && budgetMax === opt.max}
                    onChange={() => { setBudgetMin(opt.min); setBudgetMax(opt.max); }}
                  />
                  <span className="radio-custom"></span> {opt.label}
                </label>
              ))}
            </div>
          </div>

          {/* Hostel Type */}
          <div className="filter-section">
            <h4>Hostel Type</h4>
            <div className="explore-pill-group">
              {["Any Hostel", "Men's", "Women's", 'Co-living'].map(t => (
                <button
                  key={t}
                  className={`explore-pill-btn ${(hostelType === t) || (!hostelType && t === 'Any Hostel') ? 'active' : ''}`}
                  onClick={() => setHostelType(t === 'Any Hostel' ? '' : t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Sharing */}
          <div className="filter-section">
            <h4>Sharing Type</h4>
            <div className="explore-sharing-grid">
              {['No Pref', 'Single', '2 Sharing', '3 Sharing', '4 Sharing', '5 Sharing', '6 Sharing', 'Dormitory', 'Other'].map(opt => (
                <button
                  key={opt}
                  className={`explore-sharing-btn ${(sharing === opt) || (!sharing && opt === 'No Pref') ? 'active' : ''}`}
                  onClick={() => setSharing(opt === 'No Pref' ? '' : opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
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

          {/* Localities */}
          <div className="filter-section border-0">
            <h4>Localities in {selectedCity}</h4>
            <div className="locality-list">
              {dynamicLocalities.map(loc => (
                <label className="radio-label" key={loc}>
                  <input type="radio" name="localityFilter" checked={searchLocality === loc}
                    onChange={() => setSearchLocality(searchLocality === loc ? '' : loc)}
                    onClick={(e) => { if (searchLocality === loc) { e.preventDefault(); setSearchLocality(''); } }}
                  />
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
                    <div className="card-img-box-v" onClick={() => {
                        const params = new URLSearchParams();
                        if (selectedAmenities.length > 0) params.append('amenities', selectedAmenities.join(','));
                        if (sharing) params.append('sharing', sharing);
                        navigate(`/listing/${hostel.id}?${params.toString()}`);
                    }}>
                      <img src={hostel.img} alt={hostel.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'; }} />
                      <div className="rating-pill">
                        <Star size={12} fill="#F59E0B" color="#F59E0B" />
                        <span>{hostel.rating.toFixed(1)}</span>
                      </div>
                      <span className="gender-tag">{hostel.gender}</span>
                    </div>

                    <div className="card-details-v">
                      <span className="card-locality-v">📍 {hostel.locality}</span>
                      <h3 className="card-title-v" onClick={() => {
                        const params = new URLSearchParams();
                        if (selectedAmenities.length > 0) params.append('amenities', selectedAmenities.join(','));
                        if (sharing) params.append('sharing', sharing);
                        navigate(`/listing/${hostel.id}?${params.toString()}`);
                      }}>{hostel.name}</h3>

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
                        <button className="details-action-btn" onClick={() => {
                            const params = new URLSearchParams();
                            if (selectedAmenities.length > 0) params.append('amenities', selectedAmenities.join(','));
                            if (sharing) params.append('sharing', sharing);
                            navigate(`/listing/${hostel.id}?${params.toString()}`);
                        }}>
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




    </div>
  );
};

export default Landing;
