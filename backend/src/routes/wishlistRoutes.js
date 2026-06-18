const express = require('express');
const router = express.Router();
const controller = require('../controllers/tenantPortalController');
const auth = require('../utils/authMiddleware');

router.post('/', auth, controller.addToWishlist);
router.get('/', auth, controller.getMyWishlist);
router.delete('/:id', auth, controller.removeFromWishlist);

module.exports = router;
