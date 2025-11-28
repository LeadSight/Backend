const response = require('../helpers/response');
const CustomersModel = require('../models/customersModel');

const CustomerController = {
    getCustomerInsights: async (req, res) => {
        try {
            const customers = await CustomersModel.getCustomerRank();

            return response(res, 'Customers Fetched Successfully', 200, 'success', { customers });
        } catch (err) {
            return response(res, 'Failed to Fetch Customers', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
        }
    }
};

module.exports = CustomerController;