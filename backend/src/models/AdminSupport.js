const mongoose = require('mongoose');

const adminSupportSchema = new mongoose.Schema({
  categories: [
    {
      id: { type: String, required: true },
      label: { type: String, required: true }
    }
  ],
  faqs: [
    {
      id: { type: Number, required: true },
      cat: { type: String, required: true },
      q: { type: String, required: true },
      a: { type: String, required: true }
    }
  ],
  tickets: [
    {
      id: { type: String, required: true },
      subject: { type: String, required: true },
      status: { type: String, default: 'In Progress' },
      priority: { type: String, default: 'Medium' },
      time: { type: String, default: 'Just now' }
    }
  ],
  chatLogs: [
    {
      from: { type: String, required: true },
      text: { type: String, required: true },
      time: { type: String, default: 'Just now' }
    }
  ]
}, { timestamps: true, collection: 'admin_support' });

module.exports = mongoose.model('AdminSupport', adminSupportSchema);
