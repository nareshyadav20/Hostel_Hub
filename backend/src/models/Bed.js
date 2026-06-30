const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true },
  status:    { type: String, enum: ['Vacant', 'Occupied', 'Reserved', 'Blocked', 'Maintenance', 'AVAILABLE', 'OCCUPIED'], default: 'AVAILABLE' },
  position:  { type: String, default: 'Standard' }, // e.g. Window side, Entrance side, Middle
  bedType:   { type: String, default: 'Single' },   // e.g. Lower Bunk, Upper Bunk, Single, Queen
  bedSize:   { type: String, default: 'Standard' },
  bedFacing: { type: String, default: 'North' },
  images:    [{ type: String }],
  tenant:    { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  room:      { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  occupantDetails: {
    tenantName: { type: String },
    joinDate: { type: Date },
    exitDate: { type: Date }
  },
  
  // Bed-level Equipment Metrics (Strict 1:1 with UI)
  mattress: { type: Boolean, default: false },
  pillow: { type: Boolean, default: false },
  locker: { type: Boolean, default: false },
  readingLamp: { type: Boolean, default: false },
  chargingPoint: { type: Boolean, default: false },

  // Smart Bed Management (Step 1)
  comfortScore: { type: Number, default: 0 },
  studyFriendly: { type: Boolean, default: false },
  quietZone: { type: Boolean, default: false },
  windowSide: { type: Boolean, default: false },
  premiumTag: { type: Boolean, default: false },
  lowerBunk: { type: Boolean, default: false },
  privacyCurtain: { type: Boolean, default: false },
  readingLight: { type: Boolean, default: false },
  chargingSocket: { type: Boolean, default: false },
  usbCharging: { type: Boolean, default: false },
  sideShelf: { type: Boolean, default: false },
  underBedStorage: { type: Boolean, default: false },
  personalLocker: { type: Boolean, default: false },
  laptopSpace: { type: Boolean, default: false },
  smartBadges: [{ type: String }], // Student Favorite, Most Booked, Premium Bed, Work Friendly

  // Bed Hygiene Tracking (Step 3)
  lastSanitized: { type: Date },
  mattressStatus: { type: String, default: 'Clean' },
  bedsheetReplaced: { type: Date },
  pestControlStatus: { type: String, default: 'Up to Date' },
  laundrySupport: { type: Boolean, default: false },
  odorFree: { type: Boolean, default: true },
  hygieneRating: { type: Number, default: 5.0 },

  // Smart Operations & Monitoring
  maintenanceStatus: { type: String, enum: ['OK', 'Pending Repair', 'Under Maintenance'], default: 'OK' },
  smartAccessEnabled: { type: Boolean, default: false },
  operationalMonitoringEnabled: { type: Boolean, default: true },
  healthStatus: { type: String, default: 'Optimal' },
  realTimeEnabled: { type: Boolean, default: true }
}, { timestamps: true, collection: 'owner_beds' });

bedSchema.index({ room: 1, status: 1 });

async function updateBuildingBedCounts(roomId) {
  if (!roomId) return;
  const room = await mongoose.model('Room').findById(roomId).populate('floor');
  if (!room || !room.floor || !room.floor.building) return;
  
  const buildingId = room.floor.building;
  
  // Recalculate occupied beds for the whole building asynchronously on write
  const occupiedCount = await mongoose.model('Floor').aggregate([
    { $match: { building: buildingId } },
    { $lookup: { from: 'rooms', localField: '_id', foreignField: 'floor', as: 'rooms' } },
    { $unwind: '$rooms' },
    { $lookup: { from: 'owner_beds', localField: 'rooms._id', foreignField: 'room', as: 'beds' } },
    { $unwind: '$beds' },
    { $match: { 'beds.status': { $in: ['OCCUPIED', 'Occupied'] } } },
    { $count: 'occupied' }
  ]);
  
  const totalOccupied = occupiedCount.length > 0 ? occupiedCount[0].occupied : 0;
  
  await mongoose.model('Building').findByIdAndUpdate(buildingId, { occupiedBeds: totalOccupied });
}

bedSchema.post('save', function(doc, next) {
  updateBuildingBedCounts(doc.room).then(() => next()).catch(err => next(err));
});

bedSchema.post('findOneAndDelete', function(doc, next) {
  if (doc) {
    updateBuildingBedCounts(doc.room).then(() => next()).catch(err => next(err));
  } else {
    next();
  }
});

bedSchema.post('findOneAndUpdate', function(doc, next) {
  if (doc) {
    updateBuildingBedCounts(doc.room).then(() => next()).catch(err => next(err));
  } else {
    next();
  }
});

module.exports = mongoose.model('Bed', bedSchema);
