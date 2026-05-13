import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bell, BellRing, DollarSign, Wrench, Settings, 
  Search, CheckCircle2, Archive, Trash2, MoreHorizontal,
  ArrowUpRight, Clock, User, Building, ExternalLink,
  Zap, MessageSquare, AlertTriangle, Filter, Mail,
  Send, History, Target, ShieldCheck, ArrowLeft, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inbox'); // inbox | broadcast
  const [inboxFilter, setInboxFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, unread: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = { 
        page, 
        limit: 20,
        search: searchTerm || undefined
      };

      const res = await axios.get(`${API}/notifications`, { params });
      setNotifications(res.data.notifications || []);
      setTotalPages(res.data.totalPages || 1);
      
      const unreadCount = (res.data.notifications || []).filter(n => !n.isRead).length;
      setStats({
        total: res.data.total,
        unread: unreadCount
      });
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(`${API}/notifications/${id}`, { isRead: true });
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Payments': return <DollarSign size={18} className="text-emerald-500" />;
      case 'Complaints': return <Wrench size={18} className="text-indigo-500" />;
      case 'Inventory': return <Zap size={18} className="text-amber-500" />;
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

  const getTimeAgo = (date) => {
    if (!date) return '—';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
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
          <h1 className="text-3xl text-premium-header italic">Command Center Notifications</h1>
          <p className="text-sm text-text-muted mt-1 font-medium">Real-time platform logs and operational alerts.</p>
        </div>
        <div className="flex bg-card p-1.5 rounded-2xl border border-border shadow-subtle shrink-0">
          <button 
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'inbox' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'}`}
          >
            <Bell size={14} /> System Inbox ({stats.unread})
          </button>
          <button 
            onClick={() => setActiveTab('broadcast')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'broadcast' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'}`}
          >
            <Send size={14} /> Broadcast History
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-10">
        
        {/* --- MAIN FEED --- */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          <div className="flex items-center justify-between gap-4">
             <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input 
                   type="text" 
                   className="w-full bg-card border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary"
                   placeholder="Search in history..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button className="p-3.5 bg-card border border-border rounded-2xl text-text-muted hover:text-primary transition-all shadow-subtle">
                <Filter size={18} />
             </button>
          </div>

          <div className="space-y-4">
             {loading ? (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                   <Loader2 size={32} className="animate-spin text-primary opacity-20" />
                   <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Awaiting Node Responses...</p>
                </div>
             ) : notifications.length === 0 ? (
                <div className="py-20 text-center card-classic">
                   <ShieldCheck size={48} className="mx-auto text-success/20 mb-4" />
                   <h4 className="text-lg font-black text-text-primary uppercase tracking-tight italic">Protocol Clear</h4>
                   <p className="text-xs text-text-muted font-medium mt-2">No active alerts detected in the current manifest.</p>
                </div>
             ) : notifications.map((n) => (
                <motion.div 
                   key={n._id}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className={`card-classic p-6 group transition-all cursor-pointer relative overflow-hidden ${!n.isRead ? 'border-l-4 border-l-primary' : 'opacity-70'}`}
                   onClick={() => handleMarkAsRead(n._id)}
                >
                   <div className="flex gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-border/50 bg-slate-50 dark:bg-white/5`}>
                         {getTypeIcon(n.moduleName)}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between gap-4 mb-1">
                            <h4 className={`text-[15px] font-black tracking-tight ${!n.isRead ? 'text-text-primary italic' : 'text-text-secondary'}`}>
                               {n.title}
                               {!n.isRead && <span className="inline-block w-2 h-2 rounded-full bg-primary ml-2 animate-pulse" />}
                            </h4>
                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter whitespace-nowrap">{getTimeAgo(n.createdAt)}</span>
                         </div>
                         <p className="text-[13px] font-medium text-text-muted leading-relaxed line-clamp-2 italic">"{n.message}"</p>
                         <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/30">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${getPriorityColor(n.priority)}`}>
                               {n.priority} Priority
                            </span>
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-1.5">
                               <Target size={12} className="text-primary" /> {n.moduleName}
                            </span>
                         </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                         <button className="p-2 text-text-muted hover:text-indigo-500 rounded-lg hover:bg-indigo-500/10 transition-all"><Archive size={16} /></button>
                         <button className="p-2 text-text-muted hover:text-rose-500 rounded-lg hover:bg-rose-500/10 transition-all"><Trash2 size={16} /></button>
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>

          {totalPages > 1 && (
             <div className="flex items-center justify-center gap-4 mt-10">
                <button 
                   onClick={() => setPage(p => Math.max(1, p - 1))}
                   disabled={page === 1}
                   className="px-6 py-2.5 bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-all disabled:opacity-40"
                >
                   Manifest Prev
                </button>
                <span className="text-[10px] font-black text-text-primary">GRID NODE {page} OF {totalPages}</span>
                <button 
                   onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                   disabled={page === totalPages}
                   className="px-6 py-2.5 bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-all disabled:opacity-40"
                >
                   Manifest Next
                </button>
             </div>
          )}
        </div>

        {/* --- RIGHT PANEL --- */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
           <div className="card-classic p-8 glass-effect bg-primary/5 border-primary/20">
              <h3 className="text-lg font-black text-primary uppercase tracking-tight mb-6 italic italic">Automation Pulse</h3>
              <div className="space-y-6">
                 <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-primary/10">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-glow"><Zap size={20} /></div>
                    <div className="flex-1">
                       <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Total Signals</p>
                       <p className="text-lg font-black text-text-primary italic tracking-tighter">{stats.total}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-primary/10">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-glow"><BellRing size={20} /></div>
                    <div className="flex-1">
                       <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Awaiting Attention</p>
                       <p className="text-lg font-black text-text-primary italic tracking-tighter">{stats.unread}</p>
                    </div>
                 </div>
              </div>
              <button className="w-full mt-8 py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                 Broadcast New Protocol
              </button>
           </div>

           <div className="card-classic p-8 border-none bg-slate-900 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                 <History size={16} className="text-primary" /> Log Manifest
              </h3>
              <div className="space-y-6 relative z-10">
                 {[
                    { node: 'Payout Node', status: 'PAID', time: '12m ago' },
                    { node: 'Security Node', status: 'SYNC', time: '1h ago' },
                    { node: 'Resident Node', status: 'LEAVE', time: '2h ago' }
                 ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between py-1 border-b border-white/5">
                       <div>
                          <p className="text-[11px] font-black tracking-tight">{log.node}</p>
                          <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{log.time}</p>
                       </div>
                       <span className="text-[9px] font-black text-primary px-2 py-1 bg-white/5 rounded italic">{log.status}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Notifications;
