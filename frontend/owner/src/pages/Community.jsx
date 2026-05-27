import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  AlertOctagon, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Filter,
  Eye,
  MoreVertical,
  Flag,
  Trash2,
  Bell,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  AlertTriangle,
  X,
  Loader2
} from 'lucide-react';
import { api } from '../mockData';
import socket, { connectSocket } from '../utils/socket';
import './Community.css';

const Community = () => {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');
  
  const [activeTab, setActiveTab] = useState('confidential'); // Set default to confidential as per request
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    lostFound: [],
    sos: [],
    confidentialReports: []
  });

  // Pagination & Filtering for Confidential Reports
  const [reportsPagination, setReportsPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modal States
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // ID of report to delete
  const [showFlagModal, setShowFlagModal] = useState(null); // Report object to flag
  const [isActionLoading, setIsActionLoading] = useState(false);

  const fetchConfidentialReports = useCallback(async (page = 1) => {
    try {
      const response = await api.getConfidentialReports({
        buildingId: activeBuildingId,
        page,
        limit: 10,
        search: searchQuery,
        status: filterStatus
      });
      
      setData(prev => ({
        ...prev,
        confidentialReports: response.reports
      }));
      setReportsPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch confidential reports:', err);
    }
  }, [activeBuildingId, searchQuery, filterStatus]);

  const fetchCommunityData = async () => {
    setIsLoading(true);
    try {
      const [lostFound, sos, reportsData] = await Promise.all([
        api.getLostFound(),
        api.getSOSAlerts(),
        api.getConfidentialReports({
          buildingId: activeBuildingId,
          page: 1,
          limit: 10,
          search: searchQuery,
          status: filterStatus
        })
      ]);
      
      setData({
        lostFound: lostFound || [],
        sos: sos || [],
        confidentialReports: (reportsData && reportsData.reports) ? reportsData.reports : []
      });
      setReportsPagination((reportsData && reportsData.pagination) ? reportsData.pagination : { page: 1, limit: 10, total: 0, pages: 1 });
    } catch (err) {
      console.error('Failed to fetch community data:', err);
      // Ensure we don't leave it loading forever and have safe defaults
      setData(prev => ({
        ...prev,
        lostFound: prev.lostFound || [],
        sos: prev.sos || [],
        confidentialReports: prev.confidentialReports || []
      }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    connectSocket(activeBuildingId);
    fetchCommunityData();

    // Socket listeners for real-time updates
    socket.on('confidentialReportCreated', (newReport) => {
      // Check building match — handle both string and object building ID
      const reportBuildingId = newReport.building?._id || newReport.building;
      if (reportBuildingId === activeBuildingId) {
        setData(prev => ({
          ...prev,
          confidentialReports: [newReport, ...prev.confidentialReports].slice(0, 10)
        }));
      }
    });

    socket.on('confidentialReportUpdated', (updatedReport) => {
      setData(prev => ({
        ...prev,
        confidentialReports: prev.confidentialReports.map(r => 
          r._id === updatedReport._id ? updatedReport : r
        ).filter(r => !r.isHidden)
      }));
    });

    socket.on('confidentialReportDeleted', ({ id }) => {
      setData(prev => ({
        ...prev,
        confidentialReports: prev.confidentialReports.filter(r => r._id !== id)
      }));
    });

    return () => {
      socket.off('confidentialReportCreated');
      socket.off('confidentialReportUpdated');
      socket.off('confidentialReportDeleted');
    };
  }, [activeBuildingId, fetchConfidentialReports]);

  // Action Handlers
  const handleFlag = async (reportId, status) => {
    const isFlagged = status !== 'None';
    
    // Optimistic Update
    setData(prev => ({
      ...prev,
      confidentialReports: prev.confidentialReports.map(r => 
        r._id === reportId ? { ...r, isFlagged, flagStatus: isFlagged ? status : 'None' } : r
      )
    }));

    setIsActionLoading(true);
    try {
      await api.flagConfidentialReport(reportId, isFlagged, status);
      setShowFlagModal(null);
    } catch (err) {
      console.error('Failed to flag report:', err);
      // Revert on error
      fetchConfidentialReports(reportsPagination.page);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    // Optimistic Update
    setData(prev => ({
      ...prev,
      confidentialReports: prev.confidentialReports.filter(r => r._id !== reportId)
    }));

    setIsActionLoading(true);
    try {
      await api.deleteConfidentialReport(reportId);
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete report:', err);
      // Revert if failed
      fetchConfidentialReports(reportsPagination.page);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleHide = async (reportId) => {
    // Optimistic Update
    setData(prev => ({
      ...prev,
      confidentialReports: prev.confidentialReports.filter(r => r._id !== reportId)
    }));

    try {
      await api.hideConfidentialReport(reportId, true);
    } catch (err) {
      console.error('Failed to hide report:', err);
      fetchConfidentialReports(reportsPagination.page);
    }
  };

  const handleStatusChange = async (reportId, status) => {
    // Optimistic Update
    setData(prev => ({
      ...prev,
      confidentialReports: prev.confidentialReports.map(r => 
        r._id === reportId ? { ...r, status } : r
      )
    }));

    try {
      await api.updateConfidentialReportStatus(reportId, status);
    } catch (err) {
      console.error('Failed to update status:', err);
      // Revert if failed (optional, but good for robustness)
      fetchConfidentialReports(reportsPagination.page);
    }
  };

  const handleResolveSOS = async (sosId) => {
    // Optimistic update
    setData(prev => ({
      ...prev,
      sos: prev.sos.map(s => s._id === sosId ? { ...s, status: 'Resolved' } : s)
    }));
    try {
      await api.resolveSOSAlert(sosId);
    } catch (err) {
      console.error('Failed to resolve SOS:', err);
      fetchCommunityData();
    }
  };

  const handleDispatchSOS = async (sosId) => {
    try {
      await api.dispatchSOSAlert(sosId);
      alert('Dispatch signal sent to emergency contacts.');
    } catch (err) {
      console.error('Failed to dispatch SOS:', err);
    }
  };

  const handleLostFoundStatus = async (itemId, status) => {
    setData(prev => ({
      ...prev,
      lostFound: prev.lostFound.map(item => item._id === itemId ? { ...item, status } : item)
    }));
    try {
      await api.updateLostFoundStatus(itemId, status);
    } catch (err) {
      console.error('Failed to update Lost & Found status:', err);
      fetchCommunityData();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      default: return '#10B981';
    }
  };

  const getFlagStatusColor = (status) => {
    switch (status) {
      case 'High Priority': return '#EF4444';
      case 'Escalated': return '#8B5CF6';
      case 'Under Investigation': return '#3B82F6';
      case 'Flagged': return '#F59E0B';
      default: return 'transparent';
    }
  };

  const tabs = [
    { id: 'lost-found', name: 'Lost & Found', icon: <Search size={18} /> },
    { id: 'sos', name: 'SOS Alerts', icon: <AlertOctagon size={18} /> },
    { id: 'confidential', name: 'Confidential reporting', icon: <ShieldAlert size={18} /> }
  ];

  return (
    <div className="community-page">
      <header className="page-header">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Users size={32} /> Community Hub
          </motion.h1>
          <p>Monitor security, reports, and community interactions.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem'  }}>
          <button 
            onClick={async () => {
              try {
                const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${apiBase}/confidential-reports/debug`);
                const result = await res.json();
                alert(`Current Building ID: ${activeBuildingId}\nDB Check: Found ${result.count} total reports in collection.`);
                console.log('--- DEBUG INFO ---');
                console.log('Active Building ID:', activeBuildingId);
                console.log('All DB Reports:', result.reports);
              } catch (e) {
                alert('Debug fetch failed. Backend might be down.');
                console.error(e);
              }
            }} 
            className="refresh-btn debug"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-muted)'  }}
          >
            <ShieldAlert size={18} /> Debug DB
          </button>
          <button onClick={fetchCommunityData} className="refresh-btn">
            <Bell size={18} /> Sync Updates
          </button>
        </div>
      </header>

      <nav className="tab-navigation">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            className={activeTab === tab.id ? 'active' : ''} 
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </nav>

      <div className="content-area">
        <AnimatePresence mode="wait">
          {activeTab === 'lost-found' && (
            <motion.div 
              key="lost-found"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid-container"
            >
              {data.lostFound.map(item => (
                <div key={item.id} className="glass-card item-card">
                  <div className="card-header">
                    <span className={`badge ${item.type.toLowerCase()}`}>{item.type}</span>
                    <span className="date">{item.date}</span>
                  </div>
                  <h3>{item.title || item.item}</h3>
                  <div className="details">
                    <p><MapPin size={14} /> {item.location}</p>
                    <p><Users size={14} /> {item.reportedBy}</p>
                  </div>
                  <div className="card-footer">
                    <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
                    <button 
                      onClick={() => handleLostFoundStatus(item._id, item.status === 'Open' ? 'Resolved' : 'Open')}
                      className="action-btn"
                      title={item.status === 'Open' ? 'Mark Resolved' : 'Reopen'}
                    >
                      {item.status === 'Open' ? <Eye size={16} /> : <Search size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'sos' && (
            <motion.div 
              key="sos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="sos-list"
            >
              {data.sos.map(alert => (
                <div key={alert.id} className={`sos-card ${alert.status.toLowerCase()}`}>
                  <div className="sos-icon">
                    <ShieldAlert size={24} />
                  </div>
                  <div className="sos-info">
                    <div className="sos-header">
                      <h4>{alert.type} Emergency</h4>
                      <span className="time">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p>{alert.message}</p>
                    <div className="sos-location">
                      <MapPin size={14} /> {alert.location}
                    </div>
                  </div>
                  <div className="sos-actions">
                    <button 
                      onClick={() => handleResolveSOS(alert._id)}
                      className="resolve-btn"
                      disabled={alert.status === 'Resolved'}
                    >
                      {alert.status === 'Resolved' ? 'Resolved' : 'Resolve'}
                    </button>
                    <button 
                      onClick={() => handleDispatchSOS(alert._id)}
                      className="dispatch-btn"
                    >
                      Dispatch
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'confidential' && (
            <motion.div 
              key="confidential"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="reports-container"
            >
              <div className="table-header">
                <div className="title-group">
                  <h2>Reports History</h2>
                  <span className="total-badge">{reportsPagination.total} Reports</span>
                </div>
                <div className="filters-group">
                  <div className="search-box">
                    <Search size={16} />
                    <input 
                      type="text" 
                      placeholder="Search reports..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select 
                    className="status-filter"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                  <button onClick={() => fetchConfidentialReports(1)} className="filter-btn">
                    <Filter size={16} /> Apply
                  </button>
                </div>
              </div>

              <div className="reports-table">
                {isLoading ? (
                  <div className="skeleton-container">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="skeleton-row" />
                    ))}
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Flag</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.confidentialReports.length === 0 ? (
                        <tr><td colSpan="7" className="empty-state">No confidential reports found.</td></tr>
                      ) : data.confidentialReports.map(report => (
                        <motion.tr 
                          key={report._id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <td>
                            <div className="report-title-cell">
                              <span className="title-text">{report.title || 'Untitled Report'}</span>
                              {report.isFlagged && (
                                <span className="flag-badge" style={{ backgroundColor: getFlagStatusColor(report.flagStatus)  }}>
                                  {report.flagStatus}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>{report.category}</td>
                          <td>
                            <span className="priority-dot" style={{ background: getPriorityColor(report.priority)  }}></span>
                            {report.priority}
                          </td>
                          <td>
                            <select 
                              className={`status-select ${report.status.toLowerCase().replace(' ', '-')}`}
                              value={report.status}
                              onChange={(e) => handleStatusChange(report._id, e.target.value)}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                          </td>
                          <td>
                            <button 
                              className={`flag-btn ${report.isFlagged ? 'active' : ''}`}
                              onClick={() => setShowFlagModal(report)}
                            >
                              <Flag size={14} fill={report.isFlagged ? "currentColor" : "none"} />
                            </button>
                          </td>
                          <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                          <td className="actions">
                            <button className="icon-btn" onClick={() => setSelectedReport(report)} title="View Details">
                              <Eye size={16} />
                            </button>
                            <button className="icon-btn" onClick={() => handleHide(report._id)} title="Hide Report">
                              <EyeOff size={16} />
                            </button>
                            <button className="icon-btn danger" onClick={() => setShowDeleteConfirm(report._id)} title="Delete Report">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination UI */}
              <div className="pagination">
                <div className="pagination-info">
                  Showing {(reportsPagination.page - 1) * reportsPagination.limit + 1} to {Math.min(reportsPagination.page * reportsPagination.limit, reportsPagination.total)} of {reportsPagination.total} reports
                </div>
                <div className="pagination-controls">
                  <button 
                    disabled={reportsPagination.page === 1}
                    onClick={() => fetchConfidentialReports(reportsPagination.page - 1)}
                    className="pagi-btn"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {[...Array(reportsPagination.pages)].map((_, i) => (
                    <button 
                      key={i + 1}
                      className={`pagi-num ${reportsPagination.page === i + 1 ? 'active' : ''}`}
                      onClick={() => fetchConfidentialReports(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    disabled={reportsPagination.page === reportsPagination.pages}
                    onClick={() => fetchConfidentialReports(reportsPagination.page + 1)}
                    className="pagi-btn"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Report Details Modal */}
        {selectedReport && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedReport(null)}
          >
            <motion.div 
              className="modal-content glass-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Report Details</h3>
                <button className="close-btn" onClick={() => setSelectedReport(null)}><X size={20} /></button>
              </div>
              <div className="modal-body">
                <div className="detail-item">
                  <label>Title</label>
                  <p>{selectedReport.title}</p>
                </div>
                <div className="detail-item">
                  <label>Description</label>
                  <div className="description-box">{selectedReport.description}</div>
                </div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Category</label>
                    <p>{selectedReport.category}</p>
                  </div>
                  <div className="detail-item">
                    <label>Classification</label>
                    <p>{selectedReport.classification}</p>
                  </div>
                  <div className="detail-item">
                    <label>Location</label>
                    <p><MapPin size={14} inline /> {selectedReport.location}</p>
                  </div>
                  <div className="detail-item">
                    <label>Reported By</label>
                    <p>{selectedReport.tenant?.name || 'Anonymous'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isActionLoading && setShowDeleteConfirm(null)}
          >
            <motion.div 
              className="modal-content delete-modal glass-card"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="alert-icon-container">
                <AlertTriangle size={48} color="#EF4444" />
              </div>
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to permanently delete this report? This action cannot be undone.</p>
              <div className="modal-actions">
                <button 
                  className="cancel-btn" 
                  onClick={() => setShowDeleteConfirm(null)}
                  disabled={isActionLoading}
                >
                  Cancel
                </button>
                <button 
                  className="confirm-delete-btn" 
                  onClick={() => handleDelete(showDeleteConfirm)}
                  disabled={isActionLoading}
                >
                  {isActionLoading ? <Loader2 size={18} className="spin" /> : 'Delete Report'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Flag Selection Modal */}
        {showFlagModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isActionLoading && setShowFlagModal(null)}
          >
            <motion.div 
              className="modal-content flag-modal glass-card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Flag Report</h3>
                <button className="close-btn" onClick={() => setShowFlagModal(null)}><X size={20} /></button>
              </div>
              <p>Select a flag status for this report:</p>
              <div className="flag-options">
                {['Flagged', 'High Priority', 'Escalated', 'Under Investigation'].map(status => (
                  <button 
                    key={status}
                    className={`flag-option-btn ${showFlagModal.flagStatus === status ? 'selected' : ''}`}
                    onClick={() => handleFlag(showFlagModal._id, status)}
                    disabled={isActionLoading}
                    style={{ borderLeftColor: getFlagStatusColor(status)  }}
                  >
                    <div className="dot" style={{ background: getFlagStatusColor(status)  }}></div>
                    {status}
                  </button>
                ))}
                <button 
                  className="flag-option-btn clear"
                  onClick={() => handleFlag(showFlagModal._id, 'None')}
                  disabled={isActionLoading}
                >
                  Clear Flag
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
