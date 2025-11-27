const { Router } = require('express');
const CustomerController = require('../controllers/customerControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

/**
 * @swagger
 * /private/customers:
 *   get:
 *     summary: Get customers data
 *     description: Provided the user has a valid access token (authenticated and/or authorized), this endpoint would return the customers data from the customers table
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful retrieved the customers data
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
 *                   example: Customers Fetched Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     customers:
 *                       type: array
 *                       example:
 *                         - id: customer-gXavd7PCPF
 *                           customerId: customer-gXavd7PCPF
 *                           customerName: unnamed
 *                           hasLoan: No
 *                           hasDeposit: No
 *                           hasDefault: No
 *                           category: Not Priority
 *                           probability: "100%"
 *                           notes: []
 *                           name: unnamed
 *                           age: 35
 *                           job: student
 *                           marital: single
 *                           education: university.degree
 *                           default: unknown
 *                           balance: 0
 *                           housing: yes
 *                           loan: no
 *                           contact: telephone
 *                           day: mon
 *                           month: may
 *                           duration: 248
 *                           campaign: 1
 *                           pdays: 999
 *                           previous: 0
 *                           poutcome: nonexistent
 *                           y: No
 *                           emp_var_rate: 1.1
 *                           cons_price_idx: 93.994
 *                           cons_conf_idx: -36.4
 *                           euribor3m: 4.857
 *                           nr_employed: 5191
 *                           originalRank: 2
 *       401:
 *         description: Unauthorized — missing or invalid access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Token Unauthorized
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Failed to Fetch Customers
 */
router.get('/customers', authMiddleware, CustomerController.getCustomerInsights);

module.exports = router;