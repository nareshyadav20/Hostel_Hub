import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import './Wishlist.css';
import ImageModal from '../components/ImageModal';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, image: '' });

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await API.get('/tenant-portal/wishlist').catch(() => ({
          data: [
            { _id: '1', hostelId: '101', hostelName: 'Alpha Tower', hostelLocation: 'Alpha Tower Street, Bengaluru', hostelPrice: 16700, gender: 'Boys', type: 'Premium', hostelImage: 'https://images.unsplash.com/photo-1555854817-5b27344481c7?auto=format&fit=crop&q=80&w=1000' },
            { _id: '2', hostelId: '102', hostelName: 'Cyber Hub Stay', hostelLocation: 'Cyber Hub Street, Pune', hostelPrice: 19100, gender: 'Boys', type: 'Student', hostelImage: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000' },
            { _id: '3', hostelId: '103', hostelName: 'Theta Terraces', hostelLocation: 'Theta Terraces Street, Hyderabad', hostelPrice: 15500, gender: 'Girls', type: 'Professional', hostelImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1000' }
          ]
        }));
        setWishlist(res.data || []);
      } catch (err) {
        console.error('Error fetching wishlist:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      await API.delete(`/tenant-portal/wishlist/${id}`);
      setWishlist((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  if (loading) return (
    <div className="staynest-dashboard loading-state">
      <div className="premium-spinner"></div>
      <p>Gathering your favorites...</p>
    </div>
  );

  return (
    <div className="wishlist-page">
      <header className="wishlist-header">
        <div className="header-icon-main">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <div>
          <h1>My Wishlist</h1>
          <p className="header-subtitle">{wishlist.length} saved properties ready for booking.</p>
        </div>
      </header>

      {wishlist.length === 0 ? (
        <div className="sn-card empty-wishlist-card">
          <div className="empty-visual">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </div>
          <h3>Your wishlist is empty</h3>
          <p>Explore verified hostels and save your favorites here for later.</p>
          <Link to="/search" className="btn-primary btn-large">Browse Hostels</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((hostel) => (
            <div key={hostel._id} className="wishlist-card-premium">
              <div
                className="card-image-section"
                style={{
                  backgroundImage: `url(${hostel.hostelImage && (hostel.hostelImage.startsWith('http') || hostel.hostelImage.startsWith('data:')) ? hostel.hostelImage : hostel.hostelImage ? `https://livora-hostel-hub-1.onrender.com${hostel.hostelImage}` : ''})`,
                  cursor: 'zoom-in'
                }}
                onClick={() => {
                  const imgUrl = hostel.hostelImage && (hostel.hostelImage.startsWith('http') || hostel.hostelImage.startsWith('data:')) ? hostel.hostelImage : hostel.hostelImage ? `https://livora-hostel-hub-1.onrender.com${hostel.hostelImage}` : '';
                  setModalInfo({ isOpen: true, image: imgUrl });
                }}
              >
                <div className="card-overlay-badges">
                  <span className="availability-badge">Available</span>
                  <button className="remove-btn-overlay" onClick={(e) => { e.stopPropagation(); handleRemove(hostel._id); }} title="Remove from wishlist">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                      <path d="M10 11v6"></path><path d="M14 11v6"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="card-details-section">
                <div className="card-info-top">
                  <h3 className="hostel-name">{hostel.hostelName}</h3>
                  <p className="hostel-loc-pro">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {hostel.hostelLocation}
                  </p>

                  <div className="spec-tags">
                    <span className="spec-pill gender">{hostel.gender}</span>
                    <span className="spec-pill type">{hostel.type}</span>
                    <span className="spec-pill verified">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Verified
                    </span>
                  </div>
                </div>

                <div className="card-pricing-footer">
                  <div className="price-stack">
                    <span className="price-amount">₹{hostel.hostelPrice?.toLocaleString()}</span>
                    <span className="price-label">per month</span>
                  </div>
                  <div className="action-button-group">
                    <Link to={`/listing/${hostel.hostelId || hostel._id}`} className="btn-primary-small">Select Room</Link>
                    <Link to={`/listing/${hostel.hostelId || hostel._id}`} className="btn-secondary-small">Details</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ImageModal
        isOpen={modalInfo.isOpen}
        image={modalInfo.image}
        onClose={() => setModalInfo({ isOpen: false, image: '' })}
      />
    </div>
  );
};

export default Wishlist;
