import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, UserCheck, Bed, Search, Filter, MapPin, Mail,
  MoreHorizontal, Download, MessageSquare, Eye, Edit,
  Trash2, ArrowUpRight, TrendingUp, ShieldCheck, PieChart, DollarSign,
  LayoutGrid, List, Phone, Calendar, Clock, AlertCircle, FileText,
  UserPlus, CheckCircle2, ChevronRight, ChevronLeft, ArrowLeft, Zap, Loader2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';

const Tenants = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: '', email: '', phone: '', emergencyContact: '', room: '', rent: '' });

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (searchTerm) params.search = searchTerm;
      if (filterStatus !== 'All') params.status = filterStatus;

      const [tenantsRes, statsRes] = await Promise.all([
        axios.get(`${API}/tenants`, { params }),
        axios.get(`${API}/stats`)
      ]);

      setTenants(tenantsRes.data.tenants || []);
      setTotalPages(tenantsRes.data.totalPages || 1);
      setTotal(tenantsRes.data.total || 0);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filterStatus]);

  useEffect(() => { fetchTenants(); }, [fetchTenants]);

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/tenants/${id}`);
      setShowDeleteConfirm(null);
      fetchTenants();
    } catch (err) { console.error(err); }
  };

  const handleAddTenant = async () => {
    try {
      await axios.post(`${API}/tenants`, newTenant);
      setShowAddModal(false);
      setNewTenant({ name: '', email: '', phone: '', emergencyContact: '', room: '', rent: '' });
      fetchTenants();
    } catch (err) { console.error(err); }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/tenants/${id}`, { status });
      fetchTenants();
    } catch (err) { console.error(err); }
  };

  const kpiStats = [
    { label: 'Active Residents', value: stats?.activeTenants ?? '—', change: '+5.4%', icon: <UserCheck />, color: 'success', description: 'Verified Stay' },
    { label: 'Total Residents', value: stats?.totalTenants ?? '—', change: '', icon: <Users />, color: 'primary', description: 'All Records' },
    { label: 'Pending Approval', value: stats?.pendingTenants ?? '—', change: '', icon: <AlertCircle />, color: 'warning', description: 'Awaiting Review' },
  ];

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'ACTIVE') return 'bg-success/10 text-success border-success/20';
    if (s === 'PENDING') return 'bg-warning/10 text-warning border-warning/20';
    if (s === 'LEFT') return 'bg-text-muted/10 text-text-muted border-text-muted/20';
    return 'bg-text-muted/10 text-text-muted border-text-muted/20';
  };

  const getRentBadge = (rs) => {
    const s = (rs || '').toUpperCase();
    if (s === 'PAID') return 'bg-success/10 text-success';
    return 'bg-warning/10 text-warning';
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

      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl text-premium-header">Global Tenant Directory</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Live resident management • <span className="font-black text-primary">{total} records</span></p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-premium"
          >
            <UserPlus size={16} strokeWidth={3} /> Onboard Tenant
          </button>
        </div>
      </div>

      {/* --- ANALYTICS HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpiStats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-classic p-6 flex items-center gap-5 group relative overflow-hidden border-none glass-effect"
          >
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} flex items-center justify-center border border-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 group-hover:shadow-glow transition-all duration-300 relative z-10`}>
              {React.cloneElement(stat.icon, { size: 24, strokeWidth: 2.5 })}
            </div>
            <div className="relative z-10">
              <p className="text-premium-label mb-1">{stat.label}</p>
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-black text-text-primary tracking-tighter italic">{stat.value}</h3>
                {stat.change && (
                  <span className="text-[10px] font-black text-success flex items-center gap-0.5">
                    <ArrowUpRight size={10} strokeWidth={3} /> {stat.change}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter italic">{stat.description}</span>
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
            placeholder="Search residents by name, room, phone or email..."
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
                onClick={() => { setFilterStatus(status); setPage(1); }}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- LOADING / EMPTY STATE --- */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-text-muted">
          <Loader2 size={24} className="animate-spin text-primary" />
          <span className="text-sm font-bold">Fetching tenants from database...</span>
        </div>
      ) : tenants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-text-muted">
          <Users size={48} className="mb-4 text-primary/30" />
          <p className="text-lg font-bold">No tenants found</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          {/* --- TENANT DIRECTORY GRID/LIST --- */}
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
              >
                {tenants.map((t) => (
                  <motion.div
                    key={t._id}
                    layout
                    className="card-classic group flex flex-col transition-all duration-500 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg group-hover:scale-105 transition-transform">
                              {(t.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${(t.status || '').toUpperCase() === 'ACTIVE' ? 'bg-success' : (t.status || '').toUpperCase() === 'PENDING' ? 'bg-warning' : 'bg-text-muted'}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-text-primary tracking-tight">{t.name}</h3>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t.room || '—'} • {t.buildingId?.name || 'Unassigned'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setShowDeleteConfirm(t._id)}
                            className="p-2 rounded-xl bg-slate-50 border border-border/50 text-text-muted hover:text-danger transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border/50">
                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-2">Payment Status</p>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${getRentBadge(t.rentStatus)}`}>{t.rentStatus || '—'}</span>
                            <span className="text-[11px] font-black text-text-primary italic">₹{t.rent || 0}</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border/50">
                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-2">Check-in</p>
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-primary" />
                            <span className="text-[11px] font-black text-text-primary italic">
                              {t.checkInDate ? new Date(t.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusBadge(t.status)}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${(t.status || '').toUpperCase() === 'ACTIVE' ? 'bg-success animate-pulse' : (t.status || '').toUpperCase() === 'PENDING' ? 'bg-warning' : 'bg-text-muted'}`}></span>
                            {t.status || 'Unknown'}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {(t.status || '').toUpperCase() === 'PENDING' && (
                            <button onClick={() => handleUpdateStatus(t._id, 'ACTIVE')} className="text-[9px] font-black text-success uppercase px-2 py-1 bg-success/10 rounded-lg">Activate</button>
                          )}
                          {(t.status || '').toUpperCase() === 'ACTIVE' && (
                            <button onClick={() => handleUpdateStatus(t._id, 'LEFT')} className="text-[9px] font-black text-text-muted uppercase px-2 py-1 bg-text-muted/10 rounded-lg">Check Out</button>
                          )}
                        </div>
                      </div>
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
                        <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Resident</th>
                        <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Room / Property</th>
                        <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                        <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Payment</th>
                        <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Check-in</th>
                        <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {tenants.map((t) => (
                        <tr key={t._id} className="group hover:bg-background transition-all cursor-pointer">
                          <td className="py-5 px-8">
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-[11px]">
                                {(t.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2)}
                              </div>
                              <div>
                                <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">{t.name}</p>
                                <p className="text-[10px] font-medium text-text-muted">{t.phone || t.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-8">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black text-text-primary italic">{t.room || '—'}</span>
                              <span className="text-[9px] font-bold text-text-muted uppercase">{t.buildingId?.name || 'Unassigned'}</span>
                            </div>
                          </td>
                          <td className="py-5 px-8">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusBadge(t.status)}`}>{t.status || '—'}</span>
                          </td>
                          <td className="py-5 px-8">
                            <div className="flex flex-col">
                              <span className={`text-[10px] font-black uppercase ${(t.rentStatus || '').toUpperCase() === 'PAID' ? 'text-success' : 'text-warning'}`}>{t.rentStatus || '—'}</span>
                              <span className="text-[9px] font-bold text-text-muted">₹{t.rent || 0}</span>
                            </div>
                          </td>
                          <td className="py-5 px-8">
                            <span className="text-[11px] font-bold text-text-secondary">
                              {t.checkInDate ? new Date(t.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}
                            </span>
                          </td>
                          <td className="py-5 px-8 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => setShowDeleteConfirm(t._id)} className="p-2 text-text-muted hover:text-danger transition-all"><Trash2 size={16} /></button>
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

          {/* --- PAGINATION --- */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 card-classic bg-slate-50/50">
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                Page {page} of {totalPages} • {total} total records
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl text-text-muted hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl text-text-secondary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- ADD TENANT MODAL --- */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200]"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card p-8 rounded-2xl border border-border shadow-2xl max-w-lg w-full mx-4 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-text-primary">Onboard New Tenant</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl hover:bg-background"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'name', label: 'Full Name', placeholder: 'Suresh Kumar' },
                  { key: 'email', label: 'Email', placeholder: 'suresh@gmail.com' },
                  { key: 'phone', label: 'Phone', placeholder: '+91 98765...' },
                  { key: 'emergencyContact', label: 'Emergency Contact', placeholder: '+91 98765...' },
                  { key: 'room', label: 'Room Number', placeholder: '201-A' },
                  { key: 'rent', label: 'Monthly Rent (₹)', placeholder: '8000' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-text-muted uppercase tracking-widest">{label}</label>
                    <input
                      type={key === 'rent' ? 'number' : 'text'}
                      placeholder={placeholder}
                      value={newTenant[key]}
                      onChange={(e) => setNewTenant(prev => ({ ...prev, [key]: e.target.value }))}
                      className="bg-background border border-border rounded-xl py-2.5 px-4 text-sm text-text-primary focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 border border-border rounded-xl text-sm font-bold text-text-secondary">Cancel</button>
                <button onClick={handleAddTenant} className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">Create Tenant</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[200]"
            onClick={() => setShowDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card p-8 rounded-2xl border border-border shadow-2xl max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-black text-text-primary mb-2">Confirm Deletion</h3>
              <p className="text-sm text-text-muted mb-6">Are you sure you want to permanently remove this tenant? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="px-5 py-2.5 border border-border rounded-xl text-sm font-bold text-text-secondary">Cancel</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} className="px-5 py-2.5 bg-danger text-white rounded-xl text-sm font-bold shadow-lg shadow-danger/20">Delete Tenant</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tenants;
