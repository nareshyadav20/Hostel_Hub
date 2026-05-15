const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true },
  status:    { type: String, enum: ['AVAILABLE','OCCUPIED','MAINTENANCE','RESERVED'], default: 'AVAILABLE' },
  position:  { type: String, default: 'Standard' }, // e.g. Window side, Entrance side, Middle
  bedType:   { type: String, default: 'Single' },   // e.g. Lower Bunk, Upper Bunk, Single, Queen
  images:    [{ type: String }],
  tenant:    { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
  room:      { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
  
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
  hygieneRating: { type: Number, default: 5.0 }

}, { timestamps: true, collection: 'beds' });

module.exports = mongoose.model('Bed', bedSchema);
