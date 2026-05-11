import { io } from 'socket.io-client';

const socketUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const socket = io(socketUrl, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const connectSocket = (id, type = 'building') => {
  if (!socket.connected) {
    socket.connect();
    
    socket.on('connect', () => {
      console.log('✅ Owner Portal: Connected to Real-time Sync Server');
      if (type === 'building') {
        socket.emit('joinBuilding', id);
      } else if (type === 'owner') {
        socket.emit('joinOwner', id);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
