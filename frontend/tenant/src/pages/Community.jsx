import React, { useState } from 'react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('notice');
  const [showReportModal, setShowReportModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState([
    { id: 1, title: 'Black Wallet', type: 'Found', location: 'Near gym entrance', description: 'Handed over to the warden.', date: 'Today, 10 AM', color: '#f59e0b' }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    type: 'Lost',
    location: '',
    description: ''
  });

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newItem = {
        id: items.length + 1,
        title: formData.title,
        type: formData.type,
        location: formData.location,
        description: formData.description,
        date: 'Just now',
        color: formData.type === 'Lost' ? '#f43f5e' : '#f59e0b'
      };

      setItems([newItem, ...items]);
      setIsSubmitting(false);
      setShowReportModal(false);
      setFormData({ title: '', type: 'Lost', location: '', description: '' });
      alert('Item reported successfully! The community has been notified.');
    }, 1500);
  };

  return (
    <div className="community-page fade-in dashboard-container" style={{ position: 'relative' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Community Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Connect with your hostel family, find roommates, and stay engaged with events.</p>
      </header>

      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2.5rem', flexWrap: 'wrap', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', width: 'fit-content', border: '1px solid var(--border-color)' }}>
        {[
          { id: 'notice', label: 'Notice Board', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg> },
          { id: 'events', label: 'Events', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
          { id: 'roommate', label: 'Roommates', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
          { id: 'buysell', label: 'Marketplace', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg> },
          { id: 'lostfound', label: 'Lost & Found', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> }
        ].map(tab => (
          <button 
            key={tab.id}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : ''}`} 
            onClick={() => setActiveTab(tab.id)}
            style={{ 
              padding: '0.8rem 1.5rem', 
              borderRadius: '12px', 
              fontSize: '0.9rem', 
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
              border: 'none',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', minHeight: '500px' }}>
        {activeTab === 'notice' && (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Critical Updates
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ padding: '1.5rem', background: 'rgba(244, 63, 94, 0.05)', borderLeft: '4px solid var(--accent-error)', borderRadius: '16px', position: 'relative' }}>
                <h4 style={{ color: 'var(--accent-error)', fontSize: '1.1rem', fontWeight: '800' }}>Water Supply Interruption</h4>
                <p style={{ fontSize: '0.95rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>Scheduled maintenance on main tank today from 2 PM to 4 PM.</p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: 'var(--text-muted)', fontWeight: '600' }}>High Priority</small>
                  <small style={{ color: 'var(--text-muted)' }}>2 hours ago</small>
                </div>
              </div>
              <div style={{ padding: '1.5rem', background: 'rgba(14, 165, 233, 0.05)', borderLeft: '4px solid var(--accent-primary)', borderRadius: '16px' }}>
                <h4 style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', fontWeight: '800' }}>Rent Cycle Reminder</h4>
                <p style={{ fontSize: '0.95rem', marginTop: '0.5rem', color: 'var(--text-primary)' }}>Kindly clear all dues by tomorrow to enjoy uninterrupted services.</p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <small style={{ color: 'var(--text-muted)', fontWeight: '600' }}>General Notice</small>
                  <small style={{ color: 'var(--text-muted)' }}>Yesterday</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '2rem' }}>Upcoming Activities</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '20px' }}>
                <div style={{ width: '100%', height: '140px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><path d="M12 12h.01"></path><path d="M17 12h.01"></path><path d="M7 12h.01"></path></svg>
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800' }}>FIFA Weekend</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.8rem 0 1.5rem' }}>Tournament in the common lounge area. Open for all!</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)' }}>Sat, 6:00 PM</span>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Join</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'roommate' && (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '2rem' }}>Potential Connections</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '60px', height: '60px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '900', color: 'var(--accent-primary)', border: '2px solid var(--accent-primary)' }}>RS</div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Rahul Sharma</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Working Professional • Early Bird • Non-Veg</p>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>Say Hello</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'buysell' && (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '2rem' }}>Hostel Marketplace</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '20px' }}>
                <div style={{ width: '100%', height: '120px', background: 'var(--bg-tertiary)', borderRadius: '12px', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Study Table</h4>
                <p style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--accent-primary)', margin: '0.5rem 0' }}>₹800</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Condition: Like new. Moving out next month.</p>
                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem', fontWeight: '700' }}>Contact Seller</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lostfound' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Lost & Found</h3>
              <button onClick={() => setShowReportModal(true)} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontWeight: '800', borderRadius: '14px', boxShadow: '0 8px 16px rgba(14, 165, 233, 0.2)' }}>+ Report Item</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {items.map(item => (
                <div key={item.id} className="glass-card fade-in" style={{ padding: '1.8rem', background: `${item.color}05`, borderLeft: `6px solid ${item.color}`, borderRadius: '20px', transition: 'all 0.3s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <span style={{ padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '900', background: `${item.color}15`, color: item.color, textTransform: 'uppercase' }}>{item.type}</span>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{item.title}</h4>
                      </div>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '500' }}>{item.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          {item.location}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          {item.date}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Report Item Modal ── */}
      {showReportModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', padding: '1rem' }}>
          <div className="glass-card fade-in" style={{ width: '100%', maxWidth: '600px', padding: '3rem', background: 'var(--bg-secondary)', borderRadius: '32px', border: '1px solid var(--accent-primary)', position: 'relative', boxShadow: '0 40px 100px rgba(0,0,0,0.5)' }}>
            <button onClick={() => setShowReportModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ width: '70px', height: '70px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', color: 'var(--accent-primary)' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: '950', letterSpacing: '-1px' }}>Report Item</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontWeight: '500' }}>Help others find their belongings or find yours.</p>
            </div>

            <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.2rem' }}>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Item Name</label>
                  <input 
                    type="text" placeholder="e.g. Blue Umbrella" 
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required 
                    style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', width: '100%', fontSize: '0.95rem', fontWeight: '700', outline: 'none' }}
                  />
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Type</label>
                  <select 
                    value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                    style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', width: '100%', fontSize: '0.95rem', fontWeight: '700', outline: 'none' }}
                  >
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Location Lost/Found</label>
                <input 
                  type="text" placeholder="e.g. Dining Hall, Table 4" 
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required 
                  style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', width: '100%', fontSize: '0.95rem', fontWeight: '700', outline: 'none' }}
                />
              </div>

              <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Description</label>
                <textarea 
                  rows="3" placeholder="Provide color, brand, or any distinguishing features..." 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required 
                  style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '14px', border: '1px solid var(--border-color)', color: 'var(--text-primary)', width: '100%', fontSize: '0.95rem', fontWeight: '600', resize: 'none', outline: 'none' }}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '1.2rem', fontWeight: '950', borderRadius: '16px', fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.3)', marginTop: '1rem' }}>
                {isSubmitting ? '📢 Notifying Community...' : 'Post Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
