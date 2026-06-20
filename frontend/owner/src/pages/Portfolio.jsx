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
  Heart, Home, ArrowLeft, Settings, Trash2, ChevronUp
} from 'lucide-react';
import ImageModal from '../components/ImageModal';
import BuildingCard from '../components/BuildingCard';
import { api } from '../api';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';
import { clearAllCache } from '../cache';

// --- CONSTANTS MOVED OUTSIDE FOR STABILITY ---
const FEATURE_GROUPS = {
  'Security & Safety': ['Security', 'CCTV', 'Medical Support', 'Fire Safety', 'Emergency Exit'],
  'Essential Utilities': ['Power Backup', 'Laundry', 'Housekeeping', 'Lift', 'WiFi', 'Laundry Room'],
  'Food & Dining': ['Mess', 'Dining Hall', 'Common Kitchen'],
  'Additional Amenities': ['Gym', 'Parking', 'Library', 'Study Hall']
};

const AMENITY_ICONS = {
  'Security': <ShieldCheck size={14} />, 'CCTV': <Shield size={14} />, 'Medical Support': <Heart size={14} />,
  'Power Backup': <Zap size={14} />, 'Laundry': <Shirt size={14} />, 'Housekeeping': <ClipboardList size={14} />,
  'Gym': <Dumbbell size={14} />, 'Parking': <Car size={14} />, 'Library': <BookOpen size={14} />,
  'Mess': <Utensils size={14} />
};

const AVAILABLE_FILTER_FEATURES = [
  'Security', 'CCTV', 'Parking', 'Power Backup', 'Mess', 'Gym', 'Library', 'Laundry', 'Housekeeping', 'Medical Support'
];

const TOTAL_STEPS = 6;
const STEP_CONFIG = [
  { step: 1, title: 'Basic Info', icon: <Building size={24}/>, desc: 'Name, description, media' },
  { step: 2, title: 'Location', icon: <MapPin size={24}/>, desc: '' },
  { step: 3, title: 'Amenities', icon: <Star size={24}/>, desc: 'Facilities & features' },
  { step: 4, title: 'Financials', icon: <DollarSign size={24}/>, desc: 'Pricing & deposits' },
  { step: 5, title: 'Owner Details', icon: <UserCheck size={24}/>, desc: 'Contact information' },
  { step: 6, title: 'Review', icon: <CheckCircle size={24}/>, desc: 'Final summary' },
];

const INITIAL_FORM_STATE = {
  name: '', shortDesc: '',
  addr1: '', addr2: '', city: '', locality: '', state: '', pincode: '', landmark: '',
  ownerName: '', phone: '', email: '',
  coverImage: null, gallery: [], documents: [],
  amenities: [],
  genderType: 'Mixed', wardenName: '',
  rentSingle: 0, rentDouble: 0, rentTriple: 0, rent4Sharing: 0, rent5Sharing: 0, rent6Sharing: 0, securityDeposit: 0,
  stayQuality: '', buildingAge: ''
};

const Portfolio = () => {
  const [data, setData] = useState({
    buildings: [], floors: [], rooms: [], beds: [], tenants: [], complaints: []
  });
  const [hostelStatsMap, setHostelStatsMap] = useState({});
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
  const [itemToDelete, setItemToDelete] = useState(null); // { id, name, type: 'draft' | 'property' }
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, image: '' });

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
      const response = await api.getPortfolio();
      const portfolioData = response?.success ? (response.data || []) : [];
      setData({
        buildings: portfolioData.filter(bld => bld.showInPortfolio !== false && String(bld.showInPortfolio) !== 'false' && bld.status !== 'Draft'),
        floors: [],
        rooms: [],
        beds: [],
        tenants: [],
        complaints: [],
        staff: []
      });
    } catch (err) {
      console.error("Data fetch error", err);
      setError("Failed to load property data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load drafts from backend buildings with status: 'Draft'
  const loadDrafts = useCallback(async () => {
    try {
      const draftBuildings = await api.getDraftBuildings({ lightweight: true });
      setDrafts((draftBuildings || []).map(b => ({ ...b, id: b._id || b.id })));
    } catch (err) { console.error('Draft load error', err); }
  }, []);

  useEffect(() => { loadDrafts(); }, [loadDrafts]);

  useEffect(() => {
    fetchData();

    // Real-time synchronization for owner dashboard
    connectSocket(); // Joins 'owners' room by default in connectSocket

    const refreshAll = async (payload) => {
      try {
        if (payload && payload.buildingId) {
          // Ensure server has recalculated hostel bed stats before we refetch
          await api.syncHostelBeds(payload.buildingId).catch(() => null);
        }
      } catch (e) {
        console.warn('syncHostelBeds failed in refreshAll', e);
      }
      console.log('🔄 Dashboard refreshing due to real-time event');
      clearAllCache(); // Clear HH cache to ensure fresh data
      fetchData();
      loadDrafts();
    };

    socket.on('tenantAdded', refreshAll);
    socket.on('complaintCreated', refreshAll);
    socket.on('hostelUpdated', refreshAll);
    socket.on('dashboardStatsUpdated', refreshAll);

    return () => {
      socket.off('tenantAdded', refreshAll);
      socket.off('complaintCreated', refreshAll);
      socket.off('hostelUpdated', refreshAll);
      socket.off('dashboardStatsUpdated', refreshAll);
      // We don't disconnectSocket here as owner might navigate between pages
    };
  }, [fetchData, loadDrafts]);

  // Auto-save draft when form data or step changes (debounced)
  useEffect(() => {
    if (!isAddModalOpen) return;
    // Only trigger if user has typed something meaningful
    const hasData = formData.name || formData.addr1 || formData.city || formData.genderType || formData.rentSingle || formData.rentDouble || formData.rentTriple;
    if (!hasData) return;
    const t = setTimeout(() => {
      saveDraftToBackend(formData, currentStep, activeDraftId);
    }, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, formData, isAddModalOpen, activeDraftId]);

  const saveDraftToBackend = useCallback(async (data, step, draftId = null) => {
    const payload = {
      name: data.name || 'Untitled Draft',
      address: data.address || 'Draft',
      locationCity: data.locationCity || 'Bengaluru',
      locality: data.locality || '',
      genderType: data.genderType || '',
      stayQuality: data.stayQuality || '',
      buildingAge: data.buildingAge || 0,
      wardenNumber: data.wardenNumber || '',
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

  const resumeDraft = async (draft) => {
    try {
      const fullDraft = await api.getBuildingById(draft._id || draft.id);
      let dataToSet;
      
      if (fullDraft.draftData && Object.keys(fullDraft.draftData).length > 0) {
        dataToSet = fullDraft.draftData;
      } else {
        // Attempt to extract the original shortDesc from the extended markdown description
        let extractedDesc = fullDraft.description || '';
        if (extractedDesc.includes('---\n')) {
          extractedDesc = extractedDesc.split('---\n')[1];
        } else if (extractedDesc.includes('---')) {
          extractedDesc = extractedDesc.split('---')[1];
        }

        dataToSet = {
          name: fullDraft.name || '',
          shortDesc: extractedDesc.trim(),
          address: fullDraft.address || '',
          locationCity: fullDraft.locationCity || '',
          locality: fullDraft.locality || '',
          amenities: fullDraft.amenities || [],
          genderType: fullDraft.genderType || 'Mixed',
          stayQuality: fullDraft.stayQuality || '',
          buildingAge: fullDraft.buildingAge || 0,
          wardenName: fullDraft.warden || '',
          wardenNumber: fullDraft.wardenNumber || '',
          rentSingle: fullDraft.rentSingle || '',
          rentDouble: fullDraft.rentDouble || '',
          rentTriple: fullDraft.rentTriple || '',
          rent4Sharing: fullDraft.rent4Sharing || '',
          rent5Sharing: fullDraft.rent5Sharing || '',
          rent6Sharing: fullDraft.rent6Sharing || '',
          securityDeposit: fullDraft.securityDeposit || '',
          coverImage: fullDraft.images?.[0] || null,
          gallery: fullDraft.images || [],
          ownerName: fullDraft.policies?.ownerName || fullDraft.owner?.name || '', 
          phone: fullDraft.policies?.phone || fullDraft.owner?.phone || '', 
          email: fullDraft.policies?.email || fullDraft.owner?.email || '',
        };
      }

      setFormData({ ...INITIAL_FORM_STATE, ...dataToSet });
      setCurrentStep(fullDraft.status === 'Draft' ? (fullDraft.lastStep || 1) : 1);
      setActiveDraftId(fullDraft._id || fullDraft.id);
      setDraftMsg('🔄 Opening editor...');
      setShowDrafts(false);
      setIsAddModalOpen(true);
      setTimeout(() => setDraftMsg(''), 2500);
    } catch (err) {
      console.error('Failed to resume draft:', err);
    }
  };

  const deleteDraft = async (id) => {
    setIsDeletingItem(true);
    try {
      await api.deleteBuilding(id);
      loadDrafts();
      if (activeDraftId === id) {
        setActiveDraftId(null);
        setIsAddModalOpen(false);
      }
      setItemToDelete(null);
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeletingItem(false);
    }
  };

  const handleCreateHostel = async (e) => {
    e.preventDefault();
    if (currentStep < TOTAL_STEPS) {
      // Auto-save as draft when advancing steps
      saveDraftToBackend(formData, currentStep + 1, activeDraftId);
      setCurrentStep(s => s + 1);
      return;
    }

    setIsSubmitting(true);
    try {
      const extendedDesc = `# Property Overview\n**Type:** ${formData.propertyType || formData.genderType} | **Gender:** ${formData.genderType}\n# Contact: ${formData.ownerName} (${formData.phone})\n---\n${formData.longDesc || formData.shortDesc || ''}`;

      const payload = {
        name: formData.name || 'New Hostel',
        address: formData.address || '',
        locationCity: formData.locationCity || 'Bengaluru',
        locality: formData.locality || '',
        description: extendedDesc,
        stayQuality: formData.stayQuality || '',
        buildingAge: formData.buildingAge || 0,
        genderType: formData.genderType || '',
        amenities: formData.amenities || [],

        warden: formData.wardenName,
        wardenNumber: formData.wardenNumber,
        rentSingle: formData.rentSingle,
        rentDouble: formData.rentDouble,
        rentTriple: formData.rentTriple,
        rent4Sharing: formData.rent4Sharing,
        rent5Sharing: formData.rent5Sharing,
        rent6Sharing: formData.rent6Sharing,
        securityDeposit: formData.securityDeposit,

        // Property Facilities (Strict 1:1)
        security: formData.amenities?.includes('Security') || false,
        cctv: formData.amenities?.includes('CCTV') || false,
        parking: formData.amenities?.includes('Parking') || false,
        powerBackup: formData.amenities?.includes('Power Backup') || false,
        mess: formData.amenities?.includes('Mess') || false,
        gym: formData.amenities?.includes('Gym') || false,
        library: formData.amenities?.includes('Library') || false,
        laundry: formData.amenities?.includes('Laundry') || false,
        housekeeping: formData.amenities?.includes('Housekeeping') || false,
        medicalSupport: formData.amenities?.includes('Medical Support') || false,
        images: formData.gallery?.length > 0 ? formData.gallery : (formData.coverImage ? [formData.coverImage] : []),

        category: formData.propertyType === 'Co-living' ? 'Luxury' : (formData.propertyType === 'PG' ? 'Student' : 'Professional'),
        rating: 4.5,
        popularityLabel: 'New Property',
        status: 'Pending Approval',
        policies: {
          smoking: formData.smokingPolicy || 'Not Allowed',
          alcohol: formData.alcoholPolicy || 'Not Allowed',
          pets: formData.petsAllowed || 'No',
          visitors: formData.visitorPolicy || 'Till 8 PM'
        }
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
      // Removed alert
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResubmit = async (buildingId) => {
    try {
      setLoading(true);
      await api.updateBuilding(buildingId, { status: 'Pending Approval' });
      clearAllCache();
      await fetchData();
      loadDrafts();
    } catch (err) {
      console.error('Failed to resubmit property:', err);
    } finally {
      setLoading(false);
    }
  };

  const buildingStats = useMemo(() => {
    if (!data?.buildings || !Array.isArray(data.buildings)) return [];

    return data.buildings.map(b => {
      try {
        const bId = b?._id || b?.id;
        const totalRooms = b.totalRooms || 0;
        const totalBeds = b.totalBeds || 0;
        const occupiedBeds = b.occupiedBeds || 0;
        const vacantBeds = b.vacantBeds || 0;
        const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

        const monthlyRevenue = occupiedBeds * 8500;
        const pendingDues = Math.round(monthlyRevenue * 0.12);

        let amenities = Array.isArray(b?.amenities) ? [...b.amenities] : [];
        if (amenities.length === 0) amenities = ['WiFi', 'CCTV', 'Power Backup'];

        const status = b.buildingStatus || b.status || 'Active';
        const rating = b.rating || "4.5";
        const popularityLabel = b.popularityLabel || null;

        return {
          ...b,
          id: bId,
          name: b.buildingName || b.name || 'Unnamed Property',
          totalRooms,
          totalBeds,
          occupiedBeds,
          vacantBeds,
          totalFloors: b.totalFloors || 0,
          occupancyRate,
          monthlyRevenue,
          pendingDues,
          complaintsCount: 0,
          status,
          rating,
          popularityLabel,
          features: amenities
        };
      } catch (_err) {
        return { id: `err-${Date.now()}`, name: 'Error Loading', occupancyRate: 0, features: [], status: 'Error' };
      }
    });
  }, [data.buildings]);

  const globalStats = useMemo(() => {
    if (!buildingStats || buildingStats.length === 0) {
      return { totalBuildings: 0, totalFloors: 0, totalRooms: 0, totalBeds: 0, occupiedBeds: 0, vacantBeds: 0 };
    }
    try {
      const totalBuildings = buildingStats.length;
      const totalFloors = buildingStats.reduce((acc, b) => acc + (b.totalFloors || 0), 0);
      const totalRooms = buildingStats.reduce((acc, b) => acc + (b.totalRooms || 0), 0);
      const totalBeds = buildingStats.reduce((acc, b) => acc + (b.totalBeds || 0), 0);
      const occupiedBeds = buildingStats.reduce((acc, b) => acc + (b.occupiedBeds || 0), 0);
      const vacantBeds = buildingStats.reduce((acc, b) => acc + (b.vacantBeds || 0), 0);
      return {
        totalBuildings,
        totalFloors,
        totalRooms,
        totalBeds,
        occupiedBeds,
        vacantBeds
      };
    } catch (_err) {
      return { totalBuildings: 0, totalFloors: 0, totalRooms: 0, totalBeds: 0, occupiedBeds: 0, vacantBeds: 0 };
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
    { label: 'Total Buildings', value: globalStats.totalBuildings, icon: <Building2 size={16} />, color: 'var(--accent-primary)' },
    { label: 'Total Floors', value: globalStats.totalFloors, icon: <Building size={16} />, color: '#6366F1' },
    { label: 'Total Rooms', value: globalStats.totalRooms, icon: <Home size={16} />, color: '#8B5CF6' },
    { label: 'Total Beds', value: globalStats.totalBeds, icon: <BedDouble size={16} />, color: '#EC4899' },
    { label: 'Occupied Beds', value: globalStats.occupiedBeds, icon: <UsersRound size={16} />, color: '#10B981' },
    { label: 'Vacant Beds', value: globalStats.vacantBeds, icon: <Activity size={16} />, color: '#3B82F6' }
  ];


  const renderStep = () => {
    const baseServerUrl = (import.meta.env.VITE_API_URL || 'https://livora-hostel-hub-1.onrender.com/api').replace('/api', '');
    switch (currentStep) {
      case 1: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group">
            <label>Hostel Name *</label>
            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Royal Residency" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Building Type *</label>
              <select required value={formData.genderType || ''} onChange={e => setFormData({ ...formData, genderType: e.target.value })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                <option value="">Select...</option>
                <option value="Mixed">Co-Living</option>
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
              </select>
            </div>
            <div className="input-group">
              <label>Stay Quality *</label>
              <select required value={formData.stayQuality || ''} onChange={e => setFormData({ ...formData, stayQuality: e.target.value })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E2E8F0' }}>
                <option value="">Select...</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div className="input-group">
              <label>Building Age (Years) *</label>
              <input type="number" required value={formData.buildingAge || ''} onChange={e => setFormData({ ...formData, buildingAge: parseInt(e.target.value) || 0 })} placeholder="e.g. 5" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Warden Name</label>
              <input value={formData.wardenName || ''} onChange={e => setFormData({ ...formData, wardenName: e.target.value })} placeholder="John Doe" />
            </div>
            <div className="input-group">
              <label>Warden Number</label>
              <input value={formData.wardenNumber || ''} onChange={e => setFormData({ ...formData, wardenNumber: e.target.value })} placeholder="+91 XXXXX XXXXX" />
            </div>
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea rows={3} value={formData.shortDesc} onChange={e => setFormData({ ...formData, shortDesc: e.target.value })} placeholder="Provide a premium summary of your property..." />
          </div>
          <div className="input-group">
            <label>Building Photos (Select up to 10)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={async (e) => {
                if (!e.target.files.length) return;
                let bId = activeDraftId;
                if (!bId && formData.name) { bId = await saveDraftToBackend(formData, currentStep); }
                const files = Array.from(e.target.files);
                const fd = new FormData();
                if (bId) fd.append('buildingId', bId);
                files.forEach(f => fd.append('photos', f));
                try {
                  setDraftMsg('⏳ Uploading photos...');
                  const res = await api.uploadPhotos(fd);
                  const newImages = res.photoUrls || [];
                  setFormData(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...newImages], coverImage: prev.coverImage || newImages[0] || '' }));
                  setDraftMsg('✅ Photos uploaded successfully!');
                  setTimeout(() => setDraftMsg(''), 2500);
                } catch (err) {
                  console.error('Upload failed', err);
                  setDraftMsg('⚠️ Photo upload failed');
                  setTimeout(() => setDraftMsg(''), 2500);
                }
              }}
            />
            {formData.gallery && formData.gallery.length > 0 ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {formData.gallery.map((img, i) => {
                  const fullUrl = (img.startsWith('data:') || img.startsWith('http')) ? img : `${baseServerUrl}${img}`;
                  return (
                    <div key={i} style={{ position: 'relative', width: '60px', height: '60px' }}>
                      <img src={fullUrl} alt={`Upload ${i}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: formData.coverImage === img ? '2px solid var(--accent-primary)' : '1px solid #e2e8f0', cursor: 'zoom-in' }}
                        onClick={() => setModalInfo({ isOpen: true, image: fullUrl })}
                        onDoubleClick={() => setFormData({ ...formData, coverImage: img })}
                        title="Click to preview, double-click to set as cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newGallery = formData.gallery.filter((_, idx) => idx !== i);
                          setFormData(prev => ({
                            ...prev,
                            gallery: newGallery,
                            coverImage: prev.coverImage === img ? (newGallery[0] || null) : prev.coverImage
                          }));
                        }}
                        style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: '#FFF', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', padding: 0 }}
                        title="Remove Image"
                      >
                        <X size={12} strokeWidth={3} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : formData.coverImage && (
              <div style={{ position: 'relative', width: '60px', height: '60px', marginTop: '0.5rem' }}>
                <img src={(formData.coverImage.startsWith('http') || formData.coverImage.startsWith('data:')) ? formData.coverImage : `${baseServerUrl}${formData.coverImage}`}
                  alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', cursor: 'zoom-in' }}
                  onClick={() => setModalInfo({ isOpen: true, image: (formData.coverImage.startsWith('http') || formData.coverImage.startsWith('data:')) ? formData.coverImage : `${baseServerUrl}${formData.coverImage}` })}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData(prev => ({ ...prev, coverImage: null, gallery: [] }));
                  }}
                  style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#EF4444', color: '#FFF', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', padding: 0 }}
                  title="Remove Image"
                >
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            )}
            <small style={{ color: '#64748B', fontSize: '0.75rem', marginTop: '0.25rem' }}>Click an image to preview. Double-click to set as cover.</small>
          </div>
          <div className="input-group">
            <label>Property Documents (PDFs, Docs)</label>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={async (e) => {
                if (!e.target.files.length) return;
                const files = Array.from(e.target.files);
                const mockDocs = files.map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
                setFormData(prev => ({ ...prev, documents: [...(prev.documents || []), ...mockDocs] }));
              }}
            />
            {formData.documents && formData.documents.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {formData.documents.map((doc, i) => (
                  <div key={i} style={{ padding: '0.5rem', background: '#F1F5F9', borderRadius: '8px', fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                    <FileText size={14} style={{ marginRight: '6px' }} /> {doc.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
      case 2: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group">
              <label>Location (City) *</label>
              <input required value={formData.locationCity || ''} onChange={e => setFormData({ ...formData, locationCity: e.target.value })} placeholder="e.g. Hyderabad" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
            </div>
            <div className="input-group">
              <label>Locality *</label>
              <input required value={formData.locality || ''} onChange={e => setFormData({ ...formData, locality: e.target.value })} placeholder="e.g. Hitech City" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
            </div>
          </div>
          <div className="input-group">
            <label>Full Detailed Address *</label>
            <textarea rows={4} required value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Building Name, Street, Area, Landmark, Locality, City, State, Pincode" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E2E8F0', background: 'var(--bg-card)', color: 'var(--text-primary)' }} />
          </div>
        </div>
      );
      case 3: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {Object.entries(FEATURE_GROUPS).map(([cat, feats]) => (
            <div key={cat}>
              <h4 style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '900', marginBottom: '0.8rem', letterSpacing: '0.02em' }}>{cat}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {feats.map(f => (
                  <button type="button" key={f}
                    onClick={() => setFormData(p => ({ ...p, amenities: p.amenities.includes(f) ? p.amenities.filter(x => x !== f) : [...p.amenities, f] }))}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 1rem', borderRadius: '12px', border: '1.5px solid', borderColor: formData.amenities.includes(f) ? 'var(--accent-primary)' : '#F1F5F9', background: formData.amenities.includes(f) ? 'rgba(79, 70, 229, 0.08)' : '#F8FAFC', color: formData.amenities.includes(f) ? 'var(--accent-primary)' : '#475569', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s', boxShadow: formData.amenities.includes(f) ? '0 2px 8px rgba(79,70,229,0.15)' : 'none' }}>
                    <span style={{ opacity: formData.amenities.includes(f) ? 1 : 0.6 }}>{AMENITY_ICONS[f] || <Star size={14} />}</span>
                    {f}
                    {formData.amenities.includes(f) && <CheckCircle size={13} style={{ marginLeft: 'auto' }} />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
      case 4: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Sharing Prices (Per Bed Rent / Month)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group"><label>1 Sharing (₹)</label><input type="number" placeholder="₹" value={formData.rentSingle ?? ''} onChange={e => setFormData({ ...formData, rentSingle: e.target.value === '' ? '' : parseInt(e.target.value) })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E2E8F0' }} /></div>
            <div className="input-group"><label>2 Sharing (₹)</label><input type="number" placeholder="₹" value={formData.rentDouble ?? ''} onChange={e => setFormData({ ...formData, rentDouble: e.target.value === '' ? '' : parseInt(e.target.value) })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E2E8F0' }} /></div>
            <div className="input-group"><label>3 Sharing (₹)</label><input type="number" placeholder="₹" value={formData.rentTriple ?? ''} onChange={e => setFormData({ ...formData, rentTriple: e.target.value === '' ? '' : parseInt(e.target.value) })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E2E8F0' }} /></div>
            <div className="input-group"><label>4 Sharing (₹)</label><input type="number" placeholder="₹" value={formData.rent4Sharing ?? ''} onChange={e => setFormData({ ...formData, rent4Sharing: e.target.value === '' ? '' : parseInt(e.target.value) })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E2E8F0' }} /></div>
            <div className="input-group"><label>5 Sharing (₹)</label><input type="number" placeholder="₹" value={formData.rent5Sharing ?? ''} onChange={e => setFormData({ ...formData, rent5Sharing: e.target.value === '' ? '' : parseInt(e.target.value) })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E2E8F0' }} /></div>
            <div className="input-group"><label>6+ Sharing (₹)</label><input type="number" placeholder="₹" value={formData.rent6Sharing ?? ''} onChange={e => setFormData({ ...formData, rent6Sharing: e.target.value === '' ? '' : parseInt(e.target.value) })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E2E8F0' }} /></div>
          </div>
          <div className="input-group" style={{ marginTop: '0.5rem' }}>
            <label>Security Deposit (₹)</label>
            <input type="number" value={formData.securityDeposit ?? ''} onChange={e => setFormData({ ...formData, securityDeposit: e.target.value === '' ? '' : parseInt(e.target.value) })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1.5px solid #E2E8F0' }} />
          </div>
        </div>
      );
      case 5: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group"><label>Owner / Legal Representative Name *</label><input required value={formData.ownerName} onChange={e => setFormData({ ...formData, ownerName: e.target.value })} placeholder="Legal owner name" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="input-group"><label>Primary Contact Number *</label><input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" /></div>
            <div className="input-group"><label>Alternate Number</label><input value={formData.altPhone} onChange={e => setFormData({ ...formData, altPhone: e.target.value })} placeholder="+91 XXXXX XXXXX" /></div>
          </div>
          <div className="input-group"><label>Official Email Address *</label><input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="owner@example.com" /></div>
        </div>
      );
      case 6: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: '#F0FDF4', borderRadius: '16px', border: '1.5px solid #DCFCE7', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <CheckCircle size={24} color="#10B981" />
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#166534', fontWeight: '700' }}>Review your building details before publishing. Click <b>Edit</b> on any section to make changes.</p>
          </div>
          {[
            { label: 'Basic Info', step: 1, rows: [{ k: 'Building Name', v: formData.name }, { k: 'Type', v: formData.genderType }, { k: 'Warden', v: formData.wardenName }] },
            { label: 'Location', step: 2, rows: [{ k: 'Address', v: formData.addr1 }, { k: 'City', v: `${formData.city}, ${formData.state} — ${formData.pincode}` }, { k: 'Locality', v: formData.locality }] },
            { label: 'Amenities', step: 3, rows: [{ k: 'Selected', v: formData.amenities.length > 0 ? formData.amenities.join(', ') : 'None selected' }] },
            { label: 'Financials', step: 4, rows: [{ k: 'Security Deposit', v: formData.securityDeposit > 0 ? `₹${formData.securityDeposit}` : 'Not Set' }] },
            { label: 'Owner Details', step: 5, rows: [{ k: 'Name', v: formData.ownerName }, { k: 'Phone', v: formData.phone }, { k: 'Email', v: formData.email }] },
          ].map(section => (
            <div key={section.label} style={{ padding: '1.25rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1.5px solid #F1F5F9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontWeight: '800', fontSize: '0.9rem', color: '#1E293B' }}>{section.label}</span>
                <button type="button" onClick={() => setCurrentStep(section.step)}
                  style={{ padding: '0.3rem 0.8rem', borderRadius: '8px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  Edit
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.5rem' }}>
                {section.rows.filter(r => r.v).map(r => (
                  <div key={r.k}>
                    <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>{r.k}</span>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1E293B', marginTop: '0.15rem' }}>{r.v}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ padding: '1rem', background: '#FFF7ED', borderRadius: '14px', border: '1.5px solid #FED7AA', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ fontSize: '1.5rem' }}>🚀</div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#9A3412', fontWeight: '600', lineHeight: 1.6 }}>
              <b>Everything looks great!</b> Once published, your property will be live. You can always edit details from the management dashboard.
            </p>
          </div>
        </div>
      );

      default: return null;
    }
  };




  useEffect(() => {
    if (location.state?.resumeDraftId) {
      const draftToResume = drafts.find(d => d._id === location.state.resumeDraftId || d.id === location.state.resumeDraftId) || { _id: location.state.resumeDraftId };
      resumeDraft(draftToResume);
      navigate('/owner/portfolio', { state: {}, replace: true });
    } else if (location.state?.openNewForm) {
      openFreshForm();
      navigate('/owner/portfolio', { state: {}, replace: true });
    }
  }, [location.state, navigate, drafts, resumeDraft]);

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
    <>
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-primary)',
        overflow: 'hidden',
        color: 'var(--text-primary)'
      }}>
        {/* ── PART 1: FIXED TOP SECTION (Approx 25% height) ── */}
        <div style={{
          flex: '0 0 auto',
          padding: '1.5rem 2.5rem 1rem',
          background: "var(--bg-card)",
          borderBottom: '1.5px solid #F1F5F9',
          zIndex: 10,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
        }}>
          <header style={{
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, var(--accent-primary), #4F46E5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px -4px rgba(79, 70, 229, 0.4)'
              }}>
                <Building2 size={28} color="white" />
              </div>
              <div>
                <h1 style={{
                  fontSize: '2.4rem',
                  fontWeight: '950',
                  letterSpacing: '-0.05em',
                  margin: 0,
                  color: '#0F172A',
                  lineHeight: 1
                }}>My Portfolio</h1>
                <p style={{
                  color: '#64748B',
                  fontWeight: '600',
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.95rem'
                }}>Managing {globalStats.totalBuildings} premium buildings</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={18} style={{ position: 'absolute', left: '1.2rem', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search buildings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '0.9rem 1.2rem 0.9rem 3.5rem',
                    borderRadius: '18px',
                    border: '1.5px solid #E2E8F0',
                    background: '#F8FAFC',
                    color: '#1E293B',
                    width: '320px',
                    fontSize: '0.95rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}
                />
              </div>

              <button onClick={() => setShowDrafts(s => !s)} style={{
                padding: '0.9rem 1.5rem',
                position: 'relative',
                background: "var(--bg-card)",
                border: '1.5px solid #E2E8F0',
                borderRadius: '18px',
                fontWeight: '700',
                fontSize: '0.95rem',
                color: '#475569',
                cursor: 'pointer',
                display: 'flex', gap: '0.6rem', alignItems: 'center'
              }}>
                <Briefcase size={18} /> Drafts
                {(drafts.length + (isAddModalOpen ? 1 : 0)) > 0 && (
                  <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#EF4444', color: "var(--text-on-primary)", borderRadius: '50%', minWidth: '24px', height: '24px', fontSize: '0.75rem', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFFFFF' }}>
                    {drafts.length + (isAddModalOpen ? 1 : 0)}
                  </span>
                )}
              </button>

              <button onClick={openFreshForm} style={{
                padding: '0.9rem 2.2rem',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, var(--accent-primary), #4F46E5)',
                color: "var(--text-on-primary)",
                border: 'none',
                fontWeight: '800',
                fontSize: '0.95rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                boxShadow: '0 8px 24px -4px rgba(79, 70, 229, 0.4)'
              }}>
                <Plus size={20} strokeWidth={3} /> Add Building
              </button>

              <button onClick={() => fetchData()} style={{ width: '52px', height: '52px', borderRadius: '18px', background: "var(--bg-card)", border: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--accent-primary)' }} title="Refresh Data"><Activity size={22} /></button>
              <button onClick={handleLogout} style={{ width: '52px', height: '52px', borderRadius: '18px', background: "var(--bg-card)", border: '1.5px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#EF4444' }}><LogOut size={22} /></button>
            </div>
          </header>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            paddingBottom: '0.5rem'
          }}>
          </div>
        </div>

        {/* ── PART 2: SCROLLABLE BOTTOM SECTION (Approx 75% height) ── */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '2rem 2.5rem 4rem',
          background: '#F8FAFC'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            background: "var(--bg-card)",
            padding: '1rem 1.5rem',
            borderRadius: '20px',
            border: '1.5px solid #F1F5F9',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B', marginRight: '0.5rem', textTransform: 'uppercase' }}>Filter Occupancy:</span>
              {['All', 'High', 'Medium', 'Low'].map(f => (
                <button
                  key={f}
                  onClick={() => setOccupancyFilter(f)}
                  style={{
                    padding: '0.5rem 1.25rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800',
                    border: '1.5px solid', borderColor: occupancyFilter === f ? 'var(--accent-primary)' : '#E2E8F0',
                    background: occupancyFilter === f ? 'var(--accent-primary)' : '#FFFFFF', color: occupancyFilter === f ? '#FFFFFF' : '#64748B',
                    cursor: 'pointer', transition: 'all 0.2s', boxShadow: occupancyFilter === f ? '0 4px 12px rgba(79, 70, 229, 0.2)' : 'none'
                  }}
                >
                  {f}
                </button>
              ))}
              <div style={{ width: '1px', height: '24px', background: '#E2E8F0', margin: '0 0.5rem' }} />
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '700' }}>
                <Building size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                {processedBuildings.length} Buildings
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: '#F8FAFC', border: '1.5px solid #E2E8F0', color: '#1E293B', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
              >
                <option value="name">Alphabetical</option>
                <option value="revenue">Highest Revenue</option>
                <option value="occupancy">Top Occupancy</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem' }}>
                <div className="premium-spinner"></div>
                <p style={{ marginTop: '1.5rem', color: '#64748B', fontWeight: '700' }}>Analyzing portfolio data...</p>
              </div>
            ) : processedBuildings.length > 0 ? (
              processedBuildings.map((b) => (
                <BuildingCard
                  key={b.id}
                  building={b}
                  onNavigate={() => navigate(`/owner/building/${b.id}/manage`)}
                  onRefresh={() => { fetchData(); loadDrafts(); }}
                  onImageClick={(img) => setModalInfo({ isOpen: true, image: img })}
                  onResubmit={handleResubmit}
                  onEdit={(id) => resumeDraft({ id })}
                />
              ))
            ) : data.buildings.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem', background: "var(--bg-card)", borderRadius: '24px', border: '2px dashed #E2E8F0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1E293B', margin: 0 }}>No Building Portfolio Data Available</h3>
                <p style={{ color: '#64748B', marginTop: '0.5rem' }}>Start by adding your first building to your portfolio.</p>
                <button onClick={openFreshForm} style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent-primary), #4F46E5)', border: 'none', color: "var(--text-on-primary)", fontWeight: '800', cursor: 'pointer' }}>+ Add Building</button>
              </div>
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem', background: "var(--bg-card)", borderRadius: '24px', border: '2px dashed #E2E8F0' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#CBD5E1' }}><Search size={48} /></div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1E293B', margin: 0 }}>No Matching Buildings Found</h3>
                <p style={{ color: '#64748B', marginTop: '0.5rem' }}>Try adjusting your search or filters to find what you're looking for.</p>
                <button onClick={() => { setSearchTerm(''); setOccupancyFilter('All'); }} style={{ marginTop: '1.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px', background: '#F1F5F9', border: 'none', color: '#3B82F6', fontWeight: '800', cursor: 'pointer' }}>Clear All Filters</button>
              </div>
            )}
          </div>
        </div>
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
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}><FileText size={20} /></div>
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
                          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}><Edit2 size={18} /></div>
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#1D4ED8' }}>{formData.name || 'Untitled — Currently Editing'}</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>Currently being filled</div>
                          </div>
                        </div>
                        <span style={{ padding: '0.25rem 0.6rem', borderRadius: '20px', background: '#DBEAFE', color: '#1D4ED8', fontSize: '0.65rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12}/> In Progress</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '600' }}>📍 Step: <b>{STEP_CONFIG[currentStep - 1]?.title}</b></div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '6px', fontWeight: '700' }}>
                          <span>Progress</span><span style={{ color: '#3B82F6' }}>{Math.round((currentStep / TOTAL_STEPS) * 100)}%</span>
                        </div>
                        <div style={{ height: '7px', background: '#DBEAFE', borderRadius: '100px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.round((currentStep / TOTAL_STEPS) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #3B82F6, #6366F1)', borderRadius: '100px' }} />
                        </div>
                      </div>
                      <div style={{ padding: '0.65rem', borderRadius: '10px', background: '#3B82F6', color: "var(--text-on-primary)", fontWeight: '800', fontSize: '0.82rem', textAlign: 'center' }}>
                        <ArrowRight size={14} style={{ marginRight: '6px', verticalAlign: 'text-bottom' }} /> Continue Editing
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
                    <div style={{ color: '#CBD5E1', marginBottom: '1rem' }}><FileText size={64}/></div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-secondary)', margin: 0 }}>No saved drafts yet</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Start creating a hostel and save your progress to resume later.</p>
                    <button onClick={() => { setShowDrafts(false); openFreshForm(); }} style={{ marginTop: '0.5rem', padding: '0.8rem 1.6rem', borderRadius: '12px', background: 'var(--accent-primary)', color: "var(--text-on-primary)", border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.9rem' }}>
                      + Create New Hostel
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {drafts.map(draft => {
                      const progress = Math.round(((draft.lastStep || 1) / TOTAL_STEPS) * 100);
                      const stepLabel = STEP_CONFIG[(draft.lastStep || 1) - 1]?.title || 'Basic Info';
                      const ago = draft.updatedAt ? (() => { const d = (Date.now() - new Date(draft.updatedAt)) / 60000; return d < 60 ? `${Math.round(d)}m ago` : `${Math.round(d / 60)}h ago`; })() : 'Recently';
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
                            <div style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: 'linear-gradient(135deg, #6366F1, #3B82F6)', color: "var(--text-on-primary)", fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                              ▶ Continue Filling
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); setItemToDelete({ id: draft._id, name: draft.name || 'Untitled Draft', type: 'draft' }); }}
                              style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: '#FEE2E2', color: '#EF4444', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '0.85rem', flexShrink: 0 }}
                            >
                              🗑️
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
                <button onClick={() => { setShowDrafts(false); openFreshForm(); }} style={{ padding: '0.7rem 1.4rem', borderRadius: '10px', background: 'var(--accent-primary)', color: "var(--text-on-primary)", border: 'none', fontWeight: '800', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={16} /> New Hostel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>



      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: '#F8FAFC', zIndex: 2000, display: 'flex', flexDirection: 'column' }}
          >
            {/* TOP BAR */}
            <div style={{ background: "var(--bg-card)", borderBottom: '1px solid #E2E8F0', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6, #6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: "var(--text-on-primary)", fontSize: '1.1rem' }}>🏨</div>
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
            <div style={{ background: "var(--bg-card)", borderBottom: '1px solid #E2E8F0', padding: '0.8rem 2rem', flexShrink: 0, overflowX: 'auto' }}>
              <div style={{ display: 'flex', gap: 0, minWidth: 'max-content' }}>
                {STEP_CONFIG.map((s, i) => {
                  const done = currentStep > s.step;
                  const active = currentStep === s.step;
                  return (
                    <div key={s.step} style={{ display: 'flex', alignItems: 'center' }}>
                      <div onClick={() => done && setCurrentStep(s.step)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '8px', cursor: done ? 'pointer' : 'default', background: active ? '#EFF6FF' : 'transparent' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: done ? '#10B981' : active ? '#3B82F6' : '#E2E8F0', color: "var(--text-on-primary)", display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '900', flexShrink: 0 }}>
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
                      <button type="button" onClick={() => setCurrentStep(s => s - 1)} style={{ width: '80px', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: "var(--bg-card)", color: '#475569', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronLeft size={18} />
                      </button>
                    )}
                    <button type="button" onClick={() => saveDraftToBackend(formData, currentStep, activeDraftId)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: "var(--bg-card)", color: '#3B82F6', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <FileText size={16} /> Save Draft
                    </button>
                    <button
                      disabled={isSubmitting}
                      type="submit"
                      style={{
                        flex: 2,
                        padding: '1rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: currentStep === TOTAL_STEPS ? '#10B981' : '#3B82F6',
                        color: "var(--text-on-primary)",
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.95rem'
                      }}
                    >
                      {isSubmitting ? 'Processing...' : currentStep === TOTAL_STEPS ? '🚀 Finalize & Publish' : 'Continue'} <ChevronRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hostel-scroll-container::-webkit-scrollbar { width: 6px; }
        .hostel-scroll-container::-webkit-scrollbar-track { background: transparent; }
        .hostel-scroll-container::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .hostel-scroll-container::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
        
        .input-group { display: flex; flex-direction: column; gap: 0.6rem; }
        .input-group label { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .input-group input, .input-group select, .input-group textarea { 
          padding: 1rem; 
          border-radius: 14px; 
          border: 1.5px solid #E2E8F0; 
          background: var(--bg-tertiary); 
          color: var(--text-main); 
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.2s;
          outline: none;
        }
        .input-group input:focus, .input-group select:focus, .input-group textarea:focus {
          border-color: var(--accent-primary);
          background: var(--bg-card);
          box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }

        .premium-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #F1F5F9;
          border-top: 4px solid var(--accent-primary);
          border-radius: 50%;
          animation: spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          margin: 4rem auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .kpi-card-glass {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .kpi-card-glass:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px -8px rgba(0,0,0,0.1);
          border-color: var(--border-color);
        }

        select {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 1rem center;
          padding-right: 2.5rem !important;
        }
      `}</style>

      {/* REUSABLE DELETE MODAL FOR DRAFTS */}
      {itemToDelete && createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div onClick={() => setItemToDelete(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} />
          <div style={{ position: 'relative', zIndex: 1, background: "var(--bg-card)", borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '440px', boxShadow: '0 32px 64px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Trash2 size={30} color="#EF4444" />
            </div>
            <h2 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: '900', margin: '0 0 0.4rem', color: '#0F172A' }}>Delete {itemToDelete.type === 'draft' ? 'Draft' : 'Building'}?</h2>
            <p style={{ textAlign: 'center', color: '#64748B', fontSize: '0.9rem', margin: '0 0 1rem' }}>You are about to permanently delete</p>
            <p style={{ textAlign: 'center', fontWeight: '800', fontSize: '1rem', color: '#1E293B', margin: '0 0 1.2rem', background: '#F8FAFC', padding: '0.6rem 1rem', borderRadius: '12px', border: '1.5px solid #F1F5F9' }}>
              {itemToDelete.type === 'draft' ? '📝' : '🏢'} {itemToDelete.name}
            </p>
            <p style={{ textAlign: 'center', color: '#DC2626', fontSize: '0.8rem', fontWeight: '700', margin: '0 0 2rem', padding: '0.75rem 1rem', background: '#FFF1F2', borderRadius: '10px', border: '1px solid #FECACA' }}>
              ⚠️ This action is irreversible.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setItemToDelete(null)} style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', background: '#F1F5F9', border: 'none', color: '#475569', fontWeight: '800', cursor: 'pointer' }}>Cancel</button>
              <button
                disabled={isDeletingItem}
                onClick={() => itemToDelete.type === 'draft' ? deleteDraft(itemToDelete.id) : null}
                style={{ flex: 1, padding: '0.9rem', borderRadius: '12px', background: '#EF4444', color: "var(--text-on-primary)", fontWeight: '900', cursor: 'pointer' }}
              >
                {isDeletingItem ? 'Deleting...' : 'Delete Now'}
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
