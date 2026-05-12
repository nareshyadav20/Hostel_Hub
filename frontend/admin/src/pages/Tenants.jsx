import React, { useState } from 'react';
import {
  Users, UserCheck, Bed, Search, Filter, MapPin, Mail,
  MoreHorizontal, Download, MessageSquare, Eye, Edit,
  Trash2, ArrowUpRight, TrendingUp, ShieldCheck, PieChart, DollarSign,
  LayoutGrid, List, Phone, Calendar, Clock, AlertCircle, FileText,
  UserPlus, CheckCircle2, ChevronRight, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Tenants = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState('grid');
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterRent, setFilterRent] = useState('All');

  const [tenants] = useState([
    {
      id: 1,
      name: 'Suresh Kumar',
      hostel: 'Sunshine Residency',
      room: '201-A',
      email: 'suresh@gmail.com',
      phone: '+91 98765 00010',
      status: 'Active',
      rentStatus: 'Paid',
      checkIn: '12 Jan 2024',
      duration: '5 Months',
      gender: 'Male',
      balance: '₹0',
      complaints: 0,
      docs: ['ID Proof', 'Agreement']
    },
    {
      id: 2,
      name: 'Anjali Sharma',
      hostel: 'Elite Living',
      room: '305-B',
      email: 'anjali@example.com',
      phone: '+91 98765 00011',
      status: 'Active',
      rentStatus: 'Pending',
      checkIn: '05 Feb 2024',
      duration: '4 Months',
      gender: 'Female',
      balance: '₹12,000',
      complaints: 1,
      docs: ['ID Proof']
    },
    {
      id: 3,
      name: 'Vikram Singh',
      hostel: 'Sunshine Residency',
      room: '102-C',
      email: 'vikram@work.com',
      phone: '+91 98765 00012',
      status: 'Left',
      rentStatus: 'Cleared',
      checkIn: '10 Oct 2023',
      duration: '6 Months',
      gender: 'Male',
      balance: '₹0',
      complaints: 0,
      docs: ['ID Proof', 'Agreement']
    },
    {
      id: 4,
      name: 'Riya Patel',
      hostel: 'Emerald Suites',
      room: '501-D',
      email: 'riya.p@live.in',
      phone: '+91 98765 00013',
      status: 'Active',
      rentStatus: 'Paid',
      checkIn: '20 Mar 2024',
      duration: '2 Months',
      gender: 'Female',
      balance: '₹0',
      complaints: 0,
      docs: ['ID Proof', 'Agreement']
    },
    {
      id: 5,
      name: 'Rahul Mehta',
      hostel: 'Sapphire PG',
      room: 'B-203',
      email: 'rahul.m@gmail.com',
      phone: '+91 98765 00014',
      status: 'Pending',
      rentStatus: 'Unpaid',
      checkIn: '01 May 2024',
      duration: '0 Months',
      gender: 'Male',
      balance: '₹15,000',
      complaints: 0,
      docs: []
    },
  ]);

  const stats = [
    { label: 'Active Residents', value: '4,289', change: '+5.4%', icon: <UserCheck />, color: 'success', description: 'Verified Stay' },
    { label: 'Occupancy Rate', value: '92.4%', change: '+2.1%', icon: <PieChart />, color: 'primary', description: 'Global Average' },
    { label: 'Rent Collected', value: '₹42.5L', change: '+12.5%', icon: <DollarSign />, color: 'indigo', description: 'MTD Revenue' },
  ];

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
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Global Tenant Directory</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">High-fidelity resident management and operational manifest</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:border-primary transition-all shadow-subtle">
            <Download size={14} /> Intel Export
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:border-primary transition-all shadow-subtle">
            <MessageSquare size={14} /> Broadcast
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
            <UserPlus size={16} strokeWidth={3} /> Onboard Tenant
          </button>
        </div>
      </div>

      {/* --- ANALYTICS HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-classic p-6 flex items-center gap-5 group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}/5 rounded-full -mr-16 -mt-16 blur-3xl`} />
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center border border-${stat.color}/10 group-hover:shadow-glow transition-all duration-300 relative z-10`}>
              {React.cloneElement(stat.icon, { size: 24, strokeWidth: 2.5 })}
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-black text-text-primary tracking-tight italic">{stat.value}</h3>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-success flex items-center gap-0.5">
                    <ArrowUpRight size={10} strokeWidth={3} /> {stat.change}
                  </span>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">{stat.description}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- STICKY CONTROL BAR --- */}
      <div className="sticky top-0 z-40 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50 -mx-4 px-4 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative flex items-center group">
          <Search className="absolute left-4 text-text-muted group-focus-within:text-primary transition-all duration-300" size={18} />
          <input
            type="text"
            className="w-full bg-card border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary shadow-subtle"
            placeholder="Search residents by name, room, property or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <div className="flex bg-card p-1.5 rounded-2xl border border-border shadow-subtle shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'}`}
            >
              <List size={18} />
            </button>
          </div>

          <div className="h-10 w-px bg-border mx-2 shrink-0" />

          <div className="flex bg-card p-1.5 rounded-2xl border border-border shadow-subtle shrink-0">
            {['All', 'Active', 'Pending', 'Left'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-6 py-3.5 bg-card border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-all shadow-subtle">
            <Filter size={14} strokeWidth={3} /> Filters
          </button>
        </div>
      </div>

      {/* --- TENANT DIRECTORY GRID/LIST --- */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {tenants
              .filter(t => {
                const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.room.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
                return matchesSearch && matchesStatus;
              })
              .map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  className={`card-classic group flex flex-col transition-all duration-500 overflow-hidden ${expandedId === t.id ? 'md:col-span-2 xl:col-span-2 ring-2 ring-primary ring-offset-4 dark:ring-offset-slate-900 shadow-2xl' : ''
                    }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg group-hover:scale-105 transition-transform">
                            {t.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${t.status === 'Active' ? 'bg-success' : t.status === 'Pending' ? 'bg-warning' : 'bg-text-muted'}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-text-primary tracking-tight">{t.name}</h3>
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t.room} • {t.hostel}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/50 text-text-muted hover:text-primary transition-all"><Edit size={16} /></button>
                        <button className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/50 text-text-muted hover:text-primary transition-all"><Mail size={16} /></button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border/50">
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-2">Payment Status</p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${t.rentStatus === 'Paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                            }`}>{t.rentStatus}</span>
                          <span className="text-[11px] font-black text-text-primary italic">{t.balance} Due</span>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border/50">
                        <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-2">Check-in</p>
                        <div className="flex items-center gap-2">
                          <Calendar size={12} className="text-primary" />
                          <span className="text-[11px] font-black text-text-primary italic">{t.checkIn}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {t.docs.map((doc, i) => (
                            <div key={i} className="w-7 h-7 rounded-lg bg-card border-2 border-background flex items-center justify-center text-text-muted" title={doc}>
                              <FileText size={12} />
                            </div>
                          ))}
                          {t.docs.length === 0 && <span className="text-[9px] font-bold text-text-muted italic">No Docs</span>}
                        </div>
                        {t.complaints > 0 && (
                          <span className="flex items-center gap-1 text-[9px] font-black text-rose-500 uppercase">
                            <AlertCircle size={10} /> {t.complaints} Open
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                        className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest hover:gap-2 transition-all"
                      >
                        {expandedId === t.id ? 'Close Profile' : 'Expand Profile'}
                        <ChevronRight size={14} className={`transition-transform ${expandedId === t.id ? 'rotate-90' : ''}`} />
                      </button>
                    </div>

                    <AnimatePresence>
                      {expandedId === t.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pt-8 mt-4 border-t border-border"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <h4 className="text-[11px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                                <Clock size={14} className="text-indigo-500" /> Stay Manifest
                              </h4>
                              <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 rounded-xl bg-background border border-border">
                                  <span className="text-[10px] font-bold text-text-muted uppercase">Gender</span>
                                  <span className="text-[11px] font-black text-text-primary">{t.gender}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-background border border-border">
                                  <span className="text-[10px] font-bold text-text-muted uppercase">Check-in</span>
                                  <span className="text-[11px] font-black text-text-primary">{t.checkIn}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-background border border-border">
                                  <span className="text-[10px] font-bold text-text-muted uppercase">Duration</span>
                                  <span className="text-[11px] font-black text-text-primary">{t.duration}</span>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-6">
                              <h4 className="text-[11px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                                <DollarSign size={14} className="text-success" /> Financial Pulse
                              </h4>
                              <div className="p-5 rounded-2xl bg-success/5 border border-success/10 flex flex-col items-center justify-center text-center">
                                <CheckCircle2 size={32} className="text-success mb-3" />
                                <p className="text-[14px] font-black text-text-primary">Clean Record</p>
                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">No outstanding overheads</p>
                              </div>
                              <button className="w-full py-3 bg-white dark:bg-slate-800 border border-border text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-primary transition-all">
                                Generate Ledger
                              </button>
                            </div>
                          </div>
                          <div className="mt-8 pt-8 border-t border-border flex justify-between items-center">
                            <div className="flex items-center gap-6">
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-text-muted uppercase">Phone</span>
                                <span className="text-[11px] font-black text-text-primary">{t.phone}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[9px] font-bold text-text-muted uppercase">Email</span>
                                <span className="text-[11px] font-black text-text-primary">{t.email}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="px-5 py-2.5 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Offboard</button>
                              <button className="px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Update Node</button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="layer-2 overflow-hidden"
          >
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-card/20 border-b border-border">
                    <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Resident Manifest</th>
                    <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Asset Node</th>
                    <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                    <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Payment</th>
                    <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {tenants
                    .filter(t => {
                      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.room.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
                      return matchesSearch && matchesStatus;
                    })
                    .map((t) => (
                      <tr key={t.id} className="group hover:bg-background transition-all cursor-pointer">
                        <td className="py-5 px-8">
                          <div className="flex items-center gap-4">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-[11px]">
                              {t.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">{t.name}</p>
                              <p className="text-[10px] font-medium text-text-muted">{t.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-5 px-8">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-text-primary italic">{t.room}</span>
                            <span className="text-[9px] font-bold text-text-muted uppercase">{t.hostel}</span>
                          </div>
                        </td>
                        <td className="py-5 px-8">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${t.status === 'Active' ? 'bg-success/5 text-success border-success/10' : 'bg-text-muted/5 text-text-muted border-text-muted/10'
                            }`}>{t.status}</span>
                        </td>
                        <td className="py-5 px-8">
                          <div className="flex flex-col">
                            <span className={`text-[10px] font-black uppercase ${t.rentStatus === 'Paid' ? 'text-success' : 'text-warning'}`}>{t.rentStatus}</span>
                            <span className="text-[9px] font-bold text-text-muted">Bal: {t.balance}</span>
                          </div>
                        </td>
                        <td className="py-5 px-8 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-text-muted hover:text-primary transition-all"><Edit size={16} /></button>
                            <button className="p-2 text-text-muted hover:text-primary transition-all"><Eye size={16} /></button>
                            <button className="p-2 text-text-muted hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DIRECTORY FOOTER --- */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 card-classic bg-slate-50/50 dark:bg-white/2">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Showing 5 of 4,289 records</span>
          <div className="h-4 w-px bg-border" />
          <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-text-secondary outline-none cursor-pointer">
            <option>Show 10</option>
            <option>Show 25</option>
            <option>Show 50</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl text-text-muted opacity-50 cursor-not-allowed">Previous Phase</button>
          <div className="flex gap-1">
            {[1, 2, 3, '...', 12].map((p, i) => (
              <button key={i} className={`w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary hover:bg-background'}`}>
                {p}
              </button>
            ))}
          </div>
          <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl text-text-secondary hover:border-primary hover:text-primary transition-all shadow-subtle">Next Phase</button>
        </div>
      </div>
    </div>
  );
};

export default Tenants;
