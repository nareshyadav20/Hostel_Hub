import React, { useState, useEffect, useCallback } from 'react';
import { 
  IndianRupee, TrendingUp, CreditCard, Download, ExternalLink, 
  Calendar, Search, Filter, ArrowLeft, Loader2, CheckCircle2, 
  AlertCircle, ArrowUpRight, History, Receipt, Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';

const Payments = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRevenue: 0, pendingAmount: 0 });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = { 
        page, 
        limit: 15,
        status: filterStatus !== 'All' ? filterStatus : undefined,
        type: filterType !== 'All' ? filterType : undefined,
        search: searchTerm || undefined
      };

      const res = await axios.get(`${API}/payments`, { params });
      setPayments(res.data.payments || []);
      setTotalPages(res.data.totalPages || 1);
      setStats({
        totalRevenue: res.data.totalRevenue,
        pendingAmount: res.data.pendingAmount
      });
    } catch (err) {
      console.error('Financial fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterType, searchTerm]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const kpiData = [
    { label: 'Total Revenue', value: `₹${(stats.totalRevenue / 100000).toFixed(2)}L`, icon: <IndianRupee />, color: 'success', sub: 'Settled & Verified' },
    { label: 'Pending Dues', value: `₹${(stats.pendingAmount / 1000).toFixed(1)}K`, icon: <Wallet />, color: 'warning', sub: 'Awaiting Settlement' },
    { label: 'Active Txns', value: payments.length, icon: <TrendingUp />, color: 'primary', sub: 'Current manifest' },
  ];

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (['SUCCESS', 'PAID'].includes(s)) return 'bg-success/10 text-success border-success/20';
    if (['PENDING', 'DUE'].includes(s)) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-danger/10 text-danger border-danger/20';
  };

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
          <h1 className="text-3xl text-premium-header">Financial Ledger</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Global transaction monitoring • <span className="text-primary font-black">Live Pulse</span></p>
        </div>
        <button className="btn-premium flex items-center gap-2">
          <Download size={16} strokeWidth={3} /> Export Reconciliation
        </button>
      </div>

      {/* --- KPI HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiData.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-classic p-6 flex items-center gap-5 relative overflow-hidden group"
          >
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} flex items-center justify-center border border-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-premium-label mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-text-primary tracking-tighter italic">{stat.value}</h3>
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest italic">{stat.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- CONTROL BAR --- */}
      <div className="sticky top-0 z-40 py-4 bg-background/80 backdrop-blur-xl border-b border-border/50 -mx-4 px-4 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative flex items-center group">
          <Search className="absolute left-4 text-text-muted group-focus-within:text-primary transition-all duration-300" size={18} />
          <input
            type="text"
            className="w-full bg-card border border-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary"
            placeholder="Search by Transaction ID or Tenant Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <div className="flex bg-card p-1.5 rounded-2xl border border-border shrink-0">
            {['All', 'Paid', 'Pending', 'Due'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'}`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="h-10 w-px bg-border shrink-0" />
          <button className="flex items-center gap-2 px-6 py-3.5 bg-card border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-all shadow-subtle shrink-0">
            <Filter size={14} strokeWidth={3} /> More Filters
          </button>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="card-classic overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-white/2 border-b border-border">
                <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Transaction / ID</th>
                <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Resident / Entity</th>
                <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Amount</th>
                <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Category</th>
                <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Method</th>
                <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr><td colSpan={7} className="py-20 text-center">
                  <div className="flex items-center justify-center gap-3 text-text-muted">
                    <Loader2 size={24} className="animate-spin text-primary" />
                    <span className="text-sm font-bold tracking-tight">Syncing Ledger...</span>
                  </div>
                </td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={7} className="py-20 text-center text-text-muted">
                  <Receipt size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold uppercase tracking-widest text-xs">No transactions in current manifest</p>
                </td></tr>
              ) : payments.map((p) => (
                <tr key={p._id} className="group hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all">
                  <td className="py-5 px-8">
                    <div>
                      <p className="text-[12px] font-black text-primary font-mono tracking-tighter uppercase italic">{p.transactionId || p._id.substring(18).toUpperCase()}</p>
                      <p className="text-[10px] font-bold text-text-muted mt-0.5">{new Date(p.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-black text-text-secondary">
                        {(p.tenantId?.name || 'U').split(' ').map(n => n[0]).join('').substring(0,2)}
                      </div>
                      <div>
                        <p className="text-[13px] font-black text-text-primary italic">{p.tenantId?.name || 'Unknown'}</p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">{p.buildingId?.name || 'Generic Node'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-[14px] font-black text-text-primary italic tracking-tight">₹{p.amount?.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="py-5 px-4">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">{p.type || 'Rent'}</span>
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-text-secondary italic">
                      <CreditCard size={14} className="text-text-muted" />
                      {p.method || 'UPI'}
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(p.status)}`}>
                      {p.status || 'Success'}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-text-muted hover:text-primary transition-all"><Download size={16} /></button>
                      <button className="p-2 text-text-muted hover:text-indigo-500 transition-all"><ExternalLink size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-6 card-classic bg-slate-50/50">
          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl disabled:opacity-40">Previous</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
