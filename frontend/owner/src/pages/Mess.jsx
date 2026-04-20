import React, { useState } from 'react';

const Mess = () => {
  const [todayMenu, setTodayMenu] = useState({
    breakfast: 'Idli, Sambar & Chutney',
    lunch: 'Rice, Dal, Veg Fry & Curd',
    dinner: 'Roti, Paneer Masala & Salad'
  });

  const handleEditMenu = () => {
    alert('Opening Menu Editor...');
  };

  return (
    <div className="mess-page">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>🍽️ Mess Management</h1>
          <p>View and manage daily meal schedules.</p>
        </div>
        <button onClick={handleEditMenu} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontWeight: '700' }}>
          ➕ Edit Menu
        </button>
      </header>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          📅 Today's Menu
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--accent-primary)', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.8rem' }}>BREAKFAST</p>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{todayMenu.breakfast}</p>
          </div>
          <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--accent-success)', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.8rem' }}>LUNCH</p>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{todayMenu.lunch}</p>
          </div>
          <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
            <p style={{ color: 'var(--accent-warning)', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.8rem' }}>DINNER</p>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{todayMenu.dinner}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mess;
