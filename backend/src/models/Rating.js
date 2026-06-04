const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant', 
    required: true 
  },
  buildingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Building', 
    required: true 
  },
  mealType: { 
    type: String, 
    required: true,
    enum: ['breakfast', 'lunch', 'dinner'] 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  feedback: { 
    type: String 
  }
}, { timestamps: true, collection: 'ratings' });

module.exports = mongoose.model('Rating', ratingSchema);
