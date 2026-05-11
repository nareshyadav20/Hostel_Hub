const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name:           { type: String, required: true }, // Hostel Name
  buildingName:   { type: String },
  propertyType:   { type: String, enum: ['Hostel', 'PG', 'Co-living'], default: 'Hostel' },
  genderType:     { type: String, enum: ['Boys', 'Girls', 'Mixed', 'Co-living (Both)'], default: 'Mixed' },
  description:    { type: String },
  shortDesc:      { type: String },
  longDesc:       { type: String },
  coverImage:     { type: String },
  images:         [{ type: String }],
  
  // Address Details
  address:        { type: String, required: true }, // Full address or Line 1
  addrLine1:      { type: String },
  addrLine2:      { type: String },
  locationCity:   { type: String, default: 'Bengaluru' },
  state:          { type: String },
  pincode:        { type: String },
  landmark:       { type: String },

  // Structure
  numBuildings:   { type: Number, default: 1 },
  numFloors:      { type: Number, default: 1 },
  totalRooms:     { type: Number },
  totalBeds:      { type: Number },
  roomTypes:      [{ type: String }], // Single, Double, Triple, Dormitory

  // Pricing & Utilities
  rentPerBed:     { type: Number },
  rentPerRoom:    { type: Number },
  securityDeposit:{ type: Number },
  maintenanceCharges: { type: Number },
  electricityPolicy: { type: String, default: 'Included' },
  waterPolicy:    { type: String, default: 'Included' },

  // Base Room Configuration
  baseRoomConfig: {
    roomNumber:   { type: String },
    roomType:     { type: String },
    bedsPerRoom:  { type: Number }
  },

  // Food & Mess
  foodAvailable:  { type: String, default: 'No' },
  mealPlans:      [{ type: String }],
  foodType:       { type: String },
  messCharges:    { type: Number },

  // Amenities
  amenities:      [{ type: String }],
  
  // Smart Features
  smartConfig: {
    hasSmartAccess:       { type: Boolean, default: false },
    hasClimateControl:    { type: Boolean, default: false },
    hasAirQualityMonitor: { type: Boolean, default: false },
    hasAIHygiene:         { type: Boolean, default: false },
    hasCCTVAi:            { type: Boolean, default: false },
    targetComfortScore:   { type: Number, default: 90 }
  },

  // Policies
  policies: {
    smoking:  { type: String, default: 'Not Allowed' },
    alcohol:  { type: String, default: 'Not Allowed' },
    visitors: { type: String, default: 'Allowed till 8 PM' },
    pets:     { type: String, default: 'No' },
    visitorPolicy: { type: String }
  },

  // Staff & Management
  staffInfo: {
    name:    { type: String },
    role:    { type: String },
    contact: { type: String }
  },
  ownerDetails: {
    name:    { type: String },
    phone:   { type: String },
    email:   { type: String }
  },

  status:     { type: String, enum: ['Active', 'Draft', 'Inactive'], default: 'Active' },
  lastStep:   { type: Number, default: 1 },
  
  // Health & AI Metrics
  hygieneScore:     { type: Number, default: 98 },
  energyEfficiency: { type: Number, default: 82 },
  revenueEngine:    { type: Number, default: 1240000 }, // in ₹
  roiValue:         { type: Number, default: 12.4 }, // percentage
  systemsStatus: {
    power: { type: String, default: 'Backup' },
    water: { type: String, default: '24/7' },
    fire:  { type: String, default: 'Secure' },
    lift:  { type: String, default: 'Smart' }
  },
  smartAccessSystem: { type: String, default: 'Biometric + RFID Active' },

  draftData:  { type: mongoose.Schema.Types.Mixed },
  owner:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  floors:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Floor' }]
}, { timestamps: true, collection: 'owner_buildings' });

module.exports = mongoose.model('Building', buildingSchema);

