import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Building as BuildingIcon, Layers, DoorOpen, Bed, PlusCircle, UsersRound, Banknote, Clock, MessageSquareWarning,
  ArrowLeft, CheckSquare, Square, Trash2, Edit2, Zap, X, Image as ImageIcon, BedDouble, Filter, ChevronRight, Search,
  MapPin, ShieldCheck
} from 'lucide-react';

import { api } from '../mockData';

// Full-Screen Professional Modal Component
const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'var(--bg-primary)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1.5rem 2.5rem',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'var(--bg-secondary)',
          flexShrink: 0
        }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '950', letterSpacing: '-0.04em', color: 'var(--text-primary)', margin: 0 }}>{title}</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0', fontWeight: '700' }}>Configure details for your property infrastructure</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
              cursor: 'pointer', width: '45px', height: '45px', borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', border: '1px solid var(--border-color)'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '4rem 2.5rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '800px' }}>
            {children}
          </div>
        </div>

        {/* Modal Footer (Hint) */}
        <div style={{ padding: '1.2rem 2.5rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', textAlign: 'center' }}>
          Press Esc or click the close button to discard changes
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

const INITIAL_FORM_STATE = {
  name: '', address: '', number: '', type: 'Single',
  capacity: 1, status: 'AVAILABLE', imageUrl: '',
  isAC: false, washroomType: 'Attached', balcony: false, facing: 'Road',
  position: 'Standard', bedType: 'Single', floorType: 'Tiles', windowCount: 1,
  furniture: [], amenities: [],
  rentAmount: 8000, securityDeposit: 16000, noticePeriod: 30, description: ''
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

  // Form states
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);

  const [loading, setLoading] = useState(false);

  const fetchBuildings = async () => {
    setLoading(true);
    console.log("Buildings module fetching for ID:", activeBuildingId);
    try {
      const bData = await api.getBuildings(activeBuildingId);
      const safeData = Array.isArray(bData) ? bData : [];
      if (activeBuildingId) {
        const filtered = safeData.filter(b => b.id === activeBuildingId || b._id === activeBuildingId);
        setBuildings(filtered);
        if (filtered.length > 0) setSelectedBuilding(filtered[0]);
      } else {
        setBuildings(safeData);
      }
    } catch (err) {
      console.error("Fetch error in Buildings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, [activeBuildingId]);

  const handleSelectBuilding = async (b) => {
    setSelectedBuilding(b);
    try {
      const data = await api.getFloors(b.id);
      setFloors(data || []);
      setView('floors');
    } catch (err) {
      console.error(err);
    }
  };



  const handleSelectFloor = async (f) => {
    setSelectedFloor(f);
    try {
      const data = await api.getRooms(f.id);
      setRooms(data || []);
      setView('rooms');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectRoom = async (r) => {
    setSelectedRoom(r);
    setView('beds'); // Move this up so user sees transition immediately
    try {
      const data = await api.getBeds(r.id || r._id);
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
      imageUrl: r.images?.[0] || ''
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
        washroomType: formData.washroomType,
        balcony: formData.balcony,
        facing: formData.facing,
        floorType: formData.floorType,
        windowCount: formData.windowCount,
        furniture: formData.furniture
      });
      setSelectedRoom(updated);
      setRooms(prev => prev.map(r => (r.id === updated.id || r._id === updated._id) ? updated : r));
      setIsEditRoomOpen(false);
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
      imageUrl: b.images?.[0] || ''
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
        bedType: formData.bedType
      });
      // Update beds list
      setBeds(prev => prev.map(b => (b.id === updated.id || b._id === updated._id) ? updated : b));
      setIsEditBedOpen(false);
    } catch (err) {
      alert("Failed to update bed: " + (err.response?.data?.error || err.message));
    }
  };

  // --- HELPER: Image Upload ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
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
      <button onClick={() => setView('buildings')} style={{ background: 'none', border: 'none', color: view === 'buildings' ? 'var(--accent-primary)' : 'inherit', cursor: 'pointer', fontWeight: '900' }}>Infrastructure</button>
      {selectedBuilding && (
        <>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <button onClick={() => setView('floors')} style={{ background: 'none', border: 'none', color: view === 'floors' ? 'var(--accent-primary)' : 'inherit', cursor: 'pointer', fontWeight: '900' }}>{selectedBuilding.name}</button>
        </>
      )}
      {selectedFloor && (view === 'rooms' || view === 'beds') && (
        <>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <button onClick={() => setView('rooms')} style={{ background: 'none', border: 'none', color: view === 'rooms' ? 'var(--accent-primary)' : 'inherit', cursor: 'pointer', fontWeight: '900' }}>Floor {selectedFloor.floorNumber}</button>
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
        images: formData.imageUrl ? [formData.imageUrl] : []
      });
      setBuildings([...buildings, newB]);
      setIsAddBuildingOpen(false);
      setFormData(INITIAL_FORM_STATE);
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
        images: formData.imageUrl ? [formData.imageUrl] : []
      });
      setFloors([...floors, newF]);
      setIsAddFloorOpen(false);
      setFormData(INITIAL_FORM_STATE);
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
        isAC: formData.isAC,
        washroomType: formData.washroomType,
        balcony: formData.balcony,
        facing: formData.facing,
        floorType: formData.floorType,
        windowCount: formData.windowCount,
        furniture: formData.furniture,
        images: formData.imageUrl ? [formData.imageUrl] : []
      });
      setRooms([...rooms, newR]);
      setIsAddRoomOpen(false);
      setFormData(INITIAL_FORM_STATE);
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
        images: formData.imageUrl ? [formData.imageUrl] : []
      });
      setBeds([...beds, newB]);
      setIsAddBedOpen(false);
      setFormData(INITIAL_FORM_STATE);
    } catch (err) {
      alert("Failed to add bed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
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
          <button onClick={() => window.history.back()} className="btn" style={{ padding: '0.7rem', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>
      </header>

      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
          style={{ overflow: 'hidden', marginBottom: '2rem', background: 'var(--bg-tertiary)', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <span style={{ fontSize: '0.8rem', fontWeight: '950', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Smart Filters:</span>
          {(view === 'buildings' ? ['All', 'AC', 'Non-AC', 'High Occupancy', 'Premium'] : 
            view === 'rooms' ? ['All', 'AC', 'Non-AC', 'Vacant', 'Suite', 'Shared'] :
            view === 'beds' ? ['All', 'Available', 'Occupied', 'Window Side', 'Study Friendly', 'With Locker'] : 
            ['All', 'AC', 'Non-AC']).map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              style={{
                padding: '0.5rem 1.2rem', borderRadius: '10px', border: '1px solid var(--border-color)',
                background: filterType === f ? 'var(--accent-primary)' : 'var(--bg-primary)',
                color: filterType === f ? 'white' : 'var(--text-primary)',
                fontWeight: '800', fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s'
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
            <div key={i} className="card" style={{ height: '350px', background: 'var(--bg-secondary)', position: 'relative', overflow: 'hidden', borderRadius: '24px' }}>
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
                buildings={buildings.filter(b => {
                  const matchesSearch = ((b?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (b?.address || '').toLowerCase().includes(searchQuery.toLowerCase()));
                  if (!matchesSearch) return false;
                  
                  if (filterType === 'All') return true;
                  if (filterType === 'AC') return b.isAC;
                  if (filterType === 'Non-AC') return !b.isAC;
                  if (filterType === 'High Occupancy') return (b.occupancyRate || 0) > 80;
                  if (filterType === 'Premium') return (b.rating || 0) >= 4.5;
                  return true;
                })}
                onSelect={handleSelectBuilding}
                onAdd={() => setIsAddBuildingOpen(true)}
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
              />
            </motion.div>
          )}
          {view === 'rooms' && (
            <motion.div key="rooms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <RoomsList
                rooms={rooms.filter(r => {
                  const matchesSearch = ((r?.roomNumber?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase()) || (r?.floorType || '').toLowerCase().includes(searchQuery.toLowerCase()));
                  if (!matchesSearch) return false;

                  if (filterType === 'All') return true;
                  if (filterType === 'AC') return r.isAC;
                  if (filterType === 'Non-AC') return !r.isAC;
                  if (filterType === 'Vacant') return (r.occupied || 0) < r.capacity;
                  if (filterType === 'Suite') return r.roomType === 'Single';
                  if (filterType === 'Shared') return r.roomType === 'Shared' || r.roomType === 'Dormitory';
                  return true;
                })}
                floor={selectedFloor}
                onSelect={handleSelectRoom}
                onBack={() => setView('floors')}
                onAdd={() => setIsAddRoomOpen(true)}
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
                beds={beds.filter(b => {
                  const matchesSearch = (b?.bedNumber?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase());
                  if (!matchesSearch) return false;

                  if (filterType === 'All') return true;
                  if (filterType === 'Available') return b.status === 'AVAILABLE';
                  if (filterType === 'Occupied') return b.status === 'OCCUPIED';
                  if (filterType === 'Window Side') return b.position === 'Window side';
                  if (filterType === 'Study Friendly') return true; // Mocked
                  if (filterType === 'With Locker') return true; // Mocked
                  return true;
                })}
                room={selectedRoom}
                onBack={() => setView('rooms')}
                onAdd={() => setIsAddBedOpen(true)}
                onEditBed={handleOpenEditBed}
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

      <Modal isOpen={isAddBuildingOpen} onClose={() => setIsAddBuildingOpen(false)} title="Add New Building">
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleAddBuilding}>
          <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>BUILDING NAME</label><input placeholder="Royal residency" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={inputStyle} required /></div>
          <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>ADDRESS</label><input placeholder="123 tech street" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} style={inputStyle} required /></div>
          <div className="input-group">
            <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>BUILDING IMAGE</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
              <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)', minHeight: '60px' }}>
                <ImageIcon size={22} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.95rem', color: formData.imageUrl ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '800' }}>
                  {formData.imageUrl ? 'Photo Selected' : 'Choose Building Photo'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>GENDER TYPE</label>
              <select value={formData.genderType} onChange={e => setFormData({ ...formData, genderType: e.target.value })} style={inputStyle}>
                <option value="Mixed">Mixed</option>
                <option value="Boys">Boys Only</option>
                <option value="Girls">Girls Only</option>
              </select>
            </div>
            <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>CATEGORY</label>
              <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} style={inputStyle}>
                <option value="Mixed">Mixed</option>
                <option value="Student">Student</option>
                <option value="Professional">Professional</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>AMENITIES</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginTop: '0.5rem' }}>
              {['Wi-Fi', 'CCTV', 'Power Backup', 'Laundry', 'Parking', 'Kitchen', 'Gym'].map(a => (
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1.2rem', borderRadius: '18px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({ ...formData, isAC: !formData.isAC })}>
            <div style={{ width: '24px', height: '24px', border: '2px solid var(--accent-primary)', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.isAC ? 'var(--accent-primary)' : 'transparent', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
              {formData.isAC && <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '2px' }} />}
            </div>
            <span style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-primary)' }}>Full Centralized AC</span>
          </div>
          <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '1rem', fontSize: '1.1rem', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}>Create Property</button>
        </form>
      </Modal>

      <Modal isOpen={isAddFloorOpen} onClose={() => setIsAddFloorOpen(false)} title={`Add Floor to ${selectedBuilding?.name}`}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleAddFloor}>
          <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>FLOOR NUMBER</label><input placeholder="e.g. G, 1, 2" value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} style={inputStyle} required /></div>
          <div className="input-group"><label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>DESCRIPTION</label><textarea placeholder="e.g. Common Area, Library, etc." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} style={{ ...inputStyle, minHeight: '80px', paddingTop: '0.8rem' }} /></div>
          <div className="input-group">
            <label style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--text-muted)' }}>FLOOR LAYOUT PHOTO</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
              <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)', minHeight: '60px' }}>
                <ImageIcon size={22} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.95rem', color: formData.imageUrl ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '800' }}>
                  {formData.imageUrl ? 'Photo Loaded' : 'Upload Floor View'}
                </span>
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
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>ROOM TYPE</label>
              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ ...inputStyle, width: '100%' }} required>
                <option value="Single">Single Suite</option>
                <option value="Shared">Shared Room</option>
                <option value="Dormitory">Dormitory</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>MONTHLY RENT (₹)</label><input type="number" placeholder="8000" value={formData.rentAmount} onChange={e => setFormData({ ...formData, rentAmount: parseInt(e.target.value) })} style={inputStyle} required /></div>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>DEPOSIT (₹)</label><input type="number" placeholder="16000" value={formData.securityDeposit} onChange={e => setFormData({ ...formData, securityDeposit: parseInt(e.target.value) })} style={inputStyle} required /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>CAPACITY (BEDS)</label><input type="number" placeholder="2" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} style={inputStyle} required min="1" /></div>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>NOTICE PERIOD (DAYS)</label><input type="number" placeholder="30" value={formData.noticePeriod} onChange={e => setFormData({ ...formData, noticePeriod: parseInt(e.target.value) })} style={inputStyle} required /></div>
          </div>
          <div className="input-group">
            <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>ROOM PREVIEW</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
              <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)', minHeight: '60px' }}>
                <ImageIcon size={20} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.9rem', color: formData.imageUrl ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '800' }}>
                  {formData.imageUrl ? 'Room Photo Ready' : 'Take/Select Room Photo'}
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({ ...formData, isAC: !formData.isAC })}>
              <div style={{ width: '18px', height: '18px', border: '2px solid var(--accent-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.isAC ? 'var(--accent-primary)' : 'transparent' }}>
                {formData.isAC && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1px' }} />}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>AC</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({ ...formData, balcony: !formData.balcony })}>
              <div style={{ width: '18px', height: '18px', border: '2px solid var(--accent-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.balcony ? 'var(--accent-primary)' : 'transparent' }}>
                {formData.balcony && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1px' }} />}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>Balcony</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>WASHROOM</label>
              <select value={formData.washroomType} onChange={e => setFormData({ ...formData, washroomType: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                <option value="Attached">Attached</option>
                <option value="Common">Common / Shared</option>
              </select>
            </div>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>FACING</label>
              <input placeholder="e.g. Garden, Road" value={formData.facing} onChange={e => setFormData({ ...formData, facing: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>FLOORING</label>
              <select value={formData.floorType} onChange={e => setFormData({ ...formData, floorType: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                <option value="Tiles">Ceramic Tiles</option>
                <option value="Marble">Premium Marble</option>
                <option value="Wooden">Wooden Finish</option>
              </select>
            </div>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>WINDOWS</label>
              <input type="number" value={formData.windowCount} onChange={e => setFormData({ ...formData, windowCount: parseInt(e.target.value) })} style={inputStyle} min="0" />
            </div>
          </div>
          <div className="input-group">
            <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>FURNITURE & AMENITIES</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', marginTop: '0.5rem' }}>
              {['Bed', 'Cupboard', 'Study Table', 'Mirror', 'Fan', 'Curtains'].map(item => (
                <div
                  key={item}
                  onClick={() => {
                    const currentFurn = Array.isArray(formData.furniture) ? formData.furniture : [];
                    const newFurn = currentFurn.includes(item)
                      ? currentFurn.filter(i => i !== item)
                      : [...currentFurn, item];
                    setFormData({ ...formData, furniture: newFurn });
                  }}
                  style={{
                    padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer',
                    background: (Array.isArray(formData.furniture) && formData.furniture.includes(item)) ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    color: (Array.isArray(formData.furniture) && formData.furniture.includes(item)) ? 'white' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)', transition: 'all 0.2s'
                  }}
                >
                  {item}
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
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>ROOM TYPE</label>
              <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ ...inputStyle, width: '100%' }} required>
                <option value="Single">Single Suite</option>
                <option value="Shared">Shared Room</option>
                <option value="Dormitory">Dormitory</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>MONTHLY RENT (₹)</label><input type="number" value={formData.rentAmount} onChange={e => setFormData({ ...formData, rentAmount: parseInt(e.target.value) })} style={inputStyle} required /></div>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>DEPOSIT (₹)</label><input type="number" value={formData.securityDeposit} onChange={e => setFormData({ ...formData, securityDeposit: parseInt(e.target.value) })} style={inputStyle} required /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>CAPACITY</label><input type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} style={inputStyle} required min="1" /></div>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>NOTICE PERIOD</label><input type="number" value={formData.noticePeriod} onChange={e => setFormData({ ...formData, noticePeriod: parseInt(e.target.value) })} style={inputStyle} required /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({ ...formData, isAC: !formData.isAC })}>
              <div style={{ width: '18px', height: '18px', border: '2px solid var(--accent-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.isAC ? 'var(--accent-primary)' : 'transparent' }}>
                {formData.isAC && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1px' }} />}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>AC</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({ ...formData, balcony: !formData.balcony })}>
              <div style={{ width: '18px', height: '18px', border: '2px solid var(--accent-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.balcony ? 'var(--accent-primary)' : 'transparent' }}>
                {formData.balcony && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1px' }} />}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>Balcony</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>WASHROOM</label>
              <select value={formData.washroomType} onChange={e => setFormData({ ...formData, washroomType: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                <option value="Attached">Attached</option>
                <option value="Common">Common / Shared</option>
              </select>
            </div>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>FACING</label>
              <input placeholder="Garden" value={formData.facing} onChange={e => setFormData({ ...formData, facing: e.target.value })} style={inputStyle} />
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '0.5rem', fontSize: '1rem' }}>Save Changes</button>
        </form>
      </Modal>

      <Modal isOpen={isEditBedOpen} onClose={() => setIsEditBedOpen(false)} title={`Edit Bed ${formData.number}`}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleUpdateBed}>
          <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED NO.</label><input value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} style={inputStyle} required /></div>
          <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>STATUS</label>
            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>TYPE</label>
              <select value={formData.bedType} onChange={e => setFormData({ ...formData, bedType: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                <option value="Single">Single</option>
                <option value="Lower Bunk">Lower Bunk</option>
                <option value="Upper Bunk">Upper Bunk</option>
              </select>
            </div>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>POSITION</label>
              <select value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                <option value="Standard">Standard</option>
                <option value="Window side">Window Side</option>
                <option value="Corner">Corner</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ padding: '1.1rem', borderRadius: '16px', fontWeight: '900' }}>Save Bed Details</button>
        </form>
      </Modal>

      <Modal isOpen={isAddBedOpen} onClose={() => setIsAddBedOpen(false)} title={`Configure New Bed in Room ${selectedRoom?.roomNumber}`}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleAddBed}>
          <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED IDENTIFIER</label><input placeholder="e.g. A, B, 101-A" value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} style={inputStyle} required /></div>
          <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>AVAILABILITY STATUS</label>
            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ ...inputStyle, width: '100%' }} required>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>
          <div className="input-group">
            <label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED PHOTO</label>
            <div style={{ position: 'relative', marginTop: '0.6rem' }}>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 2 }} />
              <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', gap: '1.2rem', background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.3)', minHeight: '65px' }}>
                <ImageIcon size={22} color="var(--accent-primary)" />
                <span style={{ fontSize: '0.95rem', color: formData.imageUrl ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '800' }}>
                  {formData.imageUrl ? 'Photo Captured ✅' : 'Click to Upload Bed Image'}
                </span>
              </div>
            </div>
            {formData.imageUrl && (
              <div style={{ marginTop: '1rem', width: '100%', height: '120px', borderRadius: '16px', backgroundImage: `url(${formData.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', border: '1px solid var(--border-color)' }}></div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BED TYPE</label>
              <select value={formData.bedType} onChange={e => setFormData({ ...formData, bedType: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                <option value="Single">Single</option>
                <option value="Lower Bunk">Lower Bunk</option>
                <option value="Upper Bunk">Upper Bunk</option>
                <option value="Queen">Queen Size</option>
              </select>
            </div>
            <div className="input-group"><label style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>POSITION</label>
              <select value={formData.position} onChange={e => setFormData({ ...formData, position: e.target.value })} style={{ ...inputStyle, width: '100%' }}>
                <option value="Standard">Standard</option>
                <option value="Window side">Window Side</option>
                <option value="Entrance side">Entrance Side</option>
                <option value="Corner">Corner</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '0.5rem', fontSize: '1.05rem' }}>Save Bed Assignment</button>
        </form>
      </Modal>

    </div>
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
        <button className="btn" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
        <h2 style={{ fontSize: '4.5rem', fontWeight: '1000', color: 'white', margin: 0, letterSpacing: '-0.05em', lineHeight: 0.9 }}>Room {room?.roomNumber}</h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.25rem', fontWeight: '700', marginTop: '0.8rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><UsersRound size={20} /> {room?.occupied || 0}/{room?.capacity} Occupied</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Banknote size={20} /> ₹{room?.rentAmount || 0} / mo</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={20} /> {room?.noticePeriod || 30}d Notice</span>
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
          <div style={{ padding: '0.7rem 1.2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: '800' }}>
            <Zap size={18} color={room?.isAC ? '#F59E0B' : '#94A3B8'} fill={room?.isAC ? '#F59E0B' : 'transparent'} /> {room?.isAC ? 'Climate Controlled' : 'Non-AC'}
          </div>
          <div style={{ padding: '0.7rem 1.2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: '800' }}>
            <Layers size={18} color="#A5B4FC" /> {room?.floorType} Flooring
          </div>
          <div style={{ padding: '0.7rem 1.2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: '800' }}>
            <MessageSquareWarning size={18} color="#FCD34D" /> {room?.washroomType} Washroom
          </div>
          {room?.balcony && (
            <div style={{ padding: '0.7rem 1.2rem', borderRadius: '14px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', fontWeight: '800' }}>
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
          <button className="btn" style={{ padding: '1.2rem', borderRadius: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s' }}>
            <ImageIcon size={24} />
          </button>
        </div>
        <button
          onClick={onEdit}
          className="btn"
          style={{ padding: '1.2rem 2.2rem', borderRadius: '22px', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', fontWeight: '950', background: 'white', color: '#0F172A', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', transition: 'all 0.3s' }}
        >
          <Edit2 size={24} /> Edit Features
        </button>
      </div>
    </div>
  </div>
);

const BuildingsList = ({ buildings, onSelect, onAdd }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Property Portfolio</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Manage your buildings and their infrastructure</p>
      </div>
      <button className="btn btn-primary" onClick={onAdd} style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}>
        <PlusCircle size={20} /> Add Building
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
      {buildings.length > 0 ? buildings.map(b => {
        // Mock data for enhancement (as backend schema doesn't have these yet)
        const occupancy = b.occupancyRate || 85;
        const totalFloors = b.floorCount || 4;
        const totalRooms = b.roomCount || 32;
        const totalBeds = b.bedCount || 64;
        const vacantBeds = Math.round(totalBeds * (1 - occupancy/100));
        
        return (
          <motion.div 
            key={b.id} 
            whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
            className="card" 
            style={{ 
              padding: 0, overflow: 'hidden', cursor: 'pointer', 
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
              border: '1px solid var(--border-color)',
              position: 'relative',
              background: 'var(--bg-secondary)',
              borderRadius: '24px'
            }} 
            onClick={() => onSelect(b)}
          >
            {/* Banner Section */}
            <div style={{ height: '200px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <div style={{ 
                position: 'absolute', inset: 0, 
                backgroundImage: b.images?.[0] ? `url("${b.images[0]}")` : 'url("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80")', 
                backgroundSize: 'cover', backgroundPosition: 'center',
                transition: 'transform 0.6s'
              }} className="building-banner" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))' }} />
              
              {/* Status & Rating Chips */}
              <div style={{ position: 'absolute', top: '15px', left: '15px', display: 'flex', gap: '0.6rem' }}>
                <span style={{ background: '#10B981', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Zap size={12} fill="white" /> ACTIVE
                </span>
                <span style={{ background: 'rgba(255,255,255,0.9)', color: '#F59E0B', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  ★ 4.8 Hygiene
                </span>
              </div>

              {/* Occupancy Indicator */}
              <div style={{ position: 'absolute', bottom: '15px', right: '15px', textAlign: 'right' }}>
                <div style={{ color: 'white', fontSize: '1.2rem', fontWeight: '1000', marginBottom: '0.2rem' }}>{occupancy}%</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '0.05em' }}>OCCUPANCY</div>
              </div>
            </div>

            <div style={{ padding: '1.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: '950', margin: '0 0 0.4rem 0', color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>{b.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} /> {b.address}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '100px', overflow: 'hidden', marginBottom: '0.6rem' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${occupancy}%` }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), #818cf8)', borderRadius: '100px' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>
                  <span>{totalBeds - vacantBeds} BEDS OCCUPIED</span>
                  <span>{vacantBeds} VACANT</span>
                </div>
              </div>

              {/* Infrastructure KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1.8rem' }}>
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-primary)' }}>{totalFloors}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)' }}>FLOORS</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-primary)' }}>{totalRooms}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)' }}>ROOMS</div>
                </div>
                <div style={{ background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-primary)' }}>{totalBeds}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)' }}>BEDS</div>
                </div>
              </div>

              {/* Smart Feature Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.65rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', padding: '0.3rem 0.7rem', borderRadius: '8px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Zap size={12} fill="var(--accent-primary)" /> {b.isAC ? 'FULL AC' : 'NON-AC'}
                </span>
                <span style={{ fontSize: '0.65rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', padding: '0.3rem 0.7rem', borderRadius: '8px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={12} /> SECURE+
                </span>
                <span style={{ fontSize: '0.65rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '0.3rem 0.7rem', borderRadius: '8px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                   FREE WIFI
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', WebkitMaskImage: 'linear-gradient(90deg, black 80%, transparent 100%)' }}>
                  {['LIFT', 'CCTV', 'GYM', 'LAUNDRY'].map((a, i) => (
                    <div key={i} style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '-8px', border: '2px solid var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                      {a === 'CCTV' ? <ShieldCheck size={14} /> : a === 'LIFT' ? <Layers size={14} /> : <Zap size={14} />}
                    </div>
                  ))}
                </div>
                <button 
                  style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.4)' }}
                >
                  Manage Floors <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        );
      }) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-secondary)', borderRadius: '32px', border: '2px dashed var(--border-color)' }}>
          <BuildingIcon size={64} color="var(--text-muted)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Empty Portfolio</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2rem' }}>You haven't added any building structures to this hostel property yet.</p>
          <button className="btn btn-primary" onClick={onAdd} style={{ padding: '1rem 2rem', borderRadius: '16px' }}>Start Building Architecture</button>
        </div>
      )}
    </div>
  </div>
);

const FloorsList = ({ floors, building, onSelect, onBack, onAdd }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <button onClick={onBack} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer', width: '45px', height: '45px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={20} /></button>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Floor Hierarchy</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Building Structure: {building?.name}</p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={onAdd} style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <PlusCircle size={20} /> Add Floor
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
      {floors.length > 0 ? floors.map(f => {
        const occRate = 72; // Mocked for UI enhancement
        const vacantRooms = 3;
        const vacantBeds = 8;
        
        return (
          <motion.div
            key={f.id} 
            whileHover={{ y: -5, boxShadow: 'var(--shadow-xl)' }} 
            className="card"
            style={{ 
              padding: 0, overflow: 'hidden', cursor: 'pointer', 
              background: 'var(--bg-secondary)', borderRadius: '24px',
              border: '1px solid var(--border-color)',
              display: 'flex', flexDirection: 'column'
            }}
            onClick={() => onSelect(f)}
          >
            <div style={{ 
              height: '140px', 
              backgroundImage: `url("${f.images?.[0] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'}")`, 
              backgroundSize: 'cover', backgroundPosition: 'center',
              position: 'relative'
            }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
              <div style={{ position: 'absolute', bottom: '15px', left: '20px', color: 'white' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>Floor {f.floorNumber}</h3>
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Level Identity</p>
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text-primary)' }}>{occRate}%</div>
                  <div style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--text-muted)' }}>OCCUPANCY</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#10B981' }}>{vacantRooms}</div>
                  <div style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--text-muted)' }}>VACANT RMS</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#3B82F6' }}>{vacantBeds}</div>
                  <div style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--text-muted)' }}>VACANT BEDS</div>
                </div>
              </div>

              {/* Progress Visualization */}
              <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '100px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${occRate}%` }}
                  style={{ height: '100%', background: 'var(--accent-primary)', borderRadius: '100px' }}
                />
              </div>

              {/* Floor Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.6rem', background: '#FDF2F8', color: '#DB2777', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '900' }}>FEMALE-ONLY</span>
                <span style={{ fontSize: '0.6rem', background: '#F0F9FF', color: '#0369A1', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '900' }}>QUIET ZONE</span>
                <span style={{ fontSize: '0.6rem', background: '#F0FDFA', color: '#0D9488', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '900' }}>STUDY-FRIENDLY</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)' }}>CLEANED: TODAY</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: '900' }}>Explore Rooms →</span>
              </div>
            </div>
          </motion.div>
        );
      }) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '24px', border: '2px dashed var(--border-color)' }}>
          <Layers size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>No floor structural data found.</p>
        </div>
      )}
    </div>
  </div>
);

const RoomsList = ({ rooms, floor, onSelect, onBack, onAdd }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <button onClick={onBack} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer', width: '45px', height: '45px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={20} /></button>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Room Inventory</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Floor {floor?.floorNumber} Structure</p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={onAdd} style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <PlusCircle size={20} /> Add Room
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
      {rooms.length > 0 ? rooms.map(r => (
        <motion.div
          key={r.id}
          whileHover={{ y: -8, boxShadow: 'var(--shadow-2xl)' }}
          className="card"
          style={{ 
            padding: 0, cursor: 'pointer', borderRadius: '28px', 
            border: '1px solid var(--border-color)', 
            position: 'relative', overflow: 'hidden', 
            display: 'flex', flexDirection: 'column',
            background: 'var(--bg-secondary)'
          }}
          onClick={() => onSelect(r)}
        >
          {/* Room Image with Badges */}
          <div style={{ height: '180px', width: '100%', position: 'relative' }}>
            <div style={{ 
              position: 'absolute', inset: 0, 
              backgroundImage: `url("${r.images?.[0] || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'}")`, 
              backgroundSize: 'cover', backgroundPosition: 'center' 
            }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.4))' }} />
            
            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {r.isAC && <span style={{ padding: '0.4rem 0.8rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.9)', color: '#F59E0B', fontSize: '0.65rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.3rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}><Zap size={12} fill="#F59E0B" /> AC ROOM</span>}
              {r.balcony && <span style={{ padding: '0.4rem 0.8rem', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.9)', color: '#10B981', fontSize: '0.65rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.3rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}><ImageIcon size={12} /> BALCONY</span>}
            </div>

            <div style={{ position: 'absolute', bottom: '15px', left: '20px' }}>
              <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: '1000', letterSpacing: '-0.02em' }}>Room {r.roomNumber}</div>
            </div>
          </div>

          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Header Info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{r.roomType} SUITE</span>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                  <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', background: 'var(--bg-tertiary)', borderRadius: '6px', fontWeight: '700', color: 'var(--text-secondary)' }}>{r.washroomType} Washroom</span>
                  <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', background: 'var(--bg-tertiary)', borderRadius: '6px', fontWeight: '700', color: 'var(--text-secondary)' }}>{r.floorType}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '1000', color: 'var(--text-primary)' }}>₹{r.rentAmount}</div>
                <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)' }}>PER MONTH</div>
              </div>
            </div>

            {/* Comfort Features Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={14} color="#10B981" /> Fire Safety Ready
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                <Zap size={14} color="#F59E0B" /> Power Backup
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                <ImageIcon size={14} color="#3B82F6" /> Natural Light
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
                <MessageSquareWarning size={14} color="#6366F1" /> Sanitized: Yes
              </div>
            </div>

            {/* Occupancy Progress */}
            <div style={{ marginTop: 'auto', paddingTop: '1.2rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>Occupancy Level</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-primary)' }}>{r.occupied || 0} / {r.capacity} BEDS</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {Array.from({ length: r.capacity }).map((_, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      flex: 1, height: '10px', borderRadius: '100px', 
                      background: i < (r.occupied || 0) ? 'linear-gradient(90deg, var(--accent-primary), #818cf8)' : 'var(--bg-tertiary)',
                      boxShadow: i < (r.occupied || 0) ? '0 0 10px rgba(99, 102, 241, 0.3)' : 'none'
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '32px', border: '2px dashed var(--border-color)' }}>
          <DoorOpen size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>No room deployments found on this level.</p>
        </div>
      )}
    </div>
  </div>
);

const BedsList = ({ beds, room, onBack, onAdd, onEditBed }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <button onClick={onBack} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', cursor: 'pointer', width: '45px', height: '45px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ArrowLeft size={20} /></button>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Unit Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Individual Bed Configuration: Room {room?.roomNumber}</p>
        </div>
      </div>
      <button className="btn btn-primary" onClick={onAdd} style={{ padding: '0.8rem 1.5rem', borderRadius: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <PlusCircle size={20} /> Deploy Bed
      </button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
      {beds.length > 0 ? beds.map(b => (
        <motion.div
          key={b.id}
          whileHover={{ y: -8, boxShadow: 'var(--shadow-2xl)' }}
          className="card"
          style={{ 
            padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', 
            borderRadius: '24px', border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)', position: 'relative' 
          }}
        >
          {/* Bed Header Overlay */}
          <div style={{ 
            position: 'absolute', top: '15px', left: '15px', right: '15px', 
            display: 'flex', justifyContent: 'space-between', zIndex: 10 
          }}>
            <span style={{ 
              padding: '0.3rem 0.8rem', borderRadius: '100px', 
              background: b.status === 'AVAILABLE' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(59, 130, 246, 0.9)', 
              color: 'white', fontSize: '0.65rem', fontWeight: '900', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
            }}>
              {b.status}
            </span>
            <button
              onClick={() => onEditBed(b)}
              style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            >
              <Edit2 size={14} />
            </button>
          </div>

          {/* Bed Visual */}
          <div style={{
            height: '140px', width: '100%',
            backgroundImage: `url("${(b.images && b.images[0]) || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'}")`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            position: 'relative'
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }} />
          </div>

          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '950', margin: 0, color: 'var(--text-primary)' }}>Unit {b.bedNumber}</h3>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <span style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.6rem', fontWeight: '800' }}>{b.bedType}</span>
                <span style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.6rem', fontWeight: '800' }}>{b.position}</span>
              </div>
            </div>

            {/* Smart Comfort Icons */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', padding: '0.8rem', background: 'var(--bg-tertiary)', borderRadius: '16px', justifyContent: 'space-around' }}>
              <div title="Reading Light" style={{ opacity: 0.8 }}><Zap size={16} color="#F59E0B" /></div>
              <div title="USB Charging" style={{ opacity: 0.8 }}><CheckSquare size={16} color="#3B82F6" /></div>
              <div title="Privacy Curtain" style={{ opacity: 0.8 }}><Layers size={16} color="#6366F1" /></div>
              <div title="Personal Locker" style={{ opacity: 0.8 }}><ShieldCheck size={16} color="#10B981" /></div>
            </div>

            {/* AI Scores Section */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                <span>COMFORT SCORE</span>
                <span style={{ color: 'var(--accent-primary)' }}>9.4/10</span>
              </div>
              <div style={{ height: '4px', background: 'var(--bg-tertiary)', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ width: '94%', height: '100%', background: 'var(--accent-primary)' }} />
              </div>
            </div>

            {/* Tenant Quick Info or Action */}
            {b.tenant ? (
              <div style={{ padding: '0.8rem', borderRadius: '14px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '900' }}>
                  {(typeof b.tenant === 'object' ? b.tenant.name : b.tenant).charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{typeof b.tenant === 'object' ? b.tenant.name : b.tenant}</div>
                  <div style={{ fontSize: '0.6rem', fontWeight: '700', color: 'var(--text-muted)' }}>Occupying since Mar 2024</div>
                </div>
              </div>
            ) : (
              <button style={{ width: '100%', padding: '0.8rem', borderRadius: '14px', border: '1px dashed var(--border-color)', background: 'transparent', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '800', cursor: 'pointer' }}>
                + Assign Tenant
              </button>
            )}
          </div>
        </motion.div>
      )) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '24px', border: '2px dashed var(--border-color)' }}>
          <Bed size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: '700' }}>No bed configurations deployed in this room.</p>
        </div>
      )}
    </div>
  </div>
);

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
