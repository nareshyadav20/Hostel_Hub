import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, AlertTriangle, CheckCircle, Clock, 
  MessageSquare, MoreHorizontal, User, Building, Trash2,
  ChevronRight, Download, FileText, Calendar, 
  Wrench, DollarSign, Volume2, ShieldAlert, Edit, Mail,
  CheckCircle2, XCircle, Zap, ExternalLink, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';

const Complaints = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [complaints, setComplaints] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showIntelligencePanel, setShowIntelligencePanel] = useState(false);
  const [intelligenceFilters, setIntelligenceFilters] = useState({
     category: 'All',
     priority: 'All',
     property: 'All'
  });
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);

  const fetchComplaintsData = async () => {
    try {
      setLoading(true);
      const [compRes, buildRes] = await Promise.all([
        API.get('/complaints'),
        API.get('/buildings')
      ]);
      setComplaints(compRes.data || []);
      setBuildings(buildRes.data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
      showToast('Failed to sync complaints from backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaintsData();
  }, []);

  const handleResolveTicket = async (id) => {
    try {
      await API.patch(`/complaints/${id}`, { status: 'Resolved' });
      showToast(`Ticket resolved successfully.`, "success");
      fetchComplaintsData();
    } catch (err) {
      showToast('Failed to update ticket status.', 'error');
    }
  };

  const handleReassign = async (id) => {
    const technician = prompt("Enter Technician name to assign to this complaint:");
    if (!technician) return;
    try {
      await API.patch(`/complaints/${id}`, { assignedTo: technician, status: 'In Progress' });
      showToast(`Reassigned to ${technician} successfully.`, "success");
      fetchComplaintsData();
    } catch (err) {
      showToast('Failed to assign technician.', 'error');
    }
  };

  const handleNotifyTenant = (id, tenantEmail) => {
    showToast(`Notification broadcasted to Tenant (${tenantEmail || 'registered email'}) for Ticket ${id}.`, "success");
  };

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Maintenance': 
      case 'Plumbing': 
      case 'Electrical': 
        return <Wrench size={16} className="text-indigo-500" />;
      case 'WiFi / IT': return <Zap size={16} className="text-primary" />;
      case 'Security': return <ShieldAlert size={16} className="text-rose-500" />;
      case 'Billing': return <DollarSign size={16} className="text-emerald-500" />;
      default: return <Volume2 size={16} className="text-slate-500" />;
    }
  };

  // Compute dynamic stats from fetched data
  const totalCount = complaints.length;
  const criticalCount = complaints.filter(c => c.priority === 'High').length;
  const progressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'Pending').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const stats = [
    { label: 'Total Tickets', value: totalCount.toString().padStart(2, '0'), icon: <MessageSquare size={20} />, color: 'primary', desc: 'Total tracked' },
    { label: 'Critical Issues', value: criticalCount.toString().padStart(2, '0'), icon: <AlertTriangle size={20} />, color: 'danger', desc: 'High priority' },
    { label: 'Pending / In Progress', value: progressCount.toString().padStart(2, '0'), icon: <Clock size={20} />, color: 'warning', desc: 'Needs action' },
    { label: 'Resolved Tickets', value: resolvedCount.toString().padStart(2, '0'), icon: <CheckCircle size={20} />, color: 'success', desc: 'Completed tasks' }
  ];

  const filteredComplaints = complaints.filter(c => {
    const titleVal = c.title || c.issue || '';
    const idVal = c._id || '';
    const tenantName = c.tenant?.name || 'Guest';
    const buildingName = c.buildingId?.name || 'All Properties';

    const matchesSearch = titleVal.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          idVal.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tenantName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status mapping check: DB has 'Pending', 'In Progress', 'Resolved', 'Rejected'
    const statusMap = c.status === 'Pending' ? 'Open' : c.status;
    const matchesStatus = activeFilter === 'All' || 
                          (activeFilter === 'Open' && statusMap === 'Pending') ||
                          (activeFilter === 'In Progress' && statusMap === 'In Progress') ||
                          (activeFilter === 'Resolved' && statusMap === 'Resolved');

    const matchesCategory = intelligenceFilters.category === 'All' || c.category === intelligenceFilters.category;
    const matchesPriority = intelligenceFilters.priority === 'All' || c.priority === intelligenceFilters.priority;
    const matchesProperty = intelligenceFilters.property === 'All' || c.buildingId?._id === intelligenceFilters.property;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesProperty;
  });

  return (
    <div className="space-y-10 pb-20">
      
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      {/* --- KPI HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card-classic p-6 group hover:shadow-glow transition-all duration-500 relative overflow-hidden">
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-card/5 rounded-full blur-2xl group-hover:bg-primary/5 transition-all" />
             <div className={`w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/10`}>
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
      <div className="sticky top-0 z-40 py-4 bg-background/80 backdrop-blur-xl border-b border-divider/50 -mx-4 px-4 flex flex-col lg:flex-row gap-6">
         <div className="flex-1 relative flex items-center group">
            <Search className="absolute left-4 text-text-muted group-focus-within:text-primary transition-all duration-300" size={18} />
            <input 
               type="text" 
               className="w-full bg-card border border-divider rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary shadow-subtle"
               placeholder="Search tickets by Subject, Tenant, or ID..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         
         <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="flex bg-card p-1.5 rounded-2xl border border-divider shadow-subtle shrink-0">
               {['All', 'Open', 'In Progress', 'Resolved'].map((status) => (
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

            <div className="h-10 w-px bg-border mx-2 shrink-0" />

            <button 
               onClick={() => setShowIntelligencePanel(!showIntelligencePanel)}
               className={`flex items-center gap-2 px-6 py-3.5 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-subtle shrink-0 ${
                  showIntelligencePanel ? 'bg-primary text-white border-primary' : 'bg-card border-divider text-text-secondary hover:text-primary'
               }`}
            >
               <Filter size={14} strokeWidth={3} /> Intelligence Filter
            </button>
         </div>
      </div>

      {/* --- INTELLIGENCE FILTER DRAWER --- */}
      <AnimatePresence>
         {showIntelligencePanel && (
            <motion.div
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="overflow-hidden mb-8"
            >
               <div className="p-6 bg-card border border-divider rounded-2xl shadow-subtle grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-1">Issue Category</label>
                     <select
                        className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer font-bold"
                        value={intelligenceFilters.category}
                        onChange={(e) => setIntelligenceFilters({ ...intelligenceFilters, category: e.target.value })}
                     >
                        <option value="All">All Categories</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Housekeeping">Housekeeping</option>
                        <option value="WiFi / IT">WiFi / IT</option>
                        <option value="Security">Security</option>
                        <option value="Billing">Billing</option>
                     </select>
                  </div>

                  {/* Priority Filter */}
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-1">Criticality Level</label>
                     <select
                        className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer font-bold"
                        value={intelligenceFilters.priority}
                        onChange={(e) => setIntelligenceFilters({ ...intelligenceFilters, priority: e.target.value })}
                     >
                        <option value="All">All Priorities</option>
                        <option value="High">High Priority</option>
                        <option value="Medium">Medium Priority</option>
                        <option value="Low">Low Priority</option>
                     </select>
                  </div>

                  {/* Property Wing Filter */}
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] block mb-1">Facility Wing</label>
                     <select
                        className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer font-bold"
                        value={intelligenceFilters.property}
                        onChange={(e) => setIntelligenceFilters({ ...intelligenceFilters, property: e.target.value })}
                     >
                        <option value="All">All Facilities</option>
                        {buildings.map(b => (
                          <option key={b._id} value={b._id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                 </div>
              </motion.div>
           )}
        </AnimatePresence>
  
      {loading ? (
        <div className="py-24 text-center">
          <div className="premium-spinner mx-auto mb-4"></div>
          <p className="text-sm font-black text-text-muted uppercase tracking-widest">Synchronizing grievance tickets from MongoDB...</p>
        </div>
      ) : (
        /* --- COMPLAINT MANIFEST (TABULAR) --- */
        <div className="card-classic overflow-hidden border border-divider/50 shadow-premium bg-white/50 dark:bg-card/50">
           <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                 <thead>
                    <tr className="bg-slate-50/80 dark:bg-white/2 border-b border-divider sticky top-0 z-20 backdrop-blur-md">
                       <th className="py-5 px-8 w-12">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-divider text-primary focus:ring-primary/20 transition-all cursor-pointer"
                            onChange={(e) => {
                              if (e.target.checked) setSelectedTickets(filteredComplaints.map(b => b._id));
                              else setSelectedTickets([]);
                            }}
                          />
                       </th>
                       <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Issue / Ticket ID</th>
                       <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Reporter Info</th>
                       <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Category</th>
                       <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Priority</th>
                       <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                       <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/30">
                    {filteredComplaints.map((c) => (
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
                                 className="w-4 h-4 rounded border-divider text-primary focus:ring-primary/20 transition-all cursor-pointer"
                               />
                            </td>
                            <td className="py-5 px-4">
                               <div>
                                  <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">{c.title || c.issue}</p>
                                  <p className="text-[10px] font-bold text-text-muted italic">{c._id} • Logged {new Date(c.createdAt).toLocaleDateString()}</p>
                               </div>
                            </td>
                            <td className="py-5 px-4">
                               <div className="flex flex-col">
                                  <span className="text-[12px] font-black text-text-primary italic">{c.tenant?.name || 'Guest Tenant'}</span>
                                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Room {c.roomId?.roomNumber || 'N/A'} • {c.buildingId?.name || 'All Properties'}</span>
                               </div>
                            </td>
                            <td className="py-5 px-4">
                               <div className="flex items-center gap-2">
                                  {getCategoryIcon(c.category)}
                                  <span className="text-[11px] font-black text-text-primary italic">{c.category}</span>
                                </div>
                             </td>
                             <td className="py-5 px-4">
                                <div className="flex items-center gap-2">
                                   <div className={`w-1.5 h-1.5 rounded-full ${c.priority === 'High' ? 'bg-rose-500 animate-pulse' : c.priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                   <span className={`text-[10px] font-black uppercase tracking-widest ${c.priority === 'High' ? 'text-rose-500' : 'text-text-muted'}`}>{c.priority}</span>
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
                                   <button className="p-2 text-text-muted hover:text-primary transition-all"><Edit size={16} /></button>
                                   <button className="p-2 text-text-muted hover:text-indigo-500 transition-all"><MessageSquare size={16} /></button>
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
                                         <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12 border-b border-divider/50">
                                            <div className="space-y-8">
                                               <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                                 <Building size={14} className="text-primary" /> Case Parameters
                                               </h4>
                                               <div className="space-y-4">
                                                  <div className="p-4 rounded-2xl bg-white dark:bg-card border border-divider shadow-subtle">
                                                     <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Issue Description</p>
                                                     <p className="text-[12px] font-medium text-text-primary leading-relaxed">{c.description}</p>
                                                  </div>
                                                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-card border border-divider shadow-subtle">
                                                     <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><User size={16} /></div>
                                                     <div>
                                                        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Assigned Specialist</p>
                                                        <p className="text-[12px] font-black text-text-primary">{c.assignedTo || 'Unassigned Technician'}</p>
                                                     </div>
                                                  </div>
                                               </div>
                                            </div>

                                            <div className="space-y-8">
                                               <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                                 <Clock size={14} className="text-warning" /> Resolution Pulse
                                               </h4>
                                               <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                                                  <div className="relative">
                                                     <div className="absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-4 border-background" />
                                                     <div className="flex justify-between items-start">
                                                        <span className="text-[11px] font-black text-text-primary uppercase tracking-tight">Opened</span>
                                                        <span className="text-[9px] font-bold text-text-muted">{new Date(c.createdAt).toLocaleTimeString()}</span>
                                                     </div>
                                                     <p className="text-[10px] text-text-muted mt-1 italic">"Logged via tenant portal."</p>
                                                  </div>
                                                  {c.assignedTo && (
                                                    <div className="relative">
                                                       <div className="absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full bg-warning border-4 border-background" />
                                                       <div className="flex justify-between items-start">
                                                          <span className="text-[11px] font-black text-text-primary uppercase tracking-tight">Assigned</span>
                                                          <span className="text-[9px] font-bold text-text-muted">In Progress</span>
                                                       </div>
                                                       <p className="text-[10px] text-text-muted mt-1 italic">"Assigned to {c.assignedTo}"</p>
                                                    </div>
                                                  )}
                                                  {c.status === 'Resolved' && (
                                                    <div className="relative">
                                                       <div className="absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full bg-success border-4 border-background" />
                                                       <div className="flex justify-between items-start">
                                                          <span className="text-[11px] font-black text-text-primary uppercase tracking-tight">Resolved</span>
                                                          <span className="text-[9px] font-bold text-text-muted">Completed</span>
                                                       </div>
                                                       <p className="text-[10px] text-text-muted mt-1 italic">"Issue resolved."</p>
                                                    </div>
                                                  )}
                                               </div>
                                            </div>

                                            <div className="space-y-8">
                                               <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                                 <CheckCircle2 size={14} className="text-success" /> Decision Matrix
                                               </h4>
                                               <div className="grid grid-cols-1 gap-3">
                                                  {c.status !== 'Resolved' && (
                                                    <button onClick={() => handleResolveTicket(c._id)} className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all group">
                                                       Resolve Ticket <CheckCircle size={14} className="inline ml-1 group-hover:scale-110 transition-transform" />
                                                    </button>
                                                  )}
                                                  <button onClick={() => handleReassign(c._id)} className="w-full py-4 bg-white dark:bg-card border border-divider text-text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all">Reassign Specialist</button>
                                                  <button onClick={() => handleNotifyTenant(c._id, c.tenant?.email)} className="w-full py-4 bg-primary/5 text-primary border border-primary/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Notify Tenant</button>
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
      )}

      {/* --- PAGINATION --- */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 card-classic bg-slate-50/50 dark:bg-white/2">
         <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Showing {filteredComplaints.length} of {totalCount} reports</span>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 bg-background border border-divider rounded-xl px-3 py-1.5 shadow-subtle">
               <FileText size={14} className="text-primary" />
               <button className="text-[10px] font-black uppercase tracking-widest text-text-secondary" onClick={fetchComplaintsData}>Refresh Dashboard</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Complaints;
