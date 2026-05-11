import React, { useState } from 'react';
import { 
  Search, Filter, BedDouble, CheckCircle, XCircle, 
  MoreHorizontal, Home, Users, Building, Plus,
  Wrench, Activity, Trash2, Edit3, Eye, Calendar,
  ArrowUpRight, TrendingUp, DollarSign, Layers,
  ChevronRight, ArrowLeft, ShieldCheck, CheckCircle2,
  FileText, Clock, MapPin, Zap, Download
} from 'lucide-react';
import Modal from '../components/Modal';
import { motion, AnimatePresence } from 'framer-motion';

const Rooms = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [userRole] = useState('admin'); // Mock role for RBAC

  const [rooms, setRooms] = useState([
    { id: '101', type: 'Premium Double', property: 'Sapphire PG', occupants: 2, capacity: 2, status: 'Occupied', price: '₹12,000', floor: '1st Floor', amenities: ['AC', 'Attached Bath', 'Balcony'] },
    { id: '102', type: 'Elite Single', property: 'Sapphire PG', occupants: 0, capacity: 1, status: 'Available', price: '₹18,000', floor: '1st Floor', amenities: ['AC', 'TV', 'Fridge'] },
    { id: '201', type: 'Standard Triple', property: 'Elite Living', occupants: 2, capacity: 3, status: 'Occupied', price: '₹10,000', floor: '2nd Floor', amenities: ['Fan', 'Locker'] },
    { id: '202', type: 'Executive Double', property: 'Elite Living', occupants: 1, capacity: 2, status: 'Maintenance', price: '₹12,000', floor: '2nd Floor', amenities: ['AC', 'Wifi'] },
    { id: '301', type: 'Luxury Suite', property: 'Tech Park PG', occupants: 1, capacity: 1, status: 'Occupied', price: '₹22,000', floor: '3rd Floor', amenities: ['Full Kitchen', 'King Bed'] },
    { id: '302', type: 'Premium Single', property: 'Tech Park PG', occupants: 0, capacity: 1, status: 'Available', price: '₹16,000', floor: '3rd Floor', amenities: ['AC', 'Desk'] },
  ]);

  const inventoryStats = [
    { label: 'Total Units', value: '456', change: '+12', icon: <Building />, color: 'primary' },
    { label: 'Live Occupancy', value: '88.4%', change: '+4.2%', icon: <Activity />, color: 'success' },
    { label: 'Ready to Deploy', value: '42', change: '-3', icon: <CheckCircle />, color: 'indigo' },
  ];

  const steps = [
    { id: 1, title: 'Identity', icon: <FileText size={14} /> },
    { id: 2, title: 'Capacity', icon: <Users size={14} /> },
    { id: 3, title: 'Pricing', icon: <DollarSign size={14} /> },
    { id: 4, title: 'Confirm', icon: <CheckCircle2 size={14} /> },
  ];

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setActiveModal('edit');
    setCurrentStep(1);
  };

  const handleDelete = (id) => {
    if (userRole !== 'admin') return;
    setRooms(rooms.filter(r => r.id !== id));
  };

  if (selectedRoom && activeModal === 'details') {
    return (
      <div className="space-y-8 animate-fade pb-20">
         <button 
          onClick={() => setSelectedRoom(null)}
          className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-black uppercase tracking-widest"
        >
           <ArrowLeft size={16} /> Back to Inventory
         </button>

         <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-8">
               <div className="card-classic p-8">
                  <div className="flex justify-between items-start mb-10">
                     <div className="flex gap-6 items-center">
                        <div className="w-20 h-20 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shadow-sm">
                           <Home size={36} strokeWidth={2.5} />
                        </div>
                        <div>
                           <h1 className="text-4xl font-black text-text-primary tracking-tight">Room {selectedRoom.id}</h1>
                           <p className="text-sm font-bold text-text-muted mt-1 uppercase tracking-wider">{selectedRoom.type} • {selectedRoom.property}</p>
                        </div>
                     </div>
                     <span className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest border ${
                        selectedRoom.status === 'Occupied' ? 'bg-success/10 text-success border-success/20' : 
                        selectedRoom.status === 'Available' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 
                        'bg-warning/10 text-warning border-warning/20'
                     }`}>
                        {selectedRoom.status}
                     </span>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-12">
                     <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border/50 text-center">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Occupants</p>
                        <h4 className="text-2xl font-black text-text-primary italic">{selectedRoom.occupants}/{selectedRoom.capacity}</h4>
                     </div>
                     <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border/50 text-center">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Monthly Yield</p>
                        <h4 className="text-2xl font-black text-text-primary italic">{selectedRoom.price}</h4>
                     </div>
                     <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border/50 text-center">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Location Node</p>
                        <h4 className="text-2xl font-black text-text-primary italic">{selectedRoom.floor}</h4>
                     </div>
                  </div>

                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight mb-8">Asset Inventory</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {selectedRoom.amenities.map((item, i) => (
                       <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border/50 group hover:border-primary transition-all">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                             <Zap size={24} />
                          </div>
                          <span className="text-[11px] font-black text-text-secondary uppercase tracking-tight text-center">{item}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="card-classic p-8">
                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight mb-8">Service & Maintenance Logs</h3>
                  <div className="space-y-4">
                     {[
                        { date: '12 May, 2024', event: 'AC Filter Sanitization', status: 'Completed', user: 'Ops Lead' },
                        { date: '28 April, 2024', event: 'New Occupant Checklist', status: 'Verified', user: 'System' },
                     ].map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border group hover:border-primary/20 transition-all">
                           <div className="flex gap-4 items-center">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-text-muted"><Wrench size={16} /></div>
                              <div>
                                 <p className="text-[13px] font-black text-text-primary">{log.event}</p>
                                 <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{log.date} • {log.user}</p>
                              </div>
                           </div>
                           <span className="text-[10px] font-black text-success uppercase tracking-widest">{log.status}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-8">
               <div className="card-classic p-8 bg-indigo-500/5 border-indigo-500/20">
                  <h3 className="text-lg font-black text-indigo-500 uppercase tracking-tight mb-6">Inventory Controls</h3>
                  <div className="space-y-4 flex flex-col">
                     <button className="w-full py-4 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                        Assign New Resident
                     </button>
                     <button className="w-full py-4 bg-white dark:bg-slate-900 border border-primary/20 text-primary rounded-xl text-[11px] font-black uppercase tracking-widest">
                        Schedule Maintenance
                     </button>
                     <div className="pt-4 border-t border-indigo-500/10">
                        <button 
                          onClick={() => handleEdit(selectedRoom)}
                          className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors"
                        >
                           Edit Room Parameters
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20 animate-fade">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Room Inventory</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Global oversight of living units, occupancy vectors, and service states.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-5 py-2.5 bg-card border border-border rounded-xl text-[11px] font-black uppercase tracking-widest text-text-secondary hover:border-primary transition-all shadow-subtle">
             <Download size={16} /> Inventory Audit
           </button>
           {userRole === 'admin' && (
             <button 
              onClick={() => { setSelectedRoom(null); setActiveModal('add'); setCurrentStep(1); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
               <Plus size={18} strokeWidth={3} /> Add Unit
             </button>
           )}
        </div>
      </div>

      {/* --- STATS CLUSTER --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {inventoryStats.map((stat, i) => (
          <div key={i} className="card-classic p-6 flex items-center gap-5 group">
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}/5 text-${stat.color} flex items-center justify-center border border-${stat.color}/10 group-hover:rotate-12 transition-all duration-500`}>
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
               placeholder="Search units by number, property or resident identity..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex gap-3">
            <select className="bg-card border border-border rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-widest text-text-primary outline-none focus:border-primary shadow-subtle cursor-pointer">
               <option>All Properties</option>
               <option>Sapphire PG</option>
               <option>Elite Living</option>
            </select>
            <button className="flex items-center gap-2 px-6 py-3.5 bg-card border border-border rounded-xl text-xs font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-all shadow-subtle">
               <Filter size={16} /> Filters
            </button>
         </div>
      </div>

      {/* --- ROOM GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <motion.div 
            key={room.id} 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-classic group flex flex-col overflow-hidden"
          >
            <div className="p-6">
               <div className="flex justify-between items-start mb-8">
                  <div>
                     <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-widest">Node {room.id}</span>
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest italic opacity-50">{room.floor}</span>
                     </div>
                     <h3 className="text-xl font-black text-text-primary tracking-tight leading-tight">{room.type}</h3>
                     <p className="text-[11px] font-black text-text-muted uppercase tracking-widest mt-1">{room.property}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                    room.status === 'Occupied' ? 'bg-success/10 text-success border-success/20' : 
                    room.status === 'Available' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' : 
                    'bg-warning/10 text-warning border-warning/20'
                  }`}>
                    {room.status}
                  </span>
               </div>

               <div className="space-y-6">
                  {/* Occupancy Indicator */}
                  <div className="space-y-2">
                     <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <Users size={12} className="text-text-muted" />
                           <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Residents</span>
                        </div>
                        <span className="text-[11px] font-black text-text-primary italic">{room.occupants}/{room.capacity} Units</span>
                     </div>
                     <div className="w-full h-1.5 bg-background border border-border/50 rounded-full overflow-hidden">
                        <div 
                           className={`h-full transition-all duration-1000 ${
                              room.status === 'Occupied' ? 'bg-success' : 'bg-primary'
                           }`} 
                           style={{ width: `${(room.occupants/room.capacity)*100}%` }}
                        />
                     </div>
                  </div>

                  {/* Monthly Yield */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-border/50">
                     <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-text-muted" />
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Monthly Rate</span>
                     </div>
                     <span className="text-sm font-black text-text-primary italic">{room.price}</span>
                  </div>
               </div>
            </div>

            <div className="mt-auto px-6 py-4 bg-background/50 border-t border-border/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
               <button 
                onClick={() => { setSelectedRoom(room); setActiveModal('details'); }}
                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
              >
                Inspect Node
              </button>
               <div className="flex items-center gap-3">
                  <button onClick={() => handleEdit(room)} className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary transition-all"><Edit3 size={14} /></button>
                  {userRole === 'admin' && (
                    <button onClick={() => handleDelete(room.id)} className="p-2 rounded-lg hover:bg-rose-500/10 text-text-muted hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                  )}
               </div>
            </div>
          </motion.div>
        ))}

        {/* --- ADD NEW UNIT CARD --- */}
        {userRole === 'admin' && (
          <motion.div 
            onClick={() => { setSelectedRoom(null); setActiveModal('add'); setCurrentStep(1); }}
            whileHover={{ scale: 1.02 }}
            className="card-classic border-dashed border-2 hover:border-primary/50 flex flex-col items-center justify-center p-12 gap-5 group cursor-pointer transition-all bg-primary/5 min-h-[380px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-border flex items-center justify-center text-text-muted group-hover:text-primary group-hover:scale-110 transition-all duration-500 shadow-sm">
              <Plus size={32} strokeWidth={2.5} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-text-primary tracking-tight uppercase italic">Deploy New Unit</h3>
              <p className="text-[11px] text-text-muted mt-2 max-w-[200px] font-bold uppercase tracking-[0.2em] leading-relaxed">Initialize a new living node.</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* --- ADD/EDIT UNIT MODAL --- */}
      <Modal 
        isOpen={activeModal === 'add' || activeModal === 'edit'} 
        onClose={() => setActiveModal(null)}
        title={activeModal === 'add' ? "Initialize New Unit" : `Modify Unit ${selectedRoom?.id}`}
        maxWidth="max-w-2xl"
      >
        <div className="py-6 space-y-10">
           {/* Step Indicator */}
           <div className="flex items-center justify-between px-4 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
              {steps.map((s) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${
                     currentStep >= s.id ? 'bg-primary border-primary text-white shadow-glow' : 'bg-card border-border text-text-muted'
                   }`}>
                      {currentStep > s.id ? <CheckCircle2 size={18} /> : s.icon}
                   </div>
                   <span className={`text-[9px] font-black uppercase tracking-widest ${
                     currentStep >= s.id ? 'text-primary' : 'text-text-muted'
                   }`}>{s.title}</span>
                </div>
              ))}
           </div>

           {/* Step Content */}
           <div className="min-h-[300px]">
              <AnimatePresence mode="wait">
                 {currentStep === 1 && (
                   <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                   >
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Unit Number</label>
                            <input className="w-full bg-background border border-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" defaultValue={selectedRoom?.id} placeholder="e.g. 101" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Unit Category</label>
                            <select className="w-full bg-background border border-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer" defaultValue={selectedRoom?.type}>
                               <option>Premium Double</option>
                               <option>Elite Single</option>
                               <option>Standard Triple</option>
                               <option>Executive Suite</option>
                            </select>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Asset Property</label>
                         <select className="w-full bg-background border border-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer" defaultValue={selectedRoom?.property}>
                            <option>Sapphire PG</option>
                            <option>Elite Living</option>
                            <option>Tech Park PG</option>
                         </select>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Location (Floor)</label>
                            <input className="w-full bg-background border border-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" defaultValue={selectedRoom?.floor} placeholder="e.g. 2nd Floor" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Deployment Status</label>
                            <select className="w-full bg-background border border-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer" defaultValue={selectedRoom?.status}>
                               <option>Available</option>
                               <option>Occupied</option>
                               <option>Maintenance</option>
                            </select>
                         </div>
                      </div>
                   </motion.div>
                 )}

                 {currentStep === 2 && (
                   <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                   >
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Max Capacity (Beds)</label>
                            <input type="number" className="w-full bg-background border border-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" defaultValue={selectedRoom?.capacity} placeholder="0" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Current Occupants</label>
                            <input type="number" className="w-full bg-background border border-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" defaultValue={selectedRoom?.occupants} placeholder="0" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Asset Amenities</label>
                         <div className="flex flex-wrap gap-2 pt-2">
                            {['AC', 'TV', 'Fridge', 'Wifi', 'Locker', 'Attached Bath', 'Balcony'].map(a => (
                              <label key={a} className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-lg cursor-pointer hover:border-primary transition-all">
                                 <input type="checkbox" className="w-4 h-4 rounded accent-primary" defaultChecked={selectedRoom?.amenities.includes(a)} />
                                 <span className="text-[11px] font-black uppercase tracking-tight text-text-secondary">{a}</span>
                              </label>
                            ))}
                         </div>
                      </div>
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
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Monthly Rental</label>
                            <input className="w-full bg-background border border-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" defaultValue={selectedRoom?.price} placeholder="₹ 0.00" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Security Node</label>
                            <input className="w-full bg-background border border-border rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" placeholder="₹ 0.00" />
                         </div>
                      </div>
                      <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4 items-center">
                         <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <TrendingUp size={20} />
                         </div>
                         <div className="flex-1">
                            <p className="text-[11px] font-black text-text-primary uppercase tracking-tight">Yield Optimization</p>
                            <p className="text-[10px] text-text-muted italic leading-relaxed font-medium">Pricing is adjusted against current {selectedRoom?.property || 'global'} market velocity.</p>
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
                      <h4 className="text-3xl font-black text-text-primary tracking-tight italic">Unit Protocol Verified</h4>
                      <p className="text-[11px] text-text-muted uppercase tracking-[0.2em] mt-3 max-w-[340px] leading-relaxed font-bold">The inventory node parameters have been synchronized for secure deployment.</p>
                   </motion.div>
                 )}
              </AnimatePresence>
           </div>

           {/* Modal Footer */}
           <div className="flex justify-between items-center pt-8 border-t border-border">
              <button 
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(prev => prev - 1)}
                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                  currentStep === 1 ? 'opacity-0' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                Previous Stage
              </button>
              <div className="flex gap-3">
                 <button className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-text-primary" onClick={() => setActiveModal(null)}>Abort</button>
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
                     Confirm Deployment
                   </button>
                 )}
              </div>
           </div>
        </div>
      </Modal>
    </div>
  );
};

export default Rooms;
