const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings } = require('../controllers/bookingController');
const authMiddleware = require('../utils/authMiddleware');

router.post('/', authMiddleware, createBooking);
router.get('/me', authMiddleware, getMyBookings);
router.get('/', authMiddleware, getAllBookings);

module.exports = router;
