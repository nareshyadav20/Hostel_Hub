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

      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Room Number</th>
              <th>Task Type</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td style={{ fontWeight: '700' }}>Room {task.room}</td>
                <td>
                  <span style={{ fontSize: '0.9rem' }}>{task.type}</span>
                </td>
                <td>
                  <span className={`table-badge ${task.status === 'Completed' ? 'success' : 'warning'}`}>
                    {task.status}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  {task.status !== 'Completed' ? (
                    <button 
                      onClick={() => markCompleted(task.id)}
                      className="btn" 
                      style={{ 
                        padding: '0.5rem 1rem', 
                        fontSize: '0.85rem', 
                        background: 'rgba(16, 185, 129, 0.1)', 
                        color: 'var(--accent-success)',
                        fontWeight: '700'
                      }}
                    >
                      Done
                    </button>
                  ) : (
                    <span style={{ color: 'var(--accent-success)', fontSize: '0.9rem' }}>✓ Verified</span>
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
