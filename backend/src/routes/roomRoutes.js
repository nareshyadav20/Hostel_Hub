const express = require('express');
const { createRoom, getRooms } = require('../controllers/roomController');

const router = express.Router();

router.post('/', createRoom);
router.get('/', getRooms);

module.exports = router;
