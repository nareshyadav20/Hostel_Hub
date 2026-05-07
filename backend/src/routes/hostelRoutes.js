const express = require('express');
const router = express.Router();
const Hostel = require('../models/Hostel');

// GET all hostels
router.get('/', async (req, res) => {
  try {
    const hostels = await Hostel.find().populate('buildings');
    res.json(hostels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single hostel
router.get('/:id', async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id).populate('buildings');
    if (!hostel) return res.status(404).json({ message: 'Hostel not found' });
    res.json(hostel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
