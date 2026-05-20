const express = require('express');
const buildingController = require('../controllers/buildingController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

// Public routes for Tenant Portal
router.get('/public/stats', buildingController.getPlatformStats);
router.get('/public', buildingController.getPublicBuildings);
router.get('/public/:id', buildingController.getPublicBuildingById);

router.use(authMiddleware);

// Protected routes for Owner Portal
router.get('/', buildingController.getBuildings);
router.get('/:id', buildingController.getBuildingById);
router.post('/', buildingController.createBuilding);
router.post('/bulk', buildingController.bulkCreateBuildings);
router.patch('/:id', buildingController.updateBuilding);
router.put('/:id', buildingController.updateBuilding);
router.delete('/:id', buildingController.deleteBuilding);

const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/upload', upload.array('photos', 10), buildingController.uploadPhotos);

module.exports = router;
