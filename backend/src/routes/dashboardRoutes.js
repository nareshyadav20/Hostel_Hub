const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../utils/authMiddleware');

router.use(authMiddleware);

router.get('/summary', dashboardController.getSummaryKPIs);
router.get('/revenue', dashboardController.getRevenueAnalytics);
router.get('/occupancy', dashboardController.getOccupancyStats);
router.get('/alerts', dashboardController.getAlertsAndInsights);
router.get('/complaints', dashboardController.getComplaintsStats);
router.get('/mess', dashboardController.getMessStats);
router.get('/staff', dashboardController.getStaffStats);
router.get('/activity', dashboardController.getLiveActivity);

module.exports = router;
