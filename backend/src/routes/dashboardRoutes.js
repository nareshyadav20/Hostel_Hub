const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/summary', dashboardController.getSummaryKPIs);
router.get('/revenue', dashboardController.getRevenueAnalytics);
router.get('/occupancy', dashboardController.getOccupancyStats);
router.get('/alerts', dashboardController.getAlertsAndInsights);
router.get('/complaints', dashboardController.getComplaintsStats);
router.get('/mess', dashboardController.getMessStats);
router.get('/staff', dashboardController.getStaffStats);
router.get('/inventory', dashboardController.getInventoryStats);
router.get('/owners', dashboardController.getOwnerStats);
router.get('/notifications', dashboardController.getNotifications);
router.get('/activity', dashboardController.getLiveActivity);
router.get('/buildings', dashboardController.getBuildings);

module.exports = router;
