import React, { useState, useEffect } from 'react';
import {
  Users, UserCheck, Bed, Search, Filter, MapPin, Mail,
  MoreHorizontal, Download, MessageSquare, Eye, Edit,
  Trash2, ArrowUpRight, TrendingUp, ShieldCheck, PieChart, DollarSign,
  LayoutGrid, List, Phone, Calendar, Clock, AlertCircle, FileText,
  UserPlus, CheckCircle2, ChevronRight, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import API from '../api/axios';
import Modal from '../components/Modal';

const Tenants = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState('grid');
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const triggerConfirm = (title, message, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      }
    });
  };
  
  const [tenants, setTenants] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);

  // Onboarding Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
    buildingId: '',
    room: '',
    rent: 8500,
    messPlan: 'basic',
    aadhaarNumber: '',
  });

  const [broadcastModal, setBroadcastModal] = useState(false);
  const [broadcastTarget, setBroadcastTarget] = useState('All');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);

  const handleIntelExport = () => {
    if (tenants.length === 0) {
      showToast("No tenant data available to export.", "error");
      return;
    }
    
    const headers = ["Name", "Email", "Phone", "Hostel", "Room", "Status", "Monthly Rent", "Emergency Contact"];
    const rows = tenants.map(t => [
      `"${t.name}"`,
      `"${t.email}"`,
      `"${t.phone}"`,
      `"${t.hostel}"`,
      `"${t.room}"`,
      `"${t.status}"`,
      `"${t.balance}"`,
      `"${t.emergencyContact || '9876543210'}"`
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Tenant_Intelligence_Manifest_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("Resident Intelligence Manifest exported successfully!", "success");
  };

  const handleBroadcast = () => {
    setBroadcastModal(true);
  };

  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) {
      showToast("Subject and message are required for broadcast.", "error");
      return;
    }
    
    try {
      setBroadcasting(true);
      showToast("Initializing global broadcast channels...", "info");
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      showToast(`Broadcast notice dispatch successful to ${broadcastTarget === 'All' ? 'all registered residents' : broadcastTarget}!`, "success");
      setBroadcastModal(false);
      setBroadcastSubject('');
      setBroadcastMessage('');
    } catch (err) {
      showToast("Failed to dispatch broadcast notice.", "error");
    } finally {
      setBroadcasting(false);
    }
  };
  
  const handleOffboard = (id, name) => {
    triggerConfirm(
      "Initiate Offboarding",
      `Are you sure you want to offboard ${name}? This action will change their status to checked out.`,
      async () => {
        try {
          await API.put(`/tenants/${id}`, { status: 'LEFT' });
          showToast(`${name} offboarding sequence completed successfully.`, "success");
          await fetchTenants();
        } catch (err) {
          console.error('Error offboarding:', err);
          showToast("Failed to offboard resident.", "error");
        }
      }
    );
  };

  const handleUpdateNode = (tenant) => {
    setSelectedTenant(tenant);
    setFormData({
      name: tenant.name,
      email: tenant.email,
      phone: tenant.phone,
      emergencyContact: tenant.emergencyContact || '9876543210',
      buildingId: tenant.buildingId || '',
      room: tenant.room,
      rent: parseFloat(tenant.balance.replace(/[^0-9.]/g, '')) || 8500,
      messPlan: tenant.messPlan || 'basic',
      aadhaarNumber: tenant.aadhaarNumber || '',
    });
    setActiveModal('edit');
  };

  const handleGenerateLedger = (name) => showToast(`Generating Financial Ledger for ${name}...`, "success");

  const fetchBuildings = async () => {
    try {
      const res = await API.get('/buildings');
      setBuildings(res.data);
    } catch (err) {
      console.error('Error fetching buildings:', err);
    }
  };

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const res = await API.get('/tenants');
      const bRes = await API.get('/buildings');
      
      const buildingMap = {};
      bRes.data.forEach(b => {
        buildingMap[b._id] = b.name;
      });

      const mapped = res.data.map(t => ({
        id: t._id,
        name: t.name,
        hostel: buildingMap[t.buildingId] || 'Sunshine Residency',
        buildingId: t.buildingId,
        room: t.room || 'N/A',
        email: t.email,
        phone: t.phone || 'N/A',
        status: t.status === 'ACTIVE' ? 'Active' : t.status === 'LEFT' ? 'Left' : 'Pending',
        rentStatus: t.rentStatus === 'PAID' ? 'Paid' : 'Pending',
        checkIn: t.checkInDate ? new Date(t.checkInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A',
        duration: '3 Months',
        gender: 'Male',
        balance: t.rentStatus === 'PAID' ? '₹0' : `₹${(t.rent || 8500).toLocaleString('en-IN')}`,
        complaints: 0,
        docs: t.docs?.map(d => d.name) || ['ID Proof']
      }));
      
      setTenants(mapped);
    } catch (err) {
      console.error('Error fetching tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
    fetchBuildings();
  }, []);

  const handleOnboardClick = () => {
    setSelectedTenant(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      emergencyContact: '9876543210',
      buildingId: buildings[0]?._id || '',
      room: '',
      rent: 8500,
      messPlan: 'basic',
      aadhaarNumber: '',
    });
    setActiveModal('onboard');
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        status: 'ACTIVE',
        rentStatus: 'PENDING',
        checkInDate: new Date()
      };

      if (activeModal === 'onboard') {
        await API.post('/tenants', payload);
      } else if (activeModal === 'edit' && selectedTenant) {
        await API.put(`/tenants/${selectedTenant.id}`, payload);
      }

      setActiveModal(null);
      await fetchTenants();
    } catch (err) {
      console.error('Error onboarding resident:', err);
      showToast(err.response?.data?.error || "Failed to save resident information.", "error");
    }
  };

  const handleDelete = (id) => {
    triggerConfirm(
      "Remove Resident Record",
      "Are you sure you want to delete this resident record? This action cannot be undone.",
      async () => {
        try {
          await API.delete(`/tenants/${id}`);
          showToast("Resident record successfully removed.", "success");
          await fetchTenants();
        } catch (err) {
          console.error('Error deleting tenant:', err);
          showToast("Failed to delete tenant.", "error");
        }
      }
    );
  };

  const stats = [
    { label: 'Active Residents', value: tenants.filter(t => t.status === 'Active').length.toString(), change: '+5.4%', icon: <UserCheck />, color: 'success', description: 'Verified Stay' },
    { label: 'Occupancy Rate', value: '92.4%', change: '+2.1%', icon: <PieChart />, color: 'primary', description: 'Global Average' },
    { label: 'Rent Collected', value: `₹${(tenants.filter(t => t.rentStatus === 'Paid').length * 8.5).toFixed(1)}L`, change: '+12.5%', icon: <DollarSign />, color: 'indigo', description: 'MTD Revenue' },
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

      {/* --- COMMAND HEADER --- */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl text-premium-header">Global Tenant Directory</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">High-fidelity resident management and operational manifest</p>
        </div>
        
        {/* Unified Premium Actions Console Card */}
        <div className="bg-card dark:bg-white/[0.01] border border-divider/70 p-3 rounded-2xl flex items-center gap-3.5 shadow-premium glass-effect relative overflow-hidden group shrink-0">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-8 -mt-8 blur-2xl group-hover:bg-primary/10 transition-colors" />
          
          <div className="text-left pr-4 border-r border-divider/50 hidden sm:block">
            <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] block leading-none mb-1">Control Console</span>
            <span className="text-xs font-black text-text-primary tracking-tight block">System Operations</span>
          </div>

          <div className="flex items-center gap-2.5 relative z-10">
            <button 
              onClick={handleIntelExport}
              className="flex items-center gap-2 px-5 py-3 bg-slate-50 dark:bg-white/5 border border-divider/80 rounded-xl text-[10px] font-black uppercase tracking-widest text-text-primary hover:border-primary hover:text-primary transition-all duration-300 shadow-subtle hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download size={14} className="text-primary" /> Intel Export
            </button>
            <button 
              onClick={handleBroadcast}
              className="flex items-center gap-2 px-5 py-3 bg-primary border border-primary rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-primary-dark transition-all duration-300 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MessageSquare size={14} className="text-white animate-pulse" /> Broadcast
            </button>
          </div>
        </div>
      </div>

      {/* --- ANALYTICS HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-classic p-6 flex items-center gap-5 group relative overflow-hidden border-none glass-effect"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/5 rounded-full -mr-16 -mt-16 blur-3xl`} />
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} flex items-center justify-center border border-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 group-hover:shadow-glow transition-all duration-300 relative z-10`}>
              {React.cloneElement(stat.icon, { size: 24, strokeWidth: 2.5 })}
            </div>
            <div className="relative z-10">
              <p className="text-premium-label mb-1">{stat.label}</p>
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-black text-text-primary tracking-tighter italic">{stat.value}</h3>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-success flex items-center gap-0.5">
                    <ArrowUpRight size={10} strokeWidth={3} /> {stat.change}
                  </span>
                  <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter italic">{stat.description}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* --- STICKY CONTROL BAR --- */}
      <div className="sticky top-0 z-40 py-4 bg-background/80 backdrop-blur-xl border-b border-divider/50 -mx-4 px-4 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 relative flex items-center group">
          <Search className="absolute left-4 text-text-muted group-focus-within:text-primary transition-all duration-300" size={18} />
          <input
            type="text"
            className="w-full bg-card border border-divider rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-text-primary shadow-subtle"
            placeholder="Search residents by name, room, property or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <div className="flex bg-card p-1.5 rounded-2xl border border-divider shadow-subtle shrink-0">
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

          <div className="flex bg-card p-1.5 rounded-2xl border border-divider shadow-subtle shrink-0">
            {['All', 'Active', 'Pending', 'Left'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- TENANT DIRECTORY GRID/LIST --- */}
      {loading ? (
        <div className="py-20 text-center text-text-muted font-bold uppercase tracking-widest">
          Loading Tenant Manifest from Database...
        </div>
      ) : tenants.length === 0 ? (
        <div className="py-20 text-center text-text-muted font-bold uppercase tracking-widest border border-dashed border-divider rounded-3xl">
          No Residents Enrolled. Click "Onboard Tenant" to Enforce registration.
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {tenants
                .filter(t => {
                  const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.room.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
                  return matchesSearch && matchesStatus;
                })
                .map((t) => (
                  <motion.div
                    key={t.id}
                    layout
                    className={`card-classic group flex flex-col transition-all duration-500 overflow-hidden ${expandedId === t.id ? 'md:col-span-2 xl:col-span-2 ring-2 ring-primary ring-offset-4 dark:ring-offset-slate-900 shadow-2xl' : ''
                      }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-lg group-hover:scale-105 transition-transform">
                              {t.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${t.status === 'Active' ? 'bg-success' : t.status === 'Pending' ? 'bg-warning' : 'bg-text-muted'}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-text-primary tracking-tight">{t.name}</h3>
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{t.room} • {t.hostel}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleUpdateNode(t)} className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-divider/50 text-text-muted hover:text-primary transition-all"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(t.id)} className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 transition-all"><Trash2 size={16} /></button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-divider/50">
                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-2">Payment Status</p>
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase ${t.rentStatus === 'Paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                              }`}>{t.rentStatus}</span>
                            <span className="text-[11px] font-black text-text-primary italic">{t.balance} Due</span>
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-divider/50">
                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-2">Check-in</p>
                          <div className="flex items-center gap-2">
                            <Calendar size={12} className="text-primary" />
                            <span className="text-[11px] font-black text-text-primary italic">{t.checkIn}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-divider/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            {t.docs.map((doc, i) => (
                              <div key={i} className="w-7 h-7 rounded-lg bg-card border-2 border-background flex items-center justify-center text-text-muted" title={doc}>
                                <FileText size={12} />
                              </div>
                            ))}
                            {t.docs.length === 0 && <span className="text-[9px] font-bold text-text-muted italic">No Docs</span>}
                          </div>
                          {t.complaints > 0 && (
                            <span className="flex items-center gap-1 text-[9px] font-black text-rose-500 uppercase">
                              <AlertCircle size={10} /> {t.complaints} Open
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                          className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest hover:gap-2 transition-all"
                        >
                          {expandedId === t.id ? 'Close Profile' : 'Expand Profile'}
                          <ChevronRight size={14} className={`transition-transform ${expandedId === t.id ? 'rotate-90' : ''}`} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {expandedId === t.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden pt-8 mt-4 border-t border-divider"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                <h4 className="text-[11px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                                  <Clock size={14} className="text-indigo-500" /> Stay Manifest
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center p-3 rounded-xl bg-background border border-divider">
                                    <span className="text-[10px] font-bold text-text-muted uppercase">Gender</span>
                                    <span className="text-[11px] font-black text-text-primary">{t.gender}</span>
                                  </div>
                                  <div className="flex justify-between items-center p-3 rounded-xl bg-background border border-divider">
                                    <span className="text-[10px] font-bold text-text-muted uppercase">Check-in</span>
                                    <span className="text-[11px] font-black text-text-primary">{t.checkIn}</span>
                                  </div>
                                  <div className="flex justify-between items-center p-3 rounded-xl bg-background border border-divider">
                                    <span className="text-[10px] font-bold text-text-muted uppercase">Duration</span>
                                    <span className="text-[11px] font-black text-text-primary">{t.duration}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-6">
                                <h4 className="text-[11px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                                  <DollarSign size={14} className="text-success" /> Financial Pulse
                                </h4>
                                <div className="p-5 rounded-2xl bg-success/5 border border-success/10 flex flex-col items-center justify-center text-center">
                                  <CheckCircle2 size={32} className="text-success mb-3" />
                                  <p className="text-[14px] font-black text-text-primary">Clean Record</p>
                                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1">No outstanding overheads</p>
                                  <button 
                                    onClick={() => handleGenerateLedger(t.name)}
                                    className="w-full mt-4 py-3 bg-white dark:bg-slate-800 border border-divider text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-primary transition-all"
                                  >
                                    Generate Ledger
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className="mt-8 pt-8 border-t border-divider flex justify-between items-center">
                              <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-bold text-text-muted uppercase">Phone</span>
                                  <span className="text-[11px] font-black text-text-primary">{t.phone}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-bold text-text-muted uppercase">Email</span>
                                  <span className="text-[11px] font-black text-text-primary">{t.email}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {t.status === 'Active' && (
                                  <button 
                                    onClick={() => handleOffboard(t.id, t.name)}
                                    className="px-5 py-2.5 bg-rose-500/10 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                  >
                                    Offboard
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleUpdateNode(t)}
                                  className="px-5 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
                                >
                                  Update Node
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
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
                    <tr className="bg-card/20 border-b border-divider">
                      <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Resident Manifest</th>
                      <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Asset Node</th>
                      <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                      <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Payment</th>
                      <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {tenants
                      .filter(t => {
                        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.room.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
                        return matchesSearch && matchesStatus;
                      })
                      .map((t) => (
                        <tr key={t.id} className="group hover:bg-background transition-all cursor-pointer">
                          <td className="py-5 px-8">
                            <div className="flex items-center gap-4">
                              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-[11px]">
                                {t.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">{t.name}</p>
                                <p className="text-[10px] font-medium text-text-muted">{t.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-5 px-8">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-black text-text-primary italic">{t.room}</span>
                              <span className="text-[9px] font-bold text-text-muted uppercase">{t.hostel}</span>
                            </div>
                          </td>
                          <td className="py-5 px-8">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${t.status === 'Active' ? 'bg-success/5 text-success border-success/10' : 'bg-text-muted/5 text-text-muted border-text-muted/10'
                              }`}>{t.status}</span>
                          </td>
                          <td className="py-5 px-8">
                            <div className="flex flex-col">
                              <span className={`text-[10px] font-black uppercase ${t.rentStatus === 'Paid' ? 'text-success' : 'text-warning'}`}>{t.rentStatus}</span>
                              <span className="text-[9px] font-bold text-text-muted">Bal: {t.balance}</span>
                            </div>
                          </td>
                          <td className="py-5 px-8 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleUpdateNode(t)} className="p-2 text-text-muted hover:text-primary transition-all"><Edit size={16} /></button>
                              <button onClick={() => handleDelete(t.id)} className="p-2 text-text-muted hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
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
      )}

      {/* --- DIRECTORY FOOTER --- */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 card-classic bg-slate-50/50 dark:bg-white/2">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Showing {tenants.length} records</span>
        </div>
      </div>

      {/* --- RESIDENT ONBOARDING/EDIT MODAL --- */}
      <Modal
        isOpen={activeModal === 'onboard' || activeModal === 'edit'}
        onClose={() => setActiveModal(null)}
        title={activeModal === 'onboard' ? 'Onboard Strategic Resident' : 'Update Resident Profile'}
        maxWidth="max-w-xl"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-danger" onClick={() => setActiveModal(null)}>Abort</button>
            <button
              onClick={handleOnboardSubmit}
              className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
            >
              {activeModal === 'onboard' ? 'Confirm Onboarding' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleOnboardSubmit} className="py-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Full Name</label>
              <input
                className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. Suresh Kumar"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Email Address</label>
              <input
                type="email"
                className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="e.g. suresh@gmail.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Phone Number</label>
              <input
                className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="e.g. +91 98765 00010"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Emergency Contact</label>
              <input
                className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                required
                placeholder="e.g. 9876543210"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Select Asset Node (Hostel)</label>
              <select
                className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer"
                value={formData.buildingId}
                onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
                required
              >
                <option value="" disabled>Select Property...</option>
                {buildings.map(b => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Room Assignment</label>
              <input
                className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="e.g. 201-A"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Monthly Rent (₹)</label>
              <input
                type="number"
                className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary"
                value={formData.rent}
                onChange={(e) => setFormData({ ...formData, rent: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Aadhaar / National ID</label>
              <input
                className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary"
                value={formData.aadhaarNumber}
                onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                placeholder="e.g. 1234-5678-9012"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Mess Subscription Plan</label>
            <select
              className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer"
              value={formData.messPlan}
              onChange={(e) => setFormData({ ...formData, messPlan: e.target.value })}
            >
              <option value="basic">Basic Mess (2 Meals/Day)</option>
              <option value="standard">Standard Mess (3 Meals/Day)</option>
              <option value="premium">Premium Mess (3 Meals/Day + Snacks)</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* --- BROADCAST COMPOSER MODAL --- */}
      <Modal
        isOpen={broadcastModal}
        onClose={() => setBroadcastModal(false)}
        title="Broadcast System Notice"
        maxWidth="max-w-lg"
        footer={
          <div className="flex justify-end gap-3 w-full">
            <button 
              type="button" 
              className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-danger" 
              onClick={() => setBroadcastModal(false)}
              disabled={broadcasting}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="broadcast-form"
              disabled={broadcasting}
              className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              {broadcasting ? 'Sending...' : 'Dispatch Broadcast'}
            </button>
          </div>
        }
      >
        <form id="broadcast-form" onSubmit={handleBroadcastSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Target Group / Hostels</label>
            <select
              className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer"
              value={broadcastTarget}
              onChange={(e) => setBroadcastTarget(e.target.value)}
            >
              <option value="All">All Tenants (Global)</option>
              {buildings.map(b => (
                <option key={b._id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Subject Title</label>
            <input
              type="text"
              className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary"
              value={broadcastSubject}
              onChange={(e) => setBroadcastSubject(e.target.value)}
              placeholder="e.g. Scheduled Power Outage"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Message Body</label>
            <textarea
              rows={5}
              className="w-full bg-background border border-divider rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary resize-none"
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Type your notice description here..."
              required
            />
          </div>
        </form>
      </Modal>

      {/* --- PREMIUM CONFIRMATION DIALOG --- */}
      <AnimatePresence>
        {confirmDialog.isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-divider rounded-3xl shadow-2xl p-8 w-full max-w-md text-center"
              onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-text-primary uppercase tracking-tight mb-2">{confirmDialog.title}</h3>
              <p className="text-sm text-text-muted mb-8 leading-relaxed">{confirmDialog.message}</p>
              <div className="flex gap-4">
                <button onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-3.5 bg-slate-50 dark:bg-white/5 border border-divider text-text-secondary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/10 transition-all">
                  Cancel
                </button>
                <button onClick={confirmDialog.onConfirm}
                  className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600 transition-all">
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tenants;
