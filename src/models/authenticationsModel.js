const pool = require('../helpers/db');
const AuthorizationError = require('../exceptions/AuthorizationError');

const AuthenticationsModel = {
    addRefreshToken: async(token, age) => {
        const expiresAt = new Date(Date.now() + age);

        const query = 'INSERT INTO authentications (token, expires_at) VALUES ($1, $2)';

        await pool.query(query, [token, expiresAt]);
    },
    verifyRefreshToken: async(token) => {
        const query = 'SELECT token FROM authentications WHERE token = $1';

        const result = await pool.query(query, [token]);

        if (!result.rows.length) {
            throw new AuthorizationError('Invalid Refresh Token');
        }
    },
    deleteRefreshToken: async(token) => {
        const query = 'DELETE FROM authentications WHERE token = $1';
        await pool.query(query, [token]);
    },
    deleteExpiredTokens: async() => {
        const query = `DELETE FROM authentications WHERE expires_at < NOW()`;
        await pool.query(query);
    },
};

module.exports = AuthenticationsModel;