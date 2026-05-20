import React, { useState, useEffect } from 'react';
import { 
  Bell, BellRing, DollarSign, Wrench, Settings, 
  Search, CheckCircle2, Archive, Trash2, MoreHorizontal,
  ArrowUpRight, Clock, User, Building, ExternalLink,
  Zap, MessageSquare, AlertTriangle, Filter, Mail,
  Send, History, Target, ShieldCheck, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';

const Notifications = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('inbox'); // inbox | broadcast
  const [inboxFilter, setInboxFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const [inbox, setInbox] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Broadcast state bindings
  const [targetSegment, setTargetSegment] = useState('Tenants Only (12,100)');
  const [priority, setPriority] = useState('Standard Distribution');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [buildings, setBuildings] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState('');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const [notifRes, buildingsRes] = await Promise.all([
        API.get('/notifications'),
        API.get('/buildings')
      ]);
      
      const rawData = notifRes.data || [];
      const mapped = rawData.map(n => ({
        id: n._id,
        type: n.category || n.moduleName || 'System',
        title: n.title || 'Notification',
        desc: n.message || '',
        time: n.createdAt ? new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '',
        read: n.isRead || false,
        priority: n.priority || 'Low',
        ref: n._id
      }));
      setInbox(mapped);
      
      const bData = buildingsRes.data || [];
      setBuildings(bData);
      if (bData.length > 0) {
        setSelectedBuildingId(bData[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch notifications or buildings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setInbox(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const handleArchive = async (id) => {
    try {
      await API.patch(`/notifications/${id}/archive`);
      setInbox(prev => prev.filter(n => n.id !== id));
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (err) {
      console.error('Failed to archive notification:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setInbox(prev => prev.filter(n => n.id !== id));
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const categoryFilter = inboxFilter === 'All' ? undefined : inboxFilter;
      await API.post('/notifications/mark-all-read', {
        category: categoryFilter
      });
      setInbox(prev => prev.map(n => {
        if (categoryFilter && n.type !== categoryFilter) return n;
        return { ...n, read: true };
      }));
      window.dispatchEvent(new Event('notifications-updated'));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDeployBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      alert('Please fill in both the Title and the Content fields.');
      return;
    }

    try {
      let portalType = 'Tenant';
      let target = 'All Tenants';

      if (targetSegment.includes('Owners')) {
        portalType = 'Owner';
        target = 'Owner';
      } else if (targetSegment.includes('Staff')) {
        portalType = 'Staff';
        target = 'Staff';
      } else if (targetSegment.includes('All Users')) {
        portalType = 'All';
        target = 'All';
      }

      let cleanPriority = 'Medium';
      if (priority.includes('High')) {
        cleanPriority = 'High';
      } else if (priority.includes('Critical')) {
        cleanPriority = 'High';
      } else if (priority.includes('Standard')) {
        cleanPriority = 'Medium';
      }

      const payload = {
        moduleName: 'System',
        portalType,
        category: 'Alert',
        title: broadcastTitle,
        message: broadcastMessage,
        priority: cleanPriority,
        type: cleanPriority === 'High' ? 'warning' : 'info',
        target,
        buildingId: selectedBuildingId || undefined
      };

      const res = await API.post('/notifications', payload);

      const newBroadcast = {
        id: res.data?._id || Date.now().toString(),
        title: broadcastTitle,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        target: targetSegment.split(' (')[0],
        status: 'Sent'
      };

      setHistory(prev => [newBroadcast, ...prev]);
      setBroadcastTitle('');
      setBroadcastMessage('');
      window.dispatchEvent(new Event('notifications-updated'));
      alert('Broadcast deployed successfully!');
    } catch (err) {
      console.error('Failed to deploy broadcast:', err);
      alert('Failed to deploy broadcast: ' + (err.response?.data?.error || err.message));
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Payment': return <DollarSign size={18} className="text-emerald-500" />;
      case 'Issue': return <Wrench size={18} className="text-indigo-500" />;
      case 'System': return <Settings size={18} className="text-slate-500" />;
      default: return <Bell size={18} className="text-primary" />;
    }
  };

  const getPriorityColor = (p) => {
    switch(p) {
      case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-fade">
      
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      {/* --- ELITE HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight uppercase italic">Notification Engine</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Command center for administrative alerts and global broadcasts</p>
        </div>
        
        <div className="flex bg-card p-1.5 rounded-2xl border border-divider shadow-subtle shrink-0 self-start lg:self-center">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'inbox' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Bell size={16} strokeWidth={2.5} /> Alert Inbox
          </button>
          <button
            onClick={() => setActiveTab('broadcast')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === 'broadcast' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Zap size={16} strokeWidth={2.5} /> Global Broadcast
          </button>
        </div>
      </div>

      <div className="h-px bg-border/50 -mx-4" />

      {/* --- RENDERER --- */}
      <AnimatePresence mode="wait">
        {activeTab === 'inbox' ? (
          <motion.div 
            key="inbox"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Inbox Controls */}
            <div className="flex flex-col lg:flex-row gap-6">
               <div className="flex-1 relative flex items-center group">
                  <Search className="absolute left-4 text-text-muted group-focus-within:text-primary transition-all duration-300" size={18} />
                  <input 
                     type="text" 
                     className="w-full bg-card border border-divider rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary shadow-subtle"
                     placeholder="Search alerts by Tenant, Issue, or ID..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <div className="flex items-center gap-3">
                  <div className="flex bg-card p-1.5 rounded-2xl border border-divider shadow-subtle overflow-x-auto scrollbar-hide">
                     {['All', 'Payment', 'Issue', 'System'].map((f) => (
                       <button
                         key={f}
                         onClick={() => setInboxFilter(f)}
                         className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                           inboxFilter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
                         }`}
                       >
                         {f}
                       </button>
                     ))}
                  </div>
                  <button 
                     onClick={handleMarkAllRead}
                     className="flex items-center gap-2 px-6 py-3.5 bg-card border border-divider rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-all shadow-subtle shrink-0"
                  >
                     <CheckCircle2 size={16} /> Mark All Read
                  </button>
               </div>
            </div>

            {/* Notification List */}
             <div className="space-y-4">
               {loading ? (
                 <div className="py-16 text-center">
                   <div className="premium-spinner mx-auto mb-4"></div>
                   <p className="text-sm font-black text-text-muted uppercase tracking-widest">Loading notifications from database...</p>
                 </div>
               ) : inbox.filter(n => {
                    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.desc.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesFilter = inboxFilter === 'All' || n.type === inboxFilter;
                    return matchesSearch && matchesFilter;
                 }).length === 0 ? (
                 <div className="py-16 text-center border border-dashed border-divider rounded-3xl">
                   <Bell size={32} className="mx-auto mb-4 text-text-muted" />
                   <p className="text-sm font-black text-text-muted uppercase tracking-widest">No notifications found</p>
                   <p className="text-xs text-text-muted mt-1 italic">System alerts and events will appear here</p>
                 </div>
               ) : inbox
                .filter(n => {
                   const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || n.desc.toLowerCase().includes(searchTerm.toLowerCase());
                   const matchesFilter = inboxFilter === 'All' || n.type === inboxFilter;
                   return matchesSearch && matchesFilter;
                })
                .map((n) => (
                 <div key={n.id} className="group">
                    <div 
                      onClick={() => setExpandedId(expandedId === n.id ? null : n.id)}
                      className={`card-classic p-6 flex flex-col lg:flex-row lg:items-center gap-6 cursor-pointer hover:shadow-glow transition-all duration-300 border-l-4 ${!n.read ? 'border-l-primary bg-primary/5 dark:bg-primary/[0.02]' : 'border-l-transparent'}`}
                    >
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-subtle bg-card border border-divider`}>
                          {getTypeIcon(n.type)}
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${getPriorityColor(n.priority)}`}>
                                {n.priority} PRIORITY
                             </span>
                             <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{n.type} • {n.time}</span>
                          </div>
                          <h3 className="text-[15px] font-black text-text-primary tracking-tight uppercase italic">{n.title}</h3>
                          <p className="text-[12px] font-medium text-text-secondary mt-0.5 line-clamp-1">{n.desc}</p>
                       </div>
                       <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.read && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }}
                              title="Mark as Read"
                              className="p-2.5 bg-background border border-divider rounded-xl text-text-muted hover:text-primary transition-all shadow-subtle"
                            >
                              <Mail size={16} />
                            </button>
                          )}
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleArchive(n.id); }}
                            title="Archive Alert"
                            className="p-2.5 bg-background border border-divider rounded-xl text-text-muted hover:text-indigo-500 transition-all shadow-subtle"
                          >
                            <Archive size={16} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                            title="Delete Alert"
                            className="p-2.5 bg-background border border-divider rounded-xl text-text-muted hover:text-rose-500 transition-all shadow-subtle"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                    </div>

                    <AnimatePresence>
                       {expandedId === n.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                             <div className="p-8 mx-4 bg-slate-50 dark:bg-white/[0.01] border-x border-b border-divider/50 rounded-b-3xl space-y-6">
                                <div className="p-6 rounded-2xl bg-white dark:bg-card border border-divider shadow-subtle">
                                   <p className="text-[13px] font-medium text-text-primary leading-relaxed italic">"{n.desc}"</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                   <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                      Resolve Action <ArrowUpRight size={14} />
                                   </button>
                                   <button className="flex items-center gap-2 px-6 py-2.5 bg-card border border-divider rounded-xl text-[10px] font-black uppercase tracking-widest text-text-primary hover:border-primary transition-all">
                                      View {n.type} Manifest
                                   </button>
                                   <div className="ml-auto flex items-center gap-4 text-[10px] font-black text-text-muted uppercase tracking-widest">
                                      <span>Ref ID: <span className="text-text-primary italic font-mono">{n.ref}</span></span>
                                   </div>
                                </div>
                             </div>
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
               ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="broadcast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
             {/* Compose Form */}
             <div className="lg:col-span-8 card-classic p-10 space-y-8">
                <div className="flex items-center gap-4 pb-6 border-b border-divider/50">
                   <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                      <Send size={24} strokeWidth={2.5} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Compose Global Alert</h3>
                      <p className="text-[11px] font-medium text-text-muted uppercase tracking-widest">Deploy instant push manifests across user segments</p>
                   </div>
                </div>

                <form onSubmit={handleDeployBroadcast} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Target Segment</label>
                          <div className="relative group">
                             <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-all" size={16} />
                             <select 
                                value={targetSegment}
                                onChange={(e) => setTargetSegment(e.target.value)}
                                className="w-full bg-background border border-divider rounded-xl py-3 pl-12 pr-4 text-[12px] font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary"
                             >
                                <option>All Users (14,250)</option>
                                <option>Tenants Only (12,100)</option>
                                <option>Owners Only (2,150)</option>
                                <option>Staff Members (150)</option>
                             </select>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Priority Protocol</label>
                          <div className="relative group">
                             <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-amber-500 transition-all" size={16} />
                             <select 
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full bg-background border border-divider rounded-xl py-3 pl-12 pr-4 text-[12px] font-bold outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all text-text-primary"
                             >
                                <option>Standard Distribution</option>
                                <option>High Velocity (Push)</option>
                                <option>Critical (Push + Email)</option>
                             </select>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Target Property</label>
                          <div className="relative group">
                             <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-emerald-500 transition-all" size={16} />
                             <select 
                                value={selectedBuildingId}
                                onChange={(e) => setSelectedBuildingId(e.target.value)}
                                className="w-full bg-background border border-divider rounded-xl py-3 pl-12 pr-4 text-[12px] font-bold outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all text-text-primary"
                             >
                                <option value="">All Properties (Global)</option>
                                {buildings.map(b => (
                                   <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Manifest Title</label>
                       <input 
                          type="text" 
                          value={broadcastTitle}
                          onChange={(e) => setBroadcastTitle(e.target.value)}
                          placeholder="e.g. System Maintenance Window - Pune Cluster"
                          className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-[12px] font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary"
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Alert Content</label>
                       <textarea 
                          rows={5}
                          value={broadcastMessage}
                          onChange={(e) => setBroadcastMessage(e.target.value)}
                          placeholder="Enter the notification payload details..."
                          className="w-full bg-background border border-divider rounded-xl py-4 px-4 text-[12px] font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary resize-none"
                       />
                    </div>

                    <button className="w-full py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-3">
                       Deploy Notification Pulse <Zap size={18} strokeWidth={3} />
                    </button>
                 </form>
             </div>

             {/* Recent Broadcasts */}
             <div className="lg:col-span-4 space-y-6">
                <div className="card-classic p-8">
                   <h3 className="text-[13px] font-black text-text-primary uppercase tracking-widest mb-8 flex items-center gap-2">
                      <History size={16} className="text-primary" /> Transmission History
                   </h3>
                   <div className="space-y-4">
                      {history.map(h => (
                        <div key={h.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-divider/50 space-y-3">
                           <div className="flex justify-between items-start">
                              <h4 className="text-[11px] font-black text-text-primary uppercase tracking-tight">{h.title}</h4>
                              <span className="text-[9px] font-bold text-text-muted italic">{h.time}</span>
                           </div>
                           <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                                 <Target size={12} /> {h.target}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[8px] font-black uppercase tracking-widest">{h.status}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="card-classic p-8 bg-primary/5 border-primary/20">
                   <h3 className="text-[13px] font-black text-text-primary uppercase tracking-widest mb-4">Pulse Intelligence</h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center">
                         <span className="text-[11px] font-bold text-text-muted">Total Broadcasts</span>
                         <span className="text-xl font-black text-text-primary italic">1,240</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="text-[11px] font-bold text-text-muted">Delivery Rate</span>
                         <span className="text-xl font-black text-emerald-500 italic">99.8%</span>
                      </div>
                      <div className="pt-4 border-t border-divider/50">
                         <p className="text-[10px] font-bold text-text-muted leading-relaxed italic">Broadcast manifest history is archived for 90 days. System logs contain deeper transmission diagnostics.</p>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Notifications;
