import React, { useState, useEffect } from 'react';
import HostelIcon from '../components/HostelIcon';
import { Link } from 'react-router-dom';

const ICON_MAP = { 1: 'sunshine', 2: 'elite', 3: 'green' };

const Wishlist = () => {
  /* ── Load from localStorage (source of truth) ── */
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); }
    catch { return []; }
  });

  /* Keep localStorage in sync whenever list changes */
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const handleRemove = (id) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBookNow = (name) => alert(`Redirecting to booking for ${name}…`);

  return (
    <div className="wishlist-page fade-in">

      {/* ── Header ── */}
      <header style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
          stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', lineHeight: 1.1 }}>Your Wishlist</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            {wishlist.length} saved {wishlist.length === 1 ? 'hostel' : 'hostels'} — book when you're ready.
          </p>
        </div>
      </header>

      {/* ── Empty State ── */}
      {wishlist.length === 0 && (
        <div className="glass-card fade-in" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none"
            stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ marginBottom: '1.5rem', opacity: 0.35 }}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Your wishlist is empty</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Browse hostels and click the <strong>Wishlist</strong> button to save your favourites here.
          </p>
          <Link to="/search" className="btn btn-primary" style={{ padding: '0.8rem 2rem' }}>Browse Hostels</Link>
        </div>
      )}

      {/* ── Grid ── */}
      {wishlist.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.8rem' }}>
          {wishlist.map((item) => (
            <div key={item.id} className="glass-card wishlist-card"
              style={{ padding: 0, overflow: 'hidden', borderRadius: '20px', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>

              {/* Image area */}
              <div style={{ height: '180px', background: 'linear-gradient(135deg, var(--bg-tertiary), var(--bg-secondary))', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                <HostelIcon name={ICON_MAP[item.id] || 'sunshine'} width={100} height={100} />

                {/* Remove (trash) button */}
                <button
                  onClick={() => handleRemove(item.id)}
                  title="Remove from Wishlist"
                  style={{
                    position: 'absolute', top: '0.9rem', right: '0.9rem',
                    width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                    background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#ef4444'; }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                  </svg>
                </button>

                {/* Rating badge (if available) */}
                {item.rating && (
                  <span style={{ position: 'absolute', top: '0.9rem', left: '0.9rem', background: '#22c55e', color: '#fff', padding: '0.25rem 0.65rem', borderRadius: '7px', fontWeight: '800', fontSize: '0.8rem' }}>
                    {item.rating} ★
                  </span>
                )}
              </div>

              {/* Card body */}
              <div style={{ padding: '1.4rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.3rem' }}>{item.name}</h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {item.location}
                </p>

                {/* Tags */}
                {(item.gender || item.type) && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.1rem', flexWrap: 'wrap' }}>
                    {item.gender && <span style={{ fontSize: '0.76rem', background: 'rgba(56,189,248,0.12)', color: 'var(--accent-primary)', padding: '0.28rem 0.7rem', borderRadius: '7px', fontWeight: '700' }}>{item.gender}</span>}
                    {item.type && <span style={{ fontSize: '0.76rem', background: 'rgba(99,102,241,0.12)', color: 'var(--accent-secondary)', padding: '0.28rem 0.7rem', borderRadius: '7px', fontWeight: '700' }}>{item.type}</span>}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>₹{item.price.toLocaleString()}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}> / mo</span>
                  </div>
                  <button onClick={() => handleBookNow(item.name)} className="btn btn-primary"
                    style={{ padding: '0.55rem 1.2rem', fontSize: '0.82rem' }}>
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .wishlist-card:hover { transform: translateY(-7px); box-shadow: 0 24px 60px rgba(0,0,0,0.28); }
      `}</style>
    </div>
  );
};

export default Wishlist;
