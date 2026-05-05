const express = require('express');
const buildingController = require('../controllers/buildingController');

const authMiddleware = require('../utils/authMiddleware');
const router = express.Router();

router.use(authMiddleware);

router.get('/', buildingController.getBuildings);
router.get('/:id', buildingController.getBuildingById);
router.post('/', buildingController.createBuilding);
router.post('/bulk', buildingController.bulkCreateBuildings);
router.patch('/:id', buildingController.updateBuilding);
router.delete('/:id', buildingController.deleteBuilding);

module.exports = router;
