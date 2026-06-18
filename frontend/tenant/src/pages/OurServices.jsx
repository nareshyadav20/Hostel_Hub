import React, { useEffect } from 'react';
import { ShieldCheck, Wallet, Wrench, Home, MapPin, Headset } from 'lucide-react';
import './OurServices.css';

const services = [
  {
    icon: <ShieldCheck size={28} strokeWidth={1.5} />,
    title: 'Verified & Safe Properties',
    points: ['Background-checked owners', 'Biometric entry & CCTV', 'Professional management'],
    color: '#4F46E5',
    bg: '#EEF2FF',
  },
  {
    icon: <Wallet size={28} strokeWidth={1.5} />,
    title: 'Transparent Renting',
    points: ['Zero brokerage', 'No hidden charges', 'Digital payment records'],
    color: '#059669',
    bg: '#ECFDF5',
  },
  {
    icon: <Wrench size={28} strokeWidth={1.5} />,
    title: 'Maintenance Support',
    points: ['In-app request tracking', '24-hour resolution', 'Certified technicians'],
    color: '#0891B2',
    bg: '#ECFEFF',
  },
  {
    icon: <Home size={28} strokeWidth={1.5} />,
    title: 'Fully Furnished Living',
    points: ['Move-in ready rooms', 'High-speed internet', 'Quality furniture included'],
    color: '#D97706',
    bg: '#FFFBEB',
  },
  {
    icon: <MapPin size={28} strokeWidth={1.5} />,
    title: 'Prime Locations',
    points: ['Near colleges & offices', 'Metro access', 'Daily essentials nearby'],
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  {
    icon: <Headset size={28} strokeWidth={1.5} />,
    title: 'Dedicated Tenant Support',
    points: ['24/7 help desk', 'Quick response', 'Dedicated account manager'],
    color: '#DB2777',
    bg: '#FDF2F8',
  },
];

const OurServices = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="os-page">
      <div className="os-inner">
        <div className="os-header">
          <span className="os-eyebrow">What We Offer</span>
          <h1 className="os-title">Our Premium Services</h1>
          <div className="os-divider" />
          <p className="os-subtitle">Everything you need for a comfortable, worry-free stay — all included.</p>
        </div>

        <div className="os-grid">
          {services.map((s, i) => (
            <div key={i} className="os-card" style={{ '--c': s.color, '--bg': s.bg }}>
              <div className="os-card-icon" style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <h3 className="os-card-title">{s.title}</h3>
              <ul className="os-card-list">
                {s.points.map((p, j) => (
                  <li key={j}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: s.color, flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurServices;
