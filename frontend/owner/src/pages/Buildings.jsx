import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  Building as BuildingIcon, Layers, DoorOpen, Bed, PlusCircle, 
  ArrowLeft, CheckSquare, Square, Trash2, Edit2, Zap, X, Image as ImageIcon
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
  const [view, setView] = useState('buildings'); // buildings, floors, rooms, beds, assign
  
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
  const [formData, setFormData] = useState({ name: '', address: '', number: '', type: 'Single', capacity: 1, status: 'AVAILABLE', imageUrl: '' });

  useEffect(() => {
    fetchBuildings();
  }, []);

  const fetchBuildings = async () => {
    try {
      const data = await api.getBuildings();
      const bData = data || [];
      if (buildingId) {
        setBuildings(bData.filter(b => (b.id || b._id) === buildingId));
      } else {
        setBuildings(bData);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
    setFormData({ name: '', address: '', number: '', type: 'Single', capacity: 1, status: 'AVAILABLE', imageUrl: '' });
  };

  const handleAddFloor = async (e) => {
    e.preventDefault();
    const newF = await api.addFloor({ buildingId: selectedBuilding.id, floorNumber: formData.number, images: formData.imageUrl ? [formData.imageUrl] : [] });
    setFloors([...floors, newF]);
    setIsAddFloorOpen(false);
    setFormData({ name: '', address: '', number: '', type: 'Single', capacity: 1, status: 'AVAILABLE', imageUrl: '' });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    const newR = await api.addRoom({ floorId: selectedFloor.id, roomNumber: formData.number, roomType: formData.type, capacity: formData.capacity, images: formData.imageUrl ? [formData.imageUrl] : [] });
    setRooms([...rooms, newR]);
    setIsAddRoomOpen(false);
    setFormData({ name: '', address: '', number: '', type: 'Single', capacity: 1, status: 'AVAILABLE', imageUrl: '' });
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
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" onClick={() => setView('assign')} style={{ border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', background: 'rgba(99, 102, 241, 0.1)' }}>
            <Zap size={18} /> Assign Floors to Hostel
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
      {buildings.map(b => (
        <div key={b.id} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s', borderTop: '4px solid var(--accent-primary)' }} onClick={() => onSelect(b)} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          {b.images && b.images.length > 0 ? (
            <div style={{ height: '140px', width: '100%', backgroundImage: `url("${b.images[0]}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          ) : (
            <div style={{ height: '140px', width: '100%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BuildingIcon size={50} color="var(--accent-primary)" style={{ opacity: 0.5 }} />
            </div>
          )}
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem' }}>{b.name}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{b.address}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Manage Floors &rarr;</span>
            </div>
          </div>
        </div>
      ))}
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
      {floors.map(f => (
        <div key={f.id} className="card" onClick={() => onSelect(f)} style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
          {f.images && f.images.length > 0 ? (
            <div style={{ height: '100px', width: '100%', backgroundImage: `url("${f.images[0]}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          ) : (
             <div style={{ height: '100px', width: '100%', background: 'linear-gradient(145deg, var(--bg-secondary), var(--bg-tertiary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Layers size={40} color="var(--accent-primary)" style={{ opacity: 0.5 }} />
             </div>
          )}
          <div style={{ padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Floor {f.floorNumber}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Click to view rooms</p>
          </div>
        </div>
      ))}
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
      {rooms.map(r => (
        <div key={r.id} className="card" onClick={() => onSelect(r)} style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
          {r.images && r.images.length > 0 ? (
            <div style={{ height: '120px', width: '100%', backgroundImage: `url("${r.images[0]}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          ) : null}
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <DoorOpen size={24} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{r.roomNumber}</h3>
              </div>
              <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '12px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>{r.roomType}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Capacity: {r.capacity} Persons</p>
          </div>
        </div>
      ))}
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
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
      {beds.map(b => (
        <div key={b.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           {b.images && b.images.length > 0 ? (
            <div style={{ height: '100px', width: '100%', backgroundImage: `url("${b.images[0]}")`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          ) : null}
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', width: '100%' }}>
            <Bed size={32} color={b.status === 'AVAILABLE' ? 'var(--accent-success)' : 'var(--text-muted)'} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{b.bedNumber}</h3>
            <span style={{ fontSize: '0.8rem', padding: '0.3rem 0.8rem', borderRadius: '20px', background: b.status === 'AVAILABLE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: b.status === 'AVAILABLE' ? 'var(--accent-success)' : '#ef4444' }}>
              {b.status}
            </span>
          </div>
        </div>
      ))}
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
      setFloors([]);
    }
  }, [selectedBuilding]);

  useEffect(() => {
    if (selectedHostel) {
      api.getAssignedFloors(selectedHostel).then(fIds => setAssignedFloors(new Set(fIds || [])));
    } else {
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
