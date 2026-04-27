import React from 'react';
import { Link } from 'react-router-dom';

const Rewards = () => {
  const points = {
    total: 450,
    earned: 600,
    used: 150
  };

  const handleRedeem = () => alert('Opening Rewards Store...');

  return (
    <div className="rewards-page fade-in dashboard-container" style={{ position: 'relative' }}>
      <Link to="/dashboard" style={{
        position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-secondary)',
        width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-md)', transition: 'all 0.3s ease', zIndex: 10
      }} className="hover-scale">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </Link>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-warning)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          My Rewards
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Earn points for timely payments and participation.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--accent-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-primary)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Balance</p>
            <h2 style={{ fontSize: '3rem', color: 'var(--accent-primary)', fontWeight: '900', margin: '0.5rem 0 0' }}>{points.total}</h2>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--accent-success)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-success)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Lifetime Earned</p>
            <h2 style={{ fontSize: '3rem', color: 'var(--accent-success)', fontWeight: '900', margin: '0.5rem 0 0' }}>{points.earned}</h2>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--accent-warning)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-warning)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Points Used</p>
            <h2 style={{ fontSize: '3rem', color: 'var(--accent-warning)', fontWeight: '900', margin: '0.5rem 0 0' }}>{points.used}</h2>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ 
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(56, 189, 248, 0.05))', 
        border: '1px solid rgba(14, 165, 233, 0.3)',
        padding: '4rem 2rem', 
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-10px', left: '-10px', opacity: 0.05, transform: 'rotate(-15deg)' }}>
          <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-primary)' }}>Redeem Your Points</h2>
        <p style={{ margin: '1rem 0 2.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Get discounts on rent, food coupons, and partner offers.</p>
        <button 
          onClick={handleRedeem}
          className="btn btn-primary" 
          style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', fontWeight: '800', borderRadius: '12px', boxShadow: '0 10px 25px rgba(14, 165, 233, 0.3)', position: 'relative', zIndex: 1 }}
        >
          Explore Rewards Catalog
        </button>
      </div>
    </div>
  );
};

export default Rewards;
