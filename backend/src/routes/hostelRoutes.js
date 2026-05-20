const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');
const authMiddleware = require('../utils/authMiddleware');

router.use(authMiddleware);

router.get('/', hostelController.getHostels);
router.post('/', hostelController.createHostel);
router.get('/bed-stats', hostelController.getBedStats);
router.patch('/:id/sync-beds', hostelController.syncFilledBeds);
router.patch('/:id', hostelController.updateHostel);
router.delete('/:id', hostelController.deleteHostel);

module.exports = router;
