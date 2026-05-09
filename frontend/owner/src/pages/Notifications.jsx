import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Bell, Send, Users, Building, Shield, Trash2, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { api } from '../mockData';

const Notifications = () => {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [activeBuildingId]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await api.getNotifications(activeBuildingId);
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerData, setComposerData] = useState({ title: '', message: '', target: 'All Tenants' });

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const category = composerData.target === 'Staff Members' ? 'staff' : 'all';
      await api.sendNotification({
        title: composerData.title,
        message: composerData.message,
        target: composerData.target,
        category,
        buildingId: activeBuildingId,
        type: 'info'
      });
      fetchNotifications();
      setIsComposerOpen(false);
      setComposerData({ title: '', message: '', target: 'All Tenants' });
      setActiveTab(category);
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead({ category: activeTab, buildingId: activeBuildingId });
      setNotifications(notifications.map(m => {
        if (activeTab === 'all' || m.category === activeTab) return { ...m, read: true };
        return m;
      }));
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.deleteNotification(id);
      setNotifications(notifications.filter(m => m.id !== id && m._id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const currentData = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === activeTab);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={18} color="var(--accent-success)" />;
      case 'warning': return <AlertTriangle size={18} color="var(--accent-warning)" />;
      default: return <Info size={18} color="var(--accent-primary)" />;
    }
  };

  const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '100%' };

  return (
    <div className="notifications-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={32} color="var(--accent-primary)" /> Communications Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Send broadcasts, manage alerts, and track system logs.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={markAllAsRead} className="btn btn-secondary">
            Mark all as read
          </button>
          <button onClick={() => setIsComposerOpen(true)} className="btn btn-primary">
            <Send size={16} /> Compose Broadcast
          </button>
        </div>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', display: 'flex', gap: '2rem' }}>
          <button onClick={() => setActiveTab('all')} className="btn" style={{ fontSize: '0.85rem', fontWeight: activeTab === 'all' ? '800' : '500', color: activeTab === 'all' ? 'var(--accent-primary)' : 'var(--text-muted)', padding: 0, background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
            All Messages
            {activeTab === 'all' && <motion.div layoutId="tab" style={{ position: 'absolute', bottom: '-1.5rem', left: 0, right: 0, height: '2px', background: 'var(--accent-primary)' }} />}
          </button>
          <button onClick={() => setActiveTab('system')} className="btn" style={{ fontSize: '0.85rem', fontWeight: activeTab === 'system' ? '800' : '500', color: activeTab === 'system' ? 'var(--accent-primary)' : 'var(--text-muted)', padding: 0, background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
            System Logs
            {activeTab === 'system' && <motion.div layoutId="tab" style={{ position: 'absolute', bottom: '-1.5rem', left: 0, right: 0, height: '2px', background: 'var(--accent-primary)' }} />}
          </button>
          <button onClick={() => setActiveTab('staff')} className="btn" style={{ fontSize: '0.85rem', fontWeight: activeTab === 'staff' ? '800' : '500', color: activeTab === 'staff' ? 'var(--accent-primary)' : 'var(--text-muted)', padding: 0, background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
            Staff Updates
            {activeTab === 'staff' && <motion.div layoutId="tab" style={{ position: 'absolute', bottom: '-1.5rem', left: 0, right: 0, height: '2px', background: 'var(--accent-primary)' }} />}
          </button>
        </div>

        <div style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {currentData.map((m, idx) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                    background: m.read ? 'transparent' : 'rgba(14, 165, 233, 0.03)',
                    transition: 'var(--transition-fast)'
                  }}
                  className="notification-item"
                >
                  <div style={{ marginTop: '0.2rem' }}>
                    {getTypeIcon(m.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: m.read ? '600' : '800', color: 'var(--text-primary)' }}>{m.title}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.time}</span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{m.message}</p>
                  </div>
                  <button
                    onClick={() => deleteNotification(m.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {currentData.length === 0 && (
            <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Bell size={48} opacity={0.1} style={{ marginBottom: '1rem' }} />
              <p>No new notifications.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isComposerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsComposerOpen(false)} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={{ position: 'fixed', top: '15%', left: '50%', x: '-50%', width: '90%', maxWidth: '550px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={24} color="var(--accent-primary)" /> Compose Broadcast
              </h2>
              <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Target Audience</label>
                  <select value={composerData.target} onChange={e => setComposerData({ ...composerData, target: e.target.value })} style={inputStyle}>
                    <option>All Tenants</option>
                    <option>Building A Only</option>
                    <option>Building B Only</option>
                    <option>Staff Members</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Message Title</label>
                  <input placeholder="e.g. Water Supply Update" value={composerData.title} onChange={e => setComposerData({ ...composerData, title: e.target.value })} style={inputStyle} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Content</label>
                  <textarea placeholder="Type your message here..." value={composerData.message} onChange={e => setComposerData({ ...composerData, message: e.target.value })} style={{ ...inputStyle, minHeight: '150px' }} required />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Send size={18} /> Dispatch Notification
                  </button>
                  <button className="btn" type="button" onClick={() => setIsComposerOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)' }}>Discard</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .notification-item:hover {
          background: rgba(0,0,0,0.01) !important;
        }
      `}</style>
    </div>
  );
};

export default Notifications;
