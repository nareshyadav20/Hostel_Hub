import React, { useState } from 'react';
import './Discounts.css';

const Discounts = () => {
  const offers = [
    { 
      partner: 'Zomato', 
      discount: '₹150 OFF', 
      code: 'LIVORAFOOD', 
      color: '#cb202d', 
      textColor: '#ffffff',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      ), 
      desc: 'Late-night cravings? Get instant discount on orders above ₹399.' 
    },
    { 
      partner: 'Blinkit', 
      discount: 'FREE Delivery', 
      code: 'LIVORASHOP', 
      color: '#ffcc00', 
      textColor: '#000000',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      ), 
      desc: 'Get room essentials & snacks delivered in 10 mins.' 
    },
    { 
      partner: 'Spotify', 
      discount: '3 Months Free', 
      code: 'LIVORAMUSIC', 
      color: '#1DB954', 
      textColor: '#ffffff',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.82 14.45c-.2.32-.61.42-.93.22-2.41-1.47-5.45-1.8-9.03-1.01-.36.08-.73-.15-.81-.51-.08-.36.15-.73.51-.81 3.91-.88 7.3-.49 10.01 1.16.32.2.42.61.25.95zm1.28-2.73c-.26.41-.79.55-1.2.29-2.76-1.69-6.96-2.18-10.22-1.19-.46.14-.94-.12-1.08-.58-.14-.46.12-.94.58-1.08 3.73-1.13 8.36-.58 11.53 1.36.41.26.54.79.39 1.2zm.12-2.83c-3.3-1.96-8.73-2.13-11.88-1.17-.51.15-1.04-.14-1.19-.65-.15-.51.14-1.04.65-1.19 3.63-1.1 9.61-.89 13.43 1.38.46.27.61.87.34 1.33-.27.46-.87.61-1.35.3z"/>
        </svg>
      ), 
      desc: 'Focus better with ad-free study playlists. Premium access.' 
    },
  ];

  const [copiedCode, setCopiedCode] = useState(null);

  const handleUseCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="discounts-page">
      <header className="discounts-header">
        <h1>Exclusive Rewards</h1>
        <p className="header-subtitle">Premium perks curated specifically for our resident community.</p>
      </header>

      <div className="offers-grid">
        {offers.map((offer, idx) => (
          <div key={idx} className="offer-card">
            <div className="offer-card-header">
              <div className="brand-box" style={{ backgroundColor: offer.color, color: offer.textColor }}>
                {offer.icon}
                <span className="brand-name">{offer.partner}</span>
              </div>
              <span className="verified-badge">Verified</span>
            </div>

            <div className="offer-content">
              <h2 className="offer-value" style={{ color: offer.color }}>{offer.discount}</h2>
              <p className="offer-desc">{offer.desc}</p>
            </div>

            <div className="coupon-wrapper">
              <div className="coupon-code-box" onClick={() => handleUseCoupon(offer.code)}>
                <code>{offer.code}</code>
                {copiedCode === offer.code && (
                  <div className="copied-overlay" style={{ backgroundColor: offer.color, color: offer.textColor }}>
                    COPIED!
                  </div>
                )}
              </div>
              
              <button 
                className="get-coupon-btn" 
                style={{ backgroundColor: offer.color, color: offer.textColor }}
                onClick={() => handleUseCoupon(offer.code)}
              >
                {copiedCode === offer.code ? '✓ Code Copied' : 'Get Coupon'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discounts;
