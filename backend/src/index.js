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
app.use(express.json());

const buildingRoutes = require('./routes/buildingRoutes');
const floorRoutes = require('./routes/floorRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bedRoutes = require('./routes/bedRoutes');
const hostelFloorMappingRoutes = require('./routes/hostelFloorMappingRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/buildings', buildingRoutes);
app.use('/api/floors', floorRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/beds', bedRoutes);
app.use('/api/hostel-floor-mapping', hostelFloorMappingRoutes);

app.get('/', (req, res) => {
  res.send('HostelHub API (Node/Mongoose) is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
