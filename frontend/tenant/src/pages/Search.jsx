import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';
import './Search.css';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';
import ImageModal from '../components/ImageModal';

const ICONS = {
  Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  Location: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>,
  Gender: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
  Budget: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="20"></line><line x1="12" y1="4" x2="12" y2="6"></line></svg>,
  Filter: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>,
  Star: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
  Occupancy: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
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

  const currentImage = hostel.images && hostel.images.length > 0 ? hostel.images[imgIdx] : 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800';

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
          </div>
          <div className="occupancy-stack-pro">
            <span className="occ-label-pro"><ICONS.Occupancy /> Occupancy</span>
            <span className="occ-val-pro">{hostel.occupancy}</span>
          </div>
        </div>

        <div className="amenities-footer-row">
          <div className="amenity-mini-tags">
            <span className="tag-pro">WiFi</span>
            <span className="tag-pro">Security</span>
            <span className="tag-pro">Food</span>
            <span className="tag-more">+8 More</span>
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
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, image: '' });
  const hostelsPerPage = 4;

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
          gender: b.genderType || 'Mixed',
          category: (b.category || 'Student').toLowerCase(),
          type: 'Premium',
          rating: b.rating || (4.0 + Math.random()).toFixed(1),
          popularityLabel: b.rating > 4.6 ? 'High Demand' : null,
          occupancy: '70%',
          images: b.images && b.images.length > 0 ? b.images.map(img => (img.startsWith('http') || img.startsWith('data:')) ? img : `http://localhost:5000${img}`) : ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800'],
          amenities: b.amenities || []
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

    // Real-time synchronization
    connectSocket(); // Global room
    socket.on('hostelUpdated', () => {
      console.log('🔄 Search results updating in real-time');
      fetchHostels();
    });

    return () => {
      socket.off('hostelUpdated');
      disconnectSocket();
    };
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
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter(h => filters.categories.includes((h.category || 'student').toLowerCase()));
    }
    setHostels(filtered);
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [filters, allHostels]);

  // Pagination Logic
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
          // Use the first image from the images array if available
          hostelImage: hostel.images && hostel.images.length > 0 ? hostel.images[0] : '',
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

  const isWishlisted = (id) => wishlist.some((h) => (h.hostelId === id || h.id === id));

  return (
    <div className="search-page-pro">
      <header className="search-header-pro">
        <div className="header-icon-box">
          <ICONS.Search />
        </div>
        <div>
          <h1>Find Your Perfect Stay</h1>
          <p className="header-subtitle">Verified co-living spaces with real-time availability across top cities.</p>
        </div>
      </header>

      {/* Mobile Filter Toggle */}
      <div className="mobile-filter-trigger">
        <button className="btn-filter-toggle" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <ICONS.Filter />
          <span>Filters & Preferences</span>
          <div className="filter-count-badge">{Object.values(filters).filter(v => v !== 'all' && v !== 'All' && (Array.isArray(v) ? v.length > 0 : true)).length}</div>
        </button>
      </div>

      <div className={`search-main-layout ${isFilterOpen ? 'filter-open' : ''}`}>
        <aside className="search-sidebar-pro">
          <div className="sidebar-header-mobile">
            <h3>Refine Search</h3>
            <button className="close-filter-btn" onClick={() => setIsFilterOpen(false)}>✕</button>
          </div>
          <div className="filter-card-premium">
            <div className="filter-card-header">
              <ICONS.Filter />
              <h3>Filters</h3>
            </div>

            <div className="filter-section-pro">
              <label className="section-label-pro"><ICONS.Location /> Location</label>
              <div className="select-wrapper-pro">
                <select value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })}>
                  <option value="all">All Cities</option>
                  <option value="bengaluru">Bengaluru</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="pune">Pune</option>
                  <option value="delhi">Delhi</option>
                  <option value="chennai">Chennai</option>
                </select>
              </div>
            </div>

            <div className="filter-section-pro">
              <label className="section-label-pro"><ICONS.Gender /> Gender Preference</label>
              <div className="gender-pill-group">
                {['All', 'Boys', 'Girls', 'Mixed'].map(g => (
                  <button
                    key={g}
                    className={`gender-pill-btn ${filters.gender === g ? 'active' : ''}`}
                    onClick={() => setFilters({ ...filters, gender: g })}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-section-pro">
              <label className="section-label-pro"><ICONS.Budget /> Monthly Budget</label>
              <div className="budget-option-list">
                {[
                  { label: 'All Budgets', value: 'all' },
                  { label: 'Under ₹5,000', value: 'budget-1' },
                  { label: '₹5k - ₹10k', value: 'budget-2' },
                  { label: '₹10k - ₹15k', value: 'budget-3' },
                  { label: 'Above ₹15,000', value: 'budget-4' }
                ].map(item => (
                  <label key={item.value} className="budget-radio-row">
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

            <button className="btn-primary btn-large" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Apply Filters
            </button>
          </div>
        </aside>

        <main className="search-results-pro">
          {loading ? (
            <div className="loading-placeholder-grid">
              <div className="premium-spinner"></div>
              <p>Discovering premium stays for you...</p>
            </div>
          ) : hostels.length === 0 ? (
            <div className="no-results-card">
              <div className="empty-visual">
                <ICONS.Search />
              </div>
              <h3>No Hostels Found</h3>
              <p>Try adjusting your filters or searching in a different city.</p>
              <button className="btn-secondary-pro" onClick={() => setFilters({ location: 'all', budget: 'all', gender: 'All', categories: [], amenities: [] })}>Clear All Filters</button>
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination-wrapper-pro">
                  <div className="pagination-info-pro">
                    Showing <strong>{indexOfFirstHostel + 1}–{Math.min(indexOfLastHostel, hostels.length)}</strong> of <strong>{hostels.length}</strong> stays
                  </div>

                  <div className="pagination-pro">
                    {/* First Page */}
                    <button
                      disabled={currentPage === 1}
                      onClick={() => { setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="pagi-btn pagi-edge"
                      title="First page"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>
                    </button>

                    {/* Previous Page */}
                    <button
                      disabled={currentPage === 1}
                      onClick={() => { setCurrentPage(prev => prev - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="pagi-btn"
                      title="Previous page"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>

                    <div className="pagi-numbers">
                      {(() => {
                        const pages = [];
                        const maxVisible = 5;
                        let startPage, endPage;

                        if (totalPages <= maxVisible + 2) {
                          startPage = 1;
                          endPage = totalPages;
                        } else {
                          if (currentPage <= Math.ceil(maxVisible / 2) + 1) {
                            startPage = 1;
                            endPage = maxVisible;
                          } else if (currentPage >= totalPages - Math.floor(maxVisible / 2)) {
                            startPage = totalPages - maxVisible + 1;
                            endPage = totalPages;
                          } else {
                            startPage = currentPage - Math.floor(maxVisible / 2);
                            endPage = currentPage + Math.floor(maxVisible / 2);
                          }
                        }

                        // First page always shown
                        if (startPage > 1) {
                          pages.push(
                            <button key={1} onClick={() => { setCurrentPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`pagi-num ${currentPage === 1 ? 'active' : ''}`}>1</button>
                          );
                          if (startPage > 2) {
                            pages.push(<span key="ellipsis-start" className="pagi-ellipsis">•••</span>);
                          }
                        }

                        // Page numbers
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button
                              key={i}
                              onClick={() => { setCurrentPage(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                              className={`pagi-num ${currentPage === i ? 'active' : ''}`}
                            >
                              {i}
                            </button>
                          );
                        }

                        // Last page always shown
                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(<span key="ellipsis-end" className="pagi-ellipsis">•••</span>);
                          }
                          pages.push(
                            <button key={totalPages} onClick={() => { setCurrentPage(totalPages); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`pagi-num ${currentPage === totalPages ? 'active' : ''}`}>{totalPages}</button>
                          );
                        }

                        return pages;
                      })()}
                    </div>

                    {/* Next Page */}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => { setCurrentPage(prev => prev + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="pagi-btn"
                      title="Next page"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>

                    {/* Last Page */}
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => { setCurrentPage(totalPages); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="pagi-btn pagi-edge"
                      title="Last page"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
                    </button>
                  </div>

                  <div className="pagination-page-indicator">
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
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
