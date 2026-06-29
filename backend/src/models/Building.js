const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  locationCity: { type: String, default: 'Bengaluru' },
  locality: { type: String },
  description: { type: String },
  startingPrice: { type: Number },
  securityDeposit: { type: Number, default: 0 },
  maintenanceCharges: { type: Number, default: 0 },
  foodCharges: { type: Number, default: 0 },
  rentSingle: { type: Number },
  rentDouble: { type: Number },
  rentTriple: { type: Number },
  rent4Sharing: { type: Number },
  rent5Sharing: { type: Number },
  rent6Sharing: { type: Number },
  genderType: { type: String, enum: ['Boys', 'Girls', 'Mixed'], default: 'Mixed' },
  category: { type: String, enum: ['Student', 'Professional', 'Luxury', 'Mixed'], default: 'Mixed' },
  rating: { type: Number, default: 4.5 },
  popularityLabel: { type: String },
  stayQuality: { type: String, enum: ['Standard', 'Premium', 'Luxury'], default: 'Standard' },
  buildingAge: { type: Number },
  amenities: [{ type: String }],
  warden: { type: String },
  wardenNumber: { type: String },
  // Building Facilities (Strict 1:1)
  lift: { type: Boolean, default: false },
  wifi: { type: Boolean, default: false },
  diningHall: { type: Boolean, default: false },
  commonKitchen: { type: Boolean, default: false },
  studyHall: { type: Boolean, default: false },
  laundryRoom: { type: Boolean, default: false },
  fireSafety: { type: Boolean, default: false },
  emergencyExit: { type: Boolean, default: false },

  // Property Facilities (Strict 1:1)
  security: { type: Boolean, default: false },
  cctv: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  powerBackup: { type: Boolean, default: false },
  mess: { type: Boolean, default: false },
  gym: { type: Boolean, default: false },
  library: { type: Boolean, default: false },
  laundry: { type: Boolean, default: false },
  housekeeping: { type: Boolean, default: false },
  medicalSupport: { type: Boolean, default: false },
  isAC: { type: Boolean, default: false },
  totalRooms: { type: Number, default: 0 },
  totalBeds: { type: Number, default: 0 },
  images: [{ type: String }],
  documents: [{
    name: { type: String },
    url: { type: String }
  }],
  policies: {
    smoking: { type: String, default: 'Not Allowed' },
    alcohol: { type: String, default: 'Not Allowed' },
    visitors: { type: String, default: 'Allowed till 8 PM' },
    pets: { type: String, default: 'No' }
  },
  staffInfo: {
    name: { type: String },
    role: { type: String },
    contact: { type: String }
  },
  smartConfig: {
    hasSmartAccess: { type: Boolean, default: false },
    hasClimateControl: { type: Boolean, default: false },
    hasAirQualityMonitor: { type: Boolean, default: false },
    hasAIHygiene: { type: Boolean, default: false },
    hasCCTVAi: { type: Boolean, default: false },
    targetComfortScore: { type: Number, default: 90 }
  },

  // Revenue & Operations (Step 5)
  revenueStats: {
    monthlyRevenue: { type: Number, default: 0 },
    revenueGrowth: { type: Number, default: 0 },
    roiOptimizedByAI: { type: Boolean, default: true }
  },
  
  // Health & Infrastructure
  healthScores: {
    hygieneScore: { type: Number, default: 100 },
    energyEfficiency: { type: Number, default: 100 }
  },
  infrastructure: {
    powerBackup: { type: String, default: 'Available' },
    waterSupply: { type: String, default: '24/7' },
    fireSafety: { type: String, default: 'Secure' },
    liftStatus: { type: String, default: 'Smart' }
  },
  smartAccessSystem: { type: String, default: 'Biometric + RFID Active' },
  
  // Badges & AI
  smartBadges: [{ type: String }],
  thumbIntelligence: { type: String, default: '' },
  
  status: { type: String, enum: ['Active', 'Draft', 'Inactive', 'Pending Approval', 'Rejected'], default: 'Active' },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isApproved: { type: Boolean, default: false },
  rejectionReason: { type: String },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },
  rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectedAt: { type: Date },
  lastStep: { type: Number, default: 1 },
  draftData: { type: mongoose.Schema.Types.Mixed },
  ownerName: { type: String },
  ownerPhone: { type: String },
  ownerEmail: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  floors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Floor' }]
}, { 
  timestamps: true, 
  collection: 'owner_buildings',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

buildingSchema.virtual('virtualFloors', {
  ref: 'Floor',
  localField: '_id',
  foreignField: 'building'
});

// Performance indexes for common queries
buildingSchema.index({ owner: 1, status: 1 }); // getBuildings (owner portal)
buildingSchema.index({ status: 1 }); // getPublicBuildings
buildingSchema.index({ locationCity: 1 }); // city-based search

module.exports = mongoose.model('Building', buildingSchema);
