import React, { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import socket, { connectSocket } from '../utils/socket';
import Modal from '../components/Modal';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateLoading, setUpdateLoading] = useState(false);
  const [paymentsPage, setPaymentsPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const itemsPerPage = 5;
  const [modal, setModal] = useState({ show: false, type: 'success', title: '', message: '', onConfirm: null, onCancel: null });

  const showModal = (config) => setModal({ ...config, show: true });
  const closeModal = () => setModal(prev => ({ ...prev, show: false }));


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

      return () => {
        socket.off('complaintUpdated', handleRealtimeUpdate);
        socket.off('complaintStatusChanged', handleRealtimeUpdate);
        socket.off('paymentAdded', handleRealtimeUpdate);
        socket.off('paymentUpdated', handleRealtimeUpdate);
        socket.off('tenantUpdated', handleRealtimeUpdate);
        socket.off('serviceUpdated', handleRealtimeUpdate);
        socket.off('rewardAdded', handleRealtimeUpdate);
        socket.off('transferStatusChanged', handleRealtimeUpdate);
      };
    }
  }, [fetchProfile]);

  useEffect(() => {
    if (profileData?.tenant) {
      setFormData({
        phone: profileData.tenant.phone || '',
        emergencyContact: profileData.tenant.emergencyContact || '',
        occupation: profileData.tenant.occupation || '',
        organization: profileData.tenant.organization || '',
        vegNonVegPreference: profileData.tenant.vegNonVegPreference || 'Any',
        sleepTiming: profileData.tenant.sleepTiming || '',
        primaryLanguage: profileData.tenant.primaryLanguage || '',
        preferences: profileData.tenant.preferences || {
          windowSide: false,
          lowerBunk: false,
          quietArea: false,
          nearChargingPort: false,
          studyFriendlyZone: false
        }
      });
    }
  }, [profileData]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      await API.put('/tenant-portal/update-profile', formData);
      setIsEditing(false);
      fetchProfile();
      showModal({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal details and preferences have been successfully updated.',
        onConfirm: closeModal
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      showModal({
        type: 'error',
        title: 'Update Failed',
        message: 'We encountered an error while saving your changes. Please try again.',
        onConfirm: closeModal
      });
    } finally {
      setUpdateLoading(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreferenceChange = (name) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [name]: !prev.preferences[name]
      }
    }));
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('profilePic', file);

    try {
      setUpdateLoading(true);
      const response = await API.post('/tenant-portal/upload-profile-pic', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchProfile();
      showModal({
        type: 'success',
        title: 'Avatar Updated',
        message: 'Your profile picture has been updated successfully.',
        onConfirm: closeModal
      });
    } catch (err) {
      console.error('Error uploading profile pic:', err);
      showModal({
        type: 'error',
        title: 'Upload Failed',
        message: 'Failed to upload your profile picture. Please check the file format and size.',
        onConfirm: closeModal
      });
    } finally {
      setUpdateLoading(false);
    }
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

  const { tenant, payments, complaints, history, rewards } = profileData;

  const renderOverview = () => (
    <div className="profile-tab-content fade-in">
      <div className="overview-header-flex">
        <h2 className="section-title">Tenant Overview</h2>
        <button className={`btn-edit-profile ${isEditing ? 'cancel' : ''}`} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel Editing' : 'Edit Profile'}
        </button>
      </div>

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


      </div>

      {isEditing ? (
        <form onSubmit={handleUpdateProfile} className="edit-profile-form sn-card fade-in">
          <div className="form-grid">
            <div className="form-section">
              <h3>Personal Details</h3>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone number" />
              </div>
              <div className="form-group">
                <label>Emergency Contact</label>
                <input name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} placeholder="Emergency contact" />
              </div>
              <div className="form-group">
                <label>Primary Language</label>
                <input name="primaryLanguage" value={formData.primaryLanguage} onChange={handleInputChange} placeholder="e.g., English, Hindi" />
              </div>
            </div>

            <div className="form-section">
              <h3>Professional / Academic</h3>
              <div className="form-group">
                <label>Occupation</label>
                <input name="occupation" value={formData.occupation} onChange={handleInputChange} placeholder="e.g., Software Engineer, Student" />
              </div>
              <div className="form-group">
                <label>Organization / College</label>
                <input name="organization" value={formData.organization} onChange={handleInputChange} placeholder="Company or University name" />
              </div>
            </div>

            <div className="form-section">
              <h3>Preferences</h3>
              <div className="form-group">
                <label>Food Preference</label>
                <select name="vegNonVegPreference" value={formData.vegNonVegPreference} onChange={handleInputChange}>
                  <option value="Any">Any</option>
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Eggetarian">Eggetarian</option>
                </select>
              </div>
              <div className="form-group">
                <label>Sleep Timing</label>
                <input name="sleepTiming" value={formData.sleepTiming} onChange={handleInputChange} placeholder="e.g., Early Bird, Night Owl" />
              </div>
            </div>

            <div className="form-section full-width">
              <h3>Room Preferences</h3>
              <div className="preferences-checkbox-grid">
                {[
                  { id: 'windowSide', label: 'Window Side' },
                  { id: 'lowerBunk', label: 'Lower Bunk' },
                  { id: 'quietArea', label: 'Quiet Area' },
                  { id: 'nearChargingPort', label: 'Near Charging Port' },
                  { id: 'studyFriendlyZone', label: 'Study Friendly Zone' }
                ].map(pref => (
                  <div key={pref.id} className={`pref-checkbox ${formData.preferences?.[pref.id] ? 'checked' : ''}`} onClick={() => handlePreferenceChange(pref.id)}>
                    <div className="checkbox-box">{formData.preferences?.[pref.id] && '✓'}</div>
                    <span>{pref.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save-profile" disabled={updateLoading}>
              {updateLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="details-sections-grid">
            <div className="sn-card detail-card">
              <h3><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Personal & Academic</h3>
              <div className="info-grid">
                <div className="info-row"><label>Organization</label> <p>{tenant.organization || 'Not Specified'}</p></div>
                <div className="info-row"><label>Occupation</label> <p>{tenant.occupation || 'Not Specified'}</p></div>
                <div className="info-row"><label>Language</label> <p>{tenant.primaryLanguage || 'English'}</p></div>
              </div>
            </div>

            <div className="sn-card detail-card">
              <h3><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg> Preferences</h3>
              <div className="info-grid">
                <div className="info-row"><label>Food</label> <p>{tenant.vegNonVegPreference || 'Any'}</p></div>
                <div className="info-row"><label>Sleep</label> <p>{tenant.sleepTiming || 'Not Specified'}</p></div>
                <div className="info-row"><label>Stay Plan</label> <p>{tenant.targetStayDuration || 'Long Term'}</p></div>
              </div>
            </div>
          </div>

          <div className="sn-card room-preferences-display">
            <h3>Accommodation Preferences</h3>
            <div className="pref-badges-flex">
              {tenant.preferences && Object.entries(tenant.preferences).map(([key, val]) => (
                val === true && (
                  <span key={key} className="pref-badge">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                )
              ))}
              {(!tenant.preferences || !Object.values(tenant.preferences).some(v => v)) && <p className="no-prefs">No specific preferences set.</p>}
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
        </>
      )}
    </div>
  );




  const renderPayments = () => {
    const totalPaid = payments.filter(p => p.status === 'Paid' || p.status === 'Success').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = tenant.rentStatus === 'PENDING' ? tenant.rent : 0;

    // Pagination for Payments
    const totalPaymentsPages = Math.ceil(payments.length / itemsPerPage);
    const pagedPayments = payments.slice((paymentsPage - 1) * itemsPerPage, paymentsPage * itemsPerPage);

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
              pagedPayments.map((payment, i) => (
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
          
          {totalPaymentsPages > 1 && (
            <div className="pagination-controls-premium mini">
              <button 
                className={`pg-btn ${paymentsPage === 1 ? 'disabled' : ''}`}
                onClick={() => setPaymentsPage(p => Math.max(1, p - 1))}
                disabled={paymentsPage === 1}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <span className="pg-status">{paymentsPage} of {totalPaymentsPages}</span>
              <button 
                className={`pg-btn ${paymentsPage === totalPaymentsPages ? 'disabled' : ''}`}
                onClick={() => setPaymentsPage(p => Math.min(totalPaymentsPages, p + 1))}
                disabled={paymentsPage === totalPaymentsPages}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
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

    // Pagination for Activity
    const totalActivityPages = Math.ceil(timeline.length / itemsPerPage);
    const pagedActivity = timeline.slice((activityPage - 1) * itemsPerPage, activityPage * itemsPerPage);

    return (
      <div className="profile-tab-content fade-in">
        <h2 className="section-title">Workflow Activity History</h2>
        <div className="activity-timeline">
          {timeline.length > 0 ? (
            pagedActivity.map((item, i) => (
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
        
        {totalActivityPages > 1 && (
          <div className="pagination-controls-premium mini">
            <button 
              className={`pg-btn ${activityPage === 1 ? 'disabled' : ''}`}
              onClick={() => setActivityPage(p => Math.max(1, p - 1))}
              disabled={activityPage === 1}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <span className="pg-status">{activityPage} of {totalActivityPages}</span>
            <button 
              className={`pg-btn ${activityPage === totalActivityPages ? 'disabled' : ''}`}
              onClick={() => setActivityPage(p => Math.min(totalActivityPages, p + 1))}
              disabled={activityPage === totalActivityPages}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        )}
      </div>
    );
  };


  const renderSafety = () => (
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
          {[...history.sosAlerts, ...history.confidentialReports]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((item, i) => (
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
          {history.sosAlerts.length === 0 && history.confidentialReports.length === 0 && (
            <div className="empty-state">No safety incidents reported. You're safe!</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-container">
      <div className="profile-hero">
        <div className="profile-main-sidebar">
          <div className="profile-main-card-premium sn-card">
            <div className="profile-avatar-large">
              {tenant.profilePic ? (
                <img src={`http://localhost:5000${tenant.profilePic}`} alt={tenant.name} className="avatar-img" />
              ) : (
                tenant.name?.charAt(0)
              )}
              <label className="avatar-upload-overlay">
                <input type="file" onChange={handleProfilePicUpload} accept="image/*" hidden />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
              </label>
              <div className="online-indicator"></div>
            </div>

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
            <button className={`tab-btn ${activeTab === 'payments' ? 'active' : ''}`} onClick={() => setActiveTab('payments')}>Payments</button>
            <button className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>Activity</button>
            <button className={`tab-btn ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}>Safety</button>
          </div>

          <div className="tab-pane">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'payments' && renderPayments()}
            {activeTab === 'activity' && renderActivity()}
            {activeTab === 'safety' && renderSafety()}
          </div>

        </div>
      </div>
      <Modal {...modal} />
    </div>
  );
};


export default Profile;
