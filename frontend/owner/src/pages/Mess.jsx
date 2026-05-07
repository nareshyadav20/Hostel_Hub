import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Calendar as CalendarIcon, Users, Edit3, ArrowRight, Sun, Coffee, Moon, CheckCircle, X, Grid, List } from 'lucide-react';
import { api } from '../mockData';

const Mess = () => {
  const { buildingId: urlBuildingId } = useParams();
  const activeBuildingId = urlBuildingId || localStorage.getItem('selectedBuildingId');
  const buildingId = activeBuildingId;

  const todayDay = new Date().toLocaleDateString('en-GB', { weekday: 'long' });
  const todayISO = new Date().toISOString().split('T')[0];

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'attendance' | 'menu' | 'subscriptions'
  const [menuView, setMenuView] = useState('daily'); // 'daily' | 'weekly'
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const [plans, setPlans] = useState([
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 500,
      description: 'Simple meals with a fixed weekly menu for standard nourishment.',
      features: ['Simple Meals', 'Fixed Weekly Menu', 'Limited Variety', 'No Customization', 'Fixed Portion'],
      menu: ['Steamed Rice', 'Arhar Dal', 'Seasonal Dry Veg', 'Phulka Roti', 'Pickle'],
      active: true,
      color: '#94a3b8'
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: 1000,
      description: 'Improved meal quality with rotating weekly menu and limited customization.',
      features: ['Improved Meal Quality', 'Rotating Weekly Menu', 'Moderate Variety', 'Limited Customization', '1 Refill Allowed'],
      menu: ['Jeera Rice / Pulao', 'Paneer / Egg Curry', 'Mixed Veg Fry', 'Roti / Paratha', 'Sweet Bowl'],
      active: true,
      color: '#3b82f6'
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 1500,
      description: 'High-quality meals with fully customizable menu and premium add-ons.',
      features: ['High-Quality Meals', 'Fully Customizable Menu', 'Rich Variety (Veg + Non-Veg)', 'Unlimited/Refill Option', 'Special Weekend Meals', 'Fruits, Juice, Dessert'],
      menu: ['Basmati Pulao / Biryani', 'Daily Premium Gravy', 'Cold Drink / Juice', 'Live Paratha / Dosa', 'Premium Desserts'],
      active: true,
      color: '#8b5cf6',
      popular: true
    },
  ]);

  const [selectedDay, setSelectedDay] = useState(new Date().toLocaleDateString('en-US', { weekday: 'long' }));
  const [selectedMenuPlan, setSelectedMenuPlan] = useState('basic');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [planToDeactivate, setPlanToDeactivate] = useState(null);

  const [menuData, setMenuData] = useState({});
  const [tenants, setTenants] = useState([]);
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    const fetchMenu = async () => {
      if (!activeBuildingId) return;
      setLoading(true);
      try {
        const raw = await api.getMessMenu(activeBuildingId);
        const structured = { basic: {}, standard: {}, premium: {} };
        if (Array.isArray(raw)) {
          raw.forEach(item => {
            if (structured[item.plan]) {
              structured[item.plan][item.day] = {
                breakfast: item.breakfast,
                lunch: item.lunch,
                dinner: item.dinner
              };
            }
          });
        }
        setMenuData(structured);
      } catch (err) {
        console.error('Failed to fetch mess menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [activeBuildingId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const t = await api.getTenants();
        setTenants(t.filter(x => x.buildingId === activeBuildingId || !activeBuildingId));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [activeBuildingId]);

  useEffect(() => {
    const fetchAttendance = async () => {
      if (activeTab !== 'attendance' && activeTab !== 'dashboard') return;
      if (!activeBuildingId) return;
      setAttendanceLoading(true);
      try {
        const data = await api.getMessAttendance(activeBuildingId, todayISO);
        const attMap = {};
        data.forEach(item => {
          attMap[item.tenantId] = {
            breakfast: item.breakfast,
            lunch: item.lunch,
            dinner: item.dinner
          };
        });
        setAttendance({ [todayISO]: attMap });
      } catch (err) {
        console.error('Failed to fetch attendance:', err);
      } finally {
        setAttendanceLoading(false);
      }
    };
    fetchAttendance();
  }, [activeBuildingId, activeTab, todayISO]);

  const [editForm, setEditForm] = useState({ breakfast: '', lunch: '', dinner: '' });
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleEditClick = () => {
    if (!menuData[selectedMenuPlan] || !menuData[selectedMenuPlan][selectedDay]) {
      setEditForm({ breakfast: '', lunch: '', dinner: '' });
    } else {
      setEditForm(menuData[selectedMenuPlan][selectedDay]);
    }
    setIsEditModalOpen(true);
  };

  const handleSaveMenu = async (e) => {
    e.preventDefault();
    try {
      await api.updateMessMenu({
        buildingId: activeBuildingId,
        plan: selectedMenuPlan,
        day: selectedDay,
        ...editForm
      });

      setMenuData({
        ...menuData,
        [selectedMenuPlan]: {
          ...menuData[selectedMenuPlan],
          [selectedDay]: editForm
        }
      });
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to save menu:', err);
    }
  };

  const toggleAttendance = async (tenantId, meal) => {
    const dayAttendance = attendance[todayISO] || {};
    const tenantAttendance = dayAttendance[tenantId] || { breakfast: false, lunch: false, dinner: false };
    const newStatus = !tenantAttendance[meal];

    try {
      await api.updateMessAttendance({
        tenantId,
        buildingId: activeBuildingId,
        date: todayISO,
        meal,
        status: newStatus
      });

      setAttendance({
        ...attendance,
        [todayISO]: {
          ...dayAttendance,
          [tenantId]: {
            ...tenantAttendance,
            [meal]: newStatus
          }
        }
      });
    } catch (err) {
      console.error('Failed to update attendance:', err);
    }
  };

  const markAllPresent = async (meal) => {
    const tenantIds = tenants.map(t => t.id);
    try {
      await api.markAllMessAttendance({
        buildingId: activeBuildingId,
        date: todayISO,
        meal,
        tenantIds
      });

      const dayAttendance = attendance[todayISO] || {};
      const newDayAttendance = { ...dayAttendance };

      tenants.forEach(t => {
        newDayAttendance[t.id] = {
          ...(newDayAttendance[t.id] || { breakfast: false, lunch: false, dinner: false }),
          [meal]: true
        };
      });

      setAttendance({
        ...attendance,
        [todayISO]: newDayAttendance
      });
    } catch (err) {
      console.error('Failed to mark all present:', err);
    }
  };

  const getAttendanceStats = () => {
    const dayAttendance = attendance[todayISO] || {};
    const stats = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      total: tenants.length,
      planUsage: { premium: 0, standard: 0, basic: 0 }
    };

    tenants.forEach(tenant => {
      const plan = (tenant.messPlan || 'basic').toLowerCase();
      if (stats.planUsage.hasOwnProperty(plan)) {
        stats.planUsage[plan]++;
      }

      const att = dayAttendance[tenant.id];
      if (att) {
        if (att.breakfast) stats.breakfast++;
        if (att.lunch) stats.lunch++;
        if (att.dinner) stats.dinner++;
      }
    });

    return stats;
  };

  const stats = getAttendanceStats();

  const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', width: '100%' };

  return (
    <div className="mess-page" style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={32} color="var(--accent-primary)" /> Premium Mess Control
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => setActiveTab('dashboard')} style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', border: 'none', background: activeTab === 'dashboard' ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: activeTab === 'dashboard' ? 'white' : 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Dashboard</button>
            <button onClick={() => setActiveTab('attendance')} style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', border: 'none', background: activeTab === 'attendance' ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: activeTab === 'attendance' ? 'white' : 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Attendance</button>
            <button onClick={() => setActiveTab('menu')} style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', border: 'none', background: activeTab === 'menu' ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: activeTab === 'menu' ? 'white' : 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Menu Plan</button>
            <button onClick={() => setActiveTab('subscriptions')} style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', border: 'none', background: activeTab === 'subscriptions' ? 'var(--accent-primary)' : 'var(--bg-tertiary)', color: activeTab === 'subscriptions' ? 'white' : 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}>Plans ⭐</button>
          </div>
        </div>
        {activeTab === 'menu' && (
          <button onClick={handleEditClick} className="btn" style={{ background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', borderRadius: '12px', padding: '0.8rem 1.5rem', border: 'none', cursor: 'pointer' }}>
            <Edit3 size={16} /> Edit Menu
          </button>
        )}
      </header>

      {activeTab === 'dashboard' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Total Meals Today</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginTop: '0.5rem' }}>{stats.breakfast + stats.lunch + stats.dinner}</h2>
              <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.5rem' }}>↑ 12% from yesterday</p>
            </div>
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Premium Usage</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginTop: '0.5rem' }}>{stats.planUsage.premium}</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Active premium subscribers</p>
            </div>
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #ef4444' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Skipped Meals</p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginTop: '0.5rem' }}>{Math.max(0, tenants.length * 3 - (stats.breakfast + stats.lunch + stats.dinner))}</h2>
              <p style={{ fontSize: '0.8rem', color: '#ef4444', marginTop: '0.5rem' }}>Based on total subscribers</p>
            </div>
            <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '600' }}>Peak Usage Time</p>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '0.5rem' }}>1:30 PM</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>During Lunch hours</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '2rem' }}>Meal Consumption Analytics</h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2rem', height: '200px', paddingBottom: '2rem' }}>
                {[
                  { label: 'Breakfast', val: stats.breakfast, color: '#f59e0b' },
                  { label: 'Lunch', val: stats.lunch, color: '#10b981' },
                  { label: 'Dinner', val: stats.dinner, color: '#6366f1' }
                ].map(bar => (
                  <div key={bar.label} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <div style={{ width: '100%', background: bar.color, borderRadius: '8px 8px 0 0', height: tenants.length ? `${(bar.val / tenants.length) * 100}%` : '0%', minHeight: '10px', transition: 'height 0.5s ease' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>Most Preferred</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { dish: 'Paneer Masala', score: 98, color: '#8b5cf6' },
                  { dish: 'Veg Biryani', score: 85, color: '#3b82f6' },
                  { dish: 'Aloo Paratha', score: 72, color: '#94a3b8' }
                ].map((fav, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: '700' }}>{fav.dish}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{fav.score}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px' }}>
                      <div style={{ width: `${fav.score}%`, height: '100%', background: fav.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-tertiary)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Resident Meal Attendance - {todayDay}</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => markAllPresent('breakfast')} className="btn" style={{ fontSize: '0.75rem', background: '#f59e0b20', color: '#f59e0b', border: '1px solid #f59e0b40' }}>Mark All Breakfast</button>
                <button onClick={() => markAllPresent('lunch')} className="btn" style={{ fontSize: '0.75rem', background: '#10b98120', color: '#10b981', border: '1px solid #10b98140' }}>Mark All Lunch</button>
                <button onClick={() => markAllPresent('dinner')} className="btn" style={{ fontSize: '0.75rem', background: '#6366f120', color: '#6366f1', border: '1px solid #6366f140' }}>Mark All Dinner</button>
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: 'var(--bg-secondary)' }}>
                  <th style={{ padding: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>NAME</th>
                  <th style={{ padding: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>ROOM</th>
                  <th style={{ padding: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>PLAN</th>
                  <th style={{ padding: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>BREAKFAST</th>
                  <th style={{ padding: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>LUNCH</th>
                  <th style={{ padding: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>DINNER</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map(tenant => {
                  const att = (attendance[todayISO] && attendance[todayISO][tenant.id]) || { breakfast: false, lunch: false, dinner: false };
                  const plan = (tenant.messPlan || 'basic');
                  const planCapitalized = plan.charAt(0).toUpperCase() + plan.slice(1);
                  return (
                    <tr key={tenant.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: attendanceLoading ? 0.6 : 1 }}>
                      <td style={{ padding: '1.2rem', fontWeight: '700' }}>{tenant.name}</td>
                      <td style={{ padding: '1.2rem' }}>{tenant.room}</td>
                      <td style={{ padding: '1.2rem' }}>
                        <span style={{
                          padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800',
                          background: plan === 'premium' ? '#8b5cf620' : plan === 'standard' ? '#3b82f620' : '#94a3b820',
                          color: plan === 'premium' ? '#8b5cf6' : plan === 'standard' ? '#3b82f6' : '#94a3b8'
                        }}>{planCapitalized}</span>
                      </td>
                      <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                        <button onClick={() => toggleAttendance(tenant.id, 'breakfast')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: att.breakfast ? '#f59e0b' : 'var(--border-color)' }}>
                          <CheckCircle size={24} fill={att.breakfast ? '#f59e0b20' : 'transparent'} />
                        </button>
                      </td>
                      <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                        <button onClick={() => toggleAttendance(tenant.id, 'lunch')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: att.lunch ? '#10b981' : 'var(--border-color)' }}>
                          <CheckCircle size={24} fill={att.lunch ? '#10b98120' : 'transparent'} />
                        </button>
                      </td>
                      <td style={{ padding: '1.2rem', textAlign: 'center' }}>
                        <button onClick={() => toggleAttendance(tenant.id, 'dinner')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: att.dinner ? '#6366f1' : 'var(--border-color)' }}>
                          <CheckCircle size={24} fill={att.dinner ? '#6366f120' : 'transparent'} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'menu' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => setMenuView('daily')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', borderRadius: '12px', border: 'none',
                background: menuView === 'daily' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: menuView === 'daily' ? 'white' : 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer'
              }}
            >
              <List size={18} /> Daily Detail
            </button>
            <button
              onClick={() => setMenuView('weekly')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.5rem', borderRadius: '12px', border: 'none',
                background: menuView === 'weekly' ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                color: menuView === 'weekly' ? 'white' : 'var(--text-secondary)', fontWeight: '700', cursor: 'pointer'
              }}
            >
              <Grid size={18} /> Weekly Overview
            </button>
          </div>

          {loading ? (
            <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>Loading menu data...</div>
          ) : menuView === 'weekly' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {days.map(day => (
                <div key={day} className="card" style={{ padding: '1.5rem', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, fontWeight: '800', color: 'var(--accent-primary)' }}>{day}</h4>
                    <button onClick={() => { setSelectedDay(day); handleEditClick(); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit3 size={14} /></button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <Sun size={14} color="#f59e0b" />
                      <div style={{ fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: '800', color: '#f59e0b', fontSize: '0.7rem', display: 'block' }}>BREAKFAST</span>
                        <span style={{ fontWeight: '600' }}>{menuData[selectedMenuPlan]?.[day]?.breakfast || 'Not Set'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <Coffee size={14} color="#10b981" />
                      <div style={{ fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: '800', color: '#10b981', fontSize: '0.7rem', display: 'block' }}>LUNCH</span>
                        <span style={{ fontWeight: '600' }}>{menuData[selectedMenuPlan]?.[day]?.lunch || 'Not Set'}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                      <Moon size={14} color="#6366f1" />
                      <div style={{ fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: '800', color: '#6366f1', fontSize: '0.7rem', display: 'block' }}>DINNER</span>
                        <span style={{ fontWeight: '600' }}>{menuData[selectedMenuPlan]?.[day]?.dinner || 'Not Set'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1.5rem' }}>Select Plan</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {plans.map(plan => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedMenuPlan(plan.id)}
                        style={{
                          padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)',
                          background: selectedMenuPlan === plan.id ? `${plan.color}15` : 'var(--bg-tertiary)',
                          borderColor: selectedMenuPlan === plan.id ? plan.color : 'var(--border-color)',
                          color: selectedMenuPlan === plan.id ? plan.color : 'var(--text-secondary)',
                          fontWeight: '700', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {plan.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', background: 'var(--accent-primary)', color: 'white' }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: '600', opacity: 0.8 }}>Active Menu</p>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginTop: '0.5rem' }}>{selectedDay}'s Menu</h3>
                  <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.9 }}>You are currently viewing the menu for the <b>{selectedMenuPlan}</b> tier.</p>
                </div>
              </div>

              <div className="card" style={{ padding: '0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                  {days.map(day => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      style={{
                        padding: '1.2rem 2rem', background: 'transparent', border: 'none', borderBottom: selectedDay === day ? `3px solid var(--accent-primary)` : '3px solid transparent',
                        color: selectedDay === day ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        fontWeight: selectedDay === day ? '800' : '600', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <motion.div
                  key={`${selectedMenuPlan}-${selectedDay}`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ padding: '2.5rem', display: 'grid', gap: '2rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', borderRadius: '24px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ padding: '1.2rem', background: '#f59e0b15', color: '#f59e0b', borderRadius: '20px' }}><Sun size={32} /></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Breakfast (8:00 AM - 10:00 AM)</p>
                      <p style={{ fontSize: '1.4rem', fontWeight: '700' }}>{menuData[selectedMenuPlan]?.[selectedDay]?.breakfast || 'Not Set'}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', borderRadius: '24px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ padding: '1.2rem', background: '#10b98115', color: '#10b981', borderRadius: '20px' }}><Coffee size={32} /></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Lunch (1:00 PM - 3:00 PM)</p>
                      <p style={{ fontSize: '1.4rem', fontWeight: '700' }}>{menuData[selectedMenuPlan]?.[selectedDay]?.lunch || 'Not Set'}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', borderRadius: '24px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ padding: '1.2rem', background: '#6366f115', color: '#6366f1', borderRadius: '20px' }}><Moon size={32} /></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.5rem' }}>Dinner (8:00 PM - 10:30 PM)</p>
                      <p style={{ fontSize: '1.4rem', fontWeight: '700' }}>{menuData[selectedMenuPlan]?.[selectedDay]?.dinner || 'Not Set'}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'subscriptions' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            {plans.map(plan => (
              <motion.div key={plan.id} whileHover={{ y: -10 }} className="card" style={{
                padding: '2.5rem', borderRadius: '32px', position: 'relative', overflow: 'hidden',
                border: plan.popular ? `3px solid ${plan.color}` : '1px solid var(--border-color)',
                background: plan.popular ? `linear-gradient(135deg, var(--bg-secondary) 0%, ${plan.color}05 100%)` : 'var(--bg-secondary)'
              }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '1.5rem', right: '-3rem', background: plan.color, color: 'white', padding: '0.4rem 4rem', transform: 'rotate(45deg)', fontSize: '0.8rem', fontWeight: '900', letterSpacing: '1px', boxShadow: 'var(--shadow-md)' }}>PREMIUM</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
                  <div style={{ padding: '1.2rem', borderRadius: '20px', background: `${plan.color}20`, color: plan.color }}>
                    <Utensils size={28} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '900' }}>{plan.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Exclusive Access</p>
                  </div>
                </div>
                <div style={{ marginBottom: '2.5rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: '900' }}>₹{plan.price}</span>
                  <span style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '1.1rem' }}>/mo</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '3rem' }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                      <CheckCircle size={18} color={plan.color} /> {f}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => setSelectedPlan(plan)} className="btn" style={{ flex: 1, border: '1px solid var(--border-color)', fontWeight: '800', borderRadius: '16px', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>Specs</button>
                  <button
                    className="btn"
                    style={{ flex: 2, fontWeight: '800', borderRadius: '16px', background: plan.color, color: 'white', border: 'none', cursor: 'pointer' }}
                    onClick={() => {
                      if (plan.active) {
                        setPlanToDeactivate(plan);
                        setIsDeactivateModalOpen(true);
                      }
                    }}
                  >
                    {plan.active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="card" style={{ padding: '2.5rem', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '2rem' }}>Administrative Controls</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {[
                { title: 'Global Customization', desc: 'Allow menu edits per user', val: true },
                { title: 'Meal Skip Credits', desc: 'Enable wallet refunds', val: false },
                { title: 'Guest Pass System', desc: 'QR based visitor entry', val: true }
              ].map((ctrl, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                  <div><p style={{ fontWeight: '800', fontSize: '1rem' }}>{ctrl.title}</p><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{ctrl.desc}</p></div>
                  <div style={{ width: '48px', height: '24px', background: ctrl.val ? 'var(--accent-primary)' : 'var(--border-color)', borderRadius: '12px', padding: '2px', display: 'flex', justifyContent: ctrl.val ? 'flex-end' : 'flex-start' }}>
                    <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                border: '1px solid var(--border-color)'
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
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> {f}
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
                      <div key={i} style={{ padding: '0.7rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', textAlign: 'center' }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button onClick={() => setSelectedPlan(null)} className="btn" style={{ flex: 1, padding: '1.2rem', fontSize: '1rem', borderRadius: '16px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: '800' }}>Got it, thanks!</button>
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
                  <input value={editForm.breakfast} onChange={e => setEditForm({ ...editForm, breakfast: e.target.value })} style={inputStyle} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Lunch</label>
                  <input value={editForm.lunch} onChange={e => setEditForm({ ...editForm, lunch: e.target.value })} style={inputStyle} required />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Dinner</label>
                  <input value={editForm.dinner} onChange={e => setEditForm({ ...editForm, dinner: e.target.value })} style={inputStyle} required />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button className="btn" type="submit" style={{ flex: 1, padding: '1rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>Save Menu</button>
                  <button className="btn" type="button" onClick={() => setIsEditModalOpen(false)} style={{ flex: 1, padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </>
        )}
        {isDeactivateModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }} onClick={() => setIsDeactivateModalOpen(false)} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} style={{ position: 'fixed', top: '30%', left: '50%', x: '-50%', width: '90%', maxWidth: '400px', background: 'var(--bg-primary)', zIndex: 1001, padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <X size={30} color="#EF4444" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem' }}>Confirm Deactivation</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Are you sure you want to deactivate the <b>{planToDeactivate?.name}</b>? This will hide it from the tenant portal.</p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  className="btn"
                  style={{ flex: 1, background: '#EF4444', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}
                  onClick={() => {
                    setPlans(plans.map(p => p.id === planToDeactivate.id ? { ...p, active: false } : p));
                    setIsDeactivateModalOpen(false);
                  }}
                >
                  Yes, Deactivate
                </button>
                <button className="btn" onClick={() => setIsDeactivateModalOpen(false)} style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: '12px', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer' }}>Cancel</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <style>{`
        .card { background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .btn { padding: 0.8rem 1.5rem; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Mess;
