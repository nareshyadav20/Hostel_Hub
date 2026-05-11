import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
      console.log('✅ Connected to Real-time Sync Server');
      if (buildingId) {
        socket.emit('joinBuilding', buildingId);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected from server:', reason);
    });
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
