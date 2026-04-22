import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileText, CheckCircle, Clock, X, UploadCloud, CreditCard, AlertCircle, Calendar } from 'lucide-react';

const Tenants = () => {
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

  const getStatusBadge = (status) => {
    switch(status) {
      case 'ACTIVE': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' }}>ACTIVE</span>;
      case 'LEFT': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>LEFT</span>;
      case 'PENDING': return <span style={{ padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' }}>PENDING</span>;
      default: return null;
    }
  };

  return (
    <div className="tenants-page" style={{ position: 'relative', animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={32} color="var(--accent-primary)" /> Tenant Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Track all residents, documents, and their stay lifecycle.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={16} /> Register Tenant
        </button>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Tenant Details</th>
              <th style={{ padding: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Room / Status</th>
              <th style={{ padding: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Contact</th>
              <th style={{ padding: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Rent Status</th>
              <th style={{ padding: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'var(--transition-fast)' }} className="table-row-hover">
                <td style={{ padding: '1.2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '0.9rem', background: 'var(--accent-primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                      {tenant.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: '700', fontSize: '1rem' }}>{tenant.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tenant.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {tenant.room}
                    </span>
                    {getStatusBadge(tenant.status)}
                  </div>
                </td>
                <td style={{ padding: '1.2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{tenant.phone}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    background: tenant.rentStatus === 'PAID' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: tenant.rentStatus === 'PAID' ? 'var(--accent-success)' : 'var(--accent-error)'
                  }}>
                    {tenant.rentStatus === 'PAID' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                    {tenant.rentStatus}
                  </span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <button 
                    onClick={() => setSelectedTenant(tenant)}
                    className="btn" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                      View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedTenant && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTenant(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40, backdropFilter: 'blur(4px)' }}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{ 
                position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: '500px', 
                background: 'var(--bg-primary)', zIndex: 50, padding: '2rem',
                borderLeft: '1px solid var(--border-color)', overflowY: 'auto',
                boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '2px solid var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-primary)' }}>
                     {selectedTenant.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.2rem' }}>{selectedTenant.name}</h2>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{selectedTenant.room}</p>
                      {getStatusBadge(selectedTenant.status)}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedTenant(null)} style={{ background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: '50%' }}>
                  <X size={20} color="var(--text-secondary)" />
                </button>
              </div>

              {/* Personal Info */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: '700' }}>Personal Information</h4>
                <div className="card" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Phone</span>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{selectedTenant.email} <br/> {selectedTenant.phone}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Emergency Contact</span>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: 'var(--accent-error)' }}>{selectedTenant.emergencyContact}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '1rem' }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14}/> Check-in Date</span>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{selectedTenant.checkIn}</span>
                  </div>
                </div>
              </div>

              {/* Financials */}
              <div style={{ marginBottom: '2rem' }}>
                 <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', fontWeight: '700' }}>Financials</h4>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="card" style={{ padding: '1.2rem', background: 'var(--bg-tertiary)' }}>
                       <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}><CreditCard size={14}/> Monthly Rent</p>
                       <p style={{ fontSize: '1.4rem', fontWeight: '800' }}>₹{selectedTenant.rent}</p>
                    </div>
                    <div className="card" style={{ padding: '1.2rem', border: selectedTenant.rentStatus === 'PAID' ? '1px solid var(--accent-success)' : '1px solid var(--accent-error)' }}>
                       <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Current Dues</p>
                       <p style={{ fontSize: '1.4rem', fontWeight: '800', color: selectedTenant.rentStatus === 'PAID' ? 'var(--accent-success)' : 'var(--accent-error)' }}>
                         {selectedTenant.rentStatus === 'PAID' ? '₹0' : `₹${selectedTenant.rent}`}
                       </p>
                    </div>
                 </div>
              </div>

              {/* Documents */}
              <div style={{ marginBottom: '2rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                   <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>Documents (KYC)</h4>
                   <button className="btn" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', border: '1px solid var(--border-color)' }}>
                     <UploadCloud size={12} style={{ marginRight: '0.3rem' }}/> Upload New
                   </button>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                   {selectedTenant.docs.map((doc, idx) => (
                     <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                         <div style={{ padding: '0.5rem', background: 'rgba(14, 165, 233, 0.1)', color: 'var(--accent-primary)', borderRadius: '8px' }}>
                           <FileText size={18} />
                         </div>
                         <div>
                           <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{doc.name}</p>
                           <p style={{ fontSize: '0.75rem', color: doc.verified ? 'var(--accent-success)' : 'var(--accent-warning)', fontWeight: '600' }}>
                             {doc.verified ? 'Verified' : 'Pending Verification'}
                           </p>
                         </div>
                       </div>
                       <button className="btn" style={{ fontSize: '0.75rem', color: 'var(--accent-primary)' }}>View</button>
                     </div>
                   ))}
                   {selectedTenant.docs.length === 0 && (
                     <div style={{ padding: '2rem', textAlign: 'center', border: '2px dashed var(--border-color)', borderRadius: '12px' }}>
                       <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No documents uploaded yet.</p>
                     </div>
                   )}
                 </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: 'auto', paddingTop: '2rem' }}>
                 <button className="btn btn-primary" style={{ width: '100%' }}>Edit Profile</button>
                 {selectedTenant.status === 'ACTIVE' && (
                   <button className="btn" style={{ width: '100%', border: '1px solid var(--accent-error)', color: 'var(--accent-error)' }}>Initiate Checkout</button>
                 )}
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .table-row-hover:hover {
          background: var(--bg-tertiary);
        }
      `}</style>
    </div>
  );
};

export default Tenants;
