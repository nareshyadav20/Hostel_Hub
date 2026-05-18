import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import './Mess.css';
import socket, { connectSocket, disconnectSocket } from '../utils/socket';
import { ChevronLeft, ChevronRight, Search, Filter, Calendar, Clock, AlertTriangle, Coffee, Utensils, Moon, CheckCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Mess = () => {
  const [rating, setRating] = useState(0);
  const [todayMenu, setTodayMenu] = useState({ breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' });
  const [weeklyMenu, setWeeklyMenu] = useState([]);
  const [tenantPlan, setTenantPlan] = useState('Standard');
  const [loading, setLoading] = useState(true);
  const [attendanceStatus, setAttendanceStatus] = useState('dining'); // 'dining' or 'skipped'
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const fetchMessData = async () => {
    try {
      const bId = localStorage.getItem('buildingId');
      const todayDate = new Date().toLocaleDateString('sv-SE');
      
      const [profileRes, menuRes, attendanceRes] = await Promise.all([
        API.get('/tenants/me'),
        bId ? API.get(`/mess/menu?buildingId=${bId}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        bId ? API.get(`/mess/attendance?buildingId=${bId}&date=${todayDate}`).catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
      ]);
      
      const tenant = profileRes.data;
      setTenantPlan(tenant.messPlan || 'Standard');
      
      // Determine attendance status for today's current active meal based on time
      const myAttendance = attendanceRes.data.find(a => a.tenantId === tenant._id || a.tenantId === tenant.id);
      if (myAttendance) {
        const hour = new Date().getHours();
        let currentMeal = 'dinner';
        if (hour < 11) currentMeal = 'breakfast';
        else if (hour < 16) currentMeal = 'lunch';

        const mealStatus = myAttendance[currentMeal];
        if (mealStatus !== undefined) {
          setAttendanceStatus(mealStatus ? 'dining' : 'skipped');
        } else {
          setAttendanceStatus('dining'); // Default if unmarked
        }
      } else {
        setAttendanceStatus('dining'); // Default if no attendance record today
      }

      let finalMenu = menuRes.data && menuRes.data.length > 0 ? menuRes.data : [];
      const fallbackMenu = [
        { day: 'Monday', breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' },
        { day: 'Tuesday', breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' },
        { day: 'Wednesday', breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' },
        { day: 'Thursday', breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' },
        { day: 'Friday', breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' },
        { day: 'Saturday', breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' },
        { day: 'Sunday', breakfast: 'Pending Update', lunch: 'Pending Update', dinner: 'Pending Update' }
      ];

      if (finalMenu.length === 0) finalMenu = fallbackMenu;
      
      setWeeklyMenu(finalMenu);
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const todayItem = finalMenu.find(m => m.day === today) || finalMenu[0];
      setTodayMenu(todayItem);
    } catch (err) {
      console.error('Error fetching mess data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessData();

    const buildingId = localStorage.getItem('buildingId');
    if (buildingId) {
      connectSocket(buildingId);

      socket.on('menuUpdated', () => {
        console.log('🔄 Mess Menu Updated');
        fetchMessData();
      });

      socket.on('attendanceUpdated', (data) => {
        console.log('✅ Attendance Updated', data);
        fetchMessData();
      });
    }

    return () => {
      socket.off('menuUpdated');
      socket.off('attendanceUpdated');
      disconnectSocket();
    };
  }, []);

  const updateMyAttendance = async (status) => {
    try {
      const bId = localStorage.getItem('buildingId');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const tenantId = user.tenantId || user._id;
      const todayDate = new Date().toLocaleDateString('sv-SE');
      
      // Determine which meal to update based on time
      const hour = new Date().getHours();
      let meal = 'dinner';
      if (hour < 11) meal = 'breakfast';
      else if (hour < 16) meal = 'lunch';

      await API.put('/mess/attendance', {
        tenantId,
        buildingId: bId,
        date: todayDate,
        meal,
        status: status === 'dining'
      });
      
      setAttendanceStatus(status);
      setFeedbackMessage({
        type: status === 'dining' ? 'success' : 'info',
        text: status === 'dining' ? 'Attendance marked! Enjoy your meal.' : 'You have opted to skip. Thank you for helping reduce waste!'
      });
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      console.error('Failed to update attendance:', err);
      setFeedbackMessage({ type: 'error', text: 'Failed to update attendance. Please try again.' });
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleSkipMeal = () => updateMyAttendance('skipped');
  const handleDining = () => updateMyAttendance('dining');

  if (loading) return (
    <div className="staynest-dashboard loading-state">
      <div className="premium-spinner"></div>
      <p>Synchronizing dining records...</p>
    </div>
  );

  return (
    <div className="mess-page">
      <header className="mess-header">
        <div className="header-title-group">
          <h1>Dining & Nutrition</h1>
          <p className="header-subtitle">Track daily meals, rate nutrition, and manage your attendance.</p>
        </div>
        <div className="plan-badge-container">
          <span className="plan-label">Resident Plan</span>
          <span className="plan-value orange">{tenantPlan}</span>
        </div>
      </header>

      <div className="mess-grid">
        {/* Today's Menu Card */}
        <div className="sn-card menu-card-main">
          <div className="card-header-flex">
            <h3 className="sn-card-title">Today's Menu</h3>
            <span className="live-tag">
              <span className="pulse-dot"></span> Live Now
            </span>
          </div>

          <div className="meal-segments">
            {[
              {
                type: 'Breakfast',
                menu: todayMenu.breakfast,
                time: '08:30 - 10:00',
                color: '#3b82f6',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
                  </svg>
                )
              },
              {
                type: 'Lunch',
                menu: todayMenu.lunch,
                time: '12:30 - 14:30',
                color: '#ef4444',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
                  </svg>
                )
              },
              {
                type: 'Dinner',
                menu: todayMenu.dinner,
                time: '20:00 - 21:30',
                color: '#16a34a',
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" /><path d="M12 2v20M2 12h20" />
                  </svg>
                )
              }
            ].map((meal, idx) => (
              <div key={idx} className="meal-item-row" style={{ borderLeft: `6px solid ${meal.color}` }}>
                <div className="meal-icon-wrapper" style={{ color: meal.color, background: `${meal.color}10` }}>
                  {meal.icon}
                </div>
                <div className="meal-details">
                  <div className="meal-meta">
                    <span className="meal-label">{meal.type}</span>
                    <span className="meal-time">{meal.time}</span>
                  </div>
                  <h4 className="meal-dish">{meal.menu}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="rating-section-premium">
            <div className="rating-header">
              <p>Rate your last meal experience</p>
              {rating > 0 && <span className="rating-status-text">Excellent Choice!</span>}
            </div>
            <div className="colorful-rating-group">
              {[
                { val: 1, color: '#ef4444', label: 'Poor', emoji: '😠' },
                { val: 2, color: '#f97316', label: 'Average', emoji: '😐' },
                { val: 3, color: '#eab308', label: 'Good', emoji: '🙂' },
                { val: 4, color: '#84cc16', label: 'Great', emoji: '😋' },
                { val: 5, color: '#22c55e', label: 'Perfect', emoji: '🤩' }
              ].map((item) => (
                <button
                  key={item.val}
                  className={`rating-btn ${rating === item.val ? 'active' : ''}`}
                  onClick={() => setRating(item.val)}
                  style={{ '--rating-color': item.color }}
                  title={item.label}
                >
                  <span className="rating-emoji" style={{ fontSize: '2rem' }}>{item.emoji}</span>
                  <span className="rating-label">{item.label}</span>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <button className="btn-primary-small submit-rating-btn fade-in" onClick={() => {
                alert(`Thank you! Your ${rating}-star feedback has been recorded.`);
                setRating(0);
              }}>
                Submit Feedback
              </button>
            )}
          </div>
        </div>

        {/* Attendance & Action Card */}
        <div className="attendance-column">
          <div className="sn-card attendance-card-premium">
            <div className="attendance-visual">
              <div className="action-icon-bg">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9" /><polyline points="12 7 12 12 15 15"></polyline>
                </svg>
              </div>
              <h3>Mark Presence</h3>
              <p>Notify the kitchen if you'll be dining today or skipping.</p>

              <AnimatePresence>
                {feedbackMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    style={{ 
                      padding: '0.75rem 1rem', 
                      borderRadius: '12px', 
                      marginBottom: '1rem',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: feedbackMessage.type === 'success' ? '#dcfce7' : feedbackMessage.type === 'error' ? '#fee2e2' : '#e0e7ff',
                      color: feedbackMessage.type === 'success' ? '#166534' : feedbackMessage.type === 'error' ? '#991b1b' : '#3730a3',
                      border: `1px solid ${feedbackMessage.type === 'success' ? '#bbf7d0' : feedbackMessage.type === 'error' ? '#fecaca' : '#c7d2fe'}`
                    }}
                  >
                    {feedbackMessage.type === 'success' ? <CheckCircle size={16} /> : feedbackMessage.type === 'error' ? <AlertTriangle size={16} /> : <Info size={16} />}
                    {feedbackMessage.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="attendance-toggle-group">
                <button
                  className={`att-btn dining ${attendanceStatus === 'dining' ? 'active' : ''}`}
                  onClick={handleDining}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  I will be dining
                </button>
                <button
                  className={`att-btn skip ${attendanceStatus === 'skipped' ? 'active' : ''}`}
                  onClick={handleSkipMeal}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Skip this meal
                </button>
              </div>
            </div>

            <div className="sustainability-box">
              <div className="tip-icon-pro">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <p><strong>Sustainability Tip:</strong> Skipping meals 2 hours in advance helps us significantly reduce food waste.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="sn-card schedule-table-card">
        <div className="card-header-iconic">
          <div className="icon-badge-green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h3 className="sn-card-title">Weekly Nutrition Schedule</h3>
        </div>

        <div className="table-overflow">
          <table className="weekly-table-premium">
            <thead>
              <tr>
                <th>Week Day</th>
                <th>Breakfast</th>
                <th>Lunch</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {weeklyMenu.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((m, i) => (
                <tr key={i} className="fade-in">
                  <td className="td-day">{m.day}</td>
                  <td className="td-dish">{m.breakfast}</td>
                  <td className="td-dish">{m.lunch}</td>
                  <td className="td-dish">{m.dinner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls-premium">
          <div className="pagination-info">
            Showing <span>{(currentPage - 1) * itemsPerPage + 1}</span> - <span>{Math.min(currentPage * itemsPerPage, weeklyMenu.length)}</span> of <span>{weeklyMenu.length}</span> Days
          </div>
          <div className="pagination-btns">
            <button 
              className={`p-btn ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="p-pages">
              {Array.from({ length: Math.ceil(weeklyMenu.length / itemsPerPage) }).map((_, i) => (
                <button 
                  key={i}
                  className={`p-page-num ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button 
              className={`p-btn ${currentPage === Math.ceil(weeklyMenu.length / itemsPerPage) ? 'disabled' : ''}`}
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(weeklyMenu.length / itemsPerPage), p + 1))}
              disabled={currentPage === Math.ceil(weeklyMenu.length / itemsPerPage)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mess;
