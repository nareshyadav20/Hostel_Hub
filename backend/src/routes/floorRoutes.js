const express = require('express');
const floorController = require('../controllers/floorController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

// ─── Public Routes (no auth required) ───────────────────────────────────────
// GET /api/floors/public?buildingId=xxx  → Returns floors for a building (public)
router.get('/public', async (req, res) => {
  try {
    const Floor = require('../models/Floor');
    const mongoose = require('mongoose');
    const { buildingId } = req.query;

    let query = {};
    if (buildingId && mongoose.Types.ObjectId.isValid(buildingId)) query.building = buildingId;

    const floors = await Floor.find(query)
      .select('floorNumber description totalRooms totalBeds occupancyPercentage building')
      .lean();

    console.log(`[PUBLIC] /api/floors/public - Found ${floors.length} floors`);
    res.status(200).json({ success: true, count: floors.length, data: floors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Protected Routes ────────────────────────────────────────────────────────
router.use(authMiddleware);

router.post('/', floorController.createFloor);
router.get('/', floorController.getAllFloors);
router.post('/bulk', floorController.bulkCreateFloors);
router.get('/:buildingId', floorController.getFloors);
router.patch('/:id', floorController.updateFloor);
router.delete('/:id', floorController.deleteFloor);

module.exports = router;
