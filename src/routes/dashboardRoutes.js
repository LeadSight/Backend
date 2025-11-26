const { Router } = require('express');
const DashboardController = require('../controllers/dashboardControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.get('/dashboard', authMiddleware, DashboardController.getDashboardData);

module.exports = router;