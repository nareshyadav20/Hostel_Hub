import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, CheckCircle, Clock, AlertTriangle, CheckCircle2, MessageSquare, Zap, Activity, Droplets, Filter, RefreshCw, ChevronDown, X } from 'lucide-react';
import { api } from '../mockData';

const MOCK_COMPLAINTS = [
  { id: 'mc1', room: '101 - Bed A', issue: 'Ceiling fan not working', category: 'Maintenance', urgency: 'High',   status: 'Pending',     reportedBy: 'Amit Kumar',   timeElapsed: '2 hours ago',   description: 'The fan has been broken for 2 days. Room gets very hot at night.', buildingName: 'Alpha Tower' },
  { id: 'mc2', room: '202 - Bed B', issue: 'Food quality is poor',  category: 'Food',        urgency: 'Medium', status: 'In-Progress', reportedBy: 'Sneha Reddy',  timeElapsed: '5 hours ago',   description: 'The dinner provided had very little vegetables and no protein.', buildingName: 'Beta Block' },
  { id: 'mc3', room: '305 - Bed C', issue: 'Bathroom pipe leaking', category: 'Plumbing',   urgency: 'High',   status: 'Pending',     reportedBy: 'Rahul Mehta',  timeElapsed: '1 day ago',     description: 'Water leaking from under the sink continuously. Floor is wet.', buildingName: 'Alpha Tower' },
  { id: 'mc4', room: '104 - Bed A', issue: 'AC not cooling',        category: 'Electrical',  urgency: 'High',   status: 'Resolved',    reportedBy: 'Priya Sharma', timeElapsed: '3 days ago',    description: 'Air conditioner runs but room temperature is not dropping below 28°C.', buildingName: 'Beta Block' },
  { id: 'mc5', room: '203 - Bed B', issue: 'WiFi very slow',        category: 'Maintenance', urgency: 'Low',    status: 'In-Progress', reportedBy: 'Arjun Das',    timeElapsed: '6 hours ago',   description: 'Internet speed is below 1 Mbps during evenings. Streaming is impossible.', buildingName: 'Alpha Tower' },
  { id: 'mc6', room: '401 - Bed A', issue: 'Leave request – home',  category: 'Leave',       urgency: 'Low',    status: 'Pending',     reportedBy: 'Kiran Patil',  timeElapsed: '1 hour ago',    description: 'Requesting 5-day leave from 10 May to 15 May for family function.', buildingName: 'Alpha Tower' },
  { id: 'mc7', room: '302 - Bed C', issue: 'Guest visit request',   category: 'Visitor',     urgency: 'Low',    status: 'Pending',     reportedBy: 'Divya Nair',   timeElapsed: '30 minutes ago',description: 'Requesting permission for parent visit on Sunday 12 May, 10 AM–4 PM.', buildingName: 'Beta Block' },
  { id: 'mc8', room: '105 - Bed B', issue: 'Room not cleaned',      category: 'Cleaning',    urgency: 'Medium', status: 'Pending',     reportedBy: 'Sanjay Rao',   timeElapsed: '4 hours ago',   description: 'Common bathroom has not been cleaned for 2 days. Unhygienic conditions.', buildingName: 'Alpha Tower' },
];

const Complaints = () => {
  const { buildingId: urlBuildingId } = useParams();
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
      const data = await api.getComplaints(activeBuildingId);
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
      // Fall back to mock data if API returns empty
      setComplaints(formatted.length > 0 ? formatted : MOCK_COMPLAINTS);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  }, [activeBuildingId, filterBuilding]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

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

  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'In-Progress').length;
  
  const handleStatusChange = async (id, newStatus, assignedTo = null) => {
    try {
      await API.patch(`/complaints/${id}`, { status: newStatus });
      setComplaints(complaints.map(c => c._id === id ? { ...c, status: newStatus, assignedTo } : c));
      setIsAssignModalOpen(false);
    } catch (err) {
      console.error('Error updating complaint status:', err);
      alert('Failed to update status.');
    }
  };

  const handleArchive = (id) => {
    if (window.confirm('Archive this complaint?')) {
      // Logic for archiving if needed, for now just local filter
      setComplaints(complaints.filter(c => c._id !== id));
    }
  };

  const handleBroadcast = (e) => {
    e.preventDefault();
    alert(`Broadcast sent: ${broadcastMessage}`);
    setIsBroadcastModalOpen(false);
    setBroadcastMessage('');
  };

  const getUrgencyBadge = (urgency) => {
    switch(urgency) {
       case 'High': return <span style={{ padding: '0.2rem 0.5rem', background: 'var(--accent-error)', color: '#fff', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>{urgency}</span>;
       case 'Medium': return <span style={{ padding: '0.2rem 0.5rem', background: 'var(--accent-warning)', color: '#fff', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>{urgency}</span>;
       case 'Low': return <span style={{ padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>{urgency}</span>;
       default: return <span style={{ padding: '0.2rem 0.5rem', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>{urgency}</span>;
    }
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'Resolved': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' }}><CheckCircle2 size={12}/> {activeTab === 'Maintenance' ? 'RESOLVED' : 'APPROVED'}</span>;
      case 'In-Progress': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)' }}><Activity size={12}/> IN PROGRESS</span>;
      case 'Pending': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' }}><Clock size={12}/> PENDING</span>;
      case 'Rejected': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-error)' }}><Clock size={12}/> REJECTED</span>;
      default: return null;
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Plumbing': return <Droplets size={16} color="var(--accent-primary)" />;
      case 'Electrical': return <Zap size={16} color="var(--accent-warning)" />;
      case 'Internet': return <Activity size={16} color="var(--accent-success)" />;
      case 'Leave': return <Clock size={16} color="#8B5CF6" />;
      case 'Visitor': return <MessageSquare size={16} color="#EC4899" />;
      default: return <Wrench size={16} color="var(--text-secondary)" />;
    }
  };

  const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '100%' };

  return (
    <div className="complaints-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Responsive Styles Injection */}
      <style>{`
        @media (max-width: 1024px) {
          .kpi-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .desktop-table-view {
            display: none;
          }
          .mobile-complaint-cards {
            display: grid !important;
            grid-template-columns: 1fr;
            gap: 1rem;
            padding: 0;
          }
        }
        @media (max-width: 768px) {
          .header-main {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1.5rem;
          }
          .header-main button {
            width: 100%;
          }
          .kpi-grid {
            grid-template-columns: 1fr !important;
          }
          .tabs-container {
            width: 100% !important;
            overflow-x: auto;
            white-space: nowrap;
            padding: 0.5rem !important;
            display: flex !important;
            gap: 0.8rem !important;
          }
          .tabs-container button {
            padding: 0.8rem 1.2rem !important;
            font-size: 0.85rem !important;
          }
        }
      `}</style>

      <header className="header-main" style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={32} color="var(--accent-primary)" /> Service Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Manage tickets and visitor permissions.</p>
        </div>
        <button onClick={() => setIsBroadcastModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <MessageSquare size={16} /> Broadcast Update
        </button>
      </header>

      <div className="tabs-container" style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
        {['Maintenance', 'Leave', 'Visitor'].map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setExpandedId(null); }}
            style={{ 
              padding: '0.8rem 1.8rem', borderRadius: '12px', border: 'none', 
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

      <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--text-primary)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Total {activeTab}</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800' }}>{totalComplaints}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-warning)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Pending {activeTab === 'Maintenance' ? 'Tickets' : 'Requests'}</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--accent-warning)' }}>{pendingCount}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-success)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Resolved</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--accent-success)' }}>{totalComplaints - pendingCount}</h2>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="desktop-table-view">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1.2rem' }}>Ticket Info</th>
                <th style={{ padding: '1.2rem' }}>{activeTab} Details</th>
                <th style={{ padding: '1.2rem' }}>Status</th>
                <th style={{ padding: '1.2rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {complaints.map((c, index) => (
                  <React.Fragment key={c.id}>
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                      style={{ borderBottom: '1px solid var(--border-color)', background: c.status === 'Resolved' ? 'var(--bg-tertiary)' : 'transparent', opacity: c.status === 'Resolved' ? 0.7 : 1, cursor: 'pointer' }}
                      className="table-row-hover"
                    >
                      <td style={{ padding: '1.2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>{c.room || 'N/A'}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ticket #{index + 1001}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                            By: <span style={{ fontWeight: '600' }}>{c.reportedBy || 'Unknown'}</span>
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1.2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span style={{ padding: '0.3rem', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                              {getCategoryIcon(c.category)}
                            </span>
                            <span style={{ fontWeight: '600' }}>{c.issue}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                            {getUrgencyBadge(c.urgency || 'Medium')}
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.category}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.2rem' }}>
                        {getStatusDisplay(c.status)}
                      </td>
                      <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                        <ChevronDown size={18} color="var(--text-muted)" style={{ transform: expandedId === c.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
                      </td>
                    </motion.tr>
                    {expandedId === c.id && (
                      <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--bg-tertiary)' }}>
                        <td colSpan="4" style={{ padding: '1.5rem 2.5rem' }}>
                          <div style={{ borderLeft: '4px solid var(--accent-primary)', paddingLeft: '1.5rem' }}>
                            <p style={{ fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Issue Details</p>
                            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>{c.description}</p>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                              {c.status === 'Pending' && (
                                <button onClick={(e) => { e.stopPropagation(); setSelectedComplaintId(c.id); setIsAssignModalOpen(true); }} className="btn btn-primary">Assign Staff</button>
                              )}
                              {c.status === 'In-Progress' && (
                                <button onClick={(e) => { e.stopPropagation(); handleStatusChange(c.id, 'Resolved'); }} className="btn btn-primary" style={{ background: 'var(--accent-success)' }}>Mark Resolved</button>
                              )}
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

        <div className="mobile-complaint-cards" style={{ display: 'none' }}>
          {complaints.map((c) => (
            <div 
              key={c.id} 
              onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
              style={{ background: 'white', padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                    {getCategoryIcon(c.category)}
                    <p style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>{c.room}</p>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, fontWeight: '600' }}>{c.issue}</p>
                </div>
                {getStatusDisplay(c.status)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {getUrgencyBadge(c.urgency)}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.timeElapsed}</span>
              </div>
              {expandedId === c.id && (
                <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0 }}>{c.description}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    {c.status === 'Pending' && <button onClick={(e) => { e.stopPropagation(); setSelectedComplaintId(c.id); setIsAssignModalOpen(true); }} className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem' }}>Assign</button>}
                    {c.status === 'In-Progress' && <button onClick={(e) => { e.stopPropagation(); handleStatusChange(c.id, 'Resolved'); }} className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem', background: 'var(--accent-success)' }}>Resolve</button>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isBroadcastModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsBroadcastModalOpen(false)} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={{ position: 'fixed', top: '20%', left: '50%', x: '-50%', width: '90%', maxWidth: '500px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Broadcast Maintenance Update</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Send a notification to all tenants regarding ongoing or upcoming maintenance work.</p>
              <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <textarea placeholder="Write your update message here..." value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} style={{ ...inputStyle, minHeight: '120px' }} required />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem' }}>Send Broadcast</button>
                  <button className="btn" type="button" onClick={() => setIsBroadcastModalOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {isAssignModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsAssignModalOpen(false)} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={{ position: 'fixed', top: '20%', left: '50%', x: '-50%', width: '90%', maxWidth: '400px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Assign Staff</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {staffMembers.filter(s => s.active).map(s => (
                  <button 
                    key={s.id} 
                    onClick={() => handleStatusChange(selectedComplaintId, 'In-Progress', s.name)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                      borderRadius: '12px', border: '1px solid var(--border-color)', 
                      background: 'var(--bg-tertiary)', cursor: 'pointer', transition: 'all 0.2s' 
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>{s.avatar}</div>
                    <div style={{ textAlign: 'left' }}>
                      <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{s.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.role}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button className="btn" onClick={() => setIsAssignModalOpen(false)} style={{ width: '100%', marginTop: '1.5rem', border: '1px solid var(--border-color)' }}>Cancel</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .table-row-hover:hover {
          background: rgba(0,0,0,0.02);
        }
      `}</style>
    </div>
  );
};

export default Complaints;
