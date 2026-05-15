const express = require('express');
const buildingController = require('../controllers/buildingController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

// Public routes for Tenant Portal
router.get('/public', buildingController.getPublicBuildings);
router.get('/public/:id', buildingController.getPublicBuildingById);

router.use(authMiddleware);

// Protected routes for Owner Portal
router.get('/', buildingController.getBuildings);
router.get('/:id', buildingController.getBuildingById);
router.post('/', buildingController.createBuilding);
router.post('/bulk', buildingController.bulkCreateBuildings);
router.patch('/:id', buildingController.updateBuilding);
router.delete('/:id', buildingController.deleteBuilding);

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `building_${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

router.post('/upload', upload.array('photos', 10), buildingController.uploadPhotos);

module.exports = router;
