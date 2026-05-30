import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BedDouble, User, AlertTriangle, SlidersHorizontal,
  Settings2, History, Filter, Layers, ChevronDown, ChevronRight, Building2, FileText
} from 'lucide-react';
import { api } from '../api.js';
import socket, { connectSocket } from '../utils/socket';


const STATUS_STYLES = {
  PENDING: { bg: '#FEF3C7', color: '#D97706', label: 'Pending' },
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
  const [bedStats, setBedStats] = useState({ totalBeds: 0, filledBeds: 0, availableBeds: 0, occupancyPct: 0, hostelId: null });
  const [beds, setBeds] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hierarchy state
  const [selectedBuildingId, setSelectedBuildingId] = useState(activeBuildingId || null);
  const [expandedFloors, setExpandedFloors] = useState({});
  const [expandedRooms, setExpandedRooms] = useState({});
  const [selectedBedDetails, setSelectedBedDetails] = useState(null);

  const [filterType, setFilterType] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('rooms'); // 'rooms' or 'transfers'
  const [showBedLayoutModal, setShowBedLayoutModal] = useState(false);
  const [transferRequests, setTransferRequests] = useState([]);

  const loadRoomsData = useCallback(async () => {
    console.log("Rooms module fetching for ID:", activeBuildingId);
    setLoading(true);
    try {
      // Use building-scoped APIs to avoid cross-property data leakage
      const [b, f, r, bd, t, tr, bs] = await Promise.all([
        api.getBuildings(),
        activeBuildingId ? api.getFloorsByBuilding(activeBuildingId) : api.getAllFloors(),
        activeBuildingId ? api.getRoomsByBuilding(activeBuildingId) : api.getAllRooms(),
        activeBuildingId ? api.getBedsByBuilding(activeBuildingId) : api.getAllBeds(),
        api.getTenants(activeBuildingId),
        api.getRoomTransfers(activeBuildingId),
        api.getHostelBedStats(activeBuildingId).catch(() => ({ totalBeds: 0, filledBeds: 0, availableBeds: 0, occupancyPct: 0 }))
      ]);

      setBuildings(b || []);
      setFloors(f || []);
      setRooms(r || []);
      setBeds(bd || []);
      setTenants(t || []);
      // Server now pre-filters by buildingId, so no extra client filter needed
      setTransferRequests(tr || []);
      setBedStats(bs || { totalBeds: 0, filledBeds: 0, availableBeds: 0, occupancyPct: 0 });

      const fExp = {}; (f || []).forEach(x => fExp[x.id || x._id] = true);
      setExpandedFloors(fExp);

      if (activeBuildingId) setSelectedBuildingId(activeBuildingId);
    } catch (err) {
      console.error("Fetch error in Rooms:", err);
    } finally {
      setLoading(false);
    }
  }, [activeBuildingId]);

  useEffect(() => {
    loadRoomsData();
  }, [loadRoomsData]);

  useEffect(() => {
    window.addEventListener('focus', loadRoomsData);
    const interval = setInterval(loadRoomsData, 30000);

    // Reload stats when Buildings page adds a new bed
    const onStorage = (e) => {
      if (e.type === 'bedStatsUpdated' || (e.type === 'storage' && e.key === 'bedStatsUpdated')) {
        loadRoomsData();
      }
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('bedStatsUpdated', onStorage);

    return () => {
      window.removeEventListener('focus', loadRoomsData);
      clearInterval(interval);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('bedStatsUpdated', onStorage);
    };
  }, [loadRoomsData]);

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

  const refreshBedStats = async () => {
    try {
      const bs = await api.getHostelBedStats(activeBuildingId);
      setBedStats(bs || { totalRooms: 0, totalBeds: 0, filledBeds: 0, availableBeds: 0, occupancyPct: 0 });
    } catch (_) { }
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
    // Optimistic bedStats update
    setBedStats(prev => {
      const newFilled = newStatus === 'OCCUPIED'
        ? Math.min(prev.filledBeds + 1, prev.totalBeds || Infinity)
        : Math.max(prev.filledBeds - 1, 0);
      const newAvail = Math.max((prev.totalBeds || 0) - newFilled, 0);
      const pct = prev.totalBeds > 0 ? Math.round((newFilled / prev.totalBeds) * 100) : 0;
      return { ...prev, filledBeds: newFilled, availableBeds: newAvail, occupancyPct: pct };
    });

    // Fire and forget update (no await, no blocking re-fetch)
    api.updateBedStatus(bedId, newStatus, null)
      .then(async () => {
        // Ensure server-side hostel bed counts are synced from live beds
        try {
          if (activeBuildingId) await api.syncHostelBeds(activeBuildingId).catch(() => null);
        } catch (e) { /* ignore */ }
        refreshBedStats();
        try {
          if (!socket || !socket.connected) connectSocket();
          socket && socket.emit && socket.emit('dashboardStatsUpdated', { buildingId: activeBuildingId });
        } catch (e) {
          console.warn('Socket emit failed:', e);
        }
      })
      .catch(err => {
        console.error('Failed to update bed status:', err);
        // Revert quietly on actual failure
        setBeds(prev => prev.map(b => b.id === bedId ? { ...b, status: bed.status } : b));
        refreshBedStats();
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
    const tName = bed.tenant && typeof bed.tenant === 'object' ? bed.tenant.name : bed.tenant;
    const tId = bed.tenant && typeof bed.tenant === 'object' ? bed.tenant._id : (bed.tenantId || bed.tenant);

    const tenantInfo = tenants.find(t => t.id === tId || t.name === tName) || (bed.status === 'OCCUPIED' ? {
      name: tName || 'Unknown Tenant',
      status: 'Active',
      room: `Room ${room.roomNumber} - Bed ${bed.bedNumber}`
    } : null);

    setSelectedBedDetails({
      ...bed,
      roomInfo: room,
      tenantInfo: tenantInfo
    });
  };

  const types = [...new Set(rooms.map(r => r.roomType).filter(Boolean))];

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading...</div>;

  // Use server-calculated stats for accurate physical + virtual counts
  const totalRooms = bedStats.totalRooms || 0;
  const totalBedsCount = bedStats.totalBeds || 0;
  const occupiedBedsCount = bedStats.filledBeds || 0;
  const occupancyRate = bedStats.occupancyPct || 0;

  const activeBuilding = buildings.find(b => (b.id || b._id) === selectedBuildingId);
  const buildingFloors = floors.filter(f => {
    const fBldgId = typeof f.building === 'object' ? f.building._id : f.building;
    return fBldgId === selectedBuildingId;
  });

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

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', marginBottom: '2.5rem', background: 'var(--bg-tertiary)', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}
          >
            <span style={{ fontSize: '0.8rem', fontWeight: '950', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filter Infrastructure:</span>
            {['All', 'AC', 'Non-AC', 'Available', 'Occupied'].map(f => (
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
      </AnimatePresence>

      {/* Stats Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
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

      {/* ── No. of Beds Panel (Hostel-level availability) ── */}
      <div className="card" style={{
        padding: '1.8rem 2rem',
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
        border: '1px solid var(--border-color)',
        borderRadius: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BedDouble size={22} color="var(--accent-primary)" />
            <span style={{ fontWeight: '800', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>No. of Beds — Hostel Availability</span>
          </div>
          <span style={{
            padding: '0.3rem 0.9rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800',
            background: bedStats.occupancyPct >= 90 ? '#ef444420' : bedStats.occupancyPct >= 60 ? '#f59e0b20' : '#10b98120',
            color: bedStats.occupancyPct >= 90 ? '#ef4444' : bedStats.occupancyPct >= 60 ? '#f59e0b' : '#10b981'
          }}>
            {bedStats.occupancyPct}% Occupied
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.2rem', marginBottom: '1.4rem' }}>
          {[
            { label: 'Total Beds', value: bedStats.totalBeds, color: 'var(--accent-primary)', icon: '🛏️' },
            { label: 'Filled Beds', value: `${bedStats.filledBeds} / ${bedStats.totalBeds}`, color: '#ef4444', icon: '👤' },
            { label: 'Available Beds', value: bedStats.availableBeds, color: '#10b981', icon: '✅' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'var(--bg-primary)', borderRadius: '14px', padding: '1rem 1.2rem',
              border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.8rem'
            }}>
              <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{s.label}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '900', color: s.color, lineHeight: 1.2 }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span>Bed Occupancy</span>
            <span>{bedStats.filledBeds} filled out of {bedStats.totalBeds}</span>
          </div>
          <div style={{ height: '10px', borderRadius: '99px', background: 'var(--bg-primary)', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${bedStats.occupancyPct}%`,
              borderRadius: '99px',
              background: bedStats.occupancyPct >= 90
                ? 'linear-gradient(90deg,#ef4444,#dc2626)'
                : bedStats.occupancyPct >= 60
                  ? 'linear-gradient(90deg,#f59e0b,#d97706)'
                  : 'linear-gradient(90deg,#10b981,#059669)',
              transition: 'width 0.6s ease'
            }} />
          </div>
        </div>
      </div>
      {/* ────────────────────────────────────────────────── */}

      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2.5rem' }}>
                    <button
              className="btn"
              onClick={() => setShowBedLayoutModal(true)}
              style={{ padding: '1rem 2rem', background: 'none', border: 'none', borderBottom: activeTab === 'rooms' ? '3px solid var(--accent-primary)' : '3px solid transparent', color: activeTab === 'rooms' ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '700', cursor: 'pointer' }}
            >
              View Beds
            </button>
          
        <button
          onClick={() => setActiveTab('transfers')}
          style={{ padding: '1rem 2rem', background: 'none', border: 'none', borderBottom: activeTab === 'transfers' ? '3px solid var(--accent-primary)' : '3px solid transparent', color: activeTab === 'transfers' ? 'var(--accent-primary)' : 'var(--text-muted)', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Transfer Requests
          {transferRequests.filter(r => r.status === 'PENDING').length > 0 && (
            <span style={{ padding: '0.1rem 0.5rem', background: 'var(--accent-error)', color: "var(--text-on-primary)", borderRadius: '10px', fontSize: '0.7rem' }}>
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
                </div>``
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
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), #6366F1)', color: "var(--text-on-primary)", display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem', flexShrink: 0 }}>
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
                          <button onClick={() => handleTransferStatus(req.id, 'ACCEPTED')} style={{ padding: '0.6rem 1.2rem', fontSize: '0.82rem', borderRadius: '10px', background: '#10B981', color: "var(--text-on-primary)", border: 'none', fontWeight: '800', cursor: 'pointer' }}>Approve</button>
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
              const floorId = floor.id || floor._id;
              const floorRooms = rooms.filter(r => {
                const rFloorId = typeof r.floor === 'object' ? r.floor._id : r.floor;
                if (rFloorId !== floorId) return false;

                if (filterType === 'All') return true;
                if (filterType === 'AC') return r.isAC;
                if (filterType === 'Non-AC') return !r.isAC;

                const roomBeds = beds.filter(b => {
                  const bRoomId = typeof b.room === 'object' ? b.room._id : (b.room || b.roomId);
                  const targetRoomId = r.id || r._id;
                  return bRoomId === targetRoomId;
                });

                if (filterType === 'Available') return roomBeds.some(b => b.status === 'AVAILABLE') || r.status === 'AVAILABLE';
                if (filterType === 'Occupied') return roomBeds.length > 0 && !roomBeds.some(b => b.status === 'AVAILABLE');

                return r.roomType === filterType;
              });
              if (floorRooms.length === 0) return null;

              return (
                <div key={floor.id} className="card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                  {/* Floor Accordion Header */}
                  <div
                    onClick={() => toggleFloorCollapse(floor.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', paddingBottom: expandedFloors[floor.id] ? '1.5rem' : '0', borderBottom: expandedFloors[floor.id] ? '1px solid var(--border-color)' : 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ padding: '0.8rem', background: 'var(--accent-primary)', color: "var(--text-on-primary)", borderRadius: '12px' }}>
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
                            const roomBeds = beds.filter(b => {
                              const bRoomId = typeof b.room === 'object' ? b.room._id : (b.room || b.roomId);
                              const targetRoomId = room.id || room._id;
                              return bRoomId === targetRoomId;
                            });
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
                                                  {bed.status === 'OCCUPIED' ? (typeof bed.tenant === 'object' ? bed.tenant.name : bed.tenant || 'Occupied') : bed.status}
                                                </span>
                                                {bed.comfortScore > 0 && (
                                                  <span style={{ fontSize: '0.55rem', fontWeight: '800', color: '#f59e0b', marginTop: '0.2rem' }}>
                                                    ⭐ {bed.comfortScore}/10
                                                  </span>
                                                )}
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

        {/* Bed Layout Modal */}
        {showBedLayoutModal && (
          <AnimatePresence>
            <div style={{ position: 'fixed', inset: 0, zIndex: 4000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)' }}
                onClick={() => setShowBedLayoutModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '900px',
                  maxHeight: '90vh',
                  background: "var(--bg-card)",
                  borderRadius: '24px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 50px 100px -20px rgba(0,0,0,0.3)'
                }}
              >
                {/* Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: "var(--bg-card)", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Bed Layout</h2>
                  <button onClick={() => setShowBedLayoutModal(false)} style={{ background: '#F8FAFC', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px', padding: '0.5rem 1rem' }}>Close</button>
                </div>
                 {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1.5rem 1.5rem 0.5rem 1.5rem' }}>
                  <div style={{ background: 'var(--bg-primary)', borderRadius: '16px', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    <span style={{ fontSize: '1.5rem' }}>🛏️</span>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Beds</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-primary)' }}>{bedStats.totalBeds}</div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', borderRadius: '16px', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    <span style={{ fontSize: '1.5rem' }}>👤</span>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Filled Beds</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#ef4444' }}>{bedStats.filledBeds} / {bedStats.totalBeds}</div>
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-primary)', borderRadius: '16px', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                    <span style={{ fontSize: '1.5rem' }}>✅</span>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available Beds</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#10b981' }}>{bedStats.availableBeds}</div>
                    </div>
                  </div>
                </div>

                {/* Occupancy Bar */}
                <div style={{ padding: '0.5rem 1.5rem 1rem 1.5rem' }}>
                  <div style={{ background: '#e5e7eb', borderRadius: '99px', overflow: 'hidden', height: '12px' }}>
                    <div style={{ width: `${((bedStats.filledBeds || 0) / (bedStats.totalBeds || 1)) * 100}%`, background: '#10b981', height: '100%', borderRadius: '99px', transition: 'width 0.6s ease' }} />
                  </div>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                    Bed Occupancy: {bedStats.filledBeds} / {bedStats.totalBeds} ({Math.round(((bedStats.filledBeds || 0) / (bedStats.totalBeds || 1)) * 100)}% Occupied)
                  </div>
                </div>

                {/* Legend Above Grid */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', margin: '0.5rem 0 1.5rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '18px', height: '18px', background: '#10b981', borderRadius: '4px' }}></div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#10b981' }}>Available Bed</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '18px', height: '18px', background: '#ef4444', borderRadius: '4px' }}></div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ef4444' }}>Filled Bed</span>
                  </div>
                </div>

                {/* Grid */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 1.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '10px', width: 'fit-content' }}>
                    {Array.from({ length: bedStats.totalBeds || 100 }, (_, i) => {
                      const bedLabel = `${i + 1}`;
                      const occupied = i < (bedStats.filledBeds || 0);
                      return (
                        <div
                          key={i}
                          style={{
                            width: '64px',
                            height: '40px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            border: occupied ? '2px solid #ef4444' : '2px solid #10b981',
                            background: occupied ? '#ef4444' : '#ffffff',
                            color: occupied ? '#ffffff' : '#10b981',
                            boxShadow: occupied ? '0 1px 4px rgba(239,68,68,0.3)' : 'none',
                          }}
                        >
                          {bedLabel}
                        </div>
                      );
                    })}
                  </div>

                  {/* Legend Below Grid */}
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', fontSize: '0.85rem', color: '#10b981', fontWeight: '700' }}>
                    <span>💡 Red = Filled Bed</span>
                    <span style={{ color: 'var(--text-muted)' }}>|</span>
                    <span>Green = Available Bed</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </AnimatePresence>
        )}

      {/* Bed Details Modal */}
      <AnimatePresence>
        {selectedBedDetails && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000, padding: '1rem' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedBedDetails(null)} />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} style={{ position: 'relative', width: '100%', maxWidth: '440px', background: 'var(--bg-primary)', padding: '2rem', borderRadius: '24px', zIndex: 5001, border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-2xl)', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '900', margin: 0 }}>Bed Assets & Details</h3>
                <button onClick={() => setSelectedBedDetails(null)} style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>✕</button>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: '16px',
                  backgroundImage: `url("${(selectedBedDetails.images && selectedBedDetails.images[0]) || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-color)'
                }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>{selectedBedDetails.roomInfo.roomNumber} - Bed {selectedBedDetails.bedNumber}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedBedDetails.roomInfo.roomType} Room</p>
                  </div>
                  <span style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    background: selectedBedDetails.status === 'OCCUPIED' ? '#ef444415' : '#10b98115',
                    color: selectedBedDetails.status === 'OCCUPIED' ? '#ef4444' : '#10b981',
                    textTransform: 'uppercase'
                  }}>
                    {selectedBedDetails.status}
                  </span>
                </div>

                <div style={{ background: 'var(--bg-tertiary)', borderRadius: '20px', padding: '1.2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Hygiene Score</p>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--accent-primary)' }}>✨ {selectedBedDetails.roomInfo.hygieneRating || '4.5'}/5</div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Comfort Score</p>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#f59e0b' }}>⭐ {selectedBedDetails.comfortScore || '8.2'}/10</div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Last Sanitized</p>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{selectedBedDetails.lastSanitized ? new Date(selectedBedDetails.lastSanitized).toLocaleDateString() : '3 days ago'}</div>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ margin: '0 0 0.3rem 0', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Security</p>
                    <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>{selectedBedDetails.roomInfo.smartLock ? '🔒 Smart Lock' : 'Standard'}</div>
                  </div>
                </div>

                {selectedBedDetails.tenantInfo && (
                  <div style={{ textAlign: 'left', marginBottom: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '1rem' }}>
                    <p style={{ margin: '0 0 0.8rem 0', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Occupant</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', color: "var(--text-on-primary)", display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                        {selectedBedDetails.tenantInfo.name.charAt(0)}
                      </div>
                      <div>
                        <h5 style={{ margin: 0, fontWeight: '800' }}>{selectedBedDetails.tenantInfo.name}</h5>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {selectedBedDetails.tenantInfo.id?.slice(-6) || 'T-9921'}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  {selectedBedDetails.status === 'OCCUPIED' ? (
                    <button
                      onClick={() => { toggleBed(selectedBedDetails.roomInfo.id, selectedBedDetails.id); setSelectedBedDetails(null); }}
                      className="btn"
                      style={{ flex: 1, fontWeight: '800', borderRadius: '12px', background: '#ef444415', color: '#ef4444', border: '1px solid #ef444430', padding: '0.8rem' }}
                    >
                      Vacate Bed
                    </button>
                  ) : (
                    <button
                      onClick={() => { toggleBed(selectedBedDetails.roomInfo.id, selectedBedDetails.id); setSelectedBedDetails(null); }}
                      className="btn btn-primary"
                      style={{ flex: 1, fontWeight: '800', borderRadius: '12px', padding: '0.8rem' }}
                    >
                      Allocate Bed
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      await api.markBedSanitized(selectedBedDetails.id);
                      setSelectedBedDetails(null);
                      // Refresh parent
                      window.location.reload();
                    }}
                    className="btn"
                    style={{ flex: 1, fontWeight: '800', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', padding: '0.8rem' }}
                  >
                    Sanitize Bed
                  </button>
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
