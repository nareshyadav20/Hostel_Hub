import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, CheckCircle, Clock, AlertTriangle, CheckCircle2, MessageSquare, Zap, Activity, Droplets, Filter, RefreshCw, ChevronDown } from 'lucide-react';
import { api } from '../mockData';


const Complaints = () => {
  const { buildingId: urlBuildingId } = useParams();
  const navigate = useNavigate();
  
  // Step 1: Restore context
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');

  const [complaints, setComplaints] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Maintenance');
  const [filterBuilding, setFilterBuilding] = useState(activeBuildingId || 'all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchComplaints = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    else setIsRefreshing(true);
    
    try {
      // Invalidate cache to get fresh data
      localStorage.removeItem('complaints_all_v4');
      const data = await api.getComplaints();
      const buildingsData = await api.getBuildings();
      setBuildings(buildingsData);

      const formatted = data
        .filter(c => filterBuilding === 'all' || c.buildingId === filterBuilding || c.buildingId?._id === filterBuilding)
        .map(c => {
          const createdAt = c.createdAt || c.date;
          const diffHours = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60));
          const timeElapsed = diffHours < 24 ? `${diffHours} hours ago` : `${Math.floor(diffHours/24)} days ago`;
          
          return {
            id: c._id || c.id,
            room: c.roomId?.roomNumber || c.tenant?.room || 'N/A',
            issue: c.title,
            category: c.category,
            urgency: c.priority || (['Electrical', 'Plumbing'].includes(c.category) ? 'High' : 'Medium'),
            status: c.status === 'In Progress' ? 'In-Progress' : c.status,
            reportedBy: c.tenant?.name || 'Unknown User',
            timeElapsed,
            description: c.description,
            buildingName: c.buildingId?.name || 'Unknown Building'
          };
        });
      setComplaints(formatted);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [filterBuilding]);

  useEffect(() => {
    fetchComplaints();
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchComplaints(false), 30000);
    return () => clearInterval(interval);
  }, [fetchComplaints]);

  useEffect(() => {
    if (urlBuildingId) setFilterBuilding(urlBuildingId);
  }, [urlBuildingId]);

  const handleBuildingFilterChange = (e) => {
    const bId = e.target.value;
    setFilterBuilding(bId);
    if (bId === 'all') navigate('/owner/complaints');
    else navigate(`/owner/complaints/${bId}`);
  };

  const filteredComplaints = complaints.filter(c => {
    if (activeTab === 'Maintenance') return !['Leave', 'Visitor'].includes(c.category);
    if (activeTab === 'Leave') return c.category === 'Leave';
    if (activeTab === 'Visitor') return c.category === 'Visitor';
    return true;
  });

  const [expandedId, setExpandedId] = useState(null);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  
  const staffMembers = [
    { id: 1, name: 'Ramesh Kumar', role: 'Plumber', active: true, avatar: 'RK' },
    { id: 2, name: 'Suresh Babu', role: 'Electrician', active: true, avatar: 'SB' },
    { id: 3, name: 'Pradeep Singh', role: 'Cleaning Lead', active: true, avatar: 'PS' },
    { id: 4, name: 'Anita Devi', role: 'Mess Manager', active: false, avatar: 'AD' }
  ];

  const totalComplaints = filteredComplaints.length;
  const pendingCount = filteredComplaints.filter(c => c.status === 'Pending').length;
  const resolvedCount = filteredComplaints.filter(c => c.status === 'Resolved').length;
  
  const handleStatusChange = async (id, newStatus, assignedTo = null) => {
    try {
      await api.updateComplaintStatus(id, newStatus, assignedTo);
      setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus, assignedTo } : c));
      setIsAssignModalOpen(false);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleArchive = (id) => {
    if (window.confirm('Archive this complaint?')) {
      setComplaints(complaints.filter(c => c.id !== id));
    }
  };

  const getUrgencyBadge = (urgency) => {
    switch(urgency) {
       case 'High': return <span style={{ padding: '0.2rem 0.5rem', background: '#EF4444', color: '#fff', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>{urgency}</span>;
       case 'Medium': return <span style={{ padding: '0.2rem 0.5rem', background: '#F59E0B', color: '#fff', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>{urgency}</span>;
       case 'Low': return <span style={{ padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>{urgency}</span>;
       default: return <span style={{ padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>{urgency}</span>;
    }
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'Resolved': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><CheckCircle2 size={12}/> {activeTab === 'Maintenance' ? 'RESOLVED' : 'APPROVED'}</span>;
      case 'In-Progress': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(56, 189, 248, 0.1)', color: '#0EA5E9' }}><Activity size={12}/> IN PROGRESS</span>;
      case 'Pending': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><Clock size={12}/> PENDING</span>;
      case 'Rejected': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><Clock size={12}/> REJECTED</span>;
      default: return null;
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Plumbing': return <Droplets size={16} color="#0EA5E9" />;
      case 'Electrical': return <Zap size={16} color="#F59E0B" />;
      case 'WiFi / IT': return <Activity size={16} color="#10B981" />;
      case 'Leave': return <Clock size={16} color="#8B5CF6" />;
      case 'Visitor': return <MessageSquare size={16} color="#EC4899" />;
      default: return <Wrench size={16} color="var(--text-secondary)" />;
    }
  };

  const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '100%' };

  return (
    <div className="complaints-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.4rem', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
            <Wrench size={32} color="var(--accent-primary)" /> Service Hub
            {isRefreshing && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}><RefreshCw size={16} color="var(--text-muted)"/></motion.div>}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '500' }}>Operational control center for maintenance and requests.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '0.2rem 0.8rem' }}>
            <Filter size={16} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
            <select 
              value={filterBuilding} 
              onChange={handleBuildingFilterChange}
              style={{ background: 'transparent', border: 'none', padding: '0.6rem 2rem 0.6rem 0.2rem', color: 'var(--text-primary)', fontWeight: '700', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', appearance: 'none' }}
            >
              <option value="all">All Buildings</option>
              {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <ChevronDown size={14} color="var(--text-muted)" style={{ position: 'absolute', right: '0.8rem', pointerEvents: 'none' }} />
          </div>

          <button onClick={() => setIsBroadcastModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', borderRadius: '12px', padding: '0.8rem 1.5rem' }}>
              <MessageSquare size={16} /> Broadcast
          </button>
          <button onClick={() => window.history.back()} className="btn" style={{ padding: '0.7rem', borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
        {['Maintenance', 'Leave', 'Visitor'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setExpandedId(null); }}
            style={{ 
              padding: '0.8rem 2rem', borderRadius: '12px', border: 'none', 
              background: activeTab === tab ? 'var(--bg-primary)' : 'transparent',
              color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
              fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.3s',
              boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none'
            }}
          >
            {tab} {tab === 'Maintenance' ? 'Tickets' : 'Requests'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--text-primary)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.05 }}><Wrench size={80}/></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Total {activeTab}</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '900', margin: 0 }}>{totalComplaints}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #F59E0B', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.05 }}><Clock size={80}/></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Pending</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '900', color: '#F59E0B', margin: 0 }}>{pendingCount}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10B981', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-10px', top: '-10px', opacity: 0.05 }}><CheckCircle2 size={80}/></div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>{activeTab === 'Maintenance' ? 'Resolved' : 'Approved'}</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '900', color: '#10B981', margin: 0 }}>{resolvedCount}</h2>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden', borderRadius: '20px' }}>
        <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1.2rem 1.5rem' }}>TENANT & LOCATION</th>
              <th style={{ padding: '1.2rem' }}>ISSUE DETAILS</th>
              <th style={{ padding: '1.2rem' }}>STATUS</th>
              <th style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '600' }}>Loading complaints...</td></tr>
              ) : filteredComplaints.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '600' }}>No active {activeTab.toLowerCase()} requests found.</td></tr>
              ) : filteredComplaints.map(c => (
                <React.Fragment key={c.id}>
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    style={{ borderBottom: '1px solid var(--border-color)', background: c.status === 'Resolved' ? 'var(--bg-tertiary)' : 'transparent', cursor: 'pointer', transition: 'background 0.2s' }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '1.2rem 1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <span style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--text-primary)' }}>{c.reportedBy}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: '800', background: 'rgba(99, 102, 241, 0.1)', padding: '0.1rem 0.5rem', borderRadius: '6px' }}>Room {c.room}</span>
                           <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{c.buildingName}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                          <span style={{ padding: '0.4rem', background: 'var(--bg-secondary)', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
                            {getCategoryIcon(c.category)}
                          </span>
                          <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{c.issue}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                          {getUrgencyBadge(c.urgency)}
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>{c.timeElapsed}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      {getStatusDisplay(c.status)}
                    </td>
                    <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {c.status === 'Pending' && activeTab === 'Maintenance' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedComplaintId(c.id); setIsAssignModalOpen(true); }}
                              className="btn btn-primary" 
                              style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: '800', borderRadius: '10px' }}
                            >
                              Assign Staff
                            </button>
                          )}
                          {c.status === 'Pending' && activeTab !== 'Maintenance' && (
                            <>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(c.id, 'Resolved'); }}
                                className="btn" 
                                style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: '800', borderRadius: '10px', background: '#10B981', color: 'white', border: 'none' }}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(c.id, 'Rejected'); }}
                                className="btn" 
                                style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: '800', borderRadius: '10px', border: '1px solid #EF4444', color: '#EF4444', background: 'transparent' }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {c.status === 'In-Progress' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(c.id, 'Resolved'); }}
                              className="btn" 
                              style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: '800', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid #10B981' }}
                            >
                              <CheckCircle2 size={14} style={{ marginRight: '0.4rem' }}/> Resolve
                            </button>
                          )}
                          {(c.status === 'Resolved' || c.status === 'Rejected') && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleArchive(c.id); }}
                              className="btn" 
                              style={{ padding: '0.5rem', fontSize: '0.75rem', border: '1px solid var(--border-color)', color: 'var(--text-muted)', borderRadius: '10px' }}
                            >
                              Archive
                            </button>
                          )}
                      </div>
                    </td>
                  </motion.tr>
                  {expandedId === c.id && (
                    <motion.tr initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--bg-tertiary)' }}>
                      <td colSpan="4" style={{ padding: '2rem 3rem' }}>
                        <div style={{ background: 'var(--bg-primary)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--border-color)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                            <div>
                              <p style={{ fontWeight: '800', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.8rem', letterSpacing: '0.05em' }}>Issue Description</p>
                              <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-primary)', fontWeight: '500', margin: 0 }}>{c.description}</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '2rem' }}>
                              <div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Tenant</p>
                                <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{c.reportedBy}</p>
                              </div>
                              <div>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Building</p>
                                <p style={{ fontWeight: '700', fontSize: '0.9rem' }}>{c.buildingName}</p>
                              </div>
                              {c.assignedTo && (
                                <div>
                                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Staff Assigned</p>
                                  <p style={{ fontWeight: '800', fontSize: '0.9rem', color: 'var(--accent-primary)' }}>{c.assignedTo}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        </div>
      </div>

      <AnimatePresence>
        {isBroadcastModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, backdropFilter: 'blur(8px)' }} onClick={() => setIsBroadcastModalOpen(false)} />
            <motion.div initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }} style={{ position: 'fixed', top: '20%', left: '50%', x: '-50%', width: '90%', maxWidth: '500px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-2xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.8rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}><MessageSquare size={24}/></div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0 }}>Broadcast Update</h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '500' }}>Notify all tenants about maintenance, events, or important notices.</p>
              <form onSubmit={async e => { e.preventDefault(); alert('Broadcast sent!'); setIsBroadcastModalOpen(false); }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <textarea placeholder="Write your update message here..." value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} style={{ ...inputStyle, minHeight: '150px', fontWeight: '500', fontSize: '1rem', resize: 'none' }} required />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem', fontWeight: '800', borderRadius: '14px' }}>Send Broadcast</button>
                  <button className="btn" type="button" onClick={() => setIsBroadcastModalOpen(false)} style={{ flex: 1, padding: '1rem', fontWeight: '800', borderRadius: '14px', background: 'var(--bg-tertiary)', border: 'none' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {isAssignModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, backdropFilter: 'blur(8px)' }} onClick={() => setIsAssignModalOpen(false)} />
            <motion.div initial={{ y: 50, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.95 }} style={{ position: 'fixed', top: '15%', left: '50%', x: '-50%', width: '90%', maxWidth: '450px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-2xl)' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '1.5rem', textAlign: 'center' }}>Assign Staff Member</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {staffMembers.filter(s => s.active).map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => handleStatusChange(selectedComplaintId, 'In-Progress', s.name)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', 
                      borderRadius: '16px', border: '1px solid var(--border-color)', 
                      background: 'var(--bg-tertiary)', cursor: 'pointer', transition: 'all 0.3s',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.transform = 'none'; }}
                  >
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem' }}>{s.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '800', fontSize: '1rem', margin: 0 }}>{s.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, fontWeight: '600' }}>{s.role}</p>
                    </div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                  </button>
                ))}
              </div>
              <button className="btn" onClick={() => setIsAssignModalOpen(false)} style={{ width: '100%', marginTop: '2rem', border: 'none', background: 'var(--bg-tertiary)', padding: '1rem', fontWeight: '800', borderRadius: '14px' }}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .table-row-hover:hover {
          background: rgba(99, 102, 241, 0.03) !important;
        }
        select::-ms-expand { display: none; }
      `}</style>
    </div>
  );
};

export default Complaints;
