import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const cities = [
    { name: 'Bangalore', icon: '🏢' },
    { name: 'Chennai', icon: '🌊' },
    { name: 'Coimbatore', icon: '⛰️' },
    { name: 'Pune', icon: '🎓' },
    { name: 'Hyderabad', icon: '🏰' },
    { name: 'Noida', icon: '🏢' },
    { name: 'Delhi', icon: '🏛️' },
    { name: 'Mumbai', icon: '🚢' },
    { name: 'Gurugram', icon: '🏙️' }
  ];

  const handleCityClick = (cityName) => {
    // Navigate to landing page with the selected city
    navigate(`/explore?city=${cityName}`);
  };

  return (
    <div className="home-splash">
      <div className="splash-content">
        <h1 className="splash-logo">LIVORA</h1>
        <p className="splash-subtitle">Choose your city to start exploring</p>
        
        <div className="city-grid-splash">
          {cities.map((city) => (
            <div 
              key={city.name} 
              className="city-card-splash"
              onClick={() => handleCityClick(city.name)}
            >
              <div className="city-icon-wrapper">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                   <path d="M3 21h18M3 7v14M21 7v14M3 7l9-4 9 4M10 21v-4a2 2 0 0 1 4 0v4"></path>
                </svg>
              </div>
              <span>{city.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="splash-footer">
        © 2026 Livora Private Limited
      </div>
    </div>
  );
};

export default Home;
