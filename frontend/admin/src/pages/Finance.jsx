import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { 
  CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Download, Filter, Receipt, Wallet, Banknote, 
  Search, MoreHorizontal, CheckCircle2, XCircle, Clock,
  FileText, ExternalLink, Zap, DollarSign, Calendar, Users,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const REVENUE_TREND = [
  { month: 'Jan', revenue: 450000, dues: 20000 },
  { month: 'Feb', revenue: 520000, dues: 15000 },
  { month: 'Mar', revenue: 480000, dues: 45000 },
  { month: 'Apr', revenue: 610000, dues: 30000 },
  { month: 'May', revenue: 590000, dues: 25000 },
  { month: 'Jun', revenue: 820000, dues: 10000 },
];

const PROPERTY_REVENUE = [
  { name: 'Sapphire PG', value: 45, color: '#6366f1' },
  { name: 'Elite Living', value: 30, color: '#10b981' },
  { name: 'Royal Nest', value: 25, color: '#f59e0b' },
];

const TOP_TENANTS = [
  { name: 'Arjun Das', property: 'Sapphire PG', revenue: '₹85,000', period: '6 Months' },
  { name: 'Neha Verma', property: 'Elite Living', revenue: '₹72,000', period: '5 Months' },
  { name: 'Vikram Singh', property: 'Tech Park', revenue: '₹68,000', period: '6 Months' },
];

const Finance = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const stats = [
    { label: 'Total Revenue', value: '₹42.5L', change: '+12.4%', trendUp: true, icon: <Banknote />, color: 'primary' },
    { label: 'Outstanding', value: '₹1.85L', change: '-4.2%', trendUp: false, icon: <Clock />, color: 'danger' },
    { label: 'Monthly Yield', value: '94.2%', change: '+2.1%', trendUp: true, icon: <TrendingUp />, color: 'success' },
    { label: 'Property Dues', value: '03 Units', change: 'Stable', trendUp: true, icon: <Calendar />, color: 'warning' },
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
      
      {/* --- ELITE HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Financial Manifest</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Global fiscal command center for revenue optimization and yield tracking</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-2 bg-card border border-divider rounded-xl px-2 py-1 shadow-subtle">
              <button className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all">
                <FileText size={14} className="text-emerald-500" /> Excel
              </button>
              <div className="w-px h-4 bg-border" />
              <button className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all">
                <Download size={14} className="text-rose-500" /> PDF
              </button>
           </div>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
             <Zap size={16} strokeWidth={3} /> Reconciliation
           </button>
        </div>
      </div>

      {/* --- KPI HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="card-classic p-6 group hover:shadow-glow transition-all duration-500 relative overflow-hidden">
             <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-${stat.color}/5 rounded-full blur-2xl group-hover:bg-${stat.color}/10 transition-all`} />
             <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center border border-${stat.color}/10`}>
                   {React.cloneElement(stat.icon, { size: 20, strokeWidth: 2.5 })}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black ${stat.trendUp ? 'text-emerald-500' : 'text-rose-500'} italic`}>
                   {stat.trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                   {stat.change}
                </div>
             </div>
             <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{stat.label}</p>
             <h3 className="text-3xl font-black text-text-primary tracking-tight mt-1 italic">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* --- ANALYTICS LAYER --- */}
      <div className="grid grid-cols-12 gap-8">
         {/* Revenue Trends */}
         <div className="col-span-12 lg:col-span-8 card-classic p-8">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">Revenue Trajectory</h3>
                  <p className="text-[11px] font-medium text-text-muted italic">Monthly growth compared with outstanding dues manifest</p>
               </div>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-glow" />
                     <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Gross Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                     <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Unpaid Dues</span>
                  </div>
               </div>
            </div>
            <div className="h-[350px] min-h-[350px]">
               <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                  <AreaChart data={REVENUE_TREND}>
                     <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#1e40af" stopOpacity={0.15}/>
                           <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: '900' }} tickFormatter={(v) => `₹${v/1000}k`} />
                     <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }} />
                     <Area type="monotone" dataKey="revenue" stroke="#1e40af" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                     <Area type="monotone" dataKey="dues" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Efficiency & Mix */}
         <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
            <div className="card-classic p-8 flex-1">
               <h3 className="text-[13px] font-black text-text-primary uppercase tracking-widest mb-8">Collection Efficiency</h3>
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Gross Collection</span>
                        <span className="text-[12px] font-black text-emerald-500 italic">98.2%</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '98.2%' }} transition={{ duration: 1 }} className="h-full bg-emerald-500 rounded-full shadow-glow" />
                     </div>
                  </div>
                  <div>
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">On-Time Accuracy</span>
                        <span className="text-[12px] font-black text-primary italic">85.4%</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '85.4%' }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-primary rounded-full" />
                     </div>
                  </div>
               </div>
               <div className="mt-8 pt-8 border-t border-divider/50 flex items-center justify-between">
                  <div className="text-center">
                     <p className="text-[9px] font-black text-text-muted uppercase mb-1">Avg Collection</p>
                     <p className="text-lg font-black text-text-primary italic">2.4 Days</p>
                  </div>
                  <div className="h-10 w-px bg-border" />
                  <div className="text-center">
                     <p className="text-[9px] font-black text-text-muted uppercase mb-1">Defaulters</p>
                     <p className="text-lg font-black text-rose-500 italic">05 Units</p>
                  </div>
               </div>
            </div>

            <div className="card-classic p-8 flex-1">
               <h3 className="text-[13px] font-black text-text-primary uppercase tracking-widest mb-6">Top Performers</h3>
               <div className="space-y-4">
                  {TOP_TENANTS.map((t, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-divider/50 hover:border-primary/20 transition-all cursor-pointer">
                       <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black text-xs">{t.name[0]}</div>
                       <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-black text-text-primary uppercase tracking-tight truncate">{t.name}</p>
                          <p className="text-[9px] font-medium text-text-muted uppercase italic">{t.property}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[11px] font-black text-text-primary">{t.revenue}</p>
                          <p className="text-[9px] font-bold text-emerald-500 italic">{t.period}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* --- TRANSACTION LEDGER --- */}
      <div className="card-classic overflow-hidden shadow-premium bg-white/50 dark:bg-card/50">
         <div className="p-8 border-b border-divider/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">Global Transaction Ledger</h3>
               <p className="text-[11px] font-medium text-text-muted italic">Historical pulse of all inward and outward capital movements</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-all" size={16} />
                  <input 
                     type="text" 
                     placeholder="Search ledger..."
                     className="bg-background border border-divider rounded-xl py-2 pl-10 pr-4 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all w-64 shadow-subtle"
                  />
               </div>
               <button className="p-2.5 bg-background border border-divider rounded-xl text-text-muted hover:text-primary transition-all shadow-subtle"><Filter size={18} /></button>
            </div>
         </div>

         <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse whitespace-nowrap">
               <thead>
                  <tr className="bg-slate-50/80 dark:bg-white/2 border-b border-divider">
                     <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Transaction ID</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Entity Manifest</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Allocation</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Financial Pulse</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Protocol</th>
                     <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-center">Authorization</th>
                     <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Context</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border/30">
                  {[
                    { id: 'TX-9021', entity: 'Sapphire PG - Electricity', cat: 'Utilities', amount: '-₹42,000', method: 'RTGS', status: 'Verifying', date: '12 May', trend: 'down' },
                    { id: 'TX-9022', entity: 'Arjun Das - Rent Pulse', cat: 'Revenue', amount: '+₹12,000', method: 'UPI Instant', status: 'Settled', date: '12 May', trend: 'up' },
                    { id: 'TX-9023', entity: 'Zomato Mess Logistics', cat: 'Logistics', amount: '-₹18,500', method: 'Settlement', status: 'Pending', date: '11 May', trend: 'down' },
                    { id: 'TX-9024', entity: 'Elite Living - Ad Cluster', cat: 'Marketing', amount: '-₹8,000', method: 'Corporate Card', status: 'Settled', date: '11 May', trend: 'down' },
                  ]
                    .filter(tx => {
                      return tx.entity.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             tx.cat.toLowerCase().includes(searchTerm.toLowerCase());
                    })
                    .map((tx, i) => (
                    <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all cursor-pointer">
                       <td className="py-5 px-8">
                          <span className="text-[11px] font-black text-text-muted font-mono tracking-tighter uppercase">{tx.id}</span>
                       </td>
                       <td className="py-5 px-4">
                          <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">{tx.entity}</p>
                          <p className="text-[10px] font-bold text-text-muted italic">{tx.date}</p>
                       </td>
                       <td className="py-5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-background border border-divider text-[9px] font-black uppercase tracking-widest text-text-muted italic">{tx.cat}</span>
                       </td>
                       <td className={`py-5 px-4 text-[14px] font-black ${tx.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'} italic`}>
                          {tx.amount}
                       </td>
                       <td className="py-5 px-4">
                          <div className="flex items-center gap-2">
                             <CreditCard size={14} className="text-text-muted" />
                             <span className="text-[11px] font-black text-text-secondary italic">{tx.method}</span>
                          </div>
                       </td>
                       <td className="py-5 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                            tx.status === 'Settled' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                            tx.status === 'Verifying' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                            'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          }`}>{tx.status}</span>
                       </td>
                       <td className="py-5 px-8 text-right">
                          <button className="p-2.5 bg-background border border-divider rounded-xl text-text-muted hover:text-primary transition-all shadow-subtle group-hover:scale-110">
                             <MoreHorizontal size={18} />
                          </button>
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

export default Finance;
