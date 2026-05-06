const mongoose = require('mongoose');

const messMenuSchema = new mongoose.Schema({
  plan: { 
    type: String, 
    required: true,
    enum: ['basic', 'standard', 'premium']
  },
  day: { 
    type: String, 
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  breakfast: { type: String, required: true },
  lunch: { type: String, required: true },
  dinner: { type: String, required: true }
}, { timestamps: true, collection: 'owner_messmenus' });

// Ensure unique combination of building, plan and day
messMenuSchema.index({ buildingId: 1, plan: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('MessMenu', messMenuSchema);
