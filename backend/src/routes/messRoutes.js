const express = require('express');
const router = express.Router();
const messController = require('../controllers/messController');
const authMiddleware = require('../utils/authMiddleware');

router.get('/menu', messController.getMenu);
router.put('/menu', authMiddleware, messController.updateMenu);

module.exports = router;
