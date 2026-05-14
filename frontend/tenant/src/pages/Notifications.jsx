import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const bId = localStorage.getItem('buildingId');
      const res = await API.get('/notifications', { params: { buildingId: bId } });
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return '🔴';
      case 'Medium': return '🟡';
      default: return '🔵';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'important') return n.priority === 'High';
    return true;
  });

  return (
    <div className="notif-page-container">
      <header className="notif-page-header">
        <div className="header-left">
          <h1>Notifications</h1>
          <p>Stay updated with the latest alerts from your hostel</p>
        </div>
        <div className="notif-filters">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
          <button className={filter === 'unread' ? 'active' : ''} onClick={() => setFilter('unread')}>Unread</button>
          <button className={filter === 'important' ? 'active' : ''} onClick={() => setFilter('important')}>Important</button>
        </div>
      </header>

      {loading ? (
        <div className="notif-loader">Loading your alerts...</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="notif-empty-state">
          <div className="empty-icon">🔔</div>
          <h3>All caught up!</h3>
          <p>You don't have any notifications in this category.</p>
        </div>
      ) : (
        <div className="notif-list-full">
          <AnimatePresence>
            {filteredNotifications.map((notif) => (
              <motion.div 
                key={notif._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`notif-card-full ${notif.isRead ? 'read' : 'unread'} priority-${notif.priority?.toLowerCase()}`}
              >
                <div className="notif-card-side">
                  <span className="priority-indicator">{getPriorityIcon(notif.priority)}</span>
                </div>
                <div className="notif-card-content">
                  <div className="notif-card-top">
                    <span className="notif-module">{notif.moduleName}</span>
                    <span className="notif-date">{new Date(notif.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3>{notif.title}</h3>
                  <p>{notif.message}</p>
                  <div className="notif-card-actions">
                    {!notif.isRead && (
                      <button onClick={() => markAsRead(notif._id)} className="btn-mark-read">Mark as Read</button>
                    )}
                    <button onClick={() => deleteNotification(notif._id)} className="btn-delete">Delete</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Notifications;
