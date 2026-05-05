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
  breakfast: { type: String, required: true },
  lunch: { type: String, required: true },
  dinner: { type: String, required: true }
}, { timestamps: true, collection: 'owner_messmenus' });

// Ensure unique combination of plan and day
messMenuSchema.index({ plan: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('MessMenu', messMenuSchema);
