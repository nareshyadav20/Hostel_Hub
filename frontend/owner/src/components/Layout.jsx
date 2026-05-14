import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { api, backendOnline } from '../mockData';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';
import NotificationToast from './NotificationToast';
import './Layout.css';
import API from '../api/axios';
import socket, { connectSocket } from '../utils/socket';

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
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [activeToast, setActiveToast] = useState(null);
  const backendStatus = useBackendStatus();

  // Step 1: Persistent context
  const [activeBuildingId, setActiveBuildingId] = useState(
    urlBuildingId || localStorage.getItem('selectedBuildingId')
  );

  useEffect(() => {
    api.getBuildings().then(data => {
      const bList = data || [];
      setBuildings(bList);
      console.log("Buildings loaded:", bList.length);
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
    if (activeBuildingId) {
      fetchNotifications();
      connectSocket(activeBuildingId);
      
      socket.on('newNotification', (notif) => {
        if (notif.portalType === 'Owner' || notif.portalType === 'All') {
          setNotifications(prev => [notif, ...prev]);
          setUnreadCount(prev => prev + 1);
          setActiveToast(notif);
        }
      });

      return () => {
        socket.off('newNotification');
      };
    }
  }, [activeBuildingId]);

  const fetchNotifications = async () => {
    try {
      const res = await API.get(`/notifications?buildingId=${activeBuildingId}`);
      const data = res.data || [];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

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
            <div className="notifications-wrapper" style={{ position: 'relative' }}>
              <div className={`notifications ${unreadCount > 0 ? 'has-unread' : ''}`} 
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                style={{ color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </div>

              <AnimatePresence>
                {showNotifDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="notif-dropdown glass-card"
                  >
                    <div className="dropdown-header">
                      <h4>Recent Notifications</h4>
                      {unreadCount > 0 && (
                        <button onClick={async () => {
                          await API.post('/notifications/mark-all-read', { category: 'all', buildingId: activeBuildingId });
                          fetchNotifications();
                        }}>Mark all read</button>
                      )}
                    </div>
                    <div className="dropdown-list">
                      {notifications.length === 0 ? (
                        <div className="empty-notif">No new notifications</div>
                      ) : (
                        notifications.slice(0, 5).map((n, i) => (
                          <div key={i} className={`dropdown-item ${n.isRead ? 'read' : 'unread'}`}
                            onClick={async () => {
                              if (!n.isRead) {
                                await API.patch(`/notifications/${n._id}/read`);
                                fetchNotifications();
                              }
                              setShowNotifDropdown(false);
                              if (n.actionLink) navigate(n.actionLink);
                            }}>
                            <div className="notif-icon">{n.category === 'Rent' ? '💰' : '🔔'}</div>
                            <div className="notif-text">
                              <h5>{n.title}</h5>
                              <p>{n.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="dropdown-footer">
                      <button onClick={() => { setShowNotifDropdown(false); navigate(`/owner/building/${activeBuildingId}/notifications`); }}>View All</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <ProfileDropdown />
          </div>

        </header>
        <div className="content-body">
          {children}
        </div>
      </main>

      <AnimatePresence>
        {activeToast && (
          <NotificationToast 
            notification={activeToast} 
            onClose={() => setActiveToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
