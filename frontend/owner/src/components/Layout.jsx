import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../mockData';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';
import { Bell } from 'lucide-react';
import { io } from 'socket.io-client';
import './Layout.css';

// ── tiny hook: polls /api/ping every 30 s to track backend status ──
function useBackendStatus() {
  const [status, setStatus] = useState(null); // null | 'live' | 'cached'
  const timer = useRef(null);

  const check = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/ping', { signal: AbortSignal.timeout(3000) });
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
  const [buildings, setBuildings] = useState([]);
  const backendStatus = useBackendStatus();

  // Step 1: Persistent context
  const [activeBuildingId, setActiveBuildingId] = useState(
    urlBuildingId || localStorage.getItem('selectedBuildingId')
  );
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (activeBuildingId) {
      // Fetch initial unread count
      api.getNotificationUnreadCount(activeBuildingId).then(res => {
        setUnreadCount(res.count || 0);
      });

      // Socket.IO for real-time badge updates
      const socket = io('http://localhost:5000');
      socket.emit('joinBuilding', activeBuildingId);
      
      socket.on('newNotification', () => {
        setUnreadCount(prev => prev + 1);
      });

      socket.on('notificationUpdate', (data) => {
        if (data.type === 'NEW' && data.notification.buildingId === activeBuildingId) {
          setUnreadCount(prev => prev + 1);
        }
      });

      return () => socket.disconnect();
    }
  }, [activeBuildingId]);

  useEffect(() => {
    api.getBuildings().then(data => {
      setBuildings(data || []);
      console.log("Buildings loaded:", data?.length);
    });
  }, []);

  useEffect(() => {
    if (urlBuildingId) {
      localStorage.setItem('selectedBuildingId', urlBuildingId);
      setActiveBuildingId(urlBuildingId);
      console.log("Selected Building ID saved:", urlBuildingId);
    }
  }, [urlBuildingId]);

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
            <div 
              className="notifications" 
              onClick={() => window.location.href = `/owner/building/${activeBuildingId}/notifications`}
              style={{ 
                color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative',
                width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-tertiary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-color)'
              }}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-5px', right: '-5px',
                  background: '#EF4444', color: 'white', fontSize: '0.65rem',
                  fontWeight: '800', padding: '0.1rem 0.4rem', borderRadius: '10px',
                  border: '2px solid var(--bg-primary)',
                  boxShadow: '0 2px 5px rgba(239, 68, 68, 0.3)'
                }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
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
