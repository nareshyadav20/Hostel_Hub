import React, { useState } from 'react';
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

const Notifications = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('inbox'); // inbox | broadcast
  const [inboxFilter, setInboxFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const [inbox, setInbox] = useState([
    { 
      id: 'NT-5021', 
      type: 'Payment', 
      title: 'Rent Overdue: Arjun Das', 
      desc: 'Monthly rent for Sapphire PG (Room 204) is 3 days overdue. Amount: ₹12,000.',
      time: '2h ago',
      read: false,
      priority: 'High',
      ref: 'TX-9022'
    },
    { 
      id: 'NT-5022', 
      type: 'Issue', 
      title: 'New Maintenance Request', 
      desc: 'Neha Sharma reported a leakage in Room 305 (Elite Living).',
      time: '5h ago',
      read: false,
      priority: 'Medium',
      ref: 'CMP-102'
    },
    { 
      id: 'NT-5023', 
      type: 'System', 
      title: 'Backup Successful', 
      desc: 'Weekly cloud backup for all property data completed successfully.',
      time: '1d ago',
      read: true,
      priority: 'Low',
      ref: 'SYS-LOG'
    },
    { 
      id: 'NT-5024', 
      type: 'Payment', 
      title: 'Security Deposit Received', 
      desc: 'Vikram Singh has settled the security deposit for Tech Park PG.',
      time: '1d ago',
      read: true,
      priority: 'Medium',
      ref: 'TX-9025'
    }
  ]);

  const [history] = useState([
    { id: 1, title: 'Network Maintenance', target: 'Pune Hub', status: 'Delivered', time: '2h ago' },
    { id: 2, title: 'Festive Offer: 20% Off', target: 'All Users', status: 'Delivered', time: '1 day ago' },
  ]);

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

      {/* --- ELITE HEADER --- */
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight uppercase italic">Notification Engine</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Command center for administrative alerts and global broadcasts</p>
        </div>
        
        <div className="flex bg-card p-1.5 rounded-2xl border border-border shadow-subtle shrink-0 self-start lg:self-center">
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
                     className="w-full bg-card border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary shadow-subtle"
                     placeholder="Search alerts by Tenant, Issue, or ID..."
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                  />
               </div>
               <div className="flex items-center gap-3">
                  <div className="flex bg-card p-1.5 rounded-2xl border border-border shadow-subtle overflow-x-auto scrollbar-hide">
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
                  <button className="flex items-center gap-2 px-6 py-3.5 bg-card border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-all shadow-subtle shrink-0">
                     <CheckCircle2 size={16} /> Mark All Read
                  </button>
               </div>
            </div>

            {/* Notification List */}
            <div className="space-y-4">
               {inbox
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
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-subtle bg-card border border-border`}>
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
                          <button className="p-2.5 bg-background border border-border rounded-xl text-text-muted hover:text-primary transition-all shadow-subtle"><Mail size={16} /></button>
                          <button className="p-2.5 bg-background border border-border rounded-xl text-text-muted hover:text-indigo-500 transition-all shadow-subtle"><Archive size={16} /></button>
                          <button className="p-2.5 bg-background border border-border rounded-xl text-text-muted hover:text-rose-500 transition-all shadow-subtle"><Trash2 size={16} /></button>
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
                             <div className="p-8 mx-4 bg-slate-50 dark:bg-white/[0.01] border-x border-b border-border/50 rounded-b-3xl space-y-6">
                                <div className="p-6 rounded-2xl bg-white dark:bg-card border border-border shadow-subtle">
                                   <p className="text-[13px] font-medium text-text-primary leading-relaxed italic">"{n.desc}"</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-4">
                                   <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                      Resolve Action <ArrowUpRight size={14} />
                                   </button>
                                   <button className="flex items-center gap-2 px-6 py-2.5 bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-primary hover:border-primary transition-all">
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
                <div className="flex items-center gap-4 pb-6 border-b border-border/50">
                   <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/10">
                      <Send size={24} strokeWidth={2.5} />
                   </div>
                   <div>
                      <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">Compose Global Alert</h3>
                      <p className="text-[11px] font-medium text-text-muted uppercase tracking-widest">Deploy instant push manifests across user segments</p>
                   </div>
                </div>

                <form className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Target Segment</label>
                         <div className="relative group">
                            <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-all" size={16} />
                            <select className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-[12px] font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary">
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
                            <select className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-[12px] font-bold outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-500 transition-all text-text-primary">
                               <option>Standard Distribution</option>
                               <option>High Velocity (Push)</option>
                               <option>Critical (Push + Email)</option>
                            </select>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Manifest Title</label>
                      <input 
                         type="text" 
                         placeholder="e.g. System Maintenance Window - Pune Cluster"
                         className="w-full bg-background border border-border rounded-xl py-3 px-4 text-[12px] font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Alert Content</label>
                      <textarea 
                         rows={5}
                         placeholder="Enter the notification payload details..."
                         className="w-full bg-background border border-border rounded-xl py-4 px-4 text-[12px] font-bold outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary resize-none"
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
                        <div key={h.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-border/50 space-y-3">
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
                      <div className="pt-4 border-t border-border/50">
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
