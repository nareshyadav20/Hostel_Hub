import React, { useState } from 'react';

const Services = () => {
  const [activeTab, setActiveTab] = useState('laundry');

  return (
    <div className="services-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🛎️ Housekeeping & Services</h1>
        <p>Manage your laundry, cleaning requests, visitors, and leaves.</p>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={`btn ${activeTab === 'laundry' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('laundry')}>Laundry</button>
        <button className={`btn ${activeTab === 'cleaning' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('cleaning')}>Room Cleaning</button>
        <button className={`btn ${activeTab === 'visitor' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('visitor')}>Visitor Request</button>
        <button className={`btn ${activeTab === 'leave' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('leave')}>Leave Notice</button>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {activeTab === 'laundry' && (
          <div>
            <h3>🧺 Laundry Tracking</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Track your laundry status in real-time.</p>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)', padding: '2rem', borderRadius: '12px' }}>
              <div style={{ textAlign: 'center', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                Requested
              </div>
              <div style={{ flex: 1, height: '4px', background: 'var(--accent-primary)', margin: '0 1rem' }}></div>
              <div style={{ textAlign: 'center', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧺</div>
                Picked
              </div>
              <div style={{ flex: 1, height: '4px', background: 'var(--accent-warning)', margin: '0 1rem' }}></div>
              <div style={{ textAlign: 'center', color: 'var(--accent-warning)', fontWeight: 'bold' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧼</div>
                Washing
              </div>
              <div style={{ flex: 1, height: '4px', background: 'var(--border-color)', margin: '0 1rem' }}></div>
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚚</div>
                Delivered
              </div>
            </div>

            <button className="btn btn-primary" style={{ marginTop: '2rem' }}>Request New Laundry Pickup</button>
          </div>
        )}

        {activeTab === 'cleaning' && (
          <div>
            <h3>🧹 Room Cleaning Request</h3>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
              <div className="input-group">
                <label>Preferred Date</label>
                <input type="date" />
              </div>
              <div className="input-group">
                <label>Preferred Time Slot</label>
                <select className="btn" style={{ border: '1px solid var(--border-color)', width: '100%', textAlign: 'left' }}>
                  <option>10:00 AM - 12:00 PM</option>
                  <option>02:00 PM - 04:00 PM</option>
                </select>
              </div>
              <button className="btn btn-primary">Schedule Cleaning</button>
            </div>
          </div>
        )}

        {activeTab === 'visitor' && (
          <div>
            <h3>👥 Visitor Request</h3>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
              <div className="input-group">
                <label>Visitor Name</label>
                <input type="text" placeholder="John Doe" />
              </div>
              <div className="input-group">
                <label>Relation</label>
                <input type="text" placeholder="Friend, Parent, etc." />
              </div>
              <div className="input-group">
                <label>Expected Arrival Time</label>
                <input type="datetime-local" />
              </div>
              <button className="btn btn-primary">Generate Gate Pass</button>
            </div>
          </div>
        )}

        {activeTab === 'leave' && (
          <div>
            <h3>✈️ Leave Notice</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Inform management about your upcoming absence.</p>
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
              <div className="input-group">
                <label>Leave Start Date</label>
                <input type="date" />
              </div>
              <div className="input-group">
                <label>Expected Return Date</label>
                <input type="date" />
              </div>
              <div className="input-group">
                <label>Reason</label>
                <textarea rows="3" placeholder="Going home for holidays..." style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}></textarea>
              </div>
              <button className="btn btn-primary">Submit Leave Notice</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
