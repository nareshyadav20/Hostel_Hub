import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Mess = () => {
  const navigate = useNavigate();
  const [attended, setAttended] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [rating, setRating] = useState(0);
  const [todayMenu, setTodayMenu] = useState({
    breakfast: 'Loading...',
    lunch: 'Loading...',
    dinner: 'Loading...'
  });
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [tenantPlan, setTenantPlan] = useState('basic');
  const [messStats, setMessStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessData = async () => {
      try {
        const [statsRes, menuRes, profileRes] = await Promise.all([
          API.get('/dashboard/mess'),
          API.get('/mess/menu'),
          API.get('/tenants/me')
        ]);
        
        setMessStats(statsRes.data);
        setTenantPlan(profileRes.data.messPlan || 'basic');

        const plan = profileRes.data.messPlan || 'basic';
        const filteredMenu = menuRes.data.filter(m => m.plan === plan);
        
        // Ensure days are in order
        const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const sortedMenu = dayOrder.map(day => {
          const item = filteredMenu.find(m => m.day === day) || { day, breakfast: 'N/A', lunch: 'N/A', dinner: 'N/A' };
          return item;
        });

        setWeeklyMenu(sortedMenu);

        // Get today's menu
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const todayItem = sortedMenu.find(m => m.day === today);
        if (todayItem) {
          setTodayMenu(todayItem);
        } else if (statsRes.data.menuToday) {
          setTodayMenu(statsRes.data.menuToday);
        }
        
      } catch (err) {
        console.error('Error fetching mess data, using fallback data:', err);
        
        // Fallback Mock Data for Mess
        const fallbackMenu = [
          { day: 'Monday', breakfast: 'Poha & Jalebi', lunch: 'Rajma Chawal', dinner: 'Paneer Butter Masala & Roti', plan: 'basic' },
          { day: 'Tuesday', breakfast: 'Idli Sambar', lunch: 'Chole Bhature', dinner: 'Dal Tadka & Jeera Rice', plan: 'basic' },
          { day: 'Wednesday', breakfast: 'Aloo Paratha', lunch: 'Veg Biryani', dinner: 'Mix Veg & Roti', plan: 'basic' },
          { day: 'Thursday', breakfast: 'Upma', lunch: 'Kadhi Pakora', dinner: 'Egg Curry & Rice', plan: 'basic' },
          { day: 'Friday', breakfast: 'Masala Dosa', lunch: 'Dal Makhani', dinner: 'Chicken Curry & Roti', plan: 'basic' },
          { day: 'Saturday', breakfast: 'Puri Sabzi', lunch: 'Veg Fried Rice', dinner: 'Aloo Gobi & Roti', plan: 'basic' },
          { day: 'Sunday', breakfast: 'Bread Omelette', lunch: 'Special Thali', dinner: 'Matar Paneer & Pulao', plan: 'basic' }
        ];
        
        setWeeklyMenu(fallbackMenu);
        
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const todayItem = fallbackMenu.find(m => m.day === today);
        if (todayItem) {
          setTodayMenu(todayItem);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMessData();
  }, []);

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
            background: var(--glass-bg);
            border: 1px solid var(--glass-border);
            border-radius: 32px;
            box-shadow: var(--shadow-lg);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .meal-card {
            padding: 2rem;
            border-radius: 24px;
            background: var(--bg-tertiary);
            border: 1px solid var(--border-color);
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
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            text-align: left;
          }
          .mess-table td {
            padding: 1.5rem 2rem;
            background: var(--bg-secondary);
            border-top: 1px solid var(--border-color);
            border-bottom: 1px solid var(--border-color);
            font-size: 0.95rem;
            font-weight: 600;
            color: var(--text-primary);
          }
          .mess-table td:first-child {
            border-left: 1px solid var(--border-color);
            border-top-left-radius: 16px;
            border-bottom-left-radius: 16px;
            color: var(--accent-primary);
            font-weight: 900;
          }
          .mess-table td:last-child {
            border-right: 1px solid var(--border-color);
            border-top-right-radius: 16px;
            border-bottom-right-radius: 16px;
          }
          .mess-table tr:hover td {
            background: var(--bg-tertiary);
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
          <h1 style={{ fontSize: '2.8rem', fontWeight: '950', letterSpacing: '-2px', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1.2rem', color: 'var(--text-primary)' }}>
            <div style={{ background: 'var(--accent-primary)', width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            </div>
            Dining Portal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', fontWeight: '500' }}>Curated nutrition and meal management for a healthy campus life.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Session</p>
            <p style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--accent-primary)' }}>Lunch (12:30 - 2:30 PM)</p>
         </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '3rem', marginBottom: '5rem' }}>
        {/* ── Today's Menu Section ── */}
        <div className="glass-card-premium" style={{ padding: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '950', color: 'var(--text-primary)' }}>Today's Specials</h3>
            <div style={{ background: 'var(--bg-tertiary)', color: 'var(--accent-warning)', padding: '0.6rem 1.2rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
              4.8 Chef's Rating
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { type: 'Breakfast', menu: todayMenu.breakfast, icon: '🍳', color: 'var(--accent-info)' },
              { type: 'Lunch', menu: todayMenu.lunch, icon: '🍛', color: 'var(--accent-success)' },
              { type: 'Dinner', menu: todayMenu.dinner, icon: '🥗', color: 'var(--accent-warning)' }
            ].map((meal, idx) => (
              <div key={idx} className="meal-card">
                <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', fontSize: '5rem', opacity: 0.05 }}>{meal.icon}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '900', color: meal.color, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{meal.type}</span>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '0.4rem' }}>{meal.menu}</h4>
                  </div>
                  <div style={{ width: '44px', height: '44px', background: 'var(--bg-primary)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {meal.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '3.5rem', padding: '2rem', background: 'var(--bg-tertiary)', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <p style={{ fontWeight: '800', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>How was your last meal?</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', transform: star <= rating ? 'scale(1.2)' : 'scale(1)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill={star <= rating ? "var(--accent-warning)" : "none"} stroke={star <= rating ? "var(--accent-warning)" : "var(--text-muted)"} strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Attendance Management ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <div className="glass-card-premium" style={{ padding: '3.5rem', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '950', color: 'var(--text-primary)', marginBottom: '1rem' }}>Manage Attendance</h3>
            <p style={{ color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '3rem' }}>Help us cook only what's needed. <br/>Save food, save the planet.</p>
            
            <div style={{ marginBottom: '3.5rem' }}>
              <div style={{ width: '100px', height: '100px', background: 'var(--bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', color: 'var(--accent-primary)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <button onClick={handleMarkAttendance} className="btn-action" style={{ background: attended ? 'var(--accent-success)' : 'var(--accent-primary)', color: 'white' }}>
                {attended ? <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Presence Marked</> : 'Mark Attendance'}
              </button>
              
              <button onClick={handleSkipMeal} className="btn-action" style={{ background: 'var(--bg-secondary)', color: skipped ? 'var(--accent-error)' : 'var(--text-secondary)', border: `2px solid ${skipped ? 'var(--accent-error)' : 'var(--border-color)'}` }}>
                {skipped ? <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Meal Skipped</> : 'Skip This Meal'}
              </button>
            </div>
          </div>

          <div className="glass-card-premium" style={{ 
            padding: '2rem', 
            background: 'var(--accent-primary)', 
            color: 'white', 
            border: 'none',
            position: 'relative',
            overflow: 'hidden'
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
                  justifyContent: 'center'
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
      {/* Weekly Menu Table */}
      <section style={{ marginTop: '4rem' }} className="fade-in-up">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '950', letterSpacing: '-1px' }}>Weekly Dining Plan</h3>
          </div>
          <span style={{ 
            padding: '0.6rem 1.4rem', borderRadius: '50px', background: 'var(--accent-primary)', color: 'white', 
            fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' 
          }}>
            Active Plan: {tenantPlan}
          </span>
        </div>

        <div className="glass-card-premium" style={{ padding: '2rem', background: 'var(--bg-secondary)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="mess-table">
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Day</th>
                  <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Breakfast</th>
                  <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Lunch</th>
                  <th style={{ padding: '1.5rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Dinner</th>
                </tr>
              </thead>
              <tbody>
                {weeklyMenu.map((menu, idx) => (
                  <tr key={idx} style={{ 
                    borderBottom: '1px solid var(--border-color)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                    transition: 'background 0.3s ease'
                  }} className="menu-row-hover">
                    <td style={{ padding: '1.2rem 2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{menu.day}</td>
                    <td style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{menu.breakfast}</td>
                    <td style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{menu.lunch}</td>
                    <td style={{ padding: '1.2rem 2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{menu.dinner}</td>
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
