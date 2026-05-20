import React, { useState, useEffect } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import API from '../api/axios';

const Rooms = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeModal, setActiveModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [userRole] = useState('admin');
  
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
 
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'Premium Double',
    buildingId: '',
    floorId: '',
    status: 'AVAILABLE',
    capacity: 2,
    rentAmount: 12000,
    securityDeposit: 12000,
    amenities: ['AC', 'Attached Bath', 'Balcony'],
  });

  const handleInventoryAudit = () => showToast("Inventory Audit manifest generating...", "info");
  const handleAssignResident = (id) => showToast(`Assigning new resident to Room ${id}...`, "info");
  const handleScheduleMaintenance = (id) => showToast(`Scheduling maintenance for Room ${id}...`, "info");

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const [roomsRes, buildingsRes, floorsRes] = await Promise.all([
        API.get('/rooms'),
        API.get('/buildings'),
        API.get('/floors')
      ]);

      setBuildings(buildingsRes.data);
      setFloors(floorsRes.data);

      const buildingsMap = {};
      buildingsRes.data.forEach(b => {
        buildingsMap[b._id] = b.name;
      });

      const floorsMap = {};
      floorsRes.data.forEach(f => {
        floorsMap[f._id] = {
          floorNumber: f.floorNumber,
          buildingId: f.building
        };
      });

      const mapped = roomsRes.data.map(room => {
        const floorInfo = floorsMap[room.floor] || { floorNumber: '1st Floor', buildingId: null };
        const propertyName = buildingsMap[floorInfo.buildingId] || 'Sapphire PG';

        return {
          id: room._id,
          roomNumber: room.roomNumber,
          type: room.roomType || 'Premium Double',
          property: propertyName,
          buildingId: floorInfo.buildingId,
          occupants: room.beds?.filter(b => b.status === 'OCCUPIED').length || 0,
          capacity: room.capacity || 2,
          status: room.status === 'AVAILABLE' ? 'Available' : room.status === 'MAINTENANCE' ? 'Maintenance' : 'Occupied',
          price: `₹${(room.rentAmount || 12000).toLocaleString('en-IN')}`,
          rentAmount: room.rentAmount || 12000,
          securityDeposit: room.securityDeposit || 12000,
          floor: floorInfo.floorNumber || '1st Floor',
          floorId: room.floor || '',
          amenities: room.amenities && room.amenities.length > 0 ? room.amenities : ['AC', 'Attached Bath', 'Balcony']
        };
      });

      setRooms(mapped);
    } catch (err) {
      console.error('Error fetching inventory details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const handleEdit = (room) => {
    setSelectedRoom(room);
    setFormData({
      roomNumber: room.roomNumber,
      roomType: room.type,
      buildingId: room.buildingId || (buildings[0]?._id || ''),
      floorId: room.floorId || '',
      status: room.status === 'Available' ? 'AVAILABLE' : room.status === 'Maintenance' ? 'MAINTENANCE' : 'OCCUPIED',
      capacity: room.capacity,
      rentAmount: room.rentAmount,
      securityDeposit: room.securityDeposit,
      amenities: room.amenities,
    });
    setActiveModal('edit');
    setCurrentStep(1);
  };

  const handleDelete = (id) => {
    if (userRole !== 'admin') return;
    triggerConfirm(
      "Confirm Asset Removal",
      "Are you sure you want to delete this living unit? This action is permanent and cannot be undone.",
      async () => {
        try {
          await API.delete(`/rooms/${id}`);
          showToast("Living unit successfully deleted.", "success");
          await fetchInventoryData();
        } catch (err) {
          console.error('Error deleting room:', err);
          showToast("Failed to delete room asset.", "error");
        }
      }
    );
  };

  const handleAddUnitClick = () => {
    setSelectedRoom(null);
    setFormData({
      roomNumber: '',
      roomType: 'Premium Double',
      buildingId: buildings[0]?._id || '',
      floorId: '',
      status: 'AVAILABLE',
      capacity: 2,
      rentAmount: 12000,
      securityDeposit: 12000,
      amenities: ['AC', 'Attached Bath', 'Balcony'],
    });
    setActiveModal('add');
    setCurrentStep(1);
  };

  const handleModalSubmit = async () => {
    try {
      let targetFloorId = formData.floorId;
      
      // Bulletproof auto-creation of a Floor if one doesn't exist for the selected property
      if (!targetFloorId) {
        const propFloors = floors.filter(f => f.building === formData.buildingId);
        if (propFloors.length > 0) {
          targetFloorId = propFloors[0]._id;
        } else {
          const newFloor = await API.post('/floors', {
            floorNumber: '1st Floor',
            buildingId: formData.buildingId,
            description: 'Automatically deployed floor node'
          });
          targetFloorId = newFloor.data._id;
        }
      }

      const payload = {
        roomNumber: formData.roomNumber,
        roomType: formData.roomType,
        capacity: formData.capacity,
        rentAmount: formData.rentAmount,
        securityDeposit: formData.securityDeposit,
        status: formData.status,
        amenities: formData.amenities,
        isAC: formData.amenities.includes('AC'),
        floorId: targetFloorId
      };

      if (activeModal === 'add') {
        await API.post('/rooms', payload);
      } else if (activeModal === 'edit' && selectedRoom) {
        await API.patch(`/rooms/${selectedRoom.id}`, payload);
      }

      setActiveModal(null);
      await fetchInventoryData();
    } catch (err) {
      console.error('Error saving room node:', err);
      showToast(err.response?.data?.error || "Failed to save room details.", "error");
    }
  };

  const activeUnits = rooms.filter(r => r.status === 'Occupied').length;
  const occupancyPercentage = rooms.length > 0 ? ((activeUnits / rooms.length) * 100).toFixed(1) : '0';

  const inventoryStats = [
    { label: 'Total Units', value: rooms.length.toString(), change: `+${rooms.length}`, icon: <Building />, color: 'primary' },
    { label: 'Live Occupancy', value: `${occupancyPercentage}%`, change: '+4.2%', icon: <Activity />, color: 'success' },
    { label: 'Ready to Deploy', value: rooms.filter(r => r.status === 'Available').length.toString(), change: 'Stable', icon: <CheckCircle />, color: 'indigo' },
  ];

  const steps = [
    { id: 1, title: 'Identity', icon: <FileText size={14} /> },
    { id: 2, title: 'Capacity', icon: <Users size={14} /> },
    { id: 3, title: 'Pricing', icon: <DollarSign size={14} /> },
    { id: 4, title: 'Confirm', icon: <CheckCircle2 size={14} /> },
  ];

  const toggleAmenity = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    }
  };

  const activeBuildingFloors = floors.filter(f => f.building === formData.buildingId);

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
                           <h1 className="text-4xl font-black text-text-primary tracking-tight">Room {selectedRoom.roomNumber}</h1>
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
                     <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-divider/50 text-center">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Occupants</p>
                        <h4 className="text-2xl font-black text-text-primary italic">{selectedRoom.occupants}/{selectedRoom.capacity}</h4>
                     </div>
                     <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-divider/50 text-center">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Monthly Yield</p>
                        <h4 className="text-2xl font-black text-text-primary italic">{selectedRoom.price}</h4>
                     </div>
                     <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-divider/50 text-center">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Location Node</p>
                        <h4 className="text-2xl font-black text-text-primary italic">{selectedRoom.floor}</h4>
                     </div>
                  </div>

                  <h3 className="text-lg font-black text-text-primary uppercase tracking-tight mb-8">Asset Inventory</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {selectedRoom.amenities.map((item, i) => (
                       <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-divider/50 group hover:border-primary transition-all">
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
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background border border-divider group hover:border-primary/20 transition-all">
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
                     <button 
                        onClick={() => handleAssignResident(selectedRoom.roomNumber)}
                        className="w-full py-4 bg-primary text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                      >
                         Assign New Resident
                      </button>
                      <button 
                        onClick={() => handleScheduleMaintenance(selectedRoom.roomNumber)}
                        className="w-full py-4 bg-white dark:bg-slate-900 border border-primary/20 text-primary rounded-xl text-[11px] font-black uppercase tracking-widest"
                      >
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
          <h1 className="text-3xl text-premium-header">Room Inventory</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic">Global oversight of living units, occupancy vectors, and service states.</p>
        </div>
        <div className="flex items-center gap-3">
           <button 
              onClick={handleInventoryAudit}
              className="flex items-center gap-2 px-5 py-2.5 bg-card border border-divider rounded-xl text-[11px] font-black uppercase tracking-widest text-text-secondary hover:border-primary transition-all shadow-subtle"
            >
              <Download size={16} /> Inventory Audit
            </button>
           {userRole === 'admin' && (
             <button 
              onClick={handleAddUnitClick}
              className="btn-premium"
            >
               <Plus size={18} strokeWidth={3} /> Add Unit
             </button>
           )}
        </div>
      </div>

      {/* --- STATS CLUSTER --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {inventoryStats.map((stat, i) => (
          <div key={i} className="card-classic p-6 flex items-center gap-5 group border-none glass-effect">
            <div className={`w-14 h-14 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/5 text-${stat.color === 'primary' ? 'primary' : stat.color + '-500'} flex items-center justify-center border border-${stat.color === 'primary' ? 'primary' : stat.color + '-500'}/10 group-hover:rotate-12 transition-all duration-500`}>
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
               className="w-full bg-card border border-divider rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-primary transition-all text-text-primary shadow-subtle"
               placeholder="Search units by number, property or category..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </div>

      {/* --- ROOM GRID --- */}
      {loading ? (
        <div className="py-20 text-center text-text-muted font-bold uppercase tracking-widest">
          Loading Living Units from Database...
        </div>
      ) : rooms.length === 0 ? (
        <div className="py-20 text-center text-text-muted font-bold uppercase tracking-widest border border-dashed border-divider rounded-3xl">
          No Units Configured. Click "Add Unit" or Deploy below.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {rooms
            .filter(room => {
              const matchesSearch = room.roomNumber.toString().toLowerCase().includes(searchTerm.toLowerCase()) || 
                                   room.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                   room.property.toLowerCase().includes(searchTerm.toLowerCase());
              return matchesSearch;
            })
            .map((room) => (
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
                          <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-widest">Node {room.roomNumber}</span>
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
                       <div className="w-full h-1.5 bg-background border border-divider/50 rounded-full overflow-hidden">
                          <div 
                             className={`h-full transition-all duration-1000 ${
                                room.status === 'Occupied' ? 'bg-success' : 'bg-primary'
                             }`} 
                             style={{ width: `${(room.occupants/room.capacity)*100}%` }}
                          />
                       </div>
                    </div>

                    {/* Monthly Yield */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-divider/50">
                       <div className="flex items-center gap-2">
                          <DollarSign size={14} className="text-text-muted" />
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Monthly Rate</span>
                       </div>
                       <span className="text-sm font-black text-text-primary italic">{room.price}</span>
                    </div>
                 </div>
              </div>

              <div className="mt-auto px-6 py-4 bg-background/50 border-t border-divider/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
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
              onClick={handleAddUnitClick}
              whileHover={{ scale: 1.02 }}
              className="card-classic border-dashed border-2 hover:border-primary/50 flex flex-col items-center justify-center p-12 gap-5 group cursor-pointer transition-all bg-primary/5 min-h-[380px]"
            >
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-divider flex items-center justify-center text-text-muted group-hover:text-primary group-hover:scale-110 transition-all duration-500 shadow-sm">
                <Plus size={32} strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-black text-text-primary tracking-tight uppercase italic">Deploy New Unit</h3>
                <p className="text-[11px] text-text-muted mt-2 max-w-[200px] font-bold uppercase tracking-[0.2em] leading-relaxed">Initialize a new living node.</p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* --- ADD/EDIT UNIT MODAL --- */}
      <Modal 
        isOpen={activeModal === 'add' || activeModal === 'edit'} 
        onClose={() => setActiveModal(null)}
        title={activeModal === 'add' ? "Initialize New Unit" : `Modify Unit ${selectedRoom?.roomNumber}`}
        maxWidth="max-w-2xl"
      >
        <div className="py-6 space-y-10">
           {/* Step Indicator */}
           <div className="flex items-center justify-between px-4 relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
              {steps.map((s) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-3">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${
                     currentStep >= s.id ? 'bg-primary border-primary text-white shadow-glow' : 'bg-card border-divider text-text-muted'
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
                            <input 
                              className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" 
                              value={formData.roomNumber} 
                              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                              placeholder="e.g. 101" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Unit Category</label>
                            <select 
                              className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer" 
                              value={formData.roomType}
                              onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                            >
                               <option value="Single">Elite Single</option>
                               <option value="Double">Premium Double</option>
                               <option value="Triple">Standard Triple</option>
                               <option value="Executive Suite">Executive Suite</option>
                            </select>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Asset Property</label>
                         <select 
                           className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer" 
                           value={formData.buildingId}
                           onChange={(e) => setFormData({ ...formData, buildingId: e.target.value, floorId: '' })}
                         >
                            <option value="" disabled>Select Property...</option>
                            {buildings.map(b => (
                              <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                         </select>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Location (Floor)</label>
                            <select 
                              className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer" 
                              value={formData.floorId}
                              onChange={(e) => setFormData({ ...formData, floorId: e.target.value })}
                            >
                               <option value="">Select Floor...</option>
                               {activeBuildingFloors.map(f => (
                                 <option key={f._id} value={f._id}>{f.floorNumber}</option>
                               ))}
                               {activeBuildingFloors.length === 0 && (
                                 <option value="">Auto Deploy 1st Floor</option>
                               )}
                            </select>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Deployment Status</label>
                            <select 
                              className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer" 
                              value={formData.status}
                              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                               <option value="AVAILABLE">Available</option>
                               <option value="OCCUPIED">Occupied</option>
                               <option value="MAINTENANCE">Maintenance</option>
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
                            <input 
                              type="number" 
                              className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" 
                              value={formData.capacity} 
                              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                              placeholder="0" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Security Guard Level</label>
                            <input 
                              type="text" 
                              disabled 
                              className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm opacity-60 text-text-muted cursor-not-allowed" 
                              value="Auto Protected" 
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Asset Amenities</label>
                         <div className="flex flex-wrap gap-2 pt-2">
                            {['AC', 'TV', 'Fridge', 'Wifi', 'Locker', 'Attached Bath', 'Balcony'].map(a => (
                              <label key={a} className="flex items-center gap-2 px-4 py-2 bg-background border border-divider rounded-lg cursor-pointer hover:border-primary transition-all">
                                 <input 
                                   type="checkbox" 
                                   className="w-4 h-4 rounded accent-primary cursor-pointer" 
                                   checked={formData.amenities.includes(a)} 
                                   onChange={() => toggleAmenity(a)}
                                 />
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
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Monthly Rental (₹)</label>
                            <input 
                              type="number"
                              className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" 
                              value={formData.rentAmount} 
                              onChange={(e) => setFormData({ ...formData, rentAmount: parseFloat(e.target.value) || 0 })}
                              placeholder="₹ 0.00" 
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Security Deposit (₹)</label>
                            <input 
                              type="number"
                              className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" 
                              value={formData.securityDeposit} 
                              onChange={(e) => setFormData({ ...formData, securityDeposit: parseFloat(e.target.value) || 0 })}
                              placeholder="₹ 0.00" 
                            />
                         </div>
                      </div>
                      <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4 items-center">
                         <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <TrendingUp size={20} />
                         </div>
                         <div className="flex-1">
                            <p className="text-[11px] font-black text-text-primary uppercase tracking-tight">Yield Optimization</p>
                            <p className="text-[10px] text-text-muted italic leading-relaxed font-medium">Pricing is adjusted against current global market velocity.</p>
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
           <div className="flex justify-between items-center pt-8 border-t border-divider">
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
                    onClick={handleModalSubmit}
                    className="px-8 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
                   >
                     Confirm Deployment
                   </button>
                 )}
              </div>
           </div>
        </div>
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

export default Rooms;
