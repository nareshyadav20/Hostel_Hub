import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import './Complaints.css';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: 'Maintenance', description: '' });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await API.get('/complaints/me').catch(() => ({ data: [
        { _id: '1', title: 'Leaking Tap', category: 'Maintenance', description: 'Bathroom tap is leaking constantly.', status: 'Pending', createdAt: new Date().toISOString() },
        { _id: '2', title: 'WiFi Connectivity', category: 'WiFi', description: 'Signal is very weak in Room 402.', status: 'Resolved', createdAt: new Date().toISOString() }
      ]}));
      setComplaints(response.data || []);
    } catch (err) { 
      console.error('Error fetching complaints:', err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleRaiseComplaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await API.post('/complaints', formData);
      setComplaints([response.data, ...complaints]);
      setShowForm(false);
      setFormData({ title: '', category: 'Maintenance', description: '' });
      alert('Ticket raised successfully! Our team will look into it shortly.');
    } catch (err) { 
      console.error('Error raising complaint:', err); 
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

  return (
    <div className="complaints-page">
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
        <button onClick={() => setShowForm(true)} className="btn-primary btn-large">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Raise New Ticket
        </button>
      </header>

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

        <div className="table-overflow">
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
              {complaints.length === 0 ? (
                <tr><td colSpan="4" className="td-empty">Everything is working perfectly! No active tickets found.</td></tr>
              ) : (
                complaints.map(item => (
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
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content-premium">
            <div className="modal-header-pro">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3>Raise Support Ticket</h3>
                  <p>Our team will look into it shortly.</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowForm(false)}>✕</button>
            </div>
            
            <form onSubmit={handleRaiseComplaint} className="premium-form">
              <div className="form-row">
                <div className="input-group">
                  <label>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    Ticket Title
                  </label>
                  <input type="text" placeholder="e.g. Broken Fan, Water Leakage" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                    Category
                  </label>
                  <div className="select-wrapper">
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="Maintenance">Maintenance</option>
                      <option value="WiFi">WiFi / IT</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Security">Security</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                  Description
                </label>
                <textarea rows="4" placeholder="Describe the issue in detail to help us resolve it faster..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
              </div>
              <button type="submit" className="btn-primary btn-large" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Raise Support Ticket'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaints;
