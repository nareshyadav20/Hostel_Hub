import React from 'react';

const Discounts = () => {
  const offers = [
    { 
      partner: 'Zomato', 
      discount: '₹150 OFF', 
      code: 'LIVORAFOOD', 
      color: '#cb202d', 
      bg: 'rgba(203, 32, 45, 0.05)',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
      desc: 'Late-night study cravings? Get instant discount on orders above ₹399.'
    },
    { 
      partner: 'Blinkit', 
      discount: 'FREE Delivery', 
      code: 'LIVORASHOP', 
      color: '#ffcc00', 
      bg: 'rgba(255, 204, 0, 0.05)',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
      desc: 'Get your room essentials & snacks delivered in 10 mins.'
    },
    { 
      partner: 'Spotify', 
      discount: '3 Months Free', 
      code: 'LIVORAMUSIC', 
      color: '#1DB954', 
      bg: 'rgba(29, 185, 84, 0.05)',
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12a4 4 0 0 1 8 0"/><path d="M6 12a6 6 0 0 1 12 0"/><path d="M10 12a2 2 0 0 1 4 0"/></svg>,
      desc: 'Focus better with ad-free study playlists. Premium access.'
    },
  ];

  const [copiedCode, setCopiedCode] = React.useState(null);

  const handleUseCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="discounts-page fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '950', letterSpacing: '-2px', marginBottom: '0.5rem', background: 'linear-gradient(to right, var(--text-primary), var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>🎟️ Livora Exclusive Rewards</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: '500' }}>Premium perks curated specifically for the Livora student community.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {offers.map((offer, idx) => (
          <div key={idx} className="glass-card reward-tile" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '2.5rem', 
            borderRadius: '32px', 
            background: offer.bg,
            border: `1px solid ${offer.color}20`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: offer.color, opacity: 0.05, borderRadius: '50%' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.8rem', background: offer.color, color: 'white', borderRadius: '12px', boxShadow: `0 8px 20px ${offer.color}30` }}>
                  {offer.icon}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-primary)' }}>{offer.partner}</h3>
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: '900', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', padding: '0.4rem 0.8rem', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Verified</span>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: '950', color: offer.color, lineHeight: '1', marginBottom: '0.5rem' }}>{offer.discount}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.6' }}>{offer.desc}</p>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <div style={{ 
                background: 'var(--bg-secondary)', 
                padding: '1.2rem', 
                borderRadius: '16px', 
                border: `2px dashed ${offer.color}40`, 
                textAlign: 'center',
                position: 'relative',
                cursor: 'pointer'
              }} onClick={() => handleUseCoupon(offer.code)}>
                <code style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '4px', color: 'var(--text-primary)' }}>{offer.code}</code>
                {copiedCode === offer.code && (
                  <div style={{ position: 'absolute', inset: 0, background: offer.color, color: 'white', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem', animation: 'authFadeIn 0.2s ease' }}>
                    COPIED!
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => handleUseCoupon(offer.code)}
                className="btn" 
                style={{ 
                  width: '100%', 
                  padding: '1.2rem', 
                  fontWeight: '800', 
                  marginTop: '1.2rem', 
                  borderRadius: '16px',
                  background: offer.color,
                  color: 'white',
                  border: 'none',
                  boxShadow: `0 10px 25px ${offer.color}30`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {copiedCode === offer.code ? '✓ Copied to Clipboard' : '➕ Use Coupon'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .reward-tile:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
          background: rgba(255,255,255,0.02);
        }
      `}</style>
    </div>
  );
};

export default Discounts;
