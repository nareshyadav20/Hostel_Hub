const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  email: { type: String },
  phone: { type: String, required: true },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
  salary: { type: Number, default: 0 },
  performance: { type: Number, default: 4.5 },
  shift: { type: String, default: 'Full Time' },
  joinedDate: { type: Date, default: Date.now },
  documents: [{
    name: String,
    type: String,
    url: String,
    date: { type: Date, default: Date.now }
  }],
  tasks: [{
    title: String,
    status: { type: String, enum: ['PENDING', 'COMPLETED'], default: 'PENDING' },
    date: { type: Date, default: Date.now }
  }],
  attendance: {
    percentage: { type: Number, default: 100 },
    monthly: [{
      name: String, // e.g. "Week 1"
      present: Number
    }]
  },
  salaryHistory: [{
    month: String,
    amount: Number,
    status: String,
    date: { type: Date, default: Date.now }
  }],
  activityLog: [{
    action: String,
    time: { type: Date, default: Date.now }
  }]
}, { timestamps: true, collection: 'staff' });

module.exports = mongoose.model('Staff', staffSchema);
