import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, Clock, MessageSquare, MoreHorizontal, User, Building, Trash2 } from 'lucide-react';

const Complaints = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [complaints] = useState([
    { id: 'CMP-101', tenant: 'Arjun Das', property: 'Sapphire PG', issue: 'AC Leaking in Room 102', priority: 'High', status: 'Pending', time: '2h ago' },
    { id: 'CMP-102', tenant: 'Neha Sharma', property: 'Elite Living', issue: 'Wi-Fi connectivity issues', priority: 'Medium', status: 'In Progress', time: '5h ago' },
    { id: 'CMP-103', tenant: 'Vikram Singh', property: 'Tech Park PG', issue: 'Water heater not working', priority: 'High', status: 'Resolved', time: '1d ago' },
    { id: 'CMP-104', tenant: 'Rahul Mehta', property: 'Sapphire PG', issue: 'Broken window latch', priority: 'Low', status: 'Pending', time: '3h ago' },
  ]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Support & Grievances</h1>
          <p className="text-sm font-medium text-text-muted mt-1">Resolution center for tenant complaints and maintenance requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-4">
             <p className="text-[10px] font-bold text-danger uppercase">Mean Resolution Time</p>
             <p className="text-xl font-black text-text-primary">4.2 Hours</p>
          </div>
          <button className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
             New Ticket
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-12 gap-6">
        {[
          { label: 'Total Tickets', value: '48', icon: <MessageSquare />, color: 'primary' },
          { label: 'Critical Issues', value: '5', icon: <AlertTriangle />, color: 'danger' },
          { label: 'In Progress', value: '12', icon: <Clock />, color: 'warning' },
          { label: 'Resolved (24h)', value: '31', icon: <CheckCircle />, color: 'success' }
        ].map((stat, i) => (
          <div key={i} className="col-span-12 md:col-span-6 lg:col-span-3 layer-2 p-6 group">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-text-primary mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            {['All', 'Pending', 'In Progress', 'Resolved'].map(filter => (
               <button 
                 key={filter}
                 onClick={() => setActiveFilter(filter)}
                 className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                   activeFilter === filter ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-card border border-border text-text-muted hover:text-text-primary'
                 }`}
               >
                 {filter}
               </button>
            ))}
         </div>
         <div className="relative w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
            <input type="text" placeholder="Search tickets..." className="w-full bg-card border border-border rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary/50 text-text-primary" />
         </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
         {complaints.map((cmp) => (
            <div key={cmp.id} className="layer-2 p-6 group hover:border-primary/30 transition-all cursor-pointer">
               <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        cmp.priority === 'High' ? 'bg-danger/10 text-danger' : 
                        cmp.priority === 'Medium' ? 'bg-warning/10 text-warning' : 
                        'bg-success/10 text-success'
                     }`}>
                        <AlertTriangle size={24} />
                     </div>
                     <div>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-text-muted tracking-widest">{cmp.id}</span>
                           <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                              cmp.status === 'Resolved' ? 'bg-success/10 text-success' : 
                              cmp.status === 'In Progress' ? 'bg-warning/10 text-warning' : 
                              'bg-danger/10 text-danger'
                           }`}>{cmp.status.toUpperCase()}</span>
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mt-1">{cmp.issue}</h3>
                        <div className="flex items-center gap-6 mt-3">
                           <div className="flex items-center gap-1.5 text-text-muted">
                              <User size={14} className="text-primary" />
                              <span className="text-xs font-bold">{cmp.tenant}</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-text-muted">
                              <Building size={14} className="text-primary" />
                              <span className="text-xs font-bold">{cmp.property}</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-text-muted">
                              <Clock size={14} />
                              <span className="text-xs font-medium">Logged {cmp.time}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2.5 rounded-xl bg-background border border-border text-text-muted hover:text-primary transition-all">
                        <MessageSquare size={18} />
                     </button>
                     <button className="p-2.5 rounded-xl bg-background border border-border text-text-muted hover:text-success transition-all">
                        <CheckCircle size={18} />
                     </button>
                     <button className="p-2.5 rounded-xl bg-background border border-border text-text-muted hover:text-danger transition-all">
                        <Trash2 size={18} />
                     </button>
                     <button className="p-2.5 rounded-xl bg-background border border-border text-text-muted hover:text-text-primary transition-all ml-2">
                        <MoreHorizontal size={18} />
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
};

export default Complaints;
