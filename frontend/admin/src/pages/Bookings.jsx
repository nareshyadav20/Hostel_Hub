import React, { useState } from 'react';
import { 
  Search, Filter, Download, Calendar, CalendarCheck,
  ChevronRight, AlertCircle, MoreHorizontal, ArrowUpRight,
  User, Phone, Mail, DollarSign, FileText, 
  LayoutGrid, List, XCircle, Zap,
  CreditCard, ExternalLink, ShieldCheck, Edit, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Bookings = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const [viewMode, setViewMode] = useState('table');

  const [bookings] = useState([
    {
      id: 'BK-9021',
      guestName: 'Arjun Mehra',
      email: 'arjun.m@example.com',
      phone: '+91 98765 43210',
      hostel: 'Sapphire Men\'s PG',
      roomType: 'Single Deluxe',
      checkIn: '20 May 2024',
      checkOut: '20 Jun 2024',
      amount: '₹14,500',
      status: 'Confirmed',
      paymentStatus: 'Paid',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      appliedOn: '12 May 2024',
      specialRequest: 'Late check-in requested (after 9 PM)'
    },
    {
      id: 'BK-9022',
      guestName: 'Sanya Gupta',
      email: 'sanya.g@live.in',
      phone: '+91 98765 43211',
      hostel: 'Royal Ladies Nest',
      roomType: 'Double Shared',
      checkIn: '15 May 2024',
      checkOut: '15 Aug 2024',
      amount: '₹32,000',
      status: 'Pending',
      paymentStatus: 'Partial',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      appliedOn: '10 May 2024',
      specialRequest: 'Quiet floor preferred'
    },
    {
      id: 'BK-9023',
      guestName: 'Rahul Varma',
      email: 'rahul.v@gmail.com',
      phone: '+91 98765 43212',
      hostel: 'Sunshine Residency',
      roomType: 'Triple Shared',
      checkIn: '22 May 2024',
      checkOut: '22 Nov 2024',
      amount: '₹45,000',
      status: 'Cancelled',
      paymentStatus: 'Refunded',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      appliedOn: '08 May 2024',
      specialRequest: 'No specific requests'
    },
    {
      id: 'BK-9024',
      guestName: 'Priya Sharma',
      email: 'priya.s@outlook.com',
      phone: '+91 98765 43213',
      hostel: 'Emerald Suites',
      roomType: 'Executive Suite',
      checkIn: 'Today',
      checkOut: '25 Jun 2024',
      amount: '₹18,000',
      status: 'Arriving',
      paymentStatus: 'Paid',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
      appliedOn: '05 May 2024',
      specialRequest: 'Needs parking space'
    }
  ]);

  const stats = [
    { label: 'Total Reservations', value: '1,284', change: '+12%', icon: <CalendarCheck />, color: 'primary', description: 'Lifetime count' },
    { label: 'Projected Revenue', value: '₹18.4L', change: '+8.5%', icon: <DollarSign />, color: 'success', description: 'Next 30 days' },
    { label: 'Pending Approval', value: '14', change: '-2', icon: <AlertCircle />, color: 'warning', description: 'Immediate action' },
    { label: 'Check-in Pulse', value: '08', change: 'Today', icon: <Zap />, color: 'indigo', description: 'Arrivals today' },
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
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Booking Manifest</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Operational command for reservation lifecycle and guest ingress</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-2 py-1 shadow-subtle">
              <button className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all">
                <FileText size={14} className="text-emerald-500" /> Excel
              </button>
              <div className="w-px h-4 bg-border" />
              <button className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest text-text-secondary transition-all">
                <Download size={14} className="text-rose-500" /> PDF
              </button>
           </div>
           <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
             <CalendarCheck size={16} strokeWidth={3} /> New Reservation
           </button>
        </div>
      </div>

      {/* --- ANALYTICS HUD --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card-classic p-6 flex items-center gap-5 group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}/5 rounded-full -mr-16 -mt-16 blur-3xl`} />
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}/10 text-${stat.color} flex items-center justify-center border border-${stat.color}/10 group-hover:shadow-glow transition-all duration-300 relative z-10`}>
               {React.cloneElement(stat.icon, { size: 24, strokeWidth: 2.5 })}
            </div>
            <div className="relative z-10">
               <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{stat.label}</p>
               <div className="flex items-center gap-3">
                  <h3 className="text-3xl font-black text-text-primary tracking-tight italic">{stat.value}</h3>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-black flex items-center gap-0.5 ${stat.change.includes('+') ? 'text-success' : stat.change === 'Today' ? 'text-indigo-500' : 'text-danger'}`}>
                      {stat.change.includes('+') || stat.change.includes('-') ? <ArrowUpRight size={10} strokeWidth={3} /> : null} {stat.change}
                    </span>
                    <span className="text-[9px] font-bold text-text-muted uppercase tracking-tighter">{stat.description}</span>
                  </div>
               </div>
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
               placeholder="Search bookings by Guest Name, ID, or Property..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         
         <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            <div className="flex bg-card p-1.5 rounded-2xl border border-border shadow-subtle shrink-0">
               {['All', 'Arriving', 'Confirmed', 'Pending', 'Cancelled'].map((status) => (
                 <button
                   key={status}
                   onClick={() => setFilterStatus(status)}
                   className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     filterStatus === status ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'
                   }`}
                 >
                   {status}
                 </button>
               ))}
            </div>

            <div className="h-10 w-px bg-border mx-2 shrink-0" />

            <div className="flex bg-card p-1.5 rounded-2xl border border-border shadow-subtle shrink-0">
               <button
                 onClick={() => setViewMode('table')}
                 className={`p-2.5 rounded-xl transition-all ${viewMode === 'table' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'}`}
               >
                 <List size={18} />
               </button>
               <button
                 onClick={() => setViewMode('grid')}
                 className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary'}`}
               >
                 <LayoutGrid size={18} />
               </button>
            </div>
            
            <button className="flex items-center gap-2 px-6 py-3.5 bg-card border border-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-primary transition-all shadow-subtle shrink-0">
               <Filter size={14} strokeWidth={3} /> Refine
            </button>
         </div>
      </div>

      {/* --- BOOKING MANIFEST --- */}
      <AnimatePresence mode="wait">
        {viewMode === 'table' ? (
          <motion.div 
            key="table" 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="card-classic overflow-hidden border border-border/50 shadow-premium"
          >
             <div className="overflow-x-auto scrollbar-hide">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-slate-50/80 dark:bg-white/2 border-b border-border sticky top-0 z-20 backdrop-blur-md">
                      <th className="py-5 px-8 w-12">
                         <input 
                           type="checkbox" 
                           className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                           onChange={(e) => {
                             if (e.target.checked) setSelectedBookings(bookings.map(b => b.id));
                             else setSelectedBookings([]);
                           }}
                         />
                      </th>
                      <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Guest Manifest</th>
                      <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Stay Intel</th>
                      <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                      <th className="py-5 px-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Financials</th>
                      <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {bookings
                      .filter(b => {
                        const matchesSearch = b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
                        return matchesSearch && matchesStatus;
                      })
                      .map((b) => (
                      <React.Fragment key={b.id}>
                        <tr 
                          onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                          className={`group hover:bg-slate-50/50 dark:hover:bg-white/1 transition-all cursor-pointer ${expandedId === b.id ? 'bg-primary/5' : ''}`}
                        >
                          <td className="py-4 px-8" onClick={(e) => e.stopPropagation()}>
                             <input 
                               type="checkbox" 
                               checked={selectedBookings.includes(b.id)}
                               onChange={() => {
                                 if (selectedBookings.includes(b.id)) setSelectedBookings(selectedBookings.filter(id => id !== b.id));
                                 else setSelectedBookings([...selectedBookings, b.id]);
                               }}
                               className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 transition-all cursor-pointer"
                             />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl overflow-hidden shadow-subtle border border-border/50">
                                  <img src={b.image} className="w-full h-full object-cover" alt={b.guestName} />
                               </div>
                               <div>
                                  <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">{b.guestName}</p>
                                  <p className="text-[10px] font-medium text-text-muted italic">{b.id}</p>
                               </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                             <div className="flex flex-col">
                                <div className="flex items-center gap-1.5 text-[12px] font-black text-text-primary italic">
                                   <span>{b.checkIn}</span>
                                   <ChevronRight size={12} className="text-text-muted" />
                                   <span>{b.checkOut}</span>
                                </div>
                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">{b.roomType}</span>
                             </div>
                          </td>
                          <td className="py-4 px-4">
                             <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                               b.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5' : 
                               b.status === 'Arriving' ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 shadow-indigo-500/5' :
                               b.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5' :
                               'bg-slate-500/10 text-slate-500 border-slate-500/20'
                             }`}>{b.status}</span>
                          </td>
                          <td className="py-4 px-4">
                             <div className="flex flex-col">
                                <span className="text-[14px] font-black text-text-primary tracking-tighter">{b.amount}</span>
                                <div className="flex items-center gap-1.5">
                                   <span className={`w-1.5 h-1.5 rounded-full ${b.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning'}`} />
                                   <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest">{b.paymentStatus}</span>
                                </div>
                             </div>
                          </td>
                          <td className="py-4 px-8 text-right">
                             <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-text-muted hover:text-primary transition-all"><Edit size={16} /></button>
                                <button className="p-2 text-text-muted hover:text-indigo-500 transition-all"><Mail size={16} /></button>
                                <button className="p-2 text-text-muted hover:text-rose-500 transition-all"><XCircle size={16} /></button>
                             </div>
                          </td>
                        </tr>
                        <AnimatePresence>
                          {expandedId === b.id && (
                            <tr>
                              <td colSpan={6} className="p-0 border-none">
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="bg-slate-50/30 dark:bg-white/[0.01] overflow-hidden"
                                >
                                  <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-12 border-b border-border/50">
                                     <div className="space-y-8">
                                        <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                          <User size={14} className="text-primary" /> Guest Intelligence
                                        </h4>
                                        <div className="grid grid-cols-1 gap-4">
                                           <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-card border border-border shadow-subtle">
                                              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><Phone size={16} /></div>
                                              <div>
                                                 <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Mobile Phase</p>
                                                 <p className="text-[12px] font-black text-text-primary">{b.phone}</p>
                                              </div>
                                           </div>
                                           <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-card border border-border shadow-subtle">
                                              <div className="w-10 h-10 rounded-xl bg-indigo-500/5 flex items-center justify-center text-indigo-500"><Mail size={16} /></div>
                                              <div>
                                                 <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Protocol Email</p>
                                                 <p className="text-[12px] font-black text-text-primary">{b.email}</p>
                                              </div>
                                           </div>
                                        </div>
                                     </div>

                                     <div className="space-y-8">
                                        <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                          <Calendar size={14} className="text-warning" /> Operational Manifest
                                        </h4>
                                        <div className="p-6 rounded-3xl bg-white dark:bg-card border border-border shadow-subtle space-y-4">
                                           <div className="flex justify-between items-center pb-4 border-b border-border/50">
                                              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Property Node</span>
                                              <span className="text-[12px] font-black text-text-primary italic">{b.hostel}</span>
                                           </div>
                                           <div className="flex justify-between items-center pb-4 border-b border-border/50">
                                              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Applied On</span>
                                              <span className="text-[12px] font-black text-text-primary italic">{b.appliedOn}</span>
                                           </div>
                                           <div>
                                              <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-2">Internal Note</span>
                                              <p className="text-[11px] font-medium text-text-secondary italic leading-relaxed bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-border/50">"{b.specialRequest}"</p>
                                           </div>
                                        </div>
                                     </div>

                                     <div className="space-y-8">
                                        <h4 className="text-[11px] font-black text-text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                                          <ShieldCheck size={14} className="text-success" /> Authorization Hub
                                        </h4>
                                        <div className="grid grid-cols-1 gap-3">
                                           <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all group">
                                              Confirm Reservation <ChevronRight size={14} className="inline ml-1 group-hover:translate-x-1 transition-transform" />
                                           </button>
                                           <button className="w-full py-4 bg-white dark:bg-card border border-border text-text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all">Modify Check-in</button>
                                           <button className="w-full py-4 bg-rose-500/5 text-rose-500 border border-rose-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Abort Booking</button>
                                        </div>
                                     </div>
                                  </div>
                                </motion.div>
                              </td>
                            </tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8"
          >
            {bookings
              .filter(b => {
                const matchesSearch = b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || b.id.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
                return matchesSearch && matchesStatus;
              })
              .map((b) => (
              <motion.div 
                key={b.id} 
                layout
                className={`card-classic group flex flex-col transition-all duration-500 overflow-hidden ${
                  expandedId === b.id ? 'col-span-full ring-2 ring-primary ring-offset-4 dark:ring-offset-slate-900 shadow-2xl' : ''
                }`}
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                         <div className="w-20 h-20 rounded-[2rem] overflow-hidden shadow-premium group-hover:scale-105 transition-transform duration-500">
                           <img src={b.image} className="w-full h-full object-cover" alt={b.guestName} />
                         </div>
                         <div className={`absolute -bottom-1 -right-1 p-1 rounded-lg bg-card shadow-lg`}>
                            {b.status === 'Confirmed' ? <CheckCircle2 size={16} className="text-success" /> : b.status === 'Cancelled' ? <XCircle size={16} className="text-rose-500" /> : <Clock size={16} className="text-warning" />}
                         </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                           <h3 className="text-2xl font-black text-text-primary tracking-tight">{b.guestName}</h3>
                           <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 text-[9px] font-black text-text-muted uppercase tracking-widest border border-border/50">{b.id}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm font-medium text-text-muted">
                           <p className="flex items-center gap-1.5"><Mail size={14} /> {b.email}</p>
                           <p className="flex items-center gap-1.5"><Phone size={14} /> {b.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-10">
                       <div className="flex flex-col">
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Check-in / Out</p>
                          <div className="flex items-center gap-3">
                             <span className={`text-[14px] font-black italic ${b.checkIn === 'Today' ? 'text-indigo-500' : 'text-text-primary'}`}>{b.checkIn}</span>
                             <ChevronRight size={14} className="text-text-muted" />
                             <span className="text-[14px] font-black text-text-primary italic">{b.checkOut}</span>
                          </div>
                       </div>
                       <div className="flex flex-col">
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Asset Node</p>
                          <div className="flex flex-col">
                             <span className="text-[14px] font-black text-text-primary italic">{b.roomType}</span>
                             <span className="text-[10px] font-bold text-text-muted italic">{b.hostel}</span>
                          </div>
                       </div>
                       <div className="flex flex-col">
                          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Payment</p>
                          <div className="flex items-center gap-3">
                             <span className="text-[16px] font-black text-text-primary tracking-tighter">{b.amount}</span>
                             <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${b.paymentStatus === 'Paid' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{b.paymentStatus}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-3">
                       <button 
                         onClick={() => setExpandedId(expandedId === b.id ? null : b.id)}
                         className="px-6 py-3 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all shadow-subtle"
                       >
                         {expandedId === b.id ? 'Abort Manifest' : 'Deep Insight'}
                       </button>
                       <button className="p-3 bg-card border border-border rounded-xl text-text-muted hover:text-primary transition-all">
                          <MoreHorizontal size={20} />
                       </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === b.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-10 pt-10 border-t border-border"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                           <div className="space-y-6">
                              <h4 className="text-[11px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                                <FileText size={14} className="text-indigo-500" /> Booking Manifest
                              </h4>
                              <div className="space-y-3">
                                 {[
                                   { label: 'Booking Origin', value: 'Direct Website' },
                                   { label: 'Applied Date', value: b.appliedOn },
                                   { label: 'Special Instructions', value: b.specialRequest, full: true }
                                 ].map((item, i) => (
                                   <div key={i} className={`p-4 rounded-2xl bg-background border border-border ${item.full ? 'col-span-full' : ''}`}>
                                      <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1">{item.label}</p>
                                      <p className="text-[12px] font-black text-text-primary italic">{item.value}</p>
                                   </div>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-6">
                              <h4 className="text-[11px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                                <CreditCard size={14} className="text-success" /> Payment Pulse
                              </h4>
                              <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-border flex flex-col items-center justify-center text-center group">
                                 <div className="w-16 h-16 rounded-full bg-success/10 text-success flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <ShieldCheck size={32} />
                                 </div>
                                 <p className="text-[16px] font-black text-text-primary tracking-tight">Security Deposit Verified</p>
                                 <p className="text-[11px] text-text-muted font-bold uppercase tracking-widest mt-1 italic">Transaction ID: TXN-890214</p>
                                 <button className="mt-6 flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest border-b border-primary/30 pb-0.5">
                                    View Full Invoice <ExternalLink size={12} />
                                 </button>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <h4 className="text-[11px] font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                                <Zap size={14} className="text-warning" /> Operational Controls
                              </h4>
                              <div className="grid grid-cols-1 gap-3">
                                 <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all">Verify & Confirm Ingress</button>
                                 <button className="w-full py-4 bg-background border border-border text-text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-primary transition-all">Modify Booking Parameters</button>
                                 <button className="w-full py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Abort Reservation</button>
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PAGINATION FOOTER --- */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 card-classic bg-slate-50/50 dark:bg-white/2">
         <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Showing 4 of 1,284 records</span>
            <div className="h-4 w-px bg-border" />
            <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-text-secondary outline-none cursor-pointer">
               <option>Show 10</option>
               <option>Show 25</option>
               <option>Show 50</option>
            </select>
         </div>
         <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl text-text-muted opacity-50 cursor-not-allowed">Previous Phase</button>
            <div className="flex gap-1">
               {[1, 2, 3, '...', 42].map((p, i) => (
                 <button key={i} className={`w-8 h-8 rounded-lg text-[10px] font-black flex items-center justify-center transition-all ${p === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-primary hover:bg-background'}`}>
                   {p}
                 </button>
               ))}
            </div>
            <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-border rounded-xl text-text-secondary hover:border-primary hover:text-primary transition-all shadow-subtle">Next Phase</button>
         </div>
      </div>
    </div>
  );
};

export default Bookings;
