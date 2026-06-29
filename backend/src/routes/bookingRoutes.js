const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, updateBookingStatus, resetBedForTesting } = require('../controllers/bookingController');
const authMiddleware = require('../utils/authMiddleware');

router.post('/', authMiddleware, createBooking);
router.get('/me', authMiddleware, getMyBookings);
router.get('/', authMiddleware, getAllBookings);
router.put('/:id', authMiddleware, updateBookingStatus);

// DEV ONLY: Reset bed status
router.get('/reset-bed/:bedNumber', resetBedForTesting);

module.exports = router;
