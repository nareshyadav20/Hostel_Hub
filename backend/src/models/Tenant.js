const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  emergencyContact: { type: String, required: true },
   room: { type: String }, // Room number/name
   roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
   bedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bed' },
   buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
  rent: { type: Number },
  checkInDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['ACTIVE', 'LEFT', 'PENDING'], 
    default: 'ACTIVE' 
  },
  rentStatus: { 
    type: String, 
    enum: ['PAID', 'PENDING'], 
    default: 'PENDING' 
  },
  messPlan: { 
    type: String, 
    enum: ['basic', 'standard', 'premium'], 
    default: 'basic' 
  },
  aadhaarNumber: { type: String },
  docs: [{
    name: String,
    url: String,
    verified: { type: Boolean, default: false }
  }],

  // Food Preference Management (Step 8)
  vegNonVegPreference: { type: String, enum: ['Veg', 'Non-Veg', 'Vegan', 'Eggetarian', 'Any'], default: 'Any' },
  allergyTracking: [{ type: String }],
  favoriteMeals: [{ type: String }],
  mealFeedback: { type: String },

  // Tenant Experience Features (Step 10)
  roommateCompatibilityScore: { type: Number, default: 0 },

  // Bed Preference Matching (Step 20)
  preferences: {
    windowSide: { type: Boolean, default: false },
    lowerBunk: { type: Boolean, default: false },
    quietArea: { type: Boolean, default: false },
    nearChargingPort: { type: Boolean, default: false },
    studyFriendlyZone: { type: Boolean, default: false }
  }

}, { timestamps: true, collection: 'owner_tenants' });

module.exports = mongoose.model('Tenant', tenantSchema);
