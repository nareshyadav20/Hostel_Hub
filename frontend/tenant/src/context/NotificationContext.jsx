import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import socket, { connectSocket } from '../utils/socket';
import API from '../api/axios';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!localStorage.getItem('token') && !!user.name;

  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      setLoading(true);
      const buildingId = localStorage.getItem('buildingId');
      const res = await API.get('/notifications', { params: { buildingId } });
      const list = res.data || [];
      setNotifications(list);
      setUnreadCount(list.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      // Join rooms
      const buildingId = user.buildingId || localStorage.getItem('buildingId');
      connectSocket(buildingId);
    }
  }, [isLoggedIn, fetchNotifications, user.buildingId]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const handleNewNotification = (notification) => {
      // In tenant portal, we usually receive notifications targeted to us via tenant_userId room
      // or to our building via building_buildingId room.
      // Socket handles the room filtering, so we just add it.
      setNotifications(prev => [notification, ...prev].slice(0, 50));
      if (!notification.isRead) {
        setUnreadCount(prev => prev + 1);
      }

      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico'
        });
      }
    };

    socket.on('newNotification', handleNewNotification);
    socket.on('complaintStatusChanged', fetchNotifications);
    socket.on('paymentUpdated', fetchNotifications);
    socket.on('transferStatusChanged', fetchNotifications);
    socket.on('menuUpdated', fetchNotifications);
    
    return () => {
      socket.off('newNotification', handleNewNotification);
      socket.off('complaintStatusChanged', fetchNotifications);
      socket.off('paymentUpdated', fetchNotifications);
      socket.off('transferStatusChanged', fetchNotifications);
      socket.off('menuUpdated', fetchNotifications);
    };
  }, [isLoggedIn, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => (n._id === id || n.id === id) ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await API.post('/notifications/mark-all-read', { category: 'all' });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      markAsRead,
      markAllAsRead,
      refresh: fetchNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
