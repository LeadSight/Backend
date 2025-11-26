const { Router } = require('express');
const CustomerController = require('../controllers/customerControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.get('/customers', authMiddleware, CustomerController.getCustomerInsights);

module.exports = router;