import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../api/axios';
import { api } from '../mockData';
import { 
  Wrench, 
  AlertCircle, 
  CheckCircle2, 
  Activity,
  Filter,
  Search,
  Building2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import socket, { connectSocket } from '../utils/socket';
import './Assets.css';

const Assets = () => {
  const { buildingId } = useParams();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Ticket feed states
  const [ticketSearchTerm, setTicketSearchTerm] = useState('');
  const [ticketFilterStatus, setTicketFilterStatus] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  
  // Assignment Modal states
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [staff, setStaff] = useState([]);
  
  const [lastNotification, setLastNotification] = useState(null);

  const defaultStaff = [
    { id: 'default-1', name: 'Ramesh Kumar', role: 'Plumber', avatar: 'RK' },
    { id: 'default-2', name: 'Suresh Babu', role: 'Electrician', avatar: 'SB' },
    { id: 'default-3', name: 'Pradeep Singh', role: 'Cleaning Lead', avatar: 'PS' }
  ];

  const fetchAssets = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const res = await axios.get(`/assets/summary?buildingId=${buildingId}`);
      setSummary(res.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching assets:', err);
      setError('Failed to load assets');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets(true);

    if (buildingId) {
      connectSocket(buildingId);

      const handleNewComplaint = (data) => {
        console.log('🔔 New complaint received on Assets page:', data);
        if (data.complaint?.asset) {
          setLastNotification(`New Asset Issue: ${data.complaint.asset} (${data.complaint.subIssue || data.complaint.customIssue || 'General'}) reported by ${data.tenantName || 'a resident'}`);
          fetchAssets(false);
          setTimeout(() => setLastNotification(null), 5000);
        }
      };

      const handleStatusChanged = (updatedComplaint) => {
        console.log('🔄 Asset Complaint Status Updated in Real-time:', updatedComplaint);
        if (updatedComplaint.asset) {
          setSummary(prev => {
            if (!prev) return prev;
            const updatedComplaints = prev.complaints.map(c => 
              (c._id === updatedComplaint._id || c.id === updatedComplaint._id) ? updatedComplaint : c
            );
            return { ...prev, complaints: updatedComplaints };
          });
          fetchAssets(false);
        }
      };

      socket.on('complaintCreated', handleNewComplaint);
      socket.on('complaintStatusChanged', handleStatusChanged);

      return () => {
        socket.off('complaintCreated', handleNewComplaint);
        socket.off('complaintStatusChanged', handleStatusChanged);
      };
    }
  }, [buildingId]);

  const handleStatusChange = async (id, newStatus, assignedTo = null) => {
    try {
      await api.updateComplaintStatus(id, newStatus, assignedTo);
      // Update local state dynamically
      setSummary(prev => {
        if (!prev) return prev;
        const updatedComplaints = prev.complaints.map(c => 
          (c._id === id || c.id === id) ? { ...c, status: newStatus, assignedTo } : c
        );
        return { ...prev, complaints: updatedComplaints };
      });
      setIsAssignModalOpen(false);
      fetchAssets(false); // Sync KPIs
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };

  const handleOpenAssignModal = async (complaintId, bId) => {
    setSelectedComplaintId(complaintId);
    try {
      const res = await api.getStaff(bId || buildingId);
      setStaff(res?.staffList || []);
      setIsAssignModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch staff list:', err);
      setStaff([]);
      setIsAssignModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="assets-container loading-state">
        <div className="spinner"></div>
        <p>Loading assets data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assets-container error-state">
        <AlertCircle size={48} />
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => fetchAssets(true)} className="retry-btn">Retry</button>
      </div>
    );
  }

  const rawComplaints = summary?.complaints || [];

  const filteredComplaints = rawComplaints.filter(c => {
    const matchesSearch = c.title?.toLowerCase()?.includes(ticketSearchTerm.toLowerCase()) || 
                          c.description?.toLowerCase()?.includes(ticketSearchTerm.toLowerCase()) ||
                          c.tenant?.name?.toLowerCase()?.includes(ticketSearchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (ticketFilterStatus !== 'All') {
      matchesStatus = c.status === ticketFilterStatus;
    }

    return matchesSearch && matchesStatus;
  });

  const displayStaff = staff.length > 0 ? staff.map(s => ({
    id: s.id || s._id,
    name: s.name,
    role: s.role,
    avatar: s.name ? s.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'ST'
  })) : defaultStaff;

  return (
    <div className="assets-container">
      <AnimatePresence>
        {lastNotification && (
          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: 50 }}
            style={{ position: 'fixed', top: '2rem', right: '2rem', zIndex: 10000, background: 'var(--accent-primary)', color: 'white', padding: '1rem 1.5rem', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.8rem' }}
          >
            <Activity size={20} />
            {lastNotification}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="page-header">
        <div className="header-content">
          <h1>Asset Management</h1>
          <p>Track and manage complaints related to building assets</p>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon blue"><Wrench /></div>
          <div className="card-info">
            <h3>Total Assets Affected</h3>
            <p className="card-value">{summary?.totalAssets || 0}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon red"><AlertCircle /></div>
          <div className="card-info">
            <h3>Active Issues</h3>
            <p className="card-value">{summary?.activeIssues || 0}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon green"><CheckCircle2 /></div>
          <div className="card-info">
            <h3>Resolved Issues</h3>
            <p className="card-value">{summary?.resolvedIssues || 0}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon orange"><Activity /></div>
          <div className="card-info">
            <h3>High Frequency</h3>
            <p className="card-value">{summary?.highFrequencyAssets || 'None'}</p>
          </div>
        </div>
      </div>

      {/* Detailed Individual Tickets Feed Section */}
      <div className="assets-table-section">
        <div className="table-header">
          <h2>Asset support Tickets</h2>
          <div className="table-actions">
            <div className="search-bar">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search by resident or title..." 
                value={ticketSearchTerm}
                onChange={(e) => setTicketSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-dropdown">
              <Filter size={18} />
              <select value={ticketFilterStatus} onChange={(e) => setTicketFilterStatus(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In-Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="assets-table">
            <thead>
              <tr>
                <th>Resident & Location</th>
                <th>Asset Details</th>
                <th>Priority</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">No asset tickets found.</td>
                </tr>
              ) : (
                filteredComplaints.map((c) => {
                  const isExpanded = expandedId === (c._id || c.id);
                  return (
                    <React.Fragment key={c._id || c.id}>
                      <tr 
                        style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                        onClick={() => setExpandedId(isExpanded ? null : (c._id || c.id))}
                        className="table-row-hover"
                      >
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{c.tenant?.name || 'Unknown Resident'}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                              <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '700', background: 'rgba(99, 102, 241, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                                Room {c.tenant?.room || c.roomId?.roomNumber || 'TBD'}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                {c.buildingId?.name || 'Unknown Building'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{c.title}</span>
                            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(14, 165, 233, 0.1)', color: '#0EA5E9', fontWeight: '700' }}>
                                Asset: {c.asset}
                              </span>
                              {c.subIssue && (
                                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontWeight: '700' }}>
                                  Issue: {c.subIssue}
                                </span>
                              )}
                              {c.customIssue && (
                                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', fontWeight: '700' }}>
                                  Custom: {c.customIssue}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontWeight: '700',
                            background: c.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : c.priority === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(107, 114, 128, 0.1)',
                            color: c.priority === 'High' ? '#EF4444' : c.priority === 'Medium' ? '#D97706' : '#6B7280'
                          }}>
                            {c.priority || 'Medium'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${c.status?.toLowerCase().replace(' ', '-')}`}>
                            {c.status}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            {c.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => handleOpenAssignModal(c._id || c.id, c.buildingId?._id || c.buildingId)}
                                  className="action-btn-pro primary"
                                >
                                  Assign Staff
                                </button>
                                <button 
                                  onClick={() => handleStatusChange(c._id || c.id, 'Rejected')}
                                  className="action-btn-pro danger-outline"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {c.status === 'In-Progress' && (
                              <button 
                                onClick={() => handleStatusChange(c._id || c.id, 'Resolved')}
                                className="action-btn-pro success"
                              >
                                Resolve
                              </button>
                            )}
                            {(c.status === 'Resolved' || c.status === 'Rejected') && (
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600', paddingRight: '0.5rem' }}>
                                Closed
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr style={{ background: 'var(--bg-body, #f8fafc)' }}>
                          <td colSpan="5" style={{ padding: '1.5rem 2rem' }}>
                            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</p>
                              <p style={{ margin: 0, fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', fontWeight: '500' }}>{c.description || 'No description provided.'}</p>
                              {c.assignedTo && (
                                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Staff:</span>
                                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '0.15rem 0.5rem', borderRadius: '6px' }}>
                                    {c.assignedTo}
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Assignment Modal */}
      <AnimatePresence>
        {isAssignModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000, backdropFilter: 'blur(4px)' }} 
              onClick={() => setIsAssignModalOpen(false)} 
            />
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }} 
              animate={{ y: 0, opacity: 1, scale: 1 }} 
              exit={{ y: 50, opacity: 0, scale: 0.95 }} 
              style={{ position: 'fixed', top: '15%', left: '50%', x: '-50%', width: '90%', maxWidth: '420px', background: 'white', zIndex: 10001, padding: '2rem', borderRadius: '20px', boxShadow: 'var(--shadow-xl)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>Assign Staff</h3>
                <button onClick={() => setIsAssignModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20}/></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '320px', overflowY: 'auto', paddingRight: '0.2rem' }}>
                {displayStaff.map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => handleStatusChange(selectedComplaintId, 'In-Progress', s.name)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                      borderRadius: '12px', border: '1px solid var(--border-color)', 
                      background: 'var(--bg-body, #f8fafc)', cursor: 'pointer', transition: 'all 0.2s',
                      textAlign: 'left', width: '100%'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                  >
                    <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.9rem' }}>
                      {s.avatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '700', fontSize: '0.95rem', margin: 0, color: 'var(--text-primary)' }}>{s.name}</p>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: 0, fontWeight: '500' }}>{s.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Assets;
