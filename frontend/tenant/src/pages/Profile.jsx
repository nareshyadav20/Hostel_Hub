import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{"name": "User"}'));
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/tenants/me');
        setTenantData(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="staynest-dashboard loading-state">
      <div className="premium-spinner"></div>
      <p>Loading your profile...</p>
    </div>
  );

  const displayUser = tenantData || user;

  return (
    <div className="profile-page">
      <header className="profile-header">
        <div className="header-icon-main">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div>
          <h1>Smart Profile</h1>
          <p className="header-subtitle">Personalize your stay and roommate matching preferences.</p>
        </div>
      </header>

      <div className="profile-grid">
        <div className="sn-card profile-sidebar">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {displayUser.name?.charAt(0)}
            </div>
            <button className="avatar-edit-btn" title="Change Avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </button>
          </div>
          
          <h2 className="profile-name">{displayUser.name}</h2>
          <p className="profile-role">{displayUser.occupation || 'Active Resident'}</p>
          
          <div className="profile-contact-info">
            <div className="input-group">
              <label>Email Address</label>
              <input type="text" value={displayUser.email} readOnly />
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              <input type="text" value={displayUser.phone || 'Not Set'} readOnly />
            </div>
            {displayUser.organization && (
              <div className="input-group">
                <label>Institution / Company</label>
                <input type="text" value={displayUser.organization} readOnly />
              </div>
            )}
          </div>
        </div>

        <div className="sn-card profile-main-card">
          <h2 className="profile-section-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Preferences & Matching
          </h2>
          
          <div className="preferences-grid">
            <div className="input-group">
              <label>Budget Range</label>
              <select className="premium-select">
                <option>₹5,000 - ₹10,000</option>
                <option>₹10,000 - ₹15,000</option>
                <option>₹15,000+</option>
              </select>
            </div>
            <div className="input-group">
              <label>Food Preference</label>
              <select className="premium-select">
                <option>Veg Only</option>
                <option>Non-Veg</option>
                <option>Egg-itarian</option>
              </select>
            </div>
            <div className="input-group">
              <label>Sleep Timing</label>
              <select className="premium-select">
                <option>Early Bird</option>
                <option>Night Owl</option>
                <option>Flexible</option>
              </select>
            </div>
            <div className="input-group">
              <label>Primary Language</label>
              <input type="text" placeholder="Hindi, English, etc." className="premium-input" />
            </div>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <label className="input-label" style={{ fontWeight: 800, color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: 'block' }}>Target Stay Duration</label>
            <div className="duration-selection">
              {['3 Months', '6 Months', '1 Year', 'Flexible'].map((d) => (
                <button key={d} className={`duration-pill ${d === '1 Year' ? 'active' : ''}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-primary btn-large" style={{ width: '100%' }}>
              Save Profile Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

