import React, { useState } from 'react';

const Attendance = () => {
  const [tenants, setTenants] = useState([
    { id: 1, name: 'Rahul Sharma', room: '201-A', breakfast: true, lunch: false, dinner: false },
    { id: 2, name: 'Priya Verma', room: '202-B', breakfast: true, lunch: true, dinner: false },
    { id: 3, name: 'Amit Singh', room: '101-A', breakfast: false, lunch: false, dinner: false },
    { id: 4, name: 'Sneha Kapur', room: '305-C', breakfast: true, lunch: true, dinner: true },
  ]);

  const [mealType, setMealType] = useState('breakfast');

  const total = tenants.length;
  const marked = tenants.filter(t => t[mealType]).length;
  const absent = total - marked;

  const toggleAttendance = (id, meal) => {
    setTenants(tenants.map(t => 
      t.id === id ? { ...t, [meal]: !t[meal] } : t
    ));
  };

  return (
    <div className="attendance-page">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>🍱 Mess Attendance</h1>
          <p>Mark daily meal consumption for residents.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-tertiary)', padding: '0.4rem', borderRadius: '12px' }}>
          {['breakfast', 'lunch', 'dinner'].map(meal => (
            <button 
              key={meal}
              onClick={() => setMealType(meal)}
              className="btn"
              style={{ 
                padding: '0.5rem 1rem', 
                textTransform: 'capitalize',
                background: mealType === meal ? 'var(--accent-primary)' : 'transparent',
                color: mealType === meal ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                boxShadow: mealType === meal ? 'var(--shadow-md)' : 'none'
              }}
            >
              {meal}
            </button>
          ))}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Tenants</p>
          <h2 style={{ fontSize: '2rem' }}>{total}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--accent-success)', fontSize: '0.9rem' }}>Present</p>
          <h2 style={{ fontSize: '2rem', color: 'var(--accent-success)' }}>{marked}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--accent-error)', fontSize: '0.9rem' }}>Absent</p>
          <h2 style={{ fontSize: '2rem', color: 'var(--accent-error)' }}>{absent}</h2>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '1.2rem' }}>Tenant Name</th>
              <th style={{ padding: '1.2rem' }}>Room</th>
              <th style={{ padding: '1.2rem', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '1.2rem', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(tenant => (
              <tr key={tenant.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.2rem', fontWeight: '600' }}>{tenant.name}</td>
                <td style={{ padding: '1.2rem' }}>{tenant.room}</td>
                <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '0.3rem 0.8rem', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    background: tenant[mealType] ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: tenant[mealType] ? 'var(--accent-success)' : 'var(--accent-error)'
                  }}>
                    {tenant[mealType] ? 'Present' : 'Absent'}
                  </span>
                </td>
                <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                  <button 
                    onClick={() => toggleAttendance(tenant.id, mealType)}
                    className="btn" 
                    style={{ 
                      padding: '0.4rem 1rem', 
                      fontSize: '0.8rem', 
                      background: tenant[mealType] ? 'var(--accent-error)' : 'var(--accent-success)',
                      color: '#fff',
                      border: 'none',
                      minWidth: '100px'
                    }}
                  >
                    {tenant[mealType] ? 'Mark Absent' : 'Mark Present'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
