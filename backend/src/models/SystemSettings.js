const mongoose = require('mongoose');

const systemSettingsSchema = new mongoose.Schema({
  // 1. Rent & Payment Settings
  rentSettings: {
    defaultRent: {
      single: { type: Number, default: 8000 },
      double: { type: Number, default: 6000 },
      shared: { type: Number, default: 4500 }
    },
    rentCycle: { type: String, enum: ['MONTHLY', 'QUARTERLY', 'CUSTOM'], default: 'MONTHLY' },
    rentDueDate: { type: Number, default: 5 }, // 5th of the month
    gracePeriodDays: { type: Number, default: 3 }, // days
    lateFeeType: { type: String, enum: ['FIXED', 'PERCENTAGE'], default: 'FIXED' },
    lateFeeValue: { type: Number, default: 100 },
    securityDepositAmount: { type: Number, default: 5000 },
    allowedPaymentMethods: { type: [String], default: ['UPI', 'Cash'] },
    autoInvoiceGeneration: { type: Boolean, default: true },
    allowPartialPayment: { type: Boolean, default: false }
  },

  // 2. Notification Settings
  notificationSettings: {
    enableSMS: { type: Boolean, default: false },
    enableEmail: { type: Boolean, default: true },
    enableAppNotifications: { type: Boolean, default: true },
    rentReminderEnabled: { type: Boolean, default: true },
    complaintAlertEnabled: { type: Boolean, default: true },
    paymentConfirmationEnabled: { type: Boolean, default: true },
    maintenanceAlertsEnabled: { type: Boolean, default: true },
    notificationTemplates: {
      rentDue: { type: String, default: 'Dear {name}, your rent for {month} is due.' },
      paymentSuccess: { type: String, default: 'Thank you {name}, payment of {amount} received.' }
    }
  },

  // 3. Hygiene Settings
  hygieneSettings: {
    hygieneThreshold: { type: Number, default: 70 },
    cleaningFrequency: { type: String, enum: ['DAILY', 'WEEKLY', 'BI-WEEKLY'], default: 'DAILY' },
    assignedCleaningStaff: [{ type: String }],
    inspectionSchedule: { type: String, default: 'Every Monday' },
    hygieneRatingScale: { type: Number, default: 5 },
    issueReportingEnabled: { type: Boolean, default: true },
    hygieneChecklist: { type: [String], default: ['Rooms', 'Kitchen', 'Washrooms'] }
  },

  // 4. Infrastructure Settings
  roomConfig: {
    totalBuildings: { type: Number, default: 1 },
    floorsPerBuilding: { type: Number, default: 3 },
    roomsPerFloor: { type: Number, default: 10 },
    bedsPerRoom: { type: Number, default: 2 },
    roomTypes: { type: [String], default: ['Single', 'Shared', 'Dormitory'] },
    bedTypes: { type: [String], default: ['Normal', 'Bunk'] },
    autoCreateRooms: { type: Boolean, default: false }
  },

  // 5. Report Settings
  reportSettings: {
    reportTypes: { type: [String], default: ['Financial', 'Occupancy', 'Inventory'] },
    reportFrequency: { type: String, enum: ['DAILY', 'WEEKLY', 'MONTHLY'], default: 'MONTHLY' },
    exportFormats: { type: [String], default: ['PDF', 'Excel'] },
    autoReportGeneration: { type: Boolean, default: true },
    emailReportsEnabled: { type: Boolean, default: false }
  },

  // 6. General Settings
  generalSettings: {
    hostelName: { type: String, default: 'Hostel Hub' },
    ownerName: { type: String, default: 'Property Owner' },
    contactNumber: { type: String, default: '+91 98765 43210' },
    email: { type: String, default: 'admin@hostelhub.com' },
    address: { type: String, default: '123, Main Road, City' },
    timezone: { type: String, default: 'IST (UTC+5:30)' },
    currency: { type: String, default: '₹' },
    language: { type: String, default: 'English' },
    hostelLogo: { type: String, default: '' }
  },

  // 7. Role & Access Settings (New Section)
  roleAccess: {
    roles: { type: [String], default: ['Owner', 'Manager', 'Staff', 'Tenant'] },
    permissions: {
      moduleAccess: { type: [String], default: ['Inventory', 'Payments', 'Complaints'] },
      viewAccess: { type: Boolean, default: true },
      editAccess: { type: Boolean, default: false },
      deleteAccess: { type: Boolean, default: false },
      approvalRights: { type: Boolean, default: false }
    }
  },

  // Theme Settings
  themeSettings: {
    mode: { type: String, enum: ['LIGHT', 'DARK'], default: 'DARK' }
  },
  // Link to a specific building and owner
  buildingId: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true, collection: 'owner_systemsettings' });

module.exports = mongoose.model('SystemSettings', systemSettingsSchema);
