import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Copy, Check, Tag, Gift, Zap, Clock, Star, Users, Percent } from 'lucide-react';
import './Offers.css';

const OFFERS = [
  {
    id: 1,
    badge: '🔥 Hot Deal',
    badgeColor: '#EF4444',
    title: 'First Month Free',
    description: 'Book any co-living space for 6+ months and get your first month absolutely FREE. Limited spots available.',
    code: 'LIVFIRST',
    discount: '1 Month Free',
    validTill: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    category: 'New Move-in',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: <Gift size={28} color="#fff" />,
    terms: 'Valid for new tenants only. Minimum 6-month commitment.'
  },
  {
    id: 2,
    badge: '⚡ Flash Offer',
    badgeColor: '#F59E0B',
    title: '₹3,000 Off on Booking',
    description: 'Get ₹3,000 instant discount on your first booking. Use the promo code at checkout. Valid for all cities.',
    code: 'LIVORA3K',
    discount: '₹3,000 Off',
    validTill: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    category: 'Limited Time',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: <Zap size={28} color="#fff" />,
    terms: 'One-time use per account. Non-transferable.'
  },
  {
    id: 3,
    badge: '👥 Refer & Earn',
    badgeColor: '#10B981',
    title: 'Refer a Friend, Earn ₹2,000',
    description: 'Invite your friends to Livora. For every friend who moves in, you earn ₹2,000 as wallet credits.',
    code: 'REFER2K',
    discount: '₹2,000 Credits',
    validTill: null, // Ongoing
    category: 'Referral',
    gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    icon: <Users size={28} color="#fff" />,
    terms: 'Credits apply after referred friend completes 1 month.'
  },
  {
    id: 4,
    badge: '🏢 Corporate',
    badgeColor: '#5B5BD6',
    title: '15% Corporate Discount',
    description: 'Special rates for corporate employees. Show your company ID during check-in and get 15% off every month.',
    code: 'CORP15',
    discount: '15% Monthly',
    validTill: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    category: 'Corporate',
    gradient: 'linear-gradient(135deg, #5B5BD6 0%, #8B5CF6 100%)',
    icon: <Percent size={28} color="#fff" />,
    terms: 'Valid for verified employees of registered companies.'
  },
  {
    id: 5,
    badge: '🎓 Student Special',
    badgeColor: '#0891B2',
    title: '10% Student Discount',
    description: 'Enrolled in a university or college? Show your valid ID and get 10% off on student hostel plans.',
    code: 'STUDENT10',
    discount: '10% Off',
    validTill: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    category: 'Student',
    gradient: 'linear-gradient(135deg, #0891B2 0%, #38bdf8 100%)',
    icon: <Star size={28} color="#fff" />,
    terms: 'Requires valid student ID. One per student enrollment.'
  },
  {
    id: 6,
    badge: '🏖️ Long Stay',
    badgeColor: '#D97706',
    title: '20% Off for 12 Months',
    description: 'Commit to a full year and save big! Enjoy 20% off your total rent when you book for 12 months upfront.',
    code: 'ANNUAL20',
    discount: '20% Off',
    validTill: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    category: 'Long Stay',
    gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    icon: <Tag size={28} color="#fff" />,
    terms: 'Applicable on full upfront payment only.'
  }
];

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calc = () => {
      const diff = targetDate - Date.now();
      if (diff <= 0) return setTimeLeft({ expired: true });
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60)
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (timeLeft.expired) return <span className="offer-timer expired">Expired</span>;

  return (
    <div className="offer-timer">
      <Clock size={13} />
      {timeLeft.d > 0 && <span>{timeLeft.d}d </span>}
      <span>{String(timeLeft.h).padStart(2,'0')}h </span>
      <span>{String(timeLeft.m).padStart(2,'0')}m </span>
      <span>{String(timeLeft.s).padStart(2,'0')}s</span>
    </div>
  );
};

const OfferCard = ({ offer }) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="offer-card">
      <div className="offer-card-header" style={{ background: offer.gradient }}>
        <div className="offer-icon-wrap">{offer.icon}</div>
        <div className="offer-badge" style={{ background: offer.badgeColor }}>{offer.badge}</div>
        <div className="offer-discount-pill">{offer.discount}</div>
      </div>
      <div className="offer-card-body">
        <span className="offer-category">{offer.category}</span>
        <h3 className="offer-title">{offer.title}</h3>
        <p className="offer-desc">{offer.description}</p>

        <div className="offer-code-box">
          <div className="offer-code-label">Promo Code</div>
          <div className="offer-code-row">
            <span className="offer-code">{offer.code}</span>
            <button className="offer-copy-btn" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {offer.validTill && (
          <div className="offer-validity">
            <CountdownTimer targetDate={offer.validTill} />
          </div>
        )}
        {!offer.validTill && (
          <div className="offer-ongoing">✅ Ongoing — No Expiry</div>
        )}

        <div className="offer-terms">* {offer.terms}</div>

        <button className="offer-cta-btn" onClick={() => navigate('/explore')}>
          Book Now & Apply →
        </button>
      </div>
    </div>
  );
};

const Offers = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'New Move-in', 'Limited Time', 'Referral', 'Corporate', 'Student', 'Long Stay'];

  const filtered = activeFilter === 'All'
    ? OFFERS
    : OFFERS.filter(o => o.category === activeFilter);

  return (
    <div className="offers-page">
      {/* Header */}
      <header className="offers-header">
        <div className="offers-container header-flex">
          <div className="offers-logo" onClick={() => navigate('/')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 9V20C3 20.55 3.21 21.04 3.59 21.41 3.96 21.79 4.47 22 5 22H19C19.53 22 20.04 21.79 20.41 21.41 20.79 21.04 21 20.55 21 20V9L12 2Z" fill="#5B5BD6"/>
              <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="offers-logo-text">Livora</span>
          </div>
          <button className="offers-back-btn" onClick={() => navigate('/')}>
            <ChevronLeft size={16} /> Back to Home
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="offers-hero">
        <div className="offers-hero-glow" />
        <span className="offers-hero-eyebrow">🎁 Exclusive Deals</span>
        <h1 className="offers-hero-title">Offers & Discounts</h1>
        <p className="offers-hero-sub">Unlock incredible savings on your next move. Copy a promo code and apply at checkout.</p>
        <div className="offers-hero-stats">
          <div className="offers-hero-stat"><strong>{OFFERS.length}</strong><span>Active Offers</span></div>
          <div className="offers-hero-stat-div" />
          <div className="offers-hero-stat"><strong>₹20K+</strong><span>Max Savings</span></div>
          <div className="offers-hero-stat-div" />
          <div className="offers-hero-stat"><strong>All Cities</strong><span>India-Wide</span></div>
        </div>
      </section>

      <div className="offers-container">
        {/* Filter Tabs */}
        <div className="offers-filter-row">
          {filters.map(f => (
            <button
              key={f}
              className={`offers-filter-chip ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="offers-grid">
          {filtered.map((offer, i) => (
            <div key={offer.id} style={{ animationDelay: `${i * 0.08}s` }} className="offer-card-anim">
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>

        {/* Referral Banner */}
        <div className="offers-referral-banner">
          <div className="offers-referral-left">
            <div className="offers-referral-icon">🤝</div>
            <div>
              <h3>Invite Friends, Earn Together</h3>
              <p>Share your unique referral link. For every friend who moves into a Livora property, both of you get ₹2,000 wallet credits.</p>
            </div>
          </div>
          <button className="offers-referral-btn" onClick={() => navigate('/login')}>
            Get My Referral Link
          </button>
        </div>
      </div>

      <footer className="offers-footer">

      </footer>
    </div>
  );
};

export default Offers;
