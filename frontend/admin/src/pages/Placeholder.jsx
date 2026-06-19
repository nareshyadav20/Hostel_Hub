import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Rocket, Clock, Sparkles, Zap, Shield, BarChart3 } from 'lucide-react';

const featureCards = [
  { icon: <Zap size={22} />, title: 'Automation Engine', desc: 'Smart workflows & triggers' },
  { icon: <Shield size={22} />, title: 'Enterprise Security', desc: 'AES-256 encryption at rest' },
  { icon: <BarChart3 size={22} />, title: 'Advanced Analytics', desc: 'Real-time intelligence suite' },
  { icon: <Sparkles size={22} />, title: 'AI Insights', desc: 'Predictive recommendations' },
];

const Placeholder = ({ title }) => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background, #f8fafc)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      position: 'relative',
    }}>

      {/* Back Button — top left */}
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.6rem 1.2rem',
          background: 'var(--surface, #ffffff)',
          border: '1px solid var(--border, #e2e8f0)',
          borderRadius: '12px',
          color: 'var(--text-main, #0f172a)',
          fontWeight: '700',
          fontSize: '0.85rem',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#f0fdf4';
          e.currentTarget.style.borderColor = '#16a34a';
          e.currentTarget.style.color = '#15803d';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'var(--surface, #ffffff)';
          e.currentTarget.style.borderColor = 'var(--border, #e2e8f0)';
          e.currentTarget.style.color = 'var(--text-main, #0f172a)';
        }}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Pulsing Icon */}
      <div style={{
        width: '88px',
        height: '88px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        animation: 'placeholderPulse 2.5s ease-in-out infinite',
        boxShadow: '0 0 0 0 rgba(22,163,74,0.15)',
      }}>
        <Rocket size={40} style={{ color: '#16a34a' }} />
      </div>

      {/* Title */}
      <h1 style={{
        fontSize: '2rem',
        fontWeight: '800',
        color: 'var(--text-main, #0f172a)',
        letterSpacing: '-0.03em',
        marginBottom: '0.5rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {title} Module
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '0.95rem',
        fontWeight: '500',
        color: 'var(--text-secondary, #475569)',
        maxWidth: '480px',
        textAlign: 'center',
        lineHeight: '1.6',
        marginBottom: '0.75rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        We are currently deploying the advanced enterprise features for the{' '}
        <span style={{ fontWeight: '700', color: 'var(--text-main, #0f172a)' }}>{title}</span> module.
        Check back soon for the full intelligence suite.
      </p>

      {/* ETA Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 1rem',
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: '100px',
        fontSize: '0.75rem',
        fontWeight: '700',
        color: '#15803d',
        marginBottom: '2.5rem',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        <Clock size={13} /> Estimated Launch: Coming Soon
      </div>

      {/* Feature Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        maxWidth: '900px',
        width: '100%',
      }}>
        {featureCards.map((card, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoveredCard(i)}
            onMouseLeave={() => setHoveredCard(null)}
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              border: `1px solid ${hoveredCard === i ? '#16a34a' : 'var(--border, #e2e8f0)'}`,
              background: hoveredCard === i
                ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                : 'var(--surface, #ffffff)',
              cursor: 'default',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hoveredCard === i ? 'translateY(-4px)' : 'translateY(0)',
              boxShadow: hoveredCard === i
                ? '0 12px 24px rgba(22, 163, 74, 0.12)'
                : '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: hoveredCard === i ? '#16a34a' : '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: hoveredCard === i ? '#ffffff' : '#16a34a',
              marginBottom: '0.75rem',
              transition: 'all 0.3s ease',
            }}>
              {card.icon}
            </div>
            <h3 style={{
              fontSize: '0.9rem',
              fontWeight: '800',
              color: 'var(--text-main, #0f172a)',
              marginBottom: '0.25rem',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              {card.title}
            </h3>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: '500',
              color: 'var(--text-secondary, #475569)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Inline Keyframes */}
      <style>{`
        @keyframes placeholderPulse {
          0% { box-shadow: 0 0 0 0 rgba(22,163,74,0.2); transform: scale(1); }
          50% { box-shadow: 0 0 0 18px rgba(22,163,74,0); transform: scale(1.05); }
          100% { box-shadow: 0 0 0 0 rgba(22,163,74,0); transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Placeholder;
