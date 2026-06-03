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
  if (!socket.connected) {
    socket.connect();

    socket.on('connect', () => {
      console.log('✅ Owner Portal: Connected to Real-time Sync Server');
      // Always join global owners room to receive all tenant events
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      socket.emit('joinOwner', user._id || 'owner');

      // Also join building-specific room if buildingId provided
      if (id && type === 'building') {
        socket.emit('joinBuilding', id);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });
  } else {
    // Already connected — still join owner room in case it wasn't joined
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    socket.emit('joinOwner', user._id || 'owner');
    if (id && type === 'building') {
      socket.emit('joinBuilding', id);
    }
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
