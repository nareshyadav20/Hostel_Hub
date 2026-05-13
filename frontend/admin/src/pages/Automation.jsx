import React, { useState } from 'react';
import { Play, Pause, Plus, Zap, Clock, Shield, Bell, CheckCircle, MoreHorizontal, Settings, ArrowRight, Activity, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Automation = () => {
  const navigate = useNavigate();
  const [workflows] = useState([
    { id: 1, name: 'Late Rent Reminder', trigger: 'Overdue > 3 Days', action: 'Send WhatsApp + Email', status: 'Active', executions: 42, color: 'primary' },
    { id: 2, name: 'Low Stock Alert', trigger: 'Inventory < 20%', action: 'Notify Admin + Vendor', status: 'Active', executions: 12, color: 'warning' },
    { id: 3, name: 'Auto-Assign Complaint', trigger: 'New Complaint', action: 'Route to On-Shift Staff', status: 'Active', executions: 156, color: 'accent' },
    { id: 4, name: 'KYC Expiry Warning', trigger: 'KYC < 30 Days', action: 'Prompt Tenant to Renew', status: 'Paused', executions: 0, color: 'danger' },
  ]);

  return (
    <div className="space-y-8 pb-10">
      {/* --- BACK NAVIGATION --- */}
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Automation Engine</h1>
          <p className="text-sm font-medium text-text-muted mt-1">Design and monitor intelligent workflows to automate your property operations.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
          <Plus size={18} /> Create Workflow
        </button>
      </div>

      {/* KPI Cluster */}
      <div className="grid grid-cols-12 gap-6">
        {[
          { label: 'Active Workflows', value: '18', icon: <Zap />, color: 'primary' },
          { label: 'Total Executions', value: '2,482', icon: <Activity />, color: 'success' },
          { label: 'System Uptime', value: '99.99%', icon: <Shield />, color: 'accent' },
          { label: 'Active Triggers', value: '42', icon: <Bell />, color: 'warning' }
        ].map((stat, i) => (
          <div key={i} className="col-span-12 md:col-span-6 lg:col-span-3 layer-2 p-6 group">
            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-text-primary mt-1 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Workflow Builder Section (Visual Mockup) */}
      <div className="layer-3 p-8 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap size={200} className="text-primary" />
         </div>
         <div className="relative z-10 max-w-2xl">
            <h2 className="text-xl font-black text-text-primary mb-4">StayNest Logic™ Editor</h2>
            <p className="text-sm text-text-secondary leading-relaxed mb-8">
               Our drag-and-drop automation builder allows you to connect triggers (like rent payments) 
               to actions (like generating invoices) with zero code.
            </p>
            <div className="flex items-center gap-4">
               <div className="px-4 py-3 rounded-2xl bg-card border border-divider flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold uppercase tracking-widest">IF: Rent Received</span>
               </div>
               <ArrowRight className="text-text-muted" size={18} />
               <div className="px-4 py-3 rounded-2xl bg-card border border-divider flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs font-bold uppercase tracking-widest">THEN: Issue Receipt</span>
               </div>
               <button className="ml-4 p-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all">
                  <Plus size={18} />
               </button>
            </div>
         </div>
      </div>

      {/* Active Workflows Table */}
      <div className="layer-2 overflow-hidden">
         <div className="p-6 border-b border-divider">
            <h2 className="text-lg font-bold tracking-tight text-text-primary">Operational Workflows</h2>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
               <thead>
                  <tr className="bg-card/20">
                     <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Workflow Name</th>
                     <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Logic Trigger</th>
                     <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Resultant Action</th>
                     <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Executions</th>
                     <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Status</th>
                     <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/50">
                  {workflows.map((wf) => (
                     <tr key={wf.id} className="group hover:bg-background transition-all">
                        <td className="py-5 px-6">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg bg-${wf.color}/10 text-${wf.color} flex items-center justify-center`}>
                                 <Zap size={14} />
                              </div>
                              <span className="text-sm font-bold text-text-primary">{wf.name}</span>
                           </div>
                        </td>
                        <td className="py-5 px-6 text-xs font-bold text-text-secondary">{wf.trigger}</td>
                        <td className="py-5 px-6 text-xs text-text-muted">{wf.action}</td>
                        <td className="py-5 px-6">
                           <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-text-primary">{wf.executions}</span>
                              <div className="w-12 h-1 bg-border rounded-full overflow-hidden">
                                 <div className={`h-full bg-${wf.color}`} style={{ width: '40%' }}></div>
                              </div>
                           </div>
                        </td>
                        <td className="py-5 px-6">
                           <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              wf.status === 'Active' ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'
                           }`}>
                              {wf.status.toUpperCase()}
                           </span>
                        </td>
                        <td className="py-5 px-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="flex items-center justify-end gap-2">
                              <button className="p-2 rounded-lg bg-background border border-divider text-text-muted hover:text-primary transition-all">
                                 {wf.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
                              </button>
                              <button className="p-2 rounded-lg bg-background border border-divider text-text-muted hover:text-primary transition-all">
                                 <Settings size={16} />
                              </button>
                              <button className="p-2 rounded-lg bg-background border border-divider text-text-muted hover:text-primary transition-all">
                                 <MoreHorizontal size={16} />
                              </button>
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

export default Automation;
