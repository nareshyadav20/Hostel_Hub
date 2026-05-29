import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import {
  Users, FileText, X, AlertCircle, Calendar, Layers, Plus,
  Trash2, Search, Check, ShieldCheck, AlertTriangle, TrendingUp,
  TrendingDown, Star, ChevronRight, Download, Edit3, MessageSquare,
  Clock, MapPin, CheckCircle, CreditCard, Filter, ArrowRight
} from 'lucide-react';
import { api } from '../api';
import { clearAllCache } from '../cache';

// Generic Modal Component
const Modal = ({ isOpen, onClose, title, children, maxWidth = '600px' }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, background: "var(--modal-overlay)",
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, backdropFilter: 'blur(10px)', padding: '1rem'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 50, opacity: 0, scale: 0.95 }}
          className="card"
          onClick={e => e.stopPropagation()}
          style={{
            width: '94%', maxWidth, padding: '0',
            maxHeight: '94vh', overflowY: 'auto', background: "var(--bg-tertiary)",
            borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: "1px solid var(--border-color)", display: 'flex', flexDirection: 'column'
          }}
        >
          <div style={{ padding: '1.5rem 2rem', background: "var(--bg-card)", borderBottom: "1px solid var(--border-color)", display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: "var(--text-main)", letterSpacing: '-0.02em', margin: 0 }}>{title}</h2>
            <button onClick={onClose} style={{ background: "var(--bg-main)", border: 'none', color: "var(--text-secondary)", cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <X size={20} />
            </button>
          </div>
          <div style={{ padding: '2rem' }}>
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Tenants = () => {
  const { buildingId: urlBuildingId } = useParams();

  // Step 1: Restore context
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  // Base State
  const [tenants, setTenants] = useState([]);

  const [selectedTenant, setSelectedTenant] = useState(null);
  const [profileTab, setProfileTab] = useState('Overview');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState('UPI');

  // Bulk Register State (PRESERVED)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isBulkRegisterModalOpen, setIsBulkRegisterModalOpen] = useState(false);
  const [manualRows, setManualRows] = useState([
    { id: 'initial-row-01', name: '', phone: '', building: activeBuildingId || '', floor: '', room: '', bed: '', rent: '', deposit: '', doc: null }
  ]);
  const [infrastructure, setInfrastructure] = useState({ buildings: [], floors: [], rooms: [], beds: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [modalMode, setModalMode] = useState('add');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    console.log("Tenants module fetching for ID:", activeBuildingId);
    fetchTenants();

    if (activeBuildingId) {
      import('../utils/socket').then(({ default: socket, connectSocket, disconnectSocket }) => {
        connectSocket(activeBuildingId);

        const refreshTenants = () => {
          console.log('🔄 Tenants updated via socket');
          clearAllCache(); // Clear HH cache to ensure fresh data
          fetchTenants();
        };

        socket.on('tenantAdded', refreshTenants);
        socket.on('tenantUpdated', refreshTenants);
        socket.on('tenantDeleted', refreshTenants);
        socket.on('dashboardStatsUpdated', refreshTenants);

        return () => {
          socket.off('tenantAdded', refreshTenants);
          socket.off('tenantUpdated', refreshTenants);
          socket.off('tenantDeleted', refreshTenants);
          socket.off('dashboardStatsUpdated', refreshTenants);
        };
      });
    }
  }, [activeBuildingId]);

  useEffect(() => {
    if (isBulkRegisterModalOpen || isRegisterModalOpen) {
      const fetchInfra = async () => {
        setIsLoading(true);
        try {
          const [b, f, r, bd] = await Promise.all([
            api.getBuildings(),
            api.getAllFloors(),
            api.getAllRooms(),
            api.getAllBeds()
          ]);
          const filteredB = activeBuildingId ? b.filter(x => (x.id || x._id) === activeBuildingId) : b;
          setInfrastructure({ buildings: filteredB, floors: f, rooms: r, beds: bd });
        } catch (err) {
          console.error("Failed to fetch infrastructure", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchInfra();
    }
  }, [isBulkRegisterModalOpen, isRegisterModalOpen, activeBuildingId]);

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTenants(activeBuildingId);
      if (!data) {
        setTenants([]);
        setIsLoading(false);
        return;
      }

      // Normalize backend field names → UI field names
      const normalized = data.map(t => ({
        id: t._id || t.id,
        name: t.name || 'Unknown',
        email: t.email || '',
        phone: t.phone || t.contact || '',
        room: t.room || t.roomNumber || 'Unassigned',
        rent: t.rent || 0,
        status: t.status || 'ACTIVE',
        rentStatus: t.rentStatus || 'PENDING',
        checkIn: t.checkInDate
          ? new Date(t.checkInDate).toISOString().split('T')[0]
          : (t.checkIn || 'N/A'),
        emergencyContact: t.emergencyContact || 'N/A',
        buildingId: t.buildingId?._id || t.buildingId || null,
        score: t.score ?? 4.5,
        plan: t.messPlan || t.plan || 'Standard',
        lastPayment: t.lastPayment || 'N/A',
        docs: t.docs || (t.aadhaar ? [{ name: 'Aadhar Card', verified: true }] : []),
      }));

      // Filter by activeBuildingId if we're on a specific building route
      const filtered = activeBuildingId
        ? normalized.filter(t => t.buildingId === activeBuildingId)
        : normalized;

      setTenants(filtered);
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
      // Show error state or empty state if needed
    } finally {
      setIsLoading(false);
    }
  };

  const [registerFormData, setRegisterFormData] = useState({
    name: '', email: '', phone: '', room: '', rent: '', checkIn: '', emergencyContact: '',
    aadhaar: '', document: null, messPlan: 'basic',
    vegNonVegPreference: 'Any',
    budgetRange: '₹5,000 - ₹10,000', sleepTiming: 'Early Bird', primaryLanguage: '', targetStayDuration: '1 Year',
    preferences: { windowSide: false, lowerBunk: false, quietArea: false, nearChargingPort: false, studyFriendlyZone: false }
  });
  const [recommendedBeds, setRecommendedBeds] = useState([]);
  const [isRecommending, setIsRecommending] = useState(false);

  const handleRecommendBeds = async () => {
    if (!registerFormData.buildingId && !activeBuildingId) {
      alert('Please select a building first.');
      return;
    }
    setIsRecommending(true);
    try {
      const beds = await api.recommendBeds(registerFormData.buildingId || activeBuildingId, registerFormData.preferences);
      setRecommendedBeds(beds);
      if (beds.length > 0) {
        // Auto select best match
        setRegisterFormData(prev => ({ ...prev, roomId: beds[0].room._id || beds[0].room, bedId: beds[0].id || beds[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRecommending(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === 'edit') {
        const updated = await api.updateTenant(selectedTenant.id, registerFormData);
        setTenants(tenants.map(t => t.id === updated.id ? updated : t));
        setSelectedTenant(updated);
      } else {
        const payload = {
          ...registerFormData,
          buildingId: activeBuildingId, // IMPORTANT: Link to building
          status: 'ACTIVE'
        };
        const created = await api.addTenant(payload);
        setTenants([...tenants, created]);
      }
      setIsRegisterModalOpen(false);
      setRegisterFormData({ name: '', email: '', phone: '', room: '', rent: '', checkIn: '', emergencyContact: '', aadhaar: '', document: null, budgetRange: '₹5,000 - ₹10,000', sleepTiming: 'Early Bird', primaryLanguage: '', targetStayDuration: '1 Year', vegNonVegPreference: 'Any', preferences: { windowSide: false, lowerBunk: false, quietArea: false, nearChargingPort: false, studyFriendlyZone: false } });
    } catch (err) {
      console.error('Failed to save tenant:', err);
      alert('Error saving tenant. Please check backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = () => {
    setRegisterFormData({
      name: selectedTenant.name,
      email: selectedTenant.email,
      phone: selectedTenant.phone,
      room: selectedTenant.room,
      rent: selectedTenant.rent,
      checkIn: selectedTenant.checkIn,
      emergencyContact: selectedTenant.emergencyContact,
      aadhaar: selectedTenant.docs?.find(d => d.name === 'Aadhar Card')?.id || '',
      document: selectedTenant.docs?.find(d => d.name === 'ID Proof') || null,
      messPlan: selectedTenant.messPlan || 'basic',
      vegNonVegPreference: selectedTenant.vegNonVegPreference || selectedTenant.foodPreference || 'Any',
      budgetRange: selectedTenant.budgetRange || '₹5,000 - ₹10,000',
      sleepTiming: selectedTenant.sleepTiming || 'Early Bird',
      primaryLanguage: selectedTenant.primaryLanguage || '',
      targetStayDuration: selectedTenant.targetStayDuration || '1 Year',
      preferences: selectedTenant.preferences || { windowSide: false, lowerBunk: false, quietArea: false, nearChargingPort: false, studyFriendlyZone: false }
    });
    setRecommendedBeds([]);
    setModalMode('edit');
    setIsRegisterModalOpen(true);
  };

  const handleDownloadContract = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const contractText = `RESIDENTIAL LEASE AGREEMENT\nTENANT: ${selectedTenant.name}\nROOM: ${selectedTenant.room}`;
    const blob = new Blob([contractText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Contract_${selectedTenant.name.replace(/\\s/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    setIsDownloading(false);
  };
  const handleBulkRegisterSubmit = async () => {
    setIsSubmitting(true);
    try {
      const tenantsToCreate = manualRows
        .filter(row => row.name && row.phone)
        .map(row => {
          const bName = infrastructure.buildings.find(b => b.id === row.building)?.name || 'N/A';
          const rName = infrastructure.rooms.find(r => r.id === row.room)?.roomNumber || 'TBD';
          const bedName = infrastructure.beds.find(b => b.id === row.bed)?.bedNumber || '';

          return {
            name: row.name,
            email: `${row.name.toLowerCase().replace(/\s/g, '')}@example.com`,
            phone: row.phone,
            emergencyContact: 'N/A',
            room: `${bName}-${rName}${bedName ? '-' + bedName : ''}`,
            roomId: row.room || null,
            bedId: row.bed || null,
            buildingId: row.building || activeBuildingId,
            rent: parseInt(row.rent) || 6500,
            status: 'ACTIVE',
            checkInDate: new Date(),
            messPlan: 'standard'
          };
        });

      if (tenantsToCreate.length > 0) {
        const created = await api.bulkAddTenants(tenantsToCreate);
        // Normalize the created tenants for local state
        const normalized = created.map(t => ({
          id: t._id || t.id,
          name: t.name,
          email: t.email,
          phone: t.phone,
          room: t.room,
          rent: t.rent,
          status: t.status,
          rentStatus: t.rentStatus || 'PENDING',
          checkIn: t.checkInDate ? new Date(t.checkInDate).toISOString().split('T')[0] : 'N/A',
          buildingId: t.buildingId
        }));
        setTenants([...tenants, ...normalized]);
        setIsBulkRegisterModalOpen(false);
        setManualRows([{ id: 'new-row-' + Date.now(), name: '', phone: '', building: '', floor: '', room: '', bed: '', rent: '', deposit: '', doc: null }]);
      }
    } catch (err) {
      console.error('Bulk registration failed:', err);
      alert('Bulk registration failed. Please check your data and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // UI Helpers
  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', background: "var(--bg-green-soft)", color: "var(--text-green)" }}>ACTIVE</span>;
      case 'LEFT': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', background: "var(--bg-main)", color: "var(--text-secondary)" }}>LEFT</span>;
      case 'PENDING': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', background: "var(--bg-yellow-soft)", color: "var(--text-yellow)" }}>PENDING</span>;
      case 'RISK': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', background: "var(--bg-red-soft)", color: "var(--text-red)" }}>RISK</span>;
      default: return null;
    }
  };

  const getRentBadge = (status) => {
    if (status === 'PAID') return <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '800', background: "var(--bg-green-soft)", color: "var(--text-green)", display: 'flex', alignItems: 'center', gap: '0.2rem' }}><CheckCircle size={10} /> PAID</span>;
    return <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '800', background: "var(--bg-red-soft)", color: "var(--text-red)", display: 'flex', alignItems: 'center', gap: '0.2rem' }}><AlertTriangle size={10} /> DUE</span>;
  };

  const inputStyle = {
    padding: '0.75rem 1rem', borderRadius: '10px', border: "1px solid var(--border-color)",
    background: "var(--bg-card)", color: "var(--text-main)", width: '100%', fontSize: '0.9rem', outline: 'none', transition: 'border 0.2s'
  };

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.phone.includes(search);
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalActive = tenants.filter(t => t.status === 'ACTIVE').length;
  const pendingPaymentsCount = tenants.filter(t => t.rentStatus === 'PENDING').length;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', minHeight: '100vh', background: "var(--bg-tertiary)", padding: '0.5rem' }}>
      {/* SaaS Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: "var(--text-primary)", marginBottom: '0.2rem', letterSpacing: '-0.03em' }}>
            Tenants Management
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: '1rem', fontWeight: '500', margin: 0 }}>Overview, tracking, and lifecycle management.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text" placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: "1px solid var(--border-color)", width: '250px', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <button className="btn" onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)} style={{ background: filterStatus !== 'ALL' ? "var(--bg-blue-soft)" : "var(--bg-card)", border: filterStatus !== 'ALL' ? "1px solid var(--text-blue)" : "1px solid var(--border-color)", color: filterStatus !== 'ALL' ? "var(--text-blue)" : "var(--text-muted)", padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
              <Filter size={16} /> {filterStatus === 'ALL' ? 'Filters' : filterStatus}
            </button>
            {isFilterDropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 100, width: '150px', overflow: 'hidden' }}>
                {['ALL', 'ACTIVE', 'PENDING', 'LEFT', 'RISK'].map(status => (
                  <div key={status} onClick={() => { setFilterStatus(status); setIsFilterDropdownOpen(false); }} style={{ padding: '0.8rem 1rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', background: filterStatus === status ? "var(--bg-tertiary)" : "var(--bg-card)", color: filterStatus === status ? "var(--text-blue)" : "var(--text-muted)", borderBottom: "1px solid var(--border-color)" }}>
                    {status === 'ALL' ? 'All Statuses' : status}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PRESERVED BULK REGISTER BUTTON */}
          <button className="btn" onClick={() => setIsBulkRegisterModalOpen(true)} style={{ background: "var(--bg-card)", border: "1px solid var(--text-blue)", color: "var(--text-blue)", padding: '0.75rem 1.2rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <Layers size={18} /> Bulk Register
          </button>

          <button className="btn btn-primary" onClick={() => { setModalMode('add'); setIsRegisterModalOpen(true); }} style={{ background: "var(--text-blue)", border: 'none', padding: '0.75rem 1.2rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <Plus size={18} /> Add Tenant
          </button>

          <button onClick={() => window.history.back()} className="btn" style={{ padding: '0.7rem', borderRadius: '50%', background: "var(--bg-card)", border: "1px solid var(--border-color)", color: "var(--text-secondary)", display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '0.5rem' }}>
            <X size={20} />
          </button>
        </div>
      </header>

      {/* KPI Dashboard (Bento Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: "var(--bg-card)", padding: '1.5rem', borderRadius: '16px', border: "1px solid var(--border-color)", boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <p style={{ color: "var(--text-secondary)", fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={14} /> Total Tenants</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: "var(--text-primary)", margin: 0 }}>{tenants.length}</h2>
            <span style={{ color: "var(--text-green)", fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center' }}><TrendingUp size={14} /> +12%</span>
          </div>
        </div>
        <div style={{ background: "var(--bg-card)", padding: '1.5rem', borderRadius: '16px', border: "1px solid var(--border-color)", boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderBottom: "4px solid var(--color-green)" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle size={14} /> Active Occupants</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: "var(--text-primary)", margin: 0 }}>{totalActive}</h2>
          </div>
        </div>
        <div style={{ background: "var(--bg-card)", padding: '1.5rem', borderRadius: '16px', border: "1px solid var(--border-color)", boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <p style={{ color: "var(--text-secondary)", fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><TrendingDown size={14} /> Leaving Soon</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: "var(--text-primary)", margin: 0 }}>2</h2>
            <span style={{ color: "var(--text-yellow)", fontSize: '0.85rem', fontWeight: '700' }}>In next 15 days</span>
          </div>
        </div>
        <div style={{ background: "var(--bg-card)", padding: '1.5rem', borderRadius: '16px', border: "1px solid var(--border-color)", boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderBottom: "4px solid var(--text-red)" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CreditCard size={14} /> Pending Dues</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: "var(--text-red)", margin: 0 }}>{pendingPaymentsCount}</h2>
            <span style={{ color: "var(--text-red)", fontSize: '0.85rem', fontWeight: '700' }}>Action Req.</span>
          </div>
        </div>
      </div>

      {/* Tenant List Hybrid Layout */}
      <div style={{ background: "var(--bg-card)", borderRadius: '16px', border: "1px solid var(--border-color)", boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: "var(--bg-tertiary)", borderBottom: "1px solid var(--border-color)" }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: "var(--text-secondary)", fontSize: '0.8rem', textTransform: 'uppercase' }}>Tenant Profile</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: "var(--text-secondary)", fontSize: '0.8rem', textTransform: 'uppercase' }}>Room & Plan</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: "var(--text-secondary)", fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: "var(--text-secondary)", fontSize: '0.8rem', textTransform: 'uppercase' }}>Insights</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((tenant) => (
              <tr
                key={tenant.id}
                className="tenant-row-hover"
                style={{ borderBottom: "1px solid var(--border-color)", transition: 'all 0.2s', cursor: 'pointer' }}
                onClick={() => { setSelectedTenant(tenant); setProfileTab('Overview'); }}
              >
                <td style={{ padding: '1.2rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: "var(--bg-blue-soft)", border: "1px solid var(--color-blue)", color: "var(--text-blue)", display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '800' }}>
                      {tenant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: '800', fontSize: '1rem', color: "var(--text-primary)", margin: 0, marginBottom: '2px' }}>{tenant.name}</p>
                      <p style={{ fontSize: '0.8rem', color: "var(--text-secondary)", margin: 0 }}>{tenant.phone}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.2rem 1.5rem' }}>
                  <p style={{ fontWeight: '800', fontSize: '0.95rem', color: "var(--text-primary)", margin: 0, marginBottom: '4px' }}>{tenant.room}</p>
                  <p style={{ fontSize: '0.8rem', color: "var(--text-secondary)", margin: 0, fontWeight: '600' }}>{tenant.plan} Room</p>
                </td>
                <td style={{ padding: '1.2rem 1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
                    {getStatusBadge(tenant.status)}
                    {getRentBadge(tenant.rentStatus)}
                  </div>
                </td>
                <td style={{ padding: '1.2rem 1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: "var(--text-muted)", fontWeight: '600' }}>
                      <Star size={14} color="var(--text-yellow)" fill="var(--text-yellow)" /> {tenant.score} Score
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: "var(--text-secondary)" }}>
                      <Clock size={12} /> Since {tenant.checkIn}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                  <div className="row-actions" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', opacity: 0, transition: 'opacity 0.2s' }}>
                    <button className="btn" onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${tenant.phone.replace(/[^0-9]/g, '')}?text=Hello ${tenant.name},`, '_blank'); }} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: '0.5rem', borderRadius: '8px', color: "var(--text-blue)" }} title="Send Message">
                      <MessageSquare size={16} />
                    </button>
                    <button className="btn" onClick={(e) => { e.stopPropagation(); setSelectedTenant(tenant); setProfileTab('Payments'); }} style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: '0.5rem', borderRadius: '8px', color: "var(--text-green)" }} title="Collect Rent">
                      <CreditCard size={16} />
                    </button>
                    <ChevronRight size={20} color="var(--text-muted)" style={{ alignSelf: 'center', marginLeft: '0.5rem' }} />
                  </div>
                </td>
              </tr>
            ))}
            {filteredTenants.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: "var(--text-secondary)", fontWeight: '600' }}>No tenants found matching criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* NEW TENANT PROFILE MODAL */}
      <Modal isOpen={!!selectedTenant} onClose={() => setSelectedTenant(null)} title="Resident Profile" maxWidth="850px">
        {selectedTenant && (
          <div style={{ display: 'flex', gap: '2rem' }}>
            {/* Left Column: Main Profile */}
            <div style={{ flex: '1' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: "var(--bg-blue-soft)", border: '2px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900', color: "var(--text-blue)", boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)' }}>
                  {selectedTenant.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', color: "var(--text-primary)", margin: 0, marginBottom: '0.4rem', letterSpacing: '-0.03em' }}>{selectedTenant.name}</h2>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: '800', fontSize: '1rem', color: "var(--text-muted)" }}>Room {selectedTenant.room}</span>
                    {getStatusBadge(selectedTenant.status)}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: '700', color: "var(--text-yellow)" }}><Star size={14} fill="var(--text-yellow)" /> {selectedTenant.score} / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '1rem', borderBottom: "1px solid var(--border-color)", marginBottom: '1.5rem' }}>
                {['Overview', 'Payments', 'Stay Details', 'Documents'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setProfileTab(tab)}
                    style={{
                      background: 'transparent', border: 'none', padding: '0.8rem 1rem', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer',
                      color: profileTab === tab ? "var(--text-blue)" : "var(--text-secondary)",
                      borderBottom: profileTab === tab ? "3px solid var(--text-blue)" : '3px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div style={{ minHeight: '300px' }}>
                {profileTab === 'Overview' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ background: "var(--bg-tertiary)", padding: '1.2rem', borderRadius: '12px', border: "1px solid var(--border-color)" }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: "var(--text-secondary)", textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email & Phone</p>
                        <p style={{ fontWeight: '700', color: "var(--text-primary)", margin: '0 0 0.3rem 0' }}>{selectedTenant.phone}</p>
                        <p style={{ fontSize: '0.85rem', color: "var(--text-muted)", margin: 0 }}>{selectedTenant.email}</p>
                      </div>
                      <div style={{ background: "var(--bg-red-soft)", padding: '1.2rem', borderRadius: '12px', border: "1px solid var(--danger-border)" }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: "var(--text-red)", textTransform: 'uppercase', marginBottom: '0.5rem' }}>Emergency Contact</p>
                        <p style={{ fontWeight: '800', color: "var(--text-red)", margin: 0 }}>{selectedTenant.emergencyContact}</p>
                      </div>
                    </div>

                    {/* Lifecycle Pipeline */}
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '800', color: "var(--text-primary)", marginBottom: '1rem' }}>Lifecycle Pipeline</h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: "var(--bg-tertiary)", padding: '1rem 2rem', borderRadius: '12px', border: "1px solid var(--border-color)" }}>
                        {['Applicant', 'Approved', 'Active', 'Notice'].map((step, i) => {
                          const isActive = step.toUpperCase() === selectedTenant.status || (step === 'Active' && selectedTenant.status === 'ACTIVE');
                          const isPast = ['Applicant', 'Approved'].includes(step) || (step === 'Active' && selectedTenant.status === 'LEFT');
                          return (
                            <React.Fragment key={step}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: isActive || isPast ? "var(--text-blue)" : "var(--border-color)", display: 'flex', alignItems: 'center', justifyContent: 'center', color: "var(--text-on-primary)" }}>
                                  {isPast && !isActive ? <Check size={14} /> : <div style={{ width: '8px', height: '8px', background: "var(--bg-card)", borderRadius: '50%' }} />}
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: isActive ? '800' : '600', color: isActive ? "var(--text-primary)" : "var(--text-secondary)" }}>{step}</span>
                              </div>
                              {i < 3 && <div style={{ height: '2px', flex: 1, background: isPast ? "var(--text-blue)" : "var(--border-color)", margin: '0 1rem', marginTop: '-1rem' }} />}
                            </React.Fragment>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {profileTab === 'Payments' && (
                  <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ background: "var(--bg-tertiary)", padding: '1.5rem', borderRadius: '12px', border: "1px solid var(--border-color)", marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: '700', color: "var(--text-secondary)", textTransform: 'uppercase', marginBottom: '0.3rem' }}>Monthly Rent</p>
                        <p style={{ fontSize: '1.8rem', fontWeight: '900', color: "var(--text-primary)", margin: 0 }}>₹{selectedTenant.rent}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: '700', color: "var(--text-secondary)", textTransform: 'uppercase', marginBottom: '0.3rem' }}>Status</p>
                        {getRentBadge(selectedTenant.rentStatus)}
                      </div>
                    </div>
                    {selectedTenant.rentStatus === 'PENDING' && (
                      <div style={{ background: "var(--bg-card)", padding: '1.5rem', borderRadius: '12px', border: "1px solid var(--border-color)", marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: "var(--text-primary)", textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CreditCard size={16} color="var(--text-blue)" /> Record Payment</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1.2rem' }}>
                          {['UPI', 'Cash', 'Bank Transfer'].map(mode => (
                            <button
                              key={mode}
                              onClick={() => setPaymentMode(mode)}
                              style={{
                                background: paymentMode === mode ? "var(--bg-blue-soft)" : "var(--bg-tertiary)",
                                border: paymentMode === mode ? "2px solid var(--text-blue)" : "1px solid var(--border-color)",
                                padding: '0.8rem', borderRadius: '8px', fontWeight: '800',
                                color: paymentMode === mode ? "var(--text-blue)" : "var(--text-secondary)",
                                cursor: 'pointer', transition: 'all 0.15s'
                              }}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <button
                            className="btn"
                            disabled={isSubmitting}
                            onClick={async () => {
                              setIsSubmitting(true);
                              try {
                                const payload = {
                                  tenantId: selectedTenant.id || selectedTenant._id,
                                  amount: Number(selectedTenant.rent),
                                  type: 'Rent',
                                  method: paymentMode,
                                  buildingId: activeBuildingId,
                                  status: 'Paid',
                                  month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
                                };
                                await api.addPayment(payload);

                                // Also update tenant's rent status locally
                                const updatedTenant = { ...selectedTenant, rentStatus: 'PAID' };
                                await api.updateTenant(selectedTenant.id || selectedTenant._id, { rentStatus: 'PAID' });

                                setTenants(prev => prev.map(t => (t.id === selectedTenant.id || t._id === selectedTenant._id) ? updatedTenant : t));
                                setSelectedTenant(updatedTenant);

                                alert(`Successfully collected ₹${selectedTenant.rent} via ${paymentMode}`);
                              } catch (err) {
                                alert("Failed to collect rent: " + (err.response?.data?.error || err.message));
                              } finally {
                                setIsSubmitting(false);
                              }
                            }}
                            style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: "var(--text-green)", color: "var(--text-on-primary)", fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                          >
                            <CheckCircle size={18} /> {isSubmitting ? 'Processing...' : 'Collect Rent'}
                          </button>
                          <button className="btn" onClick={() => window.location.href = `mailto:${selectedTenant.email}?subject=Rent Due Reminder`} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: "var(--bg-red-soft)", border: "1px solid var(--danger-border)", color: "var(--text-red)", fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={18} /> Send Reminder
                          </button>
                        </div>
                      </div>
                    )}
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: "var(--text-primary)", margin: '1.5rem 0 1rem 0' }}>Recent History</h3>
                    <div style={{ padding: '1rem', background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: '12px', color: "var(--text-muted)", fontSize: '0.9rem', fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Rent Payment - {selectedTenant.lastPayment}</span>
                      <span style={{ color: "var(--text-green)", fontWeight: '800' }}>₹{selectedTenant.rent} PAID</span>
                    </div>
                  </div>
                )}

                {profileTab === 'Stay Details' && (
                  <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ background: "var(--bg-tertiary)", padding: '1.2rem', borderRadius: '12px', border: "1px solid var(--border-color)" }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: "var(--text-secondary)", textTransform: 'uppercase', marginBottom: '0.5rem' }}>Check-in Date</p>
                        <p style={{ fontWeight: '800', color: "var(--text-primary)", margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={16} /> {selectedTenant.checkIn}</p>
                      </div>
                      <div style={{ background: "var(--bg-tertiary)", padding: '1.2rem', borderRadius: '12px', border: "1px solid var(--border-color)" }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: "var(--text-secondary)", textTransform: 'uppercase', marginBottom: '0.5rem' }}>Plan Details</p>
                        <p style={{ fontWeight: '800', color: "var(--text-primary)", margin: 0 }}>{selectedTenant.plan} Sharing</p>
                      </div>
                    </div>
                    {/* Auto Room Suggestion widget */}
                    <div style={{ background: "var(--bg-blue-soft)", padding: '1.5rem', borderRadius: '12px', border: "1px solid var(--color-blue)" }}>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: "var(--text-blue)", margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} /> Auto Room Suggestion</h3>
                      <p style={{ fontSize: '0.85rem', color: "var(--text-blue)", margin: '0 0 1rem 0', fontWeight: '500' }}>Based on preferences, if tenant needs to relocate:</p>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <span style={{ padding: '0.5rem 1rem', background: "var(--bg-card)", borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', color: "var(--text-blue)", border: "1px solid var(--color-blue)" }}>Room 205-C (Vacant)</span>
                        <span style={{ padding: '0.5rem 1rem', background: "var(--bg-card)", borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', color: "var(--text-blue)", border: "1px solid var(--color-blue)" }}>Room 102-B (Vacant)</span>
                      </div>
                    </div>
                  </div>
                )}

                {profileTab === 'Documents' && (
                  <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {selectedTenant.docs?.map((d, i) => (
                        <div key={i} style={{ background: "var(--bg-tertiary)", padding: '1rem 1.5rem', borderRadius: '12px', border: "1px solid var(--border-color)", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: "var(--bg-card)", borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: "1px solid var(--border-color)" }}>
                              <FileText size={20} color="var(--text-blue)" />
                            </div>
                            <div>
                              <p style={{ fontWeight: '800', fontSize: '0.95rem', color: "var(--text-primary)", margin: 0 }}>{d.name}</p>
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: d.verified ? "var(--text-green)" : "var(--text-yellow)", display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                                <ShieldCheck size={12} /> {d.verified ? 'Verified' : 'Pending Verification'}
                              </span>
                            </div>
                          </div>
                          <button className="btn" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: '700', color: "var(--text-blue)" }}>View</button>
                        </div>
                      ))}
                      {(!selectedTenant.docs || selectedTenant.docs.length === 0) && (
                        <div style={{ padding: '3rem', textAlign: 'center', border: "2px dashed var(--border-color)", borderRadius: '12px' }}>
                          <p style={{ color: "var(--text-secondary)", fontWeight: '600' }}>No documents uploaded yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Smart Actions */}
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: "var(--bg-tertiary)", padding: '1.2rem', borderRadius: '16px', border: "1px solid var(--border-color)" }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: '800', color: "var(--text-primary)", textTransform: 'uppercase', marginBottom: '1rem' }}>Smart Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <button className="btn" onClick={handleEditClick} style={{ width: '100%', justifyContent: 'flex-start', padding: '0.8rem', background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: '8px', fontWeight: '700', color: "var(--text-muted)" }}>
                    <Edit3 size={16} /> Edit Profile
                  </button>
                  <button className="btn" onClick={handleDownloadContract} disabled={isDownloading} style={{ width: '100%', justifyContent: 'flex-start', padding: '0.8rem', background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: '8px', fontWeight: '700', color: "var(--text-muted)" }}>
                    <Download size={16} /> {isDownloading ? 'Generating...' : 'Lease Contract'}
                  </button>
                  <button className="btn" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.8rem', background: "var(--bg-red-soft)", border: "1px solid var(--danger-border)", borderRadius: '8px', fontWeight: '800', color: "var(--text-red)", marginTop: '1rem' }}>
                    <AlertTriangle size={16} /> Flag / Blacklist
                  </button>
                </div>
              </div>

              {selectedTenant.rentStatus === 'PENDING' && (
                <div style={{ background: "var(--bg-yellow-soft)", padding: '1.2rem', borderRadius: '16px', border: "1px solid var(--text-yellow)" }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: '800', color: "var(--text-yellow)", textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>Alert</h3>
                  <p style={{ fontSize: '0.8rem', color: "var(--text-yellow)", margin: 0, fontWeight: '600' }}>Rent is pending for the current month. Recommend sending reminder.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* REGISTRATION MODAL (SINGLE) */}
      <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} title={modalMode === 'edit' ? "Update Resident Profile" : "Register New Tenant"} maxWidth="700px">
        <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Full Name</label>
              <input style={inputStyle} value={registerFormData.name} onChange={e => setRegisterFormData({ ...registerFormData, name: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Email Address</label>
              <input type="email" style={inputStyle} value={registerFormData.email} onChange={e => setRegisterFormData({ ...registerFormData, email: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Phone Number</label>
              <input style={inputStyle} value={registerFormData.phone} onChange={e => setRegisterFormData({ ...registerFormData, phone: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Emergency Contact</label>
              <input style={inputStyle} value={registerFormData.emergencyContact} onChange={e => setRegisterFormData({ ...registerFormData, emergencyContact: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Building</label>
              <select style={inputStyle} value={registerFormData.buildingId || activeBuildingId} onChange={e => setRegisterFormData({ ...registerFormData, buildingId: e.target.value, floorId: '', roomId: '', bedId: '' })} required>
                <option value="">Select Building</option>
                {infrastructure.buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Floor</label>
              <select style={inputStyle} value={registerFormData.floorId} onChange={e => setRegisterFormData({ ...registerFormData, floorId: e.target.value, roomId: '', bedId: '' })} required>
                <option value="">Select Floor</option>
                {infrastructure.floors.filter(f => f.buildingId === (registerFormData.buildingId || activeBuildingId)).map(f => <option key={f.id} value={f.id}>Floor {f.floorNumber}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Room</label>
              <select style={inputStyle} value={registerFormData.roomId} onChange={e => setRegisterFormData({ ...registerFormData, roomId: e.target.value, bedId: '' })} required>
                <option value="">Select Room</option>
                {infrastructure.rooms.filter(r => r.floorId === registerFormData.floorId).map(r => <option key={r.id} value={r.id}>Room {r.roomNumber}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Bed</label>
                <button type="button" onClick={handleRecommendBeds} disabled={isRecommending} style={{ fontSize: '0.7rem', background: "var(--bg-blue-soft)", color: "var(--text-blue)", border: "1px solid var(--color-blue)", padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}>
                  {isRecommending ? 'Suggesting...' : '✨ Suggest AI Bed'}
                </button>
              </div>
              <select style={{ ...inputStyle, border: recommendedBeds.some(b => b.id === registerFormData.bedId) ? "2px solid var(--text-green)" : "1px solid var(--border-color)" }} value={registerFormData.bedId} onChange={e => setRegisterFormData({ ...registerFormData, bedId: e.target.value })} required>
                <option value="">Select Bed</option>
                {infrastructure.beds.filter(b => b.roomId === registerFormData.roomId).map(b => (
                  <option key={b.id} value={b.id}>
                    Bed {b.bedNumber} {recommendedBeds.some(rb => rb.id === b.id) ? '⭐ (Recommended)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ background: "var(--bg-tertiary)", padding: '1rem', borderRadius: '12px', border: "1px solid var(--border-color)", marginTop: '0.5rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: "var(--text-primary)", marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Star size={14} color="var(--text-yellow)" /> Smart Bed Preferences
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {Object.keys(registerFormData.preferences).map(pref => (
                <label key={pref} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: "var(--text-muted)", cursor: 'pointer' }}>
                  <input type="checkbox" checked={registerFormData.preferences[pref]} onChange={e => setRegisterFormData({ ...registerFormData, preferences: { ...registerFormData.preferences, [pref]: e.target.checked } })} />
                  {pref.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Monthly Rent (₹)</label>
              <input type="number" style={inputStyle} value={registerFormData.rent} onChange={e => setRegisterFormData({ ...registerFormData, rent: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Check-in Date</label>
              <input type="date" style={inputStyle} value={registerFormData.checkIn} onChange={e => setRegisterFormData({ ...registerFormData, checkIn: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Aadhaar Number</label>
              <input style={inputStyle} value={registerFormData.aadhaar} onChange={e => setRegisterFormData({ ...registerFormData, aadhaar: e.target.value })} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Food Preference</label>
              <select style={inputStyle} value={registerFormData.vegNonVegPreference} onChange={e => setRegisterFormData({ ...registerFormData, vegNonVegPreference: e.target.value })}>
                {['Any', 'Veg Only', 'Non-Veg', 'Vegan', 'Egg-itarian'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Budget Range</label>
              <select style={inputStyle} value={registerFormData.budgetRange} onChange={e => setRegisterFormData({ ...registerFormData, budgetRange: e.target.value })}>
                {['₹5,000 - ₹10,000', '₹10,000 - ₹15,000', '₹15,000+'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Sleep Timing</label>
              <select style={inputStyle} value={registerFormData.sleepTiming} onChange={e => setRegisterFormData({ ...registerFormData, sleepTiming: e.target.value })}>
                {['Early Bird', 'Night Owl', 'Flexible'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Primary Language</label>
              <input style={inputStyle} placeholder="Hindi, English, etc." value={registerFormData.primaryLanguage} onChange={e => setRegisterFormData({ ...registerFormData, primaryLanguage: e.target.value })} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: "var(--text-muted)" }}>Stay Duration</label>
              <select style={inputStyle} value={registerFormData.targetStayDuration} onChange={e => setRegisterFormData({ ...registerFormData, targetStayDuration: e.target.value })}>
                {['3 Months', '6 Months', '1 Year', 'Flexible'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: "1px solid var(--border-color)", paddingTop: '1.5rem' }}>
            <button className="btn" type="button" onClick={() => setIsRegisterModalOpen(false)} style={{ flex: 1, padding: '1rem', background: "var(--bg-main)", color: "var(--text-muted)", fontWeight: '700' }}>Cancel</button>
            <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem', background: "var(--text-blue)", fontWeight: '800' }}>{modalMode === 'edit' ? "Save Changes" : "Confirm Registration"}</button>
          </div>
        </form>
      </Modal>

      {/* BULK REGISTER MODAL (STRICTLY PRESERVED LOGIC & LAYOUT, JUST STYLED) */}
      <Modal isOpen={isBulkRegisterModalOpen} onClose={() => setIsBulkRegisterModalOpen(false)} title="Bulk Resident Registration" maxWidth="1200px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {isLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <div className="loader" style={{ margin: '0 auto 1rem', borderBottomColor: "var(--text-blue)" }}></div>
              <p style={{ color: "var(--text-secondary)", fontWeight: '600' }}>Fetching property infrastructure...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ maxHeight: '450px', overflow: 'auto', border: "1px solid var(--border-color)", borderRadius: '16px', background: "var(--bg-card)" }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: "var(--bg-tertiary)", boxShadow: "0 1px 0 var(--border-color)" }}>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '180px', color: "var(--text-muted)", fontWeight: '700' }}>Resident Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '150px', color: "var(--text-muted)", fontWeight: '700' }}>Phone</th>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '140px', color: "var(--text-muted)", fontWeight: '700' }}>Building</th>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '100px', color: "var(--text-muted)", fontWeight: '700' }}>Floor</th>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '120px', color: "var(--text-muted)", fontWeight: '700' }}>Room</th>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '100px', color: "var(--text-muted)", fontWeight: '700' }}>Bed</th>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '120px', color: "var(--text-muted)", fontWeight: '700' }}>Rent (₹)</th>
                      <th style={{ padding: '1rem', textAlign: 'center', minWidth: '80px', color: "var(--text-muted)", fontWeight: '700' }}>Docs</th>
                      <th style={{ padding: '1rem', textAlign: 'center', width: '60px', color: "var(--text-muted)", fontWeight: '700' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualRows?.map((row, idx) => (
                      <tr key={row.id || idx} style={{ borderTop: "1px solid var(--border-color)" }}>
                        <td style={{ padding: '0.8rem' }}>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Users size={16} style={{ position: 'absolute', left: '0.8rem', color: "var(--text-muted)" }} />
                            <input
                              style={{ ...inputStyle, paddingLeft: '2.5rem' }}
                              placeholder="Full Name"
                              value={row.name}
                              onChange={e => { const newRows = [...manualRows]; newRows[idx].name = e.target.value; setManualRows(newRows); }}
                            />
                          </div>
                        </td>
                        <td style={{ padding: '0.8rem' }}>
                          <input style={inputStyle} placeholder="Phone Number" value={row.phone} onChange={e => { const newRows = [...manualRows]; newRows[idx].phone = e.target.value; setManualRows(newRows); }} />
                        </td>
                        <td style={{ padding: '0.8rem' }}>
                          <select style={inputStyle} value={row.building} onChange={e => { const newRows = [...manualRows]; newRows[idx].building = e.target.value; newRows[idx].floor = ''; newRows[idx].room = ''; newRows[idx].bed = ''; setManualRows(newRows); }}>
                            <option value="">Select...</option>
                            {infrastructure.buildings?.map(b => <option key={b.id || Math.random()} value={b.id}>{b.name}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '0.8rem' }}>
                          <select style={inputStyle} value={row.floor} onChange={e => { const newRows = [...manualRows]; newRows[idx].floor = e.target.value; newRows[idx].room = ''; newRows[idx].bed = ''; setManualRows(newRows); }} disabled={!row.building}>
                            <option value="">...</option>
                            {infrastructure.floors?.filter(f => f.buildingId === row.building).map(f => <option key={f.id || Math.random()} value={f.id}>Floor {f.floorNumber}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '0.8rem' }}>
                          <select style={inputStyle} value={row.room} onChange={e => { const newRows = [...manualRows]; newRows[idx].room = e.target.value; newRows[idx].bed = ''; setManualRows(newRows); }} disabled={!row.floor}>
                            <option value="">...</option>
                            {infrastructure.rooms?.filter(r => r.floorId === row.floor).map(r => <option key={r.id || Math.random()} value={r.id}>Room {r.roomNumber}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '0.8rem' }}>
                          <select style={inputStyle} value={row.bed} onChange={e => { const newRows = [...manualRows]; newRows[idx].bed = e.target.value; setManualRows(newRows); }} disabled={!row.room}>
                            <option value="">...</option>
                            {infrastructure.beds?.filter(b => (b.room?._id || b.room) === row.room).map(b => <option key={b.id || Math.random()} value={b.id}>{b.bedNumber}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '0.8rem' }}>
                          <input style={inputStyle} type="number" placeholder="6500" value={row.rent} onChange={e => { const newRows = [...manualRows]; newRows[idx].rent = e.target.value; setManualRows(newRows); }} />
                        </td>
                        <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <input type="file" style={{ display: 'none' }} onChange={e => { const file = e.target.files[0]; if (file) { const newRows = [...manualRows]; newRows[idx].doc = file; setManualRows(newRows); } }} />
                            <div style={{ padding: '0.5rem', borderRadius: '8px', background: row.doc ? "var(--bg-green-soft)" : "var(--bg-main)", color: row.doc ? "var(--text-green)" : "var(--text-muted)", border: row.doc ? "1px solid var(--text-green)" : "1px solid var(--border-color)" }}>
                              {row.doc ? <Check size={16} /> : <FileText size={16} />}
                            </div>
                          </label>
                        </td>
                        <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                          <button onClick={() => { if (manualRows.length > 1) { setManualRows(manualRows.filter((_, i) => i !== idx)); } }} style={{ background: 'transparent', border: 'none', color: "var(--text-red)", cursor: 'pointer', padding: '0.4rem' }}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => setManualRows([...manualRows, { id: 'new-row-' + Date.now(), name: '', phone: '', building: activeBuildingId || '', floor: '', room: '', bed: '', rent: '', deposit: '', doc: null }])}
                className="btn"
                style={{ border: "2px dashed var(--border-color)", color: "var(--text-secondary)", background: 'transparent', width: '100%', padding: '1rem', borderRadius: '12px', fontWeight: '700' }}
              >
                <Plus size={18} /> Add New Row
              </button>
            </div>
          )}

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '2rem', borderTop: "1px solid var(--border-color)" }}>
            <div style={{ color: validationErrors.length > 0 ? "var(--text-red)" : "var(--text-secondary)", fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
              {validationErrors.length > 0 ? <AlertTriangle size={18} /> : <ShieldCheck size={18} color="var(--text-green)" />}
              {validationErrors.length > 0 ? `${validationErrors.length} validation errors found` : `Validated: ${manualRows.filter(r => r.name && r.phone).length} records ready`}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn" onClick={() => {
                const errors = [];
                manualRows.forEach((row, i) => {
                  if (row.name && !row.phone) errors.push(`Row ${i + 1}: Missing phone`);
                  if (row.phone && !row.name) errors.push(`Row ${i + 1}: Missing name`);
                });
                setValidationErrors(errors);
                if (errors.length === 0) alert('Data is valid!');
              }}
                style={{ border: "1px solid var(--border-color)", background: "var(--bg-card)", color: "var(--text-muted)", fontWeight: '700' }}
              >
                Validate Data
              </button>
              <button className="btn btn-primary" onClick={handleBulkRegisterSubmit} disabled={isSubmitting || manualRows.some(r => (r.name && !r.phone) || (r.phone && !r.name))}
                style={{ padding: '0.8rem 2.5rem', fontWeight: '800', background: "var(--text-blue)", opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Registering...' : 'Register Residents'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <style>{`
        .tenant-row-hover:hover { background: var(--bg-tertiary) !important; }
        .tenant-row-hover:hover .row-actions { opacity: 1 !important; }
        .loader {
          width: 48px; height: 48px; border: 5px solid #E2E8F0;
          border-bottom-color: var(--text-blue); border-radius: 50%; display: inline-block;
          box-sizing: border-box; animation: rotation 1s linear infinite;
        }
        @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Tenants;
