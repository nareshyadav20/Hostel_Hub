const express = require('express');
const bedController = require('../controllers/bedController');

const router = express.Router();

router.post('/', bedController.createBed);
router.post('/bulk-create', bedController.bulkCreateBeds);
router.get('/:roomId', bedController.getBeds);
router.patch('/:id', bedController.updateBed);
router.delete('/:id', bedController.deleteBed);

module.exports = router;
