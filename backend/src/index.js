// HostelHub API Server - Fully integrated
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const buildingRoutes = require('./routes/buildingRoutes');
const floorRoutes = require('./routes/floorRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bedRoutes = require('./routes/bedRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const hostelFloorMappingRoutes = require('./routes/hostelFloorMappingRoutes');
const hostelRoutes = require('./routes/hostelRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const roomTransferRoutes = require('./routes/roomTransferRoutes');
const messRoutes = require('./routes/messRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const staffRoutes = require('./routes/staffRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const notificationService = require('./utils/notificationService');
const procurementRoutes = require('./routes/procurementRoutes');

// Pre-load all models to ensure they are registered for population
require('./models/User');
require('./models/Tenant');
require('./models/RoomTransfer');
require('./models/Complaint');
require('./models/MessMenu');
require('./models/MessAttendance');
require('./models/Payment');
require('./models/Staff');
require('./models/Notification');
require('./models/PurchaseRequest');
require('./models/PurchaseOrder');
require('./models/Booking');

app.use('/api/auth', authRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/floors', floorRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/hostel-floor-mapping', hostelFloorMappingRoutes);
app.use('/api/hostels', hostelRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/room-transfers', roomTransferRoutes);
app.use('/api/mess', messRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/tenant-portal', require('./routes/tenantPortalRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/confidential-reports', require('./routes/confidentialReportRoutes'));
app.use('/api/procurement', procurementRoutes);

app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

app.get('/', (req, res) => {
  res.send('HostelHub API (Node/Mongoose) is running...');
});

const http = require('http');
const { Server } = require('socket.io');
const socketService = require('./utils/socketService');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Initialize socket services
socketService.setIo(io);
notificationService.setIo(io);

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('joinBuilding', (buildingId) => {
    if (buildingId) {
      socket.join(buildingId.toString());
      console.log(`Socket ${socket.id} joined building: ${buildingId}`);
    }
  });

  socket.on('joinOwner', (ownerId) => {
    if (ownerId) {
      socket.join(`owner_${ownerId}`);
      console.log(`Socket ${socket.id} joined owner room: owner_${ownerId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
