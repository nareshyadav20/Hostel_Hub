import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Building, BedDouble, UsersRound, DollarSign, AlertCircle, 
  Search, Filter, ArrowUpDown, Bell, Plus, LogOut, X, 
  LayoutDashboard, Users, CreditCard, ChevronDown, CheckCircle,
  TrendingUp, TrendingDown, MoreVertical, MapPin, Activity,
  Wifi, Wind, Utensils, Shield, Shirt, Car, Zap, Dumbbell,
  ShieldCheck, BookOpen, Coffee, Gamepad, Fingerprint, Droplets,
  Armchair, ClipboardList, Star, ChevronRight, ChevronLeft,
  Smartphone, UserCheck, Briefcase, FileText, Calendar, Clock,
  Heart, Home, ArrowLeft, Settings, Trash2
} from 'lucide-react';
import { api } from '../mockData';

// --- CONSTANTS MOVED OUTSIDE FOR STABILITY ---
const FEATURE_GROUPS = {
  'Accommodation': ['Furnished Rooms', 'AC Rooms', 'Attached Bathroom'],
  'Connectivity': ['WiFi'],
  'Security': ['CCTV', 'Security Guard', 'Biometric Access'],
  'Utilities': ['Power Backup', '24/7 Water', 'Laundry'],
  'Comfort & Lifestyle': ['Study Table', 'Wardrobe', 'Lounge Area'],
  'Premium': ['Gym', 'Parking', 'Recreation Area']
};

const AMENITY_ICONS = {
  'WiFi': <Wifi size={14} />, 'AC Rooms': <Wind size={14} />, 'Attached Bathroom': <Droplets size={14} />,
  'CCTV': <Shield size={14} />, 'Security Guard': <ShieldCheck size={14} />, 'Biometric Access': <Fingerprint size={14} />,
  'Power Backup': <Zap size={14} />, '24/7 Water': <Droplets size={14} />, 'Laundry': <Shirt size={14} />,
  'Study Table': <BookOpen size={14} />, 'Wardrobe': <Smartphone size={14} />, 'Lounge Area': <Coffee size={14} />,
  'Gym': <Dumbbell size={14} />, 'Parking': <Car size={14} />, 'Recreation Area': <Gamepad size={14} />,
  'Furnished Rooms': <Armchair size={14} />, 'Food Included': <Utensils size={14} />
};

const AVAILABLE_FILTER_FEATURES = [
  'WiFi', 'AC Rooms', 'Food Included', 'CCTV', 'Laundry', 'Parking', 'Power Backup', 'Gym'
];

const STEP_CONFIG = [
  { step: 1,  title: 'Basic Info',      icon: '🏨', desc: 'Name, type, description' },
  { step: 2,  title: 'Location',        icon: '📍', desc: 'Address & landmarks' },
  { step: 3,  title: 'Structure',       icon: '🏗️',  desc: 'Buildings & rooms' },
  { step: 4,  title: 'Pricing',         icon: '💰', desc: 'Rent & deposits' },
  { step: 5,  title: 'Room Setup',      icon: '🛏️',  desc: 'Room configuration' },
  { step: 6,  title: 'Food & Mess',     icon: '🍽️',  desc: 'Meals & plans' },
  { step: 7,  title: 'Amenities',       icon: '✨', desc: 'Facilities & features' },
  { step: 8,  title: 'Policies',        icon: '📋', desc: 'Rules & stay terms' },
  { step: 9,  title: 'Staff',           icon: '👤', desc: 'Warden & contacts' },
  { step: 10, title: 'Owner Details',   icon: '🔑', desc: 'Contact information' },
  { step: 11, title: 'Review',          icon: '✅', desc: 'Final summary' },
];

const INITIAL_FORM_STATE = {
  name: '', buildingName: '', propertyType: 'Hostel', gender: '', 
  shortDesc: '', longDesc: '', coverImage: null, gallery: [],
  addr1: '', addr2: '', city: '', state: '', pincode: '', landmark: '',
  numBuildings: 1, numFloors: 1, totalRooms: '', totalBeds: '', roomTypes: [],
  rentBed: '', rentRoom: '', deposit: '', maintenance: '',
  electricity: 'Included', water: 'Included',
  roomBaseName: '', roomTypeSelect: 'Single', bedsPerRoom: 1,
  foodAvailable: 'No', mealPlans: [], foodType: 'Veg', messCharges: '',
  amenities: [],
  visitorPolicy: '', smokingPolicy: 'Not Allowed', alcoholPolicy: 'Not Allowed',
  petsAllowed: 'No', minStay: '', noticePeriod: '', checkIn: '', checkOut: '',
  staffName: '', staffRole: '', staffContact: '',
  ownerName: '', phone: '', altPhone: '', email: ''
};

const Portfolio = () => {
  const [data, setData] = useState({
    buildings: [], floors: [], rooms: [], beds: [], tenants: [], complaints: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // STEPPER FORM STATE
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [drafts, setDrafts] = useState([]);
  const [activeDraftId, setActiveDraftId] = useState(null);
  const [draftMsg, setDraftMsg] = useState('');
  const [showDrafts, setShowDrafts] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [occupancyFilter, setOccupancyFilter] = useState('All');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      console.error("Logout error", err);
      window.location.href = '/login';
    }
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [b, f, r, bd, t, c] = await Promise.all([
        api.getBuildings().catch(() => []), 
        api.getAllFloors().catch(() => []), 
        api.getAllRooms().catch(() => []),
        api.getAllBeds().catch(() => []), 
        api.getTenants().catch(() => []), 
        api.getComplaints().catch(() => [])
      ]);
      setData({
        buildings: b || [], floors: f || [], rooms: r || [], 
        beds: bd || [], tenants: t || [], complaints: c || []
      });
    } catch (err) {
      console.error("Data fetch error", err);
      setError("Failed to load property data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Load drafts from backend buildings with status: 'Draft'
  const loadDrafts = useCallback(async () => {
    try {
      const allBuildings = await api.getBuildings();
      setDrafts(allBuildings.filter(b => b.status === 'Draft').map(b => ({ ...b, id: b._id || b.id })));
    } catch (err) { console.error('Draft load error', err); }
  }, []);

  useEffect(() => { loadDrafts(); }, [loadDrafts]);

  // Auto-save draft when form data or step changes (debounced)
  useEffect(() => {
    if (!isAddModalOpen) return;
    // Only trigger if user has typed something meaningful
    const hasData = formData.name || formData.addr1 || formData.city || formData.gender || formData.rentBed;
    if (!hasData) return;
    const t = setTimeout(() => {
      saveDraftToBackend(formData, currentStep, activeDraftId);
    }, 1200);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, formData, isAddModalOpen]);

  const saveDraftToBackend = useCallback(async (data, step, draftId = null) => {
    const payload = {
      name: data.name || 'Untitled Draft',
      address: `${data.addr1 || ''}, ${data.city || ''}, ${data.state || ''}`.trim().replace(/^,\s*|,\s*$/g, '') || 'Draft',
      locationCity: data.city || 'Bengaluru',
      genderType: data.gender === 'Co-living (Both)' ? 'Mixed' : data.gender || 'Mixed',
      status: 'Draft',
      lastStep: step,
      draftData: data,
    };
    try {
      let bId;
      if (draftId) {
        await api.updateBuilding(draftId, payload);
        bId = draftId;
      } else {
        const res = await api.addBuilding(payload);
        bId = res._id || res.id;
      }
      setActiveDraftId(bId);
      setDraftMsg('✅ Draft saved!');
      loadDrafts();
      setTimeout(() => setDraftMsg(''), 2500);
      return bId;
    } catch (err) { 
      console.error('Draft save failed:', err);
      setDraftMsg('⚠️ Save failed'); 
      setTimeout(() => setDraftMsg(''), 2500); 
    }
  }, [loadDrafts]);

  const openFreshForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setCurrentStep(1);
    setActiveDraftId(null);
    setDraftMsg('');
    setIsAddModalOpen(true);
  };

  const resumeDraft = (draft) => {
    const data = draft.draftData || INITIAL_FORM_STATE;
    setFormData({ ...INITIAL_FORM_STATE, ...data });
    setCurrentStep(draft.lastStep || 1);
    setActiveDraftId(draft._id || draft.id);
    setDraftMsg('🔄 Resuming your draft...');
    setShowDrafts(false);
    setIsAddModalOpen(true);
    setTimeout(() => setDraftMsg(''), 2500);
  };

  const deleteDraft = async (id) => {
    try {
      await api.deleteBuilding(id);
      loadDrafts();
      if (activeDraftId === id) {
        setActiveDraftId(null);
        setIsAddModalOpen(false);
      }
    } catch { alert('Could not delete draft.'); }
  };

  const handleCreateHostel = async (e) => {
    e.preventDefault();
    if (currentStep < 11) {
      // Auto-save as draft when advancing steps
      saveDraftToBackend(formData, currentStep + 1, activeDraftId);
      setCurrentStep(s => s + 1);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const extendedDesc = `# Property Overview\n**Type:** ${formData.propertyType} | **Gender:** ${formData.gender}\n**Capacity:** ${formData.totalRooms} Rooms, ${formData.totalBeds} Beds\n# Pricing\n- Rent: ₹${formData.rentBed}/bed, ₹${formData.rentRoom}/room\n- Deposit: ₹${formData.deposit}\n# Contact: ${formData.ownerName} (${formData.phone})\n---\n${formData.longDesc || formData.shortDesc || ''}`;

      const payload = {
        name: formData.name || 'New Hostel',
        address: `${formData.addr1 || ''}, ${formData.city || ''}, ${formData.state || ''}`,
        locationCity: formData.city || 'Bengaluru',
        description: extendedDesc,
        amenities: formData.amenities || [],
        images: formData.coverImage ? [formData.coverImage] : [],
        startingPrice: parseInt(formData.rentBed) || 5000,
        genderType: formData.gender === 'Co-living (Both)' ? 'Mixed' : formData.gender || 'Mixed',
        category: formData.propertyType === 'Co-living' ? 'Luxury' : (formData.propertyType === 'PG' ? 'Student' : 'Professional'),
        rating: 4.5,
        popularityLabel: 'New Property',
        status: 'Active',
        policies: {
          smoking: formData.smokingPolicy || 'Not Allowed',
          alcohol: formData.alcoholPolicy || 'Not Allowed',
          pets: formData.petsAllowed || 'No',
          visitors: formData.visitorPolicy || 'Till 8 PM'
        },
        staffInfo: { name: formData.staffName, role: formData.staffRole, contact: formData.staffContact }
      };

      if (activeDraftId) {
        // Upgrade existing draft to Active
        await api.updateBuilding(activeDraftId, payload);
      } else {
        await api.addBuilding(payload);
      }
      setFormData(INITIAL_FORM_STATE);
      setCurrentStep(1);
      setActiveDraftId(null);
      setIsAddModalOpen(false);
      loadDrafts();
      fetchData();
    } catch (err) {
      console.error("Submission error", err);
      alert("Failed to create hostel. Please check your network.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildingStats = useMemo(() => {
    if (!data?.buildings || !Array.isArray(data.buildings)) return [];
    
    return data.buildings.map(b => {
      try {
        const bId = b?.id || b?._id || `temp-${Math.random()}`;
        const bFloors = (data.floors || []).filter(f => f?.building === bId || f?.buildingId === bId);
        const bRooms = (data.rooms || []).filter(r => r && bFloors.some(f => f && (f._id === (r.floor?._id || r.floor) || f.id === (r.floorId || r.floor))));
        const bBeds = (data.beds || []).filter(bed => bed && bRooms.some(r => r && (r._id === (bed.room?._id || bed.room) || r.id === (bed.roomId || bed.room))));
        
        const totalBeds = bBeds.length;
        const occupiedBeds = bBeds.filter(bed => bed?.status === 'OCCUPIED').length;
        const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
        
        const monthlyRevenue = occupiedBeds * 8500;
        const pendingDues = Math.round(monthlyRevenue * 0.12);
        
        const bRoomNumbers = bRooms.map(r => r?.roomNumber).filter(Boolean);
        const bComplaints = (data.complaints || []).filter(c => c && bRoomNumbers.includes(c.room));
        
        let amenities = Array.isArray(b?.amenities) ? [...b.amenities] : [];
        if (bRooms.some(r => r?.roomNumber?.includes('-AC'))) {
          if (!amenities.includes('AC Rooms')) amenities.push('AC Rooms');
        }
        if (amenities.length === 0) amenities = ['WiFi', 'CCTV', 'Power Backup'];

        let status = 'Active';
        if (occupancyRate < 50) status = 'Low Occupancy';
        if (bComplaints.filter(c => c?.urgency === 'High').length > 0) status = 'Attention Needed';

        const rating = b?.rating || "4.5";
        const popularityLabel = b?.popularityLabel || null;

        return {
          ...b,
          id: bId,
          name: b?.name || 'Unnamed Property',
          totalRooms: bRooms.length,
          totalBeds,
          occupiedBeds,
          occupancyRate,
          monthlyRevenue,
          pendingDues,
          complaintsCount: bComplaints.length,
          status,
          rating,
          popularityLabel,
          features: amenities
        };
      } catch (_err) {
        return { id: `err-${Date.now()}`, name: 'Error Loading', occupancyRate: 0, features: [], status: 'Error' };
      }
    });
  }, [data]);

  const globalStats = useMemo(() => {
    if (!buildingStats || buildingStats.length === 0) return { totalBuildings: 0, totalRooms: 0, totalBeds: 0, occupiedBeds: 0, occupancyRate: 0, totalRevenue: 0, totalDues: 0, totalComplaints: 0 };
    try {
      const totalBeds = buildingStats.reduce((acc, b) => acc + (b.totalBeds || 0), 0);
      const occupiedBeds = buildingStats.reduce((acc, b) => acc + (b.occupiedBeds || 0), 0);
      return {
        totalBuildings: buildingStats.length,
        totalRooms: buildingStats.reduce((acc, b) => acc + (b.totalRooms || 0), 0),
        totalBeds, occupiedBeds,
        occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
        totalRevenue: buildingStats.reduce((acc, b) => acc + (b.monthlyRevenue || 0), 0),
        totalDues: buildingStats.reduce((acc, b) => acc + (b.pendingDues || 0), 0),
        totalComplaints: buildingStats.reduce((acc, b) => acc + (b.complaintsCount || 0), 0)
      };
    } catch (_err) {
      return { totalBuildings: 0, totalRooms: 0, totalBeds: 0, occupiedBeds: 0, occupancyRate: 0, totalRevenue: 0, totalDues: 0, totalComplaints: 0 };
    }
  }, [buildingStats]);

  const processedBuildings = useMemo(() => {
    if (!buildingStats) return [];
    return buildingStats
      .filter(b => {
        try {
          const bName = (b.name || '').toLowerCase();
          const bAddr = (b.address || '').toLowerCase();
          const sTerm = (searchTerm || '').toLowerCase();
          const matchesSearch = bName.includes(sTerm) || bAddr.includes(sTerm);
          const matchesOccupancy = occupancyFilter === 'All' || (occupancyFilter === 'High' && b.occupancyRate >= 80) || (occupancyFilter === 'Medium' && b.occupancyRate >= 50 && b.occupancyRate < 80) || (occupancyFilter === 'Low' && b.occupancyRate < 50);
          const matchesFeatures = selectedFeatures.length === 0 || selectedFeatures.every(f => b.features?.includes(f));
          return matchesSearch && matchesOccupancy && matchesFeatures;
        } catch (_err) { return false; }
      })
      .sort((a, b) => {
        try {
          if (sortBy === 'revenue') return (b.monthlyRevenue || 0) - (a.monthlyRevenue || 0);
          if (sortBy === 'occupancy') return (b.occupancyRate || 0) - (a.occupancyRate || 0);
          if (sortBy === 'complaints') return (b.complaintsCount || 0) - (a.complaintsCount || 0);
          return (a.name || '').localeCompare(b.name || '');
        } catch (err) { return 0; }
      });
  }, [buildingStats, searchTerm, occupancyFilter, selectedFeatures, sortBy]);

  const kpis = [
    { label: 'Properties', value: globalStats.totalBuildings, icon: <Building2 size={20}/>, color: 'var(--accent-primary)' },
    { label: 'Total Rooms', value: globalStats.totalRooms, icon: <LayoutDashboard size={20}/>, color: '#6366F1' },
    { label: 'Total Beds', value: globalStats.totalBeds, icon: <BedDouble size={20}/>, color: '#8B5CF6' },
    { label: 'Occupancy', value: `${globalStats.occupancyRate}%`, icon: <Activity size={20}/>, color: '#10B981' },
    { label: 'Revenue', value: `₹${(globalStats.totalRevenue / 100000).toFixed(1)}L`, icon: <DollarSign size={20}/>, color: '#10B981' },
    { label: 'Pending Dues', value: `₹${(globalStats.totalDues / 1000).toFixed(0)}k`, icon: <CreditCard size={20}/>, color: '#EF4444' },
    { label: 'Complaints', value: globalStats.totalComplaints, icon: <AlertCircle size={20}/>, color: '#F59E0B' },
    { label: 'Total Staff', value: data.staffCount || 12, icon: <Users size={20}/>, color: '#8B5CF6' }
  ];

  const renderStep = () => {
    switch(currentStep) {
      case 1: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group"><label>Hostel Name *</label><input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Royal Residency" /></div>
            <div className="input-group"><label>Building Name</label><input value={formData.buildingName} onChange={e => setFormData({...formData, buildingName: e.target.value})} placeholder="Phase 1 Tower" /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group"><label>Property Type</label><select value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})}><option>Hostel</option><option>PG</option><option>Co-living</option></select></div>
            <div className="input-group"><label>Gender Allowed *</label><select required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}><option value="">Select...</option><option>Boys</option><option>Girls</option><option>Co-living (Both)</option></select></div>
          </div>
          <div className="input-group"><label>Description</label><textarea rows={3} value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} placeholder="Short summary..." /></div>
          <div className="input-group"><label>Cover Image URL</label><input value={formData.coverImage} onChange={e => setFormData({...formData, coverImage: e.target.value})} placeholder="https://..." /></div>
        </div>
      );
      case 2: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="input-group"><label>Address Line 1 *</label><input required value={formData.addr1} onChange={e => setFormData({...formData, addr1: e.target.value})} /></div>
          <div className="input-group"><label>Address Line 2</label><input value={formData.addr2} onChange={e => setFormData({...formData, addr2: e.target.value})} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group"><label>City *</label><input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} /></div>
            <div className="input-group"><label>State *</label><input required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group"><label>Pincode *</label><input required type="number" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} /></div>
            <div className="input-group"><label>Landmark</label><input value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})} /></div>
          </div>
        </div>
      );
      case 3: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group"><label>Num Buildings</label><input type="number" value={formData.numBuildings} onChange={e => setFormData({...formData, numBuildings: e.target.value})} /></div>
            <div className="input-group"><label>Num Floors</label><input type="number" value={formData.numFloors} onChange={e => setFormData({...formData, numFloors: e.target.value})} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group"><label>Total Rooms *</label><input required type="number" value={formData.totalRooms} onChange={e => setFormData({...formData, totalRooms: e.target.value})} /></div>
            <div className="input-group"><label>Total Beds *</label><input required type="number" value={formData.totalBeds} onChange={e => setFormData({...formData, totalBeds: e.target.value})} /></div>
          </div>
          <div className="input-group"><label>Room Types</label><div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>{['Single', 'Double', 'Triple', 'Dormitory'].map(t => (<button type="button" key={t} onClick={() => setFormData(p => ({...p, roomTypes: p.roomTypes.includes(t) ? p.roomTypes.filter(x => x !== t) : [...p.roomTypes, t]}))} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: formData.roomTypes.includes(t) ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: formData.roomTypes.includes(t) ? 'white' : 'var(--text-secondary)', cursor: 'pointer' }}>{t}</button>))}</div></div>
        </div>
      );
      case 4: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group"><label>Rent per Bed *</label><input required type="number" value={formData.rentBed} onChange={e => setFormData({...formData, rentBed: e.target.value})} /></div>
            <div className="input-group"><label>Rent per Room</label><input type="number" value={formData.rentRoom} onChange={e => setFormData({...formData, rentRoom: e.target.value})} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group"><label>Security Deposit *</label><input required type="number" value={formData.deposit} onChange={e => setFormData({...formData, deposit: e.target.value})} /></div>
            <div className="input-group"><label>Maintenance Charges</label><input type="number" value={formData.maintenance} onChange={e => setFormData({...formData, maintenance: e.target.value})} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group"><label>Electricity</label><select value={formData.electricity} onChange={e => setFormData({...formData, electricity: e.target.value})}><option>Included</option><option>Meter-based</option></select></div>
            <div className="input-group"><label>Water</label><select value={formData.water} onChange={e => setFormData({...formData, water: e.target.value})}><option>Included</option><option>Extra</option></select></div>
          </div>
        </div>
      );
      case 5: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(99,102,241,0.05)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>Standard configuration for initial setup.</p>
          <div className="input-group"><label>Base Room Number/Name</label><input value={formData.roomBaseName} onChange={e => setFormData({...formData, roomBaseName: e.target.value})} placeholder="e.g. 101" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group"><label>Room Type</label><select value={formData.roomTypeSelect} onChange={e => setFormData({...formData, roomTypeSelect: e.target.value})}><option>Single</option><option>Double</option><option>Triple</option><option>Dormitory</option></select></div>
            <div className="input-group"><label>Beds per Room</label><input type="number" value={formData.bedsPerRoom} onChange={e => setFormData({...formData, bedsPerRoom: e.target.value})} /></div>
          </div>
        </div>
      );
      case 6: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="input-group"><label>Food Available?</label><div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>{['Yes', 'No'].map(v => (<button type="button" key={v} onClick={() => setFormData({...formData, foodAvailable: v})} style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border-color)', background: formData.foodAvailable === v ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: formData.foodAvailable === v ? 'white' : 'var(--text-secondary)', cursor: 'pointer' }}>{v}</button>))}</div></div>
          {formData.foodAvailable === 'Yes' && (
            <><div className="input-group"><label>Meal Plans</label><div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>{['Breakfast', 'Lunch', 'Dinner'].map(m => (<button type="button" key={m} onClick={() => setFormData(p => ({...p, mealPlans: p.mealPlans.includes(m) ? p.mealPlans.filter(x => x !== m) : [...p.mealPlans, m]}))} style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid var(--border-color)', background: formData.mealPlans.includes(m) ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: formData.mealPlans.includes(m) ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>{m}</button>))}</div></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="input-group"><label>Food Type</label><select value={formData.foodType} onChange={e => setFormData({...formData, foodType: e.target.value})}><option>Veg</option><option>Non-Veg</option><option>Both</option></select></div>
              <div className="input-group"><label>Monthly Mess Charges</label><input type="number" value={formData.messCharges} onChange={e => setFormData({...formData, messCharges: e.target.value})} /></div>
            </div></>
          )}
        </div>
      );
      case 7: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '400px', overflowY: 'auto' }}>
          {Object.entries(FEATURE_GROUPS).map(([cat, feats]) => (
            <div key={cat}><h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.6rem' }}>{cat}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>{feats.map(f => (<button type="button" key={f} onClick={() => setFormData(p => ({...p, amenities: p.amenities.includes(f) ? p.amenities.filter(x => x !== f) : [...p.amenities, f]}))} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: formData.amenities.includes(f) ? 'rgba(99,102,241,0.1)' : 'var(--bg-tertiary)', color: formData.amenities.includes(f) ? 'var(--accent-primary)' : 'var(--text-secondary)', borderColor: formData.amenities.includes(f) ? 'var(--accent-primary)' : 'var(--border-color)', cursor: 'pointer', fontSize: '0.8rem' }}>{AMENITY_ICONS[f] || <Star size={14}/>} {f}</button>))}</div>
            </div>
          ))}
        </div>
      );
      case 8: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group"><label>Smoking Policy</label><select value={formData.smokingPolicy} onChange={e => setFormData({...formData, smokingPolicy: e.target.value})}><option>Allowed</option><option>Not Allowed</option></select></div>
            <div className="input-group"><label>Alcohol Policy</label><select value={formData.alcoholPolicy} onChange={e => setFormData({...formData, alcoholPolicy: e.target.value})}><option>Allowed</option><option>Not Allowed</option></select></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group"><label>Pets Allowed?</label><select value={formData.petsAllowed} onChange={e => setFormData({...formData, petsAllowed: e.target.value})}><option>Yes</option><option>No</option></select></div>
            <div className="input-group"><label>Visitor Policy</label><input value={formData.visitorPolicy} onChange={e => setFormData({...formData, visitorPolicy: e.target.value})} placeholder="e.g. Till 8 PM" /></div>
          </div>
        </div>
      );
      case 9: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}><div className="input-group"><label>Staff Name</label><input value={formData.staffName} onChange={e => setFormData({...formData, staffName: e.target.value})} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group"><label>Role</label><select value={formData.staffRole} onChange={e => setFormData({...formData, staffRole: e.target.value})}><option value="">Select...</option><option>Warden</option><option>Cleaner</option><option>Cook</option></select></div>
            <div className="input-group"><label>Contact Number</label><input value={formData.staffContact} onChange={e => setFormData({...formData, staffContact: e.target.value})} /></div>
          </div>
        </div>
      );
      case 10: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="input-group"><label>Owner Name</label><input value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} /></div>
          <div className="input-group"><label>Phone Number *</label><input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div>
          <div className="input-group"><label>Email</label><input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} /></div>
        </div>
      );
      case 11: return (
        <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '16px', fontSize: '0.9rem' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--accent-primary)' }}>Review Summary</h4>
          <p><b>Name:</b> {formData.name}</p>
          <p><b>Gender:</b> {formData.gender}</p>
          <p><b>Location:</b> {formData.city}, {formData.state}</p>
          <p><b>Rent:</b> ₹{formData.rentBed}/bed</p>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ready to finalize? Click 'Finalize & Create' below.</p>
        </div>
      );
      default: return null;
    }
  };

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertCircle size={48} color="var(--accent-error)" style={{ marginBottom: '1.5rem' }} />
          <h2>System Error</h2>
          <p style={{ margin: '1rem 0 2rem' }}>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary" style={{ padding: '0.8rem 2rem' }}>Reload Application</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', padding: '2rem', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '0.2rem' }}>Hostels Overview</h1>
          <p style={{ color: 'var(--text-secondary)', fontWeight: '500', margin: 0 }}>Strategic portfolio performance.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-secondary)' }} />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', width: '220px' }} />
          </div>
          <button onClick={() => setShowDrafts(s => !s)} className="btn-outline" style={{ padding: '0.8rem 1.2rem', position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📂 Saved Hostels
            {(drafts.length + (isAddModalOpen ? 1 : 0)) > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {drafts.length + (isAddModalOpen ? 1 : 0)}
              </span>
            )}
          </button>
          <button onClick={openFreshForm} className="btn-primary" style={{ padding: '0.8rem 1.4rem' }}>
            <Plus size={18} /> Create Hostel
          </button>
          <button onClick={handleLogout} className="btn-outline" style={{ width: '45px', height: '45px' }}><LogOut size={20} /></button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
        {kpis.map((kpi, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="card" style={{ padding: '1rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: '6px', background: `${kpi.color}10`, color: kpi.color }}>{kpi.icon}</div>
              <span style={{ fontWeight: '700', fontSize: '0.8rem' }}>{kpi.label}</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800' }}>{kpi.value || 0}</div>
          </motion.div>
        ))}
      </div>

      {/* SAVED DRAFTS — FULL SCREEN OVERLAY */}
      <AnimatePresence>
        {showDrafts && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDrafts(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(6px)',
                zIndex: 1500
              }}
            />

            {/* Overlay Panel — slides up from bottom, covers full screen */}
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1501,
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-primary)',
                overflow: 'hidden'
              }}
            >
              {/* ── HEADER ── */}
              <div style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--bg-secondary)',
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>📂</div>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Saved Hostel Drafts</h2>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, fontWeight: '600' }}>
                      {drafts.length} draft{drafts.length !== 1 ? 's' : ''} saved — click any card to continue filling details
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDrafts(false)}
                  style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* ── CONTENT ── */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>

                {/* IN-PROGRESS CARD — wizard currently open */}
                {isAddModalOpen && (
                  <div style={{ marginBottom: '2rem' }}>
                    <p style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>Currently Editing</p>
                    <motion.div
                      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(59,130,246,0.2)' }}
                      onClick={() => setShowDrafts(false)}
                      style={{ padding: '1.4rem', borderRadius: '16px', border: '2px solid #3B82F6', background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)', display: 'flex', flexDirection: 'column', gap: '0.8rem', cursor: 'pointer', maxWidth: '480px' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>✍️</div>
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1D4ED8' }}>{formData.name || 'Untitled — Currently Editing'}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>Currently being filled</div>
                          </div>
                        </div>
                        <span style={{ padding: '0.25rem 0.6rem', borderRadius: '20px', background: '#DBEAFE', color: '#1D4ED8', fontSize: '0.65rem', fontWeight: '800' }}>⏳ In Progress</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '600' }}>📍 Step: <b>{STEP_CONFIG[currentStep - 1]?.title}</b></div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '6px', fontWeight: '700' }}>
                          <span>Progress</span><span style={{ color: '#3B82F6' }}>{Math.round((currentStep / 11) * 100)}%</span>
                        </div>
                        <div style={{ height: '7px', background: '#DBEAFE', borderRadius: '100px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.round((currentStep / 11) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #3B82F6, #6366F1)', borderRadius: '100px' }} />
                        </div>
                      </div>
                      <div style={{ padding: '0.65rem', borderRadius: '10px', background: '#3B82F6', color: 'white', fontWeight: '800', fontSize: '0.82rem', textAlign: 'center' }}>
                        → Continue Editing
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* SAVED DRAFTS GRID */}
                <p style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                  {drafts.length > 0 ? 'Saved Drafts' : ''}
                </p>

                {drafts.length === 0 && !isAddModalOpen ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem' }}>
                    <div style={{ fontSize: '4rem', opacity: 0.3 }}>📂</div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-secondary)', margin: 0 }}>No saved drafts yet</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Start creating a hostel and save your progress to resume later.</p>
                    <button onClick={() => { setShowDrafts(false); openFreshForm(); }} style={{ marginTop: '0.5rem', padding: '0.8rem 1.6rem', borderRadius: '12px', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' }}>
                      + Create New Hostel
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {drafts.map(draft => {
                      const progress = Math.round(((draft.lastStep || 1) / 11) * 100);
                      const stepLabel = STEP_CONFIG[(draft.lastStep || 1) - 1]?.title || 'Basic Info';
                      const ago = draft.updatedAt ? (() => { const d = (Date.now() - new Date(draft.updatedAt)) / 60000; return d < 60 ? `${Math.round(d)}m ago` : `${Math.round(d/60)}h ago`; })() : 'Recently';
                      return (
                        <motion.div
                          key={draft._id}
                          whileHover={{ y: -5, boxShadow: '0 20px 48px rgba(99,102,241,0.2)', borderColor: '#6366F1' }}
                          onClick={() => resumeDraft(draft)}
                          style={{
                            padding: '1.5rem',
                            borderRadius: '18px',
                            border: '1.5px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            cursor: 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: 'border-color 0.2s'
                          }}
                        >
                          {/* Progress accent stripe at top */}
                          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, #6366F1 ${progress}%, var(--border-color) ${progress}%)`, borderRadius: '4px 4px 0 0' }} />

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>🏨</div>
                              <div>
                                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>{draft.name || 'Untitled Draft'}</div>
                                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Last saved {ago}</div>
                              </div>
                            </div>
                            <span style={{ padding: '0.3rem 0.7rem', borderRadius: '20px', background: '#FEF3C7', color: '#D97706', fontSize: '0.68rem', fontWeight: '800', textTransform: 'uppercase', flexShrink: 0 }}>Draft</span>
                          </div>

                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ color: 'var(--accent-primary)' }}>📍</span> Paused at: <b style={{ color: 'var(--text-primary)' }}>{stepLabel}</b>
                          </div>

                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px', fontWeight: '700' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>Completion</span>
                              <span style={{ color: 'var(--accent-primary)', fontWeight: '900' }}>{progress}%</span>
                            </div>
                            <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '100px', overflow: 'hidden' }}>
                              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366F1, #3B82F6)', borderRadius: '100px', transition: 'width 0.6s ease' }} />
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.8rem' }}>
                            <div style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #3B82F6)', color: 'white', fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                              ▶ Continue Filling
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteDraft(draft._id); }}
                              style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: '#FEE2E2', color: '#EF4444', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0 }}
                            >
                              🗑
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── FOOTER ── */}
              <div style={{ padding: '1.2rem 2rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Drafts are auto-saved as you fill in the wizard</span>
                <button onClick={() => { setShowDrafts(false); openFreshForm(); }} style={{ padding: '0.7rem 1.4rem', borderRadius: '10px', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={16} /> New Hostel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {['All', 'High', 'Medium', 'Low'].map(f => (
            <button 
              key={f} 
              onClick={() => {
                setOccupancyFilter(f);
              }} 
              style={{ padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '700', border: '1px solid var(--border-color)', background: occupancyFilter === f ? 'var(--accent-primary)' : 'var(--bg-secondary)', color: occupancyFilter === f ? 'white' : 'var(--text-secondary)', cursor: 'pointer', transition: '0.2s' }}
            >
              {f}
            </button>
          ))}
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginLeft: '0.5rem' }}>
            Showing {processedBuildings.length} Properties
          </span>
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '0.5rem 1rem', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontWeight: '600' }}>
          <option value="name">Sort by Name</option><option value="revenue">Revenue</option><option value="occupancy">Occupancy</option>
        </select>
      </div>

      <div 
        className="hostel-scroll-container" 
        style={{ 
          height: 'calc(100vh - 360px)', 
          overflowY: 'auto', 
          padding: '1.5rem', 
          margin: '0 -1.5rem', 
          borderRadius: '20px',
          background: 'rgba(0,0,0,0.01)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Building size={20} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Verified Hostel Properties</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', paddingBottom: '6rem' }}>
          {loading ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}><div className="loader"></div></div>
          ) : processedBuildings.length > 0 ? (
            processedBuildings.map((b) => (
              <BuildingCard key={b.id} building={b} onNavigate={() => navigate(`/owner/building/${b.id}/dashboard`)} />
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}><h3>No Property Records Found</h3></div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: '#F8FAFC', zIndex: 2000, display: 'flex', flexDirection: 'column' }}
          >
            {/* TOP BAR */}
            <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.1rem' }}>🏨</div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>Register New Hostel</h2>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Complete all steps to publish your listing</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                {draftMsg && (
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: draftMsg.includes('✅') ? '#059669' : draftMsg.includes('🔄') ? '#3B82F6' : '#EF4444', background: draftMsg.includes('✅') ? '#DCFCE7' : draftMsg.includes('🔄') ? '#EFF6FF' : '#FEE2E2', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>{draftMsg}</span>
                )}
                <button
                  type="button"
                  onClick={() => saveDraftToBackend(formData, currentStep, activeDraftId)}
                  style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  💾 Save Draft
                </button>
                <button onClick={() => setIsAddModalOpen(false)} style={{ background: '#F1F5F9', border: 'none', color: '#64748B', cursor: 'pointer', padding: '0.6rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0.8rem 2rem', flexShrink: 0, overflowX: 'auto' }}>
              <div style={{ display: 'flex', gap: 0, minWidth: 'max-content' }}>
                {STEP_CONFIG.map((s, i) => {
                  const done = currentStep > s.step;
                  const active = currentStep === s.step;
                  return (
                    <div key={s.step} style={{ display: 'flex', alignItems: 'center' }}>
                      <div onClick={() => done && setCurrentStep(s.step)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: done ? 'pointer' : 'default', background: active ? '#EFF6FF' : 'transparent' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: done ? '#10B981' : active ? '#3B82F6' : '#E2E8F0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '900', flexShrink: 0 }}>
                          {done ? '✓' : s.step}
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: active ? '800' : '600', color: active ? '#1D4ED8' : done ? '#059669' : '#94A3B8', whiteSpace: 'nowrap' }}>{s.title}</span>
                      </div>
                      {i < STEP_CONFIG.length - 1 && <div style={{ width: '20px', height: '2px', background: done ? '#10B981' : '#E2E8F0', flexShrink: 0 }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CONTENT AREA */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: '700px' }}>
                <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
                  {activeDraftId && (
                    <div style={{ marginBottom: '1rem', padding: '0.7rem 1rem', background: '#EFF6FF', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#1D4ED8', borderLeft: '3px solid #3B82F6' }}>
                      📝 Editing saved draft &mdash; changes auto-saved
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>{STEP_CONFIG[currentStep - 1]?.icon}</span>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>{STEP_CONFIG[currentStep - 1]?.title}</h3>
                  </div>
                  <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0 }}>{STEP_CONFIG[currentStep - 1]?.desc}</p>
                </div>

                <form onSubmit={handleCreateHostel} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {renderStep()}
                  {/* FOOTER BUTTONS */}
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
                    {currentStep > 1 && (
                      <button type="button" onClick={() => setCurrentStep(s => s - 1)} style={{ width: '80px', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#475569', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronLeft size={18}/>
                      </button>
                    )}
                    <button type="button" onClick={() => saveDraftToBackend(formData, currentStep, activeDraftId)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#3B82F6', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <FileText size={16}/> Save Draft
                    </button>
                    <button disabled={isSubmitting} type="submit" style={{ flex: 2, padding: '1rem', borderRadius: '12px', border: 'none', background: currentStep === 11 ? '#10B981' : '#3B82F6', color: 'white', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                      {isSubmitting ? 'Processing...' : currentStep === 11 ? '🚀 Finalize & Publish' : 'Continue'} <ChevronRight size={18}/>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hostel-scroll-container::-webkit-scrollbar { width: 8px; }
        .hostel-scroll-container::-webkit-scrollbar-track { background: transparent; }
        .hostel-scroll-container::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; border: 2px solid var(--bg-primary); }
        .hostel-scroll-container::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
        .input-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .input-group label { font-size: 0.8rem; font-weight: 800; color: var(--text-secondary); }
        .input-group input, .input-group select, .input-group textarea { padding: 0.8rem 1rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-tertiary); color: var(--text-primary); font-size: 0.9rem; }
        .btn-primary { background: var(--accent-primary); color: white; border: none; border-radius: 10px; font-weight: 800; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .btn-outline { background: var(--bg-secondary); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }
        .loader { width: 30px; height: 30px; border: 3px solid var(--bg-tertiary); border-bottom-color: var(--accent-primary); border-radius: 50%; animation: rotation 1s linear infinite; margin: auto; }
        @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const BuildingCard = ({ building, onNavigate }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const images = useMemo(() => [
    building.images?.[0] || 'https://images.unsplash.com/photo-1555854817-5b2260d19dca?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800'
  ], [building.images]);

  useEffect(() => {
    const timer = setInterval(() => {
      setImgIdx(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="card" 
      style={{ 
        padding: 0, 
        overflow: 'hidden', 
        borderTop: `4px solid ${building.occupancyRate >= 80 ? '#10B981' : building.occupancyRate >= 50 ? '#F59E0B' : '#EF4444'}`, 
        position: 'relative',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        cursor: 'pointer'
      }}
      onClick={onNavigate}
    >
      <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={imgIdx}
            initial={{ opacity: 0.8, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{ height: '100%', width: '100%', backgroundImage: `url("${images[imgIdx]}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} 
          />
        </AnimatePresence>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8))' }} />
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 5 }}>
          {building.popularityLabel && (
            <div style={{ padding: '0.4rem 0.8rem', borderRadius: '100px', background: 'var(--accent-primary)', color: 'white', fontSize: '0.65rem', fontWeight: '900', boxShadow: '0 4px 12px rgba(99,102,241,0.5)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              {building.popularityLabel}
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.4rem', flexDirection: 'column', alignItems: 'flex-end', zIndex: 5 }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <div style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', color: 'white', fontSize: '0.7rem', fontWeight: '800', border: '1px solid rgba(255,255,255,0.3)' }}>{building.occupancyRate}%</div>
            <div style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: building.status === 'Active' ? '#10B981' : '#F59E0B', color: 'white', fontSize: '0.7rem', fontWeight: '800', border: '1px solid rgba(255,255,255,0.1)' }}>{building.status}</div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', right: '1rem', zIndex: 5 }}>
           <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)', margin: 0 }}>{building.name}</h3>
        </div>
      </div>
      <div style={{ padding: '1.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}><MapPin size={14} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> {building.address || 'Address not set'}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#FEF3C7', color: '#D97706', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '800' }}>
            <Star size={14} fill="#D97706" /> {building.rating}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.2rem' }}>
          <div style={{ padding: '0.7rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '800', margin: '0 0 0.2rem 0' }}>REVENUE</p>
            <p style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--accent-success)', margin: 0 }}>₹{(building.monthlyRevenue / 1000).toFixed(0)}k</p>
          </div>
          <div style={{ padding: '0.7rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '800', margin: '0 0 0.2rem 0' }}>TENANTS</p>
            <p style={{ fontSize: '1.1rem', fontWeight: '900', margin: 0 }}>{building.occupiedBeds}</p>
          </div>
        </div>
        
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {(building.features || []).slice(0, 3).map((feat, fidx) => (
              <div 
                key={fidx} 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.3rem', 
                  padding: '0.3rem 0.6rem', borderRadius: '8px', 
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-primary)'
                }}
              >
                {AMENITY_ICONS[feat] || <Star size={10} />} {feat}
              </div>
            ))}
            {building.features && building.features.length > 3 && (
              <div style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', fontWeight: '800', color: 'var(--accent-primary)', alignSelf: 'center' }}>
                +{building.features.length - 3} more
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.8rem' }}>
          <button 
            className="btn btn-primary" 
            style={{ flex: 2, padding: '0.6rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800' }}
            onClick={(e) => { e.stopPropagation(); navigate(`/owner/building/${building.id}/dashboard`); }}
          >
            Go to Dashboard
          </button>
          <button 
            className="btn" 
            style={{ padding: '0.6rem 0.9rem', borderRadius: '12px', background: '#FEE2E2', border: '1px solid #FECACA', color: '#EF4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '800' }}
            onClick={(e) => { e.stopPropagation(); setShowDeleteModal(true); }}
            title="Delete Property"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>

    {/* Delete Confirmation Modal — rendered via Portal to escape card's stacking context */}
    {showDeleteModal && createPortal(
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem'
        }}
      >
        {/* Blurred Backdrop */}
        <div
          onClick={() => setShowDeleteModal(false)}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        />

        {/* Modal Card */}
        <div style={{
          position: 'relative', zIndex: 1,
          background: 'var(--bg-primary, #ffffff)',
          borderRadius: '24px',
          padding: 'clamp(1.5rem, 5vw, 2.5rem)',
          width: '100%', maxWidth: '440px',
          border: '1px solid rgba(239,68,68,0.2)',
          boxShadow: '0 32px 64px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'
        }}>

          {/* Red icon circle */}
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #FEE2E2, #FECACA)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 20px rgba(239,68,68,0.25)' }}>
            <Trash2 size={30} color="#EF4444" />
          </div>

          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: '900', margin: '0 0 0.4rem', color: 'var(--text-primary, #111)' }}>
            Delete Property?
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary, #555)', fontSize: '0.9rem', margin: '0 0 1rem' }}>
            You are about to permanently delete
          </p>

          {/* Building name badge */}
          <p style={{ textAlign: 'center', fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary, #111)', margin: '0 0 1.2rem', background: 'var(--bg-tertiary, #f5f5f5)', padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color, #e5e7eb)' }}>
            🏢 {building.name}
          </p>

          {/* Warning */}
          <p style={{ textAlign: 'center', color: '#DC2626', fontSize: '0.8rem', fontWeight: '700', margin: '0 0 2rem', padding: '0.75rem 1rem', background: '#FFF1F2', borderRadius: '10px', border: '1px solid #FECACA', lineHeight: 1.6 }}>
            ⚠️ This action is <strong>irreversible</strong>. All associated rooms, beds, and tenant records will be permanently removed.
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowDeleteModal(false)}
              style={{ flex: 1, minWidth: '120px', padding: '0.9rem', borderRadius: '12px', background: 'var(--bg-tertiary, #f5f5f5)', border: '1px solid var(--border-color, #e5e7eb)', color: 'var(--text-primary, #111)', fontWeight: '800', cursor: 'pointer', fontSize: '0.95rem', transition: 'all 0.2s' }}
            >
              Cancel
            </button>
            <button
              disabled={isDeleting}
              onClick={async () => {
                setIsDeleting(true);
                try {
                  await api.deleteBuilding(building.id);
                  setShowDeleteModal(false);
                  window.location.reload();
                } catch (err) {
                  console.error('Delete failed:', err);
                  alert('Failed to delete property. Please try again.');
                  setIsDeleting(false);
                }
              }}
              style={{ flex: 1, minWidth: '120px', padding: '0.9rem', borderRadius: '12px', background: isDeleting ? '#FCA5A5' : 'linear-gradient(135deg, #EF4444, #DC2626)', border: 'none', color: 'white', fontWeight: '900', cursor: isDeleting ? 'not-allowed' : 'pointer', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: isDeleting ? 'none' : '0 4px 14px rgba(239,68,68,0.4)', transition: 'all 0.2s' }}
            >
              {isDeleting ? 'Deleting...' : <><Trash2 size={16} /> Delete Forever</>}
            </button>
          </div>
        </div>
      </div>,
      document.body
    )}
    </>
  );
};

export default Portfolio;
