const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Asset', 'Consumable'], default: 'Asset' },
  categoryId: { type: String },
  stock: { type: Number, default: 0 },
  maxStock: { type: Number, default: 0 },
  minThreshold: { type: Number, default: 0 },
  unit: { type: String, default: 'Units' },
  location: { type: String },
  status: { type: String, default: 'Available' },
  inUse: { type: Number, default: 0 },
  damaged: { type: Number, default: 0 },
  expiryDate: { type: Date },
  lowStockPrediction: { type: Number }, // Estimated days until stock depletion
  foodQualityStatus: { type: String, enum: ['Excellent', 'Good', 'Average', 'Poor'], default: 'Excellent' },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true, collection: 'owner_inventory' });

module.exports = mongoose.model('Inventory', inventorySchema);
