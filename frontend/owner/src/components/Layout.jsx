import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiBase}/ping`, { signal: AbortSignal.timeout(3000) });
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
  const { buildingId: urlBuildingId } = useParams();
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState([]);
  const backendStatus = useBackendStatus();

  // Step 1: Persistent context
  const [activeBuildingId, setActiveBuildingId] = useState(
    urlBuildingId || localStorage.getItem('selectedBuildingId')
  );

  useEffect(() => {
    api.getBuildings().then(data => {
      setBuildings(data || []);
      console.log("Buildings loaded:", data?.length);
    });
  }, []);

  useEffect(() => {
    if (buildings.length > 0) {
      const exists = buildings.find(b => (b.id || b._id) === activeBuildingId);
      if (!exists) {
        const firstId = buildings[0].id || buildings[0]._id;
        console.log("Stale ID detected. Redirecting to default building:", firstId);
        
        // Update state and storage
        setActiveBuildingId(firstId);
        localStorage.setItem('selectedBuildingId', firstId);
        
        // If the URL contains the stale ID, redirect to the new one
        if (urlBuildingId) {
          const currentPath = window.location.pathname;
          const newPath = currentPath.replace(urlBuildingId, firstId);
          navigate(newPath);
        }

        // Clear old hh_ cache to ensure fresh demo data
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('hh_')) localStorage.removeItem(key);
        });
      }
    }
  }, [buildings, activeBuildingId, urlBuildingId, navigate]);

  useEffect(() => {
    if (urlBuildingId) {
      const isValid = buildings.length === 0 || buildings.some(b => (b.id || b._id) === urlBuildingId);
      if (isValid) {
        localStorage.setItem('selectedBuildingId', urlBuildingId);
        setActiveBuildingId(urlBuildingId);
        console.log("Selected Building ID saved:", urlBuildingId);
      }
    }
  }, [urlBuildingId, buildings]);

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

          {/* ── Building Information ── */}
          <div className="header-building-info" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {buildings.length > 0 ? (
              (() => {
                const b = buildings.find(x => (x.id || x._id) === activeBuildingId) || buildings[0];
                return (
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      background: 'var(--bg-tertiary)',
                      padding: '0.5rem 1.25rem',
                      borderRadius: '12px',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem'
                    }}>
                      🏢
                    </div>
                    <div>
                      <p style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, lineHeight: 1 }}>Active Property</p>
                      <h2 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0.1rem 0 0 0', lineHeight: 1 }}>{b.name}</h2>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div style={{ height: '40px', width: '150px', background: 'var(--bg-tertiary)', borderRadius: '12px', animation: 'pulse 2s infinite' }} />
            )}
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
