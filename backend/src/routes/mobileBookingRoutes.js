const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController');
const authMiddleware = require('../utils/authMiddleware');

router.post('/', authMiddleware, createBooking);
router.get('/', authMiddleware, getMyBookings);

module.exports = router;
