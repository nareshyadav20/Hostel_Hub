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
    <div className="attendance-page animate-fade-in">
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div className="icon-box" style={{ background: 'var(--grad-primary)', color: '#fff', marginBottom: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="1" x2="6" y2="4"></line>
              <line x1="14" y1="1" x2="14" y2="4"></line>
            </svg>
          </div>
          <div>
            <h1>Mess Attendance</h1>
            <p style={{ fontWeight: '600' }}>Manage daily meal consumption for residents.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          {['breakfast', 'lunch', 'dinner'].map(meal => (
            <button 
              key={meal}
              onClick={() => setMealType(meal)}
              className="btn"
              style={{ 
                padding: '0.6rem 1.4rem', 
                textTransform: 'capitalize',
                background: mealType === meal ? 'var(--grad-primary)' : 'transparent',
                color: mealType === meal ? '#fff' : 'var(--text-secondary)',
                boxShadow: mealType === meal ? '0 4px 12px rgba(99, 102, 241, 0.2)' : 'none',
                borderRadius: '12px'
              }}
            >
              {meal}
            </button>
          ))}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Total Tenants</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>{total}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Present</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#10b981' }}>{marked}</h2>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Absent</p>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#ef4444' }}>{absent}</h2>
        </div>
      </div>

      <div className="table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>Tenant Name</th>
              <th>Room</th>
              <th style={{ textAlign: 'center' }}>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map(tenant => (
              <tr key={tenant.id}>
                <td style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{tenant.name}</td>
                <td style={{ fontWeight: '600', color: 'var(--text-secondary)' }}>{tenant.room}</td>
                <td style={{ textAlign: 'center' }}>
                  <span className={`table-badge ${tenant[mealType] ? 'success' : 'error'}`}>
                    {tenant[mealType] ? 'Present' : 'Absent'}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button 
                    onClick={() => toggleAttendance(tenant.id, mealType)}
                    className="btn" 
                    style={{ 
                      padding: '0.6rem 1.4rem', 
                      fontSize: '0.85rem', 
                      background: tenant[mealType] ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: tenant[mealType] ? '#ef4444' : '#10b981',
                      fontWeight: '800',
                      borderRadius: '12px'
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

