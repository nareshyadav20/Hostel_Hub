import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const Services = () => {
  const [activeTab, setActiveTab] = useState('cleaning');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  // Room Cleaning State
  const [cleaningForm, setCleaningForm] = useState({ date: '', slot: 'Morning (10 AM - 12 PM)' });
  const [cleaningHistory, setCleaningHistory] = useState([]);

  // Visitor State
  const [visitorForm, setVisitorForm] = useState({ name: '', relation: '', arrival: '' });
  const [visitorHistory, setVisitorHistory] = useState([]);

  // Leave State
  const [leaveForm, setLeaveForm] = useState({ from: '', to: '', reason: '' });
  const [leaveHistory, setLeaveHistory] = useState([]);

  // Laundry State
  const [laundryItems, setLaundryItems] = useState({
    shirts: 0, tshirts: 0, pants: 0, shorts: 0, others: 0
  });
  const [laundryHistory, setLaundryHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, [activeTab]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      let endpoint = '';
      if (activeTab === 'cleaning') endpoint = '/services/cleaning/me';
      else if (activeTab === 'laundry') endpoint = '/services/laundry/me';
      else if (activeTab === 'visitor') endpoint = '/services/visitors/me';
      else if (activeTab === 'leave') endpoint = '/services/leaves/me';

      const response = await API.get(endpoint);
      if (activeTab === 'cleaning') setCleaningHistory(response.data);
      else if (activeTab === 'laundry') setLaundryHistory(response.data);
      else if (activeTab === 'visitor') setVisitorHistory(response.data);
      else if (activeTab === 'leave') setLeaveHistory(response.data);
    } catch (err) {
      console.error('Error fetching service history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCleaningSubmit = async (e) => {
    e.preventDefault();
    if (!cleaningForm.date) return alert('Please select a date.');
    setIsSubmitting(true);
    try {
      const response = await API.post('/services/cleaning', cleaningForm);
      setCleaningHistory([response.data, ...cleaningHistory]);
      alert('🧹 Room cleaning scheduled successfully!');
      setCleaningForm({ date: '', slot: 'Morning (10 AM - 12 PM)' });
    } catch (err) {
      alert('Failed to schedule cleaning.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVisitorSubmit = async (e) => {
    e.preventDefault();
    if (!visitorForm.name || !visitorForm.arrival) return alert('Please fill in all details.');
    setIsSubmitting(true);
    try {
      const response = await API.post('/services/visitors', {
        name: visitorForm.name,
        relation: visitorForm.relation,
        arrivalDate: visitorForm.arrival
      });
      setVisitorHistory([response.data, ...visitorHistory]);
      alert('🎫 Gate Pass generated successfully!');
      setVisitorForm({ name: '', relation: '', arrival: '' });
    } catch (err) {
      alert('Failed to generate gate pass.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    if (!leaveForm.from || !leaveForm.to || !leaveForm.reason) return alert('Please fill in all leave details.');
    setIsSubmitting(true);
    try {
      const response = await API.post('/services/leaves', {
        fromDate: leaveForm.from,
        toDate: leaveForm.to,
        reason: leaveForm.reason
      });
      setLeaveHistory([response.data, ...leaveHistory]);
      alert('✈️ Leave notice submitted to management.');
      setLeaveForm({ from: '', to: '', reason: '' });
    } catch (err) {
      alert('Failed to submit leave notice.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLaundrySubmit = async (e) => {
    e.preventDefault();
    const items = Object.entries(laundryItems)
      .filter(([_, count]) => count > 0)
      .map(([name, count]) => ({ name, count }));
    
    if (items.length === 0) return alert('Please add at least one item.');
    setIsSubmitting(true);
    try {
      const response = await API.post('/services/laundry', {
        items,
        pickupDate: new Date()
      });
      setLaundryHistory([response.data, ...laundryHistory]);
      alert(`👕 Laundry pickup scheduled!`);
      setLaundryItems({ shirts: 0, tshirts: 0, pants: 0, shorts: 0, others: 0 });
    } catch (err) {
      alert('Failed to schedule laundry pickup.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="services-page fade-in dashboard-container" style={{ position: 'relative', paddingBottom: '5rem' }}>
      <style>
        {`
          .glass-card-premium {
            backdrop-filter: blur(16px);
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 32px;
            box-shadow: var(--shadow-lg);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .service-tab-btn {
            padding: 1rem 2rem;
            border-radius: 18px;
            font-size: 0.95rem;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            border: 1px solid var(--border-color);
            background: var(--bg-secondary);
            color: var(--text-muted);
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .service-tab-btn.active {
            background: var(--accent-primary);
            color: white;
            border-color: var(--accent-primary);
            box-shadow: 0 8px 20px rgba(14, 165, 233, 0.2);
          }
          .input-premium {
            width: 100%;
            padding: 1.1rem;
            background: var(--bg-tertiary);
            border: 2px solid transparent;
            border-radius: 16px;
            color: var(--text-primary);
            font-weight: 600;
            transition: all 0.3s ease;
            outline: none;
          }
          .input-premium:focus {
            background: var(--bg-secondary);
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 4px rgba(var(--accent-primary-rgb), 0.1);
          }
          .history-item {
            padding: 1.5rem;
            background: var(--bg-secondary);
            border-radius: 20px;
            border: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
          }
          .history-item:hover {
            transform: translateX(10px);
            border-color: var(--accent-primary);
            box-shadow: 0 10px 20px rgba(0,0,0,0.05);
          }
          .status-badge {
            padding: 0.4rem 1rem;
            border-radius: 10px;
            font-size: 0.75rem;
            font-weight: 900;
            text-transform: uppercase;
          }
          .counter-btn {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            border: 1px solid var(--border-color);
            background: var(--bg-tertiary);
            color: var(--text-primary);
            font-weight: 900;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .counter-btn:hover { background: var(--bg-secondary); border-color: var(--accent-primary); }
          .spinner {
            width: 30px;
            height: 30px;
            border: 3px solid rgba(14, 165, 233, 0.1);
            border-top-color: var(--accent-primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}
      </style>

      <header style={{ marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '950', letterSpacing: '-1.5px', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          Housekeeping & Services
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: '500' }}>Manage your daily needs with high-speed automated service requests.</p>
      </header>

      <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '3.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'cleaning', label: 'Room Cleaning', icon: '🧹' },
          { id: 'laundry', label: 'Laundry', icon: '👕' },
          { id: 'visitor', label: 'Visitors', icon: '👤' },
          { id: 'leave', label: 'Leaves', icon: '✈️' }
        ].map(tab => (
          <button key={tab.id} className={`service-tab-btn ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
            <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }}>
        {/* ── Action Section ── */}
        <div className="glass-card-premium" style={{ padding: '3rem' }}>


          {activeTab === 'laundry' && (
            <form onSubmit={handleLaundrySubmit} className="fade-in">
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5"><path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 1.9l.58 14.25a2 2 0 0 0 2 1.92h14.28a2 2 0 0 0 2-1.92l.58-14.25a2 2 0 0 0-1.34-1.9z"></path></svg>
                Laundry Order
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {Object.entries(laundryItems).map(([item, count]) => (
                  <div key={item} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'var(--bg-primary)', borderRadius: '16px' }}>
                    <span style={{ fontWeight: '800', textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{item}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                      <button type="button" className="counter-btn" onClick={() => setLaundryItems({...laundryItems, [item]: Math.max(0, count - 1)})}>-</button>
                      <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: '900', fontSize: '1.1rem' }}>{count}</span>
                      <button type="button" className="counter-btn" onClick={() => setLaundryItems({...laundryItems, [item]: count + 1})}>+</button>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'var(--accent-primary)', borderRadius: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700' }}>Total Items Selected</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '950' }}>{Object.values(laundryItems).reduce((a, b) => a + b, 0)}</span>
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '1.2rem', fontWeight: '950', borderRadius: '18px', fontSize: '1.1rem' }}>
                  {isSubmitting ? '👕 Processing...' : 'Schedule Pickup'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'cleaning' && (
            <form onSubmit={handleCleaningSubmit} className="fade-in">
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                Schedule Cleaning
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Preferred Date</label>
                  <input type="date" className="input-premium" value={cleaningForm.date} onChange={e => setCleaningForm({...cleaningForm, date: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Time Slot</label>
                  <select className="input-premium" value={cleaningForm.slot} onChange={e => setCleaningForm({...cleaningForm, slot: e.target.value})}>
                    <option>Morning (10 AM - 12 PM)</option>
                    <option>Afternoon (2 PM - 4 PM)</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '1.2rem', fontWeight: '950', borderRadius: '18px', fontSize: '1.1rem', marginTop: '1rem' }}>
                  {isSubmitting ? '⌛ Processing...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'visitor' && (
            <form onSubmit={handleVisitorSubmit} className="fade-in">
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg>
                Visitor Access
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Visitor Name</label>
                  <input type="text" className="input-premium" placeholder="John Doe" value={visitorForm.name} onChange={e => setVisitorForm({...visitorForm, name: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Relation</label>
                  <input type="text" className="input-premium" placeholder="e.g. Parent" value={visitorForm.relation} onChange={e => setVisitorForm({...visitorForm, relation: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Expected Arrival</label>
                  <input type="datetime-local" className="input-premium" value={visitorForm.arrival} onChange={e => setVisitorForm({...visitorForm, arrival: e.target.value})} required />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '1.2rem', fontWeight: '950', borderRadius: '18px', fontSize: '1.1rem', marginTop: '1rem' }}>
                  {isSubmitting ? '🎫 Generating...' : 'Generate Gate Pass'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'leave' && (
            <form onSubmit={handleLeaveSubmit} className="fade-in">
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                Leave Notice
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem' }}>From</label>
                    <input type="date" className="input-premium" value={leaveForm.from} onChange={e => setLeaveForm({...leaveForm, from: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem' }}>To</label>
                    <input type="date" className="input-premium" value={leaveForm.to} onChange={e => setLeaveForm({...leaveForm, to: e.target.value})} required />
                  </div>
                </div>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Reason</label>
                  <textarea rows="4" className="input-premium" placeholder="Going home..." style={{ resize: 'none' }} value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} required></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ padding: '1.2rem', fontWeight: '950', borderRadius: '18px', fontSize: '1.1rem', marginTop: '1rem' }}>
                  {isSubmitting ? '⌛ Submitting...' : 'Submit Notice'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── History Section ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card-premium" style={{ padding: '2.5rem', flex: 1 }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Recent History
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {loadingHistory ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                  Loading history...
                </div>
              ) : (
                <>
                  {activeTab === 'laundry' && laundryHistory.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No laundry orders found.</p>}
                  {activeTab === 'cleaning' && cleaningHistory.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No cleaning history found.</p>}
                  {activeTab === 'visitor' && visitorHistory.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No visitor records found.</p>}
                  {activeTab === 'leave' && leaveHistory.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>No leave notices found.</p>}

                  {activeTab === 'laundry' && laundryHistory.map(item => (
                    <div key={item._id} className="history-item">
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>Order {item.orderNumber}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                          {new Date(item.pickupDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {item.items?.reduce((acc, curr) => acc + curr.count, 0) || 0} items
                        </p>
                      </div>
                      <span className="status-badge" style={{ 
                        background: item.status === 'Delivered' ? '#10b98115' : '#f59e0b15', 
                        color: item.status === 'Delivered' ? '#10b981' : '#f59e0b' 
                      }}>{item.status}</span>
                    </div>
                  ))}

                  {activeTab === 'cleaning' && cleaningHistory.map(item => (
                    <div key={item._id} className="history-item">
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>Room Cleaning</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                          {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {item.slot}
                        </p>
                      </div>
                      <span className="status-badge" style={{ background: item.status === 'Completed' ? '#10b98115' : '#3b82f615', color: item.status === 'Completed' ? '#10b981' : '#3b82f6' }}>{item.status}</span>
                    </div>
                  ))}

                  {activeTab === 'visitor' && visitorHistory.map(item => (
                    <div key={item._id} className="history-item">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--accent-primary)' }}>{item.name ? item.name[0] : 'V'}</div>
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>{item.name}</h4>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                            {item.relation} • {new Date(item.arrivalDate).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <span className="status-badge" style={{ background: '#10b98115', color: '#10b981' }}>{item.status}</span>
                    </div>
                  ))}

                  {activeTab === 'leave' && leaveHistory.map(item => (
                    <div key={item._id} className="history-item">
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>{item.reason}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                          {new Date(item.fromDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} to {new Date(item.toDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                      <span className="status-badge" style={{ background: '#f59e0b15', color: '#f59e0b' }}>{item.status}</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Services;
