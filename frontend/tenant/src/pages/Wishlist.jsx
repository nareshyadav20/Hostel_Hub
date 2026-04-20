import React, { useState } from 'react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Sunshine Residency', price: 6500, location: 'Near City College' },
    { id: 2, name: 'Elite Living', price: 8500, location: 'Tech Park Area' },
  ]);

  const handleBookNow = (name) => alert(`Redirecting to booking for ${name}...`);
  const handleRemove = (id) => setWishlist(wishlist.filter(item => item.id !== id));

  return (
    <div className="wishlist-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>❤️ My Wishlist</h1>
        <p>Your saved hostels for future stays.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {wishlist.map(item => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ height: '140px', background: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🏨</div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>{item.name}</h3>
              <p style={{ color: 'var(--accent-primary)', fontWeight: '800', margin: '0.3rem 0' }}>₹{item.price} / month</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📍 {item.location}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.5rem' }}>
              <button onClick={() => handleBookNow(item.name)} className="btn btn-primary" style={{ flex: 1, fontSize: '0.85rem' }}>Book Now</button>
              <button onClick={() => handleRemove(item.id)} className="btn" style={{ fontSize: '0.85rem', border: '1px solid var(--accent-error)', color: 'var(--accent-error)' }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      {wishlist.length === 0 && <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Your wishlist is empty.</div>}
    </div>
  );
};

export default Wishlist;
