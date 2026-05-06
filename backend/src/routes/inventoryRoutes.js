const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authMiddleware = require('../utils/authMiddleware');

router.use(authMiddleware);

router.get('/', inventoryController.getInventory);
router.post('/', inventoryController.addInventoryItem);
router.patch('/:id', inventoryController.updateInventoryItem);
router.delete('/:id', inventoryController.deleteInventoryItem);

module.exports = router;
