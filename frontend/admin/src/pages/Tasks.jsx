import React, { useState } from 'react';
import { 
  CheckSquare, Search, Filter, Plus, MoreHorizontal, 
  Clock, Calendar, User, ChevronRight, CheckCircle2,
  AlertCircle, Trash2, Edit, List, LayoutGrid,
  Zap, DollarSign, Wrench, Users, FileText, ArrowRight,
  ShieldCheck, ExternalLink, XCircle,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Tasks = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const [tasks] = useState([
    {
      id: 'TSK-1021',
      title: 'Review Quarterly Utility Bills',
      category: 'Finance',
      assignedTo: 'Rajesh Kumar',
      dueDate: '14 May 2024',
      status: 'Pending',
      priority: 'High',
      desc: 'Verify the electricity and water bills for Sapphire PG and Elite Living for the Q1 period.',
      history: [
        { status: 'Created', time: '10 May', user: 'Admin' },
        { status: 'Assigned', time: '11 May', user: 'Rajesh K.' }
      ]
    },
    {
      id: 'TSK-1022',
      title: 'Fix Leakage in Room 304',
      category: 'Maintenance',
      assignedTo: 'Suresh V.',
      dueDate: 'Today',
      status: 'In Progress',
      priority: 'Critical',
      desc: 'Major pipe burst in the bathroom ceiling. Requires immediate plumbing intervention.',
      history: [
        { status: 'Created', time: 'Today 08:00 AM', user: 'System' },
        { status: 'Started', time: 'Today 09:30 AM', user: 'Suresh V.' }
      ]
    },
    {
      id: 'TSK-1023',
      title: 'Renew AMC for Elevator',
      category: 'Admin',
      assignedTo: 'Anita Singh',
      dueDate: '20 May 2024',
      status: 'Completed',
      priority: 'Medium',
      desc: 'Annual Maintenance Contract renewal for the main elevator in Block B.',
      history: [
        { status: 'Created', time: '05 May', user: 'Admin' },
        { status: 'Completed', time: '11 May', user: 'Anita S.' }
      ]
    },
    {
      id: 'TSK-1024',
      title: 'Tenant Verification Audit',
      category: 'Residents',
      assignedTo: 'Vikram Mehta',
      dueDate: '16 May 2024',
      status: 'Pending',
      priority: 'Low',
      desc: 'Random check of KYC documents for newly moved-in tenants in Sapphire PG.',
      history: [
        { status: 'Created', time: '11 May', user: 'Admin' }
      ]
    }
  ]);

  const stats = [
    { label: 'Total Tasks', value: '48', icon: <CheckSquare />, color: 'primary' },
    { label: 'Completed', value: '32', icon: <CheckCircle2 />, color: 'success' },
    { label: 'Pending Ops', value: '12', icon: <Clock />, color: 'warning' },
    { label: 'Overdue', value: '04', icon: <AlertCircle />, color: 'danger' },
  ];

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Finance': return <DollarSign size={16} className="text-emerald-500" />;
      case 'Maintenance': return <Wrench size={16} className="text-indigo-500" />;
      case 'Residents': return <Users size={16} className="text-primary" />;
      default: return <FileText size={16} className="text-slate-500" />;
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
      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight uppercase italic">Operations Taskforce</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Tactical oversight and execution manifest for administrative protocols</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-2 bg-card border border-divider rounded-xl px-2 py-1 shadow-subtle">
              <button className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all">
                <FileText size={14} className="text-emerald-500" /> Manifest
              </button>
              <div className="w-px h-4 bg-border" />
              <button className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all">
                <Plus size={14} className="text-primary" /> New Protocol
              </button>
           </div>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
             <Zap size={16} strokeWidth={3} /> Quick Deploy
           </button>
        </div>
      </div>

      {/* --- TASK HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card-classic p-6 group hover:shadow-glow transition-all duration-500 relative overflow-hidden">
             <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color}/5 rounded-full blur-2xl group-hover:bg-${stat.color}/10 transition-all`} />
             <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center mb-4 border border-${stat.color}/10`}>
                {React.cloneElement(stat.icon, { size: 20, strokeWidth: 2.5 })}
             </div>
             <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{stat.label}</p>
             <h3 className="text-3xl font-black text-text-primary tracking-tight mt-1 italic">{stat.value}</h3>
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
               placeholder="Search tasks by Subject, Staff, or Category..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         
         <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="flex bg-card p-1.5 rounded-2xl border border-divider shadow-subtle shrink-0">
               {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
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

            <button className="flex items-center gap-2 px-6 py-3.5 bg-card border border-divider rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-all shadow-subtle shrink-0">
               <Filter size={14} strokeWidth={3} /> Filters
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
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Protocol / Task ID</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Assignee Context</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Category</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Deadline</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Priority / Status</th>
                     <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/30">
                  {tasks
                    .filter(t => {
                       const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()) || t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
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
                                <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">{t.title}</p>
                                <p className="text-[10px] font-bold text-text-muted italic">{t.id}</p>
                             </div>
                          </td>
                          <td className="py-5 px-4">
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-background border border-divider flex items-center justify-center text-text-muted">
                                   <User size={14} />
                                </div>
                                <span className="text-[11px] font-black text-text-primary italic">{t.assignedTo}</span>
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
                                <Clock size={14} className={t.dueDate === 'Today' ? 'text-rose-500' : 'text-text-muted'} />
                                <span className={`text-[11px] font-black italic ${t.dueDate === 'Today' ? 'text-rose-500' : 'text-text-primary'}`}>{t.dueDate}</span>
                             </div>
                          </td>
                          <td className="py-5 px-4">
                             <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-1.5">
                                   <div className={`w-1.5 h-1.5 rounded-full ${t.priority === 'Critical' ? 'bg-rose-500 animate-pulse' : t.priority === 'High' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                                   <span className={`text-[9px] font-black uppercase ${t.priority === 'Critical' ? 'text-rose-500' : 'text-text-muted'}`}>{t.priority}</span>
                                </div>
                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                                   t.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                                   t.status === 'In Progress' ? 'bg-primary/10 text-primary border-primary/20' : 
                                   'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                } w-fit`}>{t.status}</span>
                             </div>
                          </td>
                          <td className="py-5 px-8 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-text-muted hover:text-primary transition-all"><Edit size={16} /></button>
                                <button className="p-2 text-text-muted hover:text-emerald-500 transition-all"><CheckCircle2 size={16} /></button>
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
                                               <p className="text-[12px] font-medium text-text-primary leading-relaxed italic">"{t.desc}"</p>
                                               <div className="pt-4 border-t border-divider/50 flex items-center justify-between">
                                                  <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Linked Assets</span>
                                                  <span className="text-[10px] font-black text-primary uppercase italic">02 Nodes</span>
                                               </div>
                                            </div>
                                         </div>

                                         <div className="space-y-8">
                                            <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                              <Zap size={14} className="text-warning" /> Execution Pulse
                                            </h4>
                                            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                                               {t.history.map((h, i) => (
                                                  <div key={i} className="relative">
                                                     <div className="absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-4 border-background shadow-[0_0_0_4px_rgba(var(--color-primary),0.1)]" />
                                                     <div className="flex justify-between items-start">
                                                        <span className="text-[11px] font-black text-text-primary uppercase tracking-tight">{h.status}</span>
                                                        <span className="text-[9px] font-bold text-text-muted">{h.time}</span>
                                                     </div>
                                                     <p className="text-[10px] text-text-muted mt-1 italic">Initiated by {h.user}</p>
                                                  </div>
                                               ))}
                                            </div>
                                         </div>

                                         <div className="space-y-8">
                                            <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                              <ShieldCheck size={14} className="text-success" /> Decision Matrix
                                            </h4>
                                            <div className="grid grid-cols-1 gap-3">
                                               <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all group">
                                                  Finalize Task <CheckCircle2 size={14} className="inline ml-1 group-hover:scale-110 transition-transform" />
                                               </button>
                                               <button className="w-full py-4 bg-white dark:bg-card border border-divider text-text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all">Reassign Operator</button>
                                               <button className="w-full py-4 bg-rose-500/5 text-rose-500 border border-rose-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Abort Protocol</button>
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
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Showing 4 of 48 protocols</span>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 bg-background border border-divider rounded-xl px-3 py-1.5 shadow-subtle">
               <List size={14} className="text-primary" />
               <button className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Tabular Mode</button>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-divider rounded-xl text-text-muted opacity-50 cursor-not-allowed italic">Prev Manifest</button>
            <div className="flex gap-1">
               {[1, 2, 3].map((p, i) => (
                 <button key={i} className={`w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary hover:bg-background'}`}>
                   {p}
                 </button>
               ))}
            </div>
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-divider rounded-xl text-text-secondary hover:border-primary hover:text-primary transition-all shadow-subtle italic">Next Manifest</button>
         </div>
      </div>
    </div>
  );
};

export default Tasks;
