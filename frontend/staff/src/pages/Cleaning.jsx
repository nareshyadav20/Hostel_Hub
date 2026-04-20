import React, { useState } from 'react';

const Cleaning = () => {
  const [tasks, setTasks] = useState([
    { id: 1, room: '101', type: 'Cleaning', status: 'Completed' },
    { id: 2, room: '102', type: 'Deep Cleaning', status: 'Pending' },
    { id: 3, room: '201', type: 'Cleaning', status: 'Completed' },
    { id: 4, room: '202', type: 'Cleaning', status: 'Pending' },
    { id: 5, room: '301', type: 'Deep Cleaning', status: 'Pending' },
  ]);

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const remaining = total - completed;

  const markCompleted = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Completed' } : t));
  };

  return (
    <div className="cleaning-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🧹 Cleaning Tasks</h1>
        <p>Manage daily and deep cleaning schedules.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Rooms</p>
          <h2 style={{ fontSize: '2rem' }}>{total}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--accent-success)', fontSize: '0.9rem' }}>Cleaned</p>
          <h2 style={{ fontSize: '2rem', color: 'var(--accent-success)' }}>{completed}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--accent-warning)', fontSize: '0.9rem' }}>Remaining</p>
          <h2 style={{ fontSize: '2rem', color: 'var(--accent-warning)' }}>{remaining}</h2>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1.2rem' }}>Room Number</th>
              <th style={{ padding: '1.2rem' }}>Task Type</th>
              <th style={{ padding: '1.2rem' }}>Status</th>
              <th style={{ padding: '1.2rem' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.2rem', fontWeight: '700' }}>Room {task.room}</td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{task.type}</span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    background: task.status === 'Completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    color: task.status === 'Completed' ? 'var(--accent-success)' : 'var(--accent-warning)'
                  }}>
                    {task.status}
                  </span>
                </td>
                <td style={{ padding: '1.2rem' }}>
                  {task.status !== 'Completed' && (
                    <button 
                      onClick={() => markCompleted(task.id)}
                      className="btn" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', border: '1px solid var(--accent-success)', color: 'var(--accent-success)' }}
                    >
                      Mark Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Cleaning;
