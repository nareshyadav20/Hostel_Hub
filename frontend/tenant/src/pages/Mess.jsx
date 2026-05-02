import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const Mess = () => {
  const [attended, setAttended] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [rating, setRating] = useState(0);
  
  const todayMenu = {
    breakfast: 'Idli, Sambar & Coconut Chutney',
    lunch: 'Hyderabadi Veg Biryani, Mirchi Ka Salan & Raita',
    dinner: 'Butter Paneer Masala, Garlic Naan & Salad'
  };

  const handleMarkAttendance = () => {
    setAttended(true);
    setSkipped(false);
    alert('Presence marked for the next meal! Enjoy your dining.');
  };

  const handleSkipMeal = () => {
    setSkipped(true);
    setAttended(false);
    alert('Meal skipped. Thank you for helping us reduce food waste.');
  };

  if (loading) return <div className="dashboard-container"><div className="loading-spinner">Fetching Menu...</div></div>;

  return (
    <div className="mess-page fade-in dashboard-container" style={{ position: 'relative', paddingBottom: '6rem' }}>
      <style>
        {`
          .glass-card-premium {
            backdrop-filter: blur(16px);
            background: rgba(255, 255, 255, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 32px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .meal-card {
            padding: 2rem;
            border-radius: 24px;
            background: white;
            border: 1px solid #f1f5f9;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          .meal-card:hover {
            transform: translateY(-5px);
            border-color: var(--accent-primary);
            box-shadow: 0 15px 30px rgba(0,0,0,0.05);
          }
          .mess-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 0.8rem;
          }
          .mess-table th {
            padding: 1.5rem 2rem;
            font-size: 0.8rem;
            font-weight: 900;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            text-align: left;
          }
          .mess-table td {
            padding: 1.5rem 2rem;
            background: white;
            border-top: 1px solid #f1f5f9;
            border-bottom: 1px solid #f1f5f9;
            font-size: 0.95rem;
            font-weight: 600;
            color: #1e293b;
          }
          .mess-table td:first-child {
            border-left: 1px solid #f1f5f9;
            border-top-left-radius: 16px;
            border-bottom-left-radius: 16px;
            color: var(--accent-primary);
            font-weight: 900;
          }
          .mess-table td:last-child {
            border-right: 1px solid #f1f5f9;
            border-top-right-radius: 16px;
            border-bottom-right-radius: 16px;
          }
          .mess-table tr:hover td {
            background: #f8fafc;
            border-color: var(--accent-primary);
          }
          .btn-action {
            padding: 1.2rem 2rem;
            border-radius: 18px;
            font-weight: 900;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.8rem;
            border: none;
          }
        `}
      </style>

      <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-2px', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
            <div style={{ background: 'var(--accent-primary)', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
            Dining Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.15rem', fontWeight: '500' }}>Curated nutrition and meal management for a healthy campus life.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase' }}>Current Session</p>
              <p style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--accent-primary)' }}>Lunch (12:30 - 2:30 PM)</p>
           </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3rem', marginBottom: '5rem' }}>
        {/* ── Today's Menu Section ── */}
        <div className="glass-card-premium" style={{ padding: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '950', color: '#1e293b' }}>Today's Specials</h3>
            <div style={{ background: '#fef3c7', color: '#d97706', padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              4.8 Chef's Rating
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { type: 'Breakfast', menu: todayMenu.breakfast, icon: '🍳', color: '#0ea5e3' },
              { type: 'Lunch', menu: todayMenu.lunch, icon: '🍛', color: '#10b981' },
              { type: 'Dinner', menu: todayMenu.dinner, icon: '🥗', color: '#f59e0b' }
            ].map((meal, idx) => (
              <div key={idx} className="meal-card">
                <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '5rem', opacity: 0.05 }}>{meal.icon}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '900', color: meal.color, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{meal.type}</span>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', marginTop: '0.4rem' }}>{meal.menu}</h4>
                  </div>
                  <div style={{ width: '44px', height: '44px', background: '#f8fafc', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {meal.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3.5rem', padding: '2rem', background: '#f8fafc', borderRadius: '24px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
            <p style={{ fontWeight: '800', color: '#475569', marginBottom: '1.2rem' }}>How was your last meal?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', transform: star <= rating ? 'scale(1.2)' : 'scale(1)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={star <= rating ? "#f59e0b" : "none"} stroke={star <= rating ? "#f59e0b" : "#cbd5e1"} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Attendance Management ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className="glass-card-premium" style={{ padding: '3.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '950', color: '#1e293b', marginBottom: '1rem' }}>Manage Attendance</h3>
            <p style={{ color: '#64748b', fontWeight: '500', marginBottom: '3rem' }}>Help us cook only what's needed. <br/>Save food, save the planet.</p>
            
            <div style={{ marginBottom: '3.5rem' }}>
              <div style={{ width: '100px', height: '100px', background: 'rgba(14, 165, 233, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'var(--accent-primary)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <button onClick={handleMarkAttendance} className="btn-action" style={{ background: attended ? '#10b981' : 'var(--accent-primary)', color: 'white', boxShadow: '0 10px 20px rgba(14, 165, 233, 0.2)' }}>
                {attended ? <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Presence Marked</> : 'Mark Attendance'}
              </button>
              
              <button onClick={handleSkipMeal} className="btn-action" style={{ background: 'white', color: skipped ? '#f43f5e' : '#64748b', border: `2px solid ${skipped ? '#f43f5e' : '#f1f5f9'}` }}>
                {skipped ? <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Meal Skipped</> : 'Skip This Meal'}
              </button>
            </div>
          </div>

          <div className="glass-card-premium" style={{ 
            padding: '2rem', 
            background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', 
            color: 'white', 
            border: 'none',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(14, 165, 233, 0.25)'
          }}>
             <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.2 }}>
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
             </div>
             <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  background: 'rgba(255,255,255,0.2)', 
                  backdropFilter: 'blur(10px)',
                  borderRadius: '18px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>
                </div>
                <div style={{ textAlign: 'left' }}>
                   <h4 style={{ fontSize: '1.2rem', fontWeight: '950', marginBottom: '0.3rem', letterSpacing: '-0.5px' }}>Pro Tip</h4>
                   <p style={{ opacity: 0.9, fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.4' }}>Skip meals 2 hours in advance to help our kitchen reduce prep waste!</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* ── Weekly Dining Table ── */}
      <section className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ background: '#f1f5f9', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <h3 style={{ fontSize: '2rem', fontWeight: '950', letterSpacing: '-1.5px', color: '#1e293b' }}>Weekly Dining Plan</h3>
        </div>

        <div className="glass-card-premium" style={{ padding: '2rem', background: 'white' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="mess-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Breakfast</th>
                  <th>Lunch</th>
                  <th>Dinner</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { day: 'Monday', bf: 'Dosa & Podi', lunch: 'South Indian Thali', dinner: 'Veg Pulao & Raita' },
                  { day: 'Tuesday', bf: 'Poha & Jalebi', lunch: 'Rice, Dal & Sabzi', dinner: 'Phulka & Alu Methi' },
                  { day: 'Wednesday', bf: 'Vada Sambar', lunch: 'Curd Rice & Pickle', dinner: 'Dal Tadka & Jeera Rice' },
                  { day: 'Thursday', bf: 'Upma & Chutney', lunch: 'Roti & Mix Veg', dinner: 'Egg Curry / Paneer' },
                  { day: 'Friday', bf: 'Paratha & Curd', lunch: 'Veg Biryani', dinner: 'Chapati & Mix Sabzi' },
                  { day: 'Saturday', bf: 'Bread Omelette', lunch: 'Fried Rice', dinner: 'Chinese Special' },
                  { day: 'Sunday', bf: 'Puri Bhaji', lunch: 'Sunday Feast', dinner: "Chef's Choice" }
                ].map((menu, idx) => (
                  <tr key={idx}>
                    <td>{menu.day}</td>
                    <td>{menu.bf}</td>
                    <td>{menu.lunch}</td>
                    <td>{menu.dinner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mess;
