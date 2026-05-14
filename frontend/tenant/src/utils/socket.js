import { io } from 'socket.io-client';

const SOCKET_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '');

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const connectSocket = (buildingId) => {
  if (!socket.connected) {
    socket.connect();
    
    socket.on('connect', () => {
      console.log('✅ Tenant Portal: Connected to Real-time Sync Server');
      if (buildingId) {
        socket.emit('joinBuilding', buildingId);
      }
      // Also join personal tenant room for status updates
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
  } else {
    // Already connected — rejoin rooms to ensure membership
    if (buildingId) {
      socket.emit('joinBuilding', buildingId);
      console.log('📡 Re-joining building room:', buildingId);
    }
    const tId = localStorage.getItem('tenantId');
    if (tId) {
      socket.emit('joinTenant', tId);
      console.log('📡 Re-joining tenant room:', tId);
    }
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
