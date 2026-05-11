const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const authMiddleware = require('../utils/authMiddleware');

router.use(authMiddleware);

router.get('/', settingsController.getSettings);
router.post('/', settingsController.updateSettings);

module.exports = router;
