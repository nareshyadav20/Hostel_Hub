import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Search.css';

// Importing assets
import room1 from '../assets/hostels/modern_hostel_room_1_1776748847537.png';
import common1 from '../assets/hostels/hostel_common_area_1_1776748912551.png';
import single1 from '../assets/hostels/hostel_single_room_1_1776748933811.png';

const Search = () => {
  const [filters, setFilters] = useState({
    location: '', budget: 20000, gender: 'All', amenities: []
  });

  const cities = [
    { name: 'Bengaluru', icon: '📍' },
    { name: 'Mumbai', icon: '🏢' },
    { name: 'Pune', icon: '🏛️' },
    { name: 'Delhi', icon: '🗼' },
    { name: 'Hyderabad', icon: '🕌' },
    { name: 'Chennai', icon: '🌊' }
  ];

  const amenityCategories = [
    { name: 'WiFi', icon: '📶' },
    { name: 'AC Rooms', icon: '❄️' },
    { name: 'Food Included', icon: '🍱' },
    { name: 'Parking', icon: '🚗' },
    { name: 'Secure', icon: '🛡️' },
    { name: 'Premium', icon: '✨' }
  ];

  const hostels = [
    { 
      id: 1, 
      name: 'Sunrise Student Stay', 
      location: 'Koramangala, Bengaluru', 
      price: 6500, 
      gender: 'CO-ED', 
      rating: 4.8, 
      image: room1 
    },
    { 
      id: 2, 
      name: 'The Brick House Co-Living', 
      location: 'HSR Layout, Bengaluru', 
      price: 8000, 
      gender: 'CO-ED', 
      rating: 4.7, 
      image: common1 
    },
    { 
      id: 3, 
      name: 'Quiet Quarters PG', 
      location: 'Indiranagar, Bengaluru', 
      price: 7500, 
      gender: 'FEMALE', 
      rating: 4.6, 
      image: single1 
    },
    { 
      id: 4, 
      name: 'City Center Boys Hostel', 
      location: 'Whitefield, Bengaluru', 
      price: 5500, 
      gender: 'MALE', 
      rating: 4.4, 
      image: common1 
    },
    { 
      id: 5, 
      name: 'The Maple Loft', 
      location: 'Bandra West, Mumbai', 
      price: 11000, 
      gender: 'CO-ED', 
      rating: 4.9, 
      image: room1 
    },
    { 
      id: 6, 
      name: 'GreenLeaf Residency', 
      location: 'Aundh, Pune', 
      price: 6000, 
      gender: 'CO-ED', 
      rating: 4.5, 
      image: common1 
    }
  ];

  return (
    <div className="search-page">
      {/* Hero Section */}
      <section className="search-hero">
        <h1>Find Your Perfect Stay</h1>
        <p>Explore verified hostels and PGs across India's top cities.</p>
        <div className="hero-search-container">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search by city, area or hostel name..." />
          <button className="search-btn">Search</button>
        </div>
      </section>

      {/* City Pills */}
      <div className="city-pills">
        {cities.map(city => (
          <div key={city.name} className="city-pill">
            <span>{city.icon}</span> {city.name}
          </div>
        ))}
      </div>

      {/* Amenity Categories */}
      <div className="amenity-categories">
        {amenityCategories.map(cat => (
          <div key={cat.name} className="amenity-card">
            <div className="amenity-icon">{cat.icon}</div>
            <span>{cat.name}</span>
          </div>
        ))}
      </div>

      {/* Trending Header */}
      <div className="section-header">
        <h2>Trending stays</h2>
        <Link to="#" className="view-all">View all ➔</Link>
      </div>
      <p style={{ marginTop: '-1rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>Loved by students this week</p>

      {/* Search Layout (Filters + Results) */}
      <div className="search-results-layout">
        <aside className="filters-sidebar">
          <div className="filter-section">
            <h4>Gender</h4>
            <div className="gender-pills">
              {['All', 'Male', 'Female', 'Co-ed'].map(g => (
                <button 
                  key={g} 
                  className={`gender-pill ${filters.gender === g ? 'active' : ''}`}
                  onClick={() => setFilters({...filters, gender: g})}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <div className="budget-info">
              <h4>Max budget</h4>
              <span>₹{filters.budget}</span>
            </div>
            <input 
              type="range" 
              className="range-slider" 
              min="2000" 
              max="30000" 
              step="500"
              value={filters.budget}
              onChange={(e) => setFilters({...filters, budget: e.target.value})}
            />
          </div>

          <div className="filter-section">
            <h4>Amenities</h4>
            <div className="amenities-pills">
              {['WiFi', 'AC', 'Food', 'Parking', 'Gym', 'Laundry'].map(a => (
                <button key={a} className="amenity-pill">{a}</button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h4>Proximity</h4>
            <div className="proximity-filters">
              <label>
                <input type="checkbox" /> Near College / University
              </label>
              <label>
                <input type="checkbox" /> Near Metro / Bus Station
              </label>
              <label>
                <input type="checkbox" /> Near Office Hub
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h4>Min WiFi Speed</h4>
            <select className="filter-select">
              <option>Any Speed</option>
              <option>50+ Mbps</option>
              <option>100+ Mbps</option>
              <option>200+ Mbps</option>
            </select>
          </div>
        </aside>

        <main className="results-list">
          <p style={{ marginBottom: '1.5rem', fontWeight: '600' }}>{hostels.length} stays found</p>
          <div className="results-grid">
            {hostels.map(hostel => (
              <div key={hostel.id} className="hostel-card">
                <div className="card-image-container">
                  <img src={hostel.image} alt={hostel.name} />
                  <span className={`badge ${hostel.gender.toLowerCase()}`}>{hostel.gender}</span>
                  <button className="wishlist-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>
                <div className="card-body">
                  <div className="card-header-flex">
                    <h3>{hostel.name}</h3>
                    <div className="rating">
                      <span style={{ color: '#f59e0b' }}>★</span> {hostel.rating}
                    </div>
                  </div>
                  <div className="location-info">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    {hostel.location}
                  </div>
                  <div className="price-info">
                    <span className="amount">₹{hostel.price}</span>
                    <span className="period">/ month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Search;
