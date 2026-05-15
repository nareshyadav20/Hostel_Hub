const mongoose = require('mongoose');

const buildingPhotoSchema = new mongoose.Schema({
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  photoUrl: { type: String, required: true },
  isCover: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now }
}, { collection: 'buildingphotos' });

module.exports = mongoose.model('BuildingPhoto', buildingPhotoSchema);
