import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search as SearchIcon, MapPin, Sliders, 
  Users, Home, Star, Filter, 
  Wifi, Zap, Shield, Coffee, ChevronRight
} from 'lucide-react';

const Search = () => {
  const [filters, setFilters] = useState({
    location: '', budget: 10000, gender: 'All', type: 'Any'
  });

  const hostels = [
    { id: 1, name: 'Sunshine Residency', location: 'Near City College, Bangalore', price: 6500, gender: 'Boys', type: '2 Sharing', rating: 4.5, image: 'https://images.unsplash.com/photo-1555854817-5b2738a77a5d?q=80&w=400&h=300&auto=format&fit=crop' },
    { id: 2, name: 'Elite Living', location: 'Tech Park Area, Hyderabad', price: 8500, gender: 'Girls', type: 'Single', rating: 4.8, image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=400&h=300&auto=format&fit=crop' },
    { id: 3, name: 'Green View Hostel', location: 'Green Valley, Mumbai', price: 5000, gender: 'Co-living', type: '4 Sharing', rating: 4.2, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=400&h=300&auto=format&fit=crop' },
  ];

  return (
    <div className="search-page fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <SearchIcon size={32} color="var(--accent-primary)" /> 
          Find Your Perfect Stay
        </h1>
        <p style={{ fontSize: '1.1rem' }}>Browse through hundreds of verified hostels near your location.</p>
      </header>

      <div className="search-layout" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2.5rem' }}>
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="card" style={{ position: 'sticky', top: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2rem' }}>
              <Filter size={20} color="var(--accent-primary)" />
              <h3 style={{ margin: 0 }}>Advanced Filters</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '0.9rem' }}>Location</label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input type="text" placeholder="Search by area..." style={{ paddingLeft: '2.5rem' }} />
                </div>
              </div>

              <div className="input-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <label style={{ fontWeight: '600', fontSize: '0.9rem' }}>Budget</label>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>₹{filters.budget}</span>
                </div>
                <input type="range" min="2000" max="20000" step="500" value={filters.budget} onChange={(e) => setFilters({...filters, budget: e.target.value})} style={{ accentColor: 'var(--accent-primary)' }} />
              </div>

              <div className="input-group">
                <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: '600', fontSize: '0.9rem' }}>Gender Preference</label>
                <select>
                  <option>All</option>
                  <option>Boys</option>
                  <option>Girls</option>
                  <option>Co-living</option>
                </select>
              </div>

              <div className="amenities">
                <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', fontSize: '0.9rem' }}>Amenities</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.8rem' }}>
                  {[
                    { label: 'High-speed WiFi', icon: <Wifi size={14} /> },
                    { label: 'AC / Non AC', icon: <Zap size={14} /> },
                    { label: 'Food Included', icon: <Coffee size={14} /> },
                    { label: 'Laundry', icon: <Users size={14} /> },
                    { label: 'Security', icon: <Shield size={14} /> }
                  ].map(item => (
                    <label key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ width: 'auto' }} />
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                        {item.icon} {item.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Apply Filters
              </button>
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <main className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {hostels.map(hostel => (
            <div key={hostel.id} className="card result-card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                <img src={hostel.image} alt={hostel.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="card-img" />
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', backdropFilter: 'blur(4px)', fontWeight: '600' }}>
                    {hostel.gender}
                  </span>
                </div>
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                  <span style={{ background: 'white', color: 'var(--accent-warning)', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.3rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <Star size={14} fill="var(--accent-warning)" /> {hostel.rating}
                  </span>
                </div>
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>{hostel.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                    <MapPin size={14} /> {hostel.location}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '0.3rem 0.7rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    {hostel.type}
                  </span>
                  <span style={{ fontSize: '0.8rem', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '0.3rem 0.7rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    Verified
                  </span>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-primary)' }}>₹{hostel.price}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> / month</span>
                  </div>
                  <Link to={`/listing/${hostel.id}`} className="btn btn-primary" style={{ padding: '0.7rem 1.2rem' }}>
                    View Details <ChevronRight size={16} />
                  </Link>
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
