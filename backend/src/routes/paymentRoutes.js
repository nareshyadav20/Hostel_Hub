const express = require('express');
const router = express.Router();
const { createPayment, getAllPayments, getMyPayments } = require('../controllers/paymentController');

router.post('/', createPayment);
router.get('/', getAllPayments);
router.get('/me', getMyPayments);

module.exports = router;
