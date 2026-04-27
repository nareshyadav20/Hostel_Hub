import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, backendOnline } from '../mockData';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';
import './Layout.css';

// ── tiny hook: polls /api/ping every 30 s to track backend status ──
function useBackendStatus() {
  const [status, setStatus] = useState(null); // null | 'live' | 'cached'
  const timer = useRef(null);

  const check = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/ping', { signal: AbortSignal.timeout(3000) });
      if (res.ok) { setStatus('live'); return; }
      throw new Error('non-ok');
    } catch {
      // backend unreachable – rely on cache
      setStatus('cached');
    }
  };

  useEffect(() => {
    check();
    timer.current = setInterval(check, 30_000);
    return () => clearInterval(timer.current);
  }, []);

  return status;
}

// ── status badge component ─────────────────────────────────────
const StatusBadge = ({ status }) => {
  if (status === null) return null;

  const live    = status === 'live';
  const color   = live ? '#10B981' : '#F59E0B';
  const bg      = live ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)';
  const label   = live ? 'Live' : 'Cached';
  const title   = live
    ? 'Connected to backend — showing real-time data'
    : 'Backend offline — showing last cached data';

  return (
    <div
      title={title}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.35rem',
        padding: '0.3rem 0.75rem', borderRadius: '100px',
        background: bg, border: `1px solid ${color}30`,
        fontSize: '0.75rem', fontWeight: '700', color,
        letterSpacing: '0.03em', userSelect: 'none',
        transition: 'all 0.4s ease',
      }}
    >
      {/* animated dot */}
      <span style={{
        width: '7px', height: '7px', borderRadius: '50%',
        background: color,
        boxShadow: live ? `0 0 0 0 ${color}` : 'none',
        animation: live ? 'pulse-dot 1.8s ease-in-out infinite' : 'none',
        flexShrink: 0,
      }} />
      {label}
    </div>
  );
};

const Layout = ({ children }) => {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const backendStatus = useBackendStatus();

  useEffect(() => {
    api.getBuildings().then(data => setBuildings(data || []));
  }, []);

  return (
    <div className="layout">
      {/* pulse-dot keyframe injected once */}
      <style>{`
        @keyframes pulse-dot {
          0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.6); }
          70%  { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
      `}</style>

      <Sidebar />
      <main className="main-content">
        <header className="content-header">

          {/* ── Building selector pills ── */}
          <div className="header-building-selector" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {buildings.length === 0 ? (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {backendStatus === null ? 'Loading…' : backendStatus === 'cached' && buildings.length === 0
                  ? 'No data — connect to backend once to cache data.'
                  : 'No buildings found.'}
              </span>
            ) : buildingId ? (
              (() => {
                const b = buildings.find(x => (x.id || x._id) === buildingId);
                if (!b) return null;
                return (
                  <div style={{
                    padding: '0.42rem 1.05rem',
                    borderRadius: '100px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <span>🏢</span> {b.name}
                  </div>
                );
              })()
            ) : null}
          </div>

          {/* ── Right side: theme + bell + profile ── */}
          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ThemeToggle />
            <div className="notifications" style={{ color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <ProfileDropdown />
          </div>

        </header>
        <div className="content-body">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
