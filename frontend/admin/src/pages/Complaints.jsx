import React, { useState } from 'react';
import { 
  Search, Filter, AlertTriangle, CheckCircle, Clock, 
  MessageSquare, MoreHorizontal, User, Building, Trash2,
  ChevronRight, Download, FileText, Calendar, 
  Wrench, DollarSign, Volume2, ShieldAlert, Edit, Mail,
  CheckCircle2, XCircle, Zap, ExternalLink, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Complaints = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState([]);

  const [complaints] = useState([
    { 
      id: 'CMP-101', 
      tenant: 'Arjun Das', 
      room: '102',
      property: 'Sapphire PG', 
      issue: 'AC Leaking in Room 102', 
      category: 'Maintenance',
      priority: 'High', 
      status: 'Open', 
      time: '2h ago',
      date: '12 May 2024',
      assignedTo: 'Suresh Kumar',
      description: 'Water is dripping from the indoor unit, potentially damaging the wooden floor below. Requires immediate attention.',
      history: [
        { status: 'Opened', time: '10:15 AM', note: 'Tenant reported issue via portal.' },
        { status: 'Assigned', time: '11:00 AM', note: 'Assigned to Suresh (Maintenance Head).' }
      ]
    },
    { 
      id: 'CMP-102', 
      tenant: 'Neha Sharma', 
      room: '305',
      property: 'Elite Living', 
      issue: 'Wi-Fi connectivity issues', 
      category: 'IT/Utility',
      priority: 'Medium', 
      status: 'In Progress', 
      time: '5h ago',
      date: '12 May 2024',
      assignedTo: 'Rajesh V.',
      description: 'Frequent disconnects in the west wing of the 3rd floor. Signal strength is weak.',
      history: [
        { status: 'Opened', time: '08:00 AM', note: 'Tenant reported intermittent connection.' },
        { status: 'In Progress', time: '09:30 AM', note: 'Router reset performed, testing cables.' }
      ]
    },
    { 
      id: 'CMP-103', 
      tenant: 'Vikram Singh', 
      room: 'B-04',
      property: 'Tech Park PG', 
      issue: 'Water heater not working', 
      category: 'Maintenance',
      priority: 'High', 
      status: 'Resolved', 
      time: '1d ago',
      date: '11 May 2024',
      assignedTo: 'Anita M.',
      description: 'Geyser in the attached bathroom is not heating. Power light is on but no heat.',
      history: [
        { status: 'Opened', time: 'Yesterday', note: 'Urgent request for hot water.' },
        { status: 'Resolved', time: 'Yesterday', note: 'Heating element replaced. Verified by tenant.' }
      ]
    },
    { 
      id: 'CMP-104', 
      tenant: 'Rahul Mehta', 
      room: '412',
      property: 'Sapphire PG', 
      issue: 'Broken window latch', 
      category: 'Security',
      priority: 'Low', 
      status: 'Open', 
      time: '3h ago',
      date: '12 May 2024',
      assignedTo: 'Suresh Kumar',
      description: 'The window latch is loose and doesn\'t lock properly. Safety concern for personal belongings.',
      history: [
        { status: 'Opened', time: '09:45 AM', note: 'Logged as minor maintenance.' }
      ]
    },
  ]);

  const stats = [
    { label: 'Total Tickets', value: '48', icon: <MessageSquare size={20} />, color: 'primary', desc: 'Active this month' },
    { label: 'Critical Issues', value: '05', icon: <AlertTriangle size={20} />, color: 'danger', desc: 'High priority' },
    { label: 'In Resolution', value: '12', icon: <Clock size={20} />, color: 'warning', desc: 'Pending action' },
    { label: 'Resolved (24h)', value: '31', icon: <CheckCircle size={20} />, color: 'success', desc: 'Completed tasks' }
  ];

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Maintenance': return <Wrench size={16} className="text-indigo-500" />;
      case 'IT/Utility': return <Zap size={16} className="text-primary" />;
      case 'Security': return <ShieldAlert size={16} className="text-rose-500" />;
      case 'Billing': return <DollarSign size={16} className="text-emerald-500" />;
      default: return <Volume2 size={16} className="text-slate-500" />;
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
               placeholder="Search tickets by Subject, Tenant, or ID..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         
         <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="flex bg-card p-1.5 rounded-2xl border border-border shadow-subtle shrink-0">
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

            <button className="flex items-center gap-2 px-6 py-3.5 bg-card border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-all shadow-subtle shrink-0">
               <Filter size={14} strokeWidth={3} /> Intelligence Filter
            </button>
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
                            if (e.target.checked) setSelectedTickets(complaints.map(b => b.id));
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
                  {complaints
                    .filter(c => {
                       const matchesSearch = c.issue.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()) || c.tenant.toLowerCase().includes(searchTerm.toLowerCase());
                       const matchesStatus = activeFilter === 'All' || c.status === activeFilter;
                       return matchesSearch && matchesStatus;
                    })
                    .map((c) => (
                    <React.Fragment key={c.id}>
                       <tr 
                         onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                         className={`group hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all cursor-pointer ${expandedId === c.id ? 'bg-primary/5' : ''}`}
                       >
                          <td className="py-5 px-8" onClick={(e) => e.stopPropagation()}>
                             <input 
                               type="checkbox" 
                               checked={selectedTickets.includes(c.id)}
                               onChange={() => {
                                 if (selectedTickets.includes(c.id)) setSelectedTickets(selectedTickets.filter(id => id !== c.id));
                                 else setSelectedTickets([...selectedTickets, c.id]);
                               }}
                               className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                             />
                          </td>
                          <td className="py-5 px-4">
                             <div>
                                <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">{c.issue}</p>
                                <p className="text-[10px] font-bold text-text-muted italic">{c.id} • Logged {c.time}</p>
                             </div>
                          </td>
                          <td className="py-5 px-4">
                             <div className="flex flex-col">
                                <span className="text-[12px] font-black text-text-primary italic">{c.tenant}</span>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Room {c.room} • {c.property}</span>
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
                                <button className="p-2 text-text-muted hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                             </div>
                          </td>
                       </tr>
                       
                       <AnimatePresence>
                          {expandedId === c.id && (
                             <tr>
                                <td colSpan={7} className="p-0 border-none">
                                   <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="bg-slate-50/30 dark:bg-white/[0.01] overflow-hidden"
                                   >
                                      <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12 border-b border-border/50">
                                         <div className="space-y-8">
                                            <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                              <Building size={14} className="text-primary" /> Case Parameters
                                            </h4>
                                            <div className="space-y-4">
                                               <div className="p-4 rounded-2xl bg-white dark:bg-card border border-border shadow-subtle">
                                                  <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Issue Description</p>
                                                  <p className="text-[12px] font-medium text-text-primary leading-relaxed">{c.description}</p>
                                               </div>
                                               <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-card border border-border shadow-subtle">
                                                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><User size={16} /></div>
                                                  <div>
                                                     <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Assigned Specialist</p>
                                                     <p className="text-[12px] font-black text-text-primary">{c.assignedTo}</p>
                                                  </div>
                                               </div>
                                            </div>
                                         </div>

                                         <div className="space-y-8">
                                            <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                              <Clock size={14} className="text-warning" /> Resolution Pulse
                                            </h4>
                                            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                                               {c.history.map((h, i) => (
                                                  <div key={i} className="relative">
                                                     <div className="absolute -left-[20px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-4 border-background shadow-[0_0_0_4px_rgba(var(--color-primary),0.1)]" />
                                                     <div className="flex justify-between items-start">
                                                        <span className="text-[11px] font-black text-text-primary uppercase tracking-tight">{h.status}</span>
                                                        <span className="text-[9px] font-bold text-text-muted">{h.time}</span>
                                                     </div>
                                                     <p className="text-[10px] text-text-muted mt-1 italic">"{h.note}"</p>
                                                  </div>
                                               ))}
                                            </div>
                                         </div>

                                         <div className="space-y-8">
                                            <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                              <CheckCircle2 size={14} className="text-success" /> Decision Matrix
                                            </h4>
                                            <div className="grid grid-cols-1 gap-3">
                                               <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all group">
                                                  Resolve Ticket <CheckCircle size={14} className="inline ml-1 group-hover:scale-110 transition-transform" />
                                               </button>
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

      {/* --- PAGINATION --- */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 card-classic bg-slate-50/50 dark:bg-white/2">
         <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Showing 4 of 48 reports</span>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-1.5 shadow-subtle">
               <FileText size={14} className="text-primary" />
               <button className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Generate Audit Log</button>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl text-text-muted opacity-50 cursor-not-allowed italic">Prev Manifest</button>
            <div className="flex gap-1">
               {[1, 2, 3].map((p, i) => (
                 <button key={i} className={`w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary hover:bg-background'}`}>
                   {p}
                 </button>
               ))}
            </div>
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl text-text-secondary hover:border-primary hover:text-primary transition-all shadow-subtle italic">Next Manifest</button>
         </div>
      </div>
    </div>
  );
};

export default Complaints;
