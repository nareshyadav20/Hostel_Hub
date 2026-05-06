const express = require('express');
const router = express.Router();
const roomTransferController = require('../controllers/roomTransferController');
const authMiddleware = require('../utils/authMiddleware');

router.post('/', authMiddleware, roomTransferController.createTransfer);
router.get('/', roomTransferController.getAllTransfers); // Owner access
router.get('/me', authMiddleware, roomTransferController.getMyTransfers); // Tenant access
router.patch('/:id', authMiddleware, roomTransferController.updateTransferStatus); // Owner update

module.exports = router;
