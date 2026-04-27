import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Calendar as CalendarIcon, Users, Edit3, ArrowRight, Sun, Coffee, Moon, CheckCircle, X } from 'lucide-react';

const Mess = () => {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'subscriptions'
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([
    { 
      id: 'p1', 
      name: 'Basic Plan', 
      price: 0, 
      description: 'Essential nourishment for budget-conscious students.',
      features: ['2 Full Meals/Day', 'Standard Menu Items', 'Fixed Schedule', 'No Customization'], 
      menu: ['Steamed Rice', 'Arhar Dal Tadka', 'Seasonal Dry Veg', 'Phulka Roti', 'Pickle'],
      active: true, 
      color: '#94a3b8' 
    },
    { 
      id: 'p2', 
      name: 'Standard Plan', 
      price: 1000, 
      description: 'The perfect balance of variety and value.',
      features: ['3 Full Meals/Day', 'Evening Tea & Snacks', 'Weekly Special Menu', 'Partial Customization'], 
      menu: ['Jeera Rice / Pulao', 'Paneer / Egg Curry (2x/week)', 'Mixed Veg Fry', 'Roti / Paratha', 'Sweet/Fruit Bowl'],
      active: true, 
      color: '#3b82f6' 
    },
    { 
      id: 'p3', 
      name: 'Premium Plan', 
      price: 1500, 
      description: 'Executive dining experience with unlimited choices.',
      features: ['Unlimited Buffet Access', 'Live Counter Access', 'Premium Add-ons (Milk/Ghee)', 'Anytime Meal Requests'], 
      menu: ['Basmati Pulao / Biryani', 'Daily Premium Gravy', 'Cold Drink / Juice', 'Live Paratha / Dosa', 'Premium Desserts'],
      active: true, 
      color: '#8b5cf6', 
      popular: true 
    },
  ]);

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [menuData, setMenuData] = useState({
    Monday: { breakfast: 'Idli, Sambar & Chutney', lunch: 'Rice, Dal, Veg Fry & Curd', dinner: 'Roti, Paneer Masala & Salad' },
    Tuesday: { breakfast: 'Poha, Jalebi & Tea', lunch: 'Rajma Chawal, Raita & Papad', dinner: 'Aloo Gobi, Roti & Dal' },
    Wednesday: { breakfast: 'Aloo Paratha, Curd & Pickle', lunch: 'Veg Biryani, Raita & Salan', dinner: 'Chole Bhature & Salad' },
    Thursday: { breakfast: 'Upma, Coconut Chutney', lunch: 'Kadi Pakoda, Rice & Chapati', dinner: 'Mushroom Peas, Roti' },
    Friday: { breakfast: 'Masala Dosa, Sambar', lunch: 'Dal Makhani, Jeera Rice', dinner: 'Egg Curry / Paneer Bhurji' },
    Saturday: { breakfast: 'Puri Sabzi, Halwa', lunch: 'Mix Veg, Roti, Dal Tadka', dinner: 'Veg Pulao, Manchurian' },
    Sunday: { breakfast: 'Chole Poori, Lassi', lunch: 'Special Thali (Chicken / Paneer)', dinner: 'Light Khichdi & Soup' }
  });

  const [editForm, setEditForm] = useState({ breakfast: '', lunch: '', dinner: '' });
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const attendanceStats = [
    { meal: 'Breakfast', expected: 140, joined: 112, next: false },
    { meal: 'Lunch', expected: 135, joined: 0, next: true },
    { meal: 'Dinner', expected: 145, joined: 0, next: false }
  ];

  const handleEditClick = () => {
    setEditForm(menuData[selectedDay]);
    setIsEditModalOpen(true);
  };

  const handleSaveMenu = (e) => {
    e.preventDefault();
    setMenuData({ ...menuData, [selectedDay]: editForm });
    setIsEditModalOpen(false);
  };

  const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '100%' };

  return (
    <div className="mess-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={32} color="var(--accent-primary)" /> Mess Management
          </h1>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button onClick={() => setActiveTab('menu')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === 'menu' ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: activeTab === 'menu' ? 'white' : 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer' }}>Menu & Attendance</button>
            <button onClick={() => setActiveTab('subscriptions')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === 'subscriptions' ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: activeTab === 'subscriptions' ? 'white' : 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer' }}>Subscriptions ⭐</button>
          </div>
        </div>
        {activeTab === 'menu' && (
          <button onClick={handleEditClick} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <Edit3 size={16} /> Edit {selectedDay}'s Menu
          </button>
        )}
      </header>

      {activeTab === 'subscriptions' ? (
        <>
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
              {plans.map(plan => (
                <motion.div key={plan.id} whileHover={{ y: -5 }} className="card" style={{ 
                  padding: '2rem', borderRadius: '24px', position: 'relative', overflow: 'hidden',
                  border: plan.popular ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                  background: plan.popular ? 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(139, 92, 246, 0.05) 100%)' : 'var(--bg-secondary)'
                }}>
                  {plan.popular && (
                    <div style={{ position: 'absolute', top: '1.5rem', right: '-2.5rem', background: 'var(--accent-primary)', color: 'white', padding: '0.3rem 3rem', transform: 'rotate(45deg)', fontSize: '0.75rem', fontWeight: '900', letterSpacing: '1px' }}>MOST POPULAR 🔥</div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '16px', background: `${plan.color}20`, color: plan.color }}>
                      <Utensils size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{plan.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monthly Subscription</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: '2rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '900' }}>₹{plan.price}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>/month</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                    {plan.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <CheckCircle size={16} color="var(--accent-success)" /> {f}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button 
                      onClick={() => setSelectedPlan(plan)}
                      className="btn" 
                      style={{ flex: 1, border: '1px solid var(--border-color)', fontWeight: '700' }}
                    >
                      View Details
                    </button>
                    <button className="btn btn-primary" style={{ flex: 2, fontWeight: '700' }}>{plan.active ? 'Deactivate' : 'Activate'}</button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>Subscription Settings</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                  <div><p style={{ fontWeight: '700', fontSize: '0.9rem' }}>Allow Customization</p><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>For Premium users</p></div>
                  <div style={{ width: '40px', height: '20px', background: 'var(--accent-primary)', borderRadius: '10px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                  <div><p style={{ fontWeight: '700', fontSize: '0.9rem' }}>Meal Skips</p><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enable credits for skips</p></div>
                  <div style={{ width: '40px', height: '20px', background: 'var(--border-color)', borderRadius: '10px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                  <div><p style={{ fontWeight: '700', fontSize: '0.9rem' }}>Guest Tokens</p><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Enable guest purchases</p></div>
                  <div style={{ width: '40px', height: '20px', background: 'var(--accent-primary)', borderRadius: '10px' }} />
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
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
                <button className="btn" onClick={() => alert('Opening Monthly Mess Report...')} style={{ width: '100%', marginTop: '1.5rem', border: '1px solid var(--border-color)', fontSize: '0.8rem' }}>View Monthly Report</button>
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
                    <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{menuData[selectedDay].breakfast}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', borderRadius: '50%' }}>
                    <Coffee size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-success)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Lunch (1:00 PM - 3:00 PM)</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{menuData[selectedDay].lunch}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-primary)', border: '1px solid rgba(99, 102, 241, 0.3)', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                  <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-secondary)', borderRadius: '50%' }}>
                    <Moon size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem' }}>Dinner (8:00 PM - 10:30 PM)</p>
                    <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{menuData[selectedDay].dinner}</p>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {selectedPlan && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} 
              onClick={() => setSelectedPlan(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              style={{ 
                position: 'relative', 
                width: '100%', 
                maxWidth: '550px', 
                maxHeight: '90vh',
                overflowY: 'auto',
                background: 'var(--bg-primary)', 
                padding: '2.5rem', 
                borderRadius: '28px', 
                zIndex: 1001, 
                boxShadow: 'var(--shadow-2xl)', 
                border: '1px solid var(--border-color)',
                scrollbarWidth: 'none', /* Firefox */
                msOverflowStyle: 'none' /* IE/Edge */
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.2rem', borderRadius: '18px', background: `${selectedPlan.color}20`, color: selectedPlan.color }}>
                  <Utensils size={28} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0, letterSpacing: '-0.02em' }}>{selectedPlan.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '600' }}>Comprehensive Benefits</p>
                </div>
                <button onClick={() => setSelectedPlan(null)} style={{ background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', fontWeight: '500' }}>{selectedPlan.description}</p>
                
                <div style={{ background: 'rgba(99, 102, 241, 0.03)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '1.2rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={16} color="var(--accent-primary)" /> CORE BENEFITS
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {selectedPlan.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)' }} /> {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <Utensils size={18} /> SAMPLE MENU INCLUSIONS
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.8rem' }}>
                    {selectedPlan.menu.map((item, i) => (
                      <div key={i} style={{ padding: '0.7rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', textAlign: 'center', transition: 'transform 0.2s ease' }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button onClick={() => setSelectedPlan(null)} className="btn btn-primary" style={{ flex: 1, padding: '1.2rem', fontSize: '1rem', borderRadius: '16px' }}>Got it, thanks!</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isEditModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsEditModalOpen(false)} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={{ position: 'fixed', top: '15%', left: '50%', x: '-50%', width: '90%', maxWidth: '500px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Update {selectedDay}'s Menu</h2>
              <form onSubmit={handleSaveMenu} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Breakfast</label>
                  <input value={editForm.breakfast} onChange={e => setEditForm({...editForm, breakfast: e.target.value})} style={inputStyle} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Lunch</label>
                  <input value={editForm.lunch} onChange={e => setEditForm({...editForm, lunch: e.target.value})} style={inputStyle} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Dinner</label>
                  <input value={editForm.dinner} onChange={e => setEditForm({...editForm, dinner: e.target.value})} style={inputStyle} required />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn btn-primary" type="submit" style={{ flex: 1, padding: '1rem' }}>Save Menu</button>
                  <button className="btn" type="button" onClick={() => setIsEditModalOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Mess;
