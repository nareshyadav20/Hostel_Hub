const express = require('express');
const router = express.Router();
const { createPayment, getAllPayments, getMyPayments } = require('../controllers/paymentController');

const authMiddleware = require('../utils/authMiddleware');

router.post('/', authMiddleware, createPayment);
router.get('/', authMiddleware, getAllPayments);
router.get('/me', authMiddleware, getMyPayments);

module.exports = router;
