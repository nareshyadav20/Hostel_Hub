import React from 'react';

/**
 * HostelIcon — Renders a unique SVG illustration per hostel type.
 * Props:
 *   name   — 'sunshine' | 'elite' | 'green' | '' (fallback)
 *   width  — SVG width  (default 110)
 *   height — SVG height (default 110)
 */
const HostelIcon = ({ name = '', width = 110, height = 110 }) => {
  const style = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  /* ── Sunshine Residency — warm yellow / orange building ── */
  if (name === 'sunshine') {
    return (
      <div style={style}>
        <svg width={width} height={height} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sun */}
          <circle cx="60" cy="28" r="14" fill="#fbbf24" opacity="0.9"/>
          <line x1="60" y1="8"  x2="60" y2="2"  stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
          <line x1="60" y1="48" x2="60" y2="54" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
          <line x1="40" y1="28" x2="34" y2="28" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
          <line x1="80" y1="28" x2="86" y2="28" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
          <line x1="46" y1="14" x2="42" y2="10" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
          <line x1="74" y1="42" x2="78" y2="46" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
          <line x1="74" y1="14" x2="78" y2="10" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
          <line x1="46" y1="42" x2="42" y2="46" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
          {/* Building */}
          <rect x="20" y="58" width="80" height="56" rx="4" fill="#f97316" opacity="0.85"/>
          <rect x="30" y="66" width="16" height="16" rx="2" fill="white" opacity="0.7"/>
          <rect x="52" y="66" width="16" height="16" rx="2" fill="white" opacity="0.7"/>
          <rect x="74" y="66" width="16" height="16" rx="2" fill="white" opacity="0.7"/>
          <rect x="30" y="90" width="16" height="24" rx="2" fill="white" opacity="0.5"/>
          <rect x="52" y="90" width="16" height="24" rx="2" fill="white" opacity="0.5"/>
          <rect x="74" y="90" width="16" height="24" rx="2" fill="white" opacity="0.5"/>
          {/* Roof */}
          <polygon points="14,58 60,34 106,58" fill="#ea580c" opacity="0.9"/>
        </svg>
      </div>
    );
  }

  /* ── Elite Living — sleek modern high-rise ── */
  if (name === 'elite') {
    return (
      <div style={style}>
        <svg width={width} height={height} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Main tower */}
          <rect x="36" y="20" width="48" height="96" rx="4" fill="#6366f1" opacity="0.85"/>
          {/* Floors */}
          {[30, 42, 54, 66, 78, 90].map((y, i) => (
            <g key={i}>
              <rect x="44" y={y} width="10" height="8" rx="1" fill="white" opacity="0.6"/>
              <rect x="58" y={y} width="10" height="8" rx="1" fill="white" opacity="0.6"/>
              <rect x="72" y={y} width="4"  height="8" rx="1" fill="#a5b4fc" opacity="0.5"/>
            </g>
          ))}
          {/* Entrance */}
          <rect x="48" y="96" width="24" height="20" rx="3" fill="#4338ca" opacity="0.9"/>
          <rect x="55" y="100" width="10" height="16" rx="1" fill="#e0e7ff" opacity="0.6"/>
          {/* Top accent */}
          <rect x="52" y="14" width="16" height="8" rx="2" fill="#818cf8" opacity="0.8"/>
          <rect x="57" y="8"  width="6"  height="8" rx="1" fill="#a5b4fc" opacity="0.7"/>
          {/* Stars */}
          <circle cx="20" cy="30" r="2" fill="#c7d2fe" opacity="0.5"/>
          <circle cx="100" cy="50" r="1.5" fill="#c7d2fe" opacity="0.4"/>
          <circle cx="15" cy="70" r="1"   fill="#c7d2fe" opacity="0.4"/>
        </svg>
      </div>
    );
  }

  /* ── Green View Hostel — nature / eco themed building ── */
  if (name === 'green') {
    return (
      <div style={style}>
        <svg width={width} height={height} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Trees */}
          <ellipse cx="18" cy="65" rx="12" ry="16" fill="#4ade80" opacity="0.7"/>
          <rect x="16" y="78" width="4" height="14" rx="1" fill="#713f12" opacity="0.6"/>
          <ellipse cx="102" cy="62" rx="11" ry="14" fill="#4ade80" opacity="0.7"/>
          <rect x="100" y="74" width="4" height="16" rx="1" fill="#713f12" opacity="0.6"/>
          {/* Building */}
          <rect x="26" y="54" width="68" height="62" rx="4" fill="#22c55e" opacity="0.8"/>
          {/* Windows */}
          <rect x="34" y="64" width="14" height="12" rx="2" fill="white" opacity="0.65"/>
          <rect x="53" y="64" width="14" height="12" rx="2" fill="white" opacity="0.65"/>
          <rect x="72" y="64" width="14" height="12" rx="2" fill="white" opacity="0.65"/>
          <rect x="34" y="82" width="14" height="12" rx="2" fill="white" opacity="0.5"/>
          <rect x="72" y="82" width="14" height="12" rx="2" fill="white" opacity="0.5"/>
          {/* Door */}
          <rect x="50" y="92" width="20" height="24" rx="3" fill="#15803d" opacity="0.9"/>
          <circle cx="68" cy="104" r="2" fill="#bbf7d0" opacity="0.8"/>
          {/* Roof */}
          <polygon points="20,54 60,24 100,54" fill="#16a34a" opacity="0.9"/>
          {/* Green accents on roof */}
          <ellipse cx="40" cy="44" rx="5" ry="6" fill="#4ade80" opacity="0.5"/>
          <ellipse cx="80" cy="44" rx="5" ry="6" fill="#4ade80" opacity="0.5"/>
          {/* Sun */}
          <circle cx="90" cy="20" r="8" fill="#fde68a" opacity="0.7"/>
        </svg>
      </div>
    );
  }

  /* ── Fallback — generic building ── */
  return (
    <div style={style}>
      <svg width={width} height={height} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="24" y="40" width="72" height="76" rx="4" fill="#38bdf8" opacity="0.7"/>
        <rect x="36" y="54" width="16" height="14" rx="2" fill="white" opacity="0.6"/>
        <rect x="68" y="54" width="16" height="14" rx="2" fill="white" opacity="0.6"/>
        <rect x="36" y="74" width="16" height="14" rx="2" fill="white" opacity="0.5"/>
        <rect x="68" y="74" width="16" height="14" rx="2" fill="white" opacity="0.5"/>
        <rect x="48" y="96" width="24" height="20" rx="2" fill="#0ea5e9" opacity="0.8"/>
        <polygon points="18,40 60,16 102,40" fill="#0284c7" opacity="0.85"/>
      </svg>
    </div>
  );
};

export default HostelIcon;
