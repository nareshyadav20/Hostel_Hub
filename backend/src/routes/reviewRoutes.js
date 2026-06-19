const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../utils/authMiddleware');

// Lazy-load or define a minimal Review schema if none exists
let Review;
try {
  Review = require('../models/Review');
} catch (e) {
  const reviewSchema = new mongoose.Schema({
    tenantId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant' },
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Building' },
    rating:     { type: Number, min: 1, max: 5, required: true },
    comment:    { type: String, maxlength: 1000 },
    createdAt:  { type: Date, default: Date.now }
  }, { collection: 'reviews' });
  Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
}

// GET /api/reviews?buildingId=xxx  → Public — get reviews for a building
router.get('/', async (req, res) => {
  try {
    const { buildingId, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (buildingId && mongoose.Types.ObjectId.isValid(buildingId)) {
      query.buildingId = buildingId;
    }

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('tenantId', 'name photo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Review.countDocuments(query)
    ]);

    console.log(`[REVIEWS] GET /api/reviews - Found ${reviews.length} reviews`);
    res.status(200).json({
      success: true,
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      data: reviews
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/reviews  → Protected — submit a review
router.post('/', auth, async (req, res) => {
  try {
    const { buildingId, rating, comment } = req.body;
    if (!rating) return res.status(400).json({ success: false, message: 'Rating is required' });

    const Tenant = require('../models/Tenant');
    const tenant = await Tenant.findOne({ email: req.user.email });

    const review = await Review.create({
      tenantId: tenant ? tenant._id : undefined,
      buildingId: buildingId && mongoose.Types.ObjectId.isValid(buildingId) ? buildingId : undefined,
      rating: parseInt(rating),
      comment: comment || ''
    });

    console.log(`[REVIEWS] POST /api/reviews - Created review ${review._id}`);
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/reviews/me  → Protected — get current user's reviews
router.get('/me', auth, async (req, res) => {
  try {
    const Tenant = require('../models/Tenant');
    const tenant = await Tenant.findOne({ email: req.user.email });
    if (!tenant) return res.status(200).json({ success: true, data: [] });

    const reviews = await Review.find({ tenantId: tenant._id })
      .populate('buildingId', 'name address')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ success: true, data: reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
