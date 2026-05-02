import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

/* ─── expanded hostel data ─── */
const HOSTELS = [
  { 
    id: 1, 
    name: 'Sunshine Residency', 
    location: 'Bengaluru', 
    subLoc: 'Near City College', 
    price: 6500, 
    gender: 'Boys', 
    type: '2 Sharing', 
    rating: 4.8, 
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  { 
    id: 2, 
    name: 'Elite Living', 
    location: 'Bengaluru', 
    subLoc: 'Tech Park Area', 
    price: 8500, 
    gender: 'Girls', 
    type: 'Single', 
    rating: 4.5, 
    images: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1502672260266-1c1c24240938?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  { 
    id: 3, 
    name: 'Green View Hostel', 
    location: 'Bengaluru', 
    subLoc: 'Green Valley', 
    price: 5000, 
    gender: 'Mixed', 
    type: '4 Sharing', 
    rating: 4.2, 
    images: [
      'https://images.unsplash.com/photo-1623625434462-e5e42318ae49?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1502672260266-1c1c24240938?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  { 
    id: 4, 
    name: 'Metro Suites', 
    location: 'Hyderabad', 
    subLoc: 'Hitech City', 
    price: 12000, 
    gender: 'Mixed', 
    type: 'Single', 
    rating: 4.9, 
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1623625434462-e5e42318ae49?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  { 
    id: 5, 
    name: 'Royal Palace', 
    location: 'Mumbai', 
    subLoc: 'Andheri West', 
    price: 15000, 
    gender: 'Girls', 
    type: '2 Sharing', 
    rating: 4.7, 
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1c24240938?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000'
    ]
  },
  { 
    id: 6, 
    name: 'Skyline Dorms', 
    location: 'Hyderabad', 
    subLoc: 'Gachibowli', 
    price: 7500, 
    gender: 'Boys', 
    type: '3 Sharing', 
    rating: 4.4, 
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1502672260266-1c1c24240938?auto=format&fit=crop&q=80&w=1000'
    ]
  }
];

/* ─── Hostel Card Component with Carousel ─── */
const HostelCard = ({ hostel, isWishlisted, toggleWishlist }) => {
  const [currentImg, setCurrentImg] = useState(0);

  // Auto-scroll images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg(prev => (prev + 1) % hostel.images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [hostel.images.length]);

  return (
    <div className="pro-hostel-card">
      <div className="pro-card-image" style={{ backgroundImage: `url(${hostel.images[currentImg]})` }}>
        <div className="rating-tag">{hostel.rating} ★</div>
        <button className={`wishlist-icon ${isWishlisted(hostel.id) ? 'active' : ''}`} onClick={() => toggleWishlist(hostel)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isWishlisted(hostel.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
        </button>
        
        {/* Carousel Indicators */}
        <div className="carousel-dots">
          {hostel.images.map((_, idx) => (
            <div key={idx} className={`dot ${currentImg === idx ? 'active' : ''}`} onClick={() => setCurrentImg(idx)}></div>
          ))}
        </div>
      </div>

      <div className="pro-card-content">
        <div className="pro-card-header">
          <div>
            <h2 className="hostel-name">{hostel.name}</h2>
            <p className="hostel-loc"><ICONS.Location style={{ width: '12px', height: '12px' }} /> {hostel.subLoc}, {hostel.location}</p>
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
  );
};

const Search = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ location: 'Bengaluru', budget: 'all', gender: 'All' });
  const [filteredHostels, setFilteredHostels] = useState(HOSTELS);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));

  const isWishlisted = (id) => wishlist.some((h) => h.id === id);

  const toggleWishlist = (hostel) => {
    const next = isWishlisted(hostel.id) ? wishlist.filter((h) => h.id !== hostel.id) : [...wishlist, hostel];
    setWishlist(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
  };

  const handleApplyFilters = () => {
    let results = HOSTELS;

    // Filter by Location
    if (filters.location !== 'all') {
      results = results.filter(h => h.location.toLowerCase() === filters.location.toLowerCase());
    }

    // Filter by Gender
    if (filters.gender !== 'All') {
      results = results.filter(h => h.gender === filters.gender);
    }

    // Filter by Budget
    if (filters.budget === 'budget-1') results = results.filter(h => h.price <= 5000);
    else if (filters.budget === 'budget-2') results = results.filter(h => h.price > 5000 && h.price <= 10000);
    else if (filters.budget === 'budget-3') results = results.filter(h => h.price > 10000 && h.price <= 15000);
    else if (filters.budget === 'budget-4') results = results.filter(h => h.price > 15000);

    setFilteredHostels(results);
  };

  // Initial filter on load
  useEffect(() => {
    handleApplyFilters();
  }, []);

  return (
    <div className="search-page-professional fade-in">
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
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Mumbai">Mumbai</option>
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
                    { label: '₹0 - ₹5k', value: 'budget-1' },
                    { label: '₹5k - ₹10k', value: 'budget-2' },
                    { label: '₹10k - ₹15k', value: 'budget-3' },
                    { label: '₹15k+', value: 'budget-4' }
                  ].map(item => (
                    <label key={item.value} className="pro-table-row">
                      <input 
                        type="radio" 
                        name="budget-seg" 
                        value={item.value} 
                        checked={filters.budget === item.value}
                        onChange={(e) => setFilters({...filters, budget: e.target.value})}
                      />
                      <span className="row-content">
                        <span className="row-label">{item.label}</span>
                        <span className="row-radio-custom"></span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="apply-btn" onClick={handleApplyFilters}>Apply Filters</button>
            </div>
          </div>
        </aside>

        <main className="results-professional">
          {filteredHostels.length > 0 ? (
            filteredHostels.map(hostel => (
              <HostelCard 
                key={hostel.id} 
                hostel={hostel} 
                isWishlisted={isWishlisted} 
                toggleWishlist={toggleWishlist} 
              />
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--border-color)' }}>
              <ICONS.Location style={{ width: '48px', height: '48px', color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>No Hostels Found</h2>
              <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters to find more results.</p>
            </div>
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

        .pro-table-row input {
          display: none;
        }

        .row-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 1rem;
        }

        .row-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .row-radio-custom {
          width: 16px;
          height: 16px;
          border: 2px solid var(--border-color);
          border-radius: 50%;
          position: relative;
          transition: all 0.2s ease;
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
          transition: background-image 0.5s ease-in-out;
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

        .carousel-dots {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          background: rgba(255,255,255,0.4);
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s;
        }

        .dot.active {
          background: white;
          width: 20px;
          border-radius: 10px;
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
