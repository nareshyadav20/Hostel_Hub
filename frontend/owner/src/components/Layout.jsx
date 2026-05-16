import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Bell, 
  Clock, 
  Trash2, 
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ShieldAlert,
  ChevronRight,
  X,
  Utensils
} from 'lucide-react';
import { api } from '../mockData';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import ProfileDropdown from './ProfileDropdown';
import { useNotifications } from '../context/NotificationContext';
import socket, { connectSocket } from '../utils/socket';
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

// ── Toast Component ───────────────────────────────────────────
const Toast = ({ notification, onClose }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'error': return <ShieldAlert size={20} color="#EF4444" />;
      case 'warning': return <AlertTriangle size={20} color="#F59E0B" />;
      case 'success': return <CheckCircle size={20} color="#10B981" />;
      default: return <Info size={20} color="#3B82F6" />;
    }
  };

  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        padding: '1rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        gap: '1rem',
        width: '320px',
        position: 'relative',
        overflow: 'hidden',
        pointerEvents: 'auto'
      }}
    >
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '3px',
        background: 'var(--accent-primary)',
        width: '100%',
        animation: 'toast-progress 5s linear forwards'
      }} />
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        {getIcon(notification.type)}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: '800', margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
          {notification.title}
        </h4>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
          {notification.message}
        </p>
      </div>
      <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', alignSelf: 'flex-start' }}>
        <X size={16} />
      </button>
    </motion.div>
  );
};

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
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [activeToasts, setActiveToasts] = useState([]);

  const [activeBuildingId, setActiveBuildingId] = useState(
    urlBuildingId || localStorage.getItem('selectedBuildingId')
  );

  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    setActiveBuildingId: setContextBuildingId,
    activeBuildingId: contextBuildingId // Get current context ID
  } = useNotifications();

  // Sync activeBuildingId with context ONLY if it differs
  useEffect(() => {
    if (activeBuildingId && activeBuildingId !== contextBuildingId) {
      setContextBuildingId(activeBuildingId);
    }
  }, [activeBuildingId, contextBuildingId, setContextBuildingId]);

  console.log('🔔 Layout Notifications State:', { 
    count: notifications.length, 
    unread: unreadCount,
    activeBuildingId 
  });

  // Toast Listener (Still needed here for UI)
  useEffect(() => {
    const handleNewNotif = (notif) => {
      // Show toast
      setActiveToasts(prev => [...prev, { ...notif, toastId: Date.now() }]);
    };
    
    socket.on('newNotification', handleNewNotif);
    return () => socket.off('newNotification', handleNewNotif);
  }, []);

  useEffect(() => {
    api.getBuildings().then(data => {
      const bList = data || [];
      setBuildings(bList);
    });
  }, []);

  useEffect(() => {
    if (buildings.length > 0) {
      const exists = buildings.find(b => (b.id || b._id) === activeBuildingId);
      if (!exists) {
        const firstId = buildings[0].id || buildings[0]._id;
        setActiveBuildingId(firstId);
        localStorage.setItem('selectedBuildingId', firstId);
        if (urlBuildingId) {
          const currentPath = window.location.pathname;
          const newPath = currentPath.replace(urlBuildingId, firstId);
          navigate(newPath);
        }
      }
    }
  }, [buildings, activeBuildingId, urlBuildingId, navigate]);

  useEffect(() => {
    if (urlBuildingId) {
      const isValid = buildings.length === 0 || buildings.some(b => (b.id || b._id) === urlBuildingId);
      if (isValid) {
        localStorage.setItem('selectedBuildingId', urlBuildingId);
        setActiveBuildingId(urlBuildingId);
      }
    }
  }, [urlBuildingId, buildings]);

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="layout">
      <style>{`
        @keyframes pulse-dot {
          0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.6); }
          70%  { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        .notif-item { transition: background 0.2s ease; cursor: pointer; border-bottom: 1px solid var(--border-color); }
        .notif-item:hover { background: var(--bg-tertiary); }
        .notif-item.unread { background: rgba(var(--accent-primary-rgb), 0.05); }
        .notif-item.unread:hover { background: rgba(var(--accent-primary-rgb), 0.08); }
      `}</style>

      {/* Toast Container */}
      <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: 'none' }}>
        <AnimatePresence>
          {activeToasts.map(toast => (
            <Toast 
              key={toast.toastId} 
              notification={toast} 
              onClose={() => setActiveToasts(prev => prev.filter(t => t.toastId !== toast.toastId))} 
            />
          ))}
        </AnimatePresence>
      </div>

      <Sidebar />
      <main className="main-content">
        <header className="content-header">
          <div className="header-building-info" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {buildings.length > 0 ? (
              (() => {
                const b = buildings.find(x => (x.id || x._id) === activeBuildingId) || buildings[0];
                return (
                  <div 
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--bg-tertiary)',
                      padding: '0.5rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.2rem'
                    }}>🏢</div>
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
            <StatusBadge status={backendStatus} />
          </div>

          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ThemeToggle />
            
            {/* Notification Bell */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="notifications" 
                style={{ 
                  color: showNotifDropdown ? 'var(--accent-primary)' : 'var(--text-secondary)', 
                  cursor: 'pointer',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: showNotifDropdown ? 'rgba(var(--accent-primary-rgb), 0.1)' : 'var(--bg-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  border: showNotifDropdown ? '1px solid var(--accent-primary)' : '1px solid var(--border-color)'
                }}
              >
                <Bell size={20} strokeWidth={2.5} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-5px', right: '-5px',
                    background: '#EF4444', color: 'white', fontSize: '0.65rem',
                    fontWeight: '900', padding: '0.1rem 0.4rem', borderRadius: '10px',
                    border: '2px solid var(--bg-secondary)',
                    boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
                    animation: 'pulse-badge 2s infinite'
                  }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </motion.div>

              <AnimatePresence>
                {showNotifDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{
                      position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                      width: '380px', background: 'var(--bg-primary)',
                      borderRadius: '20px', border: '1px solid var(--border-color)',
                      boxShadow: 'var(--shadow-xl)', zIndex: 1000,
                      overflow: 'hidden'
                    }}
                  >
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Notifications</h3>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={markAllAsRead}
                          style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Mark all read
                        </button>
                      </div>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {notifications.length > 0 ? (
                        notifications.slice(0, 10).map((n) => (
                          <div 
                            key={n.id || n._id} 
                            className={`notif-item ${!n.isRead ? 'unread' : ''}`}
                            style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', position: 'relative' }}
                            onClick={() => {
                              if (!n.isRead) markAsRead(n.id || n._id);
                              if (n.actionLink) navigate(n.actionLink);
                            }}
                          >
                            <div style={{ 
                              width: '40px', height: '40px', borderRadius: '10px', 
                              background: n.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-tertiary)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: n.type === 'error' ? '#EF4444' : 'var(--accent-primary)',
                              flexShrink: 0
                            }}>
                              {n.category === 'SOS Alert' ? <ShieldAlert size={20} /> : n.moduleName === 'Mess' ? <Utensils size={20} /> : <Bell size={20} />}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '800', margin: '0 0 0.2rem 0', color: 'var(--text-primary)' }}>{n.title}</h4>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                  <Clock size={10} /> {getTimeAgo(n.createdAt)}
                                </span>
                              </div>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>{n.message}</p>
                              {n.actionLink && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                                  View Details <ChevronRight size={12} />
                                </div>
                              )}
                            </div>
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteNotification(n.id || n._id); }}
                              style={{ position: 'absolute', right: '0.5rem', bottom: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', opacity: 0.5 }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                          <Bell size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                          <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>No notifications yet</p>
                        </div>
                      )}
                    </div>

                    <Link 
                      to={`/owner/building/${activeBuildingId}/notifications`}
                      onClick={() => setShowNotifDropdown(false)}
                      style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        padding: '1rem', background: 'var(--bg-tertiary)', borderTop: '1px solid var(--border-color)',
                        color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: '800', textDecoration: 'none'
                      }}
                    >
                      View All Notifications <ExternalLink size={14} />
                    </Link>
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

      <style>{`
        @keyframes pulse-badge {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Layout;
