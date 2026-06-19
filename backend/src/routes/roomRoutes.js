const express = require('express');
const { createRoom, getRooms, getAllRooms, bulkCreateRooms, updateRoom, deleteRoom } = require('../controllers/roomController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

// ─── Public Routes (no auth required) ───────────────────────────────────────
// GET /api/rooms/public  → Returns all rooms with basic info for Tenant/Flutter
router.get('/public', async (req, res) => {
  try {
    const Room = require('../models/Room');
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const { buildingId, floorId, limit = 50, page = 1 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = {};
    if (floorId && mongoose.Types.ObjectId.isValid(floorId)) query.floor = floorId;

    const rooms = await Room.find(query)
      .select('roomNumber roomType capacity rentAmount securityDeposit isAC washroomType images status floor')
      .skip(skip).limit(parseInt(limit)).lean();

    console.log(`[PUBLIC] /api/rooms/public - Found ${rooms.length} rooms`);
    res.status(200).json({ success: true, count: rooms.length, data: rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── Protected Routes ────────────────────────────────────────────────────────
router.use(authMiddleware);

router.post('/', createRoom);
router.post('/bulk-create', bulkCreateRooms);
router.get('/', getAllRooms);
router.get('/:floorId', getRooms);
router.patch('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;
