const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/me', getMyBookings);
router.get('/', getAllBookings);

module.exports = router;
