// HostelHub API Server - Fully integrated
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

// Connect to MongoDB
connectDB().then(() => {
  // Asynchronous lazy self-migration for owner notifications
  setTimeout(async () => {
    try {
      const Notification = require('./models/Notification');
      const OwnerNotification = require('./models/OwnerNotification');

      const count = await Notification.countDocuments({
        $or: [
          { portalType: 'Owner' },
          { receiverRole: 'Owner' },
          { target: 'Owner' }
        ]
      });

      if (count > 0) {
        console.log(`📡 [AUTO_MIGRATION] Found ${count} legacy owner notifications. Migrating lazily...`);
        const oldOwnerNotifs = await Notification.find({
          $or: [
            { portalType: 'Owner' },
            { receiverRole: 'Owner' },
            { target: 'Owner' }
          ]
        }).lean();

        let migrated = 0;
        for (const notif of oldOwnerNotifs) {
          const exists = await OwnerNotification.findOne({ _id: notif._id });
          if (!exists) {
            await OwnerNotification.create(notif);
            migrated++;
          }
        }

        // Remove migrated notifications from the old notifications collection to avoid cluttering
        await Notification.deleteMany({
          $or: [
            { portalType: 'Owner' },
            { receiverRole: 'Owner' },
            { target: 'Owner' }
          ]
        });

        console.log(`✅ [AUTO_MIGRATION] Successfully migrated and cleaned up ${migrated} owner notifications!`);
      }
    } catch (err) {
      console.error('⚠️ [AUTO_MIGRATION] Lazy migration failed but continuing:', err.message);
    }
  }, 2000); // 2 second delay to avoid delaying startup
});

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
    if (!origin || origin === 'null' || origin.startsWith('file://') || origin.startsWith('capacitor://') || origin.startsWith('ionic://') || origin.startsWith('chrome-extension://')) {
      return callback(null, true);
    }

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

const compression = require('compression');
app.use(compression()); // Gzip compression for all responses

app.use((req, res, next) => {
  const msg = `${new Date().toISOString()} API: ${req.method} ${req.originalUrl}\n`;
  try {
    require('fs').appendFileSync(require('path').join(__dirname, '../traffic_logs.txt'), msg);
  } catch (_) { /* Ignore filesystem errors on read-only/ephemeral environments like Render */ }
  console.log(req.method, req.originalUrl);
  next();
});

// API Rate Limiter to prevent Flutter request storms
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // Increased from 100 to prevent 429 errors during development/testing
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', apiLimiter);

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
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const notificationService = require('./utils/notificationService');
const procurementRoutes = require('./routes/procurementRoutes');
const taskRoutes = require('./routes/taskRoutes');

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
require('./models/OwnerNotification');
require('./models/PurchaseRequest');
require('./models/PurchaseOrder');
require('./models/Booking');
require('./models/ConfidentialReport');
require('./models/SosAlert');
require('./models/TenantPhoto');
require('./models/OwnerPhoto');
require('./models/BuildingPhoto');
require('./models/TenantProof');
require('./models/AdminCms');
require('./models/AdminInsights');
require('./models/AdminSupport');
require('./models/Task');
require('./models/Rating');
require('./models/ForgotPassword');
require('./models/PasswordReset');

app.use('/api/auth', authRoutes);
app.use('/api/auth/forgot-password', require('./routes/forgotPasswordRoutes'));
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
app.use('/api/rewards', require('./routes/rewardsRoutes'));
app.use('/api/bookings', bookingRoutes);
app.use('/api/tenant-portal', require('./routes/tenantPortalRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/confidential-reports', require('./routes/confidentialReportRoutes'));
app.use('/api/procurement', procurementRoutes);
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/tenant-proofs', require('./routes/tenantProofRoutes'));
app.use('/api/admin', adminRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/assets', require('./routes/assetRoutes'));
app.use('/api/profile', profileRoutes);
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/booking', require('./routes/mobileBookingRoutes'));

app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
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

const activeSockets = new Map();

io.on('connection', (socket) => {
  const msg = `${new Date().toISOString()} SOCKET: Socket connected: ${socket.id}\n`;
  try {
    require('fs').appendFileSync(require('path').join(__dirname, '../traffic_logs.txt'), msg);
  } catch (_) { /* Ignore filesystem errors on read-only/ephemeral environments like Render */ }
  console.log('⚡ New client connected:', socket.id);
  console.log("Socket connected:", socket.id);

  // WebSocket Deduplication: Prevent Flutter reconnect storms
  const clientIp = socket.handshake.address;
  if (activeSockets.has(clientIp)) {
    const oldSocketId = activeSockets.get(clientIp);
    const oldSocket = io.sockets.sockets.get(oldSocketId);
    if (oldSocket) {
      console.log(`🔌 Terminating old zombie socket ${oldSocketId} for IP ${clientIp}`);
      oldSocket.disconnect(true);
    }
  }
  activeSockets.set(clientIp, socket.id);

  socket.on('disconnect', () => {
    if (activeSockets.get(clientIp) === socket.id) {
      activeSockets.delete(clientIp);
    }
  });

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
      socket.join(ownerId.toString()); // Direct userId room mapping
      console.log(`Socket ${socket.id} joined owner room: ${roomId} and user room: ${ownerId}`);
    }
    socket.join('owners');
  });

  socket.on('joinTenant', (userId) => {
    if (userId) {
      const roomId = `tenant_${userId.toString()}`;
      socket.join(roomId);
      socket.join(userId.toString()); // Direct userId room mapping
      console.log(`Socket ${socket.id} joined tenant room: ${roomId} and user room: ${userId}`);
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

