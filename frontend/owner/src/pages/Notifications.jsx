import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  Bell, Search, Filter, Settings, Check, 
  Trash2, X, Archive, Eye, Zap, 
  Smartphone, Mail, AlertTriangle, 
  Info, CreditCard, Box, MessageSquare, 
  Users, Shield, FileText, LayoutGrid, User, Briefcase, Send, CheckCircle
} from 'lucide-react';
import { api } from '../mockData';
import { io } from 'socket.io-client';

const Notifications = () => {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); 
  const [activePortal, setActivePortal] = useState('All'); 
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Composer State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerData, setComposerData] = useState({ title: '', message: '', target: 'All Tenants' });

  const [notifSettings, setNotifSettings] = useState({
    payments: { enabled: true, priority: 'high', delivery: ['in-app', 'sms'] },
    inventory: { enabled: true, priority: 'medium', delivery: ['in-app'] },
    complaints: { enabled: true, priority: 'high', delivery: ['in-app', 'email'] },
    staff: { enabled: true, priority: 'medium', delivery: ['in-app'] },
    hygiene: { enabled: true, priority: 'low', delivery: ['in-app'] },
    security: { enabled: true, priority: 'high', delivery: ['in-app', 'sms', 'email'] },
  });

  const categories = [
    { id: 'all', name: 'All', icon: <LayoutGrid size={18} /> },
    { id: 'Payments', name: 'Payments', icon: <CreditCard size={18} /> },
    { id: 'Rooms', name: 'Rooms', icon: <Box size={18} /> },
    { id: 'Inventory', name: 'Inventory', icon: <Box size={18} /> },
    { id: 'Complaints', name: 'Complaints', icon: <MessageSquare size={18} /> },
    { id: 'Staff', name: 'Staff', icon: <Briefcase size={18} /> },
    { id: 'Hygiene', name: 'Hygiene', icon: <Zap size={18} /> },
    { id: 'Tenants', name: 'Tenants', icon: <Users size={18} /> },
    { id: 'Security', name: 'Security', icon: <Shield size={18} /> },
    { id: 'Reports', name: 'Reports', icon: <FileText size={18} /> },
  ];

  const portals = ['All', 'Tenant', 'Staff', 'Owner'];

  useEffect(() => {
    if (activeBuildingId) {
      fetchNotifications();
      const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
      const socket = io(socketUrl);
      socket.emit('joinBuilding', activeBuildingId);
      socket.on('newNotification', (newNotif) => {
        setNotifications(prev => [newNotif, ...prev]);
        setUnreadCount(prev => prev + 1);
      });
      return () => socket.disconnect();
    }
  }, [activeBuildingId]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await api.getNotifications(activeBuildingId);
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeed = async () => {
    try {
      await api.seedNotifications(activeBuildingId);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to seed notifications:', err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const portalType = composerData.target === 'Staff Members' ? 'Staff' : 'Tenant';
      await api.sendNotification({
        title: composerData.title,
        message: composerData.message,
        target: composerData.target,
        portalType,
        moduleName: 'Owner',
        category: 'Announcement',
        buildingId: activeBuildingId,
        priority: 'Medium',
        type: 'info'
      });
      fetchNotifications();
      setIsComposerOpen(false);
      setComposerData({ title: '', message: '', target: 'All Tenants' });
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications
      .filter(n => activeTab === 'all' || n.moduleName === activeTab || n.category === activeTab)
      .filter(n => activePortal === 'All' || n.portalType === activePortal)
      .filter(n => filterPriority === 'all' || n.priority === filterPriority)
      .filter(n => 
        (n.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         n.message?.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [notifications, activeTab, activePortal, filterPriority, searchQuery]);

  const handleMarkAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => (n.id === id || n._id === id) ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead(activeBuildingId);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id && n._id !== id));
      const removed = notifications.find(n => n.id === id || n._id === id);
      if (removed && !removed.isRead) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const handleArchive = async (id) => {
    try {
      await api.archiveNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id && n._id !== id));
    } catch (err) {
      console.error('Failed to archive:', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#3B82F6';
      default: return 'var(--text-muted)';
    }
  };

  const getModuleIcon = (module) => {
    const cat = categories.find(c => c.id === module);
    return cat ? cat.icon : <Bell size={18} />;
  };

  const getPortalBadge = (portal) => {
    const colors = {
      'Tenant': { bg: 'rgba(16, 185, 129, 0.1)', color: '#10B981', icon: <User size={12} /> },
      'Staff': { bg: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', icon: <Briefcase size={12} /> },
      'Owner': { bg: 'rgba(14, 165, 233, 0.1)', color: '#0EA5E9', icon: <Shield size={12} /> },
    };
    const style = colors[portal] || colors['Owner'];
    return (
      <span style={{ 
        display: 'flex', alignItems: 'center', gap: '0.3rem', 
        padding: '0.2rem 0.6rem', borderRadius: '100px', 
        background: style.bg, color: style.color, 
        fontSize: '0.65rem', fontWeight: '800', textTransform: 'uppercase'
      }}>
        {style.icon} {portal}
      </span>
    );
  };

  const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '100%' };

  return (
    <div className="notifications-page" style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '900', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Notification Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>
            Centralized alerts from Tenants, Staff, and Operations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setIsComposerOpen(true)} className="btn" style={{ background: '#10B981', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={18} /> Compose Alert
          </button>
          <button onClick={handleSeed} className="btn" style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={18} /> Simulate Alerts
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="btn" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={18} /> Settings
          </button>
          <button onClick={handleMarkAllRead} className="btn btn-secondary">
            Mark all read
          </button>
        </div>
      </header>

      <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '24px', marginBottom: '2rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
            />
          </div>
          <select value={activePortal} onChange={(e) => setActivePortal(e.target.value)} style={{ padding: '0.8rem', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: '700' }}>
             {portals.map(p => <option key={p} value={p}>{p} Portal</option>)}
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} style={{ padding: '0.8rem', borderRadius: '14px', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontWeight: '700' }}>
             <option value="all">All Priorities</option>
             <option value="High">High Priority</option>
             <option value="Medium">Medium Priority</option>
             <option value="Low">Low Priority</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.3rem', padding: '0.4rem', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-color)', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.8rem', borderRadius: '10px', border: 'none',
                background: activeTab === cat.id ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === cat.id ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer', transition: 'all 0.2s ease', fontWeight: '700', flexShrink: 0
              }}
            >
              {cat.icon} <span style={{ fontSize: '0.75rem' }}>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '1.2rem' }}>
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n, idx) => (
              <motion.div
                key={n.id || n._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  background: 'var(--bg-secondary)', borderRadius: '20px', padding: '1.25rem', borderLeft: `5px solid ${getPriorityColor(n.priority)}`,
                  boxShadow: n.isRead ? 'none' : 'var(--shadow-md)', border: '1px solid var(--border-color)', display: 'flex', gap: '1.2rem', position: 'relative'
                }}
              >
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: n.isRead ? 'var(--bg-tertiary)' : 'var(--accent-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: n.isRead ? 'var(--text-muted)' : 'var(--accent-primary)', flexShrink: 0 }}>
                  {getModuleIcon(n.moduleName)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {getPortalBadge(n.portalType)}
                      <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{n.moduleName}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.3rem', color: n.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{n.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>{n.message}</p>
                  <div style={{ display: 'flex', gap: '0.8rem' }}>
                    {!n.isRead && <button onClick={() => handleMarkAsRead(n.id || n._id)} className="btn-notif-action"><Check size={14} /> Mark read</button>}
                    <button onClick={() => handleArchive(n.id || n._id)} className="btn-notif-action"><Archive size={14} /> Archive</button>
                  </div>
                </div>
                <button onClick={() => handleDelete(n.id || n._id)} style={{ position: 'absolute', right: '1rem', top: '1rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </motion.div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem', gridColumn: '1 / -1' }}>
              <Bell size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>All caught up!</h2>
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isComposerOpen && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }} onClick={() => setIsComposerOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ position: 'relative', width: '90%', maxWidth: '500px', background: 'var(--bg-primary)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)', maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900' }}>Send Broadcast Alert</h2>
                <X style={{ cursor: 'pointer' }} onClick={() => setIsComposerOpen(false)} />
              </div>
              <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>Target Audience</label>
                  <select value={composerData.target} onChange={e => setComposerData({...composerData, target: e.target.value})} style={inputStyle}>
                    <option>All Tenants</option>
                    <option>Staff Members</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>Title</label>
                  <input type="text" placeholder="e.g. Mess Update, Maintenance Notice" value={composerData.title} onChange={e => setComposerData({...composerData, title: e.target.value})} style={inputStyle} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>Message</label>
                  <textarea rows="4" placeholder="Type your message here..." value={composerData.message} onChange={e => setComposerData({...composerData, message: e.target.value})} style={inputStyle} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', background: 'var(--accent-primary)', border: 'none', color: 'white', fontWeight: '800', borderRadius: '12px' }}>
                  Send Broadcast
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }} onClick={() => setIsSettingsOpen(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ position: 'relative', width: '90%', maxWidth: '500px', background: 'var(--bg-primary)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)', maxHeight: '80vh', overflowY: 'auto' }}>
               <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem' }}>Hub Settings</h2>
               {Object.entries(notifSettings).map(([key, config]) => (
                 <div key={key} style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ textTransform: 'capitalize', fontWeight: '700' }}>{key}</span>
                      <input type="checkbox" checked={config.enabled} onChange={e => setNotifSettings({...notifSettings, [key]: {...config, enabled: e.target.checked}})} />
                    </div>
                 </div>
               ))}
               <button onClick={() => setIsSettingsOpen(false)} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .btn-notif-action { background: transparent; border: none; display: flex; align-items: center; gap: 0.3rem; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); cursor: pointer; }
        .btn-notif-action:hover { color: var(--text-primary); }
      `}</style>
    </div>
  );
};

export default Notifications;
