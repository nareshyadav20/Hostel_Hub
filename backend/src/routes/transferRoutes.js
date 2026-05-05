const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const authMiddleware = require('../utils/authMiddleware');

router.post('/', authMiddleware, transferController.createTransfer);
router.get('/me', authMiddleware, transferController.getMyTransfers);
router.get('/', authMiddleware, transferController.getAllTransfers); // For Owner/Admin
router.patch('/:id', authMiddleware, transferController.updateTransferStatus);

module.exports = router;
