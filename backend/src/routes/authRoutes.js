const express = require('express');
const { register, login } = require('../controllers/authController');
const { forgotPassword, verifyOtp: verifyEmailOtp, resetPassword } = require('../controllers/passwordResetController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/refresh', require('../controllers/authController').refreshToken);
router.post('/logout', require('../controllers/authController').logout);

router.post('/send-otp', require('../controllers/authController').sendOtp);
router.post('/verify-otp', require('../controllers/authController').verifyOtp);

// Forgot password flow is handled by forgotPasswordRoutes.js in index.js

module.exports = router;
