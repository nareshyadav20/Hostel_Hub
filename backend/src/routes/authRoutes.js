const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/refresh', require('../controllers/authController').refreshToken);
router.post('/logout', require('../controllers/authController').logout);
module.exports = router;
