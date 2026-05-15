const mongoose = require('mongoose');

const tenantPhotoSchema = new mongoose.Schema({
  tenantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Tenant',
    required: true 
  },
  photoUrl: { 
    type: String, 
    required: true 
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true, collection: 'tenant_photo' });

module.exports = mongoose.model('TenantPhoto', tenantPhotoSchema);
