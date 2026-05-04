import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ─── icons (SVG constants) ─── */
const ICONS = {
  Heart: (props) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  Location: (props) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Trash: (props) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Empty: (props) => <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
};

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('wishlist') || '[]'));

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => (item.id || item._id) !== id));
  };

  return (
    <div className="wishlist-page-professional fade-in">
      {/* Professional Header */}
      <header className="wishlist-header">
        <div className="header-icon-box">
          <ICONS.Heart style={{ color: 'var(--accent-primary)' }} />
        </div>
        <div className="header-text">
          <h1 className="header-title">Your Wishlist</h1>
          <p className="header-subtitle">
            {wishlist.length} saved {wishlist.length === 1 ? 'hostel' : 'hostels'} — book when you're ready.
          </p>
        </div>
      </header>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="empty-wishlist-card fade-in">
          <ICONS.Empty className="empty-icon" />
          <h3>Your wishlist is empty</h3>
          <p>Browse our verified properties and click the heart icon to save your favorites here.</p>
          <Link to="/search" className="btn-browse">Explore Hostels</Link>
        </div>
      ) : (
        <div className="wishlist-results">
          {wishlist.map((hostel) => {
            const hostelId = hostel.id || hostel._id;
            return (
              <div key={hostelId} className="pro-wishlist-card">
                <div className="pro-card-image" style={{ backgroundImage: `url(${hostel.image || 'https://images.unsplash.com/photo-1555854817-5b27344481c7?auto=format&fit=crop&q=80&w=1000'})` }}>
                  <div className="rating-tag">{hostel.rating} ★</div>
                  <button className="remove-btn" onClick={() => handleRemove(hostelId)} title="Remove from Wishlist">
                    <ICONS.Trash />
                  </button>
                </div>

                <div className="pro-card-content">
                  <div className="pro-card-header">
                    <div>
                      <h2 className="hostel-name">{hostel.name}</h2>
                      <p className="hostel-loc"><ICONS.Location /> {hostel.location}</p>
                    </div>
                    <div className="status-badge">Ready to Book</div>
                  </div>

                  <div className="hostel-specs">
                    <div className="spec-item">{hostel.gender}</div>
                    <div className="spec-item">{hostel.type}</div>
                    <div className="spec-item">Instant Confirmation</div>
                  </div>

                  <div className="pro-card-footer">
                    <div className="price-tag">
                      <span className="price-val">₹{hostel.price.toLocaleString()}</span>
                      <span className="price-period">/mo</span>
                    </div>
                    <div className="card-actions">
                      <Link to={`/booking/${hostelId}`} className="btn-book-now">Book Now</Link>
                      <Link to={`/listing/${hostelId}`} className="btn-details-outline">View Details</Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .wishlist-page-professional {
          padding: 1rem 0;
        }

        .wishlist-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 3.5rem;
        }

        .header-icon-box {
          width: 56px;
          height: 56px;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }

        .header-title {
          font-size: 2.8rem;
          font-weight: 950;
          letter-spacing: -2px;
          margin: 0;
          color: var(--text-primary);
        }

        .header-subtitle {
          font-size: 1.1rem;
          color: var(--text-muted);
          margin: 0.3rem 0 0;
        }

        .empty-wishlist-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 32px;
          padding: 6rem 2rem;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.03);
        }

        .empty-icon {
          color: var(--text-muted);
          opacity: 0.3;
          margin-bottom: 2rem;
        }

        .empty-wishlist-card h3 {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }

        .empty-wishlist-card p {
          color: var(--text-muted);
          max-width: 400px;
          margin: 0 auto 2.5rem;
          line-height: 1.6;
        }

        .btn-browse {
          display: inline-block;
          padding: 1rem 2.5rem;
          background: var(--accent-primary);
          color: white;
          text-decoration: none;
          border-radius: 16px;
          font-weight: 800;
          box-shadow: 0 10px 25px rgba(14, 165, 233, 0.25);
          transition: all 0.3s ease;
        }

        .wishlist-results {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }

        .pro-wishlist-card {
          display: flex;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: 32px;
          overflow: hidden;
          transition: all 0.4s ease;
          height: 300px;
        }

        .pro-wishlist-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.08);
          border-color: var(--accent-primary);
        }

        .pro-card-image {
          width: 380px;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .remove-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          background: rgba(239, 68, 68, 0.1);
          backdrop-filter: blur(10px);
          color: #ef4444;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: #ef4444;
          color: white;
        }

        .pro-card-content {
          flex: 1;
          padding: 2.2rem 2.8rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hostel-name {
          font-size: 2.2rem;
          font-weight: 900;
          margin: 0;
          color: var(--text-primary);
          letter-spacing: -1.2px;
        }

        .hostel-loc {
          color: var(--text-muted);
          font-size: 1rem;
          margin: 0.5rem 0 0;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-weight: 500;
        }

        .status-badge {
          padding: 0.4rem 1rem;
          background: rgba(34, 197, 94, 0.1);
          color: #16a34a;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .pro-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .hostel-specs {
          display: flex;
          gap: 1.5rem;
          margin: 1.2rem 0;
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

        .btn-book-now {
          padding: 0.8rem 2.2rem;
          background: var(--accent-primary);
          color: white;
          text-decoration: none;
          border-radius: 14px;
          font-weight: 800;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
        }

        .btn-details-outline {
          padding: 0.8rem 1.8rem;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 14px;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        @media (max-width: 900px) {
          .pro-wishlist-card { flex-direction: column; height: auto; }
          .pro-card-image { width: 100%; height: 220px; }
          .pro-card-content { padding: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default Wishlist;
