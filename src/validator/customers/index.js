const { CustomerPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const CustomersValidator = {
  validateCustomerPayload: (payload) => {
    const validationResult = CustomerPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = CustomersValidator;