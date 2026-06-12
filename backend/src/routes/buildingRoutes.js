const express = require('express');
const buildingController = require('../controllers/buildingController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

// Public routes for Tenant Portal
router.get('/public/seed-balanced', buildingController.seedBalanced);
router.get('/public/stats', buildingController.getPlatformStats);
router.get('/public', buildingController.getPublicBuildings);
router.get('/public/:id', buildingController.getPublicBuildingById);

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(authMiddleware);

// Protected routes for Owner Portal
router.get('/', buildingController.getBuildings);
router.get('/:id', buildingController.getBuildingById);
router.post('/', upload.array('images', 10), buildingController.createBuilding);
router.post('/bulk', buildingController.bulkCreateBuildings);
router.patch('/:id', upload.array('images', 10), buildingController.updateBuilding);
router.put('/:id', upload.array('images', 10), buildingController.updateBuilding);
router.delete('/:id', buildingController.deleteBuilding);

router.post('/upload', upload.array('photos', 10), buildingController.uploadPhotos);

module.exports = router;
