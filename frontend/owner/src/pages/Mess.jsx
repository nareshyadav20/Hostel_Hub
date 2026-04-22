import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Calendar as CalendarIcon, Users, Edit3, ArrowRight, Sun, Coffee, Moon } from 'lucide-react';

const Mess = () => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  
  const weeklyMenu = {
    Monday: { breakfast: 'Idli, Sambar & Chutney', lunch: 'Rice, Dal, Veg Fry & Curd', dinner: 'Roti, Paneer Masala & Salad' },
    Tuesday: { breakfast: 'Poha, Jalebi & Tea', lunch: 'Rajma Chawal, Raita & Papad', dinner: 'Aloo Gobi, Roti & Dal' },
    Wednesday: { breakfast: 'Aloo Paratha, Curd & Pickle', lunch: 'Veg Biryani, Raita & Salan', dinner: 'Chole Bhature & Salad' },
    Thursday: { breakfast: 'Upma, Coconut Chutney', lunch: 'Kadi Pakoda, Rice & Chapati', dinner: 'Mushroom Peas, Roti' },
    Friday: { breakfast: 'Masala Dosa, Sambar', lunch: 'Dal Makhani, Jeera Rice', dinner: 'Egg Curry / Paneer Bhurji' },
    Saturday: { breakfast: 'Puri Sabzi, Halwa', lunch: 'Mix Veg, Roti, Dal Tadka', dinner: 'Veg Pulao, Manchurian' },
    Sunday: { breakfast: 'Chole Poori, Lassi', lunch: 'Special Thali (Chicken / Paneer)', dinner: 'Light Khichdi & Soup' }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const attendanceStats = [
    { meal: 'Breakfast', expected: 140, joined: 112, next: false },
    { meal: 'Lunch', expected: 135, joined: 0, next: true }, // next indicates upcoming meal
    { meal: 'Dinner', expected: 145, joined: 0, next: false }
  ];

  return (
    <div className="mess-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={32} color="var(--accent-primary)" /> Mess Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Plan daily meals and track mess attendance.</p>
        </div>
        <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
          <Edit3 size={16} /> Edit Selected Day
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '2rem' }}>
        
        {/* Left Column: Meal Stats & Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
               <Users size={18} color="var(--accent-primary)" /> Today's Attendance
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {attendanceStats.map((stat, idx) => (
                <div key={idx} style={{ 
                  padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)',
                  background: stat.next ? 'rgba(14, 165, 233, 0.05)' : 'var(--bg-tertiary)',
                  borderColor: stat.next ? 'rgba(14, 165, 233, 0.3)' : 'var(--border-color)'
                }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                     <p style={{ fontWeight: '700', fontSize: '0.9rem', color: stat.next ? 'var(--accent-primary)' : 'var(--text-primary)' }}>{stat.meal}</p>
                     {stat.next && <span style={{ fontSize: '0.7rem', background: 'var(--accent-primary)', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', textTransform: 'uppercase', fontWeight: '700' }}>Upcoming</span>}
                   </div>
                   <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                     <div>
                       <p style={{ fontSize: '1.4rem', fontWeight: '800' }}>{stat.joined}</p>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Joined so far</p>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                       <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-secondary)' }}>{stat.expected}</p>
                       <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expected</p>
                     </div>
                   </div>
                   {/* Mini Progress Bar */}
                   <div style={{ width: '100%', height: '4px', background: 'var(--border-color)', borderRadius: '2px', marginTop: '1rem', overflow: 'hidden' }}>
                      <div style={{ width: `${(stat.joined / stat.expected) * 100}%`, height: '100%', background: stat.next ? 'var(--text-muted)' : 'var(--accent-success)', transition: 'width 0.5s ease' }} />
                   </div>
                </div>
              ))}
            </div>
            <button className="btn" style={{ width: '100%', marginTop: '1.5rem', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>View Monthly Report</button>
          </div>
        </div>

        {/* Right Column: Weekly Menu Planner */}
        <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
           <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <CalendarIcon size={20} color="var(--accent-primary)"/> Weekly Menu Plan
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Valid for current week</p>
           </div>
           
           {/* Day Selector */}
           <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
             {days.map(day => (
                <button 
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{ 
                    padding: '1rem 1.5rem', background: 'transparent', border: 'none', borderBottom: selectedDay === day ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    color: selectedDay === day ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: selectedDay === day ? '700' : '500', fontSize: '0.9rem', cursor: 'pointer', transition: 'var(--transition-fast)'
                  }}
                >
                   {day.substring(0,3)}
                </button>
             ))}
           </div>

           {/* Menu Display for Selected Day */}
           <motion.div 
             key={selectedDay}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.3 }}
             style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.5rem', flex: 1, alignContent: 'start' }}
           >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid rgba(245, 158, 11, 0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)', borderRadius: '50%' }}>
                  <Sun size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-warning)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Breakfast (8:00 AM - 10:00 AM)</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{weeklyMenu[selectedDay].breakfast}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', borderRadius: '50%' }}>
                  <Coffee size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-success)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Lunch (1:00 PM - 3:00 PM)</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{weeklyMenu[selectedDay].lunch}</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid rgba(99, 102, 241, 0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-secondary)', borderRadius: '50%' }}>
                  <Moon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Dinner (8:00 PM - 10:30 PM)</p>
                  <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{weeklyMenu[selectedDay].dinner}</p>
                </div>
              </div>
           </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Mess;
