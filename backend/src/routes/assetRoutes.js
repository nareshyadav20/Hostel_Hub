const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authMiddleware = require('../utils/authMiddleware');

// Protect all asset routes
router.use(authMiddleware);

router.get('/', assetController.getAssets);
router.post('/', assetController.createAsset);
router.get('/summary', assetController.getAssetSummary);

module.exports = router;
