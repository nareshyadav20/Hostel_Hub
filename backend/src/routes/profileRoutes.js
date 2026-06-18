const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../utils/authMiddleware');

// All /api/profile routes require a valid JWT
router.use(authMiddleware);

// GET  /api/profile  → fetch authenticated user's profile
router.get('/', profileController.getProfile);

// PUT  /api/profile  → update profile (email/mobileNumber blocked)
router.put('/', profileController.updateProfile);

// PATCH /api/profile → same as PUT (spec-compliant alias)
router.patch('/', profileController.updateProfile);

module.exports = router;
