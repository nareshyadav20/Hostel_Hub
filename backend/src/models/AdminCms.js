const mongoose = require('mongoose');

const adminCmsSchema = new mongoose.Schema({
  pages: [
    {
      name: { type: String, required: true },
      lastEdit: { type: String, default: 'Just now' },
      status: { type: String, enum: ['Published', 'Draft'], default: 'Published' },
      headline: { type: String },
      meta: { type: String },
      bodyContent: { type: String }
    }
  ],
  banners: [
    {
      title: { type: String, required: true },
      size: { type: String, default: '1200×400' },
      active: { type: Boolean, default: true }
    }
  ],
  seoSettings: {
    headline: { type: String },
    meta: { type: String }
  }
}, { timestamps: true, collection: 'admin_cms' });

module.exports = mongoose.model('AdminCms', adminCmsSchema);
