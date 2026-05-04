import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';

/* ─── icons (SVG constants) ─── */
const ICONS = {
  Location: (props) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Budget: (props) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>,
  Gender: (props) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>,
  Amenities: (props) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  WiFi: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  AC: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M6.34 17.66l-1.41 1.41"/><path d="M19.07 4.93l-1.41 1.41"/></svg>,
  Food: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>,
  Security: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Category: (props) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 21v-7a4 4 0 1 1 8 0v7"/><path d="M9 15v2"/><path d="M12 21v-7a4 4 0 1 1 8 0v7"/><path d="M17 15v2"/><path d="M3 8h18"/><path d="m3 8 2.1-5.1a2 2 0 0 1 1.8-1.1h10.2a2 2 0 0 1 1.8 1.1L21 8"/></svg>,
  Student: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  Work: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  Luxury: (props) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
};

/* ─── hostel data ─── */
const HOSTELS = [
  // Bangalore Stays
  { id: 'b1', name: 'Livora Premium Stay', location: 'Koramangala, Bangalore', price: 12999, gender: 'Boys', type: 'Private', rating: 4.9, image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1000' },
  { id: 'b2', name: 'Zenith Living', location: 'Whitefield, Bangalore', price: 10500, gender: 'Girls', type: '2 Sharing', rating: 4.7, image: 'https://images.unsplash.com/photo-1623625434462-e5e42318ae49?auto=format&fit=crop&q=80&w=1000' },
  { id: 'b3', name: 'Elite Hub', location: 'Indiranagar, Bangalore', price: 15000, gender: 'Mixed', type: 'Studio', rating: 4.8, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000' },
  
  // Hyderabad Stays
  { id: 'h1', name: 'Stellar Suites', location: 'Gachibowli, Hyderabad', price: 16000, gender: 'Mixed', type: 'Private', rating: 4.7, image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=1000' },
  { id: 'h2', name: 'Cyber Hub Stay', location: 'Hitech City, Hyderabad', price: 11500, gender: 'Boys', type: '3 Sharing', rating: 4.6, image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=1000' },
  
  // Mumbai Stays
  { id: 'm1', name: 'Marine Drive Elite', location: 'Colaba, Mumbai', price: 25000, gender: 'Mixed', type: 'Studio', rating: 4.9, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000' },
  { id: 'm2', name: 'Skyline Heights', location: 'Andheri, Mumbai', price: 18000, gender: 'Girls', type: 'Private', rating: 4.5, image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1000' },
  
  // Chennai Stays
  { id: 'c1', name: 'Marina Breeze', location: 'Adyar, Chennai', price: 9500, gender: 'Boys', type: '2 Sharing', rating: 4.4, image: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&q=80&w=1000' },
];

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse query params
  const queryParams = new URLSearchParams(location.search);
  const initialLocation = queryParams.get('location') || '';
  const initialBudget = queryParams.get('budget') || '';
  const initialType = queryParams.get('type') || '';

  const [filters, setFilters] = useState({ 
    location: initialLocation, 
    budget: initialBudget, 
    type: initialType,
    gender: 'All' 
  });
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const response = await API.get('/buildings');
        const dbMapped = response.data.map(b => ({
          id: b._id,
          name: b.name,
          location: b.address,
          price: b.startingPrice || 5000,
          gender: b.type || 'Co-living',
          type: 'Premium',
          rating: 4.5,
          image: b.images?.[0] || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1000'
        }));
        setHostels([...HOSTELS, ...dbMapped]);
      } catch (err) {
        console.error('Error fetching hostels:', err);
        setHostels(HOSTELS); // Use mock data if API fails
      } finally {
        setLoading(false);
      }
    };
    fetchHostels();
  }, []);

  const filteredHostels = hostels.filter(h => {
    const locMatch = !filters.location || h.location.toLowerCase().includes(filters.location.toLowerCase()) || h.name.toLowerCase().includes(filters.location.toLowerCase());
    const genderMatch = filters.gender === 'All' || h.gender === filters.gender;
    
    // Budget logic (simple mapping for demonstration)
    let budgetMatch = true;
    if (filters.budget) {
       if (filters.budget.includes('8k') && h.price > 8000) budgetMatch = false;
       if (filters.budget.includes('12k') && (h.price < 8000 || h.price > 12000)) budgetMatch = false;
    }

    return locMatch && genderMatch && budgetMatch;
  });

  const isWishlisted = (id) => wishlist.some((h) => h.id === id);

  const toggleWishlist = (hostel) => {
    const next = isWishlisted(hostel.id) ? wishlist.filter((h) => h.id !== hostel.id) : [...wishlist, hostel];
    setWishlist(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
  };

  return (
    <div className="search-page-professional fade-in">
      {/* Header Section */}
      <header className="professional-header">
        <div className="header-nav-row" style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 2rem' }}>
          <button className="pro-close-btn" onClick={() => navigate('/')} aria-label="Close search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="header-content">
          <h1 className="header-title">Find Your Perfect Stay</h1>
          <p className="header-subtitle">Browse verified, premium co-living spaces with real-time availability.</p>
        </div>
      </header>

      <div className="search-layout">
        {/* Professional Sidebar */}
        <aside className="sidebar-professional">
          <div className="filter-card">
            <div className="filter-header">
              <ICONS.Amenities style={{ color: 'var(--text-muted)' }} />
              <h3>Search Filters</h3>
            </div>

            <div className="filter-sections">
              {/* Location */}
              <div className="filter-group">
                <div className="group-label">
                  <ICONS.Location /> <span>Location</span>
                </div>
                <select value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="pro-select">
                  <option value="bengaluru">Bengaluru</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="mumbai">Mumbai</option>
                </select>
              </div>


              {/* Gender Preference */}
              <div className="filter-group">
                <div className="group-label">
                  <ICONS.Gender /> <span>Gender Preference</span>
                </div>
                <div className="gender-toggle-group">
                  {['All', 'Boys', 'Girls', 'Mixed'].map(g => (
                    <button key={g} onClick={() => setFilters({...filters, gender: g})} className={`gender-btn ${filters.gender === g ? 'active' : ''}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget Categories Table-like layout */}
              <div className="filter-group">
                <div className="group-label">
                  <ICONS.Budget /> <span>Budget Segments</span>
                </div>
                <div className="pro-filter-table">
                  {[
                    { label: '₹0 - ₹5k', value: 'budget-1' },
                    { label: '₹5k - ₹10k', value: 'budget-2' },
                    { label: '₹10k - ₹15k', value: 'budget-3' },
                    { label: '₹15k+', value: 'budget-4' }
                  ].map(item => (
                    <label key={item.value} className="pro-table-row">
                      <input type="radio" name="budget-seg" />
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
                      <input type="checkbox" />
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
                      <input type="checkbox" />
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

        {/* Results Main Area */}
        <main className="results-professional">
          {loading ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '5rem' }}>
              <div className="loading-spinner">Discovering stays...</div>
            </div>
          ) : filteredHostels.length === 0 ? (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '5rem' }}>
              <h2>No hostels found matching your criteria.</h2>
              <p>Try adjusting your filters or location.</p>
            </div>
          ) : (
            filteredHostels.map(hostel => (
              <div key={hostel.id} className="pro-hostel-card">
                <div className="pro-card-image" style={{ backgroundImage: `url(${hostel.image})` }}>
                  <div className="rating-tag">{hostel.rating} ★</div>
                  <button className={`wishlist-icon ${isWishlisted(hostel.id) ? 'active' : ''}`} onClick={() => toggleWishlist(hostel)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted(hostel.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>
                <div className="pro-card-content">
                  <div className="pro-card-header">
                    <div>
                      <h2 className="hostel-name">{hostel.name}</h2>
                      <p className="hostel-loc"><ICONS.Location style={{width: '12px', height: '12px'}} /> {hostel.location}</p>
                    </div>
                    <div className="gender-tag">{hostel.gender}</div>
                  </div>

                  <div className="hostel-specs">
                    <div className="spec-item">{hostel.type}</div>
                    <div className="spec-item">Fully Managed</div>
                    <div className="spec-item">Verified</div>
                  </div>

                  <div className="pro-card-footer">
                    <div className="price-tag">
                      <span className="price-val">₹{hostel.price.toLocaleString()}</span>
                      <span className="price-period">/mo</span>
                    </div>
                    <div className="card-actions">
                      <button className="btn-wish-outline" onClick={() => toggleWishlist(hostel)}>
                        {isWishlisted(hostel.id) ? 'Saved' : 'Wishlist'}
                      </button>
                      <Link to={`/listing/${hostel.id}`} className="btn-details">Details</Link>
                    </div>
                  </div>
                </div>
              </div>
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
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .pro-close-btn:hover {
          background: var(--accent-error);
          color: white;
          border-color: var(--accent-error);
          transform: rotate(90deg) scale(1.1);
          box-shadow: 0 8px 20px rgba(244, 63, 94, 0.3);
        }

        .header-title {
          font-size: 2.8rem;
          font-weight: 900;
          letter-spacing: -1.5px;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .header-subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
        }

        .search-layout {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 3rem;
          align-items: start;
        }

        .sidebar-professional {
          position: sticky;
          top: 100px;
        }

        .filter-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 28px;
          padding: 2.2rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.05);
        }

        .filter-header {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1.2rem;
        }

        .filter-header h3 {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0;
        }

        .filter-group {
          margin-bottom: 1.5rem;
        }

        .group-label {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 1rem;
        }

        .pro-select {
          width: 100%;
          padding: 1rem 1.2rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          color: var(--text-primary);
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .budget-value {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .pro-range {
          width: 100%;
          height: 6px;
          background: var(--bg-tertiary);
          border-radius: 10px;
          appearance: none;
          outline: none;
          accent-color: var(--accent-primary);
        }

        .range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
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
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .gender-btn.active {
          background: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
          box-shadow: 0 4px 15px rgba(14, 165, 233, 0.25);
        }

        .amenities-checklist {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem;
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
          gap: 0.8rem;
          padding: 0.8rem 1.2rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          color: var(--text-secondary);
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .amenity-checkbox input:checked + .checkbox-content {
          background: rgba(34, 197, 94, 0.1);
          border-color: #22c55e;
          color: #22c55e;
        }

        .apply-btn {
          width: 100%;
          padding: 1.2rem;
          background: var(--text-primary);
          color: var(--bg-primary);
          border: none;
          border-radius: 18px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .apply-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        /* Pro Filter Table Styles */
        .pro-filter-table {
          background: var(--bg-tertiary);
          border: 1px solid var(--border-color);
          border-radius: 20px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .pro-table-row {
          display: block;
          cursor: pointer;
          border-bottom: 1px solid var(--border-color);
          border-right: 1px solid var(--border-color);
          transition: all 0.2s ease;
        }

        .pro-table-row:nth-child(2n) {
          border-right: none;
        }

        .pro-table-row:last-child {
          border-bottom: none;
        }

        .pro-table-row input {
          display: none;
        }

        .row-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 1rem;
        }

        .row-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--text-secondary);
        }

        .row-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .row-radio-custom, .row-check-custom {
          width: 16px;
          height: 16px;
          border: 2px solid var(--border-color);
          border-radius: 50%;
          position: relative;
          transition: all 0.2s ease;
        }

        .row-check-custom {
          border-radius: 6px;
        }

        .pro-table-row input:checked + .row-content {
          background: rgba(14, 165, 233, 0.05);
        }

        .pro-table-row input:checked + .row-content .row-radio-custom {
          border-color: var(--accent-primary);
        }

        .pro-table-row input:checked + .row-content .row-radio-custom::after {
          content: '';
          position: absolute;
          top: 3px;
          left: 3px;
          width: 6px;
          height: 6px;
          background: var(--accent-primary);
          border-radius: 50%;
        }

        .pro-table-row input:checked + .row-content .row-check-custom {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
        }

        .pro-table-row input:checked + .row-content .row-check-custom::after {
          content: '✓';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-size: 0.75rem;
          font-weight: 900;
        }

        .pro-table-row:hover {
          background: rgba(255, 255, 255, 0.03);
        }

        .results-professional {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.2rem;
        }

        .pro-hostel-card {
          display: flex;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 32px;
          overflow: hidden;
          transition: all 0.4s ease;
          height: 320px;
        }

        .pro-hostel-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.08);
          border-color: var(--accent-primary);
        }

        .pro-card-image {
          width: 400px;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .rating-tag {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: #22c55e;
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.9rem;
        }

        .wishlist-icon {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 44px;
          height: 44px;
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
        }

        .wishlist-icon.active {
          background: #ef4444;
          color: white;
        }

        .pro-card-content {
          flex: 1;
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hostel-name {
          font-size: 2.2rem;
          font-weight: 900;
          margin: 0;
          color: var(--text-primary);
          letter-spacing: -1px;
        }

        .hostel-loc {
          color: var(--text-muted);
          font-size: 1rem;
          margin: 0.5rem 0 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .gender-tag {
          padding: 0.5rem 1.2rem;
          background: var(--bg-tertiary);
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--accent-primary);
          text-transform: uppercase;
        }

        .pro-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .hostel-specs {
          display: flex;
          gap: 1.5rem;
          margin: 1.5rem 0;
        }

        .spec-item {
          font-size: 0.9rem;
          color: var(--text-secondary);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .spec-item::before {
          content: '•';
          color: var(--accent-primary);
          font-size: 1.5rem;
        }

        .pro-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
        }

        .price-val {
          font-size: 2.4rem;
          font-weight: 950;
          color: var(--text-primary);
        }

        .price-period {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-left: 0.4rem;
        }

        .card-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-wish-outline {
          padding: 0.8rem 1.5rem;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 14px;
          color: var(--text-secondary);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-details {
          padding: 0.8rem 2.2rem;
          background: var(--accent-primary);
          color: white;
          text-decoration: none;
          border-radius: 14px;
          font-weight: 800;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
        }

        .btn-details:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(14, 165, 233, 0.3);
        }

        @media (max-width: 1024px) {
          .search-layout { grid-template-columns: 1fr; }
          .pro-hostel-card { flex-direction: column; height: auto; }
          .pro-card-image { width: 100%; height: 250px; }
        }
      `}</style>
    </div>
  );
};

export default Search;
