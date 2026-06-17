import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import './Search.css';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';
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

const BUDGET_OPTIONS = [
  { label: 'Any Budget', value: 'all' },
  { label: 'Under ₹8k', value: 'under-8k' },
  { label: '₹8k – ₹12k', value: '8k-12k' },
  { label: '₹12k – ₹18k', value: '12k-18k' },
  { label: 'Above ₹18k', value: 'above-18k' },
];

const HOSTEL_TYPE_OPTIONS = ['Any Hostel', "Men's", "Women's", 'Co-living'];

const SHARING_OPTIONS = ['No Pref', 'Single', '2 Sharing', '3 Sharing', '4 Sharing', '5 Sharing', '6 Sharing', 'Dormitory', 'Other'];

const filterByBudget = (price, budgetVal) => {
  if (budgetVal === 'all') return true;
  if (budgetVal === 'under-8k') return price < 8000;
  if (budgetVal === '8k-12k') return price >= 8000 && price <= 12000;
  if (budgetVal === '12k-18k') return price > 12000 && price <= 18000;
  if (budgetVal === 'above-18k') return price > 18000;
  return true;
};

const HostelCard = ({ hostel, isWishlisted, toggleWishlist, onImageClick }) => {
  const [imgIdx, setImgIdx] = useState(0);

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

  return (
    <div className="search-hostel-card-pro">
      <div className="card-media-side" onClick={() => onImageClick(currentImage)} style={{ cursor: 'zoom-in' }}>
        <img src={currentImage} alt={hostel.name} className="hostel-main-img" style={{ transition: 'opacity 0.5s ease-in-out' }} />
        <div className="card-image-overlays">
          <div className="badge-row-top">
            {hostel.popularityLabel && <span className="label-demand">{hostel.popularityLabel}</span>}
            <span className="label-available">Available</span>
          </div>
          <button
            className={`wish-action-btn ${isWishlisted ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); toggleWishlist(hostel); }}
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
            <span className="price-val-pro">₹{(hostel.price || 0).toLocaleString()}</span>
            <span className="price-per-pro">/month</span>
          </div>
          {hostel.hostelType && (
            <div className="occupancy-stack-pro">
              <span className="occ-label-pro"><ICONS.Home /> Type</span>
              <span className="occ-val-pro">{hostel.hostelType}</span>
            </div>
          )}
        </div>

        <div className="amenities-footer-row">
          <div className="amenity-mini-tags">
            {(hostel.amenities || ['WiFi', 'Security', 'Food']).slice(0, 3).map(a => (
              <span key={a} className="tag-pro">{a}</span>
            ))}
            {(hostel.amenities || []).length > 3 && (
              <span className="tag-more">+{(hostel.amenities || []).length - 3} More</span>
            )}
          </div>
        </div>

        <div className="card-actions-row-pro">
          <Link to={`/listing/${hostel.id}`} className="btn-secondary-pro">View Details</Link>
          <Link to={`/booking/${hostel.id}`} state={{ basePrice: hostel.price }} className="btn-primary-pro">Book Now</Link>
        </div>
      </div>
    </div>
  );
};

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const qLocation = queryParams.get('location') || 'all';
  const qBudget = queryParams.get('budget') || 'all';
  const qHostelType = queryParams.get('hostelType') || 'all';
  const qStayType = queryParams.get('stayType') || 'all';

  // Map home page budget labels to our internal values
  const mapHomeBudget = (b) => {
    if (!b || b === 'all') return 'all';
    if (b === 'Under ₹8k') return 'under-8k';
    if (b === '₹8k–₹12k') return '8k-12k';
    if (b === '₹12k–₹18k') return '12k-18k';
    if (b === 'Above ₹18k') return 'above-18k';
    return b; // already an internal value
  };

  const [filters, setFilters] = useState({
    location: qLocation !== 'all' ? qLocation : '',
    budget: mapHomeBudget(qBudget),
    hostelType: qHostelType !== 'all' ? qHostelType : '',
    sharing: qStayType !== 'all' ? qStayType : '',
  });

  const [wishlist, setWishlist] = useState([]);
  const [allHostels, setAllHostels] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, image: '' });
  const hostelsPerPage = 5;

  const fetchHostels = async () => {
    try {
      const [response, wishRes] = await Promise.all([
        API.get('/buildings/public').catch(() => ({ data: [] })),
        API.get('/tenant-portal/wishlist').catch(() => ({ data: [] }))
      ]);

      setWishlist(Array.isArray(wishRes.data) ? wishRes.data : []);

      let mapped = [];
      if (response.data && Array.isArray(response.data)) {
        mapped = response.data.map(b => ({
          id: b._id,
          name: b.name,
          location: b.address || b.location || 'Location unknown',
          city: (b.locationCity || 'bengaluru').toLowerCase(),
          price: b.startingPrice || 5000,
          hostelType: b.genderType || b.category || '',
          sharing: b.sharing || b.roomType || '',
          rating: b.rating ? b.rating.toFixed(1) : (4.0 + Math.random() * 0.9).toFixed(1),
          popularityLabel: b.rating > 4.6 ? 'High Demand' : null,
          images: b.images && b.images.length > 0
            ? b.images.map(img => (img.startsWith('http') || img.startsWith('data:')) ? img : `http://localhost:5000${img}`)
            : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'],
          amenities: b.amenities || [],
        }));
      }

      setAllHostels(mapped);
      setHostels(mapped);
    } catch (err) {
      console.error('Error fetching hostels:', err);
      setAllHostels([]);
      setHostels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostels();
    connectSocket();
    socket.on('hostelUpdated', () => { fetchHostels(); });
    return () => { socket.off('hostelUpdated'); disconnectSocket(); };
  }, []);

  useEffect(() => {
    let filtered = [...allHostels];      

    if (filters.location) {
      const loc = filters.location.toLowerCase();      
      filtered = filtered.filter(h =>
        (h.city || '').toLowerCase().includes(loc) ||
        (h.location || '').toLowerCase().includes(loc) ||     
        (h.name || '').toLowerCase().includes(loc)
      );
    }   

    if (filters.budget && filters.budget !== 'all') {
      filtered = filtered.filter(h => filterByBudget(h.price, filters.budget));
    }

    if (filters.hostelType && filters.hostelType !== 'Any Hostel') {
      filtered = filtered.filter(h =>
        (h.hostelType || '').toLowerCase().includes(filters.hostelType.toLowerCase().replace("'s", ''))
      );
    }

    if (filters.sharing && filters.sharing !== 'No Pref') {
      filtered = filtered.filter(h =>
        (h.sharing || '').toLowerCase().includes(filters.sharing.toLowerCase())
      );
    }

    setHostels(filtered);
    setCurrentPage(1);
  }, [filters, allHostels]);

  const indexOfLastHostel = currentPage * hostelsPerPage;
  const indexOfFirstHostel = indexOfLastHostel - hostelsPerPage;
  const currentHostels = hostels.slice(indexOfFirstHostel, indexOfLastHostel);
  const totalPages = Math.ceil(hostels.length / hostelsPerPage);

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
          hostelImage: hostel.images && hostel.images.length > 0 ? hostel.images[0] : '',
          hostelRating: hostel.rating,
          type: hostel.hostelType
        });
        setWishlist(prev => [...prev, res.data]);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  const isWishlisted = (id) => wishlist.some((h) => (h.hostelId === id || h.id === id));

  const activeFilterCount = [
    filters.location,
    filters.budget && filters.budget !== 'all' ? filters.budget : '',
    filters.hostelType && filters.hostelType !== 'Any Hostel' ? filters.hostelType : '',
    filters.sharing && filters.sharing !== 'No Pref' ? filters.sharing : '',
  ].filter(Boolean).length;

  const clearAllFilters = () => setFilters({ location: '', budget: 'all', hostelType: '', sharing: '' });

  return (
    <div className="search-page-pro">
      {/* ── Header ── */}
      <header className="search-header-pro">
        <div className="header-icon-box"><ICONS.Search /></div>
        <div className="search-header-text">
          <h1>Find Your Perfect Stay</h1>
          <p className="header-subtitle">Verified co-living spaces with real-time availability across top cities.</p>
        </div>
        <div className="search-results-count">
          {!loading && <span><strong>{hostels.length}</strong> stays found</span>}
        </div>
      </header>

      {/* ── Mobile Filter Toggle ── */}
      <div className="mobile-filter-trigger">
        <button className="btn-filter-toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <ICONS.Filter />
          <span>Filters & Preferences</span>
          {activeFilterCount > 0 && <div className="filter-count-badge">{activeFilterCount}</div>}
        </button>
      </div>

      <div className={`search-main-layout ${isFilterOpen ? 'filter-open' : ''}`}>
        {/* ── Sidebar Filters ── */}
        <aside className="search-sidebar-pro">
          <div className="sidebar-header-mobile">
            <h3>Refine Search</h3>
            <button className="close-filter-btn" onClick={() => setIsFilterOpen(false)}>✕</button>
          </div>

          <div className="filter-card-premium">
            <div className="filter-card-header">
              <ICONS.Filter />
              <h3>Filters</h3>
              {activeFilterCount > 0 && (
                <button className="filter-reset-btn" onClick={clearAllFilters}>
                  <ICONS.Reset /> Clear all
                </button>
              )}
            </div>

            {/* Location */}
            <div className="filter-section-pro">
              <label className="section-label-pro"><ICONS.Location /> Location</label>
              <div className="select-wrapper-pro">
                <select value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })}>
                  <option value="">All Cities</option>
                  <option value="bengaluru">Bengaluru</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="pune">Pune</option>
                  <option value="delhi">Delhi</option>
                  <option value="chennai">Chennai</option>
                  <option value="noida">Noida</option>
                  <option value="gurgaon">Gurgaon</option>
                </select>
              </div>
            </div>

            {/* Budget */}
            <div className="filter-section-pro">
              <label className="section-label-pro"><ICONS.Budget /> Monthly Budget</label>
              <div className="budget-option-list">
                {BUDGET_OPTIONS.map(item => (
                  <label key={item.value} className={`budget-radio-row ${filters.budget === item.value ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="budget"
                      checked={filters.budget === item.value}
                      onChange={() => setFilters({ ...filters, budget: item.value })}
                    />
                    <span className="radio-custom-pro"></span>
                    <span className="radio-label-text">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Hostel Type */}
            <div className="filter-section-pro">
              <label className="section-label-pro"><ICONS.Home /> Hostel Type</label>
              <div className="pill-group">
                {HOSTEL_TYPE_OPTIONS.map(t => (
                  <button
                    key={t}
                    className={`pill-btn ${(filters.hostelType === t) || (!filters.hostelType && t === 'Any Hostel') ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, hostelType: t === 'Any Hostel' ? '' : t })}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Sharing */}
            <div className="filter-section-pro">
              <label className="section-label-pro"><ICONS.Sharing /> Sharing Type</label>
              <div className="sharing-grid-3x3">
                {SHARING_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    className={`sharing-grid-btn ${(filters.sharing === opt) || (!filters.sharing && opt === 'No Pref') ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, sharing: opt === 'No Pref' ? '' : opt })}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-apply-filters"
              onClick={() => { setIsFilterOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
          </div>
        </aside>

        {/* ── Results ── */}
        <main className="search-results-pro">
          {loading ? (
            <div className="loading-placeholder-grid">
              <div className="premium-spinner"></div>
              <p>Discovering premium stays for you...</p>
            </div>
          ) : hostels.length === 0 ? (
            <div className="no-results-card">
              <div className="empty-visual"><ICONS.Search /></div>
              <h3>No Hostels Found</h3>
              <p>Try adjusting your filters or searching in a different city.</p>
              <button className="btn-secondary-pro" onClick={clearAllFilters}>Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="results-grid-pro">
                {currentHostels.map(h => (
                  <HostelCard
                    key={h.id}
                    hostel={h}
                    isWishlisted={isWishlisted(h.id)}
                    toggleWishlist={toggleWishlist}
                    onImageClick={(img) => setModalInfo({ isOpen: true, image: img })}
                  />
                ))}
              </div>

              {totalPages > 1 && (
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

export default Search;
