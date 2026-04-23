import React from 'react';

const Profile = () => {
  return (
    <div className="dashboard-container">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800' }}>Partner Profile</h1>
        <p>Manage your business details and settings.</p>
      </header>
      
      <div className="card" style={{ maxWidth: '600px' }}>
        <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Business Information</h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Business Name</label>
            <input type="text" defaultValue="Premium Laundry Services" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} readOnly />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Contact Email</label>
            <input type="email" defaultValue="partner@example.com" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} readOnly />
          </div>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
