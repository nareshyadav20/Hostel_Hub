import React from 'react';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Guest"}');

  return (
    <div>
      <h1>👤 Welcome, {user.name}</h1>
      <p>Manage your hostel life and rewards.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card"><h3>Next Rent Due</h3><h2 style={{ color: 'var(--accent-error)' }}>₹6,500</h2><p>Due in 5 days</p></div>
        <div className="card"><h3>Loyalty Points</h3><h2 style={{ color: 'var(--accent-success)' }}>450</h2><p>Level: Silver</p></div>
        <div className="card"><h3>Mess Attendance</h3><h2 style={{ color: 'var(--accent-primary)' }}>92%</h2><p>This month</p></div>
      </div>
    </div>
  );
}
export default Dashboard;
