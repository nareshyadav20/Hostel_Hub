import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, BarChart, Bar
} from 'recharts';
import {
  Users, Building2, CreditCard, Activity, Percent,
  ArrowUpRight, ArrowDownRight, ShieldCheck,
  Bell, Search, Plus, Download, Calendar,
  CheckCircle2, AlertTriangle, FileText, Globe, Zap, Brain, TrendingUp, MapPin, Database, Cpu, HardDrive, Eye, MessageSquare,
  Sparkles, Layers, Home, X, MoreHorizontal, ArrowRight, CheckCircle, Info, RefreshCcw, Command, Power
} from 'lucide-react';
import axios from 'axios';

const REVENUE_DATA = [
  { name: 'Jan', actual: 45, projected: 40 },
  { name: 'Feb', actual: 52, projected: 45 },
  { name: 'Mar', actual: 48, projected: 50 },
  { name: 'Apr', actual: 61, projected: 55 },
  { name: 'May', actual: 59, projected: 60 },
  { name: 'Jun', actual: 82, projected: 70 },
  { name: 'Jul', actual: 95, projected: 85 },
];

const SYSTEM_PERFORMANCE = [
  { time: '10:00', val: 99.2 },
  { time: '11:00', val: 99.5 },
  { time: '12:00', val: 99.1 },
  { time: '13:00', val: 99.8 },
  { time: '14:00', val: 99.4 },
  { time: '15:00', val: 99.9 },
  { time: '16:00', val: 99.7 },
];

const AUTOMATION_LOGS = [
  { id: 1, trigger: 'Rent Overdue > 3 Days', action: 'THEN: Send Reminder', result: 'Success', time: '10m ago' },
  { id: 2, trigger: 'AC Maintenance Logged', action: 'THEN: Assigned to Technician', result: 'Success', time: '1h ago' },
  { id: 3, trigger: 'Low Kitchen Stock', action: 'THEN: Generate Purchase Order', result: 'Pending', time: '2h ago' },
  { id: 4, trigger: 'Payment Received', action: 'THEN: Update Wallet', result: 'Success', time: '3h ago' },
];

const AI_INSIGHTS = [
  { id: 1, type: 'DEMAND PREDICTION', confidence: 92, title: 'High demand predicted in Bangalore', desc: 'Expected 18% booking increase next week.', action: 'Optimize Pricing', impact: 'positive' },
  { id: 2, type: 'RETENTION RISK', confidence: 85, title: '3 tenants at risk in Building B', desc: 'Repeated Wi-Fi issues and late payments.', action: 'Take Action', impact: 'negative' },
];

const ACTIVITY_FEED = [
  { id: 1, text: 'Room B-203 booked by Rahul Mehta', time: '5m ago', type: 'success' },
  { id: 2, text: 'Payment received ₹12,000 via UPI', time: '12m ago', type: 'success' },
  { id: 3, text: 'Complaint escalated: AC Leaking Room 102', time: '28m ago', type: 'warning' },
  { id: 4, text: 'AI predicted occupancy increase in Pune', time: '1h ago', type: 'info' },
  { id: 5, text: 'Vendor stock low: Breakfast supplies', time: '2h ago', type: 'danger' },
];

const RECENT_BOOKINGS = [
  { id: 'BK-1021', name: 'Arjun Das', property: 'Sapphire PG', amount: '₹12,000', status: 'CONFIRMED', date: '12 May, 2024' },
  { id: 'BK-1022', name: 'Neha Sharma', property: 'Elite Living', amount: '₹15,000', status: 'PENDING', date: '12 May, 2024' },
  { id: 'BK-1023', name: 'Vikram Singh', property: 'Tech Park PG', amount: '₹10,000', status: 'CONFIRMED', date: '12 May, 2024' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState('This Year');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/dashboard/summary');
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Report exported successfully as PDF!');
    }, 1500);
  };

  const handleAction = (type) => {
    alert(`Action triggered: ${type}`);
  };

  return (
    <div className="space-y-10 pb-12 relative animate-fade">
      
      {/* --- ADD NEW MODAL --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade">
          <div className="layer-4 w-full max-w-lg border-2 border-primary/20 overflow-hidden animate-slide-up shadow-2xl">
            <div className="bg-primary/10 p-6 flex justify-between items-center border-b border-border">
              <h3 className="text-xl font-black text-text-primary uppercase tracking-tight">System Node Initialization</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-text-muted hover:text-primary transition-all p-2 hover:bg-primary/5 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <button onClick={() => { setIsAddModalOpen(false); navigate('/tenants'); }} className="p-6 rounded-3xl bg-background border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group shadow-sm">
                  <Users className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} />
                  <p className="font-black text-text-primary uppercase text-xs tracking-widest">New Resident</p>
                  <p className="text-[10px] text-text-muted mt-2 font-medium">Onboard a new resident entity</p>
                </button>
                <button onClick={() => { setIsAddModalOpen(false); navigate('/hostels'); }} className="p-6 rounded-3xl bg-background border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group shadow-sm">
                  <Building2 className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} />
                  <p className="font-black text-text-primary uppercase text-xs tracking-widest">New Property</p>
                  <p className="text-[10px] text-text-muted mt-2 font-medium">Register a new asset node</p>
                </button>
              </div>
              <div className="flex flex-col gap-6">
                 <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Entity Identifier</label>
                   <input type="text" placeholder="e.g. Rahul Sharma" className="bg-background border-2 border-border rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-primary transition-all text-text-primary placeholder:text-text-muted/50" />
                 </div>
                 <button onClick={() => { setIsAddModalOpen(false); alert('Successfully created!'); }} className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 active:scale-[0.98]">
                   Confirm Initialization
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DASHBOARD HEADER --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white border-4 border-primary/20 shadow-xl shadow-primary/20 relative group">
            <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Command size={28} className="relative z-10" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-text-primary tracking-tighter uppercase italic">Central Command</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-success animate-glow"></span>
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">Global Operations & Strategic Intel</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className={`flex items-center gap-2 px-5 py-3 text-[10px] font-black uppercase tracking-widest bg-card border-2 border-border rounded-2xl text-text-secondary hover:border-primary/50 hover:text-primary transition-all shadow-md active:scale-95 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isExporting ? <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div> : <Download size={16} />}
            {isExporting ? 'Processing...' : 'Export Intel'}
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-8 py-3 text-[10px] font-black uppercase tracking-widest bg-primary text-white rounded-2xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/40 active:scale-95"
          >
            <Plus size={20} strokeWidth={3} /> Add Node
          </button>
        </div>
      </div>

      {/* --- ELITE ACTION HUB --- */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {[
          { label: 'Bulk Invoice', icon: <FileText size={16} />, color: 'primary' },
          { label: 'Broadcast', icon: <MessageSquare size={16} />, color: 'accent' },
          { label: 'Staffing', icon: <Users size={16} />, color: 'success' },
          { label: 'Resources', icon: <Database size={16} />, color: 'warning' },
          { label: 'Network Scan', icon: <Zap size={16} />, color: 'info' }
        ].map((action, i) => (
          <button 
            key={i} 
            onClick={() => handleAction(action.label)}
            className="flex-shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-card border-2 border-border hover:border-primary hover:bg-primary/5 transition-all group shadow-sm hover:shadow-lg active:scale-95"
          >
            <div className={`p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all`}>
              {action.icon}
            </div>
            <span className="text-[11px] font-black text-text-secondary uppercase tracking-[0.1em] group-hover:text-text-primary transition-colors">{action.label}</span>
          </button>
        ))}
      </div>

      {/* --- TOP 5 KPI GRID --- */}
      <div className="grid grid-cols-10 gap-6">
        {[
          { label: 'Gross Revenue', value: stats ? `₹${(stats.todayRevenue / 100000).toFixed(1)}L` : '₹0.0L', change: '+12.5%', trend: 'up', icon: <CreditCard size={20} />, color: 'primary', route: '/finance' },
          { label: 'Global Occupancy', value: stats ? `${stats.occupancyRate}%` : '0%', change: '+2.1%', trend: 'up', icon: <Globe size={20} />, color: 'accent', route: '/hostels' },
          { label: 'Active Tenants', value: stats ? stats.totalTenants.toLocaleString() : '0', change: '+5.4%', trend: 'up', icon: <Users size={20} />, color: 'success', route: '/tenants' },
          { label: 'Vacant Beds', value: stats ? stats.vacantBeds : '0', subtitle: 'Priority Node', icon: <Home size={20} />, color: 'warning', route: '/hostels' },
          { label: 'Pending Issues', value: stats ? stats.complaintsToday : '0', subtitle: '4.2h Resolution', trend: 'down', icon: <AlertTriangle size={20} />, color: 'danger', route: '/complaints' }
        ].map((kpi, i) => (
          <div 
            key={i} 
            onClick={() => kpi.route && navigate(kpi.route)}
            className={`col-span-10 md:col-span-2 p-6 rounded-3xl bg-card border-2 border-border shadow-xl hover:border-primary transition-all cursor-pointer overflow-hidden relative group hover:-translate-y-1 active:scale-95 ${loading ? 'animate-pulse' : ''}`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-125 transition-all duration-500">
              {React.cloneElement(kpi.icon, { size: 100 })}
            </div>
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-primary text-white shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform`}>
                {kpi.icon}
              </div>
              {kpi.change && (
                <span className="text-[10px] font-black text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-full">{kpi.change}</span>
              )}
            </div>
            
            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{kpi.label}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black tracking-tighter text-text-primary group-hover:text-primary transition-colors">
                  {loading ? '...' : kpi.value}
                </span>
              </div>
              {kpi.subtitle && (
                <div className="flex items-center gap-1.5 mt-2">
                  <Info size={10} className="text-primary" />
                  <p className="text-[10px] text-text-muted font-bold tracking-tight uppercase">{kpi.subtitle}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* --- MIDDLE ANALYTICS SECTION --- */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Financial Performance (6 cols) */}
        <div className="col-span-12 lg:col-span-6 p-8 rounded-3xl bg-card border-2 border-border shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <div>
              <h2 className="text-xl font-black tracking-tight flex items-center gap-3 uppercase">
                <TrendingUp size={22} className="text-primary" /> Financial Performance
              </h2>
              <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Real-time Revenue Analysis</p>
            </div>
            <div className="flex items-center gap-3">
               <select 
                value={activeTimeframe}
                onChange={(e) => setActiveTimeframe(e.target.value)}
                className="bg-background border-2 border-border text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none cursor-pointer hover:border-primary transition-all shadow-sm"
               >
                <option>Q3 2024</option>
                <option>Annual View</option>
               </select>
            </div>
          </div>
          
          <div className="mb-10 grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-background border-2 border-border/60 hover:border-primary/30 transition-all group">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Aggregate Revenue</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-text-primary tracking-tighter group-hover:text-primary transition-colors">₹42.5L</span>
                <span className="text-[11px] font-black text-success bg-success/10 border border-success/20 px-2 py-0.5 rounded-lg">+12.5%</span>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-background border-2 border-border/60 hover:border-primary/30 transition-all group">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Growth Vector</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-text-primary tracking-tighter group-hover:text-primary transition-colors">Optimal</span>
                <span className="text-[11px] font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-lg">Active</span>
              </div>
            </div>
          </div>

          <div className="flex-1 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(var(--primary))" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="rgb(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="rgba(var(--border), 0.5)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgb(var(--text-muted))', fontSize: 11, fontWeight: 'bold'}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgb(var(--text-muted))', fontSize: 11, fontWeight: 'bold'}} tickFormatter={(val) => `${val}L`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgb(var(--card))', border: '2px solid rgb(var(--border))', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: '900', textTransform: 'uppercase' }}
                  cursor={{ stroke: 'rgb(var(--primary))', strokeWidth: 2, strokeDasharray: '5 5' }}
                />
                <Area type="monotone" dataKey="actual" stroke="rgb(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="projected" stroke="rgb(var(--text-muted))" strokeWidth={2} strokeDasharray="8 8" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-8 border-t border-border pt-6">
             <div className="flex items-center gap-3">
               <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/40"></div>
               <span className="text-[11px] font-black text-text-secondary uppercase tracking-widest">Actual Revenue</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-3 h-3 rounded-full border-2 border-text-muted border-dashed"></div>
               <span className="text-[11px] font-black text-text-secondary uppercase tracking-widest">Projected Vector</span>
             </div>
          </div>
        </div>

        {/* Regional Intelligence (3 cols) */}
        <div className="col-span-12 lg:col-span-3 p-8 rounded-3xl bg-card border-2 border-border shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3 uppercase">
               <MapPin size={22} className="text-primary" /> Region Grid
            </h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-10">
             <div className="w-full h-48 relative bg-primary/5 rounded-3xl overflow-hidden border-2 border-primary/10 flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <svg viewBox="0 0 200 240" className="w-3/4 h-3/4 text-primary/20 fill-current animate-pulse">
                   <path d="M70,20 L80,30 L100,25 L120,40 L130,70 L140,90 L135,110 L145,130 L130,160 L120,180 L110,210 L90,230 L70,220 L50,230 L30,200 L20,170 L25,140 L15,110 L25,80 L40,50 Z" />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="w-4 h-4 bg-primary rounded-full animate-ping opacity-75"></div>
                   <div className="w-3 h-3 bg-primary rounded-full relative z-10 shadow-lg shadow-primary/50"></div>
                </div>
             </div>
             
             <div className="space-y-6">
                {[
                  { name: 'Bangalore', val: 92, color: 'rgb(var(--primary))' },
                  { name: 'Pune', val: 85, color: 'rgb(var(--accent))' },
                  { name: 'Hyderabad', val: 78, color: 'rgb(var(--info))' },
                  { name: 'Mumbai', val: 74, color: 'rgb(var(--success))' }
                ].map((city, i) => (
                  <div key={i} className="space-y-2 group">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[11px] font-black text-text-secondary uppercase tracking-[0.15em] group-hover:text-primary transition-colors">{city.name}</span>
                      <span className="text-[12px] font-black text-text-primary">{city.val}%</span>
                    </div>
                    <div className="h-3 bg-background border-2 border-border rounded-full overflow-hidden shadow-inner p-0.5">
                      <div className="h-full rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${city.val}%`, backgroundColor: city.color }}></div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Strategic Intelligence / AI (3 cols) - UPDATED TO POP */}
        <div className="col-span-12 lg:col-span-3 p-8 rounded-3xl bg-gradient-to-br from-primary to-accent shadow-2xl shadow-primary/30 flex flex-col text-white relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3 uppercase">
              <Brain size={22} className="text-white" /> AI Insights
            </h2>
            <Sparkles size={18} className="animate-glow" />
          </div>
          
          <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-1 relative z-10">
             {AI_INSIGHTS.map((insight) => (
               <div key={insight.id} className="relative p-6 rounded-3xl bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:bg-white/20 transition-all shadow-xl group/card">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                       <Cpu size={14} className="text-white/80" />
                       <span className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">{insight.type}</span>
                    </div>
                    <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-lg">{insight.confidence}% ACC.</span>
                  </div>
                  <h4 className="text-base font-black leading-tight mb-3 tracking-tight group-hover/card:translate-x-1 transition-transform">{insight.title}</h4>
                  <p className="text-[12px] text-white/80 leading-relaxed mb-6 font-medium line-clamp-3">{insight.desc}</p>
                  <button 
                    onClick={() => handleAction(insight.action)}
                    className="w-full py-4 bg-white text-primary font-black uppercase tracking-widest rounded-2xl hover:bg-primary-dark hover:text-white transition-all shadow-2xl shadow-black/20 text-[10px]"
                  >
                    Execute Protocol
                  </button>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* --- BOTTOM OPERATIONS SECTION --- */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Automation Pulse (4 cols) */}
        <div className="col-span-12 lg:col-span-4 p-8 rounded-3xl bg-card border-2 border-border shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3 uppercase">
              <Zap size={22} className="text-primary" /> Automation Pulse
            </h2>
            <button onClick={() => navigate('/automation')} className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Full Log</button>
          </div>
          <div className="space-y-8">
            {AUTOMATION_LOGS.map((log) => (
              <div key={log.id} className="flex items-start gap-5 relative group cursor-pointer" onClick={() => handleAction(`Log #${log.id} Details`)}>
                <div className="absolute left-[17px] top-10 bottom-[-32px] w-0.5 bg-border/80 last:hidden"></div>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 border-border z-10 shadow-lg transition-all group-hover:scale-125 group-hover:rotate-12 ${
                  log.result === 'Success' ? 'bg-success text-white' : 'bg-warning text-white'
                }`}>
                   <Zap size={14} fill="currentColor" />
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start">
                     <p className="text-sm font-black text-text-primary leading-none group-hover:text-primary transition-colors tracking-tight uppercase">{log.trigger}</p>
                     <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase tracking-widest ${log.result === 'Success' ? 'text-success bg-success/10 border border-success/20' : 'text-warning bg-warning/10 border border-warning/20'}`}>{log.result}</span>
                   </div>
                   <p className="text-[11px] text-text-secondary mt-2.5 font-bold flex items-center gap-2">
                      <ArrowRight size={12} className="text-primary" /> {log.action}
                   </p>
                   <p className="text-[10px] text-text-muted font-black mt-2 inline-block opacity-70 italic uppercase tracking-wider">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Activity (4 cols) - POPPED */}
        <div className="col-span-12 lg:col-span-4 p-8 rounded-3xl bg-card border-2 border-border shadow-2xl">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3 uppercase">
              <Activity size={22} className="text-primary" /> Event Stream
            </h2>
          </div>
          <div className="space-y-4">
             {ACTIVITY_FEED.map((item) => (
                <div key={item.id} className="flex items-center gap-5 p-5 rounded-3xl bg-background border-2 border-border hover:border-primary transition-all cursor-pointer group hover:bg-primary/5 hover:translate-x-1">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                     item.type === 'success' ? 'bg-success text-white' : 
                     item.type === 'warning' ? 'bg-warning text-white' : 
                     'bg-primary text-white'
                   }`}>
                      {item.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                   </div>
                   <div className="flex-1">
                     <p className="text-sm font-black text-text-primary leading-snug group-hover:text-primary transition-colors tracking-tight uppercase">{item.text}</p>
                     <span className="text-[10px] text-text-muted font-black uppercase tracking-[0.2em] mt-1.5 inline-block opacity-60 italic">{item.time}</span>
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Infrastructure / Neural Pulse (4 cols) */}
        <div className="col-span-12 lg:col-span-4 p-8 rounded-3xl bg-slate-900 shadow-2xl border-2 border-slate-800 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <Cpu size={140} className="text-success animate-glow" />
          </div>
          
          <div className="flex items-center justify-between mb-10 relative z-10">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-3 uppercase">
              <ShieldCheck size={22} className="text-success" /> Infrastructure
            </h2>
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-success/10 border border-success/30">
               <div className="w-2.5 h-2.5 bg-success rounded-full animate-glow shadow-[0_0_12px_rgb(var(--success))]"></div>
               <span className="text-[10px] font-black text-success uppercase tracking-[0.2em]">Live Status</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
            {[
              { label: 'Core DB', val: '99.99%', status: 'Active' },
              { label: 'Edge Nodes', val: '14 Live', status: 'Optimal' },
              { label: 'Cache Link', val: '100%', status: 'Synced' },
              { label: 'Encryption', val: 'AES-256', status: 'Secure' }
            ].map((node, i) => (
              <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary transition-all group">
                <p className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-2">{node.label}</p>
                <p className="text-xl font-black tracking-tight text-white group-hover:text-primary transition-colors">{node.val}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                  <p className="text-[9px] font-black text-success uppercase tracking-wider">{node.status}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6 relative z-10">
             <div className="flex items-center justify-between text-[11px] font-black text-white/50 uppercase tracking-[0.2em]">
                <span>Neural Pulse Activity</span>
                <span className="text-success">88% Capacity</span>
             </div>
             <div className="h-24 w-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative group p-1">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer"></div>
                <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={SYSTEM_PERFORMANCE}>
                      <Area type="monotone" dataKey="val" stroke="rgb(var(--primary))" strokeWidth={3} fill="rgb(var(--primary))" fillOpacity={0.2} />
                   </AreaChart>
                </ResponsiveContainer>
             </div>
             <div className="flex justify-between items-center pt-6 border-t border-white/10">
                <div className="flex items-center gap-6">
                   <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Uptime</p>
                      <p className="text-base font-black">99.999%</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Latency</p>
                      <p className="text-base font-black">12ms</p>
                   </div>
                </div>
                <button onClick={() => handleAction('System Protocol')} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-danger hover:text-white transition-all shadow-xl">
                   <Power size={20} />
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* --- RECENT TRANSACTIONS TABLE - HIGH CONTRAST --- */}
      <div className="rounded-3xl bg-card border-2 border-border shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-border flex justify-between items-center bg-card">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-primary/10 rounded-2xl text-primary">
               <CreditCard size={24} />
             </div>
             <div>
               <h2 className="text-xl font-black tracking-tighter uppercase italic flex items-center gap-3">
                 Ledger Stream
               </h2>
               <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">Global Transaction Manifest</p>
             </div>
          </div>
          <button onClick={() => navigate('/finance')} className="px-6 py-3 bg-background border-2 border-border text-[11px] font-black text-primary uppercase tracking-[0.2em] rounded-2xl hover:border-primary transition-all shadow-sm">Enter Finance Hub</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-background border-b-2 border-border">
                <th className="py-6 px-8 text-[11px] font-black text-text-primary uppercase tracking-[0.2em]">Protocol Hash</th>
                <th className="py-6 px-8 text-[11px] font-black text-text-primary uppercase tracking-[0.2em]">Resident Identity</th>
                <th className="py-6 px-8 text-[11px] font-black text-text-primary uppercase tracking-[0.2em]">Node Allocation</th>
                <th className="py-6 px-8 text-[11px] font-black text-text-primary uppercase tracking-[0.2em]">Credit Impact</th>
                <th className="py-6 px-8 text-[11px] font-black text-text-primary uppercase tracking-[0.2em]">Status Vector</th>
                <th className="py-6 px-8 text-[11px] font-black text-text-primary uppercase tracking-[0.2em]">Timestamp</th>
                <th className="py-6 px-8 text-[11px] font-black text-text-primary uppercase tracking-[0.2em] text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-border/30">
              {RECENT_BOOKINGS.map((booking, i) => (
                <tr key={i} className="group hover:bg-primary/[0.02] transition-all cursor-pointer">
                  <td className="py-6 px-8 text-[12px] font-black text-text-muted tracking-widest font-mono">{booking.id}</td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-black text-xs shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">{booking.name.charAt(0)}</div>
                      <div>
                        <span className="text-[13px] font-black text-text-primary tracking-tight uppercase">{booking.name}</span>
                        <p className="text-[10px] text-text-muted font-bold mt-1 tracking-widest uppercase">Verified Entity</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-[12px] font-black text-text-secondary uppercase">{booking.property}</td>
                  <td className="py-6 px-8 text-[14px] font-black text-primary font-mono">{booking.amount}</td>
                  <td className="py-6 px-8">
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black border-2 uppercase tracking-widest ${
                      booking.status === 'CONFIRMED' ? 'bg-success/10 text-success border-success/30 shadow-lg shadow-success/5' : 'bg-warning/10 text-warning border-warning/30 shadow-lg shadow-warning/5'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${booking.status === 'CONFIRMED' ? 'bg-success animate-pulse' : 'bg-warning'}`}></span>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-[11px] font-black text-text-muted uppercase tracking-widest font-mono">{booking.date}</td>
                  <td className="py-6 px-8 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-end gap-3">
                       <button onClick={() => handleAction(`View ${booking.id}`)} className="p-2.5 rounded-2xl bg-background border-2 border-border text-text-muted hover:text-primary hover:border-primary transition-all shadow-md"><Eye size={18} /></button>
                       <button onClick={() => handleAction(`Protocol ${booking.id}`)} className="p-2.5 rounded-2xl bg-background border-2 border-border text-text-muted hover:text-primary hover:border-primary transition-all shadow-md"><Power size={18} /></button>
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

export default Dashboard;
