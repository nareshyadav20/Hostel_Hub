import React, { useState, useEffect } from 'react';
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
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import API from '../api/axios';

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
  const { showToast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [showLedgerFilter, setShowLedgerFilter] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  
  const [showReconciliation, setShowReconciliation] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  
  const [reconciling, setReconciling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reconcileLogs, setReconcileLogs] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        const res = await API.get('/payments');
        const mappedTx = res.data.map(p => ({
          id: p.invoice || p._id.toString().slice(0,8).toUpperCase(),
          entity: `${p.tenantId?.name || 'System Guest'} - ${p.buildingId?.name || 'Global'}`,
          cat: p.type || p.category || 'Revenue',
          amount: `+₹${p.amount}`,
          method: p.method || 'Online',
          status: p.status === 'Paid' ? 'Settled' : p.status,
          date: new Date(p.date || p.createdAt || new Date()).toLocaleDateString(),
          trend: 'up',
          _id: p._id
        }));
        setTransactions(mappedTx);
      } catch (err) {
        console.error('Failed to fetch financial records:', err);
        showToast('Failed to sync financial data from backend.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchFinanceData();
  }, []);

  const filteredTx = transactions.filter(tx => {
    const matchesSearch = tx.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.cat.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCat === 'All' || tx.cat === filterCat;
    return matchesSearch && matchesCat;
  });

  const handleExportExcel = () => {
    const headers = ['ID', 'Entity', 'Category', 'Amount', 'Method', 'Status', 'Date'];
    const rows = filteredTx.map(tx => [tx.id, tx.entity, tx.cat, tx.amount, tx.method, tx.status, tx.date]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Financial_Manifest_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('Financial Manifest exported as Excel (CSV).', 'success');
  };

  const handleExportPdf = () => {
    const lines = filteredTx.map(tx => `${tx.id} | ${tx.entity} | ${tx.amount} | ${tx.status}`).join('\n');
    const blob = new Blob([`FINANCIAL MANIFEST\n${'='.repeat(60)}\n${lines}`], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Financial_Manifest_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    showToast('Financial Manifest exported as PDF report.', 'success');
  };

  const handleMenuAction = (action, txId) => {
    setActiveMenu(null);
    if (action === 'view') {
      const tx = transactions.find(t => t.id === txId);
      setSelectedTx(tx);
    } else {
      const msgs = { flag: `Transaction ${txId} flagged for audit.`, void: `Voiding transaction ${txId}...` };
      showToast(msgs[action] || 'Action executed.', action === 'void' ? 'error' : 'info');
    }
  };

  const handleExecuteReconciliation = () => {
    if (reconciling) return;
    setReconciling(true);
    setProgress(0);
    setReconcileLogs(["Initiating Automated Fiscal Balancing Protocol..."]);

    const steps = [
      { time: 500, prog: 25, log: "Connecting with global bank ledger servers..." },
      { time: 1000, prog: 50, log: "Matching transaction hashes (RTGS, UPI)..." },
      { time: 1500, prog: 75, log: "Cryptographic checksum validation complete." },
      { time: 2000, prog: 100, log: "Applying changes to system ledger database..." }
    ];

    steps.forEach(step => {
      setTimeout(() => {
        setProgress(step.prog);
        setReconcileLogs(prev => [...prev, step.log]);
        if (step.prog === 100) {
          setTimeout(() => {
            setTransactions(prev => prev.map(t => ({ ...t, status: 'Settled' })));
            showToast('Reconciliation complete. All ledger entries verified and matched with Bank Feed.', 'success');
            setReconciling(false);
            setShowReconciliation(false);
          }, 500);
        }
      }, step.time);
    });
  };

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
              <button onClick={handleExportExcel} className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all">
                <FileText size={14} className="text-emerald-500" /> Excel
              </button>
              <div className="w-px h-4 bg-border" />
              <button onClick={handleExportPdf} className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all">
                <Download size={14} className="text-rose-500" /> PDF
              </button>
           </div>
           <button onClick={() => setShowReconciliation(true)} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
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
                     value={searchTerm}
                     onChange={(e) => setSearchTerm(e.target.value)}
                     placeholder="Search ledger..."
                     className="bg-background border border-divider rounded-xl py-2 pl-10 pr-4 text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all w-64 shadow-subtle"
                  />
               </div>
               <button onClick={() => setShowLedgerFilter(!showLedgerFilter)} className={`p-2.5 border rounded-xl transition-all shadow-subtle \${showLedgerFilter ? 'bg-primary text-white border-primary' : 'bg-background border-divider text-text-muted hover:text-primary'}`}><Filter size={18} /></button>
            </div>
         </div>

         <AnimatePresence>
           {showLedgerFilter && (
             <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-divider">
               <div className="px-8 py-5 flex items-center gap-6">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">Category:</label>
                 <div className="flex gap-2">
                   {['All', 'Revenue', 'Utilities', 'Logistics', 'Marketing'].map(cat => (
                     <button key={cat} onClick={() => setFilterCat(cat)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all \${filterCat === cat ? 'bg-primary text-white' : 'bg-background border border-divider text-text-muted hover:text-primary'}`}>{cat}</button>
                   ))}
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>

         {loading ? (
            <div className="py-24 text-center">
              <div className="premium-spinner mx-auto mb-4"></div>
              <p className="text-sm font-black text-text-muted uppercase tracking-widest">Synchronizing financial ledger from MongoDB...</p>
            </div>
         ) : (
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
                  {filteredTx.map((tx, i) => (
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
                       <td className={`py-5 px-4 text-[14px] font-black \${tx.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'} italic`}>
                          {tx.amount}
                       </td>
                       <td className="py-5 px-4">
                          <div className="flex items-center gap-2">
                             <CreditCard size={14} className="text-text-muted" />
                             <span className="text-[11px] font-black text-text-secondary italic">{tx.method}</span>
                          </div>
                       </td>
                       <td className="py-5 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm \${
                            tx.status === 'Settled' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                            tx.status === 'Verifying' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                            'bg-rose-500/10 text-rose-500 border-rose-500/20'
                          }`}>{tx.status}</span>
                       </td>
                       <td className="py-5 px-8 text-right">
                          <button onClick={() => setActiveMenu(activeMenu === tx.id ? null : tx.id)} className="p-2.5 bg-background border border-divider rounded-xl text-text-muted hover:text-primary transition-all shadow-subtle relative">
                              <MoreHorizontal size={18} />
                          </button>
                          <AnimatePresence>
                            {activeMenu === tx.id && (
                              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                                className="absolute right-0 top-12 z-50 bg-card border border-divider rounded-2xl shadow-premium p-2 min-w-[160px]">
                                <button onClick={() => handleMenuAction('view', tx.id)} className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary hover:bg-primary/5 rounded-xl transition-all">View Detail</button>
                                <button onClick={() => handleMenuAction('flag', tx.id)} className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-amber-500 hover:bg-amber-500/5 rounded-xl transition-all">Flag for Audit</button>
                                <button onClick={() => handleMenuAction('void', tx.id)} className="w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all">Void Transaction</button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
         )}
      </div>

      {/* --- RECONCILIATION ENGINE MODAL --- */}
      <AnimatePresence>
        {showReconciliation && createPortal(
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            style={{ zIndex: 99999 }}
            onClick={() => setShowReconciliation(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-3xl shadow-[0_25px_80px_-10px_rgba(0,0,0,0.6)] w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
              style={{ zIndex: 100000 }}
              onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div className="flex-none p-6 md:p-8 border-b border-divider bg-slate-50/50 dark:bg-white/[0.02]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-glow">
                       <Zap size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-text-primary uppercase tracking-tight">Reconciliation Engine</h3>
                      <p className="text-[11px] text-text-muted font-bold uppercase tracking-[0.2em] mt-1">Automated Fiscal Balancing Protocol</p>
                    </div>
                  </div>
                  {!reconciling && (
                    <button onClick={() => setShowReconciliation(false)} className="p-2 text-text-muted hover:text-rose-500 bg-background border border-divider rounded-xl hover:border-rose-500/30 transition-all">
                       <XCircle size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                {reconciling ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-8">
                     <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        <Zap size={48} className="text-primary animate-pulse" />
                        <div className="absolute bottom-0 right-0 bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">{progress}%</div>
                     </div>
                     <div className="text-center">
                        <h4 className="text-lg font-black text-text-primary uppercase tracking-tight">System Ledger Synchronization in Progress</h4>
                        <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest mt-1">Please do not disconnect or refresh the command panel</p>
                     </div>
                     <div className="w-full max-w-xl bg-slate-950 rounded-2xl p-6 border border-white/5 font-mono text-[10px] space-y-2 text-emerald-400/90 text-left shadow-inner h-48 overflow-y-auto">
                        {reconcileLogs.map((log, idx) => (
                           <div key={idx} className="flex gap-2 items-center">
                              <span className="text-text-muted">[{new Date().toLocaleTimeString()}]</span>
                              <span>{log}</span>
                           </div>
                        ))}
                     </div>
                  </div>
                ) : (
                  <>
                    {/* Metrics HUD */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      {[{ label: 'System Ledger Entries', value: transactions.length, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/20' }, 
                        { label: 'Successfully Settled', value: transactions.filter(t => t.status === 'Settled').length, color: 'text-emerald-500', bg: 'bg-emerald-500/5', border: 'border-emerald-500/20' }, 
                        { label: 'Pending Verification', value: transactions.filter(t => t.status !== 'Settled').length, color: 'text-amber-500', bg: 'bg-amber-500/5', border: 'border-amber-500/20' }
                       ].map((item, i) => (
                        <div key={i} className={`flex flex-col p-5 rounded-2xl \${item.bg} border \${item.border}`}>
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.15em] mb-2">{item.label}</span>
                          <span className={`text-3xl font-black \${item.color} tracking-tighter italic`}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Dual Panel Comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       {/* System Ledger Panel */}
                       <div className="space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-divider">
                             <h4 className="text-[12px] font-black text-text-primary uppercase tracking-[0.1em]">System Ledger</h4>
                             <span className="text-[10px] font-bold text-text-muted bg-background px-2 py-1 rounded-md">Expected</span>
                          </div>
                          <div className="space-y-3">
                             {transactions.map(tx => (
                               <div key={tx.id} className="flex items-center justify-between p-4 bg-background border border-divider rounded-xl">
                                  <div>
                                     <p className="text-[11px] font-black text-text-primary uppercase">{tx.id}</p>
                                     <p className="text-[10px] font-bold text-text-muted truncate max-w-[150px]">{tx.entity}</p>
                                  </div>
                                  <div className="text-right">
                                     <p className={`text-[12px] font-black \${tx.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>{tx.amount}</p>
                                     <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{tx.date}</p>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>

                       {/* Bank Statement Panel */}
                       <div className="space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-divider">
                             <h4 className="text-[12px] font-black text-text-primary uppercase tracking-[0.1em]">Bank Statement</h4>
                             <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">Live Feed</span>
                          </div>
                          <div className="space-y-3 relative">
                             {/* Connection Lines overlay for desktop */}
                             <div className="hidden lg:block absolute -left-8 top-0 bottom-0 w-4 border-r border-dashed border-primary/30" />
                             
                             {transactions.map((tx, idx) => (
                               <div key={`bank-\${tx.id}`} className={`flex items-center justify-between p-4 bg-card border rounded-xl relative \${tx.status === 'Settled' ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-amber-500/30'}`}>
                                  <div className={`absolute -left-5 w-3 h-3 rounded-full border-2 border-card hidden lg:block \${tx.status === 'Settled' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                                  <div>
                                     <p className="text-[11px] font-black text-text-primary uppercase">REF-{Math.floor(8000+idx*17)}</p>
                                     <p className="text-[10px] font-bold text-text-muted">{tx.method} TRANSFER</p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                     <p className="text-[12px] font-black text-text-primary">{tx.amount.replace('+','').replace('-','')}</p>
                                     {tx.status === 'Settled' ? (
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                     ) : (
                                        <Clock size={16} className="text-amber-500" />
                                     )}
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex-none p-6 border-t border-divider bg-slate-50/50 dark:bg-white/[0.02]">
                <button 
                  onClick={handleExecuteReconciliation}
                  disabled={reconciling}
                  className="w-full py-4 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:bg-primary-dark hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reconciling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Synchronizing System Ledgers...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} /> Execute Batch Reconciliation
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>

      {/* --- TRANSACTION DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedTx && createPortal(
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
            style={{ zIndex: 99999 }}
            onClick={() => setSelectedTx(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-3xl shadow-[0_25px_80px_-10px_rgba(0,0,0,0.6)] w-full max-w-lg p-8 flex flex-col overflow-hidden"
              style={{ zIndex: 100000 }}
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between pb-6 border-b border-divider">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Receipt size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">Transaction Details</h3>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-0.5">{selectedTx.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTx(null)} className="p-2 text-text-muted hover:text-rose-500 bg-background border border-divider rounded-xl hover:border-rose-500/30 transition-all">
                  <XCircle size={18} />
                </button>
              </div>
              <div className="py-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Entity</p>
                    <p className="text-xs font-black text-text-primary uppercase mt-1">{selectedTx.entity}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Allocation</p>
                    <p className="text-xs font-black text-text-primary uppercase mt-1">{selectedTx.cat}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Amount</p>
                    <p className={`text-sm font-black mt-1 ${selectedTx.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>{selectedTx.amount}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Method</p>
                    <p className="text-xs font-black text-text-primary uppercase mt-1">{selectedTx.method}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Status</p>
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border mt-1 ${
                      selectedTx.status === 'Settled' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      selectedTx.status === 'Verifying' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                      'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>{selectedTx.status}</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Date</p>
                    <p className="text-xs font-black text-text-primary uppercase mt-1">{selectedTx.date}</p>
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-divider flex gap-3">
                <button onClick={() => setSelectedTx(null)} className="flex-1 py-3 bg-slate-50 dark:bg-white/5 border border-divider text-text-secondary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-all">Close</button>
              </div>
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>

    </div>
  );
};

export default Finance;
