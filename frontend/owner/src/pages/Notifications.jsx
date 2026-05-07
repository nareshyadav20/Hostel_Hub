import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Bell, Send, Users, Building, Shield, Trash2, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

const Notifications = () => {
  const { buildingId } = useParams();
  const [activeTab, setActiveTab] = useState('all');
  const [messages, setMessages] = useState([
    { id: 1, title: 'New Booking', message: 'Room 201-A booked by Rahul Sharma.', time: '10m ago', type: 'info', read: false, category: 'all' },
    { id: 2, title: 'Low Stock Alert', message: 'Milk and Sugar running low in Building A storage.', time: '1h ago', type: 'warning', read: false, category: 'all' },
    { id: 3, title: 'Maintenance Resolved', message: 'WiFi issue in Room 101 has been resolved by IT team.', time: '3h ago', type: 'success', read: true, category: 'all' },
    { id: 4, title: 'System Update', message: 'The portal will be down for maintenance tonight at 2 AM.', time: '5h ago', type: 'info', read: true, category: 'all' },
  ]);

  const [systemLogs, setSystemLogs] = useState([
    { id: 101, title: 'Backup Successful', message: 'Daily database backup completed at 03:00 AM.', time: '5h ago', type: 'success', read: true, category: 'system' },
    { id: 102, title: 'Auth Failure', message: 'Multiple failed login attempts detected from IP 192.168.1.45.', time: '8h ago', type: 'warning', read: false, category: 'system' },
    { id: 103, title: 'Server Restored', message: 'Frontend cluster auto-scaled due to high traffic.', time: '12h ago', type: 'info', read: true, category: 'system' },
  ]);

  const [staffUpdates, setStaffUpdates] = useState([
    { id: 201, title: 'Shift Change', message: 'Kiran Kumar (Warden) swapped shift with Ravi Singh.', time: '2h ago', type: 'info', read: false, category: 'staff' },
    { id: 202, title: 'Cleaning Schedule', message: 'Building B deep cleaning scheduled for tomorrow 10 AM.', time: '4h ago', type: 'info', read: true, category: 'staff' },
  ]);

  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerData, setComposerData] = useState({ title: '', message: '', target: 'All Tenants' });

  const handleSend = (e) => {
    e.preventDefault();
    const newMessage = {
      id: Date.now(),
      title: composerData.title,
      message: composerData.message,
      time: 'Just now',
      type: 'info',
      read: false,
      category: composerData.target === 'Staff Members' ? 'staff' : 'all'
    };
    
    if (newMessage.category === 'staff') {
      setStaffUpdates([newMessage, ...staffUpdates]);
    } else {
      setMessages([newMessage, ...messages]);
    }
    
    setIsComposerOpen(false);
    setComposerData({ title: '', message: '', target: 'All Tenants' });
    setActiveTab(newMessage.category === 'staff' ? 'staff' : 'all');
  };

  const markAllAsRead = () => {
    if (activeTab === 'all') setMessages(messages.map(m => ({ ...m, read: true })));
    if (activeTab === 'system') setSystemLogs(systemLogs.map(m => ({ ...m, read: true })));
    if (activeTab === 'staff') setStaffUpdates(staffUpdates.map(m => ({ ...m, read: true })));
  };

  const deleteNotification = (id) => {
    if (activeTab === 'all') setMessages(messages.filter(m => m.id !== id));
    if (activeTab === 'system') setSystemLogs(systemLogs.filter(m => m.id !== id));
    if (activeTab === 'staff') setStaffUpdates(staffUpdates.filter(m => m.id !== id));
  };

  const currentData = activeTab === 'all' ? messages : activeTab === 'system' ? systemLogs : staffUpdates;

  const getTypeIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle size={18} color="var(--accent-success)" />;
      case 'warning': return <AlertTriangle size={18} color="var(--accent-warning)" />;
      default: return <Info size={18} color="var(--accent-primary)" />;
    }
  };

  const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '100%' };

  return (
    <div className="notifications-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 768px) {
          .header-main {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.5rem;
          }
          .header-actions {
            width: 100%;
            flex-direction: column-reverse;
          }
          .header-actions button {
            width: 100%;
          }
          .tab-nav {
            gap: 1rem !important;
            overflow-x: auto;
            padding: 1.2rem !important;
          }
          .tab-nav button {
            white-space: nowrap;
          }
          .notification-item {
            gap: 1rem !important;
            padding: 1.2rem !important;
          }
          .composer-modal {
            padding: 1.5rem !important;
          }
        }
      `}</style>

      <header className="header-main" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={32} color="var(--accent-primary)" /> Communications
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Manage broadcasts and track system logs.</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={markAllAsRead} className="btn btn-secondary">
            Mark all as read
          </button>
          <button onClick={() => setIsComposerOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Send size={16} /> Compose
          </button>
        </div>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
        <div className="tab-nav" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', display: 'flex', gap: '2rem' }}>
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
            <motion.div className="composer-modal" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={{ position: 'fixed', top: '15%', left: '50%', x: '-50%', width: '90%', maxWidth: '550px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Send size={24} color="var(--accent-primary)" /> Compose Broadcast
              </h2>
              <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                   <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Target Audience</label>
                   <select value={composerData.target} onChange={e => setComposerData({...composerData, target: e.target.value})} style={inputStyle}>
                      <option>All Tenants</option>
                      <option>Building A Only</option>
                      <option>Building B Only</option>
                      <option>Staff Members</option>
                   </select>
                </div>
                <div>
                   <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Message Title</label>
                   <input placeholder="e.g. Water Supply Update" value={composerData.title} onChange={e => setComposerData({...composerData, title: e.target.value})} style={inputStyle} required />
                </div>
                <div>
                   <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Content</label>
                   <textarea placeholder="Type your message here..." value={composerData.message} onChange={e => setComposerData({...composerData, message: e.target.value})} style={{ ...inputStyle, minHeight: '150px' }} required />
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
