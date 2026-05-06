import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Building as BuildingIcon, Layers, DoorOpen, Bed, PlusCircle,
  ArrowLeft, CheckSquare, Square, Trash2, Edit2, Zap, X, Image as ImageIcon, BedDouble, Filter, ChevronRight, Search
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
              background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-secondary)', 
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

  // Form states
  const [formData, setFormData] = useState({ name: '', address: '', number: '', type: 'Single', capacity: 1, status: 'AVAILABLE', imageUrl: '', isAC: false });

  const fetchBuildings = async () => {
    console.log("Buildings module fetching for ID:", activeBuildingId);
    try {
      const bData = await api.getBuildings(activeBuildingId) || [];
      if (activeBuildingId) {
        const filtered = bData.filter(b => b.id === activeBuildingId || b._id === activeBuildingId);
        setBuildings(filtered);
        if (filtered.length > 0) setSelectedBuilding(filtered[0]);
      } else {
        setBuildings(bData);
      }
    } catch (err) {
      console.error("Fetch error in Buildings:", err);
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
    try {
      const data = await api.getBeds(r.id);
      setBeds(data || []);
      setView('beds');
    } catch (err) {
      console.error(err);
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
        const updated = await api.updateRoom(roomId, { images: [base64] });
        setSelectedRoom(prev => ({ ...prev, images: updated.images }));
        // Update rooms list in state
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
    const newB = await api.addBuilding({ name: formData.name, address: formData.address, images: formData.imageUrl ? [formData.imageUrl] : [] });
    setBuildings([...buildings, newB]);
    setIsAddBuildingOpen(false);
    setFormData({ name: '', address: '', number: '', type: 'Single', capacity: 1, status: 'AVAILABLE', imageUrl: '', isAC: false });
  };

  const handleAddFloor = async (e) => {
    e.preventDefault();
    const newF = await api.addFloor({ buildingId: selectedBuilding.id, floorNumber: formData.number, images: formData.imageUrl ? [formData.imageUrl] : [] });
    setFloors([...floors, newF]);
    setIsAddFloorOpen(false);
    setFormData({ name: '', address: '', number: '', type: 'Single', capacity: 1, status: 'AVAILABLE', imageUrl: '', isAC: false });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    const newR = await api.addRoom({
      floorId: selectedFloor.id,
      roomNumber: formData.number,
      roomType: formData.type,
      capacity: formData.capacity,
      isAC: formData.isAC,
      images: formData.imageUrl ? [formData.imageUrl] : []
    });
    setRooms([...rooms, newR]);
    setIsAddRoomOpen(false);
    setFormData({ name: '', address: '', number: '', type: 'Single', capacity: 1, status: 'AVAILABLE', imageUrl: '', isAC: false });
  };

  const handleAddBed = async (e) => {
    e.preventDefault();
    const newB = await api.addBed({ roomId: selectedRoom.id, bedNumber: formData.number, status: formData.status, images: formData.imageUrl ? [formData.imageUrl] : [] });
    setBeds([...beds, newB]);
    setIsAddBedOpen(false);
    setFormData({ name: '', address: '', number: '', type: 'Single', capacity: 1, status: 'AVAILABLE', imageUrl: '' });
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

      <AnimatePresence mode="wait">
        {view === 'buildings' && (
          <motion.div key="buildings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <BuildingsList 
              buildings={buildings.filter(b => 
                (b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.address.toLowerCase().includes(searchQuery.toLowerCase())) &&
                (filterType === 'All' || (filterType === 'AC' && b.isAC) || (filterType === 'Non-AC' && !b.isAC))
              )} 
              onSelect={handleSelectBuilding} 
              onAdd={() => setIsAddBuildingOpen(true)} 
            />
          </motion.div>
        )}
        {view === 'floors' && (
          <motion.div key="floors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <FloorsList 
              floors={floors.filter(f => f.floorNumber.toLowerCase().includes(searchQuery.toLowerCase()))} 
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
              rooms={rooms.filter(r => 
                r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
                (filterType === 'All' || (filterType === 'AC' && r.isAC) || (filterType === 'Non-AC' && !r.isAC))
              )} 
              floor={selectedFloor} 
              onSelect={handleSelectRoom} 
              onBack={() => setView('floors')} 
              onAdd={() => setIsAddRoomOpen(true)} 
            />
          </motion.div>
        )}
        {view === 'beds' && (
          <motion.div key="beds" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
             <RoomHero room={selectedRoom} onImageUpdate={(file) => updateRoomImageDirectly(selectedRoom.id || selectedRoom._id, file)} />
             <BedsList 
               beds={beds.filter(b => 
                 b.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
                 (filterType === 'All' || (filterType === 'Available' && b.status === 'AVAILABLE') || (filterType === 'Occupied' && b.status === 'OCCUPIED'))
               )} 
               room={selectedRoom} 
               onBack={() => setView('rooms')} 
               onAdd={() => setIsAddBedOpen(true)} 
             />
          </motion.div>
        )}
        {view === 'assign' && (
          <motion.div key="assign" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <AssignFloors buildings={buildings} onBack={() => setView('buildings')} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Addition Modals --- */}

      <Modal isOpen={isAddBuildingOpen} onClose={() => setIsAddBuildingOpen(false)} title="Add New Building">
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleAddBuilding}>
          <div className="input-group"><label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>BUILDING NAME</label><input placeholder="Royal residency" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} required /></div>
          <div className="input-group"><label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>ADDRESS</label><input placeholder="123 tech street" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={inputStyle} required /></div>
          <div className="input-group">
            <label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>BUILDING IMAGE</label>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1.2rem', borderRadius: '18px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({...formData, isAC: !formData.isAC})}>
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
          <div className="input-group"><label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>FLOOR NUMBER</label><input placeholder="e.g. G, 1, 2" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} style={inputStyle} required /></div>
          <div className="input-group">
            <label style={{fontSize:'0.8rem', fontWeight:'900', color:'var(--text-muted)'}}>FLOOR LAYOUT PHOTO</label>
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
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>ROOM NO.</label><input placeholder="101" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} style={inputStyle} required /></div>
            <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>ROOM TYPE</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ ...inputStyle, width: '100%' }} required>
                <option value="Single">Single Suite</option>
                <option value="Shared">Shared Room</option>
                <option value="Dormitory">Dormitory</option>
              </select>
            </div>
          </div>
          <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>CAPACITY (BEDS)</label><input type="number" placeholder="2" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} style={inputStyle} required min="1" /></div>
          <div className="input-group">
            <label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>ROOM PREVIEW</label>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '16px', cursor: 'pointer', border: '1px solid var(--border-color)' }} onClick={() => setFormData({...formData, isAC: !formData.isAC})}>
            <div style={{ width: '22px', height: '22px', border: '2px solid var(--accent-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.isAC ? 'var(--accent-primary)' : 'transparent', transition: 'all 0.3s' }}>
              {formData.isAC && <div style={{ width: '10px', height: '10px', background: 'white', borderRadius: '2px' }} />}
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: '900', color: 'var(--text-primary)' }}>Premium AC Room</span>
          </div>
          <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '0.5rem', fontSize: '1rem' }}>Deploy Room</button>
        </form>
      </Modal>

      <Modal isOpen={isAddBedOpen} onClose={() => setIsAddBedOpen(false)} title={`Configure New Bed in Room ${selectedRoom?.roomNumber}`}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} onSubmit={handleAddBed}>
          <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>BED IDENTIFIER</label><input placeholder="e.g. A, B, 101-A" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} style={inputStyle} required /></div>
          <div className="input-group"><label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>AVAILABILITY STATUS</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ ...inputStyle, width: '100%' }} required>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="OCCUPIED">OCCUPIED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>
          <div className="input-group">
            <label style={{fontSize:'0.75rem', fontWeight:'900', color:'var(--text-muted)'}}>BED PHOTO</label>
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
          <button className="btn btn-primary" type="submit" style={{ padding: '1.2rem', borderRadius: '18px', fontWeight: '950', marginTop: '0.5rem', fontSize: '1.05rem' }}>Save Bed Assignment</button>
        </form>
      </Modal>

    </div>
  );
};

// --- Sub Components ---

const RoomHero = ({ room, onImageUpdate }) => (
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
          <span>{room?.type} Configuration</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span>{room?.capacity} Exclusive Beds</span>
          <span style={{ opacity: 0.3 }}>|</span>
          <span style={{ color: '#10B981' }}>{room?.status}</span>
        </p>
      </div>

      <div style={{ position: 'relative' }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files[0] && onImageUpdate(e.target.files[0])}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', zIndex: 5 }}
        />
        <button className="btn" style={{ padding: '1.2rem 2.2rem', borderRadius: '22px', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '1.1rem', fontWeight: '950', background: 'white', color: '#0F172A', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', transition: 'all 0.3s' }}>
          <ImageIcon size={24} /> Edit Room View
        </button>
      </div>
    </div>
  </div>
);

const BuildingsList = ({ buildings, onSelect, onAdd }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>All Buildings</h2>
      <button className="btn btn-primary" onClick={onAdd}><PlusCircle size={18} /> Add Building</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {buildings.length > 0 ? buildings.map(b => (
        <div key={b.id} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', borderTop: '4px solid var(--accent-primary)', position: 'relative' }} onClick={() => onSelect(b)} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
          <div style={{ height: '160px', width: '100%', backgroundImage: b.images?.[0] ? `url("${b.images[0]}")` : 'url("/assets/building.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            {b.isAC && (
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255, 255, 255, 0.95)', color: '#2563EB', padding: '0.4rem 0.8rem', borderRadius: '12px', fontWeight: '900', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(4px)', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                <Zap size={14} fill="#2563EB" /> AC ENABLED
              </div>
            )}
          </div>
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>{b.name}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.4' }}>{b.address}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.2rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {b.amenities?.slice(0, 3).map((a, i) => (
                  <span key={i} style={{ fontSize: '0.65rem', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>{a}</span>
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                View Floors <ArrowLeft size={14} style={{ transform: 'rotate(180deg)' }} />
              </span>
            </div>
          </div>
        </div>
      )) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '2px dashed var(--border-color)' }}>
          <BuildingIcon size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ color: 'var(--text-primary)' }}>No Buildings Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>Add your first building to start managing rooms.</p>
        </div>
      )}
    </div>
  </div>
);

const FloorsList = ({ floors, building, onSelect, onBack, onAdd }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Floors in {building?.name}</h2>
      </div>
      <button className="btn btn-primary" onClick={onAdd}><PlusCircle size={18} /> Add Floor</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
      {floors.length > 0 ? floors.map(f => (
        <motion.div
          key={f.id} whileHover={{ y: -5 }} className="card"
          style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
          onClick={() => onSelect(f)}
        >
          <div style={{ height: '120px', backgroundImage: `url("${f.images?.[0] || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div style={{ padding: '1.2rem', textAlign: 'center' }}>
            <Layers size={24} color="var(--accent-primary)" style={{ marginBottom: '0.5rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Floor {f.floorNumber}</h3>
          </div>
        </motion.div>
      )) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '2px dashed var(--border-color)' }}>
          <Layers size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No floors found in this building.</p>
        </div>
      )}
    </div>
  </div>
);

const RoomsList = ({ rooms, floor, onSelect, onBack, onAdd }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Rooms on Floor {floor?.floorNumber}</h2>
      </div>
      <button className="btn btn-primary" onClick={onAdd}><PlusCircle size={18} /> Add Room</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
      {rooms.length > 0 ? rooms.map(r => (
        <motion.div
          key={r.id}
          whileHover={{ scale: 1.02, y: -2 }}
          className="card"
          style={{ padding: 0, cursor: 'pointer', borderRadius: '16px', border: '1px solid #E2E8F0', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
          onClick={() => onSelect(r)}
        >
          <div style={{ height: '100px', width: '100%', backgroundImage: `url("${r.images?.[0] || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80'}")`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
              {r.isAC && <div style={{ background: 'rgba(255, 247, 237, 0.9)', color: '#C2410C', padding: '0.2rem 0.4rem', borderRadius: '6px', fontSize: '0.6rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '2px', backdropFilter: 'blur(4px)' }}><Zap size={10} fill="#C2410C" /> AC</div>}
            </div>
          </div>

          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>Room {r.roomNumber}</div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>{r.type}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: r.status === 'Active' || r.status === 'AVAILABLE' ? '#10B981' : '#F59E0B' }}>{r.status}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.occupied || 0}/{r.capacity} Beds</span>
            </div>

            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: r.capacity }).map((_, i) => (
                <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i < (r.occupied || 0) ? '#3B82F6' : '#E2E8F0' }} />
              ))}
            </div>
          </div>
        </motion.div>
      )) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '2px dashed var(--border-color)' }}>
          <DoorOpen size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No rooms found on this floor.</p>
        </div>
      )}
    </div>
  </div>
);

const BedsList = ({ beds, room, onBack, onAdd }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><ArrowLeft size={24} /></button>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Beds in Room {room?.roomNumber}</h2>
      </div>
      <button className="btn btn-primary" onClick={onAdd}><PlusCircle size={18} /> Add Bed</button>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
      {beds.length > 0 ? beds.map(b => (
        <motion.div
          key={b.id}
          whileHover={{ scale: 1.05 }}
          className="card"
          style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', borderRadius: '16px', borderTop: `4px solid ${b.status === 'AVAILABLE' ? '#10B981' : b.status === 'OCCUPIED' ? '#3B82F6' : '#EF4444'}`, textAlign: 'center' }}
        >
          <div style={{
            height: '100px',
            width: '100%',
            backgroundImage: `url("${(b.images && b.images[0]) || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'all 0.3s'
          }} />
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: b.status === 'AVAILABLE' ? '#ECFDF5' : '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: b.status === 'AVAILABLE' ? '#10B981' : '#3B82F6' }}>
              <Bed size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '900', margin: 0, color: '#0F172A' }}>{b.bedNumber}</h3>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', color: '#64748B', textTransform: 'uppercase' }}>{b.status}</span>
            </div>
            {b.tenant && (
              <div style={{ marginTop: '0.2rem', padding: '0.3rem 0.6rem', borderRadius: '8px', background: '#F8FAFC', width: '100%' }}>
                <p style={{ fontSize: '0.7rem', color: '#475569', fontWeight: '700', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  👤 {b.tenant}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )) : (
        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '2px dashed var(--border-color)' }}>
          <Bed size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No beds found in this room.</p>
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
