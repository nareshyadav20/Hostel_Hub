const mongoose = require('mongoose');

const ownerProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // 1. Personal Information
  personalInfo: {
    fullName: { type: String },
    dob: { type: Date },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    alternateContact: { type: String },
    googleMapUrl: { type: String },
    gender: { type: String },
    profilePhotoUrl: { type: String }
  },

  // 2. Business Details
  businessDetails: {
    businessName: { type: String },
    businessType: { type: String, enum: ['Individual', 'Company'], default: 'Individual' },
    experienceYears: { type: Number, default: 0 },
    gstNumber: { type: String },
    panNumber: { type: String },
    tagline: { type: String },
    website: { type: String },
    logoUrl: { type: String },
    officeAddress: { type: String }
  },

  // 3. Bank & Payment Details
  bankDetails: {
    accountHolderName: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    ifscCode: { type: String },
    upiId: { type: String },
    isVerified: { type: Boolean, default: false }
  },

  // 4. KYC & Documents
  documents: [{
    name: { type: String },
    type: { type: String, enum: ['Government ID', 'PAN Card', 'Property Proof', 'Other'] },
    url: { type: String },
    status: { type: String, enum: ['Pending', 'Verified', 'Rejected'], default: 'Pending' },
    uploadedAt: { type: Date, default: Date.now },
    rejectionReason: { type: String }
  }],

  // 5. Notification Preferences
  notificationSettings: {
    rentReminders: {
      app: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    complaintAlerts: {
      app: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true }
    },
    bookingUpdates: {
      app: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    },
    paymentAlerts: {
      app: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },

  // 6. Security
  securitySettings: {
    twoFactorEnabled: { type: Boolean, default: false },
    activeSessions: [{
      deviceId: String,
      lastActive: Date,
      location: String,
      ip: String
    }]
  },

  // 7. Advanced
  profileCompleteness: { type: Number, default: 0 },
  activityLogs: [{
    action: { type: String },
    description: { type: String },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['Security', 'Profile', 'Business', 'System'], default: 'System' }
  }]
}, { timestamps: true, collection: 'owner_ownerprofiles' });

module.exports = mongoose.model('OwnerProfile', ownerProfileSchema);
