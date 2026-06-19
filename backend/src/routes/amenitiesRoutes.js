const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../utils/authMiddleware');

// ─── Public: GET /api/amenities/public ───────────────────────────────────────
// Returns distinct amenities list from the buildings collection
router.get('/public', async (req, res) => {
  try {
    const db = mongoose.connection.db;

    // Fetch amenities from buildings collection
    const buildings = await db.collection('buildings')
      .find({}, { projection: { amenities: 1 } })
      .toArray();

    const amenitySet = new Set();
    buildings.forEach(b => {
      if (Array.isArray(b.amenities)) {
        b.amenities.forEach(a => { if (a) amenitySet.add(a.trim()); });
      }
    });

    const amenities = Array.from(amenitySet).sort();
    console.log(`[PUBLIC] /api/amenities/public - Found ${amenities.length} unique amenities`);

    res.status(200).json({
      success: true,
      count: amenities.length,
      data: amenities
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Protected: GET /api/amenities ───────────────────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const buildings = await db.collection('buildings')
      .find({}, { projection: { amenities: 1, name: 1 } })
      .toArray();

    res.status(200).json({ success: true, data: buildings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
