import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import './Transfers.css';

const Transfers = () => {
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transfers, setTransfers] = useState([]);
  const [tenantData, setTenantData] = useState(null);
  const [formData, setFormData] = useState({ newRoom: '', reason: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, transfersRes] = await Promise.all([
          API.get('/tenants/me').catch(() => ({ data: { name: 'Valued Resident', room: 'Awaiting Assignment' } })),
          API.get('/transfers/me').catch(() => ({ data: [
            { _id: '1', oldRoom: '302-A', newRoom: '405-B', createdAt: new Date().toISOString(), status: 'Approved', reason: 'Better ventilation needed.' },
            { _id: '2', oldRoom: '201-C', newRoom: '102-A', createdAt: new Date().toISOString(), status: 'Pending', reason: 'Closer to elevators.' }
          ]}))
        ]);
        setTenantData(profileRes.data);
        setTransfers(transfersRes.data || []);
      } catch (err) { 
        console.error('Error fetching transfer data:', err); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await API.post('/transfers', { ...formData, name: tenantData?.name, oldRoom: tenantData?.room });
      setTransfers([response.data, ...transfers]);
      setShowForm(false);
      setFormData({ newRoom: '', reason: '' });
      alert('Transfer Request Submitted Successfully!');
    } catch (err) { 
      console.error('Error submitting transfer:', err); 
    } finally { 
      setSubmitting(false); 
    }
  };

  if (loading) return (
    <div className="staynest-dashboard loading-state">
      <div className="premium-spinner"></div>
      <p>Synchronizing transfer records...</p>
    </div>
  );

  return (
    <div className="transfers-page">
      <header className="transfers-header">
        <div className="header-icon-main">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 3 21 3 21 8"></polyline>
            <line x1="12" y1="12" x2="21" y2="3"></line>
            <polyline points="8 21 3 21 3 16"></polyline>
            <line x1="12" y1="12" x2="3" y2="21"></line>
          </svg>
        </div>
        <div>
          <h1>Room Transfer</h1>
          <p className="header-subtitle">Request to relocate to a different room or building unit.</p>
        </div>
      </header>

      <div className="transfer-summary-grid">
        <div className="sn-card current-residency-card">
          <div className="card-header-iconic">
            <div className="icon-badge-blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <h3 className="sn-card-title">Active Residency</h3>
          </div>
          <div className="residency-details">
            <div className="residency-item">
              <span className="res-label">Resident Name</span>
              <span className="res-value">{tenantData?.name || 'N/A'}</span>
            </div>
            <div className="residency-item">
              <span className="res-label">Current Room</span>
              <span className="res-value highlight">{tenantData?.room || 'Not Assigned'}</span>
            </div>
          </div>
        </div>

        <div className="sn-card transfer-action-card">
          <div className="action-visual">
            <div className="pulse-icon-container">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              </svg>
            </div>
            <h3>Need a New Space?</h3>
            <p>Moving to a new space is hassle-free. Just specify your target room.</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Request Transfer
            </button>
          </div>
        </div>
      </div>

      <div className="sn-card history-card-full">
        <div className="card-header-iconic">
          <div className="icon-badge-history">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 className="sn-card-title">Transfer Request History</h3>
        </div>

        <div className="table-overflow">
          <table className="transfer-table">
            <thead>
              <tr>
                <th>Date Submitted</th>
                <th>Transfer Route</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transfers.length === 0 ? (
                <tr><td colSpan="4" className="td-empty">No previous requests found.</td></tr>
              ) : (
                transfers.map(t => (
                  <tr key={t._id}>
                    <td className="td-date">{new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="td-route">
                      <div className="route-flow">
                        <span className="room-badge old">{t.oldRoom}</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                        <span className="room-badge new">{t.newRoom}</span>
                      </div>
                    </td>
                    <td className="td-reason">{t.reason}</td>
                    <td>
                      <span className={`status-pill ${t.status.toLowerCase()}`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content-premium">
            <div className="modal-header-pro">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"></polyline>
                    <line x1="12" y1="12" x2="21" y2="3"></line>
                    <polyline points="8 21 3 21 3 16"></polyline>
                    <line x1="12" y1="12" x2="3" y2="21"></line>
                  </svg>
                </div>
                <div>
                  <h3>Request Room Transfer</h3>
                  <p>Submit your relocation request to management.</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="premium-form">
              <div className="input-group">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Target Room / Building
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 402-B or Elite Tower" 
                  value={formData.newRoom} 
                  onChange={e => setFormData({...formData, newRoom: e.target.value})} 
                  required 
                />
              </div>
              <div className="input-group">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Reason for Transfer
                </label>
                <textarea 
                  rows="3" 
                  placeholder="Briefly explain why you want to move..."
                  value={formData.reason} 
                  onChange={e => setFormData({...formData, reason: e.target.value})} 
                  required 
                />
              </div>
              <button type="submit" className="btn-primary btn-large" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Send Transfer Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;
