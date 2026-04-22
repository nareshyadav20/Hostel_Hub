const express = require('express');
const { createFloor, getFloors } = require('../controllers/floorController');

const router = express.Router();

router.post('/', createFloor);
router.get('/', getFloors);

module.exports = router;
