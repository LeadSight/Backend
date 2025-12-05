const response = require('../helpers/response');
const bcrypt = require('bcrypt');

// token manager
const TokenManager = require('../helpers/tokenManager');

const refreshTokenAge = 2 * 24 * 60 * 60 * 1000; // 2 days

// authentications
const AuthenticationsModel = require('../models/authenticationsModel');
const AuthenticationsValidator = require('../validator/authentications');

// users
const UsersModel = require('../models/usersModel');
const usersValidator = require('../validator/users');

const NotFoundError = require('../exceptions/NotFoundError');

const AuthController = {
  login: async (req, res) => {
    try {
        await AuthenticationsModel.deleteExpiredTokens();
        AuthenticationsValidator.validateLoginPayload(req.body);
        
        const { username, password } = req.body;

        const id = await UsersModel.verifyUser({ username, password });

        const accessToken = TokenManager.generateAccessToken({ id, username });

        const refreshToken = TokenManager.generateRefreshToken({id, username});

        // send refresh token as HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
          maxAge: refreshTokenAge,
        });

        AuthenticationsModel.addRefreshToken(refreshToken, refreshTokenAge);

        return response(res, 'Login successful', 201, 'success', { accessToken });
    } catch (err) {
      return response(res, 'Login failed', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
    }
  },
  refreshToken: async (req, res) => {
    try {
      await AuthenticationsModel.deleteExpiredTokens();
      AuthenticationsValidator.validateRefreshTokenPayload(req.cookies);
      
      const { refreshToken } = req.cookies;
  
      // Verify token presence in DB
      await AuthenticationsModel.verifyRefreshToken(refreshToken);
  
      // verifying JWT
      const payload = TokenManager.verifyRefreshToken(refreshToken);
  
      // issue new access token
      const accessToken = TokenManager.generateAccessToken({ id: payload.id, username: payload.username });
      return response(res, 'Access token renewed', 200, 'success', { accessToken });
  
    } catch (err) {
      // Delete from DB if JWT verification throws
      const { refreshToken } = req.cookies;
      if (refreshToken) await AuthenticationsModel.deleteRefreshToken(refreshToken);
      
      // Clear cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      });

      return response(res, 'Refresh Token Failed', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      AuthenticationsValidator.validateRefreshTokenPayload(req.cookies);
      
      const { refreshToken } = req.cookies;
  
      // Remove from DB
      await AuthenticationsModel.deleteRefreshToken(refreshToken);
  
      // Clear cookie
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      });
  
      return response(res, 'Logout successful', 200, 'success');
    } catch (err) {
      return response(res, 'Logout failed', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
    }
  },
  verifyUsername: async (req, res) => {
    try {
      const { username } = req.body;
      const result = await UsersModel.verifyUsername({ username });
      if (result) { 
        return response(res, 'Username Exists', 200, 'success', { result })
      } else {
        throw new NotFoundError('Wrong/Invalid Email');
      }
    } catch(err) {
      return response(res, 'Username not found', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      usersValidator.validateUserPayload(req.body);
      
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await UsersModel.resetPassword({ username, password: hashedPassword });
      if (result) return response(res, 'Password Reset', 200, 'success', result);    
    } catch(err) {
      return response(res, 'Password reset failed', err.statusCode ? err.statusCode : 500, 'fail', { error: err.message });
    }
  },
};

module.exports = AuthController;