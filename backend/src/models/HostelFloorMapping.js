const mongoose = require('mongoose');

const hostelFloorMappingSchema = new mongoose.Schema({
  hostel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
  floor: { type: mongoose.Schema.Types.ObjectId, ref: 'Floor', required: true },
  building: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true }
}, { timestamps: true });

// Ensure unique mapping per hostel and floor
hostelFloorMappingSchema.index({ hostel: 1, floor: 1 }, { unique: true });

module.exports = mongoose.model('HostelFloorMapping', hostelFloorMappingSchema);
