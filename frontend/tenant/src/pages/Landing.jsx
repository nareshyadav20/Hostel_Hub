import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ShieldCheck, RefreshCw, MapPin, X, ChevronRight, ChevronDown } from 'lucide-react';

import './Landing.css';
import API from '../api/axios';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';

const EXPLORE_CACHE_KEY = 'hh_explore_buildings_v3';
const EXPLORE_CACHE_TTL = 3 * 60 * 1000;

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
  hyderabad: ['Gachibowli', 'Gopanpally', 'HITEC City', 'Kondapur', 'KPHB', 'Kukatpally', 'Madhapur', 'Manikonda', 'Miyapur', 'Serilingampally'],
  bengaluru: ['Koramangala', 'HSR Layout', 'Indiranagar', 'Whitefield', 'Marathahalli', 'BTM Layout', 'Jayanagar', 'Hebbal'],
  mumbai: ['Andheri', 'Bandra', 'Powai', 'Worli', 'Thane', 'Dadar', 'Juhu', 'Borivali'],
  delhi: ['Connaught Place', 'Saket', 'Karol Bagh', 'Dwarka', 'Rajouri Garden', 'Vasant Kunj', 'Hauz Khas', 'Greater Kailash'],
  pune: ['Koregaon Park', 'Kothrud', 'Hinjewadi', 'Viman Nagar', 'Baner', 'Kalyani Nagar', 'Hadapsar', 'Wakad'],
  chennai: ['Adyar', 'Velachery', 'Anna Nagar', 'OMR', 'T-Nagar', 'Guindy', 'Mylapore', 'Nungambakkam'],
  noida: ['Sector 18', 'Sector 62', 'Sector 137', 'Greater Noida', 'Sector 50'],
  gurgaon: ['DLF Phase 1', 'Cyber City', 'Sohna Road', 'MG Road', 'Golf Course Road'],
};

const CITIES_LIST = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Chennai', 'Delhi', 'Pune', 'Noida', 'Gurgaon'];

const Landing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cityDropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [searchLocality, setSearchLocality] = useState('');
  const [hostelType, setHostelType] = useState('');
  const [sharing, setSharing] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(60000);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Parse URL parameters — reset all filters first, then apply only what's in the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    // Reset all filters first so switching categories doesn't carry over old filters
    setSelectedCity('All Cities');
    setSelectedAmenities([]);
    setSearchLocality('');
    setHostelType('');
    setSharing('');
    setSortBy('');
    setBudgetMin(0);
    setBudgetMax(60000);

    const rawLocationInput = queryParams.get('city') || queryParams.get('location');
    if (rawLocationInput) {
      const lowerLoc = rawLocationInput.toLowerCase();
      const isKnownCity = CITIES_LIST.some(c => c.toLowerCase() === lowerLoc);
      if (isKnownCity) {
        setSelectedCity(rawLocationInput.charAt(0).toUpperCase() + rawLocationInput.slice(1).toLowerCase());
      } else {
        setSelectedCity('Hyderabad');
        setSearchLocality(rawLocationInput);
      }
    }
    const typeParam = queryParams.get('hostelType');
    if (typeParam) setHostelType(typeParam);
    const catParam = queryParams.get('category');
    if (catParam) setHostelType(catParam === 'Luxury' ? 'Premium' : catParam);
    const stayTypeParam = queryParams.get('stayType');
    if (stayTypeParam) setSharing(stayTypeParam);
    const localityParam = queryParams.get('locality');
    if (localityParam) setSearchLocality(localityParam);
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
      let locality = 'Central Hub';
      const parenMatch = address.match(/\(([^)]+)\)/);
      if (parenMatch && parenMatch[1]) {
        locality = parenMatch[1].trim();
      } else {
        const firstPart = address.split(',')[0].trim();
        locality = firstPart.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }

      let lowestSharingLabel = 'Sharing';
      const rents = [
        { val: b.rentSingle, label: 'Single Room' },
        { val: b.rentDouble, label: '2 Sharing' },
        { val: b.rentTriple, label: '3 Sharing' },
        { val: b.rent4Sharing, label: '4 Sharing' },
        { val: b.rent5Sharing, label: '5 Sharing' },
        { val: b.rent6Sharing, label: '6 Sharing' },
      ].filter(r => r.val > 0);

      let has1 = (b.rentSingle || 0) > 0;
      let has2 = (b.rentDouble || 0) > 0;
      let has3 = (b.rentTriple || 0) > 0;
      let has4 = (b.rent4Sharing || 0) > 0;
      let has5 = (b.rent5Sharing || 0) > 0;
      let has6 = (b.rent6Sharing || 0) > 0;

      if (rents.length > 0) {
        const minRent = rents.reduce((prev, curr) => prev.val < curr.val ? prev : curr);
        lowestSharingLabel = minRent.label;
        b.startingPrice = minRent.val;
      } else {
        if (b.startingPrice >= 12000) { lowestSharingLabel = 'Single Room'; has1 = true; }
        else if (b.startingPrice >= 10000) { lowestSharingLabel = '2 Sharing'; has2 = true; }
        else if (b.startingPrice >= 8000) { lowestSharingLabel = '3 Sharing'; has3 = true; }
        else if (b.startingPrice >= 7000) { lowestSharingLabel = '4 Sharing'; has4 = true; }
        else { lowestSharingLabel = '5 Sharing'; has5 = true; }
      }

      return {
        id: b._id,
        city,
        name: b.name,
        locality,
        fullAddress: address,
        rating: b.rating || 4.5,
        price: b.startingPrice || 8000,
        sharingLabel: lowestSharingLabel,
        img: b.images && b.images[0] ? ((b.images[0].startsWith('http') || b.images[0].startsWith('data:')) ? b.images[0] : `http://localhost:5000${b.images[0]}`) : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
        amenities: b.amenities && b.amenities.length > 0 ? b.amenities : ['WiFi', 'AC', 'Food/Mess'],
        gender: (b.genderType && !['mixed', 'unisex'].includes(b.genderType.toLowerCase())) ? b.genderType : 'Coliving',
        category: b.category || '',
        hasSingle: has1,
        hasDouble: has2,
        hasTriple: has3,
        has4: has4,
        has5: has5,
        has6: has6
      };
    });
  };

  const unwrapBuildingsArray = (raw) => {
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') {
      for (const key of ['buildings', 'data', 'results', 'items', 'records']) {
        if (Array.isArray(raw[key])) return raw[key];
      }
    }
    return [];
  };

  const fetchHostels = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await API.get('/buildings/public?limit=200');
      // Backend may return paginated { success, data, pagination } or a plain array
      const rawData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      const formatted = formatBuildings(rawData);
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
      fetchHostels(true);
    } else {
      fetchHostels(false);
    }
    connectSocket();
    socket.on('hostelUpdated', () => fetchHostels(true));
    return () => { socket.off('hostelUpdated'); };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity, selectedAmenities, searchLocality, hostelType, sharing, sortBy, budgetMin, budgetMax]);

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
    setHostelType('');
    setSharing('');
    setSortBy('');
    setBudgetMin(0);
    setBudgetMax(60000);
    setSelectedCity('All Cities');
    navigate('/explore');
  };

  // Dynamic cities from DB
  const dynamicCities = Array.from(new Set(hostels.map(h => h.city)));
  const availableCities = Array.from(new Set(['All Cities', ...CITIES_LIST, ...dynamicCities]));

  // Localities: ONLY DB localities for selected city
  const uniqueLocalities = Array.from(new Set(
    hostels
      .filter(h => selectedCity === 'All Cities' || h.city.toLowerCase() === selectedCity.toLowerCase())
      .map(h => h.locality)
      .filter(Boolean)
  )).sort();

  // Filtering
  const filteredHostels = hostels.filter(h => {
    try {
      let bypassCityFilter = false;

      if (searchLocality) {
        const query = searchLocality.toLowerCase();
        const matchesCity = h.city && h.city.toLowerCase().includes(query);
        const matchesLocality = h.locality && h.locality.toLowerCase().includes(query);
        const matchesName = h.name && h.name.toLowerCase().includes(query);

        if (!matchesCity && !matchesLocality && !matchesName) return false;
        if (matchesCity) bypassCityFilter = true;
      }

      if (selectedCity !== 'All Cities' && !bypassCityFilter) {
        if (h.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
      }

      // Budget
      if (budgetMin > 0 && h.price < budgetMin) return false;
      if (budgetMax < 60000 && h.price > budgetMax) return false;

      // Hostel Type (Gender + Category combined)
      if (hostelType && hostelType !== 'Any') {
        const typeStr = hostelType.toLowerCase();
        const genderStr = (h.gender || '').toLowerCase();
        const catStr = (h.category || '').toLowerCase();
        if (typeStr === "men's" && !['boys', 'male', 'men', "men's"].includes(genderStr)) return false;
        if (typeStr === "women's" && !['girls', 'female', 'women', "women's"].includes(genderStr)) return false;
        if (typeStr === "co-living" && !['unisex', 'co-living', 'coliving', 'both'].includes(genderStr)) return false;
        if (typeStr === 'premium' && catStr !== 'luxury') return false;
        if (typeStr === 'student' && catStr !== 'student') return false;
      }

      // Sharing
      if (sharing && sharing !== 'Any') {
        if (sharing === 'Single' && !h.hasSingle) return false;
        if (sharing === '2' && !h.hasDouble) return false;
        if (sharing === '3' && !h.hasTriple) return false;
        if (sharing === '4' && !h.has4) return false;
        if (sharing === '5' && !h.has5) return false;
        if (sharing === '6' && !h.has6) return false;
      }

      // Amenities
      if (selectedAmenities && selectedAmenities.length > 0) {
        const hasAll = selectedAmenities.every(a => {
          if (!h.amenities) return false;
          const aLower = a.toLowerCase();
          return h.amenities.some(ha => {
            const haLower = ha.toLowerCase();
            if (haLower.includes(aLower)) return true;
            if (aLower === 'ac' && (haLower.includes('a/c') || haLower.includes('air condition'))) return true;
            if (aLower === 'food/mess' && (haLower.includes('food') || haLower.includes('mess') || haLower.includes('meal'))) return true;
            if (aLower === 'wifi' && (haLower.includes('wi-fi') || haLower.includes('internet'))) return true;
            if (aLower === 'power backup' && (haLower.includes('power') || haLower.includes('generator') || haLower.includes('backup'))) return true;
            return false;
          });
        });
        if (!hasAll) return false;
      }

      return true;
    } catch { return true; }
  });

  if (sortBy === 'price_low_high') filteredHostels.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price_high_low') filteredHostels.sort((a, b) => b.price - a.price);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentHostels = filteredHostels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHostels.length / itemsPerPage);

  const activeFilterCount = [
    hostelType, sharing, searchLocality,
    selectedAmenities.length > 0 ? 'a' : '',
    (budgetMin > 0 || budgetMax < 60000) ? 'b' : ''
  ].filter(Boolean).length;

  const goToListing = (hostelId) => {
    const params = new URLSearchParams();
    if (selectedAmenities.length > 0) params.append('amenities', selectedAmenities.join(','));
    if (sharing) params.append('sharing', sharing);
    navigate(`/listing/${hostelId}?${params.toString()}`);
  };

  const genderColor = (g) => {
    if (!g) return '#64748b';
    const lower = g.toLowerCase();
    if (lower === 'boys' || lower === "men's" || lower === 'male') return '#3B82F6';
    if (lower === 'girls' || lower === "women's" || lower === 'female') return '#EC4899';
    return '#8B5CF6';
  };

  return (
    <div className="exp-root">
      {/* ── HERO STRIP ── */}
      <div className="exp-hero">
        <div className="exp-hero-inner">
          <div className="exp-hero-text">
            <h1 className="exp-hero-title">
              Find Your Perfect Room in{' '}
              <span className="exp-city-trigger" ref={cityDropdownRef} onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}>
                {selectedCity}
                <ChevronDown size={20} className={`exp-city-chevron ${isCityDropdownOpen ? 'open' : ''}`} />
                {isCityDropdownOpen && (
                  <div className="exp-city-dropdown">
                    {availableCities.map(city => (
                      <div
                        key={city}
                        className={`exp-city-option ${selectedCity === city ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCity(city);
                          setSearchLocality('');
                          setIsCityDropdownOpen(false);
                          navigate(`/explore?city=${city.toLowerCase()}`);
                        }}
                      >
                        {city !== 'All Cities' && <MapPin size={14} />} {city}
                      </div>
                    ))}
                  </div>
                )}
              </span>
            </h1>
          </div>

          <div className="exp-search-bar">
            <Search size={18} className="exp-search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by locality or property name..."
              value={searchLocality}
              onChange={(e) => setSearchLocality(e.target.value)}
              className="exp-search-input"
            />
            {searchLocality && (
              <button className="exp-search-clear" onClick={() => setSearchLocality('')}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER BAR ── */}
      <div className="exp-mobile-bar">
        <button className="exp-mobile-filter-btn" onClick={() => setIsMobileFilterOpen(true)}>
          <SlidersHorizontal size={16} />
          Filters
          {activeFilterCount > 0 && <span className="exp-filter-badge">{activeFilterCount}</span>}
        </button>
        <div className="exp-mobile-chips">
          {hostelType && <span className="exp-chip">{hostelType} <X size={10} onClick={() => setHostelType('')} /></span>}
          {sharing && <span className="exp-chip">{sharing} Sharing <X size={10} onClick={() => setSharing('')} /></span>}
          {searchLocality && <span className="exp-chip">{searchLocality} <X size={10} onClick={() => setSearchLocality('')} /></span>}
        </div>
        <select className="exp-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="">Sort: Relevance</option>
          <option value="price_low_high">Price: Low to High</option>
          <option value="price_high_low">Price: High to Low</option>
        </select>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="exp-layout">

        {/* ── SIDEBAR FILTERS ── */}
        <aside className={`exp-sidebar ${isMobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="exp-sidebar-head">
            <div className="exp-sidebar-title">
              <SlidersHorizontal size={16} />
              <span>Filters</span>
              {activeFilterCount > 0 && <span className="exp-filter-badge">{activeFilterCount}</span>}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button className="exp-reset-btn" onClick={resetAllFilters}>
                <RefreshCw size={12} /> Reset
              </button>
              <button className="exp-sidebar-close-mobile" onClick={() => setIsMobileFilterOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Filter scroll area */}
          <div className="exp-sidebar-scroll">

            {/* Location — cities */}
            <div className="exp-filter-block">
              <h4 className="exp-filter-label">Location</h4>
              <select
                className="exp-select"
                value={selectedCity}
                onChange={e => {
                  const city = e.target.value;
                  setSelectedCity(city);
                  setSearchLocality('');
                  navigate(`/explore${city === 'All Cities' ? '' : `?city=${city.toLowerCase()}`}`);
                }}
              >
                {['All Cities', ...CITIES_LIST].map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Localities — dynamic from selected city */}
            {uniqueLocalities.length > 0 && (
              <div className="exp-filter-block">
                <h4 className="exp-filter-label">
                  Localities in {selectedCity}
                </h4>
                <select
                  className="exp-select"
                  value={searchLocality}
                  onChange={e => setSearchLocality(e.target.value)}
                >
                  <option value="">All Localities</option>
                  {uniqueLocalities.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Budget */}
            <div className="exp-filter-block">
              <h4 className="exp-filter-label">Monthly Budget</h4>
              <div className="exp-radio-group">
                {[
                  { label: 'Any Budget', min: 0, max: 60000 },
                  { label: 'Under ₹8k', min: 0, max: 8000 },
                  { label: '₹8k – ₹12k', min: 8000, max: 12000 },
                  { label: '₹12k – ₹18k', min: 12000, max: 18000 },
                  { label: 'Above ₹18k', min: 18000, max: 60000 },
                ].map(opt => (
                  <label key={opt.label} className={`exp-radio-item ${budgetMin === opt.min && budgetMax === opt.max ? 'active' : ''}`}>
                    <input type="radio" name="budget"
                      checked={budgetMin === opt.min && budgetMax === opt.max}
                      onChange={() => { setBudgetMin(opt.min); setBudgetMax(opt.max); }}
                    />
                    <span className="exp-radio-dot"></span>
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Hostel Type */}
            <div className="exp-filter-block">
              <h4 className="exp-filter-label">Hostel Type</h4>
              <div className="exp-pill-group">
                {["Any", "Men's", "Women's", 'Co-living', 'Premium', 'Student'].map(t => (
                  <button key={t}
                    className={`exp-pill ${(!hostelType && t === 'Any') || hostelType === t ? 'active' : ''}`}
                    onClick={() => setHostelType(t === 'Any' ? '' : t)}
                  >{t}</button>
                ))}
              </div>
            </div>

            {/* Sharing Type */}
            <div className="exp-filter-block">
              <h4 className="exp-filter-label">Sharing Type</h4>
              <div className="exp-pill-group">
                <button className={`exp-pill ${!sharing ? 'active' : ''}`} onClick={() => setSharing('')}>Any</button>
                <button className={`exp-pill ${sharing === 'Single' ? 'active' : ''}`} onClick={() => setSharing(sharing === 'Single' ? '' : 'Single')}>Single</button>
              </div>
              <div className="exp-pill-group" style={{ marginTop: '8px' }}>
                {['2', '3', '4', '5', '6'].map(n => (
                  <button key={n}
                    className={`exp-pill exp-pill-num ${sharing === n ? 'active' : ''}`}
                    onClick={() => setSharing(sharing === n ? '' : n)}
                  >{n}</button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="exp-filter-block">
              <h4 className="exp-filter-label">Amenities</h4>
              <div className="exp-amenities-grid">
                {['WiFi', 'AC', 'Gym', 'Food/Mess', 'Parking', 'Power Backup', 'Laundry', 'CCTV'].map(a => (
                  <button
                    key={a}
                    className={`exp-amenity-pill ${selectedAmenities.includes(a) ? 'active' : ''}`}
                    onClick={() => {
                      if (selectedAmenities.includes(a)) {
                        setSelectedAmenities(selectedAmenities.filter(item => item !== a));
                      } else {
                        setSelectedAmenities([...selectedAmenities, a]);
                      }
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Apply */}
          <div className="exp-sidebar-mobile-footer">
            <button className="exp-apply-btn" onClick={() => setIsMobileFilterOpen(false)}>
              Show {filteredHostels.length} Properties
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isMobileFilterOpen && (
          <div className="exp-sidebar-overlay" onClick={() => setIsMobileFilterOpen(false)} />
        )}

        {/* ── PROPERTIES LIST ── */}
        <main className="exp-main">
          {/* Desktop sort bar */}
          <div className="exp-results-bar">
            <p className="exp-results-count">
              <strong>{filteredHostels.length}</strong> properties in {selectedCity}
              {searchLocality && <span className="exp-results-locality"> · {searchLocality}</span>}
            </p>
            <select className="exp-select exp-desktop-sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="">Sort: Relevance</option>
              <option value="price_low_high">Price: Low → High</option>
              <option value="price_high_low">Price: High → Low</option>
            </select>
          </div>

          {/* Hostel cards scroll area */}
          <div className="exp-cards-scroll">
            {loading ? (
              <div className="exp-loading">
                <div className="exp-spinner"></div>
                <p>Finding the best stays for you...</p>
              </div>
            ) : currentHostels.length > 0 ? (
              <>
                <div className="exp-cards-grid">
                  {currentHostels.map((hostel, idx) => (
                    <div key={hostel.id} className="exp-card" style={{ animationDelay: `${0.05 * idx}s` }}>
                      <div className="exp-card-img" onClick={() => goToListing(hostel.id)}>
                        <img
                          src={hostel.img}
                          alt={hostel.name}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'; }}
                        />
                        <div className="exp-card-img-overlay"></div>
                        <span className="exp-gender-tag" style={{ background: genderColor(hostel.gender) }}>
                          {hostel.gender}
                        </span>
                        <div className="exp-rating-pill">
                          <Star size={11} fill="#F59E0B" color="#F59E0B" />
                          <span>{hostel.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="exp-card-body">
                        <div className="exp-card-top">
                          <p className="exp-card-locality">
                            <MapPin size={12} /> {hostel.locality}, {hostel.city}
                          </p>
                          <h3 className="exp-card-title" onClick={() => goToListing(hostel.id)}>
                            {hostel.name}
                          </h3>
                        </div>

                        <div className="exp-card-amenities">
                          {hostel.amenities.slice(0, 3).map((a, i) => (
                            <span key={i} className="exp-amenity-tag">{a}</span>
                          ))}
                          {hostel.amenities.length > 3 && (
                            <span className="exp-amenity-more">+{hostel.amenities.length - 3}</span>
                          )}
                        </div>

                        <div className="exp-card-footer">
                          <div className="exp-price-block">
                            <span className="exp-price-label">Starts at</span>
                            <div className="exp-price-row">
                              <span className="exp-price-value">₹{hostel.price.toLocaleString()}</span>
                              <span className="exp-price-per">/mo</span>
                            </div>
                            <span className="exp-sharing-tag">{hostel.sharingLabel}</span>
                          </div>
                          <button className="exp-details-btn" onClick={() => goToListing(hostel.id)}>
                            Details <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="exp-pagination">
                    <button
                      className="exp-pagi-btn"
                      disabled={currentPage === 1}
                      onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >← Prev</button>
                    <div className="exp-pagi-nums">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                        <button
                          key={num}
                          className={`exp-pagi-num ${currentPage === num ? 'active' : ''}`}
                          onClick={() => { setCurrentPage(num); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >{num}</button>
                      ))}
                    </div>
                    <button
                      className="exp-pagi-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    >Next →</button>
                  </div>
                )}
              </>
            ) : (
              <div className="exp-empty">
                <ShieldCheck size={52} color="#cbd5e1" />
                <h3>No Properties Found</h3>
                <p>Try adjusting your search filters or selecting a different city.</p>
                <button className="exp-reset-full-btn" onClick={resetAllFilters}>Reset All Filters</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing;
