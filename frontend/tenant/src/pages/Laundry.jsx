import React from 'react';

const Laundry = () => {
  const steps = [
    { label: 'Picked', status: 'completed', time: '10:00 AM' },
    { label: 'Washing', status: 'current', time: 'In Progress' },
    { label: 'Delivered', status: 'pending', time: 'Expected 6:00 PM' },
  ];

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>Laundry Service</h1>
          <p>Track your laundry status in real-time.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>Current Order #L-9842</h2>
          <span className="status-badge success">Active</span>
        </div>

        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          <div style={{ position: 'absolute', left: '7px', top: '0', bottom: '0', width: '2px', background: 'var(--border-color)' }}></div>
          {steps.map((step, i) => (
            <div key={i} style={{ position: 'relative', marginBottom: '2.5rem' }}>
              <div style={{ 
                position: 'absolute', left: '-2rem', top: '0', width: '16px', height: '16px', borderRadius: '50%', 
                background: step.status === 'completed' ? 'var(--accent-success)' : step.status === 'current' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                border: '4px solid var(--bg-secondary)', zIndex: 1,
                boxShadow: step.status === 'current' ? '0 0 10px var(--accent-primary)' : 'none'
              }}></div>
              <div style={{ opacity: step.status === 'pending' ? 0.5 : 1 }}>
                <h3 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem' }}>{step.label}</h3>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>{step.time}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Request New Laundry</button>
      </div>
    </div>
  );
};

export default Laundry;
