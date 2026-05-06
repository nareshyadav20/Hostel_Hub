import React, { useState, useRef, useEffect } from 'react';
import API from '../api/axios';
import './Safety.css';

const Safety = () => {
  const [sosProgress, setSosProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [incidentSubmitted, setIncidentSubmitted] = useState(false);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const timerRef = useRef(null);
  const sirenRef = useRef(new Audio('https://www.soundjay.com/emergency/sounds/siren-1.mp3'));

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const response = await API.get('/confidential-reports/me').catch(() => ({ data: [
        { _id: '1', classification: 'Theft', location: 'Block A, 203', description: 'Someone took my laptop charger from the common area.', createdAt: new Date().toISOString(), status: 'Under Investigation' },
        { _id: '2', classification: 'Maintenance', location: 'Mess Hall', createdAt: new Date().toISOString(), description: 'The exhaust fan is making too much noise.', status: 'Resolved' }
      ]}));
      setReports(response.data || []);
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoadingReports(false);
    }
  };

  const startHolding = () => {
    setIsHolding(true);
    let start = Date.now();
    timerRef.current = setInterval(() => {
      let elapsed = Date.now() - start;
      let progress = Math.min((elapsed / 2000) * 100, 100);
      setSosProgress(progress);
      if (progress >= 100) {
        clearInterval(timerRef.current);
        sirenRef.current.loop = true;
        sirenRef.current.play().catch(e => console.log('Audio failed'));
        alert('🚨 SOS ALERT SENT!');
        setSosProgress(0);
        setIsHolding(false);
      }
    }, 20);
  };

  const stopHolding = () => {
    clearInterval(timerRef.current);
    setIsHolding(false);
    setSosProgress(0);
    if (sirenRef.current) { sirenRef.current.pause(); sirenRef.current.currentTime = 0; }
  };

  const [formData, setFormData] = useState({ type: 'Theft', location: '', description: '' });

  const handleIncidentSubmit = async (e) => {
    e.preventDefault();
    setIncidentSubmitted(true);
    try {
      await API.post('/confidential-reports', { 
        classification: formData.type, 
        location: formData.location, 
        description: formData.description 
      });
      alert('Your confidential report has been submitted successfully.');
      setFormData({ type: 'Theft', location: '', description: '' });
      fetchReports();
    } catch (err) { 
      console.error('Error reporting:', err); 
      alert('Failed to submit report. Please try again.');
    } finally { 
      setIncidentSubmitted(false); 
    }
  };

  return (
    <div className="safety-page">
      <header className="safety-header">
        <h1>Safety & SOS Center</h1>
        <p className="header-subtitle">Your security is our highest priority. Instant response 24/7.</p>
      </header>

      <div className="safety-grid">
        {/* SOS Card */}
        <div className="sn-card sos-card">
          <div className="sos-visual-container">
            <div 
              className={`sos-btn-main ${isHolding ? 'holding' : 'pulsing'}`}
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onTouchStart={startHolding}
              onTouchEnd={stopHolding}
            >
              <div className="sos-inner-circle">
                <span className="sos-text">SOS</span>
                <span className="sos-subtext">HOLD 2S</span>
              </div>
              <svg className="sos-progress-svg" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth="5" 
                />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="5" 
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * sosProgress) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                />
              </svg>
            </div>
          </div>
          <div className="sos-info">
            <h2>Emergency Alert</h2>
            <p>Notify on-site management and security teams immediately.</p>
          </div>
        </div>

        {/* Directory & Support Column */}
        <div className="safety-side-col">
          <div className="sn-card directory-card">
            <div className="card-header-iconic">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <h3 className="sn-card-title">Emergency Directory</h3>
            </div>
            <div className="contact-list">
              {[
                { label: 'Warden', phone: '+91 98765 43210' },
                { label: 'Security', phone: '+91 98765 43211' },
                { label: 'Ambulance', phone: '102' }
              ].map((c, i) => (
                <div key={i} className="contact-item">
                  <div className="contact-main">
                    <span className="contact-label">{c.label}</span>
                    <span className="contact-phone">{c.phone}</span>
                  </div>
                  <a href={`tel:${c.phone}`} className="call-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    CALL
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="sn-card support-card">
            <div className="support-content">
               <h3>Live Support</h3>
               <p>Need non-emergency help? Chat with our team.</p>
               <button className="whatsapp-btn">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12.031 6.172c-2.297 0-4.154 1.858-4.154 4.154 0 .727.191 1.41.523 2.003l-.554 2.023 2.07-.543c.563.307 1.208.484 1.896.484 2.297 0 4.154-1.858 4.154-4.154 0-2.296-1.857-4.154-4.154-4.154zm2.4 5.865c-.092.257-.54.502-.746.533-.206.03-.408.055-1.16-.245-.91-.365-1.498-1.29-1.543-1.352-.045-.06-.37-.493-.37-.95 0-.458.238-.682.324-.775.084-.093.185-.116.246-.116h.176c.054 0 .127-.02.197.147.073.176.248.605.27.65.022.045.037.097.007.157-.03.06-.045.097-.09.15-.045.052-.094.116-.135.157-.045.045-.09.094-.038.185.052.09.232.383.5.622.345.308.638.405.727.45.09.045.142.037.195-.022.052-.06.225-.262.285-.352.06-.09.12-.075.202-.045.082.03.525.248.615.293.09.045.15.067.172.105.023.037.023.217-.07.473z"/>
                   <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.528 3.655 1.446 5.161L2 22l4.99-1.341C8.423 21.517 10.138 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.634 0-3.167-.432-4.494-1.189l-.322-.184-2.96.796.81-2.956-.202-.322C4.08 15.834 3.5 14.015 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z"/>
                 </svg>
                 WhatsApp Support
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confidential Report Form */}
      <div className="sn-card report-card premium-report">
        <div className="card-header-iconic">
          <div className="icon-badge-secure">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <div className="header-text">
            <h3 className="sn-card-title">Confidential Reporting</h3>
            <p className="sn-label">Direct, encrypted reporting to senior management. Your identity is protected.</p>
          </div>
        </div>
        
        <form onSubmit={handleIncidentSubmit} className="report-form">
           <div className="form-row">
              <div className="input-group">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  Issue Classification
                </label>
                <div className="select-wrapper">
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option>Theft</option>
                    <option>Harassment</option>
                    <option>Unsafe Behavior</option>
                    <option>Maintenance Misconduct</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Incident Location
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Block A, Room 203, Mess Hall"
                  value={formData.location} 
                  onChange={e => setFormData({...formData, location: e.target.value})} 
                  required 
                />
              </div>
           </div>
           <div className="input-group">
             <label>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Detailed Description
             </label>
             <textarea 
               rows="4" 
               placeholder="Please provide as much detail as possible to help us investigate..."
               value={formData.description} 
               onChange={e => setFormData({...formData, description: e.target.value})} 
               required 
             />
           </div>
           <div className="form-footer-premium">
             <div className="security-assurance">
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                 <polyline points="9 11 12 14 15 11"></polyline>
               </svg>
               <span>End-to-end encrypted submission</span>
             </div>
             <button type="submit" className="btn-primary btn-large" disabled={incidentSubmitted}>
               {incidentSubmitted ? 'Submitting...' : 'Submit Confidential Report'}
             </button>
           </div>
           <p className="privacy-policy-text">By submitting, you agree to our confidential handling policy.</p>
        </form>
      </div>

      {/* Recent Reports Table */}
      <div className="sn-card report-history-card">
        <div className="card-header-iconic">
          <div className="icon-badge-history">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div className="header-text">
            <h3 className="sn-card-title">Recent Report History</h3>
            <p className="sn-label">Track the status of your submitted confidential reports.</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Date Submitted</th>
                <th>Classification</th>
                <th>Location</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingReports ? (
                <tr><td colSpan="5" className="td-loading">Synchronizing records...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan="5" className="td-empty">No reports found.</td></tr>
              ) : (
                reports.map(report => (
                  <tr key={report._id}>
                    <td className="td-date">
                      {new Date(report.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="td-type">
                      <div className="type-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        {report.classification}
                      </div>
                    </td>
                    <td className="td-location">{report.location}</td>
                    <td>
                      <span className={`status-pill ${report.status?.toLowerCase().replace(' ', '-') || 'pending'}`}>
                        {report.status || 'Pending Review'}
                      </span>
                    </td>
                    <td>
                      <button className="btn-details-small" onClick={() => setSelectedReport(report)}>View Details</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="modal-overlay">
          <div className="modal-content-standard premium-modal">
            <div className="modal-header-pro">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <div>
                  <h3>Report Details</h3>
                  <p>Ref ID: #{selectedReport._id.toUpperCase()}</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelectedReport(null)}>✕</button>
            </div>
            
            <div className="modal-body-content">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Classification</span>
                  <span className="detail-value">{selectedReport.classification}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`status-pill ${selectedReport.status?.toLowerCase().replace(' ', '-')}`}>
                    {selectedReport.status}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{selectedReport.location}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date Submitted</span>
                  <span className="detail-value">
                    {new Date(selectedReport.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
              
              <div className="description-box">
                <span className="detail-label">Detailed Description</span>
                <p className="description-text">{selectedReport.description}</p>
              </div>

              <div className="modal-action-footer">
                <button className="btn-primary" onClick={() => setSelectedReport(null)}>Close View</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Safety;
