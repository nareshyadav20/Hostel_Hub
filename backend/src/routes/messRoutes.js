const express = require('express');
const router = express.Router();
const messController = require('../controllers/messController');
const authMiddleware = require('../utils/authMiddleware');

router.get('/menu', messController.getMenu);
router.put('/menu', authMiddleware, messController.updateMenu);

// Owner Plans routes
router.get('/plans', messController.getPlans);
router.put('/plans/:id', authMiddleware, messController.updatePlan);

// Attendance routes
router.get('/attendance', authMiddleware, messController.getAttendance);
router.put('/attendance', authMiddleware, messController.updateAttendance);
router.post('/attendance/mark-all', authMiddleware, messController.markAllAttendance);

// Rating route
router.post('/rating', authMiddleware, messController.submitRating);

module.exports = router;
