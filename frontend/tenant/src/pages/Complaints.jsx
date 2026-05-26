import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import './Complaints.css';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';

const ASSET_ISSUES = {
  'Bathroom': [
    'Tap Leaking',
    'Shower Clogged/Broken',
    'Flush Not Working',
    'Drain Blockage',
    'Geyser Not Heating',
    'Mirror Broken',
    'Other'
  ],
  'Fan': [
    'Not Spinning',
    'Making Noise',
    'Speed Regulator Broken',
    'Other'
  ],
  'AC': [
    'Not Cooling',
    'Water Leakage',
    'Remote Not Working',
    'Making Noise',
    'Other'
  ],
  'WiFi': [
    'No Internet Connection',
    'Very Slow Speed',
    'Frequent Disconnections',
    'Other'
  ],
  'Elevator': [
    'Not Working',
    'Jerky Movement',
    'Door Sensor Issue',
    'Fan/Light Not Working inside Lift',
    'Other'
  ],
  'Water Purifier': [
    'No Water Flow',
    'Taste/Odor Issue',
    'Water Leakage',
    'Filter Indicator Red',
    'Other'
  ],
  'Other': [
    'Other Issue'
  ]
};

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    asset: '',
    subIssue: '',
    customIssue: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchComplaints();

    // Connect to real-time sync
    const buildingId = localStorage.getItem('buildingId');
    if (buildingId) {
      connectSocket(buildingId);

      socket.on('complaintStatusChanged', (updatedComplaint) => {
        console.log('🔄 Complaint Status Updated in Real-time');
        // Update local state directly for instant feedback
        setComplaints(prev => prev.map(c => c._id === updatedComplaint._id ? updatedComplaint : c));
        // Also show a toast/alert if possible or just rely on state update
      });
    }

    return () => {
      socket.off('complaintStatusChanged');
    };
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await API.get('/complaints/me').catch(() => ({ data: [] }));
      setComplaints(response.data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRaiseComplaint = async (e) => {
    e.preventDefault();
    if (!formData.category && !formData.asset) {
      setToastMsg('❌ Please select either a Category for a General Complaint, or an Asset for an Asset-Based Complaint.');
      setTimeout(() => setToastMsg(null), 5000);
      return;
    }
    setSubmitting(true);
    try {
      const buildingId = localStorage.getItem('buildingId');
      const payload = { ...formData, buildingId };
      if (payload.asset) {
        payload.category = payload.subIssue || payload.customIssue || payload.asset;
      }
      const response = await API.post('/complaints', payload);
      setComplaints([response.data, ...complaints]);
      setShowForm(false);
      setFormData({ title: '', category: '', description: '', asset: '', subIssue: '', customIssue: '' });
      setToastMsg('✅ Ticket raised successfully! Our team will look into it shortly.');
      setTimeout(() => setToastMsg(null), 4000);
    } catch (err) {
      console.error('Error raising complaint:', err);
      const msg = err.response?.data?.message || 'Failed to submit ticket. Please try again.';
      setToastMsg(`❌ ${msg}`);
      setTimeout(() => setToastMsg(null), 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="staynest-dashboard loading-state">
      <div className="premium-spinner"></div>
      <p>Synchronizing help desk records...</p>
    </div>
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComplaints = complaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(complaints.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="complaints-page">
      {toastMsg && (
        <div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 9999, padding: '1rem 1.5rem', borderRadius: '12px', background: toastMsg.startsWith('✅') ? 'rgba(16,185,129,0.95)' : 'rgba(239,68,68,0.95)', color: '#fff', fontWeight: '700', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', backdropFilter: 'blur(8px)', maxWidth: '380px', fontSize: '0.9rem', lineHeight: '1.5' }}>
          {toastMsg}
        </div>
      )}
      <header className="complaints-header">
        <div className="header-title-group">
          <div className="header-icon-main">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div>
            <h1>Help Desk & Support</h1>
            <p className="header-subtitle">Track your maintenance tickets and raise new requests with ease.</p>
          </div>
        </div>
        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="btn-primary btn-large">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Raise New Ticket
          </button>
        ) : (
          <button onClick={() => setShowForm(false)} className="btn-secondary btn-large" style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Tickets
          </button>
        )}
      </header>

      {showForm ? (
        <div className="sn-card" style={{ maxWidth: '800px', margin: '0 auto', width: '100%', padding: '2rem' }}>
          <div className="modal-header-pro" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
            <div className="modal-title-group" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="modal-icon-badge" style={{ width: '40px', height: '40px', background: '#E0E7FF', color: '#4F46E5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B', margin: '0 0 0.2rem 0' }}>Raise Support Ticket</h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>Our team will look into it shortly.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleRaiseComplaint} className="premium-form">
            <div className="input-group">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                Ticket Title
              </label>
              <input type="text" placeholder="e.g. Broken Fan, Water Leakage" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
            </div>

            <div className="form-row-dynamic" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', margin: '1rem 0' }}>
              <div className="input-group">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                  Category
                </label>
                <div className="select-wrapper">
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option value="">Select Category</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="WiFi">WiFi / IT</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Security">Security</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                  Asset
                </label>
                <div className="select-wrapper">
                  <select
                    value={formData.asset}
                    onChange={e => {
                      setFormData({ ...formData, asset: e.target.value, subIssue: '', customIssue: '' });
                    }}
                  >
                    <option value="">Select Asset </option>
                    {Object.keys(ASSET_ISSUES).map(asset => (
                      <option key={asset} value={asset}>{asset}</option>
                    ))}
                  </select>
                </div>
              </div>

              {formData.asset && ASSET_ISSUES[formData.asset]?.length > 0 && formData.asset !== 'Other' && (
                <div className="input-group">
                  <label>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    Specific Issue
                  </label>
                  <div className="select-wrapper">
                    <select
                      value={formData.subIssue}
                      onChange={e => setFormData({ ...formData, subIssue: e.target.value })}
                    >
                      <option value="">Select Issue </option>
                      {ASSET_ISSUES[formData.asset].map(issue => (
                        <option key={issue} value={issue}>{issue}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {(formData.asset === 'Other' || formData.subIssue === 'Other') && (
              <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  Custom Issue
                </label>
                <input type="text" placeholder="Please specify your custom issue..." value={formData.customIssue} onChange={e => setFormData({ ...formData, customIssue: e.target.value })} required />
              </div>
            )}

            <div className="input-group">
              <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                Description (Optional)
              </label>
              <textarea rows="2" placeholder="Describe the issue in detail to help us resolve it faster..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}></textarea>
            </div>

            <button type="submit" className="btn-primary btn-large" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Raise Support Ticket'}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="tickets-summary-grid">
            <div className="sn-card stat-card-mini">
              <span className="stat-label">Total Tickets</span>
              <h2 className="stat-value">{complaints.length}</h2>
            </div>
            <div className="sn-card stat-card-mini success">
              <span className="stat-label">Resolved</span>
              <h2 className="stat-value">{complaints.filter(c => c.status === 'Resolved').length}</h2>
            </div>
            <div className="sn-card stat-card-mini warning">
              <span className="stat-label">Pending</span>
              <h2 className="stat-value">{complaints.filter(c => c.status !== 'Resolved').length}</h2>
            </div>
          </div>

          <div className="sn-card ticket-history-card">
            <div className="card-header-iconic">
              <div className="icon-badge-history">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="sn-card-title">Active Support Tickets</h3>
            </div>

            <div className="table-view-desktop">
              <table className="tickets-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Ticket Details</th>
                    <th>Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentComplaints.length === 0 ? (
                    <tr><td colSpan="4" className="td-empty">Everything is working perfectly! No active tickets found.</td></tr>
                  ) : (
                    currentComplaints.map(item => (
                      <tr key={item._id}>
                        <td className="td-date">{new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                        <td className="td-info">
                          <div className="ticket-main">
                            <span className="ticket-title">{item.title}</span>
                            <span className="ticket-desc">{item.description}</span>
                          </div>
                        </td>
                        <td>
                          <span className="category-tag">{item.category}</span>
                        </td>
                        <td>
                          <span className={`status-pill ${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mobile-cards-view">
              {currentComplaints.length === 0 ? (
                <div className="td-empty">Everything is working perfectly!</div>
              ) : (
                currentComplaints.map(item => (
                  <div key={item._id} className="mobile-ticket-card">
                    <div className="mobile-card-top">
                      <span className="m-date">{new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                      <span className={`status-pill ${item.status.toLowerCase()}`}>{item.status}</span>
                    </div>
                    <div className="mobile-card-middle">
                      <span className="ticket-title">{item.title}</span>
                      <span className="category-tag">{item.category}</span>
                    </div>
                    <div className="mobile-card-bottom">
                      <p className="ticket-desc">{item.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderTop: '1px solid #E2E8F0', marginTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, complaints.length)} of {complaints.length} entries
                </span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: currentPage === 1 ? '#F8FAFC' : '#FFFFFF', color: currentPage === 1 ? '#CBD5E1' : '#475569', fontWeight: '600', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    Previous
                  </button>

                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: currentPage === index + 1 ? 'none' : '1px solid #E2E8F0',
                          background: currentPage === index + 1 ? 'var(--accent-primary)' : '#FFFFFF',
                          color: currentPage === index + 1 ? '#FFFFFF' : '#475569',
                          fontWeight: '700', cursor: 'pointer'
                        }}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: currentPage === totalPages ? '#F8FAFC' : '#FFFFFF', color: currentPage === totalPages ? '#CBD5E1' : '#475569', fontWeight: '600', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Complaints;
