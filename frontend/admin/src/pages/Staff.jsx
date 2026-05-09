import React, { useState } from 'react';
import { UserPlus, Mail, Phone, ShieldCheck, MoreHorizontal, Search, Filter, Star, Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';

const Staff = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [staff] = useState([
    { id: 1, name: 'Sanjay Kumar', role: 'Property Manager', property: 'Sapphire PG', rating: 4.8, status: 'On Shift', joined: 'Jan 2023', tasks: '12/12' },
    { id: 2, name: 'Anita Rao', role: 'Operations Lead', property: 'Elite Living', rating: 4.9, status: 'On Shift', joined: 'Mar 2023', tasks: '8/10' },
    { id: 3, name: 'Vikram Das', role: 'Security Head', property: 'Tech Park PG', rating: 4.5, status: 'Off Duty', joined: 'Feb 2023', tasks: '4/5' },
    { id: 4, name: 'Meera Iyer', role: 'Housekeeping Lead', property: 'Sapphire PG', rating: 4.7, status: 'On Shift', joined: 'May 2023', tasks: '22/25' },
  ]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Personnel Operations</h1>
          <p className="text-sm font-medium text-text-muted mt-1">Monitor staff performance, shift schedules, and task completion across properties.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
          <UserPlus size={18} /> Onboard Staff
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-12 gap-6">
        {[
          { label: 'Total Personnel', value: '124', sub: 'Across 12 nodes', icon: <UserPlus />, color: 'primary' },
          { label: 'On-Shift Today', value: '82', sub: '92% Attendance', icon: <Clock />, color: 'accent' },
          { label: 'Task Completion', value: '94.2%', sub: '+2.1% from avg', icon: <CheckCircle />, color: 'success' },
          { label: 'Avg Rating', value: '4.75', sub: 'High Satisfaction', icon: <Star />, color: 'warning' }
        ].map((stat, i) => (
          <div key={i} className="col-span-12 md:col-span-6 lg:col-span-3 layer-2 p-6 group">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-text-primary mt-1 tracking-tight">{stat.value}</h3>
            <p className="text-[10px] text-text-muted font-medium mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search staff by name, role, property..." 
            className="w-full bg-card/50 border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-text-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-3 bg-card border border-border rounded-2xl text-text-muted hover:text-primary transition-all">
          <Filter size={20} />
        </button>
      </div>

      {/* Staff Directory Table */}
      <div className="layer-2 overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
           <h2 className="text-lg font-bold tracking-tight text-text-primary">Staff Directory</h2>
           <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline">Download Payroll Roster</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-card/20">
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Employee</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Role & Property</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Perf. Rating</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Task Load</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Status</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {staff.map((person) => (
                <tr key={person.id} className="group hover:bg-background/50 transition-all cursor-pointer">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {person.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">{person.name}</p>
                        <p className="text-[10px] text-text-muted">Joined {person.joined}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div>
                      <p className="text-sm font-bold text-text-secondary">{person.role}</p>
                      <p className="text-[10px] text-primary font-medium">{person.property}</p>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5 text-warning">
                        <Star size={12} fill="currentColor" />
                        <span className="text-sm font-bold text-text-primary">{person.rating}</span>
                      </div>
                      <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-warning" style={{ width: `${(person.rating / 5) * 100}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center w-24">
                        <span className="text-[10px] font-bold text-text-muted">TASKS</span>
                        <span className="text-[10px] font-bold text-text-primary">{person.tasks}</span>
                      </div>
                      <div className="w-24 h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '80%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      person.status === 'On Shift' ? 'bg-success/10 text-success border-success/20' : 'bg-text-muted/10 text-text-muted border-text-muted/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${person.status === 'On Shift' ? 'bg-success animate-pulse' : 'bg-text-muted'}`}></span>
                      {person.status}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all"><Mail size={16} /></button>
                       <button className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Staff;
