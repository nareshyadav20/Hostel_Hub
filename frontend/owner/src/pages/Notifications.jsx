import React, { useState } from 'react';

const Notifications = () => {
  const [messages, setMessages] = useState([
    { id: 1, title: 'New Booking', message: 'Room 201-A booked by Rahul Sharma.', time: '10m ago' },
    { id: 2, title: 'Low Stock', message: 'Milk and Sugar running low in Building A.', time: '1h ago' },
    { id: 3, title: 'Resolved', message: 'WiFi issue in Room 101 has been resolved.', time: '3h ago' },
  ]);

  const handleSendNotification = () => {
    alert('Opening Notification Composer...');
  };

  return (
    <div className="notifications-page">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>🔔 Notifications Center</h1>
          <p>Recent activities and system messages.</p>
        </div>
        <button onClick={handleSendNotification} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontWeight: '700' }}>
          ➕ Send Notification
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map(m => (
          <div key={m.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{m.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{m.message}</p>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
