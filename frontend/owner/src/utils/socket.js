import { io } from 'socket.io-client';

const socketUrl = (import.meta.env.VITE_API_URL || 'https://livora-hostel-hub-1.onrender.com/api').replace('/api', '');

const socket = io(socketUrl, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  transports: ["websocket", "polling"],
  upgrade: true,
});

export const connectSocket = (id, type = 'building') => {
  const joinRooms = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    socket.emit('joinOwner', user._id || 'owner');
    if (id && type === 'building') {
      socket.emit('joinBuilding', id);
    }
  };

  if (!socket.connected) {
    // Use once() to prevent listener accumulation across reconnects
    socket.once('connect', () => {
      console.log('✅ Owner Portal: Connected to Real-time Sync Server');
      joinRooms();
    });

    if (!socket.listeners('connect_error').length) {
      socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
      });
    }

    socket.connect();
  } else {
    // Already connected — join rooms immediately
    joinRooms();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
