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
  Map, Settings, BarChart3, Zap, Bell, Search, Menu, MapPin, ShieldCheck, Building
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

const Dashboard = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('financials');
  const [liveActivity, setLiveActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [inventoryStats, setInventoryStats] = useState(null);
  const [staffStats, setStaffStats] = useState(null);
  const [ownerStats, setOwnerStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [occupancyStats, setOccupancyStats] = useState(null);
  const [complaintStats, setComplaintStats] = useState(null);
  const [buildings, setBuildings] = useState([]);
  
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

  const [adminStats, setAdminStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const buildingId = localStorage.getItem('selectedBuildingId');
        const params = {
          location: filters.location !== 'All Regions' ? filters.location : undefined,
          buildingId: filters.property !== 'All Buildings' ? filters.property : (buildingId !== 'all' ? buildingId : undefined),
          range: filters.range
        };
        
        const [summaryRes, activityRes, notifyRes, inventoryRes, staffRes, ownerRes, revenueRes, occupancyRes, complaintRes, buildingsRes, adminStatsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/dashboard/summary', { params }),
          axios.get('http://localhost:5000/api/dashboard/activity', { params }),
          axios.get('http://localhost:5000/api/dashboard/notifications', { params }),
          axios.get('http://localhost:5000/api/dashboard/inventory', { params }),
          axios.get('http://localhost:5000/api/dashboard/staff', { params }),
          axios.get('http://localhost:5000/api/dashboard/owners', { params }),
          axios.get('http://localhost:5000/api/dashboard/revenue', { params }),
          axios.get('http://localhost:5000/api/dashboard/occupancy', { params }),
          axios.get('http://localhost:5000/api/dashboard/complaints', { params }),
          axios.get('http://localhost:5000/api/dashboard/buildings'),
          axios.get('http://localhost:5000/api/admin/stats')
        ]);

        setStats(summaryRes.data);
        setLiveActivity(activityRes.data);
        setNotifications(notifyRes.data);
        setInventoryStats(inventoryRes.data);
        setStaffStats(staffRes.data);
        setOwnerStats(ownerRes.data);
        setRevenueStats(revenueRes.data);
        setOccupancyStats(occupancyRes.data);
        setComplaintStats(complaintRes.data);
        setBuildings(buildingsRes.data);
        setAdminStats(adminStatsRes.data);
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

  const Sparkline = ({ data, color, id }) => (
    <div className="h-12 w-full mt-3 relative z-10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area 
            type="monotone" 
            dataKey="v" 
            stroke={color} 
            fill={`url(#gradient-${id})`} 
            strokeWidth={3} 
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );

  const KPICard = ({ title, value, change, trendUp, icon, color = 'primary', sparkData, id }) => {
    const colorHex = color === 'primary' ? '#6366f1' : 
                     color === 'indigo' ? '#818cf8' : 
                     color === 'emerald' ? '#10b981' : 
                     color === 'violet' ? '#8b5cf6' : '#f59e0b';
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -6, scale: 1.02 }}
        className={`card-classic p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/5 relative overflow-hidden group hover:shadow-[0_20px_40px_-15px_${colorHex}40] transition-all duration-500`}
      >
        {/* Dynamic Glowing Blob */}
        <div className={`absolute -right-10 -top-10 w-32 h-32 bg-${color}/10 rounded-full blur-[40px] group-hover:bg-${color}/20 group-hover:scale-150 transition-transform duration-700 ease-out`} />
        
        {/* Top Section */}
        <div className="flex items-start justify-between mb-4 relative z-10">
          <div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.25em] drop-shadow-sm">{title}</span>
            <h3 className="text-3xl font-black text-text-primary tracking-tighter mt-1 italic drop-shadow-md">{value}</h3>
          </div>
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br from-${color}/20 to-${color}/5 text-${color} flex items-center justify-center border border-${color}/20 shadow-inner group-hover:rotate-12 transition-transform duration-500`}>
            {React.cloneElement(icon, { size: 20, strokeWidth: 2.5 })}
          </div>
        </div>

        {/* Velocity Indicator */}
        <div className="flex items-center gap-2 mt-2 relative z-10">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${trendUp ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'} shadow-sm`}>
            {trendUp ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
            <span>{change}</span>
          </div>
          <span className="text-[9px] text-text-muted font-black uppercase tracking-widest opacity-60">Velocity Matrix</span>
        </div>

        {/* Chart Section */}
        <Sparkline data={sparkData || [{v:40},{v:50},{v:45},{v:60},{v:55},{v:70}]} color={colorHex} id={id} />
        
        {/* Bottom Highlight Border */}
        <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${color}/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      </motion.div>
    );
  };

  return (
    <div className="space-y-10 pb-20 animate-fade relative">

       {/* 🚀 MASTER COMMAND HORIZON */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-slate-900 text-white p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        
        <div className="relative z-10 flex items-center gap-8">
           <div>
              <h2 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                 <ShieldCheck className="text-primary animate-pulse" size={28} /> Master Control Center
              </h2>
              <div className="flex items-center gap-4 mt-2">
                 <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Platform Integrity: 99.9%</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                    <Activity className="text-primary" size={10} />
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">Global Nodes: 12 Active</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 mt-6 md:mt-0">
           <div className="text-right hidden xl:block">
              <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Temporal Audit</p>
              <p className="text-sm font-black italic">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
           </div>
           <div className="h-10 w-px bg-white/10 hidden xl:block" />
           <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                 <Users size={20} className="text-white" />
              </div>
              <div className="pr-4">
                 <p className="text-[9px] font-black text-white/30 uppercase tracking-widest leading-none">System Admin</p>
                 <p className="text-[11px] font-black italic mt-0.5">StayNest Global Executive</p>
              </div>
           </div>
        </div>
      </div>

      {/* 🛠️ TACTICAL FILTERS & INTELLIGENCE EXPORT */}
      <div className="flex items-center justify-between bg-card/60 backdrop-blur-xl p-5 rounded-2xl border border-border shadow-premium relative z-[100]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div 
              onClick={() => toggleDropdown('location')}
              className={`flex items-center gap-3 px-4 py-2.5 bg-background border rounded-xl cursor-pointer group transition-all ${openDropdown === 'location' ? 'border-primary ring-4 ring-primary/5' : 'border-border hover:border-primary'}`}
            >
              <MapPin size={16} className={`transition-colors ${openDropdown === 'location' ? 'text-primary' : 'text-text-muted group-hover:text-primary'}`} />
              <span className="text-[11px] font-black text-text-primary uppercase tracking-widest">{filters.location}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === 'location' ? 'rotate-180 text-primary' : 'text-text-muted'}`} />
            </div>
            <AnimatePresence>
              {openDropdown === 'location' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-premium z-50 overflow-hidden"
                >
                  {['All Regions', 'Hyderabad', 'Bangalore', 'Pune', 'Delhi', 'Mumbai'].map((loc) => (
                    <button 
                      key={loc} onClick={() => handleFilterChange('location', loc)}
                      className={`w-full text-left px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-colors hover:bg-primary/5 ${filters.location === loc ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text-primary'}`}
                    >
                      {loc}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <div 
              onClick={() => toggleDropdown('property')}
              className={`flex items-center gap-3 px-4 py-2.5 bg-background border rounded-xl cursor-pointer group transition-all ${openDropdown === 'property' ? 'border-primary ring-4 ring-primary/5' : 'border-border hover:border-primary'}`}
            >
              <Filter size={16} className={`transition-colors ${openDropdown === 'property' ? 'text-primary' : 'text-text-muted group-hover:text-primary'}`} />
              <span className="text-[11px] font-black text-text-primary uppercase tracking-widest">{filters.property}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === 'property' ? 'rotate-180 text-primary' : 'text-text-muted'}`} />
            </div>
            <AnimatePresence>
              {openDropdown === 'property' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-premium z-50 overflow-hidden"
                >
                  <button 
                    onClick={() => handleFilterChange('property', 'All Buildings')}
                    className={`w-full text-left px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-colors hover:bg-primary/5 ${filters.property === 'All Buildings' ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text-primary'}`}
                  >
                    All Buildings
                  </button>
                  {buildings.map((b) => (
                    <button 
                      key={b._id} onClick={() => handleFilterChange('property', b.name)}
                      className={`w-full text-left px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-colors hover:bg-primary/5 ${filters.property === b.name ? 'text-primary bg-primary/5' : 'text-text-muted hover:text-text-primary'}`}
                    >
                      {b.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div 
            onClick={() => dateInputRef.current?.showPicker()}
            className="flex items-center gap-3 px-4 py-2.5 bg-background border border-border rounded-xl cursor-pointer hover:border-primary transition-all group"
          >
            <Calendar size={16} className="text-primary" />
            <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">{formatDate(sessionDate)}</span>
            <input ref={dateInputRef} type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} className="absolute inset-0 opacity-0 pointer-events-none" />
          </div>
          <button onClick={handleExport} className="btn-premium flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <Download size={14} strokeWidth={3} /> Intelligence Report
          </button>
        </div>
      </div>

      {/* 🚀 BENTO KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <KPICard id="portfolio" title="Total Portfolio" value={adminStats?.totalBuildings ?? stats?.buildingCount ?? '—'} change="+2" trendUp={true} icon={<Building />} color="primary" sparkData={[{v:30},{v:40},{v:35},{v:50},{v:48},{v:60}]} />
        <KPICard id="owners" title="Active Owners" value={adminStats?.totalOwners ?? stats?.totalOwners ?? '—'} change={adminStats?.pendingOwners > 0 ? `${adminStats.pendingOwners} Pending` : '+4'} trendUp={!(adminStats?.pendingOwners > 0)} icon={<UserPlus />} color="indigo" sparkData={[{v:20},{v:25},{v:30},{v:45},{v:40},{v:55}]} />
        <KPICard id="residents" title="Live Residents" value={adminStats?.activeTenants ?? stats?.totalTenants ?? '—'} change={adminStats?.pendingTenants > 0 ? `${adminStats.pendingTenants} Pending` : '+18'} trendUp={true} icon={<Users />} color="emerald" sparkData={[{v:50},{v:60},{v:55},{v:75},{v:70},{v:90}]} />
        <KPICard id="occupancy" title="Vacant Beds" value={adminStats?.vacantBeds ?? '—'} change={`${adminStats?.totalBeds ?? 0} Total`} trendUp={true} icon={<Target />} color="violet" sparkData={[{v:85},{v:88},{v:90},{v:92},{v:94},{v:96}]} />
        <KPICard id="complaints" title="Open Issues" value={adminStats?.openComplaints ?? '—'} change={`${adminStats?.totalComplaints ?? 0} Total`} trendUp={!(adminStats?.openComplaints > 5)} icon={<DollarSign />} color="amber" sparkData={[{v:40},{v:55},{v:50},{v:70},{v:65},{v:85}]} />
      </div>
      
      {/* 📡 PORTAL SYNCHRONIZATION PULSE */}
      <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl flex items-center justify-between backdrop-blur-md">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Tenant Portal: Linked</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Owner Portal: Syncing</span>
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
               <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Master API: Optimized</span>
            </div>
         </div>
         <div className="flex items-center gap-2 text-primary">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-black uppercase tracking-tighter">Unified Ecosystem Integrity Verified</span>
         </div>
      </div>
      
      {/* 📡 TACTICAL INTELLIGENCE HUB */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-classic p-6 bg-indigo-500/5 border-indigo-500/10 group cursor-pointer hover:border-indigo-500/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Users size={18} />
            </div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Staff Pulse</span>
          </div>
          <h4 className="text-xl font-black text-text-primary italic">{staffStats ? `${Math.round(staffStats.avgAttendance)}%` : '94%'} Present</h4>
          <p className="text-[9px] font-bold text-indigo-500 uppercase mt-2">{staffStats ? `${staffStats.activeStaff}/${staffStats.totalStaff} Staff Active` : '12/14 Staff Active'}</p>
        </div>

        <div className="card-classic p-6 bg-rose-500/5 border-rose-500/10 group cursor-pointer hover:border-rose-500/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Zap size={18} />
            </div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Material Low</span>
          </div>
          <h4 className="text-xl font-black text-text-primary italic">{inventoryStats ? `${inventoryStats.lowStock + inventoryStats.outOfStock} Items` : '04 Items'} Low</h4>
          <p className="text-[9px] font-bold text-rose-500 uppercase mt-2">{inventoryStats?.outOfStock > 0 ? 'Critical Restock Required' : 'Levels Stable'}</p>
        </div>

        <div className="card-classic p-6 bg-emerald-500/5 border-emerald-500/10 group cursor-pointer hover:border-emerald-500/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Hygiene Index</span>
          </div>
          <h4 className="text-xl font-black text-text-primary italic">A+ Standard</h4>
          <p className="text-[9px] font-bold text-emerald-500 uppercase mt-2">Last Audit: 2h ago</p>
        </div>

        <div className="card-classic p-6 bg-amber-500/5 border-amber-500/10 group cursor-pointer hover:border-amber-500/30 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Activity size={18} />
            </div>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Resolution SLA</span>
          </div>
          <h4 className="text-xl font-black text-text-primary italic">{complaintStats ? `${Math.round((complaintStats.resolved / complaintStats.total) * 100)}%` : '92%'} Rate</h4>
          <p className="text-[9px] font-bold text-amber-500 uppercase mt-2">Avg: {complaintStats?.avgResolutionHours || '4.2'}h response</p>
        </div>
      </div>

      {/* 🍱 MAIN BENTO GRID */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* 📊 LIVE OCCUPANCY HEATMAP */}
        <div className="col-span-12 lg:col-span-8 card-classic p-8 relative overflow-hidden group">
           <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700" />
           <div className="flex justify-between items-center mb-10">
              <div>
                 <h3 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2 uppercase">
                    <Map size={24} className="text-primary" /> Global Occupancy Pulse
                 </h3>
                 <p className="text-[12px] font-bold text-text-muted italic mt-1">Real-time capacity distribution across all property clusters</p>
              </div>
              <div className="flex gap-4">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Vacant Units</p>
                    <h4 className="text-xl font-black text-emerald-500 italic">{stats ? stats.vacantBeds : '12'} Beds</h4>
                 </div>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {(occupancyStats?.buildingWise || [
                { name: 'Sapphire Residency', total: 100, occupied: 90 },
                { name: 'Elite Living', total: 100, occupied: 80 },
                { name: 'StayNest Premium', total: 100, occupied: 70 }
              ]).slice(0, 3).map((b, i) => {
                const occupancy = b.total > 0 ? Math.round((b.occupied / b.total) * 100) : 0;
                return (
                  <div key={i} className="p-5 rounded-2xl bg-background border border-border group/card hover:border-primary/30 transition-all cursor-pointer">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[11px] font-black text-text-primary uppercase tracking-tighter">{b.name}</span>
                        <span className="text-[10px] font-bold text-primary italic">{occupancy}% Full</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${occupancy}%` }} className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(99,102,241,0.3)]" />
                    </div>
                  </div>
                );
              })}
           </div>
           <div className="h-[300px] bg-slate-50 dark:bg-white/[0.02] rounded-3xl border border-dashed border-border flex items-center justify-center relative group/map">
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="text-center z-10">
                 <Activity className="mx-auto text-primary mb-4 animate-pulse" size={48} />
                 <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em]">Live Data Stream Active</p>
              </div>
           </div>
        </div>

        {/* 🔔 REAL-TIME COMMAND LOG */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
           <div className="card-classic p-8 flex-1 border-primary/10 relative overflow-hidden group">
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
              <h3 className="text-xl font-black text-text-primary tracking-tight mb-8 flex items-center gap-2 uppercase">
                 <Bell size={20} className="text-primary" /> Command Pulse
              </h3>
              <div className="space-y-6 max-h-[480px] overflow-y-auto pr-2 scrollbar-hide">
                 {liveActivity.length > 0 ? liveActivity.map((log, i) => (
                   <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border group/log hover:border-primary/20 transition-all cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-border flex items-center justify-center shrink-0 group-hover/log:scale-110 transition-transform">
                         <span className="text-lg">{log.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-[13px] font-bold text-text-primary mb-1 line-clamp-1">{log.text}</p>
                         <div className="flex items-center gap-2">
                            <Clock size={10} className="text-text-muted" />
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter opacity-50">{new Date(log.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                      </div>
                   </motion.div>
                 )) : (
                   <p className="text-center text-text-muted italic py-10 font-bold">Waiting for live data transmission...</p>
                 )}
              </div>
              <button className="w-full mt-8 py-3.5 bg-slate-50 dark:bg-white/5 border border-border rounded-xl text-[10px] font-black text-text-muted uppercase tracking-widest hover:border-primary hover:text-primary transition-all">View All Logs</button>
           </div>
        </div>

        {/* 💰 FINANCIAL INTELLIGENCE */}
        <div className="col-span-12 lg:col-span-8 card-classic p-8">
           <div className="flex justify-between items-center mb-12">
              <div>
                 <h3 className="text-2xl font-black text-text-primary tracking-tight flex items-center gap-2 uppercase">
                    <BarChart3 size={24} className="text-emerald-500" /> Revenue Architecture
                 </h3>
                 <p className="text-[12px] font-bold text-text-muted italic mt-1">Comparing gross subscription yield against operational overheads</p>
              </div>
              <div className="flex items-center gap-8">
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">Inflow</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-danger" />
                    <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">Outflow</span>
                 </div>
              </div>
           </div>
           <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={revenueStats?.monthlyRevenue || REVENUE_DATA}>
                    <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#6b7280', fontSize: 11, fontWeight: '800' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#6b7280', fontSize: 11, fontWeight: '800' }} />
                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="8 8" fill="none" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* 🧠 SMART AI INSIGHTS */}
        <div className="col-span-12 lg:col-span-4 card-classic p-8 bg-slate-900 border-none relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-slate-900" />
           <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
           <div className="relative z-10 text-white h-full flex flex-col">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10">
                    <Zap size={24} className="text-amber-400" />
                 </div>
                 <h3 className="text-xl font-black tracking-tight uppercase">StayNest Neural Intelligence</h3>
              </div>
              <div className="space-y-6 flex-1">
                 <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-all cursor-pointer group/ai">
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest">Revenue Forecast</p>
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">92% Confidence</span>
                    </div>
                    <p className="text-[13px] font-bold italic leading-relaxed text-white/80">"Projected 12% revenue growth in Q3 due to student intake cycle."</p>
                    <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-emerald-500" />
                    </div>
                 </div>
                 <div className="p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Maintenance Predictive</p>
                       <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">High Impact</span>
                    </div>
                    <p className="text-[13px] font-bold italic leading-relaxed text-white/80">"Plumbing failure likely in Building B (Floor 2) within 72h based on history."</p>
                    <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: '75%' }} className="h-full bg-amber-500" />
                    </div>
                 </div>
              </div>
              <button className="w-full mt-8 py-4 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Deep Neural Audit</button>
           </div>
        </div>

        {/* 📦 INVENTORY & ASSET ALERTS */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 card-classic p-8">
           <h3 className="text-xl font-black text-text-primary tracking-tight mb-8 flex items-center gap-2 uppercase">
              <Zap size={20} className="text-amber-500" /> Material Intelligence
           </h3>
           <div className="space-y-4">
              {inventoryStats?.alerts?.length > 0 ? inventoryStats.alerts.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border group hover:border-amber-500/30 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/10">
                         <Zap size={16} />
                      </div>
                      <div>
                         <p className="text-[13px] font-bold text-text-primary">{item.name}</p>
                         <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{item.stock} Units left</p>
                      </div>
                   </div>
                   <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg uppercase">Low Stock</span>
                </div>
              )) : (
                <div className="text-center py-10">
                   <CheckCircle className="mx-auto text-emerald-500 mb-3" size={32} />
                   <p className="text-[11px] font-black text-text-muted uppercase tracking-widest">Inventory Fully Stocked</p>
                </div>
              )}
           </div>
        </div>

        {/* 🔧 MAINTENANCE EFFICIENCY */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 card-classic p-8">
           <h3 className="text-xl font-black text-text-primary tracking-tight mb-8 flex items-center gap-2 uppercase">
              <Wrench size={20} className="text-indigo-500" /> Resolution Matrix
           </h3>
           <div className="space-y-8">
              <div>
                 <div className="flex justify-between items-center mb-3">
                    <span className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em]">SLA Compliance</span>
                    <span className="text-2xl font-black text-text-primary italic">{complaintStats ? Math.round((complaintStats.resolved / complaintStats.total) * 100) : '94.2'}%</span>
                 </div>
                 <div className="w-full h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${complaintStats ? (complaintStats.resolved / complaintStats.total) * 100 : 94.2}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-primary rounded-full shadow-glow" />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                 <div className="text-center p-4 bg-background rounded-2xl border border-border">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">Avg Lead Time</p>
                    <h5 className="text-2xl font-black text-text-primary tracking-tight italic">{complaintStats?.avgResolutionHours || '4.2'}h</h5>
                 </div>
                 <div className="text-center p-4 bg-background rounded-2xl border border-border">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">High Priority</p>
                    <h5 className="text-2xl font-black text-rose-500 tracking-tight italic">{complaintStats?.highPriority || '03'}</h5>
                 </div>
              </div>
           </div>
        </div>

        {/* 🧼 HYGIENE & SANITIZATION */}
        <div className="col-span-12 lg:col-span-4 card-classic p-8 group overflow-hidden relative">
           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-all" />
           <h3 className="text-xl font-black text-text-primary tracking-tight mb-8 flex items-center gap-2 uppercase">
              <ShieldCheck size={20} className="text-emerald-500" /> Hygiene Index
           </h3>
           <div className="flex flex-col items-center justify-center py-4 text-center">
              <div className="relative w-36 h-36 mb-6 group-hover:scale-110 transition-transform duration-700">
                 <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-10 animate-ping" />
                 <svg className="w-full h-full rotate-[-90deg]">
                    <circle cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-white/5" />
                    <motion.circle 
                       initial={{ strokeDasharray: "0 402.12" }}
                       animate={{ strokeDasharray: "382 402.12" }}
                       cx="72" cy="72" r="64" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDashcap="round" className="text-emerald-500" 
                    />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-emerald-500 italic">A+</span>
                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Rating</span>
                 </div>
              </div>
              <p className="text-lg font-black text-text-primary uppercase tracking-tight italic">Superior Standard</p>
              <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest mt-2">Health Safety Audit: Pass</p>
              <div className="flex gap-4 mt-8 w-full">
                 <button className="flex-1 py-3 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all">Audit Log</button>
                 <button className="flex-1 py-3 bg-slate-50 dark:bg-white/5 border border-border rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-primary hover:text-primary transition-all">Schedule</button>
              </div>
           </div>
        </div>

      </div>

      {/* 📋 OPERATIONS MANIFEST: LIVE PERSONNEL & FINANCIAL AUDIT */}
      <div className="card-classic p-8 border-primary/5">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-black text-text-primary uppercase tracking-tight flex items-center gap-2">
              <Users size={20} className="text-primary" /> Operations Manifest
            </h3>
            <p className="text-[11px] font-bold text-text-muted italic mt-1">Live audit of personnel activity and financial obligations</p>
          </div>
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
            {['financials', 'dues', 'owners'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-primary shadow-sm' : 'text-text-muted hover:text-text-primary'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                {activeTab === 'financials' && (
                  <>
                    <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Transaction ID</th>
                    <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Resident</th>
                    <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Type</th>
                    <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Amount</th>
                    <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                  </>
                )}
                {activeTab === 'dues' && (
                  <>
                    <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Resident</th>
                    <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Due Date</th>
                    <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Amount</th>
                    <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                  </>
                )}
                {activeTab === 'owners' && (
                  <>
                    <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Owner Name</th>
                    <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Rating</th>
                    <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Portfolio Revenue</th>
                    <th className="pb-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeTab === 'financials' && (revenueStats?.recentTransactions || []).map((t, i) => (
                <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 text-[12px] font-black text-text-muted uppercase tracking-tighter">#{t.id}</td>
                  <td className="py-5 text-[13px] font-bold text-text-primary italic">{t.name}</td>
                  <td className="py-5 text-[11px] font-black text-text-muted uppercase tracking-widest">{t.type}</td>
                  <td className="py-5 text-[13px] font-black text-emerald-500 italic">{t.amount}</td>
                  <td className="py-5">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest">{t.status}</span>
                  </td>
                </tr>
              ))}
              {activeTab === 'dues' && (revenueStats?.upcomingDues || []).map((d, i) => (
                <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 text-[13px] font-bold text-text-primary italic">{d.name}</td>
                  <td className="py-5 text-[11px] font-black text-text-muted uppercase tracking-widest">{d.date}</td>
                  <td className="py-5 text-[13px] font-black text-rose-500 italic">{d.amount}</td>
                  <td className="py-5">
                    <span className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest">{d.status}</span>
                  </td>
                </tr>
              ))}
              {activeTab === 'owners' && (ownerStats?.topPerformers || []).map((o, i) => (
                <tr key={i} className="group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="py-5 text-[13px] font-bold text-text-primary italic">{o.name}</td>
                  <td className="py-5 text-[13px] font-black text-amber-500 italic">★ {o.rating}</td>
                  <td className="py-5 text-[13px] font-black text-primary italic">₹{o.revenue?.toLocaleString()}</td>
                  <td className="py-5">
                    <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">Verified</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {((activeTab === 'financials' && (!revenueStats?.recentTransactions?.length)) ||
            (activeTab === 'dues' && (!revenueStats?.upcomingDues?.length)) ||
            (activeTab === 'owners' && (!ownerStats?.topPerformers?.length))) && (
            <div className="py-20 text-center">
              <Activity className="mx-auto text-text-muted opacity-20 mb-4" size={40} />
              <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em]">No data records available in this manifest</p>
            </div>
          )}
        </div>
      </div>

      {/* 🚀 QUICK ACTIONS COMMAND HUD */}
      <div className="card-classic p-8 bg-slate-900 border-none shadow-glow">
        <h3 className="text-xl font-black text-white mb-10 flex items-center gap-3 uppercase tracking-[0.2em]">
           <Zap className="text-amber-400" /> Global Operations Command
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
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
              whileHover={{ scale: 1.1, rotate: 2 }}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 text-white/40 border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:text-white group-hover:border-white/30 transition-all duration-300">
                {React.cloneElement(action.icon, { size: 24, strokeWidth: 2.5 })}
              </div>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest group-hover:text-white transition-colors text-center">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
