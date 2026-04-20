import React from 'react';

const Rewards = () => {
  const points = {
    total: 450,
    earned: 600,
    used: 150
  };

  const handleRedeem = () => alert('Opening Rewards Store...');

  return (
    <div className="rewards-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>⭐ My Rewards</h1>
        <p>Earn points for timely payments and participation.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Balance</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-primary)' }}>{points.total}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Lifetime Earned</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-success)' }}>{points.earned}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Points Used</p>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-warning)' }}>{points.used}</h2>
        </div>
      </div>

      <div className="card" style={{ 
        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', 
        color: '#fff', 
        padding: '3rem', 
        textAlign: 'center' 
      }}>
        <h2>Redeem Your Points</h2>
        <p style={{ margin: '1rem 0 2rem', opacity: '0.9' }}>Get discounts on rent, food coupons, and partner offers.</p>
        <button 
          onClick={handleRedeem}
          className="btn" 
          style={{ background: '#fff', color: 'var(--accent-primary)', padding: '1rem 2.5rem', fontWeight: '800' }}
        >
          Redeem Points Now
        </button>
      </div>
    </div>
  );
};

export default Rewards;
