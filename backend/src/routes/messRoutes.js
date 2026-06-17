const express = require('express');
const router = express.Router();
const messController = require('../controllers/messController');
const authMiddleware = require('../utils/authMiddleware');

router.use(authMiddleware);

router.get('/menu', messController.getMenu);
router.put('/menu', messController.updateMenu);

// Owner Plans routes
router.get('/plans', messController.getPlans);
router.put('/plans/:id', messController.updatePlan);

// Attendance routes
router.get('/attendance', messController.getAttendance);
router.put('/attendance', messController.updateAttendance);
router.post('/attendance/mark-all', messController.markAllAttendance);

// Rating route
router.post('/rating', messController.submitRating);

module.exports = router;
