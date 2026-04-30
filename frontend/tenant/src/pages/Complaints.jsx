import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', category: 'Maintenance', description: '' });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await API.get('/complaints/me');
      setComplaints(response.data);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRaiseComplaint = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await API.post('/complaints', formData);
      setComplaints([response.data, ...complaints]);
      setShowForm(false);
      setFormData({ title: '', category: 'Maintenance', description: '' });
      alert('Ticket raised successfully! Our team will look into it shortly.');
    } catch (err) {
      console.error('Error raising complaint:', err);
      alert('Failed to raise ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="complaints-page fade-in dashboard-container" style={{ position: 'relative', paddingBottom: '3rem' }}>
      {/* ── Close Button ── */}
      <Link to="/dashboard" style={{
        position: 'absolute', top: '10px', right: '10px', background: 'var(--bg-secondary)',
        width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-md)', transition: 'all 0.3s ease', zIndex: 100
      }} className="hover-scale">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </Link>

      {/* ── Header ── */}
      <header style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '2rem' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-1.5px', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            Service Requests
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>Track your maintenance tickets and raise new service requests.</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary" style={{ padding: '1.2rem 2.5rem', fontWeight: '900', borderRadius: '16px', boxShadow: '0 12px 24px rgba(14, 165, 233, 0.25)', fontSize: '1rem' }}>
          Raise New Ticket
        </button>
      </header>

      {/* ── Ticket List ── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading requests...</div>
      ) : complaints.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>No active requests found. Everything seems to be working perfectly! ✨</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
          {complaints.map(item => (
            <div key={item._id} className="glass-card complaint-item" style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              padding: '1.8rem 2.5rem', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              borderLeft: item.status === 'Resolved' ? '6px solid var(--accent-success)' : '6px solid var(--accent-warning)',
              borderRadius: '24px', position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <div style={{ 
                  width: '64px', height: '64px', background: item.status === 'Resolved' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)', 
                  borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.status === 'Resolved' ? 'var(--accent-success)' : 'var(--accent-warning)' 
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{item.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700' }}>{item.category}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <span style={{ 
                  padding: '0.6rem 1.4rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '900',
                  background: item.status === 'Resolved' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
                  color: item.status === 'Resolved' ? 'var(--accent-success)' : 'var(--accent-warning)',
                  display: 'inline-flex', alignItems: 'center', gap: '0.6rem'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></div>
                  {item.status}
                </span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}><polyline points="9 18 15 12 9 6"></polyline></svg>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── New Ticket Modal ── */}
      {showForm && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
          <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '600px', padding: '3.5rem', background: 'var(--bg-secondary)', borderRadius: '40px', border: '1px solid var(--accent-primary)', position: 'relative', boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6)' }}>
            <button onClick={() => setShowForm(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            
            <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent-primary)' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '950', letterSpacing: '-1.5px', margin: 0 }}>Raise New Ticket</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.8rem', fontSize: '1.1rem' }}>Describe the issue and our team will fix it ASAP.</p>
            </div>

            <form onSubmit={handleRaiseComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Issue Title</label>
                  <input 
                    type="text" placeholder="e.g. Broken Light Bulb" value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} required 
                    style={{ background: 'var(--bg-tertiary)', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', width: '100%', fontSize: '1rem', fontWeight: '700' }} 
                  />
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Category</label>
                  <select 
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                    style={{ background: 'var(--bg-tertiary)', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', width: '100%', fontSize: '1rem', fontWeight: '700' }}
                  >
                    <option value="Maintenance">Maintenance</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="WiFi / IT">WiFi / IT</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Description</label>
                <textarea 
                  rows="4" placeholder="Provide more details about the issue..." value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})} required 
                  style={{ background: 'var(--bg-tertiary)', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', width: '100%', fontSize: '1rem', fontWeight: '600', resize: 'none' }}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ padding: '1.5rem', fontWeight: '950', borderRadius: '20px', fontSize: '1.1rem', boxShadow: '0 15px 30px rgba(14, 165, 233, 0.25)', marginTop: '1rem' }}>
                {submitting ? '🚀 Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .complaint-item:hover { transform: translateX(12px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); border-color: var(--accent-primary) !important; }
      `}</style>
    </div>
  );
};

export default Complaints;
