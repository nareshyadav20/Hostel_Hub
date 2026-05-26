import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, UserCheck, UserMinus, FileText, MoreHorizontal, ShieldCheck, ArrowUpRight, CheckCircle, XCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchKycData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users/kyc');
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch KYC records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKycData();
  }, []);

  const handleAction = async (id, action) => {
    try {
      // action is 'Approved' or 'Rejected'
      await API.patch(`/admin/users/kyc/${id}/status`, { status: action });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, kycStatus: action } : u));
    } catch (err) {
      console.error('Failed to update KYC status:', err);
    }
  };

  const filtered = users.filter(u =>
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.phone || '').includes(search) ||
    (u.document || '').toLowerCase().includes(search.toLowerCase())
  );

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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Identity & Trust Center</h1>
          <p className="text-sm font-medium text-text-muted mt-1">Review and verify user documentation to maintain platform security.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-4">
             <span className="text-xs font-bold text-warning uppercase">Awaiting Verification</span>
             <span className="text-xl font-black text-text-primary">{users.filter(u => u.kycStatus === 'Pending').length} Users</span>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-background border border-divider text-text-primary font-bold rounded-xl hover:bg-text-primary/5 transition-all">
            <Download size={18} /> Export Audit
          </button>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-12 gap-6">
        {[
          { label: 'Total Verified', value: users.filter(u => u.kycStatus === 'Approved').length, icon: <CheckCircle />, color: 'success' },
          { label: 'Pending Review', value: users.filter(u => u.kycStatus === 'Pending').length, icon: <ShieldCheck />, color: 'warning' },
          { label: 'Rejected Entries', value: users.filter(u => u.kycStatus === 'Rejected').length, icon: <XCircle />, color: 'danger' },
          { label: 'Total Scanned Documents', value: users.length, icon: <ArrowUpRight />, color: 'primary' }
        ].map((stat, i) => (
          <div key={i} className="col-span-12 md:col-span-6 lg:col-span-3 layer-2 p-5 group">
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-xl font-bold text-text-primary mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, phone, or UID..." 
            className="w-full bg-card/50 border border-divider rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-text-primary"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="p-3 bg-card border border-divider rounded-2xl text-text-muted hover:text-primary transition-all shadow-sm">
          <Filter size={20} />
        </button>
      </div>

      {/* User Table */}
      <div className="layer-2 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center">
              <div className="premium-spinner mx-auto mb-4"></div>
              <p className="text-sm font-black text-text-muted uppercase tracking-widest animate-pulse">Loading identity documents...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <ShieldCheck className="mx-auto mb-4 text-text-muted" size={36} />
              <p className="text-sm font-black text-text-muted uppercase tracking-widest">No verification logs found</p>
              <p className="text-xs text-text-muted mt-1 italic">All uploads have been verified or resolved</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-card/20 border-b border-divider">
                  <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">User Profile</th>
                  <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Phone Number</th>
                  <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Role</th>
                  <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Document</th>
                  <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">KYC Status</th>
                  <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filtered.map((u) => {
                  const apiBase = (import.meta.env.VITE_API_URL || 'https://livora-hostel-hub-1.onrender.com/api').replace('/api', '');
                  const fullDocUrl = u.documentUrl ? (u.documentUrl.startsWith('http') ? u.documentUrl : `${apiBase}${u.documentUrl}`) : null;

                  return (
                    <tr key={u.id} className="group hover:bg-background/50 transition-all">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text-primary">{u.name}</p>
                            <p className="text-[10px] text-text-muted">
                              ID #{u.id.slice(-6).toUpperCase()} • Joined {u.joined}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-sm font-medium text-text-secondary">{u.phone}</td>
                      <td className="py-5 px-6">
                        <span className="px-2 py-0.5 rounded bg-background border border-divider text-[10px] font-bold text-text-muted uppercase tracking-wider">{u.type}</span>
                      </td>
                      <td className="py-5 px-6">
                        {fullDocUrl ? (
                          <a 
                            href={fullDocUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 text-primary hover:underline group/link"
                          >
                            <FileText size={14} className="text-primary group-hover/link:scale-110 transition-transform" />
                            <span className="text-[11px] font-bold">{u.document}</span>
                            <ExternalLink size={10} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </a>
                        ) : (
                          <div className="flex items-center gap-2 text-text-secondary">
                            <FileText size={14} className="text-text-muted" />
                            <span className="text-[11px] font-bold">{u.document}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-5 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          u.kycStatus === 'Approved' ? 'bg-success/10 text-success border-success/20' : 
                          u.kycStatus === 'Rejected' ? 'bg-danger/10 text-danger border-danger/20' : 
                          'bg-warning/10 text-warning border-warning/20'
                        }`}>
                          {u.kycStatus.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-right">
                        {u.kycStatus === 'Pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleAction(u.id, 'Approved')} className="p-2 rounded-lg bg-success/10 text-success hover:bg-success hover:text-white transition-all">
                              <UserCheck size={16} />
                            </button>
                            <button onClick={() => handleAction(u.id, 'Rejected')} className="p-2 rounded-lg bg-danger/10 text-danger hover:bg-danger hover:text-white transition-all">
                              <UserMinus size={16} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-text-muted uppercase italic tracking-widest px-2">Verified</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
