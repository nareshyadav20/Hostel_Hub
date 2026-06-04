const mongoose = require('mongoose');

/**
 * TenantUpload — stores profile-completion data for Step 3 & Step 4.
 * Collection name: tenant_uploads
 */
const tenantUploadSchema = new mongoose.Schema(
  {
    // The authenticated user's ID (from JWT)
    userId: {
      type: String,
      required: true,
      index: true,
    },

    // ── Step 3: Lifestyle & Requirements ──────────────────────
    step3: {
      foodPref:     { type: String, enum: ['Veg', 'Non-Veg', 'Both', ''] },
      smoking:      { type: String, enum: ['Yes', 'No', ''] },
      schedule:     { type: String },
      roommateType: { type: String },
      amenities:    [{ type: String }],
      budgetMin:    { type: Number },
      budgetMax:    { type: Number },
      completedAt:  { type: Date },
    },

    // ── Step 4: Verification & Final Setup ────────────────────
    step4: {
      emergencyContact: { type: String },
      address: {
        line1:   { type: String },
        line2:   { type: String },
        city:    { type: String },
        state:   { type: String },
        pincode: { type: String },
      },
      // File URLs (stored after upload to server)
      profilePhotoUrl: { type: String },
      idProofUrl:      { type: String },
      agreedToTerms:   { type: Boolean, default: false },
      completedAt:     { type: Date },
    },

    // Overall profile completion percentage: 25 | 50 | 75 | 100
    profileCompletion: { type: Number, default: 50 },
  },
  {
    timestamps: true,
    collection: 'tenant_uploads',
  }
);

// One document per user (upsert on save)
tenantUploadSchema.index({ userId: 1 }, { unique: true });

module.exports =
  mongoose.models.TenantUpload ||
  mongoose.model('TenantUpload', tenantUploadSchema);
