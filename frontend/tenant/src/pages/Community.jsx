import React, { useState } from 'react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('notice');

  return (
    <div className="community-page fade-in dashboard-container">
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Community Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Connect with your hostel family, find roommates, and stay engaged with events.</p>
      </header>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '2.5rem', flexWrap: 'wrap', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', width: 'fit-content', border: '1px solid var(--border-color)' }}>
        {[
          { id: 'notice',    label: 'Notice Board', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> },
          { id: 'events',    label: 'Events',       icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
          { id: 'roommate',  label: 'Roommates',    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
          { id: 'buysell',   label: 'Marketplace',  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
          { id: 'lostfound', label: 'Lost & Found', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
        ].map(tab => (
          <button key={tab.id}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.6rem', background: activeTab === tab.id ? 'var(--accent-primary)' : 'transparent', color: activeTab === tab.id ? 'white' : 'var(--text-muted)', border: 'none' }}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: '2.5rem', minHeight: '500px' }}>

        {/* ── Notice Board ── */}
        {activeTab === 'notice' && (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '2rem' }}>Critical Updates</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ padding: '1.5rem', background: 'rgba(244,63,94,0.05)', borderLeft: '4px solid var(--accent-error)', borderRadius: '16px' }}>
                <h4 style={{ color: 'var(--accent-error)', fontSize: '1.1rem', fontWeight: '800' }}>Water Supply Interruption</h4>
                <p style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>Scheduled maintenance on main tank today from 2 PM to 4 PM.</p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <small style={{ color: 'var(--text-muted)', fontWeight: '600' }}>High Priority</small>
                  <small style={{ color: 'var(--text-muted)' }}>2 hours ago</small>
                </div>
              </div>
              <div style={{ padding: '1.5rem', background: 'rgba(14,165,233,0.05)', borderLeft: '4px solid var(--accent-primary)', borderRadius: '16px' }}>
                <h4 style={{ color: 'var(--accent-primary)', fontSize: '1.1rem', fontWeight: '800' }}>Rent Cycle Reminder</h4>
                <p style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>Kindly clear all dues by tomorrow to enjoy uninterrupted services.</p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                  <small style={{ color: 'var(--text-muted)', fontWeight: '600' }}>General Notice</small>
                  <small style={{ color: 'var(--text-muted)' }}>Yesterday</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Events ── */}
        {activeTab === 'events' && (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '2rem' }}>Upcoming Activities</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '20px' }}>
                <div style={{ width: '100%', height: '140px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '800' }}>FIFA Weekend</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.8rem 0 1.5rem' }}>Tournament in the common lounge. Open for all!</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-primary)' }}>Sat, 6:00 PM</span>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>Join</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Roommates ── */}
        {activeTab === 'roommate' && (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '2rem' }}>Potential Connections</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {[
                { initials: 'RS', name: 'Rahul Sharma',  pref: 'Working Professional • Early Bird • Non-Veg' },
                { initials: 'PV', name: 'Priya Verma',   pref: 'Student • Night Owl • Veg' },
              ].map((p, i) => (
                <div key={i} className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: '900', color: 'var(--accent-primary)', border: '2px solid var(--accent-primary)' }}>{p.initials}</div>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{p.name}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.pref}</p>
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>Say Hello</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Marketplace ── */}
        {activeTab === 'buysell' && (
          <div className="fade-in">
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '2rem' }}>Hostel Marketplace</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '2rem' }}>
              {[
                { name: 'Study Table',    price: '₹800',   desc: 'Condition: Like new. Moving out next month.' },
                { name: 'Electric Kettle', price: '₹600',  desc: 'Barely used. Excellent condition.' },
              ].map((item, i) => (
                <div key={i} className="glass-card" style={{ padding: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '20px' }}>
                  <div style={{ width: '100%', height: '120px', background: 'var(--bg-tertiary)', borderRadius: '12px', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{item.name}</h4>
                  <p style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--accent-primary)', margin: '0.5rem 0' }}>{item.price}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{item.desc}</p>
                  <button className="btn" style={{ width: '100%', fontSize: '0.85rem', fontWeight: '700', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>Contact Seller</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Lost & Found ── */}
        {activeTab === 'lostfound' && (
          <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Lost & Found</h3>
              <button className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>+ Report Item</button>
            </div>
            <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(251,191,36,0.05)', borderLeft: '4px solid var(--accent-warning)', borderRadius: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-warning)' }}>Found: Black Wallet</h4>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Found near the gym entrance. Handed over to the warden.</p>
                </div>
                <small style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Today, 10 AM</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;
