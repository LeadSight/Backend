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
 *                           name: unnamed
 *                           category: Not Priority
 *                           probability: "100%"
 *                           notes: []
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
router.get('/customers', authMiddleware, CustomerController.getCustomers);

/**
 * @swagger
 * /private/customers:
 *   post:
 *     summary: Adds a new customer
 *     description: Adds a new customer payload.
 *     tags: [Customer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - age
 *               - job
 *               - marital
 *               - education
 *               - defaultValue
 *               - balance
 *               - housing
 *               - hasLoan
 *               - contact
 *               - month
 *               - day
 *               - duration
 *               - campaign
 *               - pdays
 *               - previous
 *               - poutcome
 *             properties:
 *               customerName:
 *                 type: string
 *                 example: John Doe
 *               age:
 *                 type: number
 *                 example: 35
 *               job:
 *                 type: string
 *                 example: technician
 *               marital:
 *                 type: string
 *                 example: married
 *               education:
 *                 type: string
 *                 example: basic.4y
 *               defaultValue:
 *                 type: string
 *                 example: no
 *               balance:
 *                 type: number
 *                 example: 1500
 *               housing:
 *                 type: string
 *                 example: yes
 *               hasLoan:
 *                 type: string
 *                 example: no
 *               contact:
 *                 type: string
 *                 example: cellular
 *               month:
 *                 type: string
 *                 example: may
 *               day:
 *                 type: string
 *                 example: mon
 *               duration:
 *                 type: number
 *                 example: 320
 *               campaign:
 *                 type: number
 *                 example: 2
 *               pdays:
 *                 type: number
 *                 example: 999
 *               previous:
 *                 type: number
 *                 example: 0
 *               poutcome:
 *                 type: string
 *                 example: nonexistent
 *     responses:
 *       201:
 *         description: Customer Added Successfully
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
 *                   example: Customer Added Successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     customerId:
 *                       type: string
 *                       example: customer-uSzKki3sIYefOxLz
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.post('/customers', authMiddleware, CustomerController.addCustomer);

router.get('/customers/status', authMiddleware, CustomerController.getStatusColor); // gets status color for numeric columns

router.put('/customers/probability/:id', authMiddleware, CustomerController.updateCustomerProbability);

module.exports = router;