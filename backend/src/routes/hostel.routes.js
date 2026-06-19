const express = require('express');
const router = express.Router();
const { getHostels, getHostelById } = require('../controllers/hostel.controller');
const { validateHostelQuery } = require('../middleware/hostel.validation');

// GET /api/v1/hostels
router.get('/', validateHostelQuery, getHostels);

// GET /api/v1/hostels/:id
router.get('/:id', getHostelById);

module.exports = router;
