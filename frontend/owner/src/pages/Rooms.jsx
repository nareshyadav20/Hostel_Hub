import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BedDouble, User, AlertTriangle, SlidersHorizontal, 
  Settings2, History, Filter, Layers, ChevronDown, ChevronRight, Building2, FileText
} from 'lucide-react';
import { api } from '../mockData';

const MOCK_TRANSFERS = [
  { id: 'tr1', tenant: { name: 'Rahul Sharma' }, oldRoom: 'Room 101 - Bed A', newRoom: 'Room 202 - Bed B', reason: 'Need a quieter room for study', status: 'PENDING', date: '2026-05-01', buildingId: null },
  { id: 'tr2', tenant: { name: 'Priya Singh' }, oldRoom: 'Room 102 - Bed B', newRoom: 'Room 103 - Bed A', reason: 'Roommate conflict', status: 'ACCEPTED', date: '2026-04-28', buildingId: null },
  { id: 'tr3', tenant: { name: 'Arjun Mehta' }, oldRoom: 'Room 205 - Bed C', newRoom: 'Room 301 - Bed A', reason: 'Proximity to bathroom', status: 'PENDING', date: '2026-05-03', buildingId: null },
  { id: 'tr4', tenant: { name: 'Sneha Reddy' }, oldRoom: 'Room 104 - Bed A', newRoom: 'Room 104 - Bed B', reason: 'Better ventilation on other side', status: 'REJECTED', date: '2026-04-25', buildingId: null },
  { id: 'tr5', tenant: { name: 'Vikram Das' }, oldRoom: 'Room 201 - Bed B', newRoom: 'Room 401 - Bed A', reason: 'Floor preference', status: 'PENDING', date: '2026-05-04', buildingId: null },
];

const STATUS_STYLES = {
  PENDING:  { bg: '#FEF3C7', color: '#D97706', label: 'Pending' },
  ACCEPTED: { bg: '#D1FAE5', color: '#059669', label: 'Approved' },
  REJECTED: { bg: '#FEE2E2', color: '#DC2626', label: 'Rejected' },
};

const Rooms = () => {
  const { buildingId: urlBuildingId } = useParams();
  const navigate = useNavigate();
  
  // Step 1: Restore context
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [beds, setBeds] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hierarchy state
  const [selectedBuildingId, setSelectedBuildingId] = useState(activeBuildingId || null);
  const [expandedFloors, setExpandedFloors] = useState({});
  const [expandedRooms, setExpandedRooms] = useState({});
  const [selectedTenantInfo, setSelectedTenantInfo] = useState(null);

  const [filterType, setFilterType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' or 'transfers'
  const [transferRequests, setTransferRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Rooms module fetching for ID:", activeBuildingId);
      setLoading(true);
      try {
        const [b, f, r, bd, t, tr] = await Promise.all([
          api.getBuildings(),
          api.getAllFloors(),
          api.getAllRooms(),
          api.getAllBeds(),
          api.getTenants(),
          api.getRoomTransfers()
        ]);
        
        setBuildings(b || []);
        setFloors(f || []);
        setRooms(r || []);
        setBeds(bd || []);
        setTenants(t || []);
        setTransferRequests((tr && tr.length > 0) ? tr : MOCK_TRANSFERS);

        const fExp = {}; f?.forEach(x => fExp[x.id] = true);
        setExpandedFloors(fExp);
        
        if (activeBuildingId) setSelectedBuildingId(activeBuildingId);
      } catch (err) {
        console.error("Fetch error in Rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeBuildingId]);

  const handleTransferStatus = async (id, status) => {
    try {
      await api.updateRoomTransferStatus(id, status);
      setTransferRequests(prev => prev.map(tr => tr.id === id ? { ...tr, status } : tr));
      // Refresh rooms and beds if accepted
      if (status === 'ACCEPTED') {
        const bd = await api.getAllBeds();
        const t = await api.getTenants();
        setBeds(bd);
        setTenants(t);
      }
    } catch (err) {
      console.error('Failed to update transfer status:', err);
    }
  };

  const toggleBed = async (roomId, bedId) => {
    const room = rooms.find(r => r.id === roomId);
    const bed = beds.find(b => b.id === bedId);
    if (!room || !bed) return;
    if (room.status === 'Maintenance') {
      alert("Cannot change bed status while room is under maintenance!");
      return;
    }
    const newStatus = bed.status === 'OCCUPIED' ? 'AVAILABLE' : 'OCCUPIED';
    // Optimistic UI update first
    setBeds(prev => prev.map(b => b.id === bedId ? { ...b, status: newStatus } : b));
    
    // Fire and forget update (no await, no blocking re-fetch)
    api.updateBedStatus(bedId, newStatus, null).catch(err => {
      console.error('Failed to update bed status:', err);
      // Revert quietly on actual failure
      setBeds(prev => prev.map(b => b.id === bedId ? { ...b, status: bed.status } : b));
    });
  };

  const toggleMaintenance = async (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    
    if (room.status === 'Maintenance') {
      // Optimistic update
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: 'Active' } : r));
      api.updateRoomStatus(roomId, 'Active').catch(() => {
        setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: room.status } : r));
      });
    } else {
      // Optimistic update (forcing maintenance regardless of occupancy)
      setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: 'Maintenance' } : r));
      api.updateRoomStatus(roomId, 'Maintenance').catch(() => {
        setRooms(prev => prev.map(r => r.id === roomId ? { ...r, status: room.status } : r));
      });
    }
  };

  const toggleFloorCollapse = (id) => setExpandedFloors(p => ({ ...p, [id]: !p[id] }));
  const toggleRoomExpand = (id) => setExpandedRooms(p => ({ ...p, [id]: !p[id] }));

  const handleBedClick = (room, bed) => {
    if (bed.status === 'OCCUPIED') {
      // Find tenant info
      const tenantInfo = tenants.find(t => t.name === bed.tenant || t.id === bed.tenantId) || { name: bed.tenant || 'Unknown Tenant', status: 'Active', room: `${room.roomNumber}-${bed.bedNumber}` };
      setSelectedTenantInfo({ ...tenantInfo, roomId: room.id, bedId: bed.id });
    } else {
      // Toggle if not occupied, or show action menu
      toggleBed(room.id, bed.id);
    }
  };

  const types = [...new Set(rooms.map(r => r.roomType).filter(Boolean))];

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading...</div>;

  const totalRooms = selectedBuildingId 
    ? rooms.filter(r => floors.some(f => f.id === r.floorId && f.buildingId === selectedBuildingId)).length 
    : rooms.length;
  const totalBedsCount = selectedBuildingId
    ? beds.filter(b => rooms.some(r => r.id === b.roomId && floors.some(f => f.id === r.floorId && f.buildingId === selectedBuildingId))).length
    : beds.length;
  const occupiedBedsCount = selectedBuildingId
    ? beds.filter(b => b.status === 'OCCUPIED' && rooms.some(r => r.id === b.roomId && floors.some(f => f.id === r.floorId && f.buildingId === selectedBuildingId))).length
    : beds.filter(b => b.status === 'OCCUPIED').length;
  const occupancyRate = totalBedsCount > 0 ? Math.round((occupiedBedsCount / totalBedsCount) * 100) : 0;

  const activeBuilding = buildings.find(b => (b.id || b._id) === selectedBuildingId);
  const buildingFloors = floors.filter(f => f.buildingId === selectedBuildingId);

  return (
    <div className="rooms-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BedDouble size={32} color="var(--accent-primary)" /> {activeBuilding?.name || 'Rooms & Beds'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{activeBuilding?.address || 'Hierarchical occupancy tracking.'}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            className="btn" 
            onClick={() => navigate(`/owner/building/${selectedBuildingId}/buildings`)}
            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--accent-primary)', fontWeight: '700' }}
          >
            <Building2 size={18} /> Manage Structure
          </button>
          <button className="btn" onClick={() => setShowFilters(!showFilters)} style={{ background: showFilters ? 'var(--bg-tertiary)' : 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
            <Filter size={16} /> Filters
          </button>
        </div>
      </header>

      {/* Stats Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Property Rooms</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginTop: '0.5rem' }}>{totalRooms}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Capacity (Beds)</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginTop: '0.5rem' }}>{totalBedsCount}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Occupancy Rate</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginTop: '0.5rem' }}>{occupancyRate}%</h2>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
        <button 
          onClick={() => setActiveTab('rooms')} 
          style={{ padding: '1rem 2rem', background: 'none', border: 'none', borderBottom: activeTab === 'rooms' ? '3px solid var(--accent-primary)' : '3px solid transparent', color: activeTab === 'rooms' ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '700', cursor: 'pointer' }}
        >
          Floors & Rooms
        </button>
        <button 
          onClick={() => setActiveTab('transfers')} 
          style={{ padding: '1rem 2rem', background: 'none', border: 'none', borderBottom: activeTab === 'transfers' ? '3px solid var(--accent-primary)' : '3px solid transparent', color: activeTab === 'transfers' ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Transfer Requests
          {transferRequests.filter(r => r.status === 'PENDING').length > 0 && (
            <span style={{ padding: '0.1rem 0.5rem', background: 'var(--accent-error)', color: 'white', borderRadius: '10px', fontSize: '0.7rem' }}>
              {transferRequests.filter(r => r.status === 'PENDING').length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'transfers' ? (
        /* Transfer Requests List (Omitted for brevity, kept same) */
        <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            {[
              { label: 'Total Requests', value: transferRequests.length, color: '#6366F1', bg: '#EDE9FE' },
              { label: 'Pending', value: transferRequests.filter(r => r.status === 'PENDING').length, color: '#D97706', bg: '#FEF3C7' },
              { label: 'Approved', value: transferRequests.filter(r => r.status === 'ACCEPTED').length, color: '#059669', bg: '#D1FAE5' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '1.2rem', borderLeft: `4px solid ${s.color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{s.label}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '900', color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                </div>
                <div style={{ padding: '0.6rem', borderRadius: '100px', background: s.bg, color: s.color, fontSize: '1.2rem' }}>
                  {s.label === 'Pending' ? '⏳' : s.label === 'Approved' ? '✅' : '📋'}
                </div>
              </div>
            ))}
          </div>

          {transferRequests.length === 0 ? (
            <div className="card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No room transfer requests found for this building.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {transferRequests.map(req => {
                const st = STATUS_STYLES[req.status] || STATUS_STYLES.PENDING;
                return (
                  <motion.div
                    key={req.id}
                    whileHover={{ y: -2, boxShadow: 'var(--shadow-lg)' }}
                    className="card"
                    style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', borderLeft: `4px solid ${st.color}` }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), #6366F1)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem', flexShrink: 0 }}>
                        {req.tenant?.name?.charAt(0) || 'U'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                          <h4 style={{ margin: 0, fontWeight: '800', fontSize: '1rem' }}>{req.tenant?.name || 'Unknown Tenant'}</h4>
                          <span style={{ padding: '0.2rem 0.7rem', borderRadius: '20px', fontSize: '0.65rem', fontWeight: '800', background: st.bg, color: st.color, textTransform: 'uppercase' }}>{st.label}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600', flexWrap: 'wrap' }}>
                          <span style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>{req.oldRoom}</span>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: '900' }}>→</span>
                          <span style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>{req.newRoom}</span>
                        </div>
                        {req.reason && <p style={{ margin: '0.5rem 0 0', fontSize: '0.78rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>💬 "{req.reason}"</p>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      {req.status === 'PENDING' ? (
                        <>
                          <button onClick={() => handleTransferStatus(req.id, 'ACCEPTED')} style={{ padding: '0.6rem 1.2rem', fontSize: '0.82rem', borderRadius: '10px', background: '#10B981', color: 'white', border: 'none', fontWeight: '800', cursor: 'pointer' }}>Approve</button>
                          <button onClick={() => handleTransferStatus(req.id, 'REJECTED')} style={{ padding: '0.6rem 1.2rem', fontSize: '0.82rem', borderRadius: '10px', background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5', fontWeight: '800', cursor: 'pointer' }}>Reject</button>
                        </>
                      ) : (
                        <span style={{ padding: '0.5rem 1.2rem', borderRadius: '10px', fontSize: '0.78rem', fontWeight: '800', background: st.bg, color: st.color }}>{st.label}</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Level 2+: Floor -> Room -> Bed */
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {buildingFloors.map(floor => {
              const floorRooms = rooms.filter(r => r.floorId === floor.id && (filterType === 'All' || r.roomType === filterType));
              if (floorRooms.length === 0) return null;
              
              return (
                <div key={floor.id} className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                  {/* Floor Accordion Header */}
                  <div 
                    onClick={() => toggleFloorCollapse(floor.id)} 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', paddingBottom: expandedFloors[floor.id] ? '1.5rem' : '0', borderBottom: expandedFloors[floor.id] ? '1px solid var(--border-color)' : 'none' }}
                  >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', background: 'var(--accent-primary)', color: 'white', borderRadius: '12px' }}>
                          <Layers size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>{floor.floorNumber}</h3>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{floorRooms.length} Rooms</p>
                        </div>
                      </div>
                      <div style={{ padding: '0.5rem', background: 'var(--bg-tertiary)', borderRadius: '50%' }}>
                        {expandedFloors[floor.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </div>
                    </div>

                    {/* Room Grid */}
                    <AnimatePresence>
                      {expandedFloors[floor.id] && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', paddingTop: '1.5rem' }}>
                            {floorRooms.map(room => {
                              const roomBeds = beds.filter(b => b.roomId === room.id);
                              const available = roomBeds.filter(b => b.status === 'AVAILABLE').length;
                              const occRate = roomBeds.length > 0 ? Math.round(((roomBeds.length - available) / roomBeds.length) * 100) : 0;
                              
                              return (
                                <div key={room.id} style={{ border: room.status === 'Maintenance' ? '2px dashed var(--accent-warning)' : '1px solid var(--border-color)', borderRadius: '16px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                                  {/* Room Header Info */}
                                  <div style={{ padding: '1.2rem', borderBottom: '1px solid var(--border-color)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                      <div>
                                        <h4 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '0 0 0.2rem 0' }}>Room {room.roomNumber}</h4>
                                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'var(--bg-tertiary)', borderRadius: '12px', fontWeight: '600' }}>{room.roomType}</span>
                                      </div>
                                      <div style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: `conic-gradient(var(--accent-primary) ${occRate}%, var(--bg-tertiary) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ width: '24px', height: '24px', background: 'var(--bg-secondary)', borderRadius: '50%' }} />
                                          </div>
                                          <span style={{ fontWeight: '800', fontSize: '1rem' }}>{roomBeds.length - available}/{roomBeds.length}</span>
                                        </div>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Beds Occupied</p>
                                      </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                      <button onClick={() => toggleRoomExpand(room.id)} className="btn btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', borderRadius: '8px' }}>
                                        {expandedRooms[room.id] ? 'Hide Beds' : 'View Beds'}
                                      </button>
                                      <button onClick={() => toggleMaintenance(room.id)} className="btn" style={{ padding: '0.5rem', fontSize: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: room.status === 'Maintenance' ? '#f59e0b20' : 'var(--bg-tertiary)', color: room.status === 'Maintenance' ? '#f59e0b' : 'var(--text-primary)' }}>
                                        <AlertTriangle size={14} />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Bed Grid (Expanded) */}
                                  <AnimatePresence>
                                    {expandedRooms[room.id] && (
                                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                                        <div style={{ padding: '1.2rem', background: 'var(--bg-tertiary)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '0.8rem' }}>
                                          {roomBeds.map(bed => {
                                            let bg = 'var(--bg-secondary)';
                                            let color = 'var(--text-secondary)';
                                            let border = 'var(--border-color)';
                                            
                                            if (bed.status === 'OCCUPIED') { bg = '#ef444415'; color = '#ef4444'; border = '#ef444450'; }
                                            else if (bed.status === 'AVAILABLE') { bg = '#10b98115'; color = '#10b981'; border = '#10b98150'; }
                                            else if (bed.status === 'RESERVED') { bg = '#f59e0b15'; color = '#f59e0b'; border = '#f59e0b50'; }

                                            return (
                                              <div 
                                                key={bed.id} 
                                                onClick={() => handleBedClick(room, bed)} 
                                                style={{ padding: '0', borderRadius: '12px', background: bg, border: `1px solid ${border}`, color: color, cursor: 'pointer', textAlign: 'center', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 0.2s', minHeight: '110px', position: 'relative' }}
                                              >
                                                <div style={{ 
                                                  height: '50px', 
                                                  width: '100%', 
                                                  backgroundImage: `url("${(bed.images && bed.images[0]) || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'}")`,
                                                  backgroundSize: 'cover',
                                                  backgroundPosition: 'center',
                                                  backgroundRepeat: 'no-repeat',
                                                  opacity: 0.9,
                                                  borderBottom: `1px solid ${border}`
                                                }} />
                                                <div style={{ padding: '0.5rem 0.4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.1rem' }}>
                                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                                    {bed.status === 'OCCUPIED' ? <User size={14} /> : <BedDouble size={14} />}
                                                    <span style={{ fontSize: '0.75rem', fontWeight: '800' }}>{bed.bedNumber}</span>
                                                  </div>
                                                  <span style={{ fontSize: '0.55rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.8 }}>
                                                    {bed.status === 'OCCUPIED' ? (bed.tenant || 'Occupied') : bed.status}
                                                  </span>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                        <div style={{ padding: '0.8rem 1.2rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                                           <button className="btn" style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}>Auto Allocate</button>
                                           <button className="btn" style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem' }}>Reserve</button>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      {/* Tenant Details Modal */}
      <AnimatePresence>
        {selectedTenantInfo && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedTenantInfo(null)} />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} style={{ position: 'relative', width: '100%', maxWidth: '400px', background: 'var(--bg-primary)', padding: '2rem', borderRadius: '24px', zIndex: 1001, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-2xl)' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedTenantInfo(null)} style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</button>
              </div>
              <div style={{ textAlign: 'center', marginTop: '-1rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '800', margin: '0 auto 1rem', boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)' }}>
                  {selectedTenantInfo.name.charAt(0)}
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.2rem' }}>{selectedTenantInfo.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Room {selectedTenantInfo.room}</p>
                
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: '16px', padding: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Status</span>
                    <span style={{ background: '#10b98120', color: '#10b981', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>ACTIVE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Rent Status</span>
                    <span style={{ fontWeight: '800' }}>Paid (Mar)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '600' }}>Stay Duration</span>
                    <span style={{ fontWeight: '800' }}>14 Months</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button onClick={() => { toggleBed(selectedTenantInfo.roomId, selectedTenantInfo.bedId); setSelectedTenantInfo(null); }} className="btn" style={{ flex: 1, fontWeight: '700', borderRadius: '12px', background: '#ef444415', color: '#ef4444', border: '1px solid #ef444430' }}>Vacate Bed</button>
                  <button className="btn btn-primary" style={{ flex: 1, fontWeight: '700', borderRadius: '12px' }}>Message</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Rooms;
