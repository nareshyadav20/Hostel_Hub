import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Wallet, Wrench, Home, MapPin, Headset } from 'lucide-react';
import './OurServices.css';

const OurServices = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      icon: <ShieldCheck size={28} strokeWidth={2} />,
      title: 'Verified & Safe Properties',
      points: ['Verified Listings', 'Secure Access & CCTV', 'Trusted Management'],
      color: '#4F46E5',
      bg: '#EEF2FF',
    },
    {
      icon: <Wallet size={28} strokeWidth={2} />,
      title: 'Transparent Rent',
      points: ['No Hidden Charges', 'Zero Brokerage', 'Digital Rent Records'],
      color: '#059669',
      bg: '#ECFDF5',
    },
    {
      icon: <Wrench size={28} strokeWidth={2} />,
      title: 'Maintenance Support',
      points: ['Raise Requests Online', 'Track Status', 'Fast Resolution'],
      color: '#0891B2',
      bg: '#ECFEFF',
    },
    {
      icon: <Home size={28} strokeWidth={2} />,
      title: 'Fully Furnished Living',
      points: ['Ready-to-Move Rooms', 'High-Speed Internet', 'Essential Furniture'],
      color: '#D97706',
      bg: '#FFFBEB',
    },
    {
      icon: <MapPin size={28} strokeWidth={2} />,
      title: 'Prime Locations',
      points: ['Near Colleges & Offices', 'Easy Transport Access', 'Daily Essentials Nearby'],
      color: '#7C3AED',
      bg: '#F5F3FF',
    },
    {
      icon: <Headset size={28} strokeWidth={2} />,
      title: 'Dedicated Tenant Support',
      points: ['Quick Assistance', 'Tenant Help Desk', 'Ongoing Support'],
      color: '#DB2777',
      bg: '#FDF2F8',
    },
  ];

  const stats = [
    { icon: '🏠', value: '500+', label: 'Verified Properties' },
    { icon: '👥', value: '10,000+', label: 'Happy Residents' },
    { icon: '📍', value: '8+', label: 'Multiple Cities' },
    { icon: '⭐', value: '4.8', label: 'Average Rating' },
  ];

  return (
    <div className="os-wrap">

      {/* Hero Section */}
      <section className="os-hero">
        <p className="os-eyebrow">FOR STUDENTS & PROFESSIONALS</p>
        <h1 className="os-h1">
          Designed Around <span className="os-h1-accent">Tenant Needs</span>
        </h1>
        <p className="os-hero-sub">
          From verified properties to ongoing support, Livora helps you enjoy a comfortable and worry-free stay.
        </p>
      </section>

      {/* Services Grid */}
      <section className="os-grid-section">
        <div className="os-grid">
          {services.map((s, i) => (
            <div key={i} className="os-card" style={{ '--c': s.color, '--bg': s.bg }}>
              <div className="os-card-icon" style={{ color: s.color }}>
                {s.icon}
              </div>
              <h3 className="os-card-title">{s.title}</h3>
              <ul className="os-card-list">
                {s.points.map((p, j) => (
                  <li key={j}>
                    <svg className="os-check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Micro Statistics */}
      <section className="os-stats-section">
        <div className="os-stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="os-stat-item">
              <span className="os-stat-icon">{stat.icon}</span>
              <div className="os-stat-content">
                <span className="os-stat-value">{stat.value}</span>
                <span className="os-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Strip */}
      <section className="os-cta-strip">
        <h2>Ready to find your room?</h2>
        <p>Join thousands of happy tenants already living with Livora.</p>
        <div className="os-cta-row">
          <button className="os-cta-btn" onClick={() => navigate('/explore')}>
            Explore Properties →
          </button>
          <button className="os-cta-ghost" onClick={() => navigate('/signup')}>
            Create Free Account
          </button>
        </div>
      </section>

    </div>
  );
};

export default OurServices;
