import React, { useState } from 'react';
import { Search, Filter, Download, UserCheck, UserMinus, FileText, MoreHorizontal, ShieldCheck, ArrowUpRight, CheckCircle, XCircle } from 'lucide-react';

const initialUsers = [
  { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', kycStatus: 'Pending', type: 'Owner', document: 'Aadhar Card', joined: '2h ago' },
  { id: 2, name: 'Anita Patel', phone: '+91 87654 32109', kycStatus: 'Approved', type: 'Tenant', document: 'Passport', joined: '1d ago' },
  { id: 3, name: 'Vikram Singh', phone: '+91 76543 21098', kycStatus: 'Rejected', type: 'Tenant', document: 'Voter ID', joined: '3d ago' },
  { id: 4, name: 'Siddharth M', phone: '+91 99887 76655', kycStatus: 'Pending', type: 'Owner', document: 'Pan Card', joined: '5h ago' },
];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');

  const handleAction = (id, action) => {
    setUsers(users.map(u => u.id === id ? { ...u, kycStatus: action } : u));
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  return (
    <div className="space-y-8 pb-10">
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
          <button className="flex items-center gap-2 px-6 py-3 bg-background border border-border text-text-primary font-bold rounded-xl hover:bg-text-primary/5 transition-all">
            <Download size={18} /> Export Audit
          </button>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-12 gap-6">
        {[
          { label: 'Total Verified', value: '1,284', icon: <CheckCircle />, color: 'success' },
          { label: 'Pending Review', value: '12', icon: <ShieldCheck />, color: 'warning' },
          { label: 'Rejected Entries', value: '42', icon: <XCircle />, color: 'danger' },
          { label: 'Weekly Growth', value: '+18.5%', icon: <ArrowUpRight />, color: 'primary' }
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
            className="w-full bg-card/50 border border-border rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all text-text-primary"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="p-3 bg-card border border-border rounded-2xl text-text-muted hover:text-primary transition-all shadow-sm">
          <Filter size={20} />
        </button>
      </div>

      {/* User Table */}
      <div className="layer-2 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-card/20 border-b border-border">
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">User Profile</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Phone Number</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Role</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Document</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">KYC Status</th>
                <th className="py-5 px-6 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((u) => (
                <tr key={u.id} className="group hover:bg-background/50 transition-all">
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-primary">{u.name}</p>
                        <p className="text-[10px] text-text-muted">ID #{u.id + 7000} • Joined {u.joined}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-sm font-medium text-text-secondary">{u.phone}</td>
                  <td className="py-5 px-6">
                    <span className="px-2 py-0.5 rounded bg-background border border-border text-[10px] font-bold text-text-muted uppercase tracking-wider">{u.type}</span>
                  </td>
                  <td className="py-5 px-6">
                    <div className="flex items-center gap-2 text-text-secondary">
                      <FileText size={14} className="text-primary" />
                      <span className="text-[11px] font-bold">{u.document}</span>
                    </div>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
