import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, CheckCircle, Clock, AlertTriangle, CheckCircle2, MessageSquare, Zap, Activity, Droplets } from 'lucide-react';
import API from '../api/axios';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    try {
      const response = await API.get('/complaints'); // Admin route or general route
      setComplaints(response.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useState(() => {
    fetchComplaints();
  }, []);

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
       default: return null;
    }
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'Resolved': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)' }}><CheckCircle2 size={12}/> RESOLVED</span>;
      case 'In-Progress': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-primary)' }}><Activity size={12}/> IN PROGRESS</span>;
      case 'Pending': return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)' }}><Clock size={12}/> PENDING</span>;
      default: return null;
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Plumbing': return <Droplets size={16} color="var(--accent-primary)" />;
      case 'Electrical': return <Zap size={16} color="var(--accent-warning)" />;
      case 'Internet': return <Activity size={16} color="var(--accent-success)" />;
      default: return <Wrench size={16} color="var(--text-secondary)" />;
    }
  };

  const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '100%' };

  return (
    <div className="complaints-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={32} color="var(--accent-primary)" /> Complaint Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Track, prioritize, and resolve maintenance issues reported by tenants.</p>
        </div>
        <button onClick={() => setIsBroadcastModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <MessageSquare size={16} /> Broadcast Update
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--text-primary)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Total Open</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800' }}>{totalComplaints}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-warning)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>Pending Assignment</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--accent-warning)' }}>{pendingCount}</h2>
        </div>
        <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', marginBottom: '0.5rem' }}>In Progress</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--accent-primary)' }}>{inProgressCount}</h2>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '1.2rem' }}>Ticket Info</th>
              <th style={{ padding: '1.2rem' }}>Issue Description</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {complaints.map((c, index) => (
                <React.Fragment key={c._id}>
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setExpandedId(expandedId === c._id ? null : c._id)}
                    style={{ borderBottom: '1px solid var(--border-color)', background: c.status === 'Resolved' ? 'var(--bg-tertiary)' : 'transparent', opacity: c.status === 'Resolved' ? 0.7 : 1, cursor: 'pointer' }}
                    className="table-row-hover"
                  >
                    <td style={{ padding: '1.2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>{c.tenant?.room || 'N/A'}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ticket #{index + 1001} • {new Date(c.createdAt).toLocaleDateString()}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                          By: <span style={{ fontWeight: '600' }}>{c.tenant?.name || 'Unknown'}</span>
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <span style={{ padding: '0.3rem', background: 'var(--bg-tertiary)', borderRadius: '6px' }}>
                            {getCategoryIcon(c.category)}
                          </span>
                          <span style={{ fontWeight: '600' }}>{c.title}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                          {getUrgencyBadge(c.priority || 'Medium')}
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.category}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.2rem' }}>
                      {getStatusDisplay(c.status)}
                    </td>
                    <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          {c.status === 'Pending' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedComplaintId(c._id); setIsAssignModalOpen(true); }}
                              className="btn btn-primary" 
                              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                            >
                              Assign Task
                            </button>
                          )}
                          {c.status === 'In Progress' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleStatusChange(c._id, 'Resolved'); }}
                              className="btn" 
                              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', border: '1px solid var(--accent-success)' }}
                            >
                              <CheckCircle2 size={14} style={{ marginRight: '0.4rem' }}/> Mark Resolved
                            </button>
                          )}
                          {c.status === 'Resolved' && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleArchive(c._id); }}
                              className="btn" 
                              style={{ padding: '0.5rem', fontSize: '0.8rem', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                            >
                              Archive
                            </button>
                          )}
                      </div>
                    </td>
                  </motion.tr>
                  {expandedId === c._id && (
                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--bg-tertiary)' }}>
                      <td colSpan="4" style={{ padding: '1.5rem 2.5rem' }}>
                        <div style={{ borderLeft: '4px solid var(--accent-primary)', paddingLeft: '1.5rem' }}>
                          <p style={{ fontWeight: '700', color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Issue Details</p>
                          <p style={{ fontSize: '1rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>{c.description}</p>
                          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '2rem' }}>
                             <div>
                               <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>REPORTED BY</p>
                               <p style={{ fontWeight: '600' }}>{c.tenant?.name || 'Unknown'} (Room {c.tenant?.room || 'N/A'})</p>
                             </div>
                            <div>
                               <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700' }}>CATEGORY</p>
                               <p style={{ fontWeight: '600' }}>{c.category}</p>
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
