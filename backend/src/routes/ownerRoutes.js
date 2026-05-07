const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const authMiddleware = require('../utils/authMiddleware');

// All routes are protected
router.use(authMiddleware);

router.get('/profile', ownerController.getProfile);
router.patch('/profile', ownerController.updateProfile);
router.get('/stats', ownerController.getStats);
router.get('/history', ownerController.getHistory);
router.post('/documents', ownerController.uploadDocument);

module.exports = router;
