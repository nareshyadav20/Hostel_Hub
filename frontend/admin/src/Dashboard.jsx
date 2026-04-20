import React from 'react';

function Dashboard() {
  const stats = [
    { label: 'Total Hostels', value: '124', color: 'var(--accent-primary)', trend: '+12% ↑' },
    { label: 'Total Owners', value: '86', color: 'var(--accent-success)', trend: '+5% ↑' },
    { label: 'Total Tenants', value: '4,500', color: 'var(--accent-warning)', trend: '+18% ↑' },
    { label: 'Total Revenue', value: '₹1.2Cr', color: 'var(--accent-error)', trend: '+22% ↑' },
    { label: 'Active Subs', value: '92', color: 'var(--accent-secondary)', trend: '+8% ↑' },
  ];

  return (
    <div className="dashboard-view">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>👑 Platform Overview</h1>
        <p style={{ color: 'var(--text-secondary)' }}>System-wide analytics and platform performance.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '1.2rem' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{stat.label}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{stat.value}</h2>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: stat.color }}>{stat.trend}</span>
            </div>
            {/* Small chart placeholder */}
            <div style={{ height: '30px', marginTop: '1rem', background: `linear-gradient(90deg, ${stat.color}15, transparent)`, borderRadius: '4px' }}></div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3>Recent Platform Activity</h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { text: 'New Owner Registered: Green Valley Hostels', time: '2m ago' },
              { text: 'Enterprise Plan Renewed by Elite Living', time: '1h ago' },
              { text: 'New Integration: City Pharmacy Services', time: '3h ago' }
            ].map((item, idx) => (
              <div key={idx} style={{ padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', fontSize: '0.9rem' }}>
                <p>{item.text}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: '#fff' }}>
          <h3>System Health</h3>
          <div style={{ marginTop: '1.5rem' }}>
            <p style={{ marginBottom: '0.5rem' }}>Server Status: <strong style={{ color: '#4ade80' }}>Online</strong></p>
            <p style={{ marginBottom: '0.5rem' }}>DB Sync: <strong style={{ color: '#4ade80' }}>Healthy</strong></p>
            <p>Last Backup: 4h ago</p>
          </div>
          <button className="btn" style={{ background: '#fff', color: 'var(--accent-primary)', width: '100%', fontWeight: '700', marginTop: '2rem' }}>
            System Audit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
