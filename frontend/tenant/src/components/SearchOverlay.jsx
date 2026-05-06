import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/Landing.css';

const CITIES = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Delhi', 'Pune', 'Chennai', 'Kolkata'];
const ALL_LOCALITIES = [
  'Gachibowli', 'Gopanpally Gachibowli', 'Gowlidoddy', 'HITEC City',
  'Journalist colony', 'KOKAPET', 'Kondapur', 'KPHB', 'Kukatpally',
  'Lanco Hills Manikonda', 'Madhapur', 'Manikonda', 'Miyapur', 'Serilingampally'
];

const SearchOverlay = ({ isOpen, onClose, initialCity = 'Hyderabad', onSearch }) => {
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

  const visibleLocalities = isLocalityExpanded ? ALL_LOCALITIES : ALL_LOCALITIES.slice(0, 10);

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
    <div className="search-overlay-backdrop" onClick={onClose} style={{ 
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(15, 23, 42, 0.6)', 
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div className="search-overlay-content" onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
        background: 'white', borderRadius: '12px', padding: '40px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'overlaySlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative'
      }}>
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '950', letterSpacing: '-1px', margin: 0, color: '#0F172A' }}>
              Where to next in{' '}
              <span onClick={() => setShowCityDropdown(!showCityDropdown)} style={{ color: '#3B82F6', cursor: 'pointer', position: 'relative' }}>
                {selectedCity} ⌵
                {showCityDropdown && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '8px', zIndex: 100, boxShadow: '0 12px 32px rgba(0,0,0,0.1)', minWidth: '180px', marginTop: '10px' }}>
                    {CITIES.map(city => (
                      <div key={city} style={{ padding: '12px 16px', cursor: 'pointer', borderRadius: '8px', color: '#1E293B', fontWeight: '600' }} onClick={(e) => { e.stopPropagation(); setSelectedCity(city); setShowCityDropdown(false); }}>{city}</div>
                    ))}
                  </div>
                )}
              </span>
            </h2>
            <p style={{ color: '#64748B', fontWeight: '500', marginTop: '8px' }}>Personalize your stay with precision filters.</p>
          </div>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', color: '#64748B', fontWeight: '900' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          <div onClick={() => setActiveTab('coliving')} style={{ padding: '12px', borderRadius: '12px', border: `2px solid ${activeTab === 'coliving' ? '#3B82F6' : '#F1F5F9'}`, background: activeTab === 'coliving' ? '#EFF6FF' : 'white', cursor: 'pointer', textAlign: 'center', fontWeight: '800', fontSize: '0.9rem', color: activeTab === 'coliving' ? '#3B82F6' : '#64748B' }}>🏠 Coliving</div>
          <div onClick={() => setActiveTab('student')} style={{ padding: '12px', borderRadius: '12px', border: `2px solid ${activeTab === 'student' ? '#3B82F6' : '#F1F5F9'}`, background: activeTab === 'student' ? '#EFF6FF' : 'white', cursor: 'pointer', textAlign: 'center', fontWeight: '800', fontSize: '0.9rem', color: activeTab === 'student' ? '#3B82F6' : '#64748B' }}>🎓 Students</div>
          <div onClick={() => setShowGenderDropdown(!showGenderDropdown)} style={{ padding: '12px', borderRadius: '12px', border: '2px solid #F1F5F9', background: 'white', cursor: 'pointer', textAlign: 'center', fontWeight: '800', fontSize: '0.9rem', color: '#64748B', position: 'relative' }}>
            {selectedGender || '👫 Gender'}
            {showGenderDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '8px', zIndex: 100, boxShadow: '0 12px 32px rgba(0,0,0,0.1)', marginTop: '8px' }}>
                {['Men', 'Women', 'Unisex'].map(g => (
                  <div key={g} style={{ padding: '10px', cursor: 'pointer', borderRadius: '8px', color: '#1E293B' }} onClick={(e) => { e.stopPropagation(); setSelectedGender(g); setShowGenderDropdown(false); }}>{g}</div>
                ))}
              </div>
            )}
          </div>
          <div style={{ padding: '12px', borderRadius: '12px', border: '2px solid #F1F5F9', background: 'white', display: 'flex' }}>
            <input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} style={{ border: 'none', fontWeight: '800', fontSize: '0.85rem', color: '#64748B', outline: 'none', cursor: 'pointer', width: '100%', background: 'transparent' }} />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '12px' }}>Search Localities</label>
          <input type="text" placeholder="Area, Landmark or Tech Park..." style={{ width: '100%', padding: '16px 20px', borderRadius: '12px', border: '2px solid #F1F5F9', background: '#F8FAFC', fontWeight: '600', fontSize: '1rem', outline: 'none' }} value={searchLocality} onChange={(e) => setSearchLocality(e.target.value)} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
            {visibleLocalities.map(loc => (
              <div key={loc} onClick={() => setSearchLocality(loc)} style={{ padding: '8px 16px', background: searchLocality === loc ? '#3B82F6' : '#F1F5F9', color: searchLocality === loc ? 'white' : '#64748B', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}>{loc}</div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
          <input type="text" placeholder="Specific Property" style={{ width: '100%', padding: '14px', borderRadius: '10px', border: '2px solid #F1F5F9', background: '#F8FAFC', fontWeight: '600' }} value={searchProperty} onChange={(e) => setSearchProperty(e.target.value)} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" placeholder="Name" style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '2px solid #F1F5F9', background: '#F8FAFC', fontWeight: '600' }} onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })} />
            <input type="text" placeholder="Mobile" style={{ flex: 1, padding: '14px', borderRadius: '10px', border: '2px solid #F1F5F9', background: '#F8FAFC', fontWeight: '600' }} onChange={(e) => setUserDetails({ ...userDetails, contact: e.target.value })} />
          </div>
        </div>

        <button onClick={handleSearch} style={{ width: '100%', background: '#3B82F6', color: 'white', border: 'none', padding: '1.2rem', borderRadius: '12px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)' }}>Apply Filters & Search</button>

        <style>{`
          @keyframes overlaySlideUp {
            from { opacity: 0; transform: translateY(40px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SearchOverlay;
