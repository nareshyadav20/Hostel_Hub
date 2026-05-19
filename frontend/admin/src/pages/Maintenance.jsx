import React, { useState, useEffect } from 'react';
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
import API from '../api/axios';

const Maintenance = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [tasks, setTasks] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'Electrical',
    priority: 'Medium',
    buildingId: '',
    tenantId: ''
  });

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true);
      const [compRes, buildRes, tenantRes] = await Promise.all([
        API.get('/complaints'),
        API.get('/buildings'),
        API.get('/tenants')
      ]);

      // Filter for infrastructure categories
      const maintenanceCats = ['Maintenance', 'Plumbing', 'Electrical', 'Housekeeping', 'Other'];
      const rawComplaints = compRes.data || [];
      const mTasks = rawComplaints.filter(c => maintenanceCats.includes(c.category || 'Maintenance'));
      
      setTasks(mTasks);
      setBuildings(buildRes.data || []);
      setTenants(tenantRes.data || []);

      if (buildRes.data?.length > 0) {
        setNewTask(prev => ({ ...prev, buildingId: buildRes.data[0]._id }));
      }
    } catch (err) {
      console.error('Error fetching maintenance tasks:', err);
      showToast('Failed to load maintenance records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  useEffect(() => {
    if (newTask.buildingId) {
      const filteredTenants = tenants.filter(t => t.buildingId === newTask.buildingId || t.buildingId?._id === newTask.buildingId);
      if (filteredTenants.length > 0) {
        setNewTask(prev => ({ ...prev, tenantId: filteredTenants[0]._id }));
      } else {
        setNewTask(prev => ({ ...prev, tenantId: '' }));
      }
    }
  }, [newTask.buildingId, tenants]);

  const handleVerifyClose = async (id) => {
    try {
      await API.patch(`/complaints/${id}`, { status: 'Resolved' });
      showToast(`Task marked as Resolved.`, 'success');
      fetchMaintenanceData();
    } catch (err) {
      showToast('Failed to close task.', 'error');
    }
  };

  const handleReassign = async (id) => {
    const technician = prompt("Enter Specialist / Technician name to assign:");
    if (!technician) return;
    try {
      await API.patch(`/complaints/${id}`, { assignedTo: technician, status: 'In Progress' });
      showToast(`Reassigned to ${technician} successfully.`, 'success');
      fetchMaintenanceData();
    } catch (err) {
      showToast('Failed to assign technician.', 'error');
    }
  };

  const handleAbort = (id) => {
    triggerConfirm(
      "Abort Operations",
      `Are you sure you want to abort operation ${id}? This action will halt current service and log it.`,
      async () => {
        try {
          await API.patch(`/complaints/${id}`, { status: 'Rejected' });
          showToast(`Operation ${id} aborted and logged.`, "error");
          fetchMaintenanceData();
        } catch (err) {
          showToast('Failed to update task.', 'error');
        }
      }
    );
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.description) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    // Ensure we have a valid tenant assigned to comply with database schemas
    let finalTenantId = newTask.tenantId;
    if (!finalTenantId) {
      // Find any tenant or fallback
      const fallbackTenant = tenants.find(t => t.buildingId === newTask.buildingId || t.buildingId?._id === newTask.buildingId) || tenants[0];
      if (fallbackTenant) {
        finalTenantId = fallbackTenant._id;
      } else {
        showToast('Please register at least one tenant in the building to raise maintenance tickets.', 'warning');
        return;
      }
    }

    try {
      await API.post('/complaints', {
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        priority: newTask.priority,
        buildingId: newTask.buildingId,
        tenantId: finalTenantId
      });
      showToast('Task Dispatched successfully to engineering matrix.', 'success');
      setShowNewTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        category: 'Electrical',
        priority: 'Medium',
        buildingId: buildings[0]?._id || '',
        tenantId: ''
      });
      fetchMaintenanceData();
    } catch (err) {
      console.error(err);
      showToast('Failed to dispatch maintenance task.', 'error');
    }
  };

  const handleExport = () => setShowExportModal(true);

  const executeExport = (format) => {
    const headers = ['ID', 'Task', 'Category', 'Location', 'Technician', 'Priority', 'Status', 'Date'];
    const rows = tasks.map(t => [t._id, t.title || t.issue, t.category, t.buildingId?.name || 'All', t.assignedTo || 'Unassigned', t.priority, t.status, new Date(t.createdAt).toLocaleDateString()]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Maintenance_Logs_${new Date().toISOString().slice(0,10)}.${format.toLowerCase()}`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast(`Maintenance Logs exported successfully as ${format}.`, 'success');
    setShowExportModal(false);
  };

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'HVAC': return <Thermometer size={16} className="text-rose-500" />;
      case 'Plumbing': return <Droplets size={16} className="text-cyan-500" />;
      case 'Electrical': return <Lightbulb size={16} className="text-amber-500" />;
      case 'Housekeeping': return <ShieldCheck size={16} className="text-emerald-500" />;
      default: return <Wrench size={16} className="text-slate-500" />;
    }
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const criticalTasks = tasks.filter(t => t.priority === 'High' || t.priority === 'Critical').length;
  const pendingPartsTasks = tasks.filter(t => t.status === 'Pending').length;
  const completedTasks = tasks.filter(t => t.status === 'Resolved').length;

  const stats = [
    { label: 'Active Tasks', value: totalTasks.toString().padStart(2, '0'), icon: <Wrench />, color: 'primary', desc: 'Total infrastructure logs' },
    { label: 'Critical Ops', value: criticalTasks.toString().padStart(2, '0'), icon: <AlertCircle />, color: 'danger', desc: 'Urgent attention' },
    { label: 'Pending Action', value: pendingPartsTasks.toString().padStart(2, '0'), icon: <Clock />, color: 'warning', desc: 'Awaiting triage' },
    { label: 'Completed Tasks', value: completedTasks.toString().padStart(2, '0'), icon: <CheckCircle2 />, color: 'success', desc: 'Tasks closed' },
  ];

  const filteredTasks = tasks.filter(t => {
    const titleVal = t.title || t.issue || '';
    const idVal = t._id || '';
    const techVal = t.assignedTo || '';
    const locVal = t.buildingId?.name || '';

    const matchesSearch = titleVal.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          idVal.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          techVal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          locVal.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'All' || 
                          (filterStatus === 'Open' && (t.status === 'Pending' || t.status === 'Open')) ||
                          (filterStatus === 'In Progress' && (t.status === 'In Progress' || t.status === 'In-Progress')) ||
                          (filterStatus === 'Resolved' && t.status === 'Resolved');
    return matchesSearch && matchesStatus;
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
             <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 blur-2xl transition-all" />
             <div className={`w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 border border-primary/10 group-hover:shadow-glow transition-all duration-300`}>
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
               {['All', 'Open', 'In Progress', 'Resolved'].map((status) => (
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
         </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <div className="premium-spinner mx-auto mb-4"></div>
          <p className="text-sm font-black text-text-muted uppercase tracking-widest">Gathering engineering logs from MongoDB...</p>
        </div>
      ) : (
        /* --- TASK MANIFEST --- */
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
                              if (e.target.checked) setSelectedTasks(filteredTasks.map(b => b._id));
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
                    {filteredTasks.map((t) => (
                      <React.Fragment key={t._id}>
                         <tr 
                           onClick={() => setExpandedId(expandedId === t._id ? null : t._id)}
                           className={`group hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all cursor-pointer ${expandedId === t._id ? 'bg-primary/5' : ''}`}
                         >
                            <td className="py-5 px-8" onClick={(e) => e.stopPropagation()}>
                               <input 
                                 type="checkbox" 
                                 checked={selectedTasks.includes(t._id)}
                                 onChange={() => {
                                   if (selectedTasks.includes(t._id)) setSelectedTasks(selectedTasks.filter(id => id !== t._id));
                                   else setSelectedTasks([...selectedTasks, t._id]);
                                 }}
                                 className="w-4 h-4 rounded border-divider text-primary focus:ring-primary/20 transition-all cursor-pointer"
                               />
                            </td>
                            <td className="py-5 px-4">
                               <div>
                                  <p className="text-[13px] font-black text-text-primary tracking-tight">{t.title || t.issue}</p>
                                  <p className="text-[10px] font-bold text-text-muted italic">{t._id} • Dispatched {new Date(t.createdAt || t.date || new Date()).toLocaleDateString()}</p>
                               </div>
                            </td>
                            <td className="py-5 px-4">
                               <div className="flex flex-col">
                                  <span className="text-[12px] font-black text-text-primary italic">{t.buildingId?.name || 'All Buildings'}</span>
                                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Room {t.roomId?.roomNumber || 'N/A'}</span>
                               </div>
                            </td>
                            <td className="py-5 px-4">
                               <div className="flex items-center gap-2">
                                  {getCategoryIcon(t.category)}
                                  <span className="text-[11px] font-black text-text-primary italic">{t.category}</span>
                               </div>
                            </td>
                            <td className="py-5 px-4">
                               <span className="text-[12px] font-black text-text-primary italic">{t.assignedTo || 'Unassigned'}</span>
                            </td>
                            <td className="py-5 px-4">
                               <div className="flex items-center gap-3">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${t.priority === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-text-muted'}`}>{t.priority}</span>
                                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                    t.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                    t.status === 'In Progress' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                                    'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                  }`}>{t.status}</span>
                               </div>
                            </td>
                            <td className="py-5 px-8 text-right">
                               <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-2 text-text-muted hover:text-primary transition-all"><Edit size={16} /></button>
                                  <button className="p-2 text-text-muted hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                               </div>
                            </td>
                         </tr>
                         
                         <AnimatePresence>
                            {expandedId === t._id && (
                               <tr>
                                  <td colSpan={7} className="p-0 border-none">
                                     <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="bg-slate-50/30 dark:bg-white/[0.01] overflow-hidden"
                                     >
                                        <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12 border-b border-divider/50">
                                           <div className="space-y-6">
                                              <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                                <MapPin size={14} className="text-primary" /> Scope Parameters
                                              </h4>
                                              <p className="text-xs text-text-muted leading-relaxed"><b>Problem Description:</b> {t.description}</p>
                                           </div>
                                           <div className="space-y-6">
                                              <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                                <Clock size={14} className="text-warning" /> Diagnostics & History
                                              </h4>
                                              <p className="text-[10px] text-text-muted">Logged Date: {new Date(t.createdAt || t.date || new Date()).toLocaleString()}</p>
                                              <p className="text-[10px] text-text-muted">Assigned Specialist: {t.assignedTo || 'None Assigned'}</p>
                                           </div>
                                           <div className="space-y-6">
                                              <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                                <CheckCircle2 size={14} className="text-success" /> Dispatch Protocol
                                              </h4>
                                              <div className="flex flex-col gap-2">
                                                 {t.status !== 'Resolved' && (
                                                   <button onClick={() => handleVerifyClose(t._id)} className="w-full py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all">Verify & Close Task</button>
                                                 )}
                                                 <button onClick={() => handleReassign(t._id)} className="w-full py-3 bg-card border border-divider text-text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all">Assign Technician</button>
                                                 <button onClick={() => handleAbort(t._id)} className="w-full py-3 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Abort Operation</button>
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
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Showing {filteredTasks.length} of {totalTasks} logs</span>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 bg-background border border-divider rounded-xl px-3 py-1.5 shadow-subtle cursor-pointer" onClick={fetchMaintenanceData}>
               <FileText size={14} className="text-primary" />
               <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Refresh Manifest</span>
            </div>
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
      <Modal isOpen={showNewTaskModal} onClose={() => setShowNewTaskModal(false)} title="Dispatch Maintenance Task">
        <form onSubmit={handleCreateTask} className="space-y-5 py-4">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Task Title</label>
                 <input 
                   type="text" 
                   required
                   value={newTask.title}
                   onChange={e => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                   className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" 
                   placeholder="e.g. Repair Flush Valve" 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Facility Wing</label>
                 <select 
                   value={newTask.buildingId}
                   onChange={e => setNewTask(prev => ({ ...prev, buildingId: e.target.value }))}
                   className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer font-bold"
                 >
                    {buildings.map(b => (
                      <option key={b._id} value={b._id}>{b.name}</option>
                    ))}
                 </select>
              </div>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Service Category</label>
                 <select 
                   value={newTask.category}
                   onChange={e => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                   className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer font-bold"
                 >
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="HVAC">HVAC</option>
                    <option value="Housekeeping">Housekeeping</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Priority Matrix</label>
                 <select 
                   value={newTask.priority}
                   onChange={e => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                   className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer font-bold"
                 >
                    <option value="Low">Low - Routine</option>
                    <option value="Medium">Medium - Standard</option>
                    <option value="High">High - Urgent</option>
                 </select>
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Detailed Diagnostics / Notes</label>
              <textarea 
                rows={4} 
                required
                value={newTask.description}
                onChange={e => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary resize-none" 
                placeholder="Provide contextual failure details..." 
              />
           </div>
           
           <div className="flex gap-3 justify-end pt-4">
              <button type="button" onClick={() => setShowNewTaskModal(false)} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-all">Cancel</button>
              <button type="submit" className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center gap-2">
                 <Zap size={14} /> Dispatch Protocol
              </button>
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
