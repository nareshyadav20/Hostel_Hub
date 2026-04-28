const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const authMiddleware = require('../utils/authMiddleware');

router.post('/', authMiddleware, complaintController.createComplaint);
router.get('/me', authMiddleware, complaintController.getMyComplaints);
router.patch('/:id', authMiddleware, complaintController.updateComplaintStatus);

module.exports = router;
