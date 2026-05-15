const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Asset', 'Consumable'], default: 'Consumable' },
  category: { type: String }, // Friendly name
  categoryId: { type: String }, // e.g., 'CAT-FOOD'
  subCategoryId: { type: String }, // e.g., 'SUB-GRAIN'
  stock: { type: Number, default: 0 },
  maxStock: { type: Number, default: 0 },
  minThreshold: { type: Number, default: 0 },
  unit: { type: String, default: 'Units' },
  location: { type: String },
  status: { type: String, default: 'Available' },
  inUse: { type: Number, default: 0 },
  damaged: { type: Number, default: 0 },
  expiryDate: { type: Date },
  vendorName: { type: String },
  buyPrice: { type: Number, default: 0 },
  salePrice: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  history: [{
    action: { type: String },
    quantity: { type: Number },
    date: { type: Date, default: Date.now },
    notes: { type: String }
  }],
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true, collection: 'inventorys' });

module.exports = mongoose.model('Inventory', inventorySchema);
