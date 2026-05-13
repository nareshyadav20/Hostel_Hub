import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Filter, AlertTriangle, CheckCircle, Clock, 
  MessageSquare, MoreHorizontal, User, Building, Trash2,
  ChevronRight, Download, FileText, Calendar, 
  Wrench, DollarSign, Volume2, ShieldAlert, Edit, Mail,
  CheckCircle2, XCircle, Zap, ExternalLink, ArrowLeft, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';

const Complaints = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter !== 'All') params.status = activeFilter;
      if (searchTerm) params.search = searchTerm;

      const [complaintsRes, statsRes] = await Promise.all([
        axios.get(`${API}/complaints`, { params }),
        axios.get(`${API}/stats`)
      ]);
      setComplaints(complaintsRes.data.complaints || []);
      setTotal(complaintsRes.data.total || 0);
      setPlatformStats(statsRes.data);
    } catch (err) { console.error('Failed to fetch complaints:', err); }
    finally { setLoading(false); }
  }, [activeFilter, searchTerm]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleResolve = async (id) => {
    try {
      await axios.patch(`${API}/complaints/${id}`, { status: 'Resolved' });
      fetchComplaints();
    } catch (err) { console.error(err); }
  };

  const stats = [
    { label: 'Total Tickets', value: platformStats?.totalComplaints ?? '—', icon: <MessageSquare size={20} />, color: 'primary', desc: 'All records' },
    { label: 'Open Issues', value: platformStats?.openComplaints ?? '—', icon: <AlertTriangle size={20} />, color: 'danger', desc: 'Needs action' },
    { label: 'Total Tenants', value: platformStats?.totalTenants ?? '—', icon: <Clock size={20} />, color: 'warning', desc: 'Platform-wide' },
    { label: 'Total Staff', value: platformStats?.totalStaff ?? '—', icon: <CheckCircle size={20} />, color: 'success', desc: 'Available' }
  ];

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Maintenance': return <Wrench size={16} className="text-indigo-500" />;
      case 'WiFi / IT': return <Zap size={16} className="text-primary" />;
      case 'Plumbing': return <Wrench size={16} className="text-blue-500" />;
      case 'Electrical': return <Zap size={16} className="text-amber-500" />;
      case 'Housekeeping': return <ShieldAlert size={16} className="text-emerald-500" />;
      default: return <Volume2 size={16} className="text-slate-500" />;
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
    <div className="space-y-10 pb-20">

      {/* --- KPI HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card-classic p-6 group hover:shadow-glow transition-all duration-500 relative overflow-hidden">
             <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color}/5 rounded-full blur-2xl group-hover:bg-${stat.color}/10 transition-all`} />
             <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center mb-4 border border-${stat.color}/10`}>
                {stat.icon}
             </div>
             <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{stat.label}</p>
             <div className="flex items-end justify-between mt-1">
                <h3 className="text-3xl font-black text-text-primary tracking-tight italic">{stat.value}</h3>
                <span className="text-[9px] font-bold text-text-muted uppercase italic">{stat.desc}</span>
             </div>
          </div>
        ))}
      </div>

      {/* --- COMMAND BAR --- */}
      <div className="sticky top-0 z-40 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50 -mx-4 px-4 flex flex-col lg:flex-row gap-6">
         <div className="flex-1 relative flex items-center group">
            <Search className="absolute left-4 text-text-muted group-focus-within:text-primary transition-all duration-300" size={18} />
            <input 
               type="text" 
               className="w-full bg-card border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary shadow-subtle"
               placeholder="Search tickets by Subject, Category, or Description..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         
         <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="flex bg-card p-1.5 rounded-2xl border border-border shadow-subtle shrink-0">
               {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
                 <button
                   key={status}
                   onClick={() => setActiveFilter(status)}
                   className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     activeFilter === status ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
                   }`}
                 >
                   {status}
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* --- COMPLAINT MANIFEST (TABULAR) --- */}
      <div className="card-classic overflow-hidden border border-border/50 shadow-premium bg-white/50 dark:bg-card/50">
         <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse whitespace-nowrap">
               <thead>
                  <tr className="bg-slate-50/80 dark:bg-white/2 border-b border-border sticky top-0 z-20 backdrop-blur-md">
                     <th className="py-5 px-8 w-12">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                          onChange={(e) => {
                            if (e.target.checked) setSelectedTickets(complaints.map(b => b._id));
                            else setSelectedTickets([]);
                          }}
                        />
                     </th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Issue / Title</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Reporter Info</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Category</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Priority</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                     <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/30">
                  {loading ? (
                    <tr><td colSpan={7} className="py-16 text-center">
                      <div className="flex items-center justify-center gap-3 text-text-muted">
                        <Loader2 size={20} className="animate-spin text-primary" />
                        <span className="text-sm font-bold">Loading complaints from database...</span>
                      </div>
                    </td></tr>
                  ) : complaints.length === 0 ? (
                    <tr><td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-text-muted">
                        <CheckCircle2 size={32} className="text-success/40" />
                        <p className="font-bold">No complaints found</p>
                        <p className="text-sm">All clear — or try adjusting your filters.</p>
                      </div>
                    </td></tr>
                  ) : complaints.map((c) => (
                    <React.Fragment key={c._id}>
                       <tr 
                         onClick={() => setExpandedId(expandedId === c._id ? null : c._id)}
                         className={`group hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all cursor-pointer ${expandedId === c._id ? 'bg-primary/5' : ''}`}
                       >
                          <td className="py-5 px-8" onClick={(e) => e.stopPropagation()}>
                             <input 
                               type="checkbox" 
                               checked={selectedTickets.includes(c._id)}
                               onChange={() => {
                                 if (selectedTickets.includes(c._id)) setSelectedTickets(selectedTickets.filter(id => id !== c._id));
                                 else setSelectedTickets([...selectedTickets, c._id]);
                               }}
                               className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                             />
                          </td>
                          <td className="py-5 px-4">
                             <div>
                                <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">{c.title}</p>
                                <p className="text-[10px] font-bold text-text-muted italic">{getTimeAgo(c.createdAt)}</p>
                             </div>
                          </td>
                          <td className="py-5 px-4">
                             <div className="flex flex-col">
                                <span className="text-[12px] font-black text-text-primary italic">{c.tenant?.name || '—'}</span>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">
                                  {c.tenant?.room ? `Room ${c.tenant.room}` : ''} {c.buildingId?.name ? `• ${c.buildingId.name}` : ''}
                                </span>
                             </div>
                          </td>
                          <td className="py-5 px-4">
                             <div className="flex items-center gap-2">
                                {getCategoryIcon(c.category)}
                                <span className="text-[11px] font-black text-text-primary italic">{c.category || '—'}</span>
                             </div>
                          </td>
                          <td className="py-5 px-4">
                             <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${c.priority === 'High' || c.priority === 'Critical' ? 'bg-rose-500 animate-pulse' : c.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${c.priority === 'High' || c.priority === 'Critical' ? 'text-rose-500' : 'text-text-muted'}`}>{c.priority || 'Medium'}</span>
                             </div>
                          </td>
                          <td className="py-5 px-4">
                             <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                               c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                               c.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                               'bg-rose-500/10 text-rose-500 border-rose-500/20'
                             }`}>{c.status}</span>
                          </td>
                          <td className="py-5 px-8 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {c.status !== 'Resolved' && (
                                  <button onClick={(e) => { e.stopPropagation(); handleResolve(c._id); }} className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all" title="Resolve">
                                    <CheckCircle size={16} />
                                  </button>
                                )}
                                <button className="p-2 text-text-muted hover:text-primary transition-all"><MessageSquare size={16} /></button>
                             </div>
                          </td>
                       </tr>
                       
                       <AnimatePresence>
                          {expandedId === c._id && (
                             <tr>
                                <td colSpan={7} className="p-0 border-none">
                                   <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="bg-slate-50/30 dark:bg-white/[0.01] overflow-hidden"
                                   >
                                      <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12 border-b border-border/50">
                                         <div className="space-y-6">
                                            <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                              <Building size={14} className="text-primary" /> Case Details
                                            </h4>
                                            <div className="p-4 rounded-2xl bg-white dark:bg-card border border-border shadow-subtle">
                                               <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Description</p>
                                               <p className="text-[12px] font-medium text-text-primary leading-relaxed">{c.description || 'No description provided.'}</p>
                                            </div>
                                            {c.assignedTo && (
                                              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-card border border-border shadow-subtle">
                                                 <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><User size={16} /></div>
                                                 <div>
                                                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Assigned To</p>
                                                    <p className="text-[12px] font-black text-text-primary">{c.assignedTo}</p>
                                                 </div>
                                              </div>
                                            )}
                                         </div>
                                         <div className="space-y-6">
                                            <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                              <CheckCircle2 size={14} className="text-success" /> Actions
                                            </h4>
                                            <div className="grid grid-cols-1 gap-3">
                                               {c.status !== 'Resolved' && (
                                                 <button onClick={() => handleResolve(c._id)} className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">
                                                    Resolve Ticket <CheckCircle size={14} className="inline ml-1" />
                                                 </button>
                                               )}
                                               <button className="w-full py-4 bg-white dark:bg-card border border-border text-text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all">Reassign Specialist</button>
                                               <button className="w-full py-4 bg-primary/5 text-primary border border-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Notify Tenant</button>
                                            </div>
                                         </div>
                                      </div>
                                   </motion.div>
                                </td>
                             </tr>
                          )}
                       </AnimatePresence>
                    </React.Fragment>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="mt-10 flex items-center justify-between p-6 card-classic bg-slate-50/50 dark:bg-white/2">
         <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
           Showing {complaints.length} of {total} reports
         </span>
         <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-1.5 shadow-subtle">
            <FileText size={14} className="text-primary" />
            <button className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Generate Audit Log</button>
         </div>
      </div>
    </div>
  );
};

export default Complaints;
