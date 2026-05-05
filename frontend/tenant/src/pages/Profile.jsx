import React, { useState, useEffect } from 'react';
import API from '../api/axios';

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

  if (loading) return <div className="dashboard-container"><div className="loading-spinner">Loading Profile...</div></div>;

  const displayUser = tenantData || user;

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Smart Profile</h1>
          <p>Personalize your stay and roommate matching preferences.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', background: 'var(--accent-primary)', 
              margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', color: 'white', fontWeight: '800'
            }}>
              {displayUser.name?.charAt(0)}
            </div>
            <h2>{displayUser.name}</h2>
            <p>{displayUser.occupation || 'Active Resident'}</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <label>Email</label>
              <input type="text" value={displayUser.email} readOnly />
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input type="text" value={displayUser.phone || 'Not Set'} readOnly />
            </div>
            {displayUser.organization && (
              <div className="input-group">
                <label>Institution</label>
                <input type="text" value={displayUser.organization} readOnly />
              </div>
            )}
          </div>
        </div>

        <div className="card glass-panel">
          <h2>Preferences & Matching</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className="input-group">
              <label>Budget Range</label>
              <select style={{ padding: '0.8rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                <option>₹5,000 - ₹10,000</option>
                <option>₹10,000 - ₹15,000</option>
                <option>₹15,000+</option>
              </select>
            </div>
            <div className="input-group">
              <label>Food Preference</label>
              <select style={{ padding: '0.8rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                <option>Veg Only</option>
                <option>Non-Veg</option>
                <option>Egg-itarian</option>
              </select>
            </div>
            <div className="input-group">
              <label>Sleep Timing</label>
              <select style={{ padding: '0.8rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                <option>Early Bird</option>
                <option>Night Owl</option>
                <option>Flexible</option>
              </select>
            </div>
            <div className="input-group">
              <label>Language</label>
              <input type="text" placeholder="Hindi, English, etc." style={{ padding: '0.8rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <h3 style={{ marginTop: '2rem' }}>Stay Duration</h3>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            {['3 Months', '6 Months', '1 Year', 'Flexible'].map((d) => (
              <button key={d} className="status-badge" style={{ cursor: 'pointer', border: d === '1 Year' ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)' }}>
                {d}
              </button>
            ))}
          </div>

          <button className="btn btn-primary" style={{ marginTop: '2.5rem', width: '100%' }}>Save Profile Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
