import { io } from 'socket.io-client';

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'https://livora-hostel-hub.onrender.com').replace('/api', '');

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

let isInitialized = false;

export const connectSocket = (buildingId) => {
  if (!isInitialized) {
    socket.on('connect', () => {
      console.log('✅ Tenant Portal: Connected to Real-time Sync Server');
      
      const currentBuildingId = localStorage.getItem('buildingId');
      if (currentBuildingId) {
        socket.emit('joinBuilding', currentBuildingId);
      }
      
      const tenantId = localStorage.getItem('tenantId');
      if (tenantId) {
        socket.emit('joinTenant', tenantId);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected from server:', reason);
    });

    isInitialized = true;
  }

  if (!socket.connected) {
    socket.connect();
  } else {
    // Already connected — rejoin rooms to ensure membership
    if (buildingId) socket.emit('joinBuilding', buildingId);
    const tenantId = localStorage.getItem('tenantId');
    if (tenantId) socket.emit('joinTenant', tenantId);
  }
};

export const disconnectSocket = () => {
  // We keep the connection alive during the session to prevent listener buildup
  // Only disconnect if explicitly needed (e.g. logout)
};

export default socket;
