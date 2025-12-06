const { promptPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const PromtValidator = {
  validatePromptPayload: (payload) => {
    const validationResult = promptPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  }
};

module.exports = PromtValidator;