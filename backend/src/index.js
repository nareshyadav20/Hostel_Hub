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

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'https://hostel-hub-owner.vercel.app',
  'https://livora-hostel-hub-tenant.vercel.app',
  // Allow any vercel subdomain for preview deployments
  /\.vercel\.app$/,
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Auto-allow all localhost/127.0.0.1 origins for easier development
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:') || origin === 'http://localhost' || origin === 'http://127.0.0.1') {
      return callback(null, true);
    }

    const allowed = allowedOrigins.some(o => 
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (allowed) return callback(null, true);
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


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
require('./models/ConfidentialReport');
require('./models/SosAlert');

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
app.use('/api/community', require('./routes/communityRoutes'));

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
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5175',
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://hostel-hub-owner.vercel.app',
      'https://livora-hostel-hub-tenant.vercel.app',
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Initialize socket services
socketService.setIo(io);
notificationService.setIo(io);

io.on('connection', (socket) => {
  console.log('⚡ New client connected:', socket.id);

  socket.on('joinBuilding', (buildingId) => {
    if (buildingId) {
      const roomId = `building_${buildingId.toString()}`;
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined building room: ${roomId}`);
    }
  });

  socket.on('joinOwner', (ownerId) => {
    if (ownerId) {
      const roomId = `owner_${ownerId.toString()}`;
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined owner room: ${roomId}`);
    }
    socket.join('owners');
  });

  socket.on('joinTenant', (userId) => {
    if (userId) {
      const roomId = `tenant_${userId.toString()}`;
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined tenant room: ${roomId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const startServer = (p) => {
  const port = parseInt(p);
  server.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${port} is in use. Trying port ${port + 1}...`);
      server.close();
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

startServer(Number(PORT) || 5000);

