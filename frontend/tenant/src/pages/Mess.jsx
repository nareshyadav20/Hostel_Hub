import React, { useState } from 'react';

const Mess = () => {
  const [attended, setAttended] = useState(false);
  const todayMenu = {
    breakfast: 'Idli, Sambar & Chutney',
    lunch: 'Rice, Dal, Veg Fry & Curd',
    dinner: 'Roti, Paneer Masala & Salad'
  };

  const handleMarkAttendance = () => {
    setAttended(true);
    alert('Attendance marked for current meal!');
  };

  return (
    <div className="mess-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🍽️ Mess & Menu</h1>
        <p>Check today's menu and mark your attendance.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>📅 Today's Menu</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.8rem' }}>BREAKFAST</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{todayMenu.breakfast}</p>
            </div>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--accent-success)', fontWeight: '800', fontSize: '0.8rem' }}>LUNCH</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{todayMenu.lunch}</p>
            </div>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <p style={{ color: 'var(--accent-warning)', fontWeight: '800', fontSize: '0.8rem' }}>DINNER</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{todayMenu.dinner}</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem' }}>
          <h3>Mess Attendance</h3>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>Mark your presence for the upcoming meal.</p>
          <div style={{ fontSize: '3rem', margin: '1rem 0' }}>🍱</div>
          <button 
            onClick={handleMarkAttendance} 
            className="btn btn-primary" 
            disabled={attended}
            style={{ padding: '1rem', fontWeight: '800' }}
          >
            {attended ? '✅ Marked Present' : 'Mark Attendance'}
          </button>
          {attended && <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '1rem' }}>You have marked attendance for the next meal.</p>}
        </div>
      </div>
    </div>
  );
};

export default Mess;
