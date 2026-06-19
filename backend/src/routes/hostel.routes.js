const express = require('express');
const router = express.Router();
const { getHostels } = require('../controllers/hostel.controller');
const { validateHostelQuery } = require('../middleware/hostel.validation');

// GET /api/v1/hostels
router.get('/', validateHostelQuery, getHostels);

module.exports = router;
