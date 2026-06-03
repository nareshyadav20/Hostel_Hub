const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  roomType:   { type: String, default: 'Single' },
  capacity:   { type: Number, default: 1 },
  rentAmount: { type: Number, default: 0 },
  securityDeposit: { type: Number, default: 0 },
  noticePeriod: { type: Number, default: 30 }, // in days
  status:     { type: String, default: 'AVAILABLE' },
  isAC:       { type: Boolean, default: false },
  attachedBathroom: { type: Boolean, default: false },
  balcony:    { type: Boolean, default: false },
  facing:     { type: String, default: 'Road' },
  floorType:  { type: String, default: 'Tiles' }, // Marble, Tiles, Wooden
  windowCount: { type: Number, default: 1 },
  furniture:  [{ type: String }], // Bed, Table, Cupboard, Mirror
  amenities:  [{ type: String }],
  images:     [{ type: String }],
  floor:      { type: mongoose.Schema.Types.ObjectId, ref: 'Floor' },
  beds:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bed' }],
  
  // Detailed Room Metrics (Strict 1:1 with UI)
  roomSize: { type: String, default: '' },
  fanCount: { type: Number, default: 1 },
  chairCount: { type: Number, default: 1 },
  geyser: { type: Boolean, default: false },
  studyTable: { type: Boolean, default: false },
  wardrobe: { type: Boolean, default: false },
  mirror: { type: Boolean, default: false },
  tv: { type: Boolean, default: false },
  refrigerator: { type: Boolean, default: false },
  microwave: { type: Boolean, default: false },
  wifi: { type: Boolean, default: true },

  // Smart Room Features (Step 4)
  ventilationScore: { type: Number, default: 0 },
  naturalLightScore: { type: Number, default: 0 },
  noiseLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  tempComfortScore: { type: Number, default: 0 },
  studyFriendly: { type: Boolean, default: false },
  quietRoom: { type: Boolean, default: false },

  // Room Hygiene Tracking (Step 14)
  hygieneRating: { type: Number, default: 5.0 },

  // Bed & Room Safety Features (Step 5)
  lockerAvailable: { type: Boolean, default: false },
  smartLock: { type: Boolean, default: false },
  rfidAccess: { type: Boolean, default: false },
  qrAccess: { type: Boolean, default: false },
  cctvNearby: { type: Boolean, default: false },
  emergencyExit: { type: Boolean, default: false },
  femaleSafety: { type: Boolean, default: false },

  // Dynamic Pricing Features (Step 13)
  premiumPricing: { type: Number, default: 0 },
  seasonalPricing: { type: Boolean, default: false },

  // Smart Energy Features (Step 15)
  energyEfficient: { type: Boolean, default: false },

  // Operational Analytics & Monitoring
  occupancyState: { type: String, enum: ['Vacant', 'Partially Occupied', 'Fully Occupied'], default: 'Vacant' },
  operationalInsights: [{ type: String }],
  aiInsights: [{ type: String }],
  systemHeartbeat: { type: String, default: 'Stable' },
  airQualityScore: { type: Number, default: 100 },
  lastCleaned: { type: Date },
  temperature: { type: Number, default: 22.0 },
  smartMonitoringEnabled: { type: Boolean, default: true },
  realTimeEnabled: { type: Boolean, default: true }
}, { 
  timestamps: true, 
  collection: 'rooms',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

roomSchema.virtual('virtualBeds', {
  ref: 'Bed',
  localField: '_id',
  foreignField: 'room'
});

// Alias for seed_demo compatibility
roomSchema.virtual('virtualBedsAlias', {
  ref: 'Bed',
  localField: '_id',
  foreignField: 'roomId'
});

module.exports = mongoose.model('Room', roomSchema);
