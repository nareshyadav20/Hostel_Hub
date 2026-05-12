import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Users, CreditCard, Percent, Bed, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle,
  DollarSign, Wrench, MoreHorizontal, Download,
  Filter, ChevronRight, TrendingUp, Target,
  UserPlus, CalendarCheck, Activity, FileText, ChevronDown, Calendar,
  Map, Settings, BarChart3, Zap, Bell, Search, Menu, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useTheme } from './context/ThemeContext';

const REVENUE_DATA = [
  { name: 'Jan', revenue: 45000, expenses: 22000 },
  { name: 'Feb', revenue: 52000, expenses: 24000 },
  { name: 'Mar', revenue: 48000, expenses: 21000 },
  { name: 'Apr', revenue: 61000, expenses: 28000 },
  { name: 'May', revenue: 58000, expenses: 25000 },
  { name: 'Jun', revenue: 72000, expenses: 31000 },
];

const ROOM_SEGMENTS = [
  { name: 'Single', value: 45, color: '#4338ca' },
  { name: 'Double', value: 35, color: '#6366f1' },
  { name: 'Deluxe', value: 20, color: '#818cf8' },
];

const UPCOMING_DUES = [
  { name: 'Rahul Sharma', room: 'A-201', date: 'In 2 days', amount: '₹12,000' },
  { name: 'Neha Das', room: 'B-304', date: 'In 3 days', amount: '₹12,000' },
  { name: 'Vikram Singh', room: 'C-102', date: 'Tomorrow', amount: '₹12,000' },
];

const RECENT_TRANSACTIONS = [
  { id: '1025', name: 'Arjun Das', node: 'Room 204', type: 'Rent Payment', amount: '₹12,000', status: 'Paid' },
  { id: '1024', name: 'Vikram Singh', node: 'Room 312', type: 'Mess Fee', amount: '₹3,500', status: 'Pending' },
  { id: '1023', name: 'Neha Verma', node: 'Room 108', type: 'Security Deposit', amount: '₹10,000', status: 'Paid' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('transactions');
  
  // 🔍 Filter States
  const [filters, setFilters] = useState({
    location: 'All Regions',
    property: 'All Buildings',
    range: 'Last 30 Days'
  });
  
  const [openDropdown, setOpenDropdown] = useState(null);
  const [sessionDate, setSessionDate] = useState('2026-05-12');
  const dateInputRef = React.useRef(null);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleExport = () => {
    // 📊 Prepare High-Fidelity Data Manifest
    const data = [
      ['Metric', 'Value', 'Context'],
      ['Report Date', formatDate(sessionDate), 'Administrative Cycle'],
      ['Location', filters.location, 'Geographical Cluster'],
      ['Property', filters.property, 'Structural Manifest'],
      ['Net Revenue', stats ? `₹${stats.todayRevenue}` : '₹42,800', 'Yield Audit'],
      ['Occupancy Rate', stats ? `${stats.occupancyRate}%` : '94.2%', 'Capacity Pulse'],
      ['Total Residents', stats ? stats.totalTenants : '312', 'Personnel Manifest'],
      ['Vacant Units', stats ? stats.vacantBeds : '12', 'Asset Health'],
    ];

    const csvContent = "data:text/csv;charset=utf-8," 
      + data.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `StayNest_Report_${filters.location}_${sessionDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`Tactical Manifest Generated Successfully!\nDownloading: StayNest_Report_${filters.location}_${sessionDate}.csv`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const buildingId = localStorage.getItem('selectedBuildingId');
        const params = {
          location: filters.location !== 'All Regions' ? filters.location : undefined,
          buildingId: filters.property !== 'All Buildings' ? filters.property : (buildingId !== 'all' ? buildingId : undefined),
          range: filters.range
        };
        const res = await axios.get('http://localhost:5000/api/dashboard/summary', { params });
        setStats(res.data);
      } catch (err) { console.error(err); }
    };
    fetchData();
    window.addEventListener('buildingChanged', fetchData);
    return () => window.removeEventListener('buildingChanged', fetchData);
  }, [filters]);

  const toggleDropdown = (name) => setOpenDropdown(openDropdown === name ? null : name);
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setOpenDropdown(null);
  };

  const KPICard = ({ title, value, change, trendUp, icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card-classic p-6 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-bold text-text-muted uppercase tracking-widest">{title}</span>
        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
          {React.cloneElement(icon, { size: 18 })}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-black text-text-primary tracking-tighter mb-2">{value}</h3>
        <div className={`flex items-center gap-1.5 text-[11px] font-bold ${trendUp ? 'text-success' : 'text-danger'}`}>
          {trendUp ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
          <span>{change}</span>
          <span className="text-text-muted font-bold ml-1 uppercase">vs last month</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8 pb-16 animate-fade">

      {/* 🛠️ GLOBAL FILTERS & ACTIONS */}
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-subtle">
        <div className="flex items-center gap-4">
          {/* Location Filter */}
          <div className="relative">
            <div 
              onClick={() => toggleDropdown('location')}
              className={`flex items-center gap-2 px-3 py-2 bg-background border rounded-lg cursor-pointer group transition-all ${openDropdown === 'location' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary'}`}
            >
              <MapPin size={16} className={`transition-colors ${openDropdown === 'location' ? 'text-primary' : 'text-text-muted group-hover:text-primary'}`} />
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">{filters.location}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === 'location' ? 'rotate-180 text-primary' : 'text-text-muted'}`} />
            </div>
            <AnimatePresence>
              {openDropdown === 'location' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-premium z-50 overflow-hidden"
                >
                  {['All Regions', 'Hyderabad', 'Bangalore', 'Pune', 'Delhi', 'Mumbai'].map((loc) => (
                    <button 
                      key={loc} onClick={() => handleFilterChange('location', loc)}
                      className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-primary/5 ${filters.location === loc ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text-primary'}`}
                    >
                      {loc}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Property Filter */}
          <div className="relative">
            <div 
              onClick={() => toggleDropdown('property')}
              className={`flex items-center gap-2 px-3 py-2 bg-background border rounded-lg cursor-pointer group transition-all ${openDropdown === 'property' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary'}`}
            >
              <Filter size={16} className={`transition-colors ${openDropdown === 'property' ? 'text-primary' : 'text-text-muted group-hover:text-primary'}`} />
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">{filters.property}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === 'property' ? 'rotate-180 text-primary' : 'text-text-muted'}`} />
            </div>
            <AnimatePresence>
              {openDropdown === 'property' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-premium z-50 overflow-hidden"
                >
                  {['All Buildings', 'Elite Residency', 'Premium Suites', 'Standard Wings', 'Guest House'].map((prop) => (
                    <button 
                      key={prop} onClick={() => handleFilterChange('property', prop)}
                      className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-primary/5 ${filters.property === prop ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text-primary'}`}
                    >
                      {prop}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Range Filter */}
          <div className="relative">
            <div 
              onClick={() => toggleDropdown('range')}
              className={`flex items-center gap-2 px-3 py-2 bg-background border rounded-lg cursor-pointer group transition-all ${openDropdown === 'range' ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary'}`}
            >
              <Calendar size={16} className={`transition-colors ${openDropdown === 'range' ? 'text-primary' : 'text-text-muted group-hover:text-primary'}`} />
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">{filters.range}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === 'range' ? 'rotate-180 text-primary' : 'text-text-muted'}`} />
            </div>
            <AnimatePresence>
              {openDropdown === 'range' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-premium z-50 overflow-hidden"
                >
                  {['Today', 'Last 7 Days', 'Last 30 Days', 'This Month', 'This Year'].map((rng) => (
                    <button 
                      key={rng} onClick={() => handleFilterChange('range', rng)}
                      className={`w-full text-left px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest transition-colors hover:bg-primary/5 ${filters.range === rng ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text-primary'}`}
                    >
                      {rng}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group mr-4">
             <div 
                onClick={() => dateInputRef.current?.showPicker()}
                className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg cursor-pointer hover:border-primary transition-all relative"
             >
                <Calendar size={14} className="text-primary" />
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{formatDate(sessionDate)}</span>
                <input 
                   ref={dateInputRef}
                   type="date" 
                   value={sessionDate}
                   onChange={(e) => setSessionDate(e.target.value)}
                   className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
                />
             </div>
          </div>
          <button 
            onClick={handleExport}
            className="btn-premium"
          >
            <Download size={14} strokeWidth={3} /> Export Report
          </button>
        </div>
      </div>

      {/* 🚀 HERO KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Net Revenue" value={stats ? `₹${(stats.todayRevenue / 1000).toFixed(1)}K` : '₹42.8L'} change="12.4%" trendUp={true} icon={<DollarSign />} />
        <KPICard title="Occupancy" value={stats ? `${stats.occupancyRate}%` : '94.2%'} change="5.2%" trendUp={true} icon={<Target />} />
        <KPICard title="Residents" value={stats ? stats.totalTenants : '312'} change="+18" trendUp={true} icon={<Users />} />
        <KPICard title="Vacancies" value={stats ? stats.vacantBeds : '12'} change="-3" trendUp={false} icon={<Bed />} />
      </div>

      {/* ⚡ QUICK ACTIONS HUB */}
      <div className="card-classic p-8">
        <h3 className="text-xl text-premium-header mb-8">Quick Actions Command Hub</h3>
        <div className="flex flex-wrap items-center justify-between gap-6">
          {[
            { label: 'Add Booking', path: '/bookings', icon: <CalendarCheck />, color: 'indigo' },
            { label: 'Add Tenant', path: '/tenants', icon: <UserPlus />, color: 'emerald' },
            { label: 'Create Invoice', path: '/finance', icon: <FileText />, color: 'blue' },
            { label: 'Add Complaint', path: '/issues', icon: <AlertTriangle />, color: 'rose' },
            { label: 'Room Map', path: '/rooms', icon: <Map />, color: 'violet' },
            { label: 'Maintenance', path: '/tasks', icon: <Wrench />, color: 'amber' },
            { label: 'Reports', path: '/finance', icon: <BarChart3 />, color: 'cyan' },
            { label: 'Settings', path: '/settings', icon: <Settings />, color: 'slate' },
          ].map((action, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -5 }}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-3 group flex-1 min-w-[100px]"
            >
              <div className={`w-14 h-14 rounded-2xl bg-${action.color === 'primary' ? 'primary' : action.color + '-500'}/10 text-${action.color === 'primary' ? 'primary' : action.color + '-500'} border border-${action.color === 'primary' ? 'primary' : action.color + '-500'}/20 flex items-center justify-center group-hover:shadow-glow group-hover:bg-${action.color === 'primary' ? 'primary' : action.color + '-500'} group-hover:text-white transition-all duration-300`}>
                {React.cloneElement(action.icon, { size: 24, strokeWidth: 2.5 })}
              </div>
              <span className="text-[10px] font-black text-text-muted uppercase tracking-tight group-hover:text-text-primary transition-colors text-center">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* 📊 FINANCIAL PERFORMANCE */}
        <div className="col-span-12 lg:col-span-8 card-classic p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl text-premium-header">Financial Pulse</h3>
              <p className="text-[12px] font-medium text-text-muted italic">Comparing gross revenue against maintenance expenditure</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-danger" />
                <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">Expenses</span>
              </div>
            </div>
          </div>

          <div className="h-[340px] min-h-[340px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart data={REVENUE_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#6b7280', fontSize: 11, fontWeight: '800' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#6b7280', fontSize: 11, fontWeight: '800' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#0f172a', color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🏨 SEGMENTATION & HEALTH */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="card-classic p-8 flex-1">
            <h3 className="text-xl text-premium-header mb-8">Capacity Mix</h3>
            <div className="flex items-center gap-8">
              <div className="relative w-32 h-32 min-h-[128px]">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie data={ROOM_SEGMENTS} innerRadius={45} outerRadius={60} paddingAngle={8} dataKey="value" stroke="none">
                      {ROOM_SEGMENTS.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-text-primary italic">94%</span>
                </div>
              </div>
              <div className="space-y-3 flex-1">
                {ROOM_SEGMENTS.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">{item.name}</span>
                    <span className="text-[12px] font-black text-text-primary italic">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card-classic p-8 flex-1">
            <h3 className="text-xl text-premium-header mb-8">Service Health</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">Resolution Efficiency</span>
                  <span className="text-[13px] font-black text-text-primary">85%</span>
                </div>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Avg Time</p>
                  <h5 className="text-xl font-black text-text-primary tracking-tight italic">12.5h</h5>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-text-muted uppercase mb-1">Solved</p>
                  <h5 className="text-xl font-black text-emerald-500 tracking-tight italic">08</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* ⚠️ PRIORITY ALERTS */}
        <div className="col-span-12 lg:col-span-4 card-classic p-8">
          <h3 className="text-xl text-premium-header mb-8">Priority Actions</h3>
          <div className="space-y-4">
            {[
              { label: 'Unpaid Dues', count: '₹45,200', sub: 'Critical Action Required', icon: <DollarSign />, color: 'danger' },
              { label: 'Maintenance', count: '05 Tickets', sub: '3 High Priority Open', icon: <Wrench />, color: 'warning' },
              { label: 'Applications', count: '08 Pending', sub: 'Verification Pending', icon: <Clock />, color: 'primary' },
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border hover:border-primary/20 transition-all cursor-pointer group">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${alert.color}/10 text-${alert.color} border border-${alert.color}/20`}>
                  {React.cloneElement(alert.icon, { size: 18 })}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-text-primary mb-0.5">{alert.label}</p>
                  <p className="text-[11px] font-black text-text-muted uppercase tracking-wider">{alert.count}</p>
                </div>
                <ChevronRight size={16} className="text-text-muted group-hover:text-primary transition-all mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* 📋 TABBED ACTIVITY PANEL */}
        <div className="col-span-12 lg:col-span-8 card-classic overflow-hidden flex flex-col">
          <div className="flex border-b border-border bg-slate-50/50 dark:bg-white/2">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-8 py-5 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'transactions' ? 'text-primary' : 'text-text-muted hover:text-text-primary'}`}
            >
              Financial Manifest
              {activeTab === 'transactions' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />}
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-8 py-5 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'logs' ? 'text-primary' : 'text-text-muted hover:text-text-primary'}`}
            >
              Operations Log
              {activeTab === 'logs' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />}
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <AnimatePresence mode="wait">
              {activeTab === 'transactions' ? (
                <motion.table
                  key="transactions"
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                  className="w-full text-left"
                >
                  <thead>
                    <tr className="bg-background/50 border-b border-border">
                      <th className="py-4 px-8 text-[10px] font-bold text-text-muted uppercase tracking-widest">ID</th>
                      <th className="py-4 px-8 text-[10px] font-bold text-text-muted uppercase tracking-widest">Resident</th>
                      <th className="py-4 px-8 text-[10px] font-bold text-text-muted uppercase tracking-widest">Asset</th>
                      <th className="py-4 px-8 text-[10px] font-bold text-text-muted uppercase tracking-widest">Volume</th>
                      <th className="py-4 px-8 text-[10px] font-bold text-text-muted uppercase tracking-widest">Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {RECENT_TRANSACTIONS.map((txn, i) => (
                      <tr key={i} className="hover:bg-background/30 transition-all cursor-pointer">
                        <td className="py-4 px-8 text-[12px] font-medium text-text-muted font-mono">#{txn.id}</td>
                        <td className="py-4 px-8 text-[14px] font-black text-text-primary uppercase tracking-tight">{txn.name}</td>
                        <td className="py-4 px-8 text-[12px] font-bold text-text-secondary">{txn.node}</td>
                        <td className="py-4 px-8 text-[14px] font-black text-text-primary">{txn.amount}</td>
                        <td className="py-4 px-8">
                          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-success/20 bg-success/10 text-success">{txn.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </motion.table>
              ) : (
                <motion.div
                  key="logs"
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  className="p-8 space-y-6"
                >
                  {[
                    { time: '12:30 PM', user: 'Admin', action: 'Approved Booking #1254', icon: <CheckCircle className="text-emerald-500" /> },
                    { time: '11:15 AM', user: 'Staff', action: 'Resolved Leakage in Room B-102', icon: <Wrench className="text-indigo-500" /> },
                    { time: '10:45 AM', user: 'System', action: 'Auto-Invoice Generated', icon: <FileText className="text-primary" /> },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-lg bg-background border border-border flex items-center justify-center shrink-0">{React.cloneElement(log.icon, { size: 14 })}</div>
                      <div>
                        <p className="text-[13px] font-bold text-text-primary mb-0.5">{log.action}</p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{log.user} • {log.time}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
