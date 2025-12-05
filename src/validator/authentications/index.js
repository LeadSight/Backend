const {
  LoginPayloadSchema,
  RefreshTokenPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validateLoginPayload: (payload) => {
    const validationResult = LoginPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateRefreshTokenPayload: (payload) => {
    const validationResult = RefreshTokenPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;