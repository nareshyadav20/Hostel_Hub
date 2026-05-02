import React, { useState } from 'react';

const Services = () => {
  const [activeTab, setActiveTab] = useState('laundry');
  const [showLaundryModal, setShowLaundryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Laundry State
  const [laundryData, setLaundryData] = useState({ shirts: 0, pants: 0, others: 0, pickupDate: '' });

  // Room Cleaning State
  const [cleaningForm, setCleaningForm] = useState({ date: '', slot: 'Morning (10 AM - 12 PM)' });
  const [cleaningHistory, setCleaningHistory] = useState([
    { id: 1, date: '05 May 2026', time: '10:00 AM', status: 'Scheduled' },
    { id: 2, date: '28 Apr 2026', time: '02:00 PM', status: 'Completed' }
  ]);

  // Visitor State
  const [visitorForm, setVisitorForm] = useState({ name: '', relation: '', arrival: '' });
  const [visitorHistory, setVisitorHistory] = useState([
    { id: 1, name: 'John Doe', relation: 'Brother', arrival: 'Tomorrow, 4:00 PM', status: 'Approved' }
  ]);

  // Leave State
  const [leaveForm, setLeaveForm] = useState({ from: '', to: '', reason: '' });
  const [leaveHistory, setLeaveHistory] = useState([
    { id: 1, start: '10 May 2026', end: '15 May 2026', reason: 'Semester Break', status: 'Pending' }
  ]);

  // Handlers
  const handleLaundrySubmit = (e) => {
    e.preventDefault();
    if (laundryData.shirts + laundryData.pants + laundryData.others === 0) {
      alert('Please add at least one item to request pickup.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowLaundryModal(false);
      alert('📦 Laundry pickup requested successfully!');
      setLaundryData({ shirts: 0, pants: 0, others: 0, pickupDate: '' });
    }, 1500);
  };

  const handleCleaningSubmit = (e) => {
    e.preventDefault();
    if (!cleaningForm.date) return alert('Please select a date.');
    setIsSubmitting(true);
    setTimeout(() => {
      const newRequest = {
        id: cleaningHistory.length + 1,
        date: new Date(cleaningForm.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: cleaningForm.slot.split(' ')[0],
        status: 'Scheduled'
      };
      setCleaningHistory([newRequest, ...cleaningHistory]);
      setIsSubmitting(false);
      alert('🧹 Room cleaning scheduled successfully!');
      setCleaningForm({ date: '', slot: 'Morning (10 AM - 12 PM)' });
    }, 1200);
  };

  const handleVisitorSubmit = (e) => {
    e.preventDefault();
    if (!visitorForm.name || !visitorForm.arrival) return alert('Please fill in all details.');
    setIsSubmitting(true);
    setTimeout(() => {
      const newVisitor = {
        id: visitorHistory.length + 1,
        name: visitorForm.name,
        relation: visitorForm.relation,
        arrival: new Date(visitorForm.arrival).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        status: 'Approved'
      };
      setVisitorHistory([newVisitor, ...visitorHistory]);
      setIsSubmitting(false);
      alert('🎫 Gate Pass generated and sent to visitor!');
      setVisitorForm({ name: '', relation: '', arrival: '' });
    }, 1200);
  };

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveForm.from || !leaveForm.to || !leaveForm.reason) return alert('Please fill in all leave details.');
    setIsSubmitting(true);
    setTimeout(() => {
      const newLeave = {
        id: leaveHistory.length + 1,
        start: new Date(leaveForm.from).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        end: new Date(leaveForm.to).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        reason: leaveForm.reason,
        status: 'Pending'
      };
      setLeaveHistory([newLeave, ...leaveHistory]);
      setIsSubmitting(false);
      alert('✈️ Leave notice submitted to management.');
      setLeaveForm({ from: '', to: '', reason: '' });
    }, 1200);
  };

  return (
    <div className="services-page fade-in dashboard-container" style={{ position: 'relative', paddingBottom: '5rem' }}>
      <style>
        {`
          .glass-card-premium {
            backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 32px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
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
            background: #f8fafc;
            border: 2px solid transparent;
            border-radius: 16px;
            color: #1e293b;
            font-weight: 600;
            transition: all 0.3s ease;
            outline: none;
          }
          .input-premium:focus {
            background: white;
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
          }
          .history-item {
            padding: 1.5rem;
            background: white;
            border-radius: 20px;
            border: 1px solid #f1f5f9;
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
            border: 1px solid #e2e8f0;
            background: white;
            color: #1e293b;
            font-weight: 900;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .counter-btn:hover { background: #f1f5f9; border-color: var(--accent-primary); }
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
          { id: 'laundry', label: 'Laundry', icon: '👔' },
          { id: 'cleaning', label: 'Room Cleaning', icon: '🧹' },
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
            <div className="fade-in">
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ width: '80px', height: '80px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--accent-primary)' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22a7 7 0 1 0 0-14 7 7 0 0 0 0 14z"/><circle cx="12" cy="18" r="3"/></svg>
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Laundry Request</h3>
                <p style={{ color: '#64748b', marginTop: '0.5rem', fontWeight: '500' }}>Schedule your next garment pickup.</p>
              </div>
              <button onClick={() => setShowLaundryModal(true)} className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontWeight: '950', borderRadius: '20px', fontSize: '1.1rem' }}>Request New Pickup</button>
              
              <div style={{ marginTop: '3rem', padding: '2rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem', color: '#1e293b' }}>Active Tracking</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px', background: '#e2e8f0' }}></div>
                  {[
                    { label: 'Requested', time: '9:30 AM', done: true },
                    { label: 'Picked Up', time: '10:45 AM', done: true },
                    { label: 'Washing', time: 'In Progress', done: false },
                    { label: 'Delivered', time: 'Pending', done: false }
                  ].map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step.done ? '#10b981' : 'white', border: `2px solid ${step.done ? '#10b981' : '#e2e8f0'}`, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        {step.done && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.9rem', fontWeight: '800', color: step.done ? '#1e293b' : '#94a3b8' }}>{step.label}</p>
                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cleaning' && (
            <form onSubmit={handleCleaningSubmit} className="fade-in">
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                Schedule Cleaning
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="input-group">
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Preferred Date</label>
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
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Visitor Name</label>
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
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.8rem' }}>Reason</label>
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
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Recent History
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {activeTab === 'laundry' && [
                { id: 'L-102', title: 'Laundry Pickup', date: '25 Apr', status: 'Delivered', color: '#10b981' },
                { id: 'L-101', title: 'Laundry Pickup', date: '20 Apr', status: 'Delivered', color: '#10b981' }
              ].map(item => (
                <div key={item.id} className="history-item">
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>{item.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>ID: {item.id} • {item.date}</p>
                  </div>
                  <span className="status-badge" style={{ background: `${item.color}15`, color: item.color }}>{item.status}</span>
                </div>
              ))}

              {activeTab === 'cleaning' && cleaningHistory.map(item => (
                <div key={item.id} className="history-item">
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>Room Cleaning</h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{item.date} • {item.time}</p>
                  </div>
                  <span className="status-badge" style={{ background: item.status === 'Completed' ? '#10b98115' : '#3b82f615', color: item.status === 'Completed' ? '#10b981' : '#3b82f6' }}>{item.status}</span>
                </div>
              ))}

              {activeTab === 'visitor' && visitorHistory.map(item => (
                <div key={item.id} className="history-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'var(--accent-primary)' }}>{item.name[0]}</div>
                    <div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>{item.name}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{item.relation} • {item.arrival}</p>
                    </div>
                  </div>
                  <span className="status-badge" style={{ background: '#10b98115', color: '#10b981' }}>{item.status}</span>
                </div>
              ))}

              {activeTab === 'leave' && leaveHistory.map(item => (
                <div key={item.id} className="history-item">
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', color: '#1e293b' }}>{item.reason}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>{item.start} to {item.end}</p>
                  </div>
                  <span className="status-badge" style={{ background: '#f59e0b15', color: '#f59e0b' }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Laundry Request Modal ── */}
      {showLaundryModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', padding: '1rem' }}>
          <div className="glass-card-premium fade-in" style={{ width: '100%', maxWidth: '550px', padding: '3rem', background: 'white', position: 'relative' }}>
            <button onClick={() => setShowLaundryModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 style={{ fontSize: '2rem', fontWeight: '950', textAlign: 'center', marginBottom: '2.5rem' }}>Laundry Pickup</h2>
            <form onSubmit={handleLaundrySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { id: 'shirts', label: 'Shirts/Tops' },
                { id: 'pants', label: 'Pants/Bottoms' },
                { id: 'others', label: 'Others' }
              ].map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f8fafc', borderRadius: '16px' }}>
                  <span style={{ fontWeight: '800', color: '#475569' }}>{item.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button type="button" className="counter-btn" onClick={() => setLaundryData({...laundryData, [item.id]: Math.max(0, laundryData[item.id] - 1)})}>−</button>
                    <span style={{ fontWeight: '900', minWidth: '20px', textAlign: 'center' }}>{laundryData[item.id]}</span>
                    <button type="button" className="counter-btn" onClick={() => setLaundryData({...laundryData, [item.id]: laundryData[item.id] + 1})}>+</button>
                  </div>
                </div>
              ))}
              <div className="input-group" style={{ marginTop: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Pickup Time</label>
                <input type="datetime-local" className="input-premium" value={laundryData.pickupDate} onChange={e => setLaundryData({...laundryData, pickupDate: e.target.value})} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '1.2rem', fontWeight: '950', borderRadius: '18px', marginTop: '1rem' }}>Request Pickup</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
