const express = require('express');
const bedController = require('../controllers/bedController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', bedController.createBed);
router.get('/', bedController.getAllBeds);
router.post('/bulk', bedController.bulkCreateBeds);
router.post('/recommend', bedController.recommendBeds);
router.get('/maintenance', bedController.getMaintenanceRequired);
router.post('/:id/sanitize', bedController.markAsSanitized);
router.get('/:roomId', bedController.getBeds);
router.patch('/:id', bedController.updateBed);
router.delete('/:id', bedController.deleteBed);

module.exports = router;
