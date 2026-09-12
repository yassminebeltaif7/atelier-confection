const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', dashboardController.getStats);
router.get('/recent-orders', dashboardController.getRecentOrders);
router.get('/upcoming-tasks', dashboardController.getUpcomingTasks);
router.get('/stock-alerts', dashboardController.getStockAlerts);

module.exports = router;