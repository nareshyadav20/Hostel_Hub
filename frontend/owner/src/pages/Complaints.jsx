import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, CheckCircle, Clock, AlertTriangle, CheckCircle2, MessageSquare, Zap, Activity, Droplets } from 'lucide-react';

const Complaints = () => {
  const [complaints, setComplaints] = useState([
    { id: 1, room: '201-A', issue: 'Water Leakage in Bathroom', category: 'Plumbing', urgency: 'High', status: 'Pending', reportedBy: 'Rahul Sharma', timeElapsed: '2 hours ago' },
    { id: 2, room: '202-B', issue: 'AC Not Cooling properly', category: 'Electrical', urgency: 'Medium', status: 'In-Progress', reportedBy: 'Priya Verma', timeElapsed: '1 day ago' },
    { id: 3, room: '101-A', issue: 'WiFi Connection dropping', category: 'Internet', urgency: 'Low', status: 'Resolved', reportedBy: 'Amit Singh', timeElapsed: '3 days ago' },
    { id: 4, room: '305-C', issue: 'Deep Cleaning Required', category: 'Cleaning', urgency: 'Medium', status: 'Pending', reportedBy: 'Sneha Kapur', timeElapsed: '4 hours ago' },
  ]);

  const [expandedId, setExpandedId] = useState(null);

  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In-Progress').length;
  
  const handleStatusChange = (id, newStatus) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: newStatus } : c));
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

  return (
    <div className="complaints-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={32} color="var(--accent-primary)" /> Complaint Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Track, prioritize, and resolve maintenance issues reported by tenants.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
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
              {complaints.map(c => (
                <motion.tr 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  key={c.id} 
                  style={{ borderBottom: '1px solid var(--border-color)', background: c.status === 'Resolved' ? 'var(--bg-tertiary)' : 'transparent', opacity: c.status === 'Resolved' ? 0.7 : 1 }}
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
                        {c.status === 'Pending' && (
                          <button 
                            onClick={() => handleStatusChange(c.id, 'In-Progress')}
                            className="btn btn-primary" 
                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                          >
                            Assign Task
                          </button>
                        )}
                        {c.status === 'In-Progress' && (
                          <button 
                            onClick={() => handleStatusChange(c.id, 'Resolved')}
                            className="btn" 
                            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', border: '1px solid var(--accent-success)' }}
                          >
                            <CheckCircle2 size={14} style={{ marginRight: '0.4rem' }}/> Mark Resolved
                          </button>
                        )}
                        {c.status === 'Resolved' && (
                          <button 
                            className="btn" 
                            style={{ padding: '0.5rem', fontSize: '0.8rem', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
                          >
                            Archive
                          </button>
                        )}
                     </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      <style>{`
        .table-row-hover:hover {
          background: rgba(0,0,0,0.02);
        }
      `}</style>
    </div>
  );
};

export default Complaints;
