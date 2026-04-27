import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
    <div className="mess-page fade-in dashboard-container" style={{ position: 'relative' }}>
      <Link to="/dashboard" style={{
        position: 'absolute', top: '20px', right: '20px', background: 'var(--bg-secondary)',
        width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
        boxShadow: 'var(--shadow-md)', transition: 'all 0.3s ease', zIndex: 10
      }} className="hover-scale">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </Link>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          Dining & Nutrition
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>View today's curated menu, manage attendance, and share your dining experience.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Daily Menu</h3>
            </div>
            <span style={{ background: 'rgba(251, 191, 36, 0.1)', color: 'var(--accent-warning)', padding: '0.5rem 1.2rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '800', border: '1px solid rgba(251, 191, 36, 0.2)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Live: 4.2 
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1, transform: 'rotate(-15deg)' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              </div>
              <p style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Breakfast</p>
              <p style={{ fontSize: '1.15rem', fontWeight: '700' }}>{todayMenu.breakfast}</p>
            </div>

            <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1, transform: 'rotate(-15deg)' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <p style={{ color: 'var(--accent-success)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Lunch</p>
              <p style={{ fontSize: '1.15rem', fontWeight: '700' }}>{todayMenu.lunch}</p>
            </div>

            <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1, transform: 'rotate(-15deg)' }}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              </div>
              <p style={{ color: 'var(--accent-warning)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Dinner</p>
              <p style={{ fontSize: '1.15rem', fontWeight: '700' }}>{todayMenu.dinner}</p>
            </div>
          </div>
          
          <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem', fontWeight: '700' }}>Rate Experience</h4>
            <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', fontSize: '1.8rem', cursor: 'pointer' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} onClick={() => setRating(star)} style={{ color: star <= rating ? 'var(--accent-warning)' : 'rgba(255, 255, 255, 0.05)', transition: 'transform 0.2s ease', transform: star <= rating ? 'scale(1.2)' : 'scale(1)', display: 'inline-flex' }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill={star <= rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </span>
              ))}
            </div>
            {rating > 0 && <p style={{ fontSize: '0.8rem', color: 'var(--accent-success)', marginTop: '1rem', fontWeight: '600' }}>Feedback submitted. Thank you!</p>}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>Manage Attendance</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Opting out early helps us minimize food wastage.</p>
          </div>

          <div style={{ position: 'relative', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', width: '120px', height: '120px', background: 'var(--accent-primary)', opacity: 0.1, borderRadius: '50%', filter: 'blur(40px)' }}></div>
            <div style={{ zIndex: 1, color: 'var(--accent-primary)', background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '50%', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <button 
              onClick={handleMarkAttendance} 
              className={`btn ${attended ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '1.2rem', fontWeight: '800', borderRadius: '14px', fontSize: '1rem', border: !attended ? '1px solid var(--border-color)' : 'none' }}
            >
              {attended ? '✓ Attending' : 'Mark Presence'}
            </button>
            
            <button 
              onClick={handleSkipMeal} 
              className="btn"
              style={{ 
                padding: '1.2rem', 
                fontWeight: '800', 
                borderRadius: '14px', 
                fontSize: '1rem',
                background: skipped ? 'rgba(244, 63, 94, 0.1)' : 'transparent',
                color: skipped ? 'var(--accent-error)' : 'var(--text-muted)',
                border: `1px solid ${skipped ? 'var(--accent-error)' : 'var(--border-color)'}`
              }}
            >
              {skipped ? '✕ Opted Out' : 'Skip This Meal'}
            </button>
          </div>
          
          <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(14, 165, 233, 0.05)', borderRadius: '12px', border: '1px dashed var(--accent-primary)' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', fontWeight: '600' }}>Next Scheduled: LUNCH (12:30 PM)</p>
          </div>
        </div>
      </div>
      {/* Weekly Menu Table */}
      <section style={{ marginTop: '4rem' }} className="fade-in-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <h3 style={{ fontSize: '1.6rem', fontWeight: '950', letterSpacing: '-1px' }}>Weekly Dining Plan</h3>
        </div>
        
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Day</th>
                  <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tiffin (Breakfast)</th>
                  <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Lunch</th>
                  <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Dinner</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { day: 'Monday', tiffin: 'Dosa & Podi', lunch: 'South Indian Thali', dinner: 'Veg Pulao & Raita' },
                  { day: 'Tuesday', tiffin: 'Poha & Jalebi', lunch: 'Rice, Dal & Sabzi', dinner: 'Phulka & Alu Methi' },
                  { day: 'Wednesday', tiffin: 'Vada Sambar', lunch: 'Curd Rice & Pickle', dinner: 'Dal Tadka & Jeera Rice' },
                  { day: 'Thursday', tiffin: 'Upma & Chutney', lunch: 'Roti & Mix Veg', dinner: 'Egg Curry / Paneer' },
                  { day: 'Friday', tiffin: 'Paratha & Curd', lunch: 'Veg Biryani', dinner: 'Chapati & Mix Sabzi' },
                  { day: 'Saturday', tiffin: 'Bread Omelette', lunch: 'Special Fried Rice', dinner: 'Chinese Special' },
                  { day: 'Sunday', tiffin: 'Puri Bhaji', lunch: 'Sunday Feast', dinner: 'Chef\'s Choice' }
                ].map((menu, idx) => (
                  <tr key={idx} style={{ 
                    borderBottom: '1px solid var(--border-color)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                    transition: 'background 0.3s ease'
                  }} className="menu-row-hover">
                    <td style={{ padding: '1.2rem 2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{menu.day}</td>
                    <td style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{menu.tiffin}</td>
                    <td style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{menu.lunch}</td>
                    <td style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{menu.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <style>{`
        .menu-row-hover:hover {
          background: rgba(14, 165, 233, 0.05) !important;
        }
        @media (max-width: 768px) {
          th, td { padding: 1rem !important; min-width: 150px; }
        }
      `}</style>
    </div>
  );
};

export default Mess;
