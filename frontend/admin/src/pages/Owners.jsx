import React, { useState } from 'react';
import { UserPlus, Mail, Phone, Home, ShieldCheck, MoreHorizontal, Search, Filter, TrendingUp, Building, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Owners = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [owners] = useState([
    { id: 1, name: 'Rahul Sharma', email: 'rahul@sharma.com', phone: '+91 98765 12345', hostels: 4, plan: 'Enterprise', status: 'Active', joined: 'Jan 2024', revenue: '₹8.5L' },
    { id: 2, name: 'Priya Verma', email: 'priya.v@outlook.com', phone: '+91 98765 23456', hostels: 2, plan: 'Standard', status: 'Active', joined: 'Mar 2024', revenue: '₹3.2L' },
    { id: 3, name: 'Amit Singh', email: 'amit.singh@gmail.com', phone: '+91 98765 34567', hostels: 1, plan: 'Basic', status: 'Deactivated', joined: 'Feb 2024', revenue: '₹1.1L' },
    { id: 4, name: 'Vikram Mehta', email: 'v.mehta@elite.in', phone: '+91 98765 45678', hostels: 8, plan: 'Enterprise', status: 'Active', joined: 'May 2024', revenue: '₹18.4L' },
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

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Hostel Owners</h1>
          <p className="text-sm font-medium text-text-muted mt-1">Manage platform-wide owner accounts and strategic partnerships.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
          <UserPlus size={18} /> Add New Owner
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-12 gap-6">
        {[
          { label: 'Total Partners', value: '142', change: '+5%', icon: <UserPlus />, color: 'primary' },
          { label: 'Enterprise Tier', value: '38', change: '+12%', icon: <ShieldCheck />, color: 'accent' },
          { label: 'Total Assets', value: '456', change: '+8%', icon: <Building />, color: 'success' },
          { label: 'Partner Revenue', value: '₹1.2Cr', change: '+15%', icon: <TrendingUp />, color: 'warning' }
        ].map((stat, i) => (
          <div key={i} className="col-span-12 md:col-span-6 lg:col-span-3 layer-2 p-6 group cursor-default">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={10} /> {stat.change}
              </div>
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-text-primary mt-1 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search owners by name, email, property..." 
            className="w-full bg-card/50 border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted text-text-primary shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="p-3 bg-card border border-border rounded-2xl text-text-muted hover:text-primary hover:border-primary/50 transition-all shadow-sm">
          <Filter size={20} />
        </button>
      </div>

      {/* Main Table */}
      <div className="layer-2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-card/20 border-b border-border">
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Owner Profile</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Portfolio</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Revenue Contrib.</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Tier</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Status</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {owners.map((owner) => (
                <tr key={owner.id} className="group hover:bg-background/50 transition-all cursor-pointer">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform">
                        {owner.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{owner.name}</p>
                        <p className="text-[11px] text-text-muted mt-0.5">{owner.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2">
                      <Home size={14} className="text-primary" />
                      <span className="text-sm font-bold text-text-secondary">{owner.hostels} Hostels</span>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-sm font-bold text-text-primary">{owner.revenue}</td>
                  <td className="py-5 px-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest border ${
                      owner.plan === 'Enterprise' ? 'bg-primary/10 text-primary border-primary/20' : 
                      owner.plan === 'Standard' ? 'bg-accent/10 text-accent border-accent/20' : 
                      'bg-text-muted/10 text-text-muted border-text-muted/20'
                    }`}>
                      {owner.plan.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      owner.status === 'Active' ? 'bg-success/10 text-success border-success/20' : 'bg-danger/10 text-danger border-danger/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${owner.status === 'Active' ? 'bg-success animate-pulse' : 'bg-danger'}`}></span>
                      {owner.status}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-all">
                        <Mail size={16} />
                      </button>
                      <button className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-all">
                        <Phone size={16} />
                      </button>
                      <button className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-all">
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

export default Owners;
