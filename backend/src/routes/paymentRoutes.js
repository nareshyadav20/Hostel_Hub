const express = require('express');
const router = express.Router();
const { createPayment, getAllPayments, getMyPayments, sendPaymentReminders } = require('../controllers/paymentController');

const authMiddleware = require('../utils/authMiddleware');

router.post('/', authMiddleware, createPayment);
router.post('/send-reminders', authMiddleware, sendPaymentReminders);
router.get('/', authMiddleware, getAllPayments);
router.get('/me', authMiddleware, getMyPayments);

module.exports = router;
