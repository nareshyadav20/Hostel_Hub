import React, { useState } from 'react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('notice');

  return (
    <div className="community-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🤝 Community Hub</h1>
        <p>Connect with your hostel mates, find roommates, and stay updated.</p>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button className={`btn ${activeTab === 'notice' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('notice')}>Notice Board</button>
        <button className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('events')}>Events</button>
        <button className={`btn ${activeTab === 'roommate' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('roommate')}>Find Roommate</button>
        <button className={`btn ${activeTab === 'buysell' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('buysell')}>Buy & Sell</button>
        <button className={`btn ${activeTab === 'lostfound' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('lostfound')}>Lost & Found</button>
      </div>

      <div className="card" style={{ padding: '2rem', minHeight: '400px' }}>
        {activeTab === 'notice' && (
          <div>
            <h3>📌 Important Notices</h3>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--accent-error)', borderRadius: '8px' }}>
                <h4 style={{ color: 'var(--accent-error)' }}>Water Supply Interruption</h4>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Water supply will be cut from 2 PM to 4 PM today due to tank cleaning.</p>
                <small style={{ color: 'var(--text-muted)' }}>Posted: 2 hours ago</small>
              </div>
              <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderLeft: '4px solid var(--accent-primary)', borderRadius: '8px' }}>
                <h4 style={{ color: 'var(--accent-primary)' }}>Rent Due Reminder</h4>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Please clear your pending dues before the 5th to avoid late fees.</p>
                <small style={{ color: 'var(--text-muted)' }}>Posted: Yesterday</small>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <h3>🎉 Upcoming Events</h3>
            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎮</div>
                <h4>Weekend FIFA Tournament</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>Join us in the common room this Saturday at 6 PM.</p>
                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>RSVP Now</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roommate' && (
          <div>
            <h3>🧑‍🤝‍🧑 Find a Roommate</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Looking to switch rooms or need a buddy? Connect here.</p>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4>Rahul Sharma</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Prefers: Non-veg, Night Owl, IT Professional</p>
              </div>
              <button className="btn btn-primary">Connect</button>
            </div>
          </div>
        )}

        {activeTab === 'buysell' && (
          <div>
            <h3>🛒 Buy & Sell Used Items</h3>
            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4>Study Table</h4>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-primary)', margin: '0.5rem 0' }}>₹800</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>Condition: Good. Moving out next week.</p>
                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem' }}>Contact Seller</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lostfound' && (
          <div>
            <h3>🔍 Lost & Found</h3>
            <button className="btn btn-primary" style={{ marginBottom: '1.5rem' }}>+ Report Item</button>
            <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', borderLeft: '4px solid var(--accent-warning)' }}>
              <h4>Found: Black Wallet</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0.5rem 0' }}>Found near the cafeteria area. Handed over to the front desk.</p>
              <small style={{ color: 'var(--text-muted)' }}>Found: Today Morning</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
