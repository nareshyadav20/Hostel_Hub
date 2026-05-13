import React, { useState, useEffect, useCallback } from 'react';
import { UserPlus, Mail, Phone, Home, ShieldCheck, MoreHorizontal, Search, Filter, TrendingUp, Building, ArrowUpRight, ArrowLeft, Zap, Edit, Trash2, X, Check, AlertCircle, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';

const Owners = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const fetchOwners = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (searchTerm) params.search = searchTerm;
      if (filterStatus !== 'All') params.status = filterStatus;

      const [ownersRes, statsRes] = await Promise.all([
        axios.get(`${API}/owners`, { params }),
        axios.get(`${API}/stats`)
      ]);

      setOwners(ownersRes.data.owners || []);
      setTotalPages(ownersRes.data.totalPages || 1);
      setTotal(ownersRes.data.total || 0);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch owners:', err);
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, filterStatus]);

  useEffect(() => { fetchOwners(); }, [fetchOwners]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleVerify = async (id, status) => {
    try {
      await axios.patch(`${API}/owners/${id}`, { verificationStatus: status });
      fetchOwners();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/owners/${id}`);
      setShowDeleteConfirm(null);
      fetchOwners();
    } catch (err) { console.error(err); }
  };

  const kpiCards = [
    { label: 'Total Partners', value: stats?.totalOwners ?? '—', change: '+5%', icon: <UserPlus />, color: 'primary' },
    { label: 'Verified Owners', value: stats?.activeOwners ?? '—', change: '+12%', icon: <ShieldCheck />, color: 'accent' },
    { label: 'Pending Verification', value: stats?.pendingOwners ?? '—', change: '', icon: <AlertCircle />, color: 'warning' },
    { label: 'Total Properties', value: stats?.totalBuildings ?? '—', change: '+8%', icon: <Building />, color: 'success' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-success/10 text-success border-success/20';
      case 'Pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'Rejected': return 'bg-danger/10 text-danger border-danger/20';
      default: return 'bg-text-muted/10 text-text-muted border-text-muted/20';
    }
  };

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
          <p className="text-sm font-medium text-text-muted mt-1">Manage platform-wide owner accounts and strategic partnerships. <span className="font-black text-primary">{total} records</span></p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
          <UserPlus size={18} /> Add New Owner
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-12 gap-6">
        {kpiCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="col-span-12 md:col-span-6 lg:col-span-3 layer-2 p-6 group cursor-default"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              {stat.change && (
                <div className="flex items-center gap-1 text-[10px] font-bold text-success bg-success/10 px-2 py-1 rounded-full">
                  <ArrowUpRight size={10} /> {stat.change}
                </div>
              )}
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-bold text-text-primary mt-1 tracking-tight">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search owners by name, business, email..." 
            className="w-full bg-card/50 border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted text-text-primary shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-card p-1.5 rounded-2xl border border-border shadow-sm shrink-0">
          {['All', 'Verified', 'Pending', 'Rejected'].map((s) => (
            <button
              key={s}
              onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="layer-2 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-text-muted">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="text-sm font-bold">Loading owners from database...</span>
          </div>
        ) : owners.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <UserPlus size={48} className="mb-4 text-primary/30" />
            <p className="text-lg font-bold">No owners found</p>
            <p className="text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-card/20 border-b border-border">
                  <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Owner Profile</th>
                  <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Portfolio</th>
                  <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Plan</th>
                  <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Verification</th>
                  <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {owners.map((owner) => {
                  const name = owner.personalInfo?.fullName || owner.userId?.name || 'Unknown';
                  const email = owner.userId?.email || '—';
                  const phone = owner.userId?.phone || '—';
                  const plan = owner.subscriptionPlan || 'Standard';
                  const status = owner.verificationStatus || 'Pending';
                  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);

                  return (
                    <tr key={owner._id} className="group hover:bg-background/50 transition-all cursor-pointer">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform">
                              {initials}
                            </div>
                            {status === 'Verified' && (
                              <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5">
                                <ShieldCheck size={12} className="text-success" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{name}</p>
                            </div>
                            <p className="text-[11px] text-text-muted mt-0.5">{email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Home size={14} className="text-primary" />
                            <span className="text-sm font-bold text-text-secondary">{owner.hostelCount || 0} Properties</span>
                          </div>
                          <span className="text-[10px] font-bold text-text-muted italic">{owner.tenantCount || 0} Tenants</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest border w-fit ${
                          plan === 'Enterprise' ? 'bg-primary/10 text-primary border-primary/20' : 
                          plan === 'Standard' ? 'bg-accent/10 text-accent border-accent/20' : 
                          'bg-text-muted/10 text-text-muted border-text-muted/20'
                        }`}>
                          {plan.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status === 'Verified' ? 'bg-success animate-pulse' : status === 'Pending' ? 'bg-warning' : 'bg-danger'}`}></span>
                          {status}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {status === 'Pending' && (
                            <button
                              onClick={() => handleVerify(owner._id, 'Verified')}
                              className="p-2 rounded-xl text-success hover:bg-success/10 transition-all"
                              title="Verify Owner"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          {status === 'Verified' && (
                            <button
                              onClick={() => handleVerify(owner._id, 'Rejected')}
                              className="p-2 rounded-xl text-warning hover:bg-warning/10 transition-all"
                              title="Suspend Owner"
                            >
                              <AlertCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOwner(owner)}
                            className="p-2 rounded-xl text-text-muted hover:text-primary hover:bg-primary/10 transition-all"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(owner._id)}
                            className="p-2 rounded-xl text-text-muted hover:text-danger hover:bg-danger/10 transition-all"
                            title="Delete Owner"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 card-classic bg-slate-50/50">
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
            Page {page} of {totalPages} • {total} total records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl text-text-muted hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl text-text-secondary hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
              <p className="text-sm text-text-muted mb-6">Are you sure you want to permanently remove this owner? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="px-5 py-2.5 border border-border rounded-xl text-sm font-bold text-text-secondary hover:bg-background transition-all">Cancel</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} className="px-5 py-2.5 bg-danger text-white rounded-xl text-sm font-bold hover:bg-danger/90 transition-all shadow-lg shadow-danger/20">Delete Owner</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Owner Detail Side Panel */}
      <AnimatePresence>
        {selectedOwner && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-end z-[200]"
            onClick={() => setSelectedOwner(null)}
          >
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-lg h-full bg-card border-l border-border shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-text-primary">Owner Profile</h3>
                  <button onClick={() => setSelectedOwner(null)} className="p-2 rounded-xl hover:bg-background transition-all"><X size={18} /></button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-black shadow-lg">
                    {(selectedOwner.personalInfo?.fullName || selectedOwner.userId?.name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-text-primary">{selectedOwner.personalInfo?.fullName || selectedOwner.userId?.name || 'Unknown'}</h4>
                    <p className="text-sm text-text-muted">{selectedOwner.userId?.email}</p>
                    <span className={`mt-1 inline-flex px-2 py-0.5 rounded-full text-[9px] font-black border ${getStatusColor(selectedOwner.verificationStatus)}`}>
                      {selectedOwner.verificationStatus || 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Plan', value: selectedOwner.subscriptionPlan || 'Standard' },
                    { label: 'Properties', value: selectedOwner.hostelCount || 0 },
                    { label: 'Tenants', value: selectedOwner.tenantCount || 0 },
                    { label: 'Rating', value: selectedOwner.hostelRatings || '—' },
                    { label: 'Profile', value: `${selectedOwner.profileCompleteness || 0}%` },
                    { label: 'Revenue', value: `₹${((selectedOwner.revenueGenerated || 0) / 1000).toFixed(1)}K` },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-background border border-border">
                      <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">{item.label}</p>
                      <p className="text-lg font-black text-text-primary mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>

                {selectedOwner.businessDetails?.businessName && (
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Business</p>
                    <p className="text-sm font-bold text-text-primary">{selectedOwner.businessDetails.businessName}</p>
                    {selectedOwner.businessDetails.gstNumber && <p className="text-[11px] text-text-muted mt-1">GST: {selectedOwner.businessDetails.gstNumber}</p>}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Owners;
