const express = require('express');
const { createBed, getBeds } = require('../controllers/bedController');

const router = express.Router();

router.post('/', createBed);
router.get('/', getBeds);

module.exports = router;
