import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  Bell, Search, Filter, Settings, Check, 
  Trash2, X, Archive, Eye, Zap, 
  Smartphone, Mail, AlertTriangle, 
  Info, CreditCard, Box, MessageSquare, 
  Users, Shield, FileText, LayoutGrid, User, Briefcase, Send, CheckCircle, Clock, ExternalLink
} from 'lucide-react';
import { api } from '../mockData';
import socket, { connectSocket } from '../utils/socket';
import useNotifications from '../hooks/useNotifications';

const Notifications = () => {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  const { 
    notifications, 
    setNotifications,
    unreadCount, 
    setUnreadCount,
    loading: isLoading,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllRead,
    deleteNotification: handleDelete,
    refresh: fetchNotifications
  } = useNotifications(activeBuildingId);

  const [activeTab, setActiveTab] = useState('all'); 
  const [activePortal, setActivePortal] = useState('All'); 
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
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
    { id: 'all', name: 'All Activities', icon: <LayoutGrid size={18} /> },
    { id: 'Safety', name: 'SOS Alerts', icon: <Shield size={18} /> },
    { id: 'Payments', name: 'Transactions', icon: <CreditCard size={18} /> },
    { id: 'Complaints', name: 'Resolutions', icon: <MessageSquare size={18} /> },
    { id: 'Laundry', name: 'Laundry', icon: <Zap size={18} /> },
    { id: 'Cleaning', name: 'Sanitation', icon: <Box size={18} /> },
    { id: 'Visitor', name: 'Guests', icon: <Users size={18} /> },
    { id: 'Leave', name: 'Movements', icon: <FileText size={18} /> },
    { id: 'Rooms', name: 'Assets', icon: <Box size={18} /> },
    { id: 'Staff', name: 'Human Capital', icon: <Briefcase size={18} /> },
  ];

  const portals = ['All', 'Tenant', 'Staff', 'Owner'];

  useEffect(() => {
    socket.on('complaintCreated', () => fetchNotifications());
    socket.on('tenantAdded', () => fetchNotifications());
    socket.on('bookingCreated', () => fetchNotifications());

    return () => {
      socket.off('complaintCreated');
      socket.off('tenantAdded');
      socket.off('bookingCreated');
    };
  }, [fetchNotifications]);

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
      });
      setIsComposerOpen(false);
      setComposerData({ title: '', message: '', target: 'All Tenants' });
      fetchNotifications();
    } catch (err) {
      console.error('Failed to send announcement:', err);
    }
  };

  const filteredNotifs = useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch = n.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           n.message?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'all' || n.category === activeTab || n.moduleName === activeTab;
      const matchesPortal = activePortal === 'All' || n.portalType === activePortal;
      const matchesPriority = filterPriority === 'all' || n.priority?.toLowerCase() === filterPriority;
      return matchesSearch && matchesTab && matchesPortal && matchesPriority;
    });
  }, [notifications, searchQuery, activeTab, activePortal, filterPriority]);

  const getPriorityColor = (p) => {
    switch (p?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#64748B';
    }
  };

  const getCategoryIcon = (cat) => {
    const category = categories.find(c => c.id === cat);
    return category ? category.icon : <Bell size={18} />;
  };

  return (
    <div className="notifications-page" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
      
      {/* Premium Header */}
      <header style={{ 
        marginBottom: '3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '2rem',
        borderRadius: '32px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
        border: '1px solid rgba(0,0,0,0.03)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.02)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '0.4rem' }}>
             <div style={{ position: 'relative' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)' }}>
                  <Bell size={28} />
                </div>
                {unreadCount > 0 && (
                  <div style={{ position: 'absolute', top: '-8px', right: '-8px', padding: '0.3rem 0.6rem', borderRadius: '100px', background: '#EF4444', color: 'white', fontSize: '0.75rem', fontWeight: '900', border: '3px solid white', boxShadow: '0 4px 10px rgba(239, 68, 68, 0.4)' }}>
                    {unreadCount}
                  </div>
                )}
             </div>
             <div>
                <h1 style={{ fontSize: '2.2rem', fontWeight: '950', margin: 0, letterSpacing: '-0.03em' }}>Alert Command Center</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '600', margin: 0 }}>System-wide events and direct outreach logic.</p>
             </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setIsComposerOpen(true)} 
            className="btn btn-primary" 
            style={{ 
              padding: '0.9rem 1.8rem', borderRadius: '16px', fontWeight: '900', 
              display: 'flex', alignItems: 'center', gap: '0.8rem' 
            }}
          >
            <Send size={20} /> Broadcast Message
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)} 
            className="btn" 
            style={{ 
              width: '52px', height: '52px', borderRadius: '16px', background: 'white', 
              border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: '#475569', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' 
            }}
          >
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* Control Bar */}
      <div className="card" style={{ 
        padding: '1.2rem', borderRadius: '24px', marginBottom: '2.5rem', 
        background: '#ffffff', border: '1px solid #F1F5F9',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
        display: 'flex', flexDirection: 'column', gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={20} />
            <input 
              type="text" 
              placeholder="Filter through intelligence logs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', padding: '1rem 1.2rem 1rem 3.5rem', borderRadius: '16px', 
                border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '0.95rem',
                fontWeight: '700', outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '0.4rem', borderRadius: '14px', gap: '0.4rem' }}>
            {portals.map(p => (
              <button 
                key={p}
                onClick={() => setActivePortal(p)}
                style={{ 
                  padding: '0.6rem 1.2rem', borderRadius: '100px', border: 'none', 
                  fontSize: '0.85rem', fontWeight: '800',
                  background: activePortal === p ? 'white' : 'transparent',
                  color: activePortal === p ? 'var(--accent-primary)' : '#64748B',
                  cursor: 'pointer', boxShadow: activePortal === p ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
           {categories.map(cat => (
             <button 
               key={cat.id}
               onClick={() => setActiveTab(cat.id)}
               style={{ 
                 display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1.2rem', 
                 whiteSpace: 'nowrap', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '800',
                 background: activeTab === cat.id ? 'var(--accent-primary)' : '#ffffff',
                 color: activeTab === cat.id ? '#ffffff' : '#475569',
                 border: `1px solid ${activeTab === cat.id ? 'var(--accent-primary)' : '#E2E8F0'}`,
                 cursor: 'pointer', transition: 'all 0.2s'
               }}
             >
                {cat.icon} {cat.name}
             </button>
           ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 1rem' }}>
         <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text-primary)', margin: 0 }}>
            {filteredNotifs.length} Stream Logs
         </h3>
         <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleMarkAllRead} className="btn" style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent-primary)', background: 'transparent', padding: '0.4rem 0.8rem' }}>
               <CheckCircle size={16} /> Mark all read
            </button>
            <button onClick={handleSeed} className="btn" style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B', background: 'transparent', padding: '0.4rem 0.8rem' }}>
               <Zap size={16} /> Regenerate Logs
            </button>
         </div>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence mode="popLayout">
          {filteredNotifs.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '8rem 2rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '32px', border: '1px dashed #CBD5E1' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                 <Bell size={40} color="#94A3B8" />
              </div>
              <h3 style={{ fontWeight: '900', color: '#1E293B', marginBottom: '0.5rem' }}>Silence in the Hub</h3>
              <p style={{ color: '#64748B', fontWeight: '600', maxWidth: '320px', margin: '0 auto' }}>All systems are optimal. No critical alerts pending your review.</p>
            </motion.div>
          ) : (
            filteredNotifs.map((n) => (
              <motion.div 
                key={n.id || n._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="card"
                style={{ 
                  padding: '1.5rem', borderRadius: '24px', background: n.read || n.isRead ? '#ffffff' : '#F9FAFF',
                  border: `1px solid ${n.read || n.isRead ? '#F1F5F9' : '#E0E7FF'}`,
                  borderLeft: `6px solid ${getPriorityColor(n.priority)}`,
                  display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                  boxShadow: n.read || n.isRead ? '0 4px 12px rgba(0,0,0,0.01)' : '0 10px 20px rgba(99, 102, 241, 0.05)',
                  position: 'relative', overflow: 'hidden'
                }}
              >
                {!(n.read || n.isRead) && <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-primary)' }} />}
                
                <div style={{ 
                  padding: '1rem', borderRadius: '16px', 
                  background: n.read || n.isRead ? '#F8FAFC' : '#EEF2FF', 
                  color: n.read || n.isRead ? '#94A3B8' : 'var(--accent-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {getCategoryIcon(n.category || n.moduleName)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900', color: '#1E293B' }}>{n.title}</h4>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                       <Clock size={12} /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 1rem 0', color: '#475569', fontSize: '0.95rem', fontWeight: '600', lineHeight: '1.5' }}>{n.message}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: '900', padding: '0.3rem 0.7rem', borderRadius: '6px', background: '#F1F5F9', color: '#475569', textTransform: 'uppercase' }}>
                       {n.portalType} PORTAL
                    </div>
                    {(n.link || n.actionLink) && (
                      <a href={n.link || n.actionLink} style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                         Investigate <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                   {!(n.read || n.isRead) && (
                     <button onClick={() => handleMarkAsRead(n.id || n._id)} className="btn" style={{ padding: '0.6rem', borderRadius: '12px', background: '#EEF2FF', color: 'var(--accent-primary)', border: 'none' }} title="Mark as read">
                       <Check size={18} />
                     </button>
                   )}
                   <button onClick={() => handleDelete(n.id || n._id)} className="btn" style={{ padding: '0.6rem', borderRadius: '12px', background: '#FFF1F2', color: '#EF4444', border: 'none' }} title="Purge log">
                     <Trash2 size={18} />
                   </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Composer Modal - Redesigned */}
      <AnimatePresence>
        {isComposerOpen && (
          <div className="modal-overlay" style={{ 
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', 
            backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
          }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="card" 
              style={{ width: '100%', maxWidth: '600px', padding: '3rem', borderRadius: '32px', background: 'white', border: '1px solid #E2E8F0', boxShadow: '0 40px 100px rgba(0,0,0,0.1)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                   <h2 style={{ fontSize: '1.8rem', fontWeight: '950', margin: 0, letterSpacing: '-0.02em' }}>Intelligence Composer</h2>
                   <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '600', margin: '0.2rem 0 0 0' }}>Dispatch critical data to the ecosystem.</p>
                </div>
                <button onClick={() => setIsComposerOpen(false)} style={{ background: '#F8FAFC', border: 'none', padding: '0.8rem', borderRadius: '14px', cursor: 'pointer', color: '#94A3B8' }}><X size={20}/></button>
              </div>

              <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.6rem' }}>Target Audience</label>
                   <select 
                     value={composerData.target}
                     onChange={(e) => setComposerData({...composerData, target: e.target.value})}
                     style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontWeight: '700', fontSize: '0.95rem' }}
                   >
                     <option>All Tenants</option>
                     <option>Staff Members</option>
                     <option>Building A Residents</option>
                   </select>
                </div>

                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.6rem' }}>Dispatch Title</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Infrastructure Maintenance Notice"
                     value={composerData.title}
                     onChange={(e) => setComposerData({...composerData, title: e.target.value})}
                     style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontWeight: '700', fontSize: '0.95rem' }}
                     required
                   />
                </div>

                <div>
                   <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#475569', marginBottom: '0.6rem' }}>Telemetry Content</label>
                   <textarea 
                     placeholder="Provide detailed context for the recipients..."
                     value={composerData.message}
                     onChange={(e) => setComposerData({...composerData, message: e.target.value})}
                     style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontWeight: '700', fontSize: '0.95rem', height: '140px', resize: 'none' }}
                     required
                   />
                </div>

                <div style={{ display: 'flex', gap: '1.2rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setIsComposerOpen(false)} style={{ flex: 1, padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', background: 'white', fontWeight: '800', color: '#475569', cursor: 'pointer' }}>Discard</button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '1rem', borderRadius: '14px', fontWeight: '900', fontSize: '1rem' }}>Deploy Broadcast</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal - Redesigned */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="modal-overlay" style={{ 
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', 
            backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', 
            alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
          }}>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, x: 50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.95, opacity: 0, x: 50 }}
              className="card" 
              style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', borderRadius: '32px', background: 'white', boxShadow: '0 40px 100px rgba(0,0,0,0.1)' }}
            >
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '950', margin: 0 }}>Alert Preferences</h2>
                <button onClick={() => setIsSettingsOpen(false)} style={{ background: '#F8FAFC', border: 'none', padding: '0.6rem', borderRadius: '12px', cursor: 'pointer' }}><X size={18}/></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {Object.entries(notifSettings).map(([key, value]) => (
                  <div key={key} style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h4 style={{ margin: 0, textTransform: 'capitalize', fontWeight: '900', fontSize: '1rem', color: '#1E293B' }}>{key} Module</h4>
                      <input 
                        type="checkbox" 
                        checked={value.enabled} 
                        onChange={() => setNotifSettings({
                          ...notifSettings,
                          [key]: { ...value, enabled: !value.enabled }
                        })}
                        style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                       {['in-app', 'sms', 'email'].map(type => (
                         <div key={type} style={{ fontSize: '0.7rem', fontWeight: '900', padding: '0.3rem 0.6rem', borderRadius: '6px', background: value.delivery.includes(type) ? 'var(--accent-primary)' : 'white', color: value.delivery.includes(type) ? 'white' : '#94A3B8', border: '1px solid #E2E8F0', textTransform: 'uppercase' }}>
                            {type}
                         </div>
                       ))}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setIsSettingsOpen(false)} 
                className="btn btn-primary" 
                style={{ width: '100%', marginTop: '2.5rem', padding: '1rem', borderRadius: '14px', fontWeight: '900' }}
              >
                Sync Preferences
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default Notifications;
