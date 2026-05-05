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
    <div className="cleaning-page animate-fade-in">
      <header style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
        <div className="icon-box" style={{ background: 'var(--grad-success)', color: '#fff', marginBottom: 0 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
        </div>
        <div>
          <h1>Cleaning Tasks</h1>
          <p style={{ fontWeight: '600' }}>Manage daily and deep cleaning schedules.</p>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Total Rooms</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>{total}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Cleaned</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#10b981' }}>{completed}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Remaining</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#f59e0b' }}>{remaining}</h2>
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
                <td style={{ fontWeight: '800', color: 'var(--text-primary)' }}>Room {task.room}</td>
                <td>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{task.type}</span>
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
                        padding: '0.6rem 1.4rem', 
                        fontSize: '0.85rem', 
                        background: 'rgba(16, 185, 129, 0.1)', 
                        color: '#10b981',
                        fontWeight: '800',
                        borderRadius: '12px'
                      }}
                    >
                      Done
                    </button>
                  ) : (
                    <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', fontWeight: '800' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Verified
                    </div>
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

