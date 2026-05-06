import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import './Services.css';

const Services = () => {
  const [activeTab, setActiveTab] = useState('cleaning');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  
  const [cleaningHistory, setCleaningHistory] = useState([]);
  const [laundryHistory, setLaundryHistory] = useState([]);
  const [visitorHistory, setVisitorHistory] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);

  const [cleaningForm, setCleaningForm] = useState({ date: '', slot: 'Morning (10 AM - 12 PM)' });
  const [visitorForm, setVisitorForm] = useState({ name: '', relation: '', arrival: '' });
  const [leaveForm, setLeaveForm] = useState({ from: '', to: '', reason: '' });
  const [laundryItems, setLaundryItems] = useState({ shirts: 0, tshirts: 0, pants: 0, shorts: 0 });

  const tabs = [
    { 
      id: 'cleaning', 
      label: 'Room Cleaning', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3v19M5 8h14M15 21l-3-3-3 3"/>
        </svg>
      ) 
    },
    { 
      id: 'laundry', 
      label: 'Laundry', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.62 1.96V10a2 2 0 002 2h16a2 2 0 002-2V5.42a2 2 0 00-1.62-1.96zM12 22a7 7 0 100-14 7 7 0 000 14z"/>
        </svg>
      ) 
    },
    { 
      id: 'visitor', 
      label: 'Visitor Pass', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      ) 
    },
    { 
      id: 'leave', 
      label: 'Leave Notice', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
      ) 
    }
  ];

  useEffect(() => { fetchHistory(); }, [activeTab]);

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
      console.error('Error fetching history:', err); 
    } finally { 
      setLoadingHistory(false); 
    }
  };

  const handleAction = async (e, type) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let payload = {};
      let endpoint = '';
      if (type === 'cleaning') { payload = cleaningForm; endpoint = '/services/cleaning'; }
      else if (type === 'visitor') { payload = { name: visitorForm.name, relation: visitorForm.relation, arrivalDate: visitorForm.arrival }; endpoint = '/services/visitors'; }
      else if (type === 'leave') { payload = { fromDate: leaveForm.from, toDate: leaveForm.to, reason: leaveForm.reason }; endpoint = '/services/leaves'; }
      else if (type === 'laundry') { 
        const items = Object.entries(laundryItems).filter(([_, c]) => c > 0).map(([n, c]) => ({ name: n, count: c }));
        payload = { items, pickupDate: new Date() }; endpoint = '/services/laundry'; 
      }
      await API.post(endpoint, payload);
      alert('Request submitted successfully!');
      fetchHistory();
    } catch (err) { 
      alert('Submission failed. Please try again.'); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  return (
    <div className="services-page">
      <header className="services-header">
        <h1>Housekeeping & Services</h1>
        <p className="header-subtitle">Automate your daily needs with specialized resident services.</p>
      </header>

      <div className="service-navigation">
        {tabs.map(tab => (
          <button 
            key={tab.id} 
            className={`service-nav-item ${activeTab === tab.id ? 'active' : ''}`} 
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="services-grid">
        {/* Action Card */}
        <div className="sn-card service-form-card">
          {activeTab === 'cleaning' && (
            <form onSubmit={e => handleAction(e, 'cleaning')} className="service-form">
              <h3 className="sn-card-title">Schedule Room Cleaning</h3>
              <div className="form-body">
                <div className="input-group">
                  <label>Preferred Date</label>
                  <input type="date" value={cleaningForm.date} onChange={e => setCleaningForm({...cleaningForm, date: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Preferred Time Slot</label>
                  <select value={cleaningForm.slot} onChange={e => setCleaningForm({...cleaningForm, slot: e.target.value})}>
                    <option>Morning (10 AM - 12 PM)</option>
                    <option>Afternoon (2 PM - 4 PM)</option>
                    <option>Evening (5 PM - 7 PM)</option>
                  </select>
                </div>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Requesting...' : 'Request Cleaning'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'laundry' && (
            <form onSubmit={e => handleAction(e, 'laundry')} className="service-form">
              <h3 className="sn-card-title">Laundry Pickup Service</h3>
              <p className="sn-label" style={{ marginBottom: '1.5rem' }}>Select the number of items for pickup.</p>
              <div className="laundry-counter-grid">
                {Object.entries(laundryItems).map(([item, count]) => (
                  <div key={item} className="laundry-counter-row">
                    <span className="item-name">{item}</span>
                    <div className="counter-controls">
                      <button type="button" onClick={() => setLaundryItems({...laundryItems, [item]: Math.max(0, count - 1)})}>-</button>
                      <span className="count-value">{count}</span>
                      <button type="button" onClick={() => setLaundryItems({...laundryItems, [item]: count + 1})}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '2rem' }} disabled={isSubmitting}>
                {isSubmitting ? 'Scheduling...' : 'Schedule Pickup'}
              </button>
            </form>
          )}

          {activeTab === 'visitor' && (
            <form onSubmit={e => handleAction(e, 'visitor')} className="service-form">
              <h3 className="sn-card-title">Request Visitor Pass</h3>
              <div className="form-body">
                <div className="input-group">
                  <label>Visitor Full Name</label>
                  <input type="text" placeholder="Enter guest name" value={visitorForm.name} onChange={e => setVisitorForm({...visitorForm, name: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Relationship</label>
                  <input type="text" placeholder="e.g. Parent, Friend" value={visitorForm.relation} onChange={e => setVisitorForm({...visitorForm, relation: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label>Expected Arrival</label>
                  <input type="datetime-local" value={visitorForm.arrival} onChange={e => setVisitorForm({...visitorForm, arrival: e.target.value})} required />
                </div>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>Generate Digital Pass</button>
              </div>
            </form>
          )}

          {activeTab === 'leave' && (
            <form onSubmit={e => handleAction(e, 'leave')} className="service-form">
              <h3 className="sn-card-title">Leave Request Notice</h3>
              <div className="form-body">
                <div className="form-row">
                  <div className="input-group">
                    <label>From Date</label>
                    <input type="date" value={leaveForm.from} onChange={e => setLeaveForm({...leaveForm, from: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>To Date</label>
                    <input type="date" value={leaveForm.to} onChange={e => setLeaveForm({...leaveForm, to: e.target.value})} required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Reason for Leave</label>
                  <textarea rows="3" placeholder="Please specify reason..." value={leaveForm.reason} onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})} required></textarea>
                </div>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>Submit Leave Notice</button>
              </div>
            </form>
          )}
        </div>

        {/* History Card */}
        <div className="sn-card service-history-card">
          <h3 className="sn-card-title">Recent Service History</h3>
          <div className="history-timeline">
             {loadingHistory ? (
               <div className="mini-loader">Loading records...</div>
             ) : (
               <>
                 {activeTab === 'cleaning' && cleaningHistory.length > 0 ? cleaningHistory.map(h => (
                   <div key={h._id} className="timeline-item">
                     <div className="timeline-main">
                        <span className="timeline-date">{new Date(h.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                        <span className="timeline-info">{h.slot}</span>
                     </div>
                     <span className={`status-tag ${h.status.toLowerCase()}`}>{h.status}</span>
                   </div>
                 )) : activeTab === 'cleaning' && <div className="empty-history">No cleaning requests found.</div>}

                 {activeTab === 'laundry' && laundryHistory.length > 0 ? laundryHistory.map(h => (
                   <div key={h._id} className="timeline-item">
                     <div className="timeline-main">
                        <span className="timeline-date">Order #{h.orderNumber || h._id.slice(-6).toUpperCase()}</span>
                        <span className="timeline-info">{h.items?.length || 0} items for pickup</span>
                     </div>
                     <span className={`status-tag ${h.status.toLowerCase()}`}>{h.status}</span>
                   </div>
                 )) : activeTab === 'laundry' && <div className="empty-history">No laundry orders found.</div>}

                 {(activeTab === 'visitor' || activeTab === 'leave') && <div className="empty-history">Records will appear here once submitted.</div>}
               </>
             )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default Services;
