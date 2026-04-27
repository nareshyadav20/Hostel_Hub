const express = require('express');
const { createRoom, getRooms, bulkCreateRooms, updateRoom, deleteRoom } = require('../controllers/roomController');

const router = express.Router();

router.post('/', createRoom);
router.post('/bulk-create', bulkCreateRooms);
router.get('/:floorId', getRooms);
router.patch('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;
