const mongoose = require('mongoose');

const roomCleaningSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  slot: { 
    type: String, 
    enum: ['Morning (10 AM - 12 PM)', 'Afternoon (2 PM - 4 PM)', 'Evening (5 PM - 7 PM)'],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true, collection: 'room_cleaning' });

module.exports = mongoose.model('RoomCleaning', roomCleaningSchema);
