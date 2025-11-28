const CustomersModel = require('../models/customersModel');
const DashboardModel = require('../models/dashboardModel');

const DashboardService = {
  getDashboardData: async() => {
    const customers = await CustomersModel.getCustomers();
    const dashboard = await DashboardModel.getDashboardData(customers);
    return dashboard;
  }
};

module.exports = DashboardService;