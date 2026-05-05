const express = require('express');
const { createRoom, getRooms, getAllRooms, bulkCreateRooms, updateRoom, deleteRoom } = require('../controllers/roomController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createRoom);
router.post('/bulk-create', bulkCreateRooms);
router.get('/', getAllRooms);
router.get('/:floorId', getRooms);
router.patch('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;
