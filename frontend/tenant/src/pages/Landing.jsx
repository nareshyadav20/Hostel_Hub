import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, Star, ShieldCheck, RefreshCw, MapPin, X, ChevronRight, ChevronDown } from 'lucide-react';

import './Landing.css';
import './Search.css'; // Import Search UI styles for identical layout
import API from '../api/axios';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';
import { getAmenitiesFromBuilding, getSharingInfo, getHostelTypeLabel, getSharingAvailability } from '../utils/buildingHelpers';
import ImageModal from '../components/ImageModal';

const ICONS = {
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  Location: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Home: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  Budget: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="20"></line><line x1="12" y1="4" x2="12" y2="6"></line></svg>,
  Sharing: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  Filter: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>,
  Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  Occupancy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>,
  Reset: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" /></svg>,
};

const HostelCard = ({ hostel, isWishlisted, toggleWishlist, onImageClick }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!hostel.images || hostel.images.length <= 1) return;
    const timer = setInterval(() => {
      setImgIdx(prev => (prev + 1) % hostel.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [hostel.images]);

  const currentImage = hostel.images && hostel.images.length > 0
    ? hostel.images[imgIdx]
    : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800';

  const handleViewDetails = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/listing/${hostel.id}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="search-hostel-card-pro is-grid">
      <div className="card-media-side" onClick={() => onImageClick(currentImage)} style={{ cursor: 'zoom-in' }}>
        <img src={currentImage} alt={hostel.name} className="hostel-main-img" style={{ transition: 'opacity 0.5s ease-in-out' }} />
        <div className="card-image-overlays">
          <div className="badge-row-top">
            {hostel.popularityLabel && <span className="label-demand">{hostel.popularityLabel}</span>}
            <span className="label-available">Available</span>
          </div>
          <button
            className={`wish-action-btn ${isWishlisted ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(hostel); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="card-details-side">
        <div className="details-header-row">
          <div>
            <h3 className="hostel-title-pro">{hostel.name}</h3>
            <p className="hostel-loc-pro"><ICONS.Location /> {hostel.location}</p>
          </div>
          <div className="rating-badge-pro">
            <ICONS.Star /> <span>{hostel.rating}</span>
          </div>
        </div>

        <div className="details-mid-grid">
          <div className="pricing-stack-pro">
            <span className="price-label-pro">Starts from</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span className="price-val-pro">₹{(hostel.price || 0).toLocaleString()}</span>
              <span className="price-per-pro">/month</span>
            </div>
          </div>
        </div>

        {hostel.amenities && hostel.amenities.length > 0 && (
          <div className="amenities-footer-row" style={{ position: 'relative' }}>
            <div className="amenity-mini-tags">
              {hostel.amenities.slice(0, 2).map(a => (
                <span key={a} className="tag-pro">{a}</span>
              ))}
              {hostel.amenities.length > 2 && (
                <button type="button" className="tag-more" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAllAmenities(!showAllAmenities); }} style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}>
                  +{hostel.amenities.length - 2} More
                </button>
              )}
            </div>

            {showAllAmenities && hostel.amenities.length > 2 && (
              <div style={{
                position: 'absolute', bottom: '100%', left: '-10px', right: '-10px',
                background: '#FFFFFF', padding: '1rem', borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0',
                zIndex: 50, marginBottom: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem'
              }}>
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Extra Amenities</span>
                  <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAllAmenities(false); }} style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B', fontSize: '10px', fontWeight: 'bold' }}>✕</button>
                </div>
                {hostel.amenities.slice(2).map(a => (
                  <span key={`pop-${a}`} className="tag-pro" style={{ background: '#F8FAFC', border: '1px solid #e2e8f0' }}>{a}</span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="card-actions-row-pro">
          <button onClick={handleViewDetails} className="btn-primary-pro" style={{ width: '100%' }}>View Details</button>
        </div>
      </div>
    </div>
  );
};

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
  const [stayQualityFilter, setStayQualityFilter] = useState('');
  const [sharing, setSharing] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(60000);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [wishlist, setWishlist] = useState([]);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, image: '' });

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const wishRes = await API.get('/tenant-portal/wishlist').catch(() => ({ data: [] }));
      setWishlist(Array.isArray(wishRes.data) ? wishRes.data : []);
    } catch (err) { }
  };

  const toggleWishlist = async (hostel) => {
    try {
      const existing = wishlist.find(h => h.hostelId === hostel.id || h.id === hostel.id);
      if (existing) {
        await API.delete(`/tenant-portal/wishlist/${existing._id}`);
        setWishlist(prev => prev.filter(h => h._id !== existing._id));
      } else {
        const res = await API.post('/tenant-portal/wishlist', {
          hostelId: hostel.id,
          hostelName: hostel.name,
          hostelLocation: hostel.fullAddress || hostel.locality,
          hostelPrice: hostel.price,
          hostelImage: hostel.images && hostel.images.length > 0 ? hostel.images[0] : (hostel.img || ''),
          hostelRating: hostel.rating,
          type: hostel.gender
        });
        setWishlist(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const isWishlisted = (id) => wishlist.some((h) => (h.hostelId === id || h.id === id));

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
    const sqParam = queryParams.get('stayQuality');
    if (sqParam) setStayQualityFilter(sqParam);
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
      let locality = b.locality || '';

      const { sharingLabel: lowestSharingLabel, lowestRent } = getSharingInfo(b);
      if (lowestRent) b.startingPrice = lowestRent;

      const sharingFlags = getSharingAvailability(b);
      const derivedAmenities = getAmenitiesFromBuilding(b);

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
        amenities: derivedAmenities,
        gender: (b.genderType && !['mixed', 'unisex'].includes(b.genderType.toLowerCase())) ? b.genderType : 'Coliving',
        category: b.category || '',
        stayQuality: b.stayQuality || '',
        hasSingle: sharingFlags.hasSingle,
        hasDouble: sharingFlags.hasDouble,
        hasTriple: sharingFlags.hasTriple,
        has4: sharingFlags.has4,
        has5: sharingFlags.has5,
        has6: sharingFlags.has6
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
      const rawArray = unwrapBuildingsArray(res.data);
      const formatted = formatBuildings(rawArray);
      setCachedBuildings(formatted);
      setHostels(formatted);
    } catch (error) {
      console.error('Error fetching hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
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
  }, [selectedCity, selectedAmenities, searchLocality, hostelType, sharing, sortBy, budgetMin, budgetMax, stayQualityFilter]);

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
    setStayQualityFilter('');
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

      // Stay Quality
      if (stayQualityFilter && stayQualityFilter !== 'Any') {
        if ((h.stayQuality || '').toLowerCase() !== stayQualityFilter.toLowerCase()) return false;
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
    hostelType, sharing, searchLocality, stayQualityFilter,
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
      <div className={`search-main-layout ${isMobileFilterOpen ? 'filter-open' : ''}`}>

        {/* ── SIDEBAR FILTERS ── */}
        <aside className="search-sidebar-pro" style={{ marginLeft: '0.3cm' }}>
          <div className="filter-card-premium">
            <div className="filter-card-header">
              <ICONS.Filter />
              <h3>Filters</h3>
              {activeFilterCount > 0 && (
                <button className="filter-reset-btn" onClick={resetAllFilters}>
                  <ICONS.Reset /> Clear all
                </button>
              )}
            </div>

            {/* Location — cities */}
            <div className="filter-section-pro">
              <label className="section-label-pro"><ICONS.Location /> Location</label>
              <div className="select-wrapper-pro">
                <select value={selectedCity} onChange={e => {
                  const city = e.target.value;
                  setSelectedCity(city);
                  setSearchLocality('');
                  navigate(`/explore${city === 'All Cities' ? '' : `?city=${city.toLowerCase()}`}`);
                }}>
                  {['All Cities', ...CITIES_LIST].map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Localities — dynamic from selected city */}
            {uniqueLocalities.length > 0 && (
              <div className="filter-section-pro">
                <label className="section-label-pro"><ICONS.Location /> Localities</label>
                <div className="select-wrapper-pro">
                  <select value={searchLocality} onChange={e => setSearchLocality(e.target.value)}>
                    <option value="">All Localities</option>
                    {uniqueLocalities.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Budget */}
            <div className="filter-section-pro">
              <label className="section-label-pro"><ICONS.Budget /> Monthly Budget</label>
              <div className="budget-option-list">
                {[
                  { label: 'Any Budget', min: 0, max: 60000 },
                  { label: 'Under ₹8k', min: 0, max: 8000 },
                  { label: '₹8k – ₹12k', min: 8000, max: 12000 },
                  { label: '₹12k – ₹18k', min: 12000, max: 18000 },
                  { label: 'Above ₹18k', min: 18000, max: 60000 },
                ].map(opt => (
                  <label key={opt.label} className={`budget-radio-row ${budgetMin === opt.min && budgetMax === opt.max ? 'active' : ''}`}>
                    <input type="radio" name="budget"
                      checked={budgetMin === opt.min && budgetMax === opt.max}
                      onChange={() => { setBudgetMin(opt.min); setBudgetMax(opt.max); }}
                    />
                    <span className="radio-custom-pro"></span>
                    <span className="radio-label-text">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hostel Type */}
            <div className="filter-section-pro">
              <label className="section-label-pro"><ICONS.Home /> Hostel Type</label>
              <div className="pill-group">
                {["Any", "Men's", "Women's", 'Co-living'].map(t => (
                  <button key={t}
                    className={`pill-btn ${(!hostelType && t === 'Any') || hostelType === t ? 'active' : ''}`}
                    onClick={() => setHostelType(t === 'Any' ? '' : t)}
                  >{t}</button>
                ))}
              </div>
            </div>

            {/* Stay Quality */}
            <div className="filter-section-pro">
              <label className="section-label-pro"><ICONS.Star /> Stay Quality</label>
              <div className="pill-group">
                {["Any", "Standard", "Premium", "Luxury"].map(t => (
                  <button key={t}
                    className={`pill-btn ${(!stayQualityFilter && t === 'Any') || stayQualityFilter === t ? 'active' : ''}`}
                    onClick={() => setStayQualityFilter(t === 'Any' ? '' : t)}
                  >{t}</button>
                ))}
              </div>
            </div>

            {/* Sharing Type */}
            <div className="filter-section-pro">
              <label className="section-label-pro"><ICONS.Sharing /> Sharing Type</label>
              <div className="sharing-grid-3x3">
                <button className={`sharing-grid-btn ${!sharing ? 'active' : ''}`} onClick={() => setSharing('')}>Any</button>
                <button className={`sharing-grid-btn ${sharing === 'Single' ? 'active' : ''}`} onClick={() => setSharing(sharing === 'Single' ? '' : 'Single')}>Single</button>
                {['2', '3', '4', '5', '6'].map(n => (
                  <button key={n}
                    className={`sharing-grid-btn ${sharing === n ? 'active' : ''}`}
                    onClick={() => setSharing(sharing === n ? '' : n)}
                  >{n}</button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="filter-section-pro">
              <label className="section-label-pro"><ICONS.Star /> Amenities</label>
              <div className="sharing-grid-3x3" style={{ gridTemplateColumns: '1fr 1fr' }}>
                {['WiFi', 'AC', 'Gym', 'Food/Mess', 'Parking', 'Power Backup', 'Laundry', 'CCTV'].map(a => (
                  <button
                    key={a}
                    className={`sharing-grid-btn ${selectedAmenities.includes(a) ? 'active' : ''}`}
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

            <button
              className="btn-apply-filters"
              onClick={() => { setIsMobileFilterOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </aside>

        {/* ── PROPERTIES LIST ── */}
        <main className="search-results-pro">
          {/* Results meta bar */}
          <div className="results-meta-bar">
            <p className="results-meta-count">
              <strong>{filteredHostels.length}</strong> stays found in {selectedCity}
            </p>
            <select className="exp-select exp-desktop-sort" style={{ width: 'auto', padding: '6px 10px', background: 'transparent' }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="">Sort: Relevance</option>
              <option value="price_low_high">Price: Low → High</option>
              <option value="price_high_low">Price: High → Low</option>
            </select>
          </div>

          {loading ? (
            <div className="loading-placeholder-grid">
              <div className="premium-spinner"></div>
              <p>Discovering premium stays for you...</p>
            </div>
          ) : currentHostels.length === 0 ? (
            <div className="no-results-card">
              <div className="empty-visual"><ICONS.Search /></div>
              <h3>No Properties Found</h3>
              <p>Try adjusting your search filters or selecting a different city.</p>
              <button className="btn-secondary-pro" style={{ width: 'max-content', margin: '0 auto' }} onClick={resetAllFilters}>Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="results-grid-pro is-grid">
                {currentHostels.map(h => (
                  <HostelCard
                    key={h.id}
                    hostel={{ ...h, location: h.locality + ', ' + h.city, hostelType: h.gender, images: [h.img] }}
                    isWishlisted={isWishlisted(h.id)}
                    toggleWishlist={toggleWishlist}
                    onImageClick={(img) => setModalInfo({ isOpen: true, image: img })}
                  />
                ))}
              </div>

              {/* Pagination */}
              {true && (
                <div className="pagination-wrapper-pro">
                  <div className="pagination-pro">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => { setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="pagi-btn pagi-edge" title="First page"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
                    </button>

                    <button
                      disabled={currentPage === 1}
                      onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="pagi-btn" title="Previous page"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>

                    <div className="pagi-numbers">
                      {(() => {
                        const pages = [];
                        const maxVisible = 5;
                        let startPage, endPage;
                        if (totalPages <= maxVisible + 2) { startPage = 1; endPage = totalPages; }
                        else if (currentPage <= Math.ceil(maxVisible / 2) + 1) { startPage = 1; endPage = maxVisible; }
                        else if (currentPage >= totalPages - Math.floor(maxVisible / 2)) { startPage = totalPages - maxVisible + 1; endPage = totalPages; }
                        else { startPage = currentPage - Math.floor(maxVisible / 2); endPage = currentPage + Math.floor(maxVisible / 2); }

                        if (startPage > 1) {
                          pages.push(<button key={1} onClick={() => { setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`pagi-num ${currentPage === 1 ? 'active' : ''}`}>1</button>);
                          if (startPage > 2) pages.push(<span key="e1" className="pagi-ellipsis">•••</span>);
                        }
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(<button key={i} onClick={() => { setCurrentPage(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`pagi-num ${currentPage === i ? 'active' : ''}`}>{i}</button>);
                        }
                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) pages.push(<span key="e2" className="pagi-ellipsis">•••</span>);
                          pages.push(<button key={totalPages} onClick={() => { setCurrentPage(totalPages); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`pagi-num ${currentPage === totalPages ? 'active' : ''}`}>{totalPages}</button>);
                        }
                        return pages;
                      })()}
                    </div>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="pagi-btn" title="Next page"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => { setCurrentPage(totalPages); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="pagi-btn pagi-edge" title="Last page"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <ImageModal
        isOpen={modalInfo.isOpen}
        image={modalInfo.image}
        onClose={() => setModalInfo({ isOpen: false, image: '' })}
      />
    </div>
  );
};

export default Landing;
