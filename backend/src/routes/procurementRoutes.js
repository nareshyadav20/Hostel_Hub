const express = require('express');
const router = express.Router();
const procurementController = require('../controllers/procurementController');
const authMiddleware = require('../utils/authMiddleware');

router.use(authMiddleware);

router.get('/', procurementController.getProcurementData);
router.post('/requests', procurementController.addPurchaseRequest);
router.post('/orders', procurementController.addPurchaseOrder);

module.exports = router;
