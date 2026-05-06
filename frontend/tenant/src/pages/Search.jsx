import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import { MOCK_HOSTELS } from '../utils/mockData';
import './Search.css';

const ICONS = {
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  Location: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  Gender: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 7l-5-5-5 5" /></svg>,
  Budget: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
  Amenities: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>,
  Category: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  WiFi: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>,
  AC: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h18M3 6h18M3 18h18" /></svg>,
  Food: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /></svg>,
  Security: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Student: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>,
  Work: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  Luxury: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
};

const HOSTELS = MOCK_HOSTELS.map(h => ({
  id: h.id,
  name: h.name,
  location: h.location,
  city: (h.city || 'bengaluru').toLowerCase(),
  price: h.price,
  gender: h.gender,
  category: (h.category || 'Student').toLowerCase(),
  type: h.type,
  rating: h.rating,
  popularityLabel: h.rating > 4.8 ? 'High Demand' : null,
  occupancy: h.occupancy,
  image: h.image,
  amenities: h.amenities || []
}));

const HostelCard = ({ hostel, isWishlisted, toggleWishlist }) => (
  <div className="pro-hostel-card-vertical">
    <div className="card-image-area">
      <img src={hostel.image} alt={hostel.name} className="carousel-image" />
      <div className="image-overlay-gradient"></div>
      <div className="card-top-badges">
        {hostel.popularityLabel && <span className="badge-featured">{hostel.popularityLabel}</span>}
        <span className="badge-status-pill">Available</span>
      </div>
      <div className="name-overlay">
        <h3 className="hostel-title">{hostel.name}</h3>
      </div>
      <button 
        className={`wish-pill ${isWishlisted ? 'active' : ''}`} 
        onClick={(e) => { e.preventDefault(); toggleWishlist(hostel); }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
    </div>
    <div className="card-info-area">
      <div className="loc-rating-row">
        <div className="loc-info">
          <ICONS.Location /> <span>{hostel.location}</span>
        </div>
        <div className="rating-pill">★ {hostel.rating}</div>
      </div>
      <div className="stats-box-row">
        <div className="stat-box">
          <span className="stat-label">Starts from</span>
          <span className="stat-value">₹{hostel.price.toLocaleString()}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Occupancy</span>
          <span className="stat-value">{hostel.occupancy}</span>
        </div>
      </div>
      <div className="amenities-row">
        <div className="amenity-icons">
          <ICONS.WiFi /> <ICONS.Food /> <ICONS.Security />
          <span className="more-amenities">+8 More</span>
        </div>
      </div>
      <div className="card-actions-footer">
        <Link to={`/listing/${hostel.id}`} className="btn-primary-action">View Details</Link>
        <Link to={`/booking/${hostel.id}`} className="btn-primary-action" style={{ background: '#10B981', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>Book Now</Link>
      </div>
    </div>
  </div>
);

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const qLocation = queryParams.get('location') || 'all';
  const qBudget = queryParams.get('budget') || 'all';
  const qType = queryParams.get('type') || 'all';

  const [filters, setFilters] = useState({ 
    location: qLocation.toLowerCase(), 
    budget: qBudget, 
    gender: 'All', 
    categories: qType !== 'all' ? [qType.toLowerCase()] : [], 
    amenities: [] 
  });

  const [wishlist, setWishlist] = useState([]);
  const [allHostels, setAllHostels] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const [response, wishRes] = await Promise.all([
          API.get('/buildings'),
          API.get('/tenant-portal/wishlist')
        ]);
        setWishlist(Array.isArray(wishRes.data) ? wishRes.data : []);
        let mapped = response.data.map(b => ({
          id: b._id,
          name: b.name,
          location: b.address,
          city: (b.locationCity || 'bengaluru').toLowerCase(),
          price: b.startingPrice || 5000,
          gender: b.genderType || 'Mixed',
          category: (b.category || 'Student').toLowerCase(),
          type: 'Premium',
          rating: b.rating || (4.0 + Math.random()).toFixed(1),
          popularityLabel: b.rating > 4.5 ? 'High Demand' : null,
          occupancy: '70%',
          image: b.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
          amenities: b.amenities || []
        }));

        if (mapped.length === 0) mapped = HOSTELS;
        setAllHostels(mapped);
        setHostels(mapped);
      } catch (err) {
        console.error('Error fetching hostels:', err);
        setAllHostels(HOSTELS);
        setHostels(HOSTELS);
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  useEffect(() => {
    let filtered = [...allHostels];
    if (filters.location !== 'all') {
      filtered = filtered.filter(h => 
        (h.city || '').toLowerCase().includes(filters.location.toLowerCase()) || 
        (h.location || '').toLowerCase().includes(filters.location.toLowerCase()) ||
        (h.name || '').toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    if (filters.gender !== 'All') {
      filtered = filtered.filter(h => h.gender === filters.gender || h.gender === 'Mixed');
    }
    if (filters.budget !== 'all') {
      filtered = filtered.filter(h => {
        const price = h.price;
        if (filters.budget === 'budget-1') return price <= 5000;
        if (filters.budget === 'budget-2') return price > 5000 && price <= 10000;
        if (filters.budget === 'budget-3') return price > 10000 && price <= 15000;
        if (filters.budget === 'budget-4') return price > 15000;
        return true;
      });
    }
    if (filters.categories.length > 0) {
      filtered = filtered.filter(h => filters.categories.includes((h.category || 'student').toLowerCase()));
    }
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(h =>
        filters.amenities.every(amn => (h.amenities || []).some(a => a.toLowerCase().includes(amn.toLowerCase())))
      );
    }
    setHostels(filtered);
  }, [filters, allHostels]);

  const toggleCategory = (cat) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat]
    }));
  };

  const toggleAmenity = (amn) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amn) ? prev.amenities.filter(a => a !== amn) : [...prev.amenities, amn]
    }));
  };

  const isWishlisted = (id) => wishlist.some((h) => (h.hostelId === id || h.id === id));

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
          hostelLocation: hostel.location,
          hostelPrice: hostel.price,
          hostelImage: hostel.image,
          hostelRating: hostel.rating,
          gender: hostel.gender,
          type: hostel.type
        });
        setWishlist(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  return (
    <div className="search-page-professional fade-in">
      <header className="professional-header">
        <div className="header-nav-row">
          <button className="pro-close-btn" onClick={() => navigate('/')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="header-content">
          <h1 className="header-title">Find Your Perfect Stay</h1>
          <p className="header-subtitle">Verified co-living spaces with real-time availability.</p>
        </div>
      </header>

      <div className="search-layout">
        <aside className="sidebar-professional">
          <div className="filter-card">
            <div className="filter-header">
              <ICONS.Amenities />
              <h3>Filters</h3>
            </div>
            <div className="filter-group">
              <div className="group-label"><ICONS.Location /> <span>Location</span></div>
              <select value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="pro-select">
                <option value="all">All Cities</option>
                <option value="bengaluru">Bengaluru</option>
                <option value="hyderabad">Hyderabad</option>
                <option value="mumbai">Mumbai</option>
              </select>
            </div>
            <div className="filter-group">
              <div className="group-label"><ICONS.Gender /> <span>Gender</span></div>
              <div className="gender-toggle-group">
                {['All', 'Boys', 'Girls', 'Mixed'].map(g => (
                  <button key={g} onClick={() => setFilters({ ...filters, gender: g })} className={`gender-btn ${filters.gender === g ? 'active' : ''}`}>{g}</button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <div className="group-label"><ICONS.Budget /> <span>Budget</span></div>
              <div className="pro-filter-table">
                {[{ label: 'All', value: 'all' }, { label: '₹0-5k', value: 'budget-1' }, { label: '₹5k-10k', value: 'budget-2' }, { label: '₹10k-15k', value: 'budget-3' }, { label: '₹15k+', value: 'budget-4' }].map(item => (
                  <label key={item.value} className="pro-table-row">
                    <input type="radio" name="budget" checked={filters.budget === item.value} onChange={() => setFilters({ ...filters, budget: item.value })} />
                    <span className="row-content"><span className="row-label">{item.label}</span><span className="row-radio-custom"></span></span>
                  </label>
                ))}
              </div>
            </div>
            <button className="apply-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Apply Filters</button>
          </div>
        </aside>

        <main className="results-professional">
          {loading ? (
            <div className="loading-spinner">Discovering stays...</div>
          ) : hostels.length === 0 ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1' }}>No results found.</div>
          ) : (
            hostels.map(h => <HostelCard key={h.id} hostel={h} isWishlisted={isWishlisted(h.id)} toggleWishlist={toggleWishlist} />)
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;
