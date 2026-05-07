const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  // Common Fields
  dataType: { 
    type: String, 
    enum: ['inventory', 'vendor', 'request', 'po', 'asset', 'budget'], 
    required: true,
    default: 'inventory'
  },
  name: { type: String, required: true },
  category: { type: String },
  categoryId: { type: String },
  subCategory: { type: String },
  subCategoryId: { type: String },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String },

  // Smart Inventory Specific
  type: { type: String, enum: ['Asset', 'Consumable'], default: 'Asset' },
  stock: { type: Number, default: 0 },
  maxStock: { type: Number, default: 0 },
  minThreshold: { type: Number, default: 0 },
  unit: { type: String },
  location: { type: String },
  inUse: { type: Number, default: 0 },
  damaged: { type: Number, default: 0 },

  // Asset Management Specific
  tag: { type: String },
  code: { type: String },
  lifecycleStage: { type: String },
  lifecycleStatus: { type: String },
  conditionScore: { type: Number },
  conditionStatus: { type: String },
  assignedTo: { type: String },
  purchaseDate: { type: Date },
  purchaseCost: { type: Number },
  currentValue: { type: Number },
  depreciationRate: { type: String },
  depreciationMethod: { type: String },
  warrantyExpiry: { type: Date },
  maintenanceStatus: { type: String },
  maintenanceSchedule: { type: String },
  lastMaintenance: { type: Date },
  nextMaintenance: { type: Date },
  movementHistory: { type: Array },
  maintenanceHistory: { type: Array },

  // Purchase Management (Requests & POs)
  requestId: { type: String },
  requestedBy: { type: String },
  quantity: { type: Number },
  requiredDate: { type: Date },
  priority: { type: String },
  approvalStatus: { type: String },
  approvedBy: { type: String },
  approvalDate: { type: Date },
  poNumber: { type: String },
  vendorId: { type: String },
  vendorName: { type: String },
  items: { type: Array },
  totalAmount: { type: Number },
  orderDate: { type: Date },
  deliveryStatus: { type: String },
  expectedDelivery: { type: Date },
  deliveryDate: { type: Date },
  receivedQty: { type: Number },
  grnNumber: { type: String },

  // Vendor Specific
  contact: { type: String },
  email: { type: String },
  rating: { type: Number },
  onTimeRate: { type: String },
  suppliedCategories: { type: Array },

  // Budget Specific
  allocated: { type: Number },
  used: { type: Number }
}, { timestamps: true, collection: 'owner_inventory' });

module.exports = mongoose.model('Inventory', inventorySchema);
