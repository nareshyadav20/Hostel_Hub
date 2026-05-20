import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import './Community.css';

const Community = () => {
  const [activeTab, setActiveTab] = useState('notice');
  const [showReportModal, setShowReportModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({ title: '', type: 'Lost', location: '', description: '' });
  const [lostPage, setLostPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await API.get('/tenant-portal/community-reports').catch(() => ({ data: [
          { _id: '1', title: 'Car Keys', type: 'Lost', location: 'Parking Area', createdAt: new Date().toISOString(), description: 'Black keychain with 2 keys.' },
          { _id: '2', title: 'Blue Water Bottle', type: 'Found', location: 'Gym', createdAt: new Date().toISOString(), description: 'Milton bottle found near treadmill.' }
        ]}));
        setItems(res.data || []);
      } catch (err) { 
        console.error('Error fetching items:', err); 
      }
    };
    fetchItems();
  }, []);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await API.post('/tenant-portal/community-reports', formData);
      setItems([res.data, ...items]);
      setShowReportModal(false);
      setFormData({ title: '', type: 'Lost', location: '', description: '' });
      alert('Report posted successfully!');
    } catch (err) { 
      console.error('Error reporting item:', err); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const tabs = [
    { id: 'notice', label: 'Notices', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> },
    { id: 'events', label: 'Events', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
    { id: 'market', label: 'Market', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> },
    { id: 'lost', label: 'Lost & Found', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg> }
  ];

  return (
    <div className="community-page">
      <header className="community-header">
        <div className="header-icon-main">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div>
          <h1>Community Hub</h1>
          <p className="header-subtitle">Connect with fellow residents, trade items, and stay updated.</p>
        </div>
      </header>

      <div className="community-nav">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            className={`community-nav-item ${activeTab === tab.id ? 'active' : ''}`} 
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="community-main-section">
        {activeTab === 'notice' && (
          <div className="notices-container fade-in">
            <h3 className="section-title">Latest Announcements</h3>
            <div className="notice-list">
              <div className="notice-card warning">
                <div className="notice-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <div className="notice-text">
                  <h4>Water Maintenance Notice</h4>
                  <p>Supply will be temporarily suspended today from 2 PM to 4 PM for pipe repairs in Block B.</p>
                  <span className="notice-time">Posted 2h ago</span>
                </div>
              </div>
              <div className="notice-card info">
                <div className="notice-icon-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <div className="notice-text">
                  <h4>Pizza Night this Friday!</h4>
                  <p>Join the community at the terrace for a fun-filled evening with free pizza and music.</p>
                  <span className="notice-time">Posted yesterday</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-container fade-in">
            <h3 className="section-title">Upcoming Events</h3>
            <div className="events-grid">
              <div className="event-card-premium">
                <div className="event-banner" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <path d="M6 12h12M6 8h12M6 16h12"></path>
                  </svg>
                </div>
                <div className="event-details">
                  <span className="event-tag">Tournament</span>
                  <h4>Gaming Night: FIFA 25</h4>
                  <div className="event-meta">
                    <span>Friday, 8:00 PM</span>
                    <span>Common Area</span>
                  </div>
                  <button className="btn-primary-small">Register Now</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="market-container fade-in">
            <h3 className="section-title">Resident Marketplace</h3>
            <div className="market-grid">
              <div className="market-card-premium">
                <div className="item-preview">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle>
                  </svg>
                </div>
                <div className="item-info">
                  <h4>DSLR Camera - Canon</h4>
                  <p className="item-price">₹15,000</p>
                  <button className="btn-secondary-small">Chat with Seller</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lost' && (
          <div className="lost-found-container fade-in">
            <div className="section-header-flex">
              <h3 className="section-title">Lost & Found Registry</h3>
              <button className="btn-primary" onClick={() => setShowReportModal(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                Post New Report
              </button>
            </div>
            
            <div className="lost-found-table-card">
              <div className="table-wrapper">
                <table className="lost-found-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Item Details</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.slice((lostPage - 1) * ITEMS_PER_PAGE, lostPage * ITEMS_PER_PAGE).map(item => (
                      <tr key={item._id} className={item.type.toLowerCase()}>
                        <td className="td-date">{new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                        <td className="td-item">
                          <div className="item-main">
                            <span className="item-title">{item.title}</span>
                            <span className="item-desc">{item.description}</span>
                          </div>
                        </td>
                        <td className="td-location">{item.location}</td>
                        <td>
                          <span className={`type-pill ${item.type.toLowerCase()}`}>{item.type}</span>
                        </td>
                        <td>
                          <button className="btn-table-action">Contact</button>
                        </td>
                      </tr>
                    ))}
                    {items.length === 0 && (
                      <tr><td colSpan="5" className="td-empty">No reports yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {Math.ceil(items.length / ITEMS_PER_PAGE) > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '600' }}>
                    Showing {(lostPage - 1) * ITEMS_PER_PAGE + 1}&ndash;{Math.min(lostPage * ITEMS_PER_PAGE, items.length)} of {items.length} entries
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button onClick={() => setLostPage(p => p - 1)} disabled={lostPage === 1} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: lostPage === 1 ? '#F8FAFC' : '#fff', color: lostPage === 1 ? '#CBD5E1' : '#475569', fontWeight: '600', cursor: lostPage === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
                    {[...Array(Math.ceil(items.length / ITEMS_PER_PAGE))].map((_, i) => (
                      <button key={i+1} onClick={() => setLostPage(i+1)} style={{ width: '36px', height: '36px', borderRadius: '8px', border: lostPage === i+1 ? 'none' : '1px solid #E2E8F0', background: lostPage === i+1 ? 'var(--accent-primary)' : '#fff', color: lostPage === i+1 ? '#fff' : '#475569', fontWeight: '700', cursor: 'pointer' }}>{i+1}</button>
                    ))}
                    <button onClick={() => setLostPage(p => p + 1)} disabled={lostPage === Math.ceil(items.length / ITEMS_PER_PAGE)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: lostPage === Math.ceil(items.length / ITEMS_PER_PAGE) ? '#F8FAFC' : '#fff', color: lostPage === Math.ceil(items.length / ITEMS_PER_PAGE) ? '#CBD5E1' : '#475569', fontWeight: '600', cursor: lostPage === Math.ceil(items.length / ITEMS_PER_PAGE) ? 'not-allowed' : 'pointer' }}>Next</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {showReportModal && (
        <div className="modal-overlay">
          <div className="modal-content-premium">
            <div className="modal-header-pro">
              <div className="modal-title-group">
                <div className="modal-icon-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <div>
                  <h3>Post Community Report</h3>
                  <p>Help your fellow residents find their belongings.</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowReportModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleReportSubmit} className="premium-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Item Name</label>
                  <input type="text" placeholder="e.g. Blue Wallet, Room Key" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Report Type</label>
                  <div className="select-wrapper">
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                      <option value="Lost">Lost Item</option>
                      <option value="Found">Found Item</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label>Last Seen Location</label>
                <input type="text" placeholder="e.g. Mess Hall, Block C Terrace" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
              </div>
              <div className="input-group">
                <label>Item Description</label>
                <textarea rows="3" placeholder="Provide details like color, brand, or unique marks..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
              </div>
              <button type="submit" className="btn-primary btn-large" disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
