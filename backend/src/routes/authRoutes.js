const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

const authMiddleware = require('../utils/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, async (req, res) => {
  const User = require('../models/User');
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

module.exports = router;
