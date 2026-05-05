const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  // 1. Rent & Payment Settings
  rentSettings: {
    defaultRent: {
      single: { type: Number, default: 8000 },
      double: { type: Number, default: 6000 },
      shared: { type: Number, default: 4500 }
    },
    securityDeposit: { type: Number, default: 5000 },
    paymentDueDate: { type: Number, default: 5 }, // 5th of the month
    gracePeriod: { type: Number, default: 3 }, // days
    lateFeeRule: {
      type: { type: String, enum: ['FIXED', 'PERCENTAGE'], default: 'FIXED' },
      value: { type: Number, default: 100 }
    }
  },

  // 2. Notification Settings
  notificationSettings: {
    enablePaymentReminders: { type: Boolean, default: true },
    enableVacancyAlerts: { type: Boolean, default: true },
    enableComplaintAlerts: { type: Boolean, default: true },
    enableHygieneAlerts: { type: Boolean, default: true }
  },

  // 3. Hygiene Settings
  hygieneSettings: {
    hygieneThreshold: { type: Number, default: 70 },
    cleaningFrequency: { type: String, enum: ['DAILY', 'WEEKLY'], default: 'DAILY' }
  },

  // 4. Room & Bed Configuration
  roomConfig: {
    roomTypes: [{ type: String, default: 'Single' }, { type: String, default: 'Shared' }, { type: String, default: 'Dormitory' }],
    defaultBedCapacity: { type: Number, default: 2 },
    autoCreateRooms: { type: Boolean, default: false }
  },

  // 5. Report Settings
  reportSettings: {
    defaultPeriod: { type: String, enum: ['MONTHLY', 'WEEKLY'], default: 'MONTHLY' },
    autoGenerateReports: { type: Boolean, default: true }
  },

  // 6. General Settings
  generalSettings: {
    hostelName: { type: String, default: 'Hostel Hub' },
    contactEmail: { type: String, default: 'admin@hostelhub.com' },
    contactPhone: { type: String, default: '+91 98765 43210' },
    currency: { type: String, default: '₹' }
  },

  // 7. Basic Theme Settings
  themeSettings: {
    mode: { type: String, enum: ['LIGHT', 'DARK'], default: 'DARK' }
  }
}, { timestamps: true, collection: 'owner_systemsettingss' });

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
