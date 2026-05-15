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
  
  const [activeTab, setActiveTab] = useState('confidential'); 
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    lostFound: [],
    sos: [],
    confidentialReports: []
  });

  const [reportsPagination, setReportsPagination] = useState({
    page: 1, limit: 10, total: 0, pages: 1
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [selectedReport, setSelectedReport] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); 
  const [showFlagModal, setShowFlagModal] = useState(null); 
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    connectSocket(activeBuildingId);
    fetchCommunityData();

    socket.on('confidentialReportCreated', (newReport) => {
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

  const handleFlag = async (reportId, status) => {
    const isFlagged = status !== 'None';
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
      fetchConfidentialReports(reportsPagination.page);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (reportId) => {
    setData(prev => ({
      ...prev,
      confidentialReports: prev.confidentialReports.filter(r => r._id !== reportId)
    }));
    setIsActionLoading(true);
    try {
      await api.deleteConfidentialReport(reportId);
      setShowDeleteConfirm(null);
    } catch (err) {
      fetchConfidentialReports(reportsPagination.page);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleHide = async (reportId) => {
    setData(prev => ({
      ...prev,
      confidentialReports: prev.confidentialReports.filter(r => r._id !== reportId)
    }));
    try {
      await api.hideConfidentialReport(reportId, true);
    } catch (err) {
      fetchConfidentialReports(reportsPagination.page);
    }
  };

  const handleStatusChange = async (reportId, status) => {
    setData(prev => ({
      ...prev,
      confidentialReports: prev.confidentialReports.map(r => 
        r._id === reportId ? { ...r, status } : r
      )
    }));
    try {
      await api.updateConfidentialReportStatus(reportId, status);
    } catch (err) {
      fetchConfidentialReports(reportsPagination.page);
    }
  };

  const handleResolveSOS = async (sosId) => {
    setData(prev => ({
      ...prev,
      sos: prev.sos.map(s => s._id === sosId ? { ...s, status: 'Resolved' } : s)
    }));
    try {
      await api.resolveSOSAlert(sosId);
    } catch (err) {
      fetchCommunityData();
    }
  };

  const handleDispatchSOS = async (sosId) => {
    try {
      await api.dispatchSOSAlert(sosId);
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
      default: return '#94A3B8';
    }
  };

  const tabs = [
    { id: 'confidential', name: 'Confidential Intelligence', icon: <ShieldAlert size={18} /> },
    { id: 'sos', name: 'SOS Response', icon: <AlertOctagon size={18} /> },
    { id: 'lost-found', name: 'Asset Recovery', icon: <Search size={18} /> },
  ];

  const iStyle = { width: '100%', padding: '0.9rem 1.2rem', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontWeight: '700', fontSize: '0.9rem', outline: 'none' };

  return (
    <div className="community-page" style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '5rem' }}>
      
      {/* Premium Header */}
      <header style={{ 
        marginBottom: '3rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '2.5rem',
        borderRadius: '32px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
        border: '1px solid rgba(0,0,0,0.03)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.02)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '0.5rem' }}>
             <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 12px 30px rgba(99, 102, 241, 0.3)' }}>
               <Users size={32} />
             </div>
             <div>
                <h1 style={{ fontSize: '2.4rem', fontWeight: '950', margin: 0, letterSpacing: '-0.03em' }}>Community Operations</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '600', margin: 0 }}>Oversee security protocols and resident interactions.</p>
             </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
           <button onClick={fetchCommunityData} className="btn" style={{ background: 'white', border: '1px solid #E2E8F0', padding: '0.8rem 1.5rem', borderRadius: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#475569', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <Bell size={18} /> Live Sync
           </button>
           <button 
             onClick={async () => {
               try {
                 const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                 const res = await fetch(`${apiBase}/confidential-reports/debug`);
                 const result = await res.json();
                 alert(`Current Building ID: ${activeBuildingId}\nDB Check: Found ${result.count} total reports.`);
               } catch (e) {
                 alert('Debug fetch failed.');
               }
             }} 
             className="btn" 
             style={{ background: '#F1F5F9', border: 'none', padding: '0.8rem 1.2rem', borderRadius: '16px', color: '#64748B' }}
           >
              <AlertTriangle size={18} />
           </button>
        </div>
      </header>

      {/* Modern Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', padding: '0.5rem', background: 'rgba(255,255,255,0.5)', borderRadius: '24px', border: '1px solid #F1F5F9' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '1.2rem', borderRadius: '18px', border: 'none', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748B',
              boxShadow: activeTab === tab.id ? '0 10px 25px rgba(99, 102, 241, 0.2)' : 'none'
            }}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      <div className="content-area">
        <AnimatePresence mode="wait">
          
          {/* CONFIDENTIAL REPORTS */}
          {activeTab === 'confidential' && (
            <motion.div key="confidential" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }}>
               <div className="card" style={{ padding: '2rem', borderRadius: '32px', background: 'white', border: '1px solid #F1F5F9', boxShadow: '0 20px 50px rgba(0,0,0,0.02)' }}>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                       <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>Intelligence Feed</h2>
                       <div style={{ padding: '0.4rem 1rem', borderRadius: '100px', background: '#F1F5F9', color: '#475569', fontSize: '0.8rem', fontWeight: '900' }}>
                         {reportsPagination.total} DISPATCHES
                       </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                       <div style={{ position: 'relative' }}>
                          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} size={16} />
                          <input 
                            type="text" 
                            placeholder="Search intelligence logs..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ ...iStyle, paddingLeft: '2.8rem', width: '300px' }}
                          />
                       </div>
                       <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...iStyle, width: '180px' }}>
                          <option value="">All Protocol Status</option>
                          <option value="Pending">Pending</option>
                          <option value="In Progress">Investigation</option>
                          <option value="Resolved">Closed</option>
                       </select>
                       <button onClick={() => fetchConfidentialReports(1)} className="btn btn-primary" style={{ padding: '0.85rem 1.4rem', borderRadius: '14px' }}><Filter size={18} /></button>
                    </div>
                  </div>

                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem' }}>
                      <thead>
                        <tr style={{ color: '#94A3B8', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          <th style={{ padding: '0 1rem', textAlign: 'left' }}>Operational Title</th>
                          <th style={{ padding: '0 1rem', textAlign: 'left' }}>Category</th>
                          <th style={{ padding: '0 1rem', textAlign: 'left' }}>Priority</th>
                          <th style={{ padding: '0 1rem', textAlign: 'left' }}>Status</th>
                          <th style={{ padding: '0 1rem', textAlign: 'left' }}>Date</th>
                          <th style={{ padding: '0 1rem', textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr><td colSpan="6" style={{ textAlign: 'center', padding: '5rem' }}><Loader2 className="spin" size={32} color="var(--accent-primary)" /></td></tr>
                        ) : data.confidentialReports.length === 0 ? (
                          <tr><td colSpan="6" style={{ textAlign: 'center', padding: '5rem', color: '#94A3B8', fontWeight: '700' }}>No active dispatches found.</td></tr>
                        ) : data.confidentialReports.map(report => (
                          <motion.tr 
                            key={report._id} 
                            whileHover={{ scale: 1.002 }}
                            style={{ background: '#F9FAFF', borderRadius: '16px' }}
                          >
                            <td style={{ padding: '1.2rem 1rem', borderRadius: '16px 0 0 16px' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getPriorityColor(report.priority) }} />
                                  <span style={{ fontWeight: '800', color: '#1E293B' }}>{report.title || 'Redacted Title'}</span>
                                  {report.isFlagged && <span style={{ padding: '0.2rem 0.6rem', borderRadius: '6px', background: getFlagStatusColor(report.flagStatus), color: 'white', fontSize: '0.65rem', fontWeight: '900' }}>{report.flagStatus}</span>}
                               </div>
                            </td>
                            <td style={{ padding: '1.2rem 1rem', fontSize: '0.9rem', color: '#475569', fontWeight: '700' }}>{report.category}</td>
                            <td style={{ padding: '1.2rem 1rem' }}>
                               <span style={{ fontSize: '0.75rem', fontWeight: '900', color: getPriorityColor(report.priority), background: `${getPriorityColor(report.priority)}15`, padding: '0.4rem 0.8rem', borderRadius: '8px', textTransform: 'uppercase' }}>
                                 {report.priority}
                               </span>
                            </td>
                            <td style={{ padding: '1.2rem 1rem' }}>
                               <select 
                                 value={report.status}
                                 onChange={(e) => handleStatusChange(report._id, e.target.value)}
                                 style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: 'white', fontSize: '0.85rem', fontWeight: '800', color: report.status === 'Resolved' ? '#10B981' : '#F59E0B' }}
                               >
                                 <option value="Pending">Pending</option>
                                 <option value="In Progress">Investigating</option>
                                 <option value="Resolved">Closed</option>
                               </select>
                            </td>
                            <td style={{ padding: '1.2rem 1rem', fontSize: '0.85rem', color: '#94A3B8', fontWeight: '700' }}>{new Date(report.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '1.2rem 1rem', borderRadius: '0 16px 16px 0', textAlign: 'right' }}>
                               <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                  <button onClick={() => setSelectedReport(report)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: '#EEF2FF', color: 'var(--accent-primary)', cursor: 'pointer' }}><Eye size={18} /></button>
                                  <button onClick={() => setShowFlagModal(report)} style={{ width: '36px', height: '36px', borderRadius: '100px', border: 'none', background: report.isFlagged ? '#FFF7ED' : '#F1F5F9', color: report.isFlagged ? '#F59E0B' : '#94A3B8', cursor: 'pointer' }}><Flag size={16} fill={report.isFlagged ? 'currentColor' : 'none'} /></button>
                                  <button onClick={() => handleHide(report._id)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: '#F1F5F9', color: '#64748B', cursor: 'pointer' }}><EyeOff size={18} /></button>
                                  <button onClick={() => setShowDeleteConfirm(report._id)} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: '#FFF1F2', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                               </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', padding: '1rem', background: '#F8FAFC', borderRadius: '20px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748B' }}>
                       Operational Logs { (reportsPagination.page - 1) * reportsPagination.limit + 1 } - { Math.min(reportsPagination.page * reportsPagination.limit, reportsPagination.total) } of { reportsPagination.total }
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                       <button disabled={reportsPagination.page === 1} onClick={() => fetchConfidentialReports(reportsPagination.page - 1)} style={{ padding: '0.6rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', opacity: reportsPagination.page === 1 ? 0.5 : 1 }}><ChevronLeft size={20} /></button>
                       {[...Array(reportsPagination.pages)].map((_, i) => (
                         <button key={i+1} onClick={() => fetchConfidentialReports(i+1)} style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', background: reportsPagination.page === i+1 ? 'var(--accent-primary)' : 'white', color: reportsPagination.page === i+1 ? 'white' : '#64748B', fontWeight: '900', cursor: 'pointer', boxShadow: reportsPagination.page === i+1 ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none' }}>{i+1}</button>
                       ))}
                       <button disabled={reportsPagination.page === reportsPagination.pages} onClick={() => fetchConfidentialReports(reportsPagination.page + 1)} style={{ padding: '0.6rem', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', opacity: reportsPagination.page === reportsPagination.pages ? 0.5 : 1 }}><ChevronRight size={20} /></button>
                    </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* SOS ALERTS */}
          {activeTab === 'sos' && (
            <motion.div key="sos" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               {data.sos.length === 0 ? (
                 <div style={{ padding: '8rem 2rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '32px', border: '1px dashed #CBD5E1' }}>
                    <ShieldAlert size={64} color="#94A3B8" style={{ margin: '0 auto 1.5rem' }} />
                    <h3 style={{ fontWeight: '900', color: '#1E293B' }}>Zero SOS Signals</h3>
                    <p style={{ color: '#64748B', fontWeight: '600' }}>No emergency triggers detected in the current building cycle.</p>
                 </div>
               ) : (
                 data.sos.map(alert => (
                   <motion.div 
                     key={alert._id} 
                     className="card" 
                     style={{ 
                       padding: '2rem', borderRadius: '28px', borderLeft: `8px solid ${alert.status === 'Resolved' ? '#10B981' : '#EF4444'}`,
                       display: 'flex', gap: '2.5rem', alignItems: 'center', position: 'relative', overflow: 'hidden'
                     }}
                   >
                     {alert.status !== 'Resolved' && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(239, 68, 68, 0.02)', pointerEvents: 'none' }} />}
                     
                     <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: alert.status === 'Resolved' ? '#DCFCE7' : '#FEE2E2', color: alert.status === 'Resolved' ? '#10B981' : '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                       <AlertOctagon size={40} />
                     </div>

                     <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                           <div>
                              <h3 style={{ fontSize: '1.4rem', fontWeight: '950', margin: 0, color: '#1E293B' }}>{alert.type} Emergency</h3>
                              <p style={{ margin: '0.3rem 0 0 0', fontWeight: '700', color: '#64748B', fontSize: '1rem' }}>{alert.message}</p>
                           </div>
                           <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1E293B' }}>{new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94A3B8' }}>{new Date(alert.createdAt).toLocaleDateString()}</div>
                           </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1.2rem' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F1F5F9', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: '800', color: '#475569' }}>
                              <MapPin size={16} /> {alert.location}
                           </div>
                           <div style={{ fontSize: '0.8rem', fontWeight: '900', color: alert.status === 'Resolved' ? '#10B981' : '#EF4444', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Protocol Status: {alert.status}
                           </div>
                        </div>
                     </div>

                     <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                          onClick={() => handleResolveSOS(alert._id)}
                          disabled={alert.status === 'Resolved'}
                          style={{ padding: '1rem 2rem', borderRadius: '16px', background: alert.status === 'Resolved' ? '#F1F5F9' : '#10B981', color: alert.status === 'Resolved' ? '#94A3B8' : 'white', border: 'none', fontWeight: '900', cursor: alert.status === 'Resolved' ? 'default' : 'pointer', boxShadow: alert.status === 'Resolved' ? 'none' : '0 8px 20px rgba(16, 185, 129, 0.2)' }}
                        >
                          {alert.status === 'Resolved' ? 'Protocol Closed' : 'Mark Resolved'}
                        </button>
                        <button 
                          onClick={() => handleDispatchSOS(alert._id)}
                          style={{ padding: '1rem 1.5rem', borderRadius: '16px', background: 'white', border: '1px solid #E2E8F0', color: '#EF4444', fontWeight: '900', cursor: 'pointer' }}
                        >
                          Dispatch Response
                        </button>
                     </div>
                   </motion.div>
                 ))
               )}
            </motion.div>
          )}

          {/* LOST & FOUND */}
          {activeTab === 'lost-found' && (
            <motion.div key="lost-found" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
               {data.lostFound.length === 0 ? (
                 <div style={{ gridColumn: '1 / -1', padding: '8rem 2rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '32px', border: '1px dashed #CBD5E1' }}>
                    <Search size={64} color="#94A3B8" style={{ margin: '0 auto 1.5rem' }} />
                    <h3 style={{ fontWeight: '900', color: '#1E293B' }}>Vault Empty</h3>
                    <p style={{ color: '#64748B', fontWeight: '600' }}>No missing or found assets reported in this cycle.</p>
                 </div>
               ) : (
                 data.lostFound.map(item => (
                   <motion.div 
                     key={item._id} 
                     whileHover={{ y: -8 }}
                     className="card" 
                     style={{ padding: '1.8rem', borderRadius: '28px', border: '1px solid #F1F5F9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}
                   >
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <span style={{ padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '900', textTransform: 'uppercase', background: item.type === 'Lost' ? '#FFF1F2' : '#DCFCE7', color: item.type === 'Lost' ? '#EF4444' : '#10B981' }}>{item.type}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#94A3B8' }}>{item.date}</span>
                     </div>
                     <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#1E293B', marginBottom: '1rem' }}>{item.title || item.item}</h3>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748B', fontSize: '0.9rem', fontWeight: '700' }}><MapPin size={14} /> {item.location}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748B', fontSize: '0.9rem', fontWeight: '700' }}><Users size={14} /> {item.reportedBy}</div>
                     </div>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.2rem', borderTop: '1px solid #F1F5F9' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: '900', color: item.status === 'Open' ? '#F59E0B' : '#10B981' }}>{item.status.toUpperCase()}</div>
                        <button 
                          onClick={() => handleLostFoundStatus(item._id, item.status === 'Open' ? 'Resolved' : 'Open')}
                          style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none', background: '#F1F5F9', color: '#475569', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          {item.status === 'Open' ? <><CheckCircle2 size={16} /> Resolve</> : <><Search size={16} /> Reopen</>}
                        </button>
                     </div>
                   </motion.div>
                 ))
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Premium Modals */}
      <AnimatePresence>
        {selectedReport && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="card" style={{ width: '90%', maxWidth: '700px', padding: '3rem', borderRadius: '32px', border: '1px solid #E2E8F0', boxShadow: '0 40px 100px rgba(0,0,0,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                  <div>
                     <h2 style={{ fontSize: '1.8rem', fontWeight: '950', margin: 0, letterSpacing: '-0.02em' }}>Intelligence Dispatch</h2>
                     <p style={{ color: '#64748B', fontWeight: '600', margin: 0 }}>Detailed operational report metrics.</p>
                  </div>
                  <button onClick={() => setSelectedReport(null)} style={{ background: '#F8FAFC', border: 'none', padding: '0.8rem', borderRadius: '14px', cursor: 'pointer' }}><X size={20}/></button>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Title</label>
                     <p style={{ fontSize: '1.2rem', fontWeight: '800', color: '#1E293B', margin: 0 }}>{selectedReport.title}</p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Intelligence Context</label>
                     <div style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px', color: '#475569', fontWeight: '700', lineHeight: '1.6' }}>{selectedReport.description}</div>
                  </div>
                  <div>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Category</label>
                     <p style={{ fontWeight: '800', margin: 0 }}>{selectedReport.category}</p>
                  </div>
                  <div>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Localization</label>
                     <p style={{ fontWeight: '800', margin: 0 }}><MapPin size={14} /> {selectedReport.location}</p>
                  </div>
                  <div>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Priority Status</label>
                     <p style={{ fontWeight: '800', margin: 0, color: getPriorityColor(selectedReport.priority) }}>{selectedReport.priority.toUpperCase()}</p>
                  </div>
                  <div>
                     <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '900', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Dispatch Source</label>
                     <p style={{ fontWeight: '800', margin: 0 }}>{selectedReport.tenant?.name || 'Anonymous Resident'}</p>
                  </div>
               </div>
               
               <button onClick={() => setSelectedReport(null)} className="btn btn-primary" style={{ width: '100%', marginTop: '3rem', padding: '1.2rem', borderRadius: '16px', fontWeight: '900' }}>Acknowledge Logic</button>
            </motion.div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="card" style={{ maxWidth: '450px', padding: '3rem', borderRadius: '32px', textAlign: 'center' }}>
               <div style={{ width: '80px', height: '80px', background: '#FEE2E2', color: '#EF4444', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                  <AlertTriangle size={48} />
               </div>
               <h2 style={{ fontSize: '1.6rem', fontWeight: '950', margin: 0 }}>Purge Dispatch?</h2>
               <p style={{ color: '#64748B', fontWeight: '700', marginTop: '1rem', lineHeight: '1.5' }}>This will permanently expunge the dispatch from the operational history. This action is irreversible.</p>
               <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                  <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', background: 'white', fontWeight: '800' }}>Abort</button>
                  <button onClick={() => handleDelete(showDeleteConfirm)} disabled={isActionLoading} style={{ flex: 1, padding: '1rem', borderRadius: '14px', border: 'none', background: '#EF4444', color: 'white', fontWeight: '900' }}>{isActionLoading ? 'Purging...' : 'Confirm Purge'}</button>
               </div>
            </motion.div>
          </div>
        )}

        {showFlagModal && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="card" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: '32px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '950', margin: 0 }}>Flag Intelligence</h3>
                  <button onClick={() => setShowFlagModal(null)} style={{ background: '#F8FAFC', border: 'none', padding: '0.6rem', borderRadius: '12px' }}><X size={18}/></button>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {['Flagged', 'High Priority', 'Escalated', 'Under Investigation'].map(status => (
                    <button 
                      key={status} 
                      onClick={() => handleFlag(showFlagModal._id, status)}
                      style={{ padding: '1.2rem', borderRadius: '16px', border: '1px solid #F1F5F9', background: showFlagModal.flagStatus === status ? `${getFlagStatusColor(status)}10` : 'white', color: '#1E293B', fontWeight: '800', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                    >
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: getFlagStatusColor(status) }} />
                      {status}
                    </button>
                  ))}
                  <button 
                    onClick={() => handleFlag(showFlagModal._id, 'None')}
                    style={{ padding: '1.2rem', borderRadius: '16px', border: '1px dashed #E2E8F0', background: 'white', color: '#64748B', fontWeight: '800', marginTop: '0.5rem' }}
                  >
                    Clear Flagging Logic
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default Community;
