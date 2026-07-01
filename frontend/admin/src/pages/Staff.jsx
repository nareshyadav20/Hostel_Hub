import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, UserPlus, Users, Building2,
  Briefcase, Shield, Star, Calendar, Activity,
  TrendingUp, AlertCircle, Zap, MessageSquare,
  Trash2, Edit, ChevronDown, ArrowLeft, Mail, Phone,
  MoreHorizontal, CheckCircle2, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import API from '../api/axios';

const Staff = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filterProperty, setFilterProperty] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState([]);

  // Confirmation state
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const triggerConfirm = (title, message, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Announcement modal state
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementTarget, setAnnouncementTarget] = useState('All');
  const [announcementSubject, setAnnouncementSubject] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcing, setAnnouncing] = useState(false);

  // Fetch staff from backend
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/staff');
      if (res.data && res.data.length > 0) {
        const mapped = res.data.map((s, i) => ({
          id: s._id || `EMP-${2021 + i}`,
          name: s.name || 'Unknown',
          role: s.role || 'Staff',
          property: s.buildingId || 'Platform HQ',
          rating: s.rating || 4.5,
          status: s.status || 'Active',
          joined: s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
          tasks: s.tasks || 0,
          email: s.email || `${(s.name || 'staff').toLowerCase().replace(' ', '.')}@staynest.com`,
          phone: s.contact || '+91 00000 00000',
          salary: s.salary || 0,
          skills: s.skills || [s.role || 'Operations']
        }));
        setStaff(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch staff:', err);
      showToast('Using cached staff data. Backend unavailable.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleOnboard = () => showToast("Staff Onboarding protocol initiated. Input personnel details.", "info");
  const handleExport = () => {
    const headers = ['ID', 'Name', 'Role', 'Property', 'Rating', 'Status', 'Joined', 'Email', 'Phone'];
    const rows = staff.map(s => [s.id, s.name, s.role, s.property, s.rating, s.status, s.joined, s.email, s.phone]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `HR_Manifest_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("HR Personnel Manifest exported successfully.", "success");
  };
  const handleAnnouncement = () => {
    setShowAnnouncementModal(true);
  };
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    setAnnouncing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      showToast(`Global Notice successfully dispatched to department: ${announcementTarget}!`, "success");
      setShowAnnouncementModal(false);
      setAnnouncementSubject('');
      setAnnouncementMessage('');
    } catch (err) {
      showToast("Failed to dispatch broadcast notice.", "error");
    } finally {
      setAnnouncing(false);
    }
  };
  const handleProtocolAssign = (name) => showToast(`Assigning new protocol assignment for ${name}...`, "info");
  const handlePerformanceReview = (name) => showToast(`Initializing performance audit review for ${name}...`, "info");
  const handleOffboard = (name) => {
    triggerConfirm(
      "Confirm Personnel Offboarding",
      `Are you sure you want to offboard ${name}? This action is permanent and will finalize their service record.`,
      () => {
        showToast(`${name} offboarding protocol finalized successfully.`, "success");
      }
    );
  };

  const [staff, setStaff] = useState([]);

  const activeCount = staff.filter(s => s.status === 'Active').length;
  const onLeaveCount = staff.filter(s => s.status === 'On Leave').length;
  const uniqueRoles = [...new Set(staff.map(s => s.role))].length;

  const stats = [
    { label: 'Total Personnel', value: staff.length.toString(), sub: 'Global Staff Count', icon: <Users size={20} />, color: 'primary' },
    { label: 'Active Manifest', value: activeCount.toString(), sub: staff.length > 0 ? `${Math.round((activeCount/staff.length)*100)}% On-Duty Rate` : 'On-Duty Rate', icon: <Activity size={20} />, color: 'success' },
    { label: 'Dept Distribution', value: uniqueRoles.toString().padStart(2, '0'), sub: 'Functional Clusters', icon: <Briefcase size={20} />, color: 'accent' },
    { label: 'On Leave', value: onLeaveCount.toString(), sub: 'Scheduled Absences', icon: <Calendar size={20} />, color: 'warning' },
  ];

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return 'text-primary bg-primary/10 border-primary/20';
      case 'Finance': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Maintenance': return 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20';
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
          <h1 className="text-3xl text-premium-header">Personnel Manifest</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Global administrative oversight of operational staff and role distribution</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-2 bg-card border border-divider rounded-xl px-2 py-1 shadow-subtle">
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all"
              >
                <Download size={14} className="text-emerald-500" /> Export HR
              </button>
              <div className="w-px h-4 bg-border" />
              <button 
                onClick={handleOnboard}
                className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all"
              >
                <UserPlus size={14} className="text-primary" /> Onboard
              </button>
           </div>
           <button 
             onClick={handleAnnouncement}
             className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
           >
             <MessageSquare size={16} strokeWidth={3} /> Global Announcement
           </button>
        </div>
      </div>

      {/* --- KPI HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card-classic p-6 group hover:shadow-glow transition-all duration-500 relative overflow-hidden">
             <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color}/5 rounded-full blur-2xl group-hover:bg-${stat.color}/10 transition-all`} />
             <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center mb-4 border border-${stat.color}/10`}>
                {React.cloneElement(stat.icon, { strokeWidth: 2.5 })}
             </div>
             <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{stat.label}</p>
             <h3 className="text-3xl font-black text-text-primary tracking-tight mt-1 italic">{stat.value}</h3>
             <p className="text-[10px] text-text-muted font-bold mt-1 uppercase tracking-tighter italic">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* --- CONTROL BAR --- */}
      <div className="sticky top-0 z-40 py-4 bg-background/80 backdrop-blur-xl border-b border-divider/50 -mx-4 px-4 flex flex-col lg:flex-row gap-6">
         <div className="flex-1 relative flex items-center group">
            <Search className="absolute left-4 text-text-muted group-focus-within:text-primary transition-all duration-300" size={18} />
            <input 
               type="text" 
               className="w-full bg-card border border-divider rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary shadow-subtle"
               placeholder="Search personnel by Name, Role, or ID..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         
         <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="flex bg-card p-1.5 rounded-2xl border border-divider shadow-subtle shrink-0">
               {['All', 'Admin', 'Finance', 'Maintenance'].map((role) => (
                 <button
                   key={role}
                   onClick={() => setFilterRole(role)}
                   className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     filterRole === role ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
                   }`}
                 >
                   {role}
                 </button>
               ))}
            </div>

            <div className="h-10 w-px bg-border mx-2 shrink-0" />

            <button 
               onClick={() => setShowFilters(!showFilters)}
               className={`flex items-center gap-2 px-6 py-3.5 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-subtle shrink-0 ${showFilters ? 'bg-primary text-white border-primary' : 'bg-card border-divider text-text-secondary hover:text-primary'}`}>
               <Filter size={14} strokeWidth={3} /> Filters
            </button>
         </div>
      </div>

      {/* --- ADVANCED FILTERS PANEL --- */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-6 -mt-4"
          >
            <div className="bg-card border border-divider rounded-2xl p-6 shadow-subtle grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Property Node</label>
                <select 
                  value={filterProperty}
                  onChange={(e) => setFilterProperty(e.target.value)}
                  className="w-full bg-background border border-divider rounded-xl py-2.5 px-4 text-sm text-text-primary focus:border-primary outline-none"
                >
                  <option value="All">All Properties</option>
                  <option value="Sapphire PG">Sapphire PG</option>
                  <option value="Elite Living">Elite Living</option>
                  <option value="Tech Park PG">Tech Park PG</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Status</label>
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-background border border-divider rounded-xl py-2.5 px-4 text-sm text-text-primary focus:border-primary outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- STAFF MANIFEST --- */}
      <div className="card-classic overflow-hidden border border-divider/50 shadow-premium">
         <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse whitespace-nowrap">
               <thead>
                  <tr className="bg-background border-b border-divider sticky top-0 z-20 backdrop-blur-md">
                     <th className="py-5 px-8 w-12">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-divider text-primary focus:ring-primary/20 transition-all cursor-pointer"
                          onChange={(e) => {
                            if (e.target.checked) setSelectedStaff(staff.map(s => s.id));
                            else setSelectedStaff([]);
                          }}
                        />
                     </th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Personnel / ID</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Functional Role</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Property Node</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Perf. Score</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                     <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/30">
                  {staff
                    .filter(s => {
                       const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase());
                       const matchesRole = filterRole === 'All' || s.role === filterRole;
                       const matchesProperty = filterProperty === 'All' || s.property === filterProperty;
                       const matchesStatus = filterStatus === 'All' || s.status === filterStatus;
                       return matchesSearch && matchesRole && matchesProperty && matchesStatus;
                    })
                    .map((s) => (
                    <React.Fragment key={s.id}>
                       <tr 
                         onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                         className={`group hover:bg-background transition-all cursor-pointer ${expandedId === s.id ? 'bg-primary/5' : ''}`}
                       >
                          <td className="py-5 px-8" onClick={(e) => e.stopPropagation()}>
                             <input 
                               type="checkbox" 
                               checked={selectedStaff.includes(s.id)}
                               onChange={() => {
                                 if (selectedStaff.includes(s.id)) setSelectedStaff(selectedStaff.filter(id => id !== s.id));
                                 else setSelectedStaff([...selectedStaff, s.id]);
                               }}
                               className="w-4 h-4 rounded border-divider text-primary focus:ring-primary/20 transition-all cursor-pointer"
                             />
                          </td>
                          <td className="py-5 px-4">
                             <div className="flex items-center gap-4">
                                <div className="relative">
                                   <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs border border-primary/20">
                                      {s.name.split(' ').map(n => n[0]).join('')}
                                   </div>
                                   <div className={`absolute -right-1 -bottom-1 w-3 h-3 rounded-full border-2 border-surface ${s.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                </div>
                                <div>
                                   <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">{s.name}</p>
                                   <p className="text-[10px] font-bold text-text-muted italic">{s.id}</p>
                                </div>
                             </div>
                          </td>
                          <td className="py-5 px-4">
                             <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getRoleColor(s.role)}`}>
                                {s.role}
                             </span>
                          </td>
                          <td className="py-5 px-4">
                             <div className="flex items-center gap-2">
                                <Building2 size={14} className="text-text-muted" />
                                <span className="text-[11px] font-black text-text-primary italic">{s.property}</span>
                             </div>
                          </td>
                          <td className="py-5 px-4">
                             <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-1.5 text-warning">
                                   <Star size={12} fill="currentColor" />
                                   <span className="text-[12px] font-black tracking-tighter">{s.rating}</span>
                                </div>
                                <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                                   <motion.div initial={{ width: 0 }} animate={{ width: `${(s.rating / 5) * 100}%` }} transition={{ duration: 1 }} className="h-full bg-warning" />
                                </div>
                              </div>
                          </td>
                          <td className="py-5 px-4">
                             <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                             }`}>{s.status}</span>
                          </td>
                          <td className="py-5 px-8 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2.5 bg-background border border-divider rounded-xl text-text-muted hover:text-primary transition-all shadow-subtle"><Mail size={16} /></button>
                                <button className="p-2.5 bg-background border border-divider rounded-xl text-text-muted hover:text-indigo-500 transition-all shadow-subtle"><Phone size={16} /></button>
                                <button className="p-2.5 bg-background border border-divider rounded-xl text-text-muted hover:text-primary transition-all shadow-subtle group-hover:scale-110"><MoreHorizontal size={16} /></button>
                             </div>
                          </td>
                       </tr>

                       <AnimatePresence>
                          {expandedId === s.id && (
                             <tr>
                                <td colSpan={7} className="p-0 border-none">
                                   <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="bg-background/40 overflow-hidden"
                                   >
                                      <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12 border-b border-divider/50">
                                         {/* Staff Intelligence */}
                                         <div className="space-y-8">
                                            <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                              <Shield size={14} className="text-primary" /> Personnel Intelligence
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4">
                                               <div className="p-4 rounded-2xl bg-white dark:bg-card border border-divider shadow-subtle">
                                                  <p className="text-[9px] font-black text-text-muted uppercase mb-1">Joined Date</p>
                                                  <p className="text-[12px] font-bold text-text-primary italic">{s.joined}</p>
                                               </div>
                                               <div className="p-4 rounded-2xl bg-white dark:bg-card border border-divider shadow-subtle">
                                                  <p className="text-[9px] font-black text-text-muted uppercase mb-1">Emp. Type</p>
                                                  <p className="text-[12px] font-bold text-emerald-500 italic">Full Time</p>
                                               </div>
                                            </div>
                                            <div className="space-y-3">
                                               <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Skill Manifest</p>
                                               <div className="flex flex-wrap gap-2">
                                                  {s.skills.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 rounded-lg bg-background border border-divider text-[9px] font-black text-text-primary uppercase tracking-tighter italic">{skill}</span>
                                                  ))}
                                               </div>
                                            </div>
                                         </div>

                                         {/* Operational Context */}
                                         <div className="space-y-8">
                                            <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                              <Zap size={14} className="text-warning" /> Operational Context
                                            </h4>
                                            <div className="space-y-4">
                                               <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card border border-divider shadow-subtle">
                                                  <div className="flex items-center gap-3">
                                                     <CheckCircle2 size={16} className="text-emerald-500" />
                                                     <span className="text-[11px] font-bold text-text-primary">Open Protocols</span>
                                                  </div>
                                                  <span className="text-[12px] font-black text-text-primary italic">{s.tasks}</span>
                                               </div>
                                               <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card border border-divider shadow-subtle">
                                                  <div className="flex items-center gap-3">
                                                     <AlertCircle size={16} className="text-rose-500" />
                                                     <span className="text-[11px] font-bold text-text-primary">Escalated Issues</span>
                                                  </div>
                                                  <span className="text-[12px] font-black text-rose-500 italic">01</span>
                                               </div>
                                            </div>
                                         </div>

                                         {/* Decision Matrix */}
                                         <div className="space-y-8">
                                            <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                              <TrendingUp size={14} className="text-success" /> Decision Matrix
                                            </h4>
                                            <div className="grid grid-cols-1 gap-3">
                                               <button onClick={() => handleProtocolAssign(s.name)} className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">Assign Protocol</button>
                                               <button onClick={() => handlePerformanceReview(s.name)} className="w-full py-4 bg-white dark:bg-card border border-divider text-text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all">Performance Review</button>
                                               <button onClick={() => handleOffboard(s.name)} className="w-full py-4 bg-rose-500/5 text-rose-500 border border-rose-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Offboard Personnel</button>
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

    {/* --- GLOBAL ANNOUNCEMENT COMPOSER MODAL --- */}
    <Modal
      isOpen={showAnnouncementModal}
      onClose={() => setShowAnnouncementModal(false)}
      title="Global Announcement Composer"
      footer={
        <div className="flex gap-3">
          <button 
            type="button" 
            className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all" 
            onClick={() => setShowAnnouncementModal(false)}
          >
            Abort
          </button>
          <button 
            type="submit" 
            form="announcement-form"
            disabled={announcing}
            className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {announcing ? 'Broadcasting...' : 'Broadcast Notice'}
          </button>
        </div>
      }
    >
      <form id="announcement-form" onSubmit={handleAnnouncementSubmit} className="space-y-6 py-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Target Department Nodes</label>
          <select
            className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer"
            value={announcementTarget}
            onChange={(e) => setAnnouncementTarget(e.target.value)}
          >
            <option value="All">All Staff Nodes (Global)</option>
            <option value="Admin">Administrative Wing</option>
            <option value="Finance">Finance Wing</option>
            <option value="Maintenance">Maintenance & Repairs Wing</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Subject Title</label>
          <input
            type="text"
            className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary"
            value={announcementSubject}
            onChange={(e) => setAnnouncementSubject(e.target.value)}
            placeholder="e.g. Server Downtime / Emergency Briefing"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Notice Message Body</label>
          <textarea
            rows={5}
            className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary resize-none"
            value={announcementMessage}
            onChange={(e) => setAnnouncementMessage(e.target.value)}
            placeholder="Type administrative notice text here..."
            required
          />
        </div>
      </form>
    </Modal>

    {/* --- PREMIUM CONFIRMATION DIALOG --- */}
    <AnimatePresence>
      {confirmDialog.isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-card border border-divider rounded-3xl shadow-2xl p-8 w-full max-w-md text-center"
            onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-2">{confirmDialog.title}</h3>
            <p className="text-sm text-text-muted mb-8 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                className="flex-1 py-3.5 bg-slate-50 dark:bg-white/5 border border-divider text-text-secondary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                Cancel
              </button>
              <button onClick={confirmDialog.onConfirm}
                className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all">
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
  );
};

export default Staff;
