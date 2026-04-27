const express = require('express');
const floorController = require('../controllers/floorController');

const router = express.Router();

router.post('/', floorController.createFloor);
router.post('/bulk', floorController.bulkCreateFloors);
router.get('/:buildingId', floorController.getFloors);
router.patch('/:id', floorController.updateFloor);
router.delete('/:id', floorController.deleteFloor);

module.exports = router;
