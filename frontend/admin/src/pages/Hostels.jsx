import React, { useState, useEffect, useCallback } from 'react';
import {
   Building2, Plus, Search, Filter, MoreHorizontal,
   MapPin, Users, Activity, ArrowUpRight, Zap,
   TrendingUp, ShieldCheck, Home, Target, ChevronRight,
   Settings2, Download, Trash2, Edit3, Eye, Camera,
   CheckCircle2, AlertCircle, Wrench, BarChart3, Clock,
   DollarSign, PieChart as PieIcon, Layers, FileText, Calendar,
   ArrowLeft, Wifi, Coffee, Wind, Tv, Loader2
} from 'lucide-react';
import Modal from '../components/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';

const Hostels = () => {
   const navigate = useNavigate();
   const [activeModal, setActiveModal] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [currentStep, setCurrentStep] = useState(1);
   const [filterCity, setFilterCity] = useState('All');
   const [selectedHostel, setSelectedHostel] = useState(null);
   const [loading, setLoading] = useState(true);
   const [hostels, setHostels] = useState([]);
   const [platformStats, setPlatformStats] = useState(null);

   const fetchHostels = useCallback(async () => {
      setLoading(true);
      try {
         const [buildingsRes, statsRes] = await Promise.all([
            axios.get(`${API}/buildings`, { params: { search: searchTerm || undefined } }),
            axios.get(`${API}/stats`)
         ]);
         setHostels(buildingsRes.data.buildings || []);
         setPlatformStats(statsRes.data);
      } catch (err) {
         console.error('Failed to fetch buildings:', err);
      } finally {
         setLoading(false);
      }
   }, [searchTerm]);

   useEffect(() => { fetchHostels(); }, [fetchHostels]);

   const portfolioStats = [
      { label: 'Total Properties', value: platformStats?.totalBuildings?.toString() || '—', change: '+0', icon: <Building2 />, color: 'primary' },
      { label: 'Platform Rooms', value: platformStats?.totalRooms?.toString() || '—', change: '+0', icon: <Layers />, color: 'indigo' },
      { label: 'Available Beds', value: platformStats?.vacantBeds?.toString() || '—', change: 'Live', icon: <Users />, color: 'success' },
   ];

   const steps = [
      { id: 1, title: 'Details', icon: <FileText size={14} /> },
      { id: 2, title: 'Media', icon: <Camera size={14} /> },
      { id: 3, title: 'Pricing', icon: <DollarSign size={14} /> },
      { id: 4, title: 'Review', icon: <CheckCircle2 size={14} /> },
   ];

   const handleEdit = (hostel) => {
      setSelectedHostel(hostel);
      setActiveModal('edit');
      setCurrentStep(1);
   };

   const handleDelete = async (id) => {
      if (!window.confirm('Delete this building property?')) return;
      try {
         await axios.delete(`${API}/buildings/${id}`);
         fetchHostels();
      } catch (err) { console.error(err); }
   };

   if (selectedHostel && activeModal === 'details') {
      return (
         <div className="space-y-8 animate-fade pb-20">
            <button
               onClick={() => setSelectedHostel(null)}
               className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-black uppercase tracking-widest"
            >
               <ArrowLeft size={16} /> Back to Portfolio
            </button>

            <div className="grid grid-cols-12 gap-8">
               <div className="col-span-12 lg:col-span-8 space-y-8">
                  <div className="card-classic overflow-hidden">
                     <div className="h-80 relative bg-slate-900">
                        {selectedHostel.images?.[0] ? (
                           <img src={selectedHostel.images[0]} className="w-full h-full object-cover" alt="" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-white/20">
                              <Building2 size={80} />
                           </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-8 left-8 text-white">
                           <span className="px-3 py-1 bg-primary rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                              {selectedHostel.genderType} • {selectedHostel.category}
                           </span>
                           <h1 className="text-4xl font-black tracking-tight">{selectedHostel.name}</h1>
                           <p className="flex items-center gap-2 text-sm font-medium opacity-80 mt-2 italic">
                              <MapPin size={16} /> {selectedHostel.address}
                           </p>
                        </div>
                     </div>
                     <div className="p-8 grid grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-border/50">
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Structure</p>
                           <h4 className="text-2xl font-black text-text-primary italic">{selectedHostel.roomCount || 0} Rooms</h4>
                        </div>
                        <div className="text-center p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-border/50">
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Population</p>
                           <h4 className="text-2xl font-black text-primary italic">{selectedHostel.tenantCount || 0} Residents</h4>
                        </div>
                        <div className="text-center p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-border/50">
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Price Base</p>
                           <h4 className="text-2xl font-black text-success italic">₹{selectedHostel.startingPrice || '—'}</h4>
                        </div>
                     </div>
                  </div>

                  <div className="card-classic p-8">
                     <h3 className="text-lg font-black text-text-primary uppercase tracking-tight mb-8">Amenities Manifest</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {(selectedHostel.amenities?.length ? selectedHostel.amenities : ['Wifi', 'Security', 'Power Backup']).map((item, i) => (
                           <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border/50">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                 <Zap size={24} />
                              </div>
                              <span className="text-[11px] font-black text-text-secondary uppercase tracking-tight text-center">{item}</span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               <div className="col-span-12 lg:col-span-4 space-y-8">
                  <div className="card-classic p-8 bg-primary/5 border-primary/20">
                     <h3 className="text-lg font-black text-primary uppercase tracking-tight mb-6">Asset Ownership</h3>
                     <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-primary/10">
                           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase">
                              {(selectedHostel.owner?.name || 'A').charAt(0)}
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Registered Owner</p>
                              <p className="text-sm font-black text-text-primary">{selectedHostel.owner?.name || 'Admin Managed'}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-primary/10">
                           <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black"><ShieldCheck size={18} /></div>
                           <div>
                              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Trust Score</p>
                              <p className="text-sm font-black text-text-primary italic">{selectedHostel.safetyRating || 4.5}/5.0 Rated</p>
                           </div>
                        </div>
                     </div>
                     <div className="mt-8 pt-8 border-t border-primary/10 flex flex-col gap-3">
                        <button
                           onClick={() => handleEdit(selectedHostel)}
                           className="w-full py-3.5 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                        >
                           Modify Structure
                        </button>
                        <button className="w-full py-3.5 bg-white dark:bg-slate-900 border border-primary/20 text-primary rounded-xl text-[11px] font-black uppercase tracking-widest">
                           Generate Audit Log
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }

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

         {/* --- HEADER --- */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 className="text-3xl text-premium-header">Properties Portfolio</h1>
               <p className="text-sm text-text-muted mt-1 font-medium italic">Strategic asset management and operational monitoring</p>
            </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-[11px] font-black uppercase tracking-widest text-text-secondary hover:border-primary transition-all shadow-subtle">
                   <Download size={16} /> Audit Trail
                </button>
                <button
                   onClick={() => { setSelectedHostel(null); setActiveModal('add'); setCurrentStep(1); }}
                   className="btn-premium"
                >
                   <Plus size={18} strokeWidth={3} /> Add Property
                </button>
            </div>
         </div>

         {/* --- PORTFOLIO STATS --- */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioStats.map((stat, i) => (
               <div key={i} className="card-classic p-6 flex items-center gap-5 group border-none glass-effect">
                  <div className={`w-14 h-14 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} flex items-center justify-center border border-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 group-hover:shadow-glow transition-all duration-300`}>
                     {React.cloneElement(stat.icon, { size: 24, strokeWidth: 2.5 })}
                  </div>
                  <div>
                     <p className="text-premium-label mb-1">{stat.label}</p>
                     <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-text-primary tracking-tighter italic">{stat.value}</h3>
                        <span className="text-[10px] font-black text-success bg-success/10 px-2 py-0.5 rounded-lg border border-success/20">{stat.change}</span>
                     </div>
                  </div>
               </div>
            ))}
         </div>

         {/* --- FILTERS & SEARCH --- */}
         <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative flex items-center group">
               <Search className="absolute left-4 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
               <input
                  type="text"
                  className="w-full bg-card border border-border rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary shadow-subtle"
                  placeholder="Search properties by name, location or manager..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <div className="flex gap-3">
               <select
                  className="bg-card border border-border rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-widest text-text-primary outline-none focus:border-primary shadow-subtle cursor-pointer"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
               >
                  <option>All Cities</option>
                  <option>Bangalore</option>
                  <option>Hyderabad</option>
                  <option>Pune</option>
               </select>
                <button className="flex items-center gap-2 px-6 py-3.5 bg-card border border-border rounded-xl text-xs font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-all shadow-subtle">
                   <Filter size={16} /> Filters
                </button>
            </div>
         </div>

         {/* --- PROPERTY GRID --- */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {loading ? (
               <div className="col-span-full py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                     <Loader2 size={40} className="animate-spin text-primary opacity-20" />
                     <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Synchronizing Asset Repository...</p>
                  </div>
               </div>
            ) : hostels.length === 0 ? (
               <div className="col-span-full py-20 text-center text-text-muted">
                  <Building2 size={48} className="mx-auto mb-4 opacity-10" />
                  <p className="font-bold uppercase tracking-widest text-xs italic italic">No assets detected in the current grid</p>
               </div>
            ) : hostels.map((h) => (
               <motion.div
                  key={h._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-classic group flex flex-col overflow-hidden relative"
               >
                  <div className="relative h-56 overflow-hidden bg-slate-900">
                     {h.images?.[0] ? (
                        <img src={h.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={h.name} />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 group-hover:scale-110 transition-transform duration-700">
                           <Building2 size={64} />
                        </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                     <div className="absolute top-4 right-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-xl ${h.status === 'Active' ? 'bg-success/80 text-white' : 'bg-warning/80 text-white'}`}>
                           {h.status || 'Active'}
                        </span>
                     </div>

                     <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                        <button
                           onClick={() => { setSelectedHostel(h); setActiveModal('details'); }}
                           className="px-8 py-3 bg-white text-primary rounded-xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform"
                        >
                           Explore Property
                        </button>
                        <div className="flex gap-4 mt-4">
                           <button onClick={() => handleEdit(h)} className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/30 transition-all">
                              <Edit3 size={18} />
                           </button>
                           <button onClick={() => handleDelete(h._id)} className="p-3 bg-rose-500/20 backdrop-blur-md border border-rose-500/40 text-rose-500 rounded-xl hover:bg-rose-500/40 transition-all">
                              <Trash2 size={18} />
                           </button>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 space-y-6">
                     <div className="flex justify-between items-start">
                        <div className="min-w-0">
                           <h3 className="text-xl font-black text-text-primary tracking-tight leading-tight truncate uppercase italic">{h.name}</h3>
                           <div className="flex items-center gap-1.5 text-text-muted text-[11px] font-bold uppercase tracking-wide mt-1 italic">
                              <MapPin size={12} className="text-primary shrink-0" /> {h.address?.substring(0, 30)}...
                           </div>
                        </div>
                        <div className="text-right shrink-0">
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 leading-none">Trust</p>
                           <div className="flex items-center gap-1 text-success font-black text-sm italic">
                              <TrendingUp size={14} /> {h.safetyRating || 4.5}
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/50">
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 leading-none">Structure</p>
                           <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-xl font-black text-text-primary italic">{h.roomCount || 0}</span>
                              <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Rooms</span>
                           </div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/50">
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 leading-none">Yield Base</p>
                           <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-xl font-black text-text-primary italic">₹{(h.startingPrice / 1000).toFixed(1)}k</span>
                              <span className="text-[9px] font-black text-success uppercase italic">/mo</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex gap-2">
                           <div className="w-7 h-7 rounded-lg bg-background border border-border/50 flex items-center justify-center text-text-muted">
                              <Wifi size={14} />
                           </div>
                           <div className="w-7 h-7 rounded-lg bg-background border border-border/50 flex items-center justify-center text-text-muted">
                              <Coffee size={14} />
                           </div>
                           <div className="w-7 h-7 rounded-lg bg-background border border-border/50 flex items-center justify-center text-text-muted">
                              <Wind size={14} />
                           </div>
                        </div>
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest italic opacity-50">#{h._id.substring(18)}</span>
                     </div>
                  </div>
               </motion.div>
            ))}

            <motion.div
               onClick={() => { setSelectedHostel(null); setActiveModal('add'); setCurrentStep(1); }}
               whileHover={{ scale: 1.02 }}
               className="card-classic border-dashed border-2 hover:border-primary/50 flex flex-col items-center justify-center p-12 gap-5 group cursor-pointer transition-all bg-primary/5 min-h-[480px]"
            >
               <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 border border-border flex items-center justify-center text-text-muted group-hover:text-primary group-hover:rotate-90 transition-all duration-500 shadow-sm">
                  <Plus size={40} strokeWidth={2.5} />
               </div>
               <div className="text-center">
                  <h3 className="text-2xl font-black text-text-primary tracking-tight uppercase italic">Scale Portfolio</h3>
                  <p className="text-[11px] text-text-muted mt-2 max-w-[240px] font-bold uppercase tracking-[0.2em] leading-relaxed">Initialize new strategic property node.</p>
               </div>
            </motion.div>
         </div>

         {/* Placeholder for Add/Edit Modals (using simplified logic for now) */}
         <Modal isOpen={activeModal === 'add' || activeModal === 'edit'} onClose={() => setActiveModal(null)} title={activeModal === 'add' ? "New Asset Initialization" : "Modify Property Meta"}>
            <div className="p-10 text-center space-y-6">
               <ShieldCheck size={48} className="mx-auto text-success" />
               <h3 className="text-xl font-black text-text-primary uppercase tracking-tight italic">Structural Node Configuration</h3>
               <p className="text-sm text-text-muted leading-relaxed font-medium">The management interface for this property is fully synchronized. You can now monitor occupancy, revenue, and safety ratings in real-time.</p>
               <button onClick={() => setActiveModal(null)} className="btn-premium">Confirm & Close</button>
            </div>
         </Modal>
      </div>
   );
};

export default Hostels;
