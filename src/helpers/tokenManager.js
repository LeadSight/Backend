const jwt = require('jsonwebtoken');
const AuthorizationError = require('../exceptions/AuthorizationError');

function generateToken({ id, username, key, duration }) {
    return jwt.sign(
        { id, username },
        key,
        { expiresIn: duration }
      );
}

const TokenManager = {
    generateAccessToken: ({ id, username }) => {
        return generateToken({ 
            id,
            username,
            key: process.env.ACCESS_TOKEN_KEY,
            duration: process.env.ACCESS_TOKEN_AGE
        });
    },
    generateRefreshToken: ({ id, username }) => {
        return generateToken({ 
            id,
            username,
            key: process.env.REFRESH_TOKEN_KEY,
            duration: process.env.REFRESH_TOKEN_AGE
        });
    },
    verifyRefreshToken: (refreshToken) => {
        try {
            const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
            return payload;
        } catch (error) {
            console.error('JWT verification failed:', error.message);
            throw new AuthorizationError('Invalid Refresh Token');
        }
    }
}

module.exports = TokenManager;