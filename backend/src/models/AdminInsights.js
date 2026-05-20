const mongoose = require('mongoose');

const adminInsightsSchema = new mongoose.Schema({
  radarData: [
    {
      subject: { type: String, required: true },
      A: { type: Number, required: true },
      fullMark: { type: Number, default: 150 }
    }
  ],
  forecastData: [
    {
      name: { type: String, required: true },
      val: { type: Number, required: true }
    }
  ],
  efficiencyTarget: { type: String, default: '94% / 100%' },
  recommendations: [
    {
      title: { type: String, required: true },
      desc: { type: String, required: true },
      color: { type: String, default: 'primary' }
    }
  ]
}, { timestamps: true, collection: 'admin_insights' });

module.exports = mongoose.model('AdminInsights', adminInsightsSchema);
