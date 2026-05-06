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
import { api } from '../mockData';

// Generic Modal Component
const Modal = ({ isOpen, onClose, title, children, maxWidth = '600px' }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ 
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', 
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
            maxHeight: '94vh', overflowY: 'auto', background: '#F8FAFC',
            borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column'
          }}
        >
          <div style={{ padding: '1.5rem 2rem', background: 'white', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1E293B', letterSpacing: '-0.02em', margin: 0 }}>{title}</h2>
            <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', color: '#64748B', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
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
    { id: 'initial-row-01', name: '', phone: '', building: '', floor: '', room: '', bed: '', rent: '', deposit: '', doc: null }
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
  }, [activeBuildingId]);

  useEffect(() => {
    if (isBulkRegisterModalOpen) {
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
  }, [isBulkRegisterModalOpen, activeBuildingId]);

  const fetchTenants = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTenants();
      if (!data) {
        setTenants([]);
        setIsLoading(false);
        return;
      }

      // Normalize backend field names → UI field names
      const normalized = data.map(t => ({
        id:               t._id  || t.id,
        name:             t.name || 'Unknown',
        email:            t.email || '',
        phone:            t.phone || t.contact || '',
        room:             t.room  || t.roomNumber || 'Unassigned',
        rent:             t.rent  || 0,
        status:           t.status || 'ACTIVE',
        rentStatus:       t.rentStatus || 'PENDING',
        checkIn:          t.checkInDate
                            ? new Date(t.checkInDate).toISOString().split('T')[0]
                            : (t.checkIn || 'N/A'),
        emergencyContact: t.emergencyContact || 'N/A',
        buildingId:       t.buildingId?._id || t.buildingId || null,
        score:            t.score  ?? 4.5,
        plan:             t.messPlan || t.plan || 'Standard',
        lastPayment:      t.lastPayment || 'N/A',
        docs:             t.docs  || (t.aadhaar ? [{ name: 'Aadhar Card', verified: true }] : []),
      }));

      // Filter by activeBuildingId if we're on a specific building route
      const filtered = activeBuildingId
        ? normalized.filter(t => t.buildingId === activeBuildingId)
        : normalized;

      setTenants(filtered);
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
      // Keep existing mock state on error
    } finally {
      setIsLoading(false);
    }
  };

  const [registerFormData, setRegisterFormData] = useState({
    name: '', email: '', phone: '', room: '', rent: '', checkIn: '', emergencyContact: '',
    aadhaar: '', document: null, messPlan: 'basic'
  });

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
      setRegisterFormData({ name: '', email: '', phone: '', room: '', rent: '', checkIn: '', emergencyContact: '', aadhaar: '', document: null });
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
      messPlan: selectedTenant.messPlan || 'basic'
    });
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
    await new Promise(r => setTimeout(r, 1500));
    const tenantsToAdd = manualRows
      .filter(row => row.name && row.phone)
      .map((row, idx) => {
        const b = infrastructure.buildings.find(b => b.id === row.building)?.name || 'N/A';
        const r = infrastructure.rooms.find(r => r.id === row.room)?.roomNumber || 'TBD';
        return {
          id: tenants.length + idx + 1,
          name: row.name, phone: row.phone, room: `${b}-${r}`,
          rent: parseInt(row.rent) || 6500,
          email: `${row.name.toLowerCase().replace(/\\s/g, '')}@example.com`,
          status: 'ACTIVE', rentStatus: 'PENDING', checkIn: new Date().toISOString().split('T')[0],
          emergencyContact: 'N/A', score: 5.0, plan: 'Standard', lastPayment: 'N/A',
          docs: row.doc ? [{ name: 'ID Proof', verified: false }] : []
        };
      });

    if (tenantsToAdd.length > 0) {
      setTenants([...tenants, ...tenantsToAdd]);
      setIsBulkRegisterModalOpen(false);
      setManualRows([{ id: 'new-row-' + Date.now(), name: '', phone: '', building: '', floor: '', room: '', bed: '', rent: '', deposit: '', doc: null }]);
    }
    setIsSubmitting(false);
  };

  // UI Helpers
  const getStatusBadge = (status) => {
    switch(status) {
      case 'ACTIVE': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', background: '#D1FAE5', color: '#10B981' }}>ACTIVE</span>;
      case 'LEFT': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', background: '#F1F5F9', color: '#64748B' }}>LEFT</span>;
      case 'PENDING': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', background: '#FEF3C7', color: '#F59E0B' }}>PENDING</span>;
      case 'RISK': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', background: '#FEE2E2', color: '#EF4444' }}>RISK</span>;
      default: return null;
    }
  };

  const getRentBadge = (status) => {
    if(status === 'PAID') return <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '800', background: '#D1FAE5', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><CheckCircle size={10}/> PAID</span>;
    return <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '800', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><AlertTriangle size={10}/> DUE</span>;
  };

  const inputStyle = {
    padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', 
    background: '#FFFFFF', color: '#1E293B', width: '100%', fontSize: '0.9rem', outline: 'none', transition: 'border 0.2s'
  };

  const filteredTenants = tenants.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.phone.includes(search);
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalActive = tenants.filter(t => t.status === 'ACTIVE').length;
  const pendingPaymentsCount = tenants.filter(t => t.rentStatus === 'PENDING').length;

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', minHeight: '100vh', background: '#F8FAFC', padding: '0.5rem' }}>
      {/* SaaS Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', marginBottom: '0.2rem', letterSpacing: '-0.03em' }}>
            Tenants Management
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', fontWeight: '500', margin: 0 }}>Overview, tracking, and lifecycle management.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" placeholder="Search tenants..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #E2E8F0', width: '250px', fontSize: '0.9rem', outline: 'none' }} 
            />
          </div>
          <div style={{ position: 'relative' }}>
            <button className="btn" onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)} style={{ background: filterStatus !== 'ALL' ? '#EFF6FF' : '#FFFFFF', border: filterStatus !== 'ALL' ? '1px solid #3B82F6' : '1px solid #E2E8F0', color: filterStatus !== 'ALL' ? '#3B82F6' : '#475569', padding: '0.75rem 1rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
              <Filter size={16} /> {filterStatus === 'ALL' ? 'Filters' : filterStatus}
            </button>
            {isFilterDropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 100, width: '150px', overflow: 'hidden' }}>
                {['ALL', 'ACTIVE', 'PENDING', 'LEFT', 'RISK'].map(status => (
                  <div key={status} onClick={() => { setFilterStatus(status); setIsFilterDropdownOpen(false); }} style={{ padding: '0.8rem 1rem', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', background: filterStatus === status ? '#F8FAFC' : 'white', color: filterStatus === status ? '#3B82F6' : '#475569', borderBottom: '1px solid #F1F5F9' }}>
                    {status === 'ALL' ? 'All Statuses' : status}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* PRESERVED BULK REGISTER BUTTON */}
          <button className="btn" onClick={() => setIsBulkRegisterModalOpen(true)} style={{ background: '#FFFFFF', border: '1px solid #3B82F6', color: '#3B82F6', padding: '0.75rem 1.2rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <Layers size={18} /> Bulk Register
          </button>
          
          <button className="btn btn-primary" onClick={() => { setModalMode('add'); setIsRegisterModalOpen(true); }} style={{ background: '#3B82F6', border: 'none', padding: '0.75rem 1.2rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <Plus size={18} /> Add Tenant
          </button>

          <button onClick={() => window.history.back()} className="btn" style={{ padding: '0.7rem', borderRadius: '50%', background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '0.5rem' }}>
            <X size={20} />
          </button>
        </div>
      </header>

      {/* KPI Dashboard (Bento Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Users size={14}/> Total Tenants</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>{tenants.length}</h2>
            <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center' }}><TrendingUp size={14}/> +12%</span>
          </div>
        </div>
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderBottom: '4px solid #10B981' }}>
          <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CheckCircle size={14}/> Active Occupants</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>{totalActive}</h2>
          </div>
        </div>
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><TrendingDown size={14}/> Leaving Soon</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>2</h2>
            <span style={{ color: '#F59E0B', fontSize: '0.85rem', fontWeight: '700' }}>In next 15 days</span>
          </div>
        </div>
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', borderBottom: '4px solid #EF4444' }}>
          <p style={{ color: '#64748B', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><CreditCard size={14}/> Pending Dues</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#EF4444', margin: 0 }}>{pendingPaymentsCount}</h2>
            <span style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: '700' }}>Action Req.</span>
          </div>
        </div>
      </div>

      {/* Tenant List Hybrid Layout */}
      <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#64748B', fontSize: '0.8rem', textTransform: 'uppercase' }}>Tenant Profile</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#64748B', fontSize: '0.8rem', textTransform: 'uppercase' }}>Room & Plan</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#64748B', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '700', color: '#64748B', fontSize: '0.8rem', textTransform: 'uppercase' }}>Insights</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredTenants.map((tenant) => (
              <tr 
                key={tenant.id} 
                className="tenant-row-hover"
                style={{ borderBottom: '1px solid #E2E8F0', transition: 'all 0.2s', cursor: 'pointer' }}
                onClick={() => { setSelectedTenant(tenant); setProfileTab('Overview'); }}
              >
                <td style={{ padding: '1.2rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: '800' }}>
                      {tenant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: '800', fontSize: '1rem', color: '#0F172A', margin: 0, marginBottom: '2px' }}>{tenant.name}</p>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>{tenant.phone}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.2rem 1.5rem' }}>
                  <p style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0F172A', margin: 0, marginBottom: '4px' }}>{tenant.room}</p>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, fontWeight: '600' }}>{tenant.plan} Room</p>
                </td>
                <td style={{ padding: '1.2rem 1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
                    {getStatusBadge(tenant.status)}
                    {getRentBadge(tenant.rentStatus)}
                  </div>
                </td>
                <td style={{ padding: '1.2rem 1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#475569', fontWeight: '600' }}>
                      <Star size={14} color="#F59E0B" fill="#F59E0B" /> {tenant.score} Score
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748B' }}>
                      <Clock size={12} /> Since {tenant.checkIn}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                  <div className="row-actions" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', opacity: 0, transition: 'opacity 0.2s' }}>
                    <button className="btn" onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${tenant.phone.replace(/[^0-9]/g, '')}?text=Hello ${tenant.name},`, '_blank'); }} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.5rem', borderRadius: '8px', color: '#3B82F6' }} title="Send Message">
                      <MessageSquare size={16} />
                    </button>
                    <button className="btn" onClick={(e) => { e.stopPropagation(); setSelectedTenant(tenant); setProfileTab('Payments'); }} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.5rem', borderRadius: '8px', color: '#10B981' }} title="Collect Rent">
                      <CreditCard size={16} />
                    </button>
                    <ChevronRight size={20} color="#94A3B8" style={{ alignSelf: 'center', marginLeft: '0.5rem' }} />
                  </div>
                </td>
              </tr>
            ))}
            {filteredTenants.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#64748B', fontWeight: '600' }}>No tenants found matching criteria.</td></tr>
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
                <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: '#EFF6FF', border: '2px solid #BFDBFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900', color: '#3B82F6', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.2)' }}>
                   {selectedTenant.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#0F172A', margin: 0, marginBottom: '0.4rem', letterSpacing: '-0.03em' }}>{selectedTenant.name}</h2>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: '800', fontSize: '1rem', color: '#475569' }}>Room {selectedTenant.room}</span>
                    {getStatusBadge(selectedTenant.status)}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: '700', color: '#F59E0B' }}><Star size={14} fill="#F59E0B"/> {selectedTenant.score} / 5.0</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #E2E8F0', marginBottom: '1.5rem' }}>
                {['Overview', 'Payments', 'Stay Details', 'Documents'].map(tab => (
                  <button 
                    key={tab} 
                    onClick={() => setProfileTab(tab)}
                    style={{ 
                      background: 'transparent', border: 'none', padding: '0.8rem 1rem', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer',
                      color: profileTab === tab ? '#3B82F6' : '#64748B',
                      borderBottom: profileTab === tab ? '3px solid #3B82F6' : '3px solid transparent',
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
                      <div style={{ background: '#F8FAFC', padding: '1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email & Phone</p>
                        <p style={{ fontWeight: '700', color: '#0F172A', margin: '0 0 0.3rem 0' }}>{selectedTenant.phone}</p>
                        <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0 }}>{selectedTenant.email}</p>
                      </div>
                      <div style={{ background: '#FEF2F2', padding: '1.2rem', borderRadius: '12px', border: '1px solid #FECACA' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#EF4444', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Emergency Contact</p>
                        <p style={{ fontWeight: '800', color: '#991B1B', margin: 0 }}>{selectedTenant.emergencyContact}</p>
                      </div>
                    </div>
                    
                    {/* Lifecycle Pipeline */}
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', marginBottom: '1rem' }}>Lifecycle Pipeline</h3>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        {['Applicant', 'Approved', 'Active', 'Notice'].map((step, i) => {
                          const isActive = step.toUpperCase() === selectedTenant.status || (step === 'Active' && selectedTenant.status === 'ACTIVE');
                          const isPast = ['Applicant', 'Approved'].includes(step) || (step === 'Active' && selectedTenant.status === 'LEFT');
                          return (
                            <React.Fragment key={step}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: isActive || isPast ? '#3B82F6' : '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                  {isPast && !isActive ? <Check size={14} /> : <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }}/>}
                                </div>
                                <span style={{ fontSize: '0.75rem', fontWeight: isActive ? '800' : '600', color: isActive ? '#0F172A' : '#64748B' }}>{step}</span>
                              </div>
                              {i < 3 && <div style={{ height: '2px', flex: 1, background: isPast ? '#3B82F6' : '#E2E8F0', margin: '0 1rem', marginTop: '-1rem' }} />}
                            </React.Fragment>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {profileTab === 'Payments' && (
                  <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Monthly Rent</p>
                        <p style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>₹{selectedTenant.rent}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Status</p>
                        {getRentBadge(selectedTenant.rentStatus)}
                      </div>
                    </div>
                    {selectedTenant.rentStatus === 'PENDING' && (
                      <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CreditCard size={16} color="#3B82F6"/> Record Payment</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1.2rem' }}>
                          {['UPI', 'Cash', 'Bank Transfer'].map(mode => (
                            <button 
                              key={mode} 
                              onClick={() => setPaymentMode(mode)}
                              style={{ 
                                background: paymentMode === mode ? '#EFF6FF' : '#F8FAFC', 
                                border: paymentMode === mode ? '2px solid #3B82F6' : '1px solid #E2E8F0', 
                                padding: '0.8rem', borderRadius: '8px', fontWeight: '800', 
                                color: paymentMode === mode ? '#3B82F6' : '#64748B', 
                                cursor: 'pointer', transition: 'all 0.15s' 
                              }}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                          <button className="btn" onClick={() => alert(`Successfully collected ₹${selectedTenant.rent} via ${paymentMode}`)} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: '#10B981', color: 'white', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none' }}>
                            <CheckCircle size={18} /> Collect Rent
                          </button>
                          <button className="btn" onClick={() => window.location.href = `mailto:${selectedTenant.email}?subject=Rent Due Reminder`} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={18} /> Send Reminder
                          </button>
                        </div>
                      </div>
                    )}
                    <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#0F172A', margin: '1.5rem 0 1rem 0' }}>Recent History</h3>
                    <div style={{ padding: '1rem', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '12px', color: '#475569', fontSize: '0.9rem', fontWeight: '600', display: 'flex', justifyContent: 'space-between' }}>
                       <span>Rent Payment - {selectedTenant.lastPayment}</span>
                       <span style={{ color: '#10B981', fontWeight: '800' }}>₹{selectedTenant.rent} PAID</span>
                    </div>
                  </div>
                )}

                {profileTab === 'Stay Details' && (
                  <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ background: '#F8FAFC', padding: '1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Check-in Date</p>
                        <p style={{ fontWeight: '800', color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={16}/> {selectedTenant.checkIn}</p>
                      </div>
                      <div style={{ background: '#F8FAFC', padding: '1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Plan Details</p>
                        <p style={{ fontWeight: '800', color: '#0F172A', margin: 0 }}>{selectedTenant.plan} Sharing</p>
                      </div>
                    </div>
                    {/* Auto Room Suggestion widget */}
                    <div style={{ background: '#EFF6FF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                       <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1E3A8A', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16}/> Auto Room Suggestion</h3>
                       <p style={{ fontSize: '0.85rem', color: '#1E40AF', margin: '0 0 1rem 0', fontWeight: '500' }}>Based on preferences, if tenant needs to relocate:</p>
                       <div style={{ display: 'flex', gap: '1rem' }}>
                         <span style={{ padding: '0.5rem 1rem', background: 'white', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', color: '#3B82F6', border: '1px solid #BFDBFE' }}>Room 205-C (Vacant)</span>
                         <span style={{ padding: '0.5rem 1rem', background: 'white', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', color: '#3B82F6', border: '1px solid #BFDBFE' }}>Room 102-B (Vacant)</span>
                       </div>
                    </div>
                  </div>
                )}

                {profileTab === 'Documents' && (
                  <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      {selectedTenant.docs?.map((d, i) => (
                        <div key={i} style={{ background: '#F8FAFC', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: '#FFFFFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                              <FileText size={20} color="#3B82F6" />
                            </div>
                            <div>
                              <p style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0F172A', margin: 0 }}>{d.name}</p>
                              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: d.verified ? '#10B981' : '#F59E0B', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                                <ShieldCheck size={12} /> {d.verified ? 'Verified' : 'Pending Verification'}
                              </span>
                            </div>
                          </div>
                          <button className="btn" style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: '700', color: '#3B82F6' }}>View</button>
                        </div>
                      ))}
                      {(!selectedTenant.docs || selectedTenant.docs.length === 0) && (
                        <div style={{ padding: '3rem', textAlign: 'center', border: '2px dashed #E2E8F0', borderRadius: '12px' }}>
                          <p style={{ color: '#64748B', fontWeight: '600' }}>No documents uploaded yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Smart Actions */}
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1.2rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', marginBottom: '1rem' }}>Smart Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <button className="btn" onClick={handleEditClick} style={{ width: '100%', justifyContent: 'flex-start', padding: '0.8rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', fontWeight: '700', color: '#475569' }}>
                    <Edit3 size={16} /> Edit Profile
                  </button>
                  <button className="btn" onClick={handleDownloadContract} disabled={isDownloading} style={{ width: '100%', justifyContent: 'flex-start', padding: '0.8rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', fontWeight: '700', color: '#475569' }}>
                    <Download size={16} /> {isDownloading ? 'Generating...' : 'Lease Contract'}
                  </button>
                  <button className="btn" style={{ width: '100%', justifyContent: 'flex-start', padding: '0.8rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', fontWeight: '800', color: '#DC2626', marginTop: '1rem' }}>
                    <AlertTriangle size={16} /> Flag / Blacklist
                  </button>
                </div>
              </div>

              {selectedTenant.rentStatus === 'PENDING' && (
                <div style={{ background: '#FFFBEB', padding: '1.2rem', borderRadius: '16px', border: '1px solid #FDE68A' }}>
                  <h3 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#B45309', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>Alert</h3>
                  <p style={{ fontSize: '0.8rem', color: '#92400E', margin: 0, fontWeight: '600' }}>Rent is pending for the current month. Recommend sending reminder.</p>
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
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Full Name</label>
                <input style={inputStyle} value={registerFormData.name} onChange={e => setRegisterFormData({...registerFormData, name: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Email Address</label>
                <input type="email" style={inputStyle} value={registerFormData.email} onChange={e => setRegisterFormData({...registerFormData, email: e.target.value})} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Phone Number</label>
                <input style={inputStyle} value={registerFormData.phone} onChange={e => setRegisterFormData({...registerFormData, phone: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Emergency Contact</label>
                <input style={inputStyle} value={registerFormData.emergencyContact} onChange={e => setRegisterFormData({...registerFormData, emergencyContact: e.target.value})} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Assign Room</label>
                <input placeholder="e.g. 201-A" style={inputStyle} value={registerFormData.room} onChange={e => setRegisterFormData({...registerFormData, room: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Monthly Rent (₹)</label>
                <input type="number" style={inputStyle} value={registerFormData.rent} onChange={e => setRegisterFormData({...registerFormData, rent: e.target.value})} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Check-in Date</label>
                <input type="date" style={inputStyle} value={registerFormData.checkIn} onChange={e => setRegisterFormData({...registerFormData, checkIn: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569' }}>Aadhaar Number</label>
                <input style={inputStyle} value={registerFormData.aadhaar} onChange={e => setRegisterFormData({...registerFormData, aadhaar: e.target.value})} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem' }}>
              <button className="btn" type="button" onClick={() => setIsRegisterModalOpen(false)} style={{ flex: 1, padding: '1rem', background: '#F1F5F9', color: '#475569', fontWeight: '700' }}>Cancel</button>
              <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem', background: '#3B82F6', fontWeight: '800' }}>{modalMode === 'edit' ? "Save Changes" : "Confirm Registration"}</button>
            </div>
        </form>
      </Modal>

      {/* BULK REGISTER MODAL (STRICTLY PRESERVED LOGIC & LAYOUT, JUST STYLED) */}
      <Modal isOpen={isBulkRegisterModalOpen} onClose={() => setIsBulkRegisterModalOpen(false)} title="Bulk Resident Registration" maxWidth="1200px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {isLoading ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <div className="loader" style={{ margin: '0 auto 1rem', borderBottomColor: '#3B82F6' }}></div>
              <p style={{ color: '#64748B', fontWeight: '600' }}>Fetching property infrastructure...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ maxHeight: '450px', overflow: 'auto', border: '1px solid #E2E8F0', borderRadius: '16px', background: 'white' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: '#F8FAFC', boxShadow: '0 1px 0 #E2E8F0' }}>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '180px', color: '#475569', fontWeight: '700' }}>Resident Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '150px', color: '#475569', fontWeight: '700' }}>Phone</th>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '140px', color: '#475569', fontWeight: '700' }}>Building</th>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '100px', color: '#475569', fontWeight: '700' }}>Floor</th>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '120px', color: '#475569', fontWeight: '700' }}>Room</th>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '100px', color: '#475569', fontWeight: '700' }}>Bed</th>
                      <th style={{ padding: '1rem', textAlign: 'left', minWidth: '120px', color: '#475569', fontWeight: '700' }}>Rent (₹)</th>
                      <th style={{ padding: '1rem', textAlign: 'center', minWidth: '80px', color: '#475569', fontWeight: '700' }}>Docs</th>
                      <th style={{ padding: '1rem', textAlign: 'center', width: '60px', color: '#475569', fontWeight: '700' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualRows?.map((row, idx) => (
                      <tr key={row.id || idx} style={{ borderTop: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '0.8rem' }}>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Users size={16} style={{ position: 'absolute', left: '0.8rem', color: '#94A3B8' }} />
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
                            {infrastructure.beds?.filter(b => b.roomId === row.room).map(b => <option key={b.id || Math.random()} value={b.id}>{b.bedNumber}</option>)}
                          </select>
                        </td>
                        <td style={{ padding: '0.8rem' }}>
                          <input style={inputStyle} type="number" placeholder="6500" value={row.rent} onChange={e => { const newRows = [...manualRows]; newRows[idx].rent = e.target.value; setManualRows(newRows); }} />
                        </td>
                        <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <input type="file" style={{ display: 'none' }} onChange={e => { const file = e.target.files[0]; if (file) { const newRows = [...manualRows]; newRows[idx].doc = file; setManualRows(newRows); } }} />
                            <div style={{ padding: '0.5rem', borderRadius: '8px', background: row.doc ? '#D1FAE5' : '#F1F5F9', color: row.doc ? '#10B981' : '#94A3B8', border: row.doc ? '1px solid #10B981' : '1px solid #E2E8F0' }}>
                              {row.doc ? <Check size={16} /> : <FileText size={16} />}
                            </div>
                          </label>
                        </td>
                        <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                          <button onClick={() => { if (manualRows.length > 1) { setManualRows(manualRows.filter((_, i) => i !== idx)); } }} style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.4rem' }}>
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button 
                onClick={() => setManualRows([...manualRows, { id: 'new-row-' + Date.now(), name: '', phone: '', building: '', floor: '', room: '', bed: '', rent: '', deposit: '', doc: null }])}
                className="btn" 
                style={{ border: '2px dashed #CBD5E1', color: '#64748B', background: 'transparent', width: '100%', padding: '1rem', borderRadius: '12px', fontWeight: '700' }}
              >
                <Plus size={18} /> Add New Row
              </button>
            </div>
          )}

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
            <div style={{ color: validationErrors.length > 0 ? '#EF4444' : '#64748B', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
              {validationErrors.length > 0 ? <AlertTriangle size={18} /> : <ShieldCheck size={18} color="#10B981" />}
              {validationErrors.length > 0 ? `${validationErrors.length} validation errors found` : `Validated: ${manualRows.filter(r => r.name && r.phone).length} records ready`}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn" onClick={() => {
                  const errors = [];
                  manualRows.forEach((row, i) => {
                    if (row.name && !row.phone) errors.push(`Row ${i+1}: Missing phone`);
                    if (row.phone && !row.name) errors.push(`Row ${i+1}: Missing name`);
                  });
                  setValidationErrors(errors);
                  if (errors.length === 0) alert('Data is valid!');
                }}
                style={{ border: '1px solid #E2E8F0', background: 'white', color: '#475569', fontWeight: '700' }}
              >
                Validate Data
              </button>
              <button className="btn btn-primary" onClick={handleBulkRegisterSubmit} disabled={isSubmitting || manualRows.some(r => (r.name && !r.phone) || (r.phone && !r.name))}
                style={{ padding: '0.8rem 2.5rem', fontWeight: '800', background: '#3B82F6', opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? 'Registering...' : 'Register Residents'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <style>{`
        .tenant-row-hover:hover { background: #F8FAFC !important; }
        .tenant-row-hover:hover .row-actions { opacity: 1 !important; }
        .loader {
          width: 48px; height: 48px; border: 5px solid #E2E8F0;
          border-bottom-color: #3B82F6; border-radius: 50%; display: inline-block;
          box-sizing: border-box; animation: rotation 1s linear infinite;
        }
        @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Tenants;
