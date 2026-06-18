const express = require('express');
const router = express.Router();
const { forgotPassword, getForgotPasswordHistory } = require('../controllers/forgotPasswordController');

// POST /api/auth/forgot-password  →  reset password & log to forgot_password collection
router.post('/', forgotPassword);

// GET  /api/auth/forgot-password/history  →  view all reset records (admin/debug)
router.get('/history', getForgotPasswordHistory);

module.exports = router;
