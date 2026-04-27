const express = require('express');
const buildingController = require('../controllers/buildingController');

const router = express.Router();

router.get('/', buildingController.getBuildings);
router.post('/', buildingController.createBuilding);
router.post('/bulk', buildingController.bulkCreateBuildings);
router.patch('/:id', buildingController.updateBuilding);
router.delete('/:id', buildingController.deleteBuilding);

module.exports = router;
