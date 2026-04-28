const express = require('express');
const router = express.Router();
const laundryController = require('../controllers/laundryController');
const authMiddleware = require('../utils/authMiddleware');

router.post('/', authMiddleware, laundryController.createLaundryOrder);
router.get('/me', authMiddleware, laundryController.getMyLaundryOrders);

module.exports = router;
