import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle, XCircle, Clock, ArrowRightLeft, User, Home, MessageSquare } from 'lucide-react';
import API from '../api/axios';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchTransfers = async () => {
    try {
      const response = await API.get('/transfers');
      setTransfers(response.data);
    } catch (err) {
      console.error('Error fetching transfers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await API.patch(`/transfers/${id}`, { status: newStatus });
      setTransfers(transfers.map(t => t._id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      console.error('Error updating transfer status:', err);
      alert('Failed to update status.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return <span style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800' }}>APPROVED</span>;
      case 'Rejected': return <span style={{ color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800' }}>REJECTED</span>;
      default: return <span style={{ color: '#F59E0B', background: 'rgba(245, 158, 11, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '800' }}>PENDING</span>;
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out', minHeight: '100vh', background: '#F8FAFC', padding: '0.5rem' }}>
      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-table-view {
            display: none;
          }
          .mobile-transfer-cards {
            display: grid !important;
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 1rem;
          }
        }
        @media (max-width: 768px) {
          .header-main {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem;
          }
        }
      `}</style>

      <header className="header-main" style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <ArrowRightLeft size={32} color="var(--accent-primary)" /> Room Transfer Requests
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Manage tenant requests to switch rooms or buildings.</p>
        </div>
      </header>

      <div className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px' }}>
        <div className="desktop-table-view">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1.2rem' }}>Tenant</th>
                <th style={{ padding: '1.2rem' }}>Transfer Details</th>
                <th style={{ padding: '1.2rem' }}>Status</th>
                <th style={{ padding: '1.2rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading transfer requests...</td></tr>
                ) : transfers.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No transfer requests found.</td></tr>
                ) : (
                  transfers.map(t => (
                    <React.Fragment key={t._id}>
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setExpandedId(expandedId === t._id ? null : t._id)}
                        style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}
                        className="table-row-hover"
                      >
                        <td style={{ padding: '1.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <User size={20} color="var(--text-muted)" />
                            </div>
                            <div>
                              <p style={{ fontWeight: '700', fontSize: '1rem' }}>{t.tenant?.name || t.name}</p>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.tenant?.phone || 'No phone'}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ textAlign: 'center' }}>
                              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800' }}>FROM</p>
                              <p style={{ fontWeight: '700' }}>{t.oldRoom}</p>
                            </div>
                            <ArrowRightLeft size={16} color="var(--accent-primary)" />
                            <div style={{ textAlign: 'center' }}>
                              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800' }}>TO</p>
                              <p style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>{t.newRoom}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '1.2rem' }}>
                          {getStatusBadge(t.status)}
                        </td>
                        <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                          {t.status === 'Pending' && (
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button onClick={(e) => { e.stopPropagation(); handleStatusChange(t._id, 'Approved'); }} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid #10B981' }}>Approve</button>
                              <button onClick={(e) => { e.stopPropagation(); handleStatusChange(t._id, 'Rejected'); }} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid #EF4444' }}>Reject</button>
                            </div>
                          )}
                        </td>
                      </motion.tr>
                      {expandedId === t._id && (
                        <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--bg-tertiary)' }}>
                          <td colSpan="4" style={{ padding: '1.5rem 2.5rem' }}>
                            <div style={{ borderLeft: '4px solid var(--accent-primary)', paddingLeft: '1.5rem' }}>
                              <p style={{ fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Reason for Transfer</p>
                              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>{t.reason || 'No reason provided.'}</p>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </React.Fragment>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="mobile-transfer-cards" style={{ display: 'none' }}>
          {loading ? (
             <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
          ) : transfers.length === 0 ? (
             <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No transfers found</div>
          ) : (
            transfers.map(t => (
              <div 
                key={t._id} 
                onClick={() => setExpandedId(expandedId === t._id ? null : t._id)}
                style={{ background: 'white', padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={18} color="var(--text-muted)" />
                    </div>
                    <p style={{ fontWeight: '800', fontSize: '0.95rem', margin: 0 }}>{t.tenant?.name || t.name}</p>
                  </div>
                  {getStatusBadge(t.status)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: '12px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '800', margin: 0 }}>FROM</p>
                    <p style={{ fontWeight: '700', fontSize: '0.9rem', margin: 0 }}>{t.oldRoom}</p>
                  </div>
                  <ArrowRightLeft size={14} color="var(--accent-primary)" />
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '800', margin: 0 }}>TO</p>
                    <p style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--accent-primary)', margin: 0 }}>{t.newRoom}</p>
                  </div>
                </div>
                {t.status === 'Pending' && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={(e) => { e.stopPropagation(); handleStatusChange(t._id, 'Approved'); }} className="btn" style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid #10B981' }}>Approve</button>
                    <button onClick={(e) => { e.stopPropagation(); handleStatusChange(t._id, 'Rejected'); }} className="btn" style={{ flex: 1, padding: '0.6rem', fontSize: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid #EF4444' }}>Reject</button>
                  </div>
                )}
                {expandedId === t._id && (
                   <div style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', fontSize: '0.85rem' }}>
                     <p style={{ fontWeight: '700', marginBottom: '0.25rem' }}>Reason:</p>
                     <p style={{ margin: 0 }}>{t.reason || 'No reason provided'}</p>
                   </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <style>{`
        .table-row-hover:hover { background: rgba(0,0,0,0.02); }
      `}</style>
    </div>
  );
};

export default Transfers;
