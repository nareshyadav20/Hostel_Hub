const express = require('express');
const router = express.Router();
const roomTransferController = require('../controllers/roomTransferController');
const authMiddleware = require('../utils/authMiddleware');

router.use(authMiddleware);

// POST   /                → Create a room transfer request (tenant)
router.post('/', roomTransferController.createTransfer);

// GET    /                → All transfers for owner's buildings
router.get('/', roomTransferController.getAllTransfers);

// GET    /me              → Current user's own transfers (tenant)
router.get('/me', roomTransferController.getMyTransfers);

// GET    /:id             → Single transfer by ID
router.get('/:id', roomTransferController.getTransferById);

// PATCH  /:id             → Update transfer status (owner: approve/reject)
router.patch('/:id', roomTransferController.updateTransferStatus);

// DELETE /:id             → Cancel a pending transfer (tenant)
router.delete('/:id', roomTransferController.cancelTransfer);

module.exports = router;
