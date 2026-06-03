const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  locationCity: { type: String, default: 'Bengaluru' },
  description: { type: String },
  startingPrice: { type: Number },
  securityDeposit: { type: Number, default: 0 },
  maintenanceCharges: { type: Number, default: 799 },
  foodCharges: { type: Number, default: 3000 },
  rentSingle: { type: Number },
  rentDouble: { type: Number },
  rentTriple: { type: Number },
  genderType: { type: String, enum: ['Boys', 'Girls', 'Mixed'], default: 'Mixed' },
  category: { type: String, enum: ['Student', 'Professional', 'Luxury', 'Mixed'], default: 'Mixed' },
  rating: { type: Number, default: 4.5 },
  popularityLabel: { type: String },
  amenities: [{ type: String }],
  isAC: { type: Boolean, default: false },
  totalRooms: { type: Number, default: 0 },
  totalBeds: { type: Number, default: 0 },
  images: [{ type: String }],
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
  
  showInPortfolio: { type: Boolean, default: true },
  status: { type: String, enum: ['Active', 'Draft', 'Inactive'], default: 'Active' },
  lastStep: { type: Number, default: 1 },
  draftData: { type: mongoose.Schema.Types.Mixed },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  floors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Floor' }]
}, { timestamps: true, collection: 'buildings' });

// Performance indexes for common queries
buildingSchema.index({ owner: 1, status: 1 }); // getBuildings (owner portal)
buildingSchema.index({ status: 1 }); // getPublicBuildings
buildingSchema.index({ locationCity: 1 }); // city-based search

module.exports = mongoose.model('Building', buildingSchema);
