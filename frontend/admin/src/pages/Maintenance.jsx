import React, { useState } from 'react';
import { 
  Wrench, Search, Filter, MoreHorizontal, Download, 
  MapPin, Clock, Calendar, User, ChevronRight,
  CheckCircle2, AlertCircle, XCircle, Mail, Phone,
  ArrowUpRight, Users, LayoutGrid, List, FileText,
  CreditCard, ExternalLink, ShieldCheck, Zap,
  Droplets, Lightbulb, Thermometer, ShieldAlert,
  Trash2, Edit, MessageSquare, ArrowLeft, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '../components/Modal';

const Maintenance = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Confirm Dialog State
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const triggerConfirm = (title, message, onConfirm) => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm: () => { onConfirm(); setConfirmDialog(prev => ({ ...prev, isOpen: false })); } });
  };

  // Modals
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

 
  const handleRefine = () => alert("Advanced Maintenance Filter Matrix initialized.");
  const handleVerifyClose = (id) => alert(`Task ${id} verified and marked as Resolved.`);
  const handleReassign = (id) => alert(`Reassigning Specialist for Task ${id}...`);
  const handleAbort = (id) => {
    triggerConfirm(
      "Abort Operations",
      `Are you sure you want to abort operation ${id}? This action will halt current service and log it.`,
      () => showToast(`Operation ${id} aborted and logged.`, "error")
    );
  };
  const handleExport = () => setShowExportModal(true);

  const executeExport = (format) => {
    const headers = ['ID', 'Task', 'Category', 'Location', 'Technician', 'Priority', 'Status', 'Date'];
    const rows = tasks.map(t => [t.id, t.task, t.category, t.location, t.technician, t.priority, t.status, t.date]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Maintenance_Logs_${new Date().toISOString().slice(0,10)}.${format.toLowerCase()}`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    alert(`Maintenance Logs exported successfully as ${format}.`);
    setShowExportModal(false);
  };

  const [tasks] = useState([
    {
      id: 'MNT-4021',
      task: 'AC Unit Servicing',
      category: 'HVAC',
      location: 'Sapphire PG • Room 204',
      technician: 'Suresh Kumar',
      priority: 'High',
      status: 'Open',
      date: '12 May 2024',
      time: '10:00 AM',
      description: 'Scheduled quarterly servicing for the split AC unit. Filters need cleaning and gas level check.',
      parts: ['Filter Mesh', 'Refrigerant R32'],
      notes: 'Tenant reported slight noise during operation.'
    },
    {
      id: 'MNT-4022',
      task: 'Bathroom Leak Repair',
      category: 'Plumbing',
      location: 'Royal Ladies Nest • Room 105',
      technician: 'Rajesh V.',
      priority: 'Critical',
      status: 'In Progress',
      date: '12 May 2024',
      time: '08:30 AM',
      description: 'Major leak in the flush tank. Requires gasket replacement and valve tightening.',
      parts: ['Rubber Gasket', 'Teflon Tape'],
      notes: 'Water supply to the room partially restricted.'
    },
    {
      id: 'MNT-4023',
      task: 'Corridor Lighting Fix',
      category: 'Electrical',
      location: 'Sunshine Residency • 2nd Floor',
      technician: 'Anita M.',
      priority: 'Medium',
      status: 'Pending Parts',
      date: '11 May 2024',
      time: '04:15 PM',
      description: 'Two LED panels in the main corridor are flickering. Likely driver failure.',
      parts: ['18W LED Driver (2 units)'],
      notes: 'Parts ordered from vendor, expected by tomorrow.'
    },
    {
      id: 'MNT-4024',
      task: 'Lift Inspection',
      category: 'Safety',
      location: 'Emerald Suites • Block A',
      technician: 'External Vendor',
      priority: 'High',
      status: 'Resolved',
      date: '10 May 2024',
      time: '02:00 PM',
      description: 'Monthly safety inspection and lubrication of cables. Door sensor calibration.',
      parts: ['None'],
      notes: 'System certified for next 30 days.'
    }
  ]);

  const stats = [
    { label: 'Active Tasks', value: '24', icon: <Wrench />, color: 'primary', desc: 'In resolution' },
    { label: 'Critical Ops', value: '03', icon: <AlertCircle />, color: 'danger', desc: 'Immediate focus' },
    { label: 'Pending Parts', value: '08', icon: <Clock />, color: 'warning', desc: 'Waiting for inventory' },
    { label: 'Completed (24h)', value: '12', icon: <CheckCircle2 />, color: 'success', desc: 'Tasks closed' },
  ];

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'HVAC': return <Thermometer size={16} className="text-rose-500" />;
      case 'Plumbing': return <Droplets size={16} className="text-cyan-500" />;
      case 'Electrical': return <Lightbulb size={16} className="text-amber-500" />;
      case 'Safety': return <ShieldAlert size={16} className="text-indigo-500" />;
      default: return <Wrench size={16} className="text-slate-500" />;
    }
  };

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

      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl text-premium-header">Maintenance Hub</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Global infrastructure oversight and operational resolution manifest</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-card border border-divider rounded-xl text-[11px] font-black uppercase tracking-widest text-text-secondary hover:border-primary transition-all shadow-subtle"
          >
            <Download size={16} /> Export Logs
          </button>
          <button onClick={() => setShowNewTaskModal(true)} className="btn-premium">
            <Plus size={18} strokeWidth={3} /> New Task
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {stats.map((stat, i) => (
          <div key={i} className="card-classic p-6 group relative overflow-hidden border-none glass-effect">
             <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 transition-all`} />
             <div className={`w-12 h-12 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} flex items-center justify-center mb-4 border border-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 group-hover:shadow-glow transition-all duration-300`}>
                {React.cloneElement(stat.icon, { size: 22, strokeWidth: 2.5 })}
             </div>
             <p className="text-premium-label">{stat.label}</p>
             <div className="flex items-end justify-between mt-1">
                <h3 className="text-3xl font-black text-text-primary tracking-tighter italic">{stat.value}</h3>
                <span className="text-[9px] font-bold text-text-muted uppercase italic">{stat.desc}</span>
             </div>
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
               placeholder="Search tasks by ID, Technician, or Location..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         
         <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="flex bg-card p-1.5 rounded-2xl border border-divider shadow-subtle shrink-0">
               {['All', 'Open', 'In Progress', 'Pending Parts', 'Resolved'].map((status) => (
                 <button
                   key={status}
                   onClick={() => setFilterStatus(status)}
                   className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     filterStatus === status ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
                   }`}
                 >
                   {status}
                 </button>
               ))}
            </div>

            <div className="h-10 w-px bg-border mx-2 shrink-0" />

            <button 
              onClick={handleRefine}
              className="flex items-center gap-2 px-6 py-3.5 bg-card border border-divider rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-all shadow-subtle shrink-0"
            >
               <Filter size={14} strokeWidth={3} /> Refine
            </button>
         </div>
      </div>

      {/* --- TASK MANIFEST --- */}
      <div className="card-classic overflow-hidden border border-divider/50 shadow-premium">
         <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse whitespace-nowrap">
               <thead>
                  <tr className="bg-slate-50/80 dark:bg-white/2 border-b border-divider sticky top-0 z-20 backdrop-blur-md">
                     <th className="py-5 px-8 w-12">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-divider text-primary focus:ring-primary/20 transition-all cursor-pointer"
                          onChange={(e) => {
                            if (e.target.checked) setSelectedTasks(tasks.map(b => b.id));
                            else setSelectedTasks([]);
                          }}
                        />
                     </th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Asset / Task ID</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Location Context</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Category</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Technician</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Priority / Status</th>
                     <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/30">
                  {tasks
                    .filter(t => {
                       const matchesSearch = t.task.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.technician.toLowerCase().includes(searchTerm.toLowerCase());
                       const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
                       return matchesSearch && matchesStatus;
                    })
                    .map((t) => (
                    <React.Fragment key={t.id}>
                       <tr 
                         onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                         className={`group hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all cursor-pointer ${expandedId === t.id ? 'bg-primary/5' : ''}`}
                       >
                          <td className="py-5 px-8" onClick={(e) => e.stopPropagation()}>
                             <input 
                               type="checkbox" 
                               checked={selectedTasks.includes(t.id)}
                               onChange={() => {
                                 if (selectedTasks.includes(t.id)) setSelectedTasks(selectedTasks.filter(id => id !== t.id));
                                 else setSelectedTasks([...selectedTasks, t.id]);
                               }}
                               className="w-4 h-4 rounded border-divider text-primary focus:ring-primary/20 transition-all cursor-pointer"
                             />
                          </td>
                          <td className="py-5 px-4">
                             <div>
                                <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">{t.task}</p>
                                <p className="text-[10px] font-bold text-text-muted italic">{t.id} • {t.date}</p>
                             </div>
                          </td>
                          <td className="py-5 px-4">
                             <div className="flex items-center gap-2 text-[12px] font-black text-text-primary italic">
                                <MapPin size={14} className="text-primary" />
                                <span>{t.location}</span>
                             </div>
                          </td>
                          <td className="py-5 px-4">
                             <div className="flex items-center gap-2">
                                {getCategoryIcon(t.category)}
                                <span className="text-[11px] font-black text-text-primary italic">{t.category}</span>
                             </div>
                          </td>
                          <td className="py-5 px-4">
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-background border border-divider flex items-center justify-center text-text-muted">
                                   <User size={14} />
                                </div>
                                <span className="text-[11px] font-black text-text-primary italic">{t.technician}</span>
                             </div>
                          </td>
                          <td className="py-5 px-4">
                             <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-1.5">
                                   <div className={`w-1.5 h-1.5 rounded-full ${t.priority === 'Critical' ? 'bg-rose-500 animate-pulse' : t.priority === 'High' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                   <span className={`text-[9px] font-black uppercase ${t.priority === 'Critical' ? 'text-rose-500' : 'text-text-muted'}`}>{t.priority}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                                   t.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                   t.status === 'In Progress' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 
                                   t.status === 'Open' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' : 
                                   'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                } w-fit`}>{t.status}</span>
                             </div>
                          </td>
                          <td className="py-5 px-8 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-text-muted hover:text-primary transition-all"><Edit size={16} /></button>
                                <button className="p-2 text-text-muted hover:text-indigo-500 transition-all"><MessageSquare size={16} /></button>
                                <button className="p-2 text-text-muted hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                             </div>
                          </td>
                       </tr>

                       <AnimatePresence>
                          {expandedId === t.id && (
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
                                              <FileText size={14} className="text-primary" /> Task Intelligence
                                            </h4>
                                            <div className="p-6 rounded-3xl bg-white dark:bg-card border border-divider shadow-subtle space-y-4">
                                               <p className="text-[12px] font-medium text-text-primary leading-relaxed italic">"{t.description}"</p>
                                               <div className="pt-4 border-t border-divider/50">
                                                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-2">Staff Remarks</p>
                                                  <p className="text-[11px] font-bold text-text-secondary italic">{t.notes}</p>
                                               </div>
                                            </div>
                                         </div>

                                         <div className="space-y-8">
                                            <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                              <Zap size={14} className="text-warning" /> Resource Manifest
                                            </h4>
                                            <div className="space-y-3">
                                               {t.parts.map((part, i) => (
                                                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card border border-divider shadow-subtle">
                                                     <span className="text-[11px] font-black text-text-primary uppercase tracking-tight">{part}</span>
                                                     <div className="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded text-[8px] font-black text-text-muted">REQUIRED</div>
                                                  </div>
                                               ))}
                                               {t.parts[0] === 'None' && (
                                                  <div className="p-4 rounded-2xl bg-white dark:bg-card border border-divider shadow-subtle text-center italic text-text-muted text-[11px]">No parts specified for this task</div>
                                               )}
                                            </div>
                                         </div>

                                         <div className="space-y-8">
                                            <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                              <ShieldCheck size={14} className="text-success" /> Operational Controls
                                            </h4>
                                            <div className="grid grid-cols-1 gap-3">
                                               <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all group">
                                                  Verify & Close Task <CheckCircle2 size={14} className="inline ml-1 group-hover:scale-110 transition-transform" />
                                               </button>
                                               <button className="w-full py-4 bg-white dark:bg-card border border-divider text-text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all">Reassign Specialist</button>
                                               <button className="w-full py-4 bg-rose-500/5 text-rose-500 border border-rose-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Abort Operation</button>
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

      {/* --- PAGINATION --- */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 card-classic bg-slate-50/50 dark:bg-white/2">
         <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Showing 4 of 24 tasks</span>
            <div className="h-4 w-px bg-border" />
            <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-text-secondary outline-none cursor-pointer">
               <option>Show 10</option>
               <option>Show 25</option>
               <option>Show 50</option>
            </select>
         </div>
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-divider rounded-xl text-text-muted opacity-50 cursor-not-allowed">Prev Phase</button>
            <div className="flex gap-1">
               {[1, 2, 3].map((p, i) => (
                 <button key={i} className={`w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary hover:bg-background'}`}>
                   {p}
                 </button>
               ))}
            </div>
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-divider rounded-xl text-text-secondary hover:border-primary hover:text-primary transition-all shadow-subtle">Next Phase</button>
         </div>
      </div>
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

      {/* --- NEW TASK WIZARD MODAL --- */}
      <Modal isOpen={showNewTaskModal} onClose={() => setShowNewTaskModal(false)} title="Dispatch Maintenance Task" footer={
        <div className="flex gap-3">
           <button type="button" onClick={() => setShowNewTaskModal(false)} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all">Cancel</button>
           <button type="button" onClick={() => { showToast("Task Dispatched successfully to engineering matrix.", "success"); setShowNewTaskModal(false); }} className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2">
              <Zap size={14} /> Dispatch Protocol
           </button>
        </div>
      }>
        <form className="space-y-5 py-4">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Task Title</label>
                 <input type="text" className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" placeholder="e.g. Broken AC Compressor" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Location</label>
                 <input type="text" className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" placeholder="e.g. Block A - Room 102" />
              </div>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Service Category</label>
                 <select className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer">
                    <option>Electrical</option>
                    <option>Plumbing</option>
                    <option>HVAC</option>
                    <option>Carpentry</option>
                    <option>Appliance Repair</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Priority Matrix</label>
                 <select className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer">
                    <option value="Low">Low - Routine</option>
                    <option value="Medium">Medium - Standard</option>
                    <option value="High">High - Urgent</option>
                    <option value="Critical">Critical - Emergency</option>
                 </select>
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Detailed Diagnostics / Notes</label>
              <textarea rows={4} className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary resize-none" placeholder="Provide contextual failure details..." />
           </div>
        </form>
      </Modal>

      {/* --- EXPORT MODAL --- */}
      <Modal isOpen={showExportModal} onClose={() => setShowExportModal(false)} title="Export Maintenance Matrix">
        <div className="py-6 space-y-6">
           <p className="text-sm text-text-muted text-center max-w-sm mx-auto">Select a format to compile and export the active maintenance datagrid.</p>
           <div className="grid grid-cols-2 gap-4">
              <button onClick={() => executeExport('CSV')} className="flex flex-col items-center justify-center p-6 border border-divider rounded-2xl bg-card hover:border-primary hover:shadow-glow transition-all group">
                 <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                 </div>
                 <span className="text-[13px] font-black text-text-primary uppercase tracking-tight">Export as CSV</span>
                 <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Raw Datagrid</span>
              </button>
              <button onClick={() => executeExport('PDF')} className="flex flex-col items-center justify-center p-6 border border-divider rounded-2xl bg-card hover:border-primary hover:shadow-glow transition-all group">
                 <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                 </div>
                 <span className="text-[13px] font-black text-text-primary uppercase tracking-tight">Export as PDF</span>
                 <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-1">Formatted Log</span>
              </button>
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default Maintenance;
