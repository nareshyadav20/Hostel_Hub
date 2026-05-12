import React, { useState } from 'react';
import {
   Building2, Plus, Search, Filter, MoreHorizontal,
   MapPin, Users, Activity, ArrowUpRight, Zap,
   TrendingUp, ShieldCheck, Home, Target, ChevronRight,
   Settings2, Download, Trash2, Edit3, Eye, Camera,
   CheckCircle2, AlertCircle, Wrench, BarChart3, Clock,
   DollarSign, PieChart as PieIcon, Layers, FileText, Calendar,
   ArrowLeft, Wifi, Coffee, Wind, Tv
} from 'lucide-react';
import Modal from '../components/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hostels = () => {
   const navigate = useNavigate();
   const [activeModal, setActiveModal] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [currentStep, setCurrentStep] = useState(1);
   const [filterCity, setFilterCity] = useState('All');
   const [selectedHostel, setSelectedHostel] = useState(null);
   const [userRole] = useState('admin'); // Mock role for access control

   const [hostels, setHostels] = useState([
      {
         id: 1,
         name: 'Sapphire Men\'s PG',
         location: 'Koramangala, Bangalore',
         type: 'Premium PG',
         capacity: 120,
         occupancy: 85,
         status: 'Active',
         revenue: '4.2L',
         maintenance: '45K',
         amenities: ['High-speed Wifi', 'Laundry', 'Parking'],
         image: 'https://images.unsplash.com/photo-1555854817-5b2260d50c63?auto=format&fit=crop&q=80&w=800'
      },
      {
         id: 2,
         name: 'Royal Ladies Nest',
         location: 'HSR Layout, Bangalore',
         type: 'Luxury Hostel',
         capacity: 80,
         occupancy: 78,
         status: 'Full',
         revenue: '3.8L',
         maintenance: '32K',
         amenities: ['AC Rooms', 'Gym', 'Shared Kitchen'],
         image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'
      },
      {
         id: 3,
         name: 'Metro Living Space',
         location: 'Indiranagar, Bangalore',
         type: 'Executive PG',
         capacity: 150,
         occupancy: 42,
         status: 'Maintenance',
         revenue: '1.1L',
         maintenance: '85K',
         amenities: ['Gaming Room', 'Backup Power', 'Security'],
         image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800'
      },
      {
         id: 4,
         name: 'Green Valley Suites',
         location: 'Viman Nagar, Pune',
         type: 'Apartment PG',
         capacity: 60,
         occupancy: 60,
         status: 'Active',
         revenue: '2.9L',
         maintenance: '18K',
         amenities: ['Balcony', 'Modular Kitchen', 'Gated Community'],
         image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'
      },
   ]);

   const portfolioStats = [
      { label: 'Total Properties', value: hostels.length.toString(), change: '+2', icon: <Building2 />, color: 'primary' },
      { label: 'Portfolio Occupancy', value: '86.4%', change: '+4.2%', icon: <Users />, color: 'success' },
      { label: 'Monthly Yield', value: '₹54.2L', change: '+12%', icon: <TrendingUp />, color: 'indigo' },
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

   const handleDelete = (id) => {
      if (userRole !== 'admin') return;
      setHostels(hostels.filter(h => h.id !== id));
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
                     <div className="h-80 relative">
                        <img src={selectedHostel.image} className="w-full h-full object-cover" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-8 left-8 text-white">
                           <span className="px-3 py-1 bg-primary rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 inline-block">
                              {selectedHostel.type}
                           </span>
                           <h1 className="text-4xl font-black tracking-tight">{selectedHostel.name}</h1>
                           <p className="flex items-center gap-2 text-sm font-medium opacity-80 mt-2">
                              <MapPin size={16} /> {selectedHostel.location}
                           </p>
                        </div>
                     </div>
                     <div className="p-8 grid grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-border/50">
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Capacity</p>
                           <h4 className="text-2xl font-black text-text-primary italic">{selectedHostel.capacity} Beds</h4>
                        </div>
                        <div className="text-center p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-border/50">
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Occupancy</p>
                           <h4 className="text-2xl font-black text-primary italic">{selectedHostel.occupancy}%</h4>
                        </div>
                        <div className="text-center p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-border/50">
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Revenue</p>
                           <h4 className="text-2xl font-black text-success italic">₹{selectedHostel.revenue}</h4>
                        </div>
                     </div>
                  </div>

                  <div className="card-classic p-8">
                     <h3 className="text-lg font-black text-text-primary uppercase tracking-tight mb-8">Amenities & Features</h3>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {selectedHostel.amenities.map((item, i) => (
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
                     <h3 className="text-lg font-black text-primary uppercase tracking-tight mb-6">Management Cluster</h3>
                     <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-primary/10">
                           <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">VK</div>
                           <div>
                              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Operations Lead</p>
                              <p className="text-sm font-black text-text-primary">Vikram Malhotra</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-primary/10">
                           <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black"><Clock size={18} /></div>
                           <div>
                              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Deployment Status</p>
                              <p className="text-sm font-black text-text-primary">Active since 2024</p>
                           </div>
                        </div>
                     </div>
                     <div className="mt-8 pt-8 border-t border-primary/10 flex flex-col gap-3">
                        <button
                           onClick={() => handleEdit(selectedHostel)}
                           className="w-full py-3.5 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                        >
                           Initialize Edit
                        </button>
                        <button className="w-full py-3.5 bg-white dark:bg-slate-900 border border-primary/20 text-primary rounded-xl text-[11px] font-black uppercase tracking-widest">
                           Generate Report
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
               <h1 className="text-3xl font-black text-text-primary tracking-tight">Properties Portfolio</h1>
               <p className="text-sm text-text-muted mt-1 font-medium italic">Strategic asset management and operational monitoring</p>
            </div>
            <div className="flex items-center gap-3">
               <button className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-[11px] font-black uppercase tracking-widest text-text-secondary hover:border-primary transition-all shadow-subtle">
                  <Download size={16} /> Audit Trail
               </button>
               {userRole === 'admin' && (
                  <button
                     onClick={() => { setSelectedHostel(null); setActiveModal('add'); setCurrentStep(1); }}
                     className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  >
                     <Plus size={18} strokeWidth={3} /> Add Property
                  </button>
               )}
            </div>
         </div>

         {/* --- PORTFOLIO STATS --- */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {portfolioStats.map((stat, i) => (
               <div key={i} className="card-classic p-6 flex items-center gap-5 group">
                  <div className={`w-14 h-14 rounded-2xl bg-${stat.color}/5 text-${stat.color} flex items-center justify-center border border-${stat.color}/10 group-hover:shadow-glow transition-all duration-300`}>
                     {React.cloneElement(stat.icon, { size: 24, strokeWidth: 2.5 })}
                  </div>
                  <div>
                     <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                     <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-black text-text-primary tracking-tight italic">{stat.value}</h3>
                        <span className="text-[10px] font-black text-success bg-success/10 px-2 py-0.5 rounded-lg">{stat.change}</span>
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
                  <option>Pune</option>
                  <option>Mumbai</option>
               </select>
               <button className="flex items-center gap-2 px-6 py-3.5 bg-card border border-border rounded-xl text-xs font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-all shadow-subtle">
                  <Filter size={16} /> More Filters
               </button>
            </div>
         </div>

         {/* --- PROPERTY GRID --- */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {hostels.map((h) => (
               <motion.div
                  key={h.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-classic group flex flex-col overflow-hidden relative"
               >
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden">
                     <img src={h.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={h.name} />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                     {/* Status Badge */}
                     <div className="absolute top-4 right-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-xl ${h.status === 'Active' ? 'bg-success/80 text-white' : h.status === 'Full' ? 'bg-indigo-500/80 text-white' : 'bg-warning/80 text-white'
                           }`}>
                           {h.status}
                        </span>
                     </div>

                     {/* Interaction Overlay */}
                     <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                        <button
                           onClick={() => { setSelectedHostel(h); setActiveModal('details'); }}
                           className="px-8 py-3 bg-white text-primary rounded-xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-transform"
                        >
                           View Portfolio
                        </button>
                        <div className="flex gap-4 mt-4">
                           <button onClick={() => handleEdit(h)} className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/30 transition-all">
                              <Edit3 size={18} />
                           </button>
                           {userRole === 'admin' && (
                              <button onClick={() => handleDelete(h.id)} className="p-3 bg-rose-500/20 backdrop-blur-md border border-rose-500/40 text-rose-500 rounded-xl hover:bg-rose-500/40 transition-all">
                                 <Trash2 size={18} />
                              </button>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 space-y-6">
                     <div className="flex justify-between items-start">
                        <div className="min-w-0">
                           <h3 className="text-xl font-black text-text-primary tracking-tight leading-tight truncate">{h.name}</h3>
                           <div className="flex items-center gap-1.5 text-text-muted text-[11px] font-bold uppercase tracking-wide mt-1 italic">
                              <MapPin size={12} className="text-primary shrink-0" /> {h.location}
                           </div>
                        </div>
                        <div className="text-right shrink-0">
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Performance</p>
                           <div className="flex items-center gap-1 text-success font-black text-sm italic">
                              <TrendingUp size={14} /> 94%
                           </div>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/50">
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 leading-none">Occupancy</p>
                           <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-xl font-black text-text-primary italic">{h.occupancy}%</span>
                              <span className="text-[10px] font-bold text-text-muted">/ {h.capacity}</span>
                           </div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/50">
                           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 leading-none">Monthly Rev</p>
                           <div className="flex items-baseline gap-1 mt-1">
                              <span className="text-xl font-black text-text-primary italic">₹{h.revenue}</span>
                              <span className="text-[9px] font-black text-success uppercase">Up</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex gap-2">
                           {h.amenities.slice(0, 3).map((a, i) => (
                              <div key={i} className="w-7 h-7 rounded-lg bg-background border border-border/50 flex items-center justify-center text-text-muted" title={a}>
                                 {i === 0 ? <Wifi size={14} /> : i === 1 ? <Wind size={14} /> : <Coffee size={14} />}
                              </div>
                           ))}
                        </div>
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest italic opacity-50">#{h.id}xAsset</span>
                     </div>
                  </div>
               </motion.div>
            ))}

            {/* --- ADD NEW PROPERTY CARD --- */}
            {userRole === 'admin' && (
               <motion.div
                  onClick={() => { setSelectedHostel(null); setActiveModal('add'); setCurrentStep(1); }}
                  whileHover={{ scale: 1.02 }}
                  className="card-classic border-dashed border-2 hover:border-primary/50 flex flex-col items-center justify-center p-12 gap-5 group cursor-pointer transition-all bg-primary/5 min-h-[480px]"
               >
                  <div className="w-20 h-20 rounded-3xl bg-white dark:bg-slate-800 border border-border flex items-center justify-center text-text-muted group-hover:text-primary group-hover:rotate-90 transition-all duration-500 shadow-sm">
                     <Plus size={40} strokeWidth={2.5} />
                  </div>
                  <div className="text-center">
                     <h3 className="text-2xl font-black text-text-primary tracking-tight uppercase italic">Expand Portfolio</h3>
                     <p className="text-[11px] text-text-muted mt-2 max-w-[240px] font-bold uppercase tracking-[0.2em] leading-relaxed">Initialize a new strategic node.</p>
                  </div>
               </motion.div>
            )}
         </div>

         {/* --- ADD/EDIT PROPERTY MODAL --- */}
         <Modal
            isOpen={activeModal === 'add' || activeModal === 'edit'}
            onClose={() => setActiveModal(null)}
            title={activeModal === 'add' ? "Initialize New Property" : `Modify ${selectedHostel?.name}`}
            maxWidth="max-w-2xl"
            footer={
               <div className="flex justify-between items-center w-full">
                  <button
                     disabled={currentStep === 1}
                     onClick={() => setCurrentStep(prev => prev - 1)}
                     className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'text-text-primary hover:text-primary'
                        }`}
                  >
                     Previous Stage
                  </button>
                  <div className="flex gap-3">
                     <button className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-danger" onClick={() => setActiveModal(null)}>Abort</button>
                     {currentStep < 4 ? (
                        <button
                           onClick={() => setCurrentStep(prev => prev + 1)}
                           className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all"
                        >
                           Continue Execution
                        </button>
                     ) : (
                        <button
                           onClick={() => setActiveModal(null)}
                           className="px-8 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
                        >
                           Confirm Sync
                        </button>
                     )}
                  </div>
               </div>
            }
         >
            <div className="py-6 space-y-10">
               {/* Step Indicator */}
               <div className="flex items-center justify-between px-4 relative">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
                  {steps.map((s) => (
                     <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${currentStep >= s.id ? 'bg-primary border-primary text-white shadow-glow' : 'bg-card border-border text-text-muted'
                           }`}>
                           {currentStep > s.id ? <CheckCircle2 size={18} /> : s.icon}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${currentStep >= s.id ? 'text-primary' : 'text-text-muted'
                           }`}>{s.title}</span>
                     </div>
                  ))}
               </div>

               {/* Step Content */}
               <div className="min-h-[340px]">
                  <AnimatePresence mode="wait">
                     {currentStep === 1 && (
                        <motion.div
                           key="step1"
                           initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                           className="space-y-6"
                        >
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Identity</label>
                                 <input className="w-full bg-background border border-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" defaultValue={selectedHostel?.name} placeholder="e.g. Sapphire Heights" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Category</label>
                                 <select className="w-full bg-background border border-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer" defaultValue={selectedHostel?.type}>
                                    <option>Premium PG</option>
                                    <option>Standard Hostel</option>
                                    <option>Executive Suites</option>
                                 </select>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Geographical Hub</label>
                              <div className="relative flex items-center group">
                                 <MapPin className="absolute left-4 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                 <input className="w-full bg-background border border-border rounded-xl py-3.5 pl-12 pr-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" defaultValue={selectedHostel?.location} placeholder="Enter full address or city..." />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Amenities</label>
                              <div className="flex flex-wrap gap-2 pt-2">
                                 {['Wifi', 'AC', 'Gym', 'Laundry', 'Parking', 'Kitchen'].map(a => (
                                    <label key={a} className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg cursor-pointer hover:border-primary transition-all">
                                       <input type="checkbox" className="w-4 h-4 rounded accent-primary" defaultChecked={selectedHostel?.amenities.includes(a)} />
                                       <span className="text-[11px] font-black uppercase tracking-tight text-text-secondary">{a}</span>
                                    </label>
                                 ))}
                              </div>
                           </div>
                        </motion.div>
                     )}

                     {currentStep === 2 && (
                        <motion.div
                           key="step2"
                           initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                           className="space-y-8 text-center"
                        >
                           <div className="border-2 border-dashed border-border rounded-3xl p-12 bg-slate-50 dark:bg-white/5 group hover:border-primary transition-all cursor-pointer">
                              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform">
                                 <Camera size={40} />
                              </div>
                              <h4 className="text-xl font-black text-text-primary tracking-tight">Media Hub</h4>
                              <p className="text-[11px] text-text-muted uppercase tracking-widest mt-2 font-bold">Upload high-resolution property identity</p>
                              <button className="mt-8 px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                 Capture Media
                              </button>
                           </div>
                           {selectedHostel && (
                              <div className="relative aspect-video rounded-3xl overflow-hidden border border-border shadow-premium group">
                                 <img src={selectedHostel.image} className="w-full h-full object-cover" alt="" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button className="p-3 bg-white text-primary rounded-xl font-black text-[10px] uppercase tracking-widest">Update Photo</button>
                                 </div>
                              </div>
                           )}
                        </motion.div>
                     )}

                     {currentStep === 3 && (
                        <motion.div
                           key="step3"
                           initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                           className="space-y-6"
                        >
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Max Capacity</label>
                                 <input type="number" className="w-full bg-background border border-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" defaultValue={selectedHostel?.capacity} placeholder="00" />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Base Rental (Monthly)</label>
                                 <input className="w-full bg-background border border-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" defaultValue={selectedHostel?.revenue} placeholder="₹ 0.00" />
                              </div>
                           </div>
                           <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4 items-center">
                              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                                 <Zap size={20} />
                              </div>
                              <div className="flex-1">
                                 <p className="text-[11px] font-black text-text-primary uppercase tracking-tight">Dynamic Allocation</p>
                                 <p className="text-[10px] text-text-muted italic leading-relaxed font-medium">Smart pricing logic will be initialized upon deployment based on local demand markers.</p>
                              </div>
                           </div>
                        </motion.div>
                     )}

                     {currentStep === 4 && (
                        <motion.div
                           key="step4"
                           initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                           className="flex flex-col items-center justify-center py-10 text-center"
                        >
                           <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center text-success mb-8 shadow-glow animate-pulse">
                              <ShieldCheck size={50} />
                           </div>
                           <h4 className="text-3xl font-black text-text-primary tracking-tight italic">Protocol Validated</h4>
                           <p className="text-[11px] text-text-muted uppercase tracking-[0.2em] mt-3 max-w-[340px] leading-relaxed font-bold">The property node parameters have been synchronized for secure deployment.</p>
                        </motion.div>
                     )}
                  </AnimatePresence>
                              </div>
            </div>
         </Modal>
      </div>
   );
};

export default Hostels;
