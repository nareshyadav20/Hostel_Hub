const express = require('express');
const { createBuilding, getBuildings } = require('../controllers/buildingController');

const router = express.Router();

router.post('/', createBuilding);
router.get('/', getBuildings);

module.exports = router;
