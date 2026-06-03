import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Landing.css';

const CITIES = ['Bengaluru', 'Hyderabad', 'Mumbai', 'Chennai', 'Delhi', 'Pune', 'Noida', 'Gurgaon'];
const ALL_LOCALITIES = [
  'Gachibowli', 'Gopanpally Gachibowli', 'Gowlidoddy', 'HITEC City',
  'Journalist colony', 'KOKAPET', 'Kondapur', 'KPHB', 'Kukatpally',
  'Lanco Hills Manikonda', 'Madhapur', 'Manikonda', 'Miyapur', 'Serilingampally'
];

const SearchOverlay = ({ 
  isOpen, 
  onClose, 
  initialCity = 'Hyderabad', 
  onSearch,
  availableCities = CITIES,
  availableLocalities = ALL_LOCALITIES
}) => {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('coliving');
  const [selectedGender, setSelectedGender] = useState('');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [showAmenitiesDropdown, setShowAmenitiesDropdown] = useState(false);
  const [joiningDate, setJoiningDate] = useState('');
  const [isLocalityExpanded, setIsLocalityExpanded] = useState(false);
  const [searchLocality, setSearchLocality] = useState('');
  const [searchCollege, setSearchCollege] = useState('');
  const [searchProperty, setSearchProperty] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', contact: '' });

  const visibleLocalities = isLocalityExpanded ? availableLocalities : availableLocalities.slice(0, 10);

  const handleSearch = () => {
    onClose();
    if (onSearch) {
      onSearch({ selectedCity, activeTab, selectedGender, selectedAmenities, joiningDate, searchLocality, searchProperty, userDetails });
    } else {
      navigate(`/explore?city=${selectedCity}&locality=${searchLocality}&type=${activeTab}&gender=${selectedGender}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-overlay-backdrop" onClick={onClose}>
      <div className="search-overlay-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="overlay-header">
          <h2 style={{ position: 'relative' }}>
            Find Your Perfect Home, Your Way In{' '}
            <span onClick={() => setShowCityDropdown(!showCityDropdown)} style={{ color: '#00b0f0', cursor: 'pointer' }}>
              {selectedCity} ⌵
            </span>
            {showCityDropdown && (
              <div className="city-dropdown" style={{ position: 'absolute', top: '100%', left: 0, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '200px' }}>
                {availableCities.map(city => (
                  <div
                    key={city}
                    className="city-option"
                    style={{ padding: '0.5rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                    onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Filter Chips */}
        <div className="filter-row">
          <div
            className={`filter-chip coliving ${activeTab === 'coliving' ? 'active' : ''}`}
            onClick={() => setActiveTab('coliving')}
            style={{ border: activeTab === 'coliving' ? '2px solid #00b0f0' : 'none' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={activeTab === 'coliving' ? '#00b0f0' : '#757575'}>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
            </svg>
            Coliving
          </div>

          <div
            className={`filter-chip student ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => setActiveTab('student')}
            style={{ border: activeTab === 'student' ? '2px solid #00b0f0' : 'none' }}
          >
            <span className="new-badge">NEW</span>
            <div style={{ width: 18, height: 18, borderRadius: '50%', border: activeTab === 'student' ? '2px solid #00b0f0' : '2px solid #cbd5e1', marginRight: 8, background: activeTab === 'student' ? '#00b0f0' : 'transparent' }}></div>
            Student Only
          </div>

          {/* Gender Dropdown */}
          <div className="filter-chip gender" onClick={() => setShowGenderDropdown(!showGenderDropdown)} style={{ position: 'relative' }}>
            {selectedGender || 'Gender'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            {showGenderDropdown && (
              <div className="glass-card dropdown-menu" style={{ position: 'absolute', top: '100%', left: 0, width: '140px', background: 'var(--bg-secondary)', zIndex: 20, marginTop: '5px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                {['Men', 'Women', 'Unisex'].map(g => (
                  <div key={g} style={{ padding: '0.8rem', cursor: 'pointer', color: 'var(--text-primary)' }} onClick={(e) => { e.stopPropagation(); setSelectedGender(g); setShowGenderDropdown(false); }}>{g}</div>
                ))}
              </div>
            )}
          </div>

          {/* Joining Date */}
          <div className="filter-chip date">
            <input
              type="date"
              value={joiningDate}
              onChange={(e) => setJoiningDate(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'inherit', font: 'inherit', outline: 'none', cursor: 'pointer', width: '100%' }}
            />
          </div>

          {/* Amenities Dropdown */}
          <div className="filter-chip amenities" onClick={() => setShowAmenitiesDropdown(!showAmenitiesDropdown)} style={{ position: 'relative' }}>
            {selectedAmenities.length > 0 ? `${selectedAmenities.length} Selected` : 'Amenities'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            {showAmenitiesDropdown && (
              <div className="glass-card dropdown-menu" style={{ position: 'absolute', top: '100%', left: 0, width: '200px', background: 'var(--bg-secondary)', zIndex: 20, marginTop: '5px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '0.5rem' }}>
                {['AC', 'Food', 'Fridge', 'Gym', 'Parking', 'Power Backup'].map(a => (
                  <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}>
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(a)}
                      onChange={() => {
                        if (selectedAmenities.includes(a)) setSelectedAmenities(selectedAmenities.filter(item => item !== a));
                        else setSelectedAmenities([...selectedAmenities, a]);
                      }}
                    />
                    {a}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Locality Search */}
        <div className="input-section">
          <label>Where would you like to stay?</label>
          <input
            type="text"
            className="zolo-input"
            placeholder="Search for the Place, Locality or Landmark"
            value={searchLocality}
            onChange={(e) => setSearchLocality(e.target.value)}
          />
          <div className="locality-chips">
            {visibleLocalities.map(loc => (
              <div key={loc} className="locality-chip" onClick={() => setSearchLocality(loc)}>{loc}</div>
            ))}
            <div className="locality-chip view-more" style={{ color: '#00b0f0' }} onClick={() => setIsLocalityExpanded(!isLocalityExpanded)}>
              {isLocalityExpanded ? 'View Less' : 'View More'}
            </div>
          </div>
        </div>

        {/* College Search (Student tab only) */}
        {activeTab === 'student' && (
          <div className="input-section">
            <label>Looking for an accommodation near your college/university?</label>
            <input
              type="text"
              className="zolo-input"
              placeholder="Search for College/University"
              value={searchCollege}
              onChange={(e) => setSearchCollege(e.target.value)}
            />
          </div>
        )}

        {/* Property Search */}
        <div className="input-section">
          <label>Looking for a specific property?</label>
          <input
            type="text"
            className="zolo-input"
            placeholder="Search for Properties"
            value={searchProperty}
            onChange={(e) => setSearchProperty(e.target.value)}
          />
        </div>

        {/* User Details */}
        <div className="input-section">
          <label>Please share details below for us to help you better.</label>
          <div className="details-row">
            <input
              type="text"
              className="zolo-input"
              placeholder="Name"
              value={userDetails.name}
              onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
            />
            <input
              type="text"
              className="zolo-input"
              placeholder="Contact Number"
              value={userDetails.contact}
              onChange={(e) => setUserDetails({ ...userDetails, contact: e.target.value })}
            />
          </div>
        </div>

        {/* Search Button */}
        <div className="search-action">
          <button className="zolo-search-btn" onClick={handleSearch}>Search</button>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
