import React, { useState, useMemo } from 'react';
import { 
  Bell, Search, Filter, Trash2, CheckCircle, 
  AlertCircle, Info, ShieldAlert, CreditCard, 
  Utensils, Users, Home, Wrench, MessageSquare,
  ArrowRight, Clock, Calendar, CheckSquare, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationContext';
import { format } from 'date-fns';
import API from '../api/axios';

const CATEGORIES = [
  { id: 'all', name: 'All', icon: <Bell size={18} /> },
  { id: 'Payments', name: 'Payments', icon: <CreditCard size={18} /> },
  { id: 'Complaints', name: 'Complaints', icon: <Wrench size={18} /> },
  { id: 'Mess', name: 'Mess', icon: <Utensils size={18} /> },
  { id: 'Rooms', name: 'Rooms', icon: <Home size={18} /> },
  { id: 'Community', name: 'Community', icon: <Users size={18} /> },
  { id: 'Safety', name: 'Safety', icon: <ShieldAlert size={18} /> },
  { id: 'Announcements', name: 'Updates', icon: <Info size={18} /> },
];

const Notifications = () => {
  const { notifications, loading, markAsRead, markAllAsRead, refresh } = useNotifications();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesCategory = activeCategory === 'all' || n.moduleName === activeCategory;
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           n.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUnread = showUnreadOnly ? !n.isRead : true;
      return matchesCategory && matchesSearch && matchesUnread;
    });
  }, [notifications, activeCategory, searchQuery, showUnreadOnly]);

  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const paginatedNotifications = filteredNotifications.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const getNotifIcon = (module) => {
    switch (module) {
      case 'Payments': return <CreditCard size={20} />;
      case 'Complaints': return <Wrench size={20} />;
      case 'Mess': return <Utensils size={20} />;
      case 'Rooms': return <Home size={20} />;
      case 'Community': return <Users size={20} />;
      case 'Safety': return <ShieldAlert size={20} />;
      default: return <Bell size={20} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      refresh();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <div className="notifications-page" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* ── HEADER SECTION ────────────────────────────────────────── */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' }}>
            Notifications
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500', marginTop: '0.4rem' }}>
            Stay updated with everything happening in your building.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`filter-btn ${showUnreadOnly ? 'active' : ''}`}
            style={{
              padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)',
              background: showUnreadOnly ? 'var(--accent-primary)' : 'var(--bg-secondary)',
              color: showUnreadOnly ? 'white' : 'var(--text-primary)',
              fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            {showUnreadOnly ? <CheckSquare size={18} /> : <Clock size={18} />}
            {showUnreadOnly ? 'Showing Unread' : 'Show All'}
          </button>
          <button 
            onClick={markAllAsRead}
            style={{
              padding: '0.8rem 1.2rem', borderRadius: '12px', border: 'none',
              background: 'var(--bg-tertiary)', color: 'var(--accent-primary)',
              fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <CheckCircle size={18} /> Mark All as Read
          </button>
        </div>
      </div>

      {/* ── FILTERS & SEARCH ──────────────────────────────────────── */}
      <div className="controls-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', marginBottom: '2rem' }}>
        <div className="category-tabs" style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setCurrentPage(1); }}
              style={{
                padding: '0.7rem 1.2rem', borderRadius: '14px', border: 'none',
                background: activeCategory === cat.id ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: activeCategory === cat.id ? 'white' : 'var(--text-secondary)',
                fontWeight: '700', fontSize: '0.85rem', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer',
                transition: 'all 0.3s ease', boxShadow: activeCategory === cat.id ? '0 8px 16px rgba(16,185,129,0.2)' : 'none'
              }}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>
        <div className="search-box" style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search notifications..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '16px',
              border: '1px solid var(--border-color)', background: 'var(--bg-primary)',
              color: 'var(--text-primary)', fontWeight: '600', outline: 'none'
            }}
          />
        </div>
      </div>

      {/* ── NOTIFICATIONS LIST ────────────────────────────────────── */}
      <div className="notifications-list" style={{ minHeight: '400px' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <div className="spinner"></div>
          </div>
        ) : paginatedNotifications.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px dashed var(--border-color)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Bell size={40} color="var(--text-muted)" style={{ opacity: 0.5 }} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>All Clear!</h3>
            <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>No notifications found in this category.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <AnimatePresence mode="popLayout">
              {paginatedNotifications.map((n, idx) => (
                <motion.div
                  key={n._id || n.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`notif-card ${n.isRead ? 'read' : 'unread'}`}
                  onClick={() => !n.isRead && markAsRead(n._id || n.id)}
                  style={{
                    padding: '1.25rem', borderRadius: '24px',
                    background: n.isRead ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                    border: `1px solid ${n.isRead ? 'var(--border-color)' : 'rgba(16,185,129,0.2)'}`,
                    boxShadow: n.isRead ? 'none' : '0 10px 20px rgba(16,185,129,0.05)',
                    display: 'flex', gap: '1.25rem', position: 'relative', cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div className="notif-icon-box" style={{ 
                    width: '56px', height: '56px', borderRadius: '18px',
                    background: n.isRead ? 'var(--bg-tertiary)' : 'rgba(16,185,129,0.1)',
                    color: n.isRead ? 'var(--text-muted)' : 'var(--accent-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    {getNotifIcon(n.moduleName)}
                  </div>
                  
                  <div className="notif-content" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '850', color: 'var(--text-primary)' }}>{n.title}</h4>
                        <span style={{ 
                          fontSize: '0.65rem', fontWeight: '900', textTransform: 'uppercase', 
                          padding: '0.3rem 0.6rem', borderRadius: '8px', 
                          background: `${getPriorityColor(n.priority)}15`, color: getPriorityColor(n.priority)
                        }}>
                          {n.priority}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={14} /> {format(new Date(n.createdAt), 'hh:mm a')}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: '500', lineHeight: 1.5 }}>
                      {n.message}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={14} /> {format(new Date(n.createdAt), 'dd MMM yyyy')}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <MessageSquare size={14} /> {n.moduleName}
                      </span>
                    </div>
                  </div>

                  <div className="notif-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(n._id || n.id); }}
                      style={{ padding: '0.5rem', borderRadius: '10px', border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', opacity: 0, transition: '0.2s' }}
                      className="delete-btn"
                    >
                      <Trash2 size={18} />
                    </button>
                    {!n.isRead && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-primary)', margin: '0.5rem auto' }}></div>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── PAGINATION ──────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                width: '40px', height: '40px', borderRadius: '12px', border: 'none',
                background: currentPage === i + 1 ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                color: currentPage === i + 1 ? 'white' : 'var(--text-primary)',
                fontWeight: '800', cursor: 'pointer', transition: '0.3s'
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .notif-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg) !important; border-color: var(--accent-primary) !important; }
        .notif-card:hover .delete-btn { opacity: 1 !important; }
        .filter-btn:hover { border-color: var(--accent-primary) !important; color: var(--accent-primary) !important; }
        .filter-btn.active:hover { color: white !important; }
        .category-tabs::-webkit-scrollbar { height: 0; }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(16, 185, 129, 0.1);
          border-top: 4px solid var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Notifications;
