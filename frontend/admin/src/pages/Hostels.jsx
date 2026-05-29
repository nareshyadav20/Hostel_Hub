import React, { useState, useEffect } from 'react';
import {
   Building2, Plus, Search, Filter, MoreHorizontal,
   MapPin, Users, Activity, ArrowUpRight, Zap,
   TrendingUp, ShieldCheck, Home, Target, ChevronRight,
   Settings2, Download, Trash2, Edit3, Eye, Camera,
   CheckCircle2, AlertCircle, Wrench, BarChart3, Clock,
   DollarSign, PieChart as PieIcon, Layers, FileText, Calendar,
   ArrowLeft, Wifi, Coffee, Wind, Tv, BedDouble
} from 'lucide-react';
import Modal from '../components/Modal';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useToast } from '../context/ToastContext';

const Hostels = () => {
   const navigate = useNavigate();
   const { showToast } = useToast();
   const [activeModal, setActiveModal] = useState(null);
   const [searchTerm, setSearchTerm] = useState('');
   const [hostelPage, setHostelPage] = useState(0);
   const hostelsPerPage = 6;
   const [currentStep, setCurrentStep] = useState(1);
   const [portfolioData, setPortfolioData] = useState(null);
   const [portfolioLoading, setPortfolioLoading] = useState(false);
   const [activeTab, setActiveTab] = useState('overview');
   const [filterCity, setFilterCity] = useState('All Cities');
   const [selectedHostel, setSelectedHostel] = useState(null);
   const [selectedTenantPayments, setSelectedTenantPayments] = useState(null);
   const [userRole] = useState('admin'); // Mock role for access control

   const [stats, setStats] = useState({
      totalOwners: 0,
      totalTenants: 0,
      totalBuildings: 0,
      monthlyRevenue: 0
   });
   const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
   const [filterCategory, setFilterCategory] = useState('All Categories');
   const [filterStatus, setFilterStatus] = useState('All Statuses');
   const [selectedAmenities, setSelectedAmenities] = useState([]);
   const [minPrice, setMinPrice] = useState('');
   const [maxPrice, setMaxPrice] = useState('');

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
   const [activeFloorId, setActiveFloorId] = useState('f1');
   const [hostels, setHostels] = useState([]);
   const [loading, setLoading] = useState(true);

   // Controlled form data state
   const [formData, setFormData] = useState({
      name: '',
      category: 'Premium PG',
      address: '',
      locationCity: 'Bangalore',
      amenities: [],
      capacity: 80,
      startingPrice: 8500,
      image: 'https://images.unsplash.com/photo-1555854817-5b2260d50c63?auto=format&fit=crop&q=80&w=800'
   });

   const mapBuildingToHostel = (b) => {
      let totalCapacity = 0;
      let occupiedBeds = 0;

      if (b.floors && b.floors.length > 0) {
         b.floors.forEach(floor => {
            if (floor.rooms && floor.rooms.length > 0) {
               floor.rooms.forEach(room => {
                  totalCapacity += room.capacity || 0;
                  if (room.beds && room.beds.length > 0) {
                     room.beds.forEach(bed => {
                        if (bed.status === 'OCCUPIED') {
                           occupiedBeds++;
                        }
                     });
                  }
               });
            }
         });
      }

      // Fallbacks if no floors/rooms are configured
      if (totalCapacity === 0) {
         totalCapacity = b.totalBeds || 80;
      }
      if (occupiedBeds === 0) {
         occupiedBeds = b.tenantCount || 0;
      }

      const occupancyRate = totalCapacity > 0 ? Math.min(100, Math.round((occupiedBeds / totalCapacity) * 100)) : 0;

      // Revenue calculation
      const revAmount = occupiedBeds * (b.startingPrice || 8500);
      const revStr = revAmount >= 100000 ? `${(revAmount / 100000).toFixed(1)}L` : `${Math.round(revAmount / 1000)}K`;
      const maintAmount = Math.round(revAmount * 0.12);
      const maintStr = maintAmount >= 100000 ? `${(maintAmount / 100000).toFixed(1)}L` : `${Math.round(maintAmount / 1000)}K`;

      // Amenities list
      const amenitiesList = b.amenities && b.amenities.length > 0 ? b.amenities : ['Wifi', 'AC', 'Gym', 'Laundry'];

      // Image
      const imgUrl = b.images && b.images.length > 0 
         ? b.images[0] 
         : 'https://images.unsplash.com/photo-1555854817-5b2260d50c63?auto=format&fit=crop&q=80&w=800';

      return {
         id: b._id,
         name: b.name || 'Unnamed Property',
         location: b.address || `${b.locationCity || 'Koramangala'}, Bangalore`,
         type: b.category || 'Premium PG',
         capacity: totalCapacity,
         occupancy: occupancyRate,
         status: b.status || 'Active',
         revenue: revStr,
         maintenance: maintStr,
         amenities: amenitiesList,
         image: imgUrl,
         ownerName: b.owner?.name || 'N/A',
         tenantCount: b.tenantCount || 0,
         staffCount: b.staffCount || 0,
         totalRoomsCount: b.totalRoomsCount || 0,
         occupiedRoomsCount: b.occupiedRoomsCount || 0,
         vacantRoomsCount: b.vacantRoomsCount || 0,
         rawBuilding: b // preserve full nested structure for detail panels!
      };
   };

   const fetchHostels = async () => {
      try {
         setLoading(true);
         const [buildingsRes, statsRes] = await Promise.all([
            API.get('/buildings'),
            API.get('/admin/stats').catch(err => {
               console.warn('Failed to fetch admin stats, using fallback:', err);
               return { data: null };
            })
         ]);
         
         const mapped = buildingsRes.data.map(mapBuildingToHostel);
         setHostels(mapped);
         
         if (statsRes && statsRes.data) {
            setStats({
               totalOwners: statsRes.data.totalOwners || 0,
               totalTenants: statsRes.data.totalTenants || 0,
               totalBuildings: statsRes.data.totalBuildings || mapped.length,
               monthlyRevenue: statsRes.data.monthlyRevenue || 0
            });
         } else {
            // Fallback calculations if backend stats is not working or returns empty
            const totalCapacity = mapped.reduce((acc, h) => acc + (h.capacity || 0), 0);
            const totalOccupied = mapped.reduce((acc, h) => acc + Math.round((h.capacity || 0) * ((h.occupancy || 0) / 100)), 0);
            
            let totalRevAmount = mapped.reduce((acc, h) => {
               let val = 0;
               if (h.revenue) {
                  if (h.revenue.endsWith('L')) {
                     val = parseFloat(h.revenue) * 100000;
                  } else if (h.revenue.endsWith('K')) {
                     val = parseFloat(h.revenue) * 1000;
                  } else {
                     val = parseFloat(h.revenue) || 0;
                  }
               }
               return acc + val;
            }, 0);

            setStats({
               totalOwners: 3, 
               totalTenants: totalOccupied || 120,
               totalBuildings: mapped.length,
               monthlyRevenue: totalRevAmount || 8500 * (totalOccupied || 10)
            });
         }
      } catch (err) {
         console.error('Error fetching buildings:', err);
         showToast('Failed to fetch properties from backend collection.', 'error');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchHostels();
   }, []);

   const handleAuditTrail = () => showToast("Audit Trail manifest generating...", "info");
   const handleGenerateReport = (name) => showToast(`Generating Strategic Portfolio Report for ${name}...`, "success");
   const handleMoreFilters = () => setShowAdvancedFilters(!showAdvancedFilters);

    const handleViewPortfolio = async (hostel) => {
       setSelectedHostel(hostel);
       setActiveModal('details');
       setPortfolioLoading(true);
       setPortfolioData(null);
       try {
          const res = await API.get(`/buildings/${hostel.id}/portfolio`);
          setPortfolioData(res.data);
          setActiveFloorId(res.data.hostelDetails?.rawBuilding?.floors?.[0]?._id || hostel.rawBuilding?.floors?.[0]?._id || 'f1');
       } catch (err) {
          console.error('Error fetching hostel portfolio:', err);
          showToast('Failed to retrieve building portfolio data from backend.', 'error');
       } finally {
          setPortfolioLoading(false);
       }
    };

   const handleEdit = (hostel) => {
      setSelectedHostel(hostel);
      setFormData({
         name: hostel.name,
         category: hostel.type,
         address: hostel.location,
         locationCity: hostel.rawBuilding?.locationCity || 'Bangalore',
         amenities: hostel.amenities,
         capacity: hostel.capacity,
         startingPrice: hostel.rawBuilding?.startingPrice || 8500,
         image: hostel.image
      });
      setActiveModal('edit');
      setCurrentStep(1);
   };

   const handleAddPropertyClick = () => {
      setSelectedHostel(null);
      setFormData({
         name: '',
         category: 'Premium PG',
         address: '',
         locationCity: 'Bangalore',
         amenities: [],
         capacity: 80,
         startingPrice: 8500,
         image: 'https://images.unsplash.com/photo-1555854817-5b2260d50c63?auto=format&fit=crop&q=80&w=800'
      });
      setActiveModal('add');
      setCurrentStep(1);
   };

   const handleDelete = (id) => {
      if (userRole !== 'admin') return;
      triggerConfirm(
         "Confirm Property Deletion",
         "Are you sure you want to delete this property from the portfolio? All associated floor and room records will also be removed.",
         async () => {
            try {
               await API.delete(`/buildings/${id}`);
               showToast('Property deleted successfully!', 'success');
               fetchHostels();
            } catch (err) {
               console.error('Error deleting property:', err);
               showToast(err.response?.data?.error || 'Failed to delete property.', 'error');
            }
         }
      );
   };

   const handleSave = async () => {
      try {
         const payload = {
            name: formData.name || 'Untitled Hostel',
            category: formData.category,
            address: formData.address,
            locationCity: formData.locationCity,
            amenities: formData.amenities,
            startingPrice: Number(formData.startingPrice) || 8500,
            genderType: 'Mixed',
            status: 'Active',
            images: [formData.image]
         };

         if (activeModal === 'add') {
            await API.post('/buildings', payload);
            showToast('Property initialized successfully!', 'success');
         } else {
            await API.put(`/buildings/${selectedHostel.id}`, payload);
            showToast('Property updated successfully!', 'success');
         }
         setActiveModal(null);
         fetchHostels();
      } catch (err) {
         console.error('Error saving property:', err);
         showToast(err.response?.data?.error || 'Failed to save property.', 'error');
      }
   };

    const totalProperties = hostels.length;
    
    // Dynamic cities list derived from created hostels
    const uniqueCities = Array.from(new Set(hostels.map(h => h.rawBuilding?.locationCity).filter(Boolean)));
    if (uniqueCities.length === 0) {
       uniqueCities.push('Bangalore', 'Pune', 'Mumbai');
    }

    const getStatColorClasses = (color) => {
       switch (color) {
          case 'primary':
             return 'bg-primary/10 text-primary border-primary/20 hover:shadow-[0_0_15px_rgba(22,163,74,0.25)]';
          case 'success':
             return 'bg-success/10 text-success border-success/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]';
          case 'indigo':
             return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20 hover:shadow-[0_0_15px_rgba(34,197,94,0.25)]';
          case 'emerald':
             return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]';
          default:
             return 'bg-primary/10 text-primary border-primary/20';
       }
    };

    const formatCurrency = (num) => {
       if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
       if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
       return `₹${num.toLocaleString('en-IN')}`;
    };

    const portfolioStats = [
       { label: 'Total Owners', value: stats.totalOwners.toString(), change: 'Live Sync', icon: <ShieldCheck />, color: 'primary' },
       { label: 'Total Tenants', value: stats.totalTenants.toString(), change: 'Active', icon: <Users />, color: 'success' },
       { label: 'Total Properties', value: stats.totalBuildings.toString(), change: `+${stats.totalBuildings}`, icon: <Building2 />, color: 'indigo' },
       { label: 'Monthly Revenue', value: formatCurrency(stats.monthlyRevenue), change: 'Collected', icon: <DollarSign />, color: 'emerald' },
    ];

   const steps = [
      { id: 1, title: 'Details', icon: <FileText size={14} /> },
      { id: 2, title: 'Media', icon: <Camera size={14} /> },
      { id: 3, title: 'Pricing', icon: <DollarSign size={14} /> },
      { id: 4, title: 'Review', icon: <CheckCircle2 size={14} /> },
   ];

   if (loading) {
      return (
         <div className="space-y-10 pb-20 animate-fade">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div>
                  <h1 className="text-3xl text-premium-header">Properties Portfolio</h1>
                  <p className="text-sm text-text-muted mt-1 font-medium italic">Strategic asset management and operational monitoring</p>
               </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {[1, 2, 3].map(i => (
                  <div key={i} className="card-classic p-6 flex items-center gap-5 border-none bg-slate-100 dark:bg-white/5 animate-pulse h-28 rounded-2xl animate-pulse" />
               ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {[1, 2, 3].map(i => (
                  <div key={i} className="card-classic h-96 bg-slate-100 dark:bg-white/5 animate-pulse rounded-3xl animate-pulse" />
               ))}
            </div>
         </div>
      );
   }

   if (selectedHostel && activeModal === 'details') {
      if (portfolioLoading || !portfolioData) {
         return (
            <div className="space-y-8 animate-fade pb-20">
               <div className="flex items-center justify-between">
                  <button
                     onClick={() => setSelectedHostel(null)}
                     className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group"
                  >
                     <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                     Back to Properties
                  </button>
               </div>
               
               <div className="card-classic h-64 bg-slate-50/50 dark:bg-white/[0.01] border border-divider/40 rounded-3xl flex items-center justify-center shadow-subtle">
                  <div className="flex flex-col items-center gap-3">
                     <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                     <p className="text-xs font-bold text-text-muted uppercase tracking-widest animate-pulse mt-2">Aggregating Portfolio Assets...</p>
                  </div>
               </div>
            </div>
         );
      }

      const { hostelDetails, ownerDetails, tenants, staff, analytics } = portfolioData;

      const realFloors = hostelDetails.rawBuilding?.floors || [];
      const hasRealFloors = realFloors.length > 0;

      const simulatedFloors = hasRealFloors 
         ? realFloors.map(f => ({ 
              _id: f._id, 
              floorNumber: `Floor ${f.floorNumber}`, 
              description: f.description || `Residential housing zone for Floor ${f.floorNumber}` 
           }))
         : [];

      const getRoomsForFloor = (floorId) => {
         if (hasRealFloors) {
            const currentFloorObj = realFloors.find(f => f._id === floorId);
            if (currentFloorObj && currentFloorObj.rooms) {
               return currentFloorObj.rooms.map(r => ({
                  _id: r._id,
                  roomNumber: r.roomNumber,
                  roomType: r.roomType || (r.roomNumber.toLowerCase().includes('ac') ? 'Single Deluxe AC' : 'Standard Non-AC'),
                  capacity: r.capacity || 2,
                  status: r.status === 'AVAILABLE' ? 'AVAILABLE' : r.status === 'MAINTENANCE' ? 'MAINTENANCE' : 'FULL',
                  rentAmount: (r.rentAmount || 8500).toLocaleString('en-IN'),
                  bathroom: 'Attached Private',
                  climate: r.roomNumber.toLowerCase().includes('ac') ? 'Air Conditioned' : 'Regular Non-AC',
                  beds: r.beds || []
               }));
            }
         }
         return [];
      };

      const getBedOccupant = (roomId, bedIdx) => {
         if (hasRealFloors) {
            for (const f of realFloors) {
               const r = f.rooms && f.rooms.find(rm => rm._id === roomId);
               if (r && r.beds && r.beds[bedIdx]) {
                  const tenantObj = r.beds[bedIdx].tenant;
                  if (tenantObj) {
                     return tenantObj.name || 'Unknown Resident';
                  }
               }
            }
         }
         return 'Vacant Bed';
      };

      const getBedPhone = (roomId, bedIdx) => {
         if (hasRealFloors) {
            for (const f of realFloors) {
               const r = f.rooms && f.rooms.find(rm => rm._id === roomId);
               if (r && r.beds && r.beds[bedIdx]) {
                  const tenantObj = r.beds[bedIdx].tenant;
                  if (tenantObj) {
                     return tenantObj.phone || 'N/A';
                  }
               }
            }
         }
         return 'N/A';
      };

      const activeFloor = simulatedFloors.find(f => f._id === activeFloorId) || simulatedFloors[0];
      const floorRooms = getRoomsForFloor(activeFloorId);

      return (
         <div className="space-y-8 animate-fade pb-20">
            {/* Header / Back Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <button
                  onClick={() => { setSelectedHostel(null); setPortfolioData(null); }}
                  className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-[10px] font-black uppercase tracking-[0.2em] group w-fit"
               >
                  <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                  Back to Properties
               </button>
               <span className="text-[10px] font-black text-text-muted uppercase tracking-widest bg-card border border-divider rounded-xl px-4 py-2 shadow-subtle w-fit">
                  Asset Reference ID: #SN-P0{hostelDetails.id}
               </span>
            </div>

            {/* Banner Section */}
            <div className="card-classic overflow-hidden border border-divider/50 shadow-premium relative">
               <div className="h-80 relative">
                  <img src={hostelDetails.images[0]} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                  
                  {/* Status Overlay */}
                  <div className="absolute top-6 right-6 flex gap-2">
                     <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-2xl ${
                        hostelDetails.genderType === 'Boys' ? 'bg-indigo-500/80 text-white' : hostelDetails.genderType === 'Girls' ? 'bg-pink-500/80 text-white' : 'bg-emerald-500/80 text-white'
                     }`}>
                        {hostelDetails.genderType} Hub
                     </span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col md:flex-row md:items-end justify-between gap-6">
                     <div>
                        <span className="px-3 py-1 bg-primary text-white rounded-lg text-[9px] font-black uppercase tracking-widest mb-3 inline-block">
                           {hostelDetails.category}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight uppercase">{hostelDetails.name}</h1>
                        <p className="flex items-center gap-2 text-xs font-medium opacity-80 mt-1.5">
                           <MapPin size={14} className="text-primary" /> {hostelDetails.address}
                        </p>
                     </div>
                     
                     {/* Core Stats */}
                     <div className="flex gap-4 bg-slate-950/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shrink-0 text-center">
                        <div className="px-2">
                           <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">Capacity</p>
                           <h4 className="text-lg font-black text-white italic">{analytics.totalBeds} Beds</h4>
                        </div>
                        <div className="w-px h-6 bg-white/10 self-center" />
                        <div className="px-2">
                           <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">Occupancy</p>
                           <h4 className="text-lg font-black text-emerald-400 italic">{analytics.occupancyRate}%</h4>
                        </div>
                        <div className="px-2">
                           <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mb-1">Monthly Yield</p>
                           <h4 className="text-lg font-black text-primary italic">₹{analytics.monthlyRevenue.toLocaleString('en-IN')}</h4>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-divider gap-8 text-[11px] font-black uppercase tracking-wider overflow-x-auto pb-1">
               {['overview', 'owner', 'tenants', 'staff', 'rooms'].map((tab) => (
                  <button
                     key={tab}
                     onClick={() => setActiveTab(tab)}
                     className={`pb-3 transition-all relative ${
                        activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-text-primary'
                     }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>

            {/* TAB CONTENTS */}
            {activeTab === 'overview' && (
               <div className="grid grid-cols-12 gap-8">
                  {/* Left Column: Details Card */}
                  <div className="col-span-12 lg:col-span-8 space-y-6">
                     <div className="card-classic p-8 space-y-6 border border-divider/40">
                        <div>
                           <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">Hostel Asset Profile</h3>
                           <p className="text-xs text-text-muted mt-1">{hostelDetails.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                           <div className="space-y-1">
                              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block">Geographical Node Address</span>
                              <span className="text-xs font-bold text-text-primary">{hostelDetails.address}</span>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block">Operational Type</span>
                              <span className="text-xs font-bold text-text-primary">{hostelDetails.category}</span>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block">Contact Channels</span>
                              <span className="text-xs font-bold text-text-primary">{ownerDetails.phone} • {ownerDetails.email}</span>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block">Created Date</span>
                              <span className="text-xs font-bold text-text-primary">
                                 {new Date(hostelDetails.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                           </div>
                        </div>

                        {/* Amenities checklist */}
                        <div className="pt-4 border-t border-divider/30">
                           <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block mb-3">Amenities & Services Checklist</span>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {hostelDetails.amenities.map((item, idx) => (
                                 <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-white/5 border border-divider/40 rounded-xl">
                                    <CheckCircle2 size={12} className="text-primary" />
                                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-tight truncate">{item}</span>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Policies list */}
                        <div className="pt-4 border-t border-divider/30">
                           <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block mb-3">Hostel Protocols & Policies</span>
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-bold">
                              <div>
                                 <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Smoking</p>
                                 <p className="text-text-primary mt-0.5">{hostelDetails.policies.smoking}</p>
                              </div>
                              <div>
                                 <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Alcohol</p>
                                 <p className="text-text-primary mt-0.5">{hostelDetails.policies.alcohol}</p>
                              </div>
                              <div>
                                 <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Visitors</p>
                                 <p className="text-text-primary mt-0.5">{hostelDetails.policies.visitors}</p>
                              </div>
                              <div>
                                 <p className="text-[8px] font-black text-text-muted uppercase tracking-widest">Pets Allowed</p>
                                 <p className="text-text-primary mt-0.5">{hostelDetails.policies.pets}</p>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Pricing & Analytics Cards */}
                  <div className="col-span-12 lg:col-span-4 space-y-6">
                     <div className="card-classic p-6 space-y-4 border border-divider/40 bg-primary/5">
                        <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Operational Yield Matrix</h3>
                        <div className="space-y-3">
                           <div className="flex justify-between items-center py-2 border-b border-divider/30">
                              <span className="text-[10px] font-bold text-text-muted uppercase">Starting Rent</span>
                              <span className="text-xs font-black text-text-primary">₹{hostelDetails.startingPrice} / mo</span>
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-divider/30">
                              <span className="text-[10px] font-bold text-text-muted uppercase">Security Deposit</span>
                              <span className="text-xs font-black text-text-primary">₹{hostelDetails.securityDeposit}</span>
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-divider/30">
                              <span className="text-[10px] font-bold text-text-muted uppercase">Maintenance / mo</span>
                              <span className="text-xs font-black text-text-primary">₹{hostelDetails.maintenanceCharges}</span>
                           </div>
                           <div className="flex justify-between items-center py-2">
                              <span className="text-[10px] font-bold text-text-muted uppercase">Food Overhead / mo</span>
                              <span className="text-xs font-black text-text-primary">₹{hostelDetails.foodCharges}</span>
                           </div>
                        </div>
                     </div>

                     <div className="card-classic p-6 space-y-4 border border-divider/40">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Asset Capacity Ratio</h3>
                        <div className="flex items-center justify-between text-xs font-bold text-text-muted">
                           <span>Total Beds</span>
                           <span className="text-text-primary font-black">{analytics.totalBeds} Beds</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-white/5 h-2.5 rounded-full overflow-hidden">
                           <div className="bg-primary h-full rounded-full" style={{ width: `${analytics.occupancyRate}%` }} />
                        </div>
                        <div className="flex justify-between text-[10px] text-text-muted font-bold uppercase tracking-wider">
                           <span>{analytics.occupiedBeds} Occupied</span>
                           <span>{analytics.vacantBeds} Vacant</span>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'owner' && (
               <div className="grid grid-cols-12 gap-8">
                  {/* Left Column: Owner Profile details */}
                  <div className="col-span-12 lg:col-span-5">
                     <div className="card-classic p-8 flex flex-col items-center text-center space-y-6 border border-divider/40">
                        <img 
                           src={ownerDetails.profilePhoto} 
                           className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-md" 
                           alt={ownerDetails.name} 
                        />
                        <div>
                           <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary/10">
                              Registered Landlord
                           </span>
                           <h3 className="text-xl font-black text-text-primary tracking-tight mt-3 uppercase">{ownerDetails.name}</h3>
                           <p className="text-[10px] text-text-muted mt-1 uppercase font-bold tracking-wider">{ownerDetails.email}</p>
                        </div>
                        
                        <div className="w-full space-y-3 pt-4 border-t border-divider/30 text-left text-xs font-bold">
                           <div className="flex justify-between">
                              <span className="text-text-muted uppercase text-[10px]">Phone number</span>
                              <span className="text-text-primary">{ownerDetails.phone}</span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-text-muted uppercase text-[10px]">Account ID</span>
                              <span className="text-text-primary font-mono text-[10px]">#OWN-{hostelDetails.rawBuilding?.owner?.substring(18) || 'N/A'}</span>
                           </div>
                           <div>
                              <span className="text-text-muted uppercase text-[10px] block mb-1">Corporate Address</span>
                              <span className="text-text-primary block font-semibold">{ownerDetails.address}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Assigned Hostels */}
                  <div className="col-span-12 lg:col-span-7 space-y-6">
                     <div className="card-classic p-8 border border-divider/40">
                        <h3 className="text-lg font-black text-text-primary uppercase tracking-tight mb-6">Assigned Hostels Portfolio</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {ownerDetails.assignedHostels.map((hName) => (
                              <div key={hName.id} className="p-4 bg-slate-50 dark:bg-white/5 border border-divider/40 rounded-2xl flex items-start gap-3">
                                 <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Building2 size={18} />
                                 </div>
                                 <div className="min-w-0">
                                    <h4 className="text-xs font-black text-text-primary uppercase tracking-tight truncate">{hName.name}</h4>
                                    <p className="text-[10px] text-text-muted truncate mt-0.5">{hName.address}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'tenants' && (
               <div className="space-y-6">
                  {tenants.length === 0 ? (
                     <div className="card-classic p-12 text-center text-text-muted font-bold uppercase tracking-widest border border-dashed border-divider rounded-3xl">
                        No Tenants/Residents registered under this hostel node.
                     </div>
                  ) : (
                     <div className="layer-2 overflow-hidden border border-divider/40 rounded-[2rem] bg-surface">
                        <div className="overflow-x-auto scrollbar-hide">
                           <table className="w-full text-left border-collapse whitespace-nowrap">
                              <thead>
                                 <tr className="bg-card/25 border-b border-divider">
                                    <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Resident Manifest</th>
                                    <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Unit Mapped</th>
                                    <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Date Enrolled</th>
                                    <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">KYC Status</th>
                                    <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest">Rent Status</th>
                                    <th className="py-5 px-8 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Transactions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-border/50 text-xs">
                                 {tenants.map((t) => (
                                    <tr key={t.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all">
                                       <td className="py-5 px-8">
                                          <div className="flex items-center gap-4">
                                             <img src={t.profilePhoto} className="w-10 h-10 rounded-full object-cover shadow-sm border border-divider" alt="" />
                                             <div>
                                                <p className="text-[13px] font-black text-text-primary uppercase tracking-tight">{t.name}</p>
                                                <p className="text-[10px] font-medium text-text-muted">{t.phone} • {t.email}</p>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="py-5 px-8">
                                          <div className="flex flex-col">
                                             <span className="text-[11px] font-black text-text-primary italic">Room {t.room}</span>
                                             <span className="text-[9px] font-bold text-text-muted uppercase">Bed Alloc: {t.bedNumber}</span>
                                          </div>
                                       </td>
                                       <td className="py-5 px-8 font-semibold text-text-secondary">
                                          {new Date(t.checkInDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                       </td>
                                       <td className="py-5 px-8">
                                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                                             t.isVerified === 'Verified' ? 'bg-success/5 text-success border-success/15' : 'bg-warning/5 text-warning border-warning/15'
                                          }`}>
                                             {t.isVerified}
                                          </span>
                                       </td>
                                       <td className="py-5 px-8">
                                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                                             t.rentStatus === 'PAID' ? 'bg-success/5 text-success border-success/15' : 'bg-warning/5 text-warning border-warning/15'
                                          }`}>
                                             {t.rentStatus}
                                          </span>
                                       </td>
                                       <td className="py-5 px-8 text-right">
                                          <button 
                                             onClick={() => setSelectedTenantPayments(t)}
                                             className="px-3.5 py-1.5 bg-primary/10 hover:bg-primary hover:text-white text-primary rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                                          >
                                             Ledger ({t.paymentHistory.length})
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  )}
               </div>
            )}

            {activeTab === 'staff' && (
               <div>
                  {staff.length === 0 ? (
                     <div className="card-classic p-12 text-center text-text-muted font-bold uppercase tracking-widest border border-dashed border-divider rounded-3xl">
                        No Staff members currently registered or assigned to this hostel node.
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {staff.map((s) => (
                           <div key={s.id} className="card-classic p-6 flex flex-col space-y-4 border border-divider/40">
                              <div className="flex items-center gap-4">
                                 <img src={s.profilePhoto} className="w-12 h-12 rounded-xl object-cover shadow-sm border border-divider" alt="" />
                                 <div>
                                    <h4 className="text-sm font-black text-text-primary uppercase tracking-tight">{s.name}</h4>
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[8px] font-black uppercase tracking-widest border border-primary/10 mt-1 inline-block">
                                       {s.role}
                                    </span>
                                 </div>
                              </div>
                              
                              <div className="w-full space-y-2.5 pt-4 border-t border-divider/30 text-[11px] font-bold text-text-muted">
                                 <div className="flex justify-between">
                                    <span className="uppercase text-[9px]">Coverage zone</span>
                                    <span className="text-text-primary">{s.assignedFloors}</span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="uppercase text-[9px]">Phone number</span>
                                    <span className="text-text-primary">{s.phone}</span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="uppercase text-[9px]">Work shift</span>
                                    <span className="text-text-primary uppercase">{s.shift}</span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="uppercase text-[9px]">Attendance rate</span>
                                    <span className="text-success">{s.attendanceStatus}</span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="uppercase text-[9px]">Salary status</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${
                                       s.salaryStatus === 'Paid' ? 'bg-success/5 text-success border-success/15' : 'bg-warning/5 text-warning border-warning/15'
                                    }`}>{s.salaryStatus}</span>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            )}

            {activeTab === 'rooms' && (
               <div className="grid grid-cols-12 gap-8">
                  {/* Left Column: Floor levels picker & Rooms Grid */}
                  <div className="col-span-12 lg:col-span-8 space-y-6">
                     {/* Floor Picker Navigation */}
                     <div className="card-classic p-6 border border-divider/40">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em] mb-4">Floor Levels Navigation Map</h3>
                        <div className="flex flex-wrap gap-2.5">
                           {simulatedFloors.map((floor) => (
                              <button
                                 key={floor._id}
                                 onClick={() => setActiveFloorId(floor._id)}
                                 className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                    activeFloorId === floor._id
                                       ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                       : 'bg-background border-divider text-text-secondary hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-white/2'
                                 }`}
                              >
                                 <Layers size={14} />
                                 {floor.floorNumber}
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* Rooms Manifest of selected floor */}
                     <div className="card-classic p-8 border border-divider/40">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-divider/50">
                           <div>
                              <h3 className="text-lg font-black text-text-primary uppercase tracking-tight flex items-center gap-2">
                                 <Layers size={20} className="text-primary animate-pulse" />
                                 {activeFloor?.floorNumber || 'Floor Mapped'} Manifest
                              </h3>
                              <p className="text-xs text-text-muted mt-1 font-medium italic">
                                 {activeFloor?.description || 'Operational residential zone'}
                              </p>
                           </div>
                           <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/10">
                              {floorRooms.length} Living Units Mapped
                           </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {floorRooms.map((room) => {
                              const isRoomFull = room.status === 'FULL';
                              const capacity = room.capacity || 2;
                              const occupantsCount = isRoomFull ? capacity : (room.status === 'AVAILABLE' ? 1 : 0);
                              
                              const bedsList = hasRealFloors && room.beds && room.beds.length > 0
                                 ? room.beds
                                 : Array.from({ length: capacity }, (_, i) => ({
                                    _id: `${room._id}-b-${i}`,
                                    status: i < occupantsCount ? 'OCCUPIED' : 'AVAILABLE'
                                 }));

                              return (
                                 <div key={room._id} className="p-6 bg-slate-50/50 dark:bg-white/[0.01] border border-divider/50 rounded-2xl space-y-6 hover:border-primary/40 hover:shadow-glow transition-all duration-300 group">
                                    {/* Room Header */}
                                    <div className="flex justify-between items-start">
                                       <div>
                                          <div className="flex items-center gap-2">
                                             <h4 className="text-lg font-black text-text-primary tracking-tight">Room {room.roomNumber}</h4>
                                             <span className="px-2.5 py-0.5 rounded bg-primary/15 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20">
                                                {room.roomType}
                                             </span>
                                          </div>
                                          <p className="text-[10px] text-text-muted font-bold mt-1 uppercase italic">₹{room.rentAmount}/mo</p>
                                       </div>
                                       
                                       <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                          room.status === 'AVAILABLE' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                          room.status === 'MAINTENANCE' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                          'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
                                       }`}>
                                          {room.status}
                                       </span>
                                    </div>

                                    {/* Specifications badges */}
                                    <div className="flex flex-wrap gap-2">
                                       <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-divider text-text-secondary">{room.bathroom}</span>
                                       <span className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-divider text-text-secondary">{room.climate}</span>
                                    </div>

                                    {/* Bed Allocations Details */}
                                    <div className="space-y-4 pt-4 border-t border-divider/30">
                                       <div className="flex justify-between items-center text-[10px] font-black text-text-muted uppercase tracking-widest">
                                          <span>Bed Allocations</span>
                                          <span className="text-text-primary italic">{occupantsCount}/{capacity} Filled</span>
                                       </div>

                                       <div className="grid grid-cols-1 gap-2.5">
                                          {bedsList.map((bed, bedIdx) => {
                                             const isOccupied = bed.status === 'OCCUPIED';
                                             const residentName = getBedOccupant(room._id, bedIdx);
                                             const residentPhone = getBedPhone(room._id, bedIdx);

                                             return (
                                                <div 
                                                   key={bed._id || bedIdx}
                                                   className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                                                      isOccupied 
                                                         ? 'bg-primary/5 border-primary/20 text-primary' 
                                                         : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500'
                                                   }`}
                                                >
                                                   <div className="flex items-center gap-3">
                                                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                         isOccupied ? 'bg-primary/10' : 'bg-emerald-500/10'
                                                      }`}>
                                                         <BedDouble size={16} />
                                                      </div>
                                                      <div>
                                                         <p className="text-[11px] font-black uppercase tracking-wider">Bed {String.fromCharCode(65 + bedIdx)}</p>
                                                         {isOccupied ? (
                                                            <p className="text-[9px] text-text-muted font-bold lowercase italic">{residentName} ({residentPhone})</p>
                                                         ) : (
                                                            <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest italic">Vacant Ready</p>
                                                         )}
                                                      </div>
                                                   </div>
                                                   <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                                      isOccupied ? 'bg-primary/15 text-primary' : 'bg-emerald-500/15 text-emerald-500'
                                                   }`}>
                                                      {isOccupied ? 'Occupied' : 'Available'}
                                                   </span>
                                                </div>
                                             );
                                          })}
                                       </div>
                                    </div>

                                    {/* Room Amenities & Assets Checklist */}
                                    <div className="pt-4 border-t border-divider/30">
                                       <div className="flex justify-between items-center text-[10px] font-black text-text-muted uppercase tracking-widest mb-3">
                                          <span>Room Asset Health Checklist</span>
                                          <span className="text-text-primary italic">100% Operational</span>
                                       </div>
                                       <div className="grid grid-cols-3 gap-2">
                                          {['Desk & Chair', 'Wardrobe', 'Ceiling Fan'].map((asset, assetIdx) => (
                                             <div key={assetIdx} className="flex items-center gap-1.5 p-2 bg-background border border-divider/50 rounded-lg">
                                                <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
                                                <span className="text-[8px] font-bold text-text-secondary uppercase tracking-tight">{asset}</span>
                                             </div>
                                          ))}
                                       </div>
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Room & Occupancy Analytics */}
                  <div className="col-span-12 lg:col-span-4 space-y-6">
                     <div className="card-classic p-6 space-y-6 border border-divider/40">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Room Analytics</h3>
                        <div className="space-y-4 text-xs font-bold">
                           <div className="flex justify-between items-center py-2 border-b border-divider/30">
                              <span className="text-text-muted uppercase text-[9px]">Total Rooms</span>
                              <span className="text-text-primary font-black">{analytics.totalRooms} Units</span>
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-divider/30">
                              <span className="text-text-muted uppercase text-[9px] flex items-center gap-2"><div className="w-2.5 h-2.5 bg-indigo-500 rounded" /> Occupied Rooms</span>
                              <span className="text-text-primary font-black">{analytics.occupiedRooms} Units</span>
                           </div>
                           <div className="flex justify-between items-center py-2 border-b border-divider/30">
                              <span className="text-text-muted uppercase text-[9px] flex items-center gap-2"><div className="w-2.5 h-2.5 bg-emerald-500 rounded" /> Vacant Rooms</span>
                              <span className="text-text-primary font-black">{analytics.vacantRooms} Units</span>
                           </div>
                           <div className="flex justify-between items-center py-2">
                              <span className="text-text-muted uppercase text-[9px] flex items-center gap-2"><div className="w-2.5 h-2.5 bg-amber-500 rounded" /> Maint. Rooms</span>
                              <span className="text-text-primary font-black">{analytics.maintenanceRooms} Units</span>
                           </div>
                        </div>
                     </div>

                     {/* Floor-wise stats list */}
                     <div className="card-classic p-6 space-y-6 border border-divider/40">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-[0.2em]">Floor Occupancy Distribution</h3>
                        <div className="space-y-4">
                           {analytics.floorWiseOccupancy.map((fStat) => (
                              <div key={fStat.floorId} className="space-y-2 text-xs font-bold">
                                 <div className="flex justify-between">
                                    <span className="text-text-primary uppercase text-[9px]">{fStat.floorNumber}</span>
                                    <span className="text-text-muted text-[10px]">{fStat.occupiedBeds} / {fStat.totalBeds} Beds ({fStat.occupancyPercentage}%)</span>
                                 </div>
                                 <div className="w-full bg-slate-100 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full rounded-full" style={{ width: `${fStat.occupancyPercentage}%` }} />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </div>
      );
   }

   const filteredHostelsList = hostels.filter(h => {
      const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || h.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      // City match
      const matchesCity = filterCity === 'All Cities' || 
                          (h.rawBuilding?.locationCity && h.rawBuilding.locationCity.toLowerCase() === filterCity.toLowerCase());
      
      // Category match
      const matchesCategory = filterCategory === 'All Categories' || h.type === filterCategory;
      
      // Status match
      const matchesStatus = filterStatus === 'All Statuses' || h.status === filterStatus;
      
      // Amenities match
      const matchesAmenities = selectedAmenities.length === 0 || 
                               selectedAmenities.every(amenity => h.amenities.map(a => a.toLowerCase()).includes(amenity));
      
      // Price match
      const startingPrice = h.rawBuilding?.startingPrice || 8500;
      const matchesMinPrice = minPrice === '' || startingPrice >= Number(minPrice);
      const matchesMaxPrice = maxPrice === '' || startingPrice <= Number(maxPrice);
      
      return matchesSearch && matchesCity && matchesCategory && matchesStatus && matchesAmenities && matchesMinPrice && matchesMaxPrice;
   });

   const displayedHostels = filteredHostelsList.slice(hostelPage * hostelsPerPage, (hostelPage + 1) * hostelsPerPage);

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
                <button 
                  onClick={handleAuditTrail}
                  className="flex items-center gap-2 px-5 py-2.5 bg-card border border-divider rounded-xl text-[11px] font-black uppercase tracking-widest text-text-secondary hover:border-primary transition-all shadow-subtle"
                >
                   <Download size={16} /> Audit Trail
                </button>
             </div>
         </div>

         {/* --- PORTFOLIO STATS --- */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {portfolioStats.map((stat, i) => (
               <div key={i} className="card-classic p-6 flex items-center gap-5 group border-none glass-effect">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 ${getStatColorClasses(stat.color)}`}>
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
                  placeholder="Search properties by name, location or manager..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setHostelPage(0); }}
               />
            </div>
            <div className="flex gap-3">
               <select
                  className="bg-card border border-divider rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-widest text-text-primary outline-none focus:border-primary shadow-subtle cursor-pointer"
                  value={filterCity}
                  onChange={(e) => { setFilterCity(e.target.value); setHostelPage(0); }}
               >
                  <option value="All Cities">All Cities</option>
                  {uniqueCities.map(city => (
                     <option key={city} value={city}>{city}</option>
                  ))}
               </select>
                <button 
                  onClick={handleMoreFilters}
                  className={`flex items-center gap-2 px-6 py-3.5 border rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-subtle ${
                     showAdvancedFilters 
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                        : 'bg-card border-divider text-text-secondary hover:text-primary'
                  }`}
                >
                   <Filter size={16} /> More Filters
                </button>
            </div>
         </div>

         {/* --- COLLAPSIBLE ADVANCED FILTERS PANEL --- */}
         <AnimatePresence>
            {showAdvancedFilters && (
               <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
               >
                  <div className="card-classic p-6 space-y-6 bg-slate-50/50 dark:bg-white/[0.01] border-divider/70">
                     <div className="flex justify-between items-center pb-3 border-b border-divider/50">
                        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-text-secondary flex items-center gap-2">
                           <Settings2 size={16} className="text-primary animate-spin-slow" />
                           Advanced Filter Controls
                        </h4>
                        <button
                           onClick={() => {
                              setFilterCategory('All Categories');
                              setFilterStatus('All Statuses');
                              setSelectedAmenities([]);
                              setMinPrice('');
                              setMaxPrice('');
                              setHostelPage(0);
                           }}
                           className="text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-danger transition-colors"
                        >
                           Reset All Filters
                        </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Category Filter */}
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Property Category</label>
                           <select
                              className="w-full bg-card border border-divider rounded-xl py-3 px-4 text-xs font-black uppercase tracking-widest text-text-primary outline-none focus:border-primary shadow-subtle cursor-pointer"
                              value={filterCategory}
                              onChange={(e) => { setFilterCategory(e.target.value); setHostelPage(0); }}
                           >
                              <option value="All Categories">All Categories</option>
                              <option value="Premium PG">Premium PG</option>
                              <option value="Standard Hostel">Standard Hostel</option>
                              <option value="Executive Suites">Executive Suites</option>
                           </select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Status</label>
                           <select
                              className="w-full bg-card border border-divider rounded-xl py-3 px-4 text-xs font-black uppercase tracking-widest text-text-primary outline-none focus:border-primary shadow-subtle cursor-pointer"
                              value={filterStatus}
                              onChange={(e) => { setFilterStatus(e.target.value); setHostelPage(0); }}
                           >
                              <option value="All Statuses">All Statuses</option>
                              <option value="Active">Active</option>
                              <option value="Draft">Draft</option>
                           </select>
                        </div>

                        {/* Price Range Filters */}
                        <div className="space-y-2 col-span-1 md:col-span-2">
                           <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Budget Range (Monthly Rent)</label>
                           <div className="flex items-center gap-3">
                              <input
                                 type="number"
                                 placeholder="Min (₹)"
                                 className="w-full bg-card border border-divider rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-primary transition-all text-text-primary shadow-subtle"
                                 value={minPrice}
                                 onChange={(e) => { setMinPrice(e.target.value); setHostelPage(0); }}
                              />
                              <span className="text-text-muted font-bold text-xs">to</span>
                              <input
                                 type="number"
                                 placeholder="Max (₹)"
                                 className="w-full bg-card border border-divider rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-primary transition-all text-text-primary shadow-subtle"
                                 value={maxPrice}
                                 onChange={(e) => { setMaxPrice(e.target.value); setHostelPage(0); }}
                              />
                           </div>
                        </div>
                     </div>

                     {/* Amenities Filters */}
                     <div className="space-y-3 pt-3 border-t border-divider/30">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Required Amenities</label>
                        <div className="flex flex-wrap gap-2.5">
                           {['Wifi', 'AC', 'Gym', 'Laundry', 'Parking', 'Kitchen'].map(amenity => {
                              const isSelected = selectedAmenities.includes(amenity.toLowerCase());
                              return (
                                 <button
                                    key={amenity}
                                    onClick={() => {
                                       const low = amenity.toLowerCase();
                                       if (isSelected) {
                                          setSelectedAmenities(selectedAmenities.filter(a => a !== low));
                                       } else {
                                          setSelectedAmenities([...selectedAmenities, low]);
                                       }
                                       setHostelPage(0);
                                    }}
                                    className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                                       isSelected
                                          ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                          : 'bg-card border-divider text-text-secondary hover:border-primary/30'
                                    }`}
                                 >
                                    {amenity}
                                 </button>
                              );
                           })}
                        </div>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* --- PROPERTY GRID --- */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {displayedHostels.map((h) => (
                <motion.div
                   key={h.id}
                   layout
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   onClick={() => handleViewPortfolio(h)} className="card-classic group flex flex-col overflow-hidden relative cursor-pointer hover:shadow-premium hover:-translate-y-1 transition-all duration-300 border border-divider/40"
                >
                   {/* Image Section */}
                   <div className="relative h-52 overflow-hidden">
                      <img src={h.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={h.name} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-90" />

                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 flex gap-2">
                         <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 shadow-xl ${h.status === 'Active' ? 'bg-success/80 text-white' : h.status === 'Inactive' ? 'bg-rose-500/80 text-white' : 'bg-warning/80 text-white'
                            }`}>
                            {h.status}
                         </span>
                      </div>
                      
                      {/* Hostel Type Badge */}
                      <div className="absolute bottom-4 left-4">
                         <span className="px-2.5 py-1 bg-primary/95 text-white rounded text-[8px] font-black uppercase tracking-widest">
                            {h.type}
                         </span>
                      </div>
                   </div>

                   {/* Content Section */}
                   <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                         <div className="flex justify-between items-start">
                            <h3 className="text-lg font-black text-text-primary tracking-tight leading-tight truncate uppercase">{h.name}</h3>
                         </div>
                         <div className="flex items-center gap-1.5 text-text-muted text-[10px] font-bold uppercase tracking-wide mt-1 italic">
                            <MapPin size={12} className="text-primary shrink-0" /> {h.location}
                         </div>
                         <div className="mt-1 text-[10px] text-text-muted font-bold uppercase tracking-wider">
                            Owner: <span className="text-text-primary font-black">{h.ownerName}</span>
                         </div>
                      </div>

                      {/* Enriched Stats Grid */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                         <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-divider/40">
                            <p className="text-[8px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Occupancy</p>
                            <span className="font-bold text-text-primary block">{h.tenantCount} Beds / {h.occupancy}%</span>
                         </div>
                         <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-divider/40">
                            <p className="text-[8px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Staff Covered</p>
                            <span className="font-bold text-text-primary block">{h.staffCount} Members</span>
                         </div>
                         <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-divider/40 col-span-2">
                            <p className="text-[8px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Rooms (Total / Occ / Vac)</p>
                            <span className="font-bold text-text-primary block">{h.totalRoomsCount} Rooms ({h.occupiedRoomsCount} Occ • {h.vacantRoomsCount} Vac)</span>
                         </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-divider/40">
                         <button
                            onClick={(e) => { e.stopPropagation(); handleViewPortfolio(h); }}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm"
                         >
                            <Eye size={12} /> View Portfolio
                         </button>
                         <div className="flex gap-2">
                            <button 
                               onClick={(e) => { e.stopPropagation(); handleEdit(h); }} 
                               className="p-2 border border-divider text-text-muted hover:text-primary hover:bg-slate-50 rounded-xl transition-all"
                               title="Edit Property"
                            >
                               <Edit3 size={12} />
                            </button>
                            {userRole === 'admin' && (
                               <button 
                                  onClick={(e) => { e.stopPropagation(); handleDelete(h.id); }} 
                                  className="p-2 border border-divider text-text-muted hover:text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all"
                                  title="Delete Property"
                               >
                                  <Trash2 size={12} />
                               </button>
                            )}
                         </div>
                      </div>
                   </div>
                </motion.div>
            ))}
         </div>

         {/* Pagination Controls for Hostels */}
         <div className="flex justify-center mt-8 gap-2">
            {hostelPage > 0 && (
               <button onClick={(e) => { e.stopPropagation(); setHostelPage(prev => Math.max(prev - 1, 0)); }} className="px-4 py-2 bg-primary text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-primary-dark transition-colors">
                  Prev
               </button>
            )}
            {(hostelPage + 1) * hostelsPerPage < filteredHostelsList.length && (
               <button onClick={(e) => { e.stopPropagation(); setHostelPage(prev => prev + 1); }} className="px-4 py-2 bg-primary text-white rounded text-xs font-bold uppercase tracking-widest hover:bg-primary-dark transition-colors">
                  Next
               </button>
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
                           onClick={handleSave}
                           className="px-8 py-3 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all animate-pulse"
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
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${currentStep >= s.id ? 'bg-primary border-primary text-white shadow-glow' : 'bg-card border-divider text-text-muted'
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
                                 <input 
                                    className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" 
                                    value={formData.name} 
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Sapphire Heights" 
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Category</label>
                                 <select 
                                    className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer" 
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                 >
                                    <option value="Premium PG">Premium PG</option>
                                    <option value="Standard Hostel">Standard Hostel</option>
                                    <option value="Executive Suites">Executive Suites</option>
                                 </select>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Geographical Hub Address</label>
                                 <div className="relative flex items-center group">
                                    <MapPin className="absolute left-4 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                                    <input 
                                       className="w-full bg-background border border-divider rounded-xl py-3.5 pl-12 pr-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" 
                                       value={formData.address}
                                       onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                       placeholder="Enter full address..." 
                                    />
                                 </div>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Location City</label>
                                 <select 
                                    className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary cursor-pointer" 
                                    value={formData.locationCity}
                                    onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                                 >
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Pune">Pune</option>
                                    <option value="Mumbai">Mumbai</option>
                                 </select>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Amenities</label>
                              <div className="flex flex-wrap gap-2 pt-2">
                                 {['Wifi', 'AC', 'Gym', 'Laundry', 'Parking', 'Kitchen'].map(a => {
                                    const isChecked = formData.amenities.includes(a);
                                    return (
                                       <label key={a} className="flex items-center gap-2 px-4 py-2 bg-background border border-divider rounded-lg cursor-pointer hover:border-primary transition-all">
                                          <input 
                                             type="checkbox" 
                                             className="w-4 h-4 rounded accent-primary" 
                                             checked={isChecked}
                                             onChange={() => {
                                                const updated = isChecked
                                                   ? formData.amenities.filter(item => item !== a)
                                                   : [...formData.amenities, a];
                                                setFormData({ ...formData, amenities: updated });
                                             }}
                                          />
                                          <span className="text-[11px] font-black uppercase tracking-tight text-text-secondary">{a}</span>
                                       </label>
                                    );
                                 })}
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
                           <div className="border-2 border-dashed border-divider rounded-3xl p-12 bg-slate-50 dark:bg-white/5 group hover:border-primary transition-all">
                              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform">
                                 <Camera size={40} />
                              </div>
                              <h4 className="text-xl font-black text-text-primary tracking-tight">Media Hub</h4>
                              <p className="text-[11px] text-text-muted uppercase tracking-widest mt-2 font-bold">Upload high-resolution property image URL</p>
                              <input 
                                 type="text" 
                                 className="mt-6 w-full bg-background border border-divider rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-primary transition-all text-text-primary" 
                                 value={formData.image}
                                 onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                 placeholder="e.g. https://images.unsplash.com/..." 
                              />
                           </div>
                           {formData.image && (
                              <div className="relative aspect-video rounded-3xl overflow-hidden border border-divider shadow-premium group">
                                 <img src={formData.image} className="w-full h-full object-cover" alt="" />
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
                                 <input 
                                    type="number" 
                                    className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" 
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                                    placeholder="00" 
                                 />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-1">Base Rental (Monthly)</label>
                                 <input 
                                    type="number"
                                    className="w-full bg-background border border-divider rounded-xl py-3.5 px-5 text-sm focus:outline-none focus:border-primary transition-all text-text-primary" 
                                    value={formData.startingPrice}
                                    onChange={(e) => setFormData({ ...formData, startingPrice: Number(e.target.value) })}
                                    placeholder="₹ 0.00" 
                                 />
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

export default Hostels;