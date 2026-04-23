import React from 'react';

const Community = () => {
  const categories = [
    { name: 'Events', icon: '📅', count: 3 },
    { name: 'Marketplace', icon: '🛒', count: 12 },
    { name: 'Roommates', icon: '👥', count: 5 },
    { name: 'Chat groups', icon: '💬', count: 8 },
  ];

  return (
    <div className="dashboard-container">
      <div className="welcome-section" style={{ background: 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)' }}>
        <div className="welcome-text">
          <h1 style={{ color: 'white' }}>Community Hub</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Connect, buy, sell, and grow with your fellow tenants.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {categories.map((cat, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', cursor: 'pointer' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{cat.icon}</div>
            <h3 style={{ margin: '0 0 0.5rem' }}>{cat.name}</h3>
            <span className="status-badge" style={{ color: 'var(--accent-primary)' }}>{cat.count} Active</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h2>Marketplace: Buy & Sell</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { item: 'Study Desk', price: '₹1,200', seller: 'Rahul', img: '🪑' },
              { item: 'Electric Kettle', price: '₹600', seller: 'Sneha', img: '🫖' },
            ].map((p, i) => (
              <div key={i} style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem' }}>{p.img}</span>
                <div>
                  <h4 style={{ margin: 0 }}>{p.item}</h4>
                  <p style={{ margin: 0, fontWeight: '700', color: 'var(--accent-success)' }}>{p.price}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>List an Item</button>
        </div>

        <div className="card glass-panel">
          <h2>Find a Roommate</h2>
          <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>Profiles matching your preferences.</p>
          {[
            { name: 'Amit Singh', pref: 'Night Owl, Veg', match: '95%' },
            { name: 'Priya Verma', pref: 'Early Bird, Non-Veg', match: '82%' },
          ].map((m, i) => (
            <div key={i} style={{ padding: '1rem', borderBottom: i === 0 ? '1px solid var(--border-color)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: 0 }}>{m.name}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>{m.pref}</p>
              </div>
              <span style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>{m.match}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Community;
