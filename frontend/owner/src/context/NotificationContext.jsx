import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import socket, { connectSocket } from '../utils/socket';
import { api } from '../mockData';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeBuildingId, setActiveBuildingId] = useState(localStorage.getItem('selectedBuildingId'));

  const fetchNotifications = useCallback(async (buildingId) => {
    if (!buildingId) return;
    try {
      setLoading(true);
      const [list, countData] = await Promise.all([
        api.getNotifications(buildingId),
        api.getNotificationUnreadCount(buildingId)
      ]);
      setNotifications(list || []);
      setUnreadCount(countData.count || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeBuildingId) {
      fetchNotifications(activeBuildingId);
      connectSocket(activeBuildingId);
    }
  }, [activeBuildingId, fetchNotifications]);

  useEffect(() => {
    const handleNewNotification = (notification) => {
      // Check if it's for the current building or global/owner
      if (!notification.buildingId || notification.buildingId === activeBuildingId) {
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
      }
    };

    socket.on('newNotification', handleNewNotification);
    return () => socket.off('newNotification', handleNewNotification);
  }, [activeBuildingId]);

  const markAsRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(prev => prev.map(n => (n.id === id || n._id === id) ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsRead(activeBuildingId);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.deleteNotification(id);
      const deleted = notifications.find(n => n.id === id || n._id === id);
      setNotifications(prev => prev.filter(n => n.id !== id && n._id !== id));
      if (deleted && !deleted.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      activeBuildingId,
      setActiveBuildingId,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      refresh: () => fetchNotifications(activeBuildingId)
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
