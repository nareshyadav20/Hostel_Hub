import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, CheckCircle, Clock, AlertTriangle, CheckCircle2, MessageSquare, Zap, Activity, Droplets } from 'lucide-react';
import { api } from '../mockData';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Maintenance');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const data = await api.getComplaints();
      const formatted = data.map(c => {
        // Calculate time elapsed
        const diffHours = Math.floor((new Date() - new Date(c.createdAt)) / (1000 * 60 * 60));
        const timeElapsed = diffHours < 24 ? `${diffHours} hours ago` : `${Math.floor(diffHours/24)} days ago`;
        
        return {
          id: c._id || c.id,
          room: c.tenant?.room || 'Unknown',
          issue: c.title,
          category: c.category,
          urgency: ['Leave', 'Visitor'].includes(c.category) ? 'Normal' : (c.category === 'Electrical' || c.category === 'Plumbing' ? 'High' : 'Medium'),
          status: c.status === 'In Progress' ? 'In-Progress' : c.status,
          reportedBy: c.tenant?.name || 'Unknown User',
          timeElapsed,
          description: c.description
        };
      });
      setComplaints(formatted);
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
    } finally {
      setLoading(false);
    }
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
  
  const handleStatusChange = (id, newStatus, assignedTo = null) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus, assignedTo } : c));
    setIsAssignModalOpen(false);
  };

  const handleArchive = (id) => {
    if (window.confirm('Archive this complaint?')) {
      setComplaints(complaints.filter(c => c.id !== id));
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
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={32} color="var(--accent-primary)" /> Service Requests Hub
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Manage maintenance tickets, leave applications, and visitor permissions.</p>
        </div>
        <button onClick={() => setIsBroadcastModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <MessageSquare size={16} /> Broadcast Update
        </button>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--text-primary)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Total {activeTab}</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800' }}>{totalComplaints}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-warning)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Pending {activeTab === 'Maintenance' ? 'Tickets' : 'Requests'}</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--accent-warning)' }}>{pendingCount}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-success)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>{activeTab === 'Maintenance' ? 'Resolved' : 'Approved'}</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--accent-success)' }}>{resolvedCount}</h2>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
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
              {filteredComplaints.map(c => (
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
                        <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>Room {c.room}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ticket #{1000 + c.id} • {c.timeElapsed}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                          By: <span style={{ fontWeight: '600' }}>{c.reportedBy}</span>
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
                          {getUrgencyBadge(c.urgency)}
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.category}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      {getStatusDisplay(c.status)}
                    </td>
                    <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {c.status === 'Pending' && activeTab === 'Maintenance' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedComplaintId(c.id); setIsAssignModalOpen(true); }}
                              className="btn btn-primary" 
                              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                            >
                              Assign Task
                            </button>
                          )}
                          {c.status === 'Pending' && activeTab !== 'Maintenance' && (
                            <>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(c.id, 'Resolved'); }}
                                className="btn btn-primary" 
                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'var(--accent-success)', borderColor: 'var(--accent-success)' }}
                              >
                                Approve
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(c.id, 'Rejected'); }}
                                className="btn" 
                                style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', border: '1px solid var(--accent-error)', color: 'var(--accent-error)' }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {c.status === 'In-Progress' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(c.id, 'Resolved'); }}
                              className="btn" 
                              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', border: '1px solid var(--accent-success)' }}
                            >
                              <CheckCircle2 size={14} style={{ marginRight: '0.4rem' }}/> Mark Resolved
                            </button>
                          )}
                          {(c.status === 'Resolved' || c.status === 'Rejected') && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleArchive(c.id); }}
                              className="btn" 
                              style={{ padding: '0.5rem', fontSize: '0.8rem', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                            >
                              Archive
                            </button>
                          )}
                      </div>
                    </td>
                  </motion.tr>
                  {expandedId === c.id && (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--bg-tertiary)' }}>
                      <td colSpan="4" style={{ padding: '1.5rem 2.5rem' }}>
                        <div style={{ borderLeft: '4px solid var(--accent-primary)', paddingLeft: '1.5rem' }}>
                          <p style={{ fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Issue Details</p>
                          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>{c.description}</p>
                          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem' }}>
                             <div>
                               <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>REPORTED BY</p>
                               <p style={{ fontWeight: '600' }}>{c.reportedBy} (Room {c.room})</p>
                             </div>
                           <div>
                               <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>URGENCY LEVEL</p>
                               <p style={{ fontWeight: '600' }}>{c.urgency}</p>
                             </div>
                             {c.assignedTo && (
                               <div>
                                 <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>ASSIGNED TO</p>
                                 <p style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{c.assignedTo}</p>
                               </div>
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
