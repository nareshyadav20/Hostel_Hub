// Updated: 2026-05-07 - Premium Infrastructure Update
import React, { useState, useEffect, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Building as BuildingIcon, Layers, DoorOpen, Bed, PlusCircle, UsersRound, Banknote, Clock, MessageSquareWarning,
  ArrowLeft, CheckSquare, Square, Trash2, Edit2, Zap, X, Image as ImageIcon, BedDouble, Filter, ChevronRight, Search,
  Heart, ShieldCheck, Sparkles, Wind, Sun, BatteryCharging, Wifi, Monitor, Coffee, Lock, UserCheck, Star,
  MapPin, Thermometer, Fan, Smartphone, Tablet, Luggage, Lightbulb, Ruler, Weight, FileText, Wrench, History,
  Maximize, ArrowUp, Brush, Palette, LayoutGrid, Activity, Droplets, ChevronLeft,
  TrendingUp, Coins, BarChart3, HardDrive, Waves, Flame, Fingerprint
} from 'lucide-react';

import { api } from '../api';

// Full-Screen Professional Modal Component
const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.3)', backdropFilter: 'blur(12px)' }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            position: 'relative', width: '100%', maxWidth: '950px', maxHeight: '90vh',
            background: "var(--bg-card)", borderRadius: '32px', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.25)',
            border: '1px solid rgba(255,255,255,0.4)'
          }}
        >
          {/* Modal Header */}
          <div style={{
            padding: '1.2rem 2.5rem', borderBottom: '1px solid #F1F5F9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: "var(--bg-card)", flexShrink: 0
          }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '950', letterSpacing: '-0.04em', color: '#0F172A', margin: 0 }}>{title}</h2>
              <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.1rem 0 0 0', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Administrative Intelligence</p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#F8FAFC', border: '1px solid #F1F5F9', color: '#64748B',
                cursor: 'pointer', width: '40px', height: '40px', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2.5rem 2.5rem 2.5rem', scrollbarWidth: 'none' }}>
            {children}
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Ultra-Premium Property Intelligence Drawer ---
const PropertyDetailDrawer = ({ isOpen, onClose, target, type, activeTab, onTabChange }) => {
  if (!target) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 4000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(15px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'relative', width: '100%', maxWidth: '600px', maxHeight: '80vh',
              background: "var(--bg-card)", borderRadius: '24px', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', boxShadow: '0 50px 100px -20px rgba(0,0,0,0.3)'
            }}
          >
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #F1F5F9', background: "var(--bg-card)", zIndex: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: '#0F172A', color: "var(--text-on-primary)", fontSize: '0.65rem', fontWeight: '950', letterSpacing: '0.05em' }}>
                      {type.toUpperCase()} DETAILS
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: '1000', color: '#0F172A', margin: 0, letterSpacing: '-0.04em' }}>
                    {target.name || (target.roomNumber ? `Room ${target.roomNumber}` : target.floorNumber ? `Floor ${target.floorNumber}` : target.bedNumber ? `Bed ${target.bedNumber}` : 'Details')}
                  </h2>
                </div>
                <button onClick={onClose} style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '2.5rem', background: "var(--bg-card)", scrollbarWidth: 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {target.images?.[0] && (
                  <div style={{ position: 'relative', height: '160px', borderRadius: '20px', overflow: 'hidden' }}>
                    <img src={target.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  {(target.status || target.occupancyPercentage !== undefined) && (
                    <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                      <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '900', color: '#64748B', letterSpacing: '0.05em' }}>STATUS</p>
                      <p style={{ margin: 0, fontSize: '1rem', fontWeight: '950', color: '#0F172A' }}>{target.status || `${target.occupancyPercentage}% Occupied`}</p>
                    </div>
                  )}
                  {(target.totalBeds !== undefined || target.capacity !== undefined) && (
                    <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                      <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '900', color: '#64748B', letterSpacing: '0.05em' }}>CAPACITY</p>
                      <p style={{ margin: 0, fontSize: '1rem', fontWeight: '950', color: '#0F172A' }}>{target.totalBeds || target.capacity} Beds</p>
                    </div>
                  )}
                  {target.category && (
                    <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                      <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '900', color: '#64748B', letterSpacing: '0.05em' }}>CATEGORY</p>
                      <p style={{ margin: 0, fontSize: '1rem', fontWeight: '950', color: '#0F172A' }}>{target.category}</p>
                    </div>
                  )}
                  {target.genderType && (
                    <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9' }}>
                      <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '900', color: '#64748B', letterSpacing: '0.05em' }}>RESIDENCY</p>
                      <p style={{ margin: 0, fontSize: '1rem', fontWeight: '950', color: '#0F172A' }}>{target.genderType}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const INITIAL_FORM_STATE = {
  name: '', address: '', number: '', type: 'Single',
  capacity: 1, status: 'AVAILABLE', imageUrl: '',
  isAC: false, washroomType: 'Attached', balcony: false, facing: 'Road',
  position: 'Standard', bedType: 'Single', floorType: 'Tiles', windowCount: 1,
  furniture: [], amenities: [],
  rentAmount: 8000, securityDeposit: 0, noticePeriod: 30, description: '',
  smartMonitoringEnabled: true, realTimeEnabled: true, totalRooms: 0, totalBeds: 0,
  images: [], hygieneRating: 96, washroomsCount: 4, cctvStatus: 'Active',
  wifiStatus: 'Excellent', loungesCount: 2, facilities: [],
  waterPoints: 0, washingMachines: 0, fridges: 0, hasStudyArea: false, hasLoungeArea: false,
  roomSize: '', fanCount: 1, chairCount: 1, hasGeyser: false, hasStudyTable: false, hasWardrobe: false, hasMirror: false, hasTV: false, hasRefrigerator: false, hasMicrowave: false, hasWiFi: true,
  hasMattress: true, pillowCount: 1, bedSheetCount: 1, hasBlanket: false, hasDustbin: false,
  // New Building Level attributes
  wardenName: '',
  wardenContact: '',
  rentSingle: 0,
  rentDouble: 0,
  rentTriple: 0,
  rent4Sharing: 0,
  rent5Sharing: 0,
  rent6Sharing: 0,
  foodCharges: 3000,
  maintenanceCharges: 799,
  documents: []
};


const Buildings = () => {
  const { buildingId: urlBuildingId } = useParams();
  const navigate = useNavigate();

  // Step 1: Restore context
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  const [view, setView] = useState('buildings');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');

  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);

  const [isEditBuildingOpen, setIsEditBuildingOpen] = useState(false);
  const [isEditFloorOpen, setIsEditFloorOpen] = useState(false);

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Modal states
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false);
  const [isAddFloorOpen, setIsAddFloorOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isAddBedOpen, setIsAddBedOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [isEditBedOpen, setIsEditBedOpen] = useState(false);
  const [isViewBedDetailsOpen, setIsViewBedDetailsOpen] = useState(false);
  const [isViewBedHistoryOpen, setIsViewBedHistoryOpen] = useState(false);
  const [isViewRoomDetailsOpen, setIsViewRoomDetailsOpen] = useState(false);
  const [isAssignTenantOpen, setIsAssignTenantOpen] = useState(false);
  const [isAssignConfirmOpen, setIsAssignConfirmOpen] = useState(false);
  const [assignData, setAssignData] = useState({ bed: null, tenant: null });
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [analyticsTarget, setAnalyticsTarget] = useState(null);
  const [viewingBed, setViewingBed] = useState(null);
  const [previewingRoom, setPreviewingRoom] = useState(null);

  // New Smart Ecosystem State
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [detailTarget, setDetailTarget] = useState(null);
  const [detailType, setDetailType] = useState('building'); // 'building', 'floor', 'room', 'bed'
  const [activeDetailTab, setActiveDetailTab] = useState('Overview');



  // Form states
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [docNameInput, setDocNameInput] = useState('');
  const [docUrlInput, setDocUrlInput] = useState('');

  const handleAddDocumentToForm = () => {
    if (!docNameInput || !docUrlInput) {
      alert("Please provide both document name and URL link.");
      return;
    }
    setFormData(prev => ({
      ...prev,
      documents: [...(prev.documents || []), { name: docNameInput, url: docUrlInput }]
    }));
    setDocNameInput('');
    setDocUrlInput('');
  };

  const handleRemoveDocumentFromForm = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: (prev.documents || []).filter((_, idx) => idx !== index)
    }));
  };

  const [loading, setLoading] = useState(false);

  const fetchBuildings = async () => {
    setLoading(true);
    console.log("Buildings module fetching for ID:", activeBuildingId);
    try {
      const bData = await api.getBuildings(activeBuildingId, true);
      const safeData = Array.isArray(bData) ? bData : [];

      const getSessionCreatedIds = () => {
        try {
          const saved = sessionStorage.getItem('createdBuildingIds');
          return saved ? JSON.parse(saved) : [];
        } catch (e) {
          return [];
        }
      };

      const createdBuildingIds = getSessionCreatedIds();

      if (activeBuildingId) {
        const matchingBuilding = safeData.find(b => (b.id === activeBuildingId || b._id === activeBuildingId));
        const sessionCreated = safeData.filter(b => createdBuildingIds.includes(b.id) || createdBuildingIds.includes(b._id));

        let filtered = [];
        if (matchingBuilding) {
          filtered.push(matchingBuilding);
        }
        sessionCreated.forEach(b => {
          if (!filtered.some(f => (f.id === b.id || f._id === b._id))) {
            filtered.push(b);
          }
        });

        setBuildings(filtered);

        if (matchingBuilding) {
          setSelectedBuilding(matchingBuilding);
          // Pre-fetch floors
          try {
            const floorData = await api.getFloors(matchingBuilding._id || matchingBuilding.id);
            setFloors(floorData || []);
          } catch (err) {
            console.error("Failed to pre-load floors:", err);
          }
        }
      } else {
        setBuildings(safeData);
      }
    } catch (err) {
      console.error("Fetch error in Buildings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBuilding = async (e) => {
    e.preventDefault();
    try {
      const bId = selectedBuilding?.id || selectedBuilding?._id;
      const updated = await api.updateBuilding(bId, {
        name: formData.name,
        address: formData.address,
        description: formData.description,
        type: formData.type,
        genderType: formData.genderType || 'Mixed',
        category: formData.category || 'Mixed',
        amenities: formData.amenities || [],
        // Building Facilities (Strict 1:1)
        lift: formData.amenities?.includes('Lift') || false,
        wifi: formData.amenities?.includes('WiFi') || false,
        diningHall: formData.amenities?.includes('Dining Hall') || false,
        commonKitchen: formData.amenities?.includes('Common Kitchen') || false,
        studyHall: formData.amenities?.includes('Study Hall') || false,
        laundryRoom: formData.amenities?.includes('Laundry Room') || false,
        fireSafety: formData.amenities?.includes('Fire Safety') || false,
        emergencyExit: formData.amenities?.includes('Emergency Exit') || false,
        isAC: formData.isAC,
        securityDeposit: formData.securityDeposit || 0,
        foodCharges: formData.foodCharges || 0,
        maintenanceCharges: formData.maintenanceCharges || 0,
        rentSingle: formData.rentSingle || 0,
        rentDouble: formData.rentDouble || 0,
        rentTriple: formData.rentTriple || 0,
        rent4Sharing: formData.rent4Sharing || 0,
        rent5Sharing: formData.rent5Sharing || 0,
        rent6Sharing: formData.rent6Sharing || 0,
        staffInfo: {
          name: formData.wardenName,
          role: 'Warden',
          contact: formData.wardenContact
        },
        documents: formData.documents || []
      });
      setBuildings(prev => prev.map(b => (b.id === updated.id || b._id === updated._id) ? updated : b));
      setSelectedBuilding(updated);
      setIsEditBuildingOpen(false);
      alert("Building updated successfully");
      fetchBuildings();
    } catch (err) {
      alert("Failed to update building: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteBuilding = async (bId) => {
    if (!window.confirm("Are you sure you want to delete this entire building and all its data? This cannot be undone.")) return;
    try {
      await api.deleteBuilding(bId);
      setBuildings(prev => prev.filter(b => b.id !== bId && b._id !== bId));
      alert("Building deleted successfully");
      fetchBuildings();
    } catch (err) {
      alert("Failed to delete building: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, [activeBuildingId]);

  const silentRefresh = async () => {
    try {
      const bData = await api.getBuildings(activeBuildingId, true);
      const safeData = Array.isArray(bData) ? bData : [];

      const getSessionCreatedIds = () => {
        try {
          const saved = sessionStorage.getItem('createdBuildingIds');
          return saved ? JSON.parse(saved) : [];
        } catch (e) {
          return [];
        }
      };

      const createdBuildingIds = getSessionCreatedIds();

      if (activeBuildingId) {
        const matchingBuilding = safeData.find(b => (b.id === activeBuildingId || b._id === activeBuildingId));
        const sessionCreated = safeData.filter(b => createdBuildingIds.includes(b.id) || createdBuildingIds.includes(b._id));

        let filtered = [];
        if (matchingBuilding) {
          filtered.push(matchingBuilding);
        }
        sessionCreated.forEach(b => {
          if (!filtered.some(f => (f.id === b.id || f._id === b._id))) {
            filtered.push(b);
          }
        });

        setBuildings(filtered);

        if (selectedBuilding) {
          const updatedSelected = filtered.find(b => b.id === selectedBuilding.id || b._id === selectedBuilding._id);
          if (updatedSelected) {
            setSelectedBuilding(updatedSelected);
          }
        }
      } else {
        setBuildings(safeData);
      }
      if (selectedBuilding) {
        const fData = await api.getFloors(selectedBuilding.id || selectedBuilding._id);
        setFloors(fData || []);
      }
      if (selectedFloor) {
        const rData = await api.getRooms(selectedFloor.id || selectedFloor._id);
        setRooms(rData || []);
      }
      if (selectedRoom) {
        const bData = await api.getBeds(selectedRoom.id || selectedRoom._id);
        setBeds(bData || []);
      }
    } catch (e) {
      console.error("Silent refresh failed", e);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(silentRefresh, 10000); // 10s poll for live data updates
    return () => clearInterval(intervalId);
  }, [activeBuildingId, selectedBuilding, selectedFloor, selectedRoom]);

  const handleSelectBuilding = async (b) => {
    const bId = b?._id || b?.id;
    if (!bId) return;
    setSearchQuery(''); // Clear search on navigate
    setSelectedBuilding(b);
    setLoading(true);
    try {
      const data = await api.getFloors(bId);
      console.log(`Loaded ${data?.length || 0} floors for building:`, bId);
      setFloors(data || []);
      setView('floors');
    } catch (err) {
      console.error("Failed to load floors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFloor = async (f) => {
    const fId = f?._id || f?.id;
    if (!fId) return;
    setSearchQuery(''); // Clear search on navigate
    setSelectedFloor(f);
    setLoading(true);
    try {
      const data = await api.getRooms(fId);
      console.log(`Loaded ${data?.length || 0} rooms for floor:`, fId);
      setRooms(data || []);
      setView('rooms');
    } catch (err) {
      console.error("Failed to load rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoom = async (r) => {
    const rId = r?._id || r?.id;
    if (!rId) return;
    setSelectedRoom(r);
    setView('beds');
    try {
      const data = await api.getBeds(rId);
      setBeds(data || []);
    } catch (err) {
      console.error("Failed to load beds:", err);
      setBeds([]);
    }
  };

  const handleOpenEditRoom = (r) => {
    setFormData({
      ...INITIAL_FORM_STATE,
      ...r,
      id: r.id || r._id,
      number: r.roomNumber,
      type: r.roomType,
      imageUrl: r.images?.[0] || '',
      hasGeyser: r.geyser || false,
      hasStudyTable: r.studyTable || false,
      hasWardrobe: r.wardrobe || false,
      hasMirror: r.mirror || false,
      hasTV: r.tv || false,
      hasRefrigerator: r.refrigerator || false,
      hasMicrowave: r.microwave || false,
      hasWiFi: r.wifi || false
    });
    setIsEditRoomOpen(true);
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateRoom(formData.id, {
        roomNumber: formData.number,
        roomType: formData.type,
        capacity: formData.capacity,
        rentAmount: formData.rentAmount,
        securityDeposit: formData.securityDeposit,
        noticePeriod: formData.noticePeriod,
        isAC: formData.isAC,
        attachedBathroom: formData.attachedBathroom,
        balcony: formData.balcony,
        facing: formData.facing,
        floorType: formData.floorType,
        windowCount: formData.windowCount,
        furniture: formData.furniture,
        ventilationScore: formData.ventilationScore || 85,
        naturalLightScore: formData.naturalLightScore || 85,
        geyser: formData.hasGeyser,
        studyTable: formData.hasStudyTable,
        wardrobe: formData.hasWardrobe,
        mirror: formData.hasMirror,
        tv: formData.hasTV,
        refrigerator: formData.hasRefrigerator,
        microwave: formData.hasMicrowave,
        wifi: formData.hasWiFi,
        images: formData.images?.length > 0 ? formData.images : (formData.imageUrl ? [formData.imageUrl] : [])
      });
      setSelectedRoom(updated);
      setRooms(prev => prev.map(r => (r.id === updated.id || r._id === updated._id) ? updated : r));
      setIsEditRoomOpen(false);
      silentRefresh();
    } catch (err) {
      alert("Failed to update room: " + (err.response?.data?.error || err.message));
    }
  };

  const handleOpenEditBed = (b) => {
    setFormData({
      ...INITIAL_FORM_STATE,
      ...b,
      id: b.id || b._id,
      number: b.bedNumber,
      imageUrl: b.images?.[0] || '',
      hasMattress: b.mattress || false,
      hasPillow: b.pillow || false,
      hasLocker: b.locker || false,
      readingLight: b.readingLamp || false,
      chargingPoint: b.chargingPoint || false,
      tenantName: b.occupantDetails?.tenantName || '',
      joinDate: b.occupantDetails?.joinDate ? new Date(b.occupantDetails.joinDate).toISOString().split('T')[0] : '',
      exitDate: b.occupantDetails?.exitDate ? new Date(b.occupantDetails.exitDate).toISOString().split('T')[0] : ''
    });
    setIsEditBedOpen(true);
  };

  const handleUpdateBed = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateBed(formData.id, {
        bedNumber: formData.number,
        status: formData.status,
        position: formData.position,
        bedType: formData.bedType,
        bedSize: formData.bedSize,
        bedFacing: formData.bedFacing,
        images: formData.images?.length > 0 ? formData.images : (formData.imageUrl ? [formData.imageUrl] : []),
        comfortScore: formData.comfortScore || 85,
        privacyCurtain: formData.privacyCurtain || false,
        readingLamp: formData.readingLight,
        mattress: formData.hasMattress,
        pillow: formData.hasPillow,
        locker: formData.hasLocker,
        chargingPoint: formData.chargingPoint,
        occupantDetails: (formData.status === 'Occupied' || formData.status === 'Reserved') ? {
          tenantName: formData.tenantName,
          joinDate: formData.joinDate,
          exitDate: formData.exitDate
        } : undefined
      });
      // Update beds list
      setBeds(prev => prev.map(b => (b.id === updated.id || b._id === updated._id) ? updated : b));
      setIsEditBedOpen(false);
      silentRefresh();
    } catch (err) {
      alert("Failed to update bed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to decommission this room and all its beds?")) return;
    try {
      await api.deleteRoom(roomId);
      setRooms(prev => prev.filter(r => r.id !== roomId && r._id !== roomId));
      silentRefresh();
    } catch (err) {
      alert("Failed to delete room: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteBed = async (bedId) => {
    if (!window.confirm("Are you sure you want to remove this bed record?")) return;
    try {
      await api.deleteBed(bedId);
      setBeds(prev => prev.filter(b => b.id !== bedId && b._id !== bedId));
      silentRefresh();
    } catch (err) {
      alert("Failed to delete bed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDeleteFloor = async (floorId) => {
    if (!window.confirm("Are you sure you want to delete this floor and all its rooms?")) return;
    try {
      await api.deleteFloor(floorId);
      setFloors(prev => prev.filter(f => f.id !== floorId && f._id !== floorId));
      silentRefresh();
    } catch (err) {
      alert("Failed to delete floor: " + (err.response?.data?.error || err.message));
    }
  };



  // --- HELPER: Image Upload ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: prev.imageUrl || reader.result, // keep legacy imageUrl working
          images: [...(prev.images || []), reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const updateRoomImageDirectly = async (roomId, file) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      try {
        // Append to existing images
        const currentImages = selectedRoom?.images || [];
        const newImages = [...currentImages, base64];
        const updated = await api.updateRoom(roomId, { images: newImages });
        setSelectedRoom(prev => ({ ...prev, images: updated.images }));
        setRooms(prev => prev.map(r => (r.id === roomId || r._id === roomId) ? { ...r, images: updated.images } : r));
      } catch (err) { console.error("Room image update failed", err); }
    };
    reader.readAsDataURL(file);
  };

  // Generic Breadcrumb
  const renderBreadcrumb = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
      <button
        onClick={() => {
          setView('buildings');
          setSelectedBuilding(null);
          setSelectedFloor(null);
          setSelectedRoom(null);
          // Clear isolated state to show full portfolio
          localStorage.removeItem('selectedBuildingId');
          fetchBuildings(); // Refresh to show all buildings
        }}
        style={{ background: 'none', border: 'none', color: view === 'buildings' ? 'var(--accent-primary)' : 'inherit', cursor: 'pointer', fontWeight: '900' }}
      >
        Infrastructure
      </button>
      {selectedBuilding && (
        <>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <button
            onClick={() => {
              setView('floors');
              setSelectedFloor(null);
              setSelectedRoom(null);
            }}
            style={{ background: 'none', border: 'none', color: view === 'floors' ? 'var(--accent-primary)' : 'inherit', cursor: 'pointer', fontWeight: '900' }}
          >
            {selectedBuilding.name}
          </button>
        </>
      )}
      {selectedFloor && (view === 'rooms' || view === 'beds') && (
        <>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <button
            onClick={() => {
              setView('rooms');
              setSelectedRoom(null);
            }}
            style={{ background: 'none', border: 'none', color: view === 'rooms' ? 'var(--accent-primary)' : 'inherit', cursor: 'pointer', fontWeight: '900' }}
          >
            Floor {selectedFloor.floorNumber}
          </button>
        </>
      )}
      {selectedRoom && view === 'beds' && (
        <>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <span style={{ color: 'var(--text-primary)', fontWeight: '900' }}>Room {selectedRoom.roomNumber}</span>
        </>
      )}
    </div>
  );

  const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' };

  const handleAddBuilding = async (e) => {
    e.preventDefault();
    try {
      const newB = await api.addBuilding({
        name: formData.name,
        address: formData.address,
        genderType: formData.genderType || 'Mixed',
        category: formData.category || 'Mixed',
        rating: formData.rating || 4.5,
        amenities: formData.amenities || [],
        // Building Facilities (Strict 1:1)
        lift: formData.amenities?.includes('Lift') || false,
        wifi: formData.amenities?.includes('WiFi') || false,
        diningHall: formData.amenities?.includes('Dining Hall') || false,
        commonKitchen: formData.amenities?.includes('Common Kitchen') || false,
        studyHall: formData.amenities?.includes('Study Hall') || false,
        laundryRoom: formData.amenities?.includes('Laundry Room') || false,
        fireSafety: formData.amenities?.includes('Fire Safety') || false,
        emergencyExit: formData.amenities?.includes('Emergency Exit') || false,
        isAC: formData.isAC,
        images: formData.imageUrl ? [formData.imageUrl] : [],
        showInPortfolio: false,
        propertyId: activeBuildingId,
        securityDeposit: formData.securityDeposit || 0,
        foodCharges: formData.foodCharges || 0,
        maintenanceCharges: formData.maintenanceCharges || 0,
        rentSingle: formData.rentSingle || 0,
        rentDouble: formData.rentDouble || 0,
        rentTriple: formData.rentTriple || 0,
        rent4Sharing: formData.rent4Sharing || 0,
        rent5Sharing: formData.rent5Sharing || 0,
        rent6Sharing: formData.rent6Sharing || 0,
        staffInfo: {
          name: formData.wardenName,
          role: 'Warden',
          contact: formData.wardenContact
        },
        documents: formData.documents || []
      });
      setIsAddBuildingOpen(false);
      setFormData(INITIAL_FORM_STATE);

      // Save the new building ID to sessionStorage
      const newId = newB.id || newB._id;
      if (newId) {
        try {
          const saved = sessionStorage.getItem('createdBuildingIds');
          const current = saved ? JSON.parse(saved) : [];
          if (!current.includes(newId)) {
            current.push(newId);
            sessionStorage.setItem('createdBuildingIds', JSON.stringify(current));
          }
        } catch (e) { }
      }

      // Reset to buildings list view
      setSelectedBuilding(null);
      setSelectedFloor(null);
      setSelectedRoom(null);
      setView('buildings');

      // Fetch/refresh buildings list with the new building included
      await fetchBuildings();
    } catch (err) {
      alert("Failed to add building: " + (err.response?.data?.error || err.message));
    }
  };

  const handleAddFloor = async (e) => {
    e.preventDefault();
    try {
      const bId = selectedBuilding?.id || selectedBuilding?._id;
      if (!bId) throw new Error("Please select a building first.");
      const newF = await api.addFloor({
        buildingId: bId,
        floorNumber: formData.number,
        description: formData.description,
        totalRooms: formData.totalRooms,
        totalBeds: formData.totalBeds,
        commonWashroom: formData.washroomsCount,
        waterPoint: formData.waterPoints,
        washingMachine: formData.washingMachines,
        fridge: formData.fridges,
        studyArea: formData.hasStudyArea,
        loungeArea: formData.hasLoungeArea,
        balcony: formData.hasBalcony,
        waitingArea: formData.hasWaitingArea,
        images: formData.images?.length > 0 ? formData.images : (formData.imageUrl ? [formData.imageUrl] : [])
      });
      setFloors([...floors, newF]);
      setIsAddFloorOpen(false);
      setFormData(INITIAL_FORM_STATE);
      silentRefresh();
    } catch (err) {
      alert("Failed to add floor: " + (err.response?.data?.error || err.message));
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const fId = selectedFloor?.id || selectedFloor?._id;
      if (!fId) throw new Error("Please select a floor first.");
      const newR = await api.addRoom({
        floorId: fId,
        roomNumber: formData.number,
        roomType: formData.type,
        capacity: formData.capacity,
        rentAmount: formData.rentAmount,
        securityDeposit: formData.securityDeposit,
        noticePeriod: formData.noticePeriod,
        isAC: formData.isAC,
        attachedBathroom: formData.attachedBathroom,
        balcony: formData.balcony,
        facing: formData.facing,
        floorType: formData.floorType,
        windowCount: formData.windowCount,
        furniture: formData.furniture,
        ventilationScore: formData.ventilationScore || 85,
        naturalLightScore: formData.naturalLightScore || 85,
        hygieneRating: formData.hygieneRating || 9.0,
        roomSize: formData.roomSize,
        fanCount: formData.fanCount,
        chairCount: formData.chairCount,
        geyser: formData.hasGeyser,
        studyTable: formData.hasStudyTable,
        wardrobe: formData.hasWardrobe,
        mirror: formData.hasMirror,
        tv: formData.hasTV,
        refrigerator: formData.hasRefrigerator,
        microwave: formData.hasMicrowave,
        wifi: formData.hasWiFi,
        images: formData.images?.length > 0 ? formData.images : (formData.imageUrl ? [formData.imageUrl] : [])
      });
      setRooms([...rooms, newR]);
      setIsAddRoomOpen(false);
      setFormData(INITIAL_FORM_STATE);
      silentRefresh();
    } catch (err) {
      alert("Failed to deploy room: " + (err.response?.data?.error || err.message));
    }
  };

  const handleAddBed = async (e) => {
    e.preventDefault();
    try {
      const newB = await api.addBed({
        roomId: selectedRoom.id || selectedRoom._id,
        bedNumber: formData.number,
        status: formData.status,
        position: formData.position,
        bedType: formData.bedType,
        bedSize: formData.bedSize,
        bedFacing: formData.bedFacing,
        images: formData.images?.length > 0 ? formData.images : (formData.imageUrl ? [formData.imageUrl] : []),
        comfortScore: formData.comfortScore || 85,
        privacyCurtain: formData.privacyCurtain || false,
        readingLamp: formData.readingLight,
        mattress: formData.hasMattress,
        pillow: formData.hasPillow,
        locker: formData.hasLocker,
        chargingPoint: formData.chargingPoint,
        occupantDetails: (formData.status === 'Occupied' || formData.status === 'Reserved') ? {
          tenantName: formData.tenantName,
          joinDate: formData.joinDate,
          exitDate: formData.exitDate
        } : undefined
      });
      setBeds([...beds, newB]);
      setIsAddBedOpen(false);
      setFormData(INITIAL_FORM_STATE);

      // Sync hostel bed stats so Rooms page reflects new count immediately
      const bId = selectedBuilding?.id || selectedBuilding?._id;
      if (bId) {
        try { await api.syncHostelBeds(bId); } catch (_) { }
        // Signal Rooms.jsx to reload via CustomEvent for SPA same-window updates
        window.dispatchEvent(new Event('bedStatsUpdated'));
        // Also fire storage event for multi-tab setups
        localStorage.setItem('bedStatsUpdated', Date.now().toString());
      }
      silentRefresh();
    } catch (err) {
      alert("Failed to add bed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes neon-pulse {
          0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.2); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.6); }
          100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.2); }
        }
        .smart-card:hover {
          border-color: var(--color-blue) !important;
          background: var(--bg-card) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          box-shadow: 0 40px 80px -15px rgba(99, 102, 241, 0.2) !important;
          transform: translateY(-12px) !important;
        }
        .smart-card {
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          transform: translateZ(0);
          will-change: transform, box-shadow;
        }
        .smart-card:hover .bento-item, .smart-card:hover * {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          transform: translateZ(0);
        }
        .status-pill {
          transition: all 0.3s ease;
        }
        .status-pill:hover {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      `}</style>
      <div className="buildings-page" style={{ animation: 'fadeIn 0.5s ease-out', minHeight: '100vh' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BuildingIcon size={32} color="var(--accent-primary)" /> Property Infrastructure
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Advanced hierarchical management of buildings, floors, rooms, and beds.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder={`Search ${view}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '2.8rem', width: '250px', background: 'var(--bg-secondary)' }}
              />
            </div>
            <button
              className="btn"
              onClick={() => navigate(`/owner/building/${activeBuildingId}/rooms`)}
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', fontWeight: '700' }}
            >
              <BedDouble size={18} /> Occupancy View
            </button>
            <button className="btn" onClick={() => setShowFilters(!showFilters)} style={{ background: showFilters ? 'var(--accent-primary)' : 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: showFilters ? 'white' : 'var(--text-primary)' }}>
              <Filter size={16} /> Filters
            </button>
            {['buildings', 'floors', 'rooms', 'beds'].includes(view) && (
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (view === 'buildings') setIsAddBuildingOpen(true);
                  else if (view === 'floors') setIsAddFloorOpen(true);
                  else if (view === 'rooms') setIsAddRoomOpen(true);
                  else if (view === 'beds') setIsAddBedOpen(true);
                }}
                style={{ padding: '0.7rem 1.5rem', borderRadius: '12px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.6rem' }}
              >
                <PlusCircle size={20} /> Add {view === 'buildings' ? 'Building' : view === 'floors' ? 'Floor' : view === 'rooms' ? 'Room' : 'Bed'}
              </button>
            )}
            <button onClick={() => window.history.back()} className="btn" style={{ padding: '0.7rem', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={20} />
            </button>
          </div>
        </header>

        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            style={{ overflow: 'hidden', marginBottom: '2rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filter By:</span>
            {['All', 'AC', 'Non-AC', 'Available', 'Occupied'].map(f => (
              <button
                key={f}
                onClick={() => setFilterType(f)}
                style={{
                  padding: '0.5rem 1.2rem', borderRadius: '10px', border: '1px solid var(--border-color)',
                  background: filterType === f ? 'var(--accent-primary)' : 'var(--bg-primary)',
                  color: filterType === f ? 'white' : 'var(--text-primary)',
                  fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                {f}
              </button>
            ))}
          </motion.div>
        )}

        {renderBreadcrumb()}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="card" style={{ height: '350px', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden' }}>
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)' }}
                />
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {view === 'buildings' && (
              <motion.div key="buildings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <BuildingsList
                  buildings={buildings.filter(b =>
                    ((b?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (b?.address || '').toLowerCase().includes(searchQuery.toLowerCase())) &&
                    (filterType === 'All' || (filterType === 'AC' && b.isAC) || (filterType === 'Non-AC' && !b.isAC))
                  )}
                  onSelect={handleSelectBuilding}
                  onEditBuilding={(b) => {
                    setSelectedBuilding(b);
                    setFormData({
                      ...INITIAL_FORM_STATE,
                      ...b,
                      wardenName: b.staffInfo?.name || '',
                      wardenContact: b.staffInfo?.contact || '',
                      documents: b.documents || [],
                      rentSingle: b.rentSingle || 0,
                      rentDouble: b.rentDouble || 0,
                      rentTriple: b.rentTriple || 0,
                      rent4Sharing: b.rent4Sharing || 0,
                      rent5Sharing: b.rent5Sharing || 0,
                      rent6Sharing: b.rent6Sharing || 0,
                      foodCharges: b.foodCharges !== undefined ? b.foodCharges : 3000,
                      maintenanceCharges: b.maintenanceCharges !== undefined ? b.maintenanceCharges : 799,
                      securityDeposit: b.securityDeposit !== undefined ? b.securityDeposit : 0
                    });
                    setIsEditBuildingOpen(true);
                  }}
                  onAdd={() => setIsAddBuildingOpen(true)}
                  onViewAnalytics={() => { }}
                  onDeleteBuilding={handleDeleteBuilding}
                />
              </motion.div>
            )}
            {view === 'floors' && (
              <motion.div key="floors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <FloorsList
                  floors={floors.filter(f => (f?.floorNumber?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase()))}
                  building={selectedBuilding}
                  onSelect={handleSelectFloor}
                  onBack={() => setView('buildings')}
                  onAdd={() => setIsAddFloorOpen(true)}
                  onDelete={handleDeleteFloor}
                  onViewAnalytics={() => { }}
                />
              </motion.div>
            )}
            {view === 'rooms' && (
              <motion.div key="rooms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <RoomsList
                  rooms={rooms.filter(r =>
                    ((r?.roomNumber?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                      (r?.floorType || '').toLowerCase().includes(searchQuery.toLowerCase())) &&
                    (filterType === 'All' ||
                      (filterType === 'AC' && r.isAC) ||
                      (filterType === 'Non-AC' && !r.isAC) ||
                      (filterType === 'Available' && (r.beds?.some(b => b.status === 'AVAILABLE') || r.status === 'AVAILABLE')) ||
                      (filterType === 'Occupied' && r.beds?.length > 0 && !r.beds?.some(b => b.status === 'AVAILABLE')))
                  )}
                  floor={selectedFloor}
                  building={selectedBuilding}
                  onSelect={handleSelectRoom}
                  onBack={() => setView('floors')}
                  onAdd={() => setIsAddRoomOpen(true)}
                  onEdit={handleOpenEditRoom}
                  onDelete={handleDeleteRoom}
                  onViewDetails={() => { }}
                />
              </motion.div>
            )}
            {view === 'beds' && (
              <motion.div key="beds" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <RoomHero
                  room={selectedRoom}
                  onImageUpdate={(file) => updateRoomImageDirectly(selectedRoom.id || selectedRoom._id, file)}
                  onEdit={() => handleOpenEditRoom(selectedRoom)}
                />
                <BedsList
                  beds={beds.filter(b =>
                    (b?.bedNumber?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase()) &&
                    (filterType === 'All' || (filterType === 'Available' && b.status === 'AVAILABLE') || (filterType === 'Occupied' && b.status === 'OCCUPIED'))
                  )}
                  room={selectedRoom}
                  floor={selectedFloor}
                  building={selectedBuilding}
                  onBack={() => setView('rooms')}
                  onAdd={() => setIsAddBedOpen(true)}
                  onEditBed={handleOpenEditBed}
                  onDelete={handleDeleteBed}
                  onViewDetails={() => { }}
                  onViewHistory={(bed) => { setViewingBed(bed); setIsViewBedHistoryOpen(true); }}
                  onAssignTenant={(bed) => { setViewingBed(bed); setIsAssignTenantOpen(true); }}
                />
              </motion.div>
            )}
            {view === 'assign' && (
              <motion.div key="assign" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <AssignFloors buildings={buildings} onBack={() => setView('buildings')} />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* --- Addition Modals --- */}
        {/* Edit Building Modal */}
        <Modal isOpen={isEditBuildingOpen} onClose={() => setIsEditBuildingOpen(false)} title={`Edit Building - ${selectedBuilding?.name}`}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleUpdateBuilding}>
            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BUILDING NAME *</label>
              <input placeholder="Block A" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} required />
            </div>
            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>ADDRESS *</label>
              <input placeholder="e.g. 123 MG Road, Bengaluru" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} style={inputStyle} required />
            </div>
            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>DESCRIPTION</label>
              <textarea placeholder="e.g. Premium block for seniors" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
              <div className="input-group">
                <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BUILDING TYPE *</label>
                <select required value={formData.genderType} onChange={e => setFormData({ ...formData, genderType: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                  <option value="Mixed">Co-Living</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>FACILITIES</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
                {['Lift', 'WiFi', 'Dining Hall', 'Common Kitchen', 'Study Hall', 'Laundry Room', 'Fire Safety', 'Emergency Exit'].map(a => (
                  <div
                    key={a} onClick={() => {
                      const newAm = formData.amenities?.includes(a) ? formData.amenities.filter(i => i !== a) : [...(formData.amenities || []), a];
                      setFormData({ ...formData, amenities: newAm });
                    }}
                    style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', background: formData.amenities?.includes(a) ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: formData.amenities?.includes(a) ? 'white' : 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                  >
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Warden Details Section */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '1rem' }}>Warden Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>WARDEN NAME</label>
                  <input placeholder="Warden Name" value={formData.wardenName} onChange={e => setFormData({ ...formData, wardenName: e.target.value })} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Sharing Prices (Per Bed Rent) */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '1rem' }}>Sharing Prices (Per Bed Rent / Month)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem' }}>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>1 SHARING RENT (₹)</label>
                  <input type="number" placeholder="0" value={formData.rentSingle} onChange={e => setFormData({ ...formData, rentSingle: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>2 SHARING RENT (₹)</label>
                  <input type="number" placeholder="0" value={formData.rentDouble} onChange={e => setFormData({ ...formData, rentDouble: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>3 SHARING RENT (₹)</label>
                  <input type="number" placeholder="0" value={formData.rentTriple} onChange={e => setFormData({ ...formData, rentTriple: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>4 SHARING RENT (₹)</label>
                  <input type="number" placeholder="0" value={formData.rent4Sharing} onChange={e => setFormData({ ...formData, rent4Sharing: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>5 SHARING RENT (₹)</label>
                  <input type="number" placeholder="0" value={formData.rent5Sharing} onChange={e => setFormData({ ...formData, rent5Sharing: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>6 SHARING RENT (₹)</label>
                  <input type="number" placeholder="0" value={formData.rent6Sharing} onChange={e => setFormData({ ...formData, rent6Sharing: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* General Charges & Deposit */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '1rem' }}>Financials</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>SECURITY DEPOSIT AMOUNT (₹)</label>
                  <input type="number" placeholder="0" value={formData.securityDeposit} onChange={e => setFormData({ ...formData, securityDeposit: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
              </div>
            </div>

            <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '0.5rem', fontSize: '1rem' }}>Save Building Changes</button>
          </form>
        </Modal>

        <Modal isOpen={isAddBuildingOpen} onClose={() => setIsAddBuildingOpen(false)} title="Add New Building">
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleAddBuilding}>
            <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>BUILDING NAME *</label><input placeholder="e.g. Block A" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} required /></div>
            <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>ADDRESS *</label><input placeholder="e.g. 123 MG Road, Bengaluru" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} style={inputStyle} required /></div>
            <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>DESCRIPTION</label><textarea placeholder="Building Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} /></div>
            <div className="input-group">
              <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>BUILDING PHOTOS</label>
              <div style={{ position: 'relative', marginTop: '0.6rem' }}>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)', minHeight: '60px' }}>
                  <ImageIcon size={22} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.95rem', color: formData.images?.length > 0 ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '800' }}>
                    {formData.images?.length > 0 ? `${formData.images.length} Photos Selected` : 'Choose Photos'}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
              <div className="input-group">
                <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>BUILDING TYPE *</label>
                <select required value={formData.genderType || 'Boys'} onChange={e => setFormData({ ...formData, genderType: e.target.value })} style={inputStyle}>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                  <option value="Mixed">Co-Living</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>FACILITIES</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
                {['Lift', 'WiFi', 'Dining Hall', 'Common Kitchen', 'Study Hall', 'Laundry Room', 'Fire Safety', 'Emergency Exit'].map(a => (
                  <div
                    key={a} onClick={() => {
                      const newAm = formData.amenities?.includes(a) ? formData.amenities.filter(i => i !== a) : [...(formData.amenities || []), a];
                      setFormData({ ...formData, amenities: newAm });
                    }}
                    style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', background: formData.amenities?.includes(a) ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: formData.amenities?.includes(a) ? 'white' : 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                  >
                    {a}
                  </div>
                ))}
              </div>
            </div>
            {/* Warden Details Section */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '1rem' }}>Warden Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>WARDEN NAME</label>
                  <input placeholder="Warden Name" value={formData.wardenName} onChange={e => setFormData({ ...formData, wardenName: e.target.value })} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Sharing Prices (Per Bed Rent) */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '1rem' }}>Sharing Prices (Per Bed Rent / Month)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem' }}>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>1 SHARING RENT (₹)</label>
                  <input type="number" placeholder="0" value={formData.rentSingle} onChange={e => setFormData({ ...formData, rentSingle: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>2 SHARING RENT (₹)</label>
                  <input type="number" placeholder="0" value={formData.rentDouble} onChange={e => setFormData({ ...formData, rentDouble: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>3 SHARING RENT (₹)</label>
                  <input type="number" placeholder="0" value={formData.rentTriple} onChange={e => setFormData({ ...formData, rentTriple: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>4 SHARING RENT (₹)</label>
                  <input type="number" placeholder="0" value={formData.rent4Sharing} onChange={e => setFormData({ ...formData, rent4Sharing: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>5 SHARING RENT (₹)</label>
                  <input type="number" placeholder="0" value={formData.rent5Sharing} onChange={e => setFormData({ ...formData, rent5Sharing: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>6 SHARING RENT (₹)</label>
                  <input type="number" placeholder="0" value={formData.rent6Sharing} onChange={e => setFormData({ ...formData, rent6Sharing: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* General Charges & Deposit */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '1rem' }}>Financials</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>SECURITY DEPOSIT (₹)</label>
                  <input type="number" placeholder="0" value={formData.securityDeposit} onChange={e => setFormData({ ...formData, securityDeposit: parseInt(e.target.value) || 0 })} style={inputStyle} />
                </div>
              </div>
            </div>

            <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '1rem', fontSize: '1.1rem', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}>Create Property</button>
          </form>
        </Modal>

        <Modal isOpen={isAddFloorOpen} onClose={() => setIsAddFloorOpen(false)} title={`Add Floor to ${selectedBuilding?.name}`}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleAddFloor}>
            <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>FLOOR NUMBER</label><input placeholder="e.g. G, 1, 2" value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} style={inputStyle} required /></div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '1rem' }}>Floor Equipment & Washrooms</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>COMMON WASHROOMS</label><input type="number" placeholder="2" value={formData.washroomsCount} onChange={e => setFormData({ ...formData, washroomsCount: parseInt(e.target.value) || 0 })} style={inputStyle} min="0" /></div>
                <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>WATER POINTS</label><input type="number" placeholder="2" value={formData.waterPoints} onChange={e => setFormData({ ...formData, waterPoints: parseInt(e.target.value) || 0 })} style={inputStyle} min="0" /></div>
                <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>WASHING MACHINES</label><input type="number" placeholder="1" value={formData.washingMachines} onChange={e => setFormData({ ...formData, washingMachines: parseInt(e.target.value) || 0 })} style={inputStyle} min="0" /></div>
                <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>FRIDGES</label><input type="number" placeholder="1" value={formData.fridges} onChange={e => setFormData({ ...formData, fridges: parseInt(e.target.value) || 0 })} style={inputStyle} min="0" /></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({ ...formData, hasStudyArea: !formData.hasStudyArea })}>
                  <div style={{ width: '20px', height: '20px', border: '2px solid var(--accent-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.hasStudyArea ? 'var(--accent-primary)' : 'transparent', transition: 'all 0.3s' }}>
                    {formData.hasStudyArea && <div style={{ width: '10px', height: '10px', background: "var(--bg-card)", borderRadius: '2px' }} />}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>Study Area</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({ ...formData, hasLoungeArea: !formData.hasLoungeArea })}>
                  <div style={{ width: '20px', height: '20px', border: '2px solid var(--accent-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.hasLoungeArea ? 'var(--accent-primary)' : 'transparent', transition: 'all 0.3s' }}>
                    {formData.hasLoungeArea && <div style={{ width: '10px', height: '10px', background: "var(--bg-card)", borderRadius: '2px' }} />}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>Lounge Area</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({ ...formData, hasBalcony: !formData.hasBalcony })}>
                  <div style={{ width: '20px', height: '20px', border: '2px solid var(--accent-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.hasBalcony ? 'var(--accent-primary)' : 'transparent', transition: 'all 0.3s' }}>
                    {formData.hasBalcony && <div style={{ width: '10px', height: '10px', background: "var(--bg-card)", borderRadius: '2px' }} />}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>Balcony</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({ ...formData, hasWaitingArea: !formData.hasWaitingArea })}>
                  <div style={{ width: '20px', height: '20px', border: '2px solid var(--accent-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.hasWaitingArea ? 'var(--accent-primary)' : 'transparent', transition: 'all 0.3s' }}>
                    {formData.hasWaitingArea && <div style={{ width: '10px', height: '10px', background: "var(--bg-card)", borderRadius: '2px' }} />}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-primary)' }}>Waiting Area</span>
                </div>
              </div>
            </div>

            <button className="btn btn-primary" type="submit" style={{ padding: '1.1rem', borderRadius: '16px', fontWeight: '900', fontSize: '1rem' }}>Save Floor Structure</button>
          </form>
        </Modal>

        <Modal isOpen={isAddRoomOpen} onClose={() => setIsAddRoomOpen(false)} title={`Add Room to Floor ${selectedFloor?.floorNumber}`}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleAddRoom}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>ROOM NO.</label><input placeholder="101" value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} style={inputStyle} required /></div>
              <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>CAPACITY (BEDS)</label><input type="number" placeholder="2" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} style={inputStyle} required min="1" /></div>
            </div>

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>ROOM PREVIEW</label>
              <div style={{ position: 'relative', marginTop: '0.6rem' }}>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)', minHeight: '60px' }}>
                  <ImageIcon size={20} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.9rem', color: (formData.images?.length || formData.imageUrl) ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '800' }}>
                    {formData.images?.length > 0 ? `${formData.images.length} Photos Loaded` : (formData.imageUrl ? 'Photo Ready' : 'Upload Multiple Photos')}
                  </span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>ROOM METRICS & FITTINGS</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem', marginTop: '0.5rem' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-muted)' }}>ROOM SIZE</label>
                  <input placeholder="e.g. 12x12 sqft" value={formData.roomSize} onChange={e => setFormData({ ...formData, roomSize: e.target.value })} style={inputStyle} />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-muted)' }}>FANS</label>
                  <input type="number" value={formData.fanCount} onChange={e => setFormData({ ...formData, fanCount: parseInt(e.target.value) || 0 })} style={inputStyle} min="0" />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-muted)' }}>CHAIRS</label>
                  <input type="number" value={formData.chairCount} onChange={e => setFormData({ ...formData, chairCount: parseInt(e.target.value) || 0 })} style={inputStyle} min="0" />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>FURNITURE & ELECTRONICS & AMENITIES</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.5rem' }}>
                {[
                  { key: 'isAC', label: 'AC' },
                  { key: 'attachedBathroom', label: 'Attached Bathroom' },
                  { key: 'hasGeyser', label: 'Geyser' },
                  { key: 'hasStudyTable', label: 'Study Table' },
                  { key: 'hasWardrobe', label: 'Wardrobe' },
                  { key: 'hasMirror', label: 'Mirror' },
                  { key: 'balcony', label: 'Balcony' },
                  { key: 'hasTV', label: 'TV' },
                  { key: 'hasRefrigerator', label: 'Refrigerator' },
                  { key: 'hasMicrowave', label: 'Microwave' },
                  { key: 'hasWiFi', label: 'WiFi' }
                ].map(item => (
                  <div
                    key={item.key}
                    onClick={() => setFormData({ ...formData, [item.key]: !formData[item.key] })}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer',
                      background: formData[item.key] ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      color: formData[item.key] ? 'white' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)', transition: 'all 0.2s'
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '0.5rem', fontSize: '1rem' }}>Deploy Room</button>
          </form>
        </Modal>

        <Modal isOpen={isEditRoomOpen} onClose={() => setIsEditRoomOpen(false)} title={`Edit Room ${formData.number} Features`}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleUpdateRoom}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>ROOM NO.</label><input placeholder="101" value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} style={inputStyle} required /></div>
              <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>CAPACITY (BEDS)</label><input type="number" placeholder="2" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} style={inputStyle} required min="1" /></div>
            </div>

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>ROOM PREVIEW</label>
              <div style={{ position: 'relative', marginTop: '0.6rem' }}>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)', minHeight: '60px' }}>
                  <ImageIcon size={20} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.9rem', color: (formData.images?.length || formData.imageUrl) ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '800' }}>
                    {formData.images?.length > 0 ? `${formData.images.length} Photos Loaded` : (formData.imageUrl ? 'Photo Ready' : 'Upload Multiple Photos')}
                  </span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>ROOM METRICS & FITTINGS</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem', marginTop: '0.5rem' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-muted)' }}>ROOM SIZE</label>
                  <input placeholder="e.g. 12x12 sqft" value={formData.roomSize} onChange={e => setFormData({ ...formData, roomSize: e.target.value })} style={inputStyle} />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-muted)' }}>FANS</label>
                  <input type="number" value={formData.fanCount} onChange={e => setFormData({ ...formData, fanCount: parseInt(e.target.value) || 0 })} style={inputStyle} min="0" />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--text-muted)' }}>CHAIRS</label>
                  <input type="number" value={formData.chairCount} onChange={e => setFormData({ ...formData, chairCount: parseInt(e.target.value) || 0 })} style={inputStyle} min="0" />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>FURNITURE & ELECTRONICS & AMENITIES</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.5rem' }}>
                {[
                  { key: 'isAC', label: 'AC' },
                  { key: 'attachedBathroom', label: 'Attached Bathroom' },
                  { key: 'hasGeyser', label: 'Geyser' },
                  { key: 'hasStudyTable', label: 'Study Table' },
                  { key: 'hasWardrobe', label: 'Wardrobe' },
                  { key: 'hasMirror', label: 'Mirror' },
                  { key: 'balcony', label: 'Balcony' },
                  { key: 'hasTV', label: 'TV' },
                  { key: 'hasRefrigerator', label: 'Refrigerator' },
                  { key: 'hasMicrowave', label: 'Microwave' },
                  { key: 'hasWiFi', label: 'WiFi' }
                ].map(item => (
                  <div
                    key={item.key}
                    onClick={() => setFormData({ ...formData, [item.key]: !formData[item.key] })}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer',
                      background: formData[item.key] ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      color: formData[item.key] ? 'white' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)', transition: 'all 0.2s'
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '0.5rem', fontSize: '1rem' }}>Save Changes</button>
          </form>
        </Modal>

        <Modal isOpen={isEditBedOpen} onClose={() => setIsEditBedOpen(false)} title={`Edit Bed ${formData.number}`}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleUpdateBed}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED NO.</label><input value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} style={inputStyle} required /></div>
              <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>STATUS</label>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                  <option value="Vacant">Vacant</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED SIZE</label>
                <select value={formData.bedSize} onChange={e => setFormData({ ...formData, bedSize: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                  <option value="">Select Size</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Queen">Queen</option>
                  <option value="King">King</option>
                  <option value="Bunk Bed">Bunk Bed</option>
                </select>
              </div>
              <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED FACING</label>
                <select value={formData.bedFacing} onChange={e => setFormData({ ...formData, bedFacing: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                  <option value="">Select Facing</option>
                  <option value="Window">Window</option>
                  <option value="Wall">Wall</option>
                  <option value="Corner">Corner</option>
                  <option value="Door">Door</option>
                </select>
              </div>
            </div>

            {formData.status === 'Occupied' && (
              <div className="input-group">
                <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>OCCUPANT DETAILS</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem', marginTop: '0.5rem' }}>
                  <input placeholder="Tenant Name" value={formData.tenantName || ''} onChange={e => setFormData({ ...formData, tenantName: e.target.value })} style={inputStyle} required />
                  <input type="date" placeholder="Join Date" value={formData.joinDate || ''} onChange={e => setFormData({ ...formData, joinDate: e.target.value })} style={inputStyle} required />
                  <input type="date" placeholder="Exit Date" value={formData.exitDate || ''} onChange={e => setFormData({ ...formData, exitDate: e.target.value })} style={inputStyle} />
                </div>
              </div>
            )}

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED PHOTO</label>
              <div style={{ position: 'relative', marginTop: '0.6rem' }}>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1.2rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)', minHeight: '65px' }}>
                  <ImageIcon size={22} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.95rem', color: (formData.images?.length || formData.imageUrl) ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '800' }}>
                    {formData.images?.length > 0 ? `${formData.images.length} Photos Loaded` : (formData.imageUrl ? 'Photo Ready' : 'Upload Multiple Photos')}
                  </span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED FEATURES & AMENITIES</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.5rem' }}>
                {[
                  { key: 'hasMattress', label: 'Mattress' },
                  { key: 'hasPillow', label: 'Pillow' },
                  { key: 'hasLocker', label: 'Locker' },
                  { key: 'readingLight', label: 'Reading Lamp' },
                  { key: 'chargingPoint', label: 'Charging Point' }
                ].map(item => (
                  <div
                    key={item.key}
                    onClick={() => setFormData({ ...formData, [item.key]: !formData[item.key] })}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer',
                      background: formData[item.key] ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      color: formData[item.key] ? 'white' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)', transition: 'all 0.2s'
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '0.5rem', fontSize: '1.05rem' }}>Save Bed Details</button>
          </form>
        </Modal>

        <Modal isOpen={isAddBedOpen} onClose={() => setIsAddBedOpen(false)} title={`Configure New Bed in Room ${selectedRoom?.roomNumber}`}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleAddBed}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED NO.</label><input placeholder="e.g. A, B, 101-A" value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} style={inputStyle} required /></div>
              <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>STATUS</label>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ ...inputStyle, width: '100%' }} required>
                  <option value="Vacant">Vacant</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Blocked">Blocked</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
              <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED SIZE</label>
                <select value={formData.bedSize} onChange={e => setFormData({ ...formData, bedSize: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                  <option value="">Select Size</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Queen">Queen</option>
                  <option value="King">King</option>
                  <option value="Bunk Bed">Bunk Bed</option>
                </select>
              </div>
              <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED FACING</label>
                <select value={formData.bedFacing} onChange={e => setFormData({ ...formData, bedFacing: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                  <option value="">Select Facing</option>
                  <option value="Window">Window</option>
                  <option value="Wall">Wall</option>
                  <option value="Corner">Corner</option>
                  <option value="Door">Door</option>
                </select>
              </div>
            </div>

            {formData.status === 'Occupied' && (
              <div className="input-group">
                <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>OCCUPANT DETAILS</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.2rem', marginTop: '0.5rem' }}>
                  <input placeholder="Tenant Name" value={formData.tenantName || ''} onChange={e => setFormData({ ...formData, tenantName: e.target.value })} style={inputStyle} required />
                  <input type="date" placeholder="Join Date" value={formData.joinDate || ''} onChange={e => setFormData({ ...formData, joinDate: e.target.value })} style={inputStyle} required />
                  <input type="date" placeholder="Exit Date" value={formData.exitDate || ''} onChange={e => setFormData({ ...formData, exitDate: e.target.value })} style={inputStyle} />
                </div>
              </div>
            )}

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED PHOTO</label>
              <div style={{ position: 'relative', marginTop: '0.6rem' }}>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
                <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1.2rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)', minHeight: '65px' }}>
                  <ImageIcon size={22} color="var(--accent-primary)" />
                  <span style={{ fontSize: '0.95rem', color: (formData.images?.length || formData.imageUrl) ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '800' }}>
                    {formData.images?.length > 0 ? `${formData.images.length} Photos Loaded` : (formData.imageUrl ? 'Photo Ready' : 'Upload Multiple Photos')}
                  </span>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED FEATURES & AMENITIES</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.5rem' }}>
                {[
                  { key: 'hasMattress', label: 'Mattress' },
                  { key: 'hasPillow', label: 'Pillow' },
                  { key: 'hasLocker', label: 'Locker' },
                  { key: 'readingLight', label: 'Reading Lamp' },
                  { key: 'chargingPoint', label: 'Charging Point' }
                ].map(item => (
                  <div
                    key={item.key}
                    onClick={() => setFormData({ ...formData, [item.key]: !formData[item.key] })}
                    style={{
                      padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer',
                      background: formData[item.key] ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      color: formData[item.key] ? 'white' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)', transition: 'all 0.2s'
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '0.5rem', fontSize: '1.05rem' }}>Save Bed Assignment</button>
          </form>
        </Modal>

        <Modal isOpen={isViewBedDetailsOpen} onClose={() => setIsViewBedDetailsOpen(false)} title={`Premium Bed Details - ${viewingBed?.bedNumber}`}>
          {viewingBed && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '-0.5rem' }}>
              <div style={{
                height: '280px',
                borderRadius: '24px',
                background: '#F1F5F9',
                backgroundImage: `url("${viewingBed.images && viewingBed.images[0] ? viewingBed.images[0] : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&auto=format&fit=crop'}"), linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '14px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(12px)',
                  color: "var(--text-on-primary)",
                  fontSize: '0.9rem',
                  fontWeight: '950',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                }}>
                  Γé╣{viewingBed.price || 8500}<span style={{ opacity: 0.7, fontSize: '0.7rem', fontWeight: '700' }}>/MONTH</span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                gap: '2.5rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.2rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Bed size={20} color="#6366F1" /> Technical Specifications
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {[
                      { label: 'Bed Type', value: viewingBed.bedType || 'Single Bunk', icon: <BedDouble size={16} /> },
                      { label: 'Position', value: viewingBed.position || 'Window Side', icon: <Sun size={16} /> },
                      { label: 'Mattress', value: viewingBed.hasMattress !== false ? 'Yes' : 'No', icon: <Heart size={16} /> },
                      { label: 'Pillows', value: viewingBed.pillowCount || 0, icon: <Layers size={16} /> },
                      { label: 'Bed Sheets', value: viewingBed.bedSheetCount || 0, icon: <FileText size={16} /> },
                      { label: 'Blanket', value: viewingBed.hasBlanket ? 'Yes' : 'No', icon: <Coffee size={16} /> },
                      { label: 'Dustbin', value: viewingBed.hasDustbin ? 'Yes' : 'No', icon: <Trash2 size={16} /> },
                      { label: 'Power', value: 'USB-C Ready', icon: <BatteryCharging size={16} /> }
                    ].map((spec, i) => (
                      <div key={i} style={{ padding: '1rem', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                        <div style={{ color: '#6366F1', marginBottom: '0.4rem' }}>{spec.icon}</div>
                        <p style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>{spec.label}</p>
                        <p style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: '900', margin: 0 }}>{spec.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1.2rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <UsersRound size={20} color="#3B82F6" /> Occupancy Control
                  </h3>
                  {viewingBed.status === 'OCCUPIED' ? (
                    <div style={{ padding: '1.5rem', borderRadius: '24px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#3B82F6', color: "var(--text-on-primary)", display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '900' }}>
                          {viewingBed.tenant?.name?.[0] || 'T'}
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '900' }}>{viewingBed.tenant?.name || 'John Doe'}</h4>
                          <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', fontWeight: '700' }}>Tenant ID: #TEN-4920</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <p style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}><span>Check-in:</span> <span style={{ fontWeight: '900' }}>01 May 2026</span></p>
                        <p style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}><span>Rent Status:</span> <span style={{ color: '#10B981', fontWeight: '900' }}>Paid</span></p>
                        <p style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: '700', display: 'flex', justifyContent: 'space-between' }}><span>Documents:</span> <span style={{ color: '#3B82F6', fontWeight: '900' }}>Verified</span></p>
                      </div>
                      <button style={{ width: '100%', marginTop: '1.2rem', padding: '0.8rem', borderRadius: '12px', background: '#3B82F6', color: "var(--text-on-primary)", border: 'none', fontWeight: '900', fontSize: '0.85rem', cursor: 'pointer' }}>Message Tenant</button>
                    </div>
                  ) : (
                    <div style={{ padding: '2rem', textAlign: 'center', borderRadius: '24px', background: '#ECFDF5', border: '1px dashed #10B981' }}>
                      <Sparkles size={32} color="#10B981" style={{ marginBottom: '1rem' }} />
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#065F46' }}>Bed Available</h4>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#065F46', opacity: 0.8 }}>This bed is ready for immediate deployment.</p>
                      <button
                        onClick={() => setIsAssignTenantOpen(true)}
                        style={{ marginTop: '1.2rem', padding: '0.8rem 1.5rem', borderRadius: '12px', background: '#10B981', color: "var(--text-on-primary)", border: 'none', fontWeight: '900', cursor: 'pointer' }}
                      >
                        Assign Tenant
                      </button>
                    </div>
                  )}

                  <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '24px', background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '0.8rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <MapPin size={18} color="#6366F1" /> Infrastructure Context
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748B', fontWeight: '800' }}>FLOOR</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>Level {selectedRoom?.floorNumber || 2}</p>
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748B', fontWeight: '800' }}>ROOM</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>Suite {selectedRoom?.roomNumber || '204'}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '0.8rem' }}>Smart Amenities</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {['USB-C Charging', 'Wi-Fi 6', 'Locker', 'Reading Light', 'Personal Fan', 'Smart Lock'].map(a => (
                        <span key={a} style={{ padding: '0.4rem 0.8rem', borderRadius: '10px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.75rem', fontWeight: '800', color: '#475569' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.5rem', borderRadius: '24px', background: '#0F172A', color: "var(--text-on-primary)" }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Sparkles size={20} color="#6366F1" /> Asset Intelligence
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', margin: 0 }}>
                  This {viewingBed.bedType || 'premium'} unit is optimized for maximum comfort and privacy.
                  Featuring integrated smart modules and high-durability materials, it maintains a 98%
                  satisfaction rating among professional tenants.
                </p>
                <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: '800' }}>DEPLOYED</p>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>12 Jan 2026</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: '800' }}>LAST SERVICE</p>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>28 Apr 2026</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: '800' }}>REVENUE LDT</p>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>Γé╣42,500</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* --- Room Details Modal --- */}
        <Modal isOpen={isViewRoomDetailsOpen} onClose={() => setIsViewRoomDetailsOpen(false)} title={`Luxury Room Intelligence - ${previewingRoom?.roomNumber}`}>
          {previewingRoom && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '-0.5rem' }}>
              {/* Hero Image Section */}
              <div style={{
                height: '320px', borderRadius: '32px', background: '#F1F5F9',
                backgroundImage: `url("${previewingRoom.images?.[0] || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'}"), linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)`,
                backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}>
                <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.6rem 1.2rem', borderRadius: '14px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)', color: "var(--text-on-primary)", fontSize: '0.9rem', fontWeight: '950', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Γé╣{previewingRoom.rentAmount || 0}<span style={{ opacity: 0.7, fontSize: '0.7rem' }}>/MONTH</span>
                </div>
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', display: 'flex', gap: '0.8rem' }}>
                  <span style={{ padding: '0.5rem 1rem', borderRadius: '12px', background: "var(--bg-card)", color: '#0F172A', fontSize: '0.75rem', fontWeight: '950' }}>{previewingRoom.roomType}</span>
                  <span style={{ padding: '0.5rem 1rem', borderRadius: '12px', background: '#10B981', color: "var(--text-on-primary)", fontSize: '0.75rem', fontWeight: '950' }}>{previewingRoom.occupied === previewingRoom.capacity ? 'FULL' : 'AVAILABLE'}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Left Column: Specs & Environment */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '950', marginBottom: '1.2rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Ruler size={20} color="#6366F1" /> Technical Specifications
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {[
                        { label: 'Room Area', value: '240 sq.ft', icon: <Maximize size={16} /> },
                        { label: 'Ceiling Height', value: '10.5 ft', icon: <ArrowUp size={16} /> },
                        { label: 'Flooring', value: 'Italian Marble', icon: <Square size={16} /> },
                        { label: 'Ventilation', value: 'Dual Aspect', icon: <Wind size={16} /> },
                        { label: 'Wall Finish', value: 'Premium Emulsion', icon: <Brush size={16} /> },
                        { label: 'Interior Theme', value: 'Minimalist Nordic', icon: <Palette size={16} /> }
                      ].map((spec, i) => (
                        <div key={i} style={{ padding: '1rem', borderRadius: '18px', background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                          <div style={{ color: '#6366F1', marginBottom: '0.4rem' }}>{spec.icon}</div>
                          <p style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: '800', margin: 0, textTransform: 'uppercase' }}>{spec.label}</p>
                          <p style={{ fontSize: '0.85rem', color: '#1E293B', fontWeight: '950', margin: 0 }}>{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '950', marginBottom: '1.2rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Sparkles size={20} color="#3B82F6" /> Environment & Comfort
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {[
                        { label: 'Natural Light', score: 92, color: '#F59E0B' },
                        { label: 'Air Quality', score: 96, color: '#10B981' },
                        { label: 'Noise Insulation', score: 88, color: '#6366F1' },
                        { label: 'Privacy Index', score: 95, color: '#EC4899' }
                      ].map((env, i) => (
                        <div key={i} style={{ padding: '1.2rem', borderRadius: '24px', background: "var(--bg-card)", border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '900', color: '#64748B' }}>{env.label}</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: '1000', color: env.color }}>{env.score}%</span>
                          </div>
                          <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${env.score}%`, background: env.color, borderRadius: '3px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column: Amenities & Safety */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '950', marginBottom: '1.2rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <LayoutGrid size={20} color="#10B981" /> Smart Amenities
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      {['WiFi 6', 'Smart TV', 'Air Conditioner', 'Fan', 'Geyser', 'Study Desk', 'Ergonomic Chair', 'Personal Locker', 'USB Charging', 'Reading Light'].map(a => (
                        <span key={a} style={{ padding: '0.6rem 1.2rem', borderRadius: '14px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.8rem', fontWeight: '900', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} /> {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', borderRadius: '28px', background: '#F0FDFA', border: '1px solid #CCFBF1' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '950', marginBottom: '1rem', color: '#134E4A', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <ShieldCheck size={20} color="#0D9488" /> Safety & Hygiene Protocol
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '800', color: '#134E4A' }}>
                        <span>Last Sanitized:</span>
                        <span style={{ fontWeight: '950' }}>Today, 09:30 AM</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '800', color: '#134E4A' }}>
                        <span>Hygiene Score:</span>
                        <span style={{ fontWeight: '950', color: '#0D9488' }}>98/100 (A+)</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <span style={{ padding: '0.3rem 0.7rem', borderRadius: '8px', background: '#D1FAE5', color: '#065F46', fontSize: '0.65rem', fontWeight: '900' }}>CCTV SECURED</span>
                        <span style={{ padding: '0.3rem 0.7rem', borderRadius: '8px', background: '#D1FAE5', color: '#065F46', fontSize: '0.65rem', fontWeight: '900' }}>FIRE RATED</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', borderRadius: '28px', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: "var(--text-on-primary)" }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' }}>
                      <Sparkles size={20} color="#6366F1" />
                      <h3 style={{ fontSize: '1rem', fontWeight: '950', margin: 0 }}>AI Operational Insight</h3>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', margin: 0 }}>
                      This room is currently performing at **peak efficiency**. Demand for this unit is **1.4x higher** than average.
                      Recommended for long-stay professionals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* --- Assign Tenant Modal --- */}
        <Modal isOpen={isAssignTenantOpen} onClose={() => setIsAssignTenantOpen(false)} title={`Assign Tenant - Bed ${viewingBed?.bedNumber}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ padding: '1.2rem', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '900', color: '#0F172A' }}>Select Candidate</h4>
              <div style={{ position: 'relative' }}>
                <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  placeholder="Search by name or ID..."
                  style={{ ...inputStyle, paddingLeft: '3rem', fontSize: '0.9rem', width: '100%' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {[
                { id: 'T001', name: 'Aryan Sharma', type: 'Professional', status: 'Verified', rent: '9,500' },
                { id: 'T002', name: 'Vikram Singh', type: 'Student', status: 'Pending Docs', rent: '8,500' },
                { id: 'T003', name: 'Siddharth Rao', type: 'Professional', status: 'Verified', rent: '9,500' },
                { id: 'T004', name: 'Kabir Verma', type: 'Student', status: 'Verified', rent: '8,500' }
              ].map(tenant => (
                <motion.div
                  key={tenant.id}
                  whileHover={{ scale: 1.01, background: '#F1F5F9' }}
                  onClick={() => {
                    setAssignData({ bed: viewingBed, tenant });
                    setIsAssignConfirmOpen(true);
                  }}
                  style={{
                    padding: '1rem 1.5rem', borderRadius: '20px', border: '1px solid #E2E8F0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', background: "var(--bg-card)", transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#6366F1', color: "var(--text-on-primary)", display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900' }}>
                      {tenant.name[0]}
                    </div>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '900', color: '#0F172A' }}>{tenant.name}</h5>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B', fontWeight: '700' }}>{tenant.type} ΓÇó ID: {tenant.id}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      padding: '0.3rem 0.6rem', borderRadius: '8px', background: tenant.status === 'Verified' ? '#ECFDF5' : '#FEF2F2',
                      color: tenant.status === 'Verified' ? '#10B981' : '#EF4444', fontSize: '0.65rem', fontWeight: '950'
                    }}>
                      {tenant.status}
                    </span>
                    <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', fontWeight: '900', color: '#0F172A' }}>Γé╣{tenant.rent}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button
                className="btn"
                style={{ padding: '1rem', borderRadius: '16px', background: '#F1F5F9', border: '1px solid #E2E8F0', color: '#475569', fontWeight: '900' }}
                onClick={() => setIsAssignTenantOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                style={{ padding: '1rem', borderRadius: '16px', fontWeight: '900' }}
                onClick={() => alert("Redirecting to New Tenant Application...")}
              >
                <PlusCircle size={18} /> New Applicant
              </button>
            </div>
          </div>
        </Modal>

        {/* --- Assignment Confirmation Modal --- */}
        <Modal isOpen={isAssignConfirmOpen} onClose={() => setIsAssignConfirmOpen(false)} title="Confirm Assignment">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ECFDF5', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <UserCheck size={40} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '1000', color: '#0F172A', margin: '0 0 0.5rem 0' }}>Verify Assignment?</h3>
              <p style={{ color: '#64748B', fontWeight: '700', lineHeight: '1.6' }}>
                You are about to assign <span style={{ color: '#0F172A', fontWeight: '900' }}>{assignData.tenant?.name}</span> to
                <span style={{ color: '#0F172A', fontWeight: '900' }}> Bed {assignData.bed?.bedNumber}</span> in
                <span style={{ color: '#0F172A', fontWeight: '900' }}> Room {selectedRoom?.roomNumber}</span>.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '24px', border: '1px solid #E2E8F0', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span style={{ color: '#64748B', fontWeight: '700', fontSize: '0.85rem' }}>Monthly Rent</span>
                <span style={{ fontWeight: '900', color: '#0F172A' }}>Γé╣{assignData.tenant?.rent || 8500}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                <span style={{ color: '#64748B', fontWeight: '700', fontSize: '0.85rem' }}>Security Deposit</span>
                <span style={{ fontWeight: '900', color: '#0F172A' }}>Γé╣{(parseInt(assignData.tenant?.rent?.replace(',', '') || 8500) * 2).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B', fontWeight: '700', fontSize: '0.85rem' }}>Move-in Date</span>
                <span style={{ fontWeight: '900', color: '#6366F1' }}>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
              <button
                className="btn"
                style={{ padding: '1.1rem', borderRadius: '18px', background: "var(--bg-card)", border: '1px solid #E2E8F0', color: '#475569', fontWeight: '950' }}
                onClick={() => setIsAssignConfirmOpen(false)}
              >
                Back
              </button>
              <button
                className="btn btn-primary"
                style={{ padding: '1.1rem', borderRadius: '18px', fontWeight: '950', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.25)' }}
                onClick={async () => {
                  try {
                    // alert(`Successfully assigned ${assignData.tenant.name} to Bed ${assignData.bed.bedNumber}`);
                    setIsAssignConfirmOpen(false);
                    setIsAssignTenantOpen(false);
                    setIsViewBedDetailsOpen(false);
                    setBeds(prev => prev.map(b => (b.id === assignData.bed.id || b._id === assignData.bed.id) ? { ...b, status: 'OCCUPIED', tenant: assignData.tenant } : b));
                  } catch (err) {
                    alert("Failed to assign bed: " + err.message);
                  }
                }}
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </Modal>

        {/* Smart Property Intelligence Drawer removed as per user request */}
        {/* --- Smart Analytics Modal (Legacy, being phased out) --- */}
        <Modal isOpen={isAnalyticsModalOpen} onClose={() => setIsAnalyticsModalOpen(false)} title={`Advanced Analytics - ${analyticsTarget?.name || 'Level ' + analyticsTarget?.floorNumber}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Main KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem' }}>
              {[
                { label: 'Utilization', value: '92.4%', color: '#6366F1', icon: <Activity size={18} /> },
                { label: 'Revenue ROI', value: '+14.2%', color: '#10B981', icon: <TrendingUp size={18} /> },
                { label: 'Churn Rate', value: '1.2%', color: '#EF4444', icon: <UsersRound size={18} /> }
              ].map((kpi, i) => (
                <div key={i} style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                  <div style={{ color: kpi.color, marginBottom: '0.8rem' }}>{kpi.icon}</div>
                  <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '900', color: '#64748B', letterSpacing: '0.05em' }}>{kpi.label.toUpperCase()}</p>
                  <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: '1000', color: '#0F172A' }}>{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Performance Visualization */}
            <div style={{ padding: '2rem', background: '#0F172A', borderRadius: '32px', color: "var(--text-on-primary)" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '900' }}>Operational Efficiency Trends</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6 }}>Last 30 days performance cycle</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['7D', '30D', '90D'].map(t => (
                    <span key={t} style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: t === '30D' ? '#6366F1' : 'rgba(255,255,255,0.1)', fontSize: '0.65rem', fontWeight: '900', cursor: 'pointer' }}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '1rem', padding: '0 1rem' }}>
                {[40, 65, 45, 80, 55, 90, 75, 85, 60, 95].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.1 }}
                    style={{ flex: 1, background: i === 9 ? '#6366F1' : 'rgba(99, 102, 241, 0.3)', borderRadius: '6px 6px 0 0', position: 'relative' }}
                  >
                    {i === 9 && <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', fontWeight: '900' }}>PEAK</div>}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Detailed Breakdown Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', borderRadius: '28px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: '900' }}>Occupancy Distribution</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { label: 'Premium Suites', val: 85, color: '#6366F1' },
                    { label: 'Standard Units', val: 94, color: '#10B981' },
                    { label: 'Budget Zones', val: 78, color: '#F59E0B' }
                  ].map((row, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '800', marginBottom: '0.4rem' }}>
                        <span style={{ color: '#475569' }}>{row.label}</span>
                        <span style={{ color: '#0F172A' }}>{row.val}%</span>
                      </div>
                      <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${row.val}%`, background: row.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '1.5rem', borderRadius: '28px', background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: "var(--text-on-primary)" }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
                  <Sparkles size={18} />
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: '900' }}>AI Forecast</h4>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: '1.6', fontWeight: '700' }}>
                  Demand expected to surge by **18%** next month.
                  Recommended action: **Adjust dynamic pricing** for upper bunk units.
                </p>
                <button style={{ width: '100%', marginTop: '1.5rem', padding: '0.8rem', borderRadius: '14px', background: "var(--bg-card)", color: '#4F46E5', border: 'none', fontWeight: '950', fontSize: '0.8rem', cursor: 'pointer' }}>
                  Optimize ROI Now
                </button>
              </div>
            </div>
          </div>
        </Modal>

        {/* --- Bed History Modal --- */}
        <Modal isOpen={isViewBedHistoryOpen} onClose={() => setIsViewBedHistoryOpen(false)} title={`Operational History - ${viewingBed?.bedNumber}`}>
          {viewingBed && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                padding: '1.5rem',
                background: '#F8FAFC',
                borderRadius: '24px',
                border: '1px solid #F1F5F9'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' }}>Lifetime Occupancy</p>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.6rem', fontWeight: '1000', color: '#0F172A' }}>94% <span style={{ fontSize: '0.9rem', color: '#10B981', verticalAlign: 'middle' }}>Γåæ 4%</span></p>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' }}>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' }}>Maintenance Events</p>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.6rem', fontWeight: '1000', color: '#0F172A' }}>12 <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: '700' }}>Logged</span></p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' }}>Revenue Generated</p>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '1.6rem', fontWeight: '1000', color: '#0F172A' }}>Γé╣1.2L</p>
                </div>
              </div>

              <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                <div style={{ position: 'absolute', left: '7px', top: '0', bottom: '0', width: '2px', background: '#E2E8F0' }} />
                {[
                  { date: '01 May 2026', title: 'Tenant Check-in', desc: 'John Doe assigned to Bed #4. Deposit paid.', icon: <UserCheck size={14} />, color: '#3B82F6' },
                  { date: '28 Apr 2026', title: 'Sanitization & Cleaning', desc: 'Routine hygiene check completed by Staff: Rohit.', icon: <Sparkles size={14} />, color: '#10B981' },
                  { date: '15 Apr 2026', title: 'Maintenance Request', desc: 'USB Port repair completed. Tested and verified.', icon: <Wrench size={14} />, color: '#F59E0B' },
                  { date: '10 Apr 2026', title: 'Previous Tenant Checkout', desc: 'Alice Smith vacated. Full settlement done.', icon: <Clock size={14} />, color: '#64748B' },
                  { date: '01 Mar 2026', title: 'Initial Deployment', desc: 'Bed installed as part of Floor 2 infrastructure.', icon: <BuildingIcon size={14} />, color: '#0F172A' }
                ].map((log, i) => (
                  <div key={i} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                    <div style={{ position: 'absolute', left: '-2rem', top: '4px', width: '16px', height: '16px', borderRadius: '50%', background: 'white', border: `3px solid ${log.color}`, zIndex: 2 }} />
                    <p style={{ margin: '0 0 0.2rem 0', fontSize: '0.75rem', fontWeight: '800', color: '#94A3B8' }}>{log.date}</p>
                    <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '0.9rem', fontWeight: '950', color: '#1E293B' }}>{log.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B', fontWeight: '600' }}>{log.desc}</p>
                  </div>
                ))}
              </div>

              <button style={{ padding: '1rem', borderRadius: '16px', background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', fontWeight: '900', cursor: 'pointer' }}>Download Full Audit Log</button>
            </div>
          )}
        </Modal>

      </div>
    </>
  );
};

// --- Sub Components ---

const RoomHero = ({ room, onImageUpdate, onEdit }) => (
  <div style={{
    width: '100%',
    height: '400px',
    borderRadius: '40px',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: '3.5rem',
    boxShadow: '0 35px 70px -15px rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)'
  }}>
    <motion.div
      initial={{ scale: 1.1 }} animate={{ scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url("${room?.images?.[0] || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1600&q=80'}")`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.4) 50%, transparent 100%)'
      }} />
    </motion.div>

    <div style={{
      position: 'absolute', top: '2rem', right: '2rem',
      display: 'flex', gap: '0.8rem', zIndex: 20
    }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', color: "var(--text-on-primary)", padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ImageIcon size={16} /> Add Pictures
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files.length > 0) {
              Array.from(e.target.files).forEach(file => onImageUpdate(file));
            }
          }}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        />
      </div>
    </div>

    {room?.images && room.images.length > 1 && (
      <div style={{ position: 'absolute', bottom: '15rem', right: '3rem', display: 'flex', gap: '0.5rem', zIndex: 20 }}>
        {room.images.map((img, i) => (
          <div key={i} style={{ width: '60px', height: '60px', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.5)', backgroundImage: `url("${img}")`, backgroundSize: 'cover', backgroundPosition: 'center', cursor: 'pointer' }} />
        ))}
      </div>
    )}

    <div style={{
      position: 'absolute', bottom: '3rem', left: '3rem', right: '3rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      zIndex: 10
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <span style={{ padding: '0.4rem 1rem', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.25)', color: '#A5B4FC', fontSize: '0.8rem', fontWeight: '950', border: '1px solid rgba(99, 102, 241, 0.35)', backdropFilter: 'blur(15px)', letterSpacing: '0.05em' }}>PREMIUM SUITE CONFIG</span>
          {room?.isAC && <span style={{ padding: '0.4rem 1rem', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.25)', color: '#FCD34D', fontSize: '0.8rem', fontWeight: '950', border: '1px solid rgba(245, 158, 11, 0.35)', display: 'flex', alignItems: 'center', gap: '0.4rem', backdropFilter: 'blur(15px)' }}><Zap size={14} fill="#FCD34D" /> AC READY</span>}
        </div>
        <h2 style={{ fontSize: '4.5rem', fontWeight: '1000', color: "var(--text-on-primary)", margin: 0, letterSpacing: '-0.05em', lineHeight: 0.9 }}>Room {room?.roomNumber}</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.25rem', fontWeight: '700', marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UsersRound size={20} /> {room?.occupied || 0}/{room?.capacity} Occupied</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Banknote size={20} /> Γé╣{room?.rentAmount || 0} / mo</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={20} /> {room?.noticePeriod || 30}d Notice</span>
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
          <div style={{ padding: '0.7rem 1.2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: "var(--text-on-primary)", display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: '800' }}>
            <Zap size={18} color={room?.isAC ? '#F59E0B' : '#94A3B8'} fill={room?.isAC ? '#F59E0B' : 'transparent'} /> {room?.isAC ? 'Climate Controlled' : 'Non-AC'}
          </div>
          <div style={{ padding: '0.7rem 1.2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: "var(--text-on-primary)", display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: '800' }}>
            <Layers size={18} color="#A5B4FC" /> {room?.floorType} Flooring
          </div>
          <div style={{ padding: '0.7rem 1.2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: "var(--text-on-primary)", display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: '800' }}>
            <MessageSquareWarning size={18} color="#FCD34D" /> {room?.washroomType} Washroom
          </div>
          {room?.balcony && (
            <div style={{ padding: '0.7rem 1.2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: "var(--text-on-primary)", display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: '800' }}>
              <ImageIcon size={18} color="#10B981" /> Balcony Access
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files[0] && onImageUpdate(e.target.files[0])}
            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 5 }}
          />
          <button className="btn" style={{ padding: '1.2rem', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', color: "var(--text-on-primary)", backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s' }}>
            <ImageIcon size={24} />
          </button>
        </div>
        <button
          onClick={onEdit}
          className="btn"
          style={{ padding: '1.2rem 2.2rem', borderRadius: '22px', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', fontWeight: '950', background: "var(--bg-card)", color: '#0F172A', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', transition: 'all 0.3s' }}
        >
          <Edit2 size={24} /> Edit Features
        </button>
      </div>
    </div>
  </div>
);

const PremiumBuildingCard = ({ building, onSelect, onViewAnalytics, onEditBuilding, onDeleteBuilding }) => {
  const [imgIdx, setImgIdx] = useState(0);

  const images = useMemo(() => {
    if (building.images && building.images.length > 0) {
      return building.images.map(img => (img.startsWith('http') || img.startsWith('data:')) ? img : `https://livora-hostel-hub-1.onrender.com${img}`);
    }
    return [
      'https://images.unsplash.com/photo-1545324418-f1d3c5b53571?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555854817-5b2260d19dca?auto=format&fit=crop&q=80&w=800'
    ];
  }, [building.images]);

  const occupancyRate = building.occupancyPercentage !== undefined ? building.occupancyPercentage : 0;
  const computedRevenue = building.revenueStats?.monthlyRevenue
    ? (building.revenueStats.monthlyRevenue / 100000).toFixed(1) + 'L'
    : (building.totalBeds && building.rentSingle ? ((building.totalBeds * building.rentSingle) / 100000).toFixed(1) + 'L' : '0.0L');
  const hygieneScore = building.healthScores?.hygieneScore || (building.smartConfig?.hasAIHygiene ? 98 : 85);
  const energyEfficiency = building.healthScores?.energyEfficiency || (building.smartConfig?.hasClimateControl ? 92 : 82);

  const stats = {
    floors: building.floors?.length || 4,
    rooms: building.totalRooms || 0,
    beds: building.totalBeds || 0,
    occupied: Math.round(((building.occupancyPercentage || 0) / 100) * (building.totalBeds || 0))
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -15, scale: 1.01 }}
      onClick={() => onSelect(building)}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(30px)',
        borderRadius: '32px',
        padding: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.12)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        cursor: 'pointer',
        overflow: 'hidden',
        minHeight: 'auto',
        maxWidth: '100%'
      }}
    >
      {/* Background Neon Accent */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Header Section */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
              <span style={{
                padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#0F172A', color: "var(--text-on-primary)",
                fontSize: '0.7rem', fontWeight: '950', letterSpacing: '0.05em'
              }}>
                B-ID: {building.id?.slice(-6).toUpperCase()}
              </span>
              <span style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#F0F9FF', color: '#0369A1', fontSize: '0.65rem', fontWeight: '900' }}>
                {building.category?.toUpperCase() || 'PREMIUM'}
              </span>
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: '1000', margin: 0, color: '#0F172A', letterSpacing: '-0.04em' }}>
              {building.name}
            </h3>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.9rem', color: '#64748B', fontWeight: '700' }}>{building.address}</p>
          </div>
        </div>
      </div>

      {/* Hero Visualization */}
      <div style={{
        position: 'relative', height: '140px', borderRadius: '24px', overflow: 'hidden',
        background: '#F1F5F9', border: '1px solid rgba(255,255,255,0.8)', zIndex: 1
      }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={imgIdx}
            initial={{ opacity: 0.8, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            src={images[imgIdx]}
            style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
            alt={building.name || "Building"}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1545324418-f1d3c5b53571?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </AnimatePresence>

        {images.length > 1 && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.8rem', zIndex: 10 }}>
            <button onClick={(e) => { e.stopPropagation(); setImgIdx(prev => (prev - 1 + images.length) % images.length); }} style={{ background: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <ChevronLeft size={22} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setImgIdx(prev => (prev + 1) % images.length); }} style={{ background: 'rgba(255,255,255,0.6)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <ChevronRight size={22} />
            </button>
          </div>
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, transparent 60%)'
        }} />
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '900', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>RESIDENCY</p>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '950', color: "var(--text-on-primary)" }}>{building.genderType}</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.6rem', fontWeight: '900', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em' }}>WARDEN</p>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: '950', color: "var(--text-on-primary)" }}>{building.wardenName || building.staffInfo?.name || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>



      {/* Infrastructure KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem', zIndex: 1 }}>
        {[
          { label: 'WiFi', active: building.amenities?.includes('WiFi'), icon: <Wifi size={14} /> },
          { label: 'Lift', active: building.amenities?.includes('Lift'), icon: <ArrowUp size={14} /> },
          { label: 'Fire', active: building.amenities?.includes('Fire Safety'), icon: <Flame size={14} /> },
          { label: 'Kitchen', active: building.amenities?.includes('Common Kitchen'), icon: <Coffee size={14} /> }
        ].map((kpi, i) => (
          <div key={i} style={{ padding: '0.8rem', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9', textAlign: 'center', opacity: kpi.active ? 1 : 0.5 }}>
            <div style={{ color: kpi.active ? '#6366F1' : '#94A3B8', marginBottom: '0.4rem', display: 'flex', justifyContent: 'center' }}>{kpi.icon}</div>
            <p style={{ margin: 0, fontSize: '0.55rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>{kpi.label}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '950', color: '#1E293B' }}>{kpi.active ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>





      {/* Action Footer */}
      <div style={{
        marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: '0.8rem',
        paddingTop: '1.2rem', borderTop: '1px solid #F1F5F9', zIndex: 1, alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            className="btn"
            onClick={(e) => {
              e.stopPropagation();
              onEditBuilding(building);
            }}
            style={{ padding: '0.9rem', borderRadius: '12px', background: '#F1F5F9', border: 'none', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Edit2 size={16} />
          </button>
          <button
            className="btn"
            onClick={(e) => { e.stopPropagation(); onDeleteBuilding(building.id || building._id); }}
            style={{ padding: '0.9rem', borderRadius: '12px', background: '#FEF2F2', border: 'none', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
        <button
          className="btn btn-primary"
          onClick={(e) => { e.stopPropagation(); onSelect(building); }}
          style={{
            padding: '1.1rem 2rem', borderRadius: '22px', fontWeight: '950', fontSize: '0.85rem', flex: 1,
            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
          }}
        >
          View Floors
        </button>
      </div>
    </motion.div>
  );
};

const BuildingsList = ({ buildings, onSelect, onAdd, onViewAnalytics, onEditBuilding, onDeleteBuilding }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const buildingsPerPage = 6;
  const totalPages = Math.ceil(buildings.length / buildingsPerPage);
  const indexOfLastBuilding = currentPage * buildingsPerPage;
  const indexOfFirstBuilding = indexOfLastBuilding - buildingsPerPage;
  const currentBuildings = buildings.slice(indexOfFirstBuilding, indexOfLastBuilding);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, color: '#0F172A', letterSpacing: '-0.03em' }}>My Buildings</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '600', marginTop: '0.3rem' }}>All buildings registered under your account.</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '3rem' }}>
        {currentBuildings.length > 0 ? currentBuildings.map((b, i) => (
          <PremiumBuildingCard
            key={b._id || b.id || i}
            building={b}
            onSelect={onSelect}
            onViewAnalytics={onViewAnalytics}
            onEditBuilding={onEditBuilding}
            onDeleteBuilding={onDeleteBuilding}
          />
        )) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem 3rem', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(20px)', borderRadius: '40px', border: '2px dashed #E2E8F0' }}>
            <BuildingIcon size={64} color="#94A3B8" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#1E293B', marginBottom: '0.5rem' }}>No Properties Registered</h3>
            <p style={{ color: '#64748B', fontWeight: '700', fontSize: '1.1rem' }}>Register your first smart building to begin administrative oversight.</p>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="btn"
            style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="btn"
            style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const PremiumFloorCard = ({ floor, building, onSelect, onViewAnalytics, onDelete }) => {
  const occupancyRate = floor.occupancyPercentage || 0;
  const totalRooms = floor.totalRooms || 0;
  const totalBeds = floor.totalBeds || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -15, scale: 1.01 }}
      onClick={() => onSelect(floor)}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(30px)',
        borderRadius: '32px',
        padding: '0.8rem',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.12)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        cursor: 'pointer',
        overflow: 'hidden',
        minHeight: 'auto',
        maxWidth: '100%'
      }}
    >
      {/* Background Neon Accent */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px', width: '250px', height: '250px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Header: Visual Identity */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{
                padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#0F172A', color: "var(--text-on-primary)",
                fontSize: '0.7rem', fontWeight: '950', letterSpacing: '0.05em'
              }}>
                LEVEL {floor.floorNumber}
              </span>
              <span style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#ECFDF5', color: '#10B981', fontSize: '0.65rem', fontWeight: '900' }}>
                PREMIUM WING
              </span>
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '1000', margin: 0, color: '#0F172A', letterSpacing: '-0.04em' }}>
              {building?.name} <span style={{ fontWeight: '500', color: '#64748B', fontSize: '1.2rem' }}>ΓÇó {floor.name || `Floor ${floor.floorNumber}`}</span>
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Activity size={24} color="#6366F1" />
          </div>
        </div>
      </div>

      {/* Hero Visualization Area */}
      <div style={{
        position: 'relative', height: '100px', borderRadius: '20px', overflow: 'hidden',
        background: '#F1F5F9', border: '1px solid rgba(255,255,255,0.8)', zIndex: 1
      }}>
        <img
          src={floor.images?.[0] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          alt="Floor"
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 60%)'
        }} />
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '900', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.05em' }}></p>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '950', color: "var(--text-on-primary)" }}></p>
          </div>
          <div style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', color: "var(--text-on-primary)", fontSize: '0.7rem', fontWeight: '900' }}>
            {floor.occupancyPercentage || occupancyRate}% OCCUPIED
          </div>
        </div>
      </div>

      {/* Bento Grid: Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem', zIndex: 1 }}>
        {/* Occupancy Heatmap Bento */}
        <div style={{ padding: '0.8rem', borderRadius: '20px', background: "var(--bg-card)", border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '950', color: '#0F172A' }}>Occupancy Heatmap</span>
            <UsersRound size={16} color="#6366F1" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '0.3rem' }}>
            {Array.from({ length: 12 }).map((_, i) => {
              // Create dynamic heatmap logic based on occupancyPercentage
              const occ = floor.occupancyPercentage || occupancyRate;
              const filledBlocks = Math.round((occ / 100) * 12);
              return <div key={i} style={{ height: '12px', borderRadius: '3px', background: i < filledBlocks ? '#6366F1' : '#F1F5F9' }} />;
            })}
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', gap: '1.5rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '1000', color: '#0F172A' }}>{floor.totalRooms || totalRooms}</p>
              <p style={{ margin: 0, fontSize: '0.55rem', fontWeight: '800', color: '#94A3B8' }}>ROOMS</p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '1000', color: '#0F172A' }}>{floor.totalBeds || totalBeds}</p>
              <p style={{ margin: 0, fontSize: '0.55rem', fontWeight: '800', color: '#94A3B8' }}>TOTAL BEDS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Infrastructure KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', zIndex: 1 }}>
        {[
          { label: 'Washrooms', value: `${floor.washroomsCount !== undefined ? floor.washroomsCount : 0}`, icon: <Droplets size={12} /> },
          { label: 'Water Pts', value: `${floor.waterPoints || 0}`, icon: <Waves size={12} /> },
          { label: 'Laundry', value: `${floor.washingMachines || 0}`, icon: <Layers size={12} /> },
          { label: 'Fridges', value: `${floor.fridges || 0}`, icon: <Coffee size={12} /> }
        ].map((kpi, i) => (
          <div key={i} style={{ padding: '0.6rem', background: '#F8FAFC', borderRadius: '14px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
            <div style={{ color: '#6366F1', marginBottom: '0.2rem', display: 'flex', justifyContent: 'center' }}>{kpi.icon}</div>
            <p style={{ margin: 0, fontSize: '0.5rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>{kpi.label}</p>
            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '950', color: '#1E293B' }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Access Facilities */}
      <div style={{ zIndex: 1 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '950', color: '#0F172A', marginBottom: '0.8rem' }}>SPACES & FACILITIES</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {floor.hasStudyArea && <span style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.7rem', fontWeight: '800', color: '#475569' }}>Study Area</span>}
          {floor.hasLoungeArea && <span style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.7rem', fontWeight: '800', color: '#475569' }}>Lounge Area</span>}
          {floor.hasBalcony && <span style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.7rem', fontWeight: '800', color: '#475569' }}>Balcony</span>}
          {floor.hasWaitingArea && <span style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.7rem', fontWeight: '800', color: '#475569' }}>Waiting Area</span>}
          {(!floor.hasStudyArea && !floor.hasLoungeArea && !floor.hasBalcony && !floor.hasWaitingArea) && <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: '700' }}>No facilities listed</span>}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{
        marginTop: 'auto', display: 'grid', gridTemplateColumns: '60px 1fr', gap: '0.8rem',
        paddingTop: '1.2rem', borderTop: '1px solid #F1F5F9', zIndex: 1
      }}>
        <button
          className="btn"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{
            padding: '1rem', borderRadius: '18px', background: '#FEF2F2', color: '#EF4444',
            fontWeight: '950', fontSize: '0.85rem', border: '1px solid #FEE2E2',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <Trash2 size={18} />
        </button>
        <button
          className="btn btn-primary"
          onClick={(e) => { e.stopPropagation(); onSelect(floor); }}
          style={{
            padding: '1rem', borderRadius: '20px', fontWeight: '950', fontSize: '0.85rem',
            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
          }}
        >
          View Rooms
        </button>
      </div>
    </motion.div>
  );
};

const FloorsList = ({ floors, building, onSelect, onBack, onAdd, onDelete, onViewAnalytics }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <motion.button whileHover={{ x: -5 }} onClick={onBack} style={{ width: '45px', height: '45px', borderRadius: '15px', background: "var(--bg-card)", border: '1px solid var(--border-color)', color: '#0F172A', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}><ArrowLeft size={24} /></motion.button>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '1000', margin: 0, letterSpacing: '-0.04em', color: '#0F172A' }}>Floors Management</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '700' }}>{building?.name} ΓÇó Infrastructure Overview</p>
        </div>
      </div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '2.5rem' }}>
      {floors.length > 0 ? floors.map((f, i) => (
        <PremiumFloorCard
          key={f._id || f.id || i}
          floor={f}
          building={building}
          onSelect={onSelect}
          onViewAnalytics={onViewAnalytics}
          onDelete={() => onDelete(f.id || f._id)}
        />
      )) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '2px dashed var(--border-color)' }}>
          <Layers size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No floors found in this building.</p>
        </div>
      )}
    </div>
  </div>
);

const RoomsList = ({ rooms, floor, building, onSelect, onBack, onAdd, onEdit, onDelete, onViewDetails }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const roomsPerPage = 6;
  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '1000', margin: 0, letterSpacing: '-0.04em', color: '#0F172A' }}>Rooms on Floor {floor?.floorNumber}</h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '700' }}>{building?.name || 'Property'} ΓÇó Advanced Inventory Management</p>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
        {currentRooms.length > 0 ? currentRooms.map((r, i) => (
          <PremiumRoomCard
            key={r._id || r.id || i}
            room={r}
            floor={floor}
            onSelect={onSelect}
            onViewDetails={onViewDetails}
            onEdit={() => onEdit(r)}
            onDelete={() => onDelete(r.id || r._id)}
          />
        )) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '2px dashed var(--border-color)' }}>
            <DoorOpen size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
            <p style={{ color: 'var(--text-secondary)' }}>No rooms found on this floor.</p>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="btn"
            style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="btn"
            style={{ padding: '0.6rem 1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const PremiumRoomCard = ({ room, floor, onSelect, onViewDetails, onEdit, onDelete }) => {
  const occupancyRate = Math.round(((room.occupied || 0) / room.capacity) * 100);
  const isHighDemand = occupancyRate > 80;

  const statusColors = {
    Available: '#10B981',
    Occupied: '#3B82F6',
    Full: '#EF4444',
    Maintenance: '#F59E0B'
  };

  const activeStatus = room.occupied === room.capacity ? 'Full' : (room.occupied > 0 ? 'Occupied' : 'Available');
  const themeColor = statusColors[activeStatus];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -15, scale: 1.01 }}
      onClick={() => onSelect(room)}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(30px)',
        borderRadius: '32px',
        padding: '0.8rem',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.12)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        cursor: 'pointer',
        overflow: 'hidden',
        minHeight: 'auto',
        maxWidth: '100%'
      }}
    >
      {/* Dynamic Background Glow */}
      <div style={{
        position: 'absolute', top: '-150px', right: '-150px', width: '300px', height: '300px',
        background: `radial-gradient(circle, ${themeColor}15 0%, transparent 70%)`,
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Header: Visual Identity */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{
                padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#0F172A', color: "var(--text-on-primary)",
                fontSize: '0.7rem', fontWeight: '950', letterSpacing: '0.05em'
              }}>
                ROOM {room.roomNumber}
              </span>
              {isHighDemand && (
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: '12px', background: '#FEF2F2', color: '#EF4444', fontSize: '0.6rem', fontWeight: '900', border: '1px solid #FEE2E2' }}
                >
                  HIGH DEMAND
                </motion.span>
              )}
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '1000', margin: 0, color: '#0F172A', letterSpacing: '-0.04em' }}>
              Suite
            </h3>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: '900', color: '#64748B', letterSpacing: '0.05em' }}></p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '1000', color: themeColor }}></p>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div style={{
        position: 'relative', height: '80px', borderRadius: '16px', overflow: 'hidden',
        background: '#F1F5F9', border: '1px solid rgba(255,255,255,0.8)', zIndex: 1
      }}>
        <img
          src={room.images?.[0] || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          alt="Room"
        />
        <div style={{
          position: 'absolute', bottom: '1.2rem', left: '1.2rem',
          display: 'flex', gap: '0.5rem'
        }}>
          {room.isAC && (
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(10px)', color: "var(--text-on-primary)", borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '800' }}>
              <Zap size={14} color="#F59E0B" /> Smart AC
            </div>
          )}
          <div style={{ padding: '0.5rem 1rem', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', color: '#0F172A', borderRadius: '14px', fontSize: '0.75rem', fontWeight: '900' }}>
            Level {floor?.floorNumber || room.floorNumber || 1}
          </div>
        </div>
      </div>

      {/* Bento Section: Occupancy */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.8rem', zIndex: 1 }}>
        {/* Occupancy Bento */}
        <div style={{ padding: '0.8rem', borderRadius: '16px', background: "var(--bg-card)", border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '950', color: '#0F172A' }}>Occupancy</span>
              <UsersRound size={18} color={themeColor} />
            </div>
            <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${occupancyRate}%` }}
                style={{ height: '100%', background: themeColor }}
              />
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: '800', color: '#64748B' }}>
              {room.occupied} of {room.capacity} beds deployed
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            {Array.from({ length: room.capacity }).map((_, i) => (
              <div key={i} style={{ width: '12px', height: '12px', borderRadius: '4px', background: i < room.occupied ? themeColor : '#F1F5F9' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Specifications Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem', zIndex: 1 }}>
        {[
          { label: 'Attached Bath', value: room.attachedBathroom ? 'Yes' : 'No', icon: <Droplets size={14} /> },
          { label: 'Room Size', value: room.roomSize || 'N/A', icon: <Maximize size={14} /> },
          { label: 'Balcony', value: room.balcony ? 'Yes' : 'No', icon: <ShieldCheck size={14} /> }
        ].map((spec, i) => (
          <div key={i} style={{ padding: '0.6rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
            <div style={{ color: '#6366F1', marginBottom: '0.3rem' }}>{spec.icon}</div>
            <p style={{ margin: 0, fontSize: '0.55rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>{spec.label}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: '950', color: '#1E293B' }}>{spec.value}</p>
          </div>
        ))}
      </div>

      {/* Appliances & Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', zIndex: 1 }}>
        {[
          { label: 'Fans', value: room.fanCount || 0, icon: <Fan size={12} /> },
          { label: 'Chairs', value: room.chairCount || 0, icon: <LayoutGrid size={12} /> },
          { label: 'Geyser', value: room.hasGeyser ? 'Yes' : 'No', icon: <Droplets size={12} /> },
          { label: 'TV', value: room.hasTV ? 'Yes' : 'No', icon: <Monitor size={12} /> }
        ].map((kpi, i) => (
          <div key={i} style={{ padding: '0.5rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #F1F5F9', textAlign: 'center' }}>
            <div style={{ color: '#6366F1', marginBottom: '0.2rem', display: 'flex', justifyContent: 'center' }}>{kpi.icon}</div>
            <p style={{ margin: 0, fontSize: '0.5rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase' }}>{kpi.label}</p>
            <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: '950', color: '#1E293B' }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Amenities Section */}
      <div style={{ zIndex: 1 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '950', color: '#0F172A', marginBottom: '0.6rem' }}>AMENITIES</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {room.hasStudyTable && <span style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: '800', color: '#475569' }}>Study Table</span>}
          {room.hasWardrobe && <span style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: '800', color: '#475569' }}>Wardrobe</span>}
          {room.hasMirror && <span style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: '800', color: '#475569' }}>Mirror</span>}
          {room.hasRefrigerator && <span style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: '800', color: '#475569' }}>Fridge</span>}
          {room.hasMicrowave && <span style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: '800', color: '#475569' }}>Microwave</span>}
          {room.hasWiFi && <span style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: '800', color: '#475569' }}>WiFi</span>}
        </div>
      </div>

      {/* Action Footer */}
      <div style={{
        marginTop: 'auto', display: 'flex', justifyContent: 'space-between', gap: '0.6rem',
        paddingTop: '0.8rem', borderTop: '1px solid #F1F5F9', zIndex: 1, alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            className="btn"
            onClick={(e) => {
              e.stopPropagation();
              const text = encodeURIComponent(`Check out Room ${room.roomNumber} (${room.roomType}) at our property!\nRent: ₹${room.rentAmount}/month\nCapacity: ${room.capacity} Beds\nContact us for booking!`);
              window.open(`https://wa.me/?text=${text}`, '_blank');
            }}
            style={{ padding: '0.9rem', borderRadius: '12px', background: '#DCFCE7', border: 'none', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Share to WhatsApp"
          >
            <Smartphone size={16} />
          </button>
          <button
            className="btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            style={{ padding: '0.9rem', borderRadius: '12px', background: '#F1F5F9', border: 'none', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Edit2 size={16} />
          </button>
          <button
            className="btn"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            style={{ padding: '0.9rem', borderRadius: '12px', background: '#FEF2F2', border: 'none', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Trash2 size={16} />
          </button>
        </div>
        <button
          className="btn btn-primary"
          onClick={(e) => { e.stopPropagation(); onSelect(room); }}
          style={{
            padding: '1.1rem 2rem', borderRadius: '22px', fontWeight: '950', fontSize: '0.85rem', flex: 1,
            boxShadow: `0 10px 20px ${themeColor}30`
          }}
        >
          Manage Beds
        </button>
      </div>
    </motion.div>
  );
};

const SmartBedCard = ({ bed, floor, onEdit, onViewDetails, onViewHistory, onAssign, onDelete }) => {
  const isAvailable = bed.status === 'Vacant';
  const isOccupied = bed.status === 'Occupied';
  const isMaintenance = bed.status === 'Maintenance';



  const getStatusColor = () => {
    if (isAvailable) return '#10B981';
    if (isOccupied) return '#3B82F6';
    return '#EF4444';
  };

  const statusGlow = {
    boxShadow: `0 0 20px ${getStatusColor()}40`,
    border: `1px solid ${getStatusColor()}30`
  };

  return (
    <motion.div
      layout
      whileHover={{ y: -12, cursor: 'pointer' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={() => onViewDetails(bed)}
      className="smart-card"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '32px',
        padding: '1.2rem',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflow: 'hidden',
        minWidth: '280px',
        transition: 'all 0.3s ease-out',
        backfaceVisibility: 'hidden',
        WebkitFontSmoothing: 'antialiased'
      }}
    >
      {/* Background Neon Accent */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '200px',
        height: '200px',
        background: `radial-gradient(circle, ${getStatusColor()}15 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${getStatusColor()}20, ${getStatusColor()}40)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: getStatusColor(),
            ...statusGlow
          }}>
            <BedDouble size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '1000', margin: 0, color: '#0F172A', letterSpacing: '-0.03em' }}>{bed.bedNumber}</h3>
              {isAvailable && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}
                />
              )}
            </div>
            <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {bed.bedSize || 'Standard'} Size ΓÇó {bed.isWindowSide ? 'Window Side' : bed.isCorner ? 'Corner' : bed.isMiddle ? 'Middle' : 'Standard'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
          <span
            className="status-pill"
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '12px',
              fontSize: '0.65rem',
              fontWeight: '950',
              background: isAvailable ? '#ECFDF5' : isOccupied ? '#EFF6FF' : '#FEF2F2',
              color: getStatusColor(),
              border: `1px solid ${getStatusColor()}20`,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              cursor: 'default'
            }}
          >
            {isAvailable ? <Sparkles size={12} /> : isOccupied ? <UserCheck size={12} /> : <Wrench size={12} />}
            {bed.status}
          </span>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button
              onClick={() => onEdit(bed)}
              style={{
                width: '32px', height: '32px', borderRadius: '10px', background: "var(--bg-card)",
                border: '1px solid #E2E8F0', color: '#64748B', display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Edit2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Section */}
      <div style={{ position: 'relative', height: '160px', borderRadius: '24px', overflow: 'hidden' }}>
        <img
          src={bed.images?.[0] || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'}
          alt="Bed"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)'
        }} />

        {/* AI Insight Badge */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(12px)',
          padding: '0.4rem 0.8rem',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: "var(--text-on-primary)",
          fontSize: '0.7rem',
          fontWeight: '800'
        }}>
          <Sparkles size={14} color="#FCD34D" fill="#FCD34D" />
          AI RECOMMENDED
        </div>
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          padding: '0.4rem 0.8rem',
          borderRadius: '10px',
          color: "var(--text-on-primary)",
          fontSize: '0.65rem',
          fontWeight: '900',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          FLOOR {floor?.floorNumber || '01'}
        </div>
      </div>

      {/* Bento Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
        {/* Specifications */}
        <div className="bento-item" style={{
          background: 'rgba(248, 250, 252, 0.8)',
          padding: '1rem',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
          transition: 'all 0.3s ease'
        }}>
          <h4 style={{ fontSize: '0.65rem', fontWeight: '900', color: '#94A3B8', margin: 0, letterSpacing: '0.05em' }}>SPECS</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
            {[
              { label: 'Status', value: bed.status, icon: <Sparkles size={14} /> }
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ color: '#6366F1' }}>{s.icon}</div>
                <div style={{ lineHeight: 1 }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>{s.value}</p>
                  <p style={{ fontSize: '0.55rem', color: '#64748B', margin: 0, fontWeight: '700' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bento-item" style={{
          background: 'rgba(248, 250, 252, 0.8)',
          padding: '1rem',
          borderRadius: '20px',
          transition: 'all 0.3s ease'
        }}>
          <h4 style={{ fontSize: '0.65rem', fontWeight: '900', color: '#94A3B8', margin: '0 0 0.8rem 0', letterSpacing: '0.05em' }}>FEATURES</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {bed.hasMattress && <span style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: '800', color: '#475569' }}>Mattress</span>}
            {bed.hasPillow && <span style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: '800', color: '#475569' }}>Pillow</span>}
            {bed.hasLocker && <span style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: '800', color: '#475569' }}>Locker</span>}
            {bed.readingLight && <span style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: '800', color: '#475569' }}>Reading Lamp</span>}
            {bed.chargingPoint && <span style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: "var(--bg-card)", border: '1px solid #E2E8F0', fontSize: '0.65rem', fontWeight: '800', color: '#475569' }}>Charging Point</span>}
            {!bed.hasMattress && !bed.hasPillow && !bed.hasLocker && !bed.readingLight && !bed.chargingPoint && <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: '700' }}>Standard</span>}
          </div>
        </div>
      </div>

      {/* Tenant Section (If occupied) */}
      {(bed.tenant || bed.occupantDetails?.name) && (
        <div style={{
          marginTop: '0.4rem',
          padding: '0.8rem',
          borderRadius: '20px',
          background: 'rgba(15, 23, 42, 0.03)',
          border: '1px dashed #CBD5E1',
          display: 'flex',
          alignItems: 'center',
          gap: '0.8rem'
        }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6366F1', color: "var(--text-on-primary)", display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '900' }}>
            {bed.occupantDetails?.name ? bed.occupantDetails.name[0] : (typeof bed.tenant === 'object' ? bed.tenant.name?.[0] : bed.tenant?.[0])}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: '900', color: '#1E293B', margin: 0, textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {bed.occupantDetails?.name || (typeof bed.tenant === 'object' ? bed.tenant.name : bed.tenant)}
            </p>
            <p style={{ fontSize: '0.65rem', color: '#64748B', margin: 0, fontWeight: '700' }}>Verified Tenant</p>
          </div>
          <div style={{ color: '#10B981' }}><ShieldCheck size={18} /></div>
        </div>
      )}

      {/* Footer Actions */}
      <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto' }}>
        {(isAvailable || isOccupied) && (
          <motion.button
            whileHover={{ scale: 1.05, background: isOccupied ? '#2563EB' : '#059669' }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onAssign(bed); }}
            style={{
              flex: 1,
              padding: '0.8rem',
              borderRadius: '14px',
              background: isOccupied ? '#3B82F6' : '#10B981',
              color: "var(--text-on-primary)",
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: '950',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              boxShadow: isOccupied ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' : '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
            }}
          >
            <UserCheck size={16} /> {isOccupied ? 'Reassign' : 'Assign'}
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.1, background: '#FEF2F2' }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '14px',
            background: '#FFF1F2',
            border: 'none',
            color: '#EF4444',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Trash2 size={18} />
        </motion.button>
      </div>
    </motion.div>
  );
};

const BedsList = ({ beds, room, floor, building, onBack, onAdd, onEditBed, onViewDetails, onViewHistory, onAssignTenant, onDelete }) => {
  const [activeFilter, setActiveFilter] = useState('All Beds');

  const filteredBeds = beds.filter(b => {
    if (activeFilter === 'All Beds') return true;
    if (activeFilter === 'Vacant') return b.status === 'Vacant';
    if (activeFilter === 'Occupied') return b.status === 'Occupied';
    if (activeFilter === 'Reserved') return b.status === 'Reserved';
    if (activeFilter === 'Blocked') return b.status === 'Blocked';
    if (activeFilter === 'Maintenance') return b.status === 'Maintenance';
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <motion.button
            whileHover={{ x: -5 }}
            onClick={onBack}
            style={{
              width: '45px', height: '45px', borderRadius: '15px',
              background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              color: 'var(--text-primary)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <ArrowLeft size={24} />
          </motion.button>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: '1000', margin: 0, letterSpacing: '-0.04em', color: '#0F172A' }}>Room {room?.roomNumber}</h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: '700' }}>{building?.name} ΓÇó Floor {floor?.floorNumber || 'N/A'} ΓÇó Smart Bed Management</p>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={onAdd}
          disabled={beds.length >= (room?.capacity || Infinity)}
          style={{
            padding: '0.8rem 1.8rem', borderRadius: '16px', fontWeight: '950', fontSize: '1rem',
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
            opacity: beds.length >= (room?.capacity || Infinity) ? 0.5 : 1,
            cursor: beds.length >= (room?.capacity || Infinity) ? 'not-allowed' : 'pointer'
          }}
        >
          <PlusCircle size={22} /> {beds.length >= (room?.capacity || Infinity) ? 'Room at Capacity' : 'Deploy New Bed'}
        </button>
      </div>

      {/* Filter Chips Bar */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
        {['All Beds', 'Vacant', 'Occupied', 'Reserved', 'Blocked', 'Maintenance'].map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: '0.7rem 1.4rem',
              borderRadius: '16px',
              background: activeFilter === f ? '#0F172A' : 'white',
              color: activeFilter === f ? 'white' : '#475569',
              border: '1px solid #E2E8F0',
              fontSize: '0.85rem',
              fontWeight: '950',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeFilter === f ? '0 10px 15px -3px rgba(15, 23, 42, 0.2)' : 'none'
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '2rem'
      }}>
        {filteredBeds.length > 0 ? filteredBeds.map(b => (
          <SmartBedCard
            key={b.id}
            bed={b}
            floor={floor}
            onEdit={onEditBed}
            onViewDetails={onViewDetails}
            onViewHistory={onViewHistory}
            onAssign={onAssignTenant}
            onDelete={() => handleDeleteBed(b.id || b._id)}
          />
        )) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)', borderRadius: '32px', border: '2px dashed #E2E8F0' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
              <Bed size={40} color="#94A3B8" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1E293B', marginBottom: '0.5rem' }}>No Beds Configured</h3>
            <p style={{ color: '#64748B', fontWeight: '700' }}>Deploy your first smart bed to this room to begin management.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const AssignFloors = ({ buildings, onBack }) => {
  const [hostels, setHostels] = useState([]);
  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [floors, setFloors] = useState([]);
  const [assignedFloors, setAssignedFloors] = useState(new Set());

  useEffect(() => {
    api.getHostels().then(setHostels);
  }, []);

  useEffect(() => {
    if (selectedBuilding) {
      api.getFloors(selectedBuilding).then(setFloors);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFloors([]);
    }
  }, [selectedBuilding]);

  useEffect(() => {
    if (selectedHostel) {
      api.getAssignedFloors(selectedHostel).then(fIds => setAssignedFloors(new Set(fIds || [])));
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAssignedFloors(new Set());
    }
  }, [selectedHostel]);

  const toggleFloor = (floorId) => {
    const newSet = new Set(assignedFloors);
    if (newSet.has(floorId)) newSet.delete(floorId);
    else newSet.add(floorId);
    setAssignedFloors(newSet);
  };

  const handleSave = () => {
    alert("Saved assignments: " + Array.from(assignedFloors).join(', '));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Assign Floors to Hostel</h2>
      </div>

      <div className="card" style={{ padding: '2rem', maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Select Hostel</label>
            <select value={selectedHostel} onChange={e => setSelectedHostel(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
              <option value="">-- Choose a Hostel --</option>
              {hostels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Select Building</label>
            <select value={selectedBuilding} onChange={e => setSelectedBuilding(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
              <option value="">-- Choose a Building --</option>
              {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>

        {selectedHostel && selectedBuilding && (
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>Available Floors</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {floors.map(f => (
                <div key={f.id} onClick={() => toggleFloor(f.id)} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '8px', background: assignedFloors.has(f.id) ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-tertiary)', border: `1px solid ${assignedFloors.has(f.id) ? 'var(--accent-primary)' : 'var(--border-color)'}`, cursor: 'pointer', transition: 'all 0.2s' }}>
                  {assignedFloors.has(f.id) ? <CheckSquare color="var(--accent-primary)" /> : <Square color="var(--text-secondary)" />}
                  <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>Floor {f.floorNumber}</span>
                </div>
              ))}
              {floors.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No floors available in this building.</p>}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={floors.length === 0}>Save Assignments</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buildings;
