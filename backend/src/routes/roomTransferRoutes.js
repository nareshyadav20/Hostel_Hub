const express = require('express');
const router = express.Router();
const roomTransferController = require('../controllers/roomTransferController');
const authMiddleware = require('../utils/authMiddleware');

router.use(authMiddleware);

router.post('/', roomTransferController.createTransfer);
router.get('/', roomTransferController.getAllTransfers); 
router.get('/me', roomTransferController.getMyTransfers); 
router.patch('/:id', roomTransferController.updateTransferStatus); 

module.exports = router;
