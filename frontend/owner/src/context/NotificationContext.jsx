import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import socket, { connectSocket } from '../utils/socket';
import { api } from '../mockData';

const NotificationContext = createContext();

export const NotificationProvider = ({ children, activeBuildingId: propBuildingId }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeBuildingId, setActiveBuildingId] = useState(propBuildingId || localStorage.getItem('selectedBuildingId'));

  // Sync state if prop changes (e.g. on navigation or refresh)
  useEffect(() => {
    if (propBuildingId && propBuildingId !== activeBuildingId) {
      console.log('🔄 [CONTEXT_SYNC] Updating activeBuildingId from prop:', propBuildingId);
      setActiveBuildingId(propBuildingId);
    }
  }, [propBuildingId]);

  const fetchNotifications = useCallback(async (buildingId) => {
    if (!buildingId) return;
    try {
      setLoading(true);
      const [list, countData] = await Promise.all([
        api.getNotifications(buildingId),
        api.getNotificationUnreadCount(buildingId)
      ]);
      console.log('📥 API_FETCH_RESULTS:', {
        buildingId,
        count: list?.length,
        unread: countData.count,
        firstNotification: list?.[0]?.title
      });
      setNotifications(list || []);
      setUnreadCount(countData.count || 0);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    if (activeBuildingId) {
      console.log('🔄 Context switching building:', activeBuildingId);
      fetchNotifications(activeBuildingId);
      connectSocket(activeBuildingId);
    }
    return () => { mounted = false; };
  }, [activeBuildingId, fetchNotifications]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      // Check if it's for the current building or global/owner
      const notifBuildingId = notification.buildingId?.toString();
      const currentBuildingId = activeBuildingId?.toString();
      
      // Match if building matches OR if it's a global owner notification
      const isMatch = !notifBuildingId || notifBuildingId === currentBuildingId;

      if (isMatch || notification.portalType === 'Owner') {
        console.log('✅ NOTIFICATION_MATCH:', {
          title: notification.title,
          notifBuildingId,
          currentBuildingId,
          portalType: notification.portalType
        });

        setNotifications(prev => {
          const exists = prev.some(n => (n.id || n._id) === (notification.id || notification._id));
          if (exists) {
            console.log('⏭️ NOTIFICATION_EXISTS: Skipping duplicate');
            return prev;
          }
          return [notification, ...prev].slice(0, 50);
        });
        
        if (!notification.isRead) {
          setUnreadCount(prev => prev + 1);
        }
      } else {
        console.log('⚠️ NOTIFICATION_MISMATCH:', {
          title: notification.title,
          notifBuildingId,
          currentBuildingId,
          portalType: notification.portalType
        });
      }
    };

    socket.on('newNotification', handleNewNotification);
    return () => socket.off('newNotification', handleNewNotification);
  }, [socket, activeBuildingId]);

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
      setNotifications,
      unreadCount,
      setUnreadCount,
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
