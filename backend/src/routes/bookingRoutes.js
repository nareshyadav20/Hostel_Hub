const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');
const authMiddleware = require('../utils/authMiddleware');

router.post('/', authMiddleware, createBooking);
router.get('/me', authMiddleware, getMyBookings);
router.get('/', authMiddleware, getAllBookings);
router.put('/:id', authMiddleware, updateBookingStatus);

module.exports = router;
