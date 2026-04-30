import React, { useState } from 'react';

const Services = () => {
   const [activeTab, setActiveTab] = useState('cleaning');

   return (
      <div className="services-page fade-in dashboard-container">
         <header style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
               Housekeeping & Services
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your laundry, cleaning requests, visitors, and leaves.</p>
         </header>

         <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button className={`btn ${activeTab === 'cleaning' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('cleaning')}>Room Cleaning</button>
            <button className={`btn ${activeTab === 'visitor' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('visitor')}>Visitor Request</button>
            <button className={`btn ${activeTab === 'leave' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('leave')}>Leave Notice</button>
         </div>

         <div className="card" style={{ padding: '2rem' }}>
            {activeTab === 'cleaning' && (
               <div className="fade-in">
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                     Room Cleaning Request
                  </h3>
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
               <div className="fade-in">
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                     Visitor Request
                  </h3>
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
               <div className="fade-in">
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                     Leave Notice
                  </h3>
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
