import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Building as BuildingIcon, Layers, DoorOpen, Bed, PlusCircle, 
  ArrowLeft, CheckSquare, Square, Trash2, Edit2, Zap, X, Image as ImageIcon, BedDouble, Filter
} from 'lucide-react';

import { api } from '../mockData';

// Generic Modal Component
const Modal = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          zIndex: 1000, backdropFilter: 'blur(4px)' 
        }}
      >
        <motion.div 
          initial={{ y: 50, opacity: 0, scale: 0.95 }} 
          animate={{ y: 0, opacity: 1, scale: 1 }} 
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="card"
          style={{ 
            width: '90%', maxWidth: '500px', padding: '2rem', 
            maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-primary)' 
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{title}</h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Buildings = () => {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const [view, setView] = useState('buildings'); // buildings, floors, rooms, beds, assign
  const [showFilters, setShowFilters] = useState(false);
  
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
    try {
      const bData = await api.getBuildings() || [];
      if (buildingId) {
        setBuildings(bData.filter(b => b.id === buildingId || b._id === buildingId));
      } else {
        setBuildings(bData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBuildings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Generic Breadcrumb
  const renderBreadcrumb = () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
      <button onClick={() => setView('buildings')} style={{ background: 'none', border: 'none', color: view === 'buildings' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600' }}>Buildings</button>
      {selectedBuilding && (
        <>
          <span>/</span>
          <button onClick={() => setView('floors')} style={{ background: 'none', border: 'none', color: view === 'floors' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600' }}>{selectedBuilding.name}</button>
        </>
      )}
      {selectedFloor && (view === 'rooms' || view === 'beds') && (
        <>
          <span>/</span>
          <button onClick={() => setView('rooms')} style={{ background: 'none', border: 'none', color: view === 'rooms' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: '600' }}>Floor {selectedFloor.floorNumber}</button>
        </>
      )}
      {selectedRoom && view === 'beds' && (
        <>
          <span>/</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Room {selectedRoom.roomNumber}</span>
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
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            className="btn" 
            onClick={() => navigate(`/owner/building/${buildingId}/rooms`)}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', fontWeight: '700' }}
          >
            <BedDouble size={18} /> Occupancy View
          </button>
          <button className="btn" onClick={() => setShowFilters(!showFilters)} style={{ background: showFilters ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
            <Filter size={16} /> Filters
          </button>
        </div>
      </header>

      {renderBreadcrumb()}

      <AnimatePresence mode="wait">
        {view === 'buildings' && (
          <motion.div key="buildings" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
             <BuildingsList buildings={buildings} onSelect={handleSelectBuilding} onAdd={() => setIsAddBuildingOpen(true)} />
          </motion.div>
        )}
        {view === 'floors' && (
          <motion.div key="floors" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
             <FloorsList floors={floors} building={selectedBuilding} onSelect={handleSelectFloor} onBack={() => setView('buildings')} onAdd={() => setIsAddFloorOpen(true)} />
          </motion.div>
        )}
        {view === 'rooms' && (
          <motion.div key="rooms" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
             <RoomsList rooms={rooms} floor={selectedFloor} onSelect={handleSelectRoom} onBack={() => setView('floors')} onAdd={() => setIsAddRoomOpen(true)} />
          </motion.div>
        )}
        {view === 'beds' && (
          <motion.div key="beds" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
             <BedsList beds={beds} room={selectedRoom} onBack={() => setView('rooms')} onAdd={() => setIsAddBedOpen(true)} />
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
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} onSubmit={handleAddBuilding}>
          <input placeholder="Building Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
          <input placeholder="Address / Location" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} style={inputStyle} required />
          <input placeholder="Image URL (Optional)" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={inputStyle} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '10px', cursor: 'pointer' }} onClick={() => setFormData({...formData, isAC: !formData.isAC})}>
            <div style={{ width: '18px', height: '18px', border: '2px solid var(--accent-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.isAC ? 'var(--accent-primary)' : 'transparent' }}>
              {formData.isAC && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1px' }} />}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>This is an AC Building</span>
          </div>
          <button className="btn btn-primary" type="submit">Save Building</button>
        </form>
      </Modal>

      <Modal isOpen={isAddFloorOpen} onClose={() => setIsAddFloorOpen(false)} title={`Add Floor to ${selectedBuilding?.name}`}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} onSubmit={handleAddFloor}>
          <input placeholder="Floor Number/Name (e.g., G, 1, 2)" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} style={inputStyle} required />
          <input placeholder="Image URL (Optional)" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={inputStyle} />
          <button className="btn btn-primary" type="submit">Save Floor</button>
        </form>
      </Modal>

      <Modal isOpen={isAddRoomOpen} onClose={() => setIsAddRoomOpen(false)} title={`Add Room to Floor ${selectedFloor?.floorNumber}`}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} onSubmit={handleAddRoom}>
          <input placeholder="Room Number (e.g., 101)" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} style={inputStyle} required />
          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={inputStyle} required>
            <option value="Single">Single</option>
            <option value="Shared">Shared</option>
            <option value="Dormitory">Dormitory</option>
          </select>
          <input type="number" placeholder="Capacity (Beds)" value={formData.capacity} onChange={e => setFormData({...formData, capacity: parseInt(e.target.value)})} style={inputStyle} required min="1" />
          <input placeholder="Image URL (Optional)" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={inputStyle} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'var(--bg-tertiary)', padding: '0.8rem', borderRadius: '10px', cursor: 'pointer' }} onClick={() => setFormData({...formData, isAC: !formData.isAC})}>
            <div style={{ width: '18px', height: '18px', border: '2px solid var(--accent-primary)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: formData.isAC ? 'var(--accent-primary)' : 'transparent' }}>
              {formData.isAC && <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '1px' }} />}
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>This is an AC Room</span>
          </div>
          <button className="btn btn-primary" type="submit">Save Room</button>
        </form>
      </Modal>

      <Modal isOpen={isAddBedOpen} onClose={() => setIsAddBedOpen(false)} title={`Add Bed to Room ${selectedRoom?.roomNumber}`}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }} onSubmit={handleAddBed}>
          <input placeholder="Bed Identifier (e.g., A, B, 101-A)" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} style={inputStyle} required />
          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={inputStyle} required>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="OCCUPIED">OCCUPIED</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>
          <input placeholder="Image URL (Optional)" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={inputStyle} />
          <button className="btn btn-primary" type="submit">Save Bed</button>
        </form>
      </Modal>

    </div>
  );
};

// --- Sub Components ---

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
                  {r.isAC && <div style={{ background: 'rgba(255, 247, 237, 0.9)', color: '#C2410C', padding: '0.2rem 0.4rem', borderRadius: '6px', fontSize: '0.6rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '2px', backdropFilter: 'blur(4px)' }}><Zap size={10} fill="#C2410C"/> AC</div>}
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
