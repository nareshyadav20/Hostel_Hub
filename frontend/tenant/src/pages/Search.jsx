import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Search = () => {
  const [filters, setFilters] = useState({
    location: '', budget: 10000, gender: 'All', type: 'Any'
  });

  const hostels = [
    { id: 1, name: 'Sunshine Residency', location: 'Near City College', price: 6500, gender: 'Boys', type: '2 Sharing', rating: 4.5, image: '🏨' },
    { id: 2, name: 'Elite Living', location: 'Tech Park Area', price: 8500, gender: 'Girls', type: 'Single', rating: 4.8, image: '🏢' },
    { id: 3, name: 'Green View Hostel', location: 'Green Valley', price: 5000, gender: 'Co-living', type: '4 Sharing', rating: 4.2, image: '🏡' },
  ];

  return (
    <div className="search-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🔍 Find Your Perfect Stay</h1>
        <p>Browse through hundreds of verified hostels near your location.</p>
      </header>

      <div className="search-layout" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
        {/* Filters Sidebar */}
        <aside className="filters card">
          <h3 style={{ marginBottom: '1.5rem' }}>Filters</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Location</label>
              <input type="text" placeholder="Search by area..." />
            </div>
            <div className="input-group">
              <label>Budget (upto ₹{filters.budget})</label>
              <input type="range" min="2000" max="20000" step="500" value={filters.budget} onChange={(e) => setFilters({...filters, budget: e.target.value})} />
            </div>
            <div className="input-group">
              <label>Gender Preference</label>
              <select className="btn" style={{ border: '1px solid var(--border-color)', width: '100%' }}>
                <option>All</option>
                <option>Boys</option>
                <option>Girls</option>
                <option>Co-living</option>
              </select>
            </div>
            <div className="input-group">
              <label>Room Type</label>
              <select className="btn" style={{ border: '1px solid var(--border-color)', width: '100%' }}>
                <option>Any</option>
                <option>Single</option>
                <option>2 Sharing</option>
                <option>3+ Sharing</option>
              </select>
            </div>
            <div className="input-group">
              <label>Proximity</label>
              <select className="btn" style={{ border: '1px solid var(--border-color)', width: '100%' }}>
                <option>Any</option>
                <option>Near College</option>
                <option>Near Office</option>
                <option>Near Metro/Bus</option>
              </select>
            </div>
            <div className="amenities">
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Amenities</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                {['WiFi (High Speed)', 'AC / Non AC', 'Food Included', 'Laundry', 'Parking', 'Security', 'Power Backup', 'Attached Washroom'].map(item => (
                  <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <input type="checkbox" /> {item}
                  </label>
                ))}
              </div>
            </div>
            <div className="amenities">
              <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Advanced Filters</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                {['Professionals Only', 'Students Only', 'Freshers Friendly', 'Gym Nearby', 'Instant Move-in'].map(item => (
                  <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                    <input type="checkbox" /> {item}
                  </label>
                ))}
              </div>
            </div>
            <button className="btn btn-primary">Apply Filters</button>
          </div>
        </aside>

        {/* Results Grid */}
        <main className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {hostels.map(hostel => (
            <div key={hostel.id} className="card result-card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ height: '180px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '4rem' }}>
                {hostel.image}
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3>{hostel.name}</h3>
                  <span style={{ color: 'var(--accent-warning)' }}>★ {hostel.rating}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.5rem 0' }}>📍 {hostel.location}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{hostel.gender}</span>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{hostel.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-success)' }}>₹{hostel.price}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> / month</span>
                  </div>
                  <Link to={`/listing/${hostel.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};

export default Search;
