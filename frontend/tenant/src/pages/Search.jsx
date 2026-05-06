import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import { MOCK_HOSTELS } from '../utils/mockData';

/* ─── icons (SVG constants) ─── */
const ICONS = {
  Location: (props) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  Budget: (props) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>,
  Gender: (props) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>,
  Amenities: (props) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
  WiFi: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>,
  AC: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v2" /><path d="M12 20v2" /><path d="M4.93 4.93l1.41 1.41" /><path d="M17.66 17.66l1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="M6.34 17.66l-1.41 1.41" /><path d="M19.07 4.93l-1.41 1.41" /></svg>,
  Food: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></svg>,
  Security: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  Category: (props) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 21v-7a4 4 0 1 1 8 0v7" /><path d="M9 15v2" /><path d="M12 21v-7a4 4 0 1 1 8 0v7" /><path d="M17 15v2" /><path d="M3 8h18" /><path d="m3 8 2.1-5.1a2 2 0 0 1 1.8-1.1h10.2a2 2 0 0 1 1.8 1.1L21 8" /></svg>,
  Student: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>,
  Work: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
  Luxury: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
};

const HOSTELS = MOCK_HOSTELS.map(h => ({
  id: h.id,
  name: h.name,
  location: h.locality,
  city: h.city.toLowerCase(),
  price: h.price,
  gender: h.gender,
  type: 'Premium',
  category: h.category.toLowerCase(),
  rating: h.rating,
  popularityLabel: h.rating > 4.8 ? 'High Demand' : null,
  occupancy: '85%',
  totalRooms: 10,
  totalBeds: 40,
  image: h.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
  images: h.images || ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'],
  amenities: h.amenities || []
}));

/* ─── Hostel Card Sub-component with Carousel ─── */
const HostelCard = ({ hostel, isWishlisted, toggleWishlist }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = hostel.images && hostel.images.length > 0 ? hostel.images : [hostel.image];

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div key={hostel.id} className="pro-hostel-card-vertical fade-in">
      <div className="card-image-area">
        <div className="image-overlay-gradient"></div>
        <img
          src={images[currentImageIndex]}
          alt={hostel.name}
          className="carousel-image"
        />

        <div className="card-top-badges">
          {hostel.popularityLabel && <span className="badge-featured">{hostel.popularityLabel}</span>}
          <span className="badge-status-pill">Active</span>
        </div>

        <div className="name-overlay">
          <h2 className="hostel-title">{hostel.name}</h2>
        </div>

        <button className={`wish-pill ${isWishlisted ? 'active' : ''}`} onClick={(e) => { e.preventDefault(); toggleWishlist(hostel); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        </button>
      </div>

      <div className="card-info-area">
        <div className="loc-rating-row">
          <div className="loc-info">
            <ICONS.Location style={{ width: '14px', height: '14px', color: 'var(--accent-primary)' }} />
            <span>{hostel.location?.split(',')[0] || 'City'}</span>
          </div>
          <div className="rating-pill">
            <span>★ {hostel.rating}</span>
          </div>
        </div>

        <div className="stats-box-row">
          <div className="stat-box">
            <span className="stat-label">STARTING</span>
            <span className="stat-value">₹{hostel.price >= 1000 ? (hostel.price / 1000).toFixed(1) + 'k' : hostel.price}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">AVAILABILITY</span>
            <span className="stat-value">{hostel.totalBeds || 10} Beds</span>
          </div>
        </div>

        <div className="amenities-row">
          <div className="amenity-icons">
            <ICONS.WiFi style={{ width: '16px' }} />
            <ICONS.AC style={{ width: '16px' }} />
            <ICONS.Security style={{ width: '16px' }} />
            <span className="more-amenities">+3 more</span>
          </div>
        </div>

        <div className="card-actions-footer">
          <Link to={`/listing/${hostel.id}`} className="btn-secondary-action">View Details</Link>
          <Link to={`/booking/${hostel.id}`} className="btn-primary-action">Quick Book</Link>
        </div>
      </div>
    </div>
  );
};

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query params from URL
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
        setWishlist(wishRes.data);
        let mapped = response.data.map(b => {
          const totalBeds = b.floors?.reduce((acc, f) => acc + (f.rooms?.reduce((rAcc, r) => rAcc + (r.beds?.length || 0), 0) || 0), 0) || 0;
          const occupiedBeds = b.floors?.reduce((acc, f) => acc + (f.rooms?.reduce((rAcc, r) => rAcc + (r.beds?.filter(bd => bd.status === 'OCCUPIED').length || 0), 0) || 0), 0) || 0;
          const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

          return {
            id: b._id,
            name: b.name,
            location: b.address,
            city: (b.locationCity || 'bengaluru').toLowerCase(),
            price: b.startingPrice || 5000,
            gender: b.genderType || 'Mixed',
            category: (b.category || 'Student').toLowerCase(),
            type: 'Premium',
            rating: b.rating || (4.0 + Math.random()).toFixed(1),
            popularityLabel: b.popularityLabel || (occupancyRate > 90 ? 'High Demand' : null),
            occupancy: `${occupancyRate}%`,
            totalRooms: b.floors?.reduce((acc, f) => acc + (f.rooms?.length || 0), 0) || 0,
            totalBeds: totalBeds,
            image: b.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800',
            images: b.images || [],
            amenities: b.amenities || []
          };
        });

        if (mapped.length === 0) {
          mapped = HOSTELS;
        }

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

    // Location filter
    if (filters.location !== 'all') {
      filtered = filtered.filter(h =>
        (h.city || '').toLowerCase().includes(filters.location.toLowerCase()) ||
        (h.location || '').toLowerCase().includes(filters.location.toLowerCase()) ||
        (h.name || '').toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Gender filter
    if (filters.gender !== 'All') {
      filtered = filtered.filter(h => h.gender === filters.gender || h.gender === 'Mixed');
    }

    // Budget filter
    if (filters.budget !== 'all') {
      filtered = filtered.filter(h => {
        const price = h.price;
        if (filters.budget === 'budget-1' || filters.budget.includes('5k')) return price <= 5000;
        if (filters.budget === 'budget-2' || filters.budget.includes('10k')) return price > 5000 && price <= 10000;
        if (filters.budget === 'budget-3' || filters.budget.includes('15k')) return price > 10000 && price <= 15000;
        if (filters.budget === 'budget-4') return price > 15000;
        return true;
      });
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(h => filters.categories.includes((h.category || 'student').toLowerCase()));
    }

    // Amenities filter
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
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const toggleAmenity = (amn) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amn)
        ? prev.amenities.filter(a => a !== amn)
        : [...prev.amenities, amn]
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
      alert('Failed to update wishlist. Please try again.');
    }
  };


  return (
    <div className="search-page-professional fade-in">
      <header className="professional-header">
        <div className="header-nav-row">
          <button className="pro-close-btn" onClick={() => navigate('/')} aria-label="Close search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="header-content">
          <span className="premium-tag">PREMIUM SELECTION</span>
          <h1 className="header-title">Discover Your Next Home</h1>
          <p className="header-subtitle">Verified hostels with real-time occupancy tracking.</p>
        </div>
      </header>

      <div className="search-layout">
        <aside className="sidebar-professional">
          <div className="filter-card">
            <div className="filter-header">
              <ICONS.Amenities style={{ color: 'var(--text-muted)' }} />
              <h3>Search Filters</h3>
            </div>

            <div className="filter-sections">
              <div className="filter-group">
                <div className="group-label">
                  <ICONS.Location /> <span>Location</span>
                </div>
                <select value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="pro-select">
                  <option value="all">All Cities</option>
                  <option value="bengaluru">Bengaluru</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="pune">Pune</option>
                  <option value="chennai">Chennai</option>
                  <option value="delhi">Delhi</option>
                </select>
              </div>

              <div className="filter-group">
                <div className="group-label">
                  <ICONS.Gender /> <span>Gender Preference</span>
                </div>
                <div className="gender-toggle-group">
                  {['All', 'Boys', 'Girls', 'Mixed'].map(g => (
                    <button key={g} onClick={() => setFilters({ ...filters, gender: g })} className={`gender-btn ${filters.gender === g ? 'active' : ''}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <div className="group-label">
                  <ICONS.Budget /> <span>Budget Segments</span>
                </div>
                <div className="pro-filter-table">
                  {[
                    { label: 'All Budgets', value: 'all' },
                    { label: '₹0 - ₹5k', value: 'budget-1' },
                    { label: '₹5k - ₹10k', value: 'budget-2' },
                    { label: '₹10k - ₹15k', value: 'budget-3' },
                    { label: '₹15k+', value: 'budget-4' }
                  ].map(item => (
                    <label key={item.value} className="pro-table-row">
                      <input
                        type="radio"
                        name="budget-seg"
                        checked={filters.budget === item.value}
                        onChange={() => setFilters({ ...filters, budget: item.value })}
                      />
                      <span className="row-content">
                        <span className="row-label">{item.label}</span>
                        <span className="row-radio-custom"></span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Property Categories */}
              <div className="filter-group">
                <div className="group-label">
                  <ICONS.Category /> <span>Property Style</span>
                </div>
                <div className="pro-filter-table">
                  {[
                    { label: 'Student Friendly', icon: <ICONS.Student />, value: 'student' },
                    { label: 'Professional Hubs', icon: <ICONS.Work />, value: 'work' },
                    { label: 'Luxury Suites', icon: <ICONS.Luxury />, value: 'luxury' }
                  ].map(item => (
                    <label key={item.value} className="pro-table-row">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(item.value)}
                        onChange={() => toggleCategory(item.value)}
                      />
                      <span className="row-content">
                        <span className="row-info">
                          {item.icon}
                          <span className="row-label">{item.label}</span>
                        </span>
                        <span className="row-check-custom"></span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amenities checklist */}
              <div className="filter-group">
                <div className="group-label">
                  <ICONS.Amenities /> <span>Essential Amenities</span>
                </div>
                <div className="amenities-checklist">
                  {[
                    { id: 'wifi', label: 'WiFi', icon: <ICONS.WiFi /> },
                    { id: 'ac', label: 'A/C', icon: <ICONS.AC /> },
                    { id: 'food', label: 'Food', icon: <ICONS.Food /> },
                    { id: 'security', label: 'Security', icon: <ICONS.Security /> }
                  ].map(amenity => (
                    <label key={amenity.id} className="amenity-checkbox">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity.id)}
                        onChange={() => toggleAmenity(amenity.id)}
                      />
                      <span className="checkbox-content">
                        {amenity.icon}
                        <span>{amenity.label}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="apply-btn">Apply Filters</button>
            </div>
          </div>
        </aside>

        <main className="results-professional">
          {loading ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '5rem' }}>
              <div className="loading-spinner">Discovering stays...</div>
            </div>
          ) : hostels.length === 0 ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '5rem' }}>
              <h2>No hostels found matching your criteria.</h2>
              <p>Try adjusting your filters or location.</p>
            </div>
          ) : (
            hostels.map(hostel => (
              <HostelCard
                key={hostel.id}
                hostel={hostel}
                isWishlisted={isWishlisted(hostel.id)}
                toggleWishlist={toggleWishlist}
              />
            ))
          )}
        </main>
      </div>

      <style>{`
        .search-page-professional {
          padding: 1rem 0;
        }

        .professional-header {
          margin-bottom: 3rem;
          padding: 1.5rem 0;
          position: relative;
        }

        .header-nav-row {
          position: absolute;
          top: 1rem;
          right: 2rem;
          z-index: 10;
        }

        .pro-close-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid var(--border-color);
          background: var(--bg-secondary);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--shadow-sm);
        }

        .pro-close-btn:hover {
          background: var(--accent-error);
          color: white;
          border-color: var(--accent-error);
          transform: rotate(90deg) scale(1.1);
          box-shadow: 0 8px 20px rgba(244, 63, 94, 0.3);
        }

        .header-content {
          text-align: center;
        }

        .header-title {
          font-size: 3.5rem;
          font-weight: 950;
          background: linear-gradient(to right, #fff, var(--accent-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
          letter-spacing: -2px;
        }

        .header-subtitle {
          color: var(--text-muted);
          font-size: 1.2rem;
          font-weight: 500;
        }

        .search-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 3rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .sidebar-professional {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .filter-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: var(--shadow-xl);
        }

        .filter-header {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .filter-header h3 {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0;
        }

        .filter-group {
          margin-bottom: 2rem;
        }

        .group-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .pro-select {
          width: 100%;
          padding: 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-primary);
          font-weight: 600;
          outline: none;
        }

        .gender-toggle-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;
        }

        .gender-btn {
          padding: 0.8rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-secondary);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .gender-btn.active {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
        }

        .pro-filter-table {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .pro-table-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .pro-table-row:hover {
          border-color: var(--accent-primary);
        }

        .pro-table-row input {
          display: none;
        }

        .row-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .row-label {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .row-radio-custom {
          width: 18px;
          height: 18px;
          border: 2px solid var(--border-color);
          border-radius: 50%;
          position: relative;
        }

        .pro-table-row input:checked + .row-content .row-radio-custom::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 8px;
          height: 8px;
          background: var(--accent-primary);
          border-radius: 50%;
        }

        .row-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .row-check-custom {
          width: 18px;
          height: 18px;
          border: 2px solid var(--border-color);
          border-radius: 4px;
          position: relative;
        }

        .pro-table-row input:checked + .row-content .row-check-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--accent-primary);
          font-weight: 900;
        }

        .amenities-checklist {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.8rem;
        }

        .amenity-checkbox {
          cursor: pointer;
        }

        .amenity-checkbox input {
          display: none;
        }

        .checkbox-content {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.8rem 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-secondary);
          font-size: 0.85rem;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .amenity-checkbox input:checked + .checkbox-content {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
          box-shadow: 0 4px 12px rgba(var(--accent-primary-rgb), 0.2);
        }

        .results-professional {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .pro-hostel-card-vertical {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          position: relative;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }

        .pro-hostel-card-vertical:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-2xl);
          border-color: var(--accent-primary);
        }

        .card-image-area {
          height: 300px;
          position: relative;
          overflow: hidden;
        }

        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1s ease;
        }

        .pro-hostel-card-vertical:hover .carousel-image {
          transform: scale(1.1);
        }

        .image-overlay-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
          z-index: 2;
        }

        .card-top-badges {
          position: absolute;
          top: 1.2rem;
          left: 1.2rem;
          display: flex;
          gap: 0.6rem;
          z-index: 5;
          width: calc(100% - 2.4rem);
        }

        .badge-featured {
          padding: 0.4rem 0.8rem;
          background: var(--accent-primary);
          color: white;
          border-radius: 8px;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .badge-status-pill {
          padding: 0.4rem 0.8rem;
          background: #22c55e;
          color: white;
          border-radius: 8px;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          margin-left: auto;
        }

        .name-overlay {
          position: absolute;
          bottom: 1.5rem;
          left: 1.5rem;
          z-index: 5;
        }

        .hostel-title {
          color: white;
          font-size: 1.8rem;
          font-weight: 950;
          margin: 0;
          letter-spacing: -1px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .wish-pill {
          position: absolute;
          top: 1.2rem;
          right: 1.2rem;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .wish-pill.active {
          background: var(--accent-error);
          color: white;
        }

        .card-info-area {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .loc-rating-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .loc-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .rating-pill {
          background: rgba(251, 191, 36, 0.1);
          color: #fbbf24;
          padding: 0.3rem 0.6rem;
          border-radius: 8px;
          font-weight: 800;
          font-size: 0.85rem;
        }

        .stats-box-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .stat-box {
          background: var(--bg-tertiary);
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .stat-label {
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 900;
          color: var(--accent-success);
        }

        .amenities-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .amenity-icons {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--text-muted);
        }

        .more-amenities {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        .card-actions-footer {
          display: flex;
          gap: 0.8rem;
          margin-top: 0.5rem;
        }

        .btn-primary-action {
          flex: 1;
          padding: 1rem;
          background: var(--accent-primary);
          color: white;
          text-align: center;
          text-decoration: none;
          border-radius: 14px;
          font-weight: 800;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(var(--accent-primary-rgb), 0.2);
        }

        .btn-primary-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(var(--accent-primary-rgb), 0.3);
        }

        .btn-secondary-action {
          flex: 1;
          padding: 1rem;
          background: transparent;
          color: var(--accent-primary);
          text-align: center;
          text-decoration: none;
          border-radius: 14px;
          font-weight: 800;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          border: 2px solid var(--accent-primary);
        }

        .btn-secondary-action:hover {
          background: var(--accent-primary);
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(var(--accent-primary-rgb), 0.25);
        }

        @media (max-width: 1024px) {
          .search-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Search;
