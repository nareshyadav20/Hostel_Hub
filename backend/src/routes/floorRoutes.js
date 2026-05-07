const express = require('express');
const floorController = require('../controllers/floorController');
const authMiddleware = require('../utils/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', floorController.createFloor);
router.get('/', floorController.getAllFloors);
router.post('/bulk', floorController.bulkCreateFloors);
router.get('/:buildingId', floorController.getFloors);
router.patch('/:id', floorController.updateFloor);
router.delete('/:id', floorController.deleteFloor);

module.exports = router;
