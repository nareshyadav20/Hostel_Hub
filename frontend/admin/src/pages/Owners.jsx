import React, { useState, useEffect } from 'react';
import {
  UserPlus, Mail, Phone, Home, ShieldCheck, MoreHorizontal, Search,
  Filter, TrendingUp, Building, ArrowUpRight, ArrowLeft, Eye,
  CheckCircle2, AlertCircle, Users, Briefcase, RefreshCw, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import API from '../api/axios';

const Owners = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('All');
  const [owners, setOwners] = useState([]);
  const [stats, setStats] = useState({ totalOwners: 0, totalBuildings: 0, enterpriseOwners: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState(null);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const [ownersRes, statsRes] = await Promise.all([
        API.get('/admin/owners'),
        API.get('/admin/stats'),
      ]);
      setOwners(ownersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching owners:', err);
      showToast('Failed to fetch owner directory from backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);


  const handleExport = () => {
    if (!owners.length) { showToast('No data to export.', 'error'); return; }
    const headers = ['Name', 'Email', 'Phone', 'Plan', 'Buildings', 'Business', 'Joined'];
    const rows = owners.map(o => [
      o.name, o.email, o.phone, o.plan, o.buildingCount,
      o.businessName || 'N/A',
      o.joinedAt ? new Date(o.joinedAt).toLocaleDateString('en-IN') : 'N/A'
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Owner_Directory_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Owner directory exported successfully!', 'success');
  };

  const filteredOwners = owners.filter(o => {
    const matchSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.businessName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchPlan = filterPlan === 'All' || o.plan === filterPlan;
    return matchSearch && matchPlan;
  });

  const kpiCards = [
    {
      label: 'Total Partners',
      value: stats.totalOwners,
      sub: 'Registered Owners',
      badge: 'Live',
      badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
      icon: Users,
      gradient: 'from-emerald-500/20 to-emerald-600/5',
      iconBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      accent: '#10b981',
    },
    {
      label: 'Enterprise Tier',
      value: stats.enterpriseOwners,
      sub: '5+ Properties',
      badge: 'Premium',
      badgeColor: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
      icon: ShieldCheck,
      gradient: 'from-violet-500/20 to-violet-600/5',
      iconBg: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
      accent: '#8b5cf6',
    },
    {
      label: 'Total Assets',
      value: stats.totalBuildings,
      sub: 'Properties Listed',
      badge: 'Active',
      badgeColor: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
      icon: Building,
      gradient: 'from-sky-500/20 to-sky-600/5',
      iconBg: 'bg-sky-500/10 text-sky-500 border-sky-500/20',
      accent: '#0ea5e9',
    },
    {
      label: 'Active Owners',
      value: owners.filter(o => o.status === 'Active').length,
      sub: 'Currently Online',
      badge: 'Online',
      badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
      icon: TrendingUp,
      gradient: 'from-amber-500/20 to-amber-600/5',
      iconBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      accent: '#f59e0b',
    },
  ];

  const planBadge = (plan) => {
    const map = {
      Enterprise: 'bg-primary/10 text-primary border-primary/20',
      Standard: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
      Basic: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    };
    return map[plan] || map.Basic;
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in">

      {/* --- BACK NAVIGATION --- */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main tracking-tight">Hostel Owners Directory</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">
            Live feed from <span className="text-primary font-black">owner_users</span> ·{' '}
            <span className="text-primary font-black">owner_buildings</span> ·{' '}
            <span className="text-primary font-black">ownerprofiles</span> collections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchOwners}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-divider rounded-xl text-[10px] font-black uppercase tracking-widest text-text-muted hover:border-primary hover:text-primary transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* --- KPI STATS --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((card, i) => {
          const Icon = card.icon;
          const pct = card.label === 'Enterprise Tier'
            ? Math.round(((card.value || 0) / Math.max(stats.totalOwners, 1)) * 100)
            : card.label === 'Active Owners'
              ? Math.round(((card.value || 0) / Math.max(stats.totalOwners, 1)) * 100)
              : 100;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative bg-surface border border-divider rounded-2xl p-5 overflow-hidden group hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Gradient blob */}
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-100 pointer-events-none rounded-2xl`} />

              {/* Top row */}
              <div className="relative flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${card.iconBg} shrink-0`}>
                  <Icon size={20} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>

              {/* Value */}
              <div className="relative mb-1">
                <h3 className="text-3xl font-black text-text-main tracking-tight leading-none">
                  {loading ? (
                    <span className="inline-block w-10 h-7 bg-background rounded animate-pulse" />
                  ) : (card.value ?? 0)}
                </h3>
              </div>

              {/* Labels */}
              <p className="relative text-[11px] font-black text-text-main">{card.label}</p>
              <p className="relative text-[10px] text-text-muted mt-0.5">{card.sub}</p>

              {/* Progress bar (for Enterprise & Active only) */}
              {(card.label === 'Enterprise Tier' || card.label === 'Active Owners') && !loading && (
                <div className="relative mt-3">
                  <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: card.accent }}
                    />
                  </div>
                  <p className="text-[9px] text-text-muted mt-1">{pct}% of total partners</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>


      {/* --- FILTER BAR --- */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search by name, email, business name..."
            className="w-full bg-card border border-divider rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-primary transition-all placeholder:text-text-muted text-text-primary shadow-subtle"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-card p-1.5 rounded-2xl border border-divider shadow-subtle shrink-0">
          {['All', 'Enterprise', 'Standard', 'Basic'].map(plan => (
            <button
              key={plan}
              onClick={() => setFilterPlan(plan)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterPlan === plan ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
                }`}
            >
              {plan}
            </button>
          ))}
        </div>
      </div>

      {/* --- OWNERS TABLE --- */}
      <div className="card-classic overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-6 px-6 py-5 border-b border-divider/50 animate-pulse">
                <div className="w-11 h-11 bg-slate-200 dark:bg-white/10 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-40" />
                  <div className="h-2.5 bg-slate-100 dark:bg-white/5 rounded w-56" />
                </div>
                <div className="h-3 bg-slate-100 dark:bg-white/5 rounded w-16" />
                <div className="h-6 bg-slate-100 dark:bg-white/5 rounded-lg w-20" />
              </div>
            ))}
          </div>
        ) : filteredOwners.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-text-muted mx-auto mb-4">
              <Users size={28} />
            </div>
            <p className="text-sm font-black text-text-muted uppercase tracking-widest">
              {owners.length === 0 ? 'No owners found in the database' : 'No results match your search'}
            </p>
            <p className="text-xs text-text-muted mt-2 italic">
              {owners.length === 0 ? 'Register an owner account via the Owner Portal to populate this directory.' : 'Try adjusting your filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-background/60 border-b border-divider">
                  <th className="py-4 px-6 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Owner Profile</th>
                  <th className="py-4 px-6 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Business</th>
                  <th className="py-4 px-6 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Properties</th>
                  <th className="py-4 px-6 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Tier</th>
                  <th className="py-4 px-6 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">KYC</th>
                  <th className="py-4 px-6 text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">Joined</th>
                  <th className="py-4 px-6 text-[9px] font-black text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <AnimatePresence>
                  {filteredOwners.map((owner, idx) => (
                    <motion.tr
                      key={owner._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.04 }}
                      className="group hover:bg-background/50 transition-all cursor-pointer"
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform shrink-0">
                            {owner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-text-primary group-hover:text-primary transition-colors truncate">{owner.name}</p>
                            <p className="text-[11px] text-text-muted mt-0.5 font-medium truncate">{owner.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div>
                          <p className="text-[12px] font-black text-text-primary">
                            {owner.businessName || <span className="italic text-text-muted">Not set</span>}
                          </p>
                          <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{owner.businessType}</p>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          <Home size={13} className="text-primary shrink-0" />
                          <span className="text-sm font-black text-text-primary">{owner.buildingCount}</span>
                          <span className="text-[10px] font-bold text-text-muted">Properties</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border uppercase ${planBadge(owner.plan)}`}>
                          {owner.plan}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2">
                          {owner.bankVerified ? (
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-success">
                              <CheckCircle2 size={13} /> Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 text-[10px] font-black text-warning">
                              <AlertCircle size={13} /> Pending
                            </span>
                          )}
                          {owner.documentsCount > 0 && (
                            <span className="text-[9px] text-text-muted font-bold">({owner.documentsCount} docs)</span>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-[11px] font-bold text-text-secondary italic">
                          {owner.joinedAt ? new Date(owner.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">

                          <button
                            onClick={() => setSelectedOwner(owner)}
                            title="View Details"
                            className="p-2 rounded-xl text-text-muted hover:text-indigo-500 hover:bg-indigo-500/10 transition-all"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}

        {/* Footer count */}
        {!loading && filteredOwners.length > 0 && (
          <div className="px-6 py-4 border-t border-divider/50 flex items-center justify-between">
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">
              Showing <span className="text-text-primary">{filteredOwners.length}</span> of <span className="text-text-primary">{owners.length}</span> registered owners
            </p>
            <p className="text-[9px] text-text-muted italic">
              Source: <span className="text-primary font-black">owner_users</span> collection · MongoDB
            </p>
          </div>
        )}
      </div>

      {/* --- OWNER DETAIL PANEL (click Eye icon) --- */}
      <AnimatePresence>
        {selectedOwner && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedOwner(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-surface border border-divider rounded-3xl shadow-2xl w-full max-w-lg p-8 space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">
                    {selectedOwner.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-text-primary tracking-tight">{selectedOwner.name}</h2>
                    <p className="text-xs text-text-muted font-medium">{selectedOwner.email}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedOwner(null)} className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-all">✕</button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Phone', value: selectedOwner.phone },
                  { label: 'Plan', value: selectedOwner.plan },
                  { label: 'Properties', value: `${selectedOwner.buildingCount} Buildings` },
                  { label: 'Business Type', value: selectedOwner.businessType },
                  { label: 'Business Name', value: selectedOwner.businessName || 'Not Set' },
                  { label: 'Profile Completeness', value: `${selectedOwner.profileCompleteness}%` },
                  { label: 'Bank KYC', value: selectedOwner.bankVerified ? '✅ Verified' : '⏳ Pending' },
                  { label: 'Documents', value: `${selectedOwner.documentsCount} Uploaded` },
                  { label: 'City', value: selectedOwner.city || 'Not Set' },
                  { label: 'Joined', value: selectedOwner.joinedAt ? new Date(selectedOwner.joinedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A' },
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-background rounded-xl border border-divider/50">
                    <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-sm font-black text-text-primary">{item.value}</p>
                  </div>
                ))}
              </div>


            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Owners;
