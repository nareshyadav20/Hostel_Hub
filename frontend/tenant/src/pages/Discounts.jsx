import React from 'react';

const Discounts = () => {
  const offers = [
    { partner: 'Pizza Hut', discount: '20% OFF', code: 'STAYPIZZA20' },
    { partner: 'Uber', discount: '15% OFF', code: 'STAYUBER15' },
    { partner: 'Amazon', discount: '10% Cashback', code: 'STAYAMZ10' },
  ];

  const handleUseCoupon = (code) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code ${code} copied to clipboard!`);
  };

  return (
    <div className="discounts-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🎟️ Exclusive Discounts</h1>
        <p>Special offers and coupons for StayNest residents.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {offers.map((offer, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem' }}>{offer.partner}</h3>
              <span style={{ fontSize: '1.5rem' }}>🎁</span>
            </div>
            <p style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent-success)' }}>{offer.discount}</p>
            <div style={{ background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '8px', border: '1px dashed var(--border-color)', textAlign: 'center' }}>
              <code style={{ fontSize: '1.1rem', fontWeight: '800', letterSpacing: '2px' }}>{offer.code}</code>
            </div>
            <button 
              onClick={() => handleUseCoupon(offer.code)}
              className="btn btn-primary" 
              style={{ padding: '0.8rem', fontWeight: '800', marginTop: '0.5rem' }}
            >
              ➕ Use Coupon
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discounts;
