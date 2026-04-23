import React, { useState } from 'react';

const Mess = () => {
  const [attended, setAttended] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [rating, setRating] = useState(0);
  
  const todayMenu = {
    breakfast: 'Idli, Sambar & Chutney',
    lunch: 'Rice, Dal, Veg Fry & Curd',
    dinner: 'Roti, Paneer Masala & Salad'
  };

  const handleMarkAttendance = () => {
    setAttended(true);
    setSkipped(false);
  };

  const handleSkipMeal = () => {
    setSkipped(true);
    setAttended(false);
  };

  return (
    <div className="mess-page">
      <header style={{ marginBottom: '2rem' }}>
        <h1>🍽️ Mess & Menu</h1>
        <p>Check today's menu, mark your attendance, and give real-time feedback.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>📅 Today's Menu</h3>
            <span style={{ background: 'var(--accent-primary)', color: 'white', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              Live Rating: 4.2 / 5 ☆
            </span>
          </div>
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
          
          {/* Real-time Feedback Section */}
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ marginBottom: '1rem' }}>Rate Today's Food</h4>
            <div style={{ display: 'flex', gap: '0.5rem', fontSize: '2rem', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} onClick={() => setRating(star)} style={{ color: star <= rating ? 'var(--accent-warning)' : 'var(--border-color)' }}>
                  ★
                </span>
              ))}
            </div>
            {rating > 0 && <p style={{ fontSize: '0.85rem', color: 'var(--accent-success)', marginTop: '0.5rem' }}>Thank you! Your feedback helps us improve.</p>}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '2rem' }}>
            <h3>Next Meal: LUNCH</h3>
            <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>Manage your meal presence to avoid food wastage.</p>
            <div style={{ fontSize: '3rem', margin: '1rem 0' }}>🍱</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={handleMarkAttendance} 
                className={`btn ${attended ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '1rem', fontWeight: '800' }}
              >
                {attended ? '✅ Attending' : 'Mark Attending'}
              </button>
              
              <button 
                onClick={handleSkipMeal} 
                className={`btn ${skipped ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '1rem', fontWeight: '800', background: skipped ? 'var(--accent-error)' : 'var(--bg-tertiary)', color: skipped ? 'white' : 'var(--text-primary)' }}
              >
                {skipped ? '❌ Skipped' : 'Skip Meal'}
              </button>
            </div>
            
            {attended && <p style={{ color: 'var(--accent-success)', fontSize: '0.85rem', marginTop: '1rem' }}>Your portion is being prepared!</p>}
            {skipped && <p style={{ color: 'var(--accent-error)', fontSize: '0.85rem', marginTop: '1rem' }}>You have opted out of this meal.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mess;
