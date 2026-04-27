import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  BedDouble, User, AlertTriangle, SlidersHorizontal, 
  Settings2, History, Filter, Layers, ChevronDown, ChevronRight 
} from 'lucide-react';
import { api } from '../mockData';

const Rooms = () => {
  const { buildingId } = useParams();
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedBuildings, setExpandedBuildings] = useState({});
  const [expandedFloors, setExpandedFloors] = useState({});

  const [filterType, setFilterType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const b = await api.getBuildings();
        const f = await api.getAllFloors();
        const r = await api.getAllRooms();
        const bd = await api.getAllBeds();
        setBuildings(b || []);
        setFloors(f || []);
        setRooms(r || []);
        setBeds(bd || []);

        const bExp = {}; b?.forEach(x => bExp[x.id] = true);
        const fExp = {}; f?.forEach(x => fExp[x.id] = true);
        setExpandedBuildings(bExp);
        setExpandedFloors(fExp);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleBed = async (roomId, bedId) => {
    const room = rooms.find(r => r.id === roomId);
    const bed = beds.find(b => b.id === bedId);
    if (!room || !bed || room.status === 'Maintenance') return;
    const newStatus = bed.status === 'OCCUPIED' ? 'AVAILABLE' : 'OCCUPIED';
    // Optimistic UI update first
    setBeds(prev => prev.map(b => b.id === bedId ? { ...b, status: newStatus } : b));
    try {
      await api.updateBedStatus(bedId, newStatus, newStatus === 'OCCUPIED' ? 'New Tenant' : null);
      // Sync with server
      const fresh = await api.getAllBeds();
      if (fresh) setBeds(fresh);
    } catch (err) {
      console.error('Failed to update bed status:', err);
      // Revert on error
      setBeds(prev => prev.map(b => b.id === bedId ? { ...b, status: bed.status } : b));
    }
  };

  const toggleMaintenance = async (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    const roomBeds = beds.filter(b => b.roomId === roomId);
    if (!room) return;
    if (room.status === 'Maintenance') {
      await api.updateRoomStatus(roomId, 'Active');
    } else {
      if (roomBeds.some(b => b.status === 'OCCUPIED')) return;
      await api.updateRoomStatus(roomId, 'Maintenance');
    }
    setRooms(await api.getAllRooms() || []);
  };

  const toggleBuilding = (id) => setExpandedBuildings(p => ({ ...p, [id]: !p[id] }));
  const toggleFloorCollapse = (id) => setExpandedFloors(p => ({ ...p, [id]: !p[id] }));

  const types = [...new Set(rooms.map(r => r.roomType).filter(Boolean))];

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading...</div>;

  return (
    <div className="rooms-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BedDouble size={32} color="var(--accent-primary)" /> Rooms & Beds
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Hierarchical occupancy tracking.</p>
        </div>
        <button className="btn" onClick={() => setShowFilters(!showFilters)} style={{ background: showFilters ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
          <Filter size={16} /> Filters
        </button>
      </header>

      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="card" style={{ display: 'flex', gap: '2rem', padding: '1rem 1.5rem', marginBottom: '2rem', overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600' }}>Room Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                <option value="All">All Types</option>
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        {(buildings.some(b => (b.id || b._id) === buildingId)
          ? buildings.filter(b => (b.id || b._id) === buildingId)
          : buildings
        ).map(building => {
          const buildingFloors = floors.filter(f => f.buildingId === building.id);
          if (buildingFloors.length === 0) return null;
          return (
            <div key={building.id} style={{ marginBottom: '3rem' }}>
              <div onClick={() => toggleBuilding(building.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem 1.2rem', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid var(--border-color)', cursor: 'pointer', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundImage: building.images?.[0] ? `url("${building.images[0]}")` : 'none', backgroundColor: 'var(--bg-tertiary)', backgroundSize: 'cover' }} />
                  <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0 }}>{building.name}</h2>
                </div>
                {expandedBuildings[building.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>

              <AnimatePresence>
                {expandedBuildings[building.id] && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                    {buildingFloors.map(floor => {
                      const floorRooms = rooms.filter(r => r.floorId === floor.id && (filterType === 'All' || r.roomType === filterType));
                      if (floorRooms.length === 0) return null;
                      return (
                        <div key={floor.id} style={{ marginBottom: '2rem', paddingLeft: '2rem', borderLeft: '3px solid var(--bg-tertiary)' }}>
                          <div onClick={() => toggleFloorCollapse(floor.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.8rem', background: 'var(--bg-tertiary)', borderRadius: '6px', width: 'fit-content', cursor: 'pointer', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <Layers size={14} color="var(--accent-primary)" />
                              <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>Floor {floor.floorNumber}</h3>
                            </div>
                            {expandedFloors[floor.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </div>
                          
                          <AnimatePresence>
                            {expandedFloors[floor.id] && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                  {floorRooms.map(room => {
                                    const roomBeds = beds.filter(b => b.roomId === room.id);
                                    const available = roomBeds.filter(b => b.status === 'AVAILABLE').length;
                                    return (
                                      <motion.div key={room.id} className="card" style={{ padding: 0, overflow: 'hidden', border: room.status === 'Maintenance' ? '2px dashed var(--accent-warning)' : '1px solid var(--border-color)' }}>
                                        {room.images?.[0] && <div style={{ height: '90px', width: '100%', backgroundImage: `url("${room.images[0]}")`, backgroundSize: 'cover' }} />}
                                        <div style={{ padding: '1rem' }}>
                                          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Room {room.roomNumber}</h3>
                                          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{room.roomType} • {available}/{roomBeds.length}</p>
                                          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.8rem', overflowX: 'auto' }}>
                                            {roomBeds.map(bed => (
                                              <div key={bed.id} onClick={() => toggleBed(room.id, bed.id)} style={{ padding: '0.5rem', borderRadius: '6px', background: bed.status === 'OCCUPIED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', cursor: 'pointer', textAlign: 'center', minWidth: '60px' }}>
                                                {bed.status === 'OCCUPIED' ? <User size={12} color="var(--accent-error)" /> : <BedDouble size={12} color="var(--accent-success)" />}
                                                <p style={{ fontSize: '0.5rem', margin: '0.2rem 0 0 0' }}>{bed.bedNumber}</p>
                                              </div>
                                            ))}
                                          </div>
                                          <div style={{ marginTop: '1rem', paddingTop: '0.8rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.4rem' }}>
                                            <button onClick={() => toggleMaintenance(room.id)} className="btn" style={{ flex: 1, fontSize: '0.65rem', padding: '0.3rem' }}>
                                              {room.status === 'Maintenance' ? 'End Mnt' : 'Mnt'}
                                            </button>
                                          </div>
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rooms;
