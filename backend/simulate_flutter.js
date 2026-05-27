const io = require('socket.io-client');
const axios = require('axios');

const API_URL = 'http://localhost:5000';
let activeSockets = [];

console.log('🚀 Starting Flutter App Simulation (Test B)...');

// 1. Simulate socket connection storms (e.g. from screen rebuilds)
setInterval(() => {
  const socket = io(API_URL, {
    reconnection: true,
    transports: ['websocket', 'polling']
  });
  
  socket.on('connect', () => {
    // console.log('Simulated Flutter Socket Connected');
    socket.emit('joinBuilding', 'dummy_building_id');
  });

  activeSockets.push(socket);

  // Keep max 20 sockets to avoid local port exhaustion, but simulate rapid churn
  if (activeSockets.length > 20) {
    const oldSocket = activeSockets.shift();
    oldSocket.disconnect();
  }
}, 500); // New socket connection every 500ms

// 2. Simulate rapid API polling (e.g. unoptimized FutureBuilder / refetches)
setInterval(async () => {
  try {
    await axios.get(`${API_URL}/api/buildings/public`);
  } catch (err) {}
}, 200); // 5 requests per second for buildings

setInterval(async () => {
  try {
    await axios.get(`${API_URL}/api/ping`);
  } catch (err) {}
}, 333); // 3 requests per second for dashboard/ping

setTimeout(() => {
  console.log('🏁 Simulation complete. Exiting...');
  process.exit(0);
}, 15000); // Run for 15 seconds
