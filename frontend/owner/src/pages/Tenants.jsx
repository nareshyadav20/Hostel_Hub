import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { 
  Users, FileText, X, AlertCircle, Calendar, Layers, Plus, 
  Trash2, Search, Check, ShieldCheck, AlertTriangle 
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
            width: '94%', maxWidth, padding: '2rem', 
            maxHeight: '94vh', overflowY: 'auto', background: 'var(--bg-primary)',
            borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.03em' }}>{title}</h2>
            <button onClick={onClose} style={{ background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '12px' }}>
              <X size={24} />
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Tenants = () => {
  const { buildingId } = useParams();
  const [tenants, setTenants] = useState([
    { 
      id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', room: '201-A', phone: '+91 98765 43210', 
      status: 'ACTIVE', rentStatus: 'PAID', checkIn: '2025-08-12', rent: 6500, emergencyContact: '+91 99999 00000',
      docs: [{ name: 'Aadhar Card', verified: true }]
    },
    { 
      id: 2, name: 'Priya Verma', email: 'priya@example.com', room: '202-B', phone: '+91 87654 32109', 
      status: 'ACTIVE', rentStatus: 'PENDING', checkIn: '2026-01-05', rent: 8500, emergencyContact: '+91 88888 11111',
      docs: [{ name: 'Aadhar Card', verified: false }]
    },
    { 
      id: 3, name: 'Amit Singh', email: 'amit@example.com', room: '101-A', phone: '+91 76543 21098', 
      status: 'LEFT', rentStatus: 'PAID', checkIn: '2024-05-10', rent: 5000, emergencyContact: '+91 77777 22222',
      docs: [{ name: 'Aadhar Card', verified: true }]
    },
    { 
      id: 4, name: 'Neha Gupta', email: 'neha@example.com', room: 'Pending', phone: '+91 65432 10987', 
      status: 'PENDING', rentStatus: 'PENDING', checkIn: 'TBD', rent: 7000, emergencyContact: '+91 66666 33333',
      docs: []
    },
  ]);
  const [selectedTenant, setSelectedTenant] = useState(null);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isBulkRegisterModalOpen, setIsBulkRegisterModalOpen] = useState(false);
  const [manualRows, setManualRows] = useState([
    { id: Math.random().toString(36).substr(2, 9), name: '', phone: '', building: '', floor: '', room: '', bed: '', rent: '', deposit: '', doc: null }
  ]);
  const [infrastructure, setInfrastructure] = useState({ buildings: [], floors: [], rooms: [], beds: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [isDownloading, setIsDownloading] = useState(false);

  React.useEffect(() => {
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
          const filteredB = buildingId ? b.filter(x => (x.id || x._id) === buildingId) : b;
          setInfrastructure({ buildings: filteredB, floors: f, rooms: r, beds: bd });
        } catch (err) {
          console.error("Failed to fetch infrastructure", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchInfra();
    }
  }, [isBulkRegisterModalOpen]);
  const [registerFormData, setRegisterFormData] = useState({
    name: '', email: '', phone: '', room: '', rent: '', checkIn: '', emergencyContact: '',
    aadhaar: '', document: null, messPlan: 'basic'
  });

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'edit') {
      const updatedTenants = tenants.map(t => 
        t.id === selectedTenant.id ? { ...t, ...registerFormData } : t
      );
      setTenants(updatedTenants);
      // Update selected tenant to reflect changes in profile view
      setSelectedTenant({ ...selectedTenant, ...registerFormData });
    } else {
      const newTenant = {
        ...registerFormData,
        id: tenants.length + 1,
        status: 'ACTIVE',
        rentStatus: 'PENDING',
        docs: [
          ...(registerFormData.aadhaar ? [{ name: 'Aadhar Card', verified: false }] : []),
          ...(registerFormData.document ? [{ name: 'ID Proof', verified: true, file: registerFormData.document.name }] : [])
        ]
      };
      setTenants([...tenants, newTenant]);
    }
    setIsRegisterModalOpen(false);
    setRegisterFormData({ name: '', email: '', phone: '', room: '', rent: '', checkIn: '', emergencyContact: '', aadhaar: '', document: null });
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
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const contractText = `
--------------------------------------------------
      RESIDENTIAL LEASE AGREEMENT
--------------------------------------------------
TENANT: ${selectedTenant.name}
ROOM: ${selectedTenant.room}
RENT: ₹${selectedTenant.rent} / month
CHECK-IN DATE: ${selectedTenant.checkIn}
PHONE: ${selectedTenant.phone}
EMERGENCY CONTACT: ${selectedTenant.emergencyContact}

TERMS AND CONDITIONS:
1. The tenant agrees to pay rent by the 5th of every month.
2. Property damage will be deducted from the security deposit.
3. No illegal activities are permitted on the premises.

DATED: ${new Date().toLocaleDateString()}
OWNER SIGNATURE: ____________________
TENANT SIGNATURE: ____________________
--------------------------------------------------
    `;

    const blob = new Blob([contractText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Contract_${selectedTenant.name.replace(/\s/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    setIsDownloading(false);
  };

  const handleBulkRegisterSubmit = async () => {
    setIsSubmitting(true);
    // Simulate network delay
    await new Promise(r => setTimeout(r, 1500));

    const tenantsToAdd = manualRows
      .filter(row => row.name && row.phone)
      .map((row, idx) => {
        const b = infrastructure.buildings.find(b => b.id === row.building)?.name || 'N/A';
        const r = infrastructure.rooms.find(r => r.id === row.room)?.roomNumber || 'TBD';
        return {
          id: tenants.length + idx + 1,
          name: row.name,
          phone: row.phone,
          room: `${b}-${r}`,
          rent: parseInt(row.rent) || 6500,
          email: `${row.name.toLowerCase().replace(/\s/g, '')}@example.com`,
          status: 'ACTIVE',
          rentStatus: 'PENDING',
          checkIn: new Date().toISOString().split('T')[0],
          emergencyContact: 'N/A',
          docs: row.doc ? [{ name: 'ID Proof', verified: false }] : []
        };
      });

    if (tenantsToAdd.length > 0) {
      setTenants([...tenants, ...tenantsToAdd]);
      setIsBulkRegisterModalOpen(false);
      setManualRows([{ id: Math.random().toString(36).substr(2, 9), name: '', phone: '', building: '', floor: '', room: '', bed: '', rent: '', deposit: '', doc: null }]);
    }
    setIsSubmitting(false);
  };


  const getStatusBadge = (status) => {
    switch(status) {
      case 'ACTIVE': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' }}>ACTIVE</span>;
      case 'LEFT': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>LEFT</span>;
      case 'PENDING': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' }}>PENDING</span>;
      default: return null;
    }
  };

  const inputStyle = {
    padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', 
    background: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '100%'
  };

  return (
    <div className="tenants-page" style={{ position: 'relative', animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '900', marginBottom: '0.4rem', letterSpacing: '-0.04em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Users size={36} color="var(--accent-primary)" /> Resident Records
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '500' }}>Manage tenant lifecycle, documentation, and occupancy status.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={() => setIsBulkRegisterModalOpen(true)}><Layers size={18} /> Bulk Register</button>
          <button className="btn btn-primary" onClick={() => { setModalMode('add'); setIsRegisterModalOpen(true); }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem' }}>
            <Users size={18} /> Register Tenant
          </button>
        </div>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden', borderTop: '4px solid var(--accent-primary)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Tenant / Details</th>
              <th style={{ padding: '1.2rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Room / Status</th>
              <th style={{ padding: '1.2rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Financials</th>
              <th style={{ padding: '1.2rem', fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants?.map((tenant) => (
              <tr key={tenant.id || Math.random()} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition-fast)' }} className="table-row-hover">
                <td style={{ padding: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="avatar" style={{ width: '45px', height: '45px', fontSize: '1rem', background: 'var(--bg-tertiary)', border: '2px solid var(--accent-primary)', color: 'var(--accent-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                      {tenant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{tenant.name}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{tenant.phone}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>
                      Room {tenant.room}
                    </span>
                    {getStatusBadge(tenant.status)}
                  </div>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>₹{tenant.rent} / mo</span>
                    <span style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                      padding: '0.2rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.7rem', 
                      fontWeight: '800',
                      background: tenant.rentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: tenant.rentStatus === 'PAID' ? 'var(--accent-success)' : 'var(--accent-error)'
                    }}>
                      {tenant.rentStatus === 'PAID' ? 'PAID' : 'DUE'}
                    </span>
                  </div>
                </td>
                <td style={{ padding: '1.2rem' }}>
                    <button 
                      className="btn btn-outline"
                      onClick={() => setSelectedTenant(tenant)} 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      View Profile
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        <Modal 
          isOpen={!!selectedTenant} 
          onClose={() => setSelectedTenant(null)} 
          title="Resident Profile"
          maxWidth="600px"
        >
          {selectedTenant && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '70px', height: '70px', borderRadius: '18px', background: 'var(--bg-tertiary)', border: '2px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-primary)' }}>
                     {selectedTenant.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.2rem', letterSpacing: '-0.04em' }}>{selectedTenant.name}</h2>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--accent-primary)' }}>Room {selectedTenant.room}</span>
                      {getStatusBadge(selectedTenant.status)}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1rem' }}>
                <div className="card" style={{ padding: '1.2rem', background: 'var(--bg-tertiary)' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Contact Information</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.3rem' }}>{selectedTenant.email}</p>
                  <p style={{ fontSize: '1rem', fontWeight: '800' }}>{selectedTenant.phone}</p>
                </div>
                <div className="card" style={{ padding: '1.2rem', border: '1px solid var(--accent-error)' }}>
                  <p style={{ color: 'var(--accent-error)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Emergency Contact</p>
                  <p style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--accent-error)' }}>{selectedTenant.emergencyContact}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem' }}>
                <div className="card" style={{ padding: '1.2rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Stay Details</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Check-in:</span>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{selectedTenant.checkIn}</span>
                  </div>
                </div>
                <div className="card" style={{ padding: '1.2rem' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Mess Subscription</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '800', color: selectedTenant.messPlan === 'p1500' ? '#8b5cf6' : selectedTenant.messPlan === 'p1000' ? '#3b82f6' : 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {selectedTenant.messPlan === 'p1500' ? 'Premium Plan 🔥' : selectedTenant.messPlan === 'p1000' ? 'Standard Plan' : 'Basic Plan'}
                    </span>
                    {selectedTenant.messPlan !== 'p1500' && (
                      <button style={{ fontSize: '0.7rem', background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '800', cursor: 'pointer' }}>UPGRADE</button>
                    )}
                  </div>
                  {selectedTenant.messPlan === 'basic' && (
                    <p style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', marginTop: '0.5rem', fontWeight: '700' }}>💡 Upgrade to Premium for full meal customization!</p>
                  )}
                </div>
              </div>

              <div className="card" style={{ padding: '1.2rem', marginBottom: '1.5rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Verification Documents</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedTenant.docs?.map((d, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '6px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <ShieldCheck size={14} color={d.verified ? 'var(--accent-success)' : 'var(--accent-warning)'} />
                      {d.name}
                    </span>
                  ))}
                  {(!selectedTenant.docs || selectedTenant.docs.length === 0) && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No documents uploaded.</span>}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                 <button className="btn btn-primary" onClick={handleEditClick} style={{ flex: 1, padding: '0.8rem' }}>Edit Details</button>
                 <button className="btn" onClick={handleDownloadContract} disabled={isDownloading} style={{ flex: 1, padding: '0.8rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                   {isDownloading ? (
                     <>
                       <div className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                       Wait...
                     </>
                   ) : (
                     <>
                       <FileText size={16} /> Contract
                     </>
                   )}
                 </button>
              </div>
            </div>
          )}
        </Modal>

        <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} title={modalMode === 'edit' ? "Update Resident Profile" : "Register New Tenant"}>
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Full Name</label>
                <input style={inputStyle} value={registerFormData.name} onChange={e => setRegisterFormData({...registerFormData, name: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Email Address</label>
                <input type="email" style={inputStyle} value={registerFormData.email} onChange={e => setRegisterFormData({...registerFormData, email: e.target.value})} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Phone Number</label>
                <input style={inputStyle} value={registerFormData.phone} onChange={e => setRegisterFormData({...registerFormData, phone: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Emergency Contact</label>
                <input style={inputStyle} value={registerFormData.emergencyContact} onChange={e => setRegisterFormData({...registerFormData, emergencyContact: e.target.value})} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Assign Room</label>
                <input placeholder="e.g. 201-A" style={inputStyle} value={registerFormData.room} onChange={e => setRegisterFormData({...registerFormData, room: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Monthly Rent (₹)</label>
                <input type="number" style={inputStyle} value={registerFormData.rent} onChange={e => setRegisterFormData({...registerFormData, rent: e.target.value})} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Check-in Date</label>
                <input type="date" style={inputStyle} value={registerFormData.checkIn} onChange={e => setRegisterFormData({...registerFormData, checkIn: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Aadhaar Number</label>
                <input style={inputStyle} value={registerFormData.aadhaar} onChange={e => setRegisterFormData({...registerFormData, aadhaar: e.target.value})} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Mess Subscription Plan</label>
                <select style={inputStyle} value={registerFormData.messPlan} onChange={e => setRegisterFormData({...registerFormData, messPlan: e.target.value})}>
                  <option value="basic">Basic Plan (Included)</option>
                  <option value="p1000">Standard Plan (₹1000)</option>
                  <option value="p1500">Premium Plan (₹1500) 🔥</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.2rem' }}>
                 <input type="checkbox" id="allow_custom" />
                 <label htmlFor="allow_custom" style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Allow Customization</label>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>Upload Document (ID Proof)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <label className="btn" style={{ background: 'var(--bg-tertiary)', border: '1px dashed var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer', flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <input 
                    type="file" 
                    style={{ display: 'none' }} 
                    onChange={e => setRegisterFormData({...registerFormData, document: e.target.files[0]})} 
                  />
                  <FileText size={18} />
                  {registerFormData.document ? (typeof registerFormData.document === 'string' ? registerFormData.document : registerFormData.document.name) : 'Choose File...'}
                </label>
                {registerFormData.document && (
                  <button type="button" onClick={() => setRegisterFormData({...registerFormData, document: null})} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: 'var(--accent-error)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem' }}>{modalMode === 'edit' ? "Save Changes" : "Confirm Registration"}</button>
              <button className="btn" type="button" onClick={() => setIsRegisterModalOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)' }}>Cancel</button>
            </div>
          </form>
        </Modal>

        <Modal isOpen={isBulkRegisterModalOpen} onClose={() => setIsBulkRegisterModalOpen(false)} title="Bulk Resident Registration" maxWidth="1200px">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {isLoading ? (
              <div style={{ padding: '4rem', textAlign: 'center' }}>
                <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
                <p style={{ color: 'var(--text-muted)' }}>Fetching property infrastructure...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ maxHeight: '450px', overflow: 'auto', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-tertiary)' }}>
                      <tr>
                        <th style={{ padding: '1rem', textAlign: 'left', minWidth: '180px' }}>Resident Name</th>
                        <th style={{ padding: '1rem', textAlign: 'left', minWidth: '150px' }}>Phone</th>
                        <th style={{ padding: '1rem', textAlign: 'left', minWidth: '140px' }}>Building</th>
                        <th style={{ padding: '1rem', textAlign: 'left', minWidth: '100px' }}>Floor</th>
                        <th style={{ padding: '1rem', textAlign: 'left', minWidth: '120px' }}>Room</th>
                        <th style={{ padding: '1rem', textAlign: 'left', minWidth: '100px' }}>Bed</th>
                        <th style={{ padding: '1rem', textAlign: 'left', minWidth: '120px' }}>Rent (₹)</th>
                        <th style={{ padding: '1rem', textAlign: 'center', minWidth: '80px' }}>Docs</th>
                        <th style={{ padding: '1rem', textAlign: 'center', width: '60px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {manualRows?.map((row, idx) => (
                        <tr key={row.id || idx} style={{ borderTop: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.8rem' }}>
                            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <Users size={16} style={{ position: 'absolute', left: '0.8rem', color: 'var(--text-muted)' }} />
                              <input 
                                style={{ ...inputStyle, paddingLeft: '2.5rem' }} 
                                placeholder="Full Name" 
                                value={row.name}
                                onChange={e => {
                                  const newRows = [...manualRows];
                                  newRows[idx].name = e.target.value;
                                  setManualRows(newRows);
                                }}
                              />
                            </div>
                          </td>
                          <td style={{ padding: '0.8rem' }}>
                            <input 
                              style={inputStyle} 
                              placeholder="Phone Number" 
                              value={row.phone}
                              onChange={e => {
                                const newRows = [...manualRows];
                                newRows[idx].phone = e.target.value;
                                setManualRows(newRows);
                              }}
                            />
                          </td>
                          <td style={{ padding: '0.8rem' }}>
                            <select 
                              style={inputStyle}
                              value={row.building}
                              onChange={e => {
                                const newRows = [...manualRows];
                                newRows[idx].building = e.target.value;
                                newRows[idx].floor = '';
                                newRows[idx].room = '';
                                newRows[idx].bed = '';
                                setManualRows(newRows);
                              }}
                            >
                              <option value="">Select...</option>
                              {infrastructure.buildings?.map(b => <option key={b.id || Math.random()} value={b.id}>{b.name}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: '0.8rem' }}>
                            <select 
                              style={inputStyle}
                              value={row.floor}
                              onChange={e => {
                                const newRows = [...manualRows];
                                newRows[idx].floor = e.target.value;
                                newRows[idx].room = '';
                                newRows[idx].bed = '';
                                setManualRows(newRows);
                              }}
                              disabled={!row.building}
                            >
                              <option value="">...</option>
                              {infrastructure.floors?.filter(f => f.buildingId === row.building).map(f => <option key={f.id || Math.random()} value={f.id}>Floor {f.floorNumber}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: '0.8rem' }}>
                            <select 
                              style={inputStyle}
                              value={row.room}
                              onChange={e => {
                                const newRows = [...manualRows];
                                newRows[idx].room = e.target.value;
                                newRows[idx].bed = '';
                                setManualRows(newRows);
                              }}
                              disabled={!row.floor}
                            >
                              <option value="">...</option>
                              {infrastructure.rooms?.filter(r => r.floorId === row.floor).map(r => <option key={r.id || Math.random()} value={r.id}>Room {r.roomNumber}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: '0.8rem' }}>
                            <select 
                              style={inputStyle}
                              value={row.bed}
                              onChange={e => {
                                const newRows = [...manualRows];
                                newRows[idx].bed = e.target.value;
                                setManualRows(newRows);
                              }}
                              disabled={!row.room}
                            >
                              <option value="">...</option>
                              {infrastructure.beds?.filter(b => b.roomId === row.room).map(b => <option key={b.id || Math.random()} value={b.id}>{b.bedNumber}</option>)}
                            </select>
                          </td>
                          <td style={{ padding: '0.8rem' }}>
                            <input 
                              style={inputStyle} 
                              type="number" 
                              placeholder="6500" 
                              value={row.rent}
                              onChange={e => {
                                const newRows = [...manualRows];
                                newRows[idx].rent = e.target.value;
                                setManualRows(newRows);
                              }}
                            />
                          </td>
                          <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <input 
                                type="file" 
                                style={{ display: 'none' }} 
                                onChange={e => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    const newRows = [...manualRows];
                                    newRows[idx].doc = file;
                                    setManualRows(newRows);
                                  }
                                }}
                              />
                              <div style={{ 
                                padding: '0.5rem', borderRadius: '8px', 
                                background: row.doc ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                                color: row.doc ? 'var(--accent-success)' : 'var(--text-muted)',
                                border: row.doc ? '1px solid var(--accent-success)' : '1px solid var(--border-color)'
                              }}>
                                {row.doc ? <Check size={16} /> : <FileText size={16} />}
                              </div>
                            </label>
                          </td>
                          <td style={{ padding: '0.8rem', textAlign: 'center' }}>
                            <button 
                              onClick={() => {
                                if (manualRows.length > 1) {
                                  setManualRows(manualRows.filter((_, i) => i !== idx));
                                }
                              }}
                              style={{ background: 'transparent', border: 'none', color: 'var(--accent-error)', cursor: 'pointer', padding: '0.4rem' }}
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button 
                  onClick={() => setManualRows([...manualRows, { id: Math.random().toString(36).substr(2, 9), name: '', phone: '', building: '', floor: '', room: '', bed: '', rent: '', deposit: '', doc: null }])}
                  className="btn" 
                  style={{ border: '2px dashed var(--border-color)', color: 'var(--text-secondary)', background: 'transparent', width: '100%', padding: '1rem' }}
                >
                  <Plus size={18} /> Add New Row
                </button>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
              <div style={{ color: validationErrors.length > 0 ? 'var(--accent-error)' : 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {validationErrors.length > 0 ? <AlertTriangle size={18} /> : <ShieldCheck size={18} />}
                {validationErrors.length > 0 ? `${validationErrors.length} validation errors found` : `Validated: ${manualRows.filter(r => r.name && r.phone).length} records ready`}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn" 
                  onClick={() => {
                    const errors = [];
                    manualRows.forEach((row, i) => {
                      if (row.name && !row.phone) errors.push(`Row ${i+1}: Missing phone`);
                      if (row.phone && !row.name) errors.push(`Row ${i+1}: Missing name`);
                    });
                    setValidationErrors(errors);
                    if (errors.length === 0) alert('Data is valid!');
                  }}
                  style={{ border: '1px solid var(--border-color)', background: 'transparent' }}
                >
                  Validate Data
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleBulkRegisterSubmit}
                  disabled={isSubmitting || manualRows.some(r => (r.name && !r.phone) || (r.phone && !r.name))}
                  style={{ padding: '0.8rem 2.5rem', fontWeight: '800', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Registering...' : 'Register Residents'}
                </button>
              </div>
            </div>
          </div>
        </Modal>

      <style>{`
        .table-row-hover:hover {
          background: var(--bg-tertiary);
        }
        .loader {
          width: 48px;
          height: 48px;
          border: 5px solid var(--bg-tertiary);
          border-bottom-color: var(--accent-primary);
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }
        @keyframes rotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Tenants;
