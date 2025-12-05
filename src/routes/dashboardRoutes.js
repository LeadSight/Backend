const { Router } = require('express');
const DashboardController = require('../controllers/dashboardControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /private/dashboard:
 *   get:
 *     summary: Get dashboard analytics
 *     description: Returns aggregated analytics and statistics for the dashboard.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Dashboard Data Fetched Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     dashboard:
 *                       type: object
 *                       properties:
 *                         statsData:
 *                           type: array
 *                           description: High-level summary statistics for dashboard cards
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 example: totalCustomers
 *                               title:
 *                                 type: string
 *                                 example: Total Customers
 *                               value:
 *                                 type: number
 *                                 example: 5000
 *                               trend:
 *                                 type: string
 *                                 nullable: true
 *                                 example: up
 *                               bgColor:
 *                                 type: string
 *                                 example: bg-gradient-to-br from-purple-600 to-purple-700
 *                         distData:
 *                           type: object
 *                           description: Distribution and chart analytics
 *                           properties:
 *                             customerDistribution:
 *                               type: object
 *                             campaignDistribution:
 *                               type: object
 *                             promotionTrends:
 *                               type: object
 *                             defaultDepositDistribution:
 *                               type: object
 *                             jobDepositDistribution:
 *                               type: object
 *                             topAverageBalanceByJob:
 *                               type: object
 *                             contactDuration:
 *                               type: object
 *                             contactEffectivity:
 *                               type: object
 *                             campaignContactStats:
 *                               type: object
 *                             contactDistribution:
 *                               type: object
 *       401:
 *         description: Unauthorized — missing or invalid token.
 *       500:
 *         description: Internal server error.
 */
router.get('/dashboard', authMiddleware, DashboardController.getDashboardData);

module.exports = router;