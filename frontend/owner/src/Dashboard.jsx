import React from 'react';

function Dashboard() {
  const stats = [
    { 
      label: 'Total Buildings', value: '4', sub: '2 Main, 2 Annex', color: 'var(--accent-primary)'
    },
    { 
      label: 'Bed Occupancy', value: '142/150', sub: '95% Filled', color: 'var(--accent-success)'
    },
    { 
      label: 'Monthly Revenue', value: '₹14.2L', sub: '↑ 12% vs last month', color: 'var(--accent-warning)'
    },
    { 
      label: 'Open Complaints', value: '3', sub: 'Requires Attention', color: 'var(--accent-error)'
    },
  ];

  return (
    <div className="dashboard-view">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Portfolio Overview</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Real-time insights across all your buildings.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.1rem' }}>{stat.label}</p>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{stat.value}</h2>
              <p style={{ fontSize: '0.75rem', color: stat.color, fontWeight: '600' }}>{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem' }}>Recent Payments</h3>
            <button className="btn" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>View All</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <tr style={{ background: 'var(--bg-tertiary)', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Tenant</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Status</th>
            </tr>
            {[
              { name: 'Rahul Sharma', amount: '₹6,500', status: 'Success' },
              { name: 'Priya Verma', amount: '₹8,500', status: 'Success' },
              { name: 'Amit Singh', amount: '₹5,000', status: 'Pending' }
            ].map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>{p.name}</td>
                <td style={{ padding: '1rem', fontWeight: '700' }}>{p.amount}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '700',
                    background: p.status === 'Success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: p.status === 'Success' ? 'var(--accent-success)' : 'var(--accent-warning)'
                  }}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </table>
        </div>
        
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: '#fff' }}>
          <h3>Admin Notice</h3>
          <p style={{ margin: '1rem 0', opacity: '0.9', fontSize: '0.9rem' }}>New building safety regulations have been updated. Please review the documentation.</p>
          <button className="btn" style={{ background: '#fff', color: 'var(--accent-primary)', width: '100%', fontWeight: '700' }}>
            Review Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
