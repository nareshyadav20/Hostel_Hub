const mongoose = require('mongoose');

const floorSchema = new mongoose.Schema({
  floorNumber: { type: String, required: true },
  description: { type: String },
  images:      [{ type: String }],
  building:    { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  rooms:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],

  // Floor Specialization (Step 7)
  floorCategory: { 
    type: String, 
    enum: ['General', 'Female-only', 'Silent study', 'Premium', 'Working professional'], 
    default: 'General' 
  },

  // Floor Hygiene Tracking (Step 14)
  hygieneRating: { type: Number, default: 5.0 },
  washroomsCount: { type: Number, default: 0 },
  healthScore: { type: Number, default: 100 },

  // Occupancy & Capacity
  occupancyHeatmap: { type: Object, default: {} },
  totalRooms: { type: Number, default: 0 },
  totalBeds: { type: Number, default: 0 },
  occupancyPercentage: { type: Number, default: 0 },

  // AI & Intelligence
  aiInsights: [{ type: String }],
  aiConfidence: { type: String, enum: ['Low', 'Medium', 'High'], default: 'High' },
  thumbIntelligence: { type: String, default: '' },
  operationalNotes: [{ type: String }],

  // Infrastructure
  cctvStatus: { type: String, enum: ['Active', 'Inactive', 'Maintenance'], default: 'Active' },
  wifiStatus: { type: String, enum: ['Excellent', 'Good', 'Poor', 'Offline'], default: 'Excellent' },
  powerBackupStatus: { type: String, enum: ['Online', 'Offline', 'Maintenance'], default: 'Online' },
  waterSystemStatus: { type: String, enum: ['Stable', 'Low', 'Critical'], default: 'Stable' },
  securityGridStatus: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },

  // Facilities
  facilities: [{ type: String }], // Laundry, Smart Access, Pantry, Gaming Zone, Study Hall
  loungesCount: { type: Number, default: 0 },

  // Live Monitoring
  operationalLogs: [{ message: String, timestamp: { type: Date, default: Date.now } }],
  floorAlerts: [{ type: String }],
  systemHeartbeat: { type: String, default: 'Stable' },
  hvacStatus: { type: String, default: 'Operating at peak efficiency' },
  temperature: { type: Number, default: 22.5 },

  // Metadata
  isActive: { type: Boolean, default: true },
  floorThumbnail: { type: String },
  smartMonitoringEnabled: { type: Boolean, default: true },
  realTimeEnabled: { type: Boolean, default: true }
}, { timestamps: true, collection: 'floors' });

module.exports = mongoose.model('Floor', floorSchema);
