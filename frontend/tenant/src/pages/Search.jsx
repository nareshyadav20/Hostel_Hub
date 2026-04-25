import React, { useState } from 'react';
import HostelIcon from '../components/HostelIcon';
import { Link } from 'react-router-dom';

/* ─── icon name map ─── */
const ICON_MAP = { 1: 'sunshine', 2: 'elite', 3: 'green' };

/* ─── hostel data ─── */
const HOSTELS = [
  { id: 1, name: 'Sunshine Residency', location: 'Near City College', price: 6500,  gender: 'Boys',      type: '2 Sharing', rating: 4.5 },
  { id: 2, name: 'Elite Living',        location: 'Tech Park Area',    price: 8500,  gender: 'Girls',     type: 'Single',    rating: 4.8 },
  { id: 3, name: 'Green View Hostel',   location: 'Green Valley',      price: 5000,  gender: 'Co-living', type: '4 Sharing', rating: 4.2 },
];

const Search = () => {
  const [filters, setFilters] = useState({ location: 'bengaluru', budget: 10000, gender: 'All' });

  /* ── wishlist: load from localStorage ── */
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist') || '[]'); }
    catch { return []; }
  });

  const isWishlisted = (id) => wishlist.some((h) => h.id === id);

  const toggleWishlist = (hostel) => {
    const next = isWishlisted(hostel.id)
      ? wishlist.filter((h) => h.id !== hostel.id)
      : [...wishlist, hostel];
    setWishlist(next);
    localStorage.setItem('wishlist', JSON.stringify(next));
  };

  return (
    <div className="search-page fade-in">

      {/* ── Header ── */}
      <header style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
          stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '900', lineHeight: 1.1 }}>Find Your Perfect Stay</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            Browse verified, high-quality hostels in your preferred location.
          </p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(270px, 300px) 1fr', gap: '2rem', alignItems: 'start' }}>

        {/* ── Filters Sidebar ── */}
        <aside className="glass-card" style={{ padding: '1.8rem', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.8rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Filters</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>

            {/* Location */}
            <div>
              <label style={labelStyle}>Location</label>
              <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                <span style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', display: 'flex', color: 'var(--text-muted)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </span>
                <select value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} style={selectStyle({ pl: '2.6rem' })}>
                  <option value="bengaluru">Bengaluru</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="pune">Pune</option>
                </select>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label style={labelStyle}>Budget — ₹{Number(filters.budget).toLocaleString()}</label>
              <input type="range" min="2000" max="20000" step="500" value={filters.budget}
                onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
                style={{ width: '100%', marginTop: '0.8rem', accentColor: 'var(--accent-primary)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                <span>₹2,000</span><span>₹20,000</span>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label style={labelStyle}>Gender Preference</label>
              <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })} style={selectStyle({})}>
                <option>All</option>
                <option>Boys Only</option>
                <option>Girls Only</option>
                <option>Co-living</option>
              </select>
            </div>

            {/* Amenities */}
            <div>
              <label style={{ ...labelStyle, display: 'block', marginBottom: '0.7rem' }}>Amenities</label>
              {['WiFi', 'A/C', 'Food', 'Laundry', 'Gym', 'Security'].map((item) => (
                <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontSize: '0.9rem', cursor: 'pointer', color: 'var(--text-secondary)', marginBottom: '0.55rem' }}>
                  <input type="checkbox" style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
                  {item}
                </label>
              ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>Apply Filters</button>
          </div>
        </aside>

        {/* ── Results Grid ── */}
        <main style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.8rem', alignContent: 'start' }}>
          {HOSTELS.map((hostel) => {
            const saved = isWishlisted(hostel.id);
            return (
              <div key={hostel.id} className="glass-card hostel-card"
                style={{ padding: 0, overflow: 'hidden', borderRadius: '20px', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>

                {/* Image Area */}
                <div style={{ height: '200px', background: 'linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                  {/* Rating badge */}
                  <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: '#22c55e', color: '#fff', padding: '0.28rem 0.7rem', borderRadius: '8px', fontWeight: '800', fontSize: '0.82rem', letterSpacing: '0.3px' }}>
                    {hostel.rating} ★
                  </span>

                  <HostelIcon name={ICON_MAP[hostel.id]} width={110} height={110} />

                  {/* Heart wishlist icon button (top-right) */}
                  <button
                    onClick={() => toggleWishlist(hostel)}
                    title={saved ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    style={{
                      position: 'absolute', top: '0.9rem', right: '0.9rem',
                      width: '36px', height: '36px', borderRadius: '50%', border: 'none',
                      background: saved ? 'rgba(239,68,68,0.18)' : 'rgba(255,255,255,0.12)',
                      backdropFilter: 'blur(8px)',
                      color: saved ? '#ef4444' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'all 0.25s ease',
                    }}>
                    <svg width="16" height="16" viewBox="0 0 24 24"
                      fill={saved ? '#ef4444' : 'none'}
                      stroke={saved ? '#ef4444' : 'currentColor'}
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.4rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.3rem' }}>{hostel.name}</h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    {hostel.location}
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                    <span style={tagStyle('rgba(56,189,248,0.12)', 'var(--accent-primary)')}>{hostel.gender}</span>
                    <span style={tagStyle('rgba(99,102,241,0.12)', 'var(--accent-secondary)')}>{hostel.type}</span>
                  </div>

                  {/* Price + Action Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>₹{hostel.price.toLocaleString()}</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}> / mo</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {/* ─ Wishlist text button ─ */}
                      <button
                        onClick={() => toggleWishlist(hostel)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.35rem',
                          background: 'none', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700',
                          padding: '0.5rem 0.85rem', borderRadius: '10px', transition: 'all 0.2s ease',
                          border: `1.5px solid ${saved ? '#ef4444' : 'var(--border-color)'}`,
                          color: saved ? '#ef4444' : 'var(--text-muted)',
                        }}>
                        <svg width="12" height="12" viewBox="0 0 24 24"
                          fill={saved ? '#ef4444' : 'none'}
                          stroke={saved ? '#ef4444' : 'currentColor'}
                          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        {saved ? 'Saved' : 'Wishlist'}
                      </button>

                      <Link to={`/listing/${hostel.id}`} className="btn btn-primary"
                        style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem' }}>
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </main>
      </div>

      <style>{`
        .hostel-card:hover { transform: translateY(-7px); box-shadow: 0 24px 60px rgba(0,0,0,0.28); }
      `}</style>
    </div>
  );
};

/* ── style helpers ── */
const labelStyle = {
  color: 'var(--accent-primary)', fontWeight: '800',
  fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '1px',
};

const selectStyle = ({ pl = '1rem' }) => ({
  width: '100%', marginTop: '0.5rem',
  background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
  borderRadius: '12px', padding: `0.75rem 1rem 0.75rem ${pl}`,
  color: 'var(--text-primary)', fontWeight: '600', outline: 'none', cursor: 'pointer',
});

const tagStyle = (bg, color) => ({
  fontSize: '0.76rem', background: bg, color,
  padding: '0.28rem 0.7rem', borderRadius: '7px', fontWeight: '700',
});

export default Search;
