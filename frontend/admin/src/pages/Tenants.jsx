import React, { useState } from 'react';
import { 
  Users, UserCheck, Bed, Search, Filter, MapPin, Mail, 
  MoreHorizontal, Download, MessageSquare, Eye, Edit, 
  Trash2, ArrowUpRight, TrendingUp, ShieldCheck, PieChart, DollarSign
} from 'lucide-react';

const Tenants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants] = useState([
    { id: 1, name: 'Suresh Kumar', hostel: 'Sunshine Residency', room: '201-A', email: 'suresh@gmail.com', phone: '+91 98765 00010', status: 'Active', rentStatus: 'Paid' },
    { id: 2, name: 'Anjali Sharma', hostel: 'Elite Living', room: '305-B', email: 'anjali@example.com', phone: '+91 98765 00011', status: 'Active', rentStatus: 'Pending' },
    { id: 3, name: 'Vikram Singh', hostel: 'Sunshine Residency', room: '102-C', email: 'vikram@work.com', phone: '+91 98765 00012', status: 'Inactive', rentStatus: 'Cleared' },
    { id: 4, name: 'Riya Patel', hostel: 'Emerald Suites', room: '501-D', email: 'riya.p@live.in', phone: '+91 98765 00013', status: 'Active', rentStatus: 'Paid' },
    { id: 5, name: 'Rahul Mehta', hostel: 'Sapphire PG', room: 'B-203', email: 'rahul.m@gmail.com', phone: '+91 98765 00014', status: 'Active', rentStatus: 'Paid' },
  ]);

  const stats = [
    { label: 'Active Residents', value: '4,289', change: '+5.4%', icon: <UserCheck />, color: 'success' },
    { label: 'Occupancy Rate', value: '92.4%', change: '+2.1%', icon: <PieChart />, color: 'primary' },
    { label: 'Rent Collected', value: '₹42.5L', change: '+12.5%', icon: <DollarSign />, color: 'accent' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Global Tenant Directory</h1>
          <p className="text-sm font-medium text-text-muted mt-1">Unified operational view of all residents across the ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-background border border-border rounded-xl text-text-muted hover:text-text-primary transition-all">
            <Download size={14} /> Export Intel
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-primary text-white rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
            <MessageSquare size={14} /> Bulk Message
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-12 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="col-span-12 md:col-span-4 layer-2 p-6 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">{stat.change}</span>
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-text-primary mt-1 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search residents by name, property, room or UID..." 
            className="w-full bg-card/50 border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-text-primary shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-3 bg-card border border-border rounded-2xl text-text-muted hover:text-primary transition-all shadow-sm">
          <Filter size={20} />
        </button>
      </div>

      {/* Tenants Table */}
      <div className="layer-2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-card/20 border-b border-border">
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Resident</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Assigned Property</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Room Node</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Status</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Rent</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="group hover:bg-background/50 transition-all cursor-pointer">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform">
                        {tenant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{tenant.name}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{tenant.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-text-secondary">
                      <MapPin size={12} className="text-primary" />
                      {tenant.hostel}
                    </div>
                  </td>
                  <td className="py-5 px-6">
                     <span className="text-xs font-bold text-text-primary px-2 py-1 rounded-lg bg-background border border-border">{tenant.room}</span>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      tenant.status === 'Active' ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${tenant.status === 'Active' ? 'bg-success animate-pulse' : 'bg-danger'}`}></span>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${
                      tenant.rentStatus === 'Paid' ? 'bg-success/10 text-success border-success/20' : 
                      tenant.rentStatus === 'Pending' ? 'bg-warning/10 text-warning border-warning/20' : 
                      'bg-text-muted/10 text-text-muted border-text-muted/20'
                    }`}>
                      {tenant.rentStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all"><Eye size={16} /></button>
                       <button className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all"><Mail size={16} /></button>
                       <button className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-all"><MoreHorizontal size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-border flex items-center justify-between bg-card/10">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Showing 5 of 4,289 residents</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-[10px] font-bold border border-border rounded-lg text-text-muted opacity-50 cursor-not-allowed">PREV</button>
            <button className="px-3 py-1 text-[10px] font-bold border border-border rounded-lg text-text-secondary hover:bg-primary hover:text-white transition-all">NEXT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tenants;
