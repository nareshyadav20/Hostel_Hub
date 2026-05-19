import React, { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import socket, { connectSocket } from '../utils/socket';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  
  // Pagination State
  const [activityPage, setActivityPage] = useState(1);
  const [safetyPage, setSafetyPage] = useState(1);
  const itemsPerPage = 5;

  const fetchProfile = useCallback(async () => {
    try {
      const response = await API.get('/tenant-portal/complete-profile');
      setProfileData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching complete profile:', err);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();

    // Setup Socket.io Real-time Synchronization
    const buildingId = localStorage.getItem('buildingId');
    
    if (buildingId) {
      connectSocket(buildingId);
      
      const handleRealtimeUpdate = (data) => {
        console.log('🔄 Profile: Received real-time update, refreshing...', data);
        fetchProfile();
      };

      socket.on('complaintUpdated', handleRealtimeUpdate);
      socket.on('complaintStatusChanged', handleRealtimeUpdate);
      socket.on('paymentAdded', handleRealtimeUpdate);
      socket.on('paymentUpdated', handleRealtimeUpdate);
      socket.on('tenantUpdated', handleRealtimeUpdate);
      socket.on('serviceUpdated', handleRealtimeUpdate);
      socket.on('rewardAdded', handleRealtimeUpdate);
      socket.on('transferStatusChanged', handleRealtimeUpdate);
      socket.on('photoUpdated', handleRealtimeUpdate);

      return () => {
        socket.off('complaintUpdated', handleRealtimeUpdate);
        socket.off('complaintStatusChanged', handleRealtimeUpdate);
        socket.off('paymentAdded', handleRealtimeUpdate);
        socket.off('paymentUpdated', handleRealtimeUpdate);
        socket.off('tenantUpdated', handleRealtimeUpdate);
        socket.off('serviceUpdated', handleRealtimeUpdate);
        socket.off('rewardAdded', handleRealtimeUpdate);
        socket.off('transferStatusChanged', handleRealtimeUpdate);
        socket.off('photoUpdated', handleRealtimeUpdate);
      };
    }
  }, [fetchProfile]);

  useEffect(() => {
    setActivityPage(1);
    setSafetyPage(1);
  }, [activeTab]);

  const [uploading, setUploading] = useState(false);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (e.g., 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo size should be less than 2MB');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result;
        await API.post('/tenant-portal/upload-photo', { photoUrl: base64String });
        fetchProfile(); // Refresh to show new photo
        alert('Profile photo updated successfully!');
      } catch (err) {
        console.error('Error uploading photo:', err);
        alert('Failed to upload photo. Please try again.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) return (
    <div className="profile-loading">
      <div className="premium-spinner"></div>
      <p>Synchronizing your digital home...</p>
    </div>
  );

  if (error) return (
    <div className="profile-error-container">
      <div className="error-card">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h3>Connection Error</h3>
        <p>{error}</p>
        <button onClick={fetchProfile} className="btn-retry">Try Again</button>
      </div>
    </div>
  );

  const calculateStayDuration = (checkInDate) => {
    if (!checkInDate) return 'N/A';
    const start = new Date(checkInDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 30) return `${diffDays} Days`;
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} Month${diffMonths > 1 ? 's' : ''}`;
  };

  const getOccupancyStatus = (status) => {
    if (!status) return 'Active Resident';
    switch (status.toUpperCase()) {
      case 'ACTIVE': return 'Currently In-house';
      case 'LEFT': return 'Checked Out';
      case 'PENDING': return 'Check-in Pending';
      default: return status;
    }
  };

  const { tenant, payments, complaints, history, rewards, photo } = profileData;

  const renderOverview = () => (
    <div className="profile-tab-content fade-in">
      <div className="overview-grid">
        <div className="sn-card status-card">
          <div className="card-header-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3>Occupancy Status</h3>
          <div className="status-badge active">{getOccupancyStatus(tenant.status)}</div>
          <p className="status-meta">Stay Duration: {calculateStayDuration(tenant.checkInDate)}</p>
        </div>

        <div className="sn-card status-card">
          <div className="card-header-icon gold">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="8" r="7"></circle>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
            </svg>
          </div>
          <h3>Rewards & Badges</h3>
          <div className="points-display">
            <span className="points-value">{rewards?.points || 0}</span>
            <span className="points-label">Pts</span>
          </div>
          <p className="status-meta">{rewards?.lifetimeEarned || 0} Lifetime Earned</p>
        </div>

        <div className="sn-card status-card">
          <div className="card-header-icon purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>
          <h3>Room Hygiene</h3>
          <div className="trust-meter">
            <div className="meter-fill" style={{ width: `${(tenant.roomId?.hygieneRating || 4.5)*20}%` }}></div>
          </div>
          <p className="status-meta">Score: {tenant.roomId?.hygieneRating || 4.5}/5.0</p>
        </div>
      </div>

      <div className="quick-info-section">
        <h2 className="section-title">Emergency & Documents</h2>
        <div className="emergency-contacts-grid">
          <div className="emergency-item">
            <label>Emergency Contact</label>
            <p>{tenant.emergencyContact || 'Not Specified'}</p>
          </div>
          <div className="emergency-item">
            <label>Aadhaar Number</label>
            <p>{tenant.aadhaarNumber ? `xxxx-xxxx-${tenant.aadhaarNumber.slice(-4)}` : 'Not Linked'}</p>
          </div>
          <div className="emergency-item">
            <label>Verification Status</label>
            <div className={`verification-pill ${tenant.aadhaarNumber ? 'verified' : 'pending'}`}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {tenant.aadhaarNumber ? 'KYC Verified' : 'Pending'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStayDetails = () => (
    <div className="profile-tab-content fade-in">
      <div className="stay-details-card sn-card">
        <div className="stay-header">
          <div className="stay-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div className="stay-titles">
            <h2>{tenant.buildingId?.name || 'Assigned Building'}</h2>
            <p>{tenant.buildingId?.address || 'Property Location'}</p>
          </div>
        </div>

        <div className="room-info-grid">
          <div className="room-stat">
            <label>Floor</label>
            <p>{tenant.roomId?.floorNumber || '02'}</p>
          </div>
          <div className="room-stat">
            <label>Room No</label>
            <p>{tenant.roomId?.roomNumber || 'N/A'}</p>
          </div>
          <div className="room-stat">
            <label>Bed No</label>
            <p>{tenant.bedId?.bedNumber || 'N/A'}</p>
          </div>
          <div className="room-stat">
            <label>Sharing</label>
            <p>{tenant.roomId?.roomType || 'N/A'}</p>
          </div>
        </div>

        <div className="smart-scores-section">
          <h3>Smart Comfort & Hygiene Metrics</h3>
          <div className="scores-grid">
            <div className="score-item">
              <div className="score-header">
                <span>Hygiene Rating</span>
                <span className="score-val">{tenant.roomId?.hygieneRating || 4.5}/5</span>
              </div>
              <div className="score-bar"><div className="score-fill" style={{ width: `${(tenant.roomId?.hygieneRating || 4.5)*20}%` }}></div></div>
            </div>
            <div className="score-item">
              <div className="score-header">
                <span>Comfort Score</span>
                <span className="score-val">{tenant.roomId?.tempComfortScore || 4.8}/5</span>
              </div>
              <div className="score-bar"><div className="score-fill purple" style={{ width: `${(tenant.roomId?.tempComfortScore || 4.8)*20}%` }}></div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="stay-meta-grid">
        <div className="sn-card meta-mini-card">
          <label>Monthly Rent</label>
          <p>₹{tenant.rent || '0'}</p>
        </div>
        <div className="sn-card meta-mini-card">
          <label>Check-in Date</label>
          <p>{tenant.checkInDate ? new Date(tenant.checkInDate).toLocaleDateString() : 'N/A'}</p>
        </div>
        <div className="sn-card meta-mini-card">
          <label>Lock-in Period</label>
          <p>{tenant.targetStayDuration || '6 Months'}</p>
        </div>
      </div>
    </div>
  );

  const renderPayments = () => {
    const totalPaid = payments.filter(p => p.status === 'Paid' || p.status === 'Success').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = tenant.rentStatus === 'PENDING' ? tenant.rent : 0;

    return (
      <div className="profile-tab-content fade-in">
        <div className="payments-overview-card sn-card">
          <div className="payment-summary-main">
            <div className="summary-item">
              <label>Current Status</label>
              <p className={`amount ${tenant.rentStatus === 'PENDING' ? 'due' : 'cleared'}`}>{tenant.rentStatus || 'PAID'}</p>
            </div>
            <div className="summary-item">
              <label>Lifetime Paid</label>
              <p className="due-date">₹{totalPaid.toLocaleString()}</p>
            </div>
            <div className="summary-item">
              <label>Pending Dues</label>
              <p className="due-date">₹{pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="transaction-history">
          <h2 className="section-title">Transaction Timeline</h2>
          <div className="transaction-list">
            {payments.length > 0 ? (
              payments.slice((activityPage - 1) * itemsPerPage, activityPage * itemsPerPage).map((payment, i) => (
                <div key={payment._id || i} className="transaction-item">
                  <div className="tx-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                      <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                      <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
                    </svg>
                  </div>
                  <div className="tx-details">
                    <div className="tx-main">
                      <h4>{payment.type || 'Monthly Rent'}</h4>
                      <span className={`tx-status ${payment.status?.toLowerCase()}`}>{payment.status}</span>
                    </div>
                    <div className="tx-meta">
                      <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                      <span className="dot">•</span>
                      <span>{payment.invoice || `Ref: ${payment._id?.slice(-8).toUpperCase()}`}</span>
                    </div>
                  </div>
                  <div className="tx-amount">₹{payment.amount.toLocaleString()}</div>
                </div>
              ))
            ) : (
              <div className="empty-state">No payment records found.</div>
            )}
          </div>

          {Math.ceil(payments.length / itemsPerPage) > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 0', borderTop: '1px solid #E2E8F0', marginTop: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>
                Showing {(activityPage - 1) * itemsPerPage + 1}–{Math.min(activityPage * itemsPerPage, payments.length)} of {payments.length} entries
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button onClick={() => setActivityPage(p => p - 1)} disabled={activityPage === 1} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: activityPage === 1 ? '#F8FAFC' : '#fff', color: activityPage === 1 ? '#CBD5E1' : '#475569', fontWeight: '600', cursor: activityPage === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
                {[...Array(Math.ceil(payments.length / itemsPerPage))].map((_, i) => (
                  <button key={i+1} onClick={() => setActivityPage(i+1)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: activityPage === i+1 ? 'none' : '1px solid #E2E8F0', background: activityPage === i+1 ? 'var(--accent-primary)' : '#fff', color: activityPage === i+1 ? '#fff' : '#475569', fontWeight: '700', cursor: 'pointer' }}>{i+1}</button>
                ))}
                <button onClick={() => setActivityPage(p => p + 1)} disabled={activityPage === Math.ceil(payments.length / itemsPerPage)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: activityPage === Math.ceil(payments.length / itemsPerPage) ? '#F8FAFC' : '#fff', color: activityPage === Math.ceil(payments.length / itemsPerPage) ? '#CBD5E1' : '#475569', fontWeight: '600', cursor: activityPage === Math.ceil(payments.length / itemsPerPage) ? 'not-allowed' : 'pointer' }}>Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActivity = () => {
    // Combine all history into a unified timeline
    const timeline = [
      ...history.laundry.map(item => ({ ...item, type: 'Laundry', icon: '👕', label: `Laundry #${item.orderNumber}` })),
      ...history.cleaning.map(item => ({ ...item, type: 'Cleaning', icon: '🧹', label: 'Room Cleaning' })),
      ...history.visitors.map(item => ({ ...item, type: 'Visitor', icon: '🎫', label: `Visitor: ${item.name}` })),
      ...history.leaves.map(item => ({ ...item, type: 'Leave', icon: '📝', label: 'Leave Notice' })),
      ...history.transfers.map(item => ({ ...item, type: 'Transfer', icon: '🔄', label: 'Room Transfer' })),
      ...complaints.map(item => ({ ...item, type: 'Complaint', icon: '⚠️', label: item.title }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalPages = Math.ceil(timeline.length / itemsPerPage);
    const paginatedTimeline = timeline.slice((activityPage - 1) * itemsPerPage, activityPage * itemsPerPage);

    return (
      <div className="profile-tab-content fade-in">
        <h2 className="section-title">Workflow Activity History</h2>
        <div className="activity-timeline">
          {paginatedTimeline.length > 0 ? (
            paginatedTimeline.map((item, i) => (
              <div key={item._id || i} className="activity-card sn-card">
                <div className="activity-type-icon">{item.icon}</div>
                <div className="activity-content">
                  <div className="activity-header">
                    <h4>{item.label}</h4>
                    <span className={`status-pill ${item.status?.toLowerCase().replace(' ', '-') || 'pending'}`}>
                      {item.status || 'Pending'}
                    </span>
                  </div>
                  <p className="activity-desc">{item.description || item.reason || `Requested on ${new Date(item.createdAt).toLocaleDateString()}`}</p>
                  <div className="activity-footer">
                    <span className="activity-date">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                    {item.priority && (
                      <span className={`priority-tag ${item.priority?.toLowerCase()}`}>{item.priority}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">Your activity history is currently empty.</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls">
            <button 
              disabled={activityPage === 1} 
              onClick={() => setActivityPage(prev => prev - 1)}
              className="pagi-btn"
            >
              Previous
            </button>
            <span className="pagi-info">Page {activityPage} of {totalPages}</span>
            <button 
              disabled={activityPage === totalPages} 
              onClick={() => setActivityPage(prev => prev + 1)}
              className="pagi-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderSafety = () => {
    const safetyLog = [...history.sosAlerts, ...history.confidentialReports]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalPages = Math.ceil(safetyLog.length / itemsPerPage);
    const paginatedSafetyLog = safetyLog.slice((safetyPage - 1) * itemsPerPage, safetyPage * itemsPerPage);

    return (
      <div className="profile-tab-content fade-in">
        <div className="safety-summary-grid">
          <div className="sn-card safety-stat-card">
            <div className="card-header-icon red">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M10.29 3.86L1.82 18C1.445 18.63 1.9 19.43 2.62 19.43H21.38C22.1 19.43 22.555 18.63 22.18 18L13.71 3.86C13.33 3.22 12.67 3.22 12.29 3.86Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3>SOS Alerts Raised</h3>
            <p className="stat-val">{history.sosAlerts?.length || 0}</p>
          </div>

          <div className="sn-card safety-stat-card">
            <div className="card-header-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3>Confidential Reports</h3>
            <p className="stat-val">{history.confidentialReports?.length || 0}</p>
          </div>
        </div>

        <div className="safety-activity-list">
          <h2 className="section-title">Safety & Incident Log</h2>
          <div className="incident-timeline">
            {paginatedSafetyLog.map((item, i) => (
                <div key={item._id || i} className="incident-item sn-card">
                  <div className="incident-icon">
                    {item.message ? '🆘' : '🕵️'}
                  </div>
                  <div className="incident-content">
                    <h4>{item.message || item.title || 'Confidential Report'}</h4>
                    <p>{item.location ? `Location: ${item.location}` : item.description}</p>
                    <div className="incident-footer">
                      <span className="date">{new Date(item.createdAt).toLocaleString()}</span>
                      <span className={`status-pill ${item.status?.toLowerCase().replace(' ', '-') || 'active'}`}>{item.status || 'Active'}</span>
                    </div>
                  </div>
                </div>
              ))
            }
            {safetyLog.length === 0 && (
              <div className="empty-state">No safety incidents reported. You're safe!</div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button 
                disabled={safetyPage === 1} 
                onClick={() => setSafetyPage(prev => prev - 1)}
                className="pagi-btn"
              >
                Previous
              </button>
              <span className="pagi-info">Page {safetyPage} of {totalPages}</span>
              <button 
                disabled={safetyPage === totalPages} 
                onClick={() => setSafetyPage(prev => prev + 1)}
                className="pagi-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="profile-container">
      <div className="profile-hero">
        <div className="profile-main-sidebar">
          <div className="profile-main-card-premium sn-card">
            <div className="profile-avatar-large" onClick={() => document.getElementById('photo-upload-input').click()} style={{ cursor: 'pointer', overflow: 'hidden' }}>
              {photo ? (
                <img src={photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                tenant.name?.charAt(0)
              )}
              {uploading && <div className="avatar-loader"></div>}
              <div className="online-indicator"></div>
              <div className="avatar-edit-overlay">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </div>
            </div>
            <input 
              type="file" 
              id="photo-upload-input" 
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handlePhotoUpload}
            />
            <h1 className="user-name">{tenant.name}</h1>
            <p className="user-id">RES-ID: {tenant._id?.slice(-8).toUpperCase()}</p>
            <div className="premium-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
              Premium Resident
            </div>

            <div className="basic-info-list">
              <div className="info-item">
                <label>Email</label>
                <p>{tenant.email}</p>
              </div>
              <div className="info-item">
                <label>Phone</label>
                <p>{tenant.phone || 'N/A'}</p>
              </div>
              <div className="info-item">
                <label>Occupation</label>
                <p>{tenant.occupation || 'Student'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content-area">
          <div className="profile-tabs-nav sn-card">
            <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={`tab-btn ${activeTab === 'stay' ? 'active' : ''}`} onClick={() => setActiveTab('stay')}>Stay Details</button>
            <button className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>Payments</button>
            <button className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>Activity</button>
            <button className={`tab-btn ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}>Safety</button>
          </div>

          <div className="tab-pane">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'stay' && renderStayDetails()}
            {activeTab === 'payments' && renderPayments()}
            {activeTab === 'activity' && renderActivity()}
            {activeTab === 'safety' && renderSafety()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
