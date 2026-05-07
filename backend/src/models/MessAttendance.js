const mongoose = require('mongoose');

const messAttendanceSchema = new mongoose.Schema({
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building', required: true },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  breakfast: { type: Boolean, default: false },
  lunch: { type: Boolean, default: false },
  dinner: { type: Boolean, default: false }
}, { timestamps: true, collection: 'owner_messattendance' });

// Unique index for tenant and date
messAttendanceSchema.index({ tenantId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('MessAttendance', messAttendanceSchema);
