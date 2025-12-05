const response = require('../helpers/response');
const CustomersModel = require('../models/customersModel');
const CustomersValidator = require('../validator/customers');
const { nanoid } = require("nanoid");

const CustomerController = {
    getCustomers: async (req, res) => {
        try {
            // ----------------------------
            // Extract query params from FE
            // ----------------------------
            const {
                search = "",
                page = 1,
                pageSize = 10,
                filters: rawFilters = "{}"
            } = req.query;

            const pageNum = Math.max(1, parseInt(page));
            const limitNum = Math.max(1, parseInt(pageSize));
            const offset = (pageNum - 1) * limitNum;

            let filters = {};
            try {
                filters = JSON.parse(rawFilters);
            } catch (e) {
                filters = {};
            }

            // ----------------------------
            // Query database
            // ----------------------------
            const result = await CustomersModel.getCustomers(
                { ...filters, search },
                limitNum,
                offset
            );

            return response(res, 'Customer Loaded Successfully', 200, 'success', result);
        } catch (err) {
            return response(res, 'Failed to Load Customer', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
        }
    },
    addCustomer: async (req, res) => {
        try {
            CustomersValidator.validateCustomerPayload(req.body);
            const { customerName, age, job, marital, education, defaultValue, balance, housing, hasLoan, contact, month, day, duration, campaign, pdays, previous, poutcome, emp_var_rate, cons_price_idx, cons_conf_idx, euribor3m, nr_employed } = req.body;
            const id = `customer-${nanoid(10)}`;
            const customer = {
                id,
                customerName,
                age,
                job,
                marital,
                education,
                defaultValue,
                balance,
                housing,
                hasLoan,
                contact,
                month,
                day,
                duration,
                campaign,
                pdays,
                previous,
                poutcome
            }

            const economic_indicator = {
                emp_var_rate,
                cons_price_idx,
                cons_conf_idx,
                euribor3m,
                nr_employed
            }

            await CustomersModel.addCustomer(customer);
            await CustomersModel.addEconomicIndicator(economic_indicator);

            return response(res, 'Customer Added Successfully', 201, 'success');
        } catch (err) {
            return response(res, 'Failed to Add Customer', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
        }
    },
    getStatusColor: async (req, res) => {
        try{
            const {
                key = "",
                value = 1,
            } = req.query;

            const statusColor = await CustomersModel.getStatusColor({ key, value });

            return response(res, 'Status Color Fetched', 200, 'success', { statusColor });
        } catch (err) {
            return response(res, 'Failed to Fetch Status Color', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
        }
    },
    updateCustomerProbability: async (req, res) => {
        try {
            const { id } = req.params;
            const { probability } = req.body;            

            // Validate probability exists
            if (probability === undefined || probability === null) {
                return response(res, 'Probability is required', 400, 'fail', { error: 'Missing probability' });
            }

            // Validate float
            const numericProb = parseFloat(probability);
            if (isNaN(numericProb)) {
                return response(res, 'Probability must be a valid number', 400, 'fail', { error: 'Invalid probability format' });
            }

            // Optional: validate range
            if (numericProb < 0 || numericProb > 1) {
                return response(res, 'Probability must be between 0 and 1', 400, 'fail', { error: 'Invalid probability range' });
            }

            const updateResult = await CustomersModel.updateCustomerProbability(id, numericProb);

            return response(res, 'Probability Updated', 200, 'success', { updated: true });

        } catch (err) {
            response(res, 'Failed to Fetch Update Probability Score', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
        }
    }
};

module.exports = CustomerController;