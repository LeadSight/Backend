const response = require('../helpers/response');
const DashboardService = require('../services/dashboardService');

const DashboardController = {
    getDashboardData: async (req, res) => {
        try {
            const dashboard = await DashboardService.getDashboardData();
            
            return response(res, 'Dashboard Data Fetched Successfully', 200, 'success', { dashboard });
        } catch (err) {
            return response(res, 'Failed to Fetch Dashboard Data', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
        }
    }
};

module.exports = DashboardController;