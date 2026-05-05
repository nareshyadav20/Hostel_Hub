const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');
const authMiddleware = require('../utils/authMiddleware');

router.use(authMiddleware);

router.get('/', hostelController.getHostels);
router.post('/', hostelController.createHostel);
router.patch('/:id', hostelController.updateHostel);
router.delete('/:id', hostelController.deleteHostel);

module.exports = router;
