const response = require('../helpers/response');

const UserController = {
  getUserLogged: async (req, res) => {
    try {
      const user = req.user.username;

      return response(res, 'User retrieved successfully', 200, 'success', { user });
    } catch (err) {
      return response(res, 'failed to retrieve User', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
    }
  },
};

module.exports = UserController;