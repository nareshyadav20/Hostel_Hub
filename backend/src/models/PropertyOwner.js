const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'],
    default: 'AVAILABLE' 
  },
  images: [{ type: String }],
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' }
}, { timestamps: true });

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  roomType: { type: String },
  capacity: { type: Number, default: 1 },
  rentAmount: { type: Number, default: 0 },
  status: { type: String, default: 'AVAILABLE' },
  amenities: [{ type: String }],
  images: [{ type: String }],
  beds: [bedSchema]
}, { timestamps: true });

const floorSchema = new mongoose.Schema({
  floorNumber: { type: String, required: true },
  description: { type: String },
  images: [{ type: String }],
  rooms: [roomSchema]
}, { timestamps: true });

const buildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  description: { type: String },
  amenities: [{ type: String }],
  images: [{ type: String }],
  floors: [floorSchema]
}, { 
  timestamps: true,
  collection: 'properties' // Explicitly set the collection name as requested
});

module.exports = mongoose.model('PropertyOwner', buildingSchema);
